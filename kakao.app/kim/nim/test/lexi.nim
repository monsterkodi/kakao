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
            
    test "stripol":
    
        check tokenize("'#{}'") == @[
            Token(str:"'",      tok:◆string_start,  line:0, col:0),
            Token(str:"#{}",    tok:◆string,        line:0, col:1),
            Token(str:"'",      tok:◆string_end,    line:0, col:4),
            ]

        check tokenize("\"#{}\"") == @[
            Token(str:"\"",     tok:◆string_start,  line:0, col:0),
            Token(str:"#{",     tok:◆stripol_start, line:0, col:1),
            Token(str:"}",      tok:◆stripol_end,   line:0, col:1),
            Token(str:"\"",     tok:◆string_end,    line:0, col:4),
            ]
            
