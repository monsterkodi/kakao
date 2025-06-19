--  ███████   ████████   ████████    ███████   ███   ███
-- ███   ███  ███   ███  ███   ███  ███   ███   ███ ███ 
-- █████████  ███████    ███████    █████████    █████  
-- ███   ███  ███   ███  ███   ███  ███   ███     ███   
-- ███   ███  ███   ███  ███   ███  ███   ███     ███   


local array = class("array")
    


function array:init(...) 
        local _argl_ = select("#", ...)
        for _argi_ = 1, (_argl_ + 1)-1 do 
    local v = select(_argi_, ...)
    
    self:insert(v)
end
        
        return self
    end


function array:__tostring() 
    return noon(self)
    end


function array:str() 
    return tostring(self)
    end

function array:len() 
    return #self
    end


function array.static.from(a) 
    return array(unpack(a))
    end

function array.static.str(a) 
    return noon(a)
    end

function array:arr() 
    return array.from(self)
    end

function array:each() 
          local i = 0 ; return function () 
                  i = i + 1 ; return self[i], i end
    end

function array.static.each(a) 
           local i = 0 ; return function () 
                     i = i + 1 ; return a[i], i end
    end


function array:join(c) 
    c = c or ""
    
    return self:concat(c)
    end


function array:map(f) 
        local t = self.class()
        for i, v in ipairs(self) do 
            t[i] = f(v)
        end
        
        return t
    end


function array.static.map(a, f) 
        local t = array()
        if (#a > 0) then 
            for i in iter(1, #a) do 
                t[i] = f(a[i])
            end
        elseif (a:len() > 0) then 
            for i in iter(1, a:len()) do 
                t[i] = f(a[i])
            end
        else 
            for i, v in ipairs(a) do 
                t[i] = f(v)
            end
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
        local _argl_ = select("#", ...)
        for _argi_ = 1, (_argl_ + 1)-1 do 
    local v = select(_argi_, ...)
    
    self[(#self + 1)] = v
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
        while (#a > 0) do 
            self:insert(i, a:pop())
        end
        
        return self
    end


function array:slice(first, last) 
        local s = self.class()
        
        if (first > #self) then return s end
        if (last == nil) then last = #self
        else last = min(#self, last)
        end
        
        if ((last < 1) or (last < first)) then return s end
        for i = first, (last + 1)-1 do 
            s:push(self[i])
        end
        
        return s
    end


function array.static.slice(a, first, last) 
        local s = array()
        if (a.class and (a.class ~= immutable)) then 
            s = a.class()
        end
        
        if (first > a:len()) then return s end
        if (last == nil) then last = a:len()
        else last = min(a:len(), last)
        end
        
        if ((last < 1) or (last < first)) then return s end
        for i = first, (last + 1)-1 do 
            s:push(a[i])
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


function array:find(e) 
        for i, v in ipairs(self) do 
            if (v == e) then return i end
        end
        
        return -1
    end


function array:eql(o) 
        if (#self ~= #o) then return false end
        for i, v in ipairs(self) do 
            if (v ~= o[i]) then 
                if is(v, array) then 
                    if not v:eql(o[i]) then 
                        return false
                    end
                else 
                    return false
                end
            end
        end
        
        return true
    end


function array:rnd() 
    return self[math.random(#self)]
    end


function array:sort(f) 
        self:sort(f)
        return self
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


function array:__add(a) 
        local s = self.class.from(self)
        for _, o in ipairs(a) do 
            table.insert(s, o)
        end
        
        return s
    end


function array.static.isarr(a) 
        if (type(a) ~= "table") then return false end
        return (#a > 0)
    end

array:include(table)

return array