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

import noise from "./lib/noise.js"

import tweaky from "./tweaky.js"
import swarm from "./swarm.js"
import weed from "./weed.js"


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
        if (1)
        {
            this.tweaky = new tweaky(this.scene.view)
            this.tweaky.init({seed:{min:1,max:100,step:1,value:0,cb:(function (v)
            {
                noise.seed(v)
                return this.start()
            }).bind(this)},axes:{value:1,cb:(function (v)
            {
                return this.scene.axesHelper.visible = v
            }).bind(this)}})
        }
        this.swarm = new swarm(this.scene,this.player)
        this.weed = new weed(this.scene)
    }

    world.prototype["start"] = function ()
    {
        this.scene.start()
        this.camera.start()
        this.player.start()
        this.weed.spawn()
        return this.swarm.spawn()
    }

    world.prototype["tick"] = function (tickInfo)
    {
        var _47_15_

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
        if (isNaN(this.scene.clockDelta))
        {
            return
        }
        sec = 1 / 60
        this.player.update(sec)
        this.camera.update(sec)
        this.swarm.update(sec,tickInfo)
        return this.weed.update(sec,tickInfo)
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