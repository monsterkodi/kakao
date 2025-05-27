-- 00000000   0000000   0000000   0000000   00000000   00000000
-- 000       000       000       000   000  000   000  000     
-- 0000000   0000000   000       000000000  00000000   0000000 
-- 000            000  000       000   000  000        000     
-- 00000000  0000000    0000000  000   000  000        00000000

local indstr = "    "


function toString(o, buf, ind, arry, visited) 
    ind = ind or ""
    arry = arry or false
    visited = visited or array()
    
    
    function escape(k, arry) 
        local scl = array(' ', '#', '|')
        
        if (kstr.find(k, '\n') >= 1) then 
            local sp = kstr.split(k, '\n')
            sp = array(unpack(sp))
            local es = sp:map(function (s) 
    return escape(s, arry)
end)
            es:unshift('...')
            es:push('...')
            return es:join('\n')
        end
        
        if ((((k == '') or (k == '...')) or scl:has(k:sub(1, 1))) or scl:has(k:sub(#k, #k))) then 
            return '|' .. k .. '|'
        elseif (arry and (kstr.find(k, "  ") >= 1)) then 
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
                    
                    for _, v in ipairs(o) do 
                        buf:put(ind)
                        toString(v, buf, ind .. indstr, true, visited)
                        buf:put("\n")
                    end
                else 
                    buf:put(((arry and '.\n') or (((ind ~= '') and '\n') or '')))
                    
                    local maxAlign = 32
                    local maxKey = 2
                    
                    local keys = array()
                    for k, v in pairs(o) do 
                        local ek = escape(k, true)
                        keys:push(array(ek, v))
                        maxKey = math.max(maxKey, #ek)
                    end
                    
                    if (maxKey > maxAlign) then 
                        maxKey = maxAlign
                    end
                    
                    keys:sort(function (a, b) 
    return (a[1] < b[1])
end)
                    
                    for k, i in keys:each() do 
                        buf:put(ind)
                        buf:put(kstr.pad(maxKey, k[1]))
                        buf:put("  ")
                        toString(k[2], buf, ind .. indstr, false, visited)
                        if (i < #keys) then buf:put("\n") end
                    end
                end
            end
    else 
            buf:put(tostring(o))
    end
    
    return buf
end


function stringify(o) 
    return toString(o, strbuff:new()):get()
end

return {stringify = stringify}