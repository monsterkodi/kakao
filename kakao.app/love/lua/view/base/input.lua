--[[
    ███  ███   ███  ████████   ███   ███  █████████ 
    ███  ████  ███  ███   ███  ███   ███     ███    
    ███  ███ █ ███  ████████   ███   ███     ███    
    ███  ███  ████  ███        ███   ███     ███    
    ███  ███   ███  ███         ███████      ███    

    simple text input field
    used in inputchoice to filter choices
--]]

editor = require "edit.editor"


local input = class("input", editor)
    


function input:init(name) 
        editor.init(self, name, array('brckts', 'replex', 'unype'))
        
        self:setColor('selection_line', self.color.selection)
        self:setColor('bg', theme.quicky.bg)
        self:setColor('bg_blur', theme.quicky.bg)
        self:setColor('bg_focus', theme.editor.bg)
        return self
    end

-- ████████   ███████    ███████  ███   ███   ███████
-- ███       ███   ███  ███       ███   ███  ███     
-- ██████    ███   ███  ███       ███   ███  ███████ 
-- ███       ███   ███  ███       ███   ███       ███
-- ███        ███████    ███████   ███████   ███████ 


function input:hasFocus() 
    return self.state.hasFocus
    end


function input:onMouseLeave(event) 
        self:emit('action', 'cancel')
        return editor.onMouseLeave(self, event)
    end


function input:onMouse(event) 
        if self:hidden() then return end
        
        return editor.onMouse(self, event)
    end


function input:current() 
        if (valid(self.state.s.lines) and (#self.state.s.lines > 0)) then 
            print("CURRENT " .. tostring(#self.state.s.lines) .. "")
            return self.state.s.lines[1]:arr():str()
        end
        
        return ""
    end


function input:set(text) 
        return self.state:loadLines(array(text))
    end


function input:selectAll() 
        self.state:selectLine(0)
        return self.state:moveCursors('eol')
    end

-- ███   ███  ████████  ███   ███
-- ███  ███   ███        ███ ███ 
-- ███████    ███████     █████  
-- ███  ███   ███          ███   
-- ███   ███  ████████     ███   


function input:onKey(key, event) 
        if not self:hasFocus() then return end
        
        if (event.combo == 'return') then 
                self:emit('action', 'submit', self:current())
                return true
        elseif (event.combo == 'up') or (event.combo == 'down') then 
                self:emit('action', event.combo)
                return false
        elseif (event.combo == 'right') then 
                if (self.state.mainCursor()[0] >= #self:current()) then 
                    self:emit('action', 'right')
                    return true
                end
        elseif (event.combo == 'esc') then 
                self:emit('action', 'cancel')
                return true
        end
        
        local before = self:current()
        
        local sr = editor.onKey(self, key, event)
        
        if (before ~= self:current()) then 
            self:emit('action', 'change', self:current())
            return true
        end
        
        return sr
    end

-- ███████    ████████    ███████   ███   ███
-- ███   ███  ███   ███  ███   ███  ███ █ ███
-- ███   ███  ███████    █████████  █████████
-- ███   ███  ███   ███  ███   ███  ███   ███
-- ███████    ███   ███  ███   ███  ██     ██


function input:draw() 
        if (self:hidden() or self:collapsed()) then return end
        
        local bg = (function () 
    if self:hasFocus() then 
    return self.color.bg_focus else 
    return self.color.bg_blur
             end
end)()
        self:setColor('bg', bg)
        self:setColor('empty', self.color.bg)
        
        return editor.draw(self)
    end

return input