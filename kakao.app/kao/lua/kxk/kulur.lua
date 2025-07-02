--[[
000   000  000   000  000      000   000  00000000
000  000   000   000  000      000   000  000   000
0000000    000   000  000      000   000  0000000
000  000   000   000  000      000   000  000   000
000   000   0000000   0000000   0000000   000   000
--]]

-- use kxk/kxk
extlang = require "kxk/extlang"

--swtch =
--    pug:
--        script: next:'.' to:'js' indent:1
--    md:
--        coffeescript: turd:'```' to:'coffee' end:'```' add:'code triple'
--        javascript:   turd:'```' to:'js'     end:'```' add:'code triple'
--        
--for ext in exts
--    swtch.md[ext] = turd:'```' to:ext end:'```' add:'code triple'

local SPACE = "%s"
local HEADER = "^[0█]+$"
local PUNCT = "[^%wäöüßÄÖÜáéíóúÁÉÍÓÚñÑçÇàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãõÃÕåÅæÆœŒøØłŁđĐ]+"
local NUMBER = "^%d+$"
local FLOAT = "^%d+f$"
local HEXNUM = "^0x[a-fA-F%d]+$"
local HEX = "^[a-fA-F%d]+$"
local NEWLINE = "%r?%n"
local LI = "(%sli%d%s|%sh%d%s)"

local codeTypes = array('interpolation', 'code triple')

--  0000000  000   000  000   000  000   000  000   000  00000000  0000000
-- 000       000   000  000   000  0000  000  000  000   000       000   000
-- 000       000000000  000   000  000 0 000  0000000    0000000   000   000
-- 000       000   000  000   000  000  0000  000  000   000       000   000
--  0000000  000   000   0000000   000   000  000   000  00000000  0000000

--[[
    returns array of

        chunks: [
                    turd:   s
                    clss:   s
                    match:  s
                    start:  n
                    length: n
                ]
        ext:    s
        chars:  n
        index:  n
        number: n+1
--]]


