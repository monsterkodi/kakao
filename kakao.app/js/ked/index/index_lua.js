var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../kxk.js"
let kermit = kxk.kermit

class index_lua
{
    constructor ()
    {}

    parseLine (index, line)
    {
        var addFunc, addMeth, className, funcMatch, match, methMatch, validFuncMatch, validFuncName

        if (!line.startsWith(' '))
        {
            if (match = kermit.lineMatch(line,'local ●name = class',['(']))
            {
                match.type = 'class'
                match.line = index
                this.result.classes.push(match)
                return
            }
        }
        validFuncName = function (name)
        {
            return !_k_.empty((name)) && !(_k_.in(name,['if','for','while','switch','return','catch']))
        }
        validFuncMatch = function (match)
        {
            return match && validFuncName(match.name)
        }
        methMatch = function (ptn)
        {
            match = kermit.lineMatch(line,ptn,["(",")",":","."])
            if (validFuncMatch(match))
            {
                return match
            }
        }
        funcMatch = function (ptn)
        {
            match = kermit.lineMatch(line,ptn,["(",")"])
            if (validFuncMatch(match))
            {
                return match
            }
        }
        if (this.result.classes.length)
        {
            className = this.result.classes.slice(-1)[0].name
            addMeth = (function (name, opt = {})
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
                if (this.bound[name] && name !== 'constructor')
                {
                    fnc.bound = true
                }
                this.result.funcs.push(fnc)
                return null
            }).bind(this)
            if (match = methMatch(`function ${className}:●name(○args)`))
            {
                return addMeth(match.name)
            }
            if (match = methMatch(`function ${className}.static.●name(○args)`))
            {
                return addMeth(match.name,{static:true})
            }
        }
        addFunc = (function (name, opt = {})
        {
            var fnc

            fnc = {name:name,line:index}
            if (opt.async)
            {
                fnc.async = true
            }
            if (opt.test)
            {
                fnc.test = true
            }
            this.result.funcs.push(fnc)
            return null
        }).bind(this)
        if (!line.startsWith(' '))
        {
            if (match = funcMatch('function ●name(○args)'))
            {
                return addFunc(match.name)
            }
        }
        if (match = kermit.lineMatch(line,'test("●name", function()',["(",")",',','"']))
        {
            return addFunc(`▸ ${match.name}`,{test:true})
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

export default index_lua;