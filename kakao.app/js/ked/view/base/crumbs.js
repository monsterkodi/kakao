var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var crumbs

import kxk from "../../../kxk.js"
let slash = kxk.slash
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "./view.js"


crumbs = (function ()
{
    _k_.extend(crumbs, view)
    function crumbs (screen, name)
    {
        this["onMouse"] = this["onMouse"].bind(this)
        this["show"] = this["show"].bind(this)
        crumbs.__super__.constructor.call(this,screen,name)
        this.pointerType = 'pointer'
        this.rounded = ''
        this.setColor('bg',theme.crumbs.bg)
        this.setColor('fg',theme.crumbs.fg)
        this.setColor('empty_left','#000')
        this.setColor('empty_right','#000')
    }

    crumbs.prototype["setColor"] = function (key, color)
    {
        switch (key)
        {
            case 'empty':
                this.setColor('empty_left',color)
                this.setColor('empty_right',color)
                return

        }

        return crumbs.__super__.setColor.call(this,key,color)
    }

    crumbs.prototype["layout"] = function (x, y, w, h)
    {
        crumbs.__super__.layout.call(this,x,y,w,h)
    
        return this.adjustText()
    }

    crumbs.prototype["draw"] = function ()
    {
        var bg, ch, colors, fg, i, si, x

        if (this.hidden())
        {
            return
        }
        if (_k_.empty(this.rounded))
        {
            return
        }
        colors = []
        for (var _a_ = i = 0, _b_ = this.split.length; (_a_ <= _b_ ? i < this.split.length : i > this.split.length); (_a_ <= _b_ ? ++i : --i))
        {
            if (i === this.hoverIndex)
            {
                colors.push(color.values('#44a'))
            }
            else
            {
                colors.push(color.darken(this.color.bg,0.4 + 0.6 * (i + 1) / this.split.length))
            }
        }
        for (var _c_ = x = 0, _d_ = this.rounded.length; (_c_ <= _d_ ? x < this.rounded.length : x > this.rounded.length); (_c_ <= _d_ ? ++x : --x))
        {
            si = this.splitIndexAtCol(x)
            bg = colors[si]
            ch = this.rounded[x]
            if (_k_.in(ch,''))
            {
                fg = bg
                bg = (si > 0 ? colors[si - 1] : this.color.empty_left)
                if (x === this.rounded.length - 1)
                {
                    bg = this.color.empty_right
                }
                this.cells.set(x,0,ch,fg,bg)
            }
            else
            {
                if (si === this.hoverIndex)
                {
                    fg = color.adjustForBackground(this.color.fg,bg)
                }
                else if (si < this.split.length - 1)
                {
                    fg = color.darken(this.color.fg,_k_.min(1,(si + 3) / this.split.length))
                }
                else
                {
                    fg = theme.syntax.dir_leaf
                }
                this.cells.set(x,0,ch,fg,bg)
            }
        }
    }

    crumbs.prototype["splitIndexAtCol"] = function (col)
    {
        var si, sl

        sl = 0
        for (var _a_ = si = 0, _b_ = this.split.length; (_a_ <= _b_ ? si < this.split.length : si > this.split.length); (_a_ <= _b_ ? ++si : --si))
        {
            sl += this.split[si].length + 2
            if (sl > col)
            {
                return si
            }
        }
        return this.split.length - 1
    }

    crumbs.prototype["adjustText"] = function ()
    {
        var padding, _110_14_

        if (this.hidden())
        {
            return
        }
        this.path = ((_110_14_=this.path) != null ? _110_14_ : '')
        if (this.path === '')
        {
            this.rounded = ''
            return
        }
        this.split = slash.split(this.path)
        if (!this.dotlessRelative)
        {
            if (!(_k_.in(this.split[0],'~/.')))
            {
                this.split.unshift('/')
            }
        }
        this.root = []
        this.rounded = this.split.join(' ')
        while (this.split.length > 1 && this.rounded.length > this.cells.cols - 2)
        {
            this.root.push(this.split.shift())
            this.rounded = this.split.join(' ')
        }
        this.root = this.root.join('/')
        padding = (this.padLast ? _k_.lpad(this.cells.cols - 2 - this.rounded.length) : '')
        return this.rounded = '' + this.rounded + padding + ''
    }

    crumbs.prototype["set"] = function (path)
    {
        this.cells.rows = 1
        this.path = _k_.trim(path)
        return this.adjustText()
    }

    crumbs.prototype["show"] = function (path)
    {
        return this.set(slash.tilde(path))
    }

    crumbs.prototype["visible"] = function ()
    {
        return this.cells.rows > 0
    }

    crumbs.prototype["onMouse"] = function (event)
    {
        var col, index, path, row, si, _157_26_

        var _a_ = this.cells.posForEvent(event); col = _a_[0]; row = _a_[1]

        crumbs.__super__.onMouse.call(this,event)
        if (!this.hover)
        {
            if ((this.hoverIndex != null))
            {
                delete this.hoverIndex
                return true
            }
            return
        }
        switch (event.type)
        {
            case 'press':
                si = this.splitIndexAtCol(col)
                if ((0 <= this.hoverIndex && this.hoverIndex < this.split.length))
                {
                    path = slash.path.apply(null,this.split.slice(0, typeof si === 'number' ? si+1 : Infinity))
                    path = slash.path(this.root,path)
                    if (!(_k_.in(path[0],'~/')))
                    {
                        path = '/' + path
                    }
                    this.emit('action','click',path,event)
                    delete this.hoverIndex
                }
                return {redraw:true}

            case 'move':
                index = this.splitIndexAtCol(col)
                if (this.hoverIndex !== index)
                {
                    this.hoverIndex = index
                    return {redraw:true}
                }
                break
        }

        return this.hover
    }

    return crumbs
})()

export default crumbs;