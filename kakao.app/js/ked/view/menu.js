var _k_ = {trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var menu

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let noon = kxk.noon

import prjcts from "../util/prjcts.js"
import util from "../util/util.js"

import editor from "../editor.js"
import theme from "../theme.js"

import cells from "./cells.js"
import input from "./input.js"
import choices from "./choices.js"
import greeter from "./greeter.js"


menu = (function ()
{
    function menu (screen)
    {
        this.screen = screen
    
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onInputChanged"] = this["onInputChanged"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this.name = 'menu'
        this.cells = new cells(this.screen)
        this.greeter = new greeter(this.screen)
        this.input = new input(this.screen,'quicky_input')
        this.choices = new choices(this.screen,'quicky_choices')
        this.input.on('changed',this.onInputChanged)
    }

    menu.prototype["show"] = function ()
    {
        this.greeter.show(this.greet)
        this.layout()
        return this.input.grabFocus()
    }

    menu.prototype["hide"] = function ()
    {
        this.cells.rows = 0
        delete this.greet
        post.emit('focus','editor')
        post.emit('redraw')
        return true
    }

    menu.prototype["hidden"] = function ()
    {
        return this.cells.rows <= 0
    }

    menu.prototype["visible"] = function ()
    {
        return this.cells.rows > 0
    }

    menu.prototype["layout"] = function ()
    {
        var c, g, h, w, x, y

        w = 16
        c = this.choices.num()
        g = (this.greet ? this.greeter.cells.rows : 0)
        h = c + 4 + g
        x = parseInt(this.screen.cols / 2 - w / 2)
        y = parseInt(this.screen.rows / 2 - h / 2 + g)
        this.input.init(x + 2,y + 1,w - 4,1)
        this.choices.init(x + 2,y + 3,w - 3,c)
        return this.cells.init(x,y,w,c + 4)
    }

    menu.prototype["toggle"] = function ()
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

    menu.prototype["open"] = function (greet = false)
    {
        var ccol, items

        this.greet = greet
    
        items = util.linesForText(`open ...
recent ...
session ...
help
quit`)
        if (!this.greet)
        {
            items.splice(items.length - 2,0,'about')
        }
        ccol = parseInt(this.screen.cols / 2) - 5
        this.input.set('')
        this.choices.set(items)
        this.choices.state.selectLine(0)
        this.choices.state.setMainCursor(this.choices.state.s.lines[0].length,0)
        this.choices.state.setView([0,0])
        if (this.greet)
        {
            post.emit('greet')
        }
        return this.show()
    }

    menu.prototype["onInputChanged"] = function (text)
    {
        this.choices.filter(text)
        this.choices.state.selectLine(0)
        this.choices.state.setMainCursor(this.choices.state.s.lines[0].length,0)
        return this.layout()
    }

    menu.prototype["applyChoice"] = function ()
    {
        var current

        current = this.choices.current()
        switch (current)
        {
            case 'about':
                return this.open(true)

            case 'quit':
                post.emit('quit')
                return {redraw:false}

            case 'open ...':
                post.emit('quicky.dir',process.cwd())
                break
        }

        lf('menu choice',current)
        return this.hide()
    }

    menu.prototype["currentChoice"] = function ()
    {
        return _k_.trim(this.choices.current())
    }

    menu.prototype["draw"] = function ()
    {
        var bg, fg

        if (this.hidden())
        {
            return
        }
        this.layout()
        fg = theme.quicky_frame_fg
        bg = theme.quicky_frame_bg
        this.cells.draw_frame(0,0,-1,-1,{fg:fg,bg:bg,hdiv:[2]})
        if (this.greet)
        {
            this.greeter.draw()
        }
        this.input.draw()
        return this.choices.draw()
    }

    menu.prototype["moveSelection"] = function (dir)
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

    menu.prototype["onKey"] = function (key, event)
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
                if (this.input.hasFocus())
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

    menu.prototype["onMouse"] = function (type, sx, sy, event)
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

    menu.prototype["onWheel"] = function (event)
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

    return menu
})()

export default menu;