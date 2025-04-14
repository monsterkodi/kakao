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
    
        check tokenSequence("")  == default seq[Token]
        check tokenSequence(" ") == @[Token(str:" ", tok:◆indent, line:0, col:0)]
        check tokenSequence("a") == @[Token(str:"a", tok:◆name,   line:0, col:0)]
        
        check tokenSequence("    a") == @[
            Token(str:"    ", tok:◆indent,      line:0, col:0),
            Token(str:"a",    tok:◆name,        line:0, col:4)]
            
        check tokenSequence("a = b") == @[
            Token(str:"a",  tok:◆name,          line:0, col:0),
            Token(str:"=",  tok:◆assign,        line:0, col:2),
            Token(str:"b",  tok:◆name,          line:0, col:4)]
    
        check tokenSequence("a == b") == @[
            Token(str:"a",  tok:◆name,          line:0, col:0),
            Token(str:"==", tok:◆equal,         line:0, col:2),
            Token(str:"b",  tok:◆name,          line:0, col:5)]
        
        check tokenSequence("a != b") == @[
            Token(str:"a",  tok:◆name,          line:0, col:0),
            Token(str:"!=", tok:◆not_equal,     line:0, col:2),
            Token(str:"b",  tok:◆name,          line:0, col:5)]

        check tokenSequence("a >= b") == @[
            Token(str:"a",  tok:◆name,          line:0, col:0),
            Token(str:">=", tok:◆greater_equal, line:0, col:2),
            Token(str:"b",  tok:◆name,          line:0, col:5)]

        check tokenSequence("a <= b") == @[
            Token(str:"a",  tok:◆name,          line:0, col:0),
            Token(str:"<=", tok:◆less_equal,    line:0, col:2),
            Token(str:"b",  tok:◆name,          line:0, col:5)]

        check tokenSequence("a < b ; c > d") == @[
            Token(str:"a",  tok:◆name,          line:0, col:0),
            Token(str:"<",  tok:◆less,          line:0, col:2),
            Token(str:"b",  tok:◆name,          line:0, col:4),
            Token(str:";",  tok:◆semicolon,     line:0, col:6),
            Token(str:"c",  tok:◆name,          line:0, col:8), 
            Token(str:">",  tok:◆greater,       line:0, col:10), 
            Token(str:"d",  tok:◆name,          line:0, col:12)]
            
        check tokenSequence("a_c, d23") == @[
            Token(str:"a_c",  tok:◆name,        line:0, col:0),
            Token(str:",",    tok:◆comma,       line:0, col:3),
            Token(str:"d23",  tok:◆name,        line:0, col:5)
            ]

        check tokenSequence("if true") == @[
            Token(str:"if",   tok:◆if,          line:0, col:0),
            Token(str:"true", tok:◆true,        line:0, col:3)
            ]
            
        check tokenSequence("iforintruefalse") == @[Token(str:"iforintruefalse", tok:◆name, line:0, col:0)]
            
    # ██     ██  ███   ███  ███      █████████  ███
    # ███   ███  ███   ███  ███         ███     ███
    # █████████  ███   ███  ███         ███     ███
    # ███ █ ███  ███   ███  ███         ███     ███
    # ███   ███   ███████   ███████     ███     ███

    test "multi line":

        check tokenSequence("if false\n    null") == @[
            Token(str:"if",    tok:◆if,         line:0, col:0),
            Token(str:"false", tok:◆false,      line:0, col:3),
            Token(str:"    ",  tok:◆indent,     line:1, col:0),
            Token(str:"null",  tok:◆null,       line:1, col:4),
            ]

        check tokenSequence("for i in l\n    ⮐  i").deepEqual @[
            Token(str:"for",   tok:◆for,        line:0, col:0),
            Token(str:"i",     tok:◆name,       line:0, col:4),
            Token(str:"in",    tok:◆in,         line:0, col:6),
            Token(str:"l",     tok:◆name,       line:0, col:9),
            Token(str:"    ",  tok:◆indent,     line:1, col:0),
            Token(str:"⮐",     tok:◆return,     line:1, col:4),
            Token(str:"i",     tok:◆name,       line:1, col:7),
            ]
