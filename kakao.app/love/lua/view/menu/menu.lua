--[[
    ██     ██  ████████  ███   ███  ███   ███  
    ███   ███  ███       ████  ███  ███   ███  
    █████████  ███████   ███ █ ███  ███   ███  
    ███ █ ███  ███       ███  ████  ███   ███  
    ███   ███  ████████  ███   ███   ███████   

    simple list of actions with optional greet
--]]

inputchoice = require "view.menu.inputchoice"
greet = require "view.menu.greet"


local menu = class("menu", inputchoice)
    


function menu:init(name) 
        name = name or 'menu'
        
        inputchoice.init(self, name)
        
        self.greet = greet()
        return self
    end

--  0000000   00000000   00000000    0000000   000   000   0000000   00000000  
-- 000   000  000   000  000   000  000   000  0000  000  000        000       
-- 000000000  0000000    0000000    000000000  000 0 000  000  0000  0000000   
-- 000   000  000   000  000   000  000   000  000  0000  000   000  000       
-- 000   000  000   000  000   000  000   000  000   000   0000000   00000000  


function menu:arrange() 
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
        local scy = floor((_G.screen.rows / 2))
        local y = floor((scy - ((c + 2) / 2)))
        y = y - ih
        
        local scx = floor((_G.screen.cols / 2))
        local x = floor((scx - (w / 2)))
        
        local gw, gh = belt.cellSize(self.greet.header)
        
        local gx = floor((scx - (gw / 2)))
        local gy = max(1, floor((((y - gh) - 1) + ih)))
        
        self.greet:layout(gx, gy)
        self.input:layout((x + 2), (y + 1), (w - 4), iz)
        self.choices:layout((x + 1), ((y + 1) + ih), (w - 2), c)
        return self.cells:layout(x, y, w, h)
    end

--  0000000  000   000   0000000   000   000
-- 000       000   000  000   000  000 0 000
-- 0000000   000000000  000   000  000000000
--      000  000   000  000   000  000   000
-- 0000000   000   000   0000000   00     00


function menu:show(greet) 
        greet = greet or false
        
        if greet then 
            self.greet:show()
        end
        
        local items = belt.linesForText([[
recent ...
open ...
new
help
quit
]])
        
        if not greet then 
            items:splice((#items - 2), 0, 'about')
        end
        
        -- if empty ked_session∙recentFiles()
        --     items∙splice items∙find('recent ...') 1 
        
        items = items:map(function (i) 
    return ' ' .. tostring(i)
end) -- padding for  
        
        self.width = belt.widthOfLines(items)
        
        self.input:set('')
        self.input:hide()
        self.choices:set(items)
        self.choices:select(1)
        self.choices.state:setView(array(1, 1))
        
        return inputchoice.show(self)
    end

-- 00000000   00000000   0000000  00000000  000   000  000000000  
-- 000   000  000       000       000       0000  000     000     
-- 0000000    0000000   000       0000000   000 0 000     000     
-- 000   000  000       000       000       000  0000     000     
-- 000   000  00000000   0000000  00000000  000   000     000     


function menu:showRecent() 
         --recent = frecent∙list 'file'
         --         
         --@choices∙set recent
         --         
         return --post∙emit 'quicky.files' recent
    end


function menu:hide() 
        self.greet:hide()
        return inputchoice.hide(self)
    end

--  0000000   00000000   00000000   000      000   000  
-- 000   000  000   000  000   000  000       000 000   
-- 000000000  00000000   00000000   000        00000    
-- 000   000  000        000        000         000     
-- 000   000  000        000        0000000     000     


function menu:applyChoice(choice) 
        -- log "applyChoice ▸#{choice}◂"
        
        if (choice == 'new') then self:hide() ; post:emit('file.new')
        elseif (choice == 'about') then self:show(true) ; -- reopen with greeting header
        elseif (choice == 'quit') then self.greet:hide() ; post:emit('quit')
        elseif (choice == 'open ...') then post:emit('browse.dir', slash.cwd())
        elseif (choice == 'recent ...') then self:showRecent()
        elseif (choice == 'help') then self:hide() ; post:emit('file.open', slash.path(slash.cwd(), '../../../../kode/ked/help.md'))
        end
        
        return true
    end


function menu:onWheel() 
    
    end

-- 0000000    00000000    0000000   000   000
-- 000   000  000   000  000   000  000 0 000
-- 000   000  0000000    000000000  000000000
-- 000   000  000   000  000   000  000   000
-- 0000000    000   000  000   000  00     00


function menu:draw() 
        if self:hidden() then return end
        
        self:arrange()
        self.greet:draw()
        self:drawFrame()
        return self:drawChoices()
    end

return menu