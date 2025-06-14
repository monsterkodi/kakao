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
        local l = belt.linesForText([[
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
        -- 
        -- belt.cellNeighborsAtPos(cells 0 0)∙map((n) -> ⮐  n.cell.char) ▸ ['0' '1' 'a' 'b']
    end)
    
    -- ▸ extendLineRangesToPosition 
    -- 
    --     lines = ['123' '45' '6']
    -- 
    --     belt.extendLineRangesFromPositionToPosition lines immutable([]) [0 0] [0 2] ▸ [[0 0 0 2]]
    --     belt.extendLineRangesFromPositionToPosition lines immutable([[0 0 1 0] [2 0 3 0]]) [1 1] [0 2] ▸ [[0 0 1 0] [2 0 3 0] [1 1 0 2]]
    
    --       000  000   000  00     00  00000000   
    --       000  000   000  000   000  000   000  
    --       000  000   000  000000000  00000000   
    -- 000   000  000   000  000 0 000  000        
    --  0000000    0000000   000   000  000        
    
    --▸ jumpDelta
    --    
    --    line = '1  '
    --    
    --    belt.jumpDelta line 0  1 ['empty'] ▸ 1
    --    belt.jumpDelta line 1  1 ['empty'] ▸ 1
    --    belt.jumpDelta line 2  1 ['empty'] ▸ 1
    --    belt.jumpDelta line 3  1 ['empty'] ▸ 1
    --    belt.jumpDelta line 4  1 ['empty'] ▸ 1
    --    
    --    line = '    a = b ->  '
    --    
    --    belt.jumpDelta line 0  1 ['ws'] ▸  4
    --    belt.jumpDelta line 1  1 ['ws'] ▸  3
    --    belt.jumpDelta line 2  1 ['ws'] ▸  2
    --    belt.jumpDelta line 3  1 ['ws'] ▸  1
    --    belt.jumpDelta line 4  1 ['ws'] ▸  1
    --    belt.jumpDelta line 5  1 ['ws'] ▸  1
    --    belt.jumpDelta line 6  1 ['ws'] ▸  1
    --    belt.jumpDelta line 7  1 ['ws'] ▸  1
    --    belt.jumpDelta line 8  1 ['ws'] ▸  1
    --    belt.jumpDelta line 9  1 ['ws'] ▸  1
    --    belt.jumpDelta line 10 1 ['ws'] ▸  1
    --    belt.jumpDelta line 11 1 ['ws'] ▸  1
    --    belt.jumpDelta line 12 1 ['ws'] ▸  2
    --           
    --    line = '  ab += cd ;;  '
    --    
    --    belt.jumpDelta line 0   1 ['word'] ▸  1
    --    belt.jumpDelta line 1   1 ['word'] ▸  1
    --    belt.jumpDelta line 2   1 ['word'] ▸  2
    --    belt.jumpDelta line 3   1 ['word'] ▸  1
    --    belt.jumpDelta line 4   1 ['word'] ▸  1
    --    belt.jumpDelta line 5   1 ['word'] ▸  1
    --    belt.jumpDelta line 6   1 ['word'] ▸  1
    --    belt.jumpDelta line 7   1 ['word'] ▸  1
    --    belt.jumpDelta line 8   1 ['word'] ▸  2
    --    belt.jumpDelta line 9   1 ['word'] ▸  1
    --    belt.jumpDelta line 10  1 ['word'] ▸  1
    --    belt.jumpDelta line 11  1 ['word'] ▸  1
    --    
    --    belt.jumpDelta line 0   1 ['punct'] ▸  1
    --    belt.jumpDelta line 1   1 ['punct'] ▸  1
    --    belt.jumpDelta line 2   1 ['punct'] ▸  1
    --    belt.jumpDelta line 3   1 ['punct'] ▸  1
    --    belt.jumpDelta line 4   1 ['punct'] ▸  1
    --    belt.jumpDelta line 5   1 ['punct'] ▸  2
    --    belt.jumpDelta line 6   1 ['punct'] ▸  1
    --    belt.jumpDelta line 7   1 ['punct'] ▸  1
    --    belt.jumpDelta line 8   1 ['punct'] ▸  1
    --    belt.jumpDelta line 9   1 ['punct'] ▸  1
    --    belt.jumpDelta line 10  1 ['punct'] ▸  1
    --    belt.jumpDelta line 11  1 ['punct'] ▸  2
    --    
    --    belt.jumpDelta line 0   1 ['ws' 'word' 'punct'] ▸  2
    --    belt.jumpDelta line 1   1 ['ws' 'word' 'punct'] ▸  1
    --    belt.jumpDelta line 2   1 ['ws' 'word' 'punct'] ▸  2
    --    belt.jumpDelta line 3   1 ['ws' 'word' 'punct'] ▸  1
    --    belt.jumpDelta line 4   1 ['ws' 'word' 'punct'] ▸  1
    --    belt.jumpDelta line 5   1 ['ws' 'word' 'punct'] ▸  2
    --    belt.jumpDelta line 6   1 ['ws' 'word' 'punct'] ▸  1
    --    belt.jumpDelta line 7   1 ['ws' 'word' 'punct'] ▸  1
    --    belt.jumpDelta line 8   1 ['ws' 'word' 'punct'] ▸  2
    --    belt.jumpDelta line 9   1 ['ws' 'word' 'punct'] ▸  1
    --    belt.jumpDelta line 10  1 ['ws' 'word' 'punct'] ▸  1
    --    belt.jumpDelta line 11  1 ['ws' 'word' 'punct'] ▸  2
    --    
    --    belt.jumpDelta line 0   -1 ['ws' 'word' 'punct'] ▸   0
    --    belt.jumpDelta line 1   -1 ['ws' 'word' 'punct'] ▸  -1
    --    belt.jumpDelta line 2   -1 ['ws' 'word' 'punct'] ▸  -2
    --    belt.jumpDelta line 3   -1 ['ws' 'word' 'punct'] ▸  -1
    --    belt.jumpDelta line 4   -1 ['ws' 'word' 'punct'] ▸  -2
    --    belt.jumpDelta line 5   -1 ['ws' 'word' 'punct'] ▸  -1
    --    belt.jumpDelta line 6   -1 ['ws' 'word' 'punct'] ▸  -1
    --    belt.jumpDelta line 7   -1 ['ws' 'word' 'punct'] ▸  -2
    --    belt.jumpDelta line 8   -1 ['ws' 'word' 'punct'] ▸  -1
    --    belt.jumpDelta line 9   -1 ['ws' 'word' 'punct'] ▸  -1
    --    belt.jumpDelta line 10  -1 ['ws' 'word' 'punct'] ▸  -2
    --    belt.jumpDelta line 11  -1 ['ws' 'word' 'punct'] ▸  -1
    --    
    --    line = '  '
    --    
    --    belt.jumpDelta line 5  -1 ['empty'] ▸ -3
    --    belt.jumpDelta line 4  -1 ['empty'] ▸ -2
    --    belt.jumpDelta line 3  -1 ['empty'] ▸ -1
    --    
    --    belt.jumpDelta line 5  -1 ['ws'] ▸ -1
    --    belt.jumpDelta line 4  -1 ['ws'] ▸ -1
    --    belt.jumpDelta line 3  -1 ['ws'] ▸ -1
    --    belt.jumpDelta line 2  -1 ['ws'] ▸ -2
    
    test("isPosInsideRange", function()
        test.cmp(belt.isPosInsideRange(array(0, 0), array(0, 0, 1, 0)), true)
        test.cmp(belt.isPosInsideRange(array(1, 0), array(0, 0, 1, 0)), true)
        test.cmp(belt.isPosInsideRange(array(0, 1), array(0, 0, 1, 0)), false)
        
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
        local lines = array('1234567890', '1234567890', '1234567890')
        
        test.cmp(belt.mergeLineRanges(lines, array(array(0, 0, 9, 9), array(1, 1, 2, 2))), array(array(0, 0, 9, 9)))
        test.cmp(belt.mergeLineRanges(lines, array(array(1, 1, 2, 2), array(0, 0, 9, 9))), array(array(0, 0, 9, 9)))
        test.cmp(belt.mergeLineRanges(lines, array(array(1, 1, 2, 2), array(0, 0, 9, 9), array(0, 0, 10, 0), array(0, 8, 9, 9))), array(array(0, 0, 9, 9)))
        
        test.cmp(belt.mergeLineRanges(lines, array(array(4, 0, 6, 0), array(8, 0, 10, 0))), array(array(4, 0, 6, 0), array(8, 0, 10, 0)))
        test.cmp(belt.mergeLineRanges(lines, array(array(4, 0, 6, 0), array(7, 0, 10, 0))), array(array(4, 0, 6, 0), array(7, 0, 10, 0)))
        test.cmp(belt.mergeLineRanges(lines, array(array(4, 0, 6, 0), array(6, 0, 10, 0))), array(array(4, 0, 10, 0)))
        test.cmp(belt.mergeLineRanges(lines, array(array(4, 0, 6, 0), array(5, 0, 10, 0))), array(array(4, 0, 10, 0)))
        
        test.cmp(belt.mergeLineRanges(lines, array(array(4, 1, 10, 1), array(0, 2, 4, 2))), array(array(4, 1, 4, 2)))
    end)
    
    test("rangeOfClosestWordToPos", function()
        local lines = array('1 2  3   4', '   ab ghij')
        
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(1, 1)), array(1, 1, 2, 1))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(2, 1)), array(3, 1, 4, 1))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(3, 1)), array(3, 1, 4, 1))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(4, 1)), array(3, 1, 4, 1))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(5, 1)), array(6, 1, 7, 1))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(6, 1)), array(6, 1, 7, 1))
        
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(1, 2)), array(4, 2, 6, 2))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(6, 2)), array(7, 2, 11, 2))
        test.cmp(belt.rangeOfClosestWordToPos(lines, array(7, 2)), array(7, 2, 11, 2))
    end)
    
    test("rangeOfWordOrWhitespaceLeftToPos", function()
        local lines = array('1 2  3   4', '   ab  ghij')
        local segls = kseg.segls(lines:join('\n'))
        
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(1, 1)), array(1, 1, 1, 1))
        test.cmp(belt.rangeOfWordOrWhitespaceLeftToPos(segls, array(2, 1)), array(1, 1, 2, 1))
        --belt.rangeOfWordOrWhitespaceLeftToPos segls [2 2] ▸ [1 2 2 2]
        --belt.rangeOfWordOrWhitespaceLeftToPos segls [4 2] ▸ [1 2 4 2]
        --        
        --segls = kseg.segls '  🧑🌾  ab🌾cde'
        --        
        --belt.rangeOfWordOrWhitespaceLeftToPos segls [2 1] ▸ [1 1 2 1]
        --belt.rangeOfWordOrWhitespaceLeftToPos segls [3 1] ▸ [1 1 3 1]
        --belt.rangeOfWordOrWhitespaceLeftToPos segls [4 1] ▸ [3 1 4 1]
        --belt.rangeOfWordOrWhitespaceLeftToPos segls [5 1] ▸ [3 1 4 1]
        --belt.rangeOfWordOrWhitespaceLeftToPos segls [6 1] ▸ [4 1 5 1]
        --belt.rangeOfWordOrWhitespaceLeftToPos segls [7 1] ▸ [4 1 5 1]
        --belt.rangeOfWordOrWhitespaceLeftToPos segls [8 1] ▸ [5 1 6 1]
        --belt.rangeOfWordOrWhitespaceLeftToPos segls [9 1] ▸ [5 1 7 1]
    end)
    
    test("chunkBeforePos", function()
        local segls = kseg.segls('\n1.4   x:z')
        
        test.cmp(belt.chunkBeforePos(segls, array(1, 1)), '')
        test.cmp(belt.chunkBeforePos(segls, array(2, 1)), '')
        test.cmp(belt.chunkBeforePos(segls, array(1, 2)), '')
        test.cmp(belt.chunkBeforePos(segls, array(2, 2)), '1')
        test.cmp(belt.chunkBeforePos(segls, array(4, 2)), '1.4')
        test.cmp(belt.chunkBeforePos(segls, array(6, 2)), '')
        -- belt.chunkBeforePos segls [10 2] ▸ 'x:z'
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
        local lines = array('', '124', 'abcdef')
        
        test.cmp(belt.isFullLineRange(lines, array(1, 1, 1, 2)), true)
        test.cmp(belt.isFullLineRange(lines, array(1, 1, 1, 1)), true)
        test.cmp(belt.isFullLineRange(lines, array(1, 2, 4, 2)), true)
        test.cmp(belt.isFullLineRange(lines, array(1, 2, 6, 2)), true)
        -- belt.isFullLineRange lines [1 2 3 2] ▸ false
        -- belt.isFullLineRange lines [2 2 4 2] ▸ false
    end)
    
    -- 0000000    000       0000000    0000000  000   000   0000000  
    -- 000   000  000      000   000  000       000  000   000       
    -- 0000000    000      000   000  000       0000000    0000000   
    -- 000   000  000      000   000  000       000  000        000  
    -- 0000000    0000000   0000000    0000000  000   000  0000000   
    
    test("lineIndicesForRangesAndPositions", function()
        test.cmp(belt.lineIndicesForRangesAndPositions(array(), array(array(1, 1), array(1, 2), array(1, 3))), array(1, 2, 3))
        -- belt.lineIndicesForRangesAndPositions [[ 0 0 2 0 ]] [[1 1] [1 2] [1 3]] ▸ [0 1 2 3]
        -- belt.lineIndicesForRangesAndPositions [[ 0 1 2 2 ]] [[1 6] [1 5] [1 4]] ▸ [1 2 4 5 6]
    end)
    
    test("linesIndicesForSpans", function()
        test.cmp(belt.lineIndicesForSpans(array()), array())
        -- belt.lineIndicesForSpans [[0 1 0]] ▸ [1]
        -- belt.lineIndicesForSpans [[0 1 0] [1 1 1]] ▸ [1]
    end)
    
    test("blockRangesForRangesAndPositions", function()
        local lines = kseg.segls([[
line 1
line 2
]])
        
        -- belt.blockRangesForRangesAndPositions lines [] [[1 1] [1 2]]    ▸ [[1 1 7 2]]
        --belt.blockRangesForRangesAndPositions lines [[1 1 6 2]] [[1 1]] ▸ [[1 1 7 2]]
        --belt.blockRangesForRangesAndPositions lines [[1 2 6 2]] [[1 1]] ▸ [[1 1 7 2]]
        
        --lines = kseg.segls """
        --    line 1
        --    line 2
        --    line 3
        --    line 4
        --    line 5
        --    line 6
        --    """
        --    
        --belt.blockRangesForRangesAndPositions lines [] [[1 1] [1 2] [1 3]] ▸ [[0 1 6 3]]
        --belt.blockRangesForRangesAndPositions lines [] [[6 5] [4 3] [2 1]] ▸ [[0 1 6 1] [0 3 6 3] [0 5 6 5]]
    end)
    
    --  0000000  00000000    0000000   000   000  
    -- 000       000   000  000   000  0000  000  
    -- 0000000   00000000   000000000  000 0 000  
    --      000  000        000   000  000  0000  
    -- 0000000   000        000   000  000   000  
    
    test("isSpanLineRange", function()
        local lines = array('', '124', 'abcdef')
        
        -- belt.isSpanLineRange lines [0 1 1 1] ▸ true
        -- belt.isSpanLineRange lines [0 0 0 0] ▸ false
        -- belt.isSpanLineRange lines [0 1 3 1] ▸ false
        -- belt.isSpanLineRange lines [1 1 1 2] ▸ false
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
        
        --spans = [[0 21 11] [2 22 11] [5 23 11] [7 24 11]] 
        --        
        --belt.nextSpanAfterPos spans [11 21] ▸ [2 22 11]
        --belt.nextSpanAfterPos spans [11 22] ▸ [5 23 11]
        --belt.nextSpanAfterPos spans [11 23] ▸ [7 24 11]
        --belt.nextSpanAfterPos spans [11 24] ▸ [0 21 11]
        --        
        --spans = [[2 1 5] [2 2 5] [2 3 5]]
        --        
        --belt.nextSpanAfterPos spans [5 2]   ▸ [2 3 5]
        --belt.nextSpanAfterPos spans [5 3]   ▸ [2 1 5]
        --belt.nextSpanAfterPos spans [5 1]   ▸ [2 2 5]
        --        
        --spans = [[1 4 3] [3 4 5]]
        --        
        --belt.nextSpanAfterPos spans [0 0] ▸ [1 4 3]
        --belt.nextSpanAfterPos spans [3 4] ▸ [3 4 5]
        --belt.nextSpanAfterPos spans [5 4] ▸ [1 4 3]
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
    
    -- ▸ normalizePositions
    
    
        -- belt.normalizePositions [[1 1] [2 1] [3 1]]     ▸ [[1 1] [2 1] [3 1]]
        -- belt.normalizePositions [[1 0] [2 0] [0 0]]     ▸ [[0 0] [1 0] [2 0]]
        -- belt.normalizePositions [[1 0] [2 0] [1 0]]     ▸ [[1 0] [2 0]]
        -- belt.normalizePositions [[2 2] [3 3] [1 1]]     ▸ [[1 1] [2 2] [3 3]]
        -- belt.normalizePositions [[2 2] [0 3] [11 1]]    ▸ [[11 1] [2 2] [0 3]]
    
    test("lineRangeAtPos", function()
        local lines = belt.seglsForText([[
🌾🧑
]])
        
        -- belt.lineRangeAtPos lines [1 1] ▸ [1 1 5 1]
    end)
    
    test("seglRangeAtPos", function()
        local lines = belt.seglsForText([[
🧑🌾
]])
        
        -- belt.seglRangeAtPos lines [1 1] ▸ [1 1 3 1]
    end)
    
    test("lineRangesInRange", function()
        local lines = belt.seglsForText([[
1

12
abc
]])
        
        -- belt.lineRangesInRange lines [1 1 1 3] ▸ [[1 1 2 1] [1 2 1 2] [1 3 3 3]]
    end)
    
    test("splitLineRanges", function()
        local lines = belt.linesForText([[
1

12
abc
]])
        
        -- belt.splitLineRanges lines [[1 1 2 3]] ▸ [[1 1 2 1] [1 2 1 2] [1 3 2 3]]
        -- belt.splitLineRanges lines [[1 3 2 3] [3 3 4 3]] ▸ [[1 3 2 3] [3 3 4 3]]
    end)
    
    test("seglsForText", function()
        local segls = belt.seglsForText([[
123
456

abc
def
]])
        
        -- segls ▸ [['1' '2' '3'] ['4' '5' '6'] [] ['a' 'b' 'c'] ['d' 'e' 'f']]    
        
        -- belt.seglsForRange segls [1 1 4 5] ▸ [['1' '2' '3'] ['4' '5' '6'] [] ['a' 'b' 'c'] ['d' 'e' 'f']]
        -- belt.seglsForRange segls [1 1 1 1] ▸ [[]]
        -- belt.seglsForRange segls [1 1 2 1] ▸ [['1']]
        -- belt.seglsForRange segls [4 1 1 2] ▸ [[] []]
        -- belt.seglsForRange segls [4 1 2 2] ▸ [[] ['4']]
    end)
    
    test("rangesForLinesSplitAtPositions ", function()
        local lines = belt.linesForText([[
123
456

abc
def
]])
        
        --belt.rangesForLinesSplitAtPositions lines []      ▸ []
        --belt.rangesForLinesSplitAtPositions lines [[1 1]] ▸ [[1 1 1 1] [1 1 4 5]]
        --belt.rangesForLinesSplitAtPositions lines [[2 1]] ▸ [[1 1 2 1] [2 1 4 5]]
        --belt.rangesForLinesSplitAtPositions lines [[1 3]] ▸ [[1 1 1 3] [1 3 4 5]]
        --        
        --belt.rangesForLinesSplitAtPositions lines [[1 1] [2 1]] ▸ [[1 1 1 1] [1 1 2 1] [2 1 4 5]]
        --belt.rangesForLinesSplitAtPositions lines [[4 1] [4 2]] ▸ [[1 1 4 1] [4 1 4 2] [4 2 4 5]]
        --        
        --belt.rangesForLinesSplitAtPositions lines [[1 6]] ▸ [[1 1 4 5] [4 5 4 5]]
    end)
    
    --▸ rangesOfStringsInText
    --    
    --    belt.rangesOfStringsInText "hello" ▸ []
    --    belt.rangesOfStringsInText "he'll'o" ▸ [[3 1 7 1]]
    
    test("widthOfLines", function()
        --       12345678901234567890123456789012345678901234567890 
        local text = "ｔｈｅ　ｑｕｉｃｋ　ｂｒｏｗｎ　ｆｏｘ　ｊｕｍｐｓ"
        local lines = belt.linesForText(text)
        
        test.cmp(belt.widthOfLines(lines), 50)
    end)
    
    -- ████████   ███   ███   ███████        ███  ███   ███       ███████  █████████  ████████   
    -- ███   ███  ████  ███  ███             ███  ████  ███      ███          ███     ███   ███  
    -- ███████    ███ █ ███  ███  ████       ███  ███ █ ███      ███████      ███     ███████    
    -- ███   ███  ███  ████  ███   ███       ███  ███  ████           ███     ███     ███   ███  
    -- ███   ███  ███   ███   ███████        ███  ███   ███      ███████      ███     ███   ███  
    
    test("isRangeInString", function()
        local lines = belt.linesForText([[
123
'456'

'abc'
def
]])
        
        -- belt.isRangeInString lines [1 1 1 1] ▸ false
        -- belt.isRangeInString lines [1 3 1 3] ▸ false
        -- belt.isRangeInString lines [1 4 1 4] ▸ false
        -- belt.isRangeInString lines [2 4 6 4] ▸ false
        -- belt.isRangeInString lines [2 2 2 2] ▸ true
        -- belt.isRangeInString lines [2 4 3 4] ▸ true
        -- belt.isRangeInString lines [2 4 4 4] ▸ true
        -- belt.isRangeInString lines [2 4 5 4] ▸ true
    end)
    
    --  ███████  ███   ███  ████████   ████████    ███████   ███   ███  ███   ███  ███████  
    -- ███       ███   ███  ███   ███  ███   ███  ███   ███  ███   ███  ████  ███  ███   ███
    -- ███████   ███   ███  ███████    ███████    ███   ███  ███   ███  ███ █ ███  ███   ███
    --      ███  ███   ███  ███   ███  ███   ███  ███   ███  ███   ███  ███  ████  ███   ███
    -- ███████    ███████   ███   ███  ███   ███   ███████    ███████   ███   ███  ███████  
    
    test("rangesOfPairsSurroundingPositions", function()
        local lines = belt.linesForText([[
01234567

'45""6'
'a#\{\}c'
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
        local lines = belt.linesForText([[
01234567

'45""6'
'a#\{\}c'
[{([])}]
]])
        
        local posl = array(array(5, 1), array(5, 2), array(5, 3), array(5, 4), array(5, 5))
        
        --belt.rangesOfNestedPairsAtPositions lines posl ▸ [
        --    [1 3 7 3] 
        --    [1 4 7 4] 
        --    [1 5 8 5] [2 5 7 5] [3 5 6 5] [4 5 5 5]
        --]
    end)
    
    test("spansOfNestedPairsAtPositions", function()
        local lines = belt.linesForText([[
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
        
        -- belt.openCloseSpansForPositions segls [[1 1]] ▸ [[1 1 2] [8 1 9]]
        -- belt.openCloseSpansForPositions segls [[2 1]] ▸ [[2 1 3] [7 1 8]]
        -- belt.openCloseSpansForPositions segls [[3 1]] ▸ [[3 1 4] [6 1 7]]
        -- belt.openCloseSpansForPositions segls [[4 1]] ▸ [[4 1 5] [5 1 6]]
        -- belt.openCloseSpansForPositions segls [[5 1]] ▸ [[4 1 5] [5 1 6]]
        -- belt.openCloseSpansForPositions segls [[6 1]] ▸ [[3 1 4] [6 1 7]]
        -- belt.openCloseSpansForPositions segls [[7 1]] ▸ [[2 1 3] [7 1 8]]
        -- belt.openCloseSpansForPositions segls [[8 1]] ▸ [[1 1 2] [8 1 9]]
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(9, 1))), array())
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(1, 2))), array())
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(7, 2))), array())
        
        -- belt.stringDelimiterSpansForPositions segls [[1 2]] ▸ [[1 2 2] [7 2 8]]
        -- belt.stringDelimiterSpansForPositions segls [[7 2]] ▸ [[1 2 2] [7 2 8]]
        
        -- belt.normalizeSpans belt.openCloseSpansForPositions(segls [[3 3]]) ▸ [[3 3 4] [4 3 5]]
        -- belt.normalizeSpans belt.openCloseSpansForPositions(segls [[4 3]]) ▸ [[3 3 4] [4 3 5]]
        test.cmp(belt.normalizeSpans(belt.openCloseSpansForPositions(segls, array(array(5, 3)))), array())
        
        -- belt.normalizeSpans belt.stringDelimiterSpansForPositions(segls [[3 3]]) ▸ [[1 3 2] [6 3 7]]
        -- belt.normalizeSpans belt.stringDelimiterSpansForPositions(segls [[4 3]]) ▸ [[1 3 2] [6 3 7]]
        -- belt.normalizeSpans belt.stringDelimiterSpansForPositions(segls [[5 3]]) ▸ [[1 3 2] [6 3 7]]
        
        segls = kseg.segls("\nnext = lines[ap[1]][ap[0]]\n")
        
        -- belt.openCloseSpansForPositions segls [[26 1]] ▸ [[20 1 21] [26 1 27]]
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(27, 1))), array())
        
        segls = kseg.segls([[
s[2]
]])
        
        test.cmp(belt.openCloseSpansForPositions(segls, array(array(5, 1))), array())
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