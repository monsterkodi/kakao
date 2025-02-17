var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var floor, mapview, pow

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let post = kxk.post

import prof from "../util/prof.js"
import syntax from "../util/syntax.js"
import color from "../util/color.js"
import util from "../util/util.js"

import theme from "../theme.js"

import cells from "./cells.js"

floor = Math.floor
pow = Math.pow


mapview = (function ()
{
    function mapview (screen, state)
    {
        this.state = state
    
        this["createImages"] = this["createImages"].bind(this)
        this["setSyntaxLines"] = this["setSyntaxLines"].bind(this)
        this["getSyntax"] = this["getSyntax"].bind(this)
        this["getLines"] = this["getLines"].bind(this)
        this["reload"] = this["reload"].bind(this)
        this["clearImages"] = this["clearImages"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this.cells = new cells(screen)
        this.imgId = kstr.hash(this.state.name) & ~
        0xffff
        this.images = []
        lf('mapview',this.state.name,this.imgId.toString(2))
        this.pixelsPerRow = 4
        this.pixelsPerCol = 2
    }

    mapview.prototype["init"] = function (x, y, w, h)
    {
        return this.cells.init(x,y,w,h)
    }

    mapview.prototype["show"] = function (doShow = true)
    {
        if (doShow === false)
        {
            return this.hide()
        }
        return this.cells.cols = 10
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

    mapview.prototype["clearImages"] = function ()
    {
        var id

        if (!_k_.empty(this.images))
        {
            lf('clear',this.images.length)
        }
        var list = _k_.list(this.images)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            id = list[_a_]
            this.cells.screen.t.deleteImage(id)
        }
        return this.images = []
    }

    mapview.prototype["reload"] = function ()
    {
        this.clearImages()
        return this.createImages()
    }

    mapview.prototype["getLines"] = function ()
    {
        return this.lines
    }

    mapview.prototype["getSyntax"] = function ()
    {
        return this.syntax
    }

    mapview.prototype["setSyntaxLines"] = function (ext, lines)
    {
        this.lines = lines
    
        this.syntax = new syntax
        this.syntax.setExt(ext)
        this.syntax.setLines(this.lines)
        return this.createImages()
    }

    mapview.prototype["createImages"] = function ()
    {
        var bytes, data, dataForLine, line, lines, syntax, t, w, y

        t = this.cells.screen.t
        if (_k_.empty(t.cellsz))
        {
            return
        }
        this.show()
        this.clearImages()
        w = this.cells.cols * t.cellsz[0]
        bytes = w * 3
        if (bytes <= 0)
        {
            return this.clearImages()
        }
        lines = this.getLines()
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
            if (y > this.cells.rows * t.cellsz[1] / this.pixelsPerRow)
            {
                break
            }
        }
        return this.draw()
    }

    mapview.prototype["draw"] = function ()
    {
        var id, t, y

        t = this.cells.screen.t
        if (_k_.empty(t.pixels) || this.cells.rows <= 0 || this.cells.cols <= 0)
        {
            return
        }
        lf('map draw',this.images.length)
        var list = _k_.list(this.images)
        for (y = 0; y < list.length; y++)
        {
            id = list[y]
            t.placeImage(id,this.cells.x,this.cells.y,0,y * this.pixelsPerRow,this.pixelsPerCol,this.pixelsPerRow)
        }
        return this
    }

    return mapview
})()

export default mapview;