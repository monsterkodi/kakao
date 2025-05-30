var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.b6=_k_.k.F256(_k_.k.b(6))

var dumptable, intable, kseg, segmenter, wcwidth, wcwidth_ambiguous, wcwidth_combining, wcwidth_doublewidth, wcwidth_emoji_width, wcwidth_nonprint, wcwidth_private, wcwidth_singlewidth

import kstr from "./kstr.js"
import util from "./util.js"

segmenter = new Intl.Segmenter("en-US",{granularity:'grapheme'})

kseg = function (s)
{
    if (_k_.empty(s))
    {
        return []
    }
    if (!(_k_.isStr(s)))
    {
        return s
    }
    return Array.from(segmenter.segment(s)).map(function (r)
    {
        return r.segment
    })
}

kseg.lines = function (s)
{
    var lines, segls

    lines = kstr.lines(s)
    segls = lines.map(function (l)
    {
        return kseg(l)
    })
    return {lines:lines,segls:segls}
}

kseg.segl = function (any)
{
    var a, segls

    if (_k_.isStr(any))
    {
        return kseg(any)
    }
    else if (_k_.isStr(any[0]))
    {
        return any
    }
    else
    {
        segls = []
        var list = _k_.list(any)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            a = list[_a_]
            segls = segls.concat(a)
            segls.push('\n')
        }
        segls.pop()
        return segls
    }
}

kseg.segls = function (any)
{
    if (_k_.isStr(any))
    {
        return kseg.lines(any).segls
    }
    else if (_k_.isArr(any))
    {
        if (_k_.isStr(any[0]))
        {
            return any.map(kseg)
        }
        else if (_k_.isArr(any[0]))
        {
            return any
        }
    }
}

kseg.str = function (any)
{
    if (_k_.empty(any))
    {
        return ''
    }
    if (!(_k_.isArr(any)))
    {
        return String(any)
    }
    if (_k_.isStr(any[0]))
    {
        return any.join('')
    }
    else
    {
        return any.map(kseg.str).join('\n')
    }
}

kseg.join = function (...args)
{
    var a, r

    r = []
    var list = _k_.list(args)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        a = list[_b_]
        r = r.concat(kseg(a))
    }
    return r
}

kseg.detab = function (a, tw = 4)
{
    var i, n

    if (!(_k_.isArr(a)))
    {
        return a
    }
    i = 0
    while (i < a.length)
    {
        if (a[i] === '\t')
        {
            n = tw - (i % tw)
            util.replace(a,i,1,_k_.rpad(n).split(''))
            i += n
        }
        else
        {
            i += 1
        }
    }
    return a
}

kseg.chunks = function (any)
{
    return kseg.infos(any,'chunk',function (s)
    {
        return !(_k_.in(s,' \t\r\n'))
    })
}

kseg.words = function (any)
{
    return kseg.infos(any,'word',function (s)
    {
        return /^\w+$/.test(s)
    })
}

kseg.infos = function (any, key, test)
{
    var g, i, info, infos, turd

    if (_k_.empty(any))
    {
        return []
    }
    infos = []
    turd = true
    var list = _k_.list(kseg.segl(any))
    for (i = 0; i < list.length; i++)
    {
        g = list[i]
        if (turd)
        {
            if (test(g))
            {
                info = {}
                info[key] = g
                info.index = i
                info.segl = [g]
                turd = false
            }
        }
        else
        {
            if (!test(g))
            {
                turd = true
                info[key] = kseg.str(info.segl)
                infos.push(info)
            }
            else
            {
                info.segl.push(g)
            }
        }
    }
    if (!turd)
    {
        info[key] = kseg.str(info.segl)
        infos.push(info)
    }
    return infos
}

kseg.startsWith = function (a, prefix)
{
    var segs

    if (a.length < prefix.length)
    {
        return false
    }
    if (_k_.empty(a) || _k_.empty(prefix))
    {
        return false
    }
    if (!(_k_.isArr(a)))
    {
        return false
    }
    segs = kseg(prefix)
    return _k_.eql(a.slice(0, typeof segs.length === 'number' ? segs.length : -1), segs)
}

