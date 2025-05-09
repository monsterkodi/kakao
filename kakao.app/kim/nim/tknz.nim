# █████████  ███   ███  ███   ███  ███████
#    ███     ███  ███   ████  ███     ███ 
#    ███     ███████    ███ █ ███    ███  
#    ███     ███  ███   ███  ████   ███   
#    ███     ███   ███  ███   ███  ███████
import komn
export komn
type tok* = enum
    ◂name
    ◂if
    ◂when
    ◂then = "➜"
    ◂elif
    ◂else
    ◂switch
    ◂while
    ◂for
    ◂in
    ◂notin
    ◂is
    ◂break
    ◂continue
    ◂discard
    ◂enum
    ◂class
    ◂struct
    ◂import
    ◂template
    ◂macro
    ◂quote
    ◂converter
    ◂type
    ◂use
    ◂try
    ◂catch
    ◂let
    ◂var
    ◂not = "!"
    ◂and = "&&"
    ◂or = "||"
    ◂true = "✔"
    ◂false = "✘"
    ◂null = "nil"
    ◂func = "->"
    ◂proc = "=>"
    ◂return = "⮐"
    ◂number
    ◂string
    ◂string_start = "'"
    ◂string_end
    ◂stripol_start = "#" & "{"
    ◂stripol_end
    ◂comment_start = "#"
    ◂comment
    ◂comment_end
    ◂val_type = "◇"
    ◂var_type = "◆"
    ◂paren_open = "("
    ◂paren_close = ")"
    ◂bracket_open = "{"
    ◂bracket_close = "}"
    ◂mod = "{."
    ◂square_open = "["
    ◂square_close = "]"
    ◂comma = ","
    ◂colon = ":"
    ◂semicolon = ";"
    ◂dot = "."
    ◂doubledot = ".."
    ◂tripledot = "..."
    ◂minus = "-"
    ◂plus = "+"
    ◂increment = "++"
    ◂decrement = "--"
    ◂ampersand = "&"
    ◂dollar = "$"
    ◂divide = "/"
    ◂multiply = "*"
    ◂assign = "="
    ◂match = "=~"
    ◂plus_assign = "+="
    ◂minus_assign = "-="
    ◂divide_assign = "/="
    ◂multiply_assign = "*="
    ◂ampersand_assign = "&="
    ◂equal = "=="
    ◂not_equal = "!="
    ◂less_equal = "<="
    ◂greater_equal = ">="
    ◂greater = ">"
    ◂less = "<"
    ◂test = "▸"
    ◂ # block
    ◂indent
    ◂eof
var keywords = initTable[string, tok]()
for kt in {◂if..◂return}: 
    keywords[symbolName(kt)[3..^1]] = kt
keywords["nil"] = ◂null
var punct = initTable[string, tok]()
for kt in {◂if..◂test}: 
    if (symbolName(kt) != $kt): 
        punct[$kt] = kt
punct["\""] = ◂string_start
punct["\"\"\""] = ◂string_start
const

    openToks = {◂paren_open, ◂bracket_open, ◂square_open}
    closeToks = {◂paren_close, ◂bracket_close, ◂square_close}
    closeOpen = {◂paren_close: ◂paren_open, ◂bracket_close: ◂bracket_open, ◂square_close: ◂square_open}.toTable()
# █████████  ███   ███  ███   ███  ███████  ████████ 
#    ███     ███  ███   ████  ███     ███   ███   ███
#    ███     ███████    ███ █ ███    ███    ███████  
#    ███     ███  ███   ███  ████   ███     ███   ███
#    ███     ███   ███  ███   ███  ███████  ███   ███
type Token* = object
    str*: string
    tok*: tok
    line*: int
    col*: int
