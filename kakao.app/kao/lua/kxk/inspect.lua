-- ███  ███   ███   ███████  ████████   ████████   ███████  █████████
-- ███  ████  ███  ███       ███   ███  ███       ███          ███   
-- ███  ███ █ ███  ███████   ████████   ███████   ███          ███   
-- ███  ███  ████       ███  ███        ███       ███          ███   
-- ███  ███   ███  ███████   ███        ████████   ███████     ███   

-- Copyright (c) 2022 Enrique García Cota


function rawpairs(t) 
    return next, t, nil
end


function smartQuote(str) 
    if (str:match('"') and not str:match("'")) then 
       return "'" .. str .. "'"
    end
    
    return '"' .. string.gsub(str, '"', '\\"') .. '"'
end

local shortEscapes = {["\a"] = "\\a", ["\b"] = "\\b", ["\f"] = "\\f", ["\n"] = "\\n", ["\r"] = "\\r", ["\t"] = "\\t", ["\v"] = "\\v", ["\127"] = "\\127"}
local longEscapes = {["\127"] = "\127"}

for i in iter(0, 31) do 
    local ch = string.char(i)
    if not shortEscapes[ch] then 
        shortEscapes[ch] = "\\" .. i
        longEscapes[ch] = string.format("\\%03d", i)
    end
end


function escape(str) 
    return string.gsub(string.gsub(string.gsub(str, "\\", "\\\\"), "(%c)%f[0-9]", longEscapes), "%c", shortEscapes)
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
            return cycles[x]
        else 
            cycles[x] = 1
            for k, v in rawpairs(x) do 
                countCycles(k, cycles)
                countCycles(v, cycles)
            end
            
            return countCycles(getmetatable(x), cycles)
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
        
        self.buf = strg()
        self:putValue(root)
        -- don't return self here
        return tostring(self.buf)
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
    return ((self.buf + self.newline) + string.rep(self.indent, self.level))
        end
        
        local tv = type(v)
        if (tv == 'string') then 
            self.buf = self.buf + (smartQuote(escape(v)))
            return self.buf
        elseif (((((tv == 'number') or (tv == 'boolean')) or (tv == 'nil')) or (tv == 'cdata')) or (tv == 'ctype')) then 
            self.buf = self.buf + (tostring(v))
            return self.buf
        elseif ((tv == 'table') and not self.ids[v]) then 
            local t = v
            
            if (self.level >= self.depth) then 
                self.buf = self.buf + '{...}'
                return self.buf
            else 
                self.level = (self.level + 1)
                
                if (self.cycles[t] and (self.cycles[t] > 1)) then 
                    tabify()
                    self.buf = self.buf + (string.format('<%d>', self:getId(t)))
                end
                
                local keys, keysLen, seqLen = getKeys(t)
                
                for i in iter(1, (seqLen + keysLen)) do 
                    if (i <= seqLen) then 
                        self.buf = self.buf + ' '
                        self:putValue(t[i])
                    else 
                        tabify()
                        local k = keys[(i - seqLen)]
                        if isIdentifier(k) then 
                            self.buf = self.buf + k
                            if (#k < 12) then 
                                self.buf = self.buf + (string.rep(" ", (12 - #k)))
                            end
                        else 
                            self.buf = self.buf + "["
                            self:putValue(k)
                            self.buf = self.buf + "]"
                        end
                        
                        self.buf = self.buf + '  '
                        self:putValue(t[k])
                    end
                end
                
                local mt = getmetatable(t)
                if (type(mt) == 'table') then 
                    tabify()
                    self.buf = self.buf + '<meta> '
                    self:putValue(mt)
                end
                
                self.level = (self.level - 1)
                
                if (seqLen > 0) then 
                    self.buf = self.buf + ' '
                    return self.buf
                end
            end
        else 
            if (tv == "function") then 
                self.buf = self.buf + "->"
                return self.buf
            elseif (tv == "table") then 
                self.buf = self.buf + ("<" .. self:getId(v) .. ">")
                return self.buf
            else 
                self.buf = self.buf + (string.format('<%s %d>', tv, self:getId(v)))
                return self.buf
            end
        end
    end

return function (root) 
    return Inspector(root)
end