var _k_ = {rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var blockFillets, pug, render, unfillet

import kstr from "./kstr.js"


render = function (block, text)
{
    var args, b, fromIndex, idt, p, t

    idt = _k_.rpad(block.indent)
    args = ''
    fromIndex = 1
    if (block.fillet[0].match === '#')
    {
        fromIndex = 2
    }
    if ((block.fillet[fromIndex] != null ? block.fillet[fromIndex].match : undefined) === '#')
    {
        args += ` id=\"${block.fillet[fromIndex + 1].match}\"`
        fromIndex += 2
    }
    if (block.fillet.length > fromIndex)
    {
        args += ' ' + unfillet(block.fillet.slice(fromIndex))
    }
    t = ((function ()
    {
        switch (block.fillet[0].match)
        {
            case 'doctype':
                return `<!DOCTYPE ${block.fillet[1].match}>\n`

            case 'title':
                return `<${block.fillet[0].match}>${block.fillet[1].match}</${block.fillet[0].match}>\n`

            case 'meta':
            case 'link':
            case 'script':
            case 'head':
            case 'body':
            case 'span':
            case 'html':
                return `<${block.fillet[0].match}${args}>`

            case '#':
                return `<div id=\"${block.fillet[1].match}\"${args}>`

        }

    }).bind(this))()
    if (!_k_.empty(t))
    {
        text += idt + t
    }
    if (!_k_.empty(block.blocks))
    {
        text += '\n'
        var list = _k_.list(block.blocks)
        for (var _49_14_ = 0; _49_14_ < list.length; _49_14_++)
        {
            b = list[_49_14_]
            text += render(b,'')
        }
        text += idt
    }
    p = ((function ()
    {
        switch (block.fillet[0].match)
        {
            case 'link':
            case 'meta':
                return '\n'

            case 'script':
            case 'head':
            case 'body':
            case 'span':
            case 'html':
                return `</${block.fillet[0].match}>\n`

            case '#':
                return "</div>\n"

        }

    }).bind(this))()
    if (!_k_.empty(p))
    {
        text += p
    }
    return text
}

unfillet = function (fillets)
{
    var fillet, s

    s = ''
    var list = _k_.list(fillets)
    for (var _75_15_ = 0; _75_15_ < list.length; _75_15_++)
    {
        fillet = list[_75_15_]
        s = _k_.rpad(fillet.index,s)
        s += fillet.match
    }
    return _k_.trim(s)
}

blockFillets = function (lineFillets)
{
    var block, blocks, fillet, indent, lineIndex, stack, stackTop

    blocks = []
    stack = []
    var list = _k_.list(lineFillets)
    for (lineIndex = 0; lineIndex < list.length; lineIndex++)
    {
        fillet = list[lineIndex]
        if (_k_.empty(fillet))
        {
            continue
        }
        indent = (fillet[0] != null ? fillet[0].index : undefined)
        block = {line:lineIndex,indent:indent,fillet:fillet,blocks:[]}
        if (stackTop = _k_.last(stack))
        {
            if (indent > stackTop.indent)
            {
                stackTop.blocks.push(block)
            }
            else if (indent === stackTop.indent)
            {
                stack.pop()
                if (stackTop = _k_.last(stack))
                {
                    stackTop.blocks.push(block)
                }
                else
                {
                    blocks.push(block)
                }
            }
            else
            {
                while (!_k_.empty((stack)) && indent <= _k_.last(stack).indent)
                {
                    stack.pop()
                }
                if (stackTop = _k_.last(stack))
                {
                    stackTop.blocks.push(block)
                }
                else
                {
                    blocks.push(block)
                }
            }
        }
        else
        {
            blocks.push(block)
            stack.pop()
        }
        stack.push(block)
    }
    return blocks
}

pug = function (srcText)
{
    var block, blocks, lines, tgtText

    tgtText = ''
    lines = srcText.split('\n')
    blocks = blockFillets(lines.map(function (line)
    {
        return kstr.fillet(line,'-')
    }))
    var list = _k_.list(blocks)
    for (var _140_14_ = 0; _140_14_ < list.length; _140_14_++)
    {
        block = list[_140_14_]
        tgtText = render(block,tgtText)
    }
    return tgtText
}
export default pug;