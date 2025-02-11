var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var quicky

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post

import cells from "./cells.js"
import input from "./input.js"
import choices from "./choices.js"

import prjcts from "../util/prjcts.js"

import editor from "../editor.js"
import theme from "../theme.js"


quicky = (function ()
{
    function quicky (screen)
    {
        this.screen = screen
    
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this.name = 'quicky'
        this.cells = new cells(this.screen)
        this.input = new input(this.screen,this.name)
        this.choices = new choices(this.screen,this.name)
    }

    quicky.prototype["show"] = function ()
    {
        var c, h, w, x, y

        x = parseInt(this.screen.cols / 4)
        y = parseInt(this.screen.rows / 4)
        w = parseInt(this.screen.cols / 2)
        h = parseInt(this.screen.rows / 2)
        c = _k_.min(h,this.choices.num())
        this.input.init(x + 1,y + 1,w - 2,1)
        this.choices.init(x + 1,y + 3,w - 2,c)
        this.cells.init(x,y,w,c + 4)
        this.input.grabFocus()
        return post.emit('redraw')
    }

    quicky.prototype["hide"] = function ()
    {
        return this.cells.rows = 0
    }

    quicky.prototype["hidden"] = function ()
    {
        return this.cells.rows <= 0
    }

    quicky.prototype["open"] = function (currentFile)
    {
        lf('quicky.open',currentFile,prjcts.files(currentFile))
        this.input.set(currentFile)
        this.choices.set(prjcts.files(currentFile))
        return this.show()
    }

    quicky.prototype["draw"] = function ()
    {
        if (this.cells.rows <= 0)
        {
            return
        }
        this.cells.bg_rect(0,0,this.cells.cols,this.cells.rows,theme[this.name])
        this.input.draw()
        return this.choices.draw()
    }

    quicky.prototype["onKey"] = function (key, event)
    {
        if (this.hidden())
        {
            return
        }
        return this.input.onKey(key,event)
    }

    quicky.prototype["onMouse"] = function (type, sx, sy, event)
    {
        if (this.hidden())
        {
            return
        }
        return this.input.onMouse(type,sx,sy,event)
    }

    quicky.prototype["onWheel"] = function (event)
    {
        if (this.hidden())
        {
            return
        }
        this.input.onWheel(event)
        return true
    }

    return quicky
})()

export default quicky;