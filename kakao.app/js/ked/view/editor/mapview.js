var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var floor, mapview, pow

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let post = kxk.post

import prof from "../../util/prof.js"
import syntax from "../../util/syntax.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"

floor = Math.floor
pow = Math.pow


mapview = (function ()
{
    _k_.extend(mapview, view)
    function mapview (screen, state)
    {
        this.state = state
    
        this["drawImages"] = this["drawImages"].bind(this)
        this["createImages"] = this["createImages"].bind(this)
        this["setSyntaxSegls"] = this["setSyntaxSegls"].bind(this)
        this["getSyntax"] = this["getSyntax"].bind(this)
        this["getSegls"] = this["getSegls"].bind(this)
        this["clearImages"] = this["clearImages"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        mapview.__super__.constructor.call(this,screen,this.state.owner() + '.mapview')
        this.imgId = kstr.hash(this.state.name) & ~
        0xffff
        this.rowOffset = 0
        this.images = []
        this.pixelsPerRow = 4
        this.pixelsPerCol = 2
    }

    mapview.prototype["show"] = function (doShow = true)
    {
        if (doShow === false)
        {
            return this.hide()
        }
        return this.cells.cols = 11
    }

    mapview.prototype["hide"] = function ()
    {
        this.clearImages()
        return this.cells.cols = 0
    }

    mapview.prototype["hidden"] = function ()
    {
        return this.cells.cols <= 0
    }

    mapview.prototype["visible"] = function ()
    {
        return this.cells.cols > 0
    }

    mapview.prototype["reload"] = function ()
    {
        this.createImages()
        return this.drawImages()
    }

    mapview.prototype["clearImages"] = function ()
    {
        var id

        if (_k_.empty(this.images))
        {
            return
        }
        var list = _k_.list(this.images)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            id = list[_a_]
            this.cells.screen.t.deleteImage(id)
        }
        return this.images = []
    }

    mapview.prototype["layout"] = function (x, y, w, h)
    {
        var resized

        resized = x !== this.cells.x || y !== this.cells.y || w !== this.cells.cols || h !== this.cells.rows
        mapview.__super__.layout.call(this,x,y,w,h)
        if (this.hidden())
        {
            return
        }
        if (this.redraw || resized)
        {
            if (this.redraw)
            {
                this.createImages()
            }
            delete this.redraw
            return this.drawImages()
        }
    }

    mapview.prototype["getSegls"] = function ()
    {
        return this.segls
    }

    mapview.prototype["getSyntax"] = function ()
    {
        return this.syntax
    }

    mapview.prototype["setSyntaxSegls"] = function (ext, segls)
    {
        this.segls = segls
    
        this.syntax = new syntax
        this.syntax.setExt(ext)
        this.syntax.setSegls(this.segls)
        return this.redraw = true
    }

    mapview.prototype["createImages"] = function ()
    {
        var bytes, data, dataForLine, line, lines, syntax, t, w, y

        t = this.cells.screen.t
        if (_k_.empty(t.cellsz))
        {
            return
        }
        this.clearImages()
        w = this.cells.cols * t.cellsz[0]
        bytes = w * 3
        if (bytes <= 0)
        {
            return
        }
        lines = this.getSegls()
        syntax = this.getSyntax()
        data = Buffer.alloc(bytes)
        dataForLine = (function (line)
        {
            var b, ch, clss, f, g, r, rgb, x, xr

            data.fill(0)
            for (var _a_ = x = 0, _b_ = line.length; (_a_ <= _b_ ? x < line.length : x > line.length); (_a_ <= _b_ ? ++x : --x))
            {
                if (x * this.pixelsPerCol > w)
                {
                    break
                }
                ch = line[x]
                if (!_k_.empty(ch) && ch !== ' ')
                {
                    clss = syntax.getClass(x,y)
                    if (_k_.in('header',clss))
                    {
                        if (_k_.in('triple',clss))
                        {
                            rgb = [27,207,14]
                        }
                        else
                        {
                            rgb = [9,140,0]
                        }
                    }
                    else
                    {
                        f = 0.7
                        rgb = color.rgb(syntax.getColor(x,y))
                        rgb = rgb.map(function (v)
                        {
                            return _k_.clamp(0,255,parseInt(f * v))
                        })
                    }
                    var _c_ = rgb; r = _c_[0]; g = _c_[1]; b = _c_[2]

                    for (var _d_ = xr = 0, _e_ = this.pixelsPerCol; (_d_ <= _e_ ? xr <= this.pixelsPerCol : xr >= this.pixelsPerCol); (_d_ <= _e_ ? ++xr : --xr))
                    {
                        data[(x * this.pixelsPerCol + xr) * 3 + 0] = r
                        data[(x * this.pixelsPerCol + xr) * 3 + 1] = g
                        data[(x * this.pixelsPerCol + xr) * 3 + 2] = b
                    }
                }
            }
        }).bind(this)
        var list = _k_.list(lines)
        for (y = 0; y < list.length; y++)
        {
            line = list[y]
            dataForLine(line)
            this.images.push(this.imgId + y)
            t.sendImageData(data,this.imgId + y,w,1)
            if (y > (this.cells.rows - this.rowOffset) * t.cellsz[1] / this.pixelsPerRow)
            {
                break
            }
        }
    }

    mapview.prototype["drawImages"] = function ()
    {
        var id, t, y

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.hidden())
        {
            return
        }
        var list = _k_.list(this.images)
        for (y = 0; y < list.length; y++)
        {
            id = list[y]
            t.placeImage(id,this.cells.x,this.cells.y + this.rowOffset,0,y * this.pixelsPerRow,this.pixelsPerCol,this.pixelsPerRow)
        }
        return this
    }

    mapview.prototype["draw"] = function ()
    {
        return this.cells.fill_rect(0,0,this.cells.cols - 1,this.cells.rows - 1,' ',null,'#000')
    }

    return mapview
})()

export default mapview;