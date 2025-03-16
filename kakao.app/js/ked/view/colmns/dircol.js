var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var dircol

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import knob from "../base/knob.js"
import crumbs from "../base/crumbs.js"

import dirtree from "./dirtree.js"


dircol = (function ()
{
    _k_.extend(dircol, view)
    function dircol (screen, name, features)
    {
        var root

        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onDircolToggle"] = this["onDircolToggle"].bind(this)
        this["onDircolResize"] = this["onDircolResize"].bind(this)
        this["onContext"] = this["onContext"].bind(this)
        this["setRoot"] = this["setRoot"].bind(this)
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        this["onCrumbsAction"] = this["onCrumbsAction"].bind(this)
        dircol.__super__.constructor.call(this,screen,name,features)
        this.pointerType = 'pointer'
        this.knob = new knob(screen,`${this.name}_knob`)
        this.crumbs = new crumbs(screen,`${this.name}_crumbs`)
        this.dirtree = new dirtree(screen,`${this.name}_dirtree`,['scroll'])
        this.crumbs.on('action',this.onCrumbsAction)
        this.dirtree.setColor('bg',theme.dircol)
        this.dirtree.setColor('empty',this.dirtree.color.bg)
        this.dirtree.setColor('cursor_main',this.dirtree.color.bg)
        this.dirtree.setColor('cursor_empty',this.dirtree.color.bg)
        this.dirtree.scroll.setColor('bg',this.dirtree.color.bg)
        this.crumbs.setColor('empty',theme.gutter)
        post.on('dircol.resize',this.onDircolResize)
        post.on('dircol.toggle',this.onDircolToggle)
        post.on('dircol.root',this.setRoot)
        post.on('session.merge',this.onSessionMerge)
        root = ked_session.get('dircol▸root',process.cwd())
        this.setRoot(root)
    }

    dircol.prototype["onCrumbsAction"] = function (action, path)
    {
        if (action === 'click')
        {
            return this.setRoot(path)
        }
    }

    dircol.prototype["onSessionMerge"] = function (recent)
    {
        var root

        if (_k_.empty(recent.dircol))
        {
            return
        }
        if (root = recent.dircol.root)
        {
            return this.setRoot(root)
        }
    }

    dircol.prototype["setRoot"] = function (path)
    {
        if (_k_.empty(path))
        {
            return
        }
        path = slash.tilde(path)
        this.crumbs.set(path)
        this.dirtree.setRoot(path,{redraw:true})
        return ked_session.set('dircol▸root',path)
    }

    dircol.prototype["layout"] = function (x, y, w, h)
    {
        this.crumbs.layout(x,y,w,1)
        this.dirtree.layout(x,y + 1,w,h - 1)
        this.knob.layout(x + w - 1,y + 1,1,h - 1)
        return dircol.__super__.layout.call(this,x,y,w,h)
    }

    dircol.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.cells.fill_rect(0,1,-1,-1,' ',null,theme.dircol)
        this.cells.fill_rect(0,0,-1,0,' ',null,theme.gutter)
        this.crumbs.draw()
        this.dirtree.draw()
        this.knob.draw()
        return dircol.__super__.draw.call(this)
    }

    dircol.prototype["onContext"] = function (event)
    {
        if (!this.hover)
        {
            return
        }
        console.log(`dircol.onContext ${this.hover}`,event)
    }

    dircol.prototype["onDircolResize"] = function ()
    {
        return this.knob.doDrag = true
    }

    dircol.prototype["onDircolToggle"] = function ()
    {
        return post.emit('view.size',this.name,[((this.hidden() ? parseInt(this.knob.maxWidth / 3) : 0)),0])
    }

    dircol.prototype["onMouse"] = function (event)
    {
        var ret

        ret = dircol.__super__.onMouse.call(this,event)
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

    dircol.prototype["onWheel"] = function (event)
    {
        if (this.hidden())
        {
            return
        }
        return this.dirtree.onWheel(event)
    }

    dircol.prototype["onKey"] = function (key, event)
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

    return dircol
})()

export default dircol;