kseg.endsWith = function (a, postfix)
{
    var segs

    if (a.length < postfix.length)
    {
        return false
    }
    if (_k_.empty(a) || _k_.empty(postfix))
    {
        return false
    }
    if (!(_k_.isArr(a)))
    {
        return false
    }
    segs = kseg(postfix)
    return _k_.eql(a.slice(a.length - segs.length), segs)
}

kseg.headCount = function (a, c)
{
    var i, s

    var list = _k_.list(a)
    for (i = 0; i < list.length; i++)
    {
        s = list[i]
        if (s !== c)
        {
            return i
        }
    }
    return i
}

kseg.tailCount = function (a, c)
{
    var i

    for (var _e_ = i = 0, _f_ = a.length; (_e_ <= _f_ ? i < a.length : i > a.length); (_e_ <= _f_ ? ++i : --i))
    {
        if (a[a.length - 1 - i] !== c)
        {
            return i
        }
    }
    return i
}

kseg.headCountWord = function (a)
{
    var i, s

    var list = _k_.list(a)
    for (i = 0; i < list.length; i++)
    {
        s = list[i]
        if (!/\w+/.test(s))
        {
            return i
        }
    }
    return i
}

kseg.tailCountWord = function (a)
{
    var i

    for (var _11_ = i = 0, _12_ = a.length; (_11_ <= _12_ ? i < a.length : i > a.length); (_11_ <= _12_ ? ++i : --i))
    {
        if (!/\w+/.test(a[a.length - 1 - i]))
        {
            return i
        }
    }
    return i
}

kseg.headCountTurd = function (a)
{
    var i, s

    var list = _k_.list(a)
    for (i = 0; i < list.length; i++)
    {
        s = list[i]
        if (/[\s\w]+/.test(s))
        {
            return i
        }
    }
    return i
}

kseg.tailCountTurd = function (a)
{
    var i

    for (var _14_ = i = 0, _15_ = a.length; (_14_ <= _15_ ? i < a.length : i > a.length); (_14_ <= _15_ ? ++i : --i))
    {
        if (/[\s\w]+/.test(a[a.length - 1 - i]))
        {
            return i
        }
    }
    return i
}

kseg.headCountChunk = function (a)
{
    var i, s

    var list = _k_.list(a)
    for (i = 0; i < list.length; i++)
    {
        s = list[i]
        if (/[\s]+/.test(s))
        {
            return i
        }
    }
    return i
}

kseg.tailCountChunk = function (a)
{
    var i

    for (var _17_ = i = 0, _18_ = a.length; (_17_ <= _18_ ? i < a.length : i > a.length); (_17_ <= _18_ ? ++i : --i))
    {
        if (/[\s]+/.test(a[a.length - 1 - i]))
        {
            return i
        }
    }
    return i
}

kseg.collectGraphemes = function (a)
{
    var g, gs

    gs = new Set
    var list = _k_.list(a)
    for (var _19_ = 0; _19_ < list.length; _19_++)
    {
        g = list[_19_]
        gs.add(g)
    }
    return Array.from(gs)
}

kseg.spanForClosestWordAtColumn = function (a, c)
{
    var left, ll, ls, lw, right, rl, rs, rw, s, segi

    a = kseg(a)
    segi = kseg.segiAtWidth(a,c)
    left = a.slice(0, typeof segi === 'number' ? segi : -1)
    right = a.slice(segi)
    ls = kseg.tailCount(left,' ')
    rs = kseg.headCount(right,' ')
    lw = kseg.tailCountWord(left)
    rw = kseg.headCountWord(right)
    ll = left.length
    rl = right.length
    if (ls === ll && rs === rl)
    {
        s = [c,c]
    }
    else if ((ls === rs && rs === 0))
    {
        s = [c - lw,c + rw]
    }
    else if (ls === ll)
    {
        s = [c + rs,c + rs + kseg.headCountWord(right.slice(rs))]
    }
    else if (rs === rl)
    {
        s = [c - ls - kseg.tailCountWord(left.slice(0, ll - ls)),c - ls]
    }
    else if (ls === rs)
    {
        s = kseg.spanForClosestWordAtColumn(left,c - ls)
    }
    else if (ls < rs)
    {
        s = kseg.spanForClosestWordAtColumn(left,c)
    }
    else if (ls > rs)
    {
        s = kseg.spanForClosestWordAtColumn(right,0)
        s[0] += c
        s[1] += c
    }
    return s
}

