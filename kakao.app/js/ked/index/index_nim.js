var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var index_nim

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let kermit = kxk.kermit

import index_utils from "./index_utils.js"


index_nim = (function ()
{
    function index_nim ()
    {}

    index_nim.prototype["parseLine"] = function (index, line)
    {
        var addFunc, addMeth, className, classType, funcMatch, match, validFuncMatch, validFuncName

        if (match = kermit.lineMatch(line,'●type ●name = ●ref object'))
        {
            match.type = 'object'
            match.line = index
            this.result.classes.push(match)
            return
        }
        validFuncName = function (name)
        {
            return !(_k_.in(name,['if','for','while','switch','return','catch']))
        }
        validFuncMatch = function (match)
        {
            return match && validFuncName(match.name)
        }
        funcMatch = function (ptn)
        {
            match = kermit.lineMatch(line,ptn,['(',')','"','.',',',"'"])
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
                var fnc

                fnc = {method:name,line:index,class:className}
                this.result.funcs.push(fnc)
                return null
            }).bind(this)
            if (classType === 'object')
            {
                if (match = kermit.lineMatch(line,'proc ●name(self:#{className}○args)',['(',')']))
                {
                    addMeth(match.name)
                }
            }
        }
        addFunc = (function (name, opt = {})
        {
            var fnc

            fnc = {name:name,line:index}
            this.result.funcs.push(fnc)
            return null
        }).bind(this)
        if (match = kermit.lineMatch(line,'proc ●name ○args',['(',')']))
        {
            return addFunc(match.name)
        }
    }

    index_nim.prototype["parse"] = function (text)
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

    return index_nim
})()

export default index_nim;