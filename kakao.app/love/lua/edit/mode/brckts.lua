--[[
    ███████    ████████    ███████  ███   ███  █████████   ███████
    ███   ███  ███   ███  ███       ███  ███      ███     ███     
    ███████    ███████    ███       ███████       ███     ███████ 
    ███   ███  ███   ███  ███       ███  ███      ███          ███
    ███████    ███   ███   ███████  ███   ███     ███     ███████ 
--]]


local brckts = class("brckts")
    brckts.static.autoStart = true
    brckts.static.surround = {
        ['#'] = array('#{', '}'), -- <- this has to come, 
        ['{'] = array('{', '}'), -- <- before that (does it?), 
        ['}'] = array('{', '}'), 
        ['['] = array('[', ']'), 
        [']'] = array('[', ']'), 
        ['('] = array('(', ')'), 
        [')'] = array('(', ')'), 
        ["'"] = array("'", "'"), 
        ['"'] = array('"', '"'), 
        -- '<': ['<' '>'] # html , 
        -- '>': ['<' '>'] # html , 
        -- '*': ['*' '*'] # md   
        }


function brckts:init(state) 
        self.state = state
        self.name = 'brckts'
        return self
    end

-- ███   ███  ███   ███████   ███   ███  ███      ███   ███████   ███   ███  █████████
-- ███   ███  ███  ███        ███   ███  ███      ███  ███        ███   ███     ███   
-- █████████  ███  ███  ████  █████████  ███      ███  ███  ████  █████████     ███   
-- ███   ███  ███  ███   ███  ███   ███  ███      ███  ███   ███  ███   ███     ███   
-- ███   ███  ███   ███████   ███   ███  ███████  ███   ███████   ███   ███     ███   


function brckts:cursorsSet() 
        if #self.state.s.selections then 
            if (self.allSpans == self.state.s.highlights) then 
                self.state:setHighlights(array())
            end
            
            return
        end
        
        if #self.state.s.highlights then 
            if (not self.allSpans == self.state.s.highlights) then return end -- .asMutable() # from the previous brckts highlight
        end
        
        local spans, openClose, strings = belt.spansOfNestedPairsAtPositions(self.state.s.lines, self.state.s.cursors)
        
        if empty(spans) then 
            self.openCloseSpans = belt.openCloseSpansForPositions(self.state.s.lines, self.state.s.cursors)
            self.stringDelimiterSpans = belt.stringDelimiterSpansForPositions(self.state.s.cursors)
            spans = (self.openCloseSpans + self.stringDelimiterSpans)
        else 
            self.openCloseSpans = openClose
            self.stringDelimiterSpans = strings
        end
        
        self.state:setHighlights(spans)
        
        self.allSpans = self.state.s.highlights return -- .asMutable()
    end

--  ███████  ███   ███   ███████   ████████ 
-- ███       ███ █ ███  ███   ███  ███   ███
-- ███████   █████████  █████████  ████████ 
--      ███  ███   ███  ███   ███  ███      
-- ███████   ██     ██  ███   ███  ███      


function brckts:swapStringDelimiters() 
        self.state:begin()
        self.state:pushState()
        local cursors = self.state:allCursors()
        local selections = self.state:allSelections()
        self.state:setSelections(belt.rangesForSpans(self.stringDelimiterSpans))
        self.state:moveCursorsToEndOfSelections()
        if kstr.startsWith(self.state:textOfSelection(), '"') then 
            self.state:insert("'")
        else 
            self.state:insert('"')
        end
        
        self.state:setCursors(cursors)
        self.state:setSelections(selections)
        return self.state:ende()
    end


function brckts:conditionalSwapStringDelimiters() 
        if not self.stringDelimiterSpans then return end
        if kstr.startsWith(belt.textForSpans(self.state.s.lines, self.stringDelimiterSpans), "'") then 
            return self:swapStringDelimiters()
        end
    end

-- ███   ███  ████████  ███   ███        
-- ███  ███   ███        ███ ███         
-- ███████    ███████     █████          
-- ███  ███   ███          ███           
-- ███   ███  ████████     ███           


function brckts:handleKey(key, event) 
        if (key == "alt+cmd+'") then 
                if valid(self.stringDelimiterSpans) then 
                    self:swapStringDelimiters()
                    return
                end
        elseif (key == 'alt+cmd+b') then 
                if valid(self.stringDelimiterSpans) then 
                    self.state:setSelections(belt.rangesForSpans(self.stringDelimiterSpans))
                    self.state:moveCursorsToEndOfSelections()
                    return
                end
                
                if valid(self.openCloseSpans) then 
                    self.state:setSelections(belt.rangesForSpans(self.openCloseSpans))
                    self.state:moveCursorsToEndOfSelections()
                    return
                end
        elseif (key == 'delete') then 
                if empty(self.state.s.selections) then 
                    local pairs = util.uniq(dict.values(brckts.surround))
                    local rngs = belt.rangesOfPairsSurroundingPositions(self.state.s.lines, pairs, self.state.s.cursors)
                    if valid(rngs) then 
                        self.state:setSelections(rngs)
                        self.state:deleteSelection()
                        return
                    end
                end
        end
        
        if empty(brckts.surround[event.char]) then return 'unhandled' end
        
        if (event.char == '#') then 
            if valid(belt.positionsAndRangesOutsideStrings(self.state.s.lines, self.state.s.selections, self.state.s.cursors)) then return 'unhandled' end
            
            self:conditionalSwapStringDelimiters()
            
            self.state:begin()
            
            if valid(self.state.s.selections) then 
                self.state:surroundSelection(event.char, brckts.surround[event.char])
            else 
                self.state:insert(brckts.surround[event.char][1] .. brckts.surround[event.char][2])
                self.state:moveCursors('left')
            end
            
            self.state:ende()
            
            return
        else 
            if valid(self.state.s.selections) then 
                if valid(self.stringDelimiterSpans) then 
                    local delrngs = belt.normalizeRanges(belt.rangesForSpans(self.stringDelimiterSpans))
                    if (delrngs == self.state.s.selections) then 
                        return 'unhandled' -- don't surround selected string delimiters
                    end
                end
                
                return self.state.surroundSelection(event.char, brckts.surround[event.char])
            end
            
            local nsegl = belt.segsForPositions(self.state.s.lines, self.state.s.cursors) -- collect all graphemes at the cursors
            local nsegs = util.uniq(nsegl) -- get set of graphemes
            
            for _, seg in ipairs(nsegs) do 
                if (brckts.surround[event.char][2] == event.char) then 
                    if (seg == event.char) then 
                        self.state:moveCursors('right') -- move cursor over existing bracket   # ϝ𝓊𝜏𝓊ɼϵ ⫙ϵ 𝖍𝕒𝜏ϵ ⟅𝚒𝛋ϵ⟅𝛾 
                        return -- to not disturb manual closing       # 𝔟𝓊𝜏 𝔭ℜϵ𝖘ϵ∩𝜏 ⫙ϵ ⟅⩜𝓏𝛾 ;)
                    end
                end
                
                if not array('', undefined, ' ', '}', ']', ')'):has(seg) then 
                    return "unhandled" -- abort the insertion
                end
            end
            
            for _, pos in ipairs(self.state.s.cursors) do 
                if belt.isUnbalancedPosition(self.state.s.lines, pos, event.char) then 
                    return "unhandled"
                end
            end
            
            self.state:insert(brckts.surround[event.char][1] .. brckts.surround[event.char][2]) -- insert empty bracket pair
            self.state:moveCursors('left') -- move cursors inside pair
            return
        end
        
        return 'unhandled'
    end

return brckts