var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isArr: function (o) {return Array.isArray(o)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }}

var kseg, segmenter

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
export default kseg;