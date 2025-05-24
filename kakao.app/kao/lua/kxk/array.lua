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
    assert((type(a) == "table"))
    if (#a > 0) then return table.remove(a, 1) end
    return nil
end


function array.pop(a) 
    assert((type(a) == "table"))
    if (#a > 0) then return table.remove(a, #a) end
    return nil
end


function array.push(a, ...) 
    assert((type(a) == "table"), "array.push -- not a table: " .. tostring(a))
    for i, v in ipairs({...}) do 
        a[(#a + 1)] = v
    end
    
    return a
end


function array.unshift(a, v) 
    assert((type(a) == "table"))
    table.insert(a, 1, v)
    return a
end


function array.slice(a, first, last) 
    assert((type(a) == "table"))
    if (last == nil) then last = #a end
    local s = {}
    for i in iter(first, last) do 
        array.push(s, a[i])
    end
    
    return s
end


function array.keydict(a, key) 
    assert((type(a) == "table"))
    local t = {}
    for i, v in ipairs(a) do 
        t[v[key]] = v
    end
    
    return t
end


function array.indexdict(a) 
    assert((type(a) == "table"))
    local t = {}
    for i, v in ipairs(a) do 
        t[v] = i
    end
    
    return t
end


function array.str(a) 
    local s = ".\n"
    for i, v in pairs(a) do 
        s = s .. "    " .. i .. "    " .. v .. "\n"
    end
    
    return s
end


function array.isarr(a) 
    if (type(a) ~= "table") then return false end
    return (#a > 0)
end


function array.indexof(a, e) 
    if array.isarr(a) then 
        for i, v in ipairs(a) do 
            if (v == e) then return i end
        end
    end
    
    return -1
end


function array.has(a, e) 
    return (array.indexof(a, e) >= 0)
end

function array.contains(a, e) 
    return (array.indexof(a, e) >= 0)
end

return array