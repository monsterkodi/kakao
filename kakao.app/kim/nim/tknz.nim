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

        ◆number,
        ◆string,
        ◆string_start       = "'"
        ◆string_end,
        ◆stripol_start      = "#{"
        ◆stripol_end,
        
        ◆comment_start      = "#"
        ◆comment,
        ◆comment_end,

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
        
# █████████  ███   ███  ███   ███  ███████  ████████ 
#    ███     ███  ███   ████  ███     ███   ███   ███
#    ███     ███████    ███ █ ███    ███    ███████  
#    ███     ███  ███   ███  ████   ███     ███   ███
#    ███     ███   ███  ███   ███  ███████  ███   ███

type
    Token* = object
        str*  : string                      
        tok*  : tok                
        line* : int
        col*  : int
        
    Tknzr* = ref object
        tokens      : seq[Token]
        openStack   : seq[tok]
        token       : Token
        inStripol   : bool
        inComment   : bool
        delimiter   : string
        segi        : int
        segs        : seq[string]
        bol         : int # segi at start of current line
        eol         : int # segi at end of current line
        line        : int # current line index
        col         : int # current col index
    
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
    
proc pushToken(t:Tknzr, str="", tk=◆name, incr=0) =

    if t.token.str.len:
        t.tokens.add t.token
    t.token = Token(str:str, tok:tk, line:t.line, col:t.col)
    t.col += incr
    
proc commit(t:Tknzr, str="", tk=◆name, incr=0) =

    # echo &"commit {tk}"
    t.pushToken(str, tk, incr)
    t.pushToken()

proc peek(t:Tknzr, n:int) : string =

    t.segs[t.col+n]
    
proc srng(t:Tknzr, n:int) : string =

    if n > 0:
        t.segs[t.col..t.col+n].join("")
    else:
        t.segs[t.col..^1].join("")
    
proc advance(t:Tknzr, n:int) =

    for s in 0..<n :
        t.token.str &= t.peek(0)
        t.col += 1        
    
# █████████  ███   ███  ███   ███  ███████
#    ███     ███  ███   ████  ███     ███ 
#    ███     ███████    ███ █ ███    ███  
#    ███     ███  ███   ███  ████   ███   
#    ███     ███   ███  ███   ███  ███████

