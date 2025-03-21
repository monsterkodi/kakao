var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var macro

import kxk from "../../../kxk.js"
let post = kxk.post

import belt from "../../edit/tool/belt.js"

import theme from "../../theme/theme.js"

import inputchoice from "./inputchoice.js"


macro = (function ()
{
    _k_.extend(macro, inputchoice)
    function macro (screen)
    {
        this.screen = screen
    
        this["hide"] = this["hide"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        macro.__super__.constructor.call(this,this.screen,'macro')
        this.isVisible = false
    }

    macro.prototype["arrange"] = function ()
    {
        var c, h, ih, iz, scx, scy, w, x, y

        w = this.width + 2 + 1
        c = this.choices.numChoices()
        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
        h = c + 2 + ih
        scy = parseInt(this.screen.rows / 2)
        y = parseInt(scy - (c + 2) / 2)
        y -= ih
        scx = parseInt(this.screen.cols / 2)
        x = parseInt(scx - w / 2)
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.choices.layout(x + 1,y + 1 + ih,w - 2,c)
        return this.cells.layout(x,y,w,h)
    }

    macro.prototype["show"] = function ()
    {
        var ccol, items

        items = belt.linesForText(`diff
commit`)
        items = items.map(function (i)
        {
            return ' ' + i
        })
        ccol = parseInt(this.screen.cols / 2) - 5
        this.width = belt.widthOfLines(items)
        this.input.set('')
        this.input.hide()
        this.choices.set(items)
        this.choices.select(0)
        this.choices.state.setView([0,0])
        return macro.__super__.show.call(this)
    }

    macro.prototype["hide"] = function ()
    {
        post.emit('focus','editor')
        return macro.__super__.hide.call(this)
    }

    macro.prototype["applyChoice"] = function (choice)
    {
        var input, num

        if (_k_.empty(choice))
        {
            input = this.input.current()
            if (input === 'bof')
            {
                post.emit('goto.bof')
            }
            else if (input === 'eof')
            {
                post.emit('goto.eof')
            }
            else if (num = parseInt(input))
            {
                post.emit('goto.line',num - 1,'ind')
            }
        }
        this.hide()
        return true
    }

    return macro
})()

export default macro;