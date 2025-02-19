var _k_ = {isArr: function (o) {return Array.isArray(o)}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var kseg, segmenter

import kstr from "./kstr.js"

segmenter = new Intl.Segmenter("en-US",{granularity:'grapheme'})

kseg = function (s)
{
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

kseg.join = function (a)
{
    if (_k_.isArr(a))
    {
        return a.join('')
    }
    else
    {
        return a
    }
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
export default kseg;