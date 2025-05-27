-- 00000000   0000000   0000000   0000000   00000000   00000000
-- 000       000       000       000   000  000   000  000     
-- 0000000   0000000   000       000000000  00000000   0000000 
-- 000            000  000       000   000  000        000     
-- 00000000  0000000    0000000  000   000  000        00000000

local indstr = "    "


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
        k = '|' .. k .. '|'
    elseif (arry and (kstr.find(k, "  ") >= 1)) then 
        k = '|' .. k .. '|'
    end
    
    return k
end

-- 00000000   00000000   00000000  000000000  000000000  000   000
-- 000   000  000   000  000          000        000      000 000 
-- 00000000   0000000    0000000      000        000       00000  
-- 000        000   000  000          000        000        000   
-- 000        000   000  00000000     000        000        000   


function pretty(o, ind, visited) 
    local maxAlign = 32
    local maxKey = 4
    
    for k, v in pairs(o) do 
        maxKey = math.max(maxKey, (#k + 3))
        if (maxKey > maxAlign) then 
            maxKey = maxAlign
            break
        end
    end
    
    local l = array()
    
    
    function keyValue(k, v) 
        local s = ind
        k = escape(k, true)
        if ((kstr.find(k, "  ") > 0) and (k:sub(1, 1) ~= '|')) then 
            k = "|" .. k .. "|"
        elseif ((k:sub(1, 1) ~= '|') and (k:sub(#k, #k) == '|')) then 
            k = k .. '|' .. k
        elseif ((k:sub(1, 1) == '|') and (k:sub(#k, #k) ~= '|')) then 
            k = k .. '|'
        end
        
        local ks = kstr.pad(maxKey, k)
        local i = kstr.pad(maxKey, ind .. indstr)
        
        s = s .. ks
        local vs = stringify(v, i, false, visited)
        if (vs:sub(1, 1) == '\n') then 
            while (s:sub(#s, #s) == ' ') do 
                s = kstr.pop(s)
            end
        end
        
        s = s .. vs
        while (s:sub(#s, #s) == ' ') do 
            s = kstr.pop(s)
        end
        
        return s
    end
    
    for k, v in pairs(o) do 
        l:push(keyValue(k, v))
    end
    
    l:sort()
    return l:join('\n')
end

-- 000000000   0000000    0000000  000000000  00000000 
--    000     000   000  000          000     000   000
--    000     000   000  0000000      000     0000000  
--    000     000   000       000     000     000   000
--    000      0000000   0000000      000     000   000


function stringify(o, ind, arry, visited) 
    ind = ind or ""
    arry = arry or false
    visited = visited or array()
    
    if (type(o) == "string") then 
            return escape(o, arry)
    elseif (type(o) == "table") then 
            if visited:has(o) then return "<v>" end
            
            visited:push(o)
            local s = ""
            if ((#o > 0) or (o.class == array)) then 
                s = ((((ind ~= '') and arry) and '.') or '')
                if (#o and (ind ~= '')) then 
                    s = s .. '\n'
                end
                
                local va = array()
                for _, v in ipairs(o) do 
                    va:push(ind .. stringify(v, ind .. indstr, true, visited))
                end
                
                s = s .. va:join("\n")
            else 
                s = ((arry and '.\n') or (((ind ~= '') and '\n') or ''))
                s = s .. pretty(o, ind, visited)
            end
            
            return s
    else 
            return tostring(o)
    end
    
    return "<???>"
end

return {stringify = stringify}