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

    Delegate.prototype["onWindowWillLoadStash"] = function (win)
    {
        console.log(`onWindowWillLoadStash ${win.id}`)
    }

    Delegate.prototype["onWindowDidLoadStash"] = function (win)
    {
        console.log(`onWindowDidLoadStash ${win.id}`)
    }

    Delegate.prototype["onWindowWithoutStash"] = function (win)
    {
        console.log(`onWindowWithoutStash ${win.id}`)
    }

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
        var main, menuIcon, menuNoon, _42_18_, _53_38_, _54_38_, _79_17_, _79_34_

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
        this.delegate = ((_42_18_=this.delegate) != null ? _42_18_ : new Delegate)
        post.on('window.blur',this.onWindowBlur)
        post.on('window.focus',this.onWindowFocus)
        post.on('window.close',this.onWindowClose)
        post.on('window.frame',this.onWindowFrame)
        post.on('menuAction',this.onMenuAction)
        post.on('stashLoaded',this.onStashLoaded)
        post.on('saveStash',this.saveStash)
        post.on('menu.init',(function (template)
        {
            var _51_54_, _51_76_

            return ((_51_54_=this.delegate) != null ? typeof (_51_76_=_51_54_.onWindowMenuTemplate) === "function" ? _51_76_(this,template) : undefined : undefined)
        }).bind(this))
        menuIcon = ((_53_38_=this.delegate.menuIcon) != null ? _53_38_ : kakao.bundle.img('menu.png'))
        menuNoon = ((_54_38_=this.delegate.menuNoon) != null ? _54_38_ : kakao.bundle.res('menu.noon'))
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
        ;((_79_17_=this.delegate) != null ? typeof (_79_34_=_79_17_.onWindowCreated) === "function" ? _79_34_(this) : undefined : undefined)
    }

    Win.prototype["restoreFromStash"] = async function ()
    {
        var list, old

        console.log('restoreFromStash',this)
        list = await ffs.list(kakao.bundle.app('.stash/old'))
        if (!_k_.empty(list))
        {
            old = list.shift()
            if (_k_.isFunc(this.delegate.onWindowWillLoadStash))
            {
                await this.delegate.onWindowWillLoadStash(this)
            }
            await window.stash.load(old.path)
            if (_k_.isFunc(this.delegate.onWindowDidLoadStash))
            {
                await this.delegate.onWindowDidLoadStash(this)
            }
            ffs.remove(old.path)
            if (!_k_.empty(list))
            {
                kakao('window.new','ko.html')
            }
        }
        else
        {
            if (window.stash.isEmpty())
            {
                if (_k_.isFunc(this.delegate.onWindowWithoutStash))
                {
                    await this.delegate.onWindowWithoutStash(this)
                }
            }
            else
            {
                if (_k_.isFunc(this.delegate.onWindowDidLoadStash))
                {
                    await this.delegate.onWindowDidLoadStash(this)
                }
            }
        }
        if (_k_.isFunc(this.delegate.onWindowAboutToShow))
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
        var delta, fps, now, _130_17_, _130_40_

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            kakao("window.framerateDrop",fps)
        }
        return ((_130_17_=this.delegate) != null ? typeof (_130_40_=_130_17_.onWindowAnimationTick) === "function" ? _130_40_(this,{delta:delta,fps:fps,time:now}) : undefined : undefined)
    }

    Win.prototype["onResize"] = function (event)
    {
        var _132_36_, _132_52_

        return ((_132_36_=this.delegate) != null ? typeof (_132_52_=_132_36_.onWindowResize) === "function" ? _132_52_(this,event) : undefined : undefined)
    }

    Win.prototype["onWindowFocus"] = function ()
    {
        var _133_36_, _133_51_

        return ((_133_36_=this.delegate) != null ? typeof (_133_51_=_133_36_.onWindowFocus) === "function" ? _133_51_(this) : undefined : undefined)
    }

    Win.prototype["onWindowBlur"] = function ()
    {
        var _134_36_, _134_50_

        return ((_134_36_=this.delegate) != null ? typeof (_134_50_=_134_36_.onWindowBlur) === "function" ? _134_50_(this) : undefined : undefined)
    }

    Win.prototype["onWindowClose"] = function ()
    {
        var _135_80_, _135_95_

        if (this.saveStashOnClose)
        {
            post.emit('saveStash')
        }
        return ((_135_80_=this.delegate) != null ? typeof (_135_95_=_135_80_.onWindowClose) === "function" ? _135_95_(this) : undefined : undefined)
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
        var _152_27_, _152_47_

        if (((_152_27_=this.delegate) != null ? typeof (_152_47_=_152_27_.onWindowMenuAction) === "function" ? _152_47_(this,action) : undefined : undefined))
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
        var info, _195_21_, _195_38_

        info = keyinfo.forEvent(event)
        info.event = event
        stopEvent(event)
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            return ((_195_21_=this.delegate) != null ? typeof (_195_38_=_195_21_.onWindowKeyDown) === "function" ? _195_38_(this,info) : undefined : undefined)
        }
    }

    Win.prototype["onKeyUp"] = function (event)
    {
        var info, _202_17_, _202_32_

        info = keyinfo.forEvent(event)
        info.event = event
        return ((_202_17_=this.delegate) != null ? typeof (_202_32_=_202_17_.onWindowKeyUp) === "function" ? _202_32_(this,info) : undefined : undefined)
    }

    return Win
})()

export default Win;