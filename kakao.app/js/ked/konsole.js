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

    konsole.prototype["onWheel"] = function (event)
    {
        var steps

        if (event.cell[1] < this.cells.y)
        {
            return
        }
        steps = 4
        if (event.shift)
        {
            steps *= 2
        }
        if (event.ctrl)
        {
            steps *= 2
        }
        if (event.alt)
        {
            steps *= 2
        }
        switch (event.dir)
        {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                this.state.scrollView(event.dir,steps)
                break
        }

        return this.redraw()
    }

    konsole.prototype["onKey"] = function (key, event)
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

        return konsole.__super__.onKey.call(this,key,event)
    }

    return konsole
})()

export default konsole;