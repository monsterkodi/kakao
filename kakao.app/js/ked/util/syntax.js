var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var syntax

import matchr from "../../kxk/matchr.js"
import kstr from "../../kxk/kstr.js"
import kseg from "../../kxk/kseg.js"

import kulur from "../../kolor/kulur.js"

import theme from "../theme/theme.js"


syntax = (function ()
{
    function syntax (name)
    {
        this.name = name
    
        this["getChar"] = this["getChar"].bind(this)
        this["getColor"] = this["getColor"].bind(this)
        this["getClass"] = this["getClass"].bind(this)
        this["appendSegls"] = this["appendSegls"].bind(this)
        this["addSegl"] = this["addSegl"].bind(this)
        this["setSegls"] = this["setSegls"].bind(this)
        this["setLines"] = this["setLines"].bind(this)
        this["setRgxs"] = this["setRgxs"].bind(this)
        this["setExt"] = this["setExt"].bind(this)
        this["clear"] = this["clear"].bind(this)
        this.ext = 'txt'
        this.clear()
    }

    syntax.prototype["clear"] = function ()
    {
        this.diss = []
        this.hash = {}
        return this.liha = {}
    }

    syntax.prototype["setExt"] = function (ext)
    {
        this.ext = ext
    }

    syntax.prototype["setRgxs"] = function (rgxs)
    {
        return this.config = matchr.config(rgxs,'u')
    }

    syntax.prototype["setLines"] = function (lines)
    {
        return this.setSegls(kseg.segls(lines))
    }

    syntax.prototype["setSegls"] = function (segls)
    {
        var ds, dss, hsh, idx, segl, segs

        if (!_k_.empty(this.config))
        {
            this.diss = []
            var list = _k_.list(segls)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                segs = list[_a_]
                dss = matchr.ranges(this.config,kseg.str(segs),'u')
                var list1 = _k_.list(dss)
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    ds = list1[_b_]
                    if (_k_.isArr(ds.clss))
                    {
                        ds.clss = _k_.trim(ds.clss.map(kstr.trim).join(' '))
                    }
                }
                this.diss.push(dss)
            }
        }
        else
        {
            if (this.partialUpdate(segls))
            {
                return
            }
            this.clear()
            this.diss = kulur.dissect(segls,this.ext)
            var list2 = _k_.list(segls)
            for (idx = 0; idx < list2.length; idx++)
            {
                segl = list2[idx]
                hsh = kseg.hash(segl)
                this.hash[hsh] = this.diss[idx]
                this.liha[idx] = hsh
            }
        }
    }

    syntax.prototype["partialUpdate"] = function (segls)
    {
        var hsh, idx, newHash, segl

        if (this.diss.length !== segls.length)
        {
            return
        }
        if (_k_.empty(this.hash))
        {
            return
        }
        newHash = {}
        var list = _k_.list(segls)
        for (idx = 0; idx < list.length; idx++)
        {
            segl = list[idx]
            hsh = kseg.hash(segl)
            if (this.hash[hsh])
            {
                newHash[hsh] = this.hash[hsh]
            }
            else
            {
                newHash[hsh] = kulur.dissect([segl],this.ext)[0]
            }
            if (this.liha[idx] !== hsh)
            {
                this.diss.splice(idx,1,newHash[hsh])
            }
        }
        return this.hash = newHash
    }

    syntax.prototype["addSegl"] = function (segl, ext)
    {
        return this.diss = this.diss.concat(kulur.dissect([segl],ext))
    }

    syntax.prototype["appendSegls"] = function (segls, ext)
    {
        var segl

        var list = _k_.list(segls)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            segl = list[_a_]
            this.addSegl(segl,ext)
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
        var clss, _96_27_

        if (_k_.isNum(x))
        {
            clss = this.getClass(x,y)
        }
        else
        {
            clss = x
        }
        return ((_96_27_=theme.syntax[clss]) != null ? _96_27_ : '#ff0000')
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