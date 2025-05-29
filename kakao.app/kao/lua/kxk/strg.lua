--[[
     ███████  █████████  ████████    ███████ 
    ███          ███     ███   ███  ███      
    ███████      ███     ███████    ███  ████
         ███     ███     ███   ███  ███   ███
    ███████      ███     ███   ███   ███████ 
--]]

array = require "kxk.array"


local strg = class("strg", array)
    


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
        if ((#self.frags == 0) and self.buff) then 
            return self.buff:get()
        end
        
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
                l = l + #f
            else 
                for s in f:each() do 
                    l = l + #s
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
    end

return strg