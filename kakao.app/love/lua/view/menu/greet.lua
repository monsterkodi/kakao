--[[
     ███████   ████████   ████████  ████████  █████████  
    ███        ███   ███  ███       ███          ███     
    ███  ████  ███████    ███████   ███████      ███     
    ███   ███  ███   ███  ███       ███          ███     
     ███████   ███   ███  ████████  ████████     ███     

    the fancy glowing app name ascii art thingy
--]]

help = require "util.help"
belt = require "edit.tool.belt"
view = require "view.base.view"


local greet = class("greet", view)
    


function greet:init() 
        view.init(self, 'greet')
        
        self.isVisible = false
        
        self.header = help.headerCells()
        self.name = 'greet'
        self.a = 120
        
        self.cells.rows = 0
        return self
    end

--  ███████  ███   ███   ███████   ███   ███  
-- ███       ███   ███  ███   ███  ███ █ ███  
-- ███████   █████████  ███   ███  █████████  
--      ███  ███   ███  ███   ███  ███   ███  
-- ███████   ███   ███   ███████   ██     ██  


function greet:hide() 
        post:emit('greet.hide')
        return view.hide(self)
    end


function greet:show() 
        post:emit('greet.show')
        return view.show(self)
    end


function greet:layout(x, y) 
        local w, h = belt.cellSize(self.header)
        
        return self.cells:layout(x, y, w, h)
    end

-- ███████    ████████    ███████   ███   ███  
-- ███   ███  ███   ███  ███   ███  ███ █ ███  
-- ███   ███  ███████    █████████  █████████  
-- ███   ███  ███   ███  ███   ███  ███   ███  
-- ███████    ███   ███  ███   ███  ██     ██  


function greet:draw() 
        if self:hidden() then return end
        
        local duration = 480
        self.a = self.a + 1
        if (self.a > duration) then self.a = 0 end
        
        local f = (0.4 + (0.6 * math.abs(math.sin((((2 * math.pi) * self.a) / duration)))))
        
        self.header = help.headerCells(f)
        
        for y, row in ipairs(self.header) do 
            for x, cell in ipairs(row) do 
                self.cells:set(x, y, cell.char, cell.fg, cell.bg)
            end
        end
        
        return self:render()
    end

return greet