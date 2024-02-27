// monsterkodi/kode 0.256.0

var _k_

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
        console.log(`onWindowCreated ${win.id}`)
    }

    onWindowAnimationTick (win, tickInfo)
    {
        if (tickInfo.fps < 20)
        {
            console.log("onWindowAnimationTick",tickInfo)
        }
    }

    onWindowResize (win, event)
    {
        console.log("onWindowResize",event)
    }

    onWindowFocus (win)
    {
        console.log("onWindowFocus")
    }

    onWindowBlur (win)
    {
        console.log("onWindowBlur")
    }

    onWindowKeyDown (win, keyInfo)
    {
        console.log("onWindowKeyDownEvent",keyInfo)
    }

    onWindowKeyUp (win, keyInfo)
    {
        console.log("onWindowKeyUpEvent",keyInfo)
    }
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

    Win.prototype["createWindow"] = function ()
    {}

    Win.prototype["onResize"] = function (event)
    {
        var _74_34_, _74_50_

        return ((_74_34_=this.delegate) != null ? typeof (_74_50_=_74_34_.onWindowResize) === "function" ? _74_50_(this,event) : undefined : undefined)
    }

    Win.prototype["onWindowFocus"] = function ()
    {
        var _76_31_, _76_46_

        return ((_76_31_=this.delegate) != null ? typeof (_76_46_=_76_31_.onWindowFocus) === "function" ? _76_46_(this) : undefined : undefined)
    }

    Win.prototype["onWindowBlur"] = function ()
    {
        var _77_31_, _77_45_

        return ((_77_31_=this.delegate) != null ? typeof (_77_45_=_77_31_.onWindowBlur) === "function" ? _77_45_(this) : undefined : undefined)
    }

    Win.prototype["onMenuAction"] = function (action)
    {
        var _87_27_, _87_47_

        if (((_87_27_=this.delegate) != null ? typeof (_87_47_=_87_27_.onWindowMenuAction) === "function" ? _87_47_(this,action) : undefined : undefined))
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
        var info, _118_21_, _118_38_

        stopEvent(event)
        info = keyinfo.forEvent(event)
        info.event = event
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            return ((_118_21_=this.delegate) != null ? typeof (_118_38_=_118_21_.onWindowKeyDown) === "function" ? _118_38_(this,info) : undefined : undefined)
        }
    }

    Win.prototype["onKeyUp"] = function (event)
    {
        var info, _125_17_, _125_32_

        info = keyinfo.forEvent(event)
        info.event = event
        return ((_125_17_=this.delegate) != null ? typeof (_125_32_=_125_17_.onWindowKeyUp) === "function" ? _125_32_(this,info) : undefined : undefined)
    }

    return Win
})()

export default Win;