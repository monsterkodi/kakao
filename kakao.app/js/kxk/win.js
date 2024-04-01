var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isFunc: function (o) {return typeof o === 'function'}}

var Delegate, Win

import dom from "./dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent

import ffs from "./ffs.js"
import elem from "./elem.js"
import post from "./post.js"
import prefs from "./prefs.js"
import slash from "./slash.js"
import stash from "./stash.js"
import keyinfo from "./keyinfo.js"
import title from "./title.js"


Delegate = (function ()
{
    function Delegate ()
    {}

    Delegate.prototype["onWindowAboutToShow"] = function (win)
    {
        console.log(`onWindowAboutToShow ${win.id}`)
    }

    Delegate.prototype["onWindowCreated"] = function (win)
    {
        console.log(`win ${win.id}`)
    }

    Delegate.prototype["onWindowAnimationTick"] = function (win, tickInfo)
    {}

    Delegate.prototype["onWindowResize"] = function (win, event)
    {
        console.log("onWindowResize",event)
    }

    Delegate.prototype["onWindowFocus"] = function (win)
    {
        console.log("onWindowFocus")
    }

    Delegate.prototype["onWindowBlur"] = function (win)
    {
        console.log("onWindowBlur")
    }

    Delegate.prototype["onWindowKeyDown"] = function (win, keyInfo)
    {
        if (!_k_.empty(keyInfo.combo))
        {
            console.log("onWindowKeyDown ",keyInfo.combo)
        }
    }

    Delegate.prototype["onWindowKeyUp"] = function (win, keyInfo)
    {
        if (!_k_.empty(keyInfo.combo))
        {
            console.log("onWindowKeyUp  ",keyInfo.combo)
        }
    }

    Delegate.prototype["onWindowClose"] = function (win)
    {
        console.log(`onWindowClose ${win.id}`)
    }

    Delegate.prototype["onWindowMenuTemplate"] = function (win, template)
    {
        console.log(`onWindowMenuTemplate ${win.id}`,template)
    }

    return Delegate
})()


Win = (function ()
{
    Win["Delegate"] = Delegate
    function Win (delegate)
    {
        var main, menuIcon, menuNoon, _39_18_, _50_38_, _51_38_, _76_17_, _76_34_

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
        this.delegate = ((_39_18_=this.delegate) != null ? _39_18_ : new Delegate)
        post.on('window.blur',this.onWindowBlur)
        post.on('window.focus',this.onWindowFocus)
        post.on('window.close',this.onWindowClose)
        post.on('window.frame',this.onWindowFrame)
        post.on('menuAction',this.onMenuAction)
        post.on('stashLoaded',this.onStashLoaded)
        post.on('saveStash',this.saveStash)
        post.on('menu.init',(function (template)
        {
            var _48_54_, _48_76_

            return ((_48_54_=this.delegate) != null ? typeof (_48_76_=_48_54_.onWindowMenuTemplate) === "function" ? _48_76_(this,template) : undefined : undefined)
        }).bind(this))
        menuIcon = ((_50_38_=this.delegate.menuIcon) != null ? _50_38_ : kakao.bundle.img('menu.png'))
        menuNoon = ((_51_38_=this.delegate.menuNoon) != null ? _51_38_ : kakao.bundle.res('menu.noon'))
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
        ;((_76_17_=this.delegate) != null ? typeof (_76_34_=_76_17_.onWindowCreated) === "function" ? _76_34_(this) : undefined : undefined)
    }

    Win.prototype["restoreFromStash"] = async function ()
    {
        var list, old, _84_24_, _94_20_

        list = await ffs.list(kakao.bundle.app('.stash/old'))
        if (!_k_.empty(list))
        {
            old = list.shift()
            if (_k_.isFunc((this.delegate != null ? this.delegate.onWindowAboutToRestoreFromStash : undefined)))
            {
                await this.delegate.onWindowAboutToRestoreFromStash(this)
            }
            await window.stash.load(old.path)
            ffs.remove(old.path)
            if (!_k_.empty(list))
            {
                kakao('window.new','ko.html')
            }
        }
        if (_k_.isFunc((this.delegate != null ? this.delegate.onWindowAboutToShow : undefined)))
        {
            return await this.delegate.onWindowAboutToShow(this)
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
        var delta, fps, now, _118_17_, _118_40_

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            kakao("window.framerateDrop",fps)
        }
        return ((_118_17_=this.delegate) != null ? typeof (_118_40_=_118_17_.onWindowAnimationTick) === "function" ? _118_40_(this,{delta:delta,fps:fps,time:now}) : undefined : undefined)
    }

    Win.prototype["onResize"] = function (event)
    {
        var _120_35_, _120_51_

        return ((_120_35_=this.delegate) != null ? typeof (_120_51_=_120_35_.onWindowResize) === "function" ? _120_51_(this,event) : undefined : undefined)
    }

    Win.prototype["onWindowFocus"] = function ()
    {
        var _121_35_, _121_50_

        return ((_121_35_=this.delegate) != null ? typeof (_121_50_=_121_35_.onWindowFocus) === "function" ? _121_50_(this) : undefined : undefined)
    }

    Win.prototype["onWindowBlur"] = function ()
    {
        var _122_35_, _122_49_

        return ((_122_35_=this.delegate) != null ? typeof (_122_49_=_122_35_.onWindowBlur) === "function" ? _122_49_(this) : undefined : undefined)
    }

    Win.prototype["onWindowClose"] = function ()
    {
        var _123_79_, _123_94_

        if (this.saveStashOnClose)
        {
            post.emit('saveStash')
        }
        return ((_123_79_=this.delegate) != null ? typeof (_123_94_=_123_79_.onWindowClose) === "function" ? _123_94_(this) : undefined : undefined)
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
        var _140_27_, _140_47_

        if (((_140_27_=this.delegate) != null ? typeof (_140_47_=_140_27_.onWindowMenuAction) === "function" ? _140_47_(this,action) : undefined : undefined))
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
        var info, _183_21_, _183_38_

        info = keyinfo.forEvent(event)
        info.event = event
        stopEvent(event)
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            return ((_183_21_=this.delegate) != null ? typeof (_183_38_=_183_21_.onWindowKeyDown) === "function" ? _183_38_(this,info) : undefined : undefined)
        }
    }

    Win.prototype["onKeyUp"] = function (event)
    {
        var info, _190_17_, _190_32_

        info = keyinfo.forEvent(event)
        info.event = event
        return ((_190_17_=this.delegate) != null ? typeof (_190_32_=_190_17_.onWindowKeyUp) === "function" ? _190_32_(this,info) : undefined : undefined)
    }

    return Win
})()

export default Win;