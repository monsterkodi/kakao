var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isArr: function (o) {return Array.isArray(o)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }}

var bisearch, combining, kseg, segmenter, wcwidth

import kstr from "./kstr.js"

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

kseg.segls = function (s)
{
    return kseg.lines(s).segls
}

kseg.str = function (a)
{
    if (_k_.empty(a))
    {
        return ''
    }
    if (!(_k_.isArr(a)))
    {
        return a
    }
    if (_k_.isStr(a[0]))
    {
        return a.join('')
    }
    else
    {
        return a.map(kseg.str).join('\n')
    }
}

kseg.join = function (...args)
{
    var a, r

    r = []
    var list = _k_.list(args)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        a = list[_a_]
        r = r.concat(kseg(a))
    }
    return r
}

kseg.detab = function (a, tw = 4)
{
    var args, i, n

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
            args = [i,1].concat(_k_.rpad(n).split(''))
            a.splice.apply(a,args)
            i += n
        }
        else
        {
            i += 1
        }
    }
    return a
}

kseg.chunks = function (a)
{
    var chunk, chunks, g, i, spaces

    chunks = []
    spaces = true
    var list = _k_.list(a)
    for (i = 0; i < list.length; i++)
    {
        g = list[i]
        if (spaces)
        {
            if (!(_k_.in(g,' \t\r\n')))
            {
                chunk = {index:i,segl:[g]}
                spaces = false
            }
        }
        else
        {
            if (_k_.in(g,' \t\r\n'))
            {
                spaces = true
                chunks.push(chunk)
            }
            else
            {
                chunk.segl.push(g)
            }
        }
    }
    if (!spaces)
    {
        chunks.push(chunk)
    }
    return chunks
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

kseg.numIndent = function (a)
{
    var i, s

    i = 0
    var list = _k_.list(a)
    for (var _c_ = 0; _c_ < list.length; _c_++)
    {
        s = list[_c_]
        if (s !== ' ')
        {
            return i
        }
        i += 1
    }
    return i
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
    for (var _d_ = i = 0, _e_ = n; (_d_ <= _e_ ? i < n : i > n); (_d_ <= _e_ ? ++i : --i))
    {
        a = a.concat(s)
    }
    return a
}

kseg.width = function (c)
{
    var i, n, s

    s = 0
    for (var _f_ = i = 0, _10_ = c.length; (_f_ <= _10_ ? i < c.length : i > c.length); (_f_ <= _10_ ? ++i : --i))
    {
        n = wcwidth(c.charCodeAt(i))
        if (n < 0)
        {
            return -1
        }
        s += n
    }
    return s
}

wcwidth = function (ucs)
{
    var w

    if (ucs === 0)
    {
        return 0
    }
    if (ucs < 32 || (ucs >= 0x7f && ucs < 0xa0))
    {
        return 0
    }
    if (bisearch(ucs))
    {
        return 0
    }
    w = (ucs >= 0x1100 && (ucs <= 0x115f || ucs === 0x2329 || ucs === 0x232a || (ucs >= 0x2e80 && ucs <= 0xa4cf && ucs !== 0x303f) || (ucs >= 0xac00 && ucs <= 0xd7a3) || (ucs >= 0xf900 && ucs <= 0xfaff) || (ucs >= 0xfe10 && ucs <= 0xfe19) || (ucs >= 0xfe30 && ucs <= 0xfe6f) || (ucs >= 0xff00 && ucs <= 0xff60) || (ucs >= 0xffe0 && ucs <= 0xffe6) || (ucs >= 0x20000 && ucs <= 0x2fffd) || (ucs >= 0x30000 && ucs <= 0x3fffd)))
    return 1 + ((w ? 1 : 0))
}
combining = [[0x0300,0x036F],[0x0483,0x0486],[0x0488,0x0489],[0x0591,0x05BD],[0x05BF,0x05BF],[0x05C1,0x05C2],[0x05C4,0x05C5],[0x05C7,0x05C7],[0x0600,0x0603],[0x0610,0x0615],[0x064B,0x065E],[0x0670,0x0670],[0x06D6,0x06E4],[0x06E7,0x06E8],[0x06EA,0x06ED],[0x070F,0x070F],[0x0711,0x0711],[0x0730,0x074A],[0x07A6,0x07B0],[0x07EB,0x07F3],[0x0901,0x0902],[0x093C,0x093C],[0x0941,0x0948],[0x094D,0x094D],[0x0951,0x0954],[0x0962,0x0963],[0x0981,0x0981],[0x09BC,0x09BC],[0x09C1,0x09C4],[0x09CD,0x09CD],[0x09E2,0x09E3],[0x0A01,0x0A02],[0x0A3C,0x0A3C],[0x0A41,0x0A42],[0x0A47,0x0A48],[0x0A4B,0x0A4D],[0x0A70,0x0A71],[0x0A81,0x0A82],[0x0ABC,0x0ABC],[0x0AC1,0x0AC5],[0x0AC7,0x0AC8],[0x0ACD,0x0ACD],[0x0AE2,0x0AE3],[0x0B01,0x0B01],[0x0B3C,0x0B3C],[0x0B3F,0x0B3F],[0x0B41,0x0B43],[0x0B4D,0x0B4D],[0x0B56,0x0B56],[0x0B82,0x0B82],[0x0BC0,0x0BC0],[0x0BCD,0x0BCD],[0x0C3E,0x0C40],[0x0C46,0x0C48],[0x0C4A,0x0C4D],[0x0C55,0x0C56],[0x0CBC,0x0CBC],[0x0CBF,0x0CBF],[0x0CC6,0x0CC6],[0x0CCC,0x0CCD],[0x0CE2,0x0CE3],[0x0D41,0x0D43],[0x0D4D,0x0D4D],[0x0DCA,0x0DCA],[0x0DD2,0x0DD4],[0x0DD6,0x0DD6],[0x0E31,0x0E31],[0x0E34,0x0E3A],[0x0E47,0x0E4E],[0x0EB1,0x0EB1],[0x0EB4,0x0EB9],[0x0EBB,0x0EBC],[0x0EC8,0x0ECD],[0x0F18,0x0F19],[0x0F35,0x0F35],[0x0F37,0x0F37],[0x0F39,0x0F39],[0x0F71,0x0F7E],[0x0F80,0x0F84],[0x0F86,0x0F87],[0x0F90,0x0F97],[0x0F99,0x0FBC],[0x0FC6,0x0FC6],[0x102D,0x1030],[0x1032,0x1032],[0x1036,0x1037],[0x1039,0x1039],[0x1058,0x1059],[0x1160,0x11FF],[0x135F,0x135F],[0x1712,0x1714],[0x1732,0x1734],[0x1752,0x1753],[0x1772,0x1773],[0x17B4,0x17B5],[0x17B7,0x17BD],[0x17C6,0x17C6],[0x17C9,0x17D3],[0x17DD,0x17DD],[0x180B,0x180D],[0x18A9,0x18A9],[0x1920,0x1922],[0x1927,0x1928],[0x1932,0x1932],[0x1939,0x193B],[0x1A17,0x1A18],[0x1B00,0x1B03],[0x1B34,0x1B34],[0x1B36,0x1B3A],[0x1B3C,0x1B3C],[0x1B42,0x1B42],[0x1B6B,0x1B73],[0x1DC0,0x1DCA],[0x1DFE,0x1DFF],[0x200B,0x200F],[0x202A,0x202E],[0x2060,0x2063],[0x206A,0x206F],[0x20D0,0x20EF],[0x302A,0x302F],[0x3099,0x309A],[0xA806,0xA806],[0xA80B,0xA80B],[0xA825,0xA826],[0xFB1E,0xFB1E],[0xFE00,0xFE0F],[0xFE20,0xFE23],[0xFEFF,0xFEFF],[0xFFF9,0xFFFB],[0x10A01,0x10A03],[0x10A05,0x10A06],[0x10A0C,0x10A0F],[0x10A38,0x10A3A],[0x10A3F,0x10A3F],[0x1D167,0x1D169],[0x1D173,0x1D182],[0x1D185,0x1D18B],[0x1D1AA,0x1D1AD],[0x1D242,0x1D244],[0xE0001,0xE0001],[0xE0020,0xE007F],[0xE0100,0xE01EF]]

bisearch = function (ucs)
{
    var mid, _max, _min

    _min = 0
    _max = combining.length - 1
    if (ucs < combining[0][0] || ucs > combining[_max][1])
    {
        return
    }
    while (_max >= _min)
    {
        mid = Math.floor((_min + _max) / 2)
        if (ucs > combining[mid][1])
        {
            _min = mid + 1
        }
        else if (ucs < combining[mid][0])
        {
            _max = mid - 1
        }
        else
        {
            return true
        }
    }
}
export default kseg;