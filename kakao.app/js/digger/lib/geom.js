var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var Geom

import * as three from 'three'
import material from "./material.js"


Geom = (function ()
{
    function Geom ()
    {}

    Geom["pill"] = function (cfg = {})
    {
        var bot, group, l, mat, mid, r, s, top, _17_23_, _18_23_, _19_21_, _27_27_

        l = ((_17_23_=cfg.length) != null ? _17_23_ : 1)
        r = ((_18_23_=cfg.radius) != null ? _18_23_ : 0.5)
        s = ((_19_21_=cfg.sgmt) != null ? _19_21_ : 8)
        top = new three.SphereGeometry(r,s,s / 2,0,2 * Math.PI,0,Math.PI / 2)
        top.translate(0,l / 2,0)
        mid = new three.CylinderGeometry(r,r,l,s,1,true)
        bot = new three.SphereGeometry(r,s,s / 2,0,2 * Math.PI,Math.PI / 2,Math.PI / 2)
        bot.translate(0,-l / 2,0)
        mat = ((_27_27_=cfg.material) != null ? _27_27_ : new three.MeshStandardMaterial)
        if (_k_.isStr(mat))
        {
            mat = material[mat]
        }
        group = new three.Group
        group.add(new three.Mesh(top,mat))
        group.add(new three.Mesh(mid,mat))
        group.add(new three.Mesh(bot,mat))
        if (cfg.pos)
        {
            group.translateX(cfg.pos.x)
            group.translateY(cfg.pos.y)
            group.translateZ(cfg.pos.z)
        }
        return group
    }

    return Geom
})()

export default Geom;