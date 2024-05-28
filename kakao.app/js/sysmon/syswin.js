var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var SysWin

import kakao from "../kakao.js"

import kxk from "../kxk.js"
let win = kxk.win
let post = kxk.post

import sysdish from "./sysdish.js"


SysWin = (function ()
{
    _k_.extend(SysWin, sysdish)
    function SysWin ()
    {
        this["onDishData"] = this["onDishData"].bind(this)
        return SysWin.__super__.constructor.apply(this, arguments)
    }

    SysWin.prototype["onWindowWillShow"] = function ()
    {
        post.on('window.frame',this.onWindowFrame)
        return post.on('dishData',this.onDishData)
    }

    SysWin.prototype["onDishData"] = function (data)
    {
        this.data = data
    
        return this.updateDish()
    }

    SysWin.prototype["onWindowFrame"] = function (info)
    {
        var frame, size

        frame = info.frame
        if (frame.w !== frame.h)
        {
            size = _k_.max(frame.w,frame.h)
            frame.w = frame.h = size
            return kakao('window.setFrame',frame,true)
        }
    }

    SysWin.prototype["onWindowKeyDown"] = function (info)
    {
        switch (info.combo)
        {
            case 'command+q':
                return kakao('app.quit')

            case 'w':
            case 'command+w':
                return kakao('window.close')

            case 'command+alt+i':
                return kakao('window.toggleInspector')

        }

    }

    return SysWin
})()

kakao.init(function ()
{
    return new win(new SysWin)
})