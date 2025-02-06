var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var fscol

import editor from "./editor.js"
import theme from "./theme.js"


fscol = (function ()
{
    _k_.extend(fscol, editor)
    function fscol (screen)
    {
        this["onKey"] = this["onKey"].bind(this)
        fscol.__super__.constructor.call(this,screen)
    }

    fscol.prototype["onKey"] = function (key)
    {
        switch (key)
        {
            case 'cmd+.':
                this.toggle()
                return true

        }

        return false
    }

    return fscol
})()

export default fscol;