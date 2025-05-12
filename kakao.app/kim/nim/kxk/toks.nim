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

proc `$`*(this : Tkn) : string = 
        &"tkn({this.t} {this.s} {this.e} {this.l} {this.c})"

proc len*(this : var Tkn) : int = (this.e - this.s)

proc tkn*(typ : tt, ss : int, line : int, col : int) : Tkn = 
    var t = default(Tkn)
    t.init(typ, ss, ss, line, col)

proc tkn*(typ : tt, ss : int, se : int, line : int, col : int) : Tkn = 
    var t = default(Tkn)
    t.init(typ, ss, se, line, col)

type Tknz = ref object of RootObj
    lines: seq[seq[Tkn]]
    line: seq[Tkn]
    token: Tkn
    segi: int
    segs: seq[string]
    bol: int
    idx: int
# segi at start of current line
# current line index

proc col(this : Tknz) : int = (this.segi - this.bol)

proc `$`(this : Tknz) : string = 
        &"▸▸▸ {this.lines} {this.token} bol {this.bol} segi {this.segi} {this.segs} ◂◂◂"
# number: ->
# 
#     @push ◂number
# 
#     l = @segs.len
#     
#     if @segi < l-1 and @segs[@segi] == "0" 
#         if @segs[@segi+1] == "x"
#             @advance 2
#             @advance {'0'..'9' 'a'..'f' 'A'..'F'}
#             @push()
#             ⮐   
#         if @segs[@segi+1] == "b"
#             @advance 2
#             @advance {'0' '1'}
#             @push()
#             ⮐   
#         if @segs[@segi+1] == "o"
#             @advance 2
#             @advance {'0'..'7' }
#             @push()
#             ⮐   
#             
#     @advance {'0'..'9'}
#         
#     if @segi < l-1 and @char == '.' and @char(1) in {'0'..'9'}
#         @advance 1
#         @advance {'0'..'9'}
# 
#     if @segi < l-1 and @char == 'e' and @char(1) in {'0'..'9' '+' '-'}
#         @advance 2
#         @advance {'0'..'9'}
#     
#     @push()
# █████████  ███   ███  ███   ███  ███████
#    ███     ███  ███   ████  ███     ███ 
#    ███     ███████    ███ █ ███    ███  
#    ███     ███  ███   ███  ████   ███   
#    ███     ███   ███  ███   ███  ███████

proc next(this : Tknz) : bool = 
        if (this.segi >= this.segs.len): return false
        case this.segs[this.segi]:
            of "\n": 
                if this.token.len: this.line.add(this.token)
                if this.line.len: this.lines.add(this.line)
                this.line = @[]
                (this.idx += 1)
                this.bol = this.segi
                this.token = tkn(◂text, (this.segi + 1), this.idx, 0)
            of " ": 
                if this.token.len: 
                    this.line.add(this.token)
                    this.token = tkn(◂text, (this.segi + 1), this.idx, (this.col + 1))
                else: 
                    (this.token.s += 1)
                    (this.token.e += 1)
                    (this.token.c += 1)
            else: 
                (this.token.e += 1)
        (this.segi += 1)
        true

proc tknz(this : Tknz, segs : seq[string]) : seq[seq[Tkn]] = 
        this.segs = segs
        while this.next(): discard
        if this.token.len: this.line.add(this.token)
        if this.line.len: this.lines.add(this.line)
        return this.lines

proc toks*(segs : seq[string]) : seq[seq[Tkn]] = Tknz.new.tknz(segs)

proc toks*(text : string) : seq[seq[Tkn]] = toks(kseg(text))

    