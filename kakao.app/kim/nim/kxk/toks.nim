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

type Tkn* = object
    t*: tt
    s*: int
    e*: int
    l*: int
    c*: int

proc init*(this : var Tkn, t : tt, s = -1, e = -1, l = -1, c = -1) : Tkn = 
       this.t = t ; this.s = s ; this.e = e ; this.l = l ; this.c = c ; this

proc `$`*(this : Tkn) : string = &"tkn({this.t} {this.s} {this.e} {this.l} {this.c})"

proc len*(this : var Tkn) : int = (this.e - this.s)

proc tkn*(typ : tt, ss : int, line : int, col : int) : Tkn = 
       var t = Tkn() ; t.init(typ, ss, ss, line, col)

proc tkn*(typ : tt, ss : int, se : int, line : int, col : int) : Tkn = 
       var t = Tkn() ; t.init(typ, ss, se, line, col)

type Tknz = object
    lines: seq[seq[Tkn]]
    line: seq[Tkn]
    token: Tkn
    segi: int
    segs: seq[string]
    bol: int
    idx: int
# segi at start of current line
# current line index

proc col(this : var Tknz) : int = (this.segi - this.bol)

proc `$`(this : Tknz) : string = 
        &"▸▸▸ {this.lines} {this.token} bol {this.bol} segi {this.segi} {this.segs} ◂◂◂"
# █████████  ███   ███  ███   ███  ███████
#    ███     ███  ███   ████  ███     ███ 
#    ███     ███████    ███ █ ███    ███  
#    ███     ███  ███   ███  ████   ███   
#    ███     ███   ███  ███   ███  ███████

proc push(this : var Tknz) = 
        if this.token.len: this.line.add(this.token)
        if this.line.len: this.lines.add(this.line)

proc next(this : var Tknz) : bool = 
        if (this.segi >= this.segs.len): return false
        case this.segs[this.segi]:
            of "\n": 
                this.push()
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

proc tknz(this : var Tknz, segs : seq[string]) : seq[seq[Tkn]] = 
        this.segs = segs
        while this.next(): discard
        this.push()
        return this.lines

proc toks*(segs : seq[string]) : seq[seq[Tkn]] = 
        var t = Tknz() ; t.tknz(segs)

proc toks*(text : string) : seq[seq[Tkn]] = toks(kseg(text))

proc nums*(segs : seq[string], tkns : seq[seq[Tkn]]) : seq[seq[Tkn]] = 
    for i1, tknl in tkns: 
        for i2, tkn in tknl: 
            var p = tkn.s
            
            proc seg(o = 0) : string = 
                  if ((p + o) < tkn.e): segs[(p + o)] else: ""
            
            proc chr(o = 0) : char = 
                  var s = seg(o) ; if (s.len > 0): s[0] else: ' '
            
            proc adv(n : int) = (p += n)
            
            proc adv(s : set[char]) = 
                  while (chr() in s): (p += 1)
            
            proc num = 
                if (p == tkn.e): 
                    cast[ref seq[seq[Tkn]]](unsafeAddr(tkns))[i1][i2].t = ◂number
            if (seg() == "0"): 
                if (seg(1) == "x"): 
                    adv(2)
                    adv({'0'..'9', 'a'..'f', 'A'..'F'})
                    num()
                    continue
                if (seg(1) == "b"): 
                    adv(2)
                    adv({'0', '1'})
                    num()
                    continue
                if (seg(1) == "o"): 
                    adv(2)
                    adv({'0'..'7'})
                    num()
                    continue
            adv({'0'..'9'})
            if (p == tkn.s): continue
            if ((seg() == ".") and (chr(1) in {'0'..'9'})): 
                adv(1)
                adv({'0'..'9'})
            if ((seg() == "e") and (chr(1) in {'0'..'9', '+', '-'})): 
                adv(2)
                adv({'0'..'9'})
            num()
    tkns