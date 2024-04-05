var _k_ = {trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var kermit, pattern, traverse

import kstr from "./kstr.js"


pattern = function (kmt)
{
    var child, cpt, line, lines, lpt, p

    p = []
    lines = kmt.split('\n')
    while (line = lines.shift())
    {
        lpt = _k_.trim(line).split(/\s+/)
        if (lpt[0][0] === '■')
        {
            while (child = lines.shift())
            {
                cpt = child.split(/\s+/)
                if (_k_.empty(cpt[0]))
                {
                    p.push([cpt.slice(1),lpt[0]])
                }
                else
                {
                    lines.unshift(child)
                    break
                }
            }
        }
        else
        {
            p.push([lpt,null])
        }
    }
    return p
}

traverse = function (lines, ctx)
{
    var cptn, line, splt

    while (line = lines.shift())
    {
        splt = _k_.trim(line).split(/\s+/)
        cptn = ctx.ptn[ctx.pind]
        if (cptn[0][0].length === splt.length)
        {
            if (_k_.empty(cptn[1]))
            {
                ctx.pind += 1
                ctx.result.push(line)
            }
        }
        else
        {
            if (cptn[0][0] === splt[0])
            {
                if (_k_.empty(cptn[1]))
                {
                    ctx.pind += 1
                    return line
                }
            }
            else
            {
                console.log('length missmatch',cptn[0],splt)
            }
        }
        console.log('cptn????',cptn,splt)
        'missmatch'
    }
}

kermit = function (kmt, str)
{
    var ctx, lines

    lines = str.split('\n')
    lines = lines.filter(function (l)
    {
        return !_k_.empty(_k_.trim(l))
    })
    ctx = {result:[],pind:0,ptn:pattern(kmt)}
    traverse(lines,ctx)
    console.log('result',ctx.result)
    return ctx.result
}
export default kermit;