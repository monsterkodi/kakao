--[[
     ███████  ███   ███   ███████   ███   ███████  ████████   ███████  
    ███       ███   ███  ███   ███  ███  ███       ███       ███       
    ███       █████████  ███   ███  ███  ███       ███████   ███████   
    ███       ███   ███  ███   ███  ███  ███       ███            ███  
     ███████  ███   ███   ███████   ███   ███████  ████████  ███████   

    an editor that can't edit ;)
    
    displays selections with nice rounded edges and is used almost 
    everywhere by now: 
        context menu dirtree funtree quicky browse finder searcher...
    
    takes list of items as input and extracts text to display from them    
    supports filtering of the items
--]]

editor = require "edit.editor"


local choices = class("choices", editor)
    


function choices:init(name, features) 
        features = features or (array())
        
        editor.init(self, name, features)
        
        self:setColor('bg', theme.editor.bg)
        self:setColor('hover', theme.hover)
        
        self.pointerType = 'pointer'
        self.roundedSelections = true
        self.frontRoundOffset = 0
        self.hoverIndex = -1
        self.hoverForSubmenu = false
        
        self.items = array()
        self.fuzzied = self.items
        self.filterText = ''
        return self
    end


function choices:setColor(key, color) 
        editor.setColor(self, key, color)
        
        if (key == 'bg') then 
            self:setColor('empty', self.color.bg)
            if self.gutter then 
                self.gutter:setColor('bg', self.color.bg)
            end
            
            if self.scroll then 
                return self.scroll:setColor('bg', self.color.bg)
            end
        end
    end


function choices:extract(item) 
        if self.key then 
            return item[self.key]
        else 
            return kseg.str(item)
        end
    end


function choices:clear() 
    return self:set(array())
    end


function choices:clearEmpty() 
        self.items = array()
        self.fuzzied = self.items
        return self.state:clearEmpty()
    end

--  0000000  00000000  000000000  
-- 000       000          000     
-- 0000000   0000000      000     
--      000  000          000     
-- 0000000   00000000     000     


function choices:set(items, key) 
        self.key = key
        self.items = items
        self.items = self.items or (array())
        self.fuzzied = self.items
        self.filterText = ''
        
        local lines = self.items
        -- log "CHOICES #{@name} set lines #{key} " lines
        if self.key then lines = self.items:map(function (i) return self:extract(i) end) end
        -- log "CHOICES #{@name} set lines #{key} " lines
        self.state:loadLines(lines)
        return self
    end


function choices:add(item) 
        self.items:push(item)
        return self.state:addLine(item.line, item.ext)
    end


function choices:append(items, ext, key) 
        key = key or 'line'
        
        self.items = self.items.concat(items)
        self.fuzzied = self.items -- 𝜏𝖍𝚒𝖘 𝚒𝖘 ⟒ɼ⊚∩𝚐! 𝚒𝜏ϵ⫙𝖘 𝖘𝖍⊚𝓊⟅𝒹 𝔟ϵ ɼϵϝ𝓊𝓏𝓏𝚒ϵ𝒹 𝚒∩𝖘𝜏ϵ𝕒𝒹
        return self.state:appendLines(items:map(function (i) return i[key] end), ext)
    end

-- 0000000    00000000    0000000   000   000  
-- 000   000  000   000  000   000  000 0 000  
-- 000   000  0000000    000000000  000000000  
-- 000   000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  00     00  


function choices:drawCursors() 
    
    end


function choices:drawSelections() 
        if empty(self.state.s.selections) then return end
        
        if not self.roundedSelections then 
            return editor.drawSelections(self)
        end
        
        -- fg = if @hasFocus() ➜ @color.hover.bg ➜ @color.hover.blur
        local fg = self.color.hover.bg
        
        -- if not @cells.screen.t.hasFocus
        --     fg = color.darken fg
        
        local sel = self.state.s.selections[1]
        
        if not sel then return end
        
        local li = sel[2]
        local y = ((li - self.state.s.view[2]) + 1)
        
        if (y > self.cells.rows) then return end
        
        local xs = max(sel[1], kseg.headCount(self.state.s.lines[li], ' '))
        if (xs == 1) then 
            xs = xs + (self.frontRoundOffset)
        end
        
        self.cells:set_ch_fg(xs, y, '', fg)
        
        for x in iter((xs + 1), sel[3]) do 
            self.cells:set_bg(((x - self.state.s.view[1]) + 1), y, fg)
            self.cells:adjustContrastForHighlight(((x - self.state.s.view[1]) + 1), y, fg)
        end
        
        return self.cells:set_ch_fg(((sel[3] + 2) - self.state.s.view[1]), y, '', fg)
    end


function choices:numChoices() 
    return #self.items
    end

function choices:numFiltered() 
    return #self.fuzzied
    end


function choices:currentIndex() 
    return self.state:mainCursor()[2]
    end

