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

    validFuncArgs (args)
    {
        return args[0] === '(' && args.slice(-1)[0] === ')'
    }

    validFuncMatch (match)
    {
        return this.validFuncArgs(match.args) && this.validFuncName(match.name)
    }

    parseLine (index, line)
    {
        var addFunc, className, classType, match

        if (match = kermit.lineMatch(line,'class ●name'))
        {
            match.line = index
            match.type = 'class'
            this.result.classes.push(match)
            return
        }
        if (match = kermit.lineMatch(line,'●name = (function ()'))
        {
            match.line = index
            match.type = 'function'
            this.result.classes.push(match)
            return
        }
        if (this.result.classes.length)
        {
            className = this.result.classes.slice(-1)[0].name
            classType = this.result.classes.slice(-1)[0].type
            addFunc = (function (name, opt = {})
            {
                var fnc

                fnc = {method:name,line:index,class:className}
                if (opt.static)
                {
                    fnc.static = true
                }
                if (opt.async)
                {
                    fnc.async = true
                }
                this.result.funcs.push(fnc)
                return null
            }).bind(this)
            if (classType === 'class')
            {
                if (match = kermit.lineMatch(line,'●name ○args'))
                {
                    if (this.validFuncMatch(match))
                    {
                        return addFunc(match.name)
                    }
                }
                if (match = kermit.lineMatch(line,'static ●name ○args'))
                {
                    if (this.validFuncMatch(match))
                    {
                        return addFunc(match.name,{static:true})
                    }
                }
                if (match = kermit.lineMatch(line,'static async ●name ○args'))
                {
                    if (this.validFuncMatch(match))
                    {
                        return addFunc(match.name,{static:true,async:true})
                    }
                }
                if (match = kermit.lineMatch(line,'async ●name ○args'))
                {
                    if (this.validFuncMatch(match))
                    {
                        return addFunc(match.name,{async:true})
                    }
                }
            }
            if (classType === 'function')
            {
                if (match = kermit.lineMatch(line,`function ${className} ○args`))
                {
                    if (this.validFuncMatch(match))
                    {
                        return addFunc(className)
                    }
                }
                if (match = kermit.lineMatch(line,`${className}["●name"] = function ○args`,['"']))
                {
                    if (this.validFuncMatch(match))
                    {
                        return addFunc(match.name)
                    }
                }
                if (match = kermit.lineMatch(line,`${className}["●name"] = async function ○args`,['"']))
                {
                    if (this.validFuncMatch(match))
                    {
                        return addFunc(match.name,{async:true})
                    }
                }
                if (match = kermit.lineMatch(line,`${className}.prototype["●name"] = function ○args`,['"']))
                {
                    if (this.validFuncMatch(match))
                    {
                        return addFunc(match.name,{static:true})
                    }
                }
                if (match = kermit.lineMatch(line,`${className}.prototype["●name"] = async function ○args`,['"']))
                {
                    if (this.validFuncMatch(match))
                    {
                        return addFunc(match.name,{static:true,async:true})
                    }
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