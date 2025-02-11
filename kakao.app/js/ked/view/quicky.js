var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

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
        this.input = new input(this.screen,'quicky_input')
        this.choices = new choices(this.screen,'quicky_choices')
    }

    quicky.prototype["show"] = function ()
    {
        var c, h, w, x, y

        x = parseInt(this.screen.cols / 4)
        y = parseInt(this.screen.rows / 4)
        w = parseInt(this.screen.cols / 2)
        h = parseInt(this.screen.rows / 2)
        c = _k_.min(h,this.choices.num())
        this.input.init(x + 2,y + 1,w - 4,1)
        this.choices.init(x + 2,y + 3,w - 4,c)
        this.cells.init(x,y,w,c + 4)
        this.input.grabFocus()
        return post.emit('redraw')
    }

    quicky.prototype["hide"] = function ()
    {
        this.cells.rows = 0
        post.emit('focus','editor')
        post.emit('redraw')
        return true
    }

    quicky.prototype["hidden"] = function ()
    {
        return this.cells.rows <= 0
    }

    quicky.prototype["toggle"] = function (currentFile)
    {
        if (this.hidden())
        {
            return this.open(currentFile)
        }
        else
        {
            return this.hide()
        }
    }

    quicky.prototype["open"] = function (currentFile)
    {
        this.input.set('')
        this.choices.set(prjcts.files(currentFile))
        return this.show()
    }

    quicky.prototype["draw"] = function ()
    {
        var fb, ff

        if (this.hidden())
        {
            return
        }
        ff = theme.quicky_frame_fg
        fb = theme.quicky_frame_bg
        this.cells.fill_rect(1,1,-2,-2,' ',null,fb)
        this.cells.fill_rect(1,0,-2,0,'━',ff,fb)
        this.cells.fill_rect(0,1,0,-2,'┃',ff,fb)
        this.cells.fill_rect(-1,1,-1,-2,'┃',ff,fb)
        this.cells.fill_rect(1,2,-2,2,'━',ff,fb)
        this.cells.fill_rect(1,-1,-2,-1,'━',ff,fb)
        this.cells.set(0,0,'┏',ff,fb)
        this.cells.set(-1,0,'┓',ff,fb)
        this.cells.set(0,2,'┣',ff,fb)
        this.cells.set(-1,2,'┫',ff,fb)
        this.cells.set(0,-1,'┗',ff,fb)
        this.cells.set(-1,-1,'┛',ff,fb)
        this.input.draw()
        return this.choices.draw()
    }

    quicky.prototype["onKey"] = function (key, event)
    {
        if (this.hidden())
        {
            return
        }
        switch (event.combo)
        {
            case 'esc':
                if (_k_.empty(this.input.state.s.selections))
                {
                    return this.hide()
                }
                break
            case 'return':
                return this.hide()

        }

        if (this.input.onKey(key,event))
        {
            return true
        }
        if (this.choices.onKey(key,event))
        {
            return true
        }
        return true
    }

    quicky.prototype["onMouse"] = function (type, sx, sy, event)
    {
        if (this.hidden())
        {
            return
        }
        if (this.input.onMouse(type,sx,sy,event))
        {
            return true
        }
        if (this.choices.onMouse(type,sx,sy,event))
        {
            return true
        }
        return true
    }

    quicky.prototype["onWheel"] = function (event)
    {
        if (this.hidden())
        {
            return
        }
        if (this.input.onWheel(event))
        {
            return true
        }
        if (this.choices.onWheel(event))
        {
            return true
        }
        return true
    }

    return quicky
})()

export default quicky;