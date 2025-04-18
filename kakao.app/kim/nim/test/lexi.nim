# ███      ████████  ███   ███  ███
# ███      ███        ███ ███   ███
# ███      ███████     █████    ███
# ███      ███        ███ ███   ███
# ███████  ████████  ███   ███  ███

import std/[pegs, strutils, strformat, unittest]
import ../kommon
import ../lexi

suite "lexi":

    test "single line":
    
        check tokenize("")  == default seq[Token]
        check tokenize(" ") == @[Token(str:" ", tok:◆indent, line:0, col:0)]
        check tokenize("a") == @[Token(str:"a", tok:◆name,   line:0, col:0)]
        
        check tokenize("    a") == @[
            Token(str:"    ",   tok:◆indent,        line:0, col:0),
            Token(str:"a",      tok:◆name,          line:0, col:4)]
            
        check tokenize("a = b") == @[
            Token(str:"a",      tok:◆name,          line:0, col:0),
            Token(str:"=",      tok:◆assign,        line:0, col:2),
            Token(str:"b",      tok:◆name,          line:0, col:4)]
    
        check tokenize("a == b") == @[
            Token(str:"a",      tok:◆name,          line:0, col:0),
            Token(str:"==",     tok:◆equal,         line:0, col:2),
            Token(str:"b",      tok:◆name,          line:0, col:5)]
        
        check tokenize("a != b") == @[
            Token(str:"a",      tok:◆name,          line:0, col:0),
            Token(str:"!=",     tok:◆not_equal,     line:0, col:2),
            Token(str:"b",      tok:◆name,          line:0, col:5)]

        check tokenize("a >= b") == @[
            Token(str:"a",      tok:◆name,          line:0, col:0),
            Token(str:">=",     tok:◆greater_equal, line:0, col:2),
            Token(str:"b",      tok:◆name,          line:0, col:5)]

        check tokenize("a <= b") == @[
            Token(str:"a",      tok:◆name,          line:0, col:0),
            Token(str:"<=",     tok:◆less_equal,    line:0, col:2),
            Token(str:"b",      tok:◆name,          line:0, col:5)]

        check tokenize("a < b ; c > d") == @[
            Token(str:"a",      tok:◆name,          line:0, col:0),
            Token(str:"<",      tok:◆less,          line:0, col:2),
            Token(str:"b",      tok:◆name,          line:0, col:4),
            Token(str:";",      tok:◆semicolon,     line:0, col:6),
            Token(str:"c",      tok:◆name,          line:0, col:8), 
            Token(str:">",      tok:◆greater,       line:0, col:10), 
            Token(str:"d",      tok:◆name,          line:0, col:12)]
            
        check tokenize("a_c, d23") == @[
            Token(str:"a_c",    tok:◆name,          line:0, col:0),
            Token(str:",",      tok:◆comma,         line:0, col:3),
            Token(str:"d23",    tok:◆name,          line:0, col:5)
            ]

        check tokenize("if true") == @[
            Token(str:"if",     tok:◆if,            line:0, col:0),
            Token(str:"true",   tok:◆true,          line:0, col:3)
            ]
            
        check tokenize("iforintruefalse") == @[Token(str:"iforintruefalse", tok:◆name, line:0, col:0)]
        check tokenize("ifor intrue falselse") == @[
            Token(str:"ifor",   tok:◆name,          line:0, col:0),
            Token(str:"intrue", tok:◆name,          line:0, col:5),
            Token(str:"falselse", tok:◆name,        line:0, col:12)
            ]
            
    # ██     ██  ███   ███  ███      █████████  ███
    # ███   ███  ███   ███  ███         ███     ███
    # █████████  ███   ███  ███         ███     ███
    # ███ █ ███  ███   ███  ███         ███     ███
    # ███   ███   ███████   ███████     ███     ███

    test "multi line":

        check tokenize("if false\n    null") == @[
            Token(str:"if",     tok:◆if,            line:0, col:0),
            Token(str:"false",  tok:◆false,         line:0, col:3),
            Token(str:"    ",   tok:◆indent,        line:1, col:0),
            Token(str:"null",   tok:◆null,          line:1, col:4),
            ]

        check tokenize("for i in l\n    ⮐  i") == @[
            Token(str:"for",    tok:◆for,           line:0, col:0),
            Token(str:"i",      tok:◆name,          line:0, col:4),
            Token(str:"in",     tok:◆in,            line:0, col:6),
            Token(str:"l",      tok:◆name,          line:0, col:9),
            Token(str:"    ",   tok:◆indent,        line:1, col:0),
            Token(str:"⮐",      tok:◆return,        line:1, col:4),
            Token(str:"i",      tok:◆name,          line:1, col:7),
            ]

        check tokenize("for x,y in l\n  if x ➜ y\n  else z") == @[
            Token(str:"for",    tok:◆for,           line:0, col:0),
            Token(str:"x",      tok:◆name,          line:0, col:4),
            Token(str:",",      tok:◆comma,         line:0, col:5),
            Token(str:"y",      tok:◆name,          line:0, col:6),
            Token(str:"in",     tok:◆in,            line:0, col:8),
            Token(str:"l",      tok:◆name,          line:0, col:11),
            Token(str:"  ",     tok:◆indent,        line:1, col:0),
            Token(str:"if",     tok:◆if,            line:1, col:2),
            Token(str:"x",      tok:◆name,          line:1, col:5),
            Token(str:"➜",      tok:◆then,          line:1, col:7),
            Token(str:"y",      tok:◆name,          line:1, col:9),
            Token(str:"  ",     tok:◆indent,        line:2, col:0),
            Token(str:"else",   tok:◆else,          line:2, col:2),
            Token(str:"z",      tok:◆name,          line:2, col:7),
            ]

    #  ███████  █████████  ████████   ███  ███   ███   ███████    ███████
    # ███          ███     ███   ███  ███  ████  ███  ███        ███     
    # ███████      ███     ███████    ███  ███ █ ███  ███  ████  ███████ 
    #      ███     ███     ███   ███  ███  ███  ████  ███   ███       ███
    # ███████      ███     ███   ███  ███  ███   ███   ███████   ███████ 

    test "strings":
    
        check tokenize("a = 'if'") == @[
            Token(str:"a",      tok:◆name,          line:0, col:0),
            Token(str:"=",      tok:◆assign,        line:0, col:2),
            Token(str:"'",      tok:◆string_start,  line:0, col:4),
            Token(str:"if",     tok:◆string,        line:0, col:5),
            Token(str:"'",      tok:◆string_end,    line:0, col:7),
            ]

        check tokenize("'if then it\\'s = 2'") == @[
            Token(str:"'",      tok:◆string_start,  line:0, col:0),
            Token(str:"if then it\\'s = 2", tok:◆string,  line:0, col:1),
            Token(str:"'",      tok:◆string_end,    line:0, col:18),
            ]

        check tokenize("\"'\"") == @[
            Token(str:"\"",     tok:◆string_start,  line:0, col:0),
            Token(str:"'",      tok:◆string,        line:0, col:1),
            Token(str:"\"",     tok:◆string_end,    line:0, col:2),
            ]
            
        check tokenize("\"'\" \"'\\\"'\"") == @[
            Token(str:"\"",     tok:◆string_start,  line:0, col:0),
            Token(str:"'",      tok:◆string,        line:0, col:1),
            Token(str:"\"",     tok:◆string_end,    line:0, col:2),
            Token(str:"\"",     tok:◆string_start,  line:0, col:4),
            Token(str:"'\\\"'", tok:◆string,        line:0, col:5),
            Token(str:"\"",     tok:◆string_end,    line:0, col:9),
            ]
            
    #  ███████  █████████  ████████   ███  ████████    ███████   ███    
    # ███          ███     ███   ███  ███  ███   ███  ███   ███  ███    
    # ███████      ███     ███████    ███  ████████   ███   ███  ███    
    #      ███     ███     ███   ███  ███  ███        ███   ███  ███    
    # ███████      ███     ███   ███  ███  ███         ███████   ███████

    test "stripol":
    
        check tokenize("'#{}'") == @[
            Token(str:"'",      tok:◆string_start,  line:0, col:0),
            Token(str:"#{}",    tok:◆string,        line:0, col:1),
            Token(str:"'",      tok:◆string_end,    line:0, col:4),
            ]

        check tokenize("\"#{}\"") == @[
            Token(str:"\"",     tok:◆string_start,  line:0, col:0),
            Token(str:"#{",     tok:◆stripol_start, line:0, col:1),
            Token(str:"}",      tok:◆stripol_end,   line:0, col:3),
            Token(str:"\"",     tok:◆string_end,    line:0, col:4),
            ]

        check tokenize("\"#{a}\"") == @[
            Token(str:"\"",     tok:◆string_start,  line:0, col:0),
            Token(str:"#{",     tok:◆stripol_start, line:0, col:1),
            Token(str:"a",      tok:◆name,          line:0, col:3),
            Token(str:"}",      tok:◆stripol_end,   line:0, col:4),
            Token(str:"\"",     tok:◆string_end,    line:0, col:5),
            ]

        check tokenize("\"#{abc}\"") == @[
            Token(str:"\"",     tok:◆string_start,  line:0, col:0),
            Token(str:"#{",     tok:◆stripol_start, line:0, col:1),
            Token(str:"abc",    tok:◆name,          line:0, col:3),
            Token(str:"}",      tok:◆stripol_end,   line:0, col:6),
            Token(str:"\"",     tok:◆string_end,    line:0, col:7),
            ]

        check tokenize("\"#{a}#{b}\"") == @[
            Token(str:"\"",     tok:◆string_start,  line:0, col:0),
            Token(str:"#{",     tok:◆stripol_start, line:0, col:1),
            Token(str:"a",      tok:◆name,          line:0, col:3),
            Token(str:"}",      tok:◆stripol_end,   line:0, col:4),
            Token(str:"#{",     tok:◆stripol_start, line:0, col:5),
            Token(str:"b",      tok:◆name,          line:0, col:7),
            Token(str:"}",      tok:◆stripol_end,   line:0, col:8),
            Token(str:"\"",     tok:◆string_end,    line:0, col:9),
            ]
          
    # ███████    ████████    ███████    ███████  ███   ███  ████████  █████████   ███████
    # ███   ███  ███   ███  ███   ███  ███       ███  ███   ███          ███     ███     
    # ███████    ███████    █████████  ███       ███████    ███████      ███     ███████ 
    # ███   ███  ███   ███  ███   ███  ███       ███  ███   ███          ███          ███
    # ███████    ███   ███  ███   ███   ███████  ███   ███  ████████     ███     ███████ 

    test "brackets  ":
    
        check tokenize("{()}[{}]") == @[
            Token(str:"{",     tok:◆bracket_open,  line:0, col:0),
            Token(str:"(",     tok:◆paren_open,    line:0, col:1),
            Token(str:")",     tok:◆paren_close,   line:0, col:2),
            Token(str:"}",     tok:◆bracket_close, line:0, col:3),
            Token(str:"[",     tok:◆square_open,   line:0, col:4),
            Token(str:"{",     tok:◆bracket_open,  line:0, col:5),
            Token(str:"}",     tok:◆bracket_close, line:0, col:6),
            Token(str:"]",     tok:◆square_close,  line:0, col:7),
            ]

        check tokenize(")}]") == @[
            Token(str:")",     tok:◆paren_close,   line:0, col:0),
            Token(str:"}",     tok:◆bracket_close, line:0, col:1),
            Token(str:"]",     tok:◆square_close,  line:0, col:2),
            ]

        check tokenize("[{(") == @[
            Token(str:"[",     tok:◆square_open,   line:0, col:0),
            Token(str:"{",     tok:◆bracket_open,  line:0, col:1),
            Token(str:"(",     tok:◆paren_open,    line:0, col:2),
            ]
    
    #  ███████   ███████   ██     ██  ██     ██  ████████  ███   ███  █████████   ███████
    # ███       ███   ███  ███   ███  ███   ███  ███       ████  ███     ███     ███     
    # ███       ███   ███  █████████  █████████  ███████   ███ █ ███     ███     ███████ 
    # ███       ███   ███  ███ █ ███  ███ █ ███  ███       ███  ████     ███          ███
    #  ███████   ███████   ███   ███  ███   ███  ████████  ███   ███     ███     ███████ 

    test "comments":
    
        check tokenize("#") == @[
            Token(str:"#",        tok:◆comment_start, line:0, col:0),
            ]

        check tokenize("# if true") == @[
            Token(str:"#",        tok:◆comment_start, line:0, col:0),
            Token(str:" if true", tok:◆comment,       line:0, col:1),
            ]

        check tokenize("### if\n    true###") == @[
            Token(str:"###",      tok:◆comment_start, line:0, col:0),
            Token(str:" if",      tok:◆comment,       line:0, col:3),
            Token(str:"    true", tok:◆comment,       line:1, col:0),
            Token(str:"###",      tok:◆comment_end,   line:1, col:8),
            ]
            
            
    #  ███████   ████████   ████████  ████████    ███████   █████████   ███████   ████████    ███████
    # ███   ███  ███   ███  ███       ███   ███  ███   ███     ███     ███   ███  ███   ███  ███     
    # ███   ███  ████████   ███████   ███████    █████████     ███     ███   ███  ███████    ███████ 
    # ███   ███  ███        ███       ███   ███  ███   ███     ███     ███   ███  ███   ███       ███
    #  ███████   ███        ████████  ███   ███  ███   ███     ███      ███████   ███   ███  ███████ 

    test "operators":
    
        check tokenize("a += 123") == @[
            Token(str:"a",   tok:◆name,        line:0, col:0),
            Token(str:"+=",  tok:◆plus_assign, line:0, col:2),
            Token(str:"123", tok:◆number,      line:0, col:5),
            ]

        check tokenize("b -= 456") == @[
            Token(str:"b",   tok:◆name,         line:0, col:0),
            Token(str:"-=",  tok:◆minus_assign, line:0, col:2),
            Token(str:"456", tok:◆number,       line:0, col:5),
            ]

        check tokenize("x /= y") == @[
            Token(str:"x",   tok:◆name,          line:0, col:0),
            Token(str:"/=",  tok:◆divide_assign, line:0, col:2),
            Token(str:"y",   tok:◆name,          line:0, col:5),
            ]

        check tokenize("x *= y") == @[
            Token(str:"x",   tok:◆name,            line:0, col:0),
            Token(str:"*=",  tok:◆multiply_assign, line:0, col:2),
            Token(str:"y",   tok:◆name,            line:0, col:5),
            ]
        
    # ███   ███  ███   ███  ██     ██  ███████    ████████  ████████    ███████
    # ████  ███  ███   ███  ███   ███  ███   ███  ███       ███   ███  ███     
    # ███ █ ███  ███   ███  █████████  ███████    ███████   ███████    ███████ 
    # ███  ████  ███   ███  ███ █ ███  ███   ███  ███       ███   ███       ███
    # ███   ███   ███████   ███   ███  ███████    ████████  ███   ███  ███████ 

    test "numbers":
    
        check isNumber("123",       "4") == false
        check isNumber("1234",      "+") == true
        check isNumber("0xFF",      "F") == false
        check isNumber("0xFF",      "G") == true
        check isNumber("3.14",      "")  == true
        check isNumber("3.14",      "x") == true
        check isNumber("1e5",       "")  == true
        check isNumber("1e+5",      "")  == true
        check isNumber("1e-5",      "")  == true
        check isNumber("0b101",     "0") == false
        check isNumber("0b101",     "2") == true
        check isNumber("0o755",     "7") == false
        check isNumber("0o755",     "8") == true
        
    # ███████     ███████   █████████   ███████
    # ███   ███  ███   ███     ███     ███     
    # ███   ███  ███   ███     ███     ███████ 
    # ███   ███  ███   ███     ███          ███
    # ███████     ███████      ███     ███████ 

    test "dots":
    
        check tokenize(".")   == @[ Token(str:".",   tok:◆dot,       line:0, col:0) ]
        check tokenize("..")  == @[ Token(str:"..",  tok:◆doubledot, line:0, col:0) ]
        check tokenize("...") == @[ Token(str:"...", tok:◆tripledot, line:0, col:0) ]
        
        check tokenize("for i in 0..10") == @[ 
            Token(str:"for",   tok:◆for,       line:0, col:0), 
            Token(str:"i",     tok:◆name,      line:0, col:4), 
            Token(str:"in",    tok:◆in,        line:0, col:6), 
            Token(str:"0",     tok:◆number,    line:0, col:9),
            Token(str:"..",    tok:◆doubledot, line:0, col:10),
            Token(str:"10",    tok:◆number,    line:0, col:12) 
            ]
        
