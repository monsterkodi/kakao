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


function strg:num() 
        self:flatten()
        return #self.frags[1]
    end


function strg:seg(i) 
        self:flatten()
        return self.frags[1][i]
    end


function strg:flatten() 
        self:debuff()
        local segl = array()
        for f, i in self.frags:each() do 
            if (type(f) == "string") then 
                f = kseg(f)
            end
            
            segl = segl + f
        end
        
        self.frags = array(segl)
        return self.frags
    end


function strg:debuff() 
        if self.buff then 
            self.frags:push(self.buff:get())
            self.buff = nil
            return self.buff
        end
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
        
        local v = rawget(self, k)
        -- log "__index" k, v
        return v
    end

return strg