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
import dirtree from "./dirtree.js"


funcol = (function ()
{
    _k_.extend(funcol, view)
    function funcol (screen, name, features)
    {
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onFuncolToggle"] = this["onFuncolToggle"].bind(this)
        this["onFuncolResize"] = this["onFuncolResize"].bind(this)
        funcol.__super__.constructor.call(this,screen,name,features)
        this.crumbs = new crumbs(screen,`${this.name}_crumbs`)
        this.dirtree = new dirtree(screen,`${this.name}_dirtree`)
        this.dirtree.color.bg = theme.funcol
        post.on('funcol.resize',this.onFuncolResize)
        post.on('funcol.toggle',this.onFuncolToggle)
        this.setRoot(process.cwd())
    }

    funcol.prototype["setRoot"] = function (path)
    {
        path = slash.tilde(path)
        this.crumbs.set(path)
        return this.dirtree.setRoot(path)
    }

    funcol.prototype["layout"] = function (x, y, w, h)
    {
        this.crumbs.layout(x,y,w,1)
        this.dirtree.layout(x,y + 1,w,h - 1)
        return funcol.__super__.layout.call(this,x,y,w,h)
    }

    funcol.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,theme.funcol)
        this.crumbs.draw()
        this.dirtree.draw()
        return funcol.__super__.draw.call(this)
    }

    funcol.prototype["onFuncolResize"] = function ()
    {
        return this.knob.doDrag = true
    }

    funcol.prototype["onFuncolToggle"] = function ()
    {
        return post.emit('view.size',this.name,[((this.hidden() ? parseInt(this.knob.maxWidth / 3) : 0)),0])
    }

    funcol.prototype["onMouse"] = function (event)
    {
        if (funcol.__super__.onMouse.call(this,event))
        {
            return true
        }
        if (this.crumbs.onMouse(event))
        {
            return true
        }
        if (this.dirtree.onMouse(event))
        {
            return true
        }
    }

    funcol.prototype["onWheel"] = function (event)
    {
        if (this.hidden())
        {
            return
        }
        if (this.dirtree.onWheel(event))
        {
            return true
        }
    }

    funcol.prototype["onKey"] = function (key, event)
    {
        if (this.hidden())
        {
            return
        }
        if (this.dirtree.onKey(key,event))
        {
            return true
        }
    }

    return funcol
})()

export default funcol;