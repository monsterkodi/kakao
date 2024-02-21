// monsterkodi/kode 0.249.0

var _k_

var $, stopEvent, Window

import dom from './lib/dom.js'
import elem from './lib/elem.js'
import post from './lib/post.js'
import about from './lib/about.js'
import kakao from './lib/kakao.js'
import keyinfo from './lib/keyinfo.js'
import Title from './lib/title.js'
import bundle from './lib/bundle.js'
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
        window.titlebar = new Title({icon:bundle.img('menu.png'),menu:bundle.res('menu.noon')})
        window.addEventListener('keydown',this.onKeyDown)
        window.addEventListener('keyup',this.onKeyUp)
        window.addEventListener('resize',this.onResize)
        window.requestAnimationFrame(this.animate)
        main = $('main')
        main.focus()
        kakao.request('window.id').then((function (id)
        {
            return elem({class:'test',text:`window.id ${id}`,parent:main})
        }).bind(this))
    }

    Window.prototype["animate"] = function ()
    {
        var delta, fps, now

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime) * 0.001
        this.lastAnimationTime = now
        fps = 1000 * delta
        if (fps > 40)
        {
            console.log(fps)
            return kakao.post("window.framerateDrop",delta)
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
                kakao.post('window.focusNext')
                break
            case 'focus previous':
                kakao.post('window.focusPrev')
                break
            case 'new window':
                kakao.post('window.new')
                break
            case 'maximize':
                kakao.post('window.maximize')
                break
            case 'minimize':
                kakao.post('window.minimize')
                break
            case 'screenshot':
                kakao.post('window.snapshot')
                break
            case 'close':
                kakao.post('window.close')
                break
            case 'reload':
                kakao.post('window.reload')
                break
            case 'quit':
                kakao.post('app.quit')
                break
            case 'about':
                about()
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