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
        this.file = ''
        this.drawTime = ''
    }

    status.prototype["draw"] = function ()
    {
        var char, colno, cols, cursor, dirtyChar, dirtyColor, dt, fg, gtr, i, sc, sel, x, y

        y = this.cells.rows - 1
        gtr = this.state.s.gutter
        cursor = this.state.s.cursor
        cols = this.cells.cols
        sc = (function (x, char, fg, bg)
        {
            return this.cells.set(x,y,char,color[fg],color[bg])
        }).bind(this)
        sc(0,'','status_dark','gtr')
        colno = _k_.rpad(gtr - 1,cursor[0] + 1)
        for (var _a_ = x = 1, _b_ = gtr; (_a_ <= _b_ ? x < gtr : x > gtr); (_a_ <= _b_ ? ++x : --x))
        {
            fg = (cursor[0] ? 'status_fg' : 'column_fg')
            if (cursor[1] < this.state.s.lines.length && cursor[0] > this.state.s.lines[cursor[1]].length)
            {
                fg = 'status_empty'
            }
            sc(x,((x < colno.length ? colno[x - 1] : ' ')),fg,'status_dark')
        }
        sc(gtr,'','status','status_dark')
        dirtyChar = (this.state.isDirty() ? '' : '')
        dirtyColor = (this.state.isDirty() ? 'status_fg' : 'status_dark')
        sc(gtr + 1,dirtyChar,dirtyColor,'status')
        sc(gtr + 2,' ','status_fg','status')
        for (var _c_ = x = gtr + 3, _d_ = gtr + 1 + this.file.length + 2; (_c_ <= _d_ ? x < gtr + 1 + this.file.length + 2 : x > gtr + 1 + this.file.length + 2); (_c_ <= _d_ ? ++x : --x))
        {
            char = ((x - gtr - 3 < this.file.length) ? this.file[x - gtr - 3] : ' ')
            sc(x,char,'status_fg','status')
        }
        sc(gtr + 3 + this.file.length,'','status','status_dark')
        for (var _e_ = x = gtr + 4 + this.file.length, _f_ = cols - 1; (_e_ <= _f_ ? x < cols - 1 : x > cols - 1); (_e_ <= _f_ ? ++x : --x))
        {
            sc(x,' ',null,'status_dark')
        }
        dt = this.drawTime
        if (cols - gtr + 2 + this.file.length > dt.length + 1)
        {
            sc(cols - dt.length - 2,'','status','status_dark')
            for (var _10_ = i = 0, _11_ = dt.length; (_10_ <= _11_ ? i < dt.length : i > dt.length); (_10_ <= _11_ ? ++i : --i))
            {
                fg = (i < dt.length - 3 ? 'status_fg' : 'status_fg_dim')
                sc(cols - dt.length + i - 1,dt[i],fg,'status')
            }
        }
        else
        {
            sc(cols - 2,'','status','status_dark')
        }
        sc(cols - 1,'','status','editor_empty')
        if (this.state.s.selections.length)
        {
            sel = `${this.state.s.selections.length} sel`
            for (var _12_ = i = 0, _13_ = sel.length; (_12_ <= _13_ ? i < sel.length : i > sel.length); (_12_ <= _13_ ? ++i : --i))
            {
                fg = (i < sel.length - 4 ? 'status_sel' : 'status_fg_dim')
                sc(cols - dt.length + i - sel.length - 3,sel[i],fg,'status_dark')
            }
        }
    }

    return status
})()

export default status;