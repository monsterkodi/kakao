var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var floor, pow, scroll

import color from "./color.js"

floor = Math.floor
pow = Math.pow


scroll = (function ()
{
    function scroll (cells, state)
    {
        this.cells = cells
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
        this["scrollTo"] = this["scrollTo"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
    }

    scroll.prototype["onMouse"] = function (event, col, row, button, mods, count)
    {
        var hover

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
        var view, viewY

        viewY = parseInt(floor(row * (this.state.s.lines.length - this.cells.t.rows() + 1) / (this.cells.t.rows() - 2)))
        lf.write(`scrollTo ${row} ${viewY} ${this.state.s.view[1]}`)
        view = this.state.s.view.asMutable()
        view[1] = _k_.clamp(0,this.state.s.lines.length - this.cells.t.rows() + 1,viewY)
        this.state.s = this.state.s.set('view',view)
        return true
    }

    scroll.prototype["draw"] = function ()
    {
        var bg, kh, kp, lnum, nc, ne, ns, row, rows

        rows = this.cells.t.rows()
        lnum = this.state.s.lines.length
        kh = parseInt(floor(pow((rows - 1),2) / lnum))
        kp = parseInt(floor((rows - kh - 2) * this.state.s.view[1] / (lnum - rows + 1)))
        nc = parseInt(floor((rows - 2) * this.state.s.view[1] / (lnum - rows + 1)))
        ns = kp
        ne = kp + kh
        for (var _a_ = row = 0, _b_ = rows - 1; (_a_ <= _b_ ? row < rows - 1 : row > rows - 1); (_a_ <= _b_ ? ++row : --row))
        {
            bg = row === nc ? (this.hover ? color.scroll_doth : color.scroll_dot) : (ns <= row && row <= ne) ? (this.hover ? color.scroll_knob : color.scroll) : this.hover ? color.scroll : color.gutter
            this.cells.c[row][0].bg = bg
            this.cells.c[row][0].char = ' '
        }
    }

    return scroll
})()

export default scroll;