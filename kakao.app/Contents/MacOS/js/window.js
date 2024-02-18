// monsterkodi/kode 0.249.0

var _k_

var $, getMousePos, getWindowPos, mousePos, setWindowPos, stopEvent, Window, windowPos

import dom from './dom.js'
import elem from './elem.js'
import kpos from './pos.js'
import post from './post.js'
import keyinfo from './keyinfo.js'
import Title from './title.js'
import Drag from './drag.js'
import Bundle from './bundle.js'
$ = dom.$
stopEvent = dom.stopEvent

mousePos = kpos(0,0)
windowPos = kpos(0,0)

getMousePos = function (cb)
{
    return cb(mousePos)
}

getWindowPos = function (cb)
{
    return cb(windowPos)
}

setWindowPos = function (p, cb)
{}

Window = (function ()
{
    function Window ()
    {
        this["onKeyUp"] = this["onKeyUp"].bind(this)
        this["onKeyDown"] = this["onKeyDown"].bind(this)
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onWindowBlur"] = this["onWindowBlur"].bind(this)
        this["onWindowFocus"] = this["onWindowFocus"].bind(this)
        this["toggleMaximize"] = this["toggleMaximize"].bind(this)
        this["animate"] = this["animate"].bind(this)
        this["onDomLoaded"] = this["onDomLoaded"].bind(this)
        post.on('menuAction',this.onMenuAction)
        window.titlebar = new Title({icon:Bundle.resource('img/menu.png'),menu:Bundle.resource('menu.noon')})
        document.addEventListener('DOMContentLoaded',this.onDomLoaded)
    }

    Window.prototype["onDomLoaded"] = function ()
    {
        var main

        main = $('main')
        window.addEventListener('keydown',this.onKeyDown)
        window.addEventListener('keyup',this.onKeyUp)
        window.requestAnimationFrame(this.animate)
        return main.focus()
    }

    Window.prototype["animate"] = function ()
    {
        var delta, now

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime) * 0.001
        return this.lastAnimationTime = now
    }

    Window.prototype["toggleMaximize"] = function ()
    {}

    Window.prototype["createWindow"] = function ()
    {}

    Window.prototype["onWindowFocus"] = function (event)
    {
        return post.emit('windowFocus')
    }

    Window.prototype["onWindowBlur"] = function (event)
    {
        return post.emit('windowBlur')
    }

    Window.prototype["onMenuAction"] = function (action)
    {
        console.log('menuAction',action)
        switch (action.toLowerCase())
        {
            case 'new window':
                return this.createWindow()

            case 'maximize':
                return this.toggleMaximize()

        }

    }

    Window.prototype["onKeyDown"] = function (event)
    {
        var info

        stopEvent(event)
        info = keyinfo.forEvent(event)
        info.event = event
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            console.log('keydown',info)
        }
    }

    Window.prototype["onKeyUp"] = function (event)
    {
        var info

        info = keyinfo.forEvent(event)
        return info.event = event
    }

    return Window
})()

export default Window;