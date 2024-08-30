var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var world

import kxk from "../kxk.js"
let $ = kxk.$
let drag = kxk.drag
let stopEvent = kxk.stopEvent
let randInt = kxk.randInt
let randRange = kxk.randRange
let randIntRange = kxk.randIntRange
let elem = kxk.elem
let prefs = kxk.prefs
let post = kxk.post

import tweaky from "./tweaky.js"
import gee from "./gee.js"


world = (function ()
{
    function world ()
    {
        this["singleStep"] = this["singleStep"].bind(this)
        this["toggleValues"] = this["toggleValues"].bind(this)
        this["togglePause"] = this["togglePause"].bind(this)
        this["onContextMenu"] = this["onContextMenu"].bind(this)
        this["onDrag"] = this["onDrag"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this.main = $('main')
        this.pause = false
        this.g = new gee(this.main)
        this.tweaky = new tweaky(this.main)
        this.tweaky.init({side:{min:10,max:200,step:1,value:this.g.side,cb:this.g.setSide}})
        window.addEventListener('wheel',this.onWheel)
        this.main.addEventListener('contextmenu',this.onContextMenu)
        this.g.canvas.addEventListener('touchstart',this.onTouchStart)
        this.g.canvas.addEventListener('touchmove',this.onTouchMove)
        this.drag = new drag({target:this.g.canvas,onMove:this.onDrag,cursor:'pointer'})
    }

    world.prototype["onWheel"] = function (event)
    {
        if (event.ctrlKey)
        {
            this.g.camScale -= event.deltaY / 1000
            this.g.camScale = _k_.clamp(0.01,0.2,this.g.camScale)
        }
        else
        {
            this.g.camPosX += event.deltaX / 4000
            this.g.camPosY -= event.deltaY / 4000
        }
        this.g.camPosX = _k_.clamp(-this.g.side * this.g.aspect / 2 * this.g.camScale,this.g.side * this.g.aspect / 2 * this.g.camScale,this.g.camPosX)
        return this.g.camPosY = _k_.clamp(-this.g.side / 2 * this.g.camScale,this.g.side / 2 * this.g.camScale,this.g.camPosY)
    }

    world.prototype["onDrag"] = function (drag, event)
    {}

    world.prototype["onContextMenu"] = function (event)
    {
        return stopEvent(event)
    }

    world.prototype["togglePause"] = function ()
    {
        this.pause = !this.pause
        return post.emit('pause')
    }

    world.prototype["toggleValues"] = function ()
    {}

    world.prototype["simulate"] = function ()
    {
        if (this.pause && !this.oneStep)
        {
            return
        }
        return delete this.oneStep
    }

    world.prototype["singleStep"] = function ()
    {
        this.oneStep = true
        this.pause = true
        return post.emit('pause')
    }

    world.prototype["tick"] = function (tickInfo)
    {
        this.tickInfo = tickInfo
    
        return this.g.draw(this.tickInfo.time)
    }

    return world
})()

export default world;