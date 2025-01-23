var _k_ = {rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}}

var status

import color from "./color.js"


status = (function ()
{
    function status (cells, state)
    {
        this.cells = cells
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
        this.text = ''
    }

    status.prototype["draw"] = function ()
    {
        var colno, x, y

        y = this.cells.t.rows() - 1
        colno = _k_.rpad(this.state.s.gutter - 2,this.state.s.cursor[0] + 1)
        for (var _a_ = x = 0, _b_ = this.state.s.gutter - 1; (_a_ <= _b_ ? x < this.state.s.gutter - 1 : x > this.state.s.gutter - 1); (_a_ <= _b_ ? ++x : --x))
        {
            if (x < this.cells.t.cols())
            {
                this.cells.c[y][x].bg = color.column
                this.cells.c[y][x].fg = color.column_fg
                this.cells.c[y][x].char = (x < colno.length ? colno[x] : ' ')
            }
        }
        for (var _c_ = x = this.state.s.gutter, _d_ = this.cells.t.cols(); (_c_ <= _d_ ? x < this.cells.t.cols() : x > this.cells.t.cols()); (_c_ <= _d_ ? ++x : --x))
        {
            if (x < this.cells.t.cols())
            {
                this.cells.c[y][x].bg = color.status
                this.cells.c[y][x].fg = color.status_fg
                this.cells.c[y][x].char = ((x - this.state.s.gutter < this.text.length) ? this.text[x - this.state.s.gutter] : ' ')
            }
        }
    }

    return status
})()

export default status;