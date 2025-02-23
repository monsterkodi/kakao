var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var floor, pow, scroll

import kxk from "../../kxk.js"
let post = kxk.post

import theme from "../theme.js"

import view from "./view.js"

floor = Math.floor
pow = Math.pow


scroll = (function ()
{
    _k_.extend(scroll, view)
    function scroll (screen, state)
    {
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
        this["scrollTo"] = this["scrollTo"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        scroll.__super__.constructor.call(this,screen,this.state.owner() + '.scroll')
        this.handle = (this.name === 'editor.scroll' ? '▌' : '┃')
    }

    scroll.prototype["onMouse"] = function (event)
    {
        var col, row

        var _a_ = this.cells.posForEvent(event); col = _a_[0]; row = _a_[1]

        this.hover = this.cells.isInsideEvent(event)
        switch (event.type)
        {
            case 'press':
                if (this.hover)
                {
                    this.doDrag = true
                    post.emit('pointer','grabbing')
                    return this.scrollTo(row)
                }
                break
            case 'drag':
                if (this.doDrag)
                {
                    this.hover = true
                    post.emit('pointer','grab')
                    return this.scrollTo(row)
                }
                else
                {
                    this.hover = false
                }
                break
            case 'release':
                if (this.doDrag)
                {
                    post.emit('pointer','pointer')
                    delete this.doDrag
                    return true
                }
                break
            case 'move':
                if (this.hover)
                {
                    post.emit('pointer','pointer')
                }
                break
        }

        return false
    }

    scroll.prototype["scrollTo"] = function (row)
    {
        var maxY, view

        view = this.state.s.view.asMutable()
        view[1] = parseInt(floor(row * (this.state.s.lines.length - this.cells.rows + 1) / (this.cells.rows - 1)))
        maxY = this.state.s.lines.length - this.cells.rows
        if (maxY > 0)
        {
            view[1] = _k_.min(maxY,view[1])
        }
        view[1] = _k_.max(0,view[1])
        this.state.setView(view)
        return true
    }

    scroll.prototype["draw"] = function ()
    {
        var bg, ch, fg, kh, kp, lnum, nc, ne, ns, row, rows

        rows = this.cells.rows
        lnum = this.state.s.lines.length
        kh = parseInt(floor(pow((rows),2) / lnum))
        kp = parseInt(floor((rows - kh - 1) * this.state.s.view[1] / (lnum - rows)))
        nc = parseInt(floor((rows - 1) * this.state.s.view[1] / (lnum - rows)))
        ns = kp
        ne = kp + kh
        for (var _a_ = row = 0, _b_ = rows; (_a_ <= _b_ ? row < rows : row > rows); (_a_ <= _b_ ? ++row : --row))
        {
            ch = ' '
            bg = theme.gutter
            if (lnum <= rows)
            {
                bg = theme.scroll_empty
            }
            else if (row === nc)
            {
                ch = this.handle
                fg = (this.hover ? theme.scroll_doth : theme.scroll_dot)
            }
            else if ((ns <= row && row <= ne))
            {
                ch = this.handle
                fg = (this.hover ? theme.scroll_knob : theme.scroll)
            }
            this.cells.set(0,row,ch,fg,bg)
        }
    }

    return scroll
})()

export default scroll;