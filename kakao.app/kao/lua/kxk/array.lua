--  ███████   ████████   ████████    ███████   ███   ███
-- ███   ███  ███   ███  ███   ███  ███   ███   ███ ███ 
-- █████████  ███████    ███████    █████████    █████  
-- ███   ███  ███   ███  ███   ███  ███   ███     ███   
-- ███   ███  ███   ███  ███   ███  ███   ███     ███   


local array = class("array")
    


function array:init(...) 
        local l = select("#", ...)
        if (l > 0) then 
            for i in iter(1, l) do 
                local v = select(i, ...)
                self:insert(v)
            end
        end
        return self
    end


function array:__tostring() 
        local s = ".\n"
        for i, v in ipairs(self) do 
            s = s .. "    " .. tostring(i) .. "    " .. tostring(v) .. "\n"
        end
        
        return s
    end


function array:str() 
    return tostring(self)
    end


function array:each() 
          local i = 0 ; return function () 
                  i = i + 1 ; return self[i], i end
    end


function array:map(f) 
        local t = self.class()
        for i, v in ipairs(self) do 
            t[i] = f(v)
        end
        
        return t
    end


function array:filter(f) 
        local t = self.class()
        for i, v in ipairs(self) do 
            if f(v, i) then 
                t:push(v)
            end
        end
        
        return t
    end


function array:shift() 
        if (#self > 0) then 
    return self:remove(1)
        end
    end


function array:pop() 
        if (#self > 0) then 
    return self:remove(#self)
        end
    end


function array:push(...) 
        local l = select("#", ...)
        if (l > 0) then 
            for i in iter(1, l) do 
                self[(#self + 1)] = select(i, ...)
            end
        end
        
        return self
    end


function array:unshift(...) 
        local l = select("#", ...)
        if (l > 0) then 
            for i in iter(l, 1) do 
                local v = select(i, ...)
                self:insert(1, v)
            end
        end
        
        return self
    end


function array:splice(i, n, ...) 
        if (n > 0) then 
            for d in iter(1, n) do 
                self:remove(i)
            end
        end
        
        local a = self.class(...)
        if (#a > 0) then 
            while #a do 
                self:insert(i, a:pop())
            end
        end
        
        return self
    end


function array:slice(first, last) 
        if (last == nil) then last = #self end
        last = math.min(#self, last)
        local s = self.class()
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


function array:rnd() 
    return self[math.random(#self)]
    end


function array:swap(i, j) 
        if ((i < 1) or (i > #self)) then return end
        if ((j < 1) or (j > #self)) then return end
        if (i == j) then return end
        self[i], self[j] = self[j], self[i]
        return self[i], self[j]
    end


function array:shuffle() 
        for i in iter(1, #self) do 
            self:swap(i, math.random(#self))
        end
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

array:include(table)

return array