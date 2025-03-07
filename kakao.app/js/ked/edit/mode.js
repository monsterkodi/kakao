var _k_ = {isFunc: function (o) {return typeof o === 'function'}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var mode, record, salter, uniko, unype, vimple

import kseg from "../../kxk/kseg.js"

import fonts from '../util/fonts.json' with { type : "json" }

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
        var _43_28_

        if (this.isActive(state,name))
        {
            return
        }
        console.log(`mode.start ${name}`)
        this.active[state.name] = ((_43_28_=this.active[state.name]) != null ? _43_28_ : [])
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


salter = (function ()
{
    _k_.extend(salter, mode)
    function salter (state)
    {
        this.state = state
    
        salter.__super__.constructor.call(this,'salter')
    
        this.start()
    }

    salter.prototype["start"] = function ()
    {
        this.state.setMainCursor(this.state.mainCursor())
        this.state.expandCursors('down')
        this.state.expandCursors('down')
        this.state.expandCursors('down')
        return this.state.expandCursors('down')
    }

    salter.prototype["stop"] = function ()
    {
        return this.state.setMainCursor(this.state.mainCursor())
    }

    salter.prototype["handleKey"] = function (key, event)
    {
        switch (key)
        {
            case 'esc':
                mode.stop(this.state,this.name)
                break
        }

        return 'unhandled'
    }

    return salter
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


unype = (function ()
{
    _k_.extend(unype, mode)
    unype["map"] = {}
    function unype ()
    {
        unype.__super__.constructor.call(this,'unype')
    
        var char, def, font, idx, text

        if (_k_.empty(unype.map))
        {
            def = fonts.default.join(' ')
            for (font in fonts)
            {
                text = fonts[font]
                if (font === 'default')
                {
                    continue
                }
                unype.map[font] = {}
                var list = _k_.list(kseg(text.join(' ')))
                for (idx = 0; idx < list.length; idx++)
                {
                    char = list[idx]
                    if (def[idx] !== ' ')
                    {
                        unype.map[font][def[idx]] = char
                    }
                }
            }
            unype.map['full width'][' '] = '　'
        }
    }

    unype.prototype["insert"] = function (text)
    {
        var repl

        if (repl = unype.map['crazy'][text])
        {
            text = repl
        }
        return text
    }

    return unype
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

mode.modes = {vimple:vimple,salter:salter,uniko:uniko,unype:unype,record:record}
export default mode;