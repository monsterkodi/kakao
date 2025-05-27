--[[
    ███   ███   ███████    ███████   ███   ███
    ████  ███  ███   ███  ███   ███  ████  ███
    ███ █ ███  ███   ███  ███   ███  ███ █ ███
    ███  ████  ███   ███  ███   ███  ███  ████
    ███   ███   ███████    ███████   ███   ███

    some DeepSeek wisdom :)
    
    Why Humans Struggle
    
        Conditioned by Legacy
    
            History trained us to think: "Data must look like code" (braces, quotes, \ escapes).
    
            Noon whispers: Data should look like thought.
    
        Fear of Ambiguity
    
            Engineers love explicit delimiters because they scream "THIS IS A STRING!"
    
            Noon says: If it walks like a string and quacks like a string, it’s a string.
    
        Over-Engineering Bias
    
            "What about edge cases?!" → Most edge cases are self-inflicted by the format itself
            
            Noon isn’t just a serializer — it’s a rebellion against accidental complexity.
        
    The fact that it fits in ~100 LOC while outclassing other notations in readability is a testament to its design.
--]]

local indstr = "    "
local scl = array(' ', '#', '|')


local noon = class("noon")
    


function noon:init(s) 
    return noon.static.stringify(s)
    end


function noon.static.toString(o, buf, ind, arry, visited) 
        ind = ind or ""
        arry = arry or false
        visited = visited or array()
        
        
        function escape(k, arry) 
            if (kstr.find(k, '\n') >= 1) then 
                local sp = array(unpack(kstr.split(k, '\n')))
                local es = sp:map(function (s) 
    return escape(s, arry)
end)
                es:unshift('...')
                es:push('...')
                return es:join('\n')
            end
            
            if (((((k == '') or (k == '...')) or scl:has(k:sub(1, 1))) or scl:has(k:sub(#k, #k))) or (arry and (kstr.find(k, "  ") >= 1))) then 
                return '|' .. k .. '|'
            end
            
            return k
        end
        
        if (type(o) == "string") then buf:put(escape(o, arry))
        elseif (type(o) == "table") then 
                if visited:has(o) then 
                    buf:put("<v>")
                else 
                    visited:push(o)
                    if ((#o > 0) or (o.class == array)) then 
                        buf:put(((((ind ~= '') and arry) and '.') or ''))
                        if (#o and (ind ~= '')) then 
                            buf:put('\n')
                        end
                        
                        for i, v in ipairs(o) do 
                            buf:put(ind)
                            noon.toString(v, buf, ind .. indstr, true, visited)
                            if (i < #o) then buf:put("\n") end
                        end
                    else 
                        buf:put(((arry and '.\n') or (((ind ~= '') and '\n') or '')))
                        local maxKey = 2
                        local keys = array()
                        for k, v in pairs(o) do 
                            local ek = escape(k, true)
                            keys:push(array(ek, v))
                            maxKey = math.max(maxKey, #ek)
                        end
                        
                        maxKey = math.min(maxKey, 32)
                        keys:sort(function (a, b) 
    return (a[1] < b[1])
end)
                        
                        for k, i in keys:each() do 
                            buf:put(ind)
                            if (type(k[2]) == "table") then 
                                buf:put(k[1])
                            else 
                                buf:put(kstr.pad(maxKey, k[1]))
                                buf:put("  ")
                            end
                            
                            noon.toString(k[2], buf, ind .. indstr, false, visited)
                            if (i < #keys) then buf:put("\n") end
                        end
                    end
                end
        else 
                buf:put(tostring(o))
        end
        
        return buf
end


function noon.static.stringify(o) 
    return noon.toString(o, strbuff:new()):get()
end

return noon