var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var SysMon

import kakao from "../kakao.js"

import kxk from "../kxk.js"
let win = kxk.win
let post = kxk.post

import sysdish from "./sysdish.js"


SysMon = (function ()
{
    _k_.extend(SysMon, sysdish)
    function SysMon ()
    {
        this["animDish"] = this["animDish"].bind(this)
        return SysMon.__super__.constructor.apply(this, arguments)
    }

    SysMon.prototype["animDish"] = function ()
    {
        SysMon.__super__.animDish.call(this)
    
        return kakao('status.icon',{x:0,y:0,w:22,h:38})
    }

    SysMon.prototype["onWindowWillShow"] = function ()
    {
        SysMon.__super__.onWindowWillShow.call(this)
    
        var frame

        frame = {x:-99,y:0,w:100,h:40}
        kakao('window.setFrame',frame,true)
        return post.on('status.click',this.onStatusClick)
    }

    SysMon.prototype["onStatusClick"] = function ()
    {
        return kakao('window.new','syswin')
    }

    return SysMon
})()

kakao.init(function ()
{
    return new win(new SysMon)
})