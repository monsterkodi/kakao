var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var SysWin

import kakao from "../kakao.js"

import kxk from "../kxk.js"
let win = kxk.win

import sysdish from "./sysdish.js"


SysWin = (function ()
{
    _k_.extend(SysWin, sysdish)
    function SysWin ()
    {
        return SysWin.__super__.constructor.apply(this, arguments)
    }

    return SysWin
})()

kakao.init(function ()
{
    return new win(new SysWin)
})