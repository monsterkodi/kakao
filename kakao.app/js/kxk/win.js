var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

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
        post.on('menuAction',this.onMenuAction)
        post.on('window.blur',this.onWindowBlur)
        post.on('window.focus',this.onWindowFocus)
        post.on('window.close',this.onWindowClose)
        post.on('window.frame',this.onWindowFrame)
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
        kakao.send('win.setMinSize',250,125)
        ;((_78_17_=this.delegate) != null ? typeof (_78_34_=_78_17_.onWindowCreated) === "function" ? _78_34_(this) : undefined : undefined)
    }

    Win.prototype["restoreFromStash"] = async function ()
    {
        var list, old

        list = await ffs.list(kakao.bundle.app('.stash/old'))
        if (!_k_.empty(list))
        {
            old = list.shift()
            return window.stash.load(old.path).then(function ()
            {
                ffs.remove(old.path)
                if (!_k_.empty(list))
                {
                    return kakao.send('window.new','ko.html')
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
        var delta, fps, now, _111_17_, _111_40_

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            kakao.send("window.framerateDrop",fps)
        }
        return ((_111_17_=this.delegate) != null ? typeof (_111_40_=_111_17_.onWindowAnimationTick) === "function" ? _111_40_(this,{delta:delta,fps:fps,time:now}) : undefined : undefined)
    }

    Win.prototype["onResize"] = function (event)
    {
        var _113_35_, _113_51_

        return ((_113_35_=this.delegate) != null ? typeof (_113_51_=_113_35_.onWindowResize) === "function" ? _113_51_(this,event) : undefined : undefined)
    }

    Win.prototype["onWindowFocus"] = function ()
    {
        var _114_35_, _114_50_

        return ((_114_35_=this.delegate) != null ? typeof (_114_50_=_114_35_.onWindowFocus) === "function" ? _114_50_(this) : undefined : undefined)
    }

    Win.prototype["onWindowBlur"] = function ()
    {
        var _115_35_, _115_49_

        return ((_115_35_=this.delegate) != null ? typeof (_115_49_=_115_35_.onWindowBlur) === "function" ? _115_49_(this) : undefined : undefined)
    }

    Win.prototype["onWindowClose"] = function ()
    {
        var _116_79_, _116_94_

        if (this.saveStashOnClose)
        {
            post.emit('saveStash')
        }
        return ((_116_79_=this.delegate) != null ? typeof (_116_94_=_116_79_.onWindowClose) === "function" ? _116_94_(this) : undefined : undefined)
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
            return kakao.send('window.setFrame',frame)
        }
    }

    Win.prototype["onMenuAction"] = function (action)
    {
        var _131_27_, _131_47_

        if (((_131_27_=this.delegate) != null ? typeof (_131_47_=_131_27_.onWindowMenuAction) === "function" ? _131_47_(this,action) : undefined : undefined))
        {
            return
        }
        switch (action.toLowerCase())
        {
            case 'focus next':
                kakao.send('window.focusNext')
                break
            case 'focus previous':
                kakao.send('window.focusPrev')
                break
            case 'new window':
                kakao.send('window.new',slash.file(document.URL))
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
            case 'reload':
                kakao.send('window.reload')
                break
            case 'devtools':
                kakao.send('window.toggleInspector')
                break
            case 'quit':
                kakao.send('app.quit')
                break
            case 'open ...':
                kakao.send('window.new','ko.html')
                break
            case 'close':
                ffs.list(kakao.bundle.app('.stash/win')).then((function (list)
                {
                    if (list.length > 1)
                    {
                        window.stash.clear()
                        this.saveStashOnClose = false
                    }
                    return kakao.send('window.close')
                }).bind(this))
                break
            case 'about':
                if (window.aboutImage)
                {
                    kakao.send('window.new','about.html',`window.aboutImage = \"${window.aboutImage}\";`)
                }
                else
                {
                    kakao.send('window.new','about.html')
                }
                break
        }

        return 0
    }

    Win.prototype["onKeyDown"] = function (event)
    {
        var info, _174_21_, _174_38_

        info = keyinfo.forEvent(event)
        info.event = event
        stopEvent(event)
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            return ((_174_21_=this.delegate) != null ? typeof (_174_38_=_174_21_.onWindowKeyDown) === "function" ? _174_38_(this,info) : undefined : undefined)
        }
    }

    Win.prototype["onKeyUp"] = function (event)
    {
        var info, _181_17_, _181_32_

        info = keyinfo.forEvent(event)
        info.event = event
        return ((_181_17_=this.delegate) != null ? typeof (_181_32_=_181_17_.onWindowKeyUp) === "function" ? _181_32_(this,info) : undefined : undefined)
    }

    return Win
})()

export default Win;