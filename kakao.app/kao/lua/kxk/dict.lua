--[[
    ███████    ███   ███████  █████████
    ███   ███  ███  ███          ███   
    ███   ███  ███  ███          ███   
    ███   ███  ███  ███          ███   
    ███████    ███   ███████     ███   
--]]


local dict = class("dict")
    


function dict.static.iskey(k) 
    return (((type(k) == "string") and (k ~= "class")) and (string.sub(k, 1, 2) ~= "__"))
    end


function dict.static.iter(d) 
        if (d.class == immutable) then return dict.iter(d.__data) end
        
        local k = nil
        return function () 
            k = next(d, k)
            while (k and ((type(dict[k]) == "function") or not dict.iskey(k))) do 
                k = next(d, k)
            end
            
            return k, d[k]
        end
    end


function dict.static.size(d) 
        local s = 0
        for _ in dict.iter(d) do 
            s = s + 1
        end
        
        return s
    end


function dict.static.str(d) 
    return noon(d)
    end


function dict.static.keys(d) 
        local a = array()
        for k, _ in dict.iter(d) do 
            a:push(k)
        end
        
        return a
    end


function dict.static.values(d) 
        local a = array()
        for _, v in dict.iter(d) do 
            a:push(v)
        end
        
        return a
    end


function dict.static.isdict(d) 
        return (((#d <= 0) and (dict.size(d) >= 1)) and (d.class ~= array))
    end

return dict