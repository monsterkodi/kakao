var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var input

import editor from "../editor.js"
import theme from "../theme.js"


input = (function ()
{
    _k_.extend(input, editor)
    function input (screen, name, features)
    {
        input.__super__.constructor.call(this,screen,name,[])
    }

    input.prototype["init"] = function (x, y, w, h)
    {
        return this.cells.init(x,y,w,h)
    }

    input.prototype["set"] = function (text)
    {
        return this.state.loadLines([text])
    }

    input.prototype["onWheel"] = function (event)
    {
        return input.__super__.onWheel.call(this,event)
    }

    return input
})()

export default input;