var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var calculus, funcs, render, styl, subvars, vars

import kstr from "./kstr.js"
let unfillet = kstr.unfillet
let blockFillets = kstr.blockFillets

vars = {}
funcs = {}

render = function (block, text, amps = [])
{
    var amp, b, cb, childBlocks, funcName, funcValue, idt, varName, varValue

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
        for (var _41_15_ = 0; _41_15_ < list.length; _41_15_++)
        {
            cb = list[_41_15_]
            funcValue = render(cb,funcValue,amps)
        }
        funcs[funcName] = funcValue
        return text
    }
    idt = _k_.rpad(block.indent)
    if (!_k_.empty(block.blocks))
    {
        childBlocks = block.blocks.filter(function (cb)
        {
            if ((cb.fillet[0] != null ? cb.fillet[0].match[0] : undefined) === '&')
            {
                cb.fillet[0].match = cb.fillet[0].match.slice(1)
                cb.fillet = block.fillet.concat(cb.fillet)
                amps.push(cb)
                return false
            }
            else
            {
                return true
            }
        })
        text += '\n' + idt + unfillet(block.fillet)
        text += '\n' + idt + '{'
        var list1 = _k_.list(childBlocks)
        for (var _61_14_ = 0; _61_14_ < list1.length; _61_14_++)
        {
            b = list1[_61_14_]
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
    while (amp = amps.shift())
    {
        amp.indent = 0
        var list2 = _k_.list(amp.blocks)
        for (var _73_18_ = 0; _73_18_ < list2.length; _73_18_++)
        {
            block = list2[_73_18_]
            block.indent = 4
        }
        text += render(amp,'')
    }
    return text
}

subvars = function (fillets)
{
    var fillet, value

    var list = _k_.list(fillets)
    for (var _88_15_ = 0; _88_15_ < list.length; _88_15_++)
    {
        fillet = list[_88_15_]
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
        if (index === 0)
        {
            if (_k_.in(fillet.match,'+-'))
            {
                rhs = parseFloat(fillets[index + 1].match)
                rhu = _k_.trim(fillets[index + 1].match.slice((`${rhs}`).length))
                fillets.splice(index,2,{match:fillet.match + rhs + rhu})
                return calculus(fillets)
            }
            if (fillet.match[0] === '-')
            {
                if (vars[fillet.match.slice(1)])
                {
                    fillets.splice(index,1,{match:'-' + vars[fillet.match.slice(1)]})
                    return calculus(fillets)
                }
            }
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
    for (var _142_14_ = 0; _142_14_ < list.length; _142_14_++)
    {
        block = list[_142_14_]
        tgtText = render(block,tgtText)
    }
    return tgtText
}
export default styl;