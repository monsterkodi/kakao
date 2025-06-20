--[[
    ███   ███   ███████    ███████   ███   ███
    ████  ███  ███   ███  ███   ███  ████  ███
    ███ █ ███  ███   ███  ███   ███  ███ █ ███
    ███  ████  ███   ███  ███   ███  ███  ████
    ███   ███   ███████    ███████   ███   ███
--]]

local indstr = "    "
local scl = array(' ', '#', '|')


local noon = class("noon")
    


function noon:init(s) 
    return noon.stringify(s)
    end

--  ███████  █████████  ████████   ███  ███   ███   ███████   ███  ████████  ███   ███
-- ███          ███     ███   ███  ███  ████  ███  ███        ███  ███        ███ ███ 
-- ███████      ███     ███████    ███  ███ █ ███  ███  ████  ███  ██████      █████  
--      ███     ███     ███   ███  ███  ███  ████  ███   ███  ███  ███          ███   
-- ███████      ███     ███   ███  ███  ███   ███   ███████   ███  ███          ███   


function noon.static.toString(o, buf, ind, arry, visited) 
        ind = ind or ""
        arry = arry or false
        visited = visited or (array())
        
        
        function escape(k, arry) 
            if (kstr.find(k, '\n') >= 1) then 
                local sp = array(unpack(kstr.split(k, '\n')))
                local es = sp:map(function (s) 
    return escape(s, arry)
end)
                es:unshift('...')
                es:push('...')
                return es:join('\n')
            end
            
            if (((((k == '') or (k == '...')) or scl:has(k:sub(1, 1))) or scl:has(k:sub(#k, #k))) or (arry and (kstr.find(k, "  ") >= 1))) then 
                return '|' .. k .. '|'
            end
            
            return k
        end
        
        if (type(o) == "string") then buf = buf + (escape(o, arry))
        elseif (type(o) == "table") then 
                if visited:has(o) then 
                    buf = buf + "<v>"
                else 
                    visited:push(o)
                    if ((#o > 0) or ((type(o["len"]) == "function") and (o:len() > 0))) then 
                        local l = (((#o > 0) and #o) or o:len())
                        buf = buf + (((((ind ~= '') and arry) and '.') or ''))
                        if (ind ~= '') then 
                            buf = buf + '\n'
                        end
                        
                        for v, i in array.each(o) do 
                            buf = buf + ind
                            noon.toString(v, buf, ind .. indstr, true, visited)
                            if (i < l) then buf = buf + ("\n") end
                        end
                    else 
                        buf = buf + (((arry and '.\n') or (((ind ~= '') and '\n') or '')))
                        local maxKey = 2
                        
                        local keys = array()
                        local ks = dict.keys(o)
                        ks:sort()
                        for _, k in ipairs(ks) do 
                            local ek = escape(k, true)
                            keys:push(array(ek, o[k]))
                            maxKey = max(maxKey, #ek)
                        end
                        
                        maxKey = min(maxKey, 32)
                        
                        for k, i in keys:each() do 
                            buf = buf + ind
                            if (type(k[2]) == "table") then 
                                buf = buf + (k[1])
                            else 
                                buf = buf + (kstr.pad(maxKey, k[1]))
                                buf = buf + ("  ")
                            end
                            
                            noon.toString(k[2], buf, ind .. indstr, false, visited)
                            if (i < #keys) then buf = buf + "\n" end
                        end
                    end
                end
        else 
                buf = buf + (tostring(o))
        end
        
        return buf
    end


function noon.static.stringify(o) 
    return tostring(noon.toString(o, strg()))
    end

-- ████████    ███████   ████████    ███████  ████████
-- ███   ███  ███   ███  ███   ███  ███       ███     
-- ████████   █████████  ███████    ███████   ███████ 
-- ███        ███   ███  ███   ███       ███  ███     
-- ███        ███   ███  ███   ███  ███████   ████████


function noon.static.parse(s) 
        s = strg(s)
        local reslt = array()
        local lines = s:lines()
        local indnt = 0
        for line in lines:each() do 
            if (line:number() ~= nil) then 
                reslt:push(line:number())
            elseif (line:bool() ~= nil) then 
                reslt:push(line:bool())
            else 
                local ind = line:indent()
                if ((ind > indnt) and (ind < line:len())) then 
                    print("indent", indnt, ind, "▸" .. tostring(line) .. "◂")
                else if ((ind < indnt) and (ind < line:len())) then 
                    print("dedent", indnt, ind, line)
                     end
                end
                
                line:trim()
                local ddi = line:find("  ")
                local lpi = line:rfind("|")
                if ((ddi > 0) and (ddi > lpi)) then 
                    if not dict.isdict(reslt) then 
                        reslt = {}
                    end
                    
                    local k = tostring(line:slice(1, (ddi - 1)))
                    local v = line:slice((ddi + 1))
                    v = v:ltrim()
                    if (v:number() ~= nil) then 
                        v = v:number()
                    elseif (v:bool() ~= nil) then 
                        v = v:bool()
                    else 
                        v = tostring(v)
                    end
                    
                    reslt[k] = v
                else 
                    if (line:num() > 0) then 
                        if (line[line:num()] == "|") then 
                            line:pop()
                        end
                        
                        if (line[1] == "|") then 
                            line:shift()
                        end
                        
                        reslt:push(tostring(line))
                    end
                end
            end
        end
        
        -- for o p in pairs reslt
        --     write "reslt " o " " p
        return reslt
    end

return noon