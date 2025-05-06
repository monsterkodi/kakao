# █████████  ███   ███  ███   ███  ███████
#    ███     ███  ███   ████  ███     ███ 
#    ███     ███████    ███ █ ███    ███  
#    ███     ███  ███   ███  ████   ███   
#    ███     ███   ███  ███   ███  ███████
import kommon
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
type Tknzr* = ref object
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
proc `$`*(t : Tknzr) : string = 
    &"◂▸ {t.line} {t.token} {t.bol} {t.segi} {t.eol}"
proc char(t : Tknzr) : char = t.segs[t.segi][0]
proc char(t : Tknzr, n : int) : char = t.segs[(t.segi + n)][0]
proc peek(t : Tknzr, n : int) : string = t.segs[(t.segi + n)]
proc incr(t : Tknzr, n : int) = (t.segi += n)
proc col(t : Tknzr) : int = (t.segi - t.bol)
proc peekSafe(t : Tknzr, n : int) : string = 
    if ((t.segi + n) < t.segs.len): 
        t.segs[(t.segi + n)]
    else: 
        ""
proc nextLine(t : Tknzr) = 
    assert((t.segs[t.segi] == "\n"))
    t.incr(1)
    (t.line += 1)
    t.bol = t.segi
    t.eol = t.bol
    while ((t.eol < t.segs.len) and (t.segs[t.eol] != "\n")): 
        (t.eol += 1)
proc lineIncr(t : Tknzr, c : string) = 
    if (c == "\n"): 
        t.nextLine()
    else: 
        t.incr(1)
proc srng(t : Tknzr, n : int) : string = 
    var e = if (n >= 0): (t.segi + n) else: t.eol
    if (e > t.segs.len): return ""
    t.segs[t.segi..<e].join("")
proc scmp(t : Tknzr, s : string) : bool = 
    var ss = kseg(s)
    for n in 0..<ss.len: 
        if ((t.segi + n) >= t.segs.len): return false
        if (t.segs[(t.segi + n)] != ss[n]): return false
    true
proc advance(t : Tknzr, n : int) = 
    for s in 0..<n: 
        (t.token.str &= t.peek(0))
        t.incr(1)
proc advance(t : Tknzr, charset : set[char]) = 
    while ((t.segi < t.segs.len) and (t.peek(0)[0] in charset)): 
        t.advance(1)
proc advanceUntil(t : Tknzr, stop : string) = 
    while ((t.segi < t.segs.len) and not t.scmp(stop)): 
        (t.token.str &= t.peek(0))
        t.incr(1)
proc advanceMulti(t : Tknzr, stop : string) = 
    while ((t.segi < t.segs.len) and not t.scmp(stop)): 
        let c = t.peek(0)
        (t.token.str &= c)
        t.lineIncr(c)
proc pushToken(t : Tknzr, str = "", tk = ◂name, incr = 0) = 
    if t.token.str.len: 
        t.tokens.add(t.token)
    t.token = Token(str: str, tok: tk, line: t.line, col: t.col)
    t.incr(incr)
proc push(t : Tknzr, tk : tok) = 
    t.token.tok = tk
    t.pushToken()
proc commit(t : Tknzr, str = "", tk = ◂name, incr = 0)
#  ███████  █████████  ████████   ███  ███   ███   ███████ 
# ███          ███     ███   ███  ███  ████  ███  ███      
# ███████      ███     ███████    ███  ███ █ ███  ███  ████
#      ███     ███     ███   ███  ███  ███  ████  ███   ███
# ███████      ███     ███   ███  ███  ███   ███   ███████ 
proc string(t : Tknzr) = 
    var topTok = t.tokens[^1]
    assert((topTok.tok in {◂string_start, ◂stripol_end}))
    var ampersand = false
    var stripolStart = "#" & "{"
    case topTok.tok:
        of ◂string_start: 
            t.delimiter = topTok.str
            if ((t.tokens.len > 1) and (t.tokens[^2].tok == ◂ampersand)): 
                if (t.tokens[^2].col == (t.tokens[^1].col - 1)): 
                    t.tokens.delete((t.tokens.len - 2)..(t.tokens.len - 2))
                    stripolStart = "{"
                    ampersand = true
        of ◂stripol_end: 
            t.token.tok = ◂string
        else: 
            discard
    proc isAtStringEnd() : bool = 
        if ((t.delimiter.len == 1) and (t.segi >= t.eol)): 
            return true
        if (t.segi >= t.segs.len): 
            return true
        t.scmp(t.delimiter)
    while not isAtStringEnd(): 
        t.token.tok = ◂string
        let c = t.peek(0)
        if (c == "\\"): 
            t.advance(2)
            continue
        if (t.delimiter in @["\"", "\"\"\""]): 
            if t.scmp(stripolStart): 
                t.commit(stripolStart, ◂stripol_start, stripolStart.len)
                t.inStripol = true
                return
        (t.token.str &= c)
        t.lineIncr(c)
    if (t.segi <= (t.eol - 1)): 
        t.commit(t.delimiter, ◂string_end, t.delimiter.len)
