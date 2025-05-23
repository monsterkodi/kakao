-- ███   ███  ███   ███  ███   ███
-- ███  ███    ███ ███   ███  ███ 
-- ███████      █████    ███████  
-- ███  ███    ███ ███   ███  ███ 
-- ███   ███  ███   ███  ███   ███


function _G.iter(from, to, step) 
    step = step or 1
    
    if (step ~= 0) then 
        step = math.abs(step)
        if (from > to) then step = -step end
        local i = (from - step)
        return function () 
            i = (i + step)
            if (((i >= to) and (step < 0)) or ((i <= to) and (step > 0))) then 
                return i
            end
        end
    end
    
    return function () 
    return nil
end
end


function _G.empty(v) 
    if (type(v) == "table") then return ((#v == 0) or ((#v == nil) and (v == {})))
    elseif (type(v) == "string") then return (v == "")
    elseif (type(v) == "nil") then return true
    end
    
    return false
end


function _G.slice(a, first, last) 
    if (type(a) == "string") then return string.sub(a, first, last)
    elseif (type(a) == "table") then 
            if (last == nil) then last = #a end
            local s = {}
            for i in iter(first, last) do 
                s[(#s + 1)] = a[i]
            end
            
            return s
    end
end


function _G.sleep(s) 
    local t = os.clock()
    while ((os.clock() - t) <= s) do _ = 1 end
end


function _G.is(v, t) 
    local vt = type(v)
    local tt = type(t)
    if (vt ~= tt) then return false end
    if (vt ~= "table") then return true end
    if ((vt == t) and (tt == "string")) then return true end
    if ((type(v.is) == "function") and v:is(t)) then return true end
    return false
end


function _G.write(...) 
    local s = table.concat({...}, "")
    s = s .. "\27[0m\n"
    return ffi.C.write(1, s, #s)
end

_G.strbuff = require("string.buffer")
_G.class = require("kxk/class")
_G.inspect = require("kxk/inspect")
_G.slash = require("kxk/slash")
_G.array = require("kxk/array")
_G.kstr = require("kxk/kstr")
_G.test = require("kxk/test")

return {}