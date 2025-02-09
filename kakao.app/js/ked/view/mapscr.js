var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var floor, mapscr, pow

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
        this["rowAtPixelY"] = this["rowAtPixelY"].bind(this)
        this["scrollToPixel"] = this["scrollToPixel"].bind(this)
        this["scrollTo"] = this["scrollTo"].bind(this)
        this["reallocBuffer"] = this["reallocBuffer"].bind(this)
        this["onPreResize"] = this["onPreResize"].bind(this)
        this.cells = new cells(screen)
        screen.t.on('preResize',this.onPreResize)
    }

    mapscr.prototype["init"] = function (x, y, w, h)
    {
        return this.cells.init(x,y,w,h)
    }

    mapscr.prototype["onPreResize"] = function ()
    {
        return this.cells.screen.t.write("\x1b_Gq=1,a=d,d=A\x1b\\")
    }

    mapscr.prototype["onResize"] = function ()
    {
        var t

        t = this.cells.screen.t
        if (_k_.empty(t.pixels))
        {
            return
        }
        clearTimeout(this.reallocId)
        return this.reallocId = setTimeout(this.reallocBuffer,10)
    }

    mapscr.prototype["reallocBuffer"] = function ()
    {
        var b, base64, ch, chunks, clss, data, f, g, h, i, li, line, r, rgb, t, w, x, xi, y

        prof.start('mapscr')
        t = this.cells.screen.t
        var _a_ = [this.cells.cols * t.cellsz[0],this.cells.rows * t.cellsz[1]]; w = _a_[0]; h = _a_[1]

        data = Buffer.alloc(w * h * 3)
        prof.time('mapscr','alloc')
        for (var _b_ = y = 0, _c_ = _k_.min(h,this.state.s.lines.length * 4); (_b_ <= _c_ ? y < _k_.min(h,this.state.s.lines.length * 4) : y > _k_.min(h,this.state.s.lines.length * 4)); (_b_ <= _c_ ? ++y : --y))
        {
            li = parseInt(y / 4)
            line = this.state.s.lines[li]
            for (var _d_ = x = 0, _e_ = _k_.min(w,line.length * 2); (_d_ <= _e_ ? x < _k_.min(w,line.length * 2) : x > _k_.min(w,line.length * 2)); (_d_ <= _e_ ? ++x : --x))
            {
                if (x === 0)
                {
                    data[(y * w + x) * 3 + 0] = 55
                    data[(y * w + x) * 3 + 1] = 55
                    data[(y * w + x) * 3 + 2] = 55
                }
                xi = parseInt(x / 2)
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
        prof.time('mapscr','fill')
        if (data.length > 4096)
        {
            base64 = data.slice(0, 4096).toString('base64')
            t.write(`\x1b_Gq=1,i=666,p=777,f=24,s=${w},v=${h},m=1;${base64}\x1b\\`)
            chunks = Math.ceil(data.length / 4096)
            for (var _10_ = i = 1, _11_ = chunks; (_10_ <= _11_ ? i < chunks : i > chunks); (_10_ <= _11_ ? ++i : --i))
            {
                base64 = data.slice(i * 4096, typeof Math.min((i + 1) * 4096,data.length) === 'number' ? Math.min((i + 1) * 4096,data.length) : -1).toString('base64')
                t.write(`\x1b_Gq=1,m=${((i === chunks - 1) ? 0 : 1)};${base64}\x1b\\`)
            }
        }
        else
        {
            base64 = data.toString('base64')
            t.write(`\x1b_Gq=1,i=666,p=777,f=24,s=${w},v=${h};${base64}\x1b\\`)
        }
        prof.end('mapscr','send')
        return this.draw()
    }

    mapscr.prototype["draw"] = function ()
    {
        var t

        t = this.cells.screen.t
        if (_k_.empty(t.pixels))
        {
            return
        }
        t.setCursor(this.cells.x,this.cells.y)
        t.write("\x1b_Gq=1,a=p,i=666,p=777\x1b\\")
        return this
    }

    mapscr.prototype["scrollTo"] = function (row)
    {
        var maxY, view

        view = this.state.s.view.asMutable()
        view[1] = parseInt(floor(row * (this.state.s.lines.length - this.cells.rows + 1) / (this.cells.rows - 1)))
        maxY = this.state.s.lines.length - this.cells.rows
        if (maxY > 0)
        {
            view[1] = _k_.min(maxY,view[1])
        }
        view[1] = _k_.max(0,view[1])
        this.state.setView(view)
        return true
    }

    mapscr.prototype["scrollToPixel"] = function (pixel)
    {
        var maxY, rof, view

        rof = pixel[1] / this.cells.screen.t.cellsz[1]
        lf(pixel,rof)
        view = this.state.s.view.asMutable()
        view[1] = parseInt(floor(rof * (this.state.s.lines.length - this.cells.rows + 1) / (this.cells.rows - 1)))
        maxY = this.state.s.lines.length - this.cells.rows
        if (maxY > 0)
        {
            view[1] = _k_.min(maxY,view[1])
        }
        view[1] = _k_.max(0,view[1])
        this.state.setView(view)
        return true
    }

    mapscr.prototype["rowAtPixelY"] = function (py)
    {
        return parseInt(py / this.cells.screen.t.cellsz[1])
    }

    mapscr.prototype["onMouse"] = function (type, sx, sy, event)
    {
        var col, row

        var _a_ = this.cells.posForScreen(sx,sy); col = _a_[0]; row = _a_[1]

        switch (type)
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
                break
        }

        return false
    }

    return mapscr
})()

export default mapscr;