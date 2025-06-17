--[[
000       0000000    0000000   00000000  000  000      00000000
000      000   000  000        000       000  000      000     
000      000   000  000  0000  000000    000  000      0000000 
000      000   000  000   000  000       000  000      000     
0000000   0000000    0000000   000       000  0000000  00000000
--]]


local logfile = class("logfile")
    


function logfile:init() 
        local logfile = '/Users/kodi/s/kakao/kakao.app/lov.log'
        self.stream = io.open(logfile, "w+")
        self.closed = false
        
        function _G.print(...) 
    return self:log(...)
        end
        -- _G.error = (...) -> @error ...
        
        function _G.warn(...) 
    return self:error(...)
        end
        return self
    end


function logfile:log(...) 
        if self.closed then return end
        
        local args = {...}
        
        if ((#args >= 1) and is(args[1], "string")) then 
            local s = ""
            for _, v in ipairs(args) do 
                s = s .. (tostring(v))
                if (string.sub(tostring(v), 1, 1) ~= "\x1b") then 
                    s = s .. " "
                end
            end
            
            self:write("\x1b[0m\x1b[38;2;48;48;48m" .. "▸ " .. "\x1b[0m\x1b[32m" .. s)
        else 
            self:write("\x1b[0m\x1b[38;2;64;64;64m" .. "▾" .. "\x1b[0m\x1b[32m")
            for _, v in pairs(args) do 
                self:write(tostring(v))
            end
        end
        
        return self.stream:flush()
    end


function logfile:error(...) 
        if self.closed then return end
        
        local args = {...}
        
        if ((#args == 1) and is(args[1], "string")) then 
            self:write("\x1b[0m\x1b[31m" .. "▴ " .. "\x1b[0m\x1b[38;2;240;240;0m" .. args[1])
        else 
            self:write("\x1b[0m\x1b[31m" .. "▴")
            for _, v in ipairs(args) do 
                self:write(tostring(v))
            end
        end
        
        return self.stream:flush()
    end


function logfile:write(txt) 
        return self.stream:write(txt .. '\n')
    end


function logfile:close(cb) 
        if self.closed then return end
        self.stream:write("\x1b[0m\x1b[31m" .. '▪\n')
        self.closed = true
        return self.stream:close()
    end

return logfile