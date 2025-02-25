var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

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
    
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["layout"] = this["layout"].bind(this)
        menu.__super__.constructor.call(this,this.screen,'menu')
        this.greeter = new greeter(this.screen)
    }

    menu.prototype["layout"] = function ()
    {
        var c, gh, gw, h, ih, iz, scx, scy, w, x, y

        w = 15
        c = this.choices.numChoices()
        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
        h = c + 2 + ih
        scx = parseInt(this.screen.cols / 2)
        scy = parseInt(this.screen.rows / 2)
        x = parseInt(scx - w / 2)
        y = parseInt(scy - (c + 2) / 2)
        y -= ih
        var _a_ = util.cellSize(this.greeter.header); gw = _a_[0]; gh = _a_[1]

        this.greeter.layout(parseInt(scx - gw / 2),_k_.max(0,parseInt(y - gh - 1 + ih)))
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.choices.layout(x + 2,y + 1 + ih,w - 3,c)
        return this.cells.layout(x,y,w,h)
    }

    menu.prototype["show"] = function (greet = false)
    {
        this.greet = greet
    
        var ccol, items

        this.greeter.show(this.greet)
        items = util.linesForText(`recent ...
open ...
new
quit`)
        if (!this.greet)
        {
            items.splice(items.length - 2,0,'about')
        }
        if (_k_.empty(global.ked_session.get('files')))
        {
            items.splice(2,1)
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

    menu.prototype["showRecent"] = function ()
    {
        var files, loaded, maxRecent, recent, saved, _94_30_, _95_29_

        maxRecent = 20
        files = ked_session.get('files',[])
        loaded = ((_94_30_=files.loaded) != null ? _94_30_ : [])
        saved = ((_95_29_=files.saved) != null ? _95_29_ : [])
        recent = loaded.concat(saved)
        recent = kxk.util.uniq(recent)
        recent.reverse()
        recent = recent.slice(0, typeof _k_.min(recent.length,maxRecent) === 'number' ? _k_.min(recent.length,maxRecent) : -1)
        this.choices.set(recent)
        this.hide()
        return post.emit('quicky.files',recent)
    }

    menu.prototype["hide"] = function ()
    {
        delete this.greet
        return menu.__super__.hide.call(this)
    }

    menu.prototype["applyChoice"] = function (choice)
    {
        switch (choice)
        {
            case 'new':
                post.emit('file.new')
                break
            case 'about':
                this.show(true)
                return true

            case 'quit':
                post.emit('quit')
                break
            case 'open ...':
                post.emit('quicky.dir',process.cwd())
                break
            case 'recent ...':
                this.showRecent()
                break
        }

        this.hide()
        return true
    }

    menu.prototype["onInputAction"] = function (action, text)
    {
        return menu.__super__.onInputAction.call(this,action,text)
    }

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