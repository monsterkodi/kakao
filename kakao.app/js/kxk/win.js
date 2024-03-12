var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var $, stopEvent, Win

import dom from "./dom.js"

import elem from "./elem.js"

import post from "./post.js"

import title from "./title.js"

import keyinfo from "./keyinfo.js"

$ = dom.$
stopEvent = dom.stopEvent

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
}


Win = (function ()
{
    function Win (delegate)
    {
        var main, menuIcon, menuNoon, _35_18_, _41_38_, _42_38_

        this.delegate = delegate
    
        this["onKeyUp"] = this["onKeyUp"].bind(this)
        this["onKeyDown"] = this["onKeyDown"].bind(this)
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onWindowBlur"] = this["onWindowBlur"].bind(this)
        this["onWindowFocus"] = this["onWindowFocus"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["animate"] = this["animate"].bind(this)
        this.delegate = ((_35_18_=this.delegate) != null ? _35_18_ : new WinDelegate)
        post.on('menuAction',this.onMenuAction)
        post.on('window.blur',this.onWindowBlur)
        post.on('window.focus',this.onWindowFocus)
        menuIcon = ((_41_38_=this.delegate.menuIcon) != null ? _41_38_ : kakao.bundle.img('menu.png'))
        menuNoon = ((_42_38_=this.delegate.menuNoon) != null ? _42_38_ : kakao.bundle.res('menu.noon'))
        window.titlebar = new title({icon:menuIcon,menu:menuNoon})
        window.addEventListener('keydown',this.onKeyDown)
        window.addEventListener('keyup',this.onKeyUp)
        window.addEventListener('resize',this.onResize)
        window.requestAnimationFrame(this.animate)
        main = $('main')
        main.focus()
        kakao.request('window.id').then((function (id)
        {
            var _59_21_, _59_38_

            this.id = id
        
            ;((_59_21_=this.delegate) != null ? typeof (_59_38_=_59_21_.onWindowCreated) === "function" ? _59_38_(this) : undefined : undefined)
            return kakao.send('win.setMinSize',250,125)
        }).bind(this))
    }

    Win.prototype["animate"] = function ()
    {
        var delta, fps, now, _75_17_, _75_40_

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            kakao.send("window.framerateDrop",fps)
        }
        return ((_75_17_=this.delegate) != null ? typeof (_75_40_=_75_17_.onWindowAnimationTick) === "function" ? _75_40_(this,{delta:delta,fps:fps,time:now}) : undefined : undefined)
    }

    Win.prototype["onResize"] = function (event)
    {
        var _77_34_, _77_50_

        return ((_77_34_=this.delegate) != null ? typeof (_77_50_=_77_34_.onWindowResize) === "function" ? _77_50_(this,event) : undefined : undefined)
    }

    Win.prototype["onWindowFocus"] = function ()
    {
        var _78_34_, _78_49_

        return ((_78_34_=this.delegate) != null ? typeof (_78_49_=_78_34_.onWindowFocus) === "function" ? _78_49_(this) : undefined : undefined)
    }

    Win.prototype["onWindowBlur"] = function ()
    {
        var _79_34_, _79_48_

        return ((_79_34_=this.delegate) != null ? typeof (_79_48_=_79_34_.onWindowBlur) === "function" ? _79_48_(this) : undefined : undefined)
    }

    Win.prototype["onMenuAction"] = function (action)
    {
        var _89_27_, _89_47_

        if (((_89_27_=this.delegate) != null ? typeof (_89_47_=_89_27_.onWindowMenuAction) === "function" ? _89_47_(this,action) : undefined : undefined))
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
        var info, _125_21_, _125_38_

        info = keyinfo.forEvent(event)
        info.event = event
        stopEvent(event)
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            return ((_125_21_=this.delegate) != null ? typeof (_125_38_=_125_21_.onWindowKeyDown) === "function" ? _125_38_(this,info) : undefined : undefined)
        }
    }

    Win.prototype["onKeyUp"] = function (event)
    {
        var info, _132_17_, _132_32_

        info = keyinfo.forEvent(event)
        info.event = event
        return ((_132_17_=this.delegate) != null ? typeof (_132_32_=_132_17_.onWindowKeyUp) === "function" ? _132_32_(this,info) : undefined : undefined)
    }

    return Win
})()

export default Win;