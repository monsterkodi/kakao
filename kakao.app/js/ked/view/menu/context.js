var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var context

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let noon = kxk.noon

import belt from "../../edit/tool/belt.js"

import theme from "../../theme/theme.js"

import inputchoice from "./inputchoice.js"


context = (function ()
{
    _k_.extend(context, inputchoice)
    context["menu"] = null
    function context (screen)
    {
        this.screen = screen
    
        this["draw"] = this["draw"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        context.__super__.constructor.call(this,this.screen,'context')
        context.menu = this
    }

    context.prototype["arrange"] = function ()
    {
        var c, h, ih, iz, w, x, y

        w = this.width + 2 + 1
        c = this.choices.numChoices()
        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
        h = c + 2 + ih
        x = this.pos[0]
        y = this.pos[1]
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.choices.layout(x + 1,y + 1 + ih,w - 2,c)
        return this.cells.layout(x,y,w,h)
    }

    context["show"] = function (pos, cb, items)
    {
        return context.menu.show(pos,cb,items)
    }

    context.prototype["show"] = function (pos, cb, items)
    {
        this.pos = pos
        this.cb = cb
        this.items = items
    
        var items

        this.pos[1] -= 1
        items = this.items.map(function (i)
        {
            return ' ' + i
        })
        this.width = belt.widthOfLines(items)
        this.input.set('')
        this.input.hide()
        this.choices.set(items)
        this.choices.select(0)
        this.choices.state.setView([0,0])
        return context.__super__.show.call(this)
    }

    context.prototype["applyChoice"] = function (choice)
    {
        console.log('context applyChoice',choice)
        this.cb(choice)
        return this.hide()
    }

    context.prototype["onWheel"] = function ()
    {}

    context.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.arrange()
        this.drawFrame()
        return this.drawChoices()
    }

    return context
})()

export default context;