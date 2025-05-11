# █████████   ███████   ███   ███   ███████
#    ███     ███   ███  ███  ███   ███     
#    ███     ███   ███  ███████    ███████ 
#    ███     ███   ███  ███  ███        ███
#    ███      ███████   ███   ███  ███████ 
import kxk
export kxk
type tt* = enum
    ◂text
    ◂number
    ◂comment
    ◂newline
    ◂eof

type Tkn* = object
    t*: tt
    s*: int
    e*: int
    l*: int
    c*: int

proc init*(this : var Tkn, typ : tt, ss = -1, se = -1, line = -1, col = -1) : Tkn = 
        this.t = typ
        this.s = ss
        this.e = se
        this.l = line
        this.c = col
        this

proc len*(this : var Tkn) : int = (this.e - this.s)

proc tkn(typ : tt, ss = -1, se = -1, line = -1, col = -1) : Tkn = 
    var t = default(Tkn)
    t.init(typ, ss, se, line, col)

type Tknz = ref object of RootObj
    tokens: seq[Tkn]
    token: Tkn
    segi: int
    segs: seq[string]
    bol: int
    eol: int
    line: int
# segi at start of current line
# segi at end of current line
# current line index

proc `$`(this : Tknz) : string = 
        &"◂▸ {this.line} {this.token} {this.bol} {this.segi} {this.eol}"

proc char(this : Tknz) : char = this.segs[this.segi][0]

proc char(this : Tknz, n : int) : char = this.segs[(this.segi + n)][0]

proc peek(this : Tknz, n : int) : string = this.segs[(this.segi + n)]

proc incr(this : Tknz, n : int) = (this.segi += n)

proc col(this : Tknz) : int = (this.segi - this.bol)

proc peekSafe(this : Tknz, n : int) : string = 
        if ((this.segi + n) < this.segs.len): 
            this.segs[(this.segi + n)]
        else: 
            ""

proc nextLine(this : Tknz) = 
        assert((this.segs[this.segi] == "\n"))
        this.incr(1)
        (this.line += 1)
        this.bol = this.segi
        this.eol = this.bol
        while ((this.eol < this.segs.len) and (this.segs[this.eol] != "\n")): 
            (this.eol += 1)

proc lineIncr(this : Tknz, c : string) = 
        if (c == "\n"): 
            this.nextLine()
        else: 
            this.incr(1)

proc srng(this : Tknz, n : int) : string = 
        var e = if (n >= 0): (this.segi + n) else: this.eol
        if (e > this.segs.len): return ""
        this.segs[this.segi..<e].join("")

proc scmp(this : Tknz, s : string) : bool = 
        var ss = kseg(s)
        for n in 0..<ss.len: 
            if ((this.segi + n) >= this.segs.len): return false
            if (this.segs[(this.segi + n)] != ss[n]): return false
        true

proc advance(this : Tknz, n : int) = 
        for s in 0..<n: 
            (this.token.e += 1)
            this.incr(1)

proc advance(this : Tknz, charset : set[char]) = 
        while ((this.segi < this.segs.len) and (this.peek(0)[0] in charset)): 
            this.advance(1)

proc pushTkn(this : Tknz, t = ◂text, incr = 0) = 
        if (this.token.e > this.token.s): 
            this.tokens.add(this.token)
        this.token = tkn(t, this.line, this.col)
        this.incr(incr)

proc push(this : Tknz, t : tt) = 
        this.token.t = t
        this.pushTkn()
# ███   ███  ███   ███  ██     ██  ███████    ████████  ████████ 
# ████  ███  ███   ███  ███   ███  ███   ███  ███       ███   ███
# ███ █ ███  ███   ███  █████████  ███████    ███████   ███████  
# ███  ████  ███   ███  ███ █ ███  ███   ███  ███       ███   ███
# ███   ███   ███████   ███   ███  ███████    ████████  ███   ███

proc number(this : Tknz) = 
        this.pushTkn(◂number)
        var l = this.segs.len
        if ((this.segi < (l - 1)) and (this.segs[this.segi] == "0")): 
            if (this.segs[(this.segi + 1)] == "x"): 
                this.advance(2)
                this.advance({'0'..'9', 'a'..'f', 'A'..'F'})
                this.pushTkn()
                return
            if (this.segs[(this.segi + 1)] == "b"): 
                this.advance(2)
                this.advance({'0', '1'})
                this.pushTkn()
                return
            if (this.segs[(this.segi + 1)] == "o"): 
                this.advance(2)
                this.advance({'0'..'7'})
                this.pushTkn()
                return
        this.advance({'0'..'9'})
        if (((this.segi < (l - 1)) and (this.char == '.')) and (this.char(1) in {'0'..'9'})): 
            this.advance(1)
            this.advance({'0'..'9'})
        if (((this.segi < (l - 1)) and (this.char == 'e')) and (this.char(1) in {'0'..'9', '+', '-'})): 
            this.advance(2)
            this.advance({'0'..'9'})
        this.pushTkn()
#  ███████   ███████   ██     ██  ██     ██  ████████  ███   ███  █████████
# ███       ███   ███  ███   ███  ███   ███  ███       ████  ███     ███   
# ███       ███   ███  █████████  █████████  ███████   ███ █ ███     ███   
# ███       ███   ███  ███ █ ███  ███ █ ███  ███       ███  ████     ███   
#  ███████   ███████   ███   ███  ███   ███  ████████  ███   ███     ███   

proc comment(this : Tknz) = 
        while ((this.segi < this.segs.len) and not this.scmp("\n")): 
            (this.token.e += 1)
            this.incr(1)
        this.push(◂comment)
# █████████  ███   ███  ███   ███  ███████
#    ███     ███  ███   ████  ███     ███ 
#    ███     ███████    ███ █ ███    ███  
#    ███     ███  ███   ███  ████   ███   
#    ███     ███   ███  ███   ███  ███████

proc tknz(this : Tknz, segs : seq[string]) : seq[Tkn] = 
        this.segs = segs
        while ((this.segi < this.segs.len) and (this.segs[this.segi] in @["\n", " "])): 
            this.lineIncr(this.segs[this.segi])
        while ((this.eol < this.segs.len) and (this.segs[this.eol] != "\n")): 
            (this.eol += 1)
        while (this.segi < this.segs.len): 
            if (this.segs[this.segi] == "\n"): 
                this.nextLine()
                if (this.segi >= this.segs.len): 
                    break
                this.token = tkn(◂newline, this.line, this.col)
                while (this.peekSafe(0) == " "): 
                    this.advance(1)
                if (this.segi >= this.segs.len): 
                    break
                if (this.tokens[^1].t == ◂newline): 
                    this.tokens.pops()
                this.tokens.add(this.token)
                continue
            this.token = tkn(◂text, this.line, this.col)
            while (this.segi < this.eol): 
                var char = this.peek(0)
                if (char == " "): 
                    if ((this.segi > 0) and (this.peek(-1) != " ")): 
                        this.pushTkn()
                else: 
                    if ((this.col > 0) and (this.peek(-1) == " ")): 
                        this.token.c = this.col
                    if ((this.token.len == 0) and (this.char in {'0'..'9'})): 
                        this.number()
                        continue
                    this.advance(1)
                    continue
                this.incr(1)
            if this.token.len: 
                this.tokens.add(this.token)
        return this.tokens

proc toks*(segs : seq[string]) : seq[Tkn] = Tknz.new.tknz(segs)

proc toks*(text : string) : seq[Tkn] = toks(kseg(text))

    