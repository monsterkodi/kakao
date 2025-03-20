var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var floor, mapscr, pow

import kxk from "../../../kxk.js"
let post = kxk.post

import theme from "../../theme/theme.js"

import mapview from "./mapview.js"

floor = Math.floor
pow = Math.pow


mapscr = (function ()
{
    _k_.extend(mapscr, mapview)
    function mapscr (screen, state)
    {
        this["drawKnob"] = this["drawKnob"].bind(this)
        this["drawImages"] = this["drawImages"].bind(this)
        this["createImages"] = this["createImages"].bind(this)
        this["clearImages"] = this["clearImages"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["scrollToPixel"] = this["scrollToPixel"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["getSyntax"] = this["getSyntax"].bind(this)
        this["getSegls"] = this["getSegls"].bind(this)
        mapscr.__super__.constructor.call(this,screen,state)
        this.state.on('view.changed',this.drawKnob)
        this.pointerType = 'pointer'
        this.setColor('bg',theme.mapscr)
        screen.t.on('preResize',this.clearImages)
        post.on('popup.show',this.hide)
        post.on('greet.show',this.hide)
        post.on('popup.hide',this.show)
        post.on('greet.hide',this.show)
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
        if (_k_.eql(view, this.state.s.view))
        {
            return
        }
        this.state.setView(view)
        this.drawKnob()
        return {redraw:true}
    }

    mapscr.prototype["onMouse"] = function (event)
    {
        mapscr.__super__.onMouse.call(this,event)
    
        switch (event.type)
        {
            case 'press':
                if (this.hover)
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
                this.hover = false
                break
            case 'release':
                if (this.doDrag)
                {
                    delete this.doDrag
                    if (this.hover)
                    {
                        post.emit('pointer','pointer')
                    }
                    return true
                }
                break
        }

        return this.hover
    }

    mapscr.prototype["clearImages"] = function ()
    {
        if (this.knobId)
        {
            this.cells.screen.t.deleteImage(this.knobId)
        }
        delete this.knobId
        return mapscr.__super__.clearImages.call(this)
    }

    mapscr.prototype["createImages"] = function ()
    {
        var bpp, data, h, i, t, w

        t = this.cells.screen.t
        if (_k_.empty(t.cellsz))
        {
            return
        }
        mapscr.__super__.createImages.call(this)
        w = t.cellsz[0]
        h = t.cellsz[1]
        bpp = 4
        data = Buffer.alloc(w * h * bpp)
        for (var _a_ = i = 0, _b_ = w * h; (_a_ <= _b_ ? i < w * h : i > w * h); (_a_ <= _b_ ? ++i : --i))
        {
            data[i * bpp + 0] = 160
            data[i * bpp + 1] = 160
            data[i * bpp + 2] = 160
            data[i * bpp + 3] = 1
        }
        this.knobId = this.imgId + 0xeeee
        return t.sendImageData(data,this.knobId,w,h,bpp)
    }

    mapscr.prototype["drawImages"] = function ()
    {
        var t

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.cells.rows <= 0 || this.cells.cols <= 0)
        {
            return
        }
        mapscr.__super__.drawImages.call(this)
        return this.drawKnob()
    }

    mapscr.prototype["drawKnob"] = function ()
    {
        var h, t, y, yc, yr

        t = this.cells.screen.t
        if (_k_.empty(t.pixels))
        {
            return
        }
        y = this.pixelsPerRow * this.state.s.view[1] / t.cellsz[1]
        yc = parseInt(y)
        yr = parseInt((y - yc) * t.cellsz[1])
        h = parseInt(Math.ceil(this.state.cells.rows * this.pixelsPerRow / t.cellsz[1]))
        return t.placeImageStretched(this.knobId,this.cells.x,this.cells.y + yc,0,yr,12,h)
    }

    return mapscr
})()

export default mapscr;