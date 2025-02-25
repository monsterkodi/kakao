var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var crumbs

import kxk from "../../kxk.js"
let slash = kxk.slash

import editor from "../editor.js"
import theme from "../theme.js"

import rgxs from './crumbs.json' with { type : "json" }

crumbs = (function ()
{
    _k_.extend(crumbs, editor)
    function crumbs (screen, name)
    {
        this["show"] = this["show"].bind(this)
        crumbs.__super__.constructor.call(this,screen,name)
        this.state.syntax.setRgxs(rgxs)
    }

    crumbs.prototype["layout"] = function (x, y, w, h)
    {
        crumbs.__super__.layout.call(this,x,y,w,h)
    
        return this.adjustText()
    }

    crumbs.prototype["drawCursors"] = function ()
    {}

    crumbs.prototype["drawTrailingRows"] = function ()
    {}

    crumbs.prototype["drawRowBackground"] = function ()
    {}

    crumbs.prototype["adjustText"] = function ()
    {
        var _34_14_

        this.path = ((_34_14_=this.path) != null ? _34_14_ : '')
        return this.state.loadLines(['' + this.path + _k_.lpad(this.cells.cols - 1 - this.path.length,'')])
    }

    crumbs.prototype["set"] = function (path)
    {
        this.path = _k_.trim(path)
        return this.adjustText()
    }

    crumbs.prototype["show"] = function (path)
    {
        this.set(slash.tilde(path))
        return this.cells.rows = 1
    }

    return crumbs
})()

export default crumbs;