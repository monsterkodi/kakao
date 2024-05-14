var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var Delegate

import kakao from "../kakao.js"

import kxk from "../kxk.js"
let $ = kxk.$
let win = kxk.win
let post = kxk.post
let stopEvent = kxk.stopEvent

window.WIN_MIN_WIDTH = 200
window.WIN_MIN_HEIGHT = 200

Delegate = (function ()
{
    _k_.extend(Delegate, win.Delegate)
    function Delegate ()
    {
        this["onWindowFocus"] = this["onWindowFocus"].bind(this)
        this["onWindowBlur"] = this["onWindowBlur"].bind(this)
        this["onWindowKeyUp"] = this["onWindowKeyUp"].bind(this)
        this["onWindowKeyDown"] = this["onWindowKeyDown"].bind(this)
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onWindowResize"] = this["onWindowResize"].bind(this)
        this["onWindowCreated"] = this["onWindowCreated"].bind(this)
        post.on('menuAction',this.onMenuAction)
        return Delegate.__super__.constructor.apply(this, arguments)
    }

    Delegate.prototype["onWindowWillShow"] = function ()
    {
        return document.body.style.display = 'inherit'
    }

    Delegate.prototype["onWindowWithoutStash"] = function ()
    {
        kakao('win.setSize',window.WIN_MIN_WIDTH,window.WIN_MIN_HEIGHT)
        return kakao('win.center')
    }

    Delegate.prototype["onWindowCreated"] = function ()
    {
        return kakao('win.setMinSize',window.WIN_MIN_WIDTH,window.WIN_MIN_HEIGHT)
    }

    Delegate.prototype["onWindowResize"] = function ()
    {
        return post.emit('resize')
    }

    Delegate.prototype["onMenuAction"] = function (action, args)
    {
        switch (action)
        {
            case 'Cut':
                return this.cut()

            case 'Copy':
                return this.cpy()

            case 'Paste':
                return this.paste()

        }

        return 'unhandled'
    }

    Delegate.prototype["onWindowKeyDown"] = function (win, info)
    {}

    Delegate.prototype["onWindowKeyUp"] = function (win, info)
    {}

    Delegate.prototype["onWindowBlur"] = function (win)
    {}

    Delegate.prototype["onWindowFocus"] = function (win)
    {}

    return Delegate
})()

kakao.init(function ()
{
    new win(new Delegate)
    return this
})