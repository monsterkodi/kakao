var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var view

import events from "../../kxk/events.js"
import kstr from "../../kxk/kstr.js"
import post from "../../kxk/post.js"

import cells from "./cells.js"

import knob from "./knob.js"


view = (function ()
{
    _k_.extend(view, events)
    function view (screen, name, features)
    {
        var f, feature

        this.screen = screen
        this.name = name
    
        this["draw"] = this["draw"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
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
        return view.__super__.constructor.apply(this, arguments)
    }

    view.prototype["show"] = function ()
    {
        this.layout()
        return {redraw:true}
    }

    view.prototype["hide"] = function ()
    {
        this.cells.rows = 0
        return {redraw:true}
    }

    view.prototype["visible"] = function ()
    {
        return this.cells.rows > 0 && this.cells.cols > 0
    }

    view.prototype["hidden"] = function ()
    {
        return this.cells.rows <= 0 || this.cells.cols <= 0
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
        var _46_13_

        return (this.knob != null ? this.knob.onMouse(event) : undefined)
    }

    view.prototype["layout"] = function (x, y, w, h)
    {
        return this.cells.layout(x,y,w,h)
    }

    view.prototype["draw"] = function ()
    {
        var _56_18_

        return (this.knob != null ? this.knob.draw() : undefined)
    }

    return view
})()

export default view;