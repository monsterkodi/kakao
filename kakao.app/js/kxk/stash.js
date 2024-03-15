var _k_

var Stash

import post from "./post.js"

import slash from "./slash.js"

import noon from "./noon.js"

import sds from "./sds.js"

import kstr from "./kstr.js"

import ffs from "./ffs.js"

import util from "./util.js"
let defaults = util.defaults


Stash = (function ()
{
    function Stash (name, opt)
    {
        var _26_30_, _29_32_, _33_61_

        this.name = name
    
        this["save"] = this["save"].bind(this)
        if (!this.name)
        {
            return console.error('stash.constructor -- no name?')
        }
        this.sep = ((_26_30_=(opt != null ? opt.separator : undefined)) != null ? _26_30_ : ':')
        this.timer = null
        this.file = slash.path(kakao.bundle.path,`/.stash/${this.name}.noon`)
        this.timeout = ((_29_32_=(opt != null ? opt.timeout : undefined)) != null ? _29_32_ : 4000)
        this.changes = []
        this.data = {}
        if (((opt != null ? opt.defaults : undefined) != null))
        {
            this.data = defaults(this.data,opt.defaults)
        }
        this.load()
    }

    Stash.prototype["keypath"] = function (key)
    {
        return key.split(this.sep)
    }

    Stash.prototype["get"] = function (key, value)
    {
        var _46_63_, _47_38_

        if (!((key != null ? key.split : undefined) != null))
        {
            console.error('stash.get -- invalid key',key)
        }
        if (!((key != null ? key.split : undefined) != null))
        {
            return value
        }
        return sds.get(this.data,this.keypath(key),value)
    }

    Stash.prototype["set"] = function (key, value)
    {
        var _58_70_

        if (!((key != null ? key.split : undefined) != null))
        {
            return console.error('stash.set -- invalid key',key)
        }
        sds.set(this.data,this.keypath(key),value)
        if (this.timer)
        {
            clearTimeout(this.timer)
        }
        return this.timer = setTimeout(this.save,this.timeout)
    }

    Stash.prototype["del"] = function (key)
    {
        return this.set(key)
    }

    Stash.prototype["clear"] = function ()
    {
        this.data = {}
        clearTimeout(this.timer)
        this.timer = null
        return fs.removeSync(this.file)
    }

    Stash.prototype["load"] = async function ()
    {
        var data

        data = await noon.load(this.file)
        console.log('stash load data',this.file,data)
        if (data)
        {
            return this.data = data
        }
    }

    Stash.prototype["save"] = function ()
    {
        var text

        if (!this.file)
        {
            return
        }
        clearTimeout(this.timer)
        this.timer = null
        try
        {
            text = noon.stringify(this.data)
            ffs.write(this.file,text).then(function (file)
            {
                console.log('stash.saved to',file)
            })
        }
        catch (err)
        {
            console.error(`stash.save -- can't save to '${this.file}': ${err}`)
        }
        return true
    }

    return Stash
})()

export default Stash;