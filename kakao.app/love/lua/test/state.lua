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
    
    s:loadSegls(belt.seglsForText(text))
    
    txt(text)
    
    test.cmp(belt.seglsForText(text), belt.seglsForText(text))
    test.cmp(belt.linesForText(text), array("line 1", "line 2", "line 3", ""))
    test.cmp(kseg.segls(belt.linesForText(text)), belt.seglsForText(text))
    
    s:loadLines(belt.linesForText(text))
    
    txt(text)
    
    -- 00000000  0000000    000  000000000  000  000   000   0000000   
    -- 000       000   000  000     000     000  0000  000  000        
    -- 0000000   000   000  000     000     000  000 0 000  000  0000  
    -- 000       000   000  000     000     000  000  0000  000   000  
    -- 00000000  0000000    000     000     000  000   000   0000000   
    
    test("editing", function()
        s:loadSegls(belt.seglsForText(text))
        
        txt(text)
        
        s:setMainCursor(2, 2)
        
        cur(2, 2)
        
        s:insert('x')
        
        txt([[
line 1
lxine 2
line 3
]])
        
        cur(3, 2)
        
        s:delete('back')
        
        cur(2, 2)
        txt(text)
    end)
    
    test("moveCursors", function()
        s:loadSegls(belt.seglsForText(text))
        
        s:setMainCursor(2, 2)
        
        s:moveCursors('left')
        
        cur(1, 2)
        
        s:moveCursors('right', {jump = array('ws', 'word', 'empty', 'punct')})
        
        cur(5, 2)
        
        s:moveCursors('right', {jump = array('ws', 'word', 'empty', 'punct')})
        
        cur(6, 2)
        
        s:moveCursors('right', {jump = array('ws', 'word', 'empty', 'punct')})
        
        cur(7, 2)
        
        s:moveCursors('right', {jump = array('ws', 'word', 'empty', 'punct')})
        
        cur(8, 2)
        
        s:moveCursors('right', {jump = array('ws', 'word', 'empty', 'punct')})
        
        cur(9, 2)
        
        s:moveCursors('left', {jump = array('ws', 'word', 'empty', 'punct')})
        
        cur(7, 2)
        
        s:moveCursors(array('bos', 'ind_bol'))
        
        cur(1, 2)
        
        s:moveCursors(array('eos', 'ind_eol'))
        
        cur(7, 2)
    end)
    
    -- 00     00   0000000   000   000  00000000        000      000  000   000  00000000   0000000  
    -- 000   000  000   000  000   000  000             000      000  0000  000  000       000       
    -- 000000000  000   000   000 000   0000000         000      000  000 0 000  0000000   0000000   
    -- 000 0 000  000   000     000     000             000      000  000  0000  000            000  
    -- 000   000   0000000       0      00000000        0000000  000  000   000  00000000  0000000   
    
    test("move lines", function()
        s:loadSegls(belt.seglsForText(text))
        s:setMainCursor(2, 2)
        
        s:moveSelectionOrCursorLines('up')
        cur(2, 1)
        txt([[
line 2
line 1
line 3
]])
        
        s:moveSelectionOrCursorLines('down')
        
        cur(2, 2)
        txt([[
line 1
line 2
line 3
]])
    end)
    
    test("insert", function()
        s:loadSegls(belt.seglsForText(text))
        s:setMainCursor(1, 2)
        s:insert("\n")
        cur(1, 3)
        
        txt([[
line 1

line 2
line 3
]])
        
        s:loadSegls(belt.seglsForText(text))
        s:setMainCursor(6, 2)
        s:insert("\n")
        cur(1, 3)
        
        txt([[
line 1
line 
2
line 3
]])
    end)
    
    -- 00     00  000   000  000      000000000  000  00000000   000      00000000  
    -- 000   000  000   000  000         000     000  000   000  000      000       
    -- 000000000  000   000  000         000     000  00000000   000      0000000   
    -- 000 0 000  000   000  000         000     000  000        000      000       
    -- 000   000   0000000   0000000     000     000  000        0000000  00000000  
    
    test("multiple", function()
        s:loadSegls(belt.seglsForText(text))
        
        s:setMainCursor(1, 2)
        s:expandCursors('up')
        
        mul(array(1, 1), array(1, 2))
        
        s:expandCursors('down')
        
        mul(array(1, 1), array(1, 2), array(1, 3))
        
        s:moveCursors('left')
        
        mul(array(1, 1), array(1, 2), array(1, 3))
        
        s:moveCursorsAndSelect('right')
        
        mul(array(2, 1), array(2, 2), array(2, 3))
        sel(array(1, 1, 2, 1), array(1, 2, 2, 2), array(1, 3, 2, 3))
        
        s:moveCursors('right', {jump = array('ws', 'word', 'empty', 'punct')})
        
        mul(array(5, 1), array(5, 2), array(5, 3))
        sel(array(1, 1, 2, 1), array(1, 2, 2, 2), array(1, 3, 2, 3))
        
        s:selectAllLines()
        
        mul(array(5, 1), array(5, 2), array(5, 3))
        sel(array(1, 1, 1, 4))
        
        s:selectAllLines()
        
        mul(array(5, 1), array(5, 2), array(5, 3))
        sel()
        
        s:moveCursors('right')
        s:moveCursorsAndSelect('left', {jump = array('word')})
        sel(array(5, 1, 6, 1), array(5, 2, 6, 2), array(5, 3, 6, 3))
        
        s:moveCursorsAndSelect('left', {jump = array('word')})
        
        mul(array(1, 1), array(1, 2), array(1, 3))
        sel(array(1, 1, 6, 1), array(1, 2, 6, 2), array(1, 3, 6, 3))
    end)
    
    -- 000   000  000   000  000   0000000   0000000   0000000    00000000  
    -- 000   000  0000  000  000  000       000   000  000   000  000       
    -- 000   000  000 0 000  000  000       000   000  000   000  0000000   
    -- 000   000  000  0000  000  000       000   000  000   000  000       
    --  0000000   000   000  000   0000000   0000000   0000000    00000000  
    
    test("unicode", function()
        text = [[
s = "🧑🌾"
line 3
]]
        
        s.syntax.ext = 'kode'
        s:loadSegls(belt.seglsForText(text))
        
        txt(text)
        
        s:toggleCommentAtSelectionOrCursorLines()
        
        txt([[
# s = "🧑🌾"
line 3
]])
        
        s:toggleCommentAtSelectionOrCursorLines()
        
        txt(text)
    end)
    
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
        -- s.syntax.ext = 'kode'
        -- s∙loadLines belt.linesForText('')
        -- 
        -- txt ''
        -- cur 1 1
        
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
        
        s:loadSegls(kseg.segls("xxxx         .  2"))
        s:setMainCursor(17, 1)
        s:delete('back')
        mul(array(15, 1))
        txt("xxxx         .2")
        
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
        
        s:delete('back')
        mul(array(15, 1), array(15, 2), array(15, 3))
        txt([[
xxxx          1
xxxx         .2
xxxx    .     3
]])
        
        s:delete('back')
        mul(array(14, 1), array(14, 2), array(14, 3))
        
        txt([[
xxxx         1
xxxx         2
xxxx    .    3
]])
        
        s:delete('back')
        mul(array(13, 1), array(13, 2), array(13, 3))
        
        txt([[
xxxx        1
xxxx        2
xxxx    .   3
]])
        
        s:delete('back')
        mul(array(10, 1), array(10, 2), array(10, 3))
        
        txt([[
xxxx     1
xxxx     2
xxxx    .3
]])
        
        s:delete('back')
        mul(array(9, 1), array(9, 2), array(9, 3))
        
        txt([[
xxxx    1
xxxx    2
xxxx    3
]])
        
        s:delete('back')
        mul(array(5, 1), array(5, 2), array(5, 3))
        
        txt([[
xxxx1
xxxx2
xxxx3
]])
    end)
    
    --  0000000  000       0000000   000   000  00000000         000      000  000   000  00000000   0000000  
    -- 000       000      000   000  0000  000  000              000      000  0000  000  000       000       
    -- 000       000      000   000  000 0 000  0000000          000      000  000 0 000  0000000   0000000   
    -- 000       000      000   000  000  0000  000              000      000  000  0000  000            000  
    --  0000000  0000000   0000000   000   000  00000000         0000000  000  000   000  00000000  0000000   
    
    test("cloneSelectionAndCursorLines", function()
        text = [[
line 1
line 2
line 3
]]
        
        s:loadLines(belt.linesForText(text))
        s:cloneSelectionAndCursorLines('down')
        
        txt([[
line 1
line 1
line 2
line 3
]])
        
        mul(array(1, 2))
        
        s:expandCursors('down')
        
        mul(array(1, 2), array(1, 3))
        
        s:cloneSelectionAndCursorLines('down')
        
        txt([[
line 1
line 1
line 2
line 1
line 2
line 3
]])
        
        mul(array(1, 4), array(1, 5))
        
        s:expandCursors('down')
        s:moveCursors('right')
        
        mul(array(2, 4), array(2, 5), array(2, 6))
        
        s:cloneSelectionAndCursorLines('down')
        
        txt([[
line 1
line 1
line 2
line 1
line 2
line 3
line 1
line 2
line 3
]])
    end)
    
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
        s:setMainCursor(1, 1)
        mul(array(1, 1))
        s:joinLines()
        
        txt([[
line 1line 2
line 3
]])
    end)
    end)