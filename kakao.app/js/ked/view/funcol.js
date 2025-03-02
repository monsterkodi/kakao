var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var funcol

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import color from "../util/color.js"
import theme from "../util/theme.js"
import util from "../util/util.js"

import view from "./view.js"
import crumbs from "./crumbs.js"


funcol = (function ()
{
    _k_.extend(funcol, view)
    function funcol (screen, name, features)
    {
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onFuncolToggle"] = this["onFuncolToggle"].bind(this)
        this["onFuncolResize"] = this["onFuncolResize"].bind(this)
        funcol.__super__.constructor.call(this,screen,name,features)
        post.on('funcol.resize',this.onFuncolResize)
        post.on('funcol.toggle',this.onFuncolToggle)
    }

    funcol.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        return funcol.__super__.draw.call(this)
    }

    funcol.prototype["onFuncolResize"] = function ()
    {
        return this.knob.doDrag = true
    }

    funcol.prototype["onFuncolToggle"] = function ()
    {
        return post.emit('view.size',this.name,[((this.hidden() ? this.knob.maxWidth : 0)),0])
    }

    funcol.prototype["onWheel"] = function (event)
    {
        if (this.hidden())
        {
            return
        }
    }

    funcol.prototype["onKey"] = function (key, event)
    {
        if (this.hidden())
        {
            return
        }
    }

    return funcol
})()

export default funcol;