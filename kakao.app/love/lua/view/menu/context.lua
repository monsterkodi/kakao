--[[
     ███████   ███████   ███   ███  █████████  ████████  ███   ███  █████████  
    ███       ███   ███  ████  ███     ███     ███        ███ ███      ███     
    ███       ███   ███  ███ █ ███     ███     ███████     █████       ███     
    ███       ███   ███  ███  ████     ███     ███        ███ ███      ███     
     ███████   ███████   ███   ███     ███     ████████  ███   ███     ███     

    quick and dirty context menu for the fileeditor
--]]

inputchoice = require "view.menu.inputchoice"


local context = class("context", inputchoice)
    


function context:init() 
        inputchoice.init(self, 'context')
        
        self:setColor('bg', theme.context.bg)
        _G.contextMenu = self
        return self
    end

--  ███████   ████████   ████████    ███████   ███   ███   ███████   ████████
-- ███   ███  ███   ███  ███   ███  ███   ███  ████  ███  ███        ███     
-- █████████  ███████    ███████    █████████  ███ █ ███  ███  ████  ███████ 
-- ███   ███  ███   ███  ███   ███  ███   ███  ███  ████  ███   ███  ███     
-- ███   ███  ███   ███  ███   ███  ███   ███  ███   ███   ███████   ████████


function context:arrange() 
        local w = ((self.width + 2) + 1) -- 2 for frame, 1 for right 
        local c = self.choices:numChoices()
        local ih = (function () 
    if self:inputIsActive() then 
    return 2 else 
    return 0
             end
end)()
        local iz = max(0, (ih - 1))
        local h = ((c + 2) + ih)
        local x = self.pos[1]
        local y = self.pos[2]
        print("nummChoices", c, x, y, w, h, ih, iz)
        
        self.input:layout((x + 2), (y + 1), (w - 4), iz)
        self.choices:layout((x + 1), ((y + 1) + ih), (w - 2), c)
        return self.cells:layout(x, y, w, h)
    end

--  0000000  000   000   0000000   000   000
-- 000       000   000  000   000  000 0 000
-- 0000000   000000000  000   000  000000000
--      000  000   000  000   000  000   000
-- 0000000   000   000   0000000   00     00


function context.static.show(pos, cb, items) 
        if _G.contextMenu then 
            return _G.contextMenu:show(pos, cb, items)
        else 
            return print("DAFURGL?")
        end
    end


function context:show(pos, cb, items) 
        self.pos = pos
        self.cb = cb
        self.items = items
        
        -- @pos[1] -= 1
        
        items = self.items:map(function (i) 
    return ' ' .. i
end) -- padding for  
        
        self.width = belt.widthOfLines(items)
        
        self.input:set('')
        self.input:hide()
        self.choices:set(items)
        self.choices:select(1)
        self.choices.state:setView(array(1, 1))
        
        return inputchoice.show(self)
    end

--  0000000   00000000   00000000   000      000   000  
-- 000   000  000   000  000   000  000       000 000   
-- 000000000  00000000   00000000   000        00000    
-- 000   000  000        000        000         000     
-- 000   000  000        000        0000000     000     


function context:applyChoice(choice) 
        -- log 'context applyChoice' choice
        self.cb(choice)
        return self:hide()
    end


function context:onWheel() 
    
    end

-- 0000000    00000000    0000000   000   000
-- 000   000  000   000  000   000  000 0 000
-- 000   000  0000000    000000000  000000000
-- 000   000  000   000  000   000  000   000
-- 0000000    000   000  000   000  00     00


function context:draw() 
        if self:hidden() then return end
        
        self:arrange()
        self:drawFrame()
        self:drawChoices()
        return self:render()
    end


function context:drawFrame() 
        local cy = 0
        
        if self.input:visible() then 
            self.cells:draw_rounded_border(0, 0, -1, 2, {fg = self.color.bg})
            cy = 2
        end
        
        return self.cells:draw_rounded_border(0, cy, -1, -1, {fg = self.color.bg})
    end

return context