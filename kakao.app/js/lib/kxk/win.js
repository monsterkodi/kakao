// monsterkodi/kode 0.256.0

var _k_

var $, stopEvent, Window

import dom from './dom.js'
import elem from './elem.js'
import post from './post.js'
import keyinfo from './keyinfo.js'
import Title from './title.js'
$ = dom.$
stopEvent = dom.stopEvent


Window = (function ()
{
    function Window ()
    {
        var main

        this["onKeyUp"] = this["onKeyUp"].bind(this)
        this["onKeyDown"] = this["onKeyDown"].bind(this)
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onWindowBlur"] = this["onWindowBlur"].bind(this)
        this["onWindowFocus"] = this["onWindowFocus"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["animate"] = this["animate"].bind(this)
        post.on('menuAction',this.onMenuAction)
        post.on('window.blur',this.onWindowBlur)
        post.on('window.focusd',this.onWindowFocus)
        window.titlebar = new Title({icon:kakao.bundle.img('menu.png'),menu:kakao.bundle.res('menu.noon')})
        window.addEventListener('keydown',this.onKeyDown)
        window.addEventListener('keyup',this.onKeyUp)
        window.addEventListener('resize',this.onResize)
        window.requestAnimationFrame(this.animate)
        main = $('main')
        main.focus()
        kakao.request('window.id').then((function (id)
        {
            elem({class:'test',text:"▪▸○!▴!○◂▪",parent:main})
            return elem({class:'test',text:`${id}`,parent:main})
        }).bind(this))
    }

    Window.prototype["animate"] = function ()
    {
        var delta, fps, now

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            return kakao.send("window.framerateDrop",fps)
        }
    }

    Window.prototype["createWindow"] = function ()
    {}

    Window.prototype["onResize"] = function (event)
    {}

    Window.prototype["onWindowFocus"] = function ()
    {}

    Window.prototype["onWindowBlur"] = function ()
    {}

    Window.prototype["onMenuAction"] = function (action)
    {
        console.log('menuAction',action)
        switch (action.toLowerCase())
        {
            case 'focus next':
                kakao.send('window.focusNext')
                break
            case 'focus previous':
                kakao.send('window.focusPrev')
                break
            case 'new window':
                kakao.send('window.new')
                break
            case 'maximize':
                kakao.send('window.maximize')
                break
            case 'minimize':
                kakao.send('window.minimize')
                break
            case 'screenshot':
                kakao.send('window.snapshot')
                break
            case 'close':
                kakao.send('window.close')
                break
            case 'reload':
                kakao.send('window.reload')
                break
            case 'quit':
                kakao.send('app.quit')
                break
            case 'about':
                kakao.send('window.new','about.html')
                break
        }

        return 0
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