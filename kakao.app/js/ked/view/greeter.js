var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var greeter

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let post = kxk.post

import theme from "../util/theme.js"
import help from "../util/help.js"

import belt from "../edit/tool/belt.js"

import editor from "../edit/editor.js"

import view from "./view.js"


greeter = (function ()
{
    _k_.extend(greeter, view)
    function greeter (screen)
    {
        this["draw"] = this["draw"].bind(this)
        this["show"] = this["show"].bind(this)
        greeter.__super__.constructor.call(this,screen,'greeter')
        this.header = help.headerCells()
        this.name = 'greeter'
        this.a = 120
    }

    greeter.prototype["show"] = function (doShow = true)
    {
        if (doShow === false)
        {
            return this.hide()
        }
    }

    greeter.prototype["layout"] = function (x, y)
    {
        var h, w

        var _a_ = belt.cellSize(this.header); w = _a_[0]; h = _a_[1]

        return this.cells.layout(x,y,w,h)
    }

    greeter.prototype["draw"] = function ()
    {
        var cell, duration, f, row, x, y

        if (this.hidden())
        {
            return
        }
        duration = 480
        this.a += 1
        if (this.a > duration)
        {
            this.a = 0
        }
        f = 0.4 + 0.6 * Math.abs(Math.sin(2 * Math.PI * this.a / duration))
        this.header = help.headerCells(f)
        var list = _k_.list(this.header)
        for (y = 0; y < list.length; y++)
        {
            row = list[y]
            var list1 = _k_.list(row)
            for (x = 0; x < list1.length; x++)
            {
                cell = list1[x]
                this.cells.set(x,y,cell.char,cell.fg,cell.bg)
            }
        }
        return post.emit('redraw')
    }

    return greeter
})()

export default greeter;