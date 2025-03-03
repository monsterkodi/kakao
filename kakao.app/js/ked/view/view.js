var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onViewShow"] = this["onViewShow"].bind(this)
        this.cells = new cells(this.screen)
        this.color = {}
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
        return !this.visible()
    }

    view.prototype["invisible"] = function ()
    {
        return !this.visible()
    }

    view.prototype["visible"] = function ()
    {
        return this.cells.rows > 0 && this.cells.cols > 0
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
        var _59_27_

        return (this.knob != null ? this.knob.onMouse(event) : undefined)
    }

    view.prototype["onWheel"] = function (event)
    {
        console.log(`view.onWheel ${this.name}`)
    }

    view.prototype["onKey"] = function (key, event)
    {
        console.log(`view.onKey ${this.name}`)
    }

    view.prototype["layout"] = function (x, y, w, h)
    {
        return this.cells.layout(x,y,w,h)
    }

    view.prototype["draw"] = function ()
    {
        var _71_18_

        return (this.knob != null ? this.knob.draw() : undefined)
    }

    return view
})()

export default view;