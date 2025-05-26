array = require "kxk.array"


local kseg = class("kseg", array)
    


function kseg:init(s) 
        if (s and (#s > 0)) then 
            for i, seg in self:codes(s) do 
                self:push(seg)
            end
        end
        return self
    end


function kseg:decode(str, startPos) 
        startPos = startPos or 1
        
        local b1 = str:byte(startPos, startPos)
        
        if (b1 < 0x80) then 
            return startPos, startPos
        end
        
        if ((b1 > 0xF4) or (b1 < 0xC2)) then 
            return nil
        end
        
        local bytes = ((((b1 >= 0xF0) and 3) or ((b1 >= 0xE0) and 2)) or ((b1 >= 0xC0) and 1))
        
        local endPos = (startPos + bytes)
        
        local b2 = str:byte((startPos + 1), endPos)
        for _, bX in ipairs({b2}) do 
            if (bit.band(bX, 0xC0) ~= 0x80) then 
                return nil
            end
        end
        
        return startPos, endPos
    end


function kseg:codes(str) 
        local i = 1
        
        return function () 
            if (i > #str) then return nil end
            
            local startPos, endPos = self:decode(str, i)
            
            if not startPos then error("invalid UTF-8 code", 2) end
            
            i = (endPos + 1)
            
            return startPos, string.sub(str, startPos, endPos)
        end
    end


function kseg:__tostring() 
    return table.concat(self, "")
    end


function kseg:rpad(l, c) 
        c = c or ' '
        
        while (#self < l) do self:push(c) end
        return self
    end


function kseg:rtrim(c) 
        c = c or " \n"
        
        local s = kseg(c)
        while ((#self > 0) and s:has(self[#self])) do self:pop() end
        return self
    end


function kseg:ltrim(c) 
        c = c or " \n"
        
        local s = kseg(c)
        while ((#self > 0) and s:has(self[1])) do self:shift() end
        return self
    end


function kseg:trim(c) 
    c = c or " \n"
    
    return self:rtrim(c):ltrim(c)
    end

return kseg