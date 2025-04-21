# ███      ████████  ███   ███  ███
# ███      ███        ███ ███   ███
# ███      ███████     █████    ███
# ███      ███        ███ ███   ███
# ███████  ████████  ███   ███  ███

import std/[strformat, strutils, tables, macros]
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
        ◆not,
        ◆and,
        ◆or,
        ◆true,
        ◆false,
        ◆null,
        ◆number,
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
        ◆dot,
        ◆doubledot,
        ◆tripledot,
        ◆increment,
        ◆decrement,
        ◆minus,
        ◆plus,
        ◆divide,
        ◆multiply,
        ◆assign,
        ◆plus_assign,
        ◆minus_assign,
        ◆divide_assign,
        ◆multiply_assign,
        ◆equal,
        ◆not_equal,
        ◆less_equal,
        ◆greater_equal,
        ◆greater,
        ◆less,
        ◆proc,
        ◆var,
        ◆val,
        ◆let,
        ◆test,
        ◆type, # not really a token, used by pars to mark type annotations
        ◆, # block
        ◆eof
        
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
        ".":        ◆dot,
        "..":       ◆doubledot,
        "...":      ◆tripledot,
        ",":        ◆comma,
        ":":        ◆colon,
        "'":        ◆string_start,
        "\"":       ◆string_start,
        "\"\"\"":   ◆string_start,
        ";":        ◆semicolon,
        "{":        ◆bracket_open,
        "}":        ◆bracket_close,
        "(":        ◆paren_open,
        ")":        ◆paren_close,
        "[":        ◆square_open,
        "]":        ◆square_close,
        "-":        ◆minus,
        "+":        ◆plus,
        "++":       ◆increment,
        "--":       ◆decrement,
        "*":        ◆multiply,
        "/":        ◆divide,
        "=":        ◆assign,
        "+=":       ◆plus_assign,
        "-=":       ◆minus_assign,
        "/=":       ◆divide_assign,
        "*=":       ◆multiply_assign,
        "=":        ◆assign,
        "#":        ◆comment_start,
        "==":       ◆equal,
        "!=":       ◆not_equal,
        ">=":       ◆greater_equal,
        "<=":       ◆less_equal,
        ">":        ◆greater,
        "<":        ◆less,
        "&&":       ◆and,
        "||":       ◆or,
        "!":        ◆not,
        "->":       ◆func,
        "=>":       ◆func,
        "⮐":        ◆return,
        "➜":        ◆then,
        "▸":        ◆test,
        "▪":        ◆val,
        "□":        ◆val,
        "◆":        ◆var,    
        "◇":        ◆var,    
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
        "or":       ◆or,
        "and":      ◆and,
        "not":      ◆not,
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

import pegs

proc isNumber*(str:string, next:string): bool =

    if not (str =~ peg"\d"):
        return  false

    let numberPeg = peg"""
        num   <- ^( hex / oct / bin / flt / dec )$
        hex   <- '0x' [0-9a-fA-F]+
        oct   <- '0o' [0-7]+
        bin   <- '0b' [0-1]+
        exp   <- ('e' / 'E') ('+' / '-')? \d+
        flt   <- \d+ '.' \d+ exp?
        dec   <- \d+ exp?
        """
    
    if str =~ numberPeg:
        if next == "" or next == " ":
            return  true
        let combined = str & next
        if not (combined =~ numberPeg):
            return  true
    false

