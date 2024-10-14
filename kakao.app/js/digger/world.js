var world

import kxk from "../kxk.js"
let drag = kxk.drag
let stopEvent = kxk.stopEvent
let prefs = kxk.prefs
let post = kxk.post
let kpos = kxk.kpos
let fade = kxk.fade
let randRange = kxk.randRange
let randInt = kxk.randInt
let randIntRange = kxk.randIntRange

import tweaky from "./tweaky.js"


world = (function ()
{
    function world (scene, player, camera)
    {
        this.scene = scene
        this.player = player
        this.camera = camera
    
        this["singleStep"] = this["singleStep"].bind(this)
        this["togglePause"] = this["togglePause"].bind(this)
        this.pause = false
        this.speed = 10
        this.tweaky = new tweaky(this.scene.view)
        this.tweaky.init({speed:{min:1,max:100,step:1,value:this.speed,cb:(function (speed)
        {
            this.speed = speed
        }).bind(this)}})
    }

    world.prototype["start"] = function ()
    {
        this.camera.start()
        return this.player.start()
    }

    world.prototype["tick"] = function (tickInfo)
    {
        var _40_15_

        this.tickInfo = tickInfo
    
        this.simulate(this.tickInfo)
        return (this.tweaky != null ? this.tweaky.update() : undefined)
    }

    world.prototype["togglePause"] = function ()
    {
        this.pause = !this.pause
        return post.emit('pause')
    }

    world.prototype["simulate"] = function (tickInfo)
    {
        var sec

        if (this.pause && !this.oneStep)
        {
            return
        }
        if (isNaN(tickInfo.delta))
        {
            return
        }
        sec = this.speed * tickInfo.delta / 1000
        this.player.update(sec)
        return this.camera.update(sec)
    }

    world.prototype["singleStep"] = function ()
    {
        this.oneStep = true
        this.pause = true
        return post.emit('pause')
    }

    return world
})()

export default world;