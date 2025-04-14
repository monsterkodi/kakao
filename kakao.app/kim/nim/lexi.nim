
import std/[strformat, strutils, tables]
import kommon

type
    tok* = enum
        ◆name,
        ◆if,
        ◆when,
        ◆then,
        ◆elif,
        ◆else,
        ◆switch,
        ◆for,
        ◆in,
        ◆is,
        ◆of,
        ◆break,
        ◆continue,
        ◆while,
        ◆func,
        ◆class,
        ◆return,
        ◆use,
        ◆try,
        ◆catch,
        ◆string,
        ◆string_start,
        ◆string_end,
        ◆this,
        ◆stripol_start,
        ◆stripol_end,
        ◆paren_open,
        ◆paren_close,
        ◆bracket_open,
        ◆bracket_close,
        ◆square_open,
        ◆square_close,
        ◆comment_start,
        ◆comment,
        ◆comment_end,
        ◆indent,
        ◆colon,
        ◆semicolon,
        ◆doubledot,
        ◆tripledot,
        ◆int,
        ◆float,
        ◆newline,
        ◆assign,
        ◆equal,
        ◆not_equal,
        ◆less_equal,
        ◆greater_equal,
        ◆greater,
        ◆less,
        
    toks* = set[tok]
    
const 
    alltoks  = { low(tok)..high(tok) }
    thenable = { ◆if, ◆elif }
    
const
    charTok = {
        ":":  ◆colon,
        ";":  ◆semicolon,
        "{":  ◆bracket_open,
        "}":  ◆bracket_close,
        "(":  ◆paren_open,
        "[":  ◆square_open,
        "]":  ◆square_close,
        "(":  ◆paren_open,
        ")":  ◆paren_close,
        "=":  ◆assign,
        "==": ◆equal,
        "!=": ◆not_equal,
        ">=": ◆greater_equal,
        "<=": ◆less_equal,
        ">":  ◆greater,
        "<":  ◆less
        }.toTable()
    
type
    Token* = object
        str*  : string 
        tok*  : tok
        line* : int
        col*  : int
    
# log "tok:"
# for t in tok:
#     log &"   {t} {ord(t)}"

proc ast*(lines:seq[string]) : seq[Token] =

    var tokens = default seq[Token]
    var token = Token(line:0, col:0)

    for index,line in lines:
        var prev  = ""
        let firstLineTokenIndex = tokens.len
        echo "line: ", line
        var col = 0
        while col < line.len:
            let char = line[col..col]
            echo &"c[{col}]: {char}"
            if char == " ":
                if tokens.len == firstLineTokenIndex and token.str.len == 0 or token.tok == ◆indent:
                    token.tok = ◆indent
                    token.str.add char
                elif prev != " ":
                    tokens.add token
                    token = Token(line:index)
            else:
                let next = line[col+1..col+1]
                if prev == " ":
                    if token.tok == ◆indent:
                        tokens.add token
                        token = Token(line:index)
                    token.col = col
                        
                if charTok.hasKey (char & next):
                    token = Token(str:(char & next), tok:charTok[(char & next)], line:index, col:col)
                    col += 1
                elif charTok.hasKey char:
                    token = Token(str:char, tok:charTok[char], line:index, col:col)
                else:
                    token.str.add char
            col += 1
            prev = char
    if token.str.len:
        tokens.add token
    return  tokens
    
proc ast*(text:string) : seq[Token] =

    ast text.splitLines()

dbg alltoks
