# █████████  ███   ███  ███   ███  ███████
#    ███     ███  ███   ████  ███     ███ 
#    ███     ███████    ███ █ ███    ███  
#    ███     ███  ███   ███  ████   ███   
#    ███     ███   ███  ███   ███  ███████

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
        ◆import,
        ◆use,
        ◆try,
        ◆catch,
        ◆let                = "◇"
        ◆var                = "◆"
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

        ◆val                = "◇"
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
        delimiter   : string
        segi        : int
        segs        : seq[string]
        bol         : int # segi at start of current line
        eol         : int # segi at end of current line
        line        : int # current line index
    
proc `$`*(t:Tknzr): string = 

    var s = &"◆◆◆ {t.line} {t.token} {t.bol} {t.segi} {t.eol}"
    s
    
proc formatValue*(result:var string, t:Tknzr, specifier: string) = result.add $t
    
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

proc peek(t:Tknzr, n:int) : string = t.segs[t.segi+n]
proc incr(t:Tknzr, n:int) =  t.segi += n
proc col(t:Tknzr) : int = t.segi - t.bol

proc nextLine(t:Tknzr) =

    assert t.segs[t.segi] == "\n"
    t.segi += 1
    t.line += 1
    t.bol = t.segi
    t.eol = t.bol
    
    while t.eol < t.segs.len and t.segs[t.eol] != "\n":
        t.eol += 1

proc srng(t:Tknzr, n:int) : string =

    var e : int
    if n >= 0:
        e = t.segi+n
    else:
        e = t.eol
    if e > t.segs.len:
        return  ""
    t.segs[t.segi..<e].join("")
    
proc advance(t:Tknzr, n:int) =

    for s in 0..<n :
        t.token.str &= t.peek(0)
        t.segi += 1
        
proc advanceUntil(t:Tknzr, stop: string) =

    while t.segi < t.segs.len and t.peek(0) != stop:
        t.token.str &= t.peek(0)
        t.segi += 1

proc advanceMulti(t:Tknzr, stop: string) =

    while t.segi < t.segs.len and t.srng(stop.len) != stop:
        let c = t.peek(0)
        t.token.str &= c
        if c == "\n":
            t.nextLine()
        else:
            t.segi += 1
    
proc pushToken(t:Tknzr, str="", tk=◆name, incr=0) =

    if t.token.str.len:
        t.tokens.add t.token
    t.token = Token(str:str, tok:tk, line:t.line, col:t.col())
    t.segi += incr
    
proc push(t:Tknzr, tk:tok) =

    t.token.tok = tk
    t.pushToken()
    
proc commit(t:Tknzr, str="", tk=◆name, incr=0)
    
#  ███████  █████████  ████████   ███  ███   ███   ███████ 
# ███          ███     ███   ███  ███  ████  ███  ███      
# ███████      ███     ███████    ███  ███ █ ███  ███  ████
#      ███     ███     ███   ███  ███  ███  ████  ███   ███
# ███████      ███     ███   ███  ███  ███   ███   ███████ 

proc string(t:Tknzr) =

    var topTok = t.tokens[^1]
    
    assert topTok.tok in {◆string_start, ◆stripol_end}
    
    case topTok.tok:
        of ◆string_start:
            t.delimiter = topTok.str
        of ◆stripol_end:
            t.token.tok = ◆string
        else:
            discard

    # echo &"-------------- string {t} {t.delimiter} {topTok}"

    proc isAtStringEnd() : bool =
        if t.delimiter.len == 1 and t.segi >= t.eol:
            return  true
        if t.segi >= t.segs.len:
            return  true
        if t.delimiter.len == 3:
            t.segi <= t.eol-3 and t.srng(3) == t.delimiter
        else:
            t.segi <= t.eol-1 and t.peek(0) == t.delimiter
                    
    while not isAtStringEnd():
    
        t.token.tok = ◆string
        
        let c = t.peek(0)
        if c == "\\":
            t.advance 2
            continue
            
        if t.srng(2) == "#{" and t.delimiter in @["\"", "\"\"\""]:
            t.commit("#{", ◆stripol_start, 2)
            t.inStripol = true  
            return

        t.token.str &= c
        if c == "\n":
            t.nextLine()
        else:
            t.segi += 1
                
    if t.segi <= t.eol-1 :
        t.commit(t.delimiter, ◆string_end, t.delimiter.len)
    
