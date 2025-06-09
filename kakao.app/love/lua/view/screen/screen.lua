--[[
     ███████   ███████  ████████   ████████  ████████  ███   ███
    ███       ███       ███   ███  ███       ███       ████  ███
    ███████   ███       ███████    ███████   ███████   ███ █ ███
         ███  ███       ███   ███  ███       ███       ███  ████
    ███████    ███████  ███   ███  ████████  ████████  ███   ███

    an array of cells (background|foreground colors and character)
--]]

kxk = require "kxk.kxk"
color = require "theme.color"
belt = require "edit.tool.belt"


local screen = class("screen")
    


function screen:init(cols, rows) 
        self.rows = rows
        self.cols = cols
        
        self.c = belt.cells(self.cols, self.rows)
        return self
    end


function screen:size() 
    return array(self.cols, self.rows)
    end


function screen:initSize(cols, rows) 
        self.rows = rows
        self.cols = cols
        
        -- @meta_clear()
        self.c = belt.cells(self.cols, self.rows)
        return self
    end

--  0000000  00000000  000000000  
-- 000       000          000     
-- 0000000   0000000      000     
--      000  000          000     
-- 0000000   00000000     000     


function screen:add(x, y, char, fg, bg) 
        -- w = kseg.segWidth char
        local w = 1
        if (w > 1) then 
            if (#char > 4) then 
                char = (('\x1b]66;w=2;' + char) + '\x07')
            end
            
            self:set(x, y, char, fg, bg)
            self:set((x + 1), y, null, fg, bg)
            return 2
        else 
            self:set(x, y, char, fg, bg)
            return 1
        end
    end


function screen:set(x, y, char, fg, bg) 
        if ((((1 <= x) and (x <= self.cols)) and (1 <= y)) and (y <= self.rows)) then 
            if (char ~= " ") then 
                print("screen.set " .. tostring(x) .. " " .. tostring(y) .. " " .. tostring(char) .. "", fg, bg)
            end
            
            self.c[y][x].char = char
            self.c[y][x].fg = (fg or array())
            self.c[y][x].bg = (bg or array())
        end
        
        return self
    end


function screen:set_char(x, y, char) 
        if ((((1 <= x) and (x <= self.cols)) and (1 <= y)) and (y <= self.rows)) then 
            self.c[y][x].char = char
        end
        
        return self
    end


function screen:set_ch_fg(x, y, char, fg) 
        if ((((1 <= x) and (x <= self.cols)) and (1 <= y)) and (y <= self.rows)) then 
            self.c[y][x].char = char
            self.c[y][x].fg = fg
        end
        
        return self
    end


function screen:set_bg(x, y, bg) 
        if ((((1 <= x) and (x <= self.cols)) and (1 <= y)) and (y <= self.rows)) then 
            self.c[y][x].bg = bg
        end
        
        return self
    end


function screen:set_fg(x, y, fg) 
        if ((((1 <= x) and (x <= self.cols)) and (1 <= y)) and (y <= self.rows)) then 
            self.c[y][x].fg = fg
        end
        
        return self
    end


function screen:set_fg_bg(x, y, fg, bg) 
        if ((((1 <= x) and (x <= self.cols)) and (1 <= y)) and (y <= self.rows)) then 
            self.c[y][x].fg = fg
            self.c[y][x].bg = bg
        end
        
        return self
    end

-- ██     ██  ████████  █████████   ███████ 
-- ███   ███  ███          ███     ███   ███
-- █████████  ███████      ███     █████████
-- ███ █ ███  ███          ███     ███   ███
-- ███   ███  ████████     ███     ███   ███

-- meta_set: x y m ->
--     
--     if 0 <= x < @cols and 0 <= y < @rows
--         @m[y][x] = m

-- meta_clear: ->
--     
--     @m = belt.metas @cols @rows

--  0000000   00000000  000000000  
-- 000        000          000     
-- 000  0000  0000000      000     
-- 000   000  000          000     
--  0000000   00000000     000     


function screen:get_char(x, y) 
        if ((((1 <= x) and (x <= self.cols)) and (1 <= y)) and (y <= self.rows)) then 
            return self.c[y][x].char
        end
        
        return ''
    end


function screen:get_fg(x, y) 
        if ((((1 <= x) and (x <= self.cols)) and (1 <= y)) and (y <= self.rows)) then 
            return self.c[y][x].fg
        end
        
        return array()
    end


function screen:get_bg(x, y) 
        if ((((1 <= x) and (x <= self.cols)) and (1 <= y)) and (y <= self.rows)) then 
            return self.c[y][x].bg
        end
        
        return array()
    end

-- 00000000   00000000  000   000  0000000    00000000  00000000   
-- 000   000  000       0000  000  000   000  000       000   000  
-- 0000000    0000000   000 0 000  000   000  0000000   0000000    
-- 000   000  000       000  0000  000   000  000       000   000  
-- 000   000  00000000  000   000  0000000    00000000  000   000  


function screen:render(ox, oy, fontStep, fontSize) 
        print("screen.render", self.rows, self.cols)
        for y in iter(1, self.rows) do 
            for x in iter(1, self.cols) do 
                local char = self.c[y][x].char
                
                -- if @c[y][x].bg and @c[y][x].bg.len > 0
                --     love.graphics.setColor @c[y][x].bg[1]/255, @c[y][x].bg[2]/255, @c[y][x].bg[3]/255
                --     love.graphics.rectangle("fill", ox+(x-1)*fontStep, oy+(y-1)*fontSize, fontStep, fontSize) 
                
                if ((#self.c[y][x].fg > 0) and is(self.c[y][x].fg, array)) then 
                    love.graphics.setColor((self.c[y][x].fg[1] / 255), (self.c[y][x].fg[2] / 255), (self.c[y][x].fg[3] / 255))
                end
                
                -- love.graphics.print char, ox+(x-1)*fontStep, oy+(y-1)*fontSize
                love.graphics.print(char, (ox + ((x - 1) * fontStep)), (oy + ((y - 1) * fontSize)))
            end
        end
        
        return self
    end

return screen