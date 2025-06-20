
local util = class("util")
    


function util.static.sessionId() 
        local now = os.time()
        local date = os.date("*t", now)
        local yearStart = os.time({year = date.year, month = 1, day = 1})
        return string.format("%08x", (now - yearStart))
    end


function util.static.uniq(arr) 
        local result = array()
        for _, item in ipairs(arr) do 
            if not result:has(item) then 
                result:push(item)
            end
        end
        
        return result
    end


function util.static.randRange(f, t) 
        return (f + (math.random() * (t - f)))
    end

return util