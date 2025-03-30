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
        this["hide"] = this["hide"].bind(this)
        this["drawKnob"] = this["drawKnob"].bind(this)
        this["drawImages"] = this["drawImages"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["maxLinesToLoad"] = this["maxLinesToLoad"].bind(this)
        this["scrollToPixel"] = this["scrollToPixel"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["getSyntax"] = this["getSyntax"].bind(this)
        this["getSegls"] = this["getSegls"].bind(this)
        mapscr.__super__.constructor.call(this,this.editor.screen,this.editor.state)
        this.state.on('view.changed',this.drawKnob)
        this.pointerType = 'pointer'
        this.knobId = this.imgId + 0xeeee
        this.topLine = 0
        this.botLine = 0
        this.knobHeight = 0
        this.mapWidth = 0
        this.mapHeight = 0
        this.linesInMap = 0
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
        this.calcView()
    }

    mapscr.prototype["getSegls"] = function ()
    {
        return this.state.segls
    }

    mapscr.prototype["getSyntax"] = function ()
    {
        return this.state.syntax
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

    mapscr.prototype["onResize"] = function ()
    {
        this.csz = this.cells.screen.t.cellsz
        if (_k_.empty(this.csz))
        {
            return
        }
        this.calcView()
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

    mapscr.prototype["calcView"] = function ()
    {
        var editorLinesHeight, maxOffset, viewFactor

        this.mapHeight = this.cells.rows * this.csz[1]
        this.mapWidth = this.cells.cols * this.csz[0]
        this.linesInMap = parseInt(this.mapHeight / this.pixelsPerRow)
        this.knobHeight = this.state.cells.rows * this.pixelsPerRow
        editorLinesHeight = this.state.s.lines.length * this.pixelsPerRow
        if (editorLinesHeight > this.mapHeight && this.state.s.view[1] > 0)
        {
            maxOffset = this.state.s.lines.length - this.linesInMap
            viewFactor = this.state.s.view[1] / (this.state.s.lines.length - this.cells.rows)
            this.topLine = parseInt(viewFactor * maxOffset)
        }
        else
        {
            this.topLine = 0
        }
        return this.botLine = _k_.min(this.state.s.lines.length - 1,this.topLine + this.linesInMap)
    }

    mapscr.prototype["lineOffset"] = function (y)
    {
        return (y - this.topLine) * this.pixelsPerRow
    }

    mapscr.prototype["pixelPos"] = function (pos)
    {
        return [this.cells.x * this.csz[0] + pos[0] * this.pixelsPerCol,this.cells.y * this.csz[1] + this.lineOffset(pos[1])]
    }

    mapscr.prototype["maxLinesToLoad"] = function ()
    {
        return 2000
    }

    mapscr.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        mapscr.__super__.draw.call(this)
        if (this.csz)
        {
            this.drawCursors()
            return this.drawHighlights()
        }
    }

    mapscr.prototype["drawImages"] = function ()
    {
        var id, t, y

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.hidden() || this.collapsed())
        {
            return
        }
        for (var _a_ = y = this.topLine, _b_ = this.botLine; (_a_ <= _b_ ? y <= this.botLine : y >= this.botLine); (_a_ <= _b_ ? ++y : --y))
        {
            id = this.images[y]
            t.placeLineImage(id,this.cells.x,this.cells.y,this.lineOffset(y),this.pixelsPerRow)
        }
        if (this.topLine)
        {
            t.hideImagesInRange(this.images[0],this.images[this.topLine - 1])
        }
        if (this.botLine < this.images.length)
        {
            t.hideImagesInRange(this.images[this.botLine],this.images.slice(-1)[0])
        }
        return this.drawKnob()
    }

    mapscr.prototype["drawKnob"] = function ()
    {
        var ky

        this.calcView()
        if (_k_.empty(this.csz) || this.hidden() || this.collapsed())
        {
            return
        }
        ky = this.lineOffset(this.state.s.view[1])
        return this.cells.screen.t.placeImageOverlay(this.knobId,this.cells.x,this.cells.y,ky,this.mapWidth,this.knobHeight)
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

    mapscr.prototype["drawCursors"] = function ()
    {
        var fg, idx, mw, pos, sw, sx, sy

        mw = this.cells.cols * this.csz[0]
        var list = _k_.list(this.state.s.cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            pos = list[idx]
            if (pos[0] * this.pixelsPerCol < mw)
            {
                var _b_ = this.pixelPos(pos); sx = _b_[0]; sy = _b_[1]

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
                squares.place(sx,sy,sw,this.pixelsPerRow,fg)
                if (idx === this.state.s.main)
                {
                    squares.place(this.cells.x * this.csz[0] + mw - this.pixelsPerCol * 4,sy,this.pixelsPerCol * 4,this.pixelsPerRow,fg,2002)
                }
            }
        }
    }

    mapscr.prototype["drawHighlights"] = function ()
    {
        var clr, hlw, li, mc, mw, rgtx, selw, sx, sy

        mw = this.cells.cols * this.csz[0]
        mc = this.state.mainCursor()
        rgtx = parseInt(this.cells.cols * this.csz[0] / this.pixelsPerCol)
        selw = this.pixelsPerCol * 16
        hlw = this.pixelsPerCol * 8
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
            var _b_ = this.pixelPos([rgtx,li]); sx = _b_[0]; sy = _b_[1]

            squares.place(sx - selw,sy,selw,this.pixelsPerRow,clr,2000)
        }
        var list1 = _k_.list(belt.lineIndicesForSpans(this.state.s.highlights))
        for (var _c_ = 0; _c_ < list1.length; _c_++)
        {
            li = list1[_c_]
            var _d_ = this.pixelPos([rgtx,li]); sx = _d_[0]; sy = _d_[1]

            squares.place(sx - hlw,sy,hlw,this.pixelsPerRow,this.color.highlight,2001)
        }
    }

    return mapscr
})()

export default mapscr;