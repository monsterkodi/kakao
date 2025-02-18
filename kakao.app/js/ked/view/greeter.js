var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var greeter

import kxk from "../../kxk.js"
let kstr = kxk.kstr

import util from "../util/util.js"
import help from "../util/help.js"

import editor from "../editor.js"
import theme from "../theme.js"

import view from "./view.js"


greeter = (function ()
{
    _k_.extend(greeter, view)
    function greeter (screen)
    {
        this["show"] = this["show"].bind(this)
        greeter.__super__.constructor.call(this,screen,'greeter')
        this.header = help.headerCells()
        this.name = 'greeter'
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

        var _a_ = util.cellSize(this.header); w = _a_[0]; h = _a_[1]

        return this.cells.layout(x,y,w,h)
    }

    greeter.prototype["draw"] = function ()
    {
        var cell, row, x, y

        if (this.hidden())
        {
            return
        }
        this.show()
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
    }

    return greeter
})()

export default greeter;