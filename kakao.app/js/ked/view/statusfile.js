var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var statusfile

import kxk from "../../kxk.js"
let slash = kxk.slash
let post = kxk.post

import color from "../util/color.js"
import theme from "../util/theme.js"

import view from "./view.js"


statusfile = (function ()
{
    _k_.extend(statusfile, view)
    function statusfile (screen, name)
    {
        this["onMouse"] = this["onMouse"].bind(this)
        this["show"] = this["show"].bind(this)
        statusfile.__super__.constructor.call(this,screen,name)
        this.rounded = ''
    }

    statusfile.prototype["layout"] = function (x, y, w, h)
    {
        statusfile.__super__.layout.call(this,x,y,w,h)
    
        return this.adjustText()
    }

    statusfile.prototype["draw"] = function ()
    {
        var bg, ch, fg, x, _40_47_

        if (this.hidden())
        {
            return
        }
        statusfile.__super__.draw.call(this)
        bg = (this.hover ? '#44a' : theme.quicky_crumbs)
        fg = ((_40_47_=theme.syntax[`${this.pars.ext} file`]) != null ? _40_47_ : theme.syntax.file)
        var list = _k_.list(this.rounded)
        for (x = 0; x < list.length; x++)
        {
            ch = list[x]
            if (_k_.in(ch,''))
            {
                this.cells.set(x,0,ch,bg,theme.status_empty)
            }
            else
            {
                if (ch === '.')
                {
                    fg = color.darken(fg)
                }
                this.cells.set(x,0,ch,fg,bg)
            }
        }
    }

    statusfile.prototype["adjustText"] = function ()
    {
        var _58_14_

        this.file = ((_58_14_=this.file) != null ? _58_14_ : '')
        this.pars = slash.parse(this.file)
        return this.rounded = '' + this.pars.name + '.' + this.pars.ext + ''
    }

    statusfile.prototype["set"] = function (file)
    {
        this.file = _k_.trim(file)
        return this.adjustText()
    }

    statusfile.prototype["show"] = function (file)
    {
        this.set(file)
        return this.cells.rows = 1
    }

    statusfile.prototype["onMouse"] = function (event)
    {
        var inside

        inside = this.cells.isInsideEvent(event)
        switch (event.type)
        {
            case 'press':
                if (inside)
                {
                    this.emit('action','click',this.file)
                    delete this.hover
                    return true
                }
                break
            case 'move':
                if (inside !== this.hover)
                {
                    this.hover = inside
                    if (this.hover)
                    {
                        post.emit('pointer','pointer')
                    }
                    return true
                }
                break
        }

        return false
    }

    return statusfile
})()

export default statusfile;