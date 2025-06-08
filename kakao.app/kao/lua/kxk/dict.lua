--[[
    ███████    ███   ███████  █████████
    ███   ███  ███  ███          ███   
    ███   ███  ███  ███          ███   
    ███   ███  ███  ███          ███   
    ███████    ███   ███████     ███   
--]]


local dict = class("dict")
    


function dict.static.size(d) 
        local s = 0
        for _ in pairs(d) do 
            s = s + 1
        end
        
        return s
    end


function dict.static.str(d) 
        local s = ""
        for k, v in pairs(d) do 
            s = s .. (k .. ":" .. tostring(v) .. " ")
        end
        
        return kstr.pop(s)
    end


function dict.static.keys(d) 
        local a = array()
        for k, _ in pairs(d) do 
            a:push(k)
        end
        
        return a
    end


function dict.static.values(d) 
        local a = array()
        for _, v in pairs(d) do 
            a:push(v)
        end
        
        return a
    end


function dict.static.isdict(d) 
        return (((#d <= 0) and (dict.size(d) >= 1)) and (d.class ~= array))
    end

return dict