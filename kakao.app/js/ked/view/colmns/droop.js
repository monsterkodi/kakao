var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var droop

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import belt from "../../edit/tool/belt.js"

import theme from "../../theme/theme.js"

import quicky from "./quicky.js"
import diritem from "./diritem.js"


droop = (function ()
{
    _k_.extend(droop, quicky)
    function droop (screen)
    {
        this.screen = screen
    
        this["arrange"] = this["arrange"].bind(this)
        this["onShow"] = this["onShow"].bind(this)
        droop.__super__.constructor.call(this,this.screen,'droop')
        this.isVisible = false
        this.setColor('bg',theme.quicky.bg)
        this.setColor('frame',theme.quicky.frame)
        post.on('droop.show',this.onShow)
    }

    droop.prototype["onShow"] = function (d)
    {
        var item, items, lines

        this.pos = d.pos
        items = d.files.map(function (f)
        {
            return {path:f}
        })
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.tilde = ' ' + diritem.symbolName(item)
        }
        lines = items.map(function (i)
        {
            return i.tilde
        })
        this.choicesWidth = belt.widthOfLines(lines)
        return this.showPathItems(items)
    }

    droop.prototype["arrange"] = function ()
    {
        var cw, h, w, x, y

        x = this.pos[0] - 3
        y = this.pos[1]
        cw = this.choicesWidth + 3
        w = cw + 2
        h = _k_.min(10,this.choices.numFiltered())
        this.input.layout(x + 2,y,w - 4,0)
        this.choices.layout(x + 1,y + 1,cw,h)
        return this.cells.layout(x,y,w,h + 2)
    }

    return droop
})()

export default droop;