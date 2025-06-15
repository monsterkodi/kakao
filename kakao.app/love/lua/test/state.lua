--[[
     0000000  000000000   0000000   000000000  00000000  
    000          000     000   000     000     000       
    0000000      000     000000000     000     0000000   
         000     000     000   000     000     000       
    0000000      000     000   000     000     00000000  
--]]

-- global.lf = args... -> log args.map((a) -> "#{a}").join(' ')

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

function mul(c, ...) 
    return test.cmp(s:allCursors(), c)
end

function sel(r, ...) 
    return test.cmp(s:allSelections(), r)
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
        
        s:insert('x')
        
        cur(2, 1)
        txt([[
line 1
lxine 2
line 3
]])
        
        s:delete('back')
        
        cur(1, 1)
        txt(text)
    end)
    
    -- 00     00   0000000   000   000  00000000        000      000  000   000  00000000   0000000  
    -- 000   000  000   000  000   000  000             000      000  0000  000  000       000       
    -- 000000000  000   000   000 000   0000000         000      000  000 0 000  0000000   0000000   
    -- 000 0 000  000   000     000     000             000      000  000  0000  000            000  
    -- 000   000   0000000       0      00000000        0000000  000  000   000  00000000  0000000   
    
    test("move lines", function()
        s:moveSelectionOrCursorLines('up')
        cur(1, 0)
        txt([[
line 2
line 1
line 3
]])
        
        s:moveSelectionOrCursorLines('down')
        
        cur(1, 1)
        txt(text)
    end)
    
    -- 00     00  000   000  000      000000000  000  00000000   000      00000000  
    -- 000   000  000   000  000         000     000  000   000  000      000       
    -- 000000000  000   000  000         000     000  00000000   000      0000000   
    -- 000 0 000  000   000  000         000     000  000        000      000       
    -- 000   000   0000000   0000000     000     000  000        0000000  00000000  
    
    test("multiple", function()
        s:expandCursors('up')
        
        mul(array(1, 0), array(1, 1))
        
        s:expandCursors('down')
        
        mul(array(1, 0), array(1, 1), array(1, 2))
        
        s:moveCursors('left')
        
        mul(array(0, 0), array(0, 1), array(0, 2))
        
        s:moveCursorsAndSelect('right')
        
        mul(array(1, 0), array(1, 1), array(1, 2))
        sel(array(0, 0, 1, 0), array(0, 1, 1, 1), array(0, 2, 1, 2))
        
        s:moveCursors('right', {jump = array('ws', 'word', 'empty', 'punct')})
        
        mul(array(4, 0), array(4, 1), array(4, 2))
        sel(array(0, 0, 1, 0), array(0, 1, 1, 1), array(0, 2, 1, 2))
        
        s:selectAllLines()
        
        mul(array(4, 0), array(4, 1), array(4, 2))
        sel(array(0, 0, 6, 2))
        
        s:selectAllLines()
        
        mul(array(4, 0), array(4, 1), array(4, 2))
        sel()
        
        s:moveCursors('right')
        s:moveCursorsAndSelect('left', {jump = array('word')})
        s:moveCursorsAndSelect('left', {jump = array('word')})
        
        mul(array(0, 0), array(0, 1), array(0, 2))
        sel(array(0, 0, 5, 0), array(0, 1, 5, 1), array(0, 2, 5, 2))
        
        s:insert('\n')
        
        mul(array(0, 1), array(0, 3), array(0, 5))
        sel()
        txt([[

1

2

3
]])
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
        
        test("selection", function()
            text = [[
'a'        ▸ 1
'🔧'       ▸ 2
'字'       ▸ 2
'字的模块' ▸ 8
'👁'        ▸ 1
'🖌'        ▸ 1
'🛠'        ▸ 1
'🧑‍🌾'       ▸ 4
'🔥'       ▸ 2
'💩'       ▸ 2
]]
            
            s.syntax.ext = 'kode'
            s:loadSegls(belt.seglsForText(text))
            
            txt(text)
            
            s:selectAllLines()
            
            sel(array(0, 0, 14, 9))
            
            s:moveCursorsToEndOfSelections()
            
            sel(array(0, 0, 14, 9))
            mul(array(14, 0), array(14, 1), array(14, 2), array(14, 3), array(14, 4), array(14, 5), array(14, 6), array(14, 7), array(14, 8), array(14, 9))
            
            s:deselect()
            
            sel()
            mul(array(14, 0), array(14, 1), array(14, 2), array(14, 3), array(14, 4), array(14, 5), array(14, 6), array(14, 7), array(14, 8), array(14, 9))
            
            s:moveCursors('bol')
            
            mul(array(0, 0), array(0, 1), array(0, 2), array(0, 3), array(0, 4), array(0, 5), array(0, 6), array(0, 7), array(0, 8), array(0, 9))
            
            s:selectMoreLines()
            
            sel(array(0, 0, 14, 9))
            mul(array(14, 0), array(14, 1), array(14, 2), array(14, 3), array(14, 4), array(14, 5), array(14, 6), array(14, 7), array(14, 8), array(14, 9))
            
            s:deselect()
            s:delete('back')
            
            txt([[
'a'        ▸ 
'🔧'       ▸ 
'字'       ▸ 
'字的模块' ▸ 
'👁'        ▸ 
'🖌'        ▸ 
'🛠'        ▸ 
'🧑‍🌾'       ▸ 
'🔥'       ▸ 
'💩'       ▸ 
]])
            
            s:delete('back')
            s:moveCursors('left')
            s:delete('back')
            
            txt([[
'a'       ▸
'🔧'      ▸
'字'      ▸
'字的模块'▸
'👁'       ▸
'🖌'       ▸
'🛠'       ▸
'🧑‍🌾'      ▸
'🔥'      ▸
'💩'      ▸
]])
            
            s:delete('back', true)
            
            txt([[
'a'▸
'🔧'▸
'字'▸
'字的模块▸
'👁'▸
'🖌'▸
'🛠'▸
'🧑‍🌾'▸
'🔥'▸
'💩'▸
]])
    end)
    end)
    
    -- 00000000  00     00  00000000   000000000  000   000  
    -- 000       000   000  000   000     000      000 000   
    -- 0000000   000000000  00000000      000       00000    
    -- 000       000 0 000  000           000        000     
    -- 00000000  000   000  000           000        000     
    
    test("empty", function()
        s.syntax.ext = 'kode'
        s:loadLines(belt.linesForText(''))
        
        txt('')
        cur(0, 0)
        
        s:insert('\n')
        
        txt('\n')
        cur(0, 1)
        
        test.cmp(s.s.lines, array(array(), array()))
    end)
    
    -- 0000000    00000000  000      00000000  000000000  00000000        0000000     0000000    0000000  000   000  
    -- 000   000  000       000      000          000     000             000   000  000   000  000       000  000   
    -- 000   000  0000000   000      0000000      000     0000000         0000000    000000000  000       0000000    
    -- 000   000  000       000      000          000     000             000   000  000   000  000       000  000   
    -- 0000000    00000000  0000000  00000000     000     00000000        0000000    000   000   0000000  000   000  
    
    test("delete back", function()
        text = [[
xxxx            1
xxxx         .  2
xxxx    .       3
]]
        
        s.syntax.ext = 'kode'
        s:loadLines(belt.linesForText(text))
        
        s:setMainCursor(16, 0)
        s:expandCursors('down')
        s:expandCursors('down')
        s:expandCursors('down')
        
        mul(array(16, 0), array(16, 1), array(16, 2))
        
        s:delete('back')
        mul(array(14, 0), array(14, 1), array(14, 2))
        
        s:delete('back')
        mul(array(13, 0), array(13, 1), array(13, 2))
        
        s:delete('back')
        mul(array(12, 0), array(12, 1), array(12, 2))
        
        s:delete('back')
        mul(array(9, 0), array(9, 1), array(9, 2))
        
        s:delete('back')
        mul(array(8, 0), array(8, 1), array(8, 2))
        
        s:delete('back')
        mul(array(4, 0), array(4, 1), array(4, 2))
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
        
        mul(array(0, 1))
        
        s:expandCursors('down')
        
        mul(array(0, 1), array(0, 2))
        
        s:cloneSelectionAndCursorLines('down')
        
        txt([[
line 1
line 1
line 2
line 1
line 2
line 3
]])
        
        mul(array(0, 3), array(0, 4))
        
        s:expandCursors('down')
        s:moveCursors('right')
        
        mul(array(1, 3), array(1, 4), array(1, 5))
        
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
        s:deleteRanges(array(array(0, 0, 2, 0)))
        
        txt([[
ne 1
line 2
line 3
]])
        
        s:deleteRanges(array(array(2, 0, 2, 1)))
        
        txt([[
nene 2
line 3
]])
        
        s:deleteRanges(array(array(6, 0, 0, 1)))
        
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
        s:joinLines()
        
        txt([[
line 1line 2
line 3
]])
    end)
    end)