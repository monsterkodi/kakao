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
    }

    syntax.prototype["setLines"] = function (lines, ext = 'txt')
    {
        var dissTime, start

        start = process.hrtime()
        this.diss = kolor.dissect(lines,ext)
        dissTime = kstr.time(BigInt(process.hrtime(start)[1]))
        return lf('syntax:',dissTime)
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
        var _38_36_

        return ((_38_36_=color.syntax[this.getClass(x,y)]) != null ? _38_36_ : '#ff0000')
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