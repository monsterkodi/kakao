var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}}

var status

import view from "./view.js"

import color from "../util/color.js"
import theme from "../util/theme.js"
import util from "../util/util.js"


status = (function ()
{
    _k_.extend(status, view)
    function status (screen, state)
    {
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
        status.__super__.constructor.call(this,screen,'status')
        this.gutter = 4
        this.file = ''
        this.drawTime = ''
    }

    status.prototype["draw"] = function ()
    {
        var add, ci, colno, cols, cur, cursor, dt, dtl, dty, fg, fnl, hil, i, mx, rcol, rdo, sel, set, x, y

        x = 0
        y = 0
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
        mx = this.cells.cols - 3
        x += this.cells.draw_path(x,mx,y,this.file,theme.status)
        add(' ','status_fg','status')
        rcol = (rdo ? 'status_redo' : (dty ? 'status_dirty' : 'status_dark'))
        add((rdo ? '' : ''),rcol,'status')
        add('','status','status_dark')
        add(' ',null,'status_dark')
        if (this.state.s.selections.length)
        {
            sel = ` ${this.state.s.selections.length} sel `
            for (var _c_ = i = 0, _d_ = sel.length; (_c_ <= _d_ ? i < sel.length : i > sel.length); (_c_ <= _d_ ? ++i : --i))
            {
                add(sel[i],((i < sel.length - 4) ? 'status_sel' : 'status_fg_dim'),'status_dark')
            }
        }
        if (this.state.s.cursors.length > 1)
        {
            cur = ` ${this.state.s.cursors.length} cur `
            for (var _e_ = i = 0, _f_ = cur.length; (_e_ <= _f_ ? i < cur.length : i > cur.length); (_e_ <= _f_ ? ++i : --i))
            {
                add(cur[i],((i < cur.length - 4) ? 'status_cur' : 'status_fg_dim'),'status_dark')
            }
        }
        if (this.state.s.highlights.length)
        {
            hil = ` ${this.state.s.highlights.length} hil `
            for (var _10_ = i = 0, _11_ = hil.length; (_10_ <= _11_ ? i < hil.length : i > hil.length); (_10_ <= _11_ ? ++i : --i))
            {
                add(hil[i],((i < hil.length - 4) ? 'status_hil' : 'status_fg_dim'),'status_dark')
            }
        }
        if (cols - dtl - 2 >= x)
        {
            for (var _12_ = ci = x, _13_ = cols - dtl - 2; (_12_ <= _13_ ? ci < cols - dtl - 2 : ci > cols - dtl - 2); (_12_ <= _13_ ? ++ci : --ci))
            {
                add(' ',null,'status_dark')
            }
            add('','status','status_dark')
            for (var _14_ = i = 0, _15_ = dtl; (_14_ <= _15_ ? i < dtl : i > dtl); (_14_ <= _15_ ? ++i : --i))
            {
                fg = (i < dtl - 3 ? 'status_fg' : 'status_fg_dim')
                add(dt[i],fg,'status')
            }
            return add('','status','editor_empty')
        }
        else
        {
            for (var _16_ = ci = x, _17_ = cols - dtl - 2; (_16_ <= _17_ ? ci < cols - dtl - 2 : ci > cols - dtl - 2); (_16_ <= _17_ ? ++ci : --ci))
            {
                add(' ',null,'status_dark')
            }
        }
    }

    return status
})()

export default status;