function choices:current(opt) 
        opt = opt or ({})
        local cc = self.fuzzied[self:currentIndex()]
        if is(cc, "string") then 
            if (opt.trim == 'front') then 
                cc = kstr.ltrim(cc)
            elseif (opt.trim ~= false) then 
                cc = kstr.trim(cc)
            end
        end
        
        return cc
    end


function choices:choiceAtRow(row) 
    return self.fuzzied[row]
    end

-- 000   000  00000000  000   000  000000000        00000000   00000000   00000000  000   000  
-- 0000  000  000        000 000      000           000   000  000   000  000       000   000  
-- 000 0 000  0000000     00000       000           00000000   0000000    0000000    000 000   
-- 000  0000  000        000 000      000           000        000   000  000          000     
-- 000   000  00000000  000   000     000           000        000   000  00000000      0      


function choices:hasNext() 
    return self:nextRow()
    end

function choices:hasPrev() 
    return self:prevRow()
    end


function choices:nextRow() 
        local y = self:currentIndex()
        while (y < self.state.s.lines:len()) do 
            y = y + 1
            if (kseg.trim(self.state.s.lines[y]):len() >= 1) then 
                return y
            end
        end
    end


function choices:prevRow() 
        local y = self:currentIndex()
        while (y > 1) do 
            y = y - 1
            if (kseg.trim(self.state.s.lines[y]):len() >= 1) then 
                return y
            end
        end
    end


function choices:pageUpRow() 
        local y = ((self:currentIndex() - self.cells.rows) + 1)
        y = max(y, 1)
        
        while ((y > 1) and empty(kseg.trim(self.state.s.lines[y]))) do 
            y = y - 1
        end
        
        if empty((kseg.trim(self.state.s.lines[y]) and (y < self.state.s.lines:len()))) then 
            y = y + 1
        end
        
        return y
    end


function choices:pageDownRow() 
        local y = ((self:currentIndex() + self.cells.rows) - 1)
        y = min(y, self.state.s.lines:len())
        
        while ((y < self.state.s.lines:len()) and empty(kseg.trim(self.state.s.lines[y]))) do 
            y = y + 1
        end
        
        if empty((kseg.trim(self.state.s.lines[y]) and (y > 1))) then 
            y = y - 1
        end
        
        return y
    end

--  0000000  00000000  000      00000000   0000000  000000000  
-- 000       000       000      000       000          000     
-- 0000000   0000000   000      0000000   000          000     
--      000  000       000      000       000          000     
-- 0000000   00000000  0000000  00000000   0000000     000     


function choices:select(row) 
        if not row then return end
        if is(not row, "number") then return end
        if ((row < 1) or (row > self.state.s.lines:len())) then return end
        
        self.state:setSelections(array(belt.rangeOfLine(self.state.s.lines, row)))
        self.state:setMainCursor(1, row)
        
        if self.focusable then self:grabFocus() end
        
        return self:emit('select', self:choiceAtRow(row))
    end


function choices:selectFirst() 
    return self:select(1)
    end


function choices:moveSelection(dir) 
        if (dir == 'pagedown') then self:selectPageDown()
        elseif (dir == 'pageup') then self:selectPageUp()
        elseif (dir == 'down') then self:selectNext()
        elseif (dir == 'up') then self:selectPrev()
        end
        
        return self
    end


function choices:selectPageUp() 
    return self:select(self:pageUpRow())
    end

function choices:selectPageDown() 
    return self:select(self:pageDownRow())
    end

function choices:selectNext() 
    return self:select(self:nextRow())
    end

function choices:selectPrev() 
        local row = self:prevRow()
        if empty(row) then 
            return self:emitAction('boundary', self:current())
        else 
            return self:select(row)
        end
    end

-- 000   000  00000000  000   0000000   000   000  000000000  
-- 000 0 000  000       000  000        000   000     000     
-- 000000000  0000000   000  000  0000  000000000     000     
-- 000   000  000       000  000   000  000   000     000     
-- 00     00  00000000  000   0000000   000   000     000     


