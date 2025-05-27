kxk = require "kxk/kxk"
noon = require "kxk/noon"

test("noon", function()
    test("stringify", function()
        test.cmp(noon.stringify(1), "1")
        test.cmp(noon.stringify("2"), "2")
        test.cmp(noon.stringify(true), "true")
        test.cmp(noon.stringify(false), "false")
        test.cmp(noon.stringify(nil), "nil")
    end)
    
    test("number", function()
        test.cmp(noon.stringify(42), '42')
        test.cmp(noon.stringify(66.6000), '66.6')
    end)
    
    test("bool", function()
        test.cmp(noon.stringify(false), 'false')
        
        test.cmp(noon.stringify(true), 'true')
        test.cmp(noon.stringify(' false'), "| false|")
        
        test.cmp(noon.stringify(array('false', 'true', ' false', 'true  ')), [[
false
true
| false|
|true  |]])
        
        test.cmp(noon.stringify(array(true, " true ")), [[
true
| true |]])
    end)
    
    --  0000000  000000000  00000000   000  000   000   0000000   
    -- 000          000     000   000  000  0000  000  000        
    -- 0000000      000     0000000    000  000 0 000  000  0000  
    --      000     000     000   000  000  000  0000  000   000  
    -- 0000000      000     000   000  000  000   000   0000000   
    
    test("string", function()
        test.cmp(noon.stringify("hello world"), 'hello world')
        test.cmp(noon.stringify(" .  ...  ||| "), '| .  ...  ||| |')
        test.cmp(noon.stringify("66.6000"), '66.6000')
        test.cmp(noon.stringify("1\n2\n3"), '...\n1\n2\n3\n...')
    end)
    
    test("float", function()
        test.cmp(noon.stringify(array(0.24, 66.6)), [[
0.24
66.6]])
    end)
    
    test("list", function()
        test.cmp(noon.stringify(array('a', 'a1', 'a 1')), [[
a
a1
a 1]])
    end)
    
    test("list of lists ...", function()
        test.cmp(noon.stringify(array(array(1, 2), array(4, array(5), array(array(6))), array(7), array(), array(array(8, array(9, array(10, 11), 12))))), [[
.
    1
    2
.
    4
    .
        5
    .
        .
            6
.
    7
.

.
    .
        8
        .
            9
            .
                10
                11
            12]])
    end)
    
    test("object", function()
        test.cmp(noon.stringify({a = 1, b = 2, c = 3}), [[
a   1
b   2
c   3]])
        
        test.cmp(noon.stringify({a = 1, b = 2}), [[
a   1
b   2]])
        
        test.cmp(noon.stringify({key = "value   with    some    spaces  ."}), "key  value   with    some    spaces  .")
    end)
    
    -- 00000000   0000000   0000000   0000000   00000000   00000000  
    -- 000       000       000       000   000  000   000  000       
    -- 0000000   0000000   000       000000000  00000000   0000000   
    -- 000            000  000       000   000  000        000       
    -- 00000000  0000000    0000000  000   000  000        00000000  
    
    test("escape", function()
        test.cmp(noon.stringify(array('', ' ', '  ', ' . ', ' .. ', ' ... ', ' .', ' ..', ' ...', '. ', '.. ', '... ', '|', '||', '#', '# a')), [[
||
| |
|  |
| . |
| .. |
| ... |
| .|
| ..|
| ...|
|. |
|.. |
|... |
|||
||||
|#|
|# a|]])
        
        test.cmp(noon.stringify({
            [''] = '', 
            [' '] = ' ', 
            ['  '] = '  ', 
            [' . '] = ' . ', 
            [' .. '] = ' .. ', 
            [' ... '] = ' .|. ', 
            [' .'] = ' .', 
            [' ..'] = ' ..', 
            [' ...'] = ' .|.', 
            ['. '] = '. ', 
            ['.. '] = '.. ', 
            ['... '] = '.|. ', 
            ['.  .'] = '|', 
            ['.   .'] = '||', 
            ['#'] = '#', 
            ['# a'] = '# b'
            }), [[
|  |     |  |
| . |    | . |
| .. |   | .. |
| ... |  | .|. |
| ...|   | .|.|
| ..|    | ..|
| .|     | .|
| |      | |
|# a|    |# b|
|#|      |#|
|.   .|  ||||
|.  .|   |||
|. |     |. |
|.. |    |.. |
|... |   |.|. |
||       ||]])
        
        test.cmp(noon.stringify(" 1 \n2 \n  3"), '...\n| 1 |\n|2 |\n|  3|\n...')
        
        test.cmp(noon.stringify({o = " 1 \n2 \n  3"}), 'o   ...\n| 1 |\n|2 |\n|  3|\n...')
        
        -- noon.stringify { a: ["a  b", "1   3", "   c    d  e   "] } ▸
        --     """
        --     a
        --         |a  b|
        --         |1   3|
        --         |   c    d  e   |"""
    end)
    
    test("trim", function()
        local o = {a = 1, b = nil, c = 2}
        
        test.cmp(noon.stringify(o), [[
a   1
c   2]])
        
        --noon.stringify { a: { b: {c:1} } } ▸
        --    """
        --    a
        --        b
        --            c   1
        --    """
    end)
    
    test("maxalign", function()
        local o = {o = 1, ooOOoo = 2}
        
        test.cmp(noon.stringify(o), [[
o       1
ooOOoo  2]])
        
        local t = {foofoo = {
               barbarbar = 1, 
               foo = 2
               }}
        
        test.cmp(noon.stringify(t), [[
foofoo
    barbarbar  1
    foo        2]])
        
        t = {
            foobar = {
                barfoo = 1, 
                bar = 2
                }, 
            foo = {
                bar = 1
                }, 
            ugag = 3
            }
        
        test.cmp(noon.stringify(t), [[
foo
    bar  1
foobar
    bar     2
    barfoo  1
ugag    3]])
        
        local a = 1
    end)
    end)