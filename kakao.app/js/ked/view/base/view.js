var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}}

var view

import kxk from "../../../kxk.js"
let events = kxk.events
let post = kxk.post

import cells from "../screen/cells.js"


view = (function ()
{
    _k_.extend(view, events)
    view["popups"] = ['quicky','fsbrow','context','menu','searcher','finder']
    view["currentPopup"] = null
    function view (screen, name, features)
    {
        this.screen = screen
        this.name = name
    
        var f

        this["draw"] = this["draw"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["handleHover"] = this["handleHover"].bind(this)
        this["onMouseEnter"] = this["onMouseEnter"].bind(this)
        this["onMouseLeave"] = this["onMouseLeave"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onViewShow"] = this["onViewShow"].bind(this)
        this["onViewHide"] = this["onViewHide"].bind(this)
        this["setColor"] = this["setColor"].bind(this)
        this.cells = new cells(this.screen)
        this.color = {}
        this.feats = {}
        var list = _k_.list(features)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            f = list[_a_]
            this.feats[f] = true
        }
        this.isVisible = true
        this.focusable = false
        if (_k_.in(this.name,view.popups))
        {
            post.on('view.show',this.onViewShow)
        }
        if (_k_.in(this.name,view.popups))
        {
            post.on('view.hide',this.onViewHide)
        }
        return view.__super__.constructor.apply(this, arguments)
    }

    view.prototype["setColor"] = function (key, color)
    {
        return this.color[key] = color
    }

    view.prototype["onViewHide"] = function (viewName)
    {
        if (viewName === this.name)
        {
            console.log(`onViewHide ${viewName}`)
            post.emit('popup.hide',viewName)
        }
        if (viewName === view.currentPopup)
        {
            return view.currentPopup = null
        }
    }

    view.prototype["onViewShow"] = function (viewName)
    {
        if (viewName === this.name)
        {
            console.log(`onViewShow ${viewName}`)
            post.emit('popup.show',viewName)
        }
        if (_k_.in(viewName,view.popups))
        {
            view.currentPopup = viewName
            if (viewName !== this.name && this.visible())
            {
                return this.hide()
            }
        }
    }

    view.prototype["show"] = function ()
    {
        this.isVisible = true
        post.emit('view.show',this.name)
        this.arrange()
        return {redraw:true}
    }

    view.prototype["arrange"] = function ()
    {}

    view.prototype["hide"] = function ()
    {
        this.isVisible = false
        post.emit('view.hide',this.name)
        return {redraw:true}
    }

    view.prototype["hidden"] = function ()
    {
        return !this.visible()
    }

    view.prototype["visible"] = function ()
    {
        return this.isVisible && this.cells.rows > 0 && this.cells.cols > 0
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
        return this.handleHover(event)
    }

    view.prototype["onWheel"] = function (event)
    {
        console.log(`view.onWheel ${this.name}`)
    }

    view.prototype["onMouseLeave"] = function ()
    {
        return post.emit('redraw')
    }

    view.prototype["onMouseEnter"] = function ()
    {
        if (this.focusable && _k_.isFunc(this.grabFocus))
        {
            this.grabFocus()
        }
        if (this.pointerType)
        {
            post.emit('pointer',this.pointerType)
            return post.emit('redraw')
        }
    }

    view.prototype["handleHover"] = function (event)
    {
        var inside

        inside = !event.handled && this.cells.isInsideEvent(event)
        if (this.hover && !inside)
        {
            this.hover = false
            this.onMouseLeave()
        }
        else if (inside && !this.hover)
        {
            this.hover = true
            this.onMouseEnter()
        }
        return this.hover
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
    {}

    return view
})()

export default view;