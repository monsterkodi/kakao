var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var floor, mapscr, pow

import kxk from "../../kxk.js"
let kstr = kxk.kstr

import prof from "../util/prof.js"
import syntax from "../util/syntax.js"
import color from "../util/color.js"
import util from "../util/util.js"

import theme from "../theme.js"

import cells from "./cells.js"

floor = Math.floor
pow = Math.pow


mapscr = (function ()
{
    function mapscr (screen, state)
    {
        this.state = state
    
        this["onMouse"] = this["onMouse"].bind(this)
        this["scrollToPixel"] = this["scrollToPixel"].bind(this)
        this["reallocBuffer"] = this["reallocBuffer"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["reload"] = this["reload"].bind(this)
        this["onPreResize"] = this["onPreResize"].bind(this)
        this["clearImages"] = this["clearImages"].bind(this)
        this.cells = new cells(screen)
        this.imgId = kstr.hash(this.state.name)
        this.pixelsPerRow = 3
        this.pixelsPerCol = 2
        screen.t.on('preResize',this.onPreResize)
    }

    mapscr.prototype["init"] = function (x, y, w, h)
    {
        return this.cells.init(x,y,w,h)
    }

    mapscr.prototype["clearImages"] = function ()
    {
        return this.cells.screen.t.write(`\x1b_Gq=1,a=d,d=i,i=${this.imgId}\x1b\\`)
    }

    mapscr.prototype["onPreResize"] = function ()
    {
        return this.clearImages()
    }

    mapscr.prototype["reload"] = function ()
    {
        this.clearImages()
        return this.reallocBuffer()
    }

    mapscr.prototype["onResize"] = function ()
    {
        if (_k_.empty(this.cells.screen.t.pixels))
        {
            return
        }
        clearTimeout(this.reallocId)
        return this.reallocId = setTimeout(this.reallocBuffer,100)
    }

    mapscr.prototype["reallocBuffer"] = function ()
    {
        var b, base64, bytes, ch, chunk, chunks, clss, data, f, g, h, i, li, line, r, rgb, t, w, x, xi, y

        t = this.cells.screen.t
        if (_k_.empty(t.cellsz))
        {
            return
        }
        var _a_ = [this.cells.cols * t.cellsz[0],this.cells.rows * t.cellsz[1]]; w = _a_[0]; h = _a_[1]

        bytes = w * h * 3
        if (bytes <= 0)
        {
            this.clearImages()
            return
        }
        data = Buffer.alloc(bytes)
        for (var _b_ = y = 0, _c_ = _k_.min(h,this.state.s.lines.length * this.pixelsPerRow); (_b_ <= _c_ ? y < _k_.min(h,this.state.s.lines.length * this.pixelsPerRow) : y > _k_.min(h,this.state.s.lines.length * this.pixelsPerRow)); (_b_ <= _c_ ? ++y : --y))
        {
            li = parseInt(y / this.pixelsPerRow)
            line = this.state.s.lines[li]
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
                    clss = this.state.syntax.getClass(xi,li)
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
                        rgb = color.rgb(this.state.syntax.getColor(xi,li))
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

    mapscr.prototype["draw"] = function ()
    {
        var t

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.cells.rows <= 0)
        {
            return
        }
        t.setCursor(this.cells.x,this.cells.y)
        t.write(`\x1b_Gq=1,a=p,i=${this.imgId},p=${this.imgId},C=1\x1b\\`)
        return this
    }

    mapscr.prototype["scrollToPixel"] = function (pixel)
    {
        var maxY, view

        view = this.state.s.view.asMutable()
        view[1] = parseInt((pixel[1] - this.cells.y * this.cells.screen.t.cellsz[1]) / this.pixelsPerRow)
        view[1] -= 6
        maxY = this.state.s.lines.length - this.cells.rows
        if (maxY > 0)
        {
            view[1] = _k_.min(maxY,view[1])
        }
        view[1] = _k_.max(0,view[1])
        this.state.setView(view)
        return true
    }

    mapscr.prototype["onMouse"] = function (event)
    {
        var col, row, sx, sy

        var _a_ = event.cell; sx = _a_[0]; sy = _a_[1]

        var _b_ = this.cells.posForEvent(event); col = _b_[0]; row = _b_[1]

        switch (event.type)
        {
            case 'press':
                if (this.cells.isInsideScreen(sx,sy))
                {
                    this.doDrag = true
                    return this.scrollToPixel(event.pixel)
                }
                break
            case 'drag':
                if (this.doDrag)
                {
                    return this.scrollToPixel(event.pixel)
                }
                break
            case 'release':
                if (this.doDrag)
                {
                    delete this.doDrag
                    this.hover = this.cells.isInsideScreen(sx,sy)
                    return true
                }
                break
            case 'move':
                this.hover = this.cells.isInsideScreen(sx,sy)
                if (this.hover)
                {
                    this.cells.screen.t.setPointerStyle('hand')
                }
                break
        }

        return false
    }

    return mapscr
})()

export default mapscr;