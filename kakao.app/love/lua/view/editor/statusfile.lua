--[[
     ███████  █████████   ███████   █████████  ███   ███   ███████  ████████  ███  ███      ████████  
    ███          ███     ███   ███     ███     ███   ███  ███       ███       ███  ███      ███       
    ███████      ███     █████████     ███     ███   ███  ███████   ██████    ███  ███      ███████   
         ███     ███     ███   ███     ███     ███   ███       ███  ███       ███  ███      ███       
    ███████      ███     ███   ███     ███      ███████   ███████   ███       ███  ███████  ████████  

    used by status to display the currently edited file in the fileeditor
--]]

view = require "view.base.view"
syntax = require "util.syntax"


local statusfile = class("statusfile", view)
    


function statusfile:init(name) 
        view.init(self, name)
        
        self:setColor('bg', theme.status.bg)
        self:setColor('empty', theme.status.empty)
        self:setColor('hover', theme.hover.bg)
        
        self.pointerType = 'pointer'
        self.syntax = syntax()
        self.syntax:setExt('noon')
        
        self.rounded = array('', '')
        return self
    end

-- 0000000    00000000    0000000   000   000  
-- 000   000  000   000  000   000  000 0 000  
-- 000   000  0000000    000000000  000000000  
-- 000   000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  00     00  


function statusfile:draw() 
        if self:hidden() then return end
        
        -- view.draw @
        
        local bg = (function () 
    if self.hover then 
    return self.color.hover else 
    return self.color.bg
             end
end)()
        
        for x, ch in ipairs(self.rounded) do 
            if ((ch == '') or (ch == '')) then 
                self.cells:set(x, 1, ch, bg, self.color.empty)
            else 
                local fg = self.syntax:getColor(x, 1)
                self.cells:set(x, 1, ch, fg, bg)
                if self.hover then 
                    self.cells:adjustContrastForHighlight(x, 1, bg)
                end
            end
        end
        
        return self:render()
    end

--  0000000   0000000          000  000   000   0000000  000000000  
-- 000   000  000   000        000  000   000  000          000     
-- 000000000  000   000        000  000   000  0000000      000     
-- 000   000  000   000  000   000  000   000       000     000     
-- 000   000  0000000     0000000    0000000   0000000      000     


function statusfile:adjustText() 
        self.file = self.file or ''
        self.pars = slash.parse(self.file)
        self.syntax:clear()
        self.syntax:setLines(array('/' .. self.pars.file))
        self.rounded = ((array('') + kseg(self.pars.file)) + array(''))
        return self.rounded
    end


function statusfile:set(file) 
        if (self.file == kstr.trim(file)) then return end
        
        self.file = kstr.trim(file)
        return self:adjustText()
    end


function statusfile:show(file) 
        self:set(file)
        self.cells.rows = 1
        return self.cells.rows
    end

-- 00     00   0000000   000   000   0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 000000000  000   000  000   000  0000000   0000000   
-- 000 0 000  000   000  000   000       000  000       
-- 000   000   0000000    0000000   0000000   00000000  


function statusfile:onMouse(event) 
        view.onMouse(self, event)
        
        if (event.type == 'press') then 
                if self.hover then 
                    self:emit('action', 'click', self.file)
                    return true
                end
        end
        
        return self.hover
    end

return statusfile