proc tkn*(tok : tok, str : string, line = -1, col = -1) : Token = Token(tok: tok, str: str, line: line, col: col)
proc tkn*(tok = ◂name, line = -1, col = -1) : Token = Token(tok: tok, str: "", line: line, col: col)
type Tknzr = ref object
    tokens: seq[Token]
    openStack: seq[tok]
    token: Token
    inStripol: bool
    delimiter: string
    segi: int
    segs: seq[string]
    bol: int # segi at start of current line
    eol: int # segi at end of current line
    line: int # current line index
    #  ███████  █████████  ████████   ███  ███   ███   ███████ 
    # ███          ███     ███   ███  ███  ████  ███  ███      
    # ███████      ███     ███████    ███  ███ █ ███  ███  ████
    #      ███     ███     ███   ███  ███  ███  ████  ███   ███
    # ███████      ███     ███   ███  ███  ███   ███   ███████ 
    # ███   ███  ███   ███  ██     ██  ███████    ████████  ████████ 
    # ████  ███  ███   ███  ███   ███  ███   ███  ███       ███   ███
    # ███ █ ███  ███   ███  █████████  ███████    ███████   ███████  
    # ███  ████  ███   ███  ███ █ ███  ███   ███  ███       ███   ███
    # ███   ███   ███████   ███   ███  ███████    ████████  ███   ███
    #  ███████   ███████   ██     ██  ██     ██  ████████  ███   ███  █████████
    # ███       ███   ███  ███   ███  ███   ███  ███       ████  ███     ███   
    # ███       ███   ███  █████████  █████████  ███████   ███ █ ███     ███   
    # ███       ███   ███  ███ █ ███  ███ █ ███  ███       ███  ████     ███   
    #  ███████   ███████   ███   ███  ███   ███  ████████  ███   ███     ███   
    #  ███████   ███████   ██     ██  ██     ██  ███  █████████
    # ███       ███   ███  ███   ███  ███   ███  ███     ███   
    # ███       ███   ███  █████████  █████████  ███     ███   
    # ███       ███   ███  ███ █ ███  ███ █ ███  ███     ███   
    #  ███████   ███████   ███   ███  ███   ███  ███     ███   
    # █████████  ███   ███  ███   ███  ███████
    #    ███     ███  ███   ████  ███     ███ 
    #    ███     ███████    ███ █ ███    ███  
    #    ███     ███  ███   ███  ████   ███   
    #    ███     ███   ███  ███   ███  ███████
proc `$`(this : Tknzr) : string = 
        &"◂▸ {this.line} {this.token} {this.bol} {this.segi} {this.eol}"
proc char(this : Tknzr) : char = this.segs[this.segi][0]
proc char(this : Tknzr, n : int) : char = this.segs[(this.segi + n)][0]
proc peek(this : Tknzr, n : int) : string = this.segs[(this.segi + n)]
proc incr(this : Tknzr, n : int) = (this.segi += n)
proc col(this : Tknzr) : int = (this.segi - this.bol)
proc peekSafe(this : Tknzr, n : int) : string = 
        if ((this.segi + n) < this.segs.len): 
            this.segs[(this.segi + n)]
        else: 
            ""
proc nextLine(this : Tknzr) = 
        assert((this.segs[this.segi] == "\n"))
        this.incr(1)
        (this.line += 1)
        this.bol = this.segi
        this.eol = this.bol
        while ((this.eol < this.segs.len) and (this.segs[this.eol] != "\n")): 
            (this.eol += 1)
proc lineIncr(this : Tknzr, c : string) = 
        if (c == "\n"): 
            this.nextLine()
        else: 
            this.incr(1)
proc srng(this : Tknzr, n : int) : string = 
        var e = if (n >= 0): (this.segi + n) else: this.eol
        if (e > this.segs.len): return ""
        this.segs[this.segi..<e].join("")
proc scmp(this : Tknzr, s : string) : bool = 
        var ss = kseg(s)
        for n in 0..<ss.len: 
            if ((this.segi + n) >= this.segs.len): return false
            if (this.segs[(this.segi + n)] != ss[n]): return false
        true
proc advance(this : Tknzr, n : int) = 
        for s in 0..<n: 
            (this.token.str &= this.peek(0))
            this.incr(1)
proc advance(this : Tknzr, charset : set[char]) = 
        while ((this.segi < this.segs.len) and (this.peek(0)[0] in charset)): 
            this.advance(1)
proc advanceUntil(this : Tknzr, stop : string) = 
        while ((this.segi < this.segs.len) and not this.scmp(stop)): 
            (this.token.str &= this.peek(0))
            this.incr(1)
proc advanceMulti(this : Tknzr, stop : string) = 
        while ((this.segi < this.segs.len) and not this.scmp(stop)): 
            let c = this.peek(0)
            (this.token.str &= c)
            this.lineIncr(c)
proc pushToken(this : Tknzr, str = "", tk = ◂name, incr = 0) = 
        if this.token.str.len: 
            this.tokens.add(this.token)
        this.token = tkn(tk, str, this.line, this.col)
        this.incr(incr)