#  ███████   ███████   ██     ██  ██     ██  ████████  ███   ███  █████████
# ███       ███   ███  ███   ███  ███   ███  ███       ████  ███     ███   
# ███       ███   ███  █████████  █████████  ███████   ███ █ ███     ███   
# ███       ███   ███  ███ █ ███  ███ █ ███  ███       ███  ████     ███   
#  ███████   ███████   ███   ███  ███   ███  ████████  ███   ███     ███   

proc comment(t:Tknzr) = 

    if t.srng(2) == "##":
        t.tokens[^1].str &= "##"
        t.incr 2
        t.token.col += 2
        t.token.tok = ◆comment
        t.advanceMulti "###"
        if t.srng(3) == "###":
            t.commit("###", ◆comment_end, 3)
        else:
            t.pushToken("", ◆comment)
        return  

    t.advanceUntil "\n"
    t.push ◆comment
    
proc `import`(t:Tknzr) = 

    t.segi += 1 # 𝓢⫙ϵ⟅⟅𝖘 ϝ𝚒𝖘𝖍𝛾 
    t.advanceUntil "\n"
    t.push ◆import

#  ███████   ███████   ██     ██  ██     ██  ███  █████████
# ███       ███   ███  ███   ███  ███   ███  ███     ███   
# ███       ███   ███  █████████  █████████  ███     ███   
# ███       ███   ███  ███ █ ███  ███ █ ███  ███     ███   
#  ███████   ███████   ███   ███  ███   ███  ███     ███   

proc commit(t:Tknzr, str="", tk=◆name, incr=0) =

    # echo &"commit {tk}"
    t.pushToken(str, tk, incr)
    t.pushToken()
    
    case tk:
        of ◆comment_start:
            t.comment()
        of ◆string_start, ◆stripol_end:
            t.string()
        else:
            discard

# █████████  ███   ███  ███   ███  ███████
#    ███     ███  ███   ████  ███     ███ 
#    ███     ███████    ███ █ ███    ███  
#    ███     ███  ███   ███  ████   ███   
#    ███     ███   ███  ███   ███  ███████

proc tknz(t:Tknzr, segs:seq[string]) : seq[Token] =

    # profileScope "tknz"

    t.segs = segs
    while t.eol < t.segs.len and t.segs[t.eol] != "\n":
        t.eol += 1
        
    # echo &"line {t.line} {t.bol} {t.eol} {t.segs.len} {t.segs}"

    while t.segi < t.segs.len:
        
        if t.segs[t.segi] == "\n":
            t.nextLine()
            # echo &"line {t.line} {t.bol} {t.eol} {t.segs.len}"
            continue
                
        let firstLineTokenIndex = t.tokens.len

        t.token = Token(line:t.line, col:t.col())
        
        while t.segi < t.eol:
                                    
            let char = t.peek(0)
                        
            if char == " ":
                if t.tokens.len == firstLineTokenIndex and t.token.str.len == 0 or t.token.tok == ◆indent:
                    t.token.tok = ◆indent
                    t.token.str.add char
                elif t.col() == 0 or t.peek(-1) != " ":
                    t.pushToken()
            else:
                
                if t.col() > 0 and t.peek(-1) == " ":
                    if t.token.tok == ◆indent:
                        t.pushToken()
                    t.token.col = t.col()
                
                let triple = t.srng 3
                if punct.hasKey triple:
                    t.commit(triple, punct[triple], 3)
                    if t.tokens[^1].tok == ◆string_start:
                        t.token.tok = ◆string
                    continue
                
                let double = t.srng 2
                if punct.hasKey double:
                    t.commit(double, punct[double], 2)
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
                            continue
                            
                    if punct[char] == ◆test:
                        if t.tokens.len == 0 or t.tokens[^1].tok == ◆indent:
                            while t.segi <= t.eol-1:
                                t.advance 1
                            t.push ◆test
                            continue
                
                    t.commit(char, punct[char], 1)
                    continue
                else:
                    t.token.str.add char
                    
                    var next : string
                    if t.segi < t.eol-1 :
                        next = t.peek(1) 
                    else :
                        next = ""
                        
                    if isNumber(t.token.str, next):
                        t.push ◆number
                    
                    if keywords.hasKey(t.token.str) and (t.segi >= t.eol-1 or t.peek(1) == " " or punct.hasKey(t.peek(1))):
                        case keywords[t.token.str]:
                            of ◆import:
                                t.import()
                            else:
                                t.push keywords[t.token.str]
            t.incr 1
            
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
    
