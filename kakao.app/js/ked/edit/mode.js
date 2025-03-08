var _k_ = {isFunc: function (o) {return typeof o === 'function'}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var mode, record, uniko, vimple

import kseg from "../../kxk/kseg.js"

import theme from "../theme/theme.js"

import brckts from "./mode/brckts.js"
import salter from "./mode/salter.js"
import unype from "./mode/unype.js"


mode = (function ()
{
    mode["active"] = {}
    mode["modes"] = {}
    function mode (name)
    {
        this.name = name
    }

    mode["names"] = function ()
    {
        return Object.keys(mode.modes)
    }

    mode["start"] = function (state, name)
    {
        var _44_28_

        if (this.isActive(state,name))
        {
            return
        }
        console.log(`mode.start ${name}`)
        this.active[state.name] = ((_44_28_=this.active[state.name]) != null ? _44_28_ : [])
        this.active[state.name].push(new mode.modes[name](state))
        console.log("mode.start",this.active[state.name].map(function (m)
        {
            return m.name
        }))
    }

    mode["stop"] = function (state, name)
    {
        var m

        console.log(`mode.stop ${name}`)
        m = this.get(state,name)
        if (_k_.isFunc(m.stop))
        {
            m.stop()
        }
        this.active[state.name].splice(this.active[state.name].indexOf(m),1)
        console.log("mode.stop",this.active[state.name].map(function (m)
        {
            return m.name
        }))
    }

    mode["toggle"] = function (state, name)
    {
        if (this.isActive(state,name))
        {
            return this.stop(state,name)
        }
        else
        {
            return this.start(state,name)
        }
    }

    mode["isActive"] = function (state, name)
    {
        return !_k_.empty(this.get(state,name))
    }

    mode["get"] = function (state, name)
    {
        var m

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (m.name === name)
            {
                return m
            }
        }
    }

    mode["insert"] = function (state, text)
    {
        var mode

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            mode = list[_a_]
            if (_k_.isFunc(mode.insert))
            {
                text = mode.insert(text)
            }
        }
        return text
    }

    mode["handleKey"] = function (state, key, event)
    {
        var mode

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            mode = list[_a_]
            if (_k_.isFunc(mode.handleKey))
            {
                if (mode.handleKey(key,event) !== 'unhandled')
                {
                    return
                }
            }
        }
        return 'unhandled'
    }

    mode["themeColor"] = function (state, colorName)
    {
        var mode

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            mode = list[_a_]
            if (_k_.isFunc(mode.themeColor))
            {
                return mode.themeColor(colorName)
            }
        }
        return theme[colorName]
    }

    return mode
})()


vimple = (function ()
{
    _k_.extend(vimple, mode)
    function vimple ()
    {
        vimple.__super__.constructor.call(this,'vimple')
    }

    return vimple
})()


uniko = (function ()
{
    _k_.extend(uniko, mode)
    function uniko ()
    {
        uniko.__super__.constructor.call(this,'uniko')
    }

    return uniko
})()


record = (function ()
{
    _k_.extend(record, mode)
    function record ()
    {
        record.__super__.constructor.call(this,'record')
    }

    return record
})()

mode.modes = {brckts:brckts,salter:salter,unype:unype,uniko:uniko,vimple:vimple,record:record}
export default mode;