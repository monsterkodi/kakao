var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var mapscr

import kxk from "../../../kxk.js"
let post = kxk.post

import theme from "../../theme/theme.js"

import squares from "../../util/img/squares.js"

import belt from "../../edit/tool/belt.js"

import mapview from "./mapview.js"


mapscr = (function ()
{
    _k_.extend(mapscr, mapview)
    function mapscr (editor)
    {
        this.editor = editor
    
        this["drawHighlights"] = this["drawHighlights"].bind(this)
        this["drawCursors"] = this["drawCursors"].bind(this)
        this["drawKnob"] = this["drawKnob"].bind(this)
        this["drawImages"] = this["drawImages"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["scrollToPixel"] = this["scrollToPixel"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["getSyntax"] = this["getSyntax"].bind(this)
        this["getSegls"] = this["getSegls"].bind(this)
        mapscr.__super__.constructor.call(this,this.editor.screen,this.editor.state)
        this.state.on('view.changed',this.drawKnob)
        this.pointerType = 'pointer'
        this.knobId = this.imgId + 0xeeee
        this.setColor('bg',theme.editor.mapscr)
        this.setColor('highlight',theme.highlight.map)
        this.setColor('selection',theme.selection.map)
        this.setColor('fullysel',theme.selection.mapfully)
        this.screen.t.on('preResize',this.clearImages)
        post.on('popup.show',(function (name)
        {
            if (_k_.in(name,['searcher','finder','differ']))
            {
                return this.hide()
            }
        }).bind(this))
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

    mapscr.prototype["hide"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.cells.screen.t.hideImageOverlay(this.knobId)
        return mapscr.__super__.hide.call(this)
    }

    mapscr.prototype["draw"] = function ()
    {
        var csz

        if (this.hidden() || this.collapsed())
        {
            return
        }
        mapscr.__super__.draw.call(this)
        if (csz = this.cells.screen.t.cellsz)
        {
            this.drawCursors(csz)
            return this.drawHighlights(csz)
        }
    }

    mapscr.prototype["drawImages"] = function ()
    {
        if (_k_.empty(this.cells.screen.t.pixels) || this.hidden() || this.collapsed())
        {
            return
        }
        mapscr.__super__.drawImages.call(this)
        return this.drawKnob()
    }

    mapscr.prototype["drawKnob"] = function ()
    {
        var h, t, w, y, yc, yr

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.hidden() || this.collapsed())
        {
            return
        }
        y = this.pixelsPerRow * this.state.s.view[1] / t.cellsz[1]
        yc = parseInt(y)
        yr = parseInt((y - yc) * t.cellsz[1])
        h = parseInt(this.state.cells.rows * this.pixelsPerRow)
        w = this.cells.cols * t.cellsz[0]
        return t.placeImageOverlay(this.knobId,this.cells.x,this.cells.y + yc,0,yr,w,h)
    }

    mapscr.prototype["drawCursors"] = function (csz)
    {
        var fg, idx, mw, pos, sw, sx, sy

        mw = this.cells.cols * csz[0]
        var list = _k_.list(this.state.s.cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            pos = list[idx]
            if (pos[0] * this.pixelsPerCol < mw)
            {
                sx = this.cells.x * csz[0] + pos[0] * this.pixelsPerCol
                if (idx === this.state.s.main)
                {
                    fg = theme.cursor.main
                    sw = this.pixelsPerCol * 2
                    sx -= parseInt(this.pixelsPerCol / 2)
                }
                else
                {
                    fg = theme.cursor.multi
                    sw = this.pixelsPerCol
                }
                sy = this.cells.y * csz[1] + pos[1] * this.pixelsPerRow
                squares.place(sx,sy,sw,this.pixelsPerRow,fg)
                if (idx === this.state.s.main)
                {
                    squares.place(this.cells.x * csz[0] + mw - this.pixelsPerCol * 4,sy,this.pixelsPerCol * 4,this.pixelsPerRow,fg,2002)
                }
            }
        }
    }

    mapscr.prototype["drawHighlights"] = function (csz)
    {
        var clr, li, mc, mw, ppc, ppr, sy

        mw = this.cells.cols * csz[0]
        mc = this.state.mainCursor()
        ppr = this.pixelsPerRow
        ppc = this.pixelsPerCol
        var list = _k_.list(belt.lineIndicesForRanges(this.state.s.selections))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            li = list[_a_]
            if (this.state.isSpanSelectedLine(li))
            {
                clr = this.color.selection
            }
            else
            {
                clr = this.color.fullysel
            }
            sy = this.cells.y * csz[1] + li * ppr
            squares.place(this.cells.x * csz[0] + mw - ppc * 16,sy,ppc * 16,ppr,clr,2000)
        }
        var list1 = _k_.list(belt.lineIndicesForSpans(this.state.s.highlights))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            li = list1[_b_]
            sy = this.cells.y * csz[1] + li * ppr
            squares.place(this.cells.x * csz[0] + mw - ppc * 8,sy,ppc * 8,ppr,this.color.highlight,2001)
        }
    }

    return mapscr
})()

export default mapscr;