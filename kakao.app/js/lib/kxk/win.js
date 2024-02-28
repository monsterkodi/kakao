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
        window.titlebar = new Title({menu:kakao.bundle.res('menu.noon')})
        window.addEventListener('keydown',this.onKeyDown)
        window.addEventListener('keyup',this.onKeyUp)
        window.addEventListener('resize',this.onResize)
        window.requestAnimationFrame(this.animate)
        main = $('main')
        main.focus()
        kakao.request('window.id').then((function (id)
        {
            var _57_21_, _57_38_

            this.id = id
        
            elem({class:'test',text:"▪▸○!▴!○◂▪",parent:main})
            elem({class:'test',text:`${id}`,parent:main})
            return ((_57_21_=this.delegate) != null ? typeof (_57_38_=_57_21_.onWindowCreated) === "function" ? _57_38_(this) : undefined : undefined)
        }).bind(this))
    }

    Win.prototype["animate"] = function ()
    {
        var delta, fps, now, _71_17_, _71_40_

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            kakao.send("window.framerateDrop",fps)
        }
        return ((_71_17_=this.delegate) != null ? typeof (_71_40_=_71_17_.onWindowAnimationTick) === "function" ? _71_40_(this,{delta:delta,fps:fps,time:now}) : undefined : undefined)
    }

    Win.prototype["onResize"] = function (event)
    {
        var _73_34_, _73_50_

        return ((_73_34_=this.delegate) != null ? typeof (_73_50_=_73_34_.onWindowResize) === "function" ? _73_50_(this,event) : undefined : undefined)
    }

    Win.prototype["onWindowFocus"] = function ()
    {
        var _74_34_, _74_49_

        return ((_74_34_=this.delegate) != null ? typeof (_74_49_=_74_34_.onWindowFocus) === "function" ? _74_49_(this) : undefined : undefined)
    }

    Win.prototype["onWindowBlur"] = function ()
    {
        var _75_34_, _75_48_

        return ((_75_34_=this.delegate) != null ? typeof (_75_48_=_75_34_.onWindowBlur) === "function" ? _75_48_(this) : undefined : undefined)
    }

    Win.prototype["onMenuAction"] = function (action)
    {
        var _85_27_, _85_47_

        if (((_85_27_=this.delegate) != null ? typeof (_85_47_=_85_27_.onWindowMenuAction) === "function" ? _85_47_(this,action) : undefined : undefined))
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
        var info, _115_21_, _115_38_

        info = keyinfo.forEvent(event)
        info.event = event
        stopEvent(event)
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            return ((_115_21_=this.delegate) != null ? typeof (_115_38_=_115_21_.onWindowKeyDown) === "function" ? _115_38_(this,info) : undefined : undefined)
        }
    }

    Win.prototype["onKeyUp"] = function (event)
    {
        var info, _122_17_, _122_32_

        info = keyinfo.forEvent(event)
        info.event = event
        return ((_122_17_=this.delegate) != null ? typeof (_122_32_=_122_17_.onWindowKeyUp) === "function" ? _122_32_(this,info) : undefined : undefined)
    }

    return Win
})()

export default Win;