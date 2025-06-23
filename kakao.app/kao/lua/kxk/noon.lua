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
        if empty(s) then return array() end
        s = strg(s)
        local lines = s:lines()
        return noon.parseLines(lines)
    end


function noon.static.parseLines(lines) 
        local reslt = array()
        local indnt = lines[1]:indent()
        local lastkey = ""
        while (lines:len() > 0) do 
            local line = lines:shift()
            if ((line:number() ~= nil) and is(reslt, array)) then 
                reslt:push(line:number())
            elseif ((line:bool() ~= nil) and is(reslt, array)) then 
                reslt:push(line:bool())
            else 
                local ind = line:indent()
                if ((ind > indnt) and (ind < line:len())) then 
                    local indlines = array()
                    indlines:push(line:slice((ind + 1)))
                    while ((lines:len() > 0) and (lines[1]:indent() >= ind)) do 
                        indlines:push(lines:shift():slice((ind + 1)))
                    end
                    
                    if is(reslt, array) then 
                        local d = {}
                        for _, k in ipairs(reslt) do 
                            d[tostring(k)] = ""
                        end
                        
                        lastkey = tostring(reslt[reslt:len()])
                        reslt = d
                    end
                    
                    reslt[lastkey] = noon.parseLines(indlines)
                else 
                    line:trim()
                    local ddi = line:indexof("  ")
                    local lpi = line:rfind("|")
                    local fpi = line:find("|")
                    if (((ddi > 0) and (ddi > lpi)) and ((lpi > fpi) or (lpi < 1))) then 
                        if is(reslt, array) then 
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
                    else if (line:num() > 0) then 
                        if (line[line:num()] == "|") then 
                            line:pop()
                        end
                        
                        if (line[1] == "|") then 
                            line:shift()
                        end
                        
                        if is(reslt, array) then 
                            reslt:push(tostring(line))
                        else 
                            lastkey = tostring(line)
                        end
                         end
                    end
                end
            end
        end
        
        -- for o p in pairs reslt
        --     write "reslt " o " " p
        return reslt
    end

return noon