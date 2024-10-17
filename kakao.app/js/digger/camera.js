var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Camera

import polar from "./lib/polar.js"


Camera = (function ()
{
    function Camera (scene, player)
    {
        this.scene = scene
        this.player = player
    
        this.start()
    }

    Camera.prototype["start"] = function ()
    {
        this.polar = new polar({dist:150})
        return this.polar.rotU(-90)
    }

    Camera.prototype["update"] = function (deltaSec)
    {
        this.polar.slerp(this.player.polar,deltaSec * 2)
        this.scene.camera.position.copy(this.polar.pos())
        this.scene.camera.up.copy(this.player.polar.up())
        return this.scene.camera.lookAt(0,0,0)
    }

    Camera.prototype["zoom"] = function (delta)
    {
        return this.polar.dist = _k_.clamp(80,160,this.polar.dist * (1.0 - delta / 100))
    }

    return Camera
})()

export default Camera;