proc tknz(t:Tknzr, graphemes:seq[string]) : seq[Token] =

    while t.eol < graphemes.len and graphemes[t.eol] != "\n":
        t.eol += 1
    echo &"line {t.line} {t.bol} {t.eol} {graphemes.len}"

    while t.segi < graphemes.len:
        
        if graphemes[t.segi] == "\n":
            t.line += 1
            t.segi += 1
            t.bol = t.segi
            t.eol = t.bol
            while t.eol < graphemes.len and graphemes[t.eol] != "\n":
                t.eol += 1
            echo &"line {t.line} {t.bol} {t.eol} {graphemes.len}"
            continue
        
        t.segs = @[]
        
        while t.segi < graphemes.len and graphemes[t.segi] != "\n":
            t.segs.add graphemes[t.segi]
            t.segi += 1
        
        let firstLineTokenIndex = t.tokens.len
        t.col = 0
        t.token = Token(line:t.line, col:t.col)
        
        while t.col < t.eol - t.bol:
                                    
            if t.tokens.len :
            
                var topTok = t.tokens[^1]
                
                if topTok.tok == ◆string_start:
                    t.delimiter = topTok.str
                
                if topTok.tok == ◆string_start or topTok.tok == ◆stripol_end:
            
                    proc isAtStringEnd() : bool =
                        if t.col > (t.eol - t.bol)-1 :
                            return  true
                        if t.delimiter.len == 3:
                            t.col <= (t.eol - t.bol)-3 and t.srng(2) == t.delimiter
                        else:
                            t.col <= (t.eol - t.bol)-1 and t.peek(0) == t.delimiter
                                    
                    while not isAtStringEnd():
                    
                        t.token.tok = ◆string
                        
                        if t.peek(0) == "\\":
                            t.advance 2
                            continue
                            
                        if t.peek(0) == "#" and t.delimiter in @["\"", "\"\"\""] and t.col < (t.eol - t.bol)-1 and t.peek(1) == "{":
                            t.commit("#{", ◆stripol_start, 2)
                            t.inStripol = true  
                            break
                        
                        t.advance 1    
                                
                    if t.inStripol:
                        continue
                    
                    if t.col <= (t.eol - t.bol)-1 :
                        t.commit(t.delimiter, ◆string_end, t.delimiter.len)
                    
                    if t.col > (t.eol - t.bol)-1:
                        break
                    else:
                        continue
                
                if t.inComment:
                    t.token.tok = ◆comment
                    while t.col <= (t.eol - t.bol)-1 and (t.col >= (t.eol - t.bol)-2 or t.srng(2) != "###"):
                        t.advance 1
                    if t.col < (t.eol - t.bol)-1:
                        t.commit("###", ◆comment_end, 3)
                        t.inComment = false
                        continue
                    else:
                        t.pushToken("", ◆comment)
                    break
                
                if topTok.tok == ◆comment_start:
                
                    if t.col == topTok.col+1 and t.col < (t.eol - t.bol)-1 and t.peek(0) == "#" and t.peek(1) == "#":
                        topTok.str = "###"
                        t.tokens.pops()
                        t.tokens.push topTok
                        t.col += 2
                        t.token.col += 2
                        t.inComment = true
                        continue
                
                    t.token.tok = ◆comment
                    t.token.str &= t.srng(-1)
                    break
            
            let char = t.peek(0)
                        
            if char == " ":
                if t.tokens.len == firstLineTokenIndex and t.token.str.len == 0 or t.token.tok == ◆indent:
                    t.token.tok = ◆indent
                    t.token.str.add char
                elif t.col == 0 or t.peek(-1) != " ":
                    t.pushToken()
            else:
                
                if t.col > 0 and t.peek(-1) == " ":
                    if t.token.tok == ◆indent:
                        t.pushToken()
                    t.token.col = t.col
                
                if t.col < (t.eol - t.bol)-1:
                    
                    let next = t.peek(1)
                    
                    if t.col < (t.eol - t.bol)-2:
                        let nextnext = t.peek(2)
                        if punct.hasKey char & next & nextnext:
                            t.commit(char & next & nextnext, punct[char & next & nextnext], 3)
                            if t.tokens[^1].tok == ◆string_start:
                                t.token.tok = ◆string
                            continue
                    
                    if punct.hasKey char & next:
                        t.commit(char & next, punct[char & next], 2)
                        continue
                        
                if punct.hasKey char:
                
                    if punct[char] in openToks:
                        t.openStack.push(punct[char])
                    elif punct[char] in closeToks:
                        if t.openStack.len and t.openStack[^1] == closeOpen[punct[char]]:
                            t.openStack.pops()
                        elif punct[char] == ◆bracket_close and t.inStripol:
                            t.inStripol = false
                            t.commit(char, ◆stripol_end, 1)
                            t.token.tok = ◆string
                            continue
                            
                    if punct[char] == ◆test:
                        if t.tokens.len == 0 or t.tokens[^1].tok == ◆indent:
                            t.token.tok = ◆test
                            while t.col <= (t.eol - t.bol)-1:
                                t.advance 1
                            t.pushToken()
                            continue
                
                    t.commit(char, punct[char], 1)
                    continue
                else:
                    t.token.str.add char
                    
                    var next : string
                    if t.col < (t.eol - t.bol)-1 :
                        next = t.peek(1) 
                    else :
                        next = ""
                        
                    if isNumber(t.token.str, next):
                        t.token.tok = ◆number
                        t.pushToken()
                    
                    if keywords.hasKey(t.token.str) and (t.col >= (t.eol - t.bol)-1 or t.peek(1) == " " or punct.hasKey(t.peek(1))):
                        t.token.tok = keywords[t.token.str]
                        t.pushToken()
            t.col += 1
            
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

    Tknzr.new.tknz kseg text
    
