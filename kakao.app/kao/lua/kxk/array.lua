--  ███████   ████████   ████████    ███████   ███   ███
-- ███   ███  ███   ███  ███   ███  ███   ███   ███ ███ 
-- █████████  ███████    ███████    █████████    █████  
-- ███   ███  ███   ███  ███   ███  ███   ███     ███   
-- ███   ███  ███   ███  ███   ███  ███   ███     ███   

local array = {}


function array.map(tbl, f) 
    local t = {}
    for k, v in pairs(tbl) do 
        t[k] = f(v)
    end
    
    return t
end


function array.filter(tbl, f) 
    local t = {}
    for k, v in pairs(tbl) do 
        if f(v, k) then 
            table.insert(t, v)
        end
    end
    
    return t
end


function array.shift(a) 
    return a.remove(1)
end

function array.pop(a) 
    return a.remove(#a)
end

function array.push(a, v) 
    a[(#a + 1)] = v
    return a[(#a + 1)]
end

function array.unshift(a, v) 
    return table.insert(a, v, 1)
end

function array.slice(a, first, last) 
    if (last == nil) then last = #a end
    local s = {}
    for i in iter(first, last) do 
        array.push(s, a[i])
    end
    
    return s
end


function array.str(a) 
    return "[ " .. table.concat(a, " ") .. " ]"
end

return array