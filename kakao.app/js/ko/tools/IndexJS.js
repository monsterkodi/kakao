var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../kxk.js"
let kermit = kxk.kermit

class IndexJS
{
    constructor ()
    {}

    validFuncName (name)
    {
        return !(_k_.in(name,['if','for','while','switch','return']))
    }

    parseLine (index, line)
    {
        var match

        if (match = kermit.lineMatch(line,'class ●name'))
        {
            match.line = index
            this.result.classes.push(match)
            return
        }
        if (this.result.classes.length)
        {
            if (match = kermit.lineMatch(line,'●name ○args'))
            {
                if (match.args[0] === '(' && match.args.slice(-1)[0] === ')')
                {
                    if (this.validFuncName(match.name))
                    {
                        this.result.funcs.push({method:match.name,line:index,class:this.result.classes.slice(-1)[0].name})
                        return
                    }
                }
            }
            if (match = kermit.lineMatch(line,'static ●name ○args'))
            {
                if (match.args[0] === '(' && match.args.slice(-1)[0] === ')')
                {
                    this.result.funcs.push({method:match.name,line:index,class:this.result.classes.slice(-1)[0].name,static:true})
                    return
                }
            }
            if (match = kermit.lineMatch(line,'static async ●name ○args'))
            {
                if (match.args[0] === '(' && match.args.slice(-1)[0] === ')')
                {
                    this.result.funcs.push({method:match.name,line:index,class:this.result.classes.slice(-1)[0].name,static:true,async:true})
                    return
                }
            }
            if (match = kermit.lineMatch(line,'async ●name ○args'))
            {
                if (match.args[0] === '(' && match.args.slice(-1)[0] === ')')
                {
                    this.result.funcs.push({method:match.name,line:index,class:this.result.classes.slice(-1)[0].name,async:true})
                    return
                }
            }
        }
    }

    parse (text)
    {
        var lineIndex, lines, lineText

        lines = text.split('\n')
        this.result = {classes:[],funcs:[],lines:lines.length}
        var list = _k_.list(lines)
        for (lineIndex = 0; lineIndex < list.length; lineIndex++)
        {
            lineText = list[lineIndex]
            this.parseLine(lineIndex,lineText)
        }
        return this.result
    }
}

export default IndexJS;