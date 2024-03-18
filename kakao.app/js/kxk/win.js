var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isFunc: function (o) {return typeof o === 'function'}}

var Win

import dom from "./dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent

import ffs from "./ffs.js"

import elem from "./elem.js"

import post from "./post.js"

import title from "./title.js"

import prefs from "./prefs.js"

import slash from "./slash.js"

import stash from "./stash.js"

import keyinfo from "./keyinfo.js"

class WinDelegate
{
    onWindowCreated (win)
    {
        console.log(`win ${win.id}`)
    }

    onWindowAnimationTick (win, tickInfo)
    {}

    onWindowResize (win, event)
    {}

    onWindowFocus (win)
    {}

    onWindowBlur (win)
    {}

    onWindowKeyDown (win, keyInfo)
    {
        if (!_k_.empty(keyInfo.combo))
        {
            console.log(`key ${keyInfo.combo}`)
        }
    }

    onWindowKeyUp (win, keyInfo)
    {}

    onWindowClose (win)
    {
        console.log(`onWindowClose ${win.id}`)
    }
}


Win = (function ()
{
    function Win (delegate)
    {
        var main, menuIcon, menuNoon, _42_18_, _52_38_, _53_38_, _78_17_, _78_34_

        this.delegate = delegate
    
        this["onKeyUp"] = this["onKeyUp"].bind(this)
        this["onKeyDown"] = this["onKeyDown"].bind(this)
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onStashLoaded"] = this["onStashLoaded"].bind(this)
        this["onWindowFrame"] = this["onWindowFrame"].bind(this)
        this["onWindowClose"] = this["onWindowClose"].bind(this)
        this["onWindowBlur"] = this["onWindowBlur"].bind(this)
        this["onWindowFocus"] = this["onWindowFocus"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["animate"] = this["animate"].bind(this)
        window.prefs = prefs
        window.prefs.init()
        this.saveStashOnClose = true
        this.delegate = ((_42_18_=this.delegate) != null ? _42_18_ : new WinDelegate)
        post.on('window.blur',this.onWindowBlur)
        post.on('window.focus',this.onWindowFocus)
        post.on('window.close',this.onWindowClose)
        post.on('window.frame',this.onWindowFrame)
        post.on('menuAction',this.onMenuAction)
        post.on('stashLoaded',this.onStashLoaded)
        post.on('saveStash',this.saveStash)
        menuIcon = ((_52_38_=this.delegate.menuIcon) != null ? _52_38_ : kakao.bundle.img('menu.png'))
        menuNoon = ((_53_38_=this.delegate.menuNoon) != null ? _53_38_ : kakao.bundle.res('menu.noon'))
        window.titlebar = new title({icon:menuIcon,menu:menuNoon})
        window.addEventListener('keydown',this.onKeyDown)
        window.addEventListener('keyup',this.onKeyUp)
        window.addEventListener('resize',this.onResize)
        window.requestAnimationFrame(this.animate)
        main = $('main')
        main.focus()
        this.id = window.winID
        window.stash = new stash(`win/${this.id}`)
        this.restoreFromStash()
        kakao('win.setMinSize',250,125)
        ;((_78_17_=this.delegate) != null ? typeof (_78_34_=_78_17_.onWindowCreated) === "function" ? _78_34_(this) : undefined : undefined)
    }

    Win.prototype["restoreFromStash"] = async function ()
    {
        var list, old, _82_20_

        if (_k_.isFunc((this.delegate != null ? this.delegate.onWindowAboutToShow : undefined)))
        {
            await this.delegate.onWindowAboutToShow()
        }
        list = await ffs.list(kakao.bundle.app('.stash/old'))
        if (!_k_.empty(list))
        {
            old = list.shift()
            return window.stash.load(old.path).then(function ()
            {
                ffs.remove(old.path)
                if (!_k_.empty(list))
                {
                    return kakao('window.new','ko.html')
                }
            })
        }
    }

    Win.prototype["saveStash"] = function ()
    {
        post.emit('saveChanges')
        post.emit('stash')
        window.prefs.save()
        return window.stash.save()
    }

    Win.prototype["animate"] = function ()
    {
        var delta, fps, now, _114_17_, _114_40_

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            kakao("window.framerateDrop",fps)
        }
        return ((_114_17_=this.delegate) != null ? typeof (_114_40_=_114_17_.onWindowAnimationTick) === "function" ? _114_40_(this,{delta:delta,fps:fps,time:now}) : undefined : undefined)
    }

    Win.prototype["onResize"] = function (event)
    {
        var _116_35_, _116_51_

        return ((_116_35_=this.delegate) != null ? typeof (_116_51_=_116_35_.onWindowResize) === "function" ? _116_51_(this,event) : undefined : undefined)
    }

    Win.prototype["onWindowFocus"] = function ()
    {
        var _117_35_, _117_50_

        return ((_117_35_=this.delegate) != null ? typeof (_117_50_=_117_35_.onWindowFocus) === "function" ? _117_50_(this) : undefined : undefined)
    }

    Win.prototype["onWindowBlur"] = function ()
    {
        var _118_35_, _118_49_

        return ((_118_35_=this.delegate) != null ? typeof (_118_49_=_118_35_.onWindowBlur) === "function" ? _118_49_(this) : undefined : undefined)
    }

    Win.prototype["onWindowClose"] = function ()
    {
        var _119_79_, _119_94_

        if (this.saveStashOnClose)
        {
            post.emit('saveStash')
        }
        return ((_119_79_=this.delegate) != null ? typeof (_119_94_=_119_79_.onWindowClose) === "function" ? _119_94_(this) : undefined : undefined)
    }

    Win.prototype["onWindowFrame"] = function (info)
    {
        return window.stash.set('frame',info.frame)
    }

    Win.prototype["onStashLoaded"] = function ()
    {
        var frame

        if (frame = window.stash.get('frame'))
        {
            return kakao('window.setFrame',frame)
        }
    }

    Win.prototype["onMenuAction"] = function (action)
    {
        var _134_27_, _134_47_

        if (((_134_27_=this.delegate) != null ? typeof (_134_47_=_134_27_.onWindowMenuAction) === "function" ? _134_47_(this,action) : undefined : undefined))
        {
            return
        }
        switch (action.toLowerCase())
        {
            case 'focus next':
                kakao('window.focusNext')
                break
            case 'focus previous':
                kakao('window.focusPrev')
                break
            case 'new window':
                kakao('window.new',slash.file(document.URL))
                break
            case 'maximize':
                kakao('window.maximize')
                break
            case 'minimize':
                kakao('window.minimize')
                break
            case 'screenshot':
                kakao('window.snapshot')
                break
            case 'reload':
                kakao('window.reload')
                break
            case 'devtools':
                kakao('window.toggleInspector')
                break
            case 'quit':
                kakao('app.quit')
                break
            case 'open ...':
                kakao('window.new','ko.html')
                break
            case 'close':
                ffs.list(kakao.bundle.app('.stash/win')).then((function (list)
                {
                    if (list.length > 1)
                    {
                        window.stash.clear()
                        this.saveStashOnClose = false
                    }
                    return kakao('window.close')
                }).bind(this))
                break
            case 'about':
                if (window.aboutImage)
                {
                    kakao('window.new','about.html',`window.aboutImage = \"${window.aboutImage}\";`)
                }
                else
                {
                    kakao('window.new','about.html')
                }
                break
        }

        return 0
    }

    Win.prototype["onKeyDown"] = function (event)
    {
        var info, _177_21_, _177_38_

        info = keyinfo.forEvent(event)
        info.event = event
        stopEvent(event)
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            return ((_177_21_=this.delegate) != null ? typeof (_177_38_=_177_21_.onWindowKeyDown) === "function" ? _177_38_(this,info) : undefined : undefined)
        }
    }

    Win.prototype["onKeyUp"] = function (event)
    {
        var info, _184_17_, _184_32_

        info = keyinfo.forEvent(event)
        info.event = event
        return ((_184_17_=this.delegate) != null ? typeof (_184_32_=_184_17_.onWindowKeyUp) === "function" ? _184_32_(this,info) : undefined : undefined)
    }

    return Win
})()

export default Win;