var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var syntax

import kstr from "../kxk/kstr.js"

import kolor from "../kolor/kolor.js"

import theme from "./theme.js"


syntax = (function ()
{
    function syntax ()
    {
        this["getChar"] = this["getChar"].bind(this)
        this["getColor"] = this["getColor"].bind(this)
        this["getClass"] = this["getClass"].bind(this)
        this["updateLines"] = this["updateLines"].bind(this)
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
        return this.diss = kolor.dissect(lines,this.ext)
    }

    syntax.prototype["updateLines"] = function (lines, changedLineIndices)
    {
        return this.setLines(lines)
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
        var _39_36_

        return ((_39_36_=theme.syntax[this.getClass(x,y)]) != null ? _39_36_ : '#ff0000')
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