proc push(this : Tknzr, tk : tok) = 
        this.token.tok = tk
        this.pushToken()
proc commit(this : Tknzr, str = "", tk = ◂name, incr = 0)
proc `string`(this : Tknzr) = 
        var topTok = this.tokens[^1]
        assert((topTok.tok in {◂string_start, ◂stripol_end}))
        var ampersand = false
        var stripolStart = "#" & "{"
        case topTok.tok:
            of ◂string_start: 
                this.delimiter = topTok.str
                if ((this.tokens.len > 1) and (this.tokens[^2].tok == ◂ampersand)): 
                    if (this.tokens[^2].col == (this.tokens[^1].col - 1)): 
                        this.tokens.delete((this.tokens.len - 2)..(this.tokens.len - 2))
                        stripolStart = "{"
                        ampersand = true
            of ◂stripol_end: 
                this.token.tok = ◂string
            else: 
                discard
        proc isAtStringEnd() : bool = 
            if ((this.delimiter.len == 1) and (this.segi >= this.eol)): 
                return true
            if (this.segi >= this.segs.len): 
                return true
            this.scmp(this.delimiter)
        while not isAtStringEnd(): 
            this.token.tok = ◂string
            var c = this.peek(0)
            if (c == "\\"): 
                this.advance(2)
                continue
            if (this.delimiter in @["\"", "\"\"\""]): 
                if this.scmp(stripolStart): 
                    this.commit(stripolStart, ◂stripol_start, stripolStart.len)
                    this.inStripol = true
                    return
            (this.token.str &= c)
            this.lineIncr(c)
        if (this.segi <= (this.eol - 1)): 
            this.commit(this.delimiter, ◂string_end, this.delimiter.len)
proc number(this : Tknzr) = 
        this.pushToken("", ◂number)
        var l = this.segs.len
        if ((this.segi < (l - 1)) and (this.segs[this.segi] == "0")): 
            if (this.segs[(this.segi + 1)] == "x"): 
                this.advance(2)
                this.advance({'0'..'9', 'a'..'f', 'A'..'F'})
                this.pushToken()
                return
            if (this.segs[(this.segi + 1)] == "b"): 
                this.advance(2)
                this.advance({'0', '1'})
                this.pushToken()
                return
            if (this.segs[(this.segi + 1)] == "o"): 
                this.advance(2)
                this.advance({'0'..'7'})
                this.pushToken()
                return
        this.advance({'0'..'9'})
        if (((this.segi < (l - 1)) and (this.char == '.')) and (this.char(1) in {'0'..'9'})): 
            this.advance(1)
            this.advance({'0'..'9'})
        if (((this.segi < (l - 1)) and (this.char == 'e')) and (this.char(1) in {'0'..'9', '+', '-'})): 
            this.advance(2)
            this.advance({'0'..'9'})
        this.pushToken()
proc comment(this : Tknzr) = 
        if this.scmp("##"): 
            (this.tokens[^1].str &= "##")
            this.incr(2)
            (this.token.col += 2)
            this.token.tok = ◂comment
            this.advanceMulti("###")
            if this.scmp("###"): 
                this.commit("###", ◂comment_end, 3)
            else: 
                this.pushToken("", ◂comment)
            return
        this.advanceUntil("\n")
        this.push(◂comment)
proc modbracket(this : Tknzr) = 
        this.pushToken()
        this.token.tok = ◂mod
        this.advance(1)
        this.advanceUntil(".}")
        this.advance(2)
        this.pushToken()
proc verbatim(this : Tknzr, tk : tok) = 
        this.advanceUntil("\n")
        this.push(tk)
proc commit(this : Tknzr, str = "", tk = ◂name, incr = 0) = 
        this.pushToken(str, tk, incr)
        this.pushToken()
        case tk:
            of ◂comment_start: 
                this.comment()
            of ◂string_start, ◂stripol_end: 
                this.string()
            of ◂mod: 
                this.modbracket()
            else: 
                discard
