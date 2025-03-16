var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

var funtree

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import nfs from "../../../kxk/nfs.js"

import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import choices from "../menu/choices.js"

import rgxs from './funtree.json' with { type : "json" }

funtree = (function ()
{
    _k_.extend(funtree, choices)
    function funtree (screen, name, features)
    {
        this["onIndex"] = this["onIndex"].bind(this)
        funtree.__super__.constructor.call(this,screen,name,features)
        this.state.syntax.setRgxs(rgxs)
        post.on('file.loaded',this.clear)
        post.on('indexer.indexed',this.onIndex)
    }

    funtree.prototype["onIndex"] = function (path, info)
    {
        var clss, clssl, func, funcs, items, name, symbol, _41_22_

        clssl = _k_.clone(info.classes)
        funcs = _k_.clone(info.funcs)
        var list = _k_.list(clssl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            clss = list[_a_]
            clss.file = ((_41_22_=clss.file) != null ? _41_22_ : path)
            clss.name = ' ● ' + clss.name
        }
        var list1 = _k_.list(funcs)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            func = list1[_b_]
            if (func.bound)
            {
                symbol = '=>'
            }
            else
            {
                symbol = '->'
            }
            if (func.async)
            {
                symbol = '○' + symbol
            }
            symbol = _k_.lpad(3,symbol)
            name = func.name
            if (func.static)
            {
                name = '@' + name
            }
            func.name = '   ' + symbol + ' ' + name
        }
        items = clssl.concat(funcs)
        return this.set(items,'name')
    }

    funtree.prototype["emitAction"] = function (action, arg, event)
    {
        var c

        c = arg
        switch (action)
        {
            case 'right':
                post.emit('goto.line',c.line - 1,'ind')
                return

            case 'click':
            case 'return':
                post.emit('goto.line',c.line - 1,'ind')
                post.emit('focus','editor')
                return

        }

        return funtree.__super__.emitAction.call(this,action,arg,event)
    }

    return funtree
})()

export default funtree;