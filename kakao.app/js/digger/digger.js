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
import scene from "./scene.js"
import input from "./input.js"
import player from "./player.js"
import camera from "./camera.js"


Delegate = (function ()
{
    _k_.extend(Delegate, win.Delegate)
    function Delegate ()
    {
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onWindowKeyUp"] = this["onWindowKeyUp"].bind(this)
        this["onWindowKeyDown"] = this["onWindowKeyDown"].bind(this)
        this["onWindowResize"] = this["onWindowResize"].bind(this)
        this["onWindowCreated"] = this["onWindowCreated"].bind(this)
        this["onWindowWithoutStash"] = this["onWindowWithoutStash"].bind(this)
        this["onWindowWillShow"] = this["onWindowWillShow"].bind(this)
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
        main.focus()
        window.titlebar.hideMenu()
        this.scene = new scene(main)
        this.player = new player(this.scene)
        this.camera = new camera(this.scene,this.player)
        this.world = new world(this.scene,this.player,this.camera)
        this.player.input.init({moveLeft:['a','left'],moveRight:['d','right'],moveUp:['w','up'],moveDown:['s','down']})
        this.fps = new fps(main,{topDown:true})
        return this.world.start()
    }

    Delegate.prototype["onWindowWithoutStash"] = function ()
    {
        kakao('window.setSize',1920,1080)
        return kakao('window.center')
    }

    Delegate.prototype["onWindowCreated"] = function ()
    {
        return kakao('window.setMinSize',400,400)
    }

    Delegate.prototype["onWindowResize"] = function ()
    {
        return post.emit('resize')
    }

    Delegate.prototype["onWindowKeyDown"] = function (keyInfo)
    {
        this.player.input.onKeyDown(keyInfo)
        stopEvent(keyInfo.event)
        return 'unhandled'
    }

    Delegate.prototype["onWindowKeyUp"] = function (keyInfo)
    {
        this.player.input.onKeyUp(keyInfo)
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
    return new win(new Delegate)
})