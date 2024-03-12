// monsterkodi/kakao 0.1.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var Store

import events from "./events.js"

import slash from "./slash.js"

import noon from "./noon.js"

import post from "./post.js"

import ffs from "./ffs.js"

import sds from "./sds.js"


Store = (function ()
{
    _k_.extend(Store, events)
    Store["stores"] = {}
    Store["addStore"] = function (store)
    {
        return this.stores[store.name] = store
    }

    function Store (name, opt = {})
    {
        var k, v, _37_22_, _38_22_, _77_21_

        this["save"] = this["save"].bind(this)
        Store.__super__.constructor.call(this)
        this.name = name
        opt.separator = ((_37_22_=opt.separator) != null ? _37_22_ : ':')
        opt.timeout = ((_38_22_=opt.timeout) != null ? _38_22_ : 4000)
        if (!this.name)
        {
            return console.error('no name for store?')
        }
        this.sep = opt.separator
        if (true)
        {
            this.file = slash.path(`userData/${this.name}.noon`)
            post.on('store',(function (name, action, ...argl)
            {
                if (this.name !== name)
                {
                    return
                }
                switch (action)
                {
                    case 'data':
                        return this.data = argl[0]

                    case 'set':
                        return sds.set(this.data,this.keypath(argl[0]),argl[1])

                    case 'get':
                        return sds.get(this.data,this.keypath(argl[0]),argl[1])

                    case 'del':
                        return sds.del(this.data,this.keypath(argl[0]))

                }

            }).bind(this))
        }
        this.data = this.load()
        for (k in opt.defaults)
        {
            v = opt.defaults[k]
            this.data[k] = ((_77_21_=this.data[k]) != null ? _77_21_ : v)
        }
    }

    Store.prototype["keypath"] = function (key)
    {
        return key.split(this.sep)
    }

    Store.prototype["get"] = function (key, value)
    {
        var _89_45_

        if (!((key != null ? key.split : undefined) != null))
        {
            return _k_.clone((value))
        }
        return _k_.clone(sds.get(this.data,this.keypath(key),value))
    }

    Store.prototype["set"] = function (key, value)
    {
        var _100_32_, _104_14_

        if (!((key != null ? key.split : undefined) != null))
        {
            return
        }
        if (this.get(key) === value)
        {
            return
        }
        this.data = ((_104_14_=this.data) != null ? _104_14_ : {})
        return sds.set(this.data,this.keypath(key),value)
    }

    Store.prototype["del"] = function (key)
    {
        if (!this.data)
        {
            return
        }
        return sds.del(this.data,this.keypath(key))
    }

    Store.prototype["clear"] = function ()
    {
        return this.data = {}
    }

    Store.prototype["reload"] = function ()
    {}

    Store.prototype["load"] = function ()
    {
        console.log('store load not implemented!')
    }

    Store.prototype["save"] = function ()
    {}

    return Store
})()

export default Store;