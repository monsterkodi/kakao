var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var Delegate

import kakao from "../kakao.js"

import kxk from "../kxk.js"
let win = kxk.win
let post = kxk.post
let stopEvent = kxk.stopEvent

import keys from "./keys.js"
import input from "./input.js"
import sheet from "./sheet.js"


Delegate = (function ()
{
    _k_.extend(Delegate, win.Delegate)
    function Delegate ()
    {
        this["cut"] = this["cut"].bind(this)
        this["cpy"] = this["cpy"].bind(this)
        this["currentSelection"] = this["currentSelection"].bind(this)
        this["onWindowKeyDown"] = this["onWindowKeyDown"].bind(this)
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onCalc"] = this["onCalc"].bind(this)
        this["onWindowResize"] = this["onWindowResize"].bind(this)
        this["onWindowCreated"] = this["onWindowCreated"].bind(this)
        this.menuIcon = kakao.bundle.img('menu_kalk.png')
        this.menuNoon = kakao.bundle.res('menu_kalk.noon')
        post.on('combo',this.onCombo)
        post.on('menuAction',this.onMenuAction)
        post.on('calc',this.onCalc)
        return Delegate.__super__.constructor.apply(this, arguments)
    }

    Delegate.prototype["onWindowCreated"] = function ()
    {
        return kakao('win.setMinSize',470,610)
    }

    Delegate.prototype["onWindowResize"] = function ()
    {
        return post.emit('resize')
    }

    Delegate.prototype["onCalc"] = function (calc)
    {
        window.input.setText(calc)
        return post.emit('button','=')
    }

    Delegate.prototype["onMenuAction"] = function (action, args)
    {
        switch (action)
        {
            case 'Cut':
                return cut()

            case 'Copy':
                return cpy()

            case 'Paste':
                return paste()

            case 'Clear All':
                post.emit('sheet','clear')
                return post.emit('menuAction','Clear')

            case 'Save':
                return post.toMain('saveBuffer')

        }

    }

    Delegate.prototype["onWindowKeyDown"] = function (win, info)
    {
        console.log(info)
        if ('unhandled' !== window.keys.globalModKeyComboEvent(info.mod,info.key,info.combo,info.event))
        {
            return stopEvent(info.event)
        }
        switch (info.combo)
        {
            case 'ctrl+v':
                return this.paste()

            case 'ctrl+c':
                return this.cpy()

            case 'ctrl+x':
                return this.cut()

        }

    }

    Delegate.prototype["currentSelection"] = function ()
    {
        var selection

        selection = document.getSelection().toString()
        if (!_k_.empty(selection))
        {
            return selection
        }
        return ''
    }

    Delegate.prototype["cpy"] = function ()
    {
        var selection

        if (selection = this.currentSelection())
        {
            return kakao('clipboard.write',selection)
        }
        else
        {
            return kakao('clipboard.write',window.input.text())
        }
    }

    Delegate.prototype["cut"] = function ()
    {
        var selection

        cpy()
        if (selection = this.currentSelection())
        {
            return document.getSelection().deleteFromDocument()
        }
        else
        {
            return window.input.clear()
        }
    }

    Delegate.prototype["paste"] = async function ()
    {
        var text

        text = await kakao('clipboard.read')
        return window.input.setText(window.input.text() + text)
    }

    return Delegate
})()

kakao.init(function ()
{
    new win(new Delegate)
    window.sheet = new sheet
    window.input = new input
    window.keys = new keys
    return this
})