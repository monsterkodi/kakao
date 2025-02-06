var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var view

import cells from "../cells.js"

import events from "../../kxk/events.js"
import kstr from "../../kxk/kstr.js"
import post from "../../kxk/post.js"


view = (function ()
{
    _k_.extend(view, events)
    function view (screen, name)
    {
        this.screen = screen
        this.name = name
    
        this["toggle"] = this["toggle"].bind(this)
        this.cells = new cells(this.screen)
        return view.__super__.constructor.apply(this, arguments)
    }

    view.prototype["toggle"] = function ()
    {
        return post.emit('view.size',this.name,this.cells.cols,((this.cells.rows ? 0 : 10)))
    }

    return view
})()

export default view;