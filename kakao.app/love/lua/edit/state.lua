--[[
     ███████  █████████   ███████   █████████  ████████  
    ███          ███     ███   ███     ███     ███       
    ███████      ███     █████████     ███     ███████   
         ███     ███     ███   ███     ███     ███       
    ███████      ███     ███   ███     ███     ████████  

    handles basic text editing for the editor
    wraps text and editor state like cursors and selections 
        in an immutable to simplify undo
    delegates almost all text manipulation to pure functions
        in tool▸belt to simplify testing
--]]

-- use child_process os
-- use ../../kxk ▪ immutable kstr kseg events absMin
-- use ../util   ◆ syntax
-- use ./act     ◆ del insert select join indent multi main
-- use ./tool    ◆ belt
-- use           ◆ keys mode
syntax = require "util.syntax"


local state = class("state", events)
    


function state:init(cells, name) 
        self.cells = cells
        self.name = name .. '.state'
        
        self.allowedModes = {}
        
        -- for act in [del insert select join indent multi main]
        --     for k v in pairs act
        --         @[k] = v.bind @
        -- @handleKey = keys.bind @
        
        self.syntax = syntax(self.name .. '.syntax')
        self.hasFocus = false
        
        self:clearSingle()
        return self
    end


function state:__tostring() 
    return self.name
    end


function state:toggleMode(name) 
    if self.allowedModes[name] then 
    return mode.toggle(self, name)
                                            end
    end

function state:startMode(name) 
    if self.allowedModes[name] then 
    return mode.start(self, name)
                                           end
    end

function state:stopMode(name) 
    if self.allowedModes[name] then 
    return mode.stop(self, name)
                                          end
    end


function state:owner() 
        if kstr.endsWith(self.name, '.state') then 
            return string.sub(self.name, 1, -6)
        else 
            return self.name
        end
    end


function state:clearHistory() 
        self.h = array(self.s) -- undo states (history)
        self.r = array() return -- redo states
    end

--  0000000  00000000  000000000
-- 000       000          000
-- 0000000   0000000      000
--      000  000          000
-- 0000000   00000000     000


function state:set(item, arg) 
        -- @s = @s.set item arg
        self.s[item] = arg
        self:swapState()
        return self
    end


function state:setSelections(selections) 
    return self:set('selections', belt.mergeLineRanges(self.s.lines, selections))
    end

function state:setHighlights(highlights) 
    return self:set('highlights', belt.normalizeSpans(highlights))
    end

--  0000000  000   000  00000000    0000000   0000000   00000000    0000000
-- 000       000   000  000   000  000       000   000  000   000  000
-- 000       000   000  0000000    0000000   000   000  0000000    0000000
-- 000       000   000  000   000       000  000   000  000   000       000
--  0000000   0000000   000   000  0000000    0000000   000   000  0000000


