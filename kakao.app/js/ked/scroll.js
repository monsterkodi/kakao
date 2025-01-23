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
        var bg, knob, ne, ns, row

        ns = parseInt(Math.floor((this.cells.t.rows() - 1) * this.state.s.view[1] / (this.state.s.lines.length - this.cells.t.rows() + 2)))
        ne = ns
        lf.write(ns)
        knob = [ns,ne]
        for (var _a_ = row = 0, _b_ = this.cells.t.rows() - 1; (_a_ <= _b_ ? row < this.cells.t.rows() - 1 : row > this.cells.t.rows() - 1); (_a_ <= _b_ ? ++row : --row))
        {
            bg = (knob[0] <= row && row <= knob[1]) ? (this.hover ? color.scroll_knob : color.scroll) : this.hover ? color.scroll : color.gutter
            this.cells.c[row][0].bg = bg
            this.cells.c[row][0].char = ' '
        }
    }

    return scroll
})()

export default scroll;