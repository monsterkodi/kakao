--[[
000000000  00000000  000   000  000000000
   000     000        000 000      000   
   000     0000000     00000       000   
   000     000        000 000      000   
   000     00000000  000   000     000   
--]]

-- use ../../../kxk ▪ kstr kutil kseg 
-- use ../../theme  ◆ color
-- use              ◆ belt


local text = class("text")
    


function text.static.linesForText(text) 
    return kstr.lines(text)
    end


function text.static.joinLines(lines, join) 
        join = join or '\n'
        
        if is(lines, str) then 
            lines = kstr.lines(lines)
        end
        
        return lines.join(join)
    end


function text.static.seglsForText(t) 
        return kseg.segls(string.gsub(t, "\x1b", "�"))
    end


function text.static.colorSeglsForText(text) 
        local colors = array()
        local segls = array()
        
        -- pattern = /\x1b\[((?:\d{1,3};?)+)m/gu
        local pattern = "\\x1b\\[([:;]?%d+)m"
        
        for line, li in belt.linesForText(text) do 
            
            function ansisub(m, c, x) 
                local cs = c.split(';').map(function (c) 
    return math.floor(c)
end)
                
                local l = #m
                if (cs[0] == 38) then 
                        colors[li] = colors[li] or (array())
                        if (#cs == 5) then 
                            colors[li]:push({x = x, l = l, fg = string.sub(cs, 2, 4)})
                        else 
                            colors[li]:push({x = x, l = l, fg = color.ansi256[cs[2]]})
                        end
                elseif (cs[0] == 48) then 
                        colors[li] = colors[li] or (array())
                        if (#cs == 5) then 
                            colors[li]:push({x = x, l = l, bg = string.sub(cs, 2, 4)})
                        else 
                            colors[li]:push({x = x, l = l, bg = color.ansi256[cs[2]]})
                        end
                elseif (cs[0] == 39) then 
                        colors[li] = colors[li] or (array())
                        colors[li]:push({x = x, l = l, fg = -1})
                elseif (cs[0] == 49) then 
                        colors[li] = colors[li] or (array())
                        colors[li]:push({x = x, l = l, bg = -1})
                end
                
                return ''
            end
            
            pattern.lastIndex = 0
            local noansi = line.replaceAll(pattern, ansisub)
            
            if valid(colors[li]) then 
                local lcl = colors[li]
                local removed = 0
                local idx = 0
                while (idx < #lcl) do 
                    continue = false
                    local clr = lcl[idx]
                    clr.x = clr.x - removed
                    removed = removed + (clr.l)
                    clr.l = nil
                    
                    if clr.fg then 
                        if ((idx > 0) and lcl[(idx - 1)].fg) then 
                            lcl[(idx - 1)].w = (clr.x - lcl[(idx - 1)].x)
                        elseif ((idx > 1) and lcl[(idx - 2)].fg) then 
                            lcl[(idx - 2)].w = (clr.x - lcl[(idx - 2)].x)
                        end
                        
                        if (clr.fg == -1) then 
                            lcl.splice(idx, 1)
                            continue = true
                        end
                    end
                    
                    if not continue then 
                        if clr.bg then 
                            if ((idx > 0) and lcl[(idx - 1)].bg) then 
                                lcl[(idx - 1)].w = (clr.x - lcl[(idx - 1)].x)
                            elseif ((idx > 1) and lcl[(idx - 2)].bg) then 
                                lcl[(idx - 2)].w = (clr.x - lcl[(idx - 2)].x)
                            end
                            
                            if (clr.bg == -1) then 
                                lcl.splice(idx, 1)
                                continue = true
                            end
                        end
                    end
                    
                    if not continue then 
                        idx = idx + 1
                    end
                end
            end
            
            segls:push(kseg(noansi))
        end
        
        return array(colors, segls)
    end


function text.static.seglsForLineRange(lines, rng) 
        if empty((lines or empty), rng) then 
            return ''
        end
        
        local l = array()
        
        for y in iter(rng[1], rng[3]) do 
            if not belt.isInvalidLineIndex(lines, y) then 
                if (y == rng[1]) then 
                        if (y == rng[3]) then l:push(lines[y]:slice(rng[0], rng[2]))
                        else l:push(lines[y]:slice(rng[0]))
                        end
                elseif (y == rng[3]) then l:push(lines[y]:slice(1, rng[2]))
                else l:push(lines[y])
                end
                
                if (y < rng[3]) then l:push('\n') end
            end
        end
        
        return l
    end


function text.static.segsForLineSpan(lines, span) 
        local l = array()
        if empty((lines or empty), span) then return l end
        local y = span[1]
        if belt.isInvalidLineIndex(lines, y) then return l end
        return lines[y]:slice(span[0], (span[2] - 1))
    end


function text.static.segsForPositions(lines, posl) 
        local l = array()
        if empty((lines or empty), posl) then return l end
        for pos in posl do 
            if belt.isInvalidLineIndex(lines, pos[1]) then return l end
            local segi = kseg.segiAtWidth(lines[pos[1]], pos[0])
            l:push(lines[pos[1]][segi])
        end
        
        return l
    end


function text.static.textForLineRange(lines, rng) 
        if empty((lines or empty), rng) then return '' end
        
        local l = array()
        
        for y in iter(rng[1], rng[3]) do 
            if not belt.isInvalidLineIndex(lines, y) then 
                if (y == rng[1]) then 
                        if (y == rng[3]) then l:push(lines[y]:slice(rng[0], rng[2]))
                        else l:push(lines[y]:slice(rng[0]))
                        end
                elseif (y == rng[3]) then l:push(lines[y]:slice(1, rng[2]))
                else l:push(lines[y])
                end
            end
        end
        
        local s = kseg.str(l)
        return s
    end


function text.static.textForLineRanges(lines, rngs) 
        if empty(lines) then return '' end
        
        local text = ''
        for rng in rngs do 
            text = text .. (belt.textForLineRange(lines, rng))
            text = text .. '\n'
        end
        
        return kstr.pop(text)
    end


function text.static.textForSpans(lines, spans) 
        return belt.textForLineRanges(lines, belt.rangesForSpans(spans))
    end


function text.static.lineSpansForText(lines, text) 
        local spans = array()
        
        for line, y in lines do 
            line = kseg.str(line)
            local x2 = 0
            while true do 
                local x1 = line.indexOf(text, x2)
                if (x1 < 0) then break end
                x2 = (x1 + #text)
                spans:push(array(x1, y, x2))
            end
        end
        
        return spans
    end


function text.static.textFromBolToPos(lines, pos) 
    return lines[pos[1]]:slice(1, pos[0])
    end

function text.static.textFromPosToEol(lines, pos) 
    return lines[pos[1]]:slice(pos[0])
    end


function text.static.isOnlyWhitespace(text) 
    return string.match(kseg.str(text), "^%s+$")
    end

-- 000  000   000  0000000    00000000  000   000  000000000  
-- 000  0000  000  000   000  000       0000  000     000     
-- 000  000 0 000  000   000  0000000   000 0 000     000     
-- 000  000  0000  000   000  000       000  0000     000     
-- 000  000   000  0000000    00000000  000   000     000     


function text.static.numIndent(segs) 
    return kseg.numIndent(segs)
    end


function text.static.splitLineIndent(str) 
    return kseg.splitAtIndent(str)
    end


function text.static.reindent(oldIndent, newIndent, str) 
        local indent, rest = belt.splitLineIndent(str)
        
        return kstr.lpad(int(((#indent * newIndent) / oldIndent))) .. rest
    end


function text.static.numIndentOfLines(lines) 
        for _, line in ipairs(lines) do 
            if not empty(kstr.trim(line)) then 
                return belt.numIndent(line)
            end
        end
        
        return 0
    end


function text.static.lineIndentAtPos(lines, pos) 
        return belt.numIndent(lines[pos[1]])
    end


function text.static.indentLines(lines, num) 
        num = num or 4
        
        return lines:map(function (l) 
    return (kstr.split(kstr.lpad(num), '') + l)
end)
    end

-- 000      000  000   000  00000000   0000000  
-- 000      000  0000  000  000       000       
-- 000      000  000 0 000  0000000   0000000   
-- 000      000  000  0000  000            000  
-- 0000000  000  000   000  00000000  0000000   


function text.static.seglRangeAtPos(segls, pos) 
        return array(0, pos[1], #segls[pos[1]], pos[1])
    end


function text.static.lineRangeAtPos(lines, pos) 
        return array(0, pos[1], kseg.width(lines[pos[1]]), pos[1])
    end


function text.static.lineRangesForPositions(lines, posl, append) 
        local rngs = belt.lineIndicesForPositions(posl).map(function (y) 
    if #lines[y] then 
    return array(0, y, #lines[y], y) else 
    return array(0, y, 0, (y + 1))
                                                             end
end)
        if valid((rngs and append)) then 
            rngs[-1][2] = 0
            rngs[-1][3] = rngs[-1][3] + 1
        end
        
        return rngs
    end


function text.static.numFullLinesInRange(lines, rng) 
        local d = (rng[3] - rng[1])
        
        -- if d == 0 
        --     r2 = if lines[rng[1]].len > 0 ➜ 1 ➜ 0
        --     ⮐  rng[0] == 0 and rng[2] == r2
        
        local n = 0
        if (rng[0] == 0) then 
            n = n + 1
        end
        
        if (d > 1) then 
            n = n + ((d - 2))
        end
        
        if (rng[2] == #lines[rng[3]]) then 
            n = n + 1
        end
        
        return n
    end


function text.static.numLinesInRange(rng) 
    return ((rng[3] - rng[1]) + 1)
    end


function text.static.isEmptyLineAtPos(lines, pos) 
    return (#lines[pos[1]] <= 0)
    end


function text.static.lineRangesInRange(lines, rng) 
        local rngs = array()
        for ln = 0, belt.numLinesInRange(rng)-1 do 
            rngs:push(belt.lineRangeAtPos(lines, array(0, (rng[1] + ln))))
        end
        
        return rngs
    end


function text.static.seglsForRange(lines, rng) 
        local nl = belt.numLinesInRange(rng)
        
        if (nl == 1) then 
            local bos = kseg.segiAtWidth(lines[rng[2]], rng[1])
            local eos = kseg.segiAtWidth(lines[rng[2]], rng[3])
            return array(lines[rng[2]]:slice(bos, eos))
        end
        
        local firstLineIndex = math.min(rng[2], #lines)
        local lastLineIndex = math.min(rng[4], #lines)
        
        local segi = kseg.segiAtWidth(lines[firstLineIndex], rng[1])
        local lns = array(lines[firstLineIndex]:slice(segi, #lines[firstLineIndex]))
        if (nl > 2) then 
            lns = lns + (lines:slice((firstLineIndex + 1), lastLineIndex))
        end
        
        segi = kseg.indexAtWidth(lines[lastLineIndex], rng[3])
        lns = lns + (array(lines[lastLineIndex]:slice(1, segi)))
        return lns
    end


function text.static.indexOfLongestLine(lines) 
        local maxIndex = 0
        local maxLength = 0
        for index, line in ipairs(lines) do 
            local w = kseg.width(line)
            if (w > maxLength) then 
                maxLength = w
                maxIndex = index
            end
        end
        
        return maxIndex
    end


function text.static.widthOfLines(lines) 
        return kseg.width(lines[belt.indexOfLongestLine(lines)])
    end


function text.static.widthOfLinesIncludingColorBubbles(lines) 
        local maxWidth = 0
        for line in lines do 
            local w = kseg.width(line)
            if (line.indexOf('#') >= 0) then 
                w = w + 4
            end
            
            if (w > maxWidth) then 
                maxWidth = w
            end
        end
        
        return maxWidth
    end

-- ███████    ███  ████████  ████████
-- ███   ███  ███  ███       ███     
-- ███   ███  ███  ██████    ██████  
-- ███   ███  ███  ███       ███     
-- ███████    ███  ███       ███     


function text.static.diffLines(oldLines, newLines) 
        local changes = array()
        local inserts = array()
        local deletes = array()
        
        local oi = 0 -- index in oldLines
        local ni = 0 -- index in newLines
        
        if (oldLines ~= newLines) then 
            local ol = oldLines[oi]
            local nl = newLines[ni]
            
            while (oi < #oldLines) do 
                if not nl then 
                    deletes:push(oi)
                    oi = oi + 1
                    -- elif ol == nl or kseg.str(ol) == kseg.str(nl) # same lines in old and new
                elseif (ol == nl) then 
                    oi = oi + 1
                    ni = ni + 1
                    ol = oldLines[oi]
                    nl = newLines[ni]
                else 
                    if ((nl == oldLines[(oi + 1)]) and (ol == newLines[(ni + 1)])) then 
                        changes:push(ni)
                        oi = oi + 1
                        ni = ni + 1
                        changes:push(ni)
                        oi = oi + 1
                        ni = ni + 1
                        ol = oldLines[oi]
                        nl = newLines[ni]
                    elseif ((nl == oldLines[(oi + 1)]) and (oldLines[(oi + 1)] ~= newLines[(ni + 1)])) then 
                        deletes:push(oi)
                        oi = oi + 1
                        ol = oldLines[oi]
                    elseif ((ol == newLines[(ni + 1)]) and (oldLines[(oi + 1)] ~= newLines[(ni + 1)])) then 
                        inserts:push(ni)
                        ni = ni + 1
                        nl = newLines[ni]
                    else 
                        -- log '' ['✘' kseg.str(ol) kseg.str(nl)]
                        
                        changes:push(ni)
                        oi = oi + 1
                        ol = oldLines[oi]
                        ni = ni + 1
                        nl = newLines[ni]
                    end
                end
            end
            
            while (ni < #newLines) do 
                inserts:push(ni)
                ni = ni + 1
                nl = newLines[ni]
            end
        end
        
        return {
            chg = changes, 
            ins = inserts, 
            del = deletes
            }
    end

--  0000000  00000000   000      000  000000000  
-- 000       000   000  000      000     000     
-- 0000000   00000000   000      000     000     
--      000  000        000      000     000     
-- 0000000   000        0000000  000     000   


function text.static.beforeAndAfterForPos(lines, pos) 
        local line = lines[pos[1]]
        local before = line:slice(1, pos[0])
        local after = line:slice(pos[0])
        return before, after
    end


function text.static.joinLineColumns(lineCols) 
        local numLines = #lineCols[0]
        local numCols = #lineCols
        local lines = array()
        for lidx = 0, numLines-1 do 
            local line = ''
            for cidx = 0, numCols-1 do 
                line = line + (lineCols[cidx][lidx])
            end
            
            lines:push(line)
        end
        
        return lines
    end


function text.static.splitTextAtCols(text, cols) 
        local spans = array()
        for idx, col in ipairs(cols) do 
            local prv = (function () 
    if (idx > 0) then 
    return cols[(idx - 1)] else 
    return 0
                  end
end)()
            spans:push(string.sub(text, prv, col))
        end
        
        spans:push(string.sub(text, col))
        return spans
    end


function text.static.splitLinesAtCols(lines, cols) 
        local cls = array()
        for i in iter(0, #cols) do 
            cls:push(array())
        end
        
        for _, line in ipairs(lines) do 
            local spans = belt.splitTextAtCols(line, cols)
            for span, idx in spans do 
                cls[idx]:push(span)
            end
        end
        
        return cls
    end


function text.static.splitLineRange(lines, rng, includeEmpty) 
        includeEmpty = includeEmpty or true
        
        local nl = belt.numLinesInRange(rng)
        if (nl == 1) then 
            return array(rng)
        end
        
        local split = array()
        
        split:push(array(rng[0], rng[1], kseg.width(lines[rng[1]]), rng[1]))
        
        if (nl > 2) then 
            for i in iter(1, (nl - 2)) do 
                split:push(array(0, (rng[1] + i), kseg.width(lines[(rng[1] + i)]), (rng[1] + i)))
            end
        end
        
        if (includeEmpty or (rng[2] > 0)) then 
            split:push(array(0, rng[3], rng[2], rng[3]))
        end
        
        return split
    end


function text.static.splitLineRanges(lines, rngs, includeEmpty) 
        includeEmpty = includeEmpty or true
        
        local split = array()
        for _, rng in ipairs(rngs) do 
            split = split.concat(belt.splitLineRange(lines, rng, includeEmpty))
        end
        
        return split
    end


function text.static.isLinesPosInside(lines, pos) 
    return (((pos[2] < #lines) and (1 <= pos[1])) and (pos[1] <= kseg.width(lines[pos[2]])))
    end

function text.static.isLinesPosOutside(lines, pos) 
    return not belt.isLinesPosInside(lines, pos)
    end


function text.static.isValidLineIndex(lines, li) 
    return ((1 <= li) <= #lines)
    end

function text.static.isInvalidLineIndex(lines, li) 
    return not belt.isValidLineIndex(lines, li)
    end


function text.static.isMultiLineRange(lines, rng) 
    return (rng[2] ~= rng[4])
    end


function text.static.isFullLineRange(lines, rng) 
    return (((((1 <= rng[2]) and (rng[2] <= rng[4])) and (rng[4] < #lines)) and (rng[1] == 1)) and ((rng[3] >= #lines[rng[4]]) or ((rng[3] == 1) and (rng[2] < rng[4]))))
    end


function text.static.isSpanLineRange(lines, rng) 
    return ((((1 <= rng[2]) and (rng[2] == rng[4])) and (rng[4] < #lines)) and ((rng[1] > 1) or (rng[3] < #lines[rng[2]])))
    end


function text.static.rangeOfLine(lines, y) 
    return array(1, y, kseg.width(lines[y]), y)
    end

--  0000000  000   000  000   000  000   000  000   000  
-- 000       000   000  000   000  0000  000  000  000   
-- 000       000000000  000   000  000 0 000  0000000    
-- 000       000   000  000   000  000  0000  000  000   
--  0000000  000   000   0000000   000   000  000   000  


function text.static.rangeOfClosestChunkToPos(lines, pos) 
        local x, y = pos
        
        if belt.isInvalidLineIndex(lines, y) then return end
        local r = kstr.rangeOfClosestChunk(lines[y], x)
        if r then 
            if ((0 <= r[0]) < r[1]) then 
                return array(r[0], y, r[1], y)
            end
        end
    end


function text.static.rangeOfClosestChunkLeftToPos(lines, pos) 
        local x, y = pos
        
        if belt.isInvalidLineIndex(lines, y) then return end
        local r = kstr.rangeOfClosestChunk(lines[y]:slice(1, x), x)
        if r then 
            if ((0 <= r[0]) < r[1]) then 
                return array(r[0], y, r[1], y)
            end
        end
    end


function text.static.rangeOfClosestChunkRightToPos(lines, pos) 
        local x, y = pos
        
        if belt.isInvalidLineIndex(lines, y) then return end
        local r = kstr.rangeOfClosestChunk(lines[y]:slice(x), x)
        if r then 
            if ((0 <= r[0]) < r[1]) then 
                return array(r[0], y, r[1], y)
            end
        end
    end

-- 000   000   0000000   00000000   0000000    
-- 000 0 000  000   000  000   000  000   000  
-- 000000000  000   000  0000000    000   000  
-- 000   000  000   000  000   000  000   000  
-- 00     00   0000000   000   000  0000000    


function text.static.wordAtPos(lines, pos) 
        local rng = belt.rangeOfClosestWordToPos(lines, pos)
        if rng then 
            return kseg.str(belt.segsForLineSpan(lines, rng))
        end
        
        return ''
    end


function text.static.chunkBeforePos(lines, pos) 
        local before = lines[pos[1]]:slice(1, pos[0])
        local tcc = kseg.tailCountChunk(before)
        if tcc then 
            return kseg.str(before[(#before - tcc)..#before])
        end
        
        return ''
    end


function text.static.chunkAfterPos(lines, pos) 
        local after = lines[pos[1]]:slice(pos[0])
        local hcc = kseg.headCountChunk(after)
        if hcc then 
            return kseg.str(after:slice(1, hcc))
        end
        
        return ''
    end


function text.static.rangeOfClosestWordToPos(lines, pos) 
        local x, y = pos
        if belt.isInvalidLineIndex(lines, y) then return end
        local r = kseg.spanForClosestWordAtColumn(lines[y], x)
        if r then 
            if ((0 <= r[0]) < r[1]) then 
                return array(r[0], y, r[1], y)
            end
        end
    end


function text.static.rangeOfWhitespaceLeftToPos(lines, pos) 
        local x, y = pos
        
        y = clamp(0, (#lines - 1), y)
        x = clamp(0, #lines[y], x)
        
        if (x <= 0) then 
            return array(x, y, x, y)
        end
        
        local segi = kseg.indexAtWidth(lines[y], x)
        local left = lines[y]:slice(1, segi)
        local tc = kseg.tailCount(left, ' ')
        if tc then 
            return array((segi - tc), y, segi, y)
        end
        
        return array(x, y, x, y)
    end


function text.static.rangeOfWordOrWhitespaceLeftToPos(lines, pos) 
        local x, y = pos
        
        if ((x <= 0) or belt.isInvalidLineIndex(lines, y)) then return end
        
        local segi = kseg.indexAtWidth(lines[y], x)
        local left = lines[y]:slice(1, segi)
        local tc = kseg.tailCount(left, ' ')
        if tc then 
            return array((segi - tc), y, segi, y)
        end
        
        tc = kseg.tailCountWord(left)
        if tc then 
            return array((segi - tc), y, segi, y)
        end
        
        return array((segi - 1), y, segi, y)
    end


function text.static.rangeOfWordOrWhitespaceRightToPos(lines, pos) 
        local x, y = pos
        
        if ((x < 0) or belt.isInvalidLineIndex(lines, y)) then return end
        local r = kstr.rangeOfClosestWord(lines[y]:slice(x), 0)
        if r then 
            if ((0 == r[0]) and (r[0] < r[1])) then 
                return array(x, y, (r[1] + x), y)
            end
            
            if (r[0] > 0) then 
                return array(x, y, (r[0] + x), y)
            end
        end
        
        return array(#x, y, lines[y], y)
    end


function text.static.lineChar(line, x) 
    if ((0 <= x) < #line) then 
    return line[x]
                                 end
    end


function text.static.categoryForChar(char) 
        if empty(char) then return 'empty'
        elseif string.match(char, "%s+") then return 'ws'
        elseif string.match(char, "%w+") then return 'word'
        end
        
        return 'punct'
    end


function text.static.jumpDelta(line, px, dx, jump) 
        if (dx > 0) then 
            local ci = px
            local nc = belt.categoryForChar(belt.lineChar(line, ci))
            local cat = nc
            if nc then 
                if (jump:find(cat) < 1) then return dx end
                while true do 
                    ci = ci + dx
                    nc = belt.categoryForChar(belt.lineChar(line, ci))
                    if (nc ~= cat) then break end
                    if (ci <= 0) then break end
                    if (nc == 'empty') then return 1 end
                end
            end
            
            return (ci - px)
        else 
            local ci = (px - 1)
            if (ci < 0) then return 0 end
            if ((ci >= #line) and (jump:find('empty') >= 1)) then return ((#line - ci) - 1) end
            local cat = belt.categoryForChar(belt.lineChar(line, ci))
            if (jump:find(cat) < 1) then return dx end
            while (((0 <= ci) < #line) and (belt.categoryForChar(belt.lineChar(line, ci)) == cat)) do 
                ci = ci + dx
            end
            
            return min(dx, ((ci - px) + 1))
        end
    end


function text.static.numCharsFromPosToWordOrPunctInDirection(lines, pos, dir, opt) 
        local dx = (function () 
    if (dir == 'left') then 
    return -1 else 
    return 1
             end
end)()
        
        if opt.jump then return belt.jumpDelta(lines[pos[2]], pos[1], dx, opt.jump) end
        
        if ((pos[1] + dx) <= 0) then return 0 end
        return dx
    end

return text