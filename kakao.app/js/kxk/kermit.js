var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}};_k_.g4=_k_.k.F256(_k_.k.g(4));_k_.y5=_k_.k.F256(_k_.k.y(5))

var addMatch, collect, kermit, pattern, strongMatchAhead, traverse, wrapIndex

import kstr from "./kstr.js"
import gonzo from "./gonzo.js"


wrapIndex = function (ctx, offset)
{
    return (ctx.pind + offset) % ctx.ptn.length
}

strongMatchAhead = function (splt, ctx)
{
    return splt[0] === ctx.ptn[wrapIndex(ctx,1)][0][0]
}

addMatch = function (splt, ctx)
{
    var ci, cp, cpt, rslt, si, strongMatch, type, varName, weakMatch

    cpt = ctx.ptn[ctx.pind][0]
    strongMatch = false
    weakMatch = false
    varName = null
    ci = 0
    si = 0
    rslt = {}
    while (ci < cpt.length)
    {
        cp = cpt[ci]
        if (cp === splt[si])
        {
            strongMatch = true
            varName = null
            si++
            ci++
            continue
        }
        if (_k_.in((cp != null ? cp[0] : undefined),'●'))
        {
            weakMatch = true
            varName = cp.slice(1)
            rslt[varName] = splt[si]
            si++
            ci++
            continue
        }
        else if (weakMatch && varName && !_k_.empty(splt[si + 1]))
        {
            rslt[varName] += ' ' + splt[si]
            si++
            continue
        }
        else
        {
            console.log('bail?',cp,splt[si],_k_.g4(kstr(ctx)))
            ci++
            continue
        }
    }
    if (ci === cpt.length && varName && si < splt.length)
    {
        rslt[varName] += ' ' + splt.slice(si).join(' ')
    }
    if (!strongMatch && strongMatchAhead(splt,ctx))
    {
        ctx.pind = wrapIndex(ctx,1)
        return addMatch(splt,ctx)
    }
    if (strongMatch || weakMatch)
    {
        type = (strongMatch ? 'strong' : 'weak')
        ctx.matches.push({type:type,rslt:rslt,pind:ctx.pind,arr:_k_.clone(ctx.ptn[ctx.pind][1])})
        if (strongMatch)
        {
            return ctx.pind = wrapIndex(ctx,1)
        }
    }
}

traverse = function (lines, ctx)
{
    var line, splt

    ctx.matches = []
    while (line = lines.shift())
    {
        splt = _k_.trim(line).split(/\s+/)
        addMatch(splt,ctx)
    }
    console.log('matches:',_k_.y5(kstr(ctx.matches)))
    collect(ctx)
    return ctx
}

collect = function (ctx)
{
    var ai, k, lm, lo, ma, match, pa, v

    ctx.result = []
    lm = {pind:Infinity}
    pa = []
    var list = _k_.list(ctx.matches)
    for (var _112_14_ = 0; _112_14_ < list.length; _112_14_++)
    {
        match = list[_112_14_]
        if (match.pind < lm.pind)
        {
            ctx.result.push({})
        }
        if (match.pind === lm.pind)
        {
            ctx.result.push({})
        }
        ma = ctx.ptn[match.pind][1]
        lo = _k_.last(ctx.result)
        if (lo)
        {
            if (!_k_.empty(ma))
            {
                var list1 = _k_.list(ma)
                for (var _125_23_ = 0; _125_23_ < list1.length; _125_23_++)
                {
                    ai = list1[_125_23_]
                    if (!(lo[ai] != null))
                    {
                        lo[ai] = [{}]
                    }
                    lo = _k_.last(lo[ai])
                }
            }
            for (k in match.rslt)
            {
                v = match.rslt[k]
                lo[k] = v
            }
        }
        lm = match
        pa = ma
    }
    ctx.result = ctx.result.filter(function (o)
    {
        return !_k_.empty(o)
    })
    return ctx.result
}

pattern = function (kmt)
{
    var ars, gzo, p, parseGonzo

    p = []
    ars = []
    parseGonzo = function (gzo)
    {
        var gz, lpt

        var list = _k_.list(gzo)
        for (var _150_15_ = 0; _150_15_ < list.length; _150_15_++)
        {
            gz = list[_150_15_]
            lpt = _k_.trim(gz.line).split(/\s+/)
            if (lpt[0][0] === '■')
            {
                ars.push(lpt[0].slice(1))
                parseGonzo(gz.blck,ars)
                ars.pop()
            }
            else
            {
                p.push([lpt,_k_.clone(ars)])
            }
        }
    }
    gzo = gonzo(kmt)
    if (_k_.empty(gzo))
    {
        return p
    }
    parseGonzo(gzo)
    return p
}

kermit = function (kmt, str)
{
    var ctx, lines

    lines = str.split('\n')
    lines = lines.filter(function (l)
    {
        return !_k_.empty(_k_.trim(l))
    })
    ctx = traverse(lines,{pind:0,ptn:pattern(kmt)})
    return ctx.result
}
kermit.pattern = pattern
export default kermit;