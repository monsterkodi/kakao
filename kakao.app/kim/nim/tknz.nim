# █████████  ███   ███  ███   ███  ███████
#    ███     ███  ███   ████  ███     ███ 
#    ███     ███████    ███ █ ███    ███  
#    ███     ███  ███   ███  ████   ███   
#    ███     ███   ███  ███   ███  ███████

import std/[strutils, strformat, tables, enumutils, sets]
import kommon

type
    tok* = enum
        ◆name,
        # keywords
        ◆if,
        ◆when,
        ◆then               = "➜"
        ◆elif,
        ◆else,
        ◆switch,
        ◆while,
        ◆for,
        ◆in,
        ◆is,
        ◆of,
        ◆break,
        ◆continue,
        ◆class,
        ◆use,
        ◆try,
        ◆catch,
        ◆let,
        ◆var                = "◆"
        ◆val                = "◇"
        ◆not                = "!" 
        ◆and                = "&&" 
        ◆or                 = "||" 
        ◆true               = "✔"  
        ◆false              = "✘"  
        ◆null               = "nil"
        ◆func               = "->"
        ◆proc               = "=>"
        ◆return             = "⮐"
        # literals
        ◆number,
        ◆string,
        ◆string_start       = "'"
        ◆string_end,
        ◆stripol_start      = "#{"
        ◆stripol_end,
        
        ◆comment_start      = "#"
        ◆comment,
        ◆comment_end,
        # punct
        ◆paren_open         = "("
        ◆paren_close        = ")"       
        ◆bracket_open       = "{"
        ◆bracket_close      = "}"       
        ◆square_open        = "["       
        ◆square_close       = "]"        
        ◆comma              = ","
        ◆colon              = ":"
        ◆semicolon          = ";"
        ◆dot                = "."
        ◆doubledot          = ".."
        ◆tripledot          = "..."
        ◆minus              = "-"  
        ◆plus               = "+"  
        ◆increment          = "++" 
        ◆decrement          = "--" 
        ◆divide             = "/"
        ◆multiply           = "*"
        ◆assign             = "="
        ◆plus_assign        = "+="
        ◆minus_assign       = "-="
        ◆divide_assign      = "/="
        ◆multiply_assign    = "*="
        ◆equal              = "=="
        ◆not_equal          = "!="
        ◆less_equal         = "<="
        ◆greater_equal      = ">="
        ◆greater            = ">"
        ◆less               = "<"
        ◆test               = "▸"
        ◆type, # not really a token, used by pars to mark type annotations
        ◆, # block
        ◆indent,
        ◆eof
        
    toks* = set[tok]

var keywords = initTable[string, tok]()
for kt in { ◆if..◆return }:
    keywords[symbolName(kt)[3..^1]] = kt
keywords["nil"] = ◆null

var punct = initTable[string, tok]()
for kt in { ◆if..◆test }:
    if symbolName(kt) != $kt:
        punct[$kt] = kt
punct["\""]     = ◆string_start
punct["\"\"\""] = ◆string_start

const 
    openToks  = { ◆paren_open,  ◆bracket_open,  ◆square_open  }
    closeToks = { ◆paren_close, ◆bracket_close, ◆square_close }
    closeOpen = { 
        ◆paren_close:   ◆paren_open, 
        ◆bracket_close: ◆bracket_open,
        ◆square_close:  ◆square_open }.toTable()
        
type
    Token* = object
        str*  : string                      
        tok*  : tok                
        line* : int
        col*  : int
        
    Tknzr* = object
        tokens      : seq[Token]
        openStack   : seq[tok]
        token       : Token
        inStripol   : bool
        inComment   : bool
        delimiter   : string
        segi        : int
        index       : int
        segs        : seq[string]
    
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
    
