var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var syntax

import kstr from "../kxk/kstr.js"

import kolor from "../kolor/kolor.js"

import color from "./color.js"


syntax = (function ()
{
    function syntax ()
    {
        this["getChar"] = this["getChar"].bind(this)
        this["getColor"] = this["getColor"].bind(this)
        this["getClass"] = this["getClass"].bind(this)
        this["setLines"] = this["setLines"].bind(this)
        this["setExt"] = this["setExt"].bind(this)
        this.ext = 'txt'
    }

    syntax.prototype["setExt"] = function (ext)
    {
        this.ext = ext
    }

    syntax.prototype["setLines"] = function (lines)
    {
        var dissTime, start

        start = process.hrtime()
        this.diss = kolor.dissect(lines,this.ext)
        return dissTime = kstr.time(BigInt(process.hrtime(start)[1]))
    }

    syntax.prototype["getClass"] = function (x, y)
    {
        var dss

        var list = _k_.list(this.diss[y])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dss = list[_a_]
            if ((dss.start <= x && x < dss.start + dss.length))
            {
                return dss.clss
            }
        }
        return 'text'
    }

    syntax.prototype["getColor"] = function (x, y)
    {
        var _40_36_

        return ((_40_36_=color.syntax[this.getClass(x,y)]) != null ? _40_36_ : '#ff0000')
    }

    syntax.prototype["getChar"] = function (x, y, char)
    {
        var clss

        clss = this.getClass(x,y)
        if (0 <= clss.indexOf('header'))
        {
            return '█'
        }
        return char
    }

    return syntax
})()

export default syntax;