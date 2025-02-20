var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var crumbs

import kxk from "../../kxk.js"
let slash = kxk.slash

import theme from "../theme.js"

import view from "./view.js"


crumbs = (function ()
{
    _k_.extend(crumbs, view)
    function crumbs (screen, name)
    {
        this["show"] = this["show"].bind(this)
        crumbs.__super__.constructor.call(this,screen,name)
    }

    crumbs.prototype["set"] = function (text)
    {
        return this.text = _k_.trim(text)
    }

    crumbs.prototype["show"] = function (path)
    {
        this.set(slash.tilde(path))
        return this.cells.rows = 1
    }

    crumbs.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.cells.fill_rect(1,0,-2,0,' ',null,theme.selection)
        this.cells.set(0,0,'',theme.selection)
        this.cells.draw_path(1,this.cells.cols - 2,0,this.text,theme.selection)
        return this.cells.set(this.cells.cols - 1,0,'',theme.selection)
    }

    return crumbs
})()

export default crumbs;