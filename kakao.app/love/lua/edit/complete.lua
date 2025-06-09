--[[
 0000000   0000000   00     00  00000000   000      00000000  000000000  00000000
000       000   000  000   000  000   000  000      000          000     000     
000       000   000  000000000  00000000   000      0000000      000     0000000 
000       000   000  000 0 000  000        000      000          000     000     
 0000000   0000000   000   000  000        0000000  00000000     000     00000000
--]]

-- use ../../kxk ▪ kseg kutil post
-- use ../theme  ◆ theme 
-- use ./tool    ◆ belt
-- use           ◆ specs

choices = require "view.menu.choices"


local complete = class("complete")
    


function complete:init(editor) 
        self.editor = editor
        
        self.name = self.editor.name .. '_complete'
        
        self.choices = choices(self.editor.cells.screen, "" .. tostring(self.name) .. "_choices", array('scrllr'))
        self.choices.focusable = false
        
        self.color = {
            bg = theme.complete.bg, 
            complete = theme.selection.span, 
            scroll = theme.complete.scroll
            }
        
        self.choices:setColor('hover', {bg = theme.hover.bg, blur = theme.hover.bg})
        self.choices:setColor('bg', self.color.bg)
        if self.choices.scroll then 
            self.choices.scroll:setColor('bg', self.color.bg)
            self.choices.scroll:setColor('knob', self.color.scroll)
            self.choices.scroll:setColor('dot', self.color.scroll)
        end
        
        self.choices:on('action', self.onChoicesAction)
        
        self.visible = false
        return self
    end

--  0000000   0000000   00     00  00000000   000      00000000  000000000  00000000  
-- 000       000   000  000   000  000   000  000      000          000     000       
-- 000       000   000  000000000  00000000   000      0000000      000     0000000   
-- 000       000   000  000 0 000  000        000      000          000     000       
--  0000000   0000000   000   000  000        0000000  00000000     000     00000000  


