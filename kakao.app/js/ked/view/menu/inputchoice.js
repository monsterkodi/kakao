var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var inputchoice

import kxk from "../../../kxk.js"
let post = kxk.post

import theme from "../../theme/theme.js"

import view from "../base/view.js"
import input from "../base/input.js"

import choices from "../menu/choices.js"


inputchoice = (function ()
{
    _k_.extend(inputchoice, view)
    function inputchoice (screen, name, features)
    {
        this.screen = screen
        this.name = name
    
        var _33_23_

        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["autoHide"] = this["autoHide"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["onInputChange"] = this["onInputChange"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        inputchoice.__super__.constructor.call(this,this.screen,this.name,features)
        this.autoHideInput = true
        this.isVisible = false
        this.isPopup = true
        this.input = new input(this.screen,`${this.name}_input`)
        this.choices = new choices(this.screen,`${this.name}_choices`,features)
        this.setColor('bg',theme.quicky.bg)
        this.setColor('frame',theme.quicky.frame)
        ;(this.choices.mapscr != null ? this.choices.mapscr.hide() : undefined)
        this.input.hide()
        this.choices.show()
        this.input.on('action',this.onInputAction)
        this.choices.on('action',this.onChoicesAction)
    }

    inputchoice.prototype["setColor"] = function (key, color)
    {
        inputchoice.__super__.setColor.call(this,key,color)
    
        if (key === 'bg')
        {
            this.input.setColor('bg',this.color.bg)
            this.input.setColor('empty',this.color.bg)
            return this.choices.setColor('bg',this.color.bg)
        }
    }

    inputchoice.prototype["inputIsActive"] = function ()
    {
        return this.input.hasFocus() || this.input.current().length
    }

    inputchoice.prototype["arrange"] = function ()
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
    
        if (this.choices.numFiltered())
        {
            this.choices.grabFocus()
        }
        else if (this.input.visible())
        {
            this.input.grabFocus()
        }
        return {redraw:true}
    }

    inputchoice.prototype["hide"] = function ()
    {
        var _89_23_

        ;(this.choices.mapscr != null ? this.choices.mapscr.hide() : undefined)
        return inputchoice.__super__.hide.call(this)
    }

    inputchoice.prototype["onInputChange"] = function (text)
    {
        if (text === this.choices.filterText)
        {
            return
        }
        this.choices.filter(text)
        this.choices.state.selectLine(0)
        this.choices.state.setMainCursor(0,0)
        this.choicesFiltered()
        return this.arrange()
    }

    inputchoice.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'right':
            case 'submit':
                return this.applyChoice(this.choices.current())

            case 'change':
                return this.onInputChange(text)

            case 'up':
            case 'down':
                return this.choices.moveSelection(action)

        }

    }

    inputchoice.prototype["autoHide"] = function ()
    {
        if (this.autoHideInput && !this.inputIsActive())
        {
            return this.input.hide()
        }
    }

    inputchoice.prototype["onChoicesAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'click':
            case 'right':
            case 'space':
            case 'return':
                return this.applyChoice(this.choices.current())

            case 'hover':
                return this.autoHide()

        }

    }

    inputchoice.prototype["choicesFiltered"] = function ()
    {}

    inputchoice.prototype["currentChoice"] = function ()
    {
        var choice, _144_36_

        choice = ((_144_36_=this.choices.current()) != null ? _144_36_ : this.input.current())
        if (_k_.isStr(choice))
        {
            return choice = _k_.trim(choice)
        }
    }

    inputchoice.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.arrange()
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

        fg = this.color.frame
        bg = this.color.bg
        if (this.input.visible())
        {
            return this.cells.draw_frame(0,0,-1,-1,{fg:fg,bg:bg,hdiv:[2]})
        }
        else
        {
            return this.cells.draw_frame(0,0,-1,-1,{fg:fg,bg:bg})
        }
    }

    inputchoice.prototype["moveFocus"] = function ()
    {
        if (this.choices.hasFocus())
        {
            this.input.grabFocus()
            return this.input.selectAll()
        }
        else
        {
            this.choices.grabFocus()
            return this.autoHide()
        }
    }

    inputchoice.prototype["onKey"] = function (key, event)
    {
        var result

        if (this.hidden())
        {
            return
        }
        switch (event.combo)
        {
            case 'tab':
                return this.moveFocus()

            case 'esc':
                post.emit('focus','editor')
                return this.hide()

        }

        if (result = this.choices.onKey(key,event))
        {
            if (event.char && !(_k_.in(event.char,' \n')))
            {
                this.input.grabFocus()
            }
            else
            {
                this.autoHide()
                return result
            }
        }
        if (result = this.input.onKey(key,event))
        {
            this.autoHide()
            return result
        }
        return true
    }

    inputchoice.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.input.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.choices.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = inputchoice.__super__.onMouse.call(this,event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        if (event.type === 'press' && !this.hover)
        {
            post.emit('focus','editor')
            return this.hide()
        }
        return this.hover
    }

    inputchoice.prototype["onWheel"] = function (event)
    {
        var inside, ret

        if (this.hidden())
        {
            return
        }
        ret = this.input.onWheel(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.choices.onWheel(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        inside = this.cells.isInsideEvent(event)
        if (inside)
        {
            return {redraw:false}
        }
    }

    return inputchoice
})()

export default inputchoice;