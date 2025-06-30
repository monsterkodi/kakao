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
    if (type(v) == "table") then 
            if (#v >= 1) then return false end
            if ((type(v["len"]) == "function") and (v:len() >= 1)) then return false end
            return ((#v <= 0) and not dict.isdict(v))
    elseif (type(v) == "string") then return (v == "")
    elseif (type(v) == "nil") then return true
    end
    
    return false
end


function _G.valid(v) 
    return not empty(v)
end

_G.abs = math.abs
_G.max = math.max
_G.min = math.min
_G.int = math.floor
_G.floor = math.floor
_G.round = math.round
_G.ceil = math.ceil
_G.sqrt = math.sqrt
_G.Infinity = math.huge

function _G.clamp(l, h, v) 
    return min(max(l, v), h)
end

function _G.round(x) 
    return (((x >= 0) and floor((x + 0.5))) or ceil((x - 0.5)))
end


function _G.slice(a, first, last) 
    if (type(a) == "string") then 
    return string.sub(a, first, last)
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


function _G.is(v, c) 
    local vt = type(v)
    local ct = type(c)
    if (v and (vt == "table")) then 
        if (((ct == "table") and c.static) and (c ~= v.class)) then return false end
        if (((vt == ct) and (v.class ~= c.class)) and (v.class ~= c)) then return false end
        if ((type(v.is) == "function") and v:is(c)) then return true end
    end
    
    if (vt == ct) then return true end
    if ((vt == c) and (ct == "string")) then return true end
    return false
end


function _G.write(...) 
    local s = ""
    for _, v in ipairs({...}) do 
        s = s .. (tostring(v))
    end
    
    s = s .. "\27[0m\n"
    ffi.C.write(1, s, #s)
    return -- log s
end

local timers = {}


function _G.profileStart(msg) 
    if not timers[msg] then 
        timers[msg] = os.clock()
        return timers[msg]
    else 
        return print("[WARNING] Duplicate profileStart for '" .. tostring(msg) .. "'")
    end
end


function _G.profileStop(msg) 
    if not timers[msg] then 
        print("[ERROR] profileStop for unknown label '" .. tostring(msg) .. "'")
        return
    end
    
    local tick = os.clock()
    
    write("\x1b[0m\x1b[34m", msg, " ", "\x1b[0m\x1b[35m", (tick - timers[msg]))
    timers[msg] = nil
    return timers[msg]
end

_G.class = require("kxk.class")
_G.inspect = require("kxk.inspect")
_G.immutable = require("kxk.immutable")
_G.slash = require("kxk.slash")
_G.array = require("kxk.array")
_G.dict = require("kxk.dict")
_G.kstr = require("kxk.kstr")
_G.kseg = require("kxk.kseg")
_G.strg = require("kxk.strg")
_G.test = require("kxk.test")
_G.events = require("kxk.events")
_G.util = require("kxk.util")
_G.noon = require("kxk.noon")
_G.sds = require("kxk.sds")
_G.matchr = require("kxk.matchr")

return {}