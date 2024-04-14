var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var Kore

import kxk from "../../kxk.js"
let events = kxk.events


Kore = (function ()
{
    _k_.extend(Kore, events)
    function Kore ()
    {
        this["get"] = this["get"].bind(this)
        this["set"] = this["set"].bind(this)
        Kore.__super__.constructor.call(this)
        console.log('K@re')
    }

    Kore.prototype["set"] = function (key, value)
    {
        stash.set(`kore|${key}`,value)
        return this.emit(key,value)
    }

    Kore.prototype["get"] = function (key, def)
    {
        var r

        r = stash.get(`kore|${key}`,def)
        return r
    }

    return Kore
})()

export default window.kore = new Kore;