# ███   ███  ███   ███  ██     ██  ███████    ████████  ████████ 
# ████  ███  ███   ███  ███   ███  ███   ███  ███       ███   ███
# ███ █ ███  ███   ███  █████████  ███████    ███████   ███████  
# ███  ████  ███   ███  ███ █ ███  ███   ███  ███       ███   ███
# ███   ███   ███████   ███   ███  ███████    ████████  ███   ███
proc number(t : Tknzr) = 
    t.pushToken("", ◂number)
    var l = t.segs.len
    if ((t.segi < (l - 1)) and (t.segs[t.segi] == "0")): 
        if (t.segs[(t.segi + 1)] == "x"): 
            t.advance(2)
            t.advance({'0'..'9', 'a'..'f', 'A'..'F'})
            t.pushToken()
            return
        if (t.segs[(t.segi + 1)] == "b"): 
            t.advance(2)
            t.advance({'0', '1'})
            t.pushToken()
            return
        if (t.segs[(t.segi + 1)] == "o"): 
            t.advance(2)
            t.advance({'0'..'7'})
            t.pushToken()
            return
    t.advance({'0'..'9'})
    if (((t.segi < (l - 1)) and (t.char == '.')) and (t.char(1) in {'0'..'9'})): 
        t.advance(1)
        t.advance({'0'..'9'})
    if (((t.segi < (l - 1)) and (t.char == 'e')) and (t.char(1) in {'0'..'9', '+', '-'})): 
        t.advance(2)
        t.advance({'0'..'9'})
    t.pushToken()
#  ███████   ███████   ██     ██  ██     ██  ████████  ███   ███  █████████
# ███       ███   ███  ███   ███  ███   ███  ███       ████  ███     ███   
# ███       ███   ███  █████████  █████████  ███████   ███ █ ███     ███   
# ███       ███   ███  ███ █ ███  ███ █ ███  ███       ███  ████     ███   
#  ███████   ███████   ███   ███  ███   ███  ████████  ███   ███     ███   
proc comment(t : Tknzr) = 
    if t.scmp("##"): 
        (t.tokens[^1].str &= "##")
        t.incr(2)
        (t.token.col += 2)
        t.token.tok = ◂comment
        t.advanceMulti("###")
        if t.scmp("###"): 
            t.commit("###", ◂comment_end, 3)
        else: 
            t.pushToken("", ◂comment)
        return
    t.advanceUntil("\n")
    t.push(◂comment)
proc modbracket(t : Tknzr) = 
    t.pushToken()
    t.token.tok = ◂mod
    t.advance(1)
    t.advanceUntil(".}")
    t.advance(2)
    t.pushToken()
proc verbatim(t : Tknzr, tk : tok) = 
    t.advanceUntil("\n")
    t.push(tk)
#  ███████   ███████   ██     ██  ██     ██  ███  █████████
# ███       ███   ███  ███   ███  ███   ███  ███     ███   
# ███       ███   ███  █████████  █████████  ███     ███   
# ███       ███   ███  ███ █ ███  ███ █ ███  ███     ███   
#  ███████   ███████   ███   ███  ███   ███  ███     ███   
proc commit(t : Tknzr, str = "", tk = ◂name, incr = 0) = 
    t.pushToken(str, tk, incr)
    t.pushToken()
    case tk:
        of ◂comment_start: 
            t.comment()
        of ◂string_start, ◂stripol_end: 
            t.string()
        of ◂mod: 
            t.modbracket()
        else: 
            discard
