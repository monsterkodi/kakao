var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var consol

import editor from "./editor.js"
import theme from "./theme.js"


consol = (function ()
{
    _k_.extend(consol, editor)
    function consol (screen)
    {
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["postDraw"] = this["postDraw"].bind(this)
        consol.__super__.constructor.call(this,screen)
        global.lc = (function (...args)
        {
            var text

            text = args.map(function (a)
            {
                return `${a}`
            }).join(' ')
            this.state.insert('\n')
            return this.state.insert(text)
        }).bind(this)
    }

    consol.prototype["postDraw"] = function ()
    {
        var fg

        fg = (this.hover ? theme.scroll_knob : theme.consol)
        return this.cells.set(parseInt(this.cells.cols / 2),0,'●',fg)
    }

    consol.prototype["onMouse"] = function (event, col, row, button, mods, count)
    {
        var _a_ = this.cells.posForScreen(col,row); col = _a_[0]; row = _a_[1]

        switch (event)
        {
            case 'press':
                if (row === 0)
                {
                    this.doDrag = true
                    return true
                }
                break
            case 'drag':
                if (this.doDrag && row)
                {
                    this.emit('consolRows',this.cells.rows - row)
                    return true
                }
                break
            case 'release':
                if (this.doDrag)
                {
                    delete this.doDrag
                    return true
                }
                break
            case 'move':
                return this.hover = row === 0

        }

    }

    consol.prototype["onWheel"] = function (col, row, dir, mods)
    {
        var steps

        if (row < this.cells.y)
        {
            return
        }
        steps = ((function ()
        {
            switch (mods)
            {
                case 'shift':
                    return 4

                case 'shift+ctrl':
                    return 8

                case 'alt':
                    return 16

                case 'shift+alt':
                    return 32

                case 'ctrl+alt':
                    return 64

                case 'shift+ctrl+alt':
                    return 128

                default:
                    return 1
            }

        }).bind(this))()
        switch (dir)
        {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                this.state.scrollView(dir,steps)
                break
        }

        return this.redraw()
    }

    consol.prototype["onKey"] = function (key)
    {
        switch (key)
        {
            case 'cmd+k':
                this.state.clearLines()
                return true

        }

        return false
    }

    return consol
})()

export default consol;