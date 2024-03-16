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
        var main, menuIcon, menuNoon, _40_18_, _48_38_, _49_38_

        this.delegate = delegate
    
        this["onKeyUp"] = this["onKeyUp"].bind(this)
        this["onKeyDown"] = this["onKeyDown"].bind(this)
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onWindowFrame"] = this["onWindowFrame"].bind(this)
        this["onWindowClose"] = this["onWindowClose"].bind(this)
        this["onWindowBlur"] = this["onWindowBlur"].bind(this)
        this["onWindowFocus"] = this["onWindowFocus"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["animate"] = this["animate"].bind(this)
        window.prefs = prefs
        window.prefs.init()
        this.delegate = ((_40_18_=this.delegate) != null ? _40_18_ : new WinDelegate)
        post.on('menuAction',this.onMenuAction)
        post.on('window.blur',this.onWindowBlur)
        post.on('window.focus',this.onWindowFocus)
        post.on('window.close',this.onWindowClose)
        post.on('window.frame',this.onWindowFrame)
        menuIcon = ((_48_38_=this.delegate.menuIcon) != null ? _48_38_ : kakao.bundle.img('menu.png'))
        menuNoon = ((_49_38_=this.delegate.menuNoon) != null ? _49_38_ : kakao.bundle.res('menu.noon'))
        window.titlebar = new title({icon:menuIcon,menu:menuNoon})
        window.addEventListener('keydown',this.onKeyDown)
        window.addEventListener('keyup',this.onKeyUp)
        window.addEventListener('resize',this.onResize)
        window.requestAnimationFrame(this.animate)
        main = $('main')
        main.focus()
        kakao.request('window.id').then((function (id)
        {
            var _78_21_, _78_38_

            this.id = id
        
            window.stash = new stash(`win/${this.id}`)
            ffs.list(kakao.bundle.app('.stash/old')).then((function (list)
            {
                var old

                if (!_k_.empty(list))
                {
                    old = list.shift()
                    return window.stash.load(old.path).then(function ()
                    {
                        return ffs.remove(old.path)
                    })
                }
            }).bind(this))
            kakao.request('win.frameInfo').then(function (info)
            {
                console.log('frameInfo',info)
            })
            ;((_78_21_=this.delegate) != null ? typeof (_78_38_=_78_21_.onWindowCreated) === "function" ? _78_38_(this) : undefined : undefined)
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
        var delta, fps, now, _103_17_, _103_40_

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            kakao.send("window.framerateDrop",fps)
        }
        return ((_103_17_=this.delegate) != null ? typeof (_103_40_=_103_17_.onWindowAnimationTick) === "function" ? _103_40_(this,{delta:delta,fps:fps,time:now}) : undefined : undefined)
    }

    Win.prototype["onResize"] = function (event)
    {
        var _105_35_, _105_51_

        return ((_105_35_=this.delegate) != null ? typeof (_105_51_=_105_35_.onWindowResize) === "function" ? _105_51_(this,event) : undefined : undefined)
    }

    Win.prototype["onWindowFocus"] = function ()
    {
        var _106_35_, _106_50_

        return ((_106_35_=this.delegate) != null ? typeof (_106_50_=_106_35_.onWindowFocus) === "function" ? _106_50_(this) : undefined : undefined)
    }

    Win.prototype["onWindowBlur"] = function ()
    {
        var _107_35_, _107_49_

        return ((_107_35_=this.delegate) != null ? typeof (_107_49_=_107_35_.onWindowBlur) === "function" ? _107_49_(this) : undefined : undefined)
    }

    Win.prototype["onWindowClose"] = function ()
    {
        var _108_49_, _108_64_

        this.saveStash()
        return ((_108_49_=this.delegate) != null ? typeof (_108_64_=_108_49_.onWindowClose) === "function" ? _108_64_(this) : undefined : undefined)
    }

    Win.prototype["onWindowFrame"] = function (i)
    {
        console.log('onWindowFrame',i)
    }

    Win.prototype["onMenuAction"] = function (action)
    {
        var _119_27_, _119_47_

        if (((_119_27_=this.delegate) != null ? typeof (_119_47_=_119_27_.onWindowMenuAction) === "function" ? _119_47_(this,action) : undefined : undefined))
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
                window.stash.clear()
                kakao.send('window.close')
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
        var info, _157_21_, _157_38_

        info = keyinfo.forEvent(event)
        info.event = event
        stopEvent(event)
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            return ((_157_21_=this.delegate) != null ? typeof (_157_38_=_157_21_.onWindowKeyDown) === "function" ? _157_38_(this,info) : undefined : undefined)
        }
    }

    Win.prototype["onKeyUp"] = function (event)
    {
        var info, _164_17_, _164_32_

        info = keyinfo.forEvent(event)
        info.event = event
        return ((_164_17_=this.delegate) != null ? typeof (_164_32_=_164_17_.onWindowKeyUp) === "function" ? _164_32_(this,info) : undefined : undefined)
    }

    return Win
})()

export default Win;