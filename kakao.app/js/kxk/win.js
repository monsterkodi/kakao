var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var Win

import dom from "./dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent

import elem from "./elem.js"

import post from "./post.js"

import title from "./title.js"

import prefs from "./prefs.js"

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
        return post.emit('saveStash')
    }
}


Win = (function ()
{
    function Win (delegate)
    {
        var main, menuIcon, menuNoon, _39_18_, _46_38_, _47_38_

        this.delegate = delegate
    
        this["onKeyUp"] = this["onKeyUp"].bind(this)
        this["onKeyDown"] = this["onKeyDown"].bind(this)
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onWindowClose"] = this["onWindowClose"].bind(this)
        this["onWindowBlur"] = this["onWindowBlur"].bind(this)
        this["onWindowFocus"] = this["onWindowFocus"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["animate"] = this["animate"].bind(this)
        window.prefs = prefs
        window.prefs.init()
        this.delegate = ((_39_18_=this.delegate) != null ? _39_18_ : new WinDelegate)
        post.on('menuAction',this.onMenuAction)
        post.on('window.blur',this.onWindowBlur)
        post.on('window.focus',this.onWindowFocus)
        post.on('window.close',this.onWindowClose)
        menuIcon = ((_46_38_=this.delegate.menuIcon) != null ? _46_38_ : kakao.bundle.img('menu.png'))
        menuNoon = ((_47_38_=this.delegate.menuNoon) != null ? _47_38_ : kakao.bundle.res('menu.noon'))
        window.titlebar = new title({icon:menuIcon,menu:menuNoon})
        window.addEventListener('keydown',this.onKeyDown)
        window.addEventListener('keyup',this.onKeyUp)
        window.addEventListener('resize',this.onResize)
        window.requestAnimationFrame(this.animate)
        main = $('main')
        main.focus()
        kakao.request('window.id').then((function (id)
        {
            var _67_21_, _67_38_

            this.id = id
        
            window.stash = new stash(`win/${this.id}`)
            ;((_67_21_=this.delegate) != null ? typeof (_67_38_=_67_21_.onWindowCreated) === "function" ? _67_38_(this) : undefined : undefined)
            return kakao.send('win.setMinSize',250,125)
        }).bind(this))
    }

    Win.prototype["saveStash"] = function ()
    {
        console.log('saveStash')
        post.emit('saveChanges')
        post.emit('stash')
        window.prefs.save()
        return window.stash.save()
    }

    Win.prototype["animate"] = function ()
    {
        var delta, fps, now, _92_17_, _92_40_

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            kakao.send("window.framerateDrop",fps)
        }
        return ((_92_17_=this.delegate) != null ? typeof (_92_40_=_92_17_.onWindowAnimationTick) === "function" ? _92_40_(this,{delta:delta,fps:fps,time:now}) : undefined : undefined)
    }

    Win.prototype["onResize"] = function (event)
    {
        var _94_34_, _94_50_

        return ((_94_34_=this.delegate) != null ? typeof (_94_50_=_94_34_.onWindowResize) === "function" ? _94_50_(this,event) : undefined : undefined)
    }

    Win.prototype["onWindowFocus"] = function ()
    {
        var _95_34_, _95_49_

        return ((_95_34_=this.delegate) != null ? typeof (_95_49_=_95_34_.onWindowFocus) === "function" ? _95_49_(this) : undefined : undefined)
    }

    Win.prototype["onWindowBlur"] = function ()
    {
        var _96_34_, _96_48_

        return ((_96_34_=this.delegate) != null ? typeof (_96_48_=_96_34_.onWindowBlur) === "function" ? _96_48_(this) : undefined : undefined)
    }

    Win.prototype["onWindowClose"] = function ()
    {
        var _97_48_, _97_63_

        this.saveStash()
        return ((_97_48_=this.delegate) != null ? typeof (_97_63_=_97_48_.onWindowClose) === "function" ? _97_63_(this) : undefined : undefined)
    }

    Win.prototype["onMenuAction"] = function (action)
    {
        var _107_27_, _107_47_

        if (((_107_27_=this.delegate) != null ? typeof (_107_47_=_107_27_.onWindowMenuAction) === "function" ? _107_47_(this,action) : undefined : undefined))
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
            case 'devtools':
                kakao.send('window.toggleInspector')
                break
            case 'quit':
                kakao.send('app.quit')
                break
            case 'open ...':
                kakao.send('window.new','ko.html')
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
        var info, _143_21_, _143_38_

        info = keyinfo.forEvent(event)
        info.event = event
        stopEvent(event)
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            return ((_143_21_=this.delegate) != null ? typeof (_143_38_=_143_21_.onWindowKeyDown) === "function" ? _143_38_(this,info) : undefined : undefined)
        }
    }

    Win.prototype["onKeyUp"] = function (event)
    {
        var info, _150_17_, _150_32_

        info = keyinfo.forEvent(event)
        info.event = event
        return ((_150_17_=this.delegate) != null ? typeof (_150_32_=_150_17_.onWindowKeyUp) === "function" ? _150_32_(this,info) : undefined : undefined)
    }

    return Win
})()

export default Win;