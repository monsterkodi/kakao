-- █████████   ███████    ███████   ███            ███████    ████████  ███      █████████
--    ███     ███   ███  ███   ███  ███            ███   ███  ███       ███         ███   
--    ███     ███   ███  ███   ███  ███            ███████    ███████   ███         ███   
--    ███     ███   ███  ███   ███  ███            ███   ███  ███       ███         ███   
--    ███      ███████    ███████   ███████        ███████    ████████  ███████     ███   

kxk = require "kxk.kxk"
belt = require "edit.tool.belt"

test("tool belt", function()
    test("categoryForChar   ", function()
        test.cmp(belt.categoryForChar("a"), "word")
        test.cmp(belt.categoryForChar("0"), "word")
        test.cmp(belt.categoryForChar("."), "punct")
        test.cmp(belt.categoryForChar(":"), "punct")
        test.cmp(belt.categoryForChar("~"), "punct")
        test.cmp(belt.categoryForChar("]"), "punct")
        test.cmp(belt.categoryForChar(" "), "ws")
        test.cmp(belt.categoryForChar(""), "empty")
    end)
    
    test("cells", function()
        local l = belt.seglsForText([[
012
abc
XYZ
]])
        
        local cells = belt.cellsForLines(l)
        
        test.cmp(belt.clampCellRect(cells, 0, 0, 1, 1), array(1, 1, 1, 1))
        
        local rect = belt.cellsInRect(cells, 1, 1, 2, 2)
        for _, c in ipairs(rect) do 
            c.cell.fg = array(255, 0, 0)
        end
        
        test.cmp(cells[1][1].fg, array(255, 0, 0))
        test.cmp(cells[2][2].fg, array(255, 0, 0))
        test.cmp(cells[3][3].fg, array())
        
        test.cmp(belt.clampCellRect(cells, 1, 1, 2, 2), array(1, 1, 2, 2))
        test.cmp(belt.clampCellRect(cells, -1, -1, 1, 1), array(1, 1, 1, 1))
        
        test.cmp(belt.cellsInRect(cells, 1, 1, 2, 2):map(function (n) return n.cell.char end), array('0', '1', 'a', 'b'))
        test.cmp(belt.cellsInRect(cells, 1, 1, 1, 1):map(function (n) return n.cell.char end), array('0'))
        test.cmp(belt.cellsInRect(cells, 1, 1, 3, 1):map(function (n) return n.cell.char end), array('0', '1', '2'))
        test.cmp(belt.cellsInRect(cells, 1, 2, 2, 2):map(function (n) return n.cell.char end), array('a', 'b'))
        
        test.cmp(belt.cellNeighborsAtPos(cells, 1, 1):map(function (n) return n.cell.char end), array('0', '1', 'a', 'b'))
        test.cmp(belt.cellNeighborsAtPos(cells, 2, 2):map(function (n) return n.cell.char end), array('0', '1', '2', 'a', 'b', 'c', 'X', 'Y', 'Z'))
    end)
    
    test("extendLineRangesToPosition ", function()
        local lines = array('123', '45', '6')
        
        test.cmp(belt.extendLineRangesFromPositionToPosition(lines, immutable(array()), array(1, 1), array(1, 3)), array(array(1, 1, 1, 3)))
        test.cmp(belt.extendLineRangesFromPositionToPosition(lines, immutable(array(array(1, 1, 2, 1), array(3, 1, 4, 1))), array(2, 2), array(1, 3)), array(array(1, 1, 2, 1), array(3, 1, 4, 1), array(2, 2, 1, 3)))
    end)
    
    --       000  000   000  00     00  00000000   
    --       000  000   000  000   000  000   000  
    --       000  000   000  000000000  00000000   
    -- 000   000  000   000  000 0 000  000        
    --  0000000    0000000   000   000  000        
    
    test("jumpDelta", function()
        local line = kseg('1  ')
        
        test.cmp(belt.jumpDelta(line, 1, 1, array('empty')), 1)
        test.cmp(belt.jumpDelta(line, 2, 1, array('empty')), 1)
        test.cmp(belt.jumpDelta(line, 3, 1, array('empty')), 1)
        test.cmp(belt.jumpDelta(line, 4, 1, array('empty')), 1)
        
        line = kseg('    a = b ->  ')
        
        test.cmp(belt.jumpDelta(line, 1, 1, array('ws')), 4)
        test.cmp(belt.jumpDelta(line, 2, 1, array('ws')), 3)
        test.cmp(belt.jumpDelta(line, 3, 1, array('ws')), 2)
        test.cmp(belt.jumpDelta(line, 4, 1, array('ws')), 1)
        test.cmp(belt.jumpDelta(line, 5, 1, array('ws')), 1)
        test.cmp(belt.jumpDelta(line, 6, 1, array('ws')), 1)
        test.cmp(belt.jumpDelta(line, 7, 1, array('ws')), 1)
        test.cmp(belt.jumpDelta(line, 8, 1, array('ws')), 1)
        test.cmp(belt.jumpDelta(line, 9, 1, array('ws')), 1)
        test.cmp(belt.jumpDelta(line, 10, 1, array('ws')), 1)
        test.cmp(belt.jumpDelta(line, 11, 1, array('ws')), 1)
        test.cmp(belt.jumpDelta(line, 12, 1, array('ws')), 1)
        test.cmp(belt.jumpDelta(line, 13, 1, array('ws')), 2)
        
        line = kseg('  ab += cd ;;  ')
        
        test.cmp(belt.jumpDelta(line, 1, 1, array('word')), 1)
        test.cmp(belt.jumpDelta(line, 2, 1, array('word')), 1)
        test.cmp(belt.jumpDelta(line, 3, 1, array('word')), 2)
        test.cmp(belt.jumpDelta(line, 4, 1, array('word')), 1)
        test.cmp(belt.jumpDelta(line, 5, 1, array('word')), 1)
        test.cmp(belt.jumpDelta(line, 6, 1, array('word')), 1)
        test.cmp(belt.jumpDelta(line, 7, 1, array('word')), 1)
        test.cmp(belt.jumpDelta(line, 8, 1, array('word')), 1)
        test.cmp(belt.jumpDelta(line, 9, 1, array('word')), 2)
        test.cmp(belt.jumpDelta(line, 10, 1, array('word')), 1)
        test.cmp(belt.jumpDelta(line, 11, 1, array('word')), 1)
        test.cmp(belt.jumpDelta(line, 12, 1, array('word')), 1)
        
        test.cmp(belt.jumpDelta(line, 1, 1, array('punct')), 1)
        test.cmp(belt.jumpDelta(line, 2, 1, array('punct')), 1)
        test.cmp(belt.jumpDelta(line, 3, 1, array('punct')), 1)
        test.cmp(belt.jumpDelta(line, 4, 1, array('punct')), 1)
        test.cmp(belt.jumpDelta(line, 5, 1, array('punct')), 1)
        test.cmp(belt.jumpDelta(line, 6, 1, array('punct')), 2)
        test.cmp(belt.jumpDelta(line, 7, 1, array('punct')), 1)
        test.cmp(belt.jumpDelta(line, 8, 1, array('punct')), 1)
        test.cmp(belt.jumpDelta(line, 9, 1, array('punct')), 1)
        test.cmp(belt.jumpDelta(line, 10, 1, array('punct')), 1)
        test.cmp(belt.jumpDelta(line, 11, 1, array('punct')), 1)
        test.cmp(belt.jumpDelta(line, 12, 1, array('punct')), 2)
        
        test.cmp(belt.jumpDelta(line, 1, 1, array('ws', 'word', 'punct')), 2)
        test.cmp(belt.jumpDelta(line, 2, 1, array('ws', 'word', 'punct')), 1)
        test.cmp(belt.jumpDelta(line, 3, 1, array('ws', 'word', 'punct')), 2)
        test.cmp(belt.jumpDelta(line, 4, 1, array('ws', 'word', 'punct')), 1)
        test.cmp(belt.jumpDelta(line, 5, 1, array('ws', 'word', 'punct')), 1)
        test.cmp(belt.jumpDelta(line, 6, 1, array('ws', 'word', 'punct')), 2)
        test.cmp(belt.jumpDelta(line, 7, 1, array('ws', 'word', 'punct')), 1)
        test.cmp(belt.jumpDelta(line, 8, 1, array('ws', 'word', 'punct')), 1)
        test.cmp(belt.jumpDelta(line, 9, 1, array('ws', 'word', 'punct')), 2)
        test.cmp(belt.jumpDelta(line, 10, 1, array('ws', 'word', 'punct')), 1)
        test.cmp(belt.jumpDelta(line, 11, 1, array('ws', 'word', 'punct')), 1)
        test.cmp(belt.jumpDelta(line, 12, 1, array('ws', 'word', 'punct')), 2)
        
        test.cmp(belt.jumpDelta(line, 1, -1, array('ws', 'word', 'punct')), 0)
        test.cmp(belt.jumpDelta(line, 2, -1, array('ws', 'word', 'punct')), -1)
        test.cmp(belt.jumpDelta(line, 3, -1, array('ws', 'word', 'punct')), -2)
        test.cmp(belt.jumpDelta(line, 4, -1, array('ws', 'word', 'punct')), -1)
        test.cmp(belt.jumpDelta(line, 5, -1, array('ws', 'word', 'punct')), -2)
        test.cmp(belt.jumpDelta(line, 6, -1, array('ws', 'word', 'punct')), -1)
        test.cmp(belt.jumpDelta(line, 7, -1, array('ws', 'word', 'punct')), -1)
        test.cmp(belt.jumpDelta(line, 8, -1, array('ws', 'word', 'punct')), -2)
        test.cmp(belt.jumpDelta(line, 9, -1, array('ws', 'word', 'punct')), -1)
        test.cmp(belt.jumpDelta(line, 10, -1, array('ws', 'word', 'punct')), -1)
        test.cmp(belt.jumpDelta(line, 11, -1, array('ws', 'word', 'punct')), -2)
        test.cmp(belt.jumpDelta(line, 12, -1, array('ws', 'word', 'punct')), -1)
        
        line = kseg('  ')
        
        test.cmp(belt.jumpDelta(line, 6, -1, array('empty')), -3)
        test.cmp(belt.jumpDelta(line, 5, -1, array('empty')), -2)
        test.cmp(belt.jumpDelta(line, 4, -1, array('empty')), -1)
        
        test.cmp(belt.jumpDelta(line, 6, -1, array('ws')), -1)
        test.cmp(belt.jumpDelta(line, 5, -1, array('ws')), -1)
        test.cmp(belt.jumpDelta(line, 4, -1, array('ws')), -1)
        test.cmp(belt.jumpDelta(line, 3, -1, array('ws')), -2)
    end)
    
    test("isPosInsideRange", function()
        test.cmp(belt.isPosInsideRange(array(1, 1), array(1, 1, 2, 1)), true)
        test.cmp(belt.isPosInsideRange(array(2, 1), array(1, 1, 2, 1)), true)
        test.cmp(belt.isPosInsideRange(array(1, 2), array(1, 1, 2, 1)), false)
        
        test.cmp(belt.isPosInsideRange(array(7, 1), array(5, 2, 10, 2)), false)
        test.cmp(belt.isPosInsideRange(array(7, 2), array(5, 2, 10, 2)), true)
        test.cmp(belt.isPosInsideRange(array(5, 2), array(5, 2, 10, 2)), true)
        test.cmp(belt.isPosInsideRange(array(10, 2), array(5, 2, 10, 2)), true)
        test.cmp(belt.isPosInsideRange(array(4, 2), array(5, 2, 10, 2)), false)
        test.cmp(belt.isPosInsideRange(array(11, 2), array(5, 2, 10, 2)), false)
        test.cmp(belt.isPosInsideRange(array(7, 3), array(5, 2, 10, 2)), false)
    end)
    
    test("rangeContainsRange", function()
        test.cmp(belt.rangeContainsRange(array(0, 0, 1, 0), array(0, 0, 0, 0)), true)
        test.cmp(belt.rangeContainsRange(array(0, 0, 1, 0), array(1, 0, 1, 0)), true)
    end)
    
    -- 00000000    0000000   000   000   0000000   00000000   0000000  
    -- 000   000  000   000  0000  000  000        000       000       
    -- 0000000    000000000  000 0 000  000  0000  0000000   0000000   
    -- 000   000  000   000  000  0000  000   000  000            000  
    -- 000   000  000   000  000   000   0000000   00000000  0000000   
    
    test("normalizeRanges", function()
        test.cmp(belt.normalizeRanges(array()), array())
        
        test.cmp(belt.normalizeRanges(array(array(0, 1, 3, 4))), array(array(0, 1, 3, 4)))
        test.cmp(belt.normalizeRanges(array(array(0, 4, 3, 1))), array(array(3, 1, 0, 4)))
        test.cmp(belt.normalizeRanges(array(array(3, 1, 0, 4))), array(array(3, 1, 0, 4)))
        test.cmp(belt.normalizeRanges(array(array(3, 4, 2, 4))), array(array(2, 4, 3, 4)))
        
        test.cmp(belt.normalizeRanges(array(array(0, 0, 9, 9), array(1, 1, 2, 2))), array(array(0, 0, 9, 9), array(1, 1, 2, 2)))
        test.cmp(belt.normalizeRanges(array(array(1, 1, 2, 2), array(0, 0, 9, 9))), array(array(0, 0, 9, 9), array(1, 1, 2, 2)))
    end)
    
    test("mergeLineRanges", function()
        local lines = kseg.segls([[
1234567890
1234567890
1234567890]])
        
        test.cmp(belt.mergeLineRanges(lines, array(array(1, 1, 10, 10), array(2, 2, 3, 3))), array(array(1, 1, 10, 10)))
        test.cmp(belt.mergeLineRanges(lines, array(array(2, 2, 3, 3), array(1, 1, 10, 10))), array(array(1, 1, 10, 10)))
        test.cmp(belt.mergeLineRanges(lines, array(array(2, 2, 3, 3), array(1, 1, 10, 10), array(1, 1, 11, 1), array(1, 9, 10, 10))), array(array(1, 1, 10, 10)))
        
        test.cmp(belt.mergeLineRanges(lines, array(array(5, 1, 7, 1), array(9, 1, 11, 1))), array(array(5, 1, 7, 1), array(9, 1, 11, 1)))
        test.cmp(belt.mergeLineRanges(lines, array(array(5, 1, 7, 1), array(8, 1, 11, 1))), array(array(5, 1, 7, 1), array(8, 1, 11, 1)))
        test.cmp(belt.mergeLineRanges(lines, array(array(5, 1, 7, 1), array(7, 1, 11, 1))), array(array(5, 1, 11, 1)))
        test.cmp(belt.mergeLineRanges(lines, array(array(5, 1, 7, 1), array(6, 1, 11, 1))), array(array(5, 1, 11, 1)))
        
        test.cmp(belt.mergeLineRanges(lines, array(array(5, 1, 11, 2), array(1, 3, 5, 3))), array(array(5, 1, 5, 3)))
        
        test.cmp(belt.mergeLineRanges(lines, array(array(1, 1, 10, 1), array(1, 2, 10, 2), array(1, 3, 10, 3))), array(array(1, 1, 10, 1), array(1, 2, 10, 2), array(1, 3, 10, 3)))
        test.cmp(belt.mergeLineRanges(lines, array(array(1, 1, 11, 1), array(1, 2, 11, 2), array(1, 3, 11, 3))), array(array(1, 1, 11, 3)))
        
        test.cmp(belt.mergeLineRanges(lines, array(array(1, 1, 9, 1), array(1, 2, 9, 2), array(1, 3, 9, 3), array(9, 1, 10, 1), array(9, 2, 10, 2), array(9, 3, 10, 3))), array(array(1, 1, 10, 1), array(1, 2, 10, 2), array(1, 3, 10, 3)))
    end)
    
    test("textForLineRange", function()
        local lines = kseg.segls("line 1\nline 2")
        test.cmp(belt.textForLineRange(lines, array(1, 1, 5, 1)), "line")
        test.cmp(belt.textForLineRange(lines, array(5, 1, 6, 1)), " ")
        test.cmp(belt.textForLineRange(lines, array(1, 1, 1, 1)), "")
        test.cmp(belt.textForLineRange(lines, array(1, 1, 2, 1)), "l")
    end)
    
    test("rangeOfClosestWordToPos", function()
        local lines = kseg.segls("1 2  3   4\n   ab ghij")
        
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(1, 1)), array(1, 1, 2, 1))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(2, 1)), array(1, 1, 2, 1))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(3, 1)), array(3, 1, 4, 1))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(4, 1)), array(3, 1, 4, 1))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(5, 1)), array(3, 1, 4, 1))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(6, 1)), array(6, 1, 7, 1))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(7, 1)), array(6, 1, 7, 1))
        
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(1, 2)), array(4, 2, 6, 2))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(6, 2)), array(4, 2, 6, 2))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(7, 2)), array(7, 2, 11, 2))
        
        lines = kseg.segls("line 1\nline 2")
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(5, 1)), array(1, 1, 5, 1))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(6, 1)), array(6, 1, 7, 1))
    end)
    
    test("rangeOfWhitespaceLeftToPos", function()
        local segls = kseg.segls("xxxx    yy  ")
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(1, 1)), array(1, 1, 1, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(2, 1)), array(2, 1, 2, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(5, 1)), array(5, 1, 5, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(6, 1)), array(5, 1, 6, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(7, 1)), array(5, 1, 7, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(9, 1)), array(5, 1, 9, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(10, 1)), array(10, 1, 10, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(11, 1)), array(11, 1, 11, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(12, 1)), array(11, 1, 12, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(13, 1)), array(11, 1, 13, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(14, 1)), array(11, 1, 13, 1))
        
        segls = kseg.segls('  🧑🌾  ab🌾cde')
        
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(1, 1)), array(1, 1, 1, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(2, 1)), array(1, 1, 2, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(3, 1)), array(1, 1, 3, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(4, 1)), array(1, 1, 3, 1))
        test.cmp(belt.rangeOfWhitespaceLeftToPos(segls, array(5, 1)), array(5, 1, 5, 1))
    end)
    
    test("rangeOfWordOrWhitespaceLeftToPos", function()
        local segls = kseg.segls("1 2  3   4\n   ab  ghij")
        
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(1, 1)), array(1, 1, 1, 1))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(2, 1)), array(1, 1, 2, 1))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(3, 1)), array(2, 1, 3, 1))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(4, 1)), array(3, 1, 4, 1))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(5, 1)), array(4, 1, 5, 1))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(6, 1)), array(4, 1, 6, 1))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(7, 1)), array(6, 1, 7, 1))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(10, 1)), array(7, 1, 10, 1))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(11, 1)), array(10, 1, 11, 1))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(12, 1)), array(10, 1, 11, 1))
        
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(2, 2)), array(1, 2, 2, 2))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(4, 2)), array(1, 2, 4, 2))
        
        segls = kseg.segls('  🧑🌾  ab🌾cde')
        
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(2, 1)), array(1, 1, 2, 1))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(3, 1)), array(1, 1, 3, 1))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(4, 1)), array(1, 1, 3, 1))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(5, 1)), array(4, 1, 4, 1))
    end)
    
    test("chunkBeforePos", function()
        local segls = kseg.segls('\n1.4   x:z')
        
        test.cmp(belt.chunkBeforePos(segls, array(1, 1)), '')
        test.cmp(belt.chunkBeforePos(segls, array(2, 1)), '')
        test.cmp(belt.chunkBeforePos(segls, array(1, 2)), '')
        test.cmp(belt.chunkBeforePos(segls, array(2, 2)), '1')
        test.cmp(belt.chunkBeforePos(segls, array(4, 2)), '1.4')
        test.cmp(belt.chunkBeforePos(segls, array(6, 2)), '')
        test.cmp(belt.chunkBeforePos(segls, array(10, 2)), 'x:z')
    end)
    
    test("chunkAfterPos", function()
        local segls = kseg.segls('\n1.4   x:z')
        
        test.cmp(belt.chunkAfterPos(segls, array(1, 1)), '')
        test.cmp(belt.chunkAfterPos(segls, array(2, 1)), '')
        test.cmp(belt.chunkAfterPos(segls, array(1, 2)), '1.4')
        test.cmp(belt.chunkAfterPos(segls, array(2, 2)), '.4')
        test.cmp(belt.chunkAfterPos(segls, array(4, 2)), '')
        test.cmp(belt.chunkAfterPos(segls, array(6, 2)), '')
        test.cmp(belt.chunkAfterPos(segls, array(7, 2)), 'x:z')
        test.cmp(belt.chunkAfterPos(segls, array(8, 2)), ':z')
    end)
    
    test("isFullLineRange", function()
        local segls = kseg.segls('\n124\nabcdef')
        
        test.cmp(belt.isFullLineRange(segls, array(1, 1, 1, 2)), true)
        test.cmp(belt.isFullLineRange(segls, array(1, 1, 1, 1)), true)
        test.cmp(belt.isFullLineRange(segls, array(1, 2, 4, 2)), true)
        test.cmp(belt.isFullLineRange(segls, array(1, 2, 6, 2)), true)
        test.cmp(belt.isFullLineRange(segls, array(1, 2, 3, 2)), false)
        test.cmp(belt.isFullLineRange(segls, array(2, 2, 4, 2)), false)
        test.cmp(belt.isFullLineRange(segls, array(2, 3, 4, 3)), false)
        test.cmp(belt.isFullLineRange(segls, array(1, 3, 14, 3)), true)
        test.cmp(belt.isFullLineRange(segls, array(1, 3, 7, 3)), true)
        test.cmp(belt.isFullLineRange(segls, array(1, 2, 1, 3)), true)
        test.cmp(belt.isFullLineRange(segls, array(1, 3, 6, 3)), false)
    end)
    
    -- 0000000    000       0000000    0000000  000   000   0000000  
    -- 000   000  000      000   000  000       000  000   000       
    -- 0000000    000      000   000  000       0000000    0000000   
    -- 000   000  000      000   000  000       000  000        000  
    -- 0000000    0000000   0000000    0000000  000   000  0000000   
    
    test("lineIndicesForRangesAndPositions", function()
        test.cmp(belt.lineIndicesForRangesAndPositions(array(), array(array(1, 1), array(1, 2), array(1, 3))), array(1, 2, 3))
        test.cmp(belt.lineIndicesForRangesAndPositions(array(array(0, 0, 2, 0)), array(array(1, 1), array(1, 2), array(1, 3))), array(0, 1, 2, 3))
        test.cmp(belt.lineIndicesForRangesAndPositions(array(array(1, 1, 2, 2)), array(array(1, 6), array(1, 5), array(1, 4))), array(1, 2, 4, 5, 6))
    end)
    
    test("linesIndicesForSpans", function()
        test.cmp(belt.lineIndicesForSpans(array()), array())
        test.cmp(belt.lineIndicesForSpans(array(array(1, 2, 1))), array(2))
        test.cmp(belt.lineIndicesForSpans(array(array(1, 2, 1), array(2, 2, 2))), array(2))
        test.cmp(belt.lineIndicesForSpans(array(array(1, 2, 1), array(2, 3, 2))), array(2, 3))
        test.cmp(belt.lineIndicesForSpans(array(array(1, 2, 1), array(2, 4, 2))), array(2, 4))
    end)
    
    test("blockRangesForRangesAndPositions", function()
        local lines = kseg.segls([[
line 1
line 2
]])
        
        test.cmp(belt.blockRangesForRangesAndPositions(lines, array(), array(array(1, 1), array(1, 2))), array(array(1, 1, 7, 2)))
        test.cmp(belt.blockRangesForRangesAndPositions(lines, array(array(1, 1, 6, 2)), array(array(1, 1))), array(array(1, 1, 7, 2)))
        test.cmp(belt.blockRangesForRangesAndPositions(lines, array(array(1, 2, 6, 2)), array(array(1, 1))), array(array(1, 1, 7, 2)))
        
        lines = kseg.segls([[
line 1
line 2
line 3
line 4
line 5
line 6
]])
        
        test.cmp(belt.blockRangesForRangesAndPositions(lines, array(), array(array(1, 1), array(1, 2), array(1, 3))), array(array(1, 1, 7, 3)))
        test.cmp(belt.blockRangesForRangesAndPositions(lines, array(), array(array(6, 5), array(4, 3), array(2, 1))), array(array(1, 1, 7, 1), array(1, 3, 7, 3), array(1, 5, 7, 5)))
    end)
    
    --  0000000  00000000    0000000   000   000  
    -- 000       000   000  000   000  0000  000  
    -- 0000000   00000000   000000000  000 0 000  
    --      000  000        000   000  000  0000  
    -- 0000000   000        000   000  000   000  
    
    test("isSpanLineRange", function()
        local lines = kseg.segls('\n124\nabcdef')
        
        test.cmp(belt.isSpanLineRange(lines, array(1, 1, 1, 1)), false)
        test.cmp(belt.isSpanLineRange(lines, array(1, 2, 4, 2)), false)
        test.cmp(belt.isSpanLineRange(lines, array(1, 2, 1, 3)), false)
        
        test.cmp(belt.isSpanLineRange(lines, array(2, 2, 4, 2)), true)
        test.cmp(belt.isSpanLineRange(lines, array(2, 2, 2, 2)), true)
        test.cmp(belt.isSpanLineRange(lines, array(2, 2, 3, 2)), true)
        test.cmp(belt.isSpanLineRange(lines, array(2, 2, 4, 2)), true)
    end)
    
    test("isPosAfterSpan", function()
        test.cmp(belt.isPosAfterSpan(array(0, 0), array(1, 0, 5)), false)
        test.cmp(belt.isPosAfterSpan(array(4, 0), array(1, 0, 5)), false)
        test.cmp(belt.isPosAfterSpan(array(5, 0), array(1, 0, 5)), true)
        test.cmp(belt.isPosAfterSpan(array(6, 0), array(1, 0, 5)), true)
        test.cmp(belt.isPosAfterSpan(array(0, 1), array(1, 0, 5)), true)
    end)
    
    test("isPosBeforeSpan", function()
        test.cmp(belt.isPosBeforeSpan(array(0, 0), array(1, 0, 3)), true)
        test.cmp(belt.isPosBeforeSpan(array(1, 0), array(1, 0, 3)), false)
        test.cmp(belt.isPosBeforeSpan(array(3, 1), array(1, 0, 3)), false)
    end)
    
    test("isPosInsideSpan", function()
        test.cmp(belt.isPosInsideSpan(array(0, 0), array(1, 0, 3)), false)
        test.cmp(belt.isPosInsideSpan(array(1, 0), array(1, 0, 3)), true)
        test.cmp(belt.isPosInsideSpan(array(2, 0), array(1, 0, 3)), true)
        test.cmp(belt.isPosInsideSpan(array(3, 0), array(1, 0, 3)), false)
    end)
    
    test("nextSpanAfterPos", function()
        local spans = array(array(1, 0, 3), array(6, 0, 8), array(2, 1, 5))
        
        test.cmp(belt.nextSpanAfterPos(spans, array(4, 0)), array(6, 0, 8))
        test.cmp(belt.nextSpanAfterPos(spans, array(0, 0)), array(1, 0, 3))
        
        spans = array(array(0, 21, 11), array(2, 22, 11), array(5, 23, 11), array(7, 24, 11))
        
        test.cmp(belt.nextSpanAfterPos(spans, array(11, 21)), array(2, 22, 11))
        test.cmp(belt.nextSpanAfterPos(spans, array(11, 22)), array(5, 23, 11))
        test.cmp(belt.nextSpanAfterPos(spans, array(11, 23)), array(7, 24, 11))
        test.cmp(belt.nextSpanAfterPos(spans, array(11, 24)), array(0, 21, 11))
        
        spans = array(array(2, 1, 5), array(2, 2, 5), array(2, 3, 5))
        
        test.cmp(belt.nextSpanAfterPos(spans, array(5, 2)), array(2, 3, 5))
        test.cmp(belt.nextSpanAfterPos(spans, array(5, 3)), array(2, 1, 5))
        test.cmp(belt.nextSpanAfterPos(spans, array(5, 1)), array(2, 2, 5))
        
        spans = array(array(1, 4, 3), array(3, 4, 5))
        
        test.cmp(belt.nextSpanAfterPos(spans, array(0, 0)), array(1, 4, 3))
        test.cmp(belt.nextSpanAfterPos(spans, array(3, 4)), array(3, 4, 5))
        test.cmp(belt.nextSpanAfterPos(spans, array(5, 4)), array(1, 4, 3))
    end)
    
    test("prevSpanBeforePos", function()
        local spans = array(array(1, 0, 3), array(6, 0, 8), array(2, 1, 5))
        
        test.cmp(belt.prevSpanBeforePos(spans, array(0, 0)), array(2, 1, 5))
        test.cmp(belt.prevSpanBeforePos(spans, array(1, 0)), array(2, 1, 5))
        test.cmp(belt.prevSpanBeforePos(spans, array(2, 0)), array(2, 1, 5))
        test.cmp(belt.prevSpanBeforePos(spans, array(3, 0)), array(1, 0, 3))
        test.cmp(belt.prevSpanBeforePos(spans, array(4, 0)), array(1, 0, 3))
        test.cmp(belt.prevSpanBeforePos(spans, array(6, 0)), array(1, 0, 3))
        test.cmp(belt.prevSpanBeforePos(spans, array(7, 0)), array(1, 0, 3))
        test.cmp(belt.prevSpanBeforePos(spans, array(9, 0)), array(6, 0, 8))
        test.cmp(belt.prevSpanBeforePos(spans, array(0, 1)), array(6, 0, 8))
    end)
    
    -- 00000000    0000000    0000000  000  000000000  000   0000000   000   000   0000000  
    -- 000   000  000   000  000       000     000     000  000   000  0000  000  000       
    -- 00000000   000   000  0000000   000     000     000  000   000  000 0 000  0000000   
    -- 000        000   000       000  000     000     000  000   000  000  0000       000  
    -- 000         0000000   0000000   000     000     000   0000000   000   000  0000000   
    
    test("normalizePositions", function()
        test.cmp(belt.normalizePositions(array(array(1, 1), array(2, 1), array(3, 1))), array(array(1, 1), array(2, 1), array(3, 1)))
        test.cmp(belt.normalizePositions(array(array(1, 0), array(2, 0), array(0, 0))), array(array(1, 1), array(2, 1)))
        test.cmp(belt.normalizePositions(array(array(1, 0), array(2, 0), array(1, 0))), array(array(1, 1), array(2, 1)))
        test.cmp(belt.normalizePositions(array(array(2, 2), array(3, 3), array(1, 1))), array(array(1, 1), array(2, 2), array(3, 3)))
        test.cmp(belt.normalizePositions(array(array(2, 2), array(0, 3), array(11, 1))), array(array(11, 1), array(2, 2), array(1, 3)))
    end)
    
    test("lineRangeAtPos", function()
        local lines = belt.seglsForText([[
🌾🧑
]])
        
        test.cmp(belt.lineRangeAtPos(lines, array(1, 1)), array(1, 1, 5, 1))
    end)
    
    test("seglRangeAtPos", function()
        local lines = belt.seglsForText([[
🧑🌾
]])
        
        test.cmp(belt.seglRangeAtPos(lines, array(1, 1)), array(1, 1, 3, 1))
    end)
    
    test("lineRangesInRange", function()
        local lines = belt.seglsForText([[
1

12
abc
]])
        
        test.cmp(belt.lineRangesInRange(lines, array(1, 1, 1, 3)), array(array(1, 1, 2, 1), array(1, 2, 1, 2), array(1, 3, 3, 3)))
        test.cmp(belt.lineRangesInRange(lines, array(1, 1, 1, 1)), array(array(1, 1, 2, 1)))
        test.cmp(belt.lineRangesInRange(lines, array(1, 1, 2, 1)), array(array(1, 1, 2, 1)))
        test.cmp(belt.lineRangesInRange(lines, array(1, 1, 1, 2)), array(array(1, 1, 2, 1), array(1, 2, 1, 2)))
        test.cmp(belt.lineRangesInRange(lines, array(1, 4, 1, 4)), array(array(1, 4, 4, 4)))
    end)
    
    test("lineSpansForText", function()
        local lines = belt.seglsForText([[
1

12
abc
]])
        
        test.cmp(belt.lineSpansForText(lines, "1"), array(array(1, 1, 2), array(1, 3, 2)))
        test.cmp(belt.lineSpansForText(lines, "12"), array(array(1, 3, 3)))
        test.cmp(belt.lineSpansForText(lines, "abc"), array(array(1, 4, 4)))
    end)
    
    --▸ rangesContainSpan
    --    
    --    belt.rangesContainSpan [] nil ▸ false
    
    test("splitLineRanges", function()
        local lines = belt.seglsForText([[
1

12
abc
]])
        
        test.cmp(belt.splitLineRanges(lines, array(array(1, 1, 2, 3))), array(array(1, 1, 2, 1), array(1, 2, 1, 2), array(1, 3, 2, 3)))
        test.cmp(belt.splitLineRanges(lines, array(array(1, 3, 2, 3), array(3, 3, 4, 3))), array(array(1, 3, 2, 3), array(3, 3, 4, 3)))
    end)
    
    test("seglsForRange", function()
        local segls = belt.seglsForText([[
123
456

abc
def]])
        
        test.cmp(#segls, 5)
        test.cmp(belt.seglsForRange(segls, array(1, 1, 3, 5)), array(kseg("123"), kseg("456"), kseg(), kseg("abc"), kseg("de")))
        test.cmp(belt.seglsForRange(segls, array(1, 1, 1, 1)), array(kseg()))
        --belt.seglsForRange segls [1 1 2 1] ▸ [kseg("1")]
        test.cmp(belt.seglsForRange(segls, array(4, 1, 1, 2)), array(kseg(), kseg()))
        test.cmp(belt.seglsForRange(segls, array(4, 1, 2, 2)), array(kseg(), kseg('4')))
    end)
    
    test("rangesForLinesSplitAtPositions ", function()
        local lines = belt.seglsForText([[
123
456

abc
def]])
        
        test.cmp(belt.rangesForLinesSplitAtPositions(lines, array()), array())
        test.cmp(belt.rangesForLinesSplitAtPositions(lines, array(array(1, 1))), array(array(1, 1, 1, 1), array(1, 1, 4, 5)))
        test.cmp(belt.rangesForLinesSplitAtPositions(lines, array(array(2, 1))), array(array(1, 1, 2, 1), array(2, 1, 4, 5)))
        test.cmp(belt.rangesForLinesSplitAtPositions(lines, array(array(1, 3))), array(array(1, 1, 1, 3), array(1, 3, 4, 5)))
        
        test.cmp(belt.rangesForLinesSplitAtPositions(lines, array(array(1, 1), array(2, 1))), array(array(1, 1, 1, 1), array(1, 1, 2, 1), array(2, 1, 4, 5)))
        test.cmp(belt.rangesForLinesSplitAtPositions(lines, array(array(4, 1), array(4, 2))), array(array(1, 1, 4, 1), array(4, 1, 4, 2), array(4, 2, 4, 5)))
        
        test.cmp(belt.rangesForLinesSplitAtPositions(lines, array(array(1, 6))), array(array(1, 1, 4, 5), array(4, 5, 4, 5)))
        test.cmp(belt.rangesForLinesSplitAtPositions(lines, array(array(1, 2))), array(array(1, 1, 1, 2), array(1, 2, 4, 5)))
        test.cmp(belt.rangesForLinesSplitAtPositions(lines, immutable(array(array(1, 2)))), array(array(1, 1, 1, 2), array(1, 2, 4, 5)))
    end)
    
    test("rangesOfStringsInText", function()
        test.cmp(belt.rangesOfStringsInText("hello"), array())
        test.cmp(belt.rangesOfStringsInText("he'll'o"), array(array(3, 1, 7, 1)))
    end)
    
    test("widthOfLines", function()
        --       12345678901234567890123456789012345678901234567890 
        local text = "ｔｈｅ　ｑｕｉｃｋ　ｂｒｏｗｎ　ｆｏｘ　ｊｕｍｐｓ"
        local lines = belt.seglsForText(text)
        
        test.cmp(belt.widthOfLines(lines), 50)
    end)
    
    -- ████████   ███   ███   ███████        ███  ███   ███       ███████  █████████  ████████   
    -- ███   ███  ████  ███  ███             ███  ████  ███      ███          ███     ███   ███  
    -- ███████    ███ █ ███  ███  ████       ███  ███ █ ███      ███████      ███     ███████    
    -- ███   ███  ███  ████  ███   ███       ███  ███  ████           ███     ███     ███   ███  
    -- ███   ███  ███   ███   ███████        ███  ███   ███      ███████      ███     ███   ███  
    
    test("isRangeInString", function()
        local lines = belt.seglsForText([[
123
'456'

'abc'
def
]])
        
        test.cmp(belt.isRangeInString(lines, array(1, 1, 1, 1)), false)
        test.cmp(belt.isRangeInString(lines, array(1, 3, 1, 3)), false)
        test.cmp(belt.isRangeInString(lines, array(1, 4, 1, 4)), false)
        test.cmp(belt.isRangeInString(lines, array(2, 4, 6, 4)), false)
        test.cmp(belt.isRangeInString(lines, array(2, 2, 2, 2)), true)
        test.cmp(belt.isRangeInString(lines, array(2, 4, 3, 4)), true)
        test.cmp(belt.isRangeInString(lines, array(2, 4, 4, 4)), true)
        test.cmp(belt.isRangeInString(lines, array(2, 4, 5, 4)), true)
    end)
    
    --  ███████  ███   ███  ████████   ████████    ███████   ███   ███  ███   ███  ███████  
    -- ███       ███   ███  ███   ███  ███   ███  ███   ███  ███   ███  ████  ███  ███   ███
    -- ███████   ███   ███  ███████    ███████    ███   ███  ███   ███  ███ █ ███  ███   ███
    --      ███  ███   ███  ███   ███  ███   ███  ███   ███  ███   ███  ███  ████  ███   ███
    -- ███████    ███████   ███   ███  ███   ███   ███████    ███████   ███   ███  ███████  
    
    test("rangesOfPairsSurroundingPositions", function()
        local lines = belt.seglsForText([[
01234567

'45""6'
'a#]] .. [[{}c'
[{([])}]
]])
        
        local pairs = array(array("'", "'"), array('"', '"'), array('#{', '}'), array('[', ']'), array('(', ')'))
        local posl = array(array(5, 1), array(5, 2), array(5, 3), array(5, 4), array(5, 5))
        
        --belt.rangesOfPairsSurroundingPositions lines pairs posl ▸ [
        --    [4 3 6 3] 
        --    [3 4 6 4] 
        --    [4 5 6 5]]
    end)
    
    -- ███   ███  ████████   ███████  █████████  ████████  ███████       ████████    ███████   ███  ████████    ███████
    -- ████  ███  ███       ███          ███     ███       ███   ███     ███   ███  ███   ███  ███  ███   ███  ███     
    -- ███ █ ███  ███████   ███████      ███     ███████   ███   ███     ████████   █████████  ███  ███████    ███████ 
    -- ███  ████  ███            ███     ███     ███       ███   ███     ███        ███   ███  ███  ███   ███       ███
    -- ███   ███  ████████  ███████      ███     ████████  ███████       ███        ███   ███  ███  ███   ███  ███████ 
    
    test("rangesOfNestedPairsAtPositions", function()
        local lines = belt.seglsForText([[
01234567

'45""6'
'ab#\{\}c'
[{([])}]
]])
        
        local posl = array(array(5, 1), array(5, 2), array(5, 3), array(5, 4), array(5, 5))
        
        -- belt.rangesOfNestedPairsAtPositions lines posl ▸ [
        --     [1 3 7 3] 
        --     [1 4 7 4] 
        --     [1 5 8 5] [2 5 7 5] [3 5 6 5] [4 5 5 5]
        -- ]
    end)
    
    test("spansOfNestedPairsAtPositions", function()
        local lines = belt.seglsForText([[
01234567

'45""6'
'a#\{\}c'
[{([])}]
]])
        
        local posl = array(array(5, 1), array(5, 2), array(5, 3), array(5, 4), array(5, 5))
        
        --belt.spansOfNestedPairsAtPositions lines posl ▸ [
        --        [
        --            [1 3 2] [7 3 8] 
        --            [1 4 2] [7 4 8] 
        --            [1 5 2] [8 5 9] [2 5 3] [7 5 8] [3 5 4] [6 5 7] [4 5 5] [5 5 6]
        --        ]
        --        [
        --            [1 5 2] [8 5 9] [2 5 3] [7 5 8] [3 5 4] [6 5 7] [4 5 5] [5 5 6]
        --        ]
        --        [
        --            [1 3 2] [7 3 8] 
        --            [1 4 2] [7 4 8] 
        --        ]
        --    ]
    end)
    
    --  ███████   ████████   ████████  ███   ███       ███████  ███       ███████    ███████  ████████
    -- ███   ███  ███   ███  ███       ████  ███      ███       ███      ███   ███  ███       ███     
    -- ███   ███  ████████   ███████   ███ █ ███      ███       ███      ███   ███  ███████   ███████ 
    -- ███   ███  ███        ███       ███  ████      ███       ███      ███   ███       ███  ███     
    --  ███████   ███        ████████  ███   ███       ███████  ███████   ███████   ███████   ████████
    
    test("openCloseSpansForPositions", function()
        local segls = kseg.segls([[
[{([])}]
'45""6'
'a{}c'
]])
        
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(1, 1))), array(array(1, 1, 2), array(8, 1, 9)))
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(2, 1))), array(array(2, 1, 3), array(7, 1, 8)))
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(3, 1))), array(array(3, 1, 4), array(6, 1, 7)))
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(4, 1))), array(array(4, 1, 5), array(5, 1, 6)))
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(5, 1))), array(array(4, 1, 5), array(5, 1, 6)))
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(6, 1))), array(array(3, 1, 4), array(6, 1, 7)))
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(7, 1))), array(array(2, 1, 3), array(7, 1, 8)))
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(8, 1))), array(array(1, 1, 2), array(8, 1, 9)))
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(9, 1))), array(array(1, 1, 2), array(8, 1, 9)))
        
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(11, 1))), array())
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(1, 2))), array())
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(7, 2))), array())
        
        test.cmp(belt.stringDelimiterSpansForPositions(segls, array(array(1, 2))), array(array(1, 2, 2), array(7, 2, 8)))
        test.cmp(belt.stringDelimiterSpansForPositions(segls, array(array(7, 2))), array(array(1, 2, 2), array(7, 2, 8)))
        
        test.cmp(belt.normalizeSpans(belt.openCloseSpansForPositions(segls, array(array(3, 3)))), array(array(3, 3, 4), array(4, 3, 5)))
        test.cmp(belt.normalizeSpans(belt.openCloseSpansForPositions(segls, array(array(4, 3)))), array(array(3, 3, 4), array(4, 3, 5)))
        test.cmp(belt.normalizeSpans(belt.openCloseSpansForPositions(segls, array(array(6, 3)))), array())
        
        test.cmp(belt.normalizeSpans(belt.stringDelimiterSpansForPositions(segls, array(array(3, 3)))), array(array(1, 3, 2), array(6, 3, 7)))
        test.cmp(belt.normalizeSpans(belt.stringDelimiterSpansForPositions(segls, array(array(4, 3)))), array(array(1, 3, 2), array(6, 3, 7)))
        test.cmp(belt.normalizeSpans(belt.stringDelimiterSpansForPositions(segls, array(array(5, 3)))), array(array(1, 3, 2), array(6, 3, 7)))
        
        segls = kseg.segls("\nnext = lines[ap[1]][ap[0]]\n")
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(26, 2))), array(array(20, 2, 21), array(26, 2, 27)))
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(27, 2))), array(array(20, 2, 21), array(26, 2, 27)))
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(28, 2))), array())
        
        segls = kseg.segls([[
s[2]
]])
        
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(6, 1))), array())
    end)
    
    -- ████████    ███████    ███████         ███████   ███████   ███       ███████
    -- ███   ███  ███   ███  ███             ███       ███   ███  ███      ███     
    -- ████████   ███   ███  ███████         ███       ███   ███  ███      ███████ 
    -- ███        ███   ███       ███        ███       ███   ███  ███           ███
    -- ███         ███████   ███████          ███████   ███████   ███████  ███████ 
    
    test("positionColumns", function()
        test.cmp(belt.positionColumns(array(array(1, 1), array(1, 2))), array(array(array(1, 1), array(1, 2))))
        test.cmp(belt.positionColumns(array(array(1, 1), array(1, 2), array(2, 2))), array(array(array(1, 1), array(1, 2)), array(array(2, 2))))
    end)
    
    test("indexOfExtremePositionInDirection", function()
        local posl = array(array(12, 3), array(4, 4), array(3, 6), array(10, 6), array(5, 7), array(13, 8), array(2, 11))
        test.cmp(belt.indexOfExtremePositionInDirection(posl, 'left'), 7)
        test.cmp(belt.indexOfExtremePositionInDirection(posl, 'down'), 7)
        test.cmp(belt.indexOfExtremePositionInDirection(posl, 'right'), 6)
        test.cmp(belt.indexOfExtremePositionInDirection(posl, 'up'), 1)
        
        posl = array(array(3, 3), array(3, 4), array(3, 5))
        test.cmp(belt.indexOfExtremePositionInDirection(posl, 'left', 1), 1)
        test.cmp(belt.indexOfExtremePositionInDirection(posl, 'left', 2), 2)
        
        test.cmp(belt.indexOfExtremePositionInDirection(posl, 'right', 1), 1)
        test.cmp(belt.indexOfExtremePositionInDirection(posl, 'right', 2), 2)
    end)
    end)