var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var menu

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let noon = kxk.noon

import util from "../util/util.js"

import editor from "../editor.js"
import theme from "../theme.js"

import cells from "./cells.js"
import greeter from "./greeter.js"
import inputchoice from "./inputchoice.js"


menu = (function ()
{
    _k_.extend(menu, inputchoice)
    function menu (screen)
    {
        this.screen = screen
    
        this["onChoiceAction"] = this["onChoiceAction"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["hide"] = this["hide"].bind(this)
        menu.__super__.constructor.call(this,this.screen,'menu')
        this.greeter = new greeter(this.screen)
    }

    menu.prototype["show"] = function (greet = false)
    {
        var ccol, items

        this.greet = greet
    
        this.greeter.show(this.greet)
        items = util.linesForText(`open ...
recent ...
session ...
help
quit`)
        if (!this.greet)
        {
            items.splice(items.length - 2,0,'about')
        }
        ccol = parseInt(this.screen.cols / 2) - 5
        this.input.set('')
        this.choices.set(items)
        this.choices.state.selectLine(0)
        this.choices.frontCursor()
        this.choices.state.setView([0,0])
        if (this.greet)
        {
            post.emit('greet')
        }
        return menu.__super__.show.call(this)
    }

    menu.prototype["hide"] = function ()
    {
        delete this.greet
        return menu.__super__.hide.call(this)
    }

    menu.prototype["layout"] = function ()
    {
        var c, g, gh, gw, gx, gy, h, ih, iz, scx, scy, w, x, y

        w = 16
        c = this.choices.num()
        g = (this.greet ? this.greeter.cells.rows : 0)
        var _a_ = util.cellSize(this.greeter.header); gw = _a_[0]; gh = _a_[1]

        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
        h = c + 2 + ih
        scx = parseInt(this.screen.cols / 2)
        scy = parseInt(this.screen.rows / 2)
        x = parseInt(scx - w / 2 - ih)
        y = parseInt((g ? scy : scy - h / 2))
        y -= iz
        gx = parseInt(scx - gw / 2)
        gy = parseInt(scy - gh)
        this.greeter.init(gx,gy)
        this.input.init(x + 2,y + 1,w - 4,iz)
        this.choices.init(x + 2,y + 1 + ih,w - 3,c)
        return this.cells.init(x,y,w,c + 2 + ih)
    }

    menu.prototype["applyChoice"] = function (choice)
    {
        switch (choice)
        {
            case 'about':
                return this.show(true)

            case 'quit':
                post.emit('quit')
                return {redraw:false}

            case 'open ...':
                post.emit('quicky.dir',process.cwd())
                break
        }

        return this.hide()
    }

    menu.prototype["onChoiceAction"] = function (choice, action)
    {
        if (_k_.in(action,['space','right']))
        {
            return this.applyChoice(choice)
        }
    }

    menu.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.layout()
        this.drawFrame()
        if (this.greet)
        {
            this.greeter.draw()
        }
        return this.drawChoices()
    }

    return menu
})()

export default menu;