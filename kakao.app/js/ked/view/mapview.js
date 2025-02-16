var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var floor, mapview, pow

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let post = kxk.post

import prof from "../util/prof.js"
import syntax from "../util/syntax.js"
import color from "../util/color.js"
import util from "../util/util.js"

import theme from "../theme.js"

import cells from "./cells.js"

floor = Math.floor
pow = Math.pow


mapview = (function ()
{
    function mapview (screen, state)
    {
        this.state = state
    
        this["reallocBuffer"] = this["reallocBuffer"].bind(this)
        this["setSyntaxLines"] = this["setSyntaxLines"].bind(this)
        this["getSyntax"] = this["getSyntax"].bind(this)
        this["getLines"] = this["getLines"].bind(this)
        this["reload"] = this["reload"].bind(this)
        this["clearImages"] = this["clearImages"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this.cells = new cells(screen)
        this.imgId = kstr.hash(this.state.name)
        this.pixelsPerRow = 4
        this.pixelsPerCol = 2
    }

    mapview.prototype["init"] = function (x, y, w, h)
    {
        return this.cells.init(x,y,w,h)
    }

    mapview.prototype["show"] = function (doShow = true)
    {
        if (doShow === false)
        {
            return this.hide()
        }
        return this.cells.cols = 10
    }

    mapview.prototype["hide"] = function ()
    {
        this.clearImages()
        return this.cells.cols = 0
    }

    mapview.prototype["hidden"] = function ()
    {
        return this.cells.cols <= 0
    }

    mapview.prototype["visible"] = function ()
    {
        return this.cells.cols > 0
    }

    mapview.prototype["clearImages"] = function ()
    {
        return this.cells.screen.t.write(`\x1b_Gq=1,a=d,d=i,i=${this.imgId}\x1b\\`)
    }

    mapview.prototype["reload"] = function ()
    {
        this.clearImages()
        return this.reallocBuffer()
    }

    mapview.prototype["getLines"] = function ()
    {
        return this.lines
    }

    mapview.prototype["getSyntax"] = function ()
    {
        return this.syntax
    }

    mapview.prototype["setSyntaxLines"] = function (ext, lines)
    {
        this.lines = lines
    
        this.syntax = new syntax
        this.syntax.setExt(ext)
        this.syntax.setLines(this.lines)
        return this.reallocBuffer()
    }

    mapview.prototype["reallocBuffer"] = function ()
    {
        var b, base64, bytes, ch, chunk, chunks, clss, data, f, g, h, i, li, line, lines, r, rgb, syntax, t, w, x, xi, y

        t = this.cells.screen.t
        if (_k_.empty(t.cellsz))
        {
            return
        }
        this.show()
        var _a_ = [this.cells.cols * t.cellsz[0],this.cells.rows * t.cellsz[1]]; w = _a_[0]; h = _a_[1]

        bytes = w * h * 3
        if (bytes <= 0)
        {
            this.clearImages()
            return
        }
        data = Buffer.alloc(bytes)
        lines = this.getLines()
        syntax = this.getSyntax()
        for (var _b_ = y = 0, _c_ = _k_.min(h,lines.length * this.pixelsPerRow); (_b_ <= _c_ ? y < _k_.min(h,lines.length * this.pixelsPerRow) : y > _k_.min(h,lines.length * this.pixelsPerRow)); (_b_ <= _c_ ? ++y : --y))
        {
            li = parseInt(y / this.pixelsPerRow)
            line = lines[li]
            for (var _d_ = x = 0, _e_ = _k_.min(w,line.length * this.pixelsPerCol); (_d_ <= _e_ ? x < _k_.min(w,line.length * this.pixelsPerCol) : x > _k_.min(w,line.length * this.pixelsPerCol)); (_d_ <= _e_ ? ++x : --x))
            {
                if (x === 0)
                {
                    data[(y * w + x) * 3 + 0] = 55
                    data[(y * w + x) * 3 + 1] = 55
                    data[(y * w + x) * 3 + 2] = 55
                }
                xi = parseInt(x / this.pixelsPerCol)
                ch = line[xi]
                if (!_k_.empty(ch) && ch !== ' ')
                {
                    clss = syntax.getClass(xi,li)
                    if (_k_.in('header',clss))
                    {
                        if (_k_.in('triple',clss))
                        {
                            rgb = [27,207,14]
                        }
                        else
                        {
                            rgb = [9,140,0]
                        }
                    }
                    else
                    {
                        f = 0.7
                        rgb = color.rgb(syntax.getColor(xi,li))
                        rgb = rgb.map(function (v)
                        {
                            return _k_.clamp(0,255,parseInt(f * v))
                        })
                    }
                    var _f_ = rgb; r = _f_[0]; g = _f_[1]; b = _f_[2]

                    data[(y * w + x) * 3 + 0] = r
                    data[(y * w + x) * 3 + 1] = g
                    data[(y * w + x) * 3 + 2] = b
                }
            }
        }
        base64 = data.toString('base64')
        if (base64.length > 4096)
        {
            chunk = base64.slice(0, 4096)
            t.write(`\x1b_Gq=1,i=${this.imgId},p=${this.imgId},f=24,s=${w},v=${h},m=1;${chunk}\x1b\\`)
            chunks = Math.ceil(base64.length / 4096)
            for (var _10_ = i = 1, _11_ = chunks; (_10_ <= _11_ ? i < chunks : i > chunks); (_10_ <= _11_ ? ++i : --i))
            {
                chunk = base64.slice(i * 4096, typeof Math.min((i + 1) * 4096,base64.length) === 'number' ? Math.min((i + 1) * 4096,base64.length) : -1)
                t.write(`\x1b_Gq=1,m=${((i === chunks - 1) ? 0 : 1)};${chunk}\x1b\\`)
            }
        }
        else
        {
            t.write(`\x1b_Gq=1,i=${this.imgId},p=${this.imgId},f=24,s=${w},v=${h};${base64}\x1b\\`)
        }
        return this.draw()
    }

    mapview.prototype["draw"] = function ()
    {
        var t

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.cells.rows <= 0 || this.cells.cols <= 0)
        {
            return
        }
        t.setCursor(this.cells.x,this.cells.y)
        t.write(`\x1b_Gq=1,a=p,i=${this.imgId},p=${this.imgId},C=1\x1b\\`)
        return this
    }

    return mapview
})()

export default mapview;