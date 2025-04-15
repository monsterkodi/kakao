
import std/[strformat, strutils, tables, macros]
import kommon

# system.pop = kommon.pop
# proc pop*[T](s: var seq[T]): seq[T] {. discardable .} =
# 
#     if s.len > 0:
#         s.setLen(s.len - 1)
#     s

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
        ◆proc,
        ◆var,
        ◆let
        
    toks* = set[tok]
    
const 
    alltoks  = { low(tok)..high(tok) }
    thenable = { ◆if, ◆elif }
    
    openToks  = { ◆paren_open,  ◆bracket_open,  ◆square_open  }
    closeToks = { ◆paren_close, ◆bracket_close, ◆square_close }
    closeOpen = { 
        ◆paren_close:   ◆paren_open, 
        ◆bracket_close: ◆bracket_open,
        ◆square_close:  ◆square_open }.toTable()
    
const
    charTok = {
        ",":  ◆comma,
        ":":  ◆colon,
        "'":  ◆string_start,
        "\"": ◆string_start,
        ";":  ◆semicolon,
        "{":  ◆bracket_open,
        "}":  ◆bracket_close,
        "(":  ◆paren_open,
        ")":  ◆paren_close,
        "[":  ◆square_open,
        "]":  ◆square_close,
        "=":  ◆assign,
        "==": ◆equal,
        "!=": ◆not_equal,
        ">=": ◆greater_equal,
        "<=": ◆less_equal,
        ">":  ◆greater,
        "<":  ◆less,
        "⮐":  ◆return,
        "➜":  ◆then,
        }.toTable()
        
    keywords = {
        "if":       ◆if,
        "in":       ◆in,
        "is":       ◆is,
        "of":       ◆of,
        "for":      ◆for,
        "while":    ◆while,
        "when":     ◆when,
        "then":     ◆then,
        "elif":     ◆elif,
        "else":     ◆else,
        "switch":   ◆switch,
        "break":    ◆break,
        "continue": ◆continue,
        "return":   ◆return,
        "while":    ◆while,
        "class":    ◆class,
        "try":      ◆try,
        "catch":    ◆catch,
        "true":     ◆true,
        "false":    ◆false,
        "null":     ◆null,
        "nil":      ◆null,
        "use":      ◆use,
        "proc":     ◆proc,
        "var":      ◆var,
        "let":      ◆let,
        }.toTable()
    
type
    Token* = object
        str*  : string                      
        tok*  : tok
        line* : int
        col*  : int
    
# █████████   ███████   ███   ███  ████████  ███   ███  ███  ███████  ████████
#    ███     ███   ███  ███  ███   ███       ████  ███  ███     ███   ███     
#    ███     ███   ███  ███████    ███████   ███ █ ███  ███    ███    ███████ 
#    ███     ███   ███  ███  ███   ███       ███  ████  ███   ███     ███     
#    ███      ███████   ███   ███  ████████  ███   ███  ███  ███████  ████████

proc tokenize*(lines:seq[string]) : seq[Token] =

    var tokens    = default seq[Token]
    var openStack = default seq[tok]
    var token : Token
    var inStripol = false

    for index,line in lines:
        var prev  = ""
        let firstLineTokenIndex = tokens.len
        # echo "line: ", line
        var col = 0
        token = Token(line:index, col:col)
        let segs = kseg line
        
        while col < segs.len:
        
            let char = segs[col]
            
            # echo &"c[{col}]: {char}"
            
            proc pushToken(str = "", tk = ◆name) =
                if token.str.len:
                    tokens.add token
                token = Token(str:str, tok:tk, line:index, col:col)
                
            if tokens.len :
            
                let topTok = tokens[^1]
                
                if topTok.tok == ◆string_start or topTok.tok == ◆stripol_end:
            
                    token.tok = ◆string
                    var delimiter = topTok.str
                    if topTok.tok == ◆stripol_end:
                        delimiter = "\""
                    while col < segs.len-1 and segs[col] != delimiter:
                        token.str &= segs[col]
                        if segs[col] == "\\":
                            col += 1
                            token.str &= segs[col]
                        if segs[col] == "#" and delimiter == "\"" and col < segs.len-1 and segs[col+1] == "{":
                            # echo &"delimiter {delimiter} {col} {segs[col]}"
                            token.str &= "{"
                            token.tok = ◆stripol_start
                            pushToken()
                            col += 2
                            prev = segs[col-1]
                            inStripol = true  
                            break
                        col += 1
                                
                    if inStripol:
                        continue
                                
                    pushToken(delimiter, ◆string_end)
                    if col >= segs.len-1:
                        break
                    else:
                        col += 1
                        prev = delimiter
                        continue
                        
            if char == " ":
                if tokens.len == firstLineTokenIndex and token.str.len == 0 or token.tok == ◆indent:
                    token.tok = ◆indent
                    token.str.add char
                elif prev != " ":
                    pushToken()
            else:
                
                if prev == " ":
                    if token.tok == ◆indent:
                        pushToken()
                    token.col = col
                
                if col < segs.len-1:
                    let next = segs[col+1]
                    if charTok.hasKey char & next:
                        pushToken(char & next, charTok[char & next])
                        col += 2
                        pushToken()
                        prev = char
                        continue
                        
                if charTok.hasKey char:
                
                    if charTok[char] in openToks:
                        openStack.push(charTok[char])
                    elif charTok[char] in closeToks:
                        # echo &"closeTok {charTok[char]}"
                        if openStack.len and openStack[^1] == closeOpen[charTok[char]]:
                            echo &"popping! {charTok[char]} {openStack}"
                            openStack.pops()
                        elif charTok[char] == ◆bracket_close and inStripol:
                            # echo "stripol_end!!"
                            inStripol = false
                            pushToken(char, ◆stripol_end)
                            col += 1
                            pushToken()
                            token.tok = ◆string
                            prev = char
                            continue
                        else:
                            echo &"unmatched close? {charTok[char]} {openStack}"
                
                    pushToken(char, charTok[char])
                    col += 1
                    pushToken()
                    prev = char
                    continue
                else:
                    token.str.add char
                    
                    if keywords.hasKey(token.str) and (col >= segs.len-1 or segs[col+1] == " " or charTok.hasKey(segs[col+1])):
                        token.tok = keywords[token.str]
                        pushToken()
            col += 1
            prev = char
            
        if token.str.len:
            if keywords.hasKey(token.str):
                token.tok = keywords[token.str]
            tokens.add token
        
    return  tokens
    
proc tokenize*(text:string) : seq[Token] =

    tokenize text.splitLines()
    
