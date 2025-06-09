--[[
    0000000    00000000  000      000000000  
    000   000  000       000         000     
    0000000    0000000   000         000     
    000   000  000       000         000     
    0000000    00000000  0000000     000     
--]]

kxk = require "kxk.kxk"
cell = require "edit.tool.cell"
text = require "edit.tool.text"
-- use ◆ text cell edit misc pair salt


local belt = class("belt")
    


function belt.static.sum(arrays) 
        local sum = array()
        for n = 0, #arrays[0]-1 do sum.push(0) end
        for array in arrays do 
            for n, i in array do 
                sum[i] = sum[i] + n
            end
        end
        
        return sum
    end

-- 00000000    0000000    0000000
-- 000   000  000   000  000     
-- 00000000   000   000  0000000 
-- 000        000   000       000
-- 000         0000000   0000000 


function belt.static.pos(x, y) 
        if (is(x, array) and (y == nil)) then 
            return x
        end
        
        return x, y
    end


function belt.static.samePos(a, b) 
    return ((a[1] == b[1]) and (a[2] == b[2]))
    end


function belt.static.normalizePositions(posl, maxY) 
        if empty(posl) then return array() end
        posl = posl:map(function (a) 
    return array(max(1, a[1]), clamp(1, maxY, a[2]))
end)
        posl = belt.sortPositions(posl)
        posl = belt.removeDuplicatePositions(posl)
        return posl
    end


function belt.static.sortPositions(posl) 
        posl:sort(function (a, b) 
    if (a[2] == b[2]) then 
    return (a[1] - b[1]) else 
    return (a[2] - b[2])
                           end
end)
        return posl
    end


