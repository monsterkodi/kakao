-- ███  ███   ███   ███████  ████████   ████████   ███████  █████████
-- ███  ████  ███  ███       ███   ███  ███       ███          ███   
-- ███  ███ █ ███  ███████   ████████   ███████   ███          ███   
-- ███  ███  ████       ███  ███        ███       ███          ███   
-- ███  ███   ███  ███████   ███        ████████   ███████     ███   

-- Copyright (c) 2022 Enrique García Cota

kxk = require "./kxk"


function rawpairs(t) return next, t, nil
end


function smartQuote(str) 
    if (str:match('"') and not str:match("'")) then 
       return "'" .. str .. "'"
    end
    
    return '"' .. string.gsub(str, '"', '\\"') .. '"'
end

local shortEscapes = {["\a"] = "\\a", ["\b"] = "\\b", ["\f"] = "\\f", ["\n"] = "\\n", ["\r"] = "\\r", ["\t"] = "\\t", ["\v"] = "\\v", ["\127"] = "\\127"}
local longEscapes = {["\127"] = "\127"}

for i = 0, 31 do 
    local ch = string.char(i)
    if not shortEscapes[ch] then 
        shortEscapes[ch] = "\\" .. i
        longEscapes[ch] = string.fmt("\\%03d", i)
    end
end


function escape(str) return string.gsub(string.gsub(string.gsub(str, "\\", "\\\\"), "(%c)%f[0-9]", longEscapes), "%c", shortEscapes)
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


local Inspector = class("Inspector")
    Inspector.depth = math.huge
    Inspector.newline = '\n'
    Inspector.indent = "    "


function Inspector:init(root) 
        self.ids = {}
        self.cycles = {}
        self.level = 0
        countCycles(root, self.cycles)
        
        self.buf = strbuff:new()
        self:putValue(root)
        local buf = self.buf
        return buf:get()
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
        
        function tabify() 
                 local buf = self.buf ; buf:put(self.newline .. string.rep(self.indent, self.level))
        end
        
        local tv = type(v)
        local buf = self.buf
        if (tv == 'string') then 
            buf:put(smartQuote(escape(v)))
        elseif (((((tv == 'number') or (tv == 'boolean')) or (tv == 'nil')) or (tv == 'cdata')) or (tv == 'ctype')) then 
            buf:put(tostring(v))
        elseif ((tv == 'table') and not self.ids[v]) then 
            local t = v
            
            if (self.level >= self.depth) then 
                buf:put('{...}')
            else 
                self.level = (self.level + 1)
                
                if (self.cycles[t] > 1) then 
                    tabify()
                    buf:put(string.fmt('<%d>', self:getId(t)))
                end
                
                local keys, keysLen, seqLen = getKeys(t)
                
                for i = 1, (seqLen + keysLen) do 
                    if (i <= seqLen) then 
                        buf:put(' ')
                        self:putValue(t[i])
                    else 
                        tabify()
                        local k = keys[(i - seqLen)]
                        if isIdentifier(k) then 
                            buf:put(k)
                            if (#k < 12) then 
                                buf:put(string.rep(" ", (12 - #k)))
                            end
                        else 
                            buf:put("[")
                            self:putValue(k)
                            buf:put("]")
                        end
                        
                        buf:put('  ')
                        self:putValue(t[k])
                    end
                end
                
                local mt = getmetatable(t)
                if (type(mt) == 'table') then 
                    tabify()
                    buf:put('<meta> ')
                    self:putValue(mt)
                end
                
                self.level = (self.level - 1)
                
                if (seqLen > 0) then 
                    buf:put(' ')
                end
            end
        else 
            if (tv == "function") then 
                buf:put("->")
            elseif (tv == "table") then 
                buf:put("<" .. self:getId(v) .. ">")
            else 
                buf:put(string.fmt('<%s %d>', tv, self:getId(v)))
            end
        end
    end

return function (root) return Inspector(root) end