function complete:complete() 
        if true then 
            return
        end
        
        local before = self.editor.state:chunkBeforeCursor()
        local after = self.editor.state:chunkAfterCursor()
        
        local hcw = kseg.headCountWord(after)
        local tcw = kseg.tailCountWord(before)
        
        -- log "complete.complete #{tcw} #{hcw}"
        
        if ((tcw > 1) and hcw) then return end -- don't complete if cursor is inside a word
        
        local tct = kseg.tailCountTurd(before)
        
        local turd = before
        if tct then 
            -- turd = before[before.length-1..] # start from the last punctuation character
            turd = string.sub(before, (#before - 1)) -- start from the last punctuation character
        elseif (tcw and (tcw < #before)) then 
            -- turd = before[before.length-tcw..] # start from the last word
            turd = string.sub(before, (#before - tcw)) -- start from the last word
        end
        
        return self:word(turd)
    end

-- 000   000   0000000   00000000   0000000    
-- 000 0 000  000   000  000   000  000   000  
-- 000000000  000   000  0000000    000   000  
-- 000   000  000   000  000   000  000   000  
-- 00     00   0000000   000   000  0000000    


function complete:word(turd) 
        self.turd = turd
        
        -- log "complete.word(#{@turd}"
        
        if empty(self.turd) then 
            self:hide()
            return
        end
        
        local before = self.editor.state.chunkBeforeCursor()
        
        self.words = kseg.chunks(self.editor.state.s.lines).map(function (chunk) 
    return chunk.chunk
end)
        self.words = belt.prepareWordsForCompletion(before, self.turd, self.words)
        
        if (#self.turd == 1) then 
            local inserts = specs.trigger[self.turd] -- prepend special completions, eg ~O 
            if inserts then 
                -- log 'add specs trigger' inserts
                self.words = inserts.concat(self.words)
            end
        end
        
        self.visible = valid(self.words)
        
        if empty(self.words) then return end
        
        local mc = self.editor.state.mainCursor()
        
        local head = self.words[0]
        
        local cx = (mc[0] - self.editor.state.s.view[0])
        local cy = (mc[1] - self.editor.state.s.view[1])
        
        if (#self.words <= 1) then 
            return self.choices.clear()
        else 
            local mlw = max(1, belt.widthOfLinesIncludingColorBubbles(self.words))
            
            local h = min(8, #self.words)
            local x = ((self.editor.cells.x + cx) - #self.turd)
            local y = ((self.editor.cells.y + cy) + 1)
            
            self.choices.layout(x, y, (mlw + 3), h)
            self.choices.set(self.words.map(function (w) return ' ' .. w end))
            return self.choices.selectFirst()
        end
    end

-- 000   000  000  0000000    00000000  
-- 000   000  000  000   000  000       
-- 000000000  000  000   000  0000000   
-- 000   000  000  000   000  000       
-- 000   000  000  0000000    00000000  


function complete:hide() 
        if not self.visible then return end
        self.editor.state.syntax.setSegls(self.editor.state.s.lines)
        self.visible = false
        return self.visible
    end


function complete:hidden() 
    return not self.visible
    end


function complete:onEditorLayout() 
        if self:hidden() then 
    return
           end
    end

-- ███   ███  ████████  ███   ███
-- ███  ███   ███        ███ ███ 
-- ███████    ███████     █████  
-- ███  ███   ███          ███   
-- ███   ███  ████████     ███   


function complete:handleKey(key, event) 
        if (self:hidden() or empty(self.words)) then return 'unhandled' end
        
        if (key == 'tab') or (key == 'return') then return self:apply()
        elseif (key == 'esc') then return self:hide()
        elseif (key == 'up') or (key == 'down') then 
                if (#self.words > 1) then 
                    return self:moveSelection(key)
                end
        end
        
        return 'unhandled'
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function complete:onMouse(event) 
        if self:hidden() then return end
        
        local cret = self.choices.onMouse(event)
        
        if (not(cret) and array('press', 'drag', 'release'):has(event.type)) then 
            self:hide()
            return
        end
        
        return cret
    end


function complete:onWheel(event) 
        if self:hidden() then return end
        
        return self.choices.onWheel(event)
    end

--  0000000  00000000  000      00000000   0000000  000000000  
-- 000       000       000      000       000          000     
-- 0000000   0000000   000      0000000   000          000     
--      000  000       000      000       000          000     
-- 0000000   00000000  0000000  00000000   0000000     000     


function complete:moveSelection(dir) 
        return self.choices.moveSelection(dir)
    end

--  0000000   00000000   00000000   000      000   000  
-- 000   000  000   000  000   000  000       000 000   
-- 000000000  00000000   00000000   000        00000    
-- 000   000  000        000        000         000     
-- 000   000  000        000        0000000     000     


function complete:apply() 
        local word = self:currentWord()
        
        if specs.inserts[word] then 
            self.editor.state.delete('back')
            self.editor.state.insert(word)
        else 
            -- @editor.state.insert word[@turd.length..]
            self.editor.state.insert(string.sub(word, #self.turd))
        end
        
        post:emit('focus', 'editor')
        return self:complete()
    end

--  ███████  ███   ███   ███████   ███   ███████  ████████    ███████          ███████    ███████  █████████  ███  ███   ███
-- ███       ███   ███  ███   ███  ███  ███       ███        ███              ███   ███  ███          ███     ███  ████  ███
-- ███       █████████  ███   ███  ███  ███       ███████    ███████          █████████  ███          ███          ███ █ ███
-- ███       ███   ███  ███   ███  ███  ███       ███             ███         ███   ███  ███          ███          ███  ████
--  ███████  ███   ███   ███████   ███   ███████  ████████   ███████          ███   ███   ███████     ███          ███   ███


function complete:onChoicesAction(action, choice) 
        if (action == 'click') then 
    return self:apply()
        end
    end

--  ███████  ███   ███  ████████   ████████   ████████  ███   ███  █████████      ███   ███   ███████   ████████   ███████  
-- ███       ███   ███  ███   ███  ███   ███  ███       ████  ███     ███         ███ █ ███  ███   ███  ███   ███  ███   ███
-- ███       ███   ███  ███████    ███████    ███████   ███ █ ███     ███         █████████  ███   ███  ███████    ███   ███
-- ███       ███   ███  ███   ███  ███   ███  ███       ███  ████     ███         ███   ███  ███   ███  ███   ███  ███   ███
--  ███████   ███████   ███   ███  ███   ███  ████████  ███   ███     ███         ██     ██   ███████   ███   ███  ███████  


function complete:currentWord() 
        local word = self.choices.current({trim = 'front'})
        if empty(word) then 
            word = self.words[0]
        end
        
        return word
    end


function complete:preDrawLines(lines) 
        if (self:hidden() or empty(self.words)) then return lines end
        
        local word = self:currentWord()
        lines = lines.asMutable()
        for pos in self.editor.state.s.cursors do 
            -- kutil.replace lines[pos[1]] pos[0] 0 kseg(word[@turd.length..])
            kutil.replace(lines[pos[1]], pos[0], 0, kseg(string.sub(word, #self.turd)))
        end
        
        self.editor.state.syntax.setSegls(kseg.segls(lines))
        return lines
    end

-- 0000000    00000000    0000000   000   000       0000000   0000000   00     00  00000000   000    000000000  000   000  
-- 000   000  000   000  000   000  000 0 000      000       000   000  000   000  000   000  000       000     0000  000  
-- 000   000  0000000    000000000  000000000      000       000   000  000000000  00000000   000       000     000 0 000  
-- 000   000  000   000  000   000  000   000      000       000   000  000 0 000  000        000       000     000  0000  
-- 0000000    000   000  000   000  00     00       0000000   0000000   000   000  000        0000000   000     000   000  


function complete:drawCompletion() 
        if (self:hidden() or empty(self.words)) then return end
        
        local word = self:currentWord()
        
        for pos in self.editor.state.s.cursors do 
            local cx = (pos[0] - self.editor.state.s.view[0])
            local cy = (pos[1] - self.editor.state.s.view[1])
            
            for ci = 0, (#word - #self.turd)-1 do 
                self.editor.cells.set_bg((cx + ci), cy, self.color.complete)
            end
        end
        
        return self
    end

-- 0000000    00000000    0000000   000   000       00000000    0000000   00000000   000   000  00000000   
-- 000   000  000   000  000   000  000 0 000       000   000  000   000  000   000  000   000  000   000  
-- 000   000  0000000    000000000  000000000       00000000   000   000  00000000   000   000  00000000   
-- 000   000  000   000  000   000  000   000       000        000   000  000        000   000  000        
-- 0000000    000   000  000   000  00     00       000         0000000   000         0000000   000        


function complete:drawPopup() 
        if (self:hidden() or empty(self.words)) then return end
        if (#self.words <= 1) then return end
        
        local mc = self.editor.state.mainCursor()
        
        local cx = (mc[0] - self.editor.state.s.view[0])
        local cy = (mc[1] - self.editor.state.s.view[1])
        
        local fx = ((cx - #self.turd) - 2)
        local x = ((fx + 1) + self.editor.cells.x)
        local y = ((cy + self.editor.cells.y) + 2)
        local w = (self.choices.cells.cols + 1)
        local h = self.choices.cells.rows
        
        local fy = (cy + 1)
        
        self.editor.cells.draw_rounded_border(fx, fy, ((fx + w) + 1), ((fy + h) + 1), {fg = self.color.bg})
        
        self.choices.layout(x, y, w, h)
        return self.choices.draw()
    end

return complete