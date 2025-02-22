var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var floor, mapscr, pow

import kxk from "../../kxk.js"
let post = kxk.post

import mapview from "./mapview.js"

floor = Math.floor
pow = Math.pow


mapscr = (function ()
{
    _k_.extend(mapscr, mapview)
    function mapscr (screen, state)
    {
        this["createImages"] = this["createImages"].bind(this)
        this["clearImages"] = this["clearImages"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["scrollToPixel"] = this["scrollToPixel"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["getSyntax"] = this["getSyntax"].bind(this)
        this["getSegls"] = this["getSegls"].bind(this)
        mapscr.__super__.constructor.call(this,screen,state)
        screen.t.on('preResize',this.clearImages)
        post.on('greet',this.clearImages)
    }

    mapscr.prototype["getSegls"] = function ()
    {
        return this.state.segls
    }

    mapscr.prototype["getSyntax"] = function ()
    {
        return this.state.syntax
    }

    mapscr.prototype["onResize"] = function ()
    {
        if (_k_.empty(this.cells.screen.t.pixels))
        {
            return
        }
        return this.redraw = true
    }

    mapscr.prototype["scrollToPixel"] = function (pixel)
    {
        var maxY, view

        view = this.state.s.view.asMutable()
        view[1] = parseInt((pixel[1] - this.cells.y * this.cells.screen.t.cellsz[1]) / this.pixelsPerRow)
        view[1] -= 6
        maxY = this.state.s.lines.length - this.cells.rows
        if (maxY > 0)
        {
            view[1] = _k_.min(maxY,view[1])
        }
        view[1] = _k_.max(0,view[1])
        this.state.setView(view)
        return true
    }

    mapscr.prototype["onMouse"] = function (event)
    {
        var col, row, sx, sy

        var _a_ = event.cell; sx = _a_[0]; sy = _a_[1]

        var _b_ = this.cells.posForEvent(event); col = _b_[0]; row = _b_[1]

        switch (event.type)
        {
            case 'press':
                if (this.cells.isInsideScreen(sx,sy))
                {
                    this.doDrag = true
                    post.emit('pointer','grabbing')
                    return this.scrollToPixel(event.pixel)
                }
                break
            case 'drag':
                if (this.doDrag)
                {
                    post.emit('pointer','grab')
                    return this.scrollToPixel(event.pixel)
                }
                break
            case 'release':
                if (this.doDrag)
                {
                    delete this.doDrag
                    this.hover = this.cells.isInsideScreen(sx,sy)
                    if (this.hover)
                    {
                        post.emit('pointer','pointer')
                    }
                    return true
                }
                break
            case 'move':
                this.hover = this.cells.isInsideScreen(sx,sy)
                if (this.hover)
                {
                    post.emit('pointer','pointer')
                }
                break
        }

        return false
    }

    mapscr.prototype["clearImages"] = function ()
    {
        return mapscr.__super__.clearImages.call(this)
    }

    mapscr.prototype["createImages"] = function ()
    {
        var t

        t = this.cells.screen.t
        if (_k_.empty(t.cellsz))
        {
            return
        }
        return mapscr.__super__.createImages.call(this)
    }

    mapscr.prototype["drawImages"] = function ()
    {
        var t

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.cells.rows <= 0 || this.cells.cols <= 0)
        {
            return
        }
        return mapscr.__super__.drawImages.call(this)
    }

    return mapscr
})()

export default mapscr;