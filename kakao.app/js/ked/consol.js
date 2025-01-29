var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var consol

import editor from "./editor.js"


consol = (function ()
{
    _k_.extend(consol, editor)
    function consol (screen)
    {
        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        consol.__super__.constructor.call(this,screen)
        global.lc = (function (...args)
        {
            var text

            text = args.map(function (a)
            {
                return `${a}`
            }).join(' ')
            if (this.state.s.lines[this.state.s.lines.length - 1].length)
            {
                this.state.insert('\n')
            }
            return this.state.insert(text)
        }).bind(this)
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