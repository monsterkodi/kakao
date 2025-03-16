var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var input

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import theme from "../../theme/theme.js"

import editor from "../../edit/editor.js"


input = (function ()
{
    _k_.extend(input, editor)
    function input (screen, name)
    {
        this["current"] = this["current"].bind(this)
        input.__super__.constructor.call(this,screen,name,['brckts','replex','unype'])
        this.setColor('bg',theme.quicky_bg)
        this.setColor('selection_line',this.color.selection)
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
        var before, sr

        switch (event.combo)
        {
            case 'return':
                this.emit('action','submit',this.current())
                return

            case 'up':
            case 'down':
                this.emit('action',event.combo)
                return

            case 'right':
                if (this.state.mainCursor()[0] >= this.current().length)
                {
                    this.emit('action','right')
                    return
                }
                break
        }

        before = this.current()
        sr = input.__super__.onKey.call(this,key,event)
        if (before !== this.current())
        {
            this.emit('action','change',this.current())
        }
        return sr
    }

    input.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        return input.__super__.draw.call(this)
    }

    return input
})()

export default input;