var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var mode, record, salter, uniko, unype, vimple


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

    mode["start"] = function (state, name)
    {
        var _47_28_

        if (this.isActive(state,name))
        {
            return
        }
        console.log(`mode.start ${name}`)
        this.active[state.name] = ((_47_28_=this.active[state.name]) != null ? _47_28_ : [])
        this.active[state.name].push(new mode.modes[name])
        console.log("mode.start",this.active[state.name].map(function (m)
        {
            return m.name
        }))
    }

    mode["stop"] = function (state, name)
    {
        console.log(`mode.stop ${name}`)
        this.active.splice(this.active[state.name].indexOf(this.get(name)),1)
        console.log("mode.stop",this.active[state.name].map(function (m)
        {
            return m.name
        }))
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
    function salter ()
    {
        salter.__super__.constructor.call(this,'salter')
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
    function unype ()
    {
        unype.__super__.constructor.call(this,'unype')
    }

    unype.prototype["insert"] = function (char)
    {
        return char
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