kseg.numIndent = function (a)
{
    return kseg.headCount(a,' ')
}

kseg.splitAtIndent = function (a)
{
    var i

    i = kseg.numIndent(a)
    return [a.slice(0, typeof i === 'number' ? i : -1),a.slice(i)]
}

kseg.repeat = function (n, s = ' ')
{
    var a, i

    if (n <= 0)
    {
        return []
    }
    s = kseg(s)
    a = []
    for (var _1a_ = i = 0, _1b_ = n; (_1a_ <= _1b_ ? i < n : i > n); (_1a_ <= _1b_ ? ++i : --i))
    {
        a = a.concat(s)
    }
    return a
}

kseg.trim = function (s, c = ' ')
{
    var hc, tc

    if (_k_.empty(s))
    {
        return []
    }
    s = kseg(s)
    hc = kseg.headCount(s,c)
    tc = kseg.tailCount(s,c)
    return s.slice(hc, s.length - tc)
}

kseg.segiAtWidth = function (segs, w)
{
    var i, s

    w = _k_.min(w,segs.length * 2)
    i = s = 0
    while (s < w && i < segs.length)
    {
        s += kseg.width(segs[i])
        i += 1
    }
    if (s > w)
    {
        i -= 1
    }
    return i
}

kseg.widthAtSegi = function (segs, segi)
{
    return kseg.width(segs.slice(0, typeof segi === 'number' ? segi : -1))
}

kseg.width = function (s)
{
    var seg, segs, w

    if (_k_.empty(s))
    {
        return 0
    }
    if (_k_.isStr(s))
    {
        segs = kseg(s)
    }
    else
    {
        segs = s
    }
    w = 0
    var list = _k_.list(segs)
    for (var _1c_ = 0; _1c_ < list.length; _1c_++)
    {
        seg = list[_1c_]
        w += kseg.segWidth(seg)
    }
    return w
}

kseg.segWidth = function (seg)
{
    return wcwidth(seg.codePointAt(0))
}

kseg.indexAtWidth = function (segs, w)
{
    var i, s

    i = s = 0
    while (s < w && i < segs.length)
    {
        s += kseg.segWidth(segs[i])
        i += 1
    }
    return i
}

