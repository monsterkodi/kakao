var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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
        var add, ci, colno, cols, cursor, dt, dtl, dty, fg, fnl, gtr, i, lastDot, lastSlash, rcol, rdo, sel, set, x, y

        x = 0
        y = this.cells.rows - 1
        gtr = this.state.s.gutter
        cursor = this.state.s.cursor
        cols = this.cells.cols
        fnl = this.file.length
        dt = this.drawTime
        dtl = dt.length
        rdo = this.state.hasRedo()
        dty = this.state.isDirty()
        set = (function (x, char, fg, bg)
        {
            if (!_k_.empty(fg) && fg[0] !== '#')
            {
                fg = color[fg]
            }
            if (!_k_.empty(bg) && bg[0] !== '#')
            {
                bg = color[bg]
            }
            this.cells.set(x,y,char,fg,bg)
            return 1
        }).bind(this)
        add = (function (char, fg, bg)
        {
            return x += set(x,char,fg,bg)
        }).bind(this)
        add('','status_dark','gutter')
        colno = _k_.rpad(gtr - 1,`${cursor[0] + 1}`)
        for (var _a_ = ci = 1, _b_ = gtr; (_a_ <= _b_ ? ci < gtr : ci > gtr); (_a_ <= _b_ ? ++ci : --ci))
        {
            fg = (cursor[0] ? 'status_fg' : 'column_fg')
            if (util.isLinesPosOutside(this.state.s.lines,cursor))
            {
                fg = 'status_empty'
            }
            add(((ci - 1 < colno.length) ? colno[ci - 1] : ' '),fg,'status_dark')
        }
        add('','status','status_dark')
        add((dty ? '' : ''),(dty ? 'status_dirty' : 'status_dark'),'status')
        add(' ','status_fg','status')
        lastSlash = this.file.lastIndexOf('/')
        lastDot = this.file.lastIndexOf('.')
        for (var _c_ = ci = 0, _d_ = fnl; (_c_ <= _d_ ? ci < fnl : ci > fnl); (_c_ <= _d_ ? ++ci : --ci))
        {
            fg = (ci > lastSlash ? 'status_file' : 'status_dir')
            if ((lastSlash <= lastDot && lastDot <= ci))
            {
                fg = 'status_ext'
            }
            if (_k_.in(this.file[ci],'./'))
            {
                fg = color.darken(color[fg])
            }
            add(this.file[ci],fg,'status')
        }
        add(' ','status_fg','status')
        rcol = (rdo ? 'status_redo' : (dty ? 'status_dirty' : 'status_dark'))
        add((rdo ? '' : ''),rcol,'status')
        add('','status','status_dark')
        for (var _e_ = ci = x, _f_ = cols - 1; (_e_ <= _f_ ? ci < cols - 1 : ci > cols - 1); (_e_ <= _f_ ? ++ci : --ci))
        {
            add(' ',null,'status_dark')
        }
        if (cols - gtr + 2 + fnl > dtl + 1)
        {
            set(cols - dtl - 2,'','status','status_dark')
            for (var _10_ = i = 0, _11_ = dtl; (_10_ <= _11_ ? i < dtl : i > dtl); (_10_ <= _11_ ? ++i : --i))
            {
                fg = (i < dtl - 3 ? 'status_fg' : 'status_fg_dim')
                set(cols - dtl + i - 1,dt[i],fg,'status')
            }
        }
        else
        {
            set(cols - 2,'','status','status_dark')
        }
        set(cols - 1,'','status','editor_empty')
        if (this.state.s.selections.length)
        {
            sel = `${this.state.s.selections.length} sel`
            for (var _12_ = i = 0, _13_ = sel.length; (_12_ <= _13_ ? i < sel.length : i > sel.length); (_12_ <= _13_ ? ++i : --i))
            {
                fg = (i < sel.length - 4 ? 'status_sel' : 'status_fg_dim')
                set(cols - dtl + i - sel.length - 3,sel[i],fg,'status_dark')
            }
        }
    }

    return status
})()

export default status;