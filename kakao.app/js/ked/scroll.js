var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var floor, pow, scroll

import color from "./color.js"
import cells from "./cells.js"

floor = Math.floor
pow = Math.pow


scroll = (function ()
{
    function scroll (screen, state)
    {
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
        this["scrollTo"] = this["scrollTo"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this.cells = new cells(screen)
    }

    scroll.prototype["onMouse"] = function (event, col, row, button, mods, count)
    {
        var hover

        var _a_ = this.cells.posForScreen(col,row); col = _a_[0]; row = _a_[1]

        switch (event)
        {
            case 'press':
                if (col === 0)
                {
                    this.doDrag = true
                    return this.scrollTo(row)
                }
                break
            case 'drag':
                if (this.doDrag)
                {
                    return this.scrollTo(row)
                }
                break
            case 'release':
                if (this.doDrag)
                {
                    delete this.doDrag
                    return true
                }
                break
            case 'move':
                hover = col === 0
                if (this.hover !== hover)
                {
                    this.hover = hover
                    return true
                }
                break
        }

        return false
    }

    scroll.prototype["scrollTo"] = function (row)
    {
        var maxY, view

        view = this.state.s.view.asMutable()
        view[1] = parseInt(floor(row * (this.state.s.lines.length - this.cells.rows) / (this.cells.rows - 1)))
        maxY = this.state.s.lines.length - this.cells.rows
        if (maxY > 0)
        {
            view[1] = _k_.min(maxY,view[1])
        }
        view[1] = _k_.max(0,view[1])
        this.state.setView(view)
        return true
    }

    scroll.prototype["draw"] = function ()
    {
        var bg, kh, kp, lnum, nc, ne, ns, row, rows

        rows = this.cells.rows
        lnum = this.state.s.lines.length
        kh = parseInt(floor(pow((rows),2) / lnum))
        kp = parseInt(floor((rows - kh - 1) * this.state.s.view[1] / (lnum - rows + 1)))
        nc = parseInt(floor((rows - 1) * this.state.s.view[1] / (lnum - rows + 1)))
        ns = kp
        ne = kp + kh
        for (var _a_ = row = 0, _b_ = rows; (_a_ <= _b_ ? row < rows : row > rows); (_a_ <= _b_ ? ++row : --row))
        {
            bg = lnum < rows ? color.gutter : row === nc ? (this.hover ? color.scroll_doth : color.scroll_dot) : (ns <= row && row <= ne) ? (this.hover ? color.scroll_knob : color.scroll) : this.hover ? color.gutter : color.gutter
            this.cells.set(0,row,' ',null,bg)
        }
    }

    return scroll
})()

export default scroll;