kseg.hash = function (s)
{
    var h, i

    if (_k_.empty(s))
    {
        return 0
    }
    s = kseg(s)
    h = 9
    for (var _1d_ = i = s.length - 1, _1e_ = 0; (_1d_ <= _1e_ ? i <= 0 : i >= 0); (_1d_ <= _1e_ ? ++i : --i))
    {
        h = Math.imul(h ^ s[i].codePointAt(0),9 ** 9)
    }
    return h ^ h >> 9
}
wcwidth_private = [[0x00e000,0x00f8ff],[0x0f0000,0x0ffffd],[0x100000,0x10fffd]]
wcwidth_nonprint = [[0x0000,0x001f],[0x007f,0x009f],[0x00ad,0x00ad],[0x070f,0x070f],[0x180b,0x180e],[0x200b,0x200f],[0x2028,0x2029],[0x202a,0x202e],[0x206a,0x206f],[0xd800,0xdfff],[0xfeff,0xfeff],[0xfff9,0xfffb],[0xfffe,0xffff]]
wcwidth_combining = [[0x0300,0x036f],[0x0483,0x0489],[0x0591,0x05bd],[0x05bf,0x05bf],[0x05c1,0x05c2],[0x05c4,0x05c5],[0x05c7,0x05c7],[0x0610,0x061a],[0x064b,0x065f],[0x0670,0x0670],[0x06d6,0x06dc],[0x06df,0x06e4],[0x06e7,0x06e8],[0x06ea,0x06ed],[0x0711,0x0711],[0x0730,0x074a],[0x07a6,0x07b0],[0x07eb,0x07f3],[0x0816,0x0819],[0x081b,0x0823],[0x0825,0x0827],[0x0829,0x082d],[0x0859,0x085b],[0x08d4,0x08e1],[0x08e3,0x0903],[0x093a,0x093c],[0x093e,0x094f],[0x0951,0x0957],[0x0962,0x0963],[0x0981,0x0983],[0x09bc,0x09bc],[0x09be,0x09c4],[0x09c7,0x09c8],[0x09cb,0x09cd],[0x09d7,0x09d7],[0x09e2,0x09e3],[0x0a01,0x0a03],[0x0a3c,0x0a3c],[0x0a3e,0x0a42],[0x0a47,0x0a48],[0x0a4b,0x0a4d],[0x0a51,0x0a51],[0x0a70,0x0a71],[0x0a75,0x0a75],[0x0a81,0x0a83],[0x0abc,0x0abc],[0x0abe,0x0ac5],[0x0ac7,0x0ac9],[0x0acb,0x0acd],[0x0ae2,0x0ae3],[0x0b01,0x0b03],[0x0b3c,0x0b3c],[0x0b3e,0x0b44],[0x0b47,0x0b48],[0x0b4b,0x0b4d],[0x0b56,0x0b57],[0x0b62,0x0b63],[0x0b82,0x0b82],[0x0bbe,0x0bc2],[0x0bc6,0x0bc8],[0x0bca,0x0bcd],[0x0bd7,0x0bd7],[0x0c00,0x0c03],[0x0c3e,0x0c44],[0x0c46,0x0c48],[0x0c4a,0x0c4d],[0x0c55,0x0c56],[0x0c62,0x0c63],[0x0c81,0x0c83],[0x0cbc,0x0cbc],[0x0cbe,0x0cc4],[0x0cc6,0x0cc8],[0x0cca,0x0ccd],[0x0cd5,0x0cd6],[0x0ce2,0x0ce3],[0x0d01,0x0d03],[0x0d3e,0x0d44],[0x0d46,0x0d48],[0x0d4a,0x0d4d],[0x0d57,0x0d57],[0x0d62,0x0d63],[0x0d82,0x0d83],[0x0dca,0x0dca],[0x0dcf,0x0dd4],[0x0dd6,0x0dd6],[0x0dd8,0x0ddf],[0x0df2,0x0df3],[0x0e31,0x0e31],[0x0e34,0x0e3a],[0x0e47,0x0e4e],[0x0eb1,0x0eb1],[0x0eb4,0x0eb9],[0x0ebb,0x0ebc],[0x0ec8,0x0ecd],[0x0f18,0x0f19],[0x0f35,0x0f35],[0x0f37,0x0f37],[0x0f39,0x0f39],[0x0f3e,0x0f3f],[0x0f71,0x0f84],[0x0f86,0x0f87],[0x0f8d,0x0f97],[0x0f99,0x0fbc],[0x0fc6,0x0fc6],[0x102b,0x103e],[0x1056,0x1059],[0x105e,0x1060],[0x1062,0x1064],[0x1067,0x106d],[0x1071,0x1074],[0x1082,0x108d],[0x108f,0x108f],[0x109a,0x109d],[0x135d,0x135f],[0x1712,0x1714],[0x1732,0x1734],[0x1752,0x1753],[0x1772,0x1773],[0x17b4,0x17d3],[0x17dd,0x17dd],[0x180b,0x180d],[0x1885,0x1886],[0x18a9,0x18a9],[0x1920,0x192b],[0x1930,0x193b],[0x1a17,0x1a1b],[0x1a55,0x1a5e],[0x1a60,0x1a7c],[0x1a7f,0x1a7f],[0x1ab0,0x1abe],[0x1b00,0x1b04],[0x1b34,0x1b44],[0x1b6b,0x1b73],[0x1b80,0x1b82],[0x1ba1,0x1bad],[0x1be6,0x1bf3],[0x1c24,0x1c37],[0x1cd0,0x1cd2],[0x1cd4,0x1ce8],[0x1ced,0x1ced],[0x1cf2,0x1cf4],[0x1cf8,0x1cf9],[0x1dc0,0x1df5],[0x1dfb,0x1dff],[0x20d0,0x20f0],[0x2cef,0x2cf1],[0x2d7f,0x2d7f],[0x2de0,0x2dff],[0x302a,0x302f],[0x3099,0x309a],[0xa66f,0xa672],[0xa674,0xa67d],[0xa69e,0xa69f],[0xa6f0,0xa6f1],[0xa802,0xa802],[0xa806,0xa806],[0xa80b,0xa80b],[0xa823,0xa827],[0xa880,0xa881],[0xa8b4,0xa8c5],[0xa8e0,0xa8f1],[0xa926,0xa92d],[0xa947,0xa953],[0xa980,0xa983],[0xa9b3,0xa9c0],[0xa9e5,0xa9e5],[0xaa29,0xaa36],[0xaa43,0xaa43],[0xaa4c,0xaa4d],[0xaa7b,0xaa7d],[0xaab0,0xaab0],[0xaab2,0xaab4],[0xaab7,0xaab8],[0xaabe,0xaabf],[0xaac1,0xaac1],[0xaaeb,0xaaef],[0xaaf5,0xaaf6],[0xabe3,0xabea],[0xabec,0xabed],[0xfb1e,0xfb1e],[0xfe00,0xfe0f],[0xfe20,0xfe2f],[0x101fd,0x101fd],[0x102e0,0x102e0],[0x10376,0x1037a],[0x10a01,0x10a03],[0x10a05,0x10a06],[0x10a0c,0x10a0f],[0x10a38,0x10a3a],[0x10a3f,0x10a3f],[0x10ae5,0x10ae6],[0x11000,0x11002],[0x11038,0x11046],[0x1107f,0x11082],[0x110b0,0x110ba],[0x11100,0x11102],[0x11127,0x11134],[0x11173,0x11173],[0x11180,0x11182],[0x111b3,0x111c0],[0x111ca,0x111cc],[0x1122c,0x11237],[0x1123e,0x1123e],[0x112df,0x112ea],[0x11300,0x11303],[0x1133c,0x1133c],[0x1133e,0x11344],[0x11347,0x11348],[0x1134b,0x1134d],[0x11357,0x11357],[0x11362,0x11363],[0x11366,0x1136c],[0x11370,0x11374],[0x11435,0x11446],[0x114b0,0x114c3],[0x115af,0x115b5],[0x115b8,0x115c0],[0x115dc,0x115dd],[0x11630,0x11640],[0x116ab,0x116b7],[0x1171d,0x1172b],[0x11c2f,0x11c36],[0x11c38,0x11c3f],[0x11c92,0x11ca7],[0x11ca9,0x11cb6],[0x16af0,0x16af4],[0x16b30,0x16b36],[0x16f51,0x16f7e],[0x16f8f,0x16f92],[0x1bc9d,0x1bc9e],[0x1d165,0x1d169],[0x1d16d,0x1d172],[0x1d17b,0x1d182],[0x1d185,0x1d18b],[0x1d1aa,0x1d1ad],[0x1d242,0x1d244],[0x1da00,0x1da36],[0x1da3b,0x1da6c],[0x1da75,0x1da75],[0x1da84,0x1da84],[0x1da9b,0x1da9f],[0x1daa1,0x1daaf],[0x1e000,0x1e006],[0x1e008,0x1e018],[0x1e01b,0x1e021],[0x1e023,0x1e024],[0x1e026,0x1e02a],[0x1e8d0,0x1e8d6],[0x1e944,0x1e94a],[0xe0100,0xe01ef]]
wcwidth_ambiguous = [[0x00a1,0x00a1],[0x00a4,0x00a4],[0x00a7,0x00a8],[0x00aa,0x00aa],[0x00ad,0x00ae],[0x00b0,0x00b4],[0x00b6,0x00ba],[0x00bc,0x00bf],[0x00c6,0x00c6],[0x00d0,0x00d0],[0x00d7,0x00d8],[0x00de,0x00e1],[0x00e6,0x00e6],[0x00e8,0x00ea],[0x00ec,0x00ed],[0x00f0,0x00f0],[0x00f2,0x00f3],[0x00f7,0x00fa],[0x00fc,0x00fc],[0x00fe,0x00fe],[0x0101,0x0101],[0x0111,0x0111],[0x0113,0x0113],[0x011b,0x011b],[0x0126,0x0127],[0x012b,0x012b],[0x0131,0x0133],[0x0138,0x0138],[0x013f,0x0142],[0x0144,0x0144],[0x0148,0x014b],[0x014d,0x014d],[0x0152,0x0153],[0x0166,0x0167],[0x016b,0x016b],[0x01ce,0x01ce],[0x01d0,0x01d0],[0x01d2,0x01d2],[0x01d4,0x01d4],[0x01d6,0x01d6],[0x01d8,0x01d8],[0x01da,0x01da],[0x01dc,0x01dc],[0x0251,0x0251],[0x0261,0x0261],[0x02c4,0x02c4],[0x02c7,0x02c7],[0x02c9,0x02cb],[0x02cd,0x02cd],[0x02d0,0x02d0],[0x02d8,0x02db],[0x02dd,0x02dd],[0x02df,0x02df],[0x0391,0x03a1],[0x03a3,0x03a9],[0x03b1,0x03c1],[0x03c3,0x03c9],[0x0401,0x0401],[0x0410,0x044f],[0x0451,0x0451],[0x2010,0x2010],[0x2013,0x2016],[0x2018,0x2019],[0x201c,0x201d],[0x2020,0x2022],[0x2024,0x2027],[0x2030,0x2030],[0x2032,0x2033],[0x2035,0x2035],[0x203b,0x203b],[0x203e,0x203e],[0x2074,0x2074],[0x207f,0x207f],[0x2081,0x2084],[0x20ac,0x20ac],[0x2103,0x2103],[0x2105,0x2105],[0x2109,0x2109],[0x2113,0x2113],[0x2116,0x2116],[0x2121,0x2122],[0x2126,0x2126],[0x212b,0x212b],[0x2153,0x2154],[0x215b,0x215e],[0x2160,0x216b],[0x2170,0x2179],[0x2189,0x2189],[0x2190,0x2199],[0x21b8,0x21b9],[0x21d2,0x21d2],[0x21d4,0x21d4],[0x21e7,0x21e7],[0x2200,0x2200],[0x2202,0x2203],[0x2207,0x2208],[0x220b,0x220b],[0x220f,0x220f],[0x2211,0x2211],[0x2215,0x2215],[0x221a,0x221a],[0x221d,0x2220],[0x2223,0x2223],[0x2225,0x2225],[0x2227,0x222c],[0x222e,0x222e],[0x2234,0x2237],[0x223c,0x223d],[0x2248,0x2248],[0x224c,0x224c],[0x2252,0x2252],[0x2260,0x2261],[0x2264,0x2267],[0x226a,0x226b],[0x226e,0x226f],[0x2282,0x2283],[0x2286,0x2287],[0x2295,0x2295],[0x2299,0x2299],[0x22a5,0x22a5],[0x22bf,0x22bf],[0x2312,0x2312],[0x2460,0x24e9],[0x2550,0x2573],[0x2580,0x258f],[0x2592,0x2595],[0x25a0,0x25a1],[0x25a3,0x25a9],[0x25b2,0x25b3],[0x25b6,0x25b7],[0x25bc,0x25bd],[0x25c0,0x25c1],[0x25c6,0x25c8],[0x25cb,0x25cb],[0x25ce,0x25d1],[0x25e2,0x25e5],[0x25ef,0x25ef],[0x2605,0x2606],[0x2609,0x2609],[0x260e,0x260f],[0x261c,0x261c],[0x261e,0x261e],[0x2640,0x2640],[0x2642,0x2642],[0x2660,0x2661],[0x2663,0x2665],[0x2667,0x266a],[0x266c,0x266d],[0x266f,0x266f],[0x269e,0x269f],[0x26bf,0x26bf],[0x26c6,0x26cd],[0x26cf,0x26d3],[0x26d5,0x26e1],[0x26e3,0x26e3],[0x26e8,0x26e9],[0x26eb,0x26f1],[0x26f4,0x26f4],[0x26f6,0x26f9],[0x26fb,0x26fc],[0x26fe,0x26ff],[0x273d,0x273d],[0x2776,0x277f],[0x2b56,0x2b59],[0x3248,0x324f],[0xe000,0xf8ff],[0xfe00,0xfe0f],[0xfffd,0xfffd],[0x1f100,0x1f10a],[0x1f110,0x1f12d],[0x1f130,0x1f169],[0x1f170,0x1f18d],[0x1f18f,0x1f190],[0x1f19b,0x1f1ac],[0xe0100,0xe01ef],[0xf0000,0xffffd],[0x100000,0x10fffd]]
wcwidth_doublewidth = [[0x1100,0x115f],[0x231a,0x231b],[0x2329,0x232a],[0x23e9,0x23ec],[0x23f0,0x23f0],[0x23f3,0x23f3],[0x25fd,0x25fe],[0x2614,0x2615],[0x2648,0x2653],[0x267f,0x267f],[0x2693,0x2693],[0x26a1,0x26a1],[0x26aa,0x26ab],[0x26bd,0x26be],[0x26c4,0x26c5],[0x26ce,0x26ce],[0x26d4,0x26d4],[0x26ea,0x26ea],[0x26f2,0x26f3],[0x26f5,0x26f5],[0x26fa,0x26fa],[0x26fd,0x26fd],[0x2705,0x2705],[0x270a,0x270b],[0x2728,0x2728],[0x274c,0x274c],[0x274e,0x274e],[0x2753,0x2755],[0x2757,0x2757],[0x2795,0x2797],[0x27b0,0x27b0],[0x27bf,0x27bf],[0x2b1b,0x2b1c],[0x2b50,0x2b50],[0x2b55,0x2b55],[0x2e80,0x2e99],[0x2e9b,0x2ef3],[0x2f00,0x2fd5],[0x2ff0,0x2ffb],[0x3000,0x303e],[0x3041,0x3096],[0x3099,0x30ff],[0x3105,0x312d],[0x3131,0x318e],[0x3190,0x31ba],[0x31c0,0x31e3],[0x31f0,0x321e],[0x3220,0x3247],[0x3250,0x32fe],[0x3300,0x4dbf],[0x4e00,0xa48c],[0xa490,0xa4c6],[0xa960,0xa97c],[0xac00,0xd7a3],[0xf900,0xfaff],[0xfe10,0xfe19],[0xfe30,0xfe52],[0xfe54,0xfe66],[0xfe68,0xfe6b],[0xff01,0xff60],[0xffe0,0xffe6],[0x16fe0,0x16fe0],[0x17000,0x187ec],[0x18800,0x18af2],[0x1b000,0x1b001],[0x1f004,0x1f004],[0x1f0cf,0x1f0cf],[0x1f18e,0x1f18e],[0x1f191,0x1f19a],[0x1f200,0x1f202],[0x1f210,0x1f23b],[0x1f240,0x1f248],[0x1f250,0x1f251],[0x1f300,0x1f320],[0x1f32d,0x1f335],[0x1f337,0x1f37c],[0x1f37e,0x1f393],[0x1f3a0,0x1f3ca],[0x1f3cf,0x1f3d3],[0x1f3e0,0x1f3f0],[0x1f3f4,0x1f3f4],[0x1f3f8,0x1f43e],[0x1f440,0x1f440],[0x1f442,0x1f4fc],[0x1f4ff,0x1f53d],[0x1f54b,0x1f54e],[0x1f550,0x1f567],[0x1f57a,0x1f57a],[0x1f595,0x1f596],[0x1f5a4,0x1f5a4],[0x1f5fb,0x1f64f],[0x1f680,0x1f6c5],[0x1f6cc,0x1f6cc],[0x1f6d0,0x1f6d2],[0x1f6eb,0x1f6ec],[0x1f6f4,0x1f6f8],[0x1f910,0x1f91e],[0x1f920,0x1f927],[0x1f930,0x1f930],[0x1f933,0x1f93e],[0x1f940,0x1f94b],[0x1f950,0x1f95e],[0x1f980,0x1f991],[0x1f9c0,0x1f9c0],[0x1f9d1,0x1f9d1],[0x20000,0x2fffd],[0x30000,0x3fffd]]
wcwidth_emoji_width = [[0x1f1e6,0x1f1ff],[0x1f321,0x1f321],[0x1f324,0x1f32c],[0x1f336,0x1f336],[0x1f37d,0x1f37d],[0x1f396,0x1f397],[0x1f399,0x1f39b],[0x1f39e,0x1f39f],[0x1f3cb,0x1f3ce],[0x1f3d4,0x1f3df],[0x1f3f3,0x1f3f5],[0x1f3f7,0x1f3f7],[0x1f43f,0x1f43f],[0x1f4fd,0x1f4fd],[0x1f549,0x1f54a],[0x1f56f,0x1f570],[0x1f573,0x1f579],[0x1f587,0x1f587],[0x1f590,0x1f590],[0x1f5a5,0x1f5a5],[0x1f5a8,0x1f5a8],[0x1f5b1,0x1f5b2],[0x1f5bc,0x1f5bc],[0x1f5c2,0x1f5c4],[0x1f5d1,0x1f5d3],[0x1f5dc,0x1f5de],[0x1f5e1,0x1f5e1],[0x1f5e3,0x1f5e3],[0x1f5e8,0x1f5e8],[0x1f5ef,0x1f5ef],[0x1f5f3,0x1f5f3],[0x1f5fa,0x1f5fa],[0x1f6cb,0x1f6cf],[0x1f6e9,0x1f6e9],[0x1f6f0,0x1f6f0],[0x1f6f3,0x1f6f3]]
wcwidth_singlewidth = [[32,0x7f],[0xa0,0x300],[0x24eb,0x254b]]

