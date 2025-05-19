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

return array