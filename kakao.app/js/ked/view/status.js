var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var status

import theme from "../theme.js"

import cells from "./cells.js"

import color from "../util/color.js"
import util from "../util/util.js"


status = (function ()
{
    function status (screen, state)
    {
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
        this.gutter = 4
        this.cells = new cells(screen)
        this.file = ''
        this.drawTime = ''
    }

    status.prototype["init"] = function (x, y, w, h)
    {
        return this.cells.init(x,y,w,h)
    }

    status.prototype["draw"] = function ()
    {
        var add, ci, colno, cols, cur, cursor, dt, dtl, dty, fg, fnl, hil, i, lastDot, lastSlash, rcol, rdo, sel, set, x, y

        x = 0
        y = this.cells.rows - 1
        cursor = this.state.mainCursor()
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
                fg = theme[fg]
            }
            if (!_k_.empty(bg) && bg[0] !== '#')
            {
                bg = theme[bg]
            }
            this.cells.set(x,y,char,fg,bg)
            return 1
        }).bind(this)
        add = (function (char, fg, bg)
        {
            return x += set(x,char,fg,bg)
        }).bind(this)
        add('','status_dark','gutter')
        colno = _k_.rpad(this.gutter - 1,`${cursor[0] + 1}`)
        for (var _a_ = ci = 1, _b_ = this.gutter; (_a_ <= _b_ ? ci < this.gutter : ci > this.gutter); (_a_ <= _b_ ? ++ci : --ci))
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
                fg = color.darken(theme[fg])
            }
            add(this.file[ci],fg,'status')
        }
        add(' ','status_fg','status')
        rcol = (rdo ? 'status_redo' : (dty ? 'status_dirty' : 'status_dark'))
        add((rdo ? '' : ''),rcol,'status')
        add('','status','status_dark')
        add(' ',null,'status_dark')
        if (this.state.s.selections.length)
        {
            sel = ` ${this.state.s.selections.length} sel `
            for (var _e_ = i = 0, _f_ = sel.length; (_e_ <= _f_ ? i < sel.length : i > sel.length); (_e_ <= _f_ ? ++i : --i))
            {
                add(sel[i],((i < sel.length - 4) ? 'status_sel' : 'status_fg_dim'),'status_dark')
            }
        }
        if (this.state.s.cursors.length > 1)
        {
            cur = ` ${this.state.s.cursors.length} cur `
            for (var _10_ = i = 0, _11_ = cur.length; (_10_ <= _11_ ? i < cur.length : i > cur.length); (_10_ <= _11_ ? ++i : --i))
            {
                add(cur[i],((i < cur.length - 4) ? 'status_cur' : 'status_fg_dim'),'status_dark')
            }
        }
        if (this.state.s.highlights.length)
        {
            hil = ` ${this.state.s.highlights.length} hil `
            for (var _12_ = i = 0, _13_ = hil.length; (_12_ <= _13_ ? i < hil.length : i > hil.length); (_12_ <= _13_ ? ++i : --i))
            {
                add(hil[i],((i < hil.length - 4) ? 'status_hil' : 'status_fg_dim'),'status_dark')
            }
        }
        if (cols - dtl - 2 >= x)
        {
            for (var _14_ = ci = x, _15_ = cols - dtl - 2; (_14_ <= _15_ ? ci < cols - dtl - 2 : ci > cols - dtl - 2); (_14_ <= _15_ ? ++ci : --ci))
            {
                add(' ',null,'status_dark')
            }
            add('','status','status_dark')
            for (var _16_ = i = 0, _17_ = dtl; (_16_ <= _17_ ? i < dtl : i > dtl); (_16_ <= _17_ ? ++i : --i))
            {
                fg = (i < dtl - 3 ? 'status_fg' : 'status_fg_dim')
                add(dt[i],fg,'status')
            }
            return add('','status','editor_empty')
        }
        else
        {
            for (var _18_ = ci = x, _19_ = cols - dtl - 2; (_18_ <= _19_ ? ci < cols - dtl - 2 : ci > cols - dtl - 2); (_18_ <= _19_ ? ++ci : --ci))
            {
                add(' ',null,'status_dark')
            }
        }
    }

    return status
})()

export default status;