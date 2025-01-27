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
        var char, colno, cols, cursor, fg, gutter, i, sel, x, y

        y = this.cells.t.rows() - 1
        gutter = this.state.s.gutter
        cursor = this.state.s.cursor
        cols = this.cells.cols
        this.cells.set(0,y,'',color.status_dark,color.gutter)
        colno = _k_.rpad(gutter - 1,cursor[0] + 1)
        for (var _a_ = x = 1, _b_ = gutter; (_a_ <= _b_ ? x < gutter : x > gutter); (_a_ <= _b_ ? ++x : --x))
        {
            fg = (cursor[0] ? color.status_fg : color.column_fg)
            if (cursor[1] < this.state.s.lines.length)
            {
                if (cursor[0] > this.state.s.lines[cursor[1]].length)
                {
                    fg = color.status_empty
                }
            }
            this.cells.set(x,y,((x < colno.length ? colno[x - 1] : ' ')),fg,color.status_dark)
        }
        x = gutter
        this.cells.set(x,y,'',color.status,color.status_dark)
        if (this.state.isDirty())
        {
            this.cells.set(gutter + 1,y,'',color.status_fg,color.status)
        }
        else
        {
            this.cells.set(gutter + 1,y,'',color.status_dark,color.status)
        }
        this.cells.set(gutter + 2,y,' ',color.status_fg,color.status)
        for (var _c_ = x = gutter + 3, _d_ = gutter + 1 + this.file.length + 2; (_c_ <= _d_ ? x < gutter + 1 + this.file.length + 2 : x > gutter + 1 + this.file.length + 2); (_c_ <= _d_ ? ++x : --x))
        {
            char = ((x - gutter - 3 < this.file.length) ? this.file[x - gutter - 3] : ' ')
            this.cells.set(x,y,char,color.status_fg,color.status)
        }
        x = gutter + 3 + this.file.length
        this.cells.set(x,y,'',color.status,color.status_dark)
        for (var _e_ = x = gutter + 4 + this.file.length, _f_ = cols - 1; (_e_ <= _f_ ? x < cols - 1 : x > cols - 1); (_e_ <= _f_ ? ++x : --x))
        {
            this.cells.set(x,y,' ',null,color.status_dark)
        }
        this.cells.c[y][cols - 1].bg = color.status_dark
        if (!_k_.empty(this.drawTime) && cols - gutter + 2 + this.file.length > this.drawTime.length + 1)
        {
            x = cols - this.drawTime.length - 2
            this.cells.set(x,y,'',color.status,color.status_dark)
            for (var _10_ = i = 0, _11_ = this.drawTime.length; (_10_ <= _11_ ? i < this.drawTime.length : i > this.drawTime.length); (_10_ <= _11_ ? ++i : --i))
            {
                x = cols - this.drawTime.length + i - 1
                fg = (i < this.drawTime.length - 3 ? color.status_fg : color.status_fg_dim)
                this.cells.set(x,y,this.drawTime[i],fg,color.status)
            }
        }
        else
        {
            x = cols - 2
            this.cells.set(x,y,'',color.status,color.status_dark)
        }
        x = cols - 1
        this.cells.set(x,y,'',color.status,color.editor_empty)
        if (this.state.s.selections.length)
        {
            sel = `${this.state.s.selections.length} sel`
            for (var _12_ = i = 0, _13_ = sel.length; (_12_ <= _13_ ? i < sel.length : i > sel.length); (_12_ <= _13_ ? ++i : --i))
            {
                x = cols - this.drawTime.length + i - sel.length - 3
                fg = (i < sel.length - 4 ? color.status_sel : color.status_fg_dim)
                this.cells.set(x,y,sel[i],fg,color.status_dark)
            }
        }
    }

    return status
})()

export default status;