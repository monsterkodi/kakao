var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }}

var menu

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let noon = kxk.noon

import frecent from "../../util/frecent.js"

import belt from "../../edit/tool/belt.js"

import theme from "../../theme/theme.js"

import cells from "../screen/cells.js"

import greeter from "./greeter.js"
import inputchoice from "./inputchoice.js"


menu = (function ()
{
    _k_.extend(menu, inputchoice)
    function menu (screen)
    {
        this.screen = screen
    
        this["hide"] = this["hide"].bind(this)
        this["layout"] = this["layout"].bind(this)
        menu.__super__.constructor.call(this,this.screen,'menu')
        this.greeter = new greeter(this.screen)
    }

    menu.prototype["layout"] = function ()
    {
        var c, gh, gw, h, ih, iz, scx, scy, w, x, y

        w = this.width + 2 + 1
        c = this.choices.numChoices()
        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
        h = c + 2 + ih
        scx = parseInt(this.screen.cols / 2)
        scy = parseInt(this.screen.rows / 2)
        x = parseInt(scx - w / 2)
        y = parseInt(scy - (c + 2) / 2)
        y -= ih
        var _a_ = belt.cellSize(this.greeter.header); gw = _a_[0]; gh = _a_[1]

        this.greeter.layout(parseInt(scx - gw / 2),_k_.max(0,parseInt(y - gh - 1 + ih)))
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.choices.layout(x + 1,y + 1 + ih,w - 2,c)
        return this.cells.layout(x,y,w,h)
    }

    menu.prototype["show"] = function (greet = false)
    {
        this.greet = greet
    
        var ccol, items

        this.greeter.show(this.greet)
        items = belt.linesForText(`recent ...
open ...
new
help
quit`)
        if (!this.greet)
        {
            items.splice(items.length - 2,0,'about')
        }
        if (_k_.empty(ked_session.recentFiles()))
        {
            items.splice(items.indexOf('recent ...'),1)
        }
        items = items.map(function (i)
        {
            return ' ' + i
        })
        ccol = parseInt(this.screen.cols / 2) - 5
        this.width = belt.widthOfLines(items)
        this.input.set('')
        this.choices.set(items)
        this.choices.select(0)
        this.choices.state.setView([0,0])
        if (this.greet)
        {
            post.emit('greet')
        }
        return menu.__super__.show.call(this)
    }

    menu.prototype["showRecent"] = function ()
    {
        var recent

        recent = frecent.list('file')
        this.choices.set(recent)
        return post.emit('quicky.files',recent)
    }

    menu.prototype["hide"] = function ()
    {
        this.greeter.hide()
        delete this.greet
        return menu.__super__.hide.call(this)
    }

    menu.prototype["applyChoice"] = function (choice)
    {
        switch (choice)
        {
            case 'new':
                this.hide()
                post.emit('file.new')
                break
            case 'about':
                this.show(true)
                break
            case 'quit':
                this.greeter.hide()
                post.emit('quit')
                break
            case 'open ...':
                post.emit('fsbrow.dir',process.cwd())
                break
            case 'recent ...':
                this.showRecent()
                break
            case 'help':
                this.hide()
                post.emit('file.open',slash.path(_k_.dir(),'../../../../kode/ked/help.md'))
                break
        }

        return true
    }

    menu.prototype["onWheel"] = function ()
    {}

    menu.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.layout()
        if (this.greet)
        {
            this.greeter.draw()
        }
        this.drawFrame()
        return this.drawChoices()
    }

    return menu
})()

export default menu;