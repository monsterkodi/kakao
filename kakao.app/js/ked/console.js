var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var consol

import editor from "./editor.js"


consol = (function ()
{
    _k_.extend(consol, editor)
    function consol (screen)
    {
        consol.__super__.constructor.call(this,this.screen)
    
        this.screen = screen
    }

    return consol
})()

export default consol;