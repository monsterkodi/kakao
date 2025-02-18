var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var crumbs

import kxk from "../../kxk.js"
let slash = kxk.slash

import editor from "../editor.js"
import theme from "../theme.js"


crumbs = (function ()
{
    _k_.extend(crumbs, editor)
    function crumbs (screen, name, features)
    {
        this["show"] = this["show"].bind(this)
        this["current"] = this["current"].bind(this)
        crumbs.__super__.constructor.call(this,screen,name,[])
    }

    crumbs.prototype["current"] = function ()
    {
        return _k_.trim(this.state.s.lines[0])
    }

    crumbs.prototype["set"] = function (text)
    {
        this.text = _k_.trim(text)
        return this.state.loadLines([this.text])
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
        this.cells.fill_rect(0,0,-1,-1,' ',null,theme.selection)
        return this.cells.draw_path(0,0,this.current(),theme.selection)
    }

    return crumbs
})()

export default crumbs;