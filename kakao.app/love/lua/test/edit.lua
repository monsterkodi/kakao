--[[
00000000  0000000    000  000000000
000       000   000  000     000   
0000000   000   000  000     000   
000       000   000  000     000   
00000000  0000000    000     000   
--]]

kxk = require "kxk.kxk"
belt = require "edit.tool.belt"

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
abcdefghij]])
        
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(6, 1, 6, 1)), array(array(6, 2))), lines, array(array(5, 1)))
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(6, 1, 7, 1)), array(array(6, 2))), array(kseg('123457890'), kseg('abcdefghij')), array(array(5, 1)))
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(6, 1, 6, 2)), array(array(6, 2))), array(kseg('12345fghij')), array(array(6, 1)))
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(1, 2, 2, 2)), array(array(1, 2))), array(kseg('1234567890'), kseg('bcdefghij')), array(array(0, 1)))
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(6, 1, 4, 2)), array(array(4, 2))), array(kseg('12345defghij')), array(array(5, 0)))
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(4, 1, 6, 2)), array(array(4, 2))), array(kseg('123fghij')), array(array(3, 0)))
        
        lines = belt.seglsForText([[
line 1
line 2
line 3]])
        
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(1, 1, 7, 2)), array(array(7, 1), array(7, 2))), array(kseg(), kseg('line 3')), array(array(1, 1)))
        test.cmp(belt.deleteLineRangesAndAdjustPositions(lines, array(array(1, 1, 1, 3)), array(array(7, 1), array(7, 2))), array(kseg('line 3')), array(array(1, 1)))
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
line 2]]
            
            test.cmp(belt.insertTextAtPositions(lines, '', array(array(1, 1))), kseg.segls('line 1\nline 2'), array(array(1, 1)))
            test.cmp(belt.insertTextAtPositions(lines, 'X', array(array(1, 1))), kseg.segls('Xline 1\nline 2'), array(array(2, 1)))
            test.cmp(belt.insertTextAtPositions(lines, 'a ', array(array(1, 1), array(1, 2))), kseg.segls('a line 1\na line 2'), array(array(3, 1), array(3, 2)))
            
            test.cmp(belt.insertTextAtPositions(lines, 'x', array(array(1, 1), array(3, 1))), kseg.segls('xlixne 1\nline 2'), array(array(2, 1), array(5, 1)))
            test.cmp(belt.insertTextAtPositions(lines, 'x', array(array(1, 1), array(3, 1), array(7, 1))), kseg.segls('xlixne 1x\nline 2'), array(array(2, 1), array(5, 1), array(10, 1)))
            test.cmp(belt.insertTextAtPositions(lines, 'z', array(array(1, 1), array(3, 1), array(7, 1), array(2, 2), array(3, 2), array(5, 2))), kseg.segls('zlizne 1z\nlziznez 2'), array(array(2, 1), array(5, 1), array(10, 1), array(3, 2), array(5, 2), array(8, 2)))
            
            test.cmp(belt.insertTextAtPositions(lines, 'ｔ', array(array(1, 1))), kseg.segls('ｔline 1\nline 2'), array(array(3, 1)))
            test.cmp(belt.insertTextAtPositions(kseg.segls('ｔline 1\nline 2'), 'ｔ', array(array(3, 1))), kseg.segls('ｔｔline 1\nline 2'), array(array(5, 1)))
    end)
        
        test("multiple lines into single cursor", function()
            local lines = belt.seglsForText
            
                [[
line 1
line 2]]
            
            test.cmp(belt.insertTextAtPositions(lines, 'a\nb', array(array(1, 1))), kseg.segls('a\nb\nline 1\nline 2'), array(array(1, 3)))
            test.cmp(belt.insertTextAtPositions(lines, 'a\nb', array(array(3, 1))), kseg.segls('lia\nbne 1\nline 2'), array(array(2, 2)))
            test.cmp(belt.insertTextAtPositions(lines, 'a\nb', array(array(1, 2))), kseg.segls('line 1\na\nb\nline 2'), array(array(1, 4)))
            test.cmp(belt.insertTextAtPositions(lines, 'a\n', array(array(1, 2))), kseg.segls('line 1\na\nline 2'), array(array(1, 3)))
    end)
        
        test("multiple lines into multi cursor", function()
            local lines = belt.seglsForText
            
                [[
1234
5678]]
            
            test.cmp(belt.insertTextAtPositions(lines, 'X\nY', array(array(1, 1), array(1, 2))), kseg.segls('X1234\nY5678'), array(array(2, 1), array(2, 2)))
            test.cmp(belt.insertTextAtPositions(lines, 'X\nY', array(array(1, 1), array(2, 1), array(3, 1), array(4, 1))), kseg.segls('X1Y2X3Y4\n5678'), array(array(2, 1), array(4, 1), array(6, 1), array(8, 1)))
            test.cmp(belt.insertTextAtPositions(lines, '@\n$\n%', array(array(1, 1), array(2, 1), array(3, 1), array(4, 1))), kseg.segls('@1$2%3@4\n5678'), array(array(2, 1), array(4, 1), array(6, 1), array(8, 1)))
    end)
        
        test("newlines", function()
            local lines = belt.seglsForText
            
                [[
line 1
line 2]]
            
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(3, 1))), kseg.segls('li\nne 1\nline 2'), array(array(1, 2)))
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(7, 1))), kseg.segls('line 1\n\nline 2'), array(array(1, 2)))
            
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(1, 2))), kseg.segls('line 1\n\nline 2'), array(array(1, 3)))
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(3, 2))), kseg.segls('line 1\nli\nne 2'), array(array(1, 3)))
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(7, 2))), kseg.segls('line 1\nline 2\n'), array(array(1, 3)))
            
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(1, 1), array(1, 2))), kseg.segls('\nline 1\n\nline 2'), array(array(1, 2), array(1, 4)))
            
            lines = belt.seglsForText([[
◆1
◆2
◆3
◆4]])
            
            test.cmp(kseg.str(lines), [[
◆1
◆2
◆3
◆4]])
            
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(2, 1), array(2, 2), array(2, 3), array(2, 4))), kseg.segls('◆\n1\n◆\n2\n◆\n3\n◆\n4'), array(array(1, 2), array(1, 4), array(1, 6), array(1, 8)))
    end)
        
        test("into indented lines", function()
            local lines = belt.seglsForText([[
◆1
    ◆2
        ◆3]])
            
            test.cmp(belt.insertTextAtPositions(lines, '~!', array(array(5, 2))), kseg.segls('◆1\n    ~!◆2\n        ◆3'), array(array(7, 2)))
            test.cmp(belt.insertTextAtPositions(lines, '#{', array(array(3, 3))), kseg.segls('◆1\n    ◆2\n  #{      ◆3'), array(array(5, 3)))
            test.cmp(belt.insertTextAtPositions(lines, '\n', array(array(5, 2))), kseg.segls('◆1\n    \n    ◆2\n        ◆3'), array(array(5, 3)))
            test.cmp(belt.insertTextAtPositions(lines, 'a\nb', array(array(5, 2))), kseg.segls('◆1\n    a\n    b\n    ◆2\n        ◆3'), array(array(5, 4)))
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
        
        --belt.insertSurroundAtRanges lines [[1 0 3 0]] '}' ['{' '}'] ▸ [kseg.segls('l{in}e1\nline2') [[5 0]]]
        --belt.insertSurroundAtRanges lines [[1 0 3 0] [1 1 3 1]] ']' ['[' ']'] ▸ [kseg.segls('l[in]e1\nl[in]e2') [[5 0] [5 1]]]
        
        --belt.insertSurroundAtRanges lines [[1 0 3 0]] '{' ['{' '}'] ▸ [kseg.segls('l{in}e1\nline2') [[2 0]]]
        --belt.insertSurroundAtRanges lines [[1 0 3 0] [1 1 3 1]] '[' ['[' ']'] ▸ [kseg.segls('l[in]e1\nl[in]e2') [[2 0] [2 1]]]
        --        
        --belt.insertSurroundAtRanges lines [[1 0 3 0]] '"' ['"' '"'] ▸ [kseg.segls('l"in"e1\nline2') [[5 0]]]
        --belt.insertSurroundAtRanges lines [[1 0 3 0] [1 1 3 1]] '"' ['"' '"'] ▸ [kseg.segls('l"in"e1\nl"in"e2') [[5 0] [5 1]]]
        --        
        --belt.insertSurroundAtRanges lines [[1 0 3 0]] "}" ['#{' '}'] ▸ [kseg.segls("l\#{in}e1\nline2") [[6 0]]]
        --belt.insertSurroundAtRanges lines [[1 0 3 0]] "#" ['#{' '}'] ▸ [kseg.segls("l\#{in}e1\nline2") [[3 0]]]
        --belt.insertSurroundAtRanges lines [[1 0 3 0] [1 1 3 1]] '"' ['"' '"'] ▸ [kseg.segls('l"in"e1\nl"in"e2') [[5 0] [5 1]]]
    end)
    
    -- 00     00   0000000   000   000  00000000  000      000  000   000  00000000   0000000  
    -- 000   000  000   000  000   000  000       000      000  0000  000  000       000       
    -- 000000000  000   000   000 000   0000000   000      000  000 0 000  0000000   0000000   
    -- 000 0 000  000   000     000     000       000      000  000  0000  000            000  
    -- 000   000   0000000       0      00000000  0000000  000  000   000  00000000  0000000   
    
    test("moveLineRangesAndPositionsAtIndicesInDirection", function()
        -- lines = immutable ['a' 'b' 'c']
        -- rngs  = immutable []
        -- posl  = immutable []
        local lines = array('a', 'b', 'c')
        local rngs = array()
        local posl = array()
        
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs posl [1]   'down' ▸ [['a' 'c' 'b'] [] []]
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs posl [2]   'down' ▸ [['a' 'b' 'c'] [] []]
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs posl [1 2] 'down' ▸ [['a' 'b' 'c'] [] []]
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs posl [0 2] 'down' ▸ [['a' 'b' 'c'] [] []]
        --        
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs posl [1]   'up' ▸ [['b' 'a' 'c'] [] []]
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs posl [2]   'up' ▸ [['a' 'c' 'b'] [] []]
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs posl [1 2] 'up' ▸ [['b' 'c' 'a'] [] []]
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs posl [0 2] 'up' ▸ [['a' 'b' 'c'] [] []]
        --        
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs immutable([[0 1]])       [1] 'down' ▸ [['a' 'c' 'b'] [] [[0 2]]]
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs immutable([[0 1] [1 1]]) [1] 'down' ▸ [['a' 'c' 'b'] [] [[0 2] [1 2]]]
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs immutable([[0 1] [1 1]]) [1] 'down' ▸ [['a' 'c' 'b'] [] [[0 2] [1 2]]]
        --        
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs immutable([[0 1]])       [1] 'up' ▸ [['b' 'a' 'c'] [] [[0 0]]]
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs immutable([[0 1] [1 1]]) [1] 'up' ▸ [['b' 'a' 'c'] [] [[0 0] [1 0]]]
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs immutable([[0 1] [1 1]]) [1] 'up' ▸ [['b' 'a' 'c'] [] [[0 0] [1 0]]]
        
        -- lines = immutable ['a' 'b' 'c' 'd' 'e']
        lines = array('a', 'b', 'c', 'd', 'e')
        
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs immutable([[0 1] [0 2] [0 3]]) [1 2 3] 'up'   ▸ [['b' 'c' 'd' 'a' 'e'] [] [[0 0] [0 1] [0 2]]]
        --belt.moveLineRangesAndPositionsAtIndicesInDirection lines rngs immutable([[0 1] [0 2] [0 3]]) [1 2 3] 'down' ▸ [['a' 'e' 'b' 'c' 'd'] [] [[0 2] [0 3] [0 4]]]
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
        
        --belt.prepareWordsForCompletion 'A'      'A'      words                        ▸ ['Alice']
        --belt.prepareWordsForCompletion '"'      '"'      ['"#fff"']                   ▸ ['"#fff"']
        --belt.prepareWordsForCompletion 'f'      'f'      ['func()']                   ▸ ['func' 'func()']
        --belt.prepareWordsForCompletion 'fa'     'fa'     ['f']                        ▸ []
        --belt.prepareWordsForCompletion 'w'      'w'      ['word[@turd.length..]']     ▸ ['word' 'word[@turd.length..]']
        --belt.prepareWordsForCompletion 'a.b'    'b'      ['a.b.c.d']                  ▸ []
        --belt.prepareWordsForCompletion 'a.b.'   '.'      ['a.b.c.d']                  ▸ ['.b' '.c' '.d']
        --belt.prepareWordsForCompletion 'a.b.c'  'c'      ['a.b.c.d']                  ▸ []
        --belt.prepareWordsForCompletion 'a.b.c.' '.'      ['a.b.c.d']                  ▸ ['.b' '.c' '.d']
        --belt.prepareWordsForCompletion 'word'   'word'   ['word[@turd.length..]']     ▸ []
        --belt.prepareWordsForCompletion 'k'      'k'      ['kseg' 'key']               ▸ ['key' 'kseg']
        --belt.prepareWordsForCompletion 'he'     'he'     ['hello' 'hell']             ▸ ['hell' 'hello']
        --belt.prepareWordsForCompletion 'he'     'he'     ['"hello"' '@hell']          ▸ ['hell' 'hello']    
        --belt.prepareWordsForCompletion 'a.'     '.'      ['0.1' '1.234' 'obj.prop']   ▸ ['.prop']    
        --belt.prepareWordsForCompletion '0.'     '.'      ['0.1' '1.234' 'obj.prop']   ▸ ['.1']    
        --belt.prepareWordsForCompletion '3.1'    '1'      ['1.123' '1.234' 'obj.prop'] ▸ []
        --belt.prepareWordsForCompletion 'rugga'  'r'      ['rofl' 'rug']               ▸ ['rofl' 'rug']
        --belt.prepareWordsForCompletion 'rugga'  'ru'     ['rug']                      ▸ ['rug']
        --belt.prepareWordsForCompletion 'mc'     'mc'     ['mc[0]' 'mc[1]']            ▸ []
        --belt.prepareWordsForCompletion '@'   '@'         ['@color.dot)']              ▸ ['@color' '@color.dot']
        --belt.prepareWordsForCompletion '@'   '@'         ["@side='left"]              ▸ ['@side']
        --belt.prepareWordsForCompletion '@'   '@'         ["@side='left'"]             ▸ ['@side']
        --belt.prepareWordsForCompletion 'b'   'b'         ['a\n' 'b\n']                ▸ []
        --belt.prepareWordsForCompletion '@img.pop' 'pop'  ['@img.pop()']               ▸ ['pop()']
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
        
        -- posl = immutable [[0 0 1 1]]
        -- rngs = immutable [[0 1] [1 1]]
        local posl = array(array(0, 0, 1, 1))
        local rngs = array(array(0, 1), array(1, 1))
        -- belt.indentLineRangesAndPositionsAtIndices lines posl rngs [0 1] ▸ [[kseg('    ◆1') kseg('        ◆2') kseg('        ◆3')] [[4 0 5 1]] [[4 1] [5 1]]]
    end)
    
    test("deindentLineRangesAndPositionsAtIndices", function()
        local lines = belt.seglsForText
        
            [[ 
◆1
    ◆2
        ◆3
]]
        
        -- posl = immutable [[0 1 1 2]] 
        -- rngs = immutable [[0 1] [1 2]]
        local posl = array(array(0, 1, 1, 2))
        local rngs = array(array(0, 1), array(1, 2))
        -- belt.deindentLineRangesAndPositionsAtIndices lines posl rngs [1 2] ▸ [[kseg('◆1') kseg('◆2') kseg('    ◆3')] [[0 1 0 2]] [[0 1] [0 2]]]
    end)
    end)