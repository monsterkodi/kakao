var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var searcherfile

import kxk from "../../../kxk.js"
let slash = kxk.slash

import theme from "../../theme/theme.js"

import view from "../base/view.js"
import crumbs from "../base/crumbs.js"
import bubble from "../base/bubble.js"


searcherfile = (function ()
{
    _k_.extend(searcherfile, view)
    function searcherfile (screen, name)
    {
        this.screen = screen
        this.name = name
    
        this["onCrumbsAction"] = this["onCrumbsAction"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        searcherfile.__super__.constructor.call(this,this.screen,this.name)
        this.crumbs = new crumbs(this.screen,`${this.name}_crumbs`)
        this.bubble = new bubble(this.screen,`${this.name}_bubble`)
        this.setColor('bg',theme.finder.bg)
        this.setColor('frame',theme.finder.frame)
        this.crumbs.setColor('empty',this.color.bg)
        this.bubble.setColor('empty',this.color.bg)
        this.crumbs.dotlessRelative = true
        this.crumbs.on('action',this.onCrumbsAction)
    }

    searcherfile.prototype["set"] = function (file)
    {
        this.crumbs.set(slash.dir(file))
        return this.bubble.set(file)
    }

    searcherfile.prototype["layout"] = function (x, y, w, h)
    {
        var bw, cw

        cw = this.crumbs.rounded.length
        bw = this.bubble.rounded.length
        if (true)
        {
            this.crumbs.layout(x + w - bw - cw,y,cw,1)
            this.bubble.layout(x + w - bw,y,bw,1)
        }
        else
        {
            this.crumbs.layout(x,y,cw,1)
            this.bubble.layout(x + cw,y,bw,1)
        }
        return this.cells.layout(x,y,w,1)
    }

    searcherfile.prototype["draw"] = function ()
    {
        var xe, xs

        if (this.hidden())
        {
            return
        }
        searcherfile.__super__.draw.call(this)
        this.crumbs.draw()
        this.bubble.draw()
        if (true)
        {
            this.cells.fill_row(0,0,this.cells.cols - this.crumbs.rounded.length - this.bubble.rounded.length - 1,'─',this.color.frame,this.color.bg)
        }
        else
        {
            xs = this.crumbs.rounded.length + this.bubble.rounded.length
            xe = this.cells.x + this.cells.cols
            this.cells.fill_row(0,xs,xe,'─',this.color.frame,this.color.bg)
        }
        this.cells.set_unsafe(this.cells.cols,0,'─',this.color.frame,this.color.bg)
        return this.cells.set_unsafe(this.cells.cols + 1,0,'┤',this.color.frame,this.color.bg)
    }

    searcherfile.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.crumbs.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.bubble.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return searcherfile.__super__.onMouse.call(this,event)
    }

    searcherfile.prototype["onCrumbsAction"] = function (action, path)
    {
        console.log(`${this.name} onCrumbsAction ${action} ${path}`)
    }

    return searcherfile
})()

export default searcherfile;