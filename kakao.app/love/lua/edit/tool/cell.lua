--[[
     0000000  00000000  000      000      
    000       000       000      000      
    000       0000000   000      000      
    000       000       000      000      
     0000000  00000000  0000000  0000000  
--]]


local cell = class("cell")
    

--  0000000  00000000  000      000       0000000  
-- 000       000       000      000      000       
-- 000       0000000   000      000      0000000   
-- 000       000       000      000           000  
--  0000000  00000000  0000000  0000000  0000000   


function cell.static.cells(cols, rows) 
    return cell.matrix(cols, rows, (function () return {bg = array(), fg = array(), char = ' '} end))
    end


function cell.static.matrix(cols, rows, cb) 
        local lines = array()
        for l in iter(1, rows) do 
            local cells = array()
            for c in iter(1, cols) do 
                cells:push(cb())
            end
            
            lines:push(cells)
        end
        
        return lines
    end

-- 00000000   0000000   00000000       000      000  000   000  00000000   0000000  
-- 000       000   000  000   000      000      000  0000  000  000       000       
-- 000000    000   000  0000000        000      000  000 0 000  0000000   0000000   
-- 000       000   000  000   000      000      000  000  0000  000            000  
-- 000        0000000   000   000      0000000  000  000   000  00000000  0000000   


function cell.static.cellsForLines(lines) 
        local width = belt.widthOfLines(lines)
        local cells = cell.cells(width, #lines)
        
        cell.stampLines(cells, lines)
        
        return cells
    end

--  0000000  000  0000000  00000000  
-- 000       000     000   000       
-- 0000000   000    000    0000000   
--      000  000   000     000       
-- 0000000   000  0000000  00000000  


function cell.static.cellSize(cells) 
        if empty(cells) then 
            return 0, 0
        end
        
        return #cells[1], #cells
    end

--  0000000  000000000   0000000   00     00  00000000   
-- 000          000     000   000  000   000  000   000  
-- 0000000      000     000000000  000000000  00000000   
--      000     000     000   000  000 0 000  000        
-- 0000000      000     000   000  000   000  000        


function cell.static.stampLines(cells, lines, x, y) 
        x = x or 0
        y = y or 0
        
        if empty(lines) then return end
        
        local x, y = belt.pos(x, y)
        
        for li, line in ipairs(lines) do 
            for ci, char in ipairs(line) do 
                cells[li][ci].char = char
            end
        end
    end

-- 000   000  00000000    0000000   00000000   
-- 000 0 000  000   000  000   000  000   000  
-- 000000000  0000000    000000000  00000000   
-- 000   000  000   000  000   000  000        
-- 00     00  000   000  000   000  000        


function cell.static.wrapCellRect(cells, x1, y1, x2, y2) 
        local cols, rows = cell.cellSize(cells)
        
        if (x1 < 0) then x1 = (cols + x1) end
        if (x2 < 0) then x2 = (cols + x2) end
        
        if (y1 < 0) then y1 = (rows + y1) end
        if (y2 < 0) then y2 = (rows + y2) end
        
        return array(x1, y1, x2, y2)
    end

--  0000000  000       0000000   00     00  00000000   
-- 000       000      000   000  000   000  000   000  
-- 000       000      000000000  000000000  00000000   
-- 000       000      000   000  000 0 000  000        
--  0000000  0000000  000   000  000   000  000        


function cell.static.clampCellRect(cells, x1, y1, x2, y2) 
        local cols, rows = cell.cellSize(cells)
        
        x1 = clamp(1, cols, x1)
        x2 = clamp(1, cols, x2)
        
        y1 = clamp(1, rows, y1)
        y2 = clamp(1, rows, y2)
        
        return array(x1, y1, x2, y2)
    end

-- 000   000  000  000000000  000   000        0000000  000   000   0000000   00000000   
-- 000 0 000  000     000     000   000       000       000   000  000   000  000   000  
-- 000000000  000     000     000000000       000       000000000  000000000  0000000    
-- 000   000  000     000     000   000       000       000   000  000   000  000   000  
-- 00     00  000     000     000   000        0000000  000   000  000   000  000   000  


function cell.static.cellsWithChar(cells, char) 
        local res = array()
        for y, row in ipairs(cells) do 
            for x, cell in ipairs(row) do 
                if (cell.char == char) then 
                    res:push({pos = array(x, y), cell = cells[y][x]})
                end
            end
        end
        
        return res
    end

-- 000  000   000      00000000   00000000   0000000  000000000  
-- 000  0000  000      000   000  000       000          000     
-- 000  000 0 000      0000000    0000000   000          000     
-- 000  000  0000      000   000  000       000          000     
-- 000  000   000      000   000  00000000   0000000     000     


function cell.static.cellsInRect(cells, x1, y1, x2, y2) 
        local x1, y1, x2, y2 = unpack(cell.clampCellRect(cells, x1, y1, x2, y2))
        
        local res = {}
        for y in iter(y1, y2) do 
            for x in iter(x1, x2) do 
                res[(#res + 1)] = {pos = {x, y}, cell = cells[y][x]}
            end
        end
        
        return res
    end

-- 000   000  00000000  000   0000000   000   000  0000000     0000000   00000000    0000000  
-- 0000  000  000       000  000        000   000  000   000  000   000  000   000  000       
-- 000 0 000  0000000   000  000  0000  000000000  0000000    000   000  0000000    0000000   
-- 000  0000  000       000  000   000  000   000  000   000  000   000  000   000       000  
-- 000   000  00000000  000   0000000   000   000  0000000     0000000   000   000  0000000   


function cell.static.cellNeighborsAtPos(cells, x, y, xd, yd) 
        xd = xd or 1
        yd = yd or 1
        
        local x1, y1, x2, y2 = unpack(cell.clampCellRect(cells, (x - xd), (y - yd), (x + xd), (y + yd)))
        
        return cell.cellsInRect(cells, x1, y1, x2, y2)
    end

return cell