proc tknz(this : Tknzr, segs : seq[string]) : seq[Token] = 
        # profileScope "tknz"
        this.segs = segs
        while ((this.segi < this.segs.len) and (this.segs[this.segi] in @["\n", " "])): 
            this.lineIncr(this.segs[this.segi])
        while ((this.eol < this.segs.len) and (this.segs[this.eol] != "\n")): 
            (this.eol += 1)
        while (this.segi < this.segs.len): 
            if (this.segs[this.segi] == "\n"): 
                if (((this.tokens.len > 1) and (this.tokens[^1].tok == ◂multiply)) and (this.tokens[^2].tok == ◂name)): 
                    this.tokens.pops()
                    (this.tokens[^1].str &= "*")
                this.nextLine()
                if (this.segi >= this.segs.len): 
                    break
                this.token = tkn(◂indent, "", this.line, this.col)
                while (this.peekSafe(0) == " "): 
                    this.advance(1)
                if (this.segi >= this.segs.len): 
                    break
                if (this.tokens[^1].tok == ◂indent): 
                    this.tokens.pops()
                this.tokens.add(this.token)
                continue
            this.token = tkn(◂name, "", this.line, this.col)
            while (this.segi < this.eol): 
                var char = this.peek(0)
                if (char == " "): 
                    if ((this.segi > 0) and (this.peek(-1) != " ")): 
                        this.pushToken()
                else: 
                    if ((this.col > 0) and (this.peek(-1) == " ")): 
                        this.token.col = this.col
                    var triple = this.srng(3)
                    if (triple == "..<"): 
                        this.commit("...", ◂tripledot, 3)
                        continue
                    if punct.hasKey(triple): 
                        this.commit(triple, punct[triple], 3)
                        if (this.tokens[^1].tok == ◂string_start): 
                            this.token.tok = ◂string
                        continue
                    var double = this.srng(2)
                    if punct.hasKey(double): 
                        if (punct[double] == ◂mod): 
                            this.modbracket()
                        else: 
                            this.commit(double, punct[double], 2)
                        continue
                    if punct.hasKey(char): 
                        if (punct[char] in openToks): 
                            this.openStack.push(punct[char])
                        elif (punct[char] in closeToks): 
                            if (this.openStack.len and (this.openStack[^1] == closeOpen[punct[char]])): 
                                this.openStack.pops()
                            elif ((punct[char] == ◂bracket_close) and this.inStripol): 
                                this.inStripol = false
                                this.commit(char, ◂stripol_end, 1)
                                continue
                        if (punct[char] == ◂test): 
                            if (this.peek(1) notin @[" ", "\n"]): 
                                this.token.tok = ◂name
                                this.advance(1)
                                continue
                            if ((this.tokens.len == 0) or ((this.tokens[^1].tok == ◂indent) and (this.peek(1) == " "))): 
                                while (this.segi <= (this.eol - 1)): 
                                    this.advance(1)
                                this.push(◂test)
                                continue
                        if (((this.tokens.len > 0) and (this.tokens[^1].tok == ◂multiply)) and (punct[char] in {◂assign, ◂colon, ◂paren_open, ◂var_type, ◂val_type})): 
                            if ((punct[char] != ◂paren_open) or (this.tokens[^2].tok in {◂proc, ◂template, ◂macro})): 
                                this.tokens.pops()
                                (this.tokens[^1].str &= "*")
                        this.commit(char, punct[char], 1)
                        continue
                    else: 
                        if ((this.token.str.len == 0) and (this.char in {'0'..'9'})): 
                            this.number()
                            continue
                        this.advance(1)
                        if (this.peekSafe(0) == " "): 
                            case this.token.str:
                                of "case": 
                                    this.token.str = "switch"
                                    this.push(◂switch)
                                    continue
                                of "of": 
                                    this.token.str = ""
                                    continue
                                of "quote": 
                                    if this.scmp(" do:"): 
                                        this.incr(4)
                                        this.push(◂quote)
                                        continue
                                else: discard
                        if (keywords.hasKey(this.token.str) and (((this.segi >= this.eol) or (this.peek(0) == " ")) or punct.hasKey(this.peek(0)))): 
                            case keywords[this.token.str]:
                                of ◂proc, ◂type, ◂import, ◂macro, ◂template, ◂converter: 
                                    this.verbatim(keywords[this.token.str])
                                else: this.push(keywords[this.token.str])
                        continue
                this.incr(1)
            if this.token.str.len: 
                if keywords.hasKey(this.token.str): 
                    this.token.tok = keywords[this.token.str]
                this.tokens.add(this.token)
        return this.tokens
proc tokenize*(text : string) : seq[Token] = 
    Tknzr.new.tknz(kseg(text))