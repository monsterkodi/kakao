var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}};_k_.m7=_k_.k.F256(_k_.k.m(7))

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
let sessionId = util.sessionId


session = (function ()
{
    _k_.extend(session, events)
    function session (opt)
    {
        var _28_20_, _30_30_

        this["cleanSessionFiles"] = this["cleanSessionFiles"].bind(this)
        this["listSessionFiles"] = this["listSessionFiles"].bind(this)
        this["newestSessionFile"] = this["newestSessionFile"].bind(this)
        this["loadAndMergeRecentSession"] = this["loadAndMergeRecentSession"].bind(this)
        this["save"] = this["save"].bind(this)
        this["load"] = this["load"].bind(this)
        this["reload"] = this["reload"].bind(this)
        this["clear"] = this["clear"].bind(this)
        this["delayedSave"] = this["delayedSave"].bind(this)
        this["del"] = this["del"].bind(this)
        this["set"] = this["set"].bind(this)
        this["get"] = this["get"].bind(this)
        this["keypath"] = this["keypath"].bind(this)
        this.name = sessionId()
        opt = (opt != null ? opt : {})
        opt.timeout = ((_28_20_=opt.timeout) != null ? _28_20_ : 4000)
        this.sep = ((_30_30_=opt.separator) != null ? _30_30_ : '▸')
        this.dir = slash.absolute("~/.config/ked/sessions/")
        this.file = slash.path(this.dir,`${this.name}.noon`)
        lf(`session ${_k_.m7(this.name)}`)
        this.loadAndMergeRecentSession()
        this.cleanSessionFiles()
        return session.__super__.constructor.apply(this, arguments)
    }

    session.prototype["keypath"] = function (key)
    {
        return key.split(this.sep)
    }

    session.prototype["get"] = function (key, value)
    {
        var _50_45_

        if (!((key != null ? key.split : undefined) != null))
        {
            return _k_.clone((value))
        }
        return _k_.clone(sds.get(this.data,this.keypath(key),value))
    }

    session.prototype["set"] = function (key, value)
    {
        var _68_14_

        if (!(_k_.isStr(key)))
        {
            return
        }
        if (_k_.eql(this.get(key), value))
        {
            return
        }
        if (this.get(key) === value)
        {
            return
        }
        if (_k_.empty(value))
        {
            return this.del(key)
        }
        this.data = ((_68_14_=this.data) != null ? _68_14_ : {})
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
            text = noon.stringify(this.data,{indent:4,maxalign:8}) + '\n'
            result = await nfs.write(this.file,text)
            if (result.error)
            {
                return lf('session.save failed!',this.file,result)
            }
            else
            {
                return lf(`session.saved ${_k_.m7(this.name)}`,result,this.data)
            }
        }
        catch (err)
        {
            return lf(`session -- can't save to '${this.file}':`,err)
        }
    }

    session.prototype["loadAndMergeRecentSession"] = async function ()
    {
        var file, recent

        file = await this.newestSessionFile()
        if (_k_.empty(file))
        {
            return
        }
        recent = await noon.read(file)
        lf(`loadAndMergeRecent ${_k_.m7(this.name)} ${file}`,recent)
        if (!_k_.empty(recent.files))
        {
            this.set('files',recent.files)
        }
        return this.emit('loaded')
    }

    session.prototype["newestSessionFile"] = async function ()
    {
        var files

        files = await this.listSessionFiles()
        return files.slice(-1)[0]
    }

    session.prototype["listSessionFiles"] = async function ()
    {
        var f, files

        files = await nfs.list(this.dir)
        return (function () { var r_a_ = []; var list = _k_.list(files); for (var _b_ = 0; _b_ < list.length; _b_++)  { f = list[_b_];r_a_.push(f.path)  } return r_a_ }).bind(this)()
    }

    session.prototype["cleanSessionFiles"] = async function ()
    {
        var file, files, maxFiles

        maxFiles = 10
        files = await this.listSessionFiles()
        var list = _k_.list(files.slice(0, files.length - maxFiles))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            await nfs.remove(file)
        }
    }

    return session
})()

export default session;