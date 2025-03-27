var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var dircol

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import knob from "../base/knob.js"
import crumbs from "../base/crumbs.js"

import context from "../menu/context.js"

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
        this["onContextChoice"] = this["onContextChoice"].bind(this)
        this["onContext"] = this["onContext"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["setRoot"] = this["setRoot"].bind(this)
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        this["onCrumbsAction"] = this["onCrumbsAction"].bind(this)
        dircol.__super__.constructor.call(this,screen,name,features)
        this.isVisible = false
        this.active = true
        this.pointerType = 'pointer'
        this.knob = new knob(screen,`${this.name}_knob`)
        this.crumbs = new crumbs(screen,`${this.name}_crumbs`)
        this.dirtree = new dirtree(screen,`${this.name}_dirtree`,['scroll'])
        this.crumbs.on('action',this.onCrumbsAction)
        this.dirtree.setColor('bg',theme.dirtree.bg)
        this.dirtree.setColor('empty',this.dirtree.color.bg)
        this.dirtree.setColor('cursor_main',this.dirtree.color.bg)
        this.dirtree.setColor('cursor_empty',this.dirtree.color.bg)
        this.dirtree.scroll.setColor('bg',this.dirtree.color.bg)
        this.knob.setColor('bg',this.dirtree.color.bg)
        this.crumbs.setColor('empty',theme.gutter.bg)
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
        var args, root, _73_24_

        if (_k_.empty(recent.dircol))
        {
            return
        }
        args = ked_session.get('ked▸args',{})
        if (!_k_.empty(args.options))
        {
            console.log(`dircol.onSessionMerge - use first options dir ${slash.dir(args.options[0])}`)
            root = slash.dir(args.options[0])
        }
        else
        {
            console.log(`dircol.onSessionMerge - use last session dir ${recent.dircol.root}`)
            root = recent.dircol.root
        }
        if (root)
        {
            this.setRoot(root)
        }
        if ((recent.funcol != null ? recent.funcol.active : undefined))
        {
            this.active = true
            this.show()
        }
        return ked_session.set('dircol',recent.dircol)
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
        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
        this.cells.fill_rect(0,1,-1,-1,' ',null,this.dirtree.color.bg)
        this.cells.fill_rect(0,0,-1,0,' ',null,this.crumbs.color.empty)
        this.crumbs.draw()
        this.dirtree.draw()
        this.knob.draw()
        return dircol.__super__.draw.call(this)
    }

    dircol.prototype["onContext"] = function (event)
    {
        return context.show(event.cell,this.onContextChoice,["trash"])
    }

    dircol.prototype["onContextChoice"] = function (choice)
    {
        var current

        if (current = this.dirtree.current())
        {
            switch (choice)
            {
                case 'trash':
                    return post.emit('file.trash',current.path)

            }

        }
    }

    dircol.prototype["onDircolResize"] = function ()
    {
        return this.knob.doDrag = true
    }

    dircol.prototype["onDircolToggle"] = function ()
    {
        var cols

        if (!(this.visible() && this.collapsed()))
        {
            this.toggle()
        }
        this.active = this.visible()
        ked_session.set('dircol▸active',this.active)
        cols = _k_.max(16,parseInt(this.cells.screen.cols / 6))
        return post.emit('view.size',this.name,'right',((this.hidden() ? -this.cells.cols : cols - this.cells.cols)))
    }

    dircol.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
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
        if (this.hidden() || this.collapsed() || !this.active)
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