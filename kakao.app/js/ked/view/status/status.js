var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var status

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import belt from "../../edit/tool/belt.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import crumbs from "../base/crumbs.js"

import statusfile from "./statusfile.js"


status = (function ()
{
    _k_.extend(status, view)
    function status (screen, state)
    {
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["setFile"] = this["setFile"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onFileAction"] = this["onFileAction"].bind(this)
        this["onCrumbsAction"] = this["onCrumbsAction"].bind(this)
        status.__super__.constructor.call(this,screen,'status')
        this.gutter = 4
        this.file = ''
        this.drawTime = ''
        this.pointerType = 'pointer'
        this.crumbs = new crumbs(this.screen,'status_crumbs')
        this.statusfile = new statusfile(this.screen,'status_file')
        this.crumbs.color.bgl = theme.gutter
        this.crumbs.color.bgr = theme.status_empty
        this.crumbs.on('action',this.onCrumbsAction)
        this.statusfile.on('action',this.onFileAction)
    }

    status.prototype["onCrumbsAction"] = function (action, path, event)
    {
        switch (action)
        {
            case 'click':
                if (!_k_.empty(event.mods))
                {
                    return post.emit('funcol.root',path)
                }
                else
                {
                    return post.emit('fsbrow.dir',path)
                }
                break
        }

    }

    status.prototype["onFileAction"] = function (action, file)
    {
        switch (action)
        {
            case 'click':
                return post.emit('fsbrow.dir',slash.dir(file),file)

        }

    }

    status.prototype["onMouse"] = function (event)
    {
        var col, cret, row, sret

        cret = this.crumbs.onMouse(event)
        sret = this.statusfile.onMouse(event)
        if (sret || cret)
        {
            return sret || cret
        }
        status.__super__.onMouse.call(this,event)
        var _a_ = this.cells.posForEvent(event); col = _a_[0]; row = _a_[1]

        if (this.hover)
        {
            post.emit('pointer',this.pointerType)
        }
        if (this.hover && (0 <= col && col < 4))
        {
            switch (event.type)
            {
                case 'press':
                    post.emit('funcol.toggle')
                    return {redraw:true}

            }

        }
        return this.hover
    }

    status.prototype["setFile"] = function (file)
    {
        this.file = file
    
        this.crumbs.set(slash.dir(this.file))
        return this.statusfile.set(this.file)
    }

    status.prototype["layout"] = function (x, y, w, h)
    {
        status.__super__.layout.call(this,x,y,w,h)
    
        var cw

        cw = parseInt(w / 2)
        this.crumbs.layout(x + this.gutter + 1,y,cw,1)
        this.crumbs.layout(x + this.gutter + 1,y,this.crumbs.rounded.length,1)
        return this.statusfile.layout(x + this.gutter + 1 + this.crumbs.rounded.length,y,this.statusfile.rounded.length,1)
    }

    status.prototype["draw"] = function ()
    {
        var add, ch, ci, colno, cols, cur, cursor, dt, dty, fg, fnl, hil, i, rdo, sel, set, x, y

        if (this.hidden())
        {
            return
        }
        x = 0
        y = 0
        cursor = this.state.mainCursor()
        cols = this.cells.cols
        fnl = this.file.length
        dt = this.drawTime
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
        add('','status_col','gutter')
        colno = _k_.rpad(this.gutter - 1,`${cursor[0]}`)
        for (var _a_ = ci = 1, _b_ = this.gutter; (_a_ <= _b_ ? ci < this.gutter : ci > this.gutter); (_a_ <= _b_ ? ++ci : --ci))
        {
            fg = (cursor[0] ? 'status_fg' : 'column_fg')
            if (belt.isLinesPosOutside(this.state.s.lines,cursor))
            {
                fg = 'status_col_empty'
            }
            add(((ci - 1 < colno.length) ? colno[ci - 1] : ' '),fg,'status_col')
        }
        add('','status_col','gutter')
        this.crumbs.draw()
        this.statusfile.draw()
        x += this.crumbs.rounded.length
        x += this.statusfile.rounded.length
        add('','status_dark','status_empty')
        if (dty)
        {
            add('','status_dirty','status_dark')
        }
        if (dty)
        {
            add(' ','status_dirty','status_dark')
        }
        if (rdo)
        {
            add('','status_redo','status_dark')
        }
        add(' ','status_dark','status_dark')
        if (this.state.s.cursors.length > 1)
        {
            cur = `${this.state.s.cursors.length}♦`
            for (var _c_ = i = 0, _d_ = cur.length; (_c_ <= _d_ ? i < cur.length : i > cur.length); (_c_ <= _d_ ? ++i : --i))
            {
                add(cur[i],((i < cur.length - 1) ? 'status_cur' : color.darken(theme.status_cur)),'status_dark')
            }
        }
        if (this.state.s.selections.length)
        {
            sel = `${this.state.s.selections.length}≡`
            for (var _e_ = i = 0, _f_ = sel.length; (_e_ <= _f_ ? i < sel.length : i > sel.length); (_e_ <= _f_ ? ++i : --i))
            {
                add(sel[i],((i < sel.length - 1) ? 'status_sel' : color.darken(theme.status_sel)),'status_dark')
            }
        }
        if (this.state.s.highlights.length)
        {
            hil = `${this.state.s.highlights.length}❇`
            for (var _10_ = i = 0, _11_ = hil.length; (_10_ <= _11_ ? i < hil.length : i > hil.length); (_10_ <= _11_ ? ++i : --i))
            {
                add(hil[i],((i < hil.length - 1) ? 'status_hil' : color.darken(theme.status_hil)),'status_dark')
            }
        }
        for (var _12_ = ci = x, _13_ = cols; (_12_ <= _13_ ? ci < cols : ci > cols); (_12_ <= _13_ ? ++ci : --ci))
        {
            add(' ',null,'status_dark')
        }
        ci = _k_.clamp(0,3,parseInt((this.time / (1000 * 1000) - 16) / 8))
        ch = ' •'[ci]
        fg = ['#222','#000','#080','#ff0'][ci]
        if (_k_.in(ch,''))
        {
            console.log(`${ch} ${this.drawTime}`)
        }
        return set(cols - 2,ch,fg,'status_dark')
    }

    return status
})()

export default status;