var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var greeter

import kxk from "../../kxk.js"
let kstr = kxk.kstr

import util from "../util/util.js"
import help from "../util/help.js"

import editor from "../editor.js"
import theme from "../theme.js"

import cells from "./cells.js"


greeter = (function ()
{
    function greeter (screen)
    {
        this.screen = screen
    
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this.header = help.headerCells()
        this.name = 'greeter'
        this.cells = new cells(this.screen)
    }

    greeter.prototype["show"] = function ()
    {
        var h, w, x, y

        var _a_ = util.cellSize(this.header); w = _a_[0]; h = _a_[1]

        y = parseInt(this.screen.rows / 4)
        x = parseInt(this.screen.cols / 2 - w / 2)
        return this.cells.init(x,y,w,h)
    }

    greeter.prototype["hide"] = function ()
    {
        return this.cells.rows = 0
    }

    greeter.prototype["hidden"] = function ()
    {
        return this.cells.rows <= 0
    }

    greeter.prototype["visible"] = function ()
    {
        return this.cells.rows > 0
    }

    greeter.prototype["toggle"] = function ()
    {
        if (this.hidden())
        {
            return this.open()
        }
        else
        {
            return this.hide()
        }
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