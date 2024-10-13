var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var Delegate

import kakao from "../kakao.js"

import kxk from "../kxk.js"
let $ = kxk.$
let win = kxk.win
let fps = kxk.fps
let post = kxk.post
let elem = kxk.elem
let stopEvent = kxk.stopEvent

import world from "./world.js"
import three from "./three.js"

window.WIN_MIN_WIDTH = 400
window.WIN_MIN_HEIGHT = 400

Delegate = (function ()
{
    _k_.extend(Delegate, win.Delegate)
    function Delegate ()
    {
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onWindowResize"] = this["onWindowResize"].bind(this)
        this["onWindowCreated"] = this["onWindowCreated"].bind(this)
        this["onPause"] = this["onPause"].bind(this)
        this["onWindowAnimationTick"] = this["onWindowAnimationTick"].bind(this)
        this.menuNoon = kakao.bundle.res('menu_digger.noon')
        post.on('menuAction',this.onMenuAction)
        return Delegate.__super__.constructor.apply(this, arguments)
    }

    Delegate.prototype["onWindowAnimationTick"] = function (win, tickInfo)
    {
        if (!this.world)
        {
            return
        }
        return this.world.tick(tickInfo)
    }

    Delegate.prototype["onWindowWillShow"] = function ()
    {
        var main

        if (this.world)
        {
            return
        }
        main = $('main')
        window.three = new three(main)
        window.world = this.world = new world
        this.fps = new fps(main,{topDown:true})
        return post.on('pause',this.onPause)
    }

    Delegate.prototype["onPause"] = function ()
    {}

    Delegate.prototype["onWindowWithoutStash"] = function ()
    {
        kakao('window.setSize',window.WIN_MIN_WIDTH,window.WIN_MIN_HEIGHT)
        return kakao('window.center')
    }

    Delegate.prototype["onWindowCreated"] = function ()
    {
        return kakao('window.setMinSize',window.WIN_MIN_WIDTH,window.WIN_MIN_HEIGHT)
    }

    Delegate.prototype["onWindowResize"] = function ()
    {
        return post.emit('resize')
    }

    Delegate.prototype["onWindowKeyDown"] = function (keyInfo)
    {
        var quat, vec

        vec = window.three.vec
        quat = window.three.quat
        switch (keyInfo.combo)
        {
            case 'w':
                window.three.forwardSpeed += 0.1
                break
            case 's':
                window.three.forwardSpeed -= 0.1
                break
            case 'd':
                vec.set(0,1,0)
                quat.setFromAxisAngle(vec,-0.004)
                window.three.camera.quaternion.multiply(quat)
                break
            case 'a':
                vec.set(0,1,0)
                quat.setFromAxisAngle(vec,0.004)
                window.three.camera.quaternion.multiply(quat)
                break
            case 'q':
                vec.set(1,0,0)
                quat.setFromAxisAngle(vec,-0.004)
                window.three.camera.quaternion.multiply(quat)
                break
            case 'e':
                vec.set(1,0,0)
                quat.setFromAxisAngle(vec,0.004)
                window.three.camera.quaternion.multiply(quat)
                break
        }

        stopEvent(keyInfo.event)
        return 'unhandled'
    }

    Delegate.prototype["onWindowKeyUp"] = function (keyInfo)
    {
        stopEvent(keyInfo.event)
        return 'unhandled'
    }

    Delegate.prototype["onMenuAction"] = function (action, args)
    {
        switch (action)
        {
            case 'Zoom In':
                return this.world.zoom(1)

            case 'Zoom Out':
                return this.world.zoom(-1)

            case 'Pause':
                return this.world.togglePause()

            case 'Step':
                return this.world.singleStep()

            case 'Restart':
                return this.world.start()

        }

        return 'unhandled'
    }

    return Delegate
})()

kakao.init(function ()
{
    new win(new Delegate)
    return this
})