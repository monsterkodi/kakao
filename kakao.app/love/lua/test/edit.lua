--[[
00000000  0000000    000  000000000
000       000   000  000     000   
0000000   000   000  000     000   
000       000   000  000     000   
00000000  0000000    000     000   
--]]

-- use ../../kxk    ▪ kseg immutable
-- use ../edit/tool ◆ belt

test("tool edit", function()
    -- █████████   ███████    ███████    ███████   ███      ████████   ███████   ███████   ██     ██  ██     ██  ████████  ███   ███  █████████
    --    ███     ███   ███  ███        ███        ███      ███       ███       ███   ███  ███   ███  ███   ███  ███       ████  ███     ███   
    --    ███     ███   ███  ███  ████  ███  ████  ███      ███████   ███       ███   ███  █████████  █████████  ███████   ███ █ ███     ███   
    --    ███     ███   ███  ███   ███  ███   ███  ███      ███       ███       ███   ███  ███ █ ███  ███ █ ███  ███       ███  ████     ███   
    --    ███      ███████    ███████    ███████   ███████  ████████   ███████   ███████   ███   ███  ███   ███  ████████  ███   ███     ███   
    
    test("toggleCommentTypesInLineRangesAtIndices", function()
        local lines = belt.seglsForText([[
code = true
# comment
# a
code = 'yes' # trailing
]])
        
        local result = belt.seglsForText([[
code = true
###
comment
a
###
code = 'yes' # trailing
]])
        
        -- belt.toggleCommentTypesInLineRangesAtIndices lines [] [0 1] [1] ▸ [result [] [0 1]]
    end)
    
    -- 0000000    00000000  000      00000000  000000000  00000000  000      000  000   000  00000000   0000000  
    -- 000   000  000       000      000          000     000       000      000  0000  000  000       000       
    -- 000   000  0000000   000      0000000      000     0000000   000      000  000 0 000  0000000   0000000   
    -- 000   000  000       000      000          000     000       000      000  000  0000  000            000  
    -- 0000000    00000000  0000000  00000000     000     00000000  0000000  000  000   000  00000000  0000000   
    
    test("deleteLineRangesAndAdjustPositions", function()
        local lines = belt.seglsForText([[
1234567890
abcdefghij
]])
        
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(5, 0, 5, 0)), array(array(5, 1))), array(lines, array(array(5, 1))))
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(5, 0, 6, 0)), array(array(5, 1))), array(array(kseg('123457890'), kseg('abcdefghij')), array(array(5, 1))))
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(5, 0, 5, 1)), array(array(5, 1))), array(array(kseg('12345fghij')), array(array(5, 0))))
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(0, 1, 1, 1)), array(array(0, 1))), array(array(kseg('1234567890'), kseg('bcdefghij')), array(array(0, 1))))
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(5, 0, 3, 1)), array(array(3, 1))), array(array(kseg('12345defghij')), array(array(5, 0))))
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(3, 0, 5, 1)), array(array(3, 1))), array(array(kseg('123fghij')), array(array(3, 0))))
        
        lines = belt.seglsForText([[
line 1
line 2
line 3
]])
        
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(0, 0, 6, 1)), array(array(6, 0), array(6, 1))), array(array(kseg('line 3')), array(array(0, 0))))
    end)
    
    -- 000  000   000   0000000  00000000  00000000   000000000  
    -- 000  0000  000  000       000       000   000     000     
    -- 000  000 0 000  0000000   0000000   0000000       000     
    -- 000  000  0000       000  000       000   000     000     
    -- 000  000   000  0000000   00000000  000   000     000     
    
    test("insertTextAtPositions", function()
        test("single spans", function()
            local lines = belt.seglsForText
            
                [[
line 1
line 2
]]
            
            test.cmp(belt.insertTextAtPositions(lines, '', array(array(0, 0))), array(kseg.segls('line 1\nline 2'), array(array(0, 0))))
            test.cmp(belt.insertTextAtPositions(lines, 'a ', array(array(0, 0))), array(kseg.segls('a line 1\nline 2'), array(array(2, 0))))
            test.cmp(belt.insertTextAtPositions(lines, 'a ', array(array(0, 0), array(0, 1))), array(kseg.segls('a line 1\na line 2'), array(array(2, 0), array(2, 1))))
            
            test.cmp(belt.insertTextAtPositions(lines, 'x', array(array(0, 0), array(2, 0))), array(kseg.segls('xlixne 1\nline 2'), array(array(1, 0), array(4, 0))))
            test.cmp(belt.insertTextAtPositions(lines, 'x', array(array(0, 0), array(2, 0), array(6, 0))), array(kseg.segls('xlixne 1x\nline 2'), array(array(1, 0), array(4, 0), array(9, 0))))
            test.cmp(belt.insertTextAtPositions(lines, 'z', array(array(0, 0), array(2, 0), array(6, 0), array(1, 1), array(2, 1), array(4, 1))), array(kseg.segls('zlizne 1z\nlziznez 2'), array(array(1, 0), array(4, 0), array(9, 0), array(2, 1), array(4, 1), array(7, 1))))
            
            test.cmp(belt.insertTextAtPositions(lines, 'ｔ', array(array(0, 0))), array(kseg.segls('ｔline 1\nline 2'), array(array(2, 0))))
            test.cmp(belt.insertTextAtPositions(kseg.segls('ｔline 1\nline 2'), 'ｔ', array(array(2, 0))), array(kseg.segls('ｔｔline 1\nline 2'), array(array(4, 0))))
    end)
        
        test("multiple lines into single cursor", function()
            local lines = belt.seglsForText
            
                [[
line 1
line 2
]]
            
            test.cmp(belt.insertTextAtPositions(lines, 'a\nb', array(array(0, 0))), array(kseg.segls('a\nb\nline 1\nline 2'), array(array(0, 2))))
            test.cmp(belt.insertTextAtPositions(lines, 'a\nb', array(array(2, 0))), array(kseg.segls('lia\nbne 1\nline 2'), array(array(1, 1))))
            test.cmp(belt.insertTextAtPositions(lines, 'a\nb', array(array(0, 1))), array(kseg.segls('line 1\na\nb\nline 2'), array(array(0, 3))))
            
            test.cmp(belt.insertTextAtPositions(lines, 'a\n', array(array(0, 1))), array(kseg.segls('line 1\na\nline 2'), array(array(0, 2))))
    end)
        
        test("multiple lines into multi cursor", function()
            local lines = belt.seglsForText
            
                [[
1234
5678
]]
            
            test.cmp(belt.insertTextAtPositions(lines, 'X\nY', array(array(0, 0), array(0, 1))), array(kseg.segls('X1234\nY5678'), array(array(1, 0), array(1, 1))))
            test.cmp(belt.insertTextAtPositions(lines, 'X\nY', array(array(0, 0), array(1, 0), array(2, 0), array(3, 0))), array(kseg.segls('X1Y2X3Y4\n5678'), array(array(1, 0), array(3, 0), array(5, 0), array(7, 0))))
            test.cmp(belt.insertTextAtPositions(lines, '@\n$\n%', array(array(0, 0), array(1, 0), array(2, 0), array(3, 0))), array(kseg.segls('@1$2%3@4\n5678'), array(array(1, 0), array(3, 0), array(5, 0), array(7, 0))))
    end)
        
        test("newlines", function()
            local lines = belt.seglsForText
            
                [[
line 1
line 2
]]
            
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(2, 0))), array(kseg.segls('li\nne 1\nline 2'), array(array(0, 1))))
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(6, 0))), array(kseg.segls('line 1\n\nline 2'), array(array(0, 1))))
            
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(0, 1))), array(kseg.segls('line 1\n\nline 2'), array(array(0, 2))))
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(2, 1))), array(kseg.segls('line 1\nli\nne 2'), array(array(0, 2))))
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(6, 1))), array(kseg.segls('line 1\nline 2\n'), array(array(0, 2))))
            
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(0, 0), array(0, 1))), array(kseg.segls('\nline 1\n\nline 2'), array(array(0, 1), array(0, 3))))
            
            lines = belt.seglsForText
            
                [[ 
◆1
◆2
◆3
◆4
]]
            
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(1, 0), array(1, 1), array(1, 2), array(1, 3))), array(kseg.segls('◆\n1\n◆\n2\n◆\n3\n◆\n4'), array(array(0, 1), array(0, 3), array(0, 5), array(0, 7))))
    end)
        
        test("into indented lines", function()
            local lines = belt.seglsForText
            
                [[ 
◆1
    ◆2
        ◆3
]]
            
            test("single span ", function()
                test.cmp(belt.insertTextAtPositions(lines, '~!', array(array(4, 1))), array(kseg.segls('◆1\n    ~!◆2\n        ◆3'), array(array(6, 1))))
                test.cmp(belt.insertTextAtPositions(lines, '#{', array(array(2, 2))), array(kseg.segls('◆1\n    ◆2\n  #{      ◆3'), array(array(4, 2))))
    end)
            
            test("newline into single cursor", function()
                test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(4, 1))), array(kseg.segls('◆1\n    \n    ◆2\n        ◆3'), array(array(4, 2))))
    end)
            
            test("multiple lines into single cursor", function()
                test.cmp(belt.insertTextAtPositions(lines, 'a\nb', array(array(4, 1))), array(kseg.segls('◆1\n    a\n    b\n    ◆2\n        ◆3'), array(array(4, 3))))
    end)
    end)
    end)
    
    --  ███████  ███   ███  ████████   ████████    ███████   ███   ███  ███   ███  ███████  
    -- ███       ███   ███  ███   ███  ███   ███  ███   ███  ███   ███  ████  ███  ███   ███
    -- ███████   ███   ███  ███████    ███████    ███   ███  ███   ███  ███ █ ███  ███   ███
    --      ███  ███   ███  ███   ███  ███   ███  ███   ███  ███   ███  ███  ████  ███   ███
    -- ███████    ███████   ███   ███  ███   ███   ███████    ███████   ███   ███  ███████  
    
    test("insertSurroundAtRanges", function()
        local lines = belt.seglsForText([[ 
line1
line2
]])
        
        test.cmp(belt.insertSurroundAtRanges(lines, array(array(1, 0, 3, 0)), '}', array('{', '}')), array(kseg.segls('l{in}e1\nline2'), array(array(5, 0))))
        test.cmp(belt.insertSurroundAtRanges(lines, array(array(1, 0, 3, 0), array(1, 1, 3, 1)), ']', array('[', ']')), array(kseg.segls('l[in]e1\nl[in]e2'), array(array(5, 0), array(5, 1))))
        
        test.cmp(belt.insertSurroundAtRanges(lines, array(array(1, 0, 3, 0)), '{', array('{', '}')), array(kseg.segls('l{in}e1\nline2'), array(array(2, 0))))
        test.cmp(belt.insertSurroundAtRanges(lines, array(array(1, 0, 3, 0), array(1, 1, 3, 1)), '[', array('[', ']')), array(kseg.segls('l[in]e1\nl[in]e2'), array(array(2, 0), array(2, 1))))
        
        test.cmp(belt.insertSurroundAtRanges(lines, array(array(1, 0, 3, 0)), '"', array('"', '"')), array(kseg.segls('l"in"e1\nline2'), array(array(5, 0))))
        test.cmp(belt.insertSurroundAtRanges(lines, array(array(1, 0, 3, 0), array(1, 1, 3, 1)), '"', array('"', '"')), array(kseg.segls('l"in"e1\nl"in"e2'), array(array(5, 0), array(5, 1))))
        
        test.cmp(belt.insertSurroundAtRanges(lines, array(array(1, 0, 3, 0)), "}", array('#{', '}')), array(kseg.segls("l\#{in}e1\nline2"), array(array(6, 0))))
        test.cmp(belt.insertSurroundAtRanges(lines, array(array(1, 0, 3, 0)), "#", array('#{', '}')), array(kseg.segls("l\#{in}e1\nline2"), array(array(3, 0))))
        test.cmp(belt.insertSurroundAtRanges(lines, array(array(1, 0, 3, 0), array(1, 1, 3, 1)), '"', array('"', '"')), array(kseg.segls('l"in"e1\nl"in"e2'), array(array(5, 0), array(5, 1))))
    end)
    
    -- 00     00   0000000   000   000  00000000  000      000  000   000  00000000   0000000  
    -- 000   000  000   000  000   000  000       000      000  0000  000  000       000       
    -- 000000000  000   000   000 000   0000000   000      000  000 0 000  0000000   0000000   
    -- 000 0 000  000   000     000     000       000      000  000  0000  000            000  
    -- 000   000   0000000       0      00000000  0000000  000  000   000  00000000  0000000   
    
    test("moveLineRangesAndPositionsAtIndicesInDirection", function()
        local lines = immutable(array('a', 'b', 'c'))
        local rngs = immutable(array())
        local posl = immutable(array())
        
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, posl, array(1), 'down'), array(array('a', 'c', 'b'), array(), array()))
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, posl, array(2), 'down'), array(array('a', 'b', 'c'), array(), array()))
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, posl, array(1, 2), 'down'), array(array('a', 'b', 'c'), array(), array()))
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, posl, array(0, 2), 'down'), array(array('a', 'b', 'c'), array(), array()))
        
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, posl, array(1), 'up'), array(array('b', 'a', 'c'), array(), array()))
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, posl, array(2), 'up'), array(array('a', 'c', 'b'), array(), array()))
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, posl, array(1, 2), 'up'), array(array('b', 'c', 'a'), array(), array()))
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, posl, array(0, 2), 'up'), array(array('a', 'b', 'c'), array(), array()))
        
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, immutable(array(array(0, 1))), array(1), 'down'), array(array('a', 'c', 'b'), array(), array(array(0, 2))))
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, immutable(array(array(0, 1), array(1, 1))), array(1), 'down'), array(array('a', 'c', 'b'), array(), array(array(0, 2), array(1, 2))))
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, immutable(array(array(0, 1), array(1, 1))), array(1), 'down'), array(array('a', 'c', 'b'), array(), array(array(0, 2), array(1, 2))))
        
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, immutable(array(array(0, 1))), array(1), 'up'), array(array('b', 'a', 'c'), array(), array(array(0, 0))))
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, immutable(array(array(0, 1), array(1, 1))), array(1), 'up'), array(array('b', 'a', 'c'), array(), array(array(0, 0), array(1, 0))))
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, immutable(array(array(0, 1), array(1, 1))), array(1), 'up'), array(array('b', 'a', 'c'), array(), array(array(0, 0), array(1, 0))))
        
        lines = immutable(array('a', 'b', 'c', 'd', 'e'))
        
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, immutable(array(array(0, 1), array(0, 2), array(0, 3))), array(1, 2, 3), 'up'), array(array('b', 'c', 'd', 'a', 'e'), array(), array(array(0, 0), array(0, 1), array(0, 2))))
        test.cmp(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines, rngs, immutable(array(array(0, 1), array(0, 2), array(0, 3))), array(1, 2, 3), 'down'), array(array('a', 'e', 'b', 'c', 'd'), array(), array(array(0, 2), array(0, 3), array(0, 4))))
    end)
    
    --  0000000   0000000   00     00  00000000   000      00000000  000000000  000   0000000   000   000  
    -- 000       000   000  000   000  000   000  000      000          000     000  000   000  0000  000  
    -- 000       000   000  000000000  00000000   000      0000000      000     000  000   000  000 0 000  
    -- 000       000   000  000 0 000  000        000      000          000     000  000   000  000  0000  
    --  0000000   0000000   000   000  000        0000000  00000000     000     000   0000000   000   000  
    
    test("prepareWordsForCompletion", function()
        local words = belt.linesForText([[
    Alice
    Alice!
    Alice!"
    Alice)--
    Alice,
    Alice,)
    Alice.
    Alice:
    Alice;
    Alice’s
    Alice’s,
]])
        
        test.cmp(belt.prepareWordsForCompletion('A', 'A', words), array('Alice'))
        test.cmp(belt.prepareWordsForCompletion('"', '"', array('"#fff"')), array('"#fff"'))
        test.cmp(belt.prepareWordsForCompletion('f', 'f', array('func()')), array('func', 'func()'))
        test.cmp(belt.prepareWordsForCompletion('fa', 'fa', array('f')), array())
        test.cmp(belt.prepareWordsForCompletion('w', 'w', array('word[@turd.length..]')), array('word', 'word[@turd.length..]'))
        test.cmp(belt.prepareWordsForCompletion('a.b', 'b', array('a.b.c.d')), array())
        test.cmp(belt.prepareWordsForCompletion('a.b.', '.', array('a.b.c.d')), array('.b', '.c', '.d'))
        test.cmp(belt.prepareWordsForCompletion('a.b.c', 'c', array('a.b.c.d')), array())
        test.cmp(belt.prepareWordsForCompletion('a.b.c.', '.', array('a.b.c.d')), array('.b', '.c', '.d'))
        test.cmp(belt.prepareWordsForCompletion('word', 'word', array('word[@turd.length..]')), array())
        test.cmp(belt.prepareWordsForCompletion('k', 'k', array('kseg', 'key')), array('key', 'kseg'))
        test.cmp(belt.prepareWordsForCompletion('he', 'he', array('hello', 'hell')), array('hell', 'hello'))
        test.cmp(belt.prepareWordsForCompletion('he', 'he', array('"hello"', '@hell')), array('hell', 'hello'))
        test.cmp(belt.prepareWordsForCompletion('a.', '.', array('0.1', '1.234', 'obj.prop')), array('.prop'))
        test.cmp(belt.prepareWordsForCompletion('0.', '.', array('0.1', '1.234', 'obj.prop')), array('.1'))
        test.cmp(belt.prepareWordsForCompletion('3.1', '1', array('1.123', '1.234', 'obj.prop')), array())
        test.cmp(belt.prepareWordsForCompletion('rugga', 'r', array('rofl', 'rug')), array('rofl', 'rug'))
        test.cmp(belt.prepareWordsForCompletion('rugga', 'ru', array('rug')), array('rug'))
        test.cmp(belt.prepareWordsForCompletion('mc', 'mc', array('mc[0]', 'mc[1]')), array())
        test.cmp(belt.prepareWordsForCompletion('@', '@', array('@color.dot)')), array('@color', '@color.dot'))
        test.cmp(belt.prepareWordsForCompletion('@', '@', array("@side='left")), array('@side'))
        test.cmp(belt.prepareWordsForCompletion('@', '@', array("@side='left'")), array('@side'))
        test.cmp(belt.prepareWordsForCompletion('b', 'b', array('a\n', 'b\n')), array())
        test.cmp(belt.prepareWordsForCompletion('@img.pop', 'pop', array('@img.pop()')), array('pop()'))
    end)
    
    -- ███  ███   ███  ███████    ████████  ███   ███  █████████
    -- ███  ████  ███  ███   ███  ███       ████  ███     ███   
    -- ███  ███ █ ███  ███   ███  ███████   ███ █ ███     ███   
    -- ███  ███  ████  ███   ███  ███       ███  ████     ███   
    -- ███  ███   ███  ███████    ████████  ███   ███     ███   
    
    test("indentLineRangesAndPositionsAtIndices", function()
        local lines = belt.seglsForText
        
            [[ 
◆1
    ◆2
        ◆3
]]
        
        local posl = immutable(array(array(0, 0, 1, 1)))
        local rngs = immutable(array(array(0, 1), array(1, 1)))
        test.cmp(belt.indentLineRangesAndPositionsAtIndices(lines, posl, rngs, array(0, 1)), array(array(kseg('    ◆1'), kseg('        ◆2'), kseg('        ◆3')), array(array(4, 0, 5, 1)), array(array(4, 1), array(5, 1))))
    end)
    
    test("deindentLineRangesAndPositionsAtIndices", function()
        local lines = belt.seglsForText
        
            [[ 
◆1
    ◆2
        ◆3
]]
        
        local posl = immutable(array(array(0, 1, 1, 2)))
        local rngs = immutable(array(array(0, 1), array(1, 2)))
        test.cmp(belt.deindentLineRangesAndPositionsAtIndices(lines, posl, rngs, array(1, 2)), array(array(kseg('◆1'), kseg('◆2'), kseg('    ◆3')), array(array(0, 1, 0, 2)), array(array(0, 1), array(0, 2))))
    end)
    end)