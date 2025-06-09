--[[
00     00  000   000  000      000000000  000    
000   000  000   000  000         000     000    
000000000  000   000  000         000     000    
000 0 000  000   000  000         000     000    
000   000   0000000   0000000     000     000    
--]]

-- use ../../../kxk ▪ kseg
-- use ../tool      ◆ belt


local multi = class("multi")
    

--  0000000   000      000      
-- 000   000  000      000      
-- 000000000  000      000      
-- 000   000  000      000      
-- 000   000  0000000  0000000  


function multi:allCursors() 
    return self.s.cursors.asMutable()
    end

-- 00000000  000   000  00000000    0000000   000   000  0000000    
-- 000        000 000   000   000  000   000  0000  000  000   000  
-- 0000000     00000    00000000   000000000  000 0 000  000   000  
-- 000        000 000   000        000   000  000  0000  000   000  
-- 00000000  000   000  000        000   000  000   000  0000000    


function multi:expandCursors(dir) 
        local cursors = self:allCursors()
        
        local dy = (function () 
    if (dir == 'up') then 
    return -1 else 
    return 1
             end
end)()
        
        local newCursors = array()
        for c in cursors do 
            newCursors:push(c)
            newCursors:push(array(c[1], (c[2] + dy)))
        end
        
        local mc = belt.traversePositionsInDirection(newCursors, self:mainCursor(), dir)
        return self:setCursors(newCursors, {main = mc, adjust = 'topBotDelta'})
    end


function multi:contractCursors(dir) 
        local cursors = self:allCursors()
        
        local newCursors = array()
        for ci, c in ipairs(cursors) do 
            local nbup = belt.positionsContain(cursors, belt.positionInDirection(c, 'down'))
            local nbdn = belt.positionsContain(cursors, belt.positionInDirection(c, 'up'))
            local solo = not (nbup or nbdn)
            local add = (function () 
    if (dir == 'up') then 
    return (nbup or solo)
                  elseif (dir == 'down') then 
    return (nbdn or solo)
                  end
end)()
            
            if add then 
                newCursors:push(c)
            end
        end
        
        return self:setCursors(newCursors)
    end

--  0000000   0000000    0000000    
-- 000   000  000   000  000   000  
-- 000000000  000   000  000   000  
-- 000   000  000   000  000   000  
-- 000   000  0000000    0000000    


function multi:addCursor(x, y) 
        local pos = belt.pos(x, y)
        local cursors = self:allCursors()
        cursors:push(pos)
        return self:setCursors(cursors, {main = -1})
    end


function multi:addCursors(cursors) 
        return self:setCursors(self:allCursors().concat(cursors))
    end


function multi:delCursorsInRange(rng) 
        local outside = belt.positionsOutsideRange(self:allCursors(), rng)
        outside:push(belt.endOfRange(rng))
        return self:setCursors(outside, {main = -1})
    end

-- 00     00   0000000   000   000  00000000  
-- 000   000  000   000  000   000  000       
-- 000000000  000   000   000 000   0000000   
-- 000 0 000  000   000     000     000       
-- 000   000   0000000       0      00000000  


