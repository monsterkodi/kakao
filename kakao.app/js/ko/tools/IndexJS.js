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
        return match && this.validFuncArgs(match.args) && this.validFuncName(match.name)
    }

    parseLine (index, line)
    {
        var addFunc, className, classType, doMatch, match, splits

        if (match = kermit.lineMatch(line,'class ●name'))
        {
            match.type = 'class'
            match.line = index
            this.result.classes.push(match)
            return
        }
        if (match = kermit.lineMatch(line,'●name = (function ()'))
        {
            match.type = 'function'
            match.line = index
            this.result.classes.push(match)
            return
        }
        splits = ['"','.',',',"'"]
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
            doMatch = (function (ptn)
            {
                match = kermit.lineMatch(line,ptn,splits)
                if (this.validFuncMatch(match))
                {
                    return match
                }
            }).bind(this)
            if (classType === 'class')
            {
                if (match = doMatch('●name ○args'))
                {
                    return addFunc(match.name)
                }
                if (match = doMatch('async ●name ○args'))
                {
                    return addFunc(match.name,{async:true})
                }
                if (match = doMatch('static ●name ○args'))
                {
                    return addFunc(match.name,{static:true})
                }
                if (match = doMatch('static async ●name ○args'))
                {
                    return addFunc(match.name,{static:true,async:true})
                }
            }
            if (classType === 'function')
            {
                if (match = doMatch(`function ${className} ○args`))
                {
                    return addFunc(className)
                }
                if (match = doMatch(`${className}["●name"] = function ○args`))
                {
                    return addFunc(match.name)
                }
                if (match = doMatch(`${className}["●name"] = async function ○args`))
                {
                    return addFunc(match.name,{async:true})
                }
                if (match = doMatch(`${className}.prototype["●name"] = function ○args`))
                {
                    return addFunc(match.name,{static:true})
                }
                if (match = doMatch(`${className}.prototype["●name"] = async function ○args`))
                {
                    return addFunc(match.name,{static:true,async:true})
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