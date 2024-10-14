var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var angle, fadeAngle, p2, Player

import * as three from 'three'
import kxk from "../kxk.js"
let deg2rad = kxk.deg2rad
let rad2deg = kxk.rad2deg
let fade = kxk.fade

import geom from "./lib/geom.js"

import polar from "./lib/polar.js"

import input from "./input.js"

p2 = new three.Vector2

angle = function (a, b)
{
    var r

    p2.x = -a.y
    p2.y = a.x
    r = a.angleTo(b)
    return (p2.dot(b) >= 0 ? r : -r)
}

fadeAngle = function (a, b, f)
{
    if (Math.abs(a - b) > Math.PI)
    {
        if (a > b)
        {
            b += 2 * Math.PI
        }
        else
        {
            b -= 2 * Math.PI
        }
    }
    if (a < b)
    {
        return Math.min(a + f,b)
    }
    else
    {
        return Math.max(a - f,b)
    }
}

Player = (function ()
{
    function Player (scene)
    {
        var child

        this.scene = scene
    
        this.input = new input(this)
        this.maxVel = 0.5
        this.friction = 0.98
        this.angle = 0
        this.mesh = geom.pill({length:2,radius:1,material:'white'})
        var list = _k_.list(this.mesh.children)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            child.castShadow = true
        }
        this.scene.scene.add(this.mesh)
        this.start()
        this.vec = new three.Vector3
        this.v2y = new three.Vector2(0,1)
        this.tqt = new three.Quaternion
        this.unitX = new three.Vector3(1,0,0)
        this.unitY = new three.Vector3(0,1,0)
        this.unitZ = new three.Vector3(0,0,1)
    }

    Player.prototype["start"] = function ()
    {
        this.vel = new three.Vector2
        this.polar = new polar({dist:50})
        return this.mesh.position.copy(this.polar.pos())
    }

    Player.prototype["startAction"] = function (action)
    {}

    Player.prototype["stopAction"] = function (action)
    {}

    Player.prototype["update"] = function (deltaSec)
    {
        var acc, deg

        deg = 10
        acc = [0,0]
        if (this.input.action.moveUp)
        {
            acc[1] += deg
        }
        if (this.input.action.moveDown)
        {
            acc[1] -= deg
        }
        if (this.input.action.moveRight)
        {
            acc[0] += deg
        }
        if (this.input.action.moveLeft)
        {
            acc[0] -= deg
        }
        if (this.dragAccel)
        {
            acc[0] += this.dragAccel.x
            acc[1] -= this.dragAccel.y
        }
        this.vel.x += deltaSec * acc[0]
        this.vel.y += deltaSec * acc[1]
        this.vel.x *= this.friction
        this.vel.y *= this.friction
        this.vel.clampLength(0,this.maxVel)
        this.polar.rotU(this.vel.x)
        this.polar.rotV(this.vel.y)
        this.mesh.position.copy(this.polar.pos())
        this.angle = fadeAngle(this.angle,angle(this.v2y,this.vel),deltaSec * 10)
        this.tqt.setFromAxisAngle(this.unitX,this.angle)
        this.mesh.quaternion.copy(this.polar.quat)
        return this.mesh.quaternion.multiply(this.tqt)
    }

    return Player
})()

export default Player;