var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var input

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import editor from "../editor.js"
import theme from "../theme.js"


input = (function ()
{
    _k_.extend(input, editor)
    function input (screen, name, features)
    {
        this["current"] = this["current"].bind(this)
        input.__super__.constructor.call(this,screen,name,[])
    }

    input.prototype["hasFocus"] = function ()
    {
        return this.state.hasFocus
    }

    input.prototype["current"] = function ()
    {
        return kseg.str(this.state.s.lines[0])
    }

    input.prototype["set"] = function (text)
    {
        return this.state.loadLines([text])
    }

    input.prototype["selectAll"] = function ()
    {
        this.state.selectLine(0)
        return this.state.moveCursors('eol')
    }

    input.prototype["onKey"] = function (key, event)
    {
        var before

        lf(`input.onKey ${this.name} ${event.combo}`)
        switch (event.combo)
        {
            case 'return':
                return this.emit('action','submit',this.current())

            case 'up':
            case 'down':
                this.set('')
                this.emit('action',event.combo)
                return

        }

        before = this.current()
        input.__super__.onKey.call(this,key,event)
        if (before !== this.current())
        {
            return this.emit('action','change',this.current())
        }
    }

    input.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,theme.quicky_frame_bg)
        return input.__super__.draw.call(this)
    }

    return input
})()

export default input;