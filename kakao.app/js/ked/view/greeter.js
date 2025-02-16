var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var greeter

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let noon = kxk.noon

import nfs from "../../kxk/nfs.js"

import prjcts from "../util/prjcts.js"
import util from "../util/util.js"

import editor from "../editor.js"
import theme from "../theme.js"

import cells from "./cells.js"
import input from "./input.js"
import choices from "./choices.js"


greeter = (function ()
{
    function greeter (screen)
    {
        this.screen = screen
    
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onInputChanged"] = this["onInputChanged"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["show"] = this["show"].bind(this)
        this.name = 'greeter'
        this.cells = new cells(this.screen)
        this.input = new input(this.screen,'quicky_input')
        this.choices = new choices(this.screen,'quicky_choices')
        this.input.on('changed',this.onInputChanged)
    }

    greeter.prototype["show"] = function ()
    {
        this.layout()
        return this.input.grabFocus()
    }

    greeter.prototype["layout"] = function ()
    {
        var c, h, w, x, y

        x = parseInt(this.screen.cols / 4)
        y = parseInt(this.screen.rows / 4)
        w = parseInt(this.screen.cols / 2)
        h = parseInt(this.screen.rows / 2)
        c = _k_.min(h,this.choices.num())
        this.input.init(x + 2,y + 1,w - 4,1)
        this.choices.init(x + 2,y + 3,w - 3,c)
        return this.cells.init(x,y,w,c + 4)
    }

    greeter.prototype["hide"] = function ()
    {
        this.cells.rows = 0
        post.emit('focus','editor')
        post.emit('redraw')
        return true
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

    greeter.prototype["open"] = function ()
    {
        var ccol, items

        items = util.linesForText(`recent ...
open ...
session ...
help`)
        ccol = parseInt(this.screen.cols / 2) - 5
        this.input.set('')
        this.choices.set(items)
        this.choices.state.selectLine(0)
        this.choices.state.setMainCursor(this.choices.state.s.lines[0].length,0)
        this.choices.state.setView([0,0])
        return this.show()
    }

    greeter.prototype["onInputChanged"] = function (text)
    {
        this.choices.filter(text)
        this.choices.state.selectLine(0)
        this.choices.state.setMainCursor(this.choices.state.s.lines[0].length,0)
        return this.layout()
    }

    greeter.prototype["applyChoice"] = function ()
    {
        var current

        current = this.choices.current()
        lf('greeter choice',current)
        switch (current)
        {
            case 'new file':
                post.emit('file.new')
                break
        }

        return this.returnToEditor()
    }

    greeter.prototype["returnToEditor"] = function ()
    {
        this.cells.rows = 0
        post.emit('focus','editor')
        return {redraw:true}
    }

    greeter.prototype["currentChoice"] = function ()
    {
        return _k_.trim(this.choices.current())
    }

    greeter.prototype["draw"] = function ()
    {
        var bg, fg

        if (this.hidden())
        {
            return
        }
        fg = theme.quicky_frame_fg
        bg = theme.quicky_frame_bg
        this.cells.draw_frame(0,0,-1,-1,{fg:fg,bg:bg,hdiv:[2]})
        this.input.draw()
        return this.choices.draw()
    }

    greeter.prototype["moveSelection"] = function (dir)
    {
        switch (dir)
        {
            case 'down':
                this.choices.state.selectNextLine()
                break
            case 'up':
                this.choices.state.selectPrevLine()
                break
        }

        this.input.set(this.choices.state.selectedText())
        return this.input.selectAll()
    }

    greeter.prototype["onKey"] = function (key, event)
    {
        if (this.hidden())
        {
            return
        }
        switch (event.combo)
        {
            case 'esc':
                return this.hide()

            case 'return':
                return this.applyChoice()

            case 'up':
            case 'down':
                if (this.input.state.hasFocus)
                {
                    return this.moveSelection(event.combo)
                }
                break
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

    greeter.prototype["onMouse"] = function (type, sx, sy, event)
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

    greeter.prototype["onWheel"] = function (event)
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

    return greeter
})()

export default greeter;