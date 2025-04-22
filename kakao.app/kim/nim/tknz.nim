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
        line        : int
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

    var t = Tknzr()
    
    var segs  : seq[string]
    
    while t.segi < graphemes.len:
        
        if graphemes[t.segi] == "\n":
            t.line += 1
            t.segi += 1
            continue
        
        segs = @[]
        
        while t.segi < graphemes.len and graphemes[t.segi] != "\n":
            segs.add graphemes[t.segi]
            t.segi += 1
        
        let firstLineTokenIndex = t.tokens.len
        var col = 0
        t.token = Token(line:t.line, col:col)
        
        while col < segs.len:
                    
            proc pushToken(str="", tk=◆name, incr=0) =
                if t.token.str.len:
                    t.tokens.add t.token
                t.token = Token(str:str, tok:tk, line:t.line, col:col)
                col += incr
                
            proc commit(str="", tk=◆name, incr=0) = 
                pushToken(str, tk, incr)
                pushToken()
                
            proc advance(n=1) =
                for s in 0..<n :
                    t.token.str &= segs[col]
                    col += 1
                
            if t.tokens.len :
            
                var topTok = t.tokens[^1]
                
                if topTok.tok == ◆string_start:
                    t.delimiter = topTok.str
                
                if topTok.tok == ◆string_start or topTok.tok == ◆stripol_end:
            
                    proc isAtStringEnd() : bool =
                        if col > segs.len-1 :
                            return  true
                        if t.delimiter.len == 3:
                            col <= segs.len-3 and segs[col..col+2].join("") == t.delimiter
                        else:
                            col <= segs.len-1 and segs[col] == t.delimiter
                                    
                    while not isAtStringEnd():
                    
                        t.token.tok = ◆string
                        
                        if segs[col] == "\\":
                            advance 2
                            continue
                            
                        if segs[col] == "#" and t.delimiter in @["\"", "\"\"\""] and col < segs.len-1 and segs[col+1] == "{":
                            commit("#{", ◆stripol_start, 2)
                            t.inStripol = true  
                            break
                        
                        advance 1    
                                
                    if t.inStripol:
                        continue
                    
                    if col <= segs.len-1 :
                        commit(t.delimiter, ◆string_end, t.delimiter.len)
                    
                    if col > segs.len-1:
                        break
                    else:
                        continue
                
                if t.inComment:
                    t.token.tok = ◆comment
                    while col <= segs.len-1 and (col >= segs.len-2 or segs[col..col+2].join("") != "###"):
                        advance 1
                    if col < segs.len-1:
                        commit("###", ◆comment_end, 3)
                        t.inComment = false
                        continue
                    else:
                        pushToken("", ◆comment)
                    break
                
                if topTok.tok == ◆comment_start:
                
                    if col == topTok.col+1 and col < segs.len-1 and segs[col] == "#" and segs[col+1] == "#":
                        topTok.str = "###"
                        t.tokens.pops()
                        t.tokens.push topTok
                        col += 2
                        t.token.col += 2
                        t.inComment = true
                        continue
                
                    t.token.tok = ◆comment
                    t.token.str &= segs[col..^1].join ""
                    break
            
            let char = segs[col]
                        
            if char == " ":
                if t.tokens.len == firstLineTokenIndex and t.token.str.len == 0 or t.token.tok == ◆indent:
                    t.token.tok = ◆indent
                    t.token.str.add char
                elif col == 0 or segs[col-1] != " ":
                    pushToken()
            else:
                
                if col > 0 and segs[col-1] == " ":
                    if t.token.tok == ◆indent:
                        pushToken()
                    t.token.col = col
                
                if col < segs.len-1:
                    
                    let next = segs[col+1]
                    
                    if col < segs.len-2:
                        let nextnext = segs[col+2]
                        if punct.hasKey char & next & nextnext:
                            commit(char & next & nextnext, punct[char & next & nextnext], 3)
                            if t.tokens[^1].tok == ◆string_start:
                                t.token.tok = ◆string
                            continue
                    
                    if punct.hasKey char & next:
                        commit(char & next, punct[char & next], 2)
                        continue
                        
                if punct.hasKey char:
                
                    if punct[char] in openToks:
                        t.openStack.push(punct[char])
                    elif punct[char] in closeToks:
                        if t.openStack.len and t.openStack[^1] == closeOpen[punct[char]]:
                            t.openStack.pops()
                        elif punct[char] == ◆bracket_close and t.inStripol:
                            t.inStripol = false
                            commit(char, ◆stripol_end, 1)
                            t.token.tok = ◆string
                            continue
                            
                    if punct[char] == ◆test:
                        if t.tokens.len == 0 or t.tokens[^1].tok == ◆indent:
                            t.token.tok = ◆test
                            while col <= segs.len-1:
                                advance 1
                            pushToken()
                            continue
                
                    commit(char, punct[char], 1)
                    continue
                else:
                    t.token.str.add char
                    
                    var next : string
                    if col < segs.len-1 :
                        next = segs[col+1] 
                    else :
                        next = ""
                        
                    if isNumber(t.token.str, next):
                        t.token.tok = ◆number
                        pushToken()
                    
                    if keywords.hasKey(t.token.str) and (col >= segs.len-1 or segs[col+1] == " " or punct.hasKey(segs[col+1])):
                        t.token.tok = keywords[t.token.str]
                        pushToken()
            col += 1
            
        if t.token.str.len:
            if keywords.hasKey(t.token.str):
                t.token.tok = keywords[t.token.str]
            t.tokens.add t.token
        else:
            if t.token.tok == ◆string:
                echo "add empty string token"
                t.tokens.add t.token
        
    return  t.tokens
    
proc tokenize*(text:string) : seq[Token] =

    tokenize kseg text
    
