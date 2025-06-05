--[[
     ███████  █████████  ████████    ███████ 
    ███          ███     ███   ███  ███      
    ███████      ███     ███████    ███  ████
         ███     ███     ███   ███  ███   ███
    ███████      ███     ███   ███   ███████ 
--]]

array = require "kxk.array"

local strbuff = require("string.buffer")


local strg = class("strg")
    


function strg:init(...) 
        self.buff = nil
        self.frags = array() local _argl_ = select("#", ...)
        for _argi_ = 1, (_argl_ + 1)-1 do 
    local v = select(_argi_, ...)
    
    self = self + v
end
        
        return self
    end


function strg:__tostring() 
        self:debuff()
        
        if (#self.frags == 0) then return "" end
        
        if (#self.frags == 1) then 
            if (type(self.frags[1]) == "string") then 
                return self.frags[1]
            end
            
            return self.frags[1]:join()
        end
        
        local b = strbuff:new()
        for f in self.frags:each() do 
            if (type(f) == 'string') then 
                b:put(f)
            else 
                b:put(f:join())
            end
        end
        
        return b:get()
    end


function strg:len() 
        self:debuff()
        if (#self.frags == 0) then return 0 end
        local l = 0
        for f in self.frags:each() do 
            if (type(f) == 'string') then 
                l = l + (#f)
            else 
                for s in f:each() do 
                    l = l + (#s)
                end
            end
        end
        
        return l
    end


function strg:endsWith(o) 
        self:flatten()
        return kstr.endsWith(tostring(self.frags[1]), o)
    end


function strg:startsWith(o) 
        self:flatten()
        return kstr.startsWith(tostring(self.frags[1]), o)
    end


function strg:rtrim(c) 
        c = c or ' '
        
        self:flatten()
        self.frags[1] = self.frags[1]:rtrim(c)
        return self
    end


function strg:ltrim(c) 
        c = c or ' '
        
        self:flatten()
        self.frags[1] = self.frags[1]:ltrim(c)
        return self
    end


function strg:trim(c) 
        c = c or ' '
        
        self:flatten()
        self.frags[1] = self.frags[1]:trim(c)
        return self
    end


function strg:shift() 
        self:flatten()
        return self.frags[1]:shift()
    end


function strg:pop() 
        self:flatten()
        return self.frags[1]:pop()
    end


function strg:number() 
        return tonumber(tostring(self))
    end


function strg:indent() 
        self:flatten()
        return self.frags[1]:indent()
    end


function strg:bool() 
        local s = tostring(self)
        if (s == "true") then return true end
        if (s == "false") then return false end
        return nil
    end


function strg:num() 
        self:flatten()
        return #self.frags[1]
    end


function strg:seg(i) 
        self:flatten()
        return self.frags[1][i]
    end


function strg:each() 
        self:flatten()
        return self.frags[1]:each()
    end


function strg:find(c) 
        self:flatten()
        return self.frags[1]:find(c)
    end


function strg:rfind(c) 
        self:flatten()
        return self.frags[1]:rfind(c)
    end


function strg:slice(f, t) 
        self:flatten()
        local s = strg()
        s.frags:push(self.frags[1]:slice(f, t))
        return s
    end


function strg:flatten() 
        self:debuff()
        if (#self.frags == 0) then 
            return self
        end
        
        if (#self.frags == 1) then 
            if (type(self.frags[1]) == "string") then 
                self.frags = array(kseg(self.frags[1]))
            end
            
            return self
        end
        
        local seg = kseg()
        for f, i in self.frags:each() do 
            if (type(f) == "string") then 
                f = kseg(f)
            end
            
            seg = seg + f
        end
        
        self.frags = array(seg)
        return self
    end


function strg:debuff() 
        if self.buff then 
            self.frags:push(self.buff:get())
            self.buff = nil
        end
        
        return self
    end


function strg:lines() 
        self:debuff()
        local ls = array()
        for f in self.frags:each() do 
            if (type(f) ~= "string") then 
                f = f:join()
            end
            
            local sl = kstr.split(f, "\n")
            for s in sl:each() do 
                ls:push(strg(s))
            end
        end
        
        return ls
    end


function strg:__add(s) 
        if s then 
            if not self.buff then 
                self.buff = strbuff:new()
            end
            
            self.buff:put(s)
        end
        
        return self
    end


function strg:__index(k) 
        if (type(k) == "number") then 
            return self:seg(k)
        end
        
        return rawget(self, k)
    end

return strg