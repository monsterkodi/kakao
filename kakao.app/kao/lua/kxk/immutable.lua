--[[
    ███  ██     ██  ██     ██  ███   ███  █████████   ███████   ███████    ███      ████████
    ███  ███   ███  ███   ███  ███   ███     ███     ███   ███  ███   ███  ███      ███     
    ███  █████████  █████████  ███   ███     ███     █████████  ███████    ███      ███████ 
    ███  ███ █ ███  ███ █ ███  ███   ███     ███     ███   ███  ███   ███  ███      ███     
    ███  ███   ███  ███   ███   ███████      ███     ███   ███  ███████    ███████  ████████
--]]


local immutable = class("immutable")
    


function immutable:init(tbl) 
        if (tbl.class == immutable) then 
            return tbl
        end
        
        local d = {}
        if (tbl.class == array) then 
            for v, i in tbl:each() do 
                if ((type(v) == "table") and (v.class ~= immutable)) then 
                    d[i] = immutable(v)
                else 
                    d[i] = v
                end
            end
        elseif (type(tbl) == "table") then 
            for k, v in pairs(tbl) do 
                if ((type(v) == "table") and (v.class ~= immutable)) then 
                    d[k] = immutable(v)
                else 
                    d[k] = v
                end
            end
        end
        
        rawset(self, "_data", d)
        return self
    end


function immutable:__tostring() 
    return tostring(self._data)
    end


function immutable:__index(k) 
    return self._data[k]
    end

function immutable:__pairs() 
    return pairs(self._data)
    end

function immutable:__ipairs() 
    return ipairs(self._data)
    end

function immutable:__newindex(k, v) 
    return error("Cannot modify immutable. trying to set " .. tostring(k) .. " " .. tostring(v) .. "")
    end


function immutable:mut() 
        local mutable = {}
        for k, v in pairs(self._data) do 
            if (type(v) == "table") then 
                mutable[k] = v:mut()
            else 
                mutable[k] = v
            end
        end
        
        return mutable
    end


function immutable:mod() 
        local modifiable = {}
        for k, v in pairs(self._data) do 
            modifiable[k] = v
        end
        
        return modifiable
    end


function immutable:set(k, v) 
        local new_data = self:mod()
        if (type(k) == "table") then 
            for k, v in pairs(tbl) do 
                new_data[k] = v
            end
        else 
            new_data[k] = v
        end
        
        return immutable(new_data)
    end

return immutable