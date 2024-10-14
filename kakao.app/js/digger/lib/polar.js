var Polar, tqt, unitX, unitY, unitZ, vec

import * as three from 'three'
import kxk from "../../kxk.js"
let deg2rad = kxk.deg2rad

import quat from "./quat.js"

vec = new three.Vector3
tqt = new three.Quaternion
unitX = new three.Vector3(1,0,0)
unitY = new three.Vector3(0,1,0)
unitZ = new three.Vector3(0,0,1)

Polar = (function ()
{
    Polar["zero"] = new Polar()
    Polar["pole"] = unitX
    function Polar (cfg = {})
    {
        var _35_25_

        this.quat = ((function ()
        {
            switch (cfg.dir)
            {
                case '-x':
                    return new quat(new three.Vector3(-1,0,0))

                case '-y':
                    return new quat(new three.Vector3(0,-1,0))

                case '-z':
                    return new quat(new three.Vector3(0,0,-1))

                case 'x':
                    return new quat(new three.Vector3(1,0,0))

                case 'y':
                    return new quat(new three.Vector3(0,1,0))

                default:
                    return new quat(new three.Vector3(0,0,1))
            }

        }).bind(this))()
        this.dist = ((_35_25_=cfg.dist) != null ? _35_25_ : 1)
    }

    Polar.prototype["rotU"] = function (deg)
    {
        vec.copy(unitY)
        tqt.setFromAxisAngle(vec,deg2rad(deg))
        this.quat.multiply(tqt)
        return this.quat.normalize()
    }

    Polar.prototype["rotV"] = function (deg)
    {
        vec.copy(unitZ)
        tqt.setFromAxisAngle(vec,deg2rad(deg))
        this.quat.multiply(tqt)
        return this.quat.normalize()
    }

    Polar.prototype["slerp"] = function (o, t)
    {
        return this.quat.slerp(o.quat,t)
    }

    Polar.prototype["up"] = function ()
    {
        vec.copy(unitY)
        vec.applyQuaternion(this.quat)
        return vec
    }

    Polar.prototype["pos"] = function ()
    {
        vec.copy(Polar.pole)
        vec.applyQuaternion(this.quat)
        vec.multiplyScalar(this.dist)
        return vec
    }

    return Polar
})()

export default Polar;