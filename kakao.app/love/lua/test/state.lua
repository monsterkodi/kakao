--[[
     0000000  000000000   0000000   000000000  00000000  
    000          000     000   000     000     000       
    0000000      000     000000000     000     0000000   
         000     000     000   000     000     000       
    0000000      000     000   000     000     00000000  
--]]

belt = require "edit.tool.belt"
state = require "edit.state"
mode = require "edit.mode"

local cells = {cols = 55, rows = 66}
local s = state(cells, 'test')


function txt(t) 
    return test.cmp(kseg.str(s.s.lines), t)
end

function cur(x, y) 
    return test.cmp(s:mainCursor(), array(x, y))
end

function mul(...) 
    return test.cmp(s:allCursors(), array.from({...}))
end

function sel(...) 
    return test.cmp(s:allSelections(), array.from({...}))
end

test("state", function()
    local text = [[
line 1
line 2
line 3
]]
    
    s.syntax.ext = 'kode'
    s:loadLines(belt.linesForText(text))
    
    txt(text)
    
    -- 00000000  0000000    000  000000000  000  000   000   0000000   
    -- 000       000   000  000     000     000  0000  000  000        
    -- 0000000   000   000  000     000     000  000 0 000  000  0000  
    -- 000       000   000  000     000     000  000  0000  000   000  
    -- 00000000  0000000    000     000     000  000   000   0000000   
    
    test("editing", function()
        s:setMainCursor(1, 1)
        
        cur(1, 1)
        
        -- s∙insert 'x'
        
        --cur 2 1
        --txt """
        --    line 1
        --    lxine 2
        --    line 3
        --    """    
        --    
        --s∙delete 'back'
        --        
        --cur 1 1
        --txt text
    end)
    
    -- 00     00   0000000   000   000  00000000        000      000  000   000  00000000   0000000  
    -- 000   000  000   000  000   000  000             000      000  0000  000  000       000       
    -- 000000000  000   000   000 000   0000000         000      000  000 0 000  0000000   0000000   
    -- 000 0 000  000   000     000     000             000      000  000  0000  000            000  
    -- 000   000   0000000       0      00000000        0000000  000  000   000  00000000  0000000   
    
    test("move lines", function()
        --s∙moveSelectionOrCursorLines 'up'
        --cur 1 1
        --txt """
        --    line 2
        --    line 1
        --    line 3
        --    """
        --s∙moveSelectionOrCursorLines 'down'
        --        
        --cur 1 1
        --txt text
    end)
    
    -- 00     00  000   000  000      000000000  000  00000000   000      00000000  
    -- 000   000  000   000  000         000     000  000   000  000      000       
    -- 000000000  000   000  000         000     000  00000000   000      0000000   
    -- 000 0 000  000   000  000         000     000  000        000      000       
    -- 000   000   0000000   0000000     000     000  000        0000000  00000000  
    
    test("multiple", function()
        -- s∙expandCursors   'up'
        
        -- mul [1 1] [1 2]
        
        --s∙expandCursors   'down'
        --        
        --mul [1 0] [1 1] [1 2]
        --        
        --s∙moveCursors 'left'
        --        
        --mul [0 0] [0 1] [0 2]
        --        
        --s∙moveCursorsAndSelect 'right'
        --        
        --mul [1 0] [1 1] [1 2]
        --sel [0 0 1 0] [0 1 1 1] [0 2 1 2]
        --        
        --s∙moveCursors 'right' {jump:['ws' 'word' 'empty' 'punct']}
        --        
        --mul [4 0] [4 1] [4 2]
        --sel [0 0 1 0] [0 1 1 1] [0 2 1 2]
        --        
        --s∙selectAllLines()
        --        
        --mul [4 0] [4 1] [4 2]
        --sel [0 0 6 2] 
        --        
        --s∙selectAllLines()
        --        
        --mul [4 0] [4 1] [4 2]
        --sel()
        --        
        --s∙moveCursors 'right'
        --s∙moveCursorsAndSelect 'left' {jump:['word']}
        --s∙moveCursorsAndSelect 'left' {jump:['word']}
        --        
        --mul [0 0] [0 1] [0 2]   
        --sel [0 0 5 0] [0 1 5 1] [0 2 5 2]
        
        --s∙insert '\n' 
        --        
        --mul [0 1] [0 3] [0 5]
        --sel()
        --txt """
        --    
        --    1
        --    
        --    2
        --    
        --    3
        --    """    
    end)
    
    -- 000   000  000   000  000   0000000   0000000   0000000    00000000  
    -- 000   000  0000  000  000  000       000   000  000   000  000       
    -- 000   000  000 0 000  000  000       000   000  000   000  0000000   
    -- 000   000  000  0000  000  000       000   000  000   000  000       
    --  0000000   000   000  000   0000000   0000000   0000000    00000000  
    
    --▸ unicode
    --    
    --    text = """
    --        s = "🧑🌾"
    --        line 3
    --        """
    --    
    --    s.syntax.ext = 'kode'
    --    s∙loadSegls belt.seglsForText(text)
    --            
    --    txt text
    --    
    --    s∙toggleCommentAtSelectionOrCursorLines()
    --    
    --    txt """
    --        # s = "🧑🌾"
    --        line 3
    --        """
    --    s∙toggleCommentAtSelectionOrCursorLines()
    --    
    --    txt text
    --    
    --    ▸ selection
    --    
    --        text = """
    --            'a'        ▸ 1
    --            '🔧'       ▸ 2
    --            '字'       ▸ 2
    --            '字的模块' ▸ 8
    --            '👁'        ▸ 1
    --            '🖌'        ▸ 1
    --            '🛠'        ▸ 1
    --            '🧑‍🌾'       ▸ 4
    --            '🔥'       ▸ 2
    --            '💩'       ▸ 2
    --            """
    --    
    --        s.syntax.ext = 'kode'
    --        s∙loadSegls belt.seglsForText(text)
    --                
    --        txt text 
    --        
    --        s∙selectAllLines()
    --        
    --        sel [1 1 15 10]
    --        
    --        s∙moveCursorsToEndOfSelections()
    --        
    --        sel [1 1 15 10]
    --        mul [15 1] [15 2] [15 3] [15 4] [15 5] [15 6] [15 7] [15 8] [15 9] [15 10]
    --        
    --        s∙deselect()
    --        
    --        sel()
    --        mul [15 1] [15 2] [15 3] [15 4] [15 5] [15 6] [15 7] [15 8] [15 9] [15 10]
    --    
    --        s∙moveCursors 'bol'
    --        
    --        mul [1 1] [1 2] [1 3] [1 4] [1 5] [1 6] [1 7] [1 8] [1 9] [1 10]
    --    
    --        s∙selectMoreLines()
    --        
    --        sel [1 1 15 10]
    --        mul [15 1] [15 2] [15 3] [15 4] [15 5] [15 6] [15 7] [15 8] [15 9] [15 10]
    --    
    --        s∙deselect()
    --        s∙delete 'back'
    --        
    --        txt """
    --            'a'        ▸ 
    --            '🔧'       ▸ 
    --            '字'       ▸ 
    --            '字的模块' ▸ 
    --            '👁'        ▸ 
    --            '🖌'        ▸ 
    --            '🛠'        ▸ 
    --            '🧑‍🌾'       ▸ 
    --            '🔥'       ▸ 
    --            '💩'       ▸ 
    --            """
    --    
    --        s∙delete 'back'
    --        s∙moveCursors 'left'
    --        s∙delete 'back'
    --    
    --        txt """
    --            'a'       ▸
    --            '🔧'      ▸
    --            '字'      ▸
    --            '字的模块'▸
    --            '👁'       ▸
    --            '🖌'       ▸
    --            '🛠'       ▸
    --            '🧑‍🌾'      ▸
    --            '🔥'      ▸
    --            '💩'      ▸
    --            """
    --            
    --        s∙delete 'back' true
    --    
    --        txt """
    --            'a'▸
    --            '🔧'▸
    --            '字'▸
    --            '字的模块▸
    --            '👁'▸
    --            '🖌'▸
    --            '🛠'▸
    --            '🧑‍🌾'▸
    --            '🔥'▸
    --            '💩'▸
    --            """
    
    -- 00000000  00     00  00000000   000000000  000   000  
    -- 000       000   000  000   000     000      000 000   
    -- 0000000   000000000  00000000      000       00000    
    -- 000       000 0 000  000           000        000     
    -- 00000000  000   000  000           000        000     
    
    test("empty", function()
        s.syntax.ext = 'kode'
        s:loadLines(belt.linesForText(''))
        
        txt('')
        cur(1, 1)
        
        --s∙insert '\n'
        --        
        --txt '\n'
        --cur 1 2
        --        
        --s.s.lines ▸ [[] []]
    end)
    
    -- 0000000    00000000  000      00000000  000000000  00000000        0000000     0000000    0000000  000   000  
    -- 000   000  000       000      000          000     000             000   000  000   000  000       000  000   
    -- 000   000  0000000   000      0000000      000     0000000         0000000    000000000  000       0000000    
    -- 000   000  000       000      000          000     000             000   000  000   000  000       000  000   
    -- 0000000    00000000  0000000  00000000     000     00000000        0000000    000   000   0000000  000   000  
    
    test("delete back", function()
        s.syntax.ext = 'kode'
        s:loadLines(belt.linesForText("1234567890"))
        
        s:setMainCursor(1, 1)
        s:delete('back')
        txt("1234567890")
        mul(array(1, 1))
        
        s:setMainCursor(2, 1)
        s:delete('back')
        txt("234567890")
        mul(array(1, 1))
        
        s:setMainCursor(5, 1)
        s:delete('back')
        txt("23467890")
        mul(array(4, 1))
        
        s:delete('back')
        txt("2367890")
        mul(array(3, 1))
        
        text = [[
xxxx            1
xxxx         .  2
xxxx    .       3
]]
        
        s:loadLines(belt.linesForText(text))
        
        s:setMainCursor(17, 1)
        s:expandCursors('down')
        s:expandCursors('down')
        
        mul(array(17, 1), array(17, 2), array(17, 3))
        
        -- s∙delete 'back'
        -- mul [15 1] [15 2] [15 3]
        -- txt """
        --     xxxx          1
        --     xxxx         .2
        --     xxxx    .     3
        --     """
        
        --s∙delete 'back'
        --mul [13 1] [13 2] [13 3]
        --        
        --s∙delete 'back'
        --mul [12 1] [12 2] [12 3]
        --        
        --s∙delete 'back'
        --mul [9 1] [9 2] [9 3]
        --        
        --s∙delete 'back'
        --mul [8 1] [8 2] [8 3]
        --        
        --s∙delete 'back'
        --mul [4 1] [4 2] [4 3]
    end)
    
    --  0000000  000       0000000   000   000  00000000         000      000  000   000  00000000   0000000  
    -- 000       000      000   000  0000  000  000              000      000  0000  000  000       000       
    -- 000       000      000   000  000 0 000  0000000          000      000  000 0 000  0000000   0000000   
    -- 000       000      000   000  000  0000  000              000      000  000  0000  000            000  
    --  0000000  0000000   0000000   000   000  00000000         0000000  000  000   000  00000000  0000000   
    
    --▸ cloneSelectionAndCursorLines
    --    
    --    text = """
    --        line 1
    --        line 2
    --        line 3
    --        """
    --    s∙loadLines belt.linesForText(text)
    --    s∙cloneSelectionAndCursorLines 'down'
    --    
    --    txt """
    --        line 1
    --        line 1
    --        line 2
    --        line 3
    --        """
    --        
    --    mul [1 1]
    --        
    --    s∙expandCursors 'down'
    --    
    --    mul [1 1] [1 2]
    --    
    --    s∙cloneSelectionAndCursorLines 'down'
    --     
    --    txt """
    --        line 1
    --        line 1
    --        line 2
    --        line 1
    --        line 2
    --        line 3
    --        """
    --        
    --    mul [1 3] [1 4] 
    --    
    --    s∙expandCursors 'down'
    --    s∙moveCursors 'right'
    --    
    --    mul [1 3] [1 4] [1 5] 
    --    
    --    s∙cloneSelectionAndCursorLines 'down'
    --    
    --    txt """
    --        line 1
    --        line 1
    --        line 2
    --        line 1
    --        line 2
    --        line 3
    --        line 1
    --        line 2
    --        line 3
    --        """
    
    -- 0000000    00000000  000            00000000    0000000   000   000   0000000   00000000   0000000  
    -- 000   000  000       000            000   000  000   000  0000  000  000        000       000       
    -- 000   000  0000000   000            0000000    000000000  000 0 000  000  0000  0000000   0000000   
    -- 000   000  000       000            000   000  000   000  000  0000  000   000  000            000  
    -- 0000000    00000000  0000000        000   000  000   000  000   000   0000000   00000000  0000000   
    
    test("deleteRanges", function()
        text = [[
line 1
line 2
line 3
]]
        
        s:loadLines(belt.linesForText(text))
        s:deleteRanges(array(array(1, 1, 3, 1)))
        
        txt([[
ne 1
line 2
line 3
]])
        
        s:deleteRanges(array(array(3, 1, 3, 2)))
        
        txt([[
nene 2
line 3
]])
        
        s:deleteRanges(array(array(7, 1, 1, 2)))
        
        txt([[
nene 2line 3
]])
    end)
    
    --       000   0000000   000  000   000        000      000  000   000  00000000   0000000  
    --       000  000   000  000  0000  000        000      000  0000  000  000       000       
    --       000  000   000  000  000 0 000        000      000  000 0 000  0000000   0000000   
    -- 000   000  000   000  000  000  0000        000      000  000  0000  000            000  
    --  0000000    0000000   000  000   000        0000000  000  000   000  00000000  0000000   
    
    test("joinLines", function()
        text = [[
line 1
line 2
line 3
]]
        
        s:loadLines(belt.linesForText(text))
        -- s∙joinLines()
        
        -- txt """
        --     line 1line 2
        --     line 3
        --     """
    end)
    end)