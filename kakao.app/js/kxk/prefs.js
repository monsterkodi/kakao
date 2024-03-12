var _k_ = {clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var Prefs

import slash from "./slash.js"

import store from "./store.js"


Prefs = (function ()
{
    function Prefs ()
    {}

    Prefs["store"] = null
    Prefs["watcher"] = null
    Prefs["init"] = function (opt = {})
    {
        var _19_64_

        if ((this.store != null))
        {
            return console.error('prefs.init -- duplicate stores?')
        }
        this.store = new store('prefs',opt)
        this.store.on('willSave',this.unwatch)
        this.store.on('didSave',this.watch)
        return this.watch()
    }

    Prefs["unwatch"] = function ()
    {
        var _29_28_, _29_33_, _31_16_

        if (!((this.store != null ? this.store.app : undefined) != null))
        {
            return
        }
        ;(this.watcher != null ? this.watcher.close() : undefined)
        return this.watcher = null
    }

    Prefs["watch"] = function ()
    {
        var _36_28_, _36_33_

        if (!((this.store != null ? this.store.app : undefined) != null))
        {
            return
        }
        slash.error = log
        if (slash.touch(this.store.file))
        {
            this.unwatch()
            this.watcher = fs.watch(this.store.file)
            this.watcher.on('change',this.onFileChange)
            this.watcher.on('rename',this.onFileUnlink)
            this.watcher.on('error',function (err)
            {
                console.error('Prefs watch error',err)
            })
        }
        else
        {
            console.error(`can't touch prefs file ${this.store.file}`)
        }
        return this.watcher
    }

    Prefs["onFileChange"] = function ()
    {
        var _51_28_

        return (this.store != null ? this.store.reload() : undefined)
    }

    Prefs["onFileUnlink"] = function ()
    {
        var _52_40_

        this.unwatch()
        return (this.store != null ? this.store.clear() : undefined)
    }

    Prefs["get"] = function (key, value)
    {
        if (this.store)
        {
            return this.store.get(key,value)
        }
        else
        {
            return _k_.clone(value)
        }
    }

    Prefs["set"] = function (key, value)
    {
        var _55_45_

        this.unwatch()
        ;(this.store != null ? this.store.set(key,value) : undefined)
        return this.watch()
    }

    Prefs["del"] = function (key, value)
    {
        var _56_45_

        this.unwatch()
        ;(this.store != null ? this.store.del(key) : undefined)
        return this.watch()
    }

    Prefs["save"] = function ()
    {
        var _57_33_

        return (this.store != null ? this.store.save() : undefined)
    }

    Prefs["toggle"] = function (key, cb)
    {
        var val

        val = !this.get(key,false)
        this.set(key,val)
        return (typeof cb === "function" ? cb(val) : undefined)
    }

    Prefs["apply"] = function (key, deflt = false, cb)
    {
        if (!(cb != null) && deflt !== false)
        {
            cb = deflt
        }
        return (typeof cb === "function" ? cb(this.get(key,deflt)) : undefined)
    }

    return Prefs
})()

export default Prefs;