var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var inputchoice

import kxk from "../../kxk.js"
let post = kxk.post
let kstr = kxk.kstr
let kseg = kxk.kseg

import theme from "../theme.js"

import view from "./view.js"
import cells from "./cells.js"
import input from "./input.js"
import choices from "./choices.js"


inputchoice = (function ()
{
    _k_.extend(inputchoice, view)
    function inputchoice (screen, name, features)
    {
        this.screen = screen
        this.name = name
    
        var _22_23_

        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onChoiceAction"] = this["onChoiceAction"].bind(this)
        this["onInputChanged"] = this["onInputChanged"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["layout"] = this["layout"].bind(this)
        inputchoice.__super__.constructor.call(this,this.screen,this.name,features)
        this.input = new input(this.screen,`${this.name}.input`)
        this.choices = new choices(this.screen,`${this.name}.choices`,features)
        ;(this.choices.mapscr != null ? this.choices.mapscr.hide() : undefined)
        this.input.on('changed',this.onInputChanged)
    }

    inputchoice.prototype["inputIsActive"] = function ()
    {
        return this.input.hasFocus() || this.input.current().length
    }

    inputchoice.prototype["layout"] = function ()
    {
        var cs, h, w, x, y

        x = parseInt(this.screen.cols / 4)
        y = parseInt(this.screen.rows / 4)
        w = parseInt(this.screen.cols / 2)
        h = parseInt(this.screen.rows / 2 - 4)
        cs = _k_.min(h,this.choices.numFiltered())
        this.input.layout(x + 2,y + 1,w - 4,1)
        this.choices.layout(x + 2,y + 3,w - 3,cs)
        return this.cells.layout(x,y,w,cs + 4)
    }

    inputchoice.prototype["show"] = function ()
    {
        inputchoice.__super__.show.call(this)
    
        return this.choices.grabFocus()
    }

    inputchoice.prototype["hide"] = function ()
    {
        var _60_23_

        ;(this.choices.mapscr != null ? this.choices.mapscr.hide() : undefined)
        post.emit('focus','editor')
        return inputchoice.__super__.hide.call(this)
    }

    inputchoice.prototype["onInputChanged"] = function (text)
    {
        if (text === this.choices.filterText)
        {
            return
        }
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
            return choice = _k_.trim(choice)
        }
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
        if (this.input.visible())
        {
            return this.cells.draw_frame(0,0,-1,-1,{fg:fg,bg:bg,hdiv:[2]})
        }
        else
        {
            return this.cells.draw_frame(0,0,-1,-1,{fg:fg,bg:bg})
        }
    }

    inputchoice.prototype["moveSelection"] = function (dir)
    {
        switch (dir)
        {
            case 'down':
                if (!this.choices.hasNext())
                {
                    return
                }
                this.choices.selectNext()
                break
            case 'up':
                if (!this.choices.hasPrev())
                {
                    return
                }
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
                case 'delete':
                case 'space':
                    this.onChoiceAction(current,event.combo)
                    break
            }

            if (event.char)
            {
                this.input.grabFocus()
            }
        }
        if (this.input.onKey(key,event))
        {
            if (_k_.empty(this.input.current()))
            {
                this.choices.grabFocus()
            }
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