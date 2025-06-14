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
        
        if (text == '\t') then 
            local pos = posl[0]
            text = kstr.lpad((4 - (pos[0] % 4)), ' ')
        end
        
        text = kstr.detab(text)
        local txtls = belt.seglsForText(text)
        local newls = array()
        local newpl = array()
        local rngs = belt.rangesForLinesSplitAtPositions(lines, posl)
        local before = array()
        
        for idx, rng in ipairs(rngs) do 
            local after = belt.seglsForRange(lines, rng)
            
            if empty((after or empty), after[1]) then 
                if (posl[#posl][2] >= #lines) then 
                    before:push(array())
                end
            end
            
            if (idx > 1) then 
                local x = posl[(idx - 1)][1]
                -- (x y) = posl[idx-1]
                
                if valid(before) then line = before:pop()
                else line = newls:pop()
                end
                
                print("x", x, kseg.width(line), line)
                
                if ((x > kseg.width(line)) and (text ~= '\n')) then 
                    line = line + (kstr.lpad((x - #line)).split(''))
                end
                
                if (#txtls > 1) then 
                    if ((#posl > 1) and (text ~= '\n')) then 
                        local insertLineIndex = ((idx - 1) % #txtls)
                        before:push((line + txtls[insertLineIndex]))
                        newpl:push(array(kseg.width(before[#before]), ((#newls + #before) - 1)))
                        before:push((before:pop() + after:shift()))
                    else 
                        local posLineIndent = belt.numIndent(line)
                        local indent = kseg(kstr.lpad(posLineIndent))
                        before:push((line + txtls[1]))
                        
                        for lidx, insl in ipairs(txtls:slice(1)) do 
                            if ((lidx < (#txtls - 2)) or valid((insl or (text == '\n')))) then 
                                before:push((indent + insl))
                            end
                        end
                        
                        if (x > posLineIndent) then 
                            newpl:push(array(kseg.width(before[#before]), ((#newls + #before) - 1)))
                            before:push((before:pop() + after:shift()))
                        else 
                            after:unshift((indent + after:shift()))
                            if (text == '\n') then before:pop() end
                            newpl:push(array(kseg.width(indent), (#newls + #before)))
                        end
                    end
                    
                    newls = newls + before
                else 
                    newpl:push(array((kseg.width(line) + kseg.width(txtls[1])), (#newls + #before)))
                    line = line + (txtls[1])
                    line = line + (after:shift())
                    newls = newls + before
                    newls:push(line)
                end
            end
            
            before = after
        end
        
        if ((#posl >= 1) and (posl[#posl][2] <= #lines)) then 
            newls = newls + before
        end
        
        print("AFTER INSERT", newls, newpl)
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
        lines = lines:map(function (l) 
    return l
end)
        -- posl  = clone posl
        
        if empty(rngs) then return lines, posl end
        
        for ri in iter(#rngs, 1) do 
            local rng = rngs[ri]
            
            if ((rng[2] > #lines) or (rng[4] > #lines)) then 
                print("range out of bounds?", rng)
                return lines, posl
            end
            
            posl = belt.adjustPositionsForDeletedLineRange(posl, lines, rng)
            
            if (rng[1] == rng[3]) then 
                if ((rng[0] == 0) and (rng[2] == #lines[rng[1]])) then 
                    lines:splice(rng[1], 1)
                else 
                    lines:splice(rng[1], 1, (lines[rng[1]]:slice(1, rng[0]) + lines[rng[1]]:slice(rng[2])))
                end
            else 
                if (rng[2] == #lines[rng[3]]) then 
                    lines:splice(rng[3], 1)
                else 
                    lines:splice(rng[3], 1, lines[rng[3]]:slice(rng[2]))
                    local partialLast = true
                end
                
                if ((rng[3] - rng[1]) >= 2) then 
                    lines:splice((rng[1] + 1), ((rng[3] - rng[1]) - 1))
                end
                
                if (rng[0] == 0) then 
                    lines:splice(rng[1], 1)
                else 
                    lines:splice(rng[1], 1, lines[rng[1]]:slice(1, rng[0]))
                    
                    if partialLast then 
                        lines:splice(rng[1], 2, (lines[rng[1]] + lines[(rng[1] + 1)]))
                    end
                end
            end
        end
        
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
        local ci = cursors.indexOf(cursor)
        
        while true do 
            cursors[ci][0] = cursors[ci][0] + delta
            ci = ci + 1
            
            if (ci >= #cursors) then return end
            if (cursors[ci][1] > cursor[1]) then return end
        end
    end

--  0000000   0000000    0000000          00000000    0000000   000   000   0000000   00000000   0000000  
-- 000   000  000   000  000   000        000   000  000   000  0000  000  000        000       000       
-- 000000000  000   000  000   000        0000000    000000000  000 0 000  000  0000  0000000   0000000   
-- 000   000  000   000  000   000        000   000  000   000  000  0000  000   000  000            000  
-- 000   000  0000000    0000000          000   000  000   000  000   000   0000000   00000000  0000000   


function edit.static.addLinesBelowPositionsToRanges(lines, posl, rngs) 
        local newp = array()
        local newr = rngs --.asMutable()
        
        
        function addLineAtIndex(c, i) 
            local range = belt.rangeOfLine(lines, i)
            if belt.isEmptyRange(range) then 
                range[1] = range[1] + 1
            end
            
            newr:push(range)
            return newp:push(belt.endOfRange(range))
        end
        
        for _, c in ipairs(posl) do 
            if not belt.rangesContainLine(rngs, c[1]) then 
                addLineAtIndex(c, c[1])
            elseif (c[1] < (#lines - 1)) then 
                addLineAtIndex(c, (c[1] + 1))
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
    return array(#lines[idx], idx, 0, (idx + 1))
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
        if empty(((indices or ((dir == 'down') and (indices[-1] >= (#lines - 1)))) or ((dir == 'up') and (indices[0] <= 0)))) then 
            return array(lines, rngs, posl)
        end
        
        local newLines = lines:map(function (l) 
    return l
end)
        local newRngs = rngs --.asMutable()
        local newPosl = posl --.asMutable()
        
        local rs, re = (function () 
    if (dir == 'down') then 
    return array((#indices - 1), 0)
                  elseif (dir == 'up') then 
    return array(0, (#indices - 1))
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
                if (pos[1] == index) then 
                    pos[1] = pos[1] + d
                end
            end
            
            for _, rng in ipairs(newRngs) do 
                if (rng[1] == index) then 
                    rng[1] = rng[1] + d
                    rng[3] = rng[3] + d
                end
            end
        end
        
        return array(newLines, newRngs, newPosl)
    end

--  0000000  000       0000000   000   000  00000000        000      000  000   000  00000000   0000000  
-- 000       000      000   000  0000  000  000             000      000  0000  000  000       000       
-- 000       000      000   000  000 0 000  0000000         000      000  000 0 000  0000000   0000000   
-- 000       000      000   000  000  0000  000             000      000  000  0000  000            000  
--  0000000  0000000   0000000   000   000  00000000        0000000  000  000   000  00000000  0000000   


function edit.static.cloneLineBlockRangesAndMoveRangesAndPositionsInDirection(lines, blocks, rngs, posl, dir) 
        if empty(((blocks or ((dir == 'down') and (blocks[-1][3] > (#lines - 1)))) or ((dir == 'up') and (blocks[0][1] < 0)))) then 
            return array(lines, rngs, posl)
        end
        
        local newLines = lines --.asMutable()
        local newRngs = rngs --.asMutable()
        local newPosl = posl --.asMutable()
        
        local rs, re = (function () 
    if (dir == 'down') then 
    return array((#blocks - 1), 0)
                  elseif (dir == 'up') then 
    return array(0, (#blocks - 1))
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
            text = text + '\n'
            
            local insidx = (function () 
    if (dir == 'up') then 
    return block[1] else 
    return (block[3] + 1)
                     end
end)()
            
            newLines, posl = belt.insertTextAtPositions(newLines, text, array(array(0, insidx)))
            
            if (dir == 'down') then 
                d = ((block[3] - block[1]) + 1)
                
                for _, pos in ipairs(newPosl) do 
                    if belt.rangeContainsPos(block, pos) then 
                        pos[1] = pos[1] + d
                    end
                end
                
                for _, rng in ipairs(newRngs) do 
                    if belt.rangeContainsRange(block, rng) then 
                        rng[1] = rng[1] + d
                        rng[3] = rng[3] + d
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
        
        local newLines = lines --.asMutable()
        local newRngs = rngs --.asMutable()
        local newPosl = posl --.asMutable()
        
        local comStart = '#'
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
                local newLine = kseg.join(indent, line:slice((#comStart + d)))
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
        
        local newLines = lines:map(function (l) 
    return l
end)
        local newRngs = rngs --.asMutable()
        local newPosl = posl --.asMutable()
        
        for _, index in ipairs(indices) do 
            local indent, line = belt.splitLineIndent(newLines[index])
            
            if #indent then 
                local sc = min(4, #indent)
                newLines:splice(index, 1, kseg.join(indent:slice(sc), line))
                
                for _, pos in ipairs(newPosl) do 
                    if (pos[1] == index) then 
                        pos[0] = max(0, (pos[0] - sc))
                    end
                end
                
                for _, rng in ipairs(newRngs) do 
                    if (rng[1] == index) then 
                        rng[0] = max(0, (rng[0] - sc))
                        rng[2] = max(0, (rng[2] - sc))
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
        
        local newLines = lines:map(function (l) 
    return l
end)
        local newRngs = rngs --.asMutable()
        local newPosl = posl --.asMutable()
        
        for _, index in ipairs(indices) do 
            local indent, line = belt.splitLineIndent(newLines[index])
            
            newLines[index] = kseg.join(kseg.rep(4), newLines[index])
            
            for _, pos in ipairs(newPosl) do 
                if (pos[1] == index) then 
                    pos[0] = pos[0] + 4
                end
            end
            
            for _, rng in ipairs(newRngs) do 
                if (rng[1] == index) then 
                    rng[0] = rng[0] + 4
                    rng[2] = rng[2] + 4
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
        
        local newRngs = rngs --.asMutable()
        
        local rng = belt.rangeInRangesTouchingPos(newRngs, start)
        if rng then 
            if belt.isPosAfterRange(pos, rng) then 
                rng[2] = pos[0]
                rng[3] = pos[1]
            elseif belt.isPosBeforeRange(pos, rng) then 
                rng[0] = pos[0]
                rng[1] = pos[1]
            end
        else 
            newRngs:push(belt.rangeFromStartToEnd(start, pos))
        end
        
        return newRngs
    end


function edit.static.extendLineRangesByMovingPositionsInDirection(lines, rngs, posl, dir, opt) 
        local newRngs = rngs --.asMutable()
        local newPosl = posl --.asMutable()
        
        for pi, pos in ipairs(newPosl) do 
            local line = lines[pos[2]]
            local rng = array(pos[1], pos[2], pos[1], pos[2])
            newRngs:push(rng)
            local nc = 0
            if (dir == 'left') or (dir == 'right') then nc = belt.numCharsFromPosToWordOrPunctInDirection(lines, pos, dir, opt) ; pos[1] = pos[1] + nc
            elseif (dir == 'up') then pos[2] = pos[2] - 1
            elseif (dir == 'down') then pos[2] = pos[2] + 1
            elseif (dir == 'eol') then pos[1] = #line
            elseif (dir == 'bol') then pos[1] = 0
            elseif (dir == 'bof') then pos[1] = 0 ; pos[2] = 0
            elseif (dir == 'eof') then pos[2] = (#lines - 1) ; pos[1] = #lines[(#lines - 1)]
            elseif (dir == 'ind_bol') then local ind = belt.numIndent(line) ; pos[1] = (function () 
    if (pos[1] > ind) then 
    return ind else 
    return 0
                                                                   end
end)()
            elseif (dir == 'ind_eol') then local ind = belt.numIndent(line) ; pos[1] = (function () 
    if (pos[1] < ind) then 
    return ind else 
    return #line
                                                                   end
end)()
            end
            
            if (dir == 'left') then rng[1] = (rng[1] + nc)
            elseif (dir == 'right') then rng[3] = (rng[3] + nc)
            elseif (dir == 'up') then rng[2] = max(0, (rng[2] - 1))
            elseif (dir == 'down') then rng[3] = min((#lines - 1), (rng[3] + 1))
            elseif (dir == 'eol') then rng[3] = Infinity
            elseif (dir == 'bol') then rng[1] = 0
            elseif (dir == 'bof') then rng[2] = 0 ; rng[1] = 0
            elseif (dir == 'eof') then rng[3] = (#lines - 1) ; rng[3] = #lines[(#lines - 1)]
            elseif (dir == 'ind_bol') then local ind = belt.numIndent(line) ; rng[1] = (function () 
    if (rng[1] > ind) then 
    return ind else 
    return 0
                                                                   end
end)()
            elseif (dir == 'ind_eol') then local ind = belt.numIndent(line) ; rng[3] = (function () 
    if (rng[3] < ind) then 
    return ind else 
    return #line
                                                                   end
end)()
            end
            
            if (rng[2] < #lines) then 
                rng[1] = clamp(0, #lines[rng[2]], rng[1])
            end
            
            if (rng[3] < #lines) then 
                rng[3] = clamp(0, #lines[rng[3]], rng[3])
            end
        end
        
        return newRngs, newPosl
    end

return edit