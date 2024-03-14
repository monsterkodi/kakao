var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var Win

import dom from "./dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent

import elem from "./elem.js"

import post from "./post.js"

import title from "./title.js"

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
        var main, menuIcon, menuNoon, _35_18_, _42_38_, _43_38_

        this.delegate = delegate
    
        this["onKeyUp"] = this["onKeyUp"].bind(this)
        this["onKeyDown"] = this["onKeyDown"].bind(this)
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onWindowClose"] = this["onWindowClose"].bind(this)
        this["onWindowBlur"] = this["onWindowBlur"].bind(this)
        this["onWindowFocus"] = this["onWindowFocus"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["animate"] = this["animate"].bind(this)
        this.delegate = ((_35_18_=this.delegate) != null ? _35_18_ : new WinDelegate)
        post.on('menuAction',this.onMenuAction)
        post.on('window.blur',this.onWindowBlur)
        post.on('window.focus',this.onWindowFocus)
        post.on('window.close',this.onWindowClose)
        menuIcon = ((_42_38_=this.delegate.menuIcon) != null ? _42_38_ : kakao.bundle.img('menu.png'))
        menuNoon = ((_43_38_=this.delegate.menuNoon) != null ? _43_38_ : kakao.bundle.res('menu.noon'))
        window.titlebar = new title({icon:menuIcon,menu:menuNoon})
        window.addEventListener('keydown',this.onKeyDown)
        window.addEventListener('keyup',this.onKeyUp)
        window.addEventListener('resize',this.onResize)
        window.requestAnimationFrame(this.animate)
        main = $('main')
        main.focus()
        kakao.request('window.id').then((function (id)
        {
            var _62_21_, _62_38_

            this.id = id
        
            window.stash = new stash(`win/${this.id}`,{separator:'|'})
            ;((_62_21_=this.delegate) != null ? typeof (_62_38_=_62_21_.onWindowCreated) === "function" ? _62_38_(this) : undefined : undefined)
            return kakao.send('win.setMinSize',250,125)
        }).bind(this))
    }

    Win.prototype["saveStash"] = function ()
    {
        console.log('saveStash')
        post.emit('saveChanges')
        post.emit('stash')
        return window.stash.save()
    }

    Win.prototype["animate"] = function ()
    {
        var delta, fps, now, _86_17_, _86_40_

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            kakao.send("window.framerateDrop",fps)
        }
        return ((_86_17_=this.delegate) != null ? typeof (_86_40_=_86_17_.onWindowAnimationTick) === "function" ? _86_40_(this,{delta:delta,fps:fps,time:now}) : undefined : undefined)
    }

    Win.prototype["onResize"] = function (event)
    {
        var _88_34_, _88_50_

        return ((_88_34_=this.delegate) != null ? typeof (_88_50_=_88_34_.onWindowResize) === "function" ? _88_50_(this,event) : undefined : undefined)
    }

    Win.prototype["onWindowFocus"] = function ()
    {
        var _89_34_, _89_49_

        return ((_89_34_=this.delegate) != null ? typeof (_89_49_=_89_34_.onWindowFocus) === "function" ? _89_49_(this) : undefined : undefined)
    }

    Win.prototype["onWindowBlur"] = function ()
    {
        var _90_34_, _90_48_

        return ((_90_34_=this.delegate) != null ? typeof (_90_48_=_90_34_.onWindowBlur) === "function" ? _90_48_(this) : undefined : undefined)
    }

    Win.prototype["onWindowClose"] = function ()
    {
        var _91_48_, _91_63_

        this.saveStash()
        return ((_91_48_=this.delegate) != null ? typeof (_91_63_=_91_48_.onWindowClose) === "function" ? _91_63_(this) : undefined : undefined)
    }

    Win.prototype["onMenuAction"] = function (action)
    {
        var _101_27_, _101_47_

        if (((_101_27_=this.delegate) != null ? typeof (_101_47_=_101_27_.onWindowMenuAction) === "function" ? _101_47_(this,action) : undefined : undefined))
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
        var info, _137_21_, _137_38_

        info = keyinfo.forEvent(event)
        info.event = event
        stopEvent(event)
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            return ((_137_21_=this.delegate) != null ? typeof (_137_38_=_137_21_.onWindowKeyDown) === "function" ? _137_38_(this,info) : undefined : undefined)
        }
    }

    Win.prototype["onKeyUp"] = function (event)
    {
        var info, _144_17_, _144_32_

        info = keyinfo.forEvent(event)
        info.event = event
        return ((_144_17_=this.delegate) != null ? typeof (_144_32_=_144_17_.onWindowKeyUp) === "function" ? _144_32_(this,info) : undefined : undefined)
    }

    return Win
})()

export default Win;