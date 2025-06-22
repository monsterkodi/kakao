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
        if is(tbl, array) then 
            for v, i in tbl:each() do 
                if ((type(v) == "table") and (v.class ~= immutable)) then 
                    d[i] = immutable(v)
                else 
                    d[i] = v
                end
            end
        elseif (type(tbl) == "table") then 
            if (#tbl > 0) then 
                for i, v in ipairs(tbl) do 
                    if ((type(v) == "table") and (v.class ~= immutable)) then 
                        d[i] = immutable(v)
                    else 
                        d[i] = v
                    end
                end
            else 
                for k, v in pairs(tbl) do 
                    if (((type(v) ~= "function") and (string.sub(k, 1, 2) ~= "__")) and (k ~= "class")) then 
                        if ((type(v) == "table") and (v.class ~= immutable)) then 
                            d[k] = immutable(v)
                        else 
                            d[k] = v
                        end
                    end
                end
            end
        end
        
        rawset(self, "__data", d)
        return self
    end


function immutable:__tostring() 
    return noon(self.__data)
    end


function immutable:__index(k) 
    return self.__data[k]
    end

function immutable:__newindex(k, v) 
    return error("Cannot modify immutable. trying to set " .. tostring(k) .. " " .. tostring(v) .. "")
    end


function immutable:each() 
    return array.each(self.__data)
    end


function immutable:slice(first, last) 
        local s = array()
        if (first > #self.__data) then return s end
        if (last == nil) then last = #self.__data
        else last = min(#self.__data, last)
        end
        
        if ((last < 1) or (last < first)) then return s end
        for i = first, (last + 1)-1 do 
            s:push(self.__data[i])
        end
        
        return s
    end


function immutable:len() 
    return #self.__data
    end

-- mut: ->
--     
--     mutable = {}
--     for k v of @__data
--         if type(v) == "table" 
--             mutable[k] = v∙mut()
--         else
--             mutable[k] = v
--     mutable


function immutable:arr(deep) 
        deep = deep or true
        
        local mutable = array()
        for k, v in pairs(self.__data) do 
            if ((type(v) == "table") and deep) then 
                mutable[k] = v:arr()
            else 
                mutable[k] = v
            end
        end
        
        return mutable
    end


function immutable:mod() 
        local modifiable = {}
        for k, v in pairs(self.__data) do 
            modifiable[k] = v
        end
        
        return modifiable
    end


function immutable:set(k, v) 
        local newdata = self:mod()
        if (type(k) == "table") then 
            for k, v in pairs(tbl) do 
                newdata[k] = v
            end
        else 
            newdata[k] = v
        end
        
        -- write "SET #{k} #{v}"
        -- write "IMM #{dict.str(newdata)}"
        return immutable(newdata)
    end

return immutable