
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
        ◆true,
        ◆false,
        ◆null,
        ◆int,
        ◆float,
        ◆string,
        ◆try,
        ◆catch,
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
        ◆comma,
        ◆colon,
        ◆semicolon,
        ◆doubledot,
        ◆tripledot,
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
        ",":  ◆comma,
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
        
    keywords = {
        "if":    ◆if,
        "true":  ◆true,
        "false": ◆false,
        "null":  ◆null
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
    var token : Token # = Token()

    for index,line in lines:
        var prev  = ""
        let firstLineTokenIndex = tokens.len
        echo "line: ", line
        var col = 0
        token = Token(line:index, col:col)
        while col < line.len:
            let char = line[col..col]
            # echo &"c[{col}]: {char}"
            
            proc push(str = "", tk = ◆name) =
                if token.str.len:
                    tokens.add token
                token = Token(str:str, tok:tk, line:index, col:col)
            
            if char == " ":
                if tokens.len == firstLineTokenIndex and token.str.len == 0 or token.tok == ◆indent:
                    token.tok = ◆indent
                    token.str.add char
                elif prev != " ":
                    push()
            else:
                let next = line[col+1..col+1]
                if prev == " ":
                    if token.tok == ◆indent:
                        push()
                    token.col = col
                        
                if charTok.hasKey (char & next):
                    push(char & next, charTok[char & next])
                    col += 1
                elif charTok.hasKey char:
                    push(char, charTok[char])
                else:
                    token.str.add char
                    
                    if keywords.hasKey(token.str) and (next == " " or charTok.hasKey(next)):
                        token.tok = keywords[token.str]
                        push()
            col += 1
            prev = char
            
        if token.str.len:
            if keywords.hasKey(token.str):
                token.tok = keywords[token.str]
            tokens.add token
        
    return  tokens
    
proc ast*(text:string) : seq[Token] =

    ast text.splitLines()

dbg alltoks
