var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var inputchoice

import kxk from "../../kxk.js"
let post = kxk.post

import theme from "../theme.js"

import cells from "./cells.js"
import input from "./input.js"
import choices from "./choices.js"


inputchoice = (function ()
{
    function inputchoice (screen, name)
    {
        this.screen = screen
        this.name = name
    
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onChoiceAction"] = this["onChoiceAction"].bind(this)
        this["onInputChanged"] = this["onInputChanged"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this.cells = new cells(this.screen)
        this.input = new input(this.screen,`${this.name}_input`)
        this.choices = new choices(this.screen,`${this.name}_choices`)
        this.choices.mapscr.hide()
        this.input.on('changed',this.onInputChanged)
    }

    inputchoice.prototype["layout"] = function ()
    {
        var cs, h, w, x, y

        x = parseInt(this.screen.cols / 4)
        y = parseInt(this.screen.rows / 4)
        w = parseInt(this.screen.cols / 2)
        h = parseInt(this.screen.rows / 2 - 4)
        cs = _k_.min(h,this.choices.num())
        this.input.init(x + 2,y + 1,w - 4,1)
        this.choices.init(x + 2,y + 3,w - 3,cs)
        return this.cells.init(x,y,w,cs + 4)
    }

    inputchoice.prototype["show"] = function ()
    {
        this.layout()
        return this.choices.grabFocus()
    }

    inputchoice.prototype["hide"] = function ()
    {
        this.choices.mapscr.hide()
        this.cells.rows = 0
        post.emit('focus','editor')
        return {redraw:true}
    }

    inputchoice.prototype["hidden"] = function ()
    {
        return this.cells.rows <= 0 || this.cells.cols <= 0
    }

    inputchoice.prototype["visible"] = function ()
    {
        return this.cells.rows > 0 && this.cells.cols > 0
    }

    inputchoice.prototype["toggle"] = function ()
    {
        if (this.hidden())
        {
            return this.show()
        }
        else
        {
            return this.hide()
        }
    }

    inputchoice.prototype["onInputChanged"] = function (text)
    {
        this.choices.filter(text)
        this.choices.state.selectLine(0)
        this.choices.state.setMainCursor(this.choices.state.s.lines[0].length,0)
        return this.layout()
    }

    inputchoice.prototype["currentChoice"] = function ()
    {
        var choice, _81_36_

        choice = ((_81_36_=this.choices.current()) != null ? _81_36_ : this.input.current())
        if (_k_.isStr(choice))
        {
            choice = _k_.trim(choice)
        }
        lf('choice',choice)
        return choice
    }

    inputchoice.prototype["onChoiceAction"] = function (choice, action)
    {
        return lf('onChoiceAction',choice,action)
    }

    inputchoice.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.layout()
        this.drawFrame()
        return this.drawChoices()
    }

    inputchoice.prototype["drawChoices"] = function ()
    {
        this.input.draw()
        return this.choices.draw()
    }

    inputchoice.prototype["drawFrame"] = function ()
    {
        var bg, fg

        fg = theme.quicky_frame_fg
        bg = theme.quicky_frame_bg
        return this.cells.draw_frame(0,0,-1,-1,{fg:fg,bg:bg,hdiv:[2]})
    }

    inputchoice.prototype["moveSelection"] = function (dir)
    {
        switch (dir)
        {
            case 'down':
                this.choices.selectNext()
                break
            case 'up':
                this.choices.selectPrev()
                break
        }

        this.input.set('')
        return this.choices.grabFocus()
    }

    inputchoice.prototype["moveFocus"] = function ()
    {
        if (this.choices.hasFocus())
        {
            return this.input.grabFocus()
        }
        else
        {
            return this.choices.grabFocus()
        }
    }

    inputchoice.prototype["onKey"] = function (key, event)
    {
        var current

        if (this.hidden())
        {
            return
        }
        switch (event.combo)
        {
            case 'tab':
                return this.moveFocus()

            case 'esc':
                return this.hide()

            case 'return':
                return this.applyChoice(this.currentChoice())

            case 'up':
            case 'down':
                return this.moveSelection(event.combo)

        }

        if (this.choices.hasFocus())
        {
            current = this.choices.current()
            switch (event.combo)
            {
                case 'right':
                case 'left':
                case 'space':
                    this.onChoiceAction(current,event.combo)
                    break
            }

            this.input.grabFocus()
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

    inputchoice.prototype["onMouse"] = function (type, sx, sy, event)
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

    inputchoice.prototype["onWheel"] = function (event)
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

    return inputchoice
})()

export default inputchoice;