--[[
     0000000  0000000     0000000
    000       000   000  000     
    0000000   000   000  0000000 
         000  000   000       000
    0000000   0000000    0000000 
--]]


local sds = class("sds")
    

--  0000000   00000000  000000000
-- 000        000          000
-- 000  0000  0000000      000
-- 000   000  000          000
--  0000000   00000000     000

-- accepts an object and a keypath as a list or string and a value
-- returns the value at keypath or undefined


function sds.static.get(o, keypath, default) 
        if not o then return default end
        
        if is(keypath, "string") then 
            keypath = kstr.split(keypath, '▸')
        end
        
        if (keypath:len() <= 0) then return default end
        
        local kp = array.from(keypath)
        
        while (kp:len() >= 1) do 
            local k = kp:shift()
            if array.isarr(o) then 
                o = o[tonumber(k)]
            else 
                o = o[k]
            end
            
            if not o then return default end
        end
        
        return o
    end

--  0000000  00000000  000000000
-- 000       000          000   
-- 0000000   0000000      000   
--      000  000          000   
-- 0000000   00000000     000   

-- accepts an object, a keypath as an array or string and a value
-- returns the object with value set at keypath


function sds.static.set(obj, keypath, value) 
        if is(keypath, "string") then 
            keypath = kstr.split(keypath, '▸')
        end
        
        local kp = array.from(keypath)
        
        local o = obj
        
        while (kp:len() > 1) do 
            local k = kp:shift()
            if array.isarr(o) then 
                k = int(k)
            end
            
            if o[k] then 
                o = o[k]
            else 
                if is(o, "table") then 
                    o[k] = {}
                    o = o[k]
                end
            end
        end
        
        if ((kp:len() == 1) and o) then 
            local k = kp[1]
            if array.isarr(o) then 
                k = int(k)
            end
            
            o[k] = value
        else 
            warn('no keypath?', kp, keypath)
        end
        
        return obj
    end

--[[
    0000000    00000000  000      
    000   000  000       000      
    000   000  0000000   000      
    000   000  000       000      
    0000000    00000000  0000000  
    --]]

-- accepts an object and a keypath as an array or string
-- returns the object with value removed at keypath


function sds.static.del(obj, keypath) 
        if is(keypath, "string") then 
            keypath = kstr.split(keypath, '▸')
        end
        
        local kp = array.from(keypath)
        
        local o = obj
        
        while (kp:len() > 1) do 
            local k = kp:shift()
            o = o[k]
            if not o then break end
        end
        
        if ((kp:len() == 1) and o) then 
            if is(o, array) then 
                o:splice(int(kp[1]), 1)
            elseif is(o, "table") then 
                o[kp[1]] = nil
            end
        end
        
        return obj
    end

return sds