function choices:weight(item, text) 
        local itemText = self:extract(item)
        local p = slash.parse(itemText)
        
        
        function matchOrLevenshtein(t) 
            local idx = t.indexOf(text)
            if (idx < 0) then 
                idx = (#t + kstr.levensthein(t, text))
            end
            
            return idx
        end
        
        local w = self.items.indexOf(item) -- try to keep order of original items
        w = w + ((10 * matchOrLevenshtein(p.name))) -- high focus on file name
        w = w + ((5 * matchOrLevenshtein(p.dir))) -- lesser focus on dir
        -- w += valid p.ext ? (0.1 * matchOrLevenshtein(p.ext)) : 4 # low weight for extensions
        if valid(p.ext) then 
            w = w + ((0.1 * matchOrLevenshtein(p.ext)))
        else 
            w = w + 4
        end
        
        return w
    end

-- 00000000  000  000      000000000  00000000  00000000   
-- 000       000  000         000     000       000   000  
-- 000000    000  000         000     0000000   0000000    
-- 000       000  000         000     000       000   000  
-- 000       000  0000000     000     00000000  000   000  


function choices:filter(text) 
        if empty(self.items) then return end
        
        if (text == self.filterText) then return end
        
        if empty(text) then return self:set(self.items, self.key) end
        
        self.filterText = text
        
        local fuzz = krzl({values = self.items, extract = self.extract})
        
        self.fuzzied = fuzz:filter(text)
        
        self.fuzzied:sort(function (a, b) 
    return (self:weight(a, text) < self:weight(b, text))
end)
        
        local lines = self.fuzzied.map(self.extract)
        
        if empty(lines) then 
            lines = array('')
        end
        
        return self.state:loadLines(lines)
    end

-- ███   ███   ███████   ███   ███  ████████  ████████ 
-- ███   ███  ███   ███  ███   ███  ███       ███   ███
-- █████████  ███   ███   ███ ███   ███████   ███████  
-- ███   ███  ███   ███     ███     ███       ███   ███
-- ███   ███   ███████       █      ████████  ███   ███


function choices:hoverChoiceAtIndex(index, event) 
        if (self.hoverIndex == index) then return true end
        
        self.hoverIndex = index
        self.state:setMainCursor(0, index)
        self:select(self.hoverIndex)
        post:emit('pointer', 'pointer')
        self:emitAction('hover', self:current(), event)
        return true
    end


function choices:unhover() 
        self.hoverIndex = -1
        self.state:deselect()
        post:emit('pointer', 'default')
        return true
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function choices:dragChoiceAtIndex(index, event) 
        self:hoverChoiceAtIndex(index, event)
        self:emitAction('drag', self.fuzzied[index], event)
        return {redraw = true}
    end


function choices:clickChoiceAtIndex(index, event) 
        self.hoverIndex = -1
        self:emitAction('click', self.fuzzied[index], event)
        return true
    end


function choices:doubleClickChoiceAtIndex(index, event) 
        self.hoverIndex = -1
        self:emitAction('doubleclick', self.fuzzied[index], event)
        return true
    end


function choices:onMouse(event) 
        if editor.onMouse(self, event) then return true end
        
        if (self.mapscr and self.mapscr.onMouse(event)) then return true end
        
        if self.hover then 
            local col, row = unpack(self:eventPos(event))
            
            if self.state:isValidLineIndex(row) then 
                if ((self.hoverForSubmenu and (event.type == 'move')) and (col > kseg.width(self.state.s.lines[row]))) then 
                    local dx = abs(event.delta[1])
                    local dy = abs(event.delta[2])
                    if ((dx * 2) >= dy) then return end
                end
                
                local index = ((row + self.state.s.view[2]) - 1)
                
                if (event.type == 'move') then 
                            return self:hoverChoiceAtIndex(index, event)
                elseif (event.type == 'press') then 
                        if (event.count == 2) then 
                            return self:doubleClickChoiceAtIndex(index, event)
                        else 
                            self.dragStart = array(col, row)
                            return self:clickChoiceAtIndex(index, event)
                        end
                elseif (event.type == 'drag') then 
                            if self.dragStart then 
                                return self:dragChoiceAtIndex(index, event)
                            end
                elseif (event.type == 'release') then 
                            self.dragStart = nil
                end
            end
        end
        
        return self.hover
    end

--  0000000    0000000  000000000  000   0000000   000   000  
-- 000   000  000          000     000  000   000  0000  000  
-- 000000000  000          000     000  000   000  000 0 000  
-- 000   000  000          000     000  000   000  000  0000  
-- 000   000   0000000     000     000   0000000   000   000  


function choices:emitAction(action, choice, event) 
        -- log "emitAction" action, choice, event
        return self:emit('action', action, choice, event)
    end

-- 000   000  00000000  000   000  
-- 000  000   000        000 000   
-- 0000000    0000000     00000    
-- 000  000   000          000     
-- 000   000  00000000     000     


function choices:onKey(key, event) 
        -- log "CHOICES EMIT ACTION #{@name} onKey #{key} combo #{event.combo}"
        
        if (event.combo == 'up') or (event.combo == 'down') or (event.combo == 'pageup') or (event.combo == 'pagedown') then 
                self:moveSelection(event.combo)
                return true
        elseif (event.combo == 'ctrl+alt+up') then self:moveSelection('pageup') ; return true
        elseif (event.combo == 'ctrl+alt+down') then self:moveSelection('pagedown') ; return true
        end
        
        if not self:hasFocus() then return end
        
        if (event.combo == 'esc') or (event.combo == 'left') or (event.combo == 'right') or (event.combo == 'space') or (event.combo == 'delete') or (event.combo == 'return') then self:emitAction(event.combo, self:current(), event)
        end
        
        -- not calling super here effectively disables all text-editing
        return true
    end

-- _G.choices_class = choices # hack to prevent import recursion
return choices