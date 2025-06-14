--[[
000000000  00000000  000   000  000000000
   000     000        000 000      000   
   000     0000000     00000       000   
   000     000        000 000      000   
   000     00000000  000   000     000   
--]]


local pair = class("pair")
    

-- ███   ███  ███   ███  ███████     ███████   ███       ███████   ███   ███   ███████  ████████  ███████  
-- ███   ███  ████  ███  ███   ███  ███   ███  ███      ███   ███  ████  ███  ███       ███       ███   ███
-- ███   ███  ███ █ ███  ███████    █████████  ███      █████████  ███ █ ███  ███       ███████   ███   ███
-- ███   ███  ███  ████  ███   ███  ███   ███  ███      ███   ███  ███  ████  ███       ███       ███   ███
--  ███████   ███   ███  ███████    ███   ███  ███████  ███   ███  ███   ███   ███████  ████████  ███████  


function pair.static.isUnbalancedPosition(lines, pos, char) 
        -- revs = {
        --     ']': '[' 
        --     '}': '{' 
        --     ')': '('
        --     '"': '"'
        --     "'": "'"}
        --        
        -- p = pepe kseg.str(lines[pos[2]])
        -- start = p.unbalanced∙slice(2)∙map((s) -> s.start)
        -- valid start and start∙has(revs[char])
        return false
    end

--  0000000  000000000  00000000   000  000   000   0000000   
-- 000          000     000   000  000  0000  000  000        
-- 0000000      000     0000000    000  000 0 000  000  0000  
--      000     000     000   000  000  000  0000  000   000  
-- 0000000      000     000   000  000  000   000   0000000   


function pair.static.isRangeInString(lines, rng) 
    return (pair.rangeOfStringSurroundingRange(lines, rng) ~= nil)
    end


function pair.static.rangeOfStringSurroundingRange(lines, rng) 
        local ir = belt.rangeOfInnerStringSurroundingRange(lines, rng)
        if ir then 
            return belt.rangeGrownBy(ir, 1)
        end
    end


function pair.static.rangeOfInnerStringSurroundingRange(lines, rng) 
        if belt.isInvalidLineIndex(lines, rng[2]) then return end
        
        local rgs = belt.rangesOfStringsInText(lines[rng[2]]:str(), rng[2])
        rgs = belt.rangesShrunkenBy(rgs, 1)
        for _, r in ipairs(rgs) do 
            if belt.rangeContainsRange(r, rng) then return r end
        end
    end


