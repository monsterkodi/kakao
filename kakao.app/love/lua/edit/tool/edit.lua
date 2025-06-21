--[[
    00000000  0000000    000  000000000
    000       000   000  000     000   
    0000000   000   000  000     000   
    000       000   000  000     000   
    00000000  0000000    000     000   
--]]


local edit = class("edit")
    

-- 000  000   000   0000000  00000000  00000000   000000000
-- 000  0000  000  000       000       000   000     000   
-- 000  000 0 000  0000000   0000000   0000000       000   
-- 000  000  0000       000  000       000   000     000   
-- 000  000   000  0000000   00000000  000   000     000   


function edit.static.insertTextAtPositions(lines, text, posl) 
        if empty(text) then return lines, posl end
        
        -- log "insertTextAtPositions lines " noon lines
        -- log "insertTextAtPositions text  " noon text
        -- log "insertTextAtPositions posl  " noon posl
        
        if (text == '\t') then 
            local pos = posl[1]
            text = kstr.lpad((4 - ((pos[1] - (1 % 4)) + 1)), ' ')
        end
        
        text = kstr.detab(text)
        local txtls = belt.seglsForText(text)
        local newls = array()
        local newpl = array()
        local line = kseg()
        local rngs = belt.rangesForLinesSplitAtPositions(lines, posl)
        local before = array()
        -- log ◌b "INSERT ------------- " rngs
        for idx, rng in ipairs(rngs) do 
            -- log ◌y "INSERT ------------- " idx, rng       
            local after = belt.seglsForRange(lines, rng)
            -- log ◌y "INSERT ------------- " idx
            if (empty(after) or empty(after[1])) then 
                if (posl[posl:len()][2] > lines:len()) then 
                    before:push(array())
                end
            end
            
            -- log ◌y "INSERT ------------- " idx
            if (idx > 1) then 
                local x = posl[(idx - 1)][1]
                
                if valid(before) then line = before:pop()
                else line = newls:pop()
                end
                
                if (((x - 1) > kseg.width(line)) and (text ~= '\n')) then 
                    line = line + (kstr.split(kstr.lpad(((x - 1) - #line)), ''))
                end
                
                if (txtls:len() > 1) then 
                    if ((posl:len() > 1) and (text ~= '\n')) then 
                        local insertLineIndex = (((idx - 2) % txtls:len()) + 1)
                        before:push((line + txtls[insertLineIndex]))
                        newpl:push(array(kseg.width(before[before:len()]), ((newls:len() + before:len()) - 1)))
                        before:push((before:pop() + after:shift()))
                    else 
                        local posLineIndent = belt.numIndent(line)
                        local indent = kseg(kstr.lpad(posLineIndent))
                        before:push((line + txtls[1]))
                        
                        for insl, lidx in txtls:slice(2):each() do 
                            if ((#insl > 0) or (text == '\n')) then 
                                -- write "PUSH |#{insl}|"
                                before:push((indent + insl))
                            end
                        end
                        
                        if ((x - 1) > posLineIndent) then 
                            newpl:push(array((kseg.width(before[before:len()]) + 1), (newls:len() + before:len())))
                            before:push((before:pop() + after:shift()))
                        else 
                            after:unshift((indent + after:shift()))
                            if (text == '\n') then before:pop() end
                            newpl:push(array((kseg.width(indent) + 1), ((newls:len() + before:len()) + 1)))
                        end
                    end
                    
                    newls = newls + before
                else 
                    newpl:push(array(((kseg.width(line) + kseg.width(txtls[1])) + 1), ((newls:len() + before:len()) + 1)))
                    line = line + (txtls[1])
                    line = line + (after:shift())
                    newls = newls + before
                    newls:push(line)
                end
            end
            
            -- log ◌y "INSERT <------------ " idx
            before = after
        end
        
        -- log ◌y "INSERT <<-----------" posl∙len(), lines∙len()
        if ((posl:len() >= 1) and (posl[posl:len()][2] <= lines:len())) then 
            newls = newls + before
        end
        
        -- log ◌y "INSERT <<◂----------" noon newls 
        -- log ◌y "INSERT ◂◂◂----------" newpl 
        return newls, newpl
    end

--  0000000  000   000  00000000   00000000    0000000   000   000  000   000  0000000    
-- 000       000   000  000   000  000   000  000   000  000   000  0000  000  000   000  
-- 0000000   000   000  0000000    0000000    000   000  000   000  000 0 000  000   000  
--      000  000   000  000   000  000   000  000   000  000   000  000  0000  000   000  
-- 0000000    0000000   000   000  000   000   0000000    0000000   000   000  0000000    


function edit.static.insertSurroundAtRanges(lines, rngs, trigger, pair) 
        local begl = belt.startPositionsOfRanges(rngs)
        
        local lines, begl = belt.insertTextAtPositions(lines, pair[0], begl)
        
        local endl = array()
        for pos, idx in ipairs(begl) do 
            endl:push(array(((pos[0] + rngs[idx][2]) - rngs[idx][0]), pos[1]))
        end
        
        lines, endl = belt.insertTextAtPositions(lines, pair[1], endl)
        
        if ((pair[0][0] == trigger) and (pair[0] ~= pair[1])) then 
            return lines, begl
        else 
            return lines, endl
        end
    end

-- 0000000    00000000  000      00000000  000000000  00000000  
-- 000   000  000       000      000          000     000       
-- 000   000  0000000   000      0000000      000     0000000   
-- 000   000  000       000      000          000     000       
-- 0000000    00000000  0000000  00000000     000     00000000  


function edit.static.deleteLineRangesAndAdjustPositions(lines, rngs, posl) 
        if is(lines.arr, "function") then 
            lines = lines:arr(false)
        else 
            lines = array.from(lines)
        end
        
        posl = array.from(posl)
        
        if empty(rngs) then return lines, posl end
        if (rngs:len() < 1) then return lines, posl end
        
        for ri in iter(rngs:len(), 1) do 
            local rng = rngs[ri]
            
            if (rng == nil) then 
                write("nil range at index " .. tostring(ri) .. "?")
                return lines, posl
            end
            
            if ((rng[2] > lines:len()) or (rng[4] > lines:len())) then 
                write("range out of bounds?", rng)
                return lines, posl
            end
            
            posl = belt.adjustPositionsForDeletedLineRange(posl, lines, rng)
            
            if (rng[2] == rng[4]) then 
                -- write ◌y "RNG -------------------------------- #{rng}"
                
                if ((rng[1] == 1) and (rng[3] > lines[rng[2]]:len())) then 
                    lines:splice(rng[2], 1)
                else 
                    local slcl = lines[rng[2]]:slice(1, (rng[1] - 1))
                    -- write ◌b "slcl " slcl 
                    local slcr = lines[rng[2]]:slice(rng[3])
                    -- write ◌b "slcr " slcr 
                    local repl = (slcl + slcr)
                    -- write ◌g "repl " repl
                    -- write ◌r "SPLICE" rng 
                    lines:splice(rng[2], 1, repl)
                    -- write ◌y "SPLICE" lines
                end
            else 
                local partialLast = false
                if (rng[3] == lines[rng[4]]:len()) then 
                    lines:splice(rng[4], 1)
                else 
                    lines:splice(rng[4], 1, lines[rng[4]]:slice(rng[3]))
                    partialLast = true
                end
                
                if ((rng[4] - rng[2]) >= 2) then 
                    lines:splice((rng[2] + 1), ((rng[4] - rng[2]) - 1))
                end
                
                if (rng[1] == 1) then 
                    lines:splice(rng[2], 1)
                else 
                    lines:splice(rng[2], 1, lines[rng[2]]:slice(1, (rng[1] - 1)))
                    
                    if partialLast then 
                        lines:splice(rng[2], 2, (lines[rng[2]] + lines[(rng[2] + 1)]))
                    end
                end
            end
        end
        
        -- write ◌m "LINES " lines ◌c "\nPOSL " posl       
        return lines, posl
    end


function edit.static.adjustPositionsForDeletedLineRange(posl, lines, rng) 
        if empty(posl) then return posl end
        
        for pi in iter(#posl, 1) do 
            local pos = posl[pi]
            
            if belt.isPosTouchingRange(pos, rng) then 
                pos[1] = rng[1]
                pos[2] = rng[2]
            elseif belt.isPosAfterRange(pos, rng) then 
                if (pos[2] == rng[4]) then 
                    pos[1] = pos[1] - ((rng[3] - rng[1]))
                    if (rng[2] < rng[4]) then 
                        pos[2] = pos[2] - ((rng[4] - rng[2]))
                    end
                else 
                    pos[2] = pos[2] - (belt.numFullLinesInRange(lines, rng))
                end
            else 
                break
            end
        end
        
        return belt.removeDuplicatePositions(posl)
    end


function edit.static.moveCursorsInSameLineBy(cursors, cursor, delta) 
        local ci = cursors:find(cursor)
        
        while true do 
            cursors[ci][1] = cursors[ci][1] + delta
            ci = ci + 1
            
            if (ci >= #cursors) then return end
            if (cursors[ci][2] > cursor[2]) then return end
        end
    end

--  0000000   0000000    0000000          00000000    0000000   000   000   0000000   00000000   0000000  
-- 000   000  000   000  000   000        000   000  000   000  0000  000  000        000       000       
-- 000000000  000   000  000   000        0000000    000000000  000 0 000  000  0000  0000000   0000000   
-- 000   000  000   000  000   000        000   000  000   000  000  0000  000   000  000            000  
-- 000   000  0000000    0000000          000   000  000   000  000   000   0000000   00000000  0000000   


function edit.static.addLinesBelowPositionsToRanges(lines, posl, rngs) 
        local newp = array()
        local newr = rngs:arr()
        
        
        function addLineAtIndex(c, i) 
            local range = belt.rangeOfLine(lines, i)
            if belt.isEmptyRange(range) then 
                range[2] = range[2] + 1
            end
            
            newr:push(range)
            return newp:push(belt.endOfRange(range))
        end
        
        for c in posl:each() do 
            if not belt.rangesContainLine(rngs, c[2]) then 
                addLineAtIndex(c, c[2])
            elseif (c[2] < lines:len()) then 
                addLineAtIndex(c, (c[2] + 1))
            end
        end
        
        if empty(newp) then return posl, rngs end
        
        return newp, newr
    end

-- 00000000   00000000  00     00   0000000   000   000  00000000     00000000   000   000   0000000    0000000    
-- 000   000  000       000   000  000   000  000   000  000          000   000  0000  000  000        000         
-- 0000000    0000000   000000000  000   000   000 000   0000000      0000000    000 0 000  000  0000  0000000     
-- 000   000  000       000 0 000  000   000     000     000          000   000  000  0000  000   000       000    
-- 000   000  00000000  000   000   0000000       0      00000000     000   000  000   000   0000000   0000000     


function edit.static.removeLinesAtPositionsFromRanges(lines, posl, rngs) 
        local newp = array()
        local newr = belt.splitLineRanges(lines, rngs)
        
        for _, pos in ipairs(posl) do 
            local rng = belt.rangeInRangesTouchingPos(newr, pos)
            if rng then 
                local idx = newr.indexOf(rng)
                if (idx > 0) then 
                    newp:push(belt.endOfRange(newr[(idx - 1)]))
                else 
                    newp:push(belt.endOfRange(newr[idx]))
                end
                
                newr:splice(idx, 1)
            else 
                newp:push(pos)
            end
        end
        
        return newp, newr
    end


function edit.static.rangeForJoiningLine(lines, idx) 
    return array((lines[idx]:len() + 1), idx, 1, (idx + 1))
    end


function edit.static.rangesForJoiningLines(lines, idxs) 
        return idxs:map(function (idx) 
    return belt.rangeForJoiningLine(lines, idx)
end)
    end

-- 00     00   0000000   000   000  00000000         000      000  000   000  00000000   0000000  
-- 000   000  000   000  000   000  000              000      000  0000  000  000       000       
-- 000000000  000   000   000 000   0000000          000      000  000 0 000  0000000   0000000   
-- 000 0 000  000   000     000     000              000      000  000  0000  000            000  
-- 000   000   0000000       0      00000000         0000000  000  000   000  00000000  0000000   


function edit.static.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, posl, indices, dir) 
        if ((empty(indices) or ((dir == 'down') and (indices[indices:len()] >= lines:len()))) or ((dir == 'up') and (indices[1] <= 1))) then 
            return lines, rngs, posl
        end
        
        local newLines = lines:arr()
        local newRngs = rngs:arr()
        local newPosl = posl:arr()
        
        local rs, re = (function () 
    if (dir == 'down') then 
    return indices:len(), 1
                  elseif (dir == 'up') then 
    return 1, indices:len()
                  end
end)()
        
        local d = (function () 
    if (dir == 'down') then 
    return 1
            elseif (dir == 'up') then 
    return -1
            end
end)()
        
        for ii in iter(rs, re) do 
            local index = indices[ii]
            
            if (dir == 'down') then newLines:splice(index, 2, newLines[(index + 1)], newLines[index])
            elseif (dir == 'up') then newLines:splice((index - 1), 2, newLines[index], newLines[(index - 1)])
            end
            
            for _, pos in ipairs(newPosl) do 
                if (pos[2] == index) then 
                    pos[2] = pos[2] + d
                end
            end
            
            for _, rng in ipairs(newRngs) do 
                if (rng[2] == index) then 
                    rng[2] = rng[2] + d
                    rng[4] = rng[4] + d
                end
            end
        end
        
        return newLines, newRngs, newPosl
    end

--  0000000  000       0000000   000   000  00000000        000      000  000   000  00000000   0000000  
-- 000       000      000   000  0000  000  000             000      000  0000  000  000       000       
-- 000       000      000   000  000 0 000  0000000         000      000  000 0 000  0000000   0000000   
-- 000       000      000   000  000  0000  000             000      000  000  0000  000            000  
--  0000000  0000000   0000000   000   000  00000000        0000000  000  000   000  00000000  0000000   


function edit.static.cloneLineBlockRangesAndMoveRangesAndPositionsInDirection(lines, blocks, rngs, posl, dir) 
        if ((empty(blocks) or ((dir == 'down') and (blocks[blocks:len()][4] > lines:len()))) or ((dir == 'up') and (blocks[1][2] <= 1))) then 
            return lines, rngs, posl
        end
        
        local newLines = lines:arr()
        local newRngs = rngs:arr()
        local newPosl = posl:arr()
        
        local rs, re = (function () 
    if (dir == 'down') then 
    return #blocks, 1
                  elseif (dir == 'up') then 
    return 1, #blocks
                  end
end)()
        
        local d = (function () 
    if (dir == 'down') then 
    return 1
            elseif (dir == 'up') then 
    return -1
            end
end)()
        
        for bi in iter(rs, re) do 
            local block = blocks[bi]
            
            local text = belt.textForLineRange(newLines, block)
            text = text .. '\n'
            
            local insidx = (function () 
    if (dir == 'up') then 
    return block[2] else 
    return (block[4] + 1)
                     end
end)()
            
            newLines, posl = belt.insertTextAtPositions(newLines, text, array(array(1, insidx)))
            
            if (dir == 'down') then 
                d = ((block[4] - block[2]) + 1)
                
                for _, pos in ipairs(newPosl) do 
                    if belt.rangeContainsPos(block, pos) then 
                        pos[2] = pos[2] + d
                    end
                end
                
                for _, rng in ipairs(newRngs) do 
                    if belt.rangeContainsRange(block, rng) then 
                        rng[2] = rng[2] + d
                        rng[4] = rng[4] + d
                    end
                end
            end
        end
        
        return newLines, newRngs, newPosl
    end

--  0000000   0000000   00     00  00     00  00000000  000   000  000000000   0000000  
-- 000       000   000  000   000  000   000  000       0000  000     000     000       
-- 000       000   000  000000000  000000000  0000000   000 0 000     000     0000000   
-- 000       000   000  000 0 000  000 0 000  000       000  0000     000          000  
--  0000000   0000000   000   000  000   000  00000000  000   000     000     0000000   


function edit.static.toggleCommentsInLineRangesAtIndices(lines, rngs, posl, indices) 
        if empty(indices) then return lines, rngs, posl end
        
        local newLines = lines:arr()
        local newRngs = rngs:arr()
        local newPosl = posl:arr()
        
        local comStart = kseg('#')
        local minIndent = Infinity
        
        for _, index in ipairs(indices) do 
            local indent, line = belt.splitLineIndent(newLines[index])
            if not kseg.startsWith(line, comStart) then 
                local comment = comStart
                minIndent = min(#indent, minIndent)
            end
        end
        
        local comIndent = ''
        if comment then 
            comIndent = kseg.rep(minIndent)
        end
        
        for _, index in ipairs(indices) do 
            local indent, line = belt.splitLineIndent(newLines[index])
            if comment then 
                indent = kseg.rep((#indent - minIndent))
                local newLine = kseg.join(comIndent, comment, indent, ' ', line)
            else 
                local d = (function () 
    if (line[#comStart] == ' ') then 
    return 1 else 
    return 0
                    end
end)()
                local newLine = kseg.join(indent, line:slice((comStart:len() + d)))
            end
            
            newLines:splice(index, 1, newLine)
        end
        
        return newLines, newRngs, newPosl
    end


function edit.static.toggleCommentTypesInLineRangesAtIndices(lines, rngs, posl, indices) 
        if empty(indices) then return lines, rngs, posl end
        
        local newLines = lines:map(function (l) 
    return l
end)
        local newRngs = rngs --.asMutable()
        local newPosl = posl --.asMutable()
        
        print("todo: toggleCommentTypes " .. tostring(indices) .. "")
        
        return newLines, newRngs, newPosl
    end

-- 0000000    00000000  000  000   000  0000000    00000000  000   000  000000000  
-- 000   000  000       000  0000  000  000   000  000       0000  000     000     
-- 000   000  0000000   000  000 0 000  000   000  0000000   000 0 000     000     
-- 000   000  000       000  000  0000  000   000  000       000  0000     000     
-- 0000000    00000000  000  000   000  0000000    00000000  000   000     000     


function edit.static.deindentLineRangesAndPositionsAtIndices(lines, rngs, posl, indices) 
        if empty(indices) then return lines, rngs, posl end
        
        local newLines = lines:arr()
        local newRngs = rngs:arr()
        local newPosl = posl:arr()
        
        for _, index in ipairs(indices) do 
            local indent, line = belt.splitLineIndent(newLines[index])
            
            if #indent then 
                local sc = min(4, indent:len())
                newLines:splice(index, 1, kseg.join(indent:slice(sc), line))
                
                for _, pos in ipairs(newPosl) do 
                    if (pos[2] == index) then 
                        pos[1] = max(1, (pos[1] - sc))
                    end
                end
                
                for _, rng in ipairs(newRngs) do 
                    if (rng[2] == index) then 
                        rng[1] = max(1, (rng[1] - sc))
                        rng[3] = max(1, (rng[3] - sc))
                    end
                end
            end
        end
        
        return newLines, newRngs, newPosl
    end

-- 000  000   000  0000000    00000000  000   000  000000000  
-- 000  0000  000  000   000  000       0000  000     000     
-- 000  000 0 000  000   000  0000000   000 0 000     000     
-- 000  000  0000  000   000  000       000  0000     000     
-- 000  000   000  0000000    00000000  000   000     000     


function edit.static.indentLineRangesAndPositionsAtIndices(lines, rngs, posl, indices) 
        if empty(indices) then return lines, rngs, posl end
        
        local newLines = lines:arr()
        local newRngs = rngs:arr()
        local newPosl = posl:arr()
        
        for _, index in ipairs(indices) do 
            local indent, line = belt.splitLineIndent(newLines[index])
            
            newLines[index] = kseg.join(kseg.rep(4), newLines[index])
            
            for _, pos in ipairs(newPosl) do 
                if (pos[2] == index) then 
                    pos[1] = pos[1] + 4
                end
            end
            
            for _, rng in ipairs(newRngs) do 
                if (rng[2] == index) then 
                    rng[1] = rng[1] + 4
                    rng[3] = rng[3] + 4
                end
            end
        end
        
        return newLines, newRngs, newPosl
    end

-- 00000000  000   000  000000000  00000000  000   000  0000000          00000000   000   000   0000000    0000000  
-- 000        000 000      000     000       0000  000  000   000        000   000  0000  000  000        000       
-- 0000000     00000       000     0000000   000 0 000  000   000        0000000    000 0 000  000  0000  0000000   
-- 000        000 000      000     000       000  0000  000   000        000   000  000  0000  000   000       000  
-- 00000000  000   000     000     00000000  000   000  0000000          000   000  000   000   0000000   0000000   


function edit.static.extendLineRangesFromPositionToPosition(lines, rngs, start, pos) 
        if empty(rngs) then return array(belt.rangeFromStartToEnd(start, pos)) end
        
        local newRngs = rngs:arr()
        
        local rng = belt.rangeInRangesTouchingPos(newRngs, start)
        if rng then 
            if belt.isPosAfterRange(pos, rng) then 
                rng[3] = pos[1]
                rng[4] = pos[2]
            elseif belt.isPosBeforeRange(pos, rng) then 
                rng[1] = pos[1]
                rng[2] = pos[2]
            end
        else 
            newRngs:push(belt.rangeFromStartToEnd(start, pos))
        end
        
        return newRngs
    end


function edit.static.extendLineRangesByMovingPositionsInDirection(lines, rngs, posl, dir, opt) 
        local newRngs = rngs:arr()
        local newPosl = posl:arr()
        
        for pi, pos in ipairs(newPosl) do 
            local line = lines[pos[2]]
            local rng = array(pos[1], pos[2], pos[1], pos[2])
            newRngs:push(rng)
            local nc = 0
            if (dir == 'left') or (dir == 'right') then nc = belt.numCharsFromPosToWordOrPunctInDirection(lines, pos, dir, opt) ; pos[1] = pos[1] + nc
            elseif (dir == 'up') then pos[2] = pos[2] - 1
            elseif (dir == 'down') then pos[2] = pos[2] + 1
            elseif (dir == 'eol') then pos[1] = line:len()
            elseif (dir == 'bol') then pos[1] = 1
            elseif (dir == 'bof') then pos[1] = 1 ; pos[2] = 1
            elseif (dir == 'eof') then pos[2] = lines:len() ; pos[1] = lines[lines:len()]:len()
            elseif (dir == 'ind_bol') then local ind = belt.numIndent(line) ; pos[1] = (function () 
    if (pos[1] > ind) then 
    return ind else 
    return 1
                                                                   end
end)()
            elseif (dir == 'ind_eol') then local ind = belt.numIndent(line) ; pos[1] = (function () 
    if (pos[1] < ind) then 
    return ind else 
    return line:len()
                                                                   end
end)()
            end
            
            if (dir == 'left') then rng[1] = (rng[1] + nc)
            elseif (dir == 'right') then rng[3] = (rng[3] + nc)
            elseif (dir == 'up') then rng[2] = max(1, (rng[2] - 1))
            elseif (dir == 'down') then rng[4] = min(lines:len(), (rng[4] + 1))
            elseif (dir == 'eol') then rng[3] = Infinity
            elseif (dir == 'bol') then rng[1] = 1
            elseif (dir == 'bof') then rng[1] = 1 ; rng[2] = 1
            elseif (dir == 'eof') then rng[4] = lines:len() ; rng[3] = lines[lines:len()]:len()
            elseif (dir == 'ind_bol') then local ind = belt.numIndent(line) ; rng[1] = (function () 
    if (rng[1] > ind) then 
    return ind else 
    return 1
                                                                   end
end)()
            elseif (dir == 'ind_eol') then local ind = belt.numIndent(line) ; rng[3] = (function () 
    if (rng[3] < ind) then 
    return ind else 
    return line:len()
                                                                   end
end)()
            end
            
            if (rng[2] <= lines:len()) then 
                rng[1] = clamp(1, (lines[rng[2]]:len() + 1), rng[1])
            end
            
            if (rng[4] <= lines:len()) then 
                rng[3] = clamp(1, (lines[rng[4]]:len() + 1), rng[3])
            end
        end
        
        return newRngs, newPosl
    end

return edit