function belt.static.removeDuplicatePositions(posl) 
        if (empty(posl) or (#posl <= 1)) then return posl end
        
        for i in iter(#posl, 2) do 
            if belt.samePos(posl[i], posl[(i - 1)]) then 
                posl:splice(i, 1)
            end
        end
        
        return posl
    end


function belt.static.indexOfPosInPositions(pos, posl) 
        if empty(posl) then return -1 end
        posl.findIndex(p) return function () 
    return pos(eql, p)
end
    end


function belt.static.lineIndicesForPositions(posl) 
        local set = new(Set())
        for pos in posl do 
            set.add(pos[1])
        end
        
        return Array.from(set)
    end


function belt.static.positionInDirection(pos, dir) 
        local x, y = pos
        
        if (dir == 'up') then 
    return array(x, (y - 1))
        elseif (dir == 'down') then 
    return array(x, (y + 1))
        elseif (dir == 'left') then 
    return array((x - 1), y)
        elseif (dir == 'right') then 
    return array((x + 1), y)
        end
    end


function belt.static.movePositionsInDirection(posl, dir) 
        return posl.map(function (p) 
    return belt.positionInDirection(p, dir)
end)
    end


function belt.static.traversePositionsInDirection(posl, pos, dir) 
        local next = belt.neighborPositionInDirection(posl, pos, dir)
        while next do 
            pos = next
            next = belt.neighborPositionInDirection(posl, pos, dir)
        end
        
        return pos
    end


function belt.static.neighborPositionInDirection(posl, pos, dir) 
        local nbp = belt.positionInDirection(pos, dir)
        if belt.positionsContain(posl, nbp) then 
            return posl[belt.indexOfPosInPositions(nbp, posl)]
        end
    end


function belt.static.positionsContain(posl, pos) 
        for _, p in ipairs(posl) do 
            if p(eql, pos) then return true end
        end
        
        return false
    end


function belt.static.positionsOutsideRange(posl, rng) 
        return posl.filter(function (p) 
    return belt.isPosOutsideRange(p, rng)
end)
    end


function belt.static.deltaOfPosToRect(p, r) 
        local dx = 0
        local dy = 0
        
        if (p[0] < r[0]) then dx = (r[0] - p[0])
        elseif (p[0] > r[2]) then dx = (p[0] - r[2])
        else dx = max((r[0] - p[0]), (p[0] - r[2]))
        end
        
        if (p[1] < r[1]) then dy = (r[1] - p[1])
        elseif (p[1] > r[3]) then dy = (p[1] - r[3])
        else dy = max((r[1] - p[1]), (p[1] - r[3]))
        end
        
        return array(dx, dy)
    end


function belt.static.columnPositionsMap(posl) 
        local map = {}
        for p in posl do 
            map[p[0]] = map[p[0]] or (array())
            map[p[0]].push(p)
        end
        
        return map
    end


function belt.static.neighborPositionGroups(posl) 
        local groups = array()
        for p in posl do 
            if (groups[-1] and (groups[-1][-1][1] == (p[1] - 1))) then 
               groups[-1].push(p)
            else 
                groups.push(array(p))
            end
        end
        
        return groups
    end


function belt.static.positionColumns(posl) 
        local columns = array()
        for key, pl in pairs(belt.columnPositionsMap(posl)) do 
            columns = columns.concat(belt.neighborPositionGroups(pl))
        end
        
        return columns
    end

-- 00000000    0000000   000   000   0000000   00000000  
-- 000   000  000   000  0000  000  000        000       
-- 0000000    000000000  000 0 000  000  0000  0000000   
-- 000   000  000   000  000  0000  000   000  000       
-- 000   000  000   000  000   000   0000000   00000000  


function belt.static.isPosInsideRange(pos, rng) 
        if belt.isPosBeforeRange(pos, rng) then return false end
        if belt.isPosAfterRange(pos, rng) then return false end
        return true
    end


function belt.static.isPosOutsideRange(pos, rng) 
    return not belt.isPosInsideRange(pos, rng)
    end


function belt.static.isPosBeforeRange(pos, rng) 
        return ((pos[1] < rng[1]) or ((pos[1] == rng[1]) and (pos[0] < rng[0])))
    end


function belt.static.isPosAfterRange(pos, rng) 
        return ((pos[1] > rng[3]) or ((pos[1] == rng[3]) and (pos[0] > rng[2])))
    end


function belt.static.isPosTouchingRange(pos, rng) 
        if belt.isPosInsideRange(pos, rng) then return true end
        if pos(eql, belt.endOfRange, rng) then return true end
        if pos(eql, belt.startOfRange, rng) then return true end
        return false
    end


function belt.static.rangeContainsPos(rng, pos) 
    return belt.isPosInsideRange(pos, rng)
    end

function belt.static.rangeContainsRange(rng, ins) 
    return (belt.isPosInsideRange(belt.startOfRange(ins), rng) and belt.isPosInsideRange(belt.endOfRange(ins), rng))
    end

function belt.static.rangeTouchesPos(rng, pos) 
    return belt.isPosTouchingRange(pos, rng)
    end


function belt.static.rangeForPos(pos) 
    return array(pos[0], pos[1], pos[0], pos[1])
    end

function belt.static.rangeForSpan(span) 
    return array(span[0], span[1], span[2], span[1])
    end

function belt.static.rangeFromStartToEnd(start, stop) 
    return array(start[0], start[1], stop[0], stop[1])
    end

function belt.static.rangesForSpans(spans) 
    return spans.map(belt.rangeForSpan)
    end


function belt.static.isEmptyRange(rng) 
    return ((rng[0] == rng[2]) and (rng[1] == rng[3]))
    end

function belt.static.isRangeEmpty(rng) 
    return ((rng[0] == rng[2]) and (rng[1] == rng[3]))
    end


function belt.static.startOfRange(rng) 
    return array(rng[0], rng[1])
    end

function belt.static.endOfRange(rng) 
    return array(rng[2], rng[3])
    end


function belt.static.rangeGrownBy(rng, delta) 
    return array((rng[0] - delta), rng[1], (rng[2] + delta), rng[3])
    end

function belt.static.rangeShrunkenBy(rng, delta) 
    return array((rng[0] + delta), rng[1], (rng[2] - delta), rng[3])
    end

function belt.static.rangesShrunkenBy(rngs, delta) 
        local filtered = rngs.filter(function (r) 
    return ((r[2] - r[0]) >= (2 * delta))
end)
        return filtered.map(function (r) 
    return belt.rangeShrunkenBy(r, delta)
end)
    end


function belt.static.rangesGrownBy(rngs, delta) 
    return rngs.map(function (r) 
    return belt.rangeGrownBy(r, delta)
end)
    end

--  0000000  00000000    0000000   000   000  
-- 000       000   000  000   000  0000  000  
-- 0000000   00000000   000000000  000 0 000  
--      000  000        000   000  000  0000  
-- 0000000   000        000   000  000   000  


function belt.static.isSameSpan(a, b) 
    return a(eql, b)
    end

function belt.static.isSameRange(a, b) 
    return a(eql, b)
    end


function belt.static.isPosInsideSpan(pos, span) 
        if belt.isPosBeforeSpan(pos, span) then return false end
        if belt.isPosAfterSpan(pos, span) then return false end
        return true
    end


function belt.static.isPosBeforeSpan(pos, span) 
        return ((pos[1] < span[1]) or ((pos[1] == span[1]) and (pos[0] < span[0])))
    end


function belt.static.isPosAfterSpan(pos, span) 
        return ((pos[1] > span[1]) or ((pos[1] == span[1]) and (pos[0] >= span[2])))
    end


function belt.static.isPosBeforeOrInsideSpan(pos, span) 
        return (belt.isPosBeforeSpan(pos, span) or belt.isPosInsideSpan(pos, span))
    end


function belt.static.startOfSpan(s) 
    return array(s[0], s[1])
    end

function belt.static.endOfSpan(s) 
    return array(s[2], s[1])
    end


function belt.static.nextSpanAfterPos(spans, pos) 
        if empty(spans) then return end
        
        pos = (function () 
    if belt.isPosAfterSpan(pos, spans[-1]) then 
    return array(0, 0)
                    end
end)()
        
        if belt.isPosBeforeSpan(pos, spans[0]) then return spans[0] end
        
        for span, index in spans do 
            if belt.isPosAfterSpan(pos, span) then 
                if (((index + 1) < #spans) and belt.isPosBeforeOrInsideSpan(pos, spans[(index + 1)])) then 
                    return spans[(index + 1)]
                end
            end
        end
    end


function belt.static.prevSpanBeforePos(spans, pos) 
        if empty(spans) then return end
        if belt.isPosBeforeSpan(pos, spans[0]) then return spans[-1] end
        if belt.isPosInsideSpan(pos, spans[0]) then return spans[-1] end
        
        for index in iter((#spans - 1), 0) do 
            local span = spans[index]
            if belt.isPosAfterSpan(pos, span) then 
                return span
            end
        end
    end


function belt.static.normalizeSpans(spans) 
        if empty(spans) then return array() end
        
        spans = spans.map(function (a) 
    if (a[0] > a[2]) then 
    return array(a[2], a[1], a[0]) else 
    return a
                                 end
end)
        spans.sort(function (a, b) 
    if (a[1] == b[1]) then 
    return (a[0] - b[0]) else 
    return (a[1] - b[1])
                            end
end)
        spans = spans.filter(function (a) 
    return (a[0] ~= a[2])
end)
        return spans
    end

-- 00000000    0000000   000   000   0000000   00000000   0000000  
-- 000   000  000   000  0000  000  000        000       000       
-- 0000000    000000000  000 0 000  000  0000  0000000   0000000   
-- 000   000  000   000  000  0000  000   000  000            000  
-- 000   000  000   000  000   000   0000000   00000000  0000000   


function belt.static.rangesContainLine(rngs, lineIndex) 
        for rng in rngs do 
            if ((rng[1] <= lineIndex) <= rng[3]) then return true end
        end
        
        return false
    end


function belt.static.rangesContainSpan(rngs, span) 
    return belt.rangesContainRange(rngs, belt.rangeForSpan(span))
    end

function belt.static.rangesContainRange(rngs, range) 
        for rng in rngs do 
            if rng(eql, range) then return true end
        end
        
        return false
    end


function belt.static.normalizeRanges(rngs) 
        if empty((rngs or is(not rngs, arr))) then return array() end
        
        rngs = rngs.map(function (a) 
    if (a[1] > a[3]) then 
    return array(a[2], a[3], a[0], a[1]) else 
    return a
                               end
end)
        rngs = rngs.map(function (a) 
    if ((a[1] == a[3]) and (a[0] > a[2])) then 
    return array(a[2], a[1], a[0], a[3]) else 
    return a
                               end
end)
        rngs.sort(function (a, b) 
    if (a[1] == b[1]) then 
    return (a[0] - b[0]) else 
    return (a[1] - b[1])
                           end
end)
        return rngs.filter(function (a) 
    return ((a[1] ~= a[3]) or (a[0] ~= a[2]))
end)
    end


function belt.static.startPositionsOfRanges(rngs) 
    return rngs.map(function (r) 
    return belt.startOfRange(r)
end)
    end

function belt.static.endPositionsOfRanges(rngs) 
    return rngs.map(function (r) 
    return belt.endOfRange(r)
end)
    end


function belt.static.removeTrailingEmptyRange(rngs) 
        if belt.isEmptyRange(rngs[#rngs]) then 
            return rngs:slice(1, -2)
        else 
            return rngs
        end
    end

--[[
    returns a list of ranges for lines split by positions.
    the range up to the first position is included, as well as the
    one from the last position up to the end of text.
    --]]


function belt.static.rangesForLinesSplitAtPositions(lines, posl) 
        if empty(posl) then return array() end
        if (posl[0][1] >= #lines) then return array(array(0, 0, kseg.width(lines[-1]), (#lines - 1)), array(kseg.width(lines[-1]), (#lines - 1), kseg.width(lines[-1]), (#lines - 1))) end
        local rngs = array(array(0, 0, posl[0][0], posl[0][1]))
        for idx, pos in ipairs(posl) do 
            if (idx > 0) then 
                rngs.push(array(posl[(idx - 1)][0], posl[(idx - 1)][1], pos[0], pos[1]))
            end
        end
        
        rngs.push(array(pos[0], pos[1], kseg.width(lines[-1]), (#lines - 1)))
        return rngs
    end


function belt.static.rangeInRangesContainingPos(rngs, pos) 
        for rng in rngs do 
            if belt.rangeContainsPos(rng, pos) then 
                return rng
            end
        end
    end


function belt.static.rangeInRangesTouchingPos(rngs, pos) 
        for rng in rngs do 
            if belt.rangeTouchesPos(rng, pos) then 
                return rng
            end
        end
    end

-- 000      000  000   000  00000000         000  000   000  0000000    000   0000000  00000000   0000000  
-- 000      000  0000  000  000              000  0000  000  000   000  000  000       000       000       
-- 000      000  000 0 000  0000000          000  000 0 000  000   000  000  000       0000000   0000000   
-- 000      000  000  0000  000              000  000  0000  000   000  000  000       000            000  
-- 0000000  000  000   000  00000000         000  000   000  0000000    000   0000000  00000000  0000000   


function belt.static.lineIndicesForRangesOrPositions(rngs, posl) 
        local indices = belt.lineIndicesForRanges(rngs)
        if empty(indices) then 
            indices = belt.lineIndicesForPositions(posl)
        end
        
        return indices
    end


function belt.static.lineIndicesForRangesAndPositions(rngs, posl) 
        local indices = kxk.util.uniq(belt.lineIndicesForRanges(rngs).concat(belt.lineIndicesForPositions(posl)))
        indices.sort()
        return indices
    end


function belt.static.lineIndicesForSpans(spans) 
        return kxk.util.uniq(spans.map(function (s) return s[1] end))
    end


function belt.static.frontmostSpans(spans) 
        local fms = {}
        for span in spans do 
            if not fms[span[1]] then 
                fms[span[1]] = span
            end
        end
        
        return Object.values(fms)
    end


function belt.static.lineIndicesForRange(rng) 
        local indices = array()
        
        for li in iter(rng[1], rng[3]) do 
            if ((li ~= rng[3]) or (rng[2] > 0)) then 
                indices.push(li)
            end
        end
        
        return indices
    end


function belt.static.lineIndicesForRanges(rngs) 
        local indices = array()
        
        for rng in rngs do 
            indices = indices.concat(belt.lineIndicesForRange(rng))
        end
        
        return indices
    end

-- 0000000    000       0000000    0000000  000   000  
-- 000   000  000      000   000  000       000  000   
-- 0000000    000      000   000  000       0000000    
-- 000   000  000      000   000  000       000  000   
-- 0000000    0000000   0000000    0000000  000   000  


function belt.static.blockRangesForRangesAndPositions(lines, rngs, posl) 
        local blocks = array()
        
        local indices = belt.lineIndicesForRangesAndPositions(rngs, posl)
        
        if empty(indices) then return blocks end
        
        local block = array(0, indices[0], -1, -1)
        for index, ii in ipairs(indices) do 
            block[3] = index
            if (indices[(ii + 1)] ~= (index + 1)) then 
                block[2] = #lines[index]
                blocks.push(block)
                block = array(0, indices[(ii + 1)], -1, -1)
            end
        end
        
        return blocks
    end

-- 00     00  00000000  00000000    0000000   00000000  
-- 000   000  000       000   000  000        000       
-- 000000000  0000000   0000000    000  0000  0000000   
-- 000 0 000  000       000   000  000   000  000       
-- 000   000  00000000  000   000   0000000   00000000  


function belt.static.mergeLineRanges(lines, rngs) 
        if empty((rngs or is(not rngs, arr))) then return array() end
        
        rngs = belt.normalizeRanges(rngs)
        
        local mrgd = array()
        for s, i in rngs do 
            if (((empty(mrgd) or (s[1] > (tail[3] + 1))) or ((s[1] == tail[3]) and (s[0] > tail[2]))) or ((s[1] == (tail[3] + 1)) and ((s[0] > 0) or (tail[2] < #lines[tail[3]])))) then 
                    mrgd.push(s)
                    local tail = s
            else if ((s[3] > tail[3]) or ((s[3] == tail[3]) and (s[2] > tail[2]))) then 
                tail[2] = s[2]
                tail[3] = s[3]
                 end
            end
        end
        
        return mrgd
    end

-- merge methods of sibling modules into tool/belt 

-- for _ mod in ipairs [text cell edit misc pair salt]
for _, mod in ipairs(array(text, cell)) do 
    belt:include(mod)
    -- for key val in pairs mod
    --     belt[key] = val
end

return belt