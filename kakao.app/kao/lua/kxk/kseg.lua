array = require "./array"

local kseg = {}


function kseg.decode(str, startPos) 
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
    
    for _, bX in ipairs({str:byte((startPos + 1), endPos)}) do 
        if (bit.band(bX, 0xC0) ~= 0x80) then 
            return nil
        end
    end
    
    return startPos, endPos
end


function kseg.codes(str) 
    local i = 1
    
    return function () 
        if (i > #str) then return nil end
        
        local startPos, endPos = kseg.decode(str, i)
        
        if not startPos then error("invalid UTF-8 code", 2) end
        
        i = (endPos + 1)
        
        return startPos, string.sub(str, startPos, endPos)
    end
end


function kseg.segs(s) 
    local segs = {}
    for i, seg in kseg.codes(s) do 
        segs[(#segs + 1)] = seg
    end
    
    return segs
end


function kseg.str(s) 
    return table.concat(s, "")
end


function kseg.concat(a, b) 
    for i in iter(1, #b) do 
        a[(#a + 1)] = b[i]
    end
    
    return a
end


function kseg.sub(a, from, to) 
    return array.slice(a, from, to)
end


function kseg.splice(s, i, n, ...) 
    if (i < 0) then i = ((#s + i) + 1) end
    local r = kseg.concat({...}, kseg.sub(s, (i + n)))
    if (i > 1) then 
        r = kseg.concat(kseg.sub(s, 1, (i - 1)), r)
    end
    
    return r
end


function kseg.unshift(s, c) 
    return table.insert(s, 1, c)
end

function kseg.shift(s) 
    return table.remove(s, 1)
end

function kseg.pop(s) 
    return table.remove(s)
end

function kseg.push(s, c) 
    return table.insert(s, c)
end

function kseg.lpad(s, n, c) 
    c = c or " " n = n or 1
end

function kseg.lpad(l, s, c) 
    c = c or ' ' s = s or ""
    
    while (#s < l) do s = array.unshift(s, c) end
    return s
end


function kseg.rpad(l, s, c) 
    c = c or ' ' s = s or ""
    
    while (#s < l) do s = array.push(s, c) end
    return s
end


function kseg.rtrim(s, c) 
    c = c or ' '
    
    while ((#s > 0) and (s[#s] == c)) do s = kseg.pop(s) end
    return s
end


function kseg.ltrim(s, c) 
    c = c or ' '
    
    while ((#s > 0) and (s[1] == c)) do s = kseg.sub(s, 2) end
    return s
end


function kseg.trim(s, c) 
    c = c or ' '
    
    return kseg.ltrim(kseg.rtrim(s, c), c)
end

return kseg