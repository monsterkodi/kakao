var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

import kxk from "../../kxk.js"
let kermit = kxk.kermit

class IndexMM
{
    constructor ()
    {}

    parseLine (index, line)
    {
        var addFunc, addMeth, className, classType, doMatch, fnc, funcMatch, match, name, validFuncArgs, validFuncMatch, validFuncName

        if (!line.startsWith(' '))
        {
            if (match = kermit.lineMatch(line,'@implementation ●name'))
            {
                match.type = 'class'
                match.line = index
                this.result.classes.push(match)
                return
            }
            if (_k_.in(line[0],'+-'))
            {
                console.log(index,line)
                name = _k_.trim(line.slice(1)).split(':')[0].split(' ')[1]
                fnc = {name:name,line:index}
                if (line[0] === '+')
                {
                    fnc.static = true
                }
                console.log(fnc)
                this.result.funcs.push(fnc)
                return
            }
        }
        return
        validFuncName = function (name)
        {
            return !(_k_.in(name,['if','for','while','switch','return','catch']))
        }
        validFuncArgs = function (args)
        {
            return args[0] === '(' && args.slice(-1)[0] === ')'
        }
        validFuncMatch = function (match)
        {
            return match && validFuncArgs(match.args) && validFuncName(match.name)
        }
        doMatch = function (ptn)
        {
            return kermit.lineMatch(line,ptn,['"','.',',',"'"])
        }
        funcMatch = function (ptn)
        {
            match = doMatch(ptn)
            if (validFuncMatch(match))
            {
                return match
            }
        }
        if (this.result.classes.length)
        {
            className = this.result.classes.slice(-1)[0].name
            classType = this.result.classes.slice(-1)[0].type
            addMeth = (function (name, opt = {})
            {
                fnc = {method:name,line:index,class:className}
                if (opt.static)
                {
                    fnc.static = true
                }
                if (opt.async)
                {
                    fnc.async = true
                }
                if (this.bound[name] && name !== 'constructor')
                {
                    fnc.bound = true
                }
                this.result.funcs.push(fnc)
                return null
            }).bind(this)
            if (classType === 'class')
            {
                if (match = funcMatch('●name ○args'))
                {
                    return addMeth(match.name)
                }
                if (match = funcMatch('async ●name ○args'))
                {
                    return addMeth(match.name,{async:true})
                }
                if (match = funcMatch('static ●name ○args'))
                {
                    return addMeth(match.name,{static:true})
                }
                if (match = funcMatch('static async ●name ○args'))
                {
                    return addMeth(match.name,{static:true,async:true})
                }
                if (match = doMatch(`this.●name = this.●bound.bind(this)`))
                {
                    this.bound[match.name] = true
                }
            }
            if (classType === 'function')
            {
                if (match = funcMatch(`function ${className} ○args`))
                {
                    return addMeth(className)
                }
                if (match = funcMatch(`${className}["●name"] = function ○args`))
                {
                    return addMeth(match.name,{static:true})
                }
                if (match = funcMatch(`${className}["●name"] = async function ○args`))
                {
                    return addMeth(match.name,{static:true,async:true})
                }
                if (match = funcMatch(`${className}.prototype["●name"] = function ○args`))
                {
                    return addMeth(match.name)
                }
                if (match = funcMatch(`${className}.prototype["●name"] = async function ○args`))
                {
                    return addMeth(match.name,{async:true})
                }
                if (match = doMatch(`this["●name"] = this["●bound"].bind(this)`))
                {
                    this.bound[match.name] = true
                }
            }
        }
        if (!line.startsWith(' '))
        {
            addFunc = (function (name, opt = {})
            {
                fnc = {name:name,line:index}
                if (opt.async)
                {
                    fnc.async = true
                }
                this.result.funcs.push(fnc)
                return null
            }).bind(this)
            if (match = funcMatch('●name = function ○args'))
            {
                addFunc(match.name)
            }
            if (match = funcMatch('●name = async function ○args'))
            {
                return addFunc(match.name,{async:true})
            }
        }
    }

    parse (text)
    {
        var lineIndex, lines, lineText

        lines = text.split('\n')
        this.bound = {}
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

export default IndexMM;