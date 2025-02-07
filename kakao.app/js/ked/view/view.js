var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var view

import events from "../../kxk/events.js"
import kstr from "../../kxk/kstr.js"
import post from "../../kxk/post.js"

import cells from "../cells.js"

import knob from "./knob.js"


view = (function ()
{
    _k_.extend(view, events)
    function view (screen, name, features)
    {
        var feature

        this.screen = screen
        this.name = name
    
        this["toggle"] = this["toggle"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this.cells = new cells(this.screen)
        var list = _k_.list(features)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            feature = list[_a_]
            switch (feature)
            {
                case 'knob':
                    this.knob = new knob(this.cells,this.name)
                    break
            }

        }
        return view.__super__.constructor.apply(this, arguments)
    }

    view.prototype["onMouse"] = function (type, sx, sy, event)
    {
        var _31_13_

        return (this.knob != null ? this.knob.onMouse(type,sx,sy,event) : undefined)
    }

    view.prototype["draw"] = function ()
    {
        var _35_13_

        return (this.knob != null ? this.knob.draw() : undefined)
    }

    view.prototype["toggle"] = function ()
    {
        return post.emit('view.size',this.name,this.cells.cols,((this.cells.rows ? 0 : 10)))
    }

    return view
})()

export default view;