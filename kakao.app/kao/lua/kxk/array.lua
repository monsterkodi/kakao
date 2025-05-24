--  ███████   ████████   ████████    ███████   ███   ███
-- ███   ███  ███   ███  ███   ███  ███   ███   ███ ███ 
-- █████████  ███████    ███████    █████████    █████  
-- ███   ███  ███   ███  ███   ███  ███   ███     ███   
-- ███   ███  ███   ███  ███   ███  ███   ███     ███   


local array = class("array")
    


function array:init(...) 
        for i, v in ipairs({...}) do 
            table.insert(self, v)
        end
        return self
    end


function array:__tostring() 
        local s = ".\n"
        for i, v in ipairs(self) do 
            s = s .. "    " .. i .. "    " .. v .. "\n"
        end
        
        return s
    end


function array:str() 
    return tostring(self)
    end


function array:map(f) 
        local t = array()
        for i, v in ipairs(self) do 
            t[i] = f(v)
        end
        
        return t
    end


function array:filter(f) 
        local t = array()
        for i, v in ipairs(self) do 
            if f(v, i) then 
                t:push(v)
            end
        end
        
        return t
    end


function array:shift() 
        if (#self > 0) then return table.remove(self, 1) end
        return nil
    end


function array:pop() 
        if (#self > 0) then return table.remove(self, #self) end
        return nil
    end


function array:push(...) 
        for i, v in ipairs({...}) do 
            self[(#self + 1)] = v
        end
        
        return self
    end


function array:unshift(v) 
        table.insert(self, 1, v)
        return self
    end


function array:slice(first, last) 
        if (last == nil) then last = #self end
        local s = array()
        for i in iter(first, last) do 
            s:push(self[i])
        end
        
        return s
    end


function array:keydict(key) 
        local t = {}
        for i, v in ipairs(self) do 
            t[v[key]] = v
        end
        
        return t
    end


function array:indexdict() 
        local t = {}
        for i, v in ipairs(self) do 
            t[v] = i
        end
        
        return t
    end


function array:indexof(e) 
        for i, v in ipairs(self) do 
            if (v == e) then return i end
        end
        
        return -1
    end


function array:has(e) 
    return (self:indexof(e) >= 0)
    end

function array:contains(e) 
    return (self:indexof(e) >= 0)
    end


function array.static.isarr(a) 
    if (type(a) ~= "table") then return false end
    return (#a > 0)
end

return array