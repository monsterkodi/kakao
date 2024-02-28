// monsterkodi/kode 0.256.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var $, stopEvent, Win

import dom from './dom.js'
import elem from './elem.js'
import post from './post.js'
import keyinfo from './keyinfo.js'
import Title from './title.js'
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
        var main, _35_18_

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
        window.titlebar = new Title({icon:kakao.bundle.img('menu.png'),menu:kakao.bundle.res('menu.noon')})
        window.addEventListener('keydown',this.onKeyDown)
        window.addEventListener('keyup',this.onKeyUp)
        window.addEventListener('resize',this.onResize)
        window.requestAnimationFrame(this.animate)
        main = $('main')
        main.focus()
        kakao.request('window.id').then((function (id)
        {
            var _56_21_, _56_38_

            this.id = id
        
            elem({class:'test',text:"▪▸○!▴!○◂▪",parent:main})
            elem({class:'test',text:`${id}`,parent:main})
            return ((_56_21_=this.delegate) != null ? typeof (_56_38_=_56_21_.onWindowCreated) === "function" ? _56_38_(this) : undefined : undefined)
        }).bind(this))
    }

    Win.prototype["animate"] = function ()
    {
        var delta, fps, now, _70_17_, _70_40_

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            kakao.send("window.framerateDrop",fps)
        }
        return ((_70_17_=this.delegate) != null ? typeof (_70_40_=_70_17_.onWindowAnimationTick) === "function" ? _70_40_(this,{delta:delta,fps:fps,time:now}) : undefined : undefined)
    }

    Win.prototype["onResize"] = function (event)
    {
        var _72_34_, _72_50_

        return ((_72_34_=this.delegate) != null ? typeof (_72_50_=_72_34_.onWindowResize) === "function" ? _72_50_(this,event) : undefined : undefined)
    }

    Win.prototype["onWindowFocus"] = function ()
    {
        var _73_34_, _73_49_

        return ((_73_34_=this.delegate) != null ? typeof (_73_49_=_73_34_.onWindowFocus) === "function" ? _73_49_(this) : undefined : undefined)
    }

    Win.prototype["onWindowBlur"] = function ()
    {
        var _74_34_, _74_48_

        return ((_74_34_=this.delegate) != null ? typeof (_74_48_=_74_34_.onWindowBlur) === "function" ? _74_48_(this) : undefined : undefined)
    }

    Win.prototype["onMenuAction"] = function (action)
    {
        var _84_27_, _84_47_

        if (((_84_27_=this.delegate) != null ? typeof (_84_47_=_84_27_.onWindowMenuAction) === "function" ? _84_47_(this,action) : undefined : undefined))
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
            case 'quit':
                kakao.send('app.quit')
                break
            case 'about':
                kakao.send('window.new','about.html')
                break
        }

        return 0
    }

    Win.prototype["onKeyDown"] = function (event)
    {
        var info, _114_21_, _114_38_

        info = keyinfo.forEvent(event)
        info.event = event
        stopEvent(event)
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            return ((_114_21_=this.delegate) != null ? typeof (_114_38_=_114_21_.onWindowKeyDown) === "function" ? _114_38_(this,info) : undefined : undefined)
        }
    }

    Win.prototype["onKeyUp"] = function (event)
    {
        var info, _121_17_, _121_32_

        info = keyinfo.forEvent(event)
        info.event = event
        return ((_121_17_=this.delegate) != null ? typeof (_121_32_=_121_17_.onWindowKeyUp) === "function" ? _121_32_(this,info) : undefined : undefined)
    }

    return Win
})()

export default Win;