function state:setCursors(cursors, opt) 
        opt = opt or ({})
        opt.mc = opt.mc or (self:mainCursor())
        
        local main = opt.main
        
        if is(main, array) then main = belt.indexOfPosInPositions(main, cursors) end
        if (is(main, "number") and (main < 0)) then main = ((#cursors + main) - 1) end
        
        local mainCursor = self:mainCursor()
        if main then 
            mainCursor = cursors[clamp(1, #cursors, main)]
            -- mainCursor = copy cursors[clamp 0 cursors.length-1 main]
        end
        
        cursors = belt.normalizePositions(cursors, #self.s.lines)
        -- @s = @s.set 'cursors' cursors
        self.s.cursors = cursors
        
        main = -1
        for idx, cur in ipairs(cursors) do 
            if (cur == mainCursor) then 
                main = idx
                break
            end
        end
        
        if (main < 1) then main = self.s.main end
        main = clamp(1, #self.s.cursors, main)
        
        -- @s = @s.set 'main' main
        self.s.main = main
        
        self:adjustViewForMainCursor(opt)
        
        self:swapState()
        
        mode.cursorsSet(self)
        self:emit('cursorsSet')
        return self
    end


function state:textOfSelectionOrWordAtCursor() 
        if #self.s.selections then 
            return self:textOfSelection()
        else 
            return self:wordAtCursor()
        end
    end

-- 000      000  000   000  00000000   0000000
-- 000      000  0000  000  000       000
-- 000      000  000 0 000  0000000   0000000
-- 000      000  000  0000  000            000
-- 0000000  000  000   000  00000000  0000000


function state:setLines(lines) 
        if empty(lines) then lines = array('') end
        
        return self:setSegls(kseg.segls(lines))
    end


function state:setSegls(segls) 
        self.segls = segls
        
        if empty(self.segls) then self.segls = array(array()) end
        
        self.syntax:setSegls(self.segls)
        
        self:changeLinesSegls()
        
        self.r = array()
        
        self.maxLineWidth = belt.widthOfLines(self.s.lines)
        
        return self:pushState()
    end


function state:loadLines(lines) 
        if (valid(lines) and not is(lines[1], "string")) then 
            error("" .. self.name .. ".loadLines - first line not a string?", lines)
        end
        
        return self:loadSegls(kseg.segls(lines))
    end


function state:loadSegls(segls) 
        self:clearEmpty()
        return self:setSegls(segls)
    end


function state:clearSingle() 
    return self:clearSegls(array(array()))
    end

function state:clearEmpty() 
    return self:clearSegls(array())
    end

function state:clearSegls(segls) 
        self.segls = segls
        
        -- @s = immutable {
        self.s = {
            lines = self.segls, 
            selections = array(), 
            highlights = array(), 
            cursors = array(array(1, 1)), 
            main = 1, 
            view = array(1, 1)
            }
        
        self.syntax:clear()
        
        self.h = array()
        self.r = array()
        return self.r
    end


function state:addLine(line, ext) 
        local segl = kseg(line)
        self.syntax.addSegl(segl, ext)
        self.segls = self.segls or (array())
        self.segls.push(segl)
        
        return self:changeLinesSegls()
    end


function state:appendLines(lines, ext) 
        local segls = kseg.segls(lines)
        self.syntax.appendSegls(segls, ext)
        self.segls = self.segls or (array())
        self.segls = self.segls.concat(segls)
        
        return self:changeLinesSegls()
    end

--  ███████  ███   ███   ███████   ███   ███   ███████   ████████        ███      ███  ███   ███  ████████   ███████
-- ███       ███   ███  ███   ███  ████  ███  ███        ███             ███      ███  ████  ███  ███       ███     
-- ███       █████████  █████████  ███ █ ███  ███  ████  ███████         ███      ███  ███ █ ███  ███████   ███████ 
-- ███       ███   ███  ███   ███  ███  ████  ███   ███  ███             ███      ███  ███  ████  ███            ███
--  ███████  ███   ███  ███   ███  ███   ███   ███████   ████████        ███████  ███  ███   ███  ████████  ███████ 


function state:changeLinesSegls() 
         --oldLines = @s.lines
         --         
         -- @s = @s.set 'lines' @segls
         self.s.lines = self.segls
         --         
         --if oldLines != @s.lines
         --    diff = belt.diffLines oldLines @s.lines            
         return --    @emit 'lines.changed' diff
    end


function state:linesInView() 
    return self.s.lines:slice(self.s.view[1], (self.s.view[1] + self.cells.rows))
    end


function state:clearLines() 
        self:setSegls(array(array()))
        return self:setMainCursor(0, 0)
    end


function state:isValidLineIndex(li) 
    return ((0 <= li) < #self.s.lines)
    end

function state:isInvalidLineIndex(li) 
    return not self:isValidLineIndex(li)
    end

-- 000   000  000   000  0000000     0000000
-- 000   000  0000  000  000   000  000   000
-- 000   000  000 0 000  000   000  000   000
-- 000   000  000  0000  000   000  000   000
--  0000000   000   000  0000000     0000000


function state:undo() 
        if (#self.h <= 1) then return end
        self.r.push(self.h.pop())
        self.s = self.h[-1]
        return self.syntax.setSegls(self.s.lines)
    end


function state:redo() 
        if empty(self.r) then return end
        self.h.push(self.r.pop())
        self.s = self.h[-1]
        return self.syntax.setSegls(self.s.lines)
    end


function state:begin() 
    self.beginIndex = #self.h
    return self.beginIndex
    end


function state:ende() 
        if valid(self.beginIndex) then 
            self.h.splice(self.beginIndex, ((#self.h - self.beginIndex) - 1))
            self.beginIndex = nil
            -- delete @beginIndex
        end
        
        return self
    end


function state:pushState() 
        self.h:push(self.s)
        return self
    end


function state:swapState() 
        self.h:pop()
        return self:pushState()
    end


function state:isDirty() 
    return (#self.h > 1)
    end

function state:hasRedo() 
    return (#self.r > 0)
    end


function state:gutterWidth() 
    return math.max(4, (2 + math.ceil(math.log10((#self.s.lines + 1)))))
    end

--  0000000  000   000  000000000
-- 000       000   000     000
-- 000       000   000     000
-- 000       000   000     000
--  0000000   0000000      000


function state:cut() 
        self:copy({deselect = false})
        if empty(self.s.selections) then 
            self:selectCursorLines()
        end
        
        return self:deleteSelection()
    end

--  0000000   0000000   00000000   000   000
-- 000       000   000  000   000   000 000
-- 000       000   000  00000000     00000
-- 000       000   000  000           000
--  0000000   0000000   000           000


function state:copy(opt) 
        opt = opt or ({})
        
        if (os.platform() == 'darwin') then 
                local prcs = child_process.spawn('pbcopy')
                prcs.stdin.write(self:textOfSelectionOrCursorLines())
                prcs.stdin.close()
        elseif (os.platform() == 'linux') then 
                local prcs = child_process.spawn("xsel", {"-i", "--clipboard"})
                prcs.stdin.write(self:textOfSelectionOrCursorLines())
                prcs.stdin.close()
        elseif (os.platform() == 'win32') then 
                local prcs = child_process.spawn("" .. slash.cwd() .. "/../../bin/utf8clip.exe")
                prcs.stdin.write(self:textOfSelectionOrCursorLines())
                prcs.stdin.close()
        end
        
        if (opt.deselect ~= false) then 
    return self:deselect()
                    end
    end

-- 00000000    0000000    0000000  000000000  00000000
-- 000   000  000   000  000          000     000
-- 00000000   000000000  0000000      000     0000000
-- 000        000   000       000     000     000
-- 000        000   000  0000000      000     00000000


function state:paste() 
        if (os.platform() == 'darwin') then 
                return self:insert(child_process.execSync('pbpaste').toString("utf8"))
        elseif (os.platform() == 'linux') then 
                local text = child_process.execSync('xsel -o --clipboard')
                
                print('paste\n', noon(text.toString("utf8")))
                
                return self:insert(text.toString("utf8"))
        elseif (os.platform() == 'win32') then 
                return self:insert(child_process.execSync("" .. slash.cwd() .. "/../../bin/utf8clip.exe").toString("utf8"))
        end
    end

--  0000000   0000000  00000000    0000000   000      000          000   000  000  00000000  000   000  
-- 000       000       000   000  000   000  000      000          000   000  000  000       000 0 000  
-- 0000000   000       0000000    000   000  000      000           000 000   000  0000000   000000000  
--      000  000       000   000  000   000  000      000             000     000  000       000   000  
-- 0000000    0000000  000   000   0000000   0000000  0000000          0      000  00000000  00     00  


function state:scrollView(dir, steps) 
        steps = steps or 1
        
        local sx = 1
        local sy = 1
        
        if (dir == 'left') then sx = -1
        elseif (dir == 'right') then sx = 1
        elseif (dir == 'up') then sy = -steps
        elseif (dir == 'down') then sy = steps
        end
        
        local view = self.s.view --.asMutable()
        
        view[1] = view[1] + sx
        view[2] = view[2] + sy
        
        view[2] = clamp(1, math.max(1, (#self.s.lines - self.cells.rows)), view[2])
        
        local maxOffsetX = math.max(1, ((self.maxLineWidth - self.cells.cols) + 2))
        maxOffsetX = math.max(maxOffsetX, ((self:mainCursor()[1] - self.cells.cols) + 2))
        view[1] = clamp(1, maxOffsetX, view[1])
        
        if (view == self.s.view) then return end
        
        return self:setView(view)
    end

--  0000000   0000000          000  000   000   0000000  000000000       000   000  000  00000000  000   000  
-- 000   000  000   000        000  000   000  000          000          000   000  000  000       000 0 000  
-- 000000000  000   000        000  000   000  0000000      000           000 000   000  0000000   000000000  
-- 000   000  000   000  000   000  000   000       000     000             000     000  000       000   000  
-- 000   000  0000000     0000000    0000000   0000000      000              0      000  00000000  00     00  


function state:adjustViewForMainCursor(opt) 
        opt = opt or ({})
        
        if ((self.cells.cols <= 0) or (self.cells.rows <= 0)) then return end
        
        if (opt.adjust == false) then return end
        
        local mc = self:mainCursor()
        local x = mc[1]
        local y = mc[2]
        
        local view = self.s.view --.asMutable()
        
        local topBotDelta = 7
        local topDelta = 7
        local botDelta = max(topDelta, floor((self.cells.rows / 2)))
        
        if (opt.adjust == 'topDelta') then 
            view[2] = (y - topDelta)
        elseif ((opt.adjust == 'topBotDeltaGrow') and opt.mc) then 
            local dtt = (y - view[2])
            local dtb = (y - (view[2] + self.cells.rows))
            if (dtt < 0) then 
                view[2] = (y - topDelta)
            elseif (dtb > 0) then 
                view[2] = (y - (self.cells.rows - botDelta))
            else 
                local dir = (y - opt.mc[2])
                if (((dtt < topDelta) and (dir < 0)) or ((-dtb < botDelta) and (dir > 0))) then 
                    view[2] = view[2] + dir
                end
            end
        else 
            if (opt.adjust ~= 'topBotDelta') then 
                topBotDelta = 0
            end
            
            if (y >= (((view[2] + self.cells.rows) - 1) - topBotDelta)) then 
                view[2] = (((y - self.cells.rows) + 1) + topBotDelta)
            elseif (y < (view[2] + topBotDelta)) then 
                view[2] = (y - topBotDelta)
            end
        end
        
        if ((view[2] > 1) and (#self.s.lines <= self.cells.rows)) then 
            view[2] = 1
        end
        
        if not self.skipAdjustViewForMainCursor then 
            view[1] = math.max(1, ((x - self.cells.cols) + 2)) -- adding one for wide graphemes
        end
        
        if (view == self.s.view) then return end
        
        return self:setView(view)
    end


function state:initView() 
        -- view = @s.view.asMutable()
        local view = self.s.view
        
        view[2] = clamp(1, math.max(1, (#self.s.lines - self.cells.rows)), view[2])
        view[1] = math.max(1, (view[1] or 1))
        
        return self:setView(view)
    end


function state:setView(view) 
        if (self.s.view == view) then return end
        self:set('view', view)
        self:emit('view.changed', self.s.view)
        return self
    end


function state:rangeForVisibleLines() 
        return array(self.s.view[1], self.s.view[2], ((self.s.view[1] + self.cells.cols) - 1), ((self.s.view[2] + self.cells.rows) - 1))
    end


function state:setMain(m) 
        local mc = self:mainCursor()
        -- @s = @s.set 'main' clamp(1 @s.cursors.length m)
        self.s.main = clamp(1, #self.s.cursors, m)
        return self:adjustViewForMainCursor({adjust = 'topBotDeltaGrow', mc = mc})
    end


function state:mainCursor() 
        --.asMutable()        
        return self.s.cursors[self.s.main]
    end

--  ███████  ████████  █████████
-- ███       ███          ███   
-- ███████   ███████      ███   
--      ███  ███          ███   
-- ███████   ████████     ███   


function state:setMainCursor(x, y) 
        local x, y = belt.pos(x, y)
        y = clamp(1, #self.s.lines, y)
        x = max(1, x)
        return self:setCursors(array(array(x, y)))
    end

-- ██     ██   ███████   ███   ███  ████████
-- ███   ███  ███   ███  ███   ███  ███     
-- █████████  ███   ███   ███ ███   ███████ 
-- ███ █ ███  ███   ███     ███     ███     
-- ███   ███   ███████       █      ████████


function state:moveMainCursorInDirection(dir, opt) 
        opt = opt or ({})
        
        local mc = belt.positionInDirection(self:mainCursor(), dir)
        
        if opt.keep then 
            return self:addCursor(mc)
        else 
            return self:moveMainCursor(mc)
        end
    end


function state:moveMainCursor(x, y) 
        local x, y = belt.pos(x, y)
        
        y = clamp(1, #self.s.lines, y)
        x = max(1, x)
        
        local mainCursor = self:mainCursor()
        
        if (mainCursor == array(x, y)) then return end
        
        local cursors = self:allCursors()
        
        cursors:splice(belt.indexOfPosInPositions(mainCursor, cursors), 1)
        
        local main = belt.indexOfPosInPositions(array(x, y), cursors)
        if (main < 1) then 
            cursors:push(array(x, y))
            main = #cursors
        end
        
        return self:setCursors(cursors, {main = main})
    end

-- ████████   ███████    ███    
-- ███       ███   ███   ███    
-- ███████   ███   ███   ███    
-- ███       ███   ███   ███    
-- ████████   ███████    ███████


function state:singleCursorAtEndOfLine() 
        local rng = belt.lineRangeAtPos(self.s.lines, self:mainCursor())
        local mc = belt.endOfRange(rng)
        
        self:deselect()
        return self:setCursors(array(mc))
    end

-- ███  ███   ███  ███████            ███████     ███████   ███      
-- ███  ████  ███  ███   ███          ███   ███  ███   ███  ███      
-- ███  ███ █ ███  ███   ███          ███████    ███   ███  ███      
-- ███  ███  ████  ███   ███          ███   ███  ███   ███  ███      
-- ███  ███   ███  ███████    ██████  ███████     ███████   ███████  


function state:singleCursorAtIndentOrStartOfLine() 
        local lines = self.s.lines
        local mc = self:mainCursor()
        
        local rng = belt.lineRangeAtPos(lines, mc)
        local ind = belt.lineIndentAtPos(lines, mc)
        
        if (ind < mc[1]) then 
            mc[1] = ind
        else 
            mc = belt.startOfRange(rng)
        end
        
        self:deselect()
        return self:setCursors(array(mc))
    end

-- ████████    ███████    ███████   ████████
-- ███   ███  ███   ███  ███        ███     
-- ████████   █████████  ███  ████  ███████ 
-- ███        ███   ███  ███   ███  ███     
-- ███        ███   ███   ███████   ████████


function state:singleCursorPage(dir) 
        local mc = self:mainCursor()
        
        if (dir == 'up') then mc[2] = mc[2] - (self.cells.rows)
        elseif (dir == 'down') then mc[2] = mc[2] + (self.cells.rows)
        end
        
        self:deselect()
        return self:setCursors(array(mc))
    end


function state:wordAtCursor() 
    return belt.wordAtPos(self.s.lines, self:mainCursor())
    end

function state:chunkBeforeCursor() 
    return belt.chunkBeforePos(self.s.lines, self:mainCursor())
    end

function state:chunkAfterCursor() 
    return belt.chunkAfterPos(self.s.lines, self:mainCursor())
    end

--  0000000  00000000  000      00000000   0000000  000000000  
-- 000       000       000      000       000          000     
-- 0000000   0000000   000      0000000   000          000     
--      000  000       000      000       000          000     
-- 0000000   00000000  0000000  00000000   0000000     000     


function state:setMainCursorAndSelect(x, y) 
        self:setSelections(belt.extendLineRangesFromPositionToPosition, self.s.lines, self:allSelections(), self:mainCursor(), array(x, y))
        return self:setCursors(array(array(x, y)), {adjust = 'topBotDelta'})
    end

return state