proc tokenize*(graphemes:seq[string]) : seq[Token] =

    var tokens    = default seq[Token]
    var openStack = default seq[tok]
    
    var token : Token
    
    var inStripol = false
    var inComment = false
    var delimiter = ""
    
    var segi  = 0
    var index = 0
    var segs  : seq[string]
    
    while segi < graphemes.len:
        
        if graphemes[segi] == "\n":
            index += 1
            segi += 1
            continue
        
        segs = @[]
        
        while segi < graphemes.len and graphemes[segi] != "\n":
            segs.add graphemes[segi]
            segi += 1
        
        let firstLineTokenIndex = tokens.len
        var col = 0
        token = Token(line:index, col:col)
        
        while col < segs.len:
                    
            proc pushToken(str="", tk=◆name, incr=0) =
                if token.str.len:
                    tokens.add token
                token = Token(str:str, tok:tk, line:index, col:col)
                col += incr
                
            proc commit(str="", tk=◆name, incr=0) = 
                pushToken(str, tk, incr)
                pushToken()
                
            proc advance(n=1) =
                for s in 0..<n :
                    token.str &= segs[col]
                    col += 1
                
            if tokens.len :
            
                var topTok = tokens[^1]
                
                if topTok.tok == ◆string_start:
                    delimiter = topTok.str
                
                if topTok.tok == ◆string_start or topTok.tok == ◆stripol_end:
            
                    proc isAtStringEnd() : bool =
                        if col > segs.len-1 :
                            return  true
                        if delimiter.len == 3:
                            col <= segs.len-3 and segs[col..col+2].join("") == delimiter
                        else:
                            col <= segs.len-1 and segs[col] == delimiter
                                    
                    while not isAtStringEnd():
                    
                        token.tok = ◆string
                        
                        if segs[col] == "\\":
                            advance 2
                            continue
                            
                        if segs[col] == "#" and delimiter in @["\"", "\"\"\""] and col < segs.len-1 and segs[col+1] == "{":
                            commit("#{", ◆stripol_start, 2)
                            inStripol = true  
                            break
                        
                        advance 1    
                                
                    if inStripol:
                        continue
                    
                    if col <= segs.len-1 :
                        commit(delimiter, ◆string_end, delimiter.len)
                    
                    if col > segs.len-1:
                        break
                    else:
                        continue
                
                if inComment:
                    token.tok = ◆comment
                    while col <= segs.len-1 and (col >= segs.len-2 or segs[col..col+2].join("") != "###"):
                        advance 1
                    if col < segs.len-1:
                        commit("###", ◆comment_end, 3)
                        inComment = false
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
                        inComment = true
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
                        if punct.hasKey char & next & nextnext:
                            commit(char & next & nextnext, punct[char & next & nextnext], 3)
                            if tokens[^1].tok == ◆string_start:
                                token.tok = ◆string
                            continue
                    
                    if punct.hasKey char & next:
                        commit(char & next, punct[char & next], 2)
                        continue
                        
                if punct.hasKey char:
                
                    if punct[char] in openToks:
                        openStack.push(punct[char])
                    elif punct[char] in closeToks:
                        if openStack.len and openStack[^1] == closeOpen[punct[char]]:
                            openStack.pops()
                        elif punct[char] == ◆bracket_close and inStripol:
                            inStripol = false
                            commit(char, ◆stripol_end, 1)
                            token.tok = ◆string
                            continue
                            
                    if punct[char] == ◆test:
                        if tokens.len == 0 or tokens[^1].tok == ◆indent:
                            token.tok = ◆test
                            while col <= segs.len-1:
                                advance 1
                            pushToken()
                            continue
                
                    commit(char, punct[char], 1)
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
                    
                    if keywords.hasKey(token.str) and (col >= segs.len-1 or segs[col+1] == " " or punct.hasKey(segs[col+1])):
                        token.tok = keywords[token.str]
                        pushToken()
            col += 1
            
        if token.str.len:
            if keywords.hasKey(token.str):
                token.tok = keywords[token.str]
            tokens.add token
        else:
            if token.tok == ◆string:
                echo "add empty string token"
                tokens.add token
        
    return  tokens
    
proc tokenize*(text:string) : seq[Token] =

    tokenize kseg text
    
