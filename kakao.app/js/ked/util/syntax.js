var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var syntax

import kstr from "../../kxk/kstr.js"
import matchr from "../../kxk/matchr.js"

import kulur from "../../kolor/kulur.js"

import theme from "../theme.js"


syntax = (function ()
{
    function syntax ()
    {
        this["getChar"] = this["getChar"].bind(this)
        this["getColor"] = this["getColor"].bind(this)
        this["getClass"] = this["getClass"].bind(this)
        this["setLines"] = this["setLines"].bind(this)
        this["setRgxs"] = this["setRgxs"].bind(this)
        this["setExt"] = this["setExt"].bind(this)
        this.ext = 'txt'
    }

    syntax.prototype["setExt"] = function (ext)
    {
        this.ext = ext
    }

    syntax.prototype["setRgxs"] = function (rgxs)
    {
        return this.config = matchr.config(rgxs)
    }

    syntax.prototype["setLines"] = function (lines)
    {
        var dss, line

        if (!_k_.empty(this.config))
        {
            this.diss = []
            var list = _k_.list(lines)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                line = list[_a_]
                dss = matchr.ranges(this.config,line)
                this.diss.push(dss)
            }
        }
        else
        {
            return this.diss = kulur.dissect(lines,this.ext)
        }
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
        var _41_36_

        return ((_41_36_=theme.syntax[this.getClass(x,y)]) != null ? _41_36_ : '#ff0000')
    }

    syntax.prototype["getChar"] = function (x, y, char)
    {
        var clss

        clss = this.getClass(x,y)
        if (_k_.in('header',clss))
        {
            return '█'
        }
        return char
    }

    return syntax
})()

export default syntax;