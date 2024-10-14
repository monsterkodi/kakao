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
        return this.polar = new polar({dist:150})
    }

    Camera.prototype["update"] = function (deltaSec)
    {
        this.polar.slerp(this.player.polar,deltaSec * 0.2)
        this.scene.camera.position.copy(this.polar.pos())
        this.scene.camera.up.copy(this.player.polar.up())
        return this.scene.camera.lookAt(0,0,0)
    }

    return Camera
})()

export default Camera;