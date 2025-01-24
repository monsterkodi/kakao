var _k_ = {rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var status

import color from "./color.js"


status = (function ()
{
    function status (cells, state)
    {
        this.cells = cells
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
        this.file = ''
        this.drawTime = ''
    }

    status.prototype["draw"] = function ()
    {
        var colno, i, x, y

        y = this.cells.t.rows() - 1
        colno = _k_.rpad(this.state.s.gutter - 1,this.state.s.cursor[0] + 1)
        for (var _a_ = x = 0, _b_ = this.state.s.gutter; (_a_ <= _b_ ? x < this.state.s.gutter : x > this.state.s.gutter); (_a_ <= _b_ ? ++x : --x))
        {
            if (x < this.cells.t.cols())
            {
                this.cells.c[y][x].bg = color.status_dark
                this.cells.c[y][x].fg = color.column_fg
                this.cells.c[y][x].char = (x < colno.length ? colno[x] : ' ')
            }
        }
        x = this.state.s.gutter
        if (x < this.cells.t.cols())
        {
            this.cells.c[y][x].bg = color.status_dark
            this.cells.c[y][x].fg = color.status
            this.cells.c[y][x].char = ''
        }
        for (var _c_ = x = this.state.s.gutter + 1, _d_ = this.state.s.gutter + 1 + this.file.length; (_c_ <= _d_ ? x < this.state.s.gutter + 1 + this.file.length : x > this.state.s.gutter + 1 + this.file.length); (_c_ <= _d_ ? ++x : --x))
        {
            if (x < this.cells.t.cols())
            {
                this.cells.c[y][x].bg = color.status
                this.cells.c[y][x].fg = color.status_fg
                this.cells.c[y][x].char = ((x - this.state.s.gutter - 1 < this.file.length) ? this.file[x - this.state.s.gutter - 1] : ' ')
            }
        }
        x = this.state.s.gutter + 1 + this.file.length
        if (x < this.cells.t.cols())
        {
            this.cells.c[y][x].bg = color.status_dark
            this.cells.c[y][x].fg = color.status
            this.cells.c[y][x].char = ''
        }
        for (var _e_ = x = this.state.s.gutter + 2 + this.file.length, _f_ = this.cells.t.cols() - 1; (_e_ <= _f_ ? x < this.cells.t.cols() - 1 : x > this.cells.t.cols() - 1); (_e_ <= _f_ ? ++x : --x))
        {
            if (x < this.cells.t.cols())
            {
                this.cells.c[y][x].bg = color.status_dark
                this.cells.c[y][x].char = ' '
            }
        }
        this.cells.c[y][this.cells.t.cols() - 1].bg = color.status_dark
        if (!_k_.empty(this.drawTime) && this.cells.t.cols() - this.state.s.gutter + 2 + this.file.length > this.drawTime.length + 1)
        {
            x = this.cells.t.cols() - this.drawTime.length - 2
            this.cells.c[y][x].bg = color.status_dark
            this.cells.c[y][x].fg = color.status
            this.cells.c[y][x].char = ''
            for (var _10_ = i = 0, _11_ = this.drawTime.length; (_10_ <= _11_ ? i < this.drawTime.length : i > this.drawTime.length); (_10_ <= _11_ ? ++i : --i))
            {
                x = this.cells.t.cols() - this.drawTime.length + i - 1
                if (x < this.cells.t.cols())
                {
                    this.cells.c[y][x].bg = color.status
                    this.cells.c[y][x].fg = color.status_fg
                    this.cells.c[y][x].char = this.drawTime[i]
                }
            }
        }
        else
        {
            x = this.cells.t.cols() - 2
            this.cells.c[y][x].bg = color.status_dark
            this.cells.c[y][x].fg = color.status
            this.cells.c[y][x].char = ''
        }
        x = this.cells.t.cols() - 1
        this.cells.c[y][x].bg = color.editor_empty
        this.cells.c[y][x].fg = color.status
        return this.cells.c[y][x].char = ''
    }

    return status
})()

export default status;