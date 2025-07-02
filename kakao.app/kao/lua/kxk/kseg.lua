array = require "kxk.array"


local kseg = class("kseg", array)
    


function kseg:init(s) 
        if s then 
            if (type(s) == "string") then 
                    if (#s > 0) then 
                        for i, seg in self:codes(s) do 
                            self:push(seg)
                        end
                    end
            elseif (type(s) == "table") then 
                    -- if s.class == kseg
                    --     ⮐  s
                    for g in array.each(s) do 
                        self:push(g)
                    end
            else 
                    print(">>?????", type(s))
            end
        end
        return self
    end


function kseg.static.from(a) 
    return kseg(a)
    end

function kseg.static.segls(any) 
        if is(any, "string") then 
            return kstr.lines(any):map(function (l) 
    return kseg(l)
end)
        end
        
        if is(any, "table") then 
            return array.map(any, function (l) 
    return kseg(l)
end)
        end
        
        write("EMPTY")
        return array()
    end


function kseg:eql(o) 
        if (#o ~= #self) then return false end
        for i, c in ipairs(self) do 
            if (c ~= o[i]) then return false end
        end
        
        return true
    end


function kseg.static.eql(a, b) 
    return kseg(a):eql(kseg(b))
    end


function kseg.static.codepoint(rune) 
        local b1, b2, b3, b4 = string.byte(rune, 1, 4)
        
        if not b1 then return nil end
        
        if (b1 < 0x80) then 
            return b1
        elseif ((b1 >= 0xC0) and (b1 < 0xE0)) then 
            return (((b1 - 0xC0) * 0x40) + (b2 - 0x80))
        elseif ((b1 >= 0xE0) and (b1 < 0xF0)) then 
            return ((((b1 - 0xE0) * 0x1000) + ((b2 - 0x80) * 0x40)) + (b3 - 0x80))
        elseif ((b1 >= 0xF0) and (b1 < 0xF8)) then 
            return (((((b1 - 0xF0) * 0x40000) + ((b2 - 0x80) * 0x1000)) + ((b3 - 0x80) * 0x40)) + (b4 - 0x80))
        else 
            return error("Invalid UTF-8 sequence")
        end
    end


function kseg:decode(str, startPos) 
        startPos = startPos or 1
        
        local b1 = str:byte(startPos, startPos)
        
        if (b1 < 0x80) then 
            return startPos, startPos
        end
        
        if ((b1 > 0xF4) or (b1 < 0xC2)) then 
            return nil
        end
        
        local bytes = ((((b1 >= 0xF0) and 3) or ((b1 >= 0xE0) and 2)) or ((b1 >= 0xC0) and 1))
        
        local endPos = (startPos + bytes)
        
        local b2 = str:byte((startPos + 1), endPos)
        for _, bX in ipairs({b2}) do 
            if (bit.band(bX, 0xC0) ~= 0x80) then 
                return nil
            end
        end
        
        return startPos, endPos
    end


function kseg:codes(str) 
        local i = 1
        
        return function () 
            if (i > #str) then return nil end
            
            local startPos, endPos = self:decode(str, i)
            
            if not startPos then error("invalid UTF-8 code", 2) end
            
            i = (endPos + 1)
            
            return startPos, string.sub(str, startPos, endPos)
        end
    end


function kseg:__tostring() 
    return table.concat(self, "")
    end


function kseg.static.str(s) 
        if is(s, "string") then return s end
        if empty(s) then return "" end
        if ((#s > 0) or (s:len() > 0)) then 
            local ls = array.map(s, function (c) 
    return kseg.str(c)
end)
            if (type(s[1]) ~= "string") then 
                return ls:join("\n")
            end
            
            return ls:join("")
        end
        
        return tostring(s)
    end


function kseg:rpad(l, c) 
        c = c or ' '
        
        while (#self < l) do self:push(c) end
        return self
    end


function kseg.static.rpad(s, l, c) 
    c = c or ' '
    
    return kseg(s):rpad(l, c)
    end


function kseg:rtrim(c) 
        c = c or " \n"
        
        local s = kseg(c)
        while ((#self > 0) and s:has(self[#self])) do self:pop() end
        return self
    end


function kseg:ltrim(c) 
        c = c or " \n"
        
        local s = kseg(c)
        while ((#self > 0) and s:has(self[1])) do self:shift() end
        return self
    end


function kseg:trim(c) 
    c = c or " \n"
    
    return self:rtrim(c):ltrim(c)
    end


function kseg.static.trim(s, c) 
    c = c or " \n"
    
    return kseg(s):trim(c)
    end


function kseg.static.detab(s, tw) 
        tw = tw or 4
        
        local a = kseg(s)
        
        if empty(a) then return a end
        
        local i = 1
        while (i <= #a) do 
            if (a[i] == '\t') then 
                local n = (tw - ((i - 1) % tw))
                local spcs = kseg.rep(n)
                a:splice(i, 1, spcs)
                i = i + n
            else 
                i = i + 1
            end
        end
        
        return a
    end


function kseg.static.join(...) 
        local r = kseg()
        local args = {...}
        for _, a in ipairs(args) do 
            r = r + (kseg(a))
        end
        
        return r
    end


function kseg:lcount(c) 
        if (#self <= 0) then return 0 end
        local cnt = 0
        for i in iter(1, #self) do 
            if (self[i] == c) then 
                cnt = cnt + 1
            else 
                break
            end
        end
        
        return cnt
    end


function kseg:headCount(c) 
        if (#self <= 0) then return 0 end
        local cnt = 0
        for i, s in ipairs(self) do 
            if (s == c) then 
                cnt = cnt + 1
            else 
                break
            end
        end
        
        return cnt
    end


function kseg:tailCount(c) 
        for i = 0, #self-1 do 
            if (self[(#self - i)] ~= c) then return i end
        end
        
        return #self
    end


function kseg:headCountWord() 
        for i, s in ipairs(self) do 
            if not string.match(s, "%w+") then return (i - 1) end
        end
        
        return #self
    end


function kseg:headCountChunk() 
        for i, s in ipairs(self) do 
            if string.match(s, "%s+") then return (i - 1) end
        end
        
        return #self
    end


function kseg:headCountTurd() 
        for i, s in ipairs(a) do 
            if string.match(s, "[%s%w]+") then return (i - 1) end
        end
        
        return #self
    end


function kseg:tailCountTurd() 
        for i = 0, #self-1 do 
            if string.match(self[(#self - i)], "[%w%s]+") then return i end
        end
        
        return #self
    end


function kseg:tailCountWord() 
        for i = 0, #self-1 do 
            if not string.match(self[(#self - i)], "%w+") then return i end
        end
        
        return #self
    end


function kseg:tailCountChunk() 
        for i = 0, #self-1 do 
            if string.match(self[(#self - i)], "%s+") then return i end
        end
        
        return #self
    end


function kseg.static.headCount(a, c) 
    return kseg(a):headCount(c)
    end

function kseg.static.tailCount(a, c) 
    return kseg(a):tailCount(c)
    end


function kseg.static.headCountWord(a) 
    return kseg(a):headCountWord()
    end

function kseg.static.headCountChunk(a) 
    return kseg(a):headCountChunk()
    end

function kseg.static.headCountTurd(a) 
    return kseg(a):headCountTurd()
    end

function kseg.static.tailCountTurd(a) 
    return kseg(a):tailCountTurd()
    end

function kseg.static.tailCountChunk(a) 
    return kseg(a):tailCountChunk()
    end

function kseg.static.tailCountWord(a) 
    return kseg(a):tailCountWord()
    end


function kseg:startsWith(prefix) 
        if (empty(self) or empty(prefix)) then return false end
        if (prefix.class ~= kseg) then 
            prefix = kseg(prefix)
        end
        
        if (#self < #prefix) then return false end
        
        return self:slice(1, #prefix):eql(prefix)
    end


function kseg:endsWith(postfix) 
        if (empty(self) or empty(postfix)) then return false end
        if (postfix.class ~= kseg) then 
            postfix = kseg(postfix)
        end
        
        if (#self < #postfix) then return false end
        
        return self:slice(((#self - #postfix) + 1)):eql(postfix)
    end


function kseg:indexof(s, i) 
        if (s.class ~= kseg) then s = kseg(s) end
        return array.indexof(self, s, i)
    end


function kseg:rindexof(s) 
        if (s.class ~= kseg) then s = kseg(s) end
        return array.rindexof(self, s)
    end


function kseg.static.startsWith(a, prefix) 
        if (a.class ~= kseg) then a = kseg(a) end
        return a:startsWith(prefix)
    end


function kseg.static.endsWith(a, postfix) 
        if (a.class ~= kseg) then a = kseg(a) end
        return a:endsWith(postfix)
    end


function kseg:indent() 
    return self:lcount(" ")
    end

function kseg.static.indent(a) 
        if (a.class ~= kseg) then a = kseg(a) end
        return a:indent()
    end


function kseg:splitAtIndent() 
        local i = self:indent()
        return self:slice(1, (i - 1)), self:slice(i)
    end


function kseg.static.splitAtIndent(a) 
        if (a.class ~= kseg) then a = kseg(a) end
        return a:splitAtIndent()
    end

--find: c ->
--    
--    ⮐  -1 if @len <= 0
--    if c.class != kseg ➜ c = kseg(c)
--    ⮐  -1 if c.len >= @len
--    for i in 1..@len+1-c.len
--        for j in 1..c.len
--            if c[j] != @[i+j-1]
--                break 
--            if j == c.len
--                ⮐  i
--    -1
--    
--rfind: c ->
--    
--    ⮐  -1 if @len <= 0
--    if c.class != kseg ➜ c = kseg(c)
--    ⮐  -1 if c.len >= @len
--    for i in @len+1-c.len..1
--        for j in 1..c.len
--            if c[j] != @[i+j-1]
--                break 
--            if j == c.len
--                ⮐  i
--    -1


function kseg.static.width(s) 
        if empty(s) then return 0 end
        if is(s, "string") then 
            s = kseg(s)
        end
        
        local w = 0
        for seg in array.each(s) do 
            w = w + (wcwidth(kseg.codepoint(seg)))
        end
        
        return w
    end

-- number of columns occupied by segments with index smaller than segi


function kseg:widthAtSegi(segi) 
        if (segi > 1) then 
            return kseg.width(self:slice(1, (segi - 1)))
        end
        
        return 0
    end


function kseg.static.widthAtSegi(s, segi) 
    return kseg(s):widthAtSegi(segi)
    end

-- index of current segment if column cuts segment


function kseg:segiAtWidth(w) 
        w = min(w, ((#self * 2) + 1))
        local i = 1
        local s = 0
        while (i <= #self) do 
            s = s + (kseg.width(self[i]))
            if (s >= w) then return i end
            i = i + 1
        end
        
        return (#self + 1)
    end


function kseg.static.segiAtWidth(a, w) 
    return kseg(a):segiAtWidth(w)
    end

-- index of next segment if column cuts segment


function kseg:indexAtWidth(w) 
        local i = 1
        local s = 0
        while (i <= #self) do 
            local cw = kseg.width(self[i])
            if (((cw > 1) and ((s + cw) >= w)) and ((s + 1) < w)) then 
                return (i + 1)
            end
            
            s = s + cw
            if (s >= w) then 
                return i
            end
            
            i = i + 1
        end
        
        return i
    end


function kseg.static.indexAtWidth(s, w) 
    return kseg(s):indexAtWidth(w)
    end


function kseg.static.rep(n, s) 
        s = s or ' '
        
        if (n <= 0) then return kseg() end
        s = kseg(s)
        local a = kseg()
        for i in iter(1, n) do 
            a = a + s
        end
        
        return a
    end


function kseg:spanForClosestWordAtColumn(c) 
        local segi = self:segiAtWidth(c)
        local left = self:slice(1, (segi - 1))
        local right = self:slice(segi)
        
        -- write "spanForClosestWordAtColumn " @ " " c " left|" left "| right|" right "|"
        
        local ls = left:tailCount(' ')
        local rs = right:headCount(' ')
        
        local lw = left:tailCountWord()
        local rw = right:headCountWord()
        
        local ll = #left
        local rl = #right
        
        local s = nil
        if ((ls == ll) and (rs == rl)) then s = array(c, c)
        elseif ((ls == 0) and (rs == 0)) then s = array((c - lw), (c + rw))
        elseif (ls == ll) then local rcw = right:slice((rs + 1)):headCountWord() ; s = array(((ll + rs) + 1), (((ll + rs) + rcw) + 1))
        elseif (rs == rl) then local tcw = left:slice(1, (ll - ls)):tailCountWord() ; s = array((((ll - ls) - tcw) + 1), ((ll - ls) + 1))
        elseif (ls == rs) then s = left:spanForClosestWordAtColumn((#left + 1))
        elseif (ls < rs) then s = left:spanForClosestWordAtColumn((#left + 1))
        elseif (ls > rs) then s = right:spanForClosestWordAtColumn(1) ; s[1] = s[1] + ((c - 1)) ; s[2] = s[2] + ((c - 1))
        end
        
        return s
    end


function kseg.static.spanForClosestWordAtColumn(a, c) 
    return kseg(a):spanForClosestWordAtColumn(c)
    end

--[[
         0000000  000   000  000   000  000   000  000   000   0000000  
        000       000   000  000   000  0000  000  000  000   000       
        000       000000000  000   000  000 0 000  0000000    0000000   
        000       000   000  000   000  000  0000  000  000        000  
         0000000  000   000   0000000   000   000  000   000  0000000   
         
        returns chunks for any
    
        chunk:
            chunk: string           # string without any whitespace (joined graphemes)
            index: int              # start index in the grapheme list of any
            segl:  list of strings  # list of graphemes without any whitespace
    --]]


function kseg.static.chunks(any) 
        
        function filt(s) 
    return not kstr.has(' \t\r\n', s)
        end
        return kseg.infos(any, 'chunk', filt)
    end

--[[
        000   000   0000000   00000000   0000000     0000000  
        000 0 000  000   000  000   000  000   000  000       
        000000000  000   000  0000000    000   000  0000000   
        000   000  000   000  000   000  000   000       000  
        00     00   0000000   000   000  0000000    0000000   
        
        returns words for any
    
        word:
            word:  string           # string without any whitespace or punctuation
            index: int              # index in the grapheme list of any
            segl:  list of strings  # list of graphemes without any whitespace or punctuation
    --]]


function kseg.static.words(any) 
        
        function filt(s) 
    return string.match(s, "^%w+$")
        end
        return kseg.infos(any, 'word', filt)
    end

--[[
        000  000   000  00000000   0000000    0000000  
        000  0000  000  000       000   000  000       
        000  000 0 000  000000    000   000  0000000   
        000  000  0000  000       000   000       000  
        000  000   000  000        0000000   0000000   
        
        list of infos for any, key and a test function
    
        each info has these properties:
            key:   string           # string where each grapheme satisfies the test
            index: int              # index in the grapheme list of any
            segl:  list of strings  # list of graphemes where each grapheme satisfies the test
        
        any can be:
            a string
            a list of strings
            a list of list of strings
    --]]


function kseg.static.infos(any, key, filt) 
        if empty(any) then return array() end
        
        local infos = array()
        local info = nil
        local turd = true
        
        for g, i in kseg(any):each() do 
            if turd then 
                if filt(g) then 
                    info = {}
                    info[key] = g
                    info.index = i
                    info.segl = kseg(g)
                    turd = false
                end
            else 
                if not filt(g) then 
                    turd = true
                    info[key] = kseg.str(info.segl)
                    infos:push(info)
                else 
                    info.segl:push(g)
                end
            end
        end
        
        if not turd then 
            info[key] = kseg.str(info.segl)
            infos:push(info)
        end
        
        return infos
    end

-- https://github.com/joshuarubin/wcwidth9            

local wcwidth_private = array(array(0x00e000, 0x00f8ff), array(0x0f0000, 0x0ffffd), array(0x100000, 0x10fffd))

local wcwidth_nonprint = array(array(0x0000, 0x001f), array(0x007f, 0x009f), array(0x00ad, 0x00ad), array(0x070f, 0x070f), array(0x180b, 0x180e), array(0x200b, 0x200f), array(0x2028, 0x2029), array(0x202a, 0x202e), array(0x206a, 0x206f), array(0xd800, 0xdfff), array(0xfeff, 0xfeff), array(0xfff9, 0xfffb), array(0xfffe, 0xffff))

local wcwidth_combining = array(array(0x0300, 0x036f), array(0x0483, 0x0489), array(0x0591, 0x05bd), array(0x05bf, 0x05bf), array(0x05c1, 0x05c2), array(0x05c4, 0x05c5), array(0x05c7, 0x05c7), array(0x0610, 0x061a), array(0x064b, 0x065f), array(0x0670, 0x0670), array(0x06d6, 0x06dc), array(0x06df, 0x06e4), array(0x06e7, 0x06e8), array(0x06ea, 0x06ed), array(0x0711, 0x0711), array(0x0730, 0x074a), array(0x07a6, 0x07b0), array(0x07eb, 0x07f3), array(0x0816, 0x0819), array(0x081b, 0x0823), array(0x0825, 0x0827), array(0x0829, 0x082d), array(0x0859, 0x085b), array(0x08d4, 0x08e1), array(0x08e3, 0x0903), array(0x093a, 0x093c), array(0x093e, 0x094f), array(0x0951, 0x0957), array(0x0962, 0x0963), array(0x0981, 0x0983), array(0x09bc, 0x09bc), array(0x09be, 0x09c4), array(0x09c7, 0x09c8), array(0x09cb, 0x09cd), array(0x09d7, 0x09d7), array(0x09e2, 0x09e3), array(0x0a01, 0x0a03), array(0x0a3c, 0x0a3c), array(0x0a3e, 0x0a42), array(0x0a47, 0x0a48), array(0x0a4b, 0x0a4d), array(0x0a51, 0x0a51), array(0x0a70, 0x0a71), array(0x0a75, 0x0a75), array(0x0a81, 0x0a83), array(0x0abc, 0x0abc), array(0x0abe, 0x0ac5), array(0x0ac7, 0x0ac9), array(0x0acb, 0x0acd), array(0x0ae2, 0x0ae3), array(0x0b01, 0x0b03), array(0x0b3c, 0x0b3c), array(0x0b3e, 0x0b44), array(0x0b47, 0x0b48), array(0x0b4b, 0x0b4d), array(0x0b56, 0x0b57), array(0x0b62, 0x0b63), array(0x0b82, 0x0b82), array(0x0bbe, 0x0bc2), array(0x0bc6, 0x0bc8), array(0x0bca, 0x0bcd), array(0x0bd7, 0x0bd7), array(0x0c00, 0x0c03), array(0x0c3e, 0x0c44), array(0x0c46, 0x0c48), array(0x0c4a, 0x0c4d), array(0x0c55, 0x0c56), array(0x0c62, 0x0c63), array(0x0c81, 0x0c83), array(0x0cbc, 0x0cbc), array(0x0cbe, 0x0cc4), array(0x0cc6, 0x0cc8), array(0x0cca, 0x0ccd), array(0x0cd5, 0x0cd6), array(0x0ce2, 0x0ce3), array(0x0d01, 0x0d03), array(0x0d3e, 0x0d44), array(0x0d46, 0x0d48), array(0x0d4a, 0x0d4d), array(0x0d57, 0x0d57), array(0x0d62, 0x0d63), array(0x0d82, 0x0d83), array(0x0dca, 0x0dca), array(0x0dcf, 0x0dd4), array(0x0dd6, 0x0dd6), array(0x0dd8, 0x0ddf), array(0x0df2, 0x0df3), array(0x0e31, 0x0e31), array(0x0e34, 0x0e3a), array(0x0e47, 0x0e4e), array(0x0eb1, 0x0eb1), array(0x0eb4, 0x0eb9), array(0x0ebb, 0x0ebc), array(0x0ec8, 0x0ecd), array(0x0f18, 0x0f19), array(0x0f35, 0x0f35), array(0x0f37, 0x0f37), array(0x0f39, 0x0f39), array(0x0f3e, 0x0f3f), array(0x0f71, 0x0f84), array(0x0f86, 0x0f87), array(0x0f8d, 0x0f97), array(0x0f99, 0x0fbc), array(0x0fc6, 0x0fc6), array(0x102b, 0x103e), array(0x1056, 0x1059), array(0x105e, 0x1060), array(0x1062, 0x1064), array(0x1067, 0x106d), array(0x1071, 0x1074), array(0x1082, 0x108d), array(0x108f, 0x108f), array(0x109a, 0x109d), array(0x135d, 0x135f), array(0x1712, 0x1714), array(0x1732, 0x1734), array(0x1752, 0x1753), array(0x1772, 0x1773), array(0x17b4, 0x17d3), array(0x17dd, 0x17dd), array(0x180b, 0x180d), array(0x1885, 0x1886), array(0x18a9, 0x18a9), array(0x1920, 0x192b), array(0x1930, 0x193b), array(0x1a17, 0x1a1b), array(0x1a55, 0x1a5e), array(0x1a60, 0x1a7c), array(0x1a7f, 0x1a7f), array(0x1ab0, 0x1abe), array(0x1b00, 0x1b04), array(0x1b34, 0x1b44), array(0x1b6b, 0x1b73), array(0x1b80, 0x1b82), array(0x1ba1, 0x1bad), array(0x1be6, 0x1bf3), array(0x1c24, 0x1c37), array(0x1cd0, 0x1cd2), array(0x1cd4, 0x1ce8), array(0x1ced, 0x1ced), array(0x1cf2, 0x1cf4), array(0x1cf8, 0x1cf9), array(0x1dc0, 0x1df5), array(0x1dfb, 0x1dff), array(0x20d0, 0x20f0), array(0x2cef, 0x2cf1), array(0x2d7f, 0x2d7f), array(0x2de0, 0x2dff), array(0x302a, 0x302f), array(0x3099, 0x309a), array(0xa66f, 0xa672), array(0xa674, 0xa67d), array(0xa69e, 0xa69f), array(0xa6f0, 0xa6f1), array(0xa802, 0xa802), array(0xa806, 0xa806), array(0xa80b, 0xa80b), array(0xa823, 0xa827), array(0xa880, 0xa881), array(0xa8b4, 0xa8c5), array(0xa8e0, 0xa8f1), array(0xa926, 0xa92d), array(0xa947, 0xa953), array(0xa980, 0xa983), array(0xa9b3, 0xa9c0), array(0xa9e5, 0xa9e5), array(0xaa29, 0xaa36), array(0xaa43, 0xaa43), array(0xaa4c, 0xaa4d), array(0xaa7b, 0xaa7d), array(0xaab0, 0xaab0), array(0xaab2, 0xaab4), array(0xaab7, 0xaab8), array(0xaabe, 0xaabf), array(0xaac1, 0xaac1), array(0xaaeb, 0xaaef), array(0xaaf5, 0xaaf6), array(0xabe3, 0xabea), array(0xabec, 0xabed), array(0xfb1e, 0xfb1e), array(0xfe00, 0xfe0f), array(0xfe20, 0xfe2f))

local wcwidth_combining2 = array(array(0x101fd, 0x101fd), array(0x102e0, 0x102e0), array(0x10376, 0x1037a), array(0x10a01, 0x10a03), array(0x10a05, 0x10a06), array(0x10a0c, 0x10a0f), array(0x10a38, 0x10a3a), array(0x10a3f, 0x10a3f), array(0x10ae5, 0x10ae6), array(0x11000, 0x11002), array(0x11038, 0x11046), array(0x1107f, 0x11082), array(0x110b0, 0x110ba), array(0x11100, 0x11102), array(0x11127, 0x11134), array(0x11173, 0x11173), array(0x11180, 0x11182), array(0x111b3, 0x111c0), array(0x111ca, 0x111cc), array(0x1122c, 0x11237), array(0x1123e, 0x1123e), array(0x112df, 0x112ea), array(0x11300, 0x11303), array(0x1133c, 0x1133c), array(0x1133e, 0x11344), array(0x11347, 0x11348), array(0x1134b, 0x1134d), array(0x11357, 0x11357), array(0x11362, 0x11363), array(0x11366, 0x1136c), array(0x11370, 0x11374), array(0x11435, 0x11446), array(0x114b0, 0x114c3), array(0x115af, 0x115b5), array(0x115b8, 0x115c0), array(0x115dc, 0x115dd), array(0x11630, 0x11640), array(0x116ab, 0x116b7), array(0x1171d, 0x1172b), array(0x11c2f, 0x11c36), array(0x11c38, 0x11c3f), array(0x11c92, 0x11ca7), array(0x11ca9, 0x11cb6), array(0x16af0, 0x16af4), array(0x16b30, 0x16b36), array(0x16f51, 0x16f7e), array(0x16f8f, 0x16f92), array(0x1bc9d, 0x1bc9e), array(0x1d165, 0x1d169), array(0x1d16d, 0x1d172), array(0x1d17b, 0x1d182), array(0x1d185, 0x1d18b), array(0x1d1aa, 0x1d1ad), array(0x1d242, 0x1d244), array(0x1da00, 0x1da36), array(0x1da3b, 0x1da6c), array(0x1da75, 0x1da75), array(0x1da84, 0x1da84), array(0x1da9b, 0x1da9f), array(0x1daa1, 0x1daaf), array(0x1e000, 0x1e006), array(0x1e008, 0x1e018), array(0x1e01b, 0x1e021), array(0x1e023, 0x1e024), array(0x1e026, 0x1e02a), array(0x1e8d0, 0x1e8d6), array(0x1e944, 0x1e94a), array(0xe0100, 0xe01ef))

local wcwidth_ambiguous = array(array(0x00a1, 0x00a1), array(0x00a4, 0x00a4), array(0x00a7, 0x00a8), array(0x00aa, 0x00aa), array(0x00ad, 0x00ae), array(0x00b0, 0x00b4), array(0x00b6, 0x00ba), array(0x00bc, 0x00bf), array(0x00c6, 0x00c6), array(0x00d0, 0x00d0), array(0x00d7, 0x00d8), array(0x00de, 0x00e1), array(0x00e6, 0x00e6), array(0x00e8, 0x00ea), array(0x00ec, 0x00ed), array(0x00f0, 0x00f0), array(0x00f2, 0x00f3), array(0x00f7, 0x00fa), array(0x00fc, 0x00fc), array(0x00fe, 0x00fe), array(0x0101, 0x0101), array(0x0111, 0x0111), array(0x0113, 0x0113), array(0x011b, 0x011b), array(0x0126, 0x0127), array(0x012b, 0x012b), array(0x0131, 0x0133), array(0x0138, 0x0138), array(0x013f, 0x0142), array(0x0144, 0x0144), array(0x0148, 0x014b), array(0x014d, 0x014d), array(0x0152, 0x0153), array(0x0166, 0x0167), array(0x016b, 0x016b), array(0x01ce, 0x01ce), array(0x01d0, 0x01d0), array(0x01d2, 0x01d2), array(0x01d4, 0x01d4), array(0x01d6, 0x01d6), array(0x01d8, 0x01d8), array(0x01da, 0x01da), array(0x01dc, 0x01dc), array(0x0251, 0x0251), array(0x0261, 0x0261), array(0x02c4, 0x02c4), array(0x02c7, 0x02c7), array(0x02c9, 0x02cb), array(0x02cd, 0x02cd), array(0x02d0, 0x02d0), array(0x02d8, 0x02db), array(0x02dd, 0x02dd), array(0x02df, 0x02df), array(0x0391, 0x03a1), array(0x03a3, 0x03a9), array(0x03b1, 0x03c1), array(0x03c3, 0x03c9), array(0x0401, 0x0401), array(0x0410, 0x044f), array(0x0451, 0x0451), array(0x2010, 0x2010), array(0x2013, 0x2016), array(0x2018, 0x2019), array(0x201c, 0x201d), array(0x2020, 0x2022), array(0x2024, 0x2027), array(0x2030, 0x2030), array(0x2032, 0x2033), array(0x2035, 0x2035), array(0x203b, 0x203b), array(0x203e, 0x203e), array(0x2074, 0x2074), array(0x207f, 0x207f), array(0x2081, 0x2084), array(0x20ac, 0x20ac), array(0x2103, 0x2103), array(0x2105, 0x2105), array(0x2109, 0x2109), array(0x2113, 0x2113), array(0x2116, 0x2116), array(0x2121, 0x2122), array(0x2126, 0x2126), array(0x212b, 0x212b), array(0x2153, 0x2154), array(0x215b, 0x215e), array(0x2160, 0x216b), array(0x2170, 0x2179), array(0x2189, 0x2189), array(0x2190, 0x2199), array(0x21b8, 0x21b9), array(0x21d2, 0x21d2), array(0x21d4, 0x21d4), array(0x21e7, 0x21e7), array(0x2200, 0x2200), array(0x2202, 0x2203), array(0x2207, 0x2208), array(0x220b, 0x220b), array(0x220f, 0x220f), array(0x2211, 0x2211), array(0x2215, 0x2215), array(0x221a, 0x221a), array(0x221d, 0x2220), array(0x2223, 0x2223), array(0x2225, 0x2225), array(0x2227, 0x222c), array(0x222e, 0x222e), array(0x2234, 0x2237), array(0x223c, 0x223d), array(0x2248, 0x2248), array(0x224c, 0x224c), array(0x2252, 0x2252), array(0x2260, 0x2261), array(0x2264, 0x2267), array(0x226a, 0x226b), array(0x226e, 0x226f), array(0x2282, 0x2283), array(0x2286, 0x2287), array(0x2295, 0x2295), array(0x2299, 0x2299), array(0x22a5, 0x22a5), array(0x22bf, 0x22bf), array(0x2312, 0x2312), array(0x2460, 0x24e9), array(0x2550, 0x2573), array(0x2580, 0x258f), array(0x2592, 0x2595), array(0x25a0, 0x25a1), array(0x25a3, 0x25a9), array(0x25b2, 0x25b3), array(0x25b6, 0x25b7), array(0x25bc, 0x25bd), array(0x25c0, 0x25c1), array(0x25c6, 0x25c8), array(0x25cb, 0x25cb), array(0x25ce, 0x25d1), array(0x25e2, 0x25e5), array(0x25ef, 0x25ef), array(0x2605, 0x2606), array(0x2609, 0x2609), array(0x260e, 0x260f), array(0x261c, 0x261c), array(0x261e, 0x261e), array(0x2640, 0x2640), array(0x2642, 0x2642), array(0x2660, 0x2661), array(0x2663, 0x2665), array(0x2667, 0x266a), array(0x266c, 0x266d), array(0x266f, 0x266f), array(0x269e, 0x269f), array(0x26bf, 0x26bf), array(0x26c6, 0x26cd), array(0x26cf, 0x26d3), array(0x26d5, 0x26e1), array(0x26e3, 0x26e3), array(0x26e8, 0x26e9), array(0x26eb, 0x26f1), array(0x26f4, 0x26f4), array(0x26f6, 0x26f9), array(0x26fb, 0x26fc), array(0x26fe, 0x26ff), array(0x273d, 0x273d), array(0x2776, 0x277f), array(0x2b56, 0x2b59), array(0x3248, 0x324f), array(0xe000, 0xf8ff), array(0xfe00, 0xfe0f), array(0xfffd, 0xfffd), array(0x1f100, 0x1f10a), array(0x1f110, 0x1f12d), array(0x1f130, 0x1f169), array(0x1f170, 0x1f18d), array(0x1f18f, 0x1f190), array(0x1f19b, 0x1f1ac), array(0xe0100, 0xe01ef), array(0xf0000, 0xffffd), array(0x100000, 0x10fffd))

local wcwidth_doublewidth = array(array(0x1100, 0x115f), array(0x231a, 0x231b), array(0x2329, 0x232a), array(0x23e9, 0x23ec), array(0x23f0, 0x23f0), array(0x23f3, 0x23f3), array(0x25fd, 0x25fe), array(0x2614, 0x2615), array(0x2648, 0x2653), array(0x267f, 0x267f), array(0x2693, 0x2693), array(0x26a1, 0x26a1), array(0x26aa, 0x26ab), array(0x26bd, 0x26be), array(0x26c4, 0x26c5), array(0x26ce, 0x26ce), array(0x26d4, 0x26d4), array(0x26ea, 0x26ea), array(0x26f2, 0x26f3), array(0x26f5, 0x26f5), array(0x26fa, 0x26fa), array(0x26fd, 0x26fd), array(0x2705, 0x2705), array(0x270a, 0x270b), array(0x2728, 0x2728), array(0x274c, 0x274c), array(0x274e, 0x274e), array(0x2753, 0x2755), array(0x2757, 0x2757), array(0x2795, 0x2797), array(0x27b0, 0x27b0), array(0x27bf, 0x27bf), array(0x2b1b, 0x2b1c), array(0x2b50, 0x2b50), array(0x2b55, 0x2b55), array(0x2e80, 0x2e99), array(0x2e9b, 0x2ef3), array(0x2f00, 0x2fd5), array(0x2ff0, 0x2ffb), array(0x3000, 0x303e), array(0x3041, 0x3096), array(0x3099, 0x30ff), array(0x3105, 0x312d), array(0x3131, 0x318e), array(0x3190, 0x31ba), array(0x31c0, 0x31e3), array(0x31f0, 0x321e), array(0x3220, 0x3247), array(0x3250, 0x32fe), array(0x3300, 0x4dbf), array(0x4e00, 0xa48c), array(0xa490, 0xa4c6), array(0xa960, 0xa97c), array(0xac00, 0xd7a3), array(0xf900, 0xfaff), array(0xfe10, 0xfe19), array(0xfe30, 0xfe52), array(0xfe54, 0xfe66), array(0xfe68, 0xfe6b), array(0xff01, 0xff60), array(0xffe0, 0xffe6), array(0x16fe0, 0x16fe0), array(0x17000, 0x187ec), array(0x18800, 0x18af2), array(0x1b000, 0x1b001), array(0x1f004, 0x1f004), array(0x1f0cf, 0x1f0cf), array(0x1f18e, 0x1f18e), array(0x1f191, 0x1f19a), array(0x1f200, 0x1f202), array(0x1f210, 0x1f23b), array(0x1f240, 0x1f248), array(0x1f250, 0x1f251), array(0x1f300, 0x1f320), array(0x1f32d, 0x1f335), array(0x1f337, 0x1f37c), array(0x1f37e, 0x1f393), array(0x1f3a0, 0x1f3ca), array(0x1f3cf, 0x1f3d3), array(0x1f3e0, 0x1f3f0), array(0x1f3f4, 0x1f3f4), array(0x1f3f8, 0x1f43e), array(0x1f440, 0x1f440), array(0x1f442, 0x1f4fc), array(0x1f4ff, 0x1f53d), array(0x1f54b, 0x1f54e), array(0x1f550, 0x1f567), array(0x1f57a, 0x1f57a), array(0x1f595, 0x1f596), array(0x1f5a4, 0x1f5a4), array(0x1f5fb, 0x1f64f), array(0x1f680, 0x1f6c5), array(0x1f6cc, 0x1f6cc), array(0x1f6d0, 0x1f6d2), array(0x1f6eb, 0x1f6ec), array(0x1f6f4, 0x1f6f8), array(0x1f910, 0x1f91e), array(0x1f920, 0x1f927), array(0x1f930, 0x1f930), array(0x1f933, 0x1f93e), array(0x1f940, 0x1f94b), array(0x1f950, 0x1f95e), array(0x1f980, 0x1f991), array(0x1f9c0, 0x1f9c0), array(0x1f9d1, 0x1f9d1), array(0x20000, 0x2fffd), array(0x30000, 0x3fffd))

local wcwidth_emoji_width = array(array(0x1f1e6, 0x1f1ff), array(0x1f321, 0x1f321), array(0x1f324, 0x1f32c), array(0x1f336, 0x1f336), array(0x1f37d, 0x1f37d), array(0x1f396, 0x1f397), array(0x1f399, 0x1f39b), array(0x1f39e, 0x1f39f), array(0x1f3cb, 0x1f3ce), array(0x1f3d4, 0x1f3df), array(0x1f3f3, 0x1f3f5), array(0x1f3f7, 0x1f3f7), array(0x1f43f, 0x1f43f), array(0x1f4fd, 0x1f4fd), array(0x1f549, 0x1f54a), array(0x1f56f, 0x1f570), array(0x1f573, 0x1f579), array(0x1f587, 0x1f587), array(0x1f590, 0x1f590), array(0x1f5a5, 0x1f5a5), array(0x1f5a8, 0x1f5a8), array(0x1f5b1, 0x1f5b2), array(0x1f5bc, 0x1f5bc), array(0x1f5c2, 0x1f5c4), array(0x1f5d1, 0x1f5d3), array(0x1f5dc, 0x1f5de), array(0x1f5e1, 0x1f5e1), array(0x1f5e3, 0x1f5e3), array(0x1f5e8, 0x1f5e8), array(0x1f5ef, 0x1f5ef), array(0x1f5f3, 0x1f5f3), array(0x1f5fa, 0x1f5fa), array(0x1f6cb, 0x1f6cf), array(0x1f6e9, 0x1f6e9), array(0x1f6f0, 0x1f6f0), array(0x1f6f3, 0x1f6f3))

local wcwidth_singlewidth = array(array(32, 0x7f), array(0xa0, 0x300), array(0x24eb, 0x254b))


function intable(tbl, c) 
    if (c < tbl[1][1]) then return end
    if (c > tbl[#tbl][2]) then return end
    
    local bot = 1
    local top = #tbl
    
    while (top >= bot) do 
        local mid = floor(((bot + top) / 2))
        
        if (tbl[mid][2] < c) then 
            bot = (mid + 1)
        elseif (tbl[mid][1] > c) then 
            top = (mid - 1)
        else 
            return true
        end
    end
end


function wcwidth(c) 
    if ((c < 0) or (c > 0x10ffff)) then return 0 end
    if intable(wcwidth_singlewidth, c) then return 1 end
    if intable(wcwidth_ambiguous, c) then return 1 end
    if intable(wcwidth_private, c) then return 1 end
    if intable(wcwidth_doublewidth, c) then return 2 end
    if intable(wcwidth_emoji_width, c) then return 2 end
    if intable(wcwidth_nonprint, c) then return 0 end
    if intable(wcwidth_combining, c) then return 0 end
    if intable(wcwidth_combining2, c) then return 0 end
    return 1
end

return kseg