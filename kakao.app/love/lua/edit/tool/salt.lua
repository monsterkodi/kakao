--[[
 0000000   0000000   000      000000000
000       000   000  000         000   
0000000   000000000  000         000   
     000  000   000  000         000   
0000000   000   000  0000000     000   
--]]

-- use ../../../kxk ▪ kseg
-- use ../../../kxk ◆ salter


local salt = class("salt")
    

--  0000000   0000000   000      000000000  00000000  0000000    
-- 000       000   000  000         000     000       000   000  
-- 0000000   000000000  000         000     0000000   000   000  
--      000  000   000  000         000     000       000   000  
-- 0000000   000   000  0000000     000     00000000  0000000    


function salt.static.isSaltedLine(line) 
        local trimmed = kseg.trim(kseg.trim(kseg.trim(line), '#'))
        if (trimmed[0] in '█0') then 
            return (#kseg.collectGraphemes(trimmed) <= 3)
        end
    end

--  0000000   0000000   000      000000000        000  000   000   0000000  00000000  00000000   000000000  
-- 000       000   000  000         000           000  0000  000  000       000       000   000     000     
-- 0000000   000000000  000         000           000  000 0 000  0000000   0000000   0000000       000     
--      000  000   000  000         000           000  000  0000       000  000       000   000     000     
-- 0000000   000   000  0000000     000           000  000   000  0000000   00000000  000   000     000     


function salt.static.findPositionsForSaltInsert(lines, pos) 
        local y = pos[1]
        if not salt.isSaltedLine(lines[y]) then return end
        
        local sy = y
        while salt.isSaltedLine(lines[(sy - 1)]) do 
            sy = sy - 1
            if ((y - sy) >= 4) then break end
        end
        
        local ey = y
        while salt.isSaltedLine(lines[(ey + 1)]) do 
            ey = ey + 1
            if ((ey - sy) >= 4) then break end
        end
        
        local posl = array()
        if ((ey - sy) >= 4) then 
            for y in iter(sy, (sy + 4)) do 
                posl.push(array(pos[0], y))
            end
        end
        
        return posl
    end

--  0000000    0000000   0000000  000  000  000   000  00000000   0000000   0000000    00000000  00000000   
-- 000   000  000       000       000  000  000   000  000       000   000  000   000  000       000   000  
-- 000000000  0000000   000       000  000  000000000  0000000   000000000  000   000  0000000   0000000    
-- 000   000       000  000       000  000  000   000  000       000   000  000   000  000       000   000  
-- 000   000  0000000    0000000  000  000  000   000  00000000  000   000  0000000    00000000  000   000  


function salt.static.insertAsciiHeaderForPositionsAndRanges(lines, posl, ranges) 
        if empty(ranges) then 
            ranges = posl.map(method (p) 
    return salt.rangeOfClosestWordToPos(lines, p)
end)
        end
        
        local text = salt.joinLines(salt.textForLineRanges(lines, ranges), ' ')
        
        local indt = lpad(salt.lineIndentAtPos(lines, posl[0]))
        
        local salt = (salter(text, (prepend:indt + '# ')) + '\n')
        
        array(lines, posl) = salt.insertTextAtPositions(lines, salt, array(array(0, posl[0][1])))
        return array(lines, posl, array())
    end

return salt