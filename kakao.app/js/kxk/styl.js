var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var ampersands, calculus, funcs, render, styl, subvars, vars

import kstr from "./kstr.js"
let unfillet = kstr.unfillet
let blockFillets = kstr.blockFillets

vars = {}
funcs = {}
ampersands = []

subvars = function (fillets)
{
    var fillet, value

    var list = _k_.list(fillets)
    for (var _25_15_ = 0; _25_15_ < list.length; _25_15_++)
    {
        fillet = list[_25_15_]
        if (value = vars[fillet.match])
        {
            fillet.match = value
        }
    }
    return fillets
}

calculus = function (fillets)
{
    var fillet, index, lhs, lhu, result, rhs, rhu, unit

    var list = _k_.list(fillets)
    for (index = 0; index < list.length; index++)
    {
        fillet = list[index]
        if (index < 1)
        {
            continue
        }
        if (_k_.in(fillet.match,'*+-/'))
        {
            lhs = parseFloat(fillets[index - 1].match)
            rhs = parseFloat(fillets[index + 1].match)
            if (_k_.isNum(lhs) && _k_.isNum(rhs))
            {
                lhu = _k_.trim(fillets[index - 1].match.slice((`${lhs}`).length))
                rhu = _k_.trim(fillets[index + 1].match.slice((`${rhs}`).length))
                unit = (!_k_.empty(lhu) ? lhu : rhu)
                result = eval(`${lhs} ${fillet.match} ${rhs}`)
                result += unit
                fillets.splice(index - 1,3,{match:result})
                return calculus(fillets)
            }
        }
    }
    return fillets
}

render = function (block, text)
{
    var ampersand, amps, b, cb, funcName, funcValue, idt, prefix, varName, varValue

    if ((block.fillet[0] != null ? block.fillet[0].match : undefined) === '//')
    {
        return text
    }
    if ((block.fillet[1] != null ? block.fillet[1].match : undefined) === '=')
    {
        varName = (block.fillet[0] != null ? block.fillet[0].match : undefined)
        varValue = unfillet(calculus(subvars(block.fillet.slice(2))))
        vars[varName] = varValue
        return text
    }
    if ((block.fillet[1] != null ? block.fillet[1].match : undefined) === '()')
    {
        funcName = (block.fillet[0] != null ? block.fillet[0].match : undefined)
        if (funcs[funcName])
        {
            text += funcs[funcName]
            return text
        }
        funcValue = ''
        var list = _k_.list(block.blocks)
        for (var _69_15_ = 0; _69_15_ < list.length; _69_15_++)
        {
            cb = list[_69_15_]
            funcValue = render(cb,funcValue)
        }
        funcs[funcName] = funcValue
        return text
    }
    if ((block.fillet[0] != null ? block.fillet[0].match[0] : undefined) === '&')
    {
        ampersands.push(block)
        return text
    }
    idt = _k_.rpad(block.indent)
    if (!_k_.empty(block.blocks))
    {
        text += '\n' + idt + unfillet(block.fillet)
        text += '\n' + idt + '{'
        var list1 = _k_.list(block.blocks)
        for (var _83_14_ = 0; _83_14_ < list1.length; _83_14_++)
        {
            b = list1[_83_14_]
            text += render(b,'')
        }
        text += '\n' + idt + '}\n'
    }
    else
    {
        text += '\n'
        text += idt + block.fillet[0].match + ': ' + unfillet(calculus(subvars(block.fillet.slice(1))))
        text += ';'
    }
    if (!_k_.empty(ampersands))
    {
        prefix = unfillet(block.fillet)
        amps = ampersands
        ampersands = []
        while (ampersand = amps.shift())
        {
            text += prefix + unfillet(ampersand.fillet).slice(1)
            if (!_k_.empty(ampersand.blocks))
            {
                text += '\n' + '{'
                var list2 = _k_.list(ampersand.blocks)
                for (var _104_22_ = 0; _104_22_ < list2.length; _104_22_++)
                {
                    b = list2[_104_22_]
                    text += render(b,'')
                }
                text += '\n' + '}\n'
            }
            text += '\n'
        }
    }
    return text
}

styl = function (srcText)
{
    var block, blocks, lines, tgtText

    vars = {}
    funcs = {}
    tgtText = ''
    lines = srcText.split('\n')
    blocks = blockFillets(lines.map(function (line)
    {
        return kstr.fillet(line,'-')
    }))
    var list = _k_.list(blocks)
    for (var _126_14_ = 0; _126_14_ < list.length; _126_14_++)
    {
        block = list[_126_14_]
        tgtText = render(block,tgtText)
    }
    return tgtText
}
export default styl;