function multi:moveCursors(dir, opt) 
        if is(dir, array) then 
            if (dir[0] == 'bos') then 
                    if self:moveCursorsToStartOfSelections() then return end
                    dir = dir:slice(1)
            elseif (dir[0] == 'eos') then 
                    if self:moveCursorsToEndOfSelections() then return end
                    dir = dir:slice(1)
            end
            
            dir = dir[0]
        end
        
        opt = opt or ({})
        opt.count = opt.count or 1
        opt.jumpWords = opt.jumpWords or false
        
        if (#self.s.highlights > 0) then 
            self:deselect()
        end
        
        local cursors = self:allCursors()
        local lines = self.s.lines
        
        for ci, c in ipairs(cursors) do 
            local line = lines[c[2]]
            
            if (dir == 'left') or (dir == 'right') then c[0] = c[0] + (belt.numCharsFromPosToWordOrPunctInDirection(lines, c, dir, opt))
            elseif (dir == 'up') then c[1] = c[1] - (opt.count)
            elseif (dir == 'down') then c[1] = c[1] + (opt.count)
            elseif (dir == 'eol') then c[0] = kseg.width(self.s.lines[c[2]])
            elseif (dir == 'bol') then c[0] = 0
            elseif (dir == 'bof') then c[0] = 0 ; c[2] = 0
            elseif (dir == 'eof') then c[1] = (#self.s.lines - 1) ; c[1] = kseg.width(line)
            elseif (dir == 'ind') then c[0] = belt.numIndent(line)
            elseif (dir == 'ind_eol') then local ind = belt.numIndent(line) ; c[1] = (function () 
    if (c[1] < ind) then 
    return ind else 
    return kseg.width(line)
                                                                  end
end)()
            elseif (dir == 'ind_bol') then local ind = belt.numIndent(line) ; c[1] = (function () 
    if (c[1] > ind) then 
    return ind else 
    return 1
                                                                  end
end)()
            end
        end
        
        local main = self.s.main
        local adjust = (opt.adjust or 'topBotDelta')
        
        if (dir == 'up') or (dir == 'down') or (dir == 'left') or (dir == 'right') then 
                main = belt.indexOfExtremePositionInDirection(cursors, dir, main)
                adjust = 'topBotDeltaGrow'
        end
        
        self:setCursors(cursors, {main = main, adjust = adjust})
        
        return true
    end


function multi:moveCursorsToStartOfSelections() 
        local selections = self:allSelections()
        
        if empty(selections) then return end
        
        local rngs = belt.splitLineRanges(self.s.lines, selections, false)
        
        self:setCursors(belt.startPositionsOfRanges(rngs))
        
        return true
    end


function multi:moveCursorsToEndOfSelections() 
        local selections = self:allSelections()
        
        if empty(selections) then return end
        
        local rngs = belt.splitLineRanges(self.s.lines, selections, false)
        
        self:setCursors(belt.endPositionsOfRanges(rngs))
        
        return true
    end


function multi:moveCursorsToEndOfLines() 
        local cursors = self:allCursors()
        
        for i, cur in ipairs(cursors) do 
            cur[2] = belt.lineRangeAtPos(self.s.lines, cur)[3]
        end
        
        self:setCursors(cursors)
        
        return true
    end


function multi:isAnyCursorInLine(y) 
        for i, c in ipairs(self:allCursors()) do 
            if (c[2] == y) then return true end
        end
    end

--  0000000  000   000  000   000  000   000   0000000  0000000    00000000  00000000   0000000   00000000   00000000  
-- 000       000   000  0000  000  000  000   000       000   000  000       000       000   000  000   000  000       
-- 000       000000000  000 0 000  0000000    0000000   0000000    0000000   000000    000   000  0000000    0000000   
-- 000       000   000  000  0000  000  000        000  000   000  000       000       000   000  000   000  000       
--  0000000  000   000  000   000  000   000  0000000   0000000    00000000  000        0000000   000   000  00000000  


function multi:chunksBeforeCursors() 
    return self.s.cursors:map(function (c) 
    return belt.chunkBeforePos(self.s.lines, c)
end)
    end

--  0000000  00000000  000      00000000   0000000  000000000  
-- 000       000       000      000       000          000     
-- 0000000   0000000   000      0000000   000          000     
--      000  000       000      000       000          000     
-- 0000000   00000000  0000000  00000000   0000000     000     


function multi:moveCursorsAndSelect(dir, opt) 
        local selections, cursors = belt.extendLineRangesByMovingPositionsInDirection(self.s.lines, self.s.selections, self.s.cursors, dir, opt)
        
        self:setSelections(selections)
        return self:setCursors(cursors, {adjust = 'topBotDelta'})
    end

return multi