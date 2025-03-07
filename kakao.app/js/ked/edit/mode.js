var _k_ = {isFunc: function (o) {return typeof o === 'function'}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var mode, recordMode, salterMode, unikoMode, unypeMode, vimpleMode

import kseg from "../../kxk/kseg.js"
import salter from "../../kxk/salter.js"

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


vimpleMode = (function ()
{
    _k_.extend(vimpleMode, mode)
    function vimpleMode ()
    {
        vimpleMode.__super__.constructor.call(this,'vimple')
    }

    return vimpleMode
})()


salterMode = (function ()
{
    _k_.extend(salterMode, mode)
    salterMode["syms"] = []
    function salterMode (state)
    {
        this.state = state
    
        salterMode.__super__.constructor.call(this,'salter')
    
        if (_k_.empty(salterMode.syms))
        {
            salterMode.syms = Object.keys(salter.font)
        }
        this.start()
    }

    salterMode.prototype["start"] = function ()
    {
        this.state.setMainCursor(this.state.mainCursor())
        this.state.expandCursors('down')
        this.state.expandCursors('down')
        this.state.expandCursors('down')
        return this.state.expandCursors('down')
    }

    salterMode.prototype["stop"] = function ()
    {
        return this.state.setMainCursor(this.state.mainCursor())
    }

    salterMode.prototype["handleKey"] = function (key, event)
    {
        var salt

        switch (key)
        {
            case 'esc':
                return mode.stop(this.state,this.name)

            case 'delete':
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                return

        }

        if (this.state.s.cursors.length !== 5)
        {
            mode.stop(this.state,this.name)
            return 'unhandled'
        }
        if ((salter.font[key] != null))
        {
            salt = salter(key,{char:'█',postfix:'  '})
            this.state.insert(salt)
            return
        }
        return 'unhandled'
    }

    return salterMode
})()


unikoMode = (function ()
{
    _k_.extend(unikoMode, mode)
    function unikoMode ()
    {
        unikoMode.__super__.constructor.call(this,'uniko')
    }

    return unikoMode
})()


unypeMode = (function ()
{
    _k_.extend(unypeMode, mode)
    unypeMode["map"] = {}
    function unypeMode ()
    {
        unypeMode.__super__.constructor.call(this,'unype')
    
        var char, def, font, idx, text

        if (_k_.empty(unypeMode.map))
        {
            def = fonts.default.join(' ')
            for (font in fonts)
            {
                text = fonts[font]
                if (font === 'default')
                {
                    continue
                }
                unypeMode.map[font] = {}
                var list = _k_.list(kseg(text.join(' ')))
                for (idx = 0; idx < list.length; idx++)
                {
                    char = list[idx]
                    if (def[idx] !== ' ')
                    {
                        unypeMode.map[font][def[idx]] = char
                    }
                }
            }
            unypeMode.map['full width'][' '] = '　'
        }
    }

    unypeMode.prototype["insert"] = function (text)
    {
        var repl

        if (repl = unypeMode.map['crazy'][text])
        {
            text = repl
        }
        return text
    }

    return unypeMode
})()


recordMode = (function ()
{
    _k_.extend(recordMode, mode)
    function recordMode ()
    {
        recordMode.__super__.constructor.call(this,'record')
    }

    return recordMode
})()

mode.modes = {vimple:vimpleMode,salter:salterMode,unype:unypeMode,uniko:unikoMode,record:recordMode}
export default mode;