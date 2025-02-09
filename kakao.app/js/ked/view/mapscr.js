var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var mapscr

import theme from "../theme.js"

import cells from "./cells.js"


mapscr = (function ()
{
    function mapscr (screen, state)
    {
        this.state = state
    
        this.cells = new cells(screen)
    }

    mapscr.prototype["onResize"] = function ()
    {
        var base64, chunks, data, h, i, t, w, x, y

        t = this.cells.screen.t
        if (_k_.empty(t.pixels))
        {
            return
        }
        var _a_ = [this.cells.cols * t.cellsz[0],this.cells.rows * t.cellsz[1]]; w = _a_[0]; h = _a_[1]

        data = Buffer.allocUnsafe(w * h * 3)
        for (var _b_ = y = 0, _c_ = h; (_b_ <= _c_ ? y < h : y > h); (_b_ <= _c_ ? ++y : --y))
        {
            for (var _d_ = x = 0, _e_ = w; (_d_ <= _e_ ? x < w : x > w); (_d_ <= _e_ ? ++x : --x))
            {
                data[(y * w + x) * 3 + 0] = _k_.min(255,x)
                data[(y * w + x) * 3 + 1] = 0
                data[(y * w + x) * 3 + 2] = _k_.min(255,y)
            }
        }
        if (data.length > 4096)
        {
            base64 = data.slice(0, 4096).toString('base64')
            t.write(`\x1b_Gq=1,i=666,p=777,f=24,s=${w},v=${h},m=1;${base64}\x1b\\`)
            chunks = Math.ceil(data.length / 4096)
            for (var _f_ = i = 1, _10_ = chunks; (_f_ <= _10_ ? i < chunks : i > chunks); (_f_ <= _10_ ? ++i : --i))
            {
                base64 = data.slice(i * 4096, typeof Math.min((i + 1) * 4096,data.length) === 'number' ? Math.min((i + 1) * 4096,data.length) : -1).toString('base64')
                t.write(`\x1b_Gq=1,m=${(i === chunks - 1 ? 0 : 1)};${base64}\x1b\\`)
            }
        }
        else
        {
            base64 = data.toString('base64')
            return t.write(`\x1b_Gq=1,i=666,p=777,f=24,s=${w},v=${h};${base64}\x1b\\`)
        }
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