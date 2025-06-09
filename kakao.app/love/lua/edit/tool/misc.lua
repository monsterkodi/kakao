--[[
    00     00  000   0000000   0000000  
    000   000  000  000       000       
    000000000  000  0000000   000       
    000 0 000  000       000  000       
    000   000  000  0000000    0000000  
--]]

-- use ../../../kxk ▪ kutil kseg
-- use ../../../kxk ◆ pepe
-- use              ◆ belt


local misc = class("misc")
    

--[[
     0000000   0000000   00     00  00000000   000      00000000  000000000  000   0000000   000   000  
    000       000   000  000   000  000   000  000      000          000     000  000   000  0000  000  
    000       000   000  000000000  00000000   000      0000000      000     000  000   000  000 0 000  
    000       000   000  000 0 000  000        000      000          000     000  000   000  000  0000  
     0000000   0000000   000   000  000        0000000  00000000     000     000   0000000   000   000  

    args:
        before   the chunk before the cursor
        turd     the part of it that needs completion, usually the last word or the last punctuation character  
        words    list of chunks collected from current file and other sources
    
    ⮐  list of strings suitable for completion
    
    filters chunks that don't match
    removes trailing crappy punctuation from the matching chunks
    inserts matching subwords if chunk contains punctuation, eg: for chunk 'obj.prop' and before 'my.' it will include '.prop'
    --]]


function misc.static.prepareWordsForCompletion(before, turd, words) 
        local filtered = array()
        
        for wi, w in ipairs(words) do 
            if kstr.startsWith(w, turd) then 
                if kstr.startsWith(w, '..') then _ = nil
                elseif kstr.startsWith(w, './') then _ = nil
                elseif (string.match(w, "\\d+.\\d+") and not w.startsWith(before)) then _ = nil
                else 
                        local p = pepe(w)
                        if (p.unbalanced or p.mismatch) then 
                            if (w.endsWith(p.tail) and p.mismatch) then 
                                local fix = p.mismatch[1].content[1]
                                filtered:push(fix)
                                local wds = kseg.words(fix)
                                if valid(wds) then 
                                    local fst = string.sub(fix, 1, (wds[1].index + #wds[1].word))
                                    if (fst ~= fix) then 
                                        filtered:push(fst)
                                    end
                                end
                            elseif p.unbalanced then 
                                local fix = p.unbalanced[1].content[1]
                                filtered:push(fix)
                            end
                        else 
                            if (0 <= kstr.find(w, '\n')) then 
                                w = string.sub(w, 1, kstr.find(w, '\n'))
                            end
                            
                            local push = true
                            local wds = kseg.words(w)
                            if valid(wds) then 
                                local balanced = false
                                local lst = (wds[1].index + #wds[1].word)
                                if (lst < #w) then 
                                    if (lst >= #before) then 
                                        local fst = string.sub(w, 1, lst)
                                        p = pepe(fst)
                                        if (not p.unbalanced or p.mismatch) then 
                                            filtered:push(fst)
                                            push = false
                                        else 
                                            balanced = true
                                        end
                                    end
                                    
                                    if not balanced then 
                                        push = false
                                    end
                                end
                            end
                            
                            if push then 
                                filtered:push(w)
                            end
                        end
                end
            else 
                local wds = kseg.words(w)
                for idx, subw in ipairs(wds) do 
                    if subw.word.startsWith(turd) then 
                        filtered:push(subw.word)
                        
                        if ((idx == (#wds - 1)) and ((subw.index + #subw.word) < (#w - 1))) then 
                            local rwd = string.sub(w, subw.index)
                            local p = pepe(rwd)
                            if not (p.unbalanced or p.mismatch) then 
                                filtered:push(rwd)
                            end
                        end
                    elseif ((#turd == 1) and (turd == w[(subw.index - 1)])) then 
                        if (turd ~= '.') then 
                            filtered:push((turd[-1] + subw.word))
                        else 
                            if (string.match(before, "\\d+\\.") and string.match(subw.word, "\\d+")) then 
                                if w.startsWith(before) then 
                                    filtered:push((turd[-1] + subw.word))
                                end
                            elseif (not string.match(before, "\\d+\\.") and not string.match(subw.word, "\\d+")) then 
                                filtered:push((turd[-1] + subw.word))
                            end
                        end
                    end
                end
            end
        end
        
        words = kutil.uniq(filtered)
        
        if empty(words) then return array() end
        
        local segls = array()
        
        
        function push(s) 
            if (kseg.str(s) == turd) then return end
            
            local ws = kseg.words(s)
            ws = ws.filter(function (w) 
    return ((w.index + #w.segl) > #turd)
end)
            
            if valid(ws[0]) then 
                if (((ws[0].index == 0) and ((turd ~= ws[0].word) ~= s)) and ws[0].word.startsWith(turd)) then 
                    segls.push(ws[0].segl)
                end
            end
            
            return segls.push(s)
        end
        
        for si, segl in ipairs(kseg.segls(words)) do 
            local tc = kseg.tailCountTurd(segl)
            
            if ((tc == 0) or ((tc == 1) and (segl[0] == segl[-1]))) then 
                push(segl)
            else 
                local ends = kseg.str(segl:slice((#segl - tc)))
                if ((kstr.find('])}', ends) >= 1) or ((kstr.find('])}', string.sub(ends, #ends, #ends)) >= 1) and (string.sub(ends, (#ends - 1), (#ends - 1)) ~= ','))) then 
                    push(segl)
                else 
                    local beforeTurd = segl:slice(1, (#segl - tc))
                    if valid(beforeTurd) then 
                        push(segl:slice(1, (#segl - tc)))
                    end
                end
            end
        end
        
        local strs = segls.map(kseg.str)
        strs.sort()
        return kutil.uniq(strs)
    end

--  0000000   0000000   00     00  00     00  00000000  000   000  000000000  
-- 000       000   000  000   000  000   000  000       0000  000     000     
-- 000       000   000  000000000  000000000  0000000   000 0 000     000     
-- 000       000   000  000 0 000  000 0 000  000       000  0000     000     
--  0000000   0000000   000   000  000   000  00000000  000   000     000     


function misc.static.isCommentLine(line) 
        local trimmed = kseg.trim(line)
        return (trimmed[0] == "#")
    end


function misc.static.indexOfExtremePositionInDirection(posl, dir, index) 
        local cmp = nil
        local exi = nil
        local start = nil
        local ci = 1
        
        if (dir == 'left') or (dir == 'right') then ci = 1
        elseif (dir == 'up') or (dir == 'down') then ci = 2
        end
        
        if (dir == 'left') or (dir == 'up') then start = Infinity ; function cmp(a, b) 
    return (a > b)
                                                 end
        elseif (dir == 'right') or (dir == 'down') then start = -Infinity ; function cmp(a, b) 
    return (a < b)
                                                 end
        end
        
        for idx, pos in ipairs(posl) do 
            if cmp(start, pos[ci]) then 
                start = pos[ci]
                exi = idx
            end
        end
        
        if (valid(index) and valid(posl[index])) then 
            if (posl[exi][ci] == posl[index][ci]) then 
                return index
            end
        end
        
        return exi
    end

return misc