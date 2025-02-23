var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.c4=_k_.k.F256(_k_.k.c(4))

var popups, view

import events from "../../kxk/events.js"
import kstr from "../../kxk/kstr.js"
import post from "../../kxk/post.js"

import cells from "./cells.js"

import knob from "./knob.js"

popups = ['quicky','menu']

view = (function ()
{
    _k_.extend(view, events)
    function view (screen, name, features)
    {
        this.screen = screen
        this.name = name
    
        var f, feature

        this["draw"] = this["draw"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onViewShow"] = this["onViewShow"].bind(this)
        lf(`view ${_k_.c4(this.name)}`)
        this.cells = new cells(this.screen)
        this.feats = {}
        var list = _k_.list(features)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            f = list[_a_]
            this.feats[f] = true
        }
        var list1 = _k_.list(features)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            feature = list1[_b_]
            switch (feature)
            {
                case 'knob':
                    this.knob = new knob(this.cells,this.name)
                    break
            }

        }
        if (_k_.in(this.name,popups))
        {
            post.on('view.show',this.onViewShow)
        }
        return view.__super__.constructor.apply(this, arguments)
    }

    view.prototype["onViewShow"] = function (viewName)
    {
        if (viewName !== this.name && this.visible() && _k_.in(viewName,popups))
        {
            return this.hide()
        }
    }

    view.prototype["show"] = function ()
    {
        post.emit('view.show',this.name)
        this.layout()
        return {redraw:true}
    }

    view.prototype["hide"] = function ()
    {
        this.cells.rows = 0
        return {redraw:true}
    }

    view.prototype["hidden"] = function ()
    {
        return this.cells.rows <= 0
    }

    view.prototype["invisible"] = function ()
    {
        return this.cells.rows <= 0
    }

    view.prototype["visible"] = function ()
    {
        return this.cells.rows > 0
    }

    view.prototype["toggle"] = function ()
    {
        if (this.hidden())
        {
            return this.show()
        }
        else
        {
            return this.hide()
        }
    }

    view.prototype["onMouse"] = function (event)
    {
        var _65_13_

        return (this.knob != null ? this.knob.onMouse(event) : undefined)
    }

    view.prototype["layout"] = function (x, y, w, h)
    {
        return this.cells.layout(x,y,w,h)
    }

    view.prototype["draw"] = function ()
    {
        var _75_18_

        return (this.knob != null ? this.knob.draw() : undefined)
    }

    return view
})()

export default view;