proc tokenize*(lines:seq[string]) : seq[Token] =

    var tokens    = default seq[Token]
    var openStack = default seq[tok]
    var token : Token
    var inStripol = false
    var inMultiLineComment = false

    for index,line in lines:

        let firstLineTokenIndex = tokens.len
        var col = 0
        token = Token(line:index, col:col)
        let segs = kseg line
        
        while col < segs.len:
                    
            proc pushToken(str="", tk=◆name) =
                if token.str.len:
                    tokens.add token
                # else
                #     echo &"skip adding current token {token}"
                token = Token(str:str, tok:tk, line:index, col:col)
                
            if tokens.len :
            
                var topTok = tokens[^1]
                
                if topTok.tok == ◆string_start or topTok.tok == ◆stripol_end:
            
                    # token.tok = ◆string
                    var delimiter = topTok.str
                    
                    # echo &"delimiter {delimiter}"
                    
                    if topTok.tok == ◆stripol_end:
                        delimiter = "\"" # 𝜏𝖍𝚒𝖘 𝚒𝖘 ⟒ɼ⊚∩𝚐! ϝϵ𝜏⊂𝖍 ⊂⊚ɼɼϵ⊂𝜏 𝒹ϵ⟅𝚒⫙𝚒𝜏ϵɼ!
                    
                    proc isAtStringEnd() : bool =
                        # echo &"isAtStringEnd {delimiter}"
                        if delimiter.len == 3:
                            col <= segs.len-3 and segs[col..col+2].join("") == delimiter
                        else:
                            col <= segs.len-1 and segs[col] == delimiter
                                    
                    while not isAtStringEnd():
                        token.tok = ◆string
                        if segs[col] == "\\":
                            token.str &= segs[col]
                            col += 1
                            token.str &= segs[col]
                            col += 1
                            continue
                        if segs[col] == "#" and delimiter in @["\"", "\"\"\""] and col < segs.len-1 and segs[col+1] == "{":
                            pushToken("#{", ◆stripol_start)
                            col += 2
                            pushToken()
                            inStripol = true  
                            break
                        token.str &= segs[col]
                        col += 1
                                
                    if inStripol:
                        continue
                    
                    # echo &"push delimiter {delimiter} {col} ◆string_end {token}"
                    pushToken(delimiter, ◆string_end)
                    col += delimiter.len
                    pushToken()
                    # echo &"top delimiter {tokens[^1]}"
                    
                    if col > segs.len-1:
                        break
                    else:
                        # col += 1
                        continue
                
                if inMultiLineComment:
                    token.tok = ◆comment
                    while col <= segs.len-1 and (col >= segs.len-2 or segs[col..col+2].join("") != "###"):
                        token.str &= segs[col]
                        col += 1
                    if col < segs.len-1:
                        pushToken("###", ◆comment_end)
                        col += 3
                        pushToken()
                        inMultiLineComment = false
                        continue
                    else:
                        pushToken("", ◆comment)
                    break
                
                if topTok.tok == ◆comment_start:
                
                    if col == topTok.col+1 and col < segs.len-1 and segs[col] == "#" and segs[col+1] == "#":
                        topTok.str = "###"
                        tokens.pops()
                        tokens.push topTok
                        col += 2
                        token.col += 2
                        inMultiLineComment = true
                        continue
                
                    token.tok = ◆comment
                    token.str &= segs[col..^1].join ""
                    break
            
            let char = segs[col]
                        
            if char == " ":
                if tokens.len == firstLineTokenIndex and token.str.len == 0 or token.tok == ◆indent:
                    token.tok = ◆indent
                    token.str.add char
                elif col == 0 or segs[col-1] != " ":
                    pushToken()
            else:
                
                if col > 0 and segs[col-1] == " ":
                    if token.tok == ◆indent:
                        pushToken()
                    token.col = col
                
                if col < segs.len-1:
                    
                    let next = segs[col+1]
                    
                    if col < segs.len-2:
                        let nextnext = segs[col+2]
                        if charTok.hasKey char & next & nextnext:
                            pushToken(char & next & nextnext, charTok[char & next & nextnext])
                            col += 3
                            pushToken()
                            continue
                    
                    if charTok.hasKey char & next:
                        pushToken(char & next, charTok[char & next])
                        col += 2
                        pushToken()
                        continue
                        
                if charTok.hasKey char:
                
                    if charTok[char] in openToks:
                        openStack.push(charTok[char])
                    elif charTok[char] in closeToks:
                        if openStack.len and openStack[^1] == closeOpen[charTok[char]]:
                            openStack.pops()
                        elif charTok[char] == ◆bracket_close and inStripol:
                            inStripol = false
                            pushToken(char, ◆stripol_end)
                            col += 1
                            pushToken()
                            token.tok = ◆string
                            continue
                            
                    if charTok[char] == ◆test:
                        if tokens.len == 0 or tokens[^1].tok == ◆indent:
                            token.tok = ◆test
                            while col <= segs.len-1:
                                token.str &= segs[col]
                                col += 1
                            pushToken()
                            continue
                
                    pushToken(char, charTok[char])
                    col += 1
                    pushToken()
                    continue
                else:
                    token.str.add char
                    
                    var next : string
                    if col < segs.len-1 :
                        next = segs[col+1] 
                    else :
                        next = ""
                        
                    if isNumber(token.str, next):
                        token.tok = ◆number
                        pushToken()
                    
                    if keywords.hasKey(token.str) and (col >= segs.len-1 or segs[col+1] == " " or charTok.hasKey(segs[col+1])):
                        token.tok = keywords[token.str]
                        pushToken()
            col += 1
            
        if token.str.len:
            if keywords.hasKey(token.str):
                token.tok = keywords[token.str]
            tokens.add token
        
    return  tokens
    
proc tokenize*(text:string) : seq[Token] =

    tokenize text.splitLines()
    
