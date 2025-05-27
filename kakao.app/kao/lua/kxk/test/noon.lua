--[[
    ███   ███   ███████    ███████   ███   ███
    ████  ███  ███   ███  ███   ███  ████  ███
    ███ █ ███  ███   ███  ███   ███  ███ █ ███
    ███  ████  ███   ███  ███   ███  ███  ████
    ███   ███   ███████    ███████   ███   ███
--]]

kxk = require "kxk/kxk"
noon = require "kxk/noon"

test("noon", function()
    --  ███████  █████████  ████████   ███  ███   ███   ███████   ███  ████████  ███   ███
    -- ███          ███     ███   ███  ███  ████  ███  ███        ███  ███        ███ ███ 
    -- ███████      ███     ███████    ███  ███ █ ███  ███  ████  ███  ██████      █████  
    --      ███     ███     ███   ███  ███  ███  ████  ███   ███  ███  ███          ███   
    -- ███████      ███     ███   ███  ███  ███   ███   ███████   ███  ███          ███   
    
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
        
        test.cmp(noon.stringify({["key with    some    spaces  ."] = "value"}), "|key with    some    spaces  .|  value")
        
        test.cmp(noon.stringify({a12345678901234567890123456789001234567890 = 1, 
                         a123 = 0.5, 
                         b123456789012345678901234567890 = 2
                         }), [[
a123                              0.5
a12345678901234567890123456789001234567890  1
b123456789012345678901234567890   2]])
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
        
        test.cmp(noon.stringify({a = array("a  b", "1   3", "   c    d  e   ")}), [[
a
    |a  b|
    |1   3|
    |   c    d  e   |]])
    end)
    
    test("trim", function()
        local o = {a = 1, b = nil, c = 2}
        
        test.cmp(noon.stringify(o), [[
a   1
c   2]])
        
        test.cmp(noon.stringify({a = {b = {c = 1}}}), [[
a
    b
        c   1]])
    end)
    
    test("object", function()
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
        
        --# ████████    ███████   ████████    ███████  ████████
        --# ███   ███  ███   ███  ███   ███  ███       ███     
        --# ████████   █████████  ███████    ███████   ███████ 
        --# ███        ███   ███  ███   ███       ███  ███     
        --# ███        ███   ███  ███   ███  ███████   ████████
        --        
        --▸ parse
    end)
    
    --▸ number
    --    
    --    noon.parse "666" ▸ [666]
    --    
    --    noon.parse "1.23" ▸ [1.23]
    --    
    --    noon.parse "0.000" ▸ [0]
    --    
    --    noon.parse "Infinity" ▸ [Infinity]
    --    
    --    noon.parse """ 
    --    42
    --    66.0
    --    0.42
    --    66.60
    --    Infinity
    --    +20
    --    -20
    --    +0
    --    -1.23
    --    """ ▸ 
    --    [42,66,0.42,66.6,Infinity,20,-20,0,-1.23]
    
    --▸ bool
    --    
    --    noon.parse "true" ▸ [true]
    --    
    --    noon.parse """
    --    true
    --    false
    --    """ ▸
    --    [true,false]
    --    
    --▸ null
    --    
    --    noon.parse """
    --    nil
    --    """ ▸ [nil]
    --    
    --▸ string
    --    
    --    noon.parse "hello world" ▸ ['hello world']
    --    noon.parse "| hello world |" ▸ [' hello world ']
    --    noon.parse('| .  ... |  ') ▸ [' .  ... ']
    --    noon.parse "|66.6000|" ▸ ['66.6000']
    --    noon.parse "6.6.6" ▸ ['6.6.6']
    --    noon.parse "^1.2" ▸ ['^1.2']
    --    noon.parse "++2" ▸ ['++2']
    --    noon.parse "+-0" ▸ ['+-0']
    --    noon.parse('... \n line 1 \n line 2 \n ...') ▸ ['line 1\nline 2']
    --    
    --▸ list
    --    
    --    noon.parse("""
    --    a
    --    a1
    --    a 1
    --    """) ▸ ['a', 'a1', 'a 1']
    --    
    --    noon.parse("""
    --    ,
    --    .
    --    ;
    --    :
    --    ~
    --    !
    --    ?
    --    @
    --    |#
    --    ||
    --    """) ▸ [',' '.' ';' ':' '~' '!' '?' '@' '#' '']
    --    
    --    noon.parse("""
    --    key
    --        ,
    --        .
    --        ;
    --        :
    --        ~
    --        !
    --        ?
    --        @
    --        |#
    --        ||
    --    """)  ▸ {key:[',' '.' ';' ':' '~' '!' '?' '@' '#' '']}
    --    
    --▸ object
    --    
    --    noon.parse """
    --    a
    --    b
    --    c  3
    --    """ ▸ { c:3 }
    --    
    --▸ nested lists
    --    
    --    noon.parse """
    --    a
    --    b
    --    .
    --        c
    --        .
    --        .
    --            .
    --        d
    --    .
    --        e
    --        .
    --            f
    --    """ ▸
    --    [
    --        'a'
    --        'b'
    --        ['c', [], [[]],'d']
    --        ['e', ['f']]
    --    ]
    --    
    --▸ nested objects
    --    
    --    noon.parse """
    --    a
    --    b
    --        c
    --        d
    --            e  0
    --        f   1
    --    g
    --    """ ▸ {
    --        a:nil
    --        b: {
    --            c: nil
    --            d: {
    --                e: 0 }
    --            f: 1 }
    --        g: nil }
    --    
    --▸ complex object
    --    
    --    noon.parse """
    --    a
    --        b
    --          c
    --        d
    --    e f
    --        g  h
    --    1  one  two
    --    j
    --        .
    --            k  l
    --        .
    --            .|  true|false
    --    """ ▸ {
    --        a: {
    --            b: ['c']
    --            d: nil }
    --        'e f': {
    --            g: 'h' }
    --        '1': 'one  two'
    --        j: [{k: 'l'}, {'.|':'true|false'}] }
    --   
    --    
    --▸ spaces
    --    o = {a: 1, b: 2}
    --    
    --    noon.parse """
    --    a  1
    --    b  2
    --    """ ▸ o
    --    
    --    noon.parse """
    --     a  1
    --     b  2
    --    """ ▸ o
    --    
    --    noon.parse """
    --        a  1
    --        b  2
    --    """ ▸ o
    --    
    --    noon.parse """
    --    
    --    
    --    a  1
    --    
    --    b  2
    --    
    --    """ ▸ o
    --    
    --    noon.parse """
    --    key      value   with    some    spaces   .
    --    """ ▸
    --    {key: "value   with    some    spaces   ."}
    --    
    --▸ whitespace lines
    --    
    --    o = {a: 1, b: 2}
    --    
    --    noon.parse """
    --    
    --    a  1
    --    
    --    b  2
    --    
    --    """ ▸ o
    --    
    --    noon.parse """
    --    
    --    a  1
    --    
    --    b  2
    --    
    --    """ ▸ o
    
    --▸ escape
    --    
    --    noon.parse """
    --     | 1|
    --     |2 |
    --     | 3 |
    --    """ ▸ 
    --    [' 1', '2 ', ' 3 ']
    --    
    --    noon.parse """
    --    a  | 1  1
    --    b  | 2  2  |
    --    c    3  3  |
    --    d  ||
    --    e  | |
    --    f  |||
    --    g  || | ||
    --    h  |. . .
    --    |i |        1
    --    | j|        2
    --    | k  k |    3
    --    |l |        | l
    --    | m  m |    m m  |
    --    | n  n |    ||||
    --    | o o |
    --    | p   p
    --    | q |  |
    --    ||  |
    --    |r|4
    --    |s|| |
    --    t  |5
    --    |u |6
    --    |.|  .
    --    | |true
    --    |#||#
    --    """ ▸
    --        a: ' 1  1'
    --        b: ' 2  2  '
    --        c: '3  3  '
    --        d: ''
    --        e: ' '
    --        f: '|'
    --        g: '| | |'
    --        h: '. . .'
    --        'i ': 1
    --        ' j': 2
    --        ' k  k ': 3
    --        'l ': ' l'
    --        ' m  m ': 'm m  '
    --        ' n  n ': '||'
    --        ' o o ': null
    --        ' p   p': null
    --        ' q ': ''
    --        '': ''
    --        'r': 4
    --        's': ' '
    --        't': '5'
    --        'u ': 6
    --        '.': '.'
    --        ' ': true
    --        '#': '#'
    --        
    --    noon.parse """
    --    ||      ||
    --    | |     | |
    --    |  |    |  |
    --    | . |   | . |
    --    | .. |  | .. |
    --    | ...   ||
    --    | ....  |.|
    --    | ..... |. |
    --    | .     | . |
    --    | ..    | .. |
    --    """ ▸
    --        ''       :''
    --        ' '      :' '
    --        '  '     :'  '
    --        ' . '    :' . '
    --        ' .. '   :' .. '
    --        ' ...   ':''
    --        ' ....  ':'.'
    --        ' ..... ':'. '
    --        ' .     ':'. '
    --        ' ..    ':'.. '
    --    
    --    noon.parse '... \n| 1 |\n | 2 \n  3  |\n  ...' ▸ [' 1 \n 2\n3  ']
    
    --▸ comment
    --    
    --    noon.parse """
    --    # this is a comment
    --    this is some data
    --    """ ▸
    --    ['this is some data']
    --    
    --    noon.parse """
    --    a  1
    --        #foo
    --    b  2
    --    #b  3
    --    c   4 # 5
    --    d
    --        6 # 7
    --    #
    --    ###
    --    """ ▸
    --        a: 1
    --        b: 2
    --        c: '4 # 5'
    --        d: ['6 # 7']
    --    
    --    noon.parse """
    --    a  1
    --    |#|
    --        |#
    --        | #
    --    """ ▸
    --        a: 1
    --        '#': ['#', ' #']
    
    --▸ empty string
    --    
    --    noon.parse('')  ▸ ''
    --    noon.parse(' ') ▸ ''
    --    noon.parse()    ▸ ''
    
    --▸ failure
    --    
    --    noon.parse """
    --    a   1
    --    b   ...
    --    c   2
    --    """ ▸
    --    undefined
    end)