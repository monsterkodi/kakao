--[[
    00     00   0000000    0000000  00000000    0000000   
    000   000  000   000  000       000   000  000   000  
    000000000  000000000  000       0000000    000   000  
    000 0 000  000   000  000       000   000  000   000  
    000   000  000   000   0000000  000   000   0000000   

    menu for actions that don't have keyboard shortcuts
--]]

inputchoice = require "view.menu.inputchoice"


local macros = class("macros", inputchoice)
    


function macros:init() 
        inputchoice.init(self, 'macro')
        return self
    end

--  0000000   00000000   00000000    0000000   000   000   0000000   00000000  
-- 000   000  000   000  000   000  000   000  0000  000  000        000       
-- 000000000  0000000    0000000    000000000  000 0 000  000  0000  0000000   
-- 000   000  000   000  000   000  000   000  000  0000  000   000  000       
-- 000   000  000   000  000   000  000   000  000   000   0000000   00000000  


function macros:arrange() 
        local w = max(20, ((self.width + 2) + 1)) -- 2 for frame, 1 for right 
        local c = self.choices:numChoices()
        
        local ih = (function () 
    if self:inputIsActive() then 
    return 2 else 
    return 0
             end
end)()
        local iz = max(0, (ih - 1))
        
        local h = ((c + 2) + ih)
        local scy = int((_G.screen.rows / 2))
        local y = int((scy - ((c + 2) / 2)))
        y = y - ih
        
        local scx = int((_G.screen.cols / 2))
        local x = int((scx - (w / 2)))
        
        self.input:layout((x + 2), (y + 1), (w - 4), iz)
        self.choices:layout((x + 1), ((y + 1) + ih), (w - 2), c)
        return self.cells:layout(x, y, w, h)
    end

--  0000000  000   000   0000000   000   000
-- 000       000   000  000   000  000 0 000
-- 0000000   000000000  000   000  000000000
--      000  000   000  000   000  000   000
-- 0000000   000   000   0000000   00     00


function macros:show() 
        local items = belt.linesForText
        
            [[
status
diff
history
]]
        
        items = items:map(function (i) 
    return ' ' .. i
end) -- padding for  
        
        local ccol = (int((_G.screen.cols / 2)) - 5)
        
        self.width = belt.widthOfLines(items)
        
        self.input:set('')
        self.input:hide()
        self.choices:set(items)
        self.choices:select(0)
        self.choices.state:setView(array(0, 0))
        
        return inputchoice.show(self)
    end


function macros:hide() 
        post:emit('focus', 'editor')
        return inputchoice.hide(self)
    end

--  0000000   00000000   00000000   000      000   000  
-- 000   000  000   000  000   000  000       000 000   
-- 000000000  00000000   00000000   000        00000    
-- 000   000  000        000        000         000     
-- 000   000  000        000        0000000     000     


function macros:applyChoice(choice) 
        -- log "macro.applyChoice ▸#{choice}◂"
        
        if empty(choice) then 
            local input = self.input:current()
            if (input == 'bof') then post:emit('goto.bof')
            elseif (input == 'eof') then post:emit('goto.eof')
            elseif tonumber(input) then post:emit('goto.line', tonumber(input), 'ind')
            elseif kstr.startsWith(input, 'vibrant ') then 
                    local sp = input:split(" ")
                    local sf = tonumber(sp[1])
                    local lf = (function () 
    if (#sp > 2) then 
    return tonumber(sp[2]) else 
    return 1
                         end
end)()
                    post:emit('theme.vibrant', sf, lf)
            elseif input.startsWith('class ') then 
                    local sp = input:split(" ")
                    if valid(sp[1]) then 
                        post:emit('file.class', sp[1])
                    end
            end
        else 
            if (choice == 'diff') then post:emit('differ.file')
            elseif (choice == 'status') then post:emit('differ.status')
            elseif (choice == 'history') then post:emit('differ.history')
            end
        end
        
        self:hide()
        return true
    end

return macros