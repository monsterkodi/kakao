var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var session

import noon from "../../kxk/noon.js"
import events from "../../kxk/events.js"
import slash from "../../kxk/slash.js"
import post from "../../kxk/post.js"
import nfs from "../../kxk/nfs.js"
import sds from "../../kxk/sds.js"

import util from "../../kxk/util.js"
let isEqual = util.isEqual
let defaults = util.defaults
let uuid = util.uuid


session = (function ()
{
    _k_.extend(session, events)
    function session (opt)
    {
        var _28_20_, _30_30_

        this["save"] = this["save"].bind(this)
        this["load"] = this["load"].bind(this)
        this["reload"] = this["reload"].bind(this)
        this["clear"] = this["clear"].bind(this)
        this["delayedSave"] = this["delayedSave"].bind(this)
        this["del"] = this["del"].bind(this)
        this["set"] = this["set"].bind(this)
        this["get"] = this["get"].bind(this)
        this["keypath"] = this["keypath"].bind(this)
        this.name = uuid()
        opt = (opt != null ? opt : {})
        opt.timeout = ((_28_20_=opt.timeout) != null ? _28_20_ : 4000)
        this.sep = ((_30_30_=opt.separator) != null ? _30_30_ : '|')
        this.file = slash.path(`~/.config/ked/sessions/${this.name}.noon`)
        lf('session',this.file)
        return session.__super__.constructor.apply(this, arguments)
    }

    session.prototype["keypath"] = function (key)
    {
        return key.split(this.sep)
    }

    session.prototype["get"] = function (key, value)
    {
        var _46_45_

        if (!((key != null ? key.split : undefined) != null))
        {
            return _k_.clone((value))
        }
        return _k_.clone(sds.get(this.data,this.keypath(key),value))
    }

    session.prototype["set"] = function (key, value)
    {
        var _64_14_

        lf(`session[${this.name}].set`,key,value)
        if (!(_k_.isStr(key)))
        {
            return
        }
        if (eql)
        {
            return
        }
        this.get(key)(value)
        if (this.get(key) === value)
        {
            return
        }
        if (_k_.empty(value))
        {
            return this.del(key)
        }
        this.data = ((_64_14_=this.data) != null ? _64_14_ : {})
        sds.set(this.data,this.keypath(key),value)
        return this.delayedSave()
    }

    session.prototype["del"] = function (key)
    {
        if (!this.data)
        {
            return
        }
        sds.del(this.data,this.keypath(key))
        return this.delayedSave()
    }

    session.prototype["delayedSave"] = function ()
    {
        clearTimeout(this.timer)
        return this.timer = setTimeout(((function ()
        {
            return this.save()
        }).bind(this)),this.timeout)
    }

    session.prototype["clear"] = function ()
    {
        this.data = {}
        return clearTimeout(this.timer)
    }

    session.prototype["reload"] = function ()
    {
        return this.load()
    }

    session.prototype["load"] = async function ()
    {
        try
        {
            return this.data = await noon.load(this.file)
        }
        catch (err)
        {
            console.error(`session -- can't load '${this.file}':`,err)
            return {}
        }
    }

    session.prototype["save"] = async function ()
    {
        var result, text

        if (!this.file)
        {
            return
        }
        if (_k_.empty(this.data))
        {
            return
        }
        clearTimeout(this.timer)
        this.timer = null
        try
        {
            text = noon.stringify(this.data,{indent:2,maxalign:8}) + '\n'
            result = await nfs.write(this.file,text)
            if (result.error)
            {
                return lf('save failed!',this.file,result)
            }
            else
            {
                return lf('session.saved',result,this.data)
            }
        }
        catch (err)
        {
            return lf(`session -- can't save to '${this.file}':`,err)
        }
    }

    return session
})()

export default session;