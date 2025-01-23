var scroll

import color from "./color.js"


scroll = (function ()
{
    function scroll (cells, state)
    {
        this.cells = cells
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
        this["setHover"] = this["setHover"].bind(this)
    }

    scroll.prototype["setHover"] = function (hover)
    {
        this.hover = hover
    }

    scroll.prototype["draw"] = function ()
    {
        var bg, kh, kp, nc, ne, ns, row

        kh = parseInt(Math.floor(Math.pow((this.cells.t.rows() - 1),2) / this.state.s.lines.length))
        kp = parseInt(Math.floor((this.cells.t.rows() - kh - 2) * this.state.s.view[1] / (this.state.s.lines.length - this.cells.t.rows() + 1)))
        nc = parseInt(Math.floor((this.cells.t.rows() - 1) * this.state.s.view[1] / (this.state.s.lines.length - this.cells.t.rows() + 2)))
        nc = parseInt(Math.floor((this.cells.t.rows() - 2) * this.state.s.view[1] / (this.state.s.lines.length - this.cells.t.rows() + 1)))
        ns = kp
        ne = kp + kh
        lf.write(`${ns} ${nc} ${ne}`)
        for (var _a_ = row = 0, _b_ = this.cells.t.rows() - 1; (_a_ <= _b_ ? row < this.cells.t.rows() - 1 : row > this.cells.t.rows() - 1); (_a_ <= _b_ ? ++row : --row))
        {
            bg = row === nc ? (this.hover ? color.scroll_doth : color.scroll_dot) : (ns <= row && row <= ne) ? (this.hover ? color.scroll_knob : color.scroll) : this.hover ? color.scroll : color.gutter
            this.cells.c[row][0].bg = bg
            this.cells.c[row][0].char = ' '
        }
    }

    return scroll
})()

export default scroll;