var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var bubble

import kxk from "../../../kxk.js"
let slash = kxk.slash

import theme from "../../theme/theme.js"

import syntax from "../../util/syntax.js"

import view from "../base/view.js"


bubble = (function ()
{
    _k_.extend(bubble, view)
    function bubble (screen, name)
    {
        this["onMouse"] = this["onMouse"].bind(this)
        this["show"] = this["show"].bind(this)
        bubble.__super__.constructor.call(this,screen,name)
        this.pointerType = 'pointer'
        this.syntax = new syntax
        this.syntax.setExt('noon')
        this.rounded = ''
        this.color = {bg:'#222',hover:'#44a',empty:'#000'}
    }

    bubble.prototype["layout"] = function (x, y, w, h)
    {
        bubble.__super__.layout.call(this,x,y,w,h)
    
        return this.adjustText()
    }

    bubble.prototype["draw"] = function ()
    {
        var bg, ch, fg, x

        if (this.hidden())
        {
            return
        }
        bubble.__super__.draw.call(this)
        bg = (this.hover ? this.color.hover : this.color.bg)
        var list = _k_.list(this.rounded)
        for (x = 0; x < list.length; x++)
        {
            ch = list[x]
            if (_k_.in(ch,''))
            {
                this.cells.set(x,0,ch,bg,this.color.empty)
            }
            else
            {
                fg = this.syntax.getColor(x,0)
                this.cells.set(x,0,ch,fg,bg)
                if (this.hover)
                {
                    this.cells.adjustContrastForHighlight(x,0,bg)
                }
            }
        }
    }

    bubble.prototype["adjustText"] = function ()
    {
        var _69_14_

        this.file = ((_69_14_=this.file) != null ? _69_14_ : '')
        this.pars = slash.parse(this.file)
        this.syntax.setLines(['/' + this.pars.file])
        return this.rounded = '' + this.pars.file + ''
    }

    bubble.prototype["set"] = function (file)
    {
        this.file = _k_.trim(file)
        return this.adjustText()
    }

    bubble.prototype["show"] = function (file)
    {
        this.set(file)
        return this.cells.rows = 1
    }

    bubble.prototype["onMouse"] = function (event)
    {
        bubble.__super__.onMouse.call(this,event)
    
        switch (event.type)
        {
            case 'press':
                if (this.hover)
                {
                    this.emit('action','click',this.file)
                    return {redraw:true}
                }
                break
        }

        return this.hover
    }

    return bubble
})()

export default bubble;