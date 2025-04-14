# ███      ████████  ███   ███  ███
# ███      ███        ███ ███   ███
# ███      ███████     █████    ███
# ███      ███        ███ ███   ███
# ███████  ████████  ███   ███  ███

import std/[pegs, strutils, strformat, unittest]
import ../kommon
import ../lexi

suite "lexi":

    test "ast":
    
        check ast("")  == default seq[Token]
        check ast(" ") == @[Token(str:" ", tok:◆indent, line:0, col:0)]
        check ast("a") == @[Token(str:"a", tok:◆name,   line:0, col:0)]
        
        check ast("    a") == @[
            Token(str:"    ", tok:◆indent,      line:0, col:0),
            Token(str:"a",    tok:◆name,        line:0, col:4)]
            
        check ast("a = b") == @[
            Token(str:"a",  tok:◆name,          line:0, col:0),
            Token(str:"=",  tok:◆assign,        line:0, col:2),
            Token(str:"b",  tok:◆name,          line:0, col:4)]
    
        check ast("a == b") == @[
            Token(str:"a",  tok:◆name,          line:0, col:0),
            Token(str:"==", tok:◆equal,         line:0, col:2),
            Token(str:"b",  tok:◆name,          line:0, col:5)]
        
        check ast("a != b") == @[
            Token(str:"a",  tok:◆name,          line:0, col:0),
            Token(str:"!=", tok:◆not_equal,     line:0, col:2),
            Token(str:"b",  tok:◆name,          line:0, col:5)]

        check ast("a >= b") == @[
            Token(str:"a",  tok:◆name,          line:0, col:0),
            Token(str:">=", tok:◆greater_equal, line:0, col:2),
            Token(str:"b",  tok:◆name,          line:0, col:5)]

        check ast("a <= b") == @[
            Token(str:"a",  tok:◆name,          line:0, col:0),
            Token(str:"<=", tok:◆less_equal,    line:0, col:2),
            Token(str:"b",  tok:◆name,          line:0, col:5)]

        check ast("a < b ; c > d") == @[
            Token(str:"a",  tok:◆name,          line:0, col:0),
            Token(str:"<",  tok:◆less,          line:0, col:2),
            Token(str:"b",  tok:◆name,          line:0, col:4),
            Token(str:";",  tok:◆semicolon,     line:0, col:6),
            Token(str:"c",  tok:◆name,          line:0, col:8), 
            Token(str:">",  tok:◆greater,       line:0, col:10), 
            Token(str:"d",  tok:◆name,          line:0, col:12)]
            
        check ast("a_c, d23") == @[
            Token(str:"a_c",  tok:◆name,        line:0, col:0),
            Token(str:",",    tok:◆comma,       line:0, col:3),
            Token(str:"d23",  tok:◆name,        line:0, col:5)
            ]

        check ast("if true") == @[
            Token(str:"if",   tok:◆if,          line:0, col:0),
            Token(str:"true", tok:◆true,        line:0, col:3)
            ]

        check ast("if false\n    null") == @[
            Token(str:"if",    tok:◆if,         line:0, col:0),
            Token(str:"false", tok:◆false,      line:0, col:3),
            Token(str:"    ",  tok:◆indent,     line:1, col:0),
            Token(str:"null",  tok:◆null,       line:1, col:4),
            ]