intable = function (table, c)
{
    var bot, mid, top

    if (c < table[0][0])
    {
        return
    }
    if (c > table.slice(-1)[0][1])
    {
        return
    }
    bot = 0
    top = table.length - 1
    while (top >= bot)
    {
        mid = parseInt((bot + top) / 2)
        if (table[mid][1] < c)
        {
            bot = mid + 1
        }
        else if (table[mid][0] > c)
        {
            top = mid - 1
        }
        else
        {
            return true
        }
    }
}

wcwidth = function (c)
{
    if (c < 0 || c > 0x10ffff)
    {
        return 0
    }
    if (intable(wcwidth_singlewidth,c))
    {
        return 1
    }
    if (intable(wcwidth_ambiguous,c))
    {
        return 1
    }
    if (intable(wcwidth_private,c))
    {
        return 1
    }
    if (intable(wcwidth_doublewidth,c))
    {
        return 2
    }
    if (intable(wcwidth_emoji_width,c))
    {
        return 2
    }
    if (intable(wcwidth_nonprint,c))
    {
        return 0
    }
    if (intable(wcwidth_combining,c))
    {
        return 0
    }
    return 1
}

dumptable = function (table)
{
    var c, item, s

    var list = _k_.list(table)
    for (var _1f_ = 0; _1f_ < list.length; _1f_++)
    {
        item = list[_1f_]
        s = _k_.b6(item[0].toString(16)) + '-' + _k_.b6(item[1].toString(16))
        for (var _20_ = c = item[0], _21_ = item[1]; (_20_ <= _21_ ? c <= item[1] : c >= item[1]); (_20_ <= _21_ ? ++c : --c))
        {
            s += String.fromCodePoint(c)
        }
        console.log(s)
    }
}
export default kseg;