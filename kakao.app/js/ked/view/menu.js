var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

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
    
        lf('menu show',this.greet)
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
        var c, g, h, w, x, y

        w = 16
        c = this.choices.num()
        g = (this.greet ? this.greeter.cells.rows : 0)
        h = c + 4 + g
        x = parseInt(this.screen.cols / 2 - w / 2)
        y = parseInt(this.screen.rows / 2 - h / 2 + g)
        this.input.init(x + 2,y + 1,w - 4,1)
        this.choices.init(x + 2,y + 3,w - 3,c)
        return this.cells.init(x,y,w,c + 4)
    }

    menu.prototype["applyChoice"] = function ()
    {
        var current

        current = this.choices.current()
        switch (current)
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
            return this.applyChoice()
        }
    }

    menu.prototype["currentChoice"] = function ()
    {
        return _k_.trim(this.choices.current())
    }

    menu.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.layout()
        this.drawBackground()
        if (this.greet)
        {
            this.greeter.draw()
        }
        return menu.__super__.draw.call(this)
    }

    return menu
})()

export default menu;