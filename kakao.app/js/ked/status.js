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
        var char, colno, fg, i, sel, x, y

        y = this.cells.t.rows() - 1
        this.cells.set(0,y,'',color.status_dark,color.gutter)
        colno = _k_.rpad(this.state.s.gutter - 1,this.state.s.cursor[0] + 1)
        for (var _a_ = x = 1, _b_ = this.state.s.gutter; (_a_ <= _b_ ? x < this.state.s.gutter : x > this.state.s.gutter); (_a_ <= _b_ ? ++x : --x))
        {
            fg = (this.state.s.cursor[0] ? color.status_fg : color.column_fg)
            if (this.state.s.cursor[0] > this.state.s.lines[this.state.s.cursor[1]].length)
            {
                fg = color.status_empty
            }
            this.cells.set(x,y,((x < colno.length ? colno[x - 1] : ' ')),fg,color.status_dark)
        }
        x = this.state.s.gutter
        this.cells.set(x,y,'',color.status,color.status_dark)
        for (var _c_ = x = this.state.s.gutter + 1, _d_ = this.state.s.gutter + 1 + this.file.length; (_c_ <= _d_ ? x < this.state.s.gutter + 1 + this.file.length : x > this.state.s.gutter + 1 + this.file.length); (_c_ <= _d_ ? ++x : --x))
        {
            char = ((x - this.state.s.gutter - 1 < this.file.length) ? this.file[x - this.state.s.gutter - 1] : ' ')
            this.cells.set(x,y,char,color.status_fg,color.status)
        }
        x = this.state.s.gutter + 1 + this.file.length
        this.cells.set(x,y,'',color.status,color.status_dark)
        for (var _e_ = x = this.state.s.gutter + 2 + this.file.length, _f_ = this.cells.t.cols() - 1; (_e_ <= _f_ ? x < this.cells.t.cols() - 1 : x > this.cells.t.cols() - 1); (_e_ <= _f_ ? ++x : --x))
        {
            this.cells.set(x,y,' ',null,color.status_dark)
        }
        this.cells.c[y][this.cells.t.cols() - 1].bg = color.status_dark
        if (!_k_.empty(this.drawTime) && this.cells.t.cols() - this.state.s.gutter + 2 + this.file.length > this.drawTime.length + 1)
        {
            x = this.cells.t.cols() - this.drawTime.length - 2
            this.cells.set(x,y,'',color.status,color.status_dark)
            for (var _10_ = i = 0, _11_ = this.drawTime.length; (_10_ <= _11_ ? i < this.drawTime.length : i > this.drawTime.length); (_10_ <= _11_ ? ++i : --i))
            {
                x = this.cells.t.cols() - this.drawTime.length + i - 1
                this.cells.set(x,y,this.drawTime[i],color.status_fg,color.status)
            }
        }
        else
        {
            x = this.cells.t.cols() - 2
            this.cells.set(x,y,'',color.status,color.status_dark)
        }
        x = this.cells.t.cols() - 1
        this.cells.set(x,y,'',color.status,color.editor_empty)
        if (this.state.s.selections.length)
        {
            sel = `${this.state.s.selections.length} sel`
            for (var _12_ = i = 0, _13_ = sel.length; (_12_ <= _13_ ? i < sel.length : i > sel.length); (_12_ <= _13_ ? ++i : --i))
            {
                x = this.cells.t.cols() - this.drawTime.length + i - 3 - sel.length
                this.cells.set(x,y,sel[i],color.status_sel,color.status)
            }
        }
    }

    return status
})()

export default status;