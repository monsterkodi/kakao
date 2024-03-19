var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isFunc: function (o) {return typeof o === 'function'}}

var Delegate, Win

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
        var main, menuIcon, menuNoon, _46_18_, _57_38_, _58_38_, _83_17_, _83_34_

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
        this.delegate = ((_46_18_=this.delegate) != null ? _46_18_ : new WinDelegate)
        post.on('window.blur',this.onWindowBlur)
        post.on('window.focus',this.onWindowFocus)
        post.on('window.close',this.onWindowClose)
        post.on('window.frame',this.onWindowFrame)
        post.on('menuAction',this.onMenuAction)
        post.on('stashLoaded',this.onStashLoaded)
        post.on('saveStash',this.saveStash)
        post.on('menu.init',(function (template)
        {
            var _55_54_, _55_76_

            return ((_55_54_=this.delegate) != null ? typeof (_55_76_=_55_54_.onWindowMenuTemplate) === "function" ? _55_76_(this,template) : undefined : undefined)
        }).bind(this))
        menuIcon = ((_57_38_=this.delegate.menuIcon) != null ? _57_38_ : kakao.bundle.img('menu.png'))
        menuNoon = ((_58_38_=this.delegate.menuNoon) != null ? _58_38_ : kakao.bundle.res('menu.noon'))
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
        ;((_83_17_=this.delegate) != null ? typeof (_83_34_=_83_17_.onWindowCreated) === "function" ? _83_34_(this) : undefined : undefined)
    }

    Win.prototype["restoreFromStash"] = async function ()
    {
        var list, old, _87_20_

        if (_k_.isFunc((this.delegate != null ? this.delegate.onWindowAboutToShow : undefined)))
        {
            await this.delegate.onWindowAboutToShow(this)
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
        var delta, fps, now, _119_17_, _119_40_

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            kakao("window.framerateDrop",fps)
        }
        return ((_119_17_=this.delegate) != null ? typeof (_119_40_=_119_17_.onWindowAnimationTick) === "function" ? _119_40_(this,{delta:delta,fps:fps,time:now}) : undefined : undefined)
    }

    Win.prototype["onResize"] = function (event)
    {
        var _121_35_, _121_51_

        return ((_121_35_=this.delegate) != null ? typeof (_121_51_=_121_35_.onWindowResize) === "function" ? _121_51_(this,event) : undefined : undefined)
    }

    Win.prototype["onWindowFocus"] = function ()
    {
        var _122_35_, _122_50_

        return ((_122_35_=this.delegate) != null ? typeof (_122_50_=_122_35_.onWindowFocus) === "function" ? _122_50_(this) : undefined : undefined)
    }

    Win.prototype["onWindowBlur"] = function ()
    {
        var _123_35_, _123_49_

        return ((_123_35_=this.delegate) != null ? typeof (_123_49_=_123_35_.onWindowBlur) === "function" ? _123_49_(this) : undefined : undefined)
    }

    Win.prototype["onWindowClose"] = function ()
    {
        var _124_79_, _124_94_

        if (this.saveStashOnClose)
        {
            post.emit('saveStash')
        }
        return ((_124_79_=this.delegate) != null ? typeof (_124_94_=_124_79_.onWindowClose) === "function" ? _124_94_(this) : undefined : undefined)
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
        var _139_27_, _139_47_

        if (((_139_27_=this.delegate) != null ? typeof (_139_47_=_139_27_.onWindowMenuAction) === "function" ? _139_47_(this,action) : undefined : undefined))
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
        var info, _182_21_, _182_38_

        info = keyinfo.forEvent(event)
        info.event = event
        stopEvent(event)
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            return ((_182_21_=this.delegate) != null ? typeof (_182_38_=_182_21_.onWindowKeyDown) === "function" ? _182_38_(this,info) : undefined : undefined)
        }
    }

    Win.prototype["onKeyUp"] = function (event)
    {
        var info, _189_17_, _189_32_

        info = keyinfo.forEvent(event)
        info.event = event
        return ((_189_17_=this.delegate) != null ? typeof (_189_32_=_189_17_.onWindowKeyUp) === "function" ? _189_32_(this,info) : undefined : undefined)
    }

    return Win
})()

export default Win;