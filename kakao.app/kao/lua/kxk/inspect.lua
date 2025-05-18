-- ███  ███   ███   ███████  ████████   ████████   ███████  █████████
-- ███  ████  ███  ███       ███   ███  ███       ███          ███   
-- ███  ███ █ ███  ███████   ████████   ███████   ███          ███   
-- ███  ███  ████       ███  ███        ███       ███          ███   
-- ███  ███   ███  ███████   ███        ████████   ███████     ███   

-- Copyright (c) 2022 Enrique García Cota

class = require "./class"

local rep = string.rep
local match = string.match
local char = string.char
local gsub = string.gsub
local fmt = string.format


function rawpairs(t) return next, t, nil
end


function smartQuote(str) 
    if (match(str, '"') and not match(str, "'")) then 
       return "'" .. str .. "'"
    end
    
    return '"' .. gsub(str, '"', '\\"') .. '"'
end

local shortEscapes = {["\a"] = "\\a", ["\b"] = "\\b", ["\f"] = "\\f", ["\n"] = "\\n", ["\r"] = "\\r", ["\t"] = "\\t", ["\v"] = "\\v", ["\127"] = "\\127"}
local longEscapes = {["\127"] = "\127"}

for i = 0, 31 do 
    local ch = char(i)
    if not shortEscapes[ch] then 
        shortEscapes[ch] = "\\" .. i
        longEscapes[ch] = fmt("\\%03d", i)
    end
end


function escape(str) return gsub(gsub(gsub(str, "\\", "\\\\"), "(%c)%f[0-9]", longEscapes), "%c", shortEscapes)
end

local luaKeywords = {
   ['and'] = true, 
   ['break'] = true, 
   ['do'] = true, 
   ['else'] = true, 
   ['elseif'] = true, 
   ['end'] = true, 
   ['false'] = true, 
   ['for'] = true, 
   ['function'] = true, 
   ['goto'] = true, 
   ['if'] = true, 
   ['in'] = true, 
   ['local'] = true, 
   ['nil'] = true, 
   ['not'] = true, 
   ['or'] = true, 
   ['repeat'] = true, 
   ['return'] = true, 
   ['then'] = true, 
   ['true'] = true, 
   ['until'] = true, 
   ['while'] = true
   }


function isIdentifier(str) 
    return (((type(str) == "string") and str:match("^[_%a][_%a%d]*$")) and not luaKeywords[str])
end


function isSequenceKey(k, sequenceLength) 
    return ((((type(k) == "number") and (math.floor(k) == k)) and (1 <= k)) and (k <= sequenceLength))
end

local typeOrders = {['number'] = 1, ['boolean'] = 2, ['string'] = 3, ['table'] = 4, ['function'] = 5, ['userdata'] = 6, ['thread'] = 7}


function sortKeys(a, b) 
    local ta = type(a)
    local tb = type(b)
    
    if ((ta == tb) and ((ta == 'string') or (ta == 'number'))) then 
       return (a < b)
    end
    
    local dta = (typeOrders[ta] or 100)
    local dtb = (typeOrders[tb] or 100)
    
    return (((dta == dtb) and (ta < tb)) or (dta < dtb))
end


function getKeys(t) 
    local seqLen = 1
    while (t[seqLen] ~= nil) do 
        seqLen = (seqLen + 1)
    end
    
    seqLen = (seqLen - 1)
    
    local keys, keysLen = {}, 0
    for k in rawpairs(t) do 
        if not isSequenceKey(k, seqLen) then 
            keysLen = (keysLen + 1)
            keys[keysLen] = k
        end
    end
    
    table.sort(keys, sortKeys)
    return keys, keysLen, seqLen
end


function countCycles(x, cycles) 
    if (type(x) == "table") then 
        if cycles[x] then 
            cycles[x] = (cycles[x] + 1)
        else 
            cycles[x] = 1
            for k, v in rawpairs(x) do 
                countCycles(k, cycles)
                countCycles(v, cycles)
            end
            
            countCycles(getmetatable(x), cycles)
        end
    end
end


function puts(buf, str) 
    buf.n = (buf.n + 1)
    buf[buf.n] = str
end


local Inspector = class("Inspector")
    Inspector.buf = {n = 0}
    Inspector.ids = {}
    Inspector.cycles = {}
    Inspector.depth = math.huge
    Inspector.level = 0
    Inspector.newline = '\n'
    Inspector.indent = "    "


function Inspector:init(root) 
        countCycles(root, self.cycles)
        
        self:putValue(root)
        
        -- log "Inspector" root
        
        return table.concat(self.buf)
    end


function Inspector:getId(v) 
        local id = self.ids[v]
        local ids = self.ids
        if not id then 
            local tv = type(v)
            id = ((ids[tv] or 0) + 1)
            ids[v], ids[tv] = id, id
        end
        
        return tostring(id)
    end


function Inspector:putValue(v) 
        
        function tabify() puts(self.buf, self.newline .. rep(self.indent, self.level))
        end
        
        local buf = self.buf
        local tv = type(v)
        
        if (tv == 'string') then 
            puts(buf, smartQuote(escape(v)))
        elseif (((((tv == 'number') or (tv == 'boolean')) or (tv == 'nil')) or (tv == 'cdata')) or (tv == 'ctype')) then 
            puts(buf, tostring(v))
        elseif ((tv == 'table') and not self.ids[v]) then 
            local t = v
            
            if (self.level >= self.depth) then 
                puts(buf, '{...}')
            else 
                self.level = (self.level + 1)
                
                if (self.cycles[t] > 1) then 
                    tabify()
                    puts(buf, fmt('<%d>', self:getId(t)))
                end
                
                local keys, keysLen, seqLen = getKeys(t)
                
                for i = 1, (seqLen + keysLen) do 
                    if (i <= seqLen) then 
                        puts(buf, ' ')
                        self:putValue(t[i])
                    else 
                        tabify()
                        local k = keys[(i - seqLen)]
                        if isIdentifier(k) then 
                            puts(buf, k)
                            if (#k < 12) then 
                                puts(buf, rep(" ", (12 - #k)))
                            end
                        else 
                            puts(buf, "[")
                            self:putValue(k)
                            puts(buf, "]")
                        end
                        
                        puts(buf, '  ')
                        self:putValue(t[k])
                    end
                end
                
                local mt = getmetatable(t)
                if (type(mt) == 'table') then 
                    tabify()
                    puts(buf, '<meta> ')
                    self:putValue(mt)
                end
                
                self.level = (self.level - 1)
                
                if (seqLen > 0) then 
                    puts(buf, ' ')
                end
            end
        else 
            if (tv == "function") then 
                puts(buf, "->")
            elseif (tv == "table") then 
                puts(buf, "<" .. self:getId(v) .. ">")
            else 
                puts(buf, fmt('<%s %d>', tv, self:getId(v)))
            end
        end
    end

return function (root) return Inspector(root) end