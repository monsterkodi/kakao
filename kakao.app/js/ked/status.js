var _k_ = {rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}}

var status

import color from "./color.js"
import util from "./util.js"


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
        var char, colno, cols, cursor, dt, dtl, dty, fg, fnl, gtr, i, rdo, sc, sel, x, y

        y = this.cells.rows - 1
        gtr = this.state.s.gutter
        cursor = this.state.s.cursor
        cols = this.cells.cols
        fnl = this.file.length
        dt = this.drawTime
        dtl = dt.length
        rdo = this.state.hasRedo()
        dty = this.state.isDirty()
        sc = (function (x, char, fg, bg)
        {
            return this.cells.set(x,y,char,color[fg],color[bg])
        }).bind(this)
        sc(0,'','status_dark','gtr')
        colno = _k_.rpad(gtr - 1,cursor[0] + 1)
        for (var _a_ = x = 1, _b_ = gtr; (_a_ <= _b_ ? x < gtr : x > gtr); (_a_ <= _b_ ? ++x : --x))
        {
            fg = (cursor[0] ? 'status_fg' : 'column_fg')
            if (util.isPosOutsideLines(cursor,this.state.s.lines))
            {
                fg = 'status_empty'
            }
            sc(x,((x < colno.length ? colno[x - 1] : ' ')),fg,'status_dark')
        }
        sc(gtr,'','status','status_dark')
        sc(gtr + 1,(dty ? '' : ''),(dty ? 'status_fg' : 'status_dark'),'status')
        sc(gtr + 2,' ','status_fg','status')
        for (var _c_ = x = gtr + 3, _d_ = gtr + fnl + 3; (_c_ <= _d_ ? x < gtr + fnl + 3 : x > gtr + fnl + 3); (_c_ <= _d_ ? ++x : --x))
        {
            char = ((x - gtr - 3 < fnl) ? this.file[x - gtr - 3] : ' ')
            sc(x,char,'status_fg','status')
        }
        sc(gtr + fnl + 3,' ','status_fg','status')
        sc(gtr + fnl + 4,(rdo ? '' : ''),(rdo ? 'status_fg' : 'status_dark'),'status')
        sc(gtr + 5 + fnl,'','status','status_dark')
        for (var _e_ = x = gtr + 6 + fnl, _f_ = cols - 1; (_e_ <= _f_ ? x < cols - 1 : x > cols - 1); (_e_ <= _f_ ? ++x : --x))
        {
            sc(x,' ',null,'status_dark')
        }
        if (cols - gtr + 2 + fnl > dtl + 1)
        {
            sc(cols - dtl - 2,'','status','status_dark')
            for (var _10_ = i = 0, _11_ = dtl; (_10_ <= _11_ ? i < dtl : i > dtl); (_10_ <= _11_ ? ++i : --i))
            {
                fg = (i < dtl - 3 ? 'status_fg' : 'status_fg_dim')
                sc(cols - dtl + i - 1,dt[i],fg,'status')
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
                sc(cols - dtl + i - sel.length - 3,sel[i],fg,'status_dark')
            }
        }
    }

    return status
})()

export default status;