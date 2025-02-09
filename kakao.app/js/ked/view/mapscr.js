var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var mapscr

import prof from "../util/prof.js"
import syntax from "../util/syntax.js"
import color from "../util/color.js"
import util from "../util/util.js"

import theme from "../theme.js"

import cells from "./cells.js"

import { NodeSharedMemoryWriteStream } from "../../../node-libsharedmemory"

mapscr = (function ()
{
    function mapscr (screen, state)
    {
        this.state = state
    
        this["reallocBuffer"] = this["reallocBuffer"].bind(this)
        this["onPreResize"] = this["onPreResize"].bind(this)
        this.cells = new cells(screen)
        screen.t.on('preResize',this.onPreResize)
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
        var b, base64, ch, chunks, data, fg, g, h, i, li, line, r, t, w, x, xi, y

        prof.start('mapscr')
        t = this.cells.screen.t
        var _a_ = [this.cells.cols * t.cellsz[0],this.cells.rows * t.cellsz[1]]; w = _a_[0]; h = _a_[1]

        data = Buffer.alloc(w * h * 3)
        prof.time('mapscr','alloc')
        for (var _b_ = y = 0, _c_ = _k_.min(h,this.state.s.lines.length * 3); (_b_ <= _c_ ? y < _k_.min(h,this.state.s.lines.length * 3) : y > _k_.min(h,this.state.s.lines.length * 3)); (_b_ <= _c_ ? ++y : --y))
        {
            li = parseInt(y / 3)
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
                fg = this.state.syntax.getColor(xi,li)
                ch = line[xi]
                if (!_k_.empty(ch) && ch !== ' ')
                {
                    var _f_ = color.rgb(fg); r = _f_[0]; g = _f_[1]; b = _f_[2]

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

    mapscr.prototype["init"] = function (x, y, w, h)
    {
        return this.cells.init(x,y,w,h)
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

    return mapscr
})()

export default mapscr;