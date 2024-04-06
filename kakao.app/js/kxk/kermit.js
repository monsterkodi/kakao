var _k_ = {trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}};_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.b4=_k_.k.F256(_k_.k.b(4));_k_.m2=_k_.k.F256(_k_.k.m(2));_k_.m5=_k_.k.F256(_k_.k.m(5))

var addMatch, kermit, pattern, traverse

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

addMatch = function (cpt, splt, ctx)
{
    var ci, cp, lr

    console.log('addMatch',cpt,splt,ctx.pind,ctx.result)
    var list = _k_.list(cpt)
    for (ci = 0; ci < list.length; ci++)
    {
        cp = list[ci]
        if (_k_.in((cp != null ? cp[0] : undefined),'●'))
        {
            lr = _k_.last(ctx.result)
            console.log('var match',ci,cpt.slice(ci + 1),splt.slice(ci + 1))
            lr[cp.slice(1)] = splt[ci]
            if (_k_.empty(cpt.slice(ci + 1)) && !_k_.empty(splt.slice(ci + 1)))
            {
                console.log('add remaining',splt.slice(ci + 1).join(' '))
                lr[cp.slice(1)] += ' ' + splt.slice(ci + 1).join(' ')
            }
        }
        else if (cp === splt[ci])
        {
            console.log('strong match',ci,cpt.slice(ci + 1),splt.slice(ci + 1))
        }
        else
        {
            console.log('missmatch',ci,cp,splt[ci])
        }
    }
    return ctx.pind += 1
}

traverse = function (lines, ctx)
{
    var cptn, line, splt

    while (line = lines.shift())
    {
        splt = _k_.trim(line).split(/\s+/)
        cptn = ctx.ptn[ctx.pind]
        console.log(_k_.m2('▸'),_k_.m5(line),ctx.pind,_k_.g5(cptn))
        if (_k_.empty(cptn))
        {
            console.log('empty pattern at index',ctx.pind)
            ctx.pind = 0
            ctx.result.push({})
            cptn = ctx.ptn[ctx.pind]
        }
        if (addMatch(cptn[0],splt,ctx))
        {
        }
        else
        {
            console.log(_k_.b4('no match'),cptn[0],splt)
        }
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
    ctx = {result:[{}],pind:0,ptn:pattern(kmt)}
    traverse(lines,ctx)
    console.log('result',ctx.result)
    return ctx.result
}
export default kermit;