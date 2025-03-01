var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var crumbs

import kxk from "../../kxk.js"
let slash = kxk.slash
let post = kxk.post

import color from "../util/color.js"
import theme from "../util/theme.js"

import view from "./view.js"


crumbs = (function ()
{
    _k_.extend(crumbs, view)
    function crumbs (screen, name)
    {
        this["onMouse"] = this["onMouse"].bind(this)
        this["show"] = this["show"].bind(this)
        crumbs.__super__.constructor.call(this,screen,name)
        this.color = {bgl:'#000',bgr:'#000'}
    }

    crumbs.prototype["layout"] = function (x, y, w, h)
    {
        crumbs.__super__.layout.call(this,x,y,w,h)
    
        return this.adjustText()
    }

    crumbs.prototype["draw"] = function ()
    {
        var bg, c, ch, colors, fg, i, si, x

        if (this.hidden())
        {
            return
        }
        c = theme.quicky_crumbs
        colors = []
        for (var _a_ = i = 0, _b_ = this.split.length; (_a_ <= _b_ ? i < this.split.length : i > this.split.length); (_a_ <= _b_ ? ++i : --i))
        {
            if (i === this.hoverIndex)
            {
                colors.push('#44a')
            }
            else
            {
                colors.push(color.darken(c,0.4 + 0.6 * (i + 1) / this.split.length))
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
                bg = (si > 0 ? colors[si - 1] : this.color.bgl)
                if (x === this.rounded.length - 1)
                {
                    bg = this.color.bgr
                }
                this.cells.set(x,0,ch,fg,bg)
            }
            else
            {
                if (si === this.hoverIndex)
                {
                    fg = theme.syntax.dir_leaf
                }
                else if (si < this.split.length - 1)
                {
                    fg = color.darken(theme.dir,_k_.min(1,(si + 3) / this.split.length))
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
        var padding, _92_14_

        if (this.hidden())
        {
            return
        }
        this.path = ((_92_14_=this.path) != null ? _92_14_ : '')
        this.split = slash.split(this.path)
        if (!(_k_.in(this.split[0],'~/')))
        {
            this.split.unshift('/')
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
        this.path = _k_.trim(path)
        return this.adjustText()
    }

    crumbs.prototype["show"] = function (path)
    {
        this.set(slash.tilde(path))
        return this.cells.rows = 1
    }

    crumbs.prototype["onMouse"] = function (event)
    {
        var col, path, row, si

        var _a_ = this.cells.posForEvent(event); col = _a_[0]; row = _a_[1]

        if (this.cells.isOutsideEvent(event))
        {
            delete this.hoverIndex
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
                    this.emit('action','click',path)
                    delete this.hoverIndex
                }
                return true

            case 'move':
                this.hoverIndex = this.splitIndexAtCol(col)
                if ((0 <= this.hoverIndex && this.hoverIndex < this.split.length))
                {
                    post.emit('pointer','pointer')
                }
                break
        }

        return false
    }

    return crumbs
})()

export default crumbs;