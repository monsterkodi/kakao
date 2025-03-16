var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var greet

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let post = kxk.post

import help from "../../util/help.js"

import theme from "../../theme/theme.js"

import belt from "../../edit/tool/belt.js"

import editor from "../../edit/editor.js"

import view from "../base/view.js"


greet = (function ()
{
    _k_.extend(greet, view)
    function greet (screen)
    {
        this["draw"] = this["draw"].bind(this)
        this["show"] = this["show"].bind(this)
        greet.__super__.constructor.call(this,screen,'greet')
        this.header = help.headerCells()
        this.name = 'greet'
        this.a = 120
        this.cells.rows = 0
    }

    greet.prototype["hide"] = function ()
    {
        post.emit('greet.hide')
        return greet.__super__.hide.call(this)
    }

    greet.prototype["show"] = function ()
    {
        post.emit('greet.show')
        return greet.__super__.show.call(this)
    }

    greet.prototype["layout"] = function (x, y)
    {
        var h, w

        var _a_ = belt.cellSize(this.header); w = _a_[0]; h = _a_[1]

        return this.cells.layout(x,y,w,h)
    }

    greet.prototype["draw"] = function ()
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

    return greet
})()

export default greet;