function chunked(segls, ext) 
    if (string.sub(ext, 1, 1) == '.') then 
        ext = kstr.slice(ext, 2)
    end
    
    if not extlang.exts:has(ext) then 
        ext = 'txt'
    end
    
    -- write ◌y "CHUNKED " ext
    
    local lineno = 0
    local chunkd = array()
    
    for _, segs in ipairs(segls) do 
        lineno = lineno + 1
        local chnks = {
            chunks = array(), 
            chars = 0, 
            index = lineno, 
            number = lineno, 
            ext = ext
            }
        
        chunkd:push(chnks)
        
        if valid(segs) then 
            local chunks = kseg.chunks(kseg.detab(segs))
            
            if valid(chunks) then 
                local lastWord = nil
                local lastWordIndex = -1
                
                
                function pushLastWord() 
                    if lastWord then 
                        chnks.chunks:push({start = kseg.widthAtSegi(segs, lastWordIndex), length = kseg.width(lastWord), match = kseg.str(lastWord), clss = 'text'})
                        lastWord = nil
                        lastWordIndex = -1
                        return lastWordIndex
                    end
                end
                
                for _, chnk in ipairs(chunks) do 
                    pushLastWord()
                    
                    for segIndex, s in ipairs(chnk.segl) do 
                        
                        function isUniko(ch) 
                            if kstr.has('■▪◆●○▸➜⮐', ch) then return false end
                            if (#ch > 1) then return true end
                            return false
                        end
                        
                        local m = string.match(s, PUNCT)
                        if m then 
                            pushLastWord()
                            
                            local turd = ''
                            
                            -- write ◌c noon(chnk)
                            -- write ◌m chnk.segl.class
                            
                            for t in chnk.segl:slice(segIndex):each() do 
                                if string.match(t, PUNCT) then 
                                    turd = turd .. t
                                else 
                                    break
                                end
                            end
                            
                            local clss = 'punct'
                            
                            if isUniko(s) then 
                                clss = 'text unicode'
                            else 
                                clss = 'punct'
                                if array(',', ';', '{', '}', '(', ')'):has(s) then 
                                    clss = clss .. ' minor'
                                end
                            end
                            
                            chnks.chunks:push({start = kseg.widthAtSegi(segs, (chnk.index + segIndex)), length = kseg.width(s), match = s, turd = turd, clss = clss})
                        else 
                            if (lastWord == nil) then 
                                lastWord = array()
                                lastWordIndex = (chnk.index + segIndex)
                            end
                            
                            lastWord:push(s)
                        end
                    end
                end
                
                pushLastWord()
                
                if (#chnks.chunks > 0) then 
                    local l = chnks.chunks[#chnks.chunks]
                    chnks.chars = (l.start + #l)
                end
            end
        end
    end
    
    return chunkd
end

--[[
000   000   0000000   000   000  0000000    000      00000000  00000000    0000000
000   000  000   000  0000  000  000   000  000      000       000   000  000
000000000  000000000  000 0 000  000   000  000      0000000   0000000    0000000
000   000  000   000  000  0000  000   000  000      000       000   000       000
000   000  000   000  000   000  0000000    0000000  00000000  000   000  0000000
--]]

local extStack = array()
local stack = array()
local handl = array()
local extTop = {}
local stackTop = {}
local notCode = false -- shortcut for top of stack not in codeTypes
local topType = ''
local ext = ''
local chunk = {}
local chunkIndex = 1

--  0000000   0000000   00     00  00     00  00000000  000   000  000000000
-- 000       000   000  000   000  000   000  000       0000  000     000
-- 000       000   000  000000000  000000000  0000000   000 0 000     000
-- 000       000   000  000 0 000  000 0 000  000       000  0000     000
--  0000000   0000000   000   000  000   000  00000000  000   000     000


function fillComment(n) 
    for i = 0, n-1 do 
        addValue(i, 'comment')
    end
    
    if (chunkIndex < (#line.chunks - n)) then 
        local restChunks = line.chunks:slice((chunkIndex + n))
        local mightBeHeader = true
        for _, c in ipairs(restChunks) do 
            c.clss = 'comment'
            if (mightBeHeader and not string.match(c.match, HEADER)) then 
                mightBeHeader = false
            end
        end
        
        if mightBeHeader then 
            for _, c in ipairs(restChunks) do 
                c.clss = c.clss .. ' header'
            end
        end
    end
    
    return ((#line.chunks - chunkIndex) + n)
end


function hashComment() 
    if (stackTop and (topType ~= 'regexp triple')) then return end
    if (stackTop and (stackTop.lineno == line.number)) then 
        return -- comments inside triple regexp only valid on internal lines?
    end
    
    if (chunk.match == "#") then 
        return fillComment(1)
    end
end


function noonComment() 
    if stackTop then return end
    
    if ((chunk.match == "#") and (chunkIndex == 0)) then 
        return fillComment(1)
    end
end


function slashComment() 
    if stackTop then return end
    
    if kstr.startsWith(chunk.turd, "//") then 
        return fillComment(2)
    end
end


function blockComment() 
    if (not chunk.turd or (#chunk.turd < 3)) then return end
    
    local typ = 'comment triple'
    
    if ((topType and (topType ~= 'interpolation')) and (topType ~= typ)) then return end
    
    local head = string.sub(chunk.turd, 1, 3)
    if (head == '###') then 
        if (topType == typ) then 
            popStack()
        else 
            pushStack({type = typ, strong = true})
        end
        
        return addAndJoinValues(3, typ)
    end
end


function nimComment() 
    if (not chunk.turd or (#chunk.turd < 2)) then return end
    
    local typ = 'comment triple'
    
    if ((topType and (topType ~= 'interpolation')) and (topType ~= typ)) then return end
    
    local head = string.sub(chunk.turd, 1, 2)
    if ((head == "#[") or (heaad == "]#")) then 
        if (topType == typ) then 
            popStack()
        else 
            pushStack({type = typ, strong = true})
        end
        
        return addAndJoinValues(2, typ)
    end
end


function luaComment() 
    if stackTop then return end
    
    if (not chunk.turd or (#chunk.turd < 2)) then return end
    
    if kstr.startsWith(chunk.turd, "--") then 
        fillComment(2)
        return
    end
    
    if (#chunk.turd < 2) then return end
    
    local typ = 'comment triple'
    
    -- ⮐  if topType and topType not in ['interpolation' type]
    
    local head = string.sub(chunk.turd, 1, 4)
    if ((head == "--[[") or (head == "--]]")) then 
        if (topType == typ) then 
            popStack()
        else 
            pushStack({type = typ, strong = true})
        end
        
        return addAndJoinValues(4, typ)
    end
end


function starComment() 
    if not chunk.turd then return end
    
    local typ = 'comment triple'
    
    if (topType and (topType ~= typ)) then return end
    
    if ((string.sub(chunk.turd, 1, 2) == '/*') and not topType) then 
        pushStack({type = typ, strong = true})
        return addValues(2, typ)
    end
    
    if ((string.sub(chunk.turd, 1, 2) == '*/') and (topType == typ)) then 
        popStack()
        return addValues(2, typ)
    end
end

--  0000000   00000000    0000000    0000000  
-- 000   000  000   000  000        000       
-- 000000000  0000000    000  0000  0000000   
-- 000   000  000   000  000   000       000  
-- 000   000  000   000   0000000   0000000   


function funcArgs() 
    if notCode then return end
    if not chunk.turd then return end
    
    local kturd = kseg(chunk.turd)
    if (kturd[1] == '○') then kturd:shift() end
    -- turd = chunk.turd[0] == '○' ? chunk.turd[1..2] : chunk.turd[0..1]
    -- if turd[0] in '=-' and turd[1] == '>'
    if (((kturd[1] == '=') or (kturd[1] == '-')) and (kturd[2] == '>')) then 
        local prev = getChunk(-1)
        if (prev and kstr.has(':)', prev.match)) then return end
        if (array('text', 'dictionary key'):has(line.chunks[1].clss) and kstr.has(':=', line.chunks[2].match)) then 
            for ch in line.chunks:slice(2, chunkIndex):each() do 
                if array('function call', 'text'):has(ch.clss) then 
                    ch.clss = 'function argument'
                end
            end
        end
    end
    
    return
end

--  0000000   00000000   00000000    0000000   000   000
-- 000   000  000   000  000   000  000   000  000 0 000
-- 000000000  0000000    0000000    000   000  000000000
-- 000   000  000   000  000   000  000   000  000   000
-- 000   000  000   000  000   000   0000000   00     00


function dashArrow() 
    if notCode then return end
    
    -- log 'dashArrow' line.chunks
    -- log 'dashArrow chunk' chunkIndex, chunk
    
    
    function markFunc() 
        if (line.chunks[1].clss == 'text') then 
            if ((line.chunks[2].match == '=') and (line.chunks[3].match ~= '>')) then 
                line.chunks[1].clss = 'function'
                line.chunks[2].clss = line.chunks[2].clss .. ' function'
                return line.chunks[2].clss
            elseif (line.chunks[2].match == ':') then 
                line.chunks[1].clss = 'method'
                line.chunks[2].clss = line.chunks[2].clss .. ' method'
                return line.chunks[2].clss
            end
        end
    end
    
    if chunk.turd then 
        if kstr.startsWith(chunk.turd, '○->') then 
            markFunc()
            addValue(0, 'function async')
            addValue(1, 'function tail')
            addValue(2, 'function head')
            if ((line.chunks[1].clss == 'dictionary key') or (line.chunks[1].turd and (string.sub(line.chunks[1].turd, 1, 2) == '@:'))) then 
                line.chunks[1].clss = 'method'
                line.chunks[2].clss = 'punct method'
            elseif ((line.chunks[1].match == '@') and (line.chunks[2].clss == 'dictionary key')) then 
                line.chunks[1].clss = 'punct method class'
                line.chunks[2].clss = 'method class'
                line.chunks[3].clss = 'punct method class'
            end
            
            return 3
        end
        
        if kstr.startsWith(chunk.turd, '○=>') then 
            markFunc()
            addValue(0, 'function bound async')
            addValue(1, 'function bound tail')
            addValue(2, 'function bound head')
            if (line.chunks[1].clss == 'dictionary key') then 
                line.chunks[1].clss = 'method'
                line.chunks[2].clss = 'punct method'
            end
            
            return 3
        end
        
        if kstr.startsWith(chunk.turd, '->') then 
            markFunc()
            if ((line.chunks[1].clss == 'dictionary key') or (line.chunks[1].turd and (string.sub(line.chunks[1].turd, 1, 2) == '@:'))) then 
                line.chunks[1].clss = 'method'
                line.chunks[2].clss = 'punct method'
            elseif ((line.chunks[1].match == '@') and (line.chunks[2].clss == 'dictionary key')) then 
                line.chunks[1].clss = 'punct method class'
                line.chunks[2].clss = 'method class'
                line.chunks[3].clss = 'punct method class'
            end
            
            return addAndJoinValues(2, 'function')
        end
        
        if kstr.startsWith(chunk.turd, '=>') then 
            markFunc()
            if (line.chunks[1].clss == 'dictionary key') then 
                line.chunks[1].clss = 'method'
                line.chunks[2].clss = 'punct method'
            end
            
            return addAndJoinValues(2, 'function bound')
        end
    end
end


function cppPointer() 
    if notCode then return end
    
    if chunk.turd then 
        if kstr.startsWith(chunk.turd, '->') then 
            addValue(0, 'arrow tail')
            addValue(1, 'arrow head')
            return 2
        end
    end
end


function commentHeader() 
    if (topType == 'comment triple') then 
        if string.match(chunk.match, HEADER) then 
            chunk.clss = 'comment triple header'
            return 1
        end
    end
end

-- 000   000   0000000   0000000    00000000  
-- 000  000   000   000  000   000  000       
-- 0000000    000   000  000   000  0000000   
-- 000  000   000   000  000   000  000       
-- 000   000   0000000   0000000    00000000  


function kolorPunct() 
    if notCode then return end
    
    if (chunk.match == '◌') then 
        return addValue(0, 'range')
    end
end


function kodePunct() 
    if notCode then return end
    
    if ((chunk.match == '▸') or (chunk.match == '➜')) then 
        return addValue(0, 'keyword')
    end
    
    if (chunk.match == '⮐') then 
        return addValue(0, 'keyword return')
    end
    
    local next = getChunk(1)
    if next then 
        if (((chunk.match == '○') and (next.match ~= '-')) and (next.match ~= '=')) then 
            return addValue(0, 'await')
        end
        
        if array('==', '!=', '>=', '<='):has(chunk.turd) then 
            addValue(0, 'compare')
            addValue(1, 'compare')
            return 2
        end
        
        if (((chunk.match == '<') or (chunk.match == '>')) and not chunk.turd) then 
            return addValue(0, 'compare')
        end
        
        if (chunk.match == '◆') then 
            if array('dir', 'file', 'main'):has(next.match) then 
                addValue(0, 'keyword')
                setValue(1, 'keyword')
                return 2
            end
        end
    end
    
    local prev = getChunk(-1)
    if prev then 
        if (kstr.endsWith(prev.clss, 'require') and (chunk.match ~= '"')) then 
            setValue(0, 'punct require')
            return 1
        end
        
        if (kstr.startsWith(chunk.turd, '..') and (prev.match ~= '.')) then 
            if (chunk.turd[2] ~= '.') then 
                return addValues(2, 'range')
            end
            
            if (chunk.turd[3] ~= '.') then 
                return addValues(3, 'range')
            end
        end
        
        if (kstr.startsWith(prev.clss, 'text') or (prev.clss == 'property')) then 
            local prevEnd = (prev.start + #prev)
            if ((chunk.match == '(') and (prevEnd == chunk.start)) then 
                return thisCall()
            elseif (prevEnd < chunk.start) then 
                local prevPrev = getChunk(-2)
                if ((chunkIndex == 1) or (prevPrev and array('⮐', '=', 'return'):has(prevPrev.match))) then 
                    if kstr.has('@[({"\'', chunk.match) then 
                        return thisCall()
                    elseif kstr.has('+-/', chunk.match) then 
                        next = getChunk(1)
                        if (not next or ((next.match ~= '=') and (next.start == (chunk.start + 1)))) then 
                            return thisCall()
                        end
                    end
                end
            end
        end
    end
end

-- 000   000   0000000   0000000    00000000  000   000   0000000   00000000   0000000    
-- 000  000   000   000  000   000  000       000 0 000  000   000  000   000  000   000  
-- 0000000    000   000  000   000  0000000   000000000  000   000  0000000    000   000  
-- 000  000   000   000  000   000  000       000   000  000   000  000   000  000   000  
-- 000   000   0000000   0000000    00000000  00     00   0000000   000   000  0000000    


function kodeWord() 
    if notCode then return end
    
    if (chunk.match == 'use') then 
        if (getChunk(1).start > (chunk.start + #chunk)) then 
            setValue(0, 'keyword require')
            return 1
        else 
            setValue(0, 'text')
            return 0
        end
    end
    
    local prev = getChunk(-1)
    if prev then 
        if (prev.match == 'use') then 
            setValue(0, 'require')
            return 1
        end
        
        if (prev.match == '▸') then 
            if empty(getChunk, -2) then 
                for c in line.chunks:slice(chunkIndex) do 
                    c.clss = 'section'
                end
                
                return (#line.chunks - chunkIndex)
            end
        end
        
        if array('class', 'extends', 'function'):has(prev.match) then 
            setValue(0, 'class')
            return 1
        end
        
        if ((prev.match == 'is') and array('str', 'num', 'obj', 'arr', 'func', 'elem'):has(chunk.match)) then 
            setValue(0, 'keyword')
            return 1
        end
        
        if kstr.startsWith(chunk.clss, 'keyword') then 
            return 1 -- we are done with the keyword
        end
        
        if (prev.match == '@') then 
            addValue(-1, 'this')
            addValue(0, 'this')
            return 1
        end
        
        if kstr.endsWith(prev.clss, 'require') then 
            addValue(0, 'require')
            if (kstr.endsWith(prev.clss, 'punct require') and kstr.has('▪◆●', prev.match)) then 
                addValue(0, 'string')
            elseif (chunkIndex == (#line.chunks - 1)) then 
                addValue(0, 'string')
            end
            
            return 1
        end
        
        if kstr.endsWith(prev.clss, 'require string') then 
            addValue(0, 'require string')
            return 1
        end
        
        if ((kstr.startsWith(prev.clss, 'text') or (prev.clss == 'property')) and ((prev.start + #prev) < chunk.start)) then 
            local prevPrev = getChunk(-2)
            if ((chunkIndex == 1) or (prevPrev and array('return', '=', '⮐'):has(prevPrev.match))) then 
                return thisCall()
            end
        end
    end
end

--  0000000   0000000   00000000  00000000  00000000  00000000
-- 000       000   000  000       000       000       000
-- 000       000   000  000000    000000    0000000   0000000
-- 000       000   000  000       000       000       000
--  0000000   0000000   000       000       00000000  00000000


function thisCall() 
    setValue(-1, 'function call')
    if (getmatch(-2) == '@') then 
        setValue(-2, 'punct function call')
    end
    
    return 0
end


function coffeePunct() 
    if notCode then return end
    
    if (chunk.match == '▸') then 
        return addValue(0, 'meta')
    end
    
    if (chunk.turd == '~>') then 
        return addValues(2, 'meta')
    end
    
    local prev = getChunk(-1)
    if prev then 
        if (kstr.startsWith(chunk.turd, '..') and (prev.match ~= '.')) then 
            if (chunk.turd[2] ~= '.') then 
                return addValues(2, 'range')
            end
            
            if (chunk.turd[3] ~= '.') then 
                return addValues(3, 'range')
            end
        end
        
        if (kstr.startsWith(prev.clss, 'text') or (prev.clss == 'property')) then 
            local prevEnd = (prev.start + #prev)
            if ((chunk.match == '(') and (prevEnd == chunk.start)) then 
                return thisCall()
            elseif (prevEnd < chunk.start) then 
                if kstr.has('@[({"\'', chunk.match) then 
                    return thisCall()
                elseif kstr.has('+-/', chunk.match) then 
                    local next = getChunk(1)
                    if (not next or ((next.match ~= '=') and (next.start == (chunk.start + 1)))) then 
                        return thisCall()
                    end
                end
            end
        end
    end
end


function coffeeWord() 
    if notCode then return end
    
    local prev = getChunk(-1)
    if prev then 
        if (prev.clss == 'punct meta') then 
            if (chunk.start == (prev.start + 1)) then 
                setValue(0, 'meta')
                return 0 -- give switch a chance
            end
        end
        
        if ((prev.match == 'class') or (prev.match == 'extends')) then 
            setValue(0, 'class')
            return 1
        end
        
        if kstr.startsWith(chunk.clss, 'keyword') then 
            return 1 -- we are done with the keyword
        end
        
        if (prev.match == '@') then 
            addValue(-1, 'this')
            addValue(0, 'this')
            return 1
        end
        
        if ((kstr.startsWith(prev.clss, 'text') or (prev.clss == 'property')) and ((prev.start + #prev) < chunk.start)) then 
            return thisCall()
        end
    end
end


function property() 
    if notCode then return end
    
    if kstr.has(".∙", getmatch(-1)) then 
        local prevPrev = getChunk(-2)
        
        if (not prevPrev or not kstr.has(".∙", prevPrev.match)) then 
            setValue(-1, 'punct property')
            setValue(0, 'property')
            if prevPrev then 
                if (not array('property', 'number'):has(prevPrev.clss) and not kstr.startsWith(prevPrev.clss, 'punct')) then 
                    setValue(-2, 'obj')
                end
            end
            
            return 1
        end
    end
end


function cppWord() 
    if notCode then return end
    
    local p = property()
    
    if p then return p end
    local prevPrev = getChunk(-2)
    if (prevPrev and (prevPrev.turd == '::')) then 
        local prevPrevPrev = getChunk(-3)
        if prevPrevPrev then 
            setValue(-3, 'punct obj')
            addValue(-2, 'obj')
            addValue(-1, 'obj')
            setValue(0, 'method')
            return 1
        end
    end
    
    if (((getmatch(-1) == '<') and kstr.has(',>', getmatch(1))) or ((getmatch(1) == '>') and (getmatch(-1) == ','))) then 
        setValue(-1, 'punct template')
        setValue(0, 'template')
        setValue(1, 'punct template')
        return 2
    end
    
    if (chunk.match[1] and string.match(chunk.match[1], "[A-Z]")) then 
        if (chunk.match[0] == 'T') then 
                if (getmatch(1) == '<') then 
                    setValue(0, 'keyword type')
                    return 1
                end
        elseif (chunk.match[0] == 'F') then 
                setValue(0, 'struct')
                return 1
        elseif (chunk.match[0] == 'A') or (chunk.match[0] == 'U') then 
                setValue(0, 'obj')
                return 1
        end
    end
    
    if ((chunk.clss == 'text') and (getmatch(1) == '(')) then 
        setValue(0, 'function call')
        return 1
    end
end

-- 000   000   0000000    0000000   000   000
-- 0000  000  000   000  000   000  0000  000
-- 000 0 000  000   000  000   000  000 0 000
-- 000  0000  000   000  000   000  000  0000
-- 000   000   0000000    0000000   000   000


function noonProp() 
    local prev = getChunk(-1)
    if prev then 
        if (((prev.start + #prev) + 1) < chunk.start) then 
            if (prev.clss ~= 'obj') then 
                local i = (chunkIndex - 1)
                while (i >= 1) do 
                    if ((i < (chunkIndex - 1)) and (((line.chunks[i].start + #line.chunks[i]) + 1) < line.chunks[(i + 1)].start)) then 
                        break
                    end
                    
                    if ((line.chunks[i].clss == 'text') or (line.chunks[i].clss == 'obj')) then 
                        line.chunks[i].clss = 'property'
                        i = i - 1
                    elseif (line.chunks[i].clss == 'punct') then 
                        line.chunks[i].clss = 'punct property'
                        i = i - 1
                    else 
                        break
                    end
                end
            end
        elseif (prev.clss == 'obj') then 
            setValue(0, 'obj')
            return 1
        end
    end
    
    return 0
end


function noonPunct() 
    return noonProp()
end


function noonWord() 
    if (chunk.start == 0) then 
        setValue(0, 'obj')
        return 1
    end
    
    return noonProp()
end

-- 000   000  00000000   000
-- 000   000  000   000  000
-- 000   000  0000000    000
-- 000   000  000   000  000
--  0000000   000   000  0000000


function urlPunct() 
    local prev = getChunk(-1)
    if prev then 
        if (chunk.turd == '://') then 
            if ((getmatch(4) == '.') and getChunk(5)) then 
                setValue(-1, 'url protocol')
                addValues(3, 'url')
                setValue(3, 'url domain')
                setValue(4, 'punct url tld')
                setValue(5, 'url tld')
                return 6
            end
        end
        
        if (chunk.match == '.') then 
            if ((((not kstr.startsWith(prev.clss, 'number') and (prev.clss ~= 'semver')) and not kstr.has('\\./', prev.match)) and not string.match(prev.match, "%d+")) and empty(topType)) then 
                local next = getChunk(1)
                if next then 
                    if (next.start == (chunk.start + #chunk)) then 
                        local fileext = next.match
                        if not kstr.has('\\./*+', fileext) then 
                            setValue(-1, ('file_' + fileext))
                            setValue(0, ('file_punct_' + fileext))
                            setValue(1, ('file_ext_' + fileext))
                            return 2
                        end
                    end
                end
            end
        end
        
        if (chunk.match == '/') then 
            for i in iter(chunkIndex, 0) do 
                if ((line.chunks[i].start + #line.chunks[i]) < line.chunks[(i + 1)].start) then break end
                if kstr.endsWith(line.chunks[i].clss, 'dir') then break end
                if kstr.startsWith(line.chunks[i].clss, 'url') then break end
                if (line.chunks[i].match == '"') then break end
                if kstr.startsWith(line.chunks[i].clss, 'punct') then 
                    line.chunks[i].clss = 'punct dir'
                else 
                    line.chunks[i].clss = 'text dir'
                end
            end
            
            return 1
        end
    end
    
    return 0
end


function urlWord() 
    local prev = getChunk(-1)
    if prev then 
        if ((prev.match == '\\') or (prev.match == '/')) then 
            local next = getChunk(1)
            if ((not next or (next.start > (chunk.start + #chunk))) or not kstr.has('\\./', next.match)) then 
                return addValue(0, 'file')
            end
        end
    end
end

--       000   0000000
--       000  000
--       000  0000000
-- 000   000       000
--  0000000   0000000


function jsPunct() 
    if notCode then return end
    
    local prev = getChunk(-1)
    if prev then 
        if (chunk.match == '(') then 
            if (kstr.startsWith(prev.clss, 'text') or (prev.clss == 'property')) then 
                setValue(-1, 'function call')
                return 1
            end
        end
    end
end


function jsWord() 
    if (chunk.clss == 'keyword function') then 
        if ((getmatch(-1) == '=') and kstr.startsWith(getValue(-2), 'text')) then 
            setValue(-2, 'function')
        end
    end
    
    return 0
end


function dictionary() 
    if notCode then return end
    
    if ((chunk.match == ':') and not kstr.startsWith(chunk.turd, '::')) then 
        local prev = getChunk(-1)
        if prev then 
            if array('string', 'number', 'text', 'keyword'):has(kstr.split(prev.clss, ' ')[1]) then 
                setValue(-1, 'dictionary key')
                setValue(0, 'punct dictionary')
                return 1
            end
            
            if ((prev.match == '*') and array('text', 'keyword'):has(kstr.split(getChunk(-2).clss, ' ')[1])) then 
                setValue(-1, 'dictionary key')
                setValue(-2, 'dictionary key')
                setValue(0, 'punct dictionary')
                return 1
            end
        end
    end
end

--       000   0000000   0000000   000   000
--       000  000       000   000  0000  000
--       000  0000000   000   000  000 0 000
-- 000   000       000  000   000  000  0000
--  0000000   0000000    0000000   000   000


function jsonPunct() 
    if notCode then return end
    
    if (chunk.match == ':') then 
        local prev = getChunk(-1)
        if prev then 
            if (prev.match == '"') then 
                for i in iter(max(0, (chunkIndex - 2)), 0) do 
                    if (line.chunks[i].clss == 'punct string double') then 
                        line.chunks[i].clss = 'punct dictionary'
                        break
                    end
                    
                    line.chunks[i].clss = (function () 
    if line.chunks[i] then 
    return 'dictionary key'
                                                           end
end)()
                end
                
                setValue(-1, 'punct dictionary')
                setValue(0, 'punct dictionary')
                return 1
            end
        end
    end
end


function jsonWord() 
    local prev = getChunk(-1)
    if (prev and ((topType == 'string double') or (topType == 'string single'))) then 
        if kstr.has('"^~=', prev.match) then 
            if ((((string.match(getmatch(0), NUMBER) and (getmatch(1) == '.')) and string.match(getmatch(2), NUMBER)) and (getmatch(3) == '.')) and string.match(getmatch(4), NUMBER)) then 
                if kstr.has('^~=', prev.match) then 
                    setValue(-1, 'punct semver')
                    if (getmatch(-2) == '>') then 
                        setValue(-2, 'punct semver')
                    end
                end
                
                setValue(0, 'semver')
                setValue(1, 'punct semver')
                setValue(2, 'semver')
                setValue(3, 'punct semver')
                setValue(4, 'semver')
                return 5
            end
        end
    end
end

-- 00000000   00000000   0000000   00000000  000   000  00000000
-- 000   000  000       000        000        000 000   000   000
-- 0000000    0000000   000  0000  0000000     00000    00000000
-- 000   000  000       000   000  000        000 000   000
-- 000   000  00000000   0000000   00000000  000   000  000


function kescape() 
    if ((chunk.match == '\\') and (kstr.startsWith(topType, 'regexp') or kstr.startsWith(topType, 'string'))) then 
        if ((chunkIndex == 0) or not getChunk(-1).escape) then 
            if (getChunk(1).start == (chunk.start + 1)) then 
                chunk.escape = true
                addValue(0, 'escape')
                
                if ((topType == 'string single') and (getChunk(1).match == "'")) then 
                    setValue(0, topType)
                    return 1
                end
                
                if ((topType == 'string double') and (getChunk(1).match == '"')) then 
                    setValue(0, topType)
                    return 1
                end
                
                return stacked()
            end
        end
    end
    
    return 0
end


function regexp() 
    if kstr.startsWith(topType, 'string') then return end
    
    local prev = getChunk(-1)
    if (prev and prev.escape) then return stacked() end
    
    if (chunk.match == '/') then 
        if (topType == 'regexp') then 
            chunk.clss = chunk.clss .. ' regexp end'
            popStack()
            return 1
        end
        
        if chunkIndex then 
            prev = getChunk(-1)
            local next = (getChunk + 1)
            if ((not kstr.startsWith(prev.clss, 'punct') and not kstr.startsWith(prev.clss, 'keyword')) or kstr.has(")]", prev.match)) then 
                if (((prev.start + #prev) < chunk.start) and (next.start > (chunk.start + 1))) then return end
                if (((prev.start + #prev) == chunk.start) and (next.start == (chunk.start + 1))) then return end
            end
            
            if (next.match == '=') then return end
            if kstr.startsWith(prev.clss, 'number') then return end
        end
        
        pushStack({type = 'regexp'})
        return addValue(0, 'regexp start')
    end
    
    return kescape()
end


function tripleRegexp() 
    if (not chunk.turd or (#chunk.turd < 3)) then return end
    
    local typ = 'regexp triple'
    
    if ((topType and (topType ~= 'interpolation')) and (topType ~= typ)) then return end
    if (string.sub(chunk.turd, 1, 3) == '///') then 
        if (topType == typ) then 
            popStack()
        else 
            pushStack({type = typ, lineno = line.number})
        end
        
        return addValues(3, typ)
    end
end

--  0000000  000000000  00000000   000  000   000   0000000
-- 000          000     000   000  000  0000  000  000
-- 0000000      000     0000000    000  000 0 000  000  0000
--      000     000     000   000  000  000  0000  000   000
-- 0000000      000     000   000  000  000   000   0000000


function simpleString() 
    if (topType == 'regexp') then return end
    
    local prev = getChunk(-1)
    if (prev and prev.escape) then return stacked() end
    
    if kstr.has('`"\'', chunk.match) then 
        local typ = (function () 
    if (chunk.match == '`') then 
    return 'string double'
              elseif (chunk.match == '"') then 
    return 'string double'
              elseif (chunk.match == "'") then 
    return 'string single'
              end
end)()
        
        if (chunk.match == "'") then 
            local next = getChunk(1)
            
            if (next and array('s', 'd', 't', 'll', 're'):has(next.match)) then 
                if (next.start == (chunk.start + #chunk)) then 
                    local scnd = getChunk(2)
                    if (not scnd or (scnd.match ~= "'")) then 
                        return stacked()
                    end
                end
            end
        end
        
        if (chunk.clss == 'punct code triple') then 
            return 0
        end
        
        if (topType == typ) then 
            addValue(0, typ)
            popStack()
            return 1
        elseif notCode then 
            if (topType == "string double nsstring") then 
                addValue(0, topType)
                popStack()
                return 1
            else 
                return stacked()
            end
        end
        
        pushStack({strong = true, type = typ})
        addValue(0, typ)
        return 1
    end
    
    return kescape()
end


function tripleString() 
    if (not chunk.turd or (#chunk.turd < 3)) then return end
    if array('regexp', 'string single', 'string double'):has(topType) then return end
    
    local prev = getChunk(-1)
    if (prev and prev.escape) then return stacked() end
    
    if (string.sub(chunk.turd, 1, 3) == '"""') then 
        local typ = 'string triple'
        if ((typ ~= topType) and kstr.startsWith(topType, 'string')) then return end
        
        if (topType == typ) then 
            popStack()
        else 
            pushStack({strong = true, type = typ})
        end
        
        return addValues(3, typ)
    end
    
    return kescape()
end


function luaString() 
    if (not chunk.turd or (#chunk.turd < 2)) then return end
    if array('regexp', 'string single', 'string double'):has(topType) then return end
    
    local prev = getChunk(-1)
    if (prev and prev.escape) then return stacked() end
    
    local head = string.sub(chunk.turd, 1, 2)
    local typ = (function () 
    if (head == '[[') then 
    return 'string triple'
          elseif (head == ']]') then 
    return 'string triple'
          end
end)()
    
    if typ then 
        if ((typ ~= topType) and kstr.startsWith(topType, 'string')) then return end
        
        if (topType == typ) then 
            popStack()
        else 
            pushStack({strong = true, type = typ})
        end
        
        return addValues(2, typ)
    end
    
    return kescape()
end

-- 000   000  000   000  00     00  0000000    00000000  00000000
-- 0000  000  000   000  000   000  000   000  000       000   000
-- 000 0 000  000   000  000000000  0000000    0000000   0000000
-- 000  0000  000   000  000 0 000  000   000  000       000   000
-- 000   000   0000000   000   000  0000000    00000000  000   000


function number() 
    if kstr.startsWith(topType, 'string') then return 0 end
    
    if string.match(chunk.match, NUMBER) then 
        local prev = getmatch(-1)
        if (prev == '.') then 
            if ((getValue(-4) == 'number float') and (getValue(-2) == 'number float')) then 
                if kstr.has('^~=', getmatch(-5)) then 
                    setValue(-5, 'punct semver')
                    if (getmatch(-6) == '>') then 
                        setValue(-6, 'punct semver')
                    end
                end
                
                setValue(-4, 'semver')
                setValue(-3, 'punct semver')
                setValue(-2, 'semver')
                setValue(-1, 'punct semver')
                setValue(0, 'semver')
                return 1
            end
            
            if (getValue(-2) == 'number') then 
                setValue(-2, 'number float')
                setValue(-1, 'punct number float')
                setValue(0, 'number float')
                return 1
            end
        end
        
        if (prev == '#') then 
            chunk.clss = 'number hex'
        else 
            chunk.clss = 'number'
        end
        
        return 1
    end
    
    if string.match(chunk.match, HEXNUM) then 
        chunk.clss = 'number hex'
        return 1
    end
    
    if string.match(chunk.match, HEX) then 
        if (getmatch(-1) == '#') then 
            chunk.clss = 'number hex'
            return 1
        end
    end
end

-- 00000000  000       0000000    0000000   000000000
-- 000       000      000   000  000   000     000
-- 000000    000      000   000  000000000     000
-- 000       000      000   000  000   000     000
-- 000       0000000   0000000   000   000     000


function float() 
    if string.match(chunk.match, FLOAT) then 
        if (getmatch(-1) == '.') then 
            if (getValue(-2) == 'number') then 
                setValue(-2, 'number float')
                addValue(-1, 'number float')
                setValue(0, 'number float')
                return 1
            end
        end
        
        chunk.clss = 'number float'
        return 1
    end
end

--  0000000   0000000   0000000
-- 000       000       000
-- 000       0000000   0000000
-- 000            000       000
--  0000000  0000000   0000000


function cssWord() 
    local tail2 = string.sub(chunk.match, (#chunk.match - 1), #chunk.match)
    local head2 = string.sub(chunk.match, 1, (#chunk.match - 2))
    
    if (array('px', 'em', 'ex'):has(tail2) and string.match(head2, NUMBER)) then 
        setValue(0, 'number')
        return 1
    end
    
    local tail1 = string.sub(chunk.match, #chunk.match, #chunk.match)
    local head1 = string.sub(chunk.match, 1, (#chunk.match - 1))
    
    if ((tail1 == 's') and string.match(head1, NUMBER)) then 
        setValue(0, 'number')
        return 1
    end
    
    local prev = getChunk(-1)
    if prev then 
        if (((prev.match == '.') and (getChunk(-2).clss ~= 'number')) and empty(topType)) then 
            addValue(-1, 'class')
            setValue(0, 'class')
            return 1
        end
        
        if (prev.match == "#") then 
            if ((#chunk.match == 3) or (#chunk.match == 6)) then 
                if string.match(chunk.match, HEX) then 
                    addValue(-1, 'number hex')
                    setValue(0, 'number hex')
                    return 1
                end
            end
            
            addValue(-1, 'function')
            setValue(0, 'function')
            return 1
        end
        
        if (prev.match == '-') then 
            local prevPrev = getChunk(-2)
            if prevPrev then 
                if ((prevPrev.clss == 'class') or (prevPrev.clss == 'function')) then 
                    addValue(-1, prevPrev.clss)
                    setValue(0, prevPrev.clss)
                    return 1
                end
            end
        end
    end
end

-- 00     00  0000000
-- 000   000  000   000
-- 000000000  000   000
-- 000 0 000  000   000
-- 000   000  0000000


function mdPunct() 
    if (chunkIndex == 0) then 
        if (((#chunk.turd <= 1) and kstr.has('-*', chunk.match)) and (getChunk(1).start > (chunk.start + 1))) then 
            local typ = array('li1', 'li2', 'li3', 'li4', 'li5')[(int((chunk.start / 4)) + 1)]
            pushStack({merge = true, fill = true, type = typ})
            return addValue(0, typ .. ' marker')
        end
        
        if (chunk.match == '#') then 
            if (chunk.turd == '#') then 
                    pushStack({merge = true, fill = true, type = 'h1'})
                    return addValue(0, 'h1')
            elseif (chunk.turd == '##') then 
                    pushStack({merge = true, fill = true, type = 'h2'})
                    return addValues(2, 'h2')
            elseif (chunk.turd == '###') then 
                    pushStack({merge = true, fill = true, type = 'h3'})
                    return addValues(3, 'h3')
            elseif (chunk.turd == '####') then 
                    pushStack({merge = true, fill = true, type = 'h4'})
                    return addValues(4, 'h4')
            elseif (chunk.turd == '#####') then 
                    pushStack({merge = true, fill = true, type = 'h5'})
                    return addValues(5, 'h5')
            end
        end
    end
    
    if (chunk.match == '*') then 
        if (string.sub(chunk.turd, 1, 2) == '**') then 
            local typ = 'bold'
            if kstr.endsWith(topType, typ) then 
                addValues(2, topType)
                popStack()
                return 2
            end
            
            if (stackTop and stackTop.merge) then 
                typ = stackTop.type .. ' ' .. typ
            end
            
            pushStack({merge = true, type = typ})
            return addValues(2, typ)
        end
        
        local typ = 'italic'
        if kstr.endsWith(topType, typ) then 
            addValue(0, topType)
            popStack()
            return 1
        end
        
        if (stackTop and stackTop.merge) then 
            typ = stackTop.type .. ' ' .. typ
        end
        
        pushStack({merge = true, type = typ})
        addValue(0, typ)
        return 1
    end
    
    if (chunk.match == '`') then 
        if (string.sub(chunk.turd, 1, 3) == '```') then 
            local typ = 'code triple'
            
            if array('coffeescript', 'javascript', 'js'):has(getmatch(3)) then 
                setValue(3, 'comment')
                return addValues(3, typ)
            end
            
            pushStack({weak = true, type = typ})
            return addValues(3, typ)
        end
        
        local typ = 'code'
        if kstr.endsWith(topType, typ) then 
            addValue(0, topType)
            popStack()
            return 1
        end
        
        if (stackTop and stackTop.merge) then 
            typ = stackTop.type .. ' ' .. typ
        end
        
        pushStack({merge = true, type = typ})
        return addValue(0, typ)
    end
end

-- 000  000   000  000000000  00000000  00000000   00000000    0000000   000
-- 000  0000  000     000     000       000   000  000   000  000   000  000
-- 000  000 0 000     000     0000000   0000000    00000000   000   000  000
-- 000  000  0000     000     000       000   000  000        000   000  000
-- 000  000   000     000     00000000  000   000  000         0000000   0000000


function interpolation() 
    if kstr.startsWith(topType, 'string double') then 
        if ((string.sub(chunk.turd, 1, 1) == "#") and (string.sub(chunk.turd, 1, 1) == "{")) then 
            pushStack({type = 'interpolation', weak = true})
            setValue(0, 'punct string interpolation')
            setValue(1, 'punct string interpolation')
            return 2
        end
    elseif (topType == 'interpolation') then 
        if (chunk.match == '}') then 
            setValue(0, 'punct string interpolation')
            popStack()
            return 1
        end
    end
end

-- 000   000  00000000  000   000  000   000   0000000   00000000   0000000
-- 000  000   000        000 000   000 0 000  000   000  000   000  000   000
-- 0000000    0000000     00000    000000000  000   000  0000000    000   000
-- 000  000   000          000     000   000  000   000  000   000  000   000
-- 000   000  00000000     000     00     00   0000000   000   000  0000000


function spaced() 
    local prev = getChunk(-1)
    if prev then 
        return ((prev.start + #prev) < chunk.start)
    end
    
    return false
end


function keyword() 
    if notCode then return end
    
    if not extlang.lang[ext] then return end
    
    local prev = getChunk(-1)
    
    if (extlang.lang[ext][chunk.match] and (not prev or ((prev.match ~= '.') and ((spaced() or array('@', '['):has(prev.match)) or (prev.clss ~= 'punct'))))) then 
        chunk.clss = extlang.lang[ext][chunk.match]
        return
    end
end

-- 000   000  00     00  000
--  000 000   000   000  000
--   00000    000000000  000
--  000 000   000 0 000  000
-- 000   000  000   000  0000000


function xmlPunct() 
    if (chunk.turd == '</') then 
        return addValues(2, 'keyword')
    end
    
    if ((chunk.match == '<') or (chunk.match == '>')) then 
        return addValue(0, 'keyword')
    end
end

--  0000000  00000000   00000000
-- 000       000   000  000   000
-- 000       00000000   00000000
-- 000       000        000
--  0000000  000        000


function cppMacro() 
    if (chunk.match == "#") then 
        addValue(0, 'define')
        setValue(1, 'define')
        return 2
    end
end

-- 00     00  00     00  
-- 000   000  000   000  
-- 000000000  000000000  
-- 000 0 000  000 0 000  
-- 000   000  000   000  


function mmMacro() 
    if (chunk.match == "@") then 
        addValue(0, 'define')
        setValue(1, 'define')
        return 2
    end
end


function mmString() 
    if (not chunk.turd or (#chunk.turd < 2)) then return end
    
    local typ = 'string double nsstring'
    
    if (string.sub(chunk.turd, 1, 2) == '@"') then 
        pushStack({strong = true, merge = true, type = typ})
        
        return addValues(2, typ)
    end
end

--  0000000  000   000
-- 000       000   000
-- 0000000   000000000
--      000  000   000
-- 0000000   000   000


function shPunct() 
    if notCode then return end
    
    if ((chunk.match == '/') and ((getChunk(-1).start + #getChunk(-1)) == chunk.start)) then 
        return addValue(-1, 'dir')
    end
    
    if (((chunk.turd == '--') and (getChunk(2).start == (chunk.start + 2))) and ((getChunk(-1).start + #getChunk(-1)) < chunk.start)) then 
        addValue(0, 'argument')
        addValue(1, 'argument')
        setValue(2, 'argument')
        return 3
    end
    
    if (((chunk.match == '-') and (getChunk(1).start == (chunk.start + 1))) and ((getChunk(-1).start + #getChunk(-1)) < chunk.start)) then 
        addValue(0, 'argument')
        setValue(1, 'argument')
        return 2
    end
    
    if ((chunk.match == '~') and (not getChunk(-1) or ((getChunk(-1).start + #getChunk(-1)) < chunk.start))) then 
        setValue(0, 'text dir')
        return 1
    end
end

--  0000000  000000000   0000000    0000000  000   000
-- 000          000     000   000  000       000  000
-- 0000000      000     000000000  000       0000000
--      000     000     000   000  000       000  000
-- 0000000      000     000   000   0000000  000   000


function stacked() 
    if stackTop then 
        if stackTop.weak then return end
        if stackTop.strong then 
            chunk.clss = topType
        else 
            chunk.clss = chunk.clss .. (' ' .. topType)
        end
        
        return 1
    end
    
    return 0
end


function pushExt(mtch) 
    extTop = {switch = mtch, start = line, stack = stack}
    return extStack:push(extTop)
end


function actExt() 
    stack = array()
    stackTop = nil
    topType = ''
    notCode = false
    return notCode
end


function popExt() 
    stack = extTop.stack
    line.ext = extTop.start.ext
    extStack:pop()
    extTop = extStack[#extStack]
    
    stackTop = stack[#stack]
    topType = stackTop.type
    notCode = (stackTop and not codeTypes:has(topType))
    return notCode
end


function pushStack(o) 
    stack:push(o)
    stackTop = o
    topType = o.type
    notCode = not codeTypes:has(topType)
    return notCode
end


function popStack() 
    stack:pop()
    stackTop = stack[#stack]
    if stackTop then 
        topType = stackTop.type
        notCode = not codeTypes:has(topType)
        return notCode
    else 
        topType = ''
        notCode = false
        return notCode
    end
end


function getChunk(d) 
    if line then 
        return line.chunks[(chunkIndex + d)]
    end
end


function setValue(d, value) 
    if line then 
        if ((1 <= (chunkIndex + d)) and ((chunkIndex + d) <= #line.chunks)) then 
            line.chunks[(chunkIndex + d)].clss = value
            return line.chunks[(chunkIndex + d)].clss
        end
    end
end


function getValue(d) 
    local chnk = getChunk(d)
    if chnk then 
        return (chnk.clss or '')
    end
end


function getmatch(d) 
    local chnk = getChunk(d)
    if chnk then 
        return chnk.match
    end
end


function addValue(d, value) 
    if line then 
        if ((1 <= (chunkIndex + d)) and ((chunkIndex + d) <= #line.chunks)) then 
            line.chunks[(chunkIndex + d)].clss = line.chunks[(chunkIndex + d)].clss .. (' ' .. value)
        end
    end
    
    return 1
end


function addValues(n, value) 
    for i = 0, n-1 do 
        addValue(i, value)
    end
    
    return n
end


function addAndJoinValues(n, value) 
    line.chunks[chunkIndex].clss = line.chunks[chunkIndex].clss .. (' ' .. value)
    for i = 1, n-1 do 
        line.chunks[chunkIndex].match = line.chunks[chunkIndex].match .. (line.chunks[(chunkIndex + i)].match)
        line.chunks[chunkIndex]["length"] = line.chunks[chunkIndex]["length"] + 1
    end
    
    line.chunks:splice((chunkIndex + 1), (n - 1))
    return 1
end

local handlers = {
    coffee = {
            punct = array(blockComment, hashComment, tripleRegexp, coffeePunct, tripleString, simpleString, interpolation, dashArrow, regexp, dictionary), 
            word = array(keyword, coffeeWord, number, property)
            }, 
    kode = {
            punct = array(blockComment, hashComment, tripleRegexp, kodePunct, tripleString, simpleString, interpolation, funcArgs, dashArrow, regexp, dictionary), 
            word = array(keyword, kodeWord, number, property)
            }, 
    kim = {
            punct = array(blockComment, hashComment, kodePunct, tripleString, interpolation, simpleString, funcArgs, dashArrow, dictionary), 
            word = array(keyword, kodeWord, number, property)
            }, 
    kua = {
            punct = array(blockComment, hashComment, kodePunct, kolorPunct, tripleString, interpolation, simpleString, funcArgs, dashArrow, dictionary), 
            word = array(keyword, kodeWord, number, property)
            }, 
    nim = {punct = array(nimComment, hashComment, simpleString, funcArgs, dashArrow), word = array(keyword, number, property)}, 
    lua = {punct = array(luaComment, simpleString, luaString, funcArgs, dashArrow), word = array(keyword, number, property)}, 
    noon = {punct = array(noonComment, noonPunct, urlPunct), word = array(noonWord, urlWord, number)}, 
    js = {punct = array(starComment, slashComment, jsPunct, simpleString, dashArrow, regexp, dictionary), word = array(keyword, jsWord, number, property)}, 
    ts = {punct = array(starComment, slashComment, jsPunct, simpleString, dashArrow, regexp, dictionary), word = array(keyword, jsWord, number, property)}, 
    iss = {punct = array(starComment, slashComment, simpleString), word = array(keyword, number)}, 
    ini = {punct = array(starComment, slashComment, simpleString, cppMacro, cppPointer), word = array(number)}, 
    cpp = {punct = array(starComment, slashComment, simpleString, cppMacro, cppPointer), word = array(keyword, number, float, cppWord)}, 
    mm = {punct = array(starComment, slashComment, simpleString, cppPointer), word = array(keyword, number, float, cppWord)}, 
    zig = {punct = array(starComment, slashComment, simpleString), word = array(keyword, number, float, cppWord)}, 
    frag = {punct = array(starComment, slashComment, simpleString, cppMacro, cppPointer), word = array(keyword, number, float, cppWord)}, 
    vert = {punct = array(starComment, slashComment, simpleString, cppMacro, cppPointer), word = array(keyword, number, float, cppWord)}, 
    hpp = {punct = array(starComment, slashComment, simpleString, cppMacro, cppPointer), word = array(keyword, number, float, cppWord)}, 
    c = {punct = array(starComment, slashComment, simpleString, cppMacro, cppPointer), word = array(keyword, number, float, cppWord)}, 
    h = {punct = array(starComment, slashComment, simpleString, cppMacro, cppPointer), word = array(keyword, number, float, cppWord)}, 
    cs = {punct = array(starComment, slashComment, simpleString), word = array(keyword, number)}, 
    pug = {punct = array(starComment, slashComment, simpleString), word = array(keyword, cssWord, number)}, 
    styl = {punct = array(starComment, slashComment, simpleString), word = array(keyword, cssWord, number)}, 
    css = {punct = array(starComment, slashComment, simpleString), word = array(keyword, cssWord, number)}, 
    sass = {punct = array(starComment, slashComment, simpleString), word = array(keyword, cssWord, number)}, 
    scss = {punct = array(starComment, slashComment, simpleString), word = array(keyword, cssWord, number)}, 
    swift = {punct = array(starComment, slashComment, simpleString, dictionary), word = array(keyword, number, property)}, 
    svg = {punct = array(simpleString, xmlPunct), word = array(keyword, number)}, 
    html = {punct = array(simpleString, xmlPunct), word = array(keyword, number)}, 
    htm = {punct = array(simpleString, xmlPunct), word = array(keyword, number)}, 
    xml = {punct = array(simpleString, xmlPunct), word = array(number)}, 
    sh = {punct = array(hashComment, simpleString, urlPunct, shPunct), word = array(keyword, urlWord, number)}, 
    json = {punct = array(simpleString, jsonPunct, urlPunct), word = array(keyword, jsonWord, urlWord, number)}, 
    yml = {punct = array(hashComment, simpleString, urlPunct, shPunct, dictionary), word = array(keyword, jsonWord, urlWord, number, property)}, 
    yaml = {punct = array(hashComment, simpleString, urlPunct, shPunct, dictionary), word = array(keyword, jsonWord, urlWord, number, property)}, 
    log = {punct = array(simpleString, urlPunct, dictionary), word = array(urlWord, number)}, 
    md = {punct = array(mdPunct, urlPunct, xmlPunct), word = array(urlWord, number)}, 
    fish = {punct = array(hashComment, simpleString), word = array(keyword, number)}, 
    py = {punct = array(hashComment, simpleString), word = array(keyword, number)}
    }

for _, ext in ipairs(extlang.exts) do 
    if not handlers[ext] then 
        handlers[ext] = {punct = array(simpleString), word = array(number)}
    end
end

for ext, obj in pairs(handlers) do 
    handlers[ext].punct:push(stacked)
    handlers[ext].word:push(stacked)
end

--[[
0000000    000       0000000    0000000  000   000  00000000  0000000
000   000  000      000   000  000       000  000   000       000   000
0000000    000      000   000  000       0000000    0000000   000   000
000   000  000      000   000  000       000  000   000       000   000
0000000    0000000   0000000    0000000  000   000  00000000  0000000

    lines: array of chunked lines

    returns lines with
    - 'ext' switched in some lines
    - 'value' changed in chunks that match language patterns
--]]


function blocked(lines) 
    extStack = array()
    stack = array()
    handl = array()
    extTop = nil
    stackTop = nil
    notCode = false -- shortcut for top of stack not in codeTypes
    topType = ''
    ext = ''
    chunk = nil
    chunkIndex = 1
    
    -- 000      000  000   000  00000000   0000000
    -- 000      000  0000  000  000       000
    -- 000      000  000 0 000  0000000   0000000
    -- 000      000  000  0000  000            000
    -- 0000000  000  000   000  00000000  0000000
    
    -- write "BLOCKED LINES " lines
    for _, l in ipairs(lines) do 
        -- write "BLOCKED L " l
        _G.line = l
        -- write "BLOCKED LINE " _G.line
        -- write "BLOCKED LINE " line
        
        if not line then 
            write("\x1b[0m\x1b[31m", "DAFUK? NOLINE")
        end
        
        continue = false
        if stackTop then 
            if (stackTop.type == 'comment triple') then 
                local mightBeHeader = true
                for _, chunk in ipairs(line.chunks) do 
                    if not string.match(chunk.match, HEADER) then 
                        mightBeHeader = false
                        break
                    end
                end
                
                if mightBeHeader then 
                    for _, chunk in ipairs(line.chunks) do 
                        chunk.clss = 'comment triple header'
                    end
                    
                    continue = true
                end
            end
            
            if not continue then 
                if stackTop.fill then popStack() end
            end
        end
        
        if not continue then 
            if extTop then 
                if (extTop.switch.indent and (line.chunks[1].start <= extTop.start.chunks[1].start)) then 
                    popExt() -- end of extension block reached that is terminated by indentation
                else 
                    line.ext = extTop.switch.to -- make sure the current line ext matches the topmost from stack
                end
            end
            
            if (ext ~= line.ext) then 
                actExt()
                ext = line.ext
                handl = handlers[ext] -- install new handlers
                -- ▴ handl
                if not handl then 
                    write("\x1b[0m\x1b[31m", 'no handl? ext ', "\x1b[0m\x1b[33m", ext)
                    write("\x1b[0m\x1b[31m", 'no handl? ext ', "\x1b[0m\x1b[32m", line.ext)
                    write("\x1b[0m\x1b[31m", 'no handl? line ', "\x1b[0m\x1b[33m", line)
                    write("\x1b[0m\x1b[31m", 'no handl? handl ', "\x1b[0m\x1b[33m", handlers[ext])
                end
            end
            
            --  0000000  000   000  000   000  000   000  000   000   0000000
            -- 000       000   000  000   000  0000  000  000  000   000
            -- 000       000000000  000   000  000 0 000  0000000    0000000
            -- 000       000   000  000   000  000  0000  000  000        000
            --  0000000  000   000   0000000   000   000  000   000  0000000
            
            chunkIndex = 1
            while (chunkIndex <= #line.chunks) do 
                chunk = line.chunks[chunkIndex]
                
                local beforeIndex = chunkIndex
                
                if kstr.startsWith(chunk.clss, 'punct') then 
                    if extTop then 
                        if (extTop.switch.ende and (extTop.switch.ende == chunk.turd)) then 
                            if extTop.switch.add then 
                                addValues(#chunk.turd, extTop.switch.add)
                            end
                            
                            popExt() -- end of extension block reached that is terminated by turd
                        end
                    end
                    
                    for idx, hnd in ipairs(handl.punct) do 
                        local advance = hnd()
                        if is(advance, "string") then 
                            write("\x1b[0m\x1b[31m", "STRING ADVANCE " .. tostring(ext) .. " |" .. tostring(advance) .. "| ", idx, " ", hnd)
                        end
                        
                        if (advance and (advance ~= 0)) then 
                            chunkIndex = chunkIndex + advance
                            break
                        end
                    end
                else 
                    --if not notCode
                    --    if mtch = swtch[line.ext]?[chunk.match]
                    --        if mtch.turd
                    --            turdChunk = getChunk -mtch.turd.len
                    --            if mtch.turd == (turdChunk.turd ? turdChunk.match)
                    --                # push a new extension onto the stack, ext will change on start of next line
                    --                pushExt mtch
                    --        elif mtch.next and getChunk(1).match == mtch.next
                    --            pushExt mtch
                    
                    for _, hnd in ipairs(handl.word) do 
                        local advance = hnd()
                        if is(advance, "string") then 
                            write("\x1b[0m\x1b[31m", "STRING ADVANCE ", hnd)
                        end
                        
                        if (advance and (advance ~= 0)) then 
                            chunkIndex = chunkIndex + advance
                            break
                        end
                    end
                end
                
                if (chunkIndex == beforeIndex) then 
                    chunkIndex = chunkIndex + 1
                end
            end
        end
    end
    
    return lines
end

-- 00000000    0000000   00000000    0000000  00000000  
-- 000   000  000   000  000   000  000       000       
-- 00000000   000000000  0000000    0000000   0000000   
-- 000        000   000  000   000       000  000       
-- 000        000   000  000   000  0000000   00000000  


function parse(segls, ext) 
    ext = ext or 'kode'
    
    local lines = chunked(segls, ext)
    -- write "PARSE " lines
    -- write "PARSE " line    
    return blocked(lines)
end

-- 000   000   0000000   000       0000000   00000000   000  0000000  00000000  
-- 000  000   000   000  000      000   000  000   000  000     000   000       
-- 0000000    000   000  000      000   000  0000000    000    000    0000000   
-- 000  000   000   000  000      000   000  000   000  000   000     000       
-- 000   000   0000000   0000000   0000000   000   000  000  0000000  00000000  


function kolorize(chunk) 
    local cn = kolor.map[chunk.clss]
    if cn then 
        if is(cn, array) then 
            local v = chunk.match
            for _, cr in ipairs(cn) do 
                v = kolor[cr](v)
            end
            
            return v
        else 
            return kolor[cn](chunk.match)
        end
    end
    
    if kstr.endsWith(chunk.clss, 'file') then 
        return w8(chunk.match)
    elseif kstr.endsWith(chunk.clss, 'ext') then 
        return w3(chunk.match)
    elseif kstr.startsWith(chunk.clss, 'punct') then 
        if string.match(chunk.clss, LI) then 
            return kolorize({match = chunk.match, clss = chunk.clss.replace(LI, ' ')})
        else 
            return w2(chunk.match)
        end
    else 
        if string.match(chunk.clss, LI) then 
            return kolorize({match = chunk.match, clss = chunk.clss.replace(LI, ' ')})
        else 
            return chunk.match
        end
    end
end


function kolorizeChunks(chunks) 
    chunks = chunks or (array())
    
    local clrzd = ''
    local c = 1
    for i in iter(1, #chunks) do 
        while (c < chunks[i].start) do 
            clrzd = clrzd .. ' '
            c = c + 1
        end
        
        clrzd = clrzd .. (kolorize(chunks[i]))
        c = c + (#chunks[i])
    end
    
    return clrzd
end

--  0000000  000   000  000   000  000000000   0000000   000   000  
-- 000        000 000   0000  000     000     000   000   000 000   
-- 0000000     00000    000 0 000     000     000000000    00000    
--      000     000     000  0000     000     000   000   000 000   
-- 0000000      000     000   000     000     000   000  000   000  


function syntax(arg) 
    arg = arg or ({})
    local text = arg.text
    ext = (arg.ext or 'coffee')
    
    local lines = kstr.lines(text)
    local rngs = parse(lines, ext):map(function (l) 
    return l.chunks
end)
    
    local clines = array()
    for index = 0, #lines-1 do 
        if ((ext == 'js') and kstr.startsWith(lines[index], '//# source')) then 
            local _ = nil
        else 
            clines:push(kolorizeChunks(rngs[index]))
        end
    end
    
    return clines.join('\n')
end

-- 0000000    000   0000000   0000000  00000000   0000000  000000000  
-- 000   000  000  000       000       000       000          000     
-- 000   000  000  0000000   0000000   0000000   000          000     
-- 000   000  000       000       000  000       000          000     
-- 0000000    000  0000000   0000000   00000000   0000000     000     


function dissect(segls, ext) 
    ext = ext or 'kode'
    
    if empty(segls) then return array() end
    
    segls = kseg.segls(segls)
    return parse(segls, ext):map(function (l) 
    return l.chunks
end)
end


function ranges(str, ext) 
    ext = ext or 'kode'
    
    return parse(array(kseg(str)), ext)[1].chunks
end

-- 00000000  000   000  00000000    0000000   00000000   000000000   0000000  
-- 000        000 000   000   000  000   000  000   000     000     000       
-- 0000000     00000    00000000   000   000  0000000       000     0000000   
-- 000        000 000   000        000   000  000   000     000          000  
-- 00000000  000   000  000         0000000   000   000     000     0000000   

return {
    klor = klor, 
    exts = exts, 
    parse = parse, 
    chunked = chunked, 
    ranges = ranges, 
    dissect = dissect, 
    kolorize = kolorize, 
    kolorizeChunks = kolorizeChunks, 
    syntax = syntax
    }