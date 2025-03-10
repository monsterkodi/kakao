var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var funcol

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import knob from "../base/knob.js"
import crumbs from "../base/crumbs.js"

import dirtree from "./dirtree.js"


funcol = (function ()
{
    _k_.extend(funcol, view)
    function funcol (screen, name, features)
    {
        var root

        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onFuncolToggle"] = this["onFuncolToggle"].bind(this)
        this["onFuncolResize"] = this["onFuncolResize"].bind(this)
        this["setRoot"] = this["setRoot"].bind(this)
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        this["onCrumbsAction"] = this["onCrumbsAction"].bind(this)
        funcol.__super__.constructor.call(this,screen,name,features)
        this.pointerType = 'pointer'
        this.knob = new knob(screen,`${this.name}_knob`)
        this.crumbs = new crumbs(screen,`${this.name}_crumbs`)
        this.dirtree = new dirtree(screen,`${this.name}_dirtree`,['scroll'])
        this.crumbs.on('action',this.onCrumbsAction)
        this.dirtree.color.bg = theme.funcol
        this.dirtree.color.empty = this.dirtree.color.bg
        this.dirtree.color.cursor_main = this.dirtree.color.bg
        this.dirtree.color.cursor_empty = this.dirtree.color.bg
        this.dirtree.scroll.color.bg = this.dirtree.color.bg
        post.on('funcol.resize',this.onFuncolResize)
        post.on('funcol.toggle',this.onFuncolToggle)
        post.on('funcol.root',this.setRoot)
        post.on('session.merge',this.onSessionMerge)
        root = ked_session.get('funcol▸root',process.cwd())
        this.setRoot(root)
    }

    funcol.prototype["onCrumbsAction"] = function (action, path)
    {
        if (action === 'click')
        {
            return this.setRoot(path)
        }
    }

    funcol.prototype["onSessionMerge"] = function (recent)
    {
        var root

        if (_k_.empty(recent.funcol))
        {
            return
        }
        if (root = recent.funcol.root)
        {
            return this.setRoot(root)
        }
    }

    funcol.prototype["setRoot"] = function (path)
    {
        if (_k_.empty(path))
        {
            return
        }
        path = slash.tilde(path)
        this.crumbs.set(path)
        this.dirtree.setRoot(path,{redraw:true})
        return ked_session.set('funcol▸root',path)
    }

    funcol.prototype["layout"] = function (x, y, w, h)
    {
        this.crumbs.layout(x,y,w,1)
        this.dirtree.layout(x,y + 1,w,h - 1)
        this.knob.layout(x + w - 1,y + 1,1,h - 1)
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
        this.knob.draw()
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
        var ret

        ret = funcol.__super__.onMouse.call(this,event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.knob.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.crumbs.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.dirtree.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
    }

    funcol.prototype["onWheel"] = function (event)
    {
        if (this.hidden())
        {
            return
        }
        return this.dirtree.onWheel(event)
    }

    funcol.prototype["onKey"] = function (key, event)
    {
        if (!this.dirtree.hasFocus())
        {
            return
        }
        switch (key)
        {
            case 'cmd+left':
            case 'ctrl+left':
                return this.setRoot(slash.dir(this.dirtree.currentRoot))

        }

        return this.dirtree.onKey(key,event)
    }

    return funcol
})()

export default funcol;