# █████████  ███   ███  ███   ███  ███████
#    ███     ███  ███   ████  ███     ███ 
#    ███     ███████    ███ █ ███    ███  
#    ███     ███  ███   ███  ████   ███   
#    ███     ███   ███  ███   ███  ███████
proc tknz(t : Tknzr, segs : seq[string]) : seq[Token] = 
    # profileScope "tknz"
    t.segs = segs
    while ((t.segi < t.segs.len) and (t.segs[t.segi] in @["\n", " "])): 
        t.lineIncr(t.segs[t.segi])
    while ((t.eol < t.segs.len) and (t.segs[t.eol] != "\n")): 
        (t.eol += 1)
    while (t.segi < t.segs.len): 
        if (t.segs[t.segi] == "\n"): 
            if (((t.tokens.len > 1) and (t.tokens[^1].tok == ◂multiply)) and (t.tokens[^2].tok == ◂name)): 
                t.tokens.pops()
                (t.tokens[^1].str &= "*")
            t.nextLine()
            if (t.segi >= t.segs.len): 
                break
            t.token = Token(tok: ◂indent, line: t.line, col: t.col)
            while (t.peekSafe(0) == " "): 
                t.advance(1)
            if (t.segi >= t.segs.len): 
                break
            if (t.tokens[^1].tok == ◂indent): 
                t.tokens.pops()
            t.tokens.add(t.token)
            continue
        t.token = Token(line: t.line, col: t.col)
        while (t.segi < t.eol): 
            var char = t.peek(0)
            if (char == " "): 
                if ((t.segi > 0) and (t.peek(-1) != " ")): 
                    t.pushToken()
            else: 
                if ((t.col > 0) and (t.peek(-1) == " ")): 
                    t.token.col = t.col
                var triple = t.srng(3)
                if (triple == "..<"): 
                    t.commit("...", ◂tripledot, 3)
                    continue
                if punct.hasKey(triple): 
                    t.commit(triple, punct[triple], 3)
                    if (t.tokens[^1].tok == ◂string_start): 
                        t.token.tok = ◂string
                    continue
                var double = t.srng(2)
                if punct.hasKey(double): 
                    if (punct[double] == ◂mod): 
                        t.modbracket()
                    else: 
                        t.commit(double, punct[double], 2)
                    continue
                if punct.hasKey(char): 
                    if (punct[char] in openToks): 
                        t.openStack.push(punct[char])
                    elif (punct[char] in closeToks): 
                        if (t.openStack.len and (t.openStack[^1] == closeOpen[punct[char]])): 
                            t.openStack.pops()
                        elif ((punct[char] == ◂bracket_close) and t.inStripol): 
                            t.inStripol = false
                            t.commit(char, ◂stripol_end, 1)
                            continue
                    if (punct[char] == ◂test): 
                        if (t.peek(1) notin @[" ", "\n"]): 
                            t.token.tok = ◂name
                            t.advance(1)
                            continue
                        if ((t.tokens.len == 0) or ((t.tokens[^1].tok == ◂indent) and (t.peek(1) == " "))): 
                            while (t.segi <= (t.eol - 1)): 
                                t.advance(1)
                            t.push(◂test)
                            continue
                    if (((t.tokens.len > 0) and (t.tokens[^1].tok == ◂multiply)) and (punct[char] in {◂assign, ◂colon, ◂paren_open, ◂var_type, ◂val_type})): 
                        if ((punct[char] != ◂paren_open) or (t.tokens[^2].tok in {◂proc, ◂template, ◂macro})): 
                            t.tokens.pops()
                            (t.tokens[^1].str &= "*")
                    t.commit(char, punct[char], 1)
                    continue
                else: 
                    if ((t.token.str.len == 0) and (t.char in {'0'..'9'})): 
                        t.number()
                        continue
                    t.advance(1)
                    if (t.peekSafe(0) == " "): 
                        case t.token.str:
                            of "case": 
                                t.token.str = "switch"
                                t.push(◂switch)
                                continue
                            of "of": 
                                t.token.str = ""
                                continue
                            of "quote": 
                                if t.scmp(" do:"): 
                                    t.incr(4)
                                    t.push(◂quote)
                                    continue
                            else: discard
                    if (keywords.hasKey(t.token.str) and (((t.segi >= t.eol) or (t.peek(0) == " ")) or punct.hasKey(t.peek(0)))): 
                        case keywords[t.token.str]:
                            of ◂proc, ◂type, ◂import, ◂macro, ◂template, ◂converter: 
                                t.verbatim(keywords[t.token.str])
                            else: t.push(keywords[t.token.str])
                    continue
            t.incr(1)
        if t.token.str.len: 
            if keywords.hasKey(t.token.str): 
                t.token.tok = keywords[t.token.str]
            t.tokens.add(t.token)
    return t.tokens
proc tokenize*(text : string) : seq[Token] = 
    Tknzr.new.tknz(kseg(text))