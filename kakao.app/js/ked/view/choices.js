var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var choices

import editor from "../editor.js"
import theme from "../theme.js"


choices = (function ()
{
    _k_.extend(choices, editor)
    function choices (screen, name)
    {
        choices.__super__.constructor.call(this,screen,name,[])
    }

    choices.prototype["init"] = function (x, y, w, h)
    {
        return this.cells.init(x,y,w,h)
    }

    choices.prototype["set"] = function (items)
    {
        this.items = items
    
        return this.state.loadLines(this.items)
    }

    choices.prototype["num"] = function ()
    {
        return this.items.length
    }

    return choices
})()

export default choices;