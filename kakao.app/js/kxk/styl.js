var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var render, styl, subvars, variables

import kstr from "./kstr.js"
let unfillet = kstr.unfillet
let blockFillets = kstr.blockFillets

variables = {}

subvars = function (fillets)
{
    var fillet, value

    var list = _k_.list(fillets)
    for (var _23_15_ = 0; _23_15_ < list.length; _23_15_++)
    {
        fillet = list[_23_15_]
        if (value = variables[fillet.match])
        {
            fillet.match = value
        }
    }
    return fillets
}

render = function (block, text)
{
    var b, idt, varName, varValue

    if ((block.fillet[0] != null ? block.fillet[0].match : undefined) === '//')
    {
        return text
    }
    if ((block.fillet[1] != null ? block.fillet[1].match : undefined) === '=')
    {
        varName = (block.fillet[0] != null ? block.fillet[0].match : undefined)
        varValue = (block.fillet[2] != null ? block.fillet[2].match : undefined)
        variables[varName] = varValue
        return text
    }
    idt = _k_.rpad(block.indent)
    if (!_k_.empty(block.blocks))
    {
        text += '\n' + idt + unfillet(block.fillet)
        text += '\n' + idt + '{'
        var list = _k_.list(block.blocks)
        for (var _46_14_ = 0; _46_14_ < list.length; _46_14_++)
        {
            b = list[_46_14_]
            text += render(b,'')
        }
        text += '\n' + idt + '}\n'
    }
    else
    {
        text += '\n'
        text += idt + block.fillet[0].match + ': ' + unfillet(subvars(block.fillet.slice(1)))
        text += ';'
    }
    return text
}

styl = function (srcText)
{
    var block, blocks, lines, tgtText

    variables = {}
    tgtText = ''
    lines = srcText.split('\n')
    blocks = blockFillets(lines.map(function (line)
    {
        return kstr.fillet(line,'-')
    }))
    var list = _k_.list(blocks)
    for (var _70_14_ = 0; _70_14_ < list.length; _70_14_++)
    {
        block = list[_70_14_]
        tgtText = render(block,tgtText)
    }
    return tgtText
}
export default styl;