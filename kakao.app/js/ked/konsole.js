var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var konsole

import editor from "./editor.js"
import theme from "./theme.js"


konsole = (function ()
{
    _k_.extend(konsole, editor)
    function konsole (screen, name, features)
    {
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        konsole.__super__.constructor.call(this,screen,name,features)
        global.lc = (function (...args)
        {
            return this.state.insert('\n' + args.map(function (a)
            {
                return `${a}`
            }).join(' '))
        }).bind(this)
    }

    konsole.prototype["onWheel"] = function (col, row, dir, mods)
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

    konsole.prototype["onKey"] = function (key)
    {
        switch (key)
        {
            case 'cmd+k':
                this.state.clearLines()
                return true

            case 'alt+k':
                this.toggle()
                return true

        }

        return false
    }

    return konsole
})()

export default konsole;