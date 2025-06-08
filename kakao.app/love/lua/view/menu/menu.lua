--[[
    ██     ██  ████████  ███   ███  ███   ███  
    ███   ███  ███       ████  ███  ███   ███  
    █████████  ███████   ███ █ ███  ███   ███  
    ███ █ ███  ███       ███  ████  ███   ███  
    ███   ███  ████████  ███   ███   ███████   

    simple list of actions with optional greet
--]]

-- use ../../../kxk    ▪ kstr slash post noon
-- use ../../util      ◆ frecent
-- use ../../edit/tool ◆ belt
-- use ../../theme     ◆ theme 
-- use ../screen       ◆ cells 
inputchoice = require "view.menu.inputchoice"
greet = require "view.menu.greet"


local menu = class("menu", inputchoice)
    


function menu:init(screen, name) 
        name = name or 'menu'
        
        inputchoice.init(self, screen, name)
        
        self.greet = greet(self.screen)
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
        local iz = math.max(1, (ih - 1))
        
        local h = ((c + 2) + ih)
        local scy = math.floor((self.screen.rows / 2))
        local y = math.floor((scy - ((c + 2) / 2)))
        y = y - ih
        
        local scx = math.floor((self.screen.cols / 2))
        local x = math.floor((scx - (w / 2)))
        
        local gw, gh = belt.cellSize(self.greet.header)
        
        local gx = math.floor((scx - (gw / 2)))
        local gy = math.max(1, math.floor((((y - gh) - 1) + ih)))
        
        --if @greet∙visible() and y <= gy+gh
        --    
        --    diff = (gy+gh)-y
        --    
        --    while diff and gy
        --         gy -= 1           
        --         diff = (gy+gh)-y  
        --         
        --    while diff and y+h < @screen.rows
        --        y += 1
        --        diff = (gy+gh)-y
        
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
            -- @screen.t.setTitle 'kėd'
        end
        
        local items = belt.linesForText([[
recent ...
open ...
new
help
quit
]])
        
        if not greet then 
            items.splice((#items - 2), 0, 'about')
        end
        
        if empty(ked_session:recentFiles()) then 
            items:splice(items:find('recent ...'), 1)
        end
        
        items = items:map(function (i) 
    return ' ' .. i
end) -- padding for  
        
        local ccol = (math.floor((self.screen.cols / 2)) - 5)
        
        self.width = belt.widthOfLines(items)
        
        self.input:set('')
        self.input:hide()
        self.choices:set(items)
        self.choices:select(0)
        self.choices.state:setView(array(0, 0))
        
        return inputchoice.show(self)
    end

-- 00000000   00000000   0000000  00000000  000   000  000000000  
-- 000   000  000       000       000       0000  000     000     
-- 0000000    0000000   000       0000000   000 0 000     000     
-- 000   000  000       000       000       000  0000     000     
-- 000   000  00000000   0000000  00000000  000   000     000     


function menu:showRecent() 
        local recent = frecent.list('file')
        
        self.choices.set(recent)
        
        return post.emit('quicky.files', recent)
    end


function menu:hide() 
        self.greet.hide()
        return super()
    end

--  0000000   00000000   00000000   000      000   000  
-- 000   000  000   000  000   000  000       000 000   
-- 000000000  00000000   00000000   000        00000    
-- 000   000  000        000        000         000     
-- 000   000  000        000        0000000     000     


function menu:applyChoice(choice) 
        -- log "applyChoice ▸#{choice}◂"
        
        if (choice == 'new') then self:hide() ; post.emit('file.new')
        elseif (choice == 'about') then self:show(true) ; -- reopen with greeting header
        elseif (choice == 'quit') then self.greet.hide() ; post.emit('quit')
        elseif (choice == 'open ...') then post.emit('browse.dir', process.cwd())
        elseif (choice == 'recent ...') then self:showRecent()
        elseif (choice == 'help') then self:hide() ; post.emit('file.open', slash.path(slash.cwd(), '../../../../kode/ked/help.md'))
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