function pair.static.rangesOfStringsInText(text, li) 
        li = li or 1
        
        local rngs = array()
        local ss = -1
        local cc = nil
        for i in iter(1, #text) do 
            local c = string.sub(text, i, i)
            if (not cc and ((c == "'") or (c == '"'))) then 
                cc = c
                ss = i
            elseif (c == cc) then 
                if ((string.sub(text, (i - 1), (i - 1)) ~= '\\') or ((i > 2) and (string.sub(text, (i - 2), (i - 2)) == '\\'))) then 
                    rngs:push(array(ss, li, (i + 1), li))
                    cc = nil
                    ss = -1
                end
            end
        end
        
        return rngs
    end

--  0000000   000   000  000000000   0000000  000  0000000    00000000      0000000  000000000  00000000   
-- 000   000  000   000     000     000       000  000   000  000          000          000     000   000  
-- 000   000  000   000     000     0000000   000  000   000  0000000      0000000      000     0000000    
-- 000   000  000   000     000          000  000  000   000  000               000     000     000   000  
--  0000000    0000000      000     0000000   000  0000000    00000000     0000000      000     000   000  


function pair.static.positionsAndRangesOutsideStrings(lines, rngs, posl) 
        local found = array()
        
        for _, rng in ipairs(rngs) do 
            if not belt.isRangeInString(lines, rng) then 
                found:push(rng)
            end
        end
        
        for _, pos in ipairs(posl) do 
            if not belt.isRangeInString(lines, belt.rangeForPos(pos)) then 
                found:push(pos)
            end
        end
        
        return found
    end

-- 00000000    0000000   000  00000000    0000000         0000000  000   000  00000000   00000000   0000000     0000000   
-- 000   000  000   000  000  000   000  000             000       000   000  000   000  000   000  000   000  000        
-- 00000000   000000000  000  0000000    0000000         0000000   000   000  0000000    0000000    000   000  000  0000  
-- 000        000   000  000  000   000       000             000  000   000  000   000  000   000  000   000  000   000  
-- 000        000   000  000  000   000  0000000         0000000    0000000   000   000  000   000  0000000     0000000   


function pair.static.rangesOfNestedPairsAtPositions(lines, posl) 
        local rngs = array()
        -- for pos in posl
        --     for pair in pepe.pairsAtCol(kseg.str(lines[pos[1]]) pos[0])
        --         rngs∙push [pair.rng[0] pos[1] pair.rng[1] pos[1]]
        return rngs
    end


function pair.static.spansOfNestedPairsAtPositions(lines, posl) 
        local spans = array()
        local brackets = array()
        local strings = array()
        
        -- for pos in posl
        --     
        --     for pair in pepe.pairsAtCol(kseg.str(lines[pos[1]]) pos[0])
        --         open  = [pair.rng[0] pos[1] pair.rng[0]+pair.start.len]
        --         close = [pair.rng[1] pos[1] pair.rng[1]+pair.ende.len]
        --         spans∙push open
        --         spans∙push close
        --         
        --         if pair.start == '"' or pair.start == "'"
        --             strings∙push open
        --             strings∙push close
        --         else
        --             brackets∙push open
        --             brackets∙push close
        
        return array(spans, brackets, strings)
    end


function pair.static.rangesOfPairsSurroundingPositions(lines, pairs, posl) 
        local rngs = array()
        for _, pos in ipairs(posl) do 
            for _, pair in ipairs(pairs) do 
                if (kstr.endsWith(belt.chunkBeforePos(lines, pos), pair[1]) and kstr.startsWith(belt.chunkAfterPos(lines, pos), pair[2])) then 
                    rngs:push(array((pos[1] - #pair[1]), pos[2], (pos[1] + #pair[2]), pos[2]))
                end
            end
        end
        
        return rngs
    end


function pair.static.stringDelimiterSpansForPositions(lines, posl) 
        local spans = array()
        for _, pos in ipairs(posl) do 
            local srng = belt.rangeOfStringSurroundingRange(lines, array(pos[1], pos[2], pos[1], pos[2]))
            if srng then 
                spans:push(array(srng[1], srng[2], (srng[1] + 1)))
                spans:push(array((srng[3] - 1), srng[4], srng[3]))
            elseif ((lines[pos[2]][pos[1]] == '"') or (lines[pos[2]][pos[1]] == "'")) then 
                srng = belt.rangeOfStringSurroundingRange(lines, array((pos[1] + 1), pos[2], (pos[1] + 1), pos[2]))
                if srng then 
                    spans:push(array(srng[1], srng[2], (srng[1] + 1)))
                    spans:push(array((srng[3] - 1), srng[4], srng[3]))
                end
            end
        end
        
        return spans
    end

--  ███████   ████████   ████████  ███   ███         ███████  ███       ███████    ███████  ████████
-- ███   ███  ███   ███  ███       ████  ███        ███       ███      ███   ███  ███       ███     
-- ███   ███  ████████   ███████   ███ █ ███        ███       ███      ███   ███  ███████   ███████ 
-- ███   ███  ███        ███       ███  ████        ███       ███      ███   ███       ███  ███     
--  ███████   ███        ████████  ███   ███         ███████  ███████   ███████   ███████   ████████


function pair.static.openCloseSpansForPositions(lines, posl) 
        local spans = array()
        for _, pos in ipairs(posl) do 
            local sps = pair.openCloseSpansForPosition(lines, pos)
            if sps then 
                spans = spans.concat(sps)
            end
        end
        
        return spans
    end


function pair.static.openCloseSpansForPosition(lines, pos) 
        local open = {
            ['['] = ']', 
            ['{'] = '}', 
            ['('] = ')'
            }
        
        local revs = {
            [']'] = '[', 
            ['}'] = '{', 
            [')'] = '('
            }
        
        local opns = dict.keys(open)
        local clos = dict.values(open)
        
        local maxLookups = 1000 -- careful, increasing this drops performance significantly!
        local lastOpen = nil
        local bp = array(pos[1], pos[2])
        
        if not opns:has(lines[bp[2]][bp[1]]) then 
            local closeEncounters = ''
            local openEncounters = ''
            
            local stack = array()
            
            local cnt = 0
            while true do 
                local cont = false
                bp[1] = bp[1] - 1
                if (bp[1] >= 1) then 
                    local prev = lines[bp[2]][bp[1]]
                    if opns:has(prev) then 
                        if #stack then 
                            if (open[prev] == stack[#stack]) then 
                                openEncounters = openEncounters .. prev
                                stack:pop()
                                cont = true
                            else 
                                return
                            end
                        end
                        
                        if not cont then 
                            lastOpen = prev
                            break
                        end
                    elseif clos:has(prev) then 
                        stack:push(prev)
                        closeEncounters = closeEncounters .. prev
                    end
                else 
                    bp[2] = bp[2] - 1
                    if (bp[2] < 1) then break end
                    bp[1] = #lines[bp[2]]
                end
                
                if not cont then 
                    if lastOpen then break end
                    if (bp[2] < 1) then break end
                    cnt = cnt + 1
                    if (cnt > maxLookups) then break end
                end
            end
        else 
            lastOpen = lines[bp[2]][bp[1]]
        end
        
        local stack = array()
        local ap = array(max((bp[1] + 1), pos[1]), pos[2])
        local cnt = 0
        
        while (ap[2] < #lines) do 
            local next = lines[ap[2]][ap[1]]
            
            if clos:has(next) then 
                if #stack then 
                    if (open[stack[#stack]] == next) then 
                        stack:pop()
                    else 
                        return -- stack mismatch
                    end
                else 
                    local firstClose = next
                    break
                end
            elseif opns:has(next) then 
                stack:push(next)
            end
            
            ap[1] = ap[1] + 1
            if (ap[1] >= #lines[ap[2]]) then 
                ap[1] = 1
                ap[2] = ap[2] + 1
            end
            
            cnt = cnt + 1
            if (cnt > maxLookups) then break end
        end
        
        if (not lastOpen or not firstClose) then 
            if (pos[2] >= #lines) then print("pos[2] too large") ; return end
            if empty(lines[pos[2]]) then return end
            if ((pos[1] - 1) >= #lines[pos[2]]) then print("pos[1]-1 too large") ; return end
            if (#lines[pos[2]] >= #revs) then print("lines[pos[2]] too large for revs") ; return end
            if empty(revs[lines[pos[2]]]) then return end
            if ((pos[1] - 1) >= #revs[lines[pos[2]]]) then print("pos[1]-1 too large for revs") ; return end
            if (clos:has(lines[pos[2]][(pos[1] - 1)]) and (kstr.find(openEncounters, revs[lines[pos[2]][(pos[1] - 1)]]) >= 1)) then 
                return pair.openCloseSpansForPosition(lines, array((pos[1] - 1), pos[2]))
            end
            
            return
        end
        
        if (open[lastOpen] == firstClose) then 
            return array(array(bp[1], bp[2], (bp[1] + 1)), array(ap[1], ap[2], (ap[1] + 1)))
        end
        
        return
    end

return pair