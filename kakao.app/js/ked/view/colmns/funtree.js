var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var funSyntax, funtree, SYMBOL

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import nfs from "../../../kxk/nfs.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import belt from "../../edit/tool/belt.js"

import choices from "../menu/choices.js"

SYMBOL = {clss:'■',unbound:'->',bound:'=>',async_unbound:'○→',async_bound:'●→'}

funSyntax = (function ()
{
    function funSyntax (tree)
    {
        this.tree = tree
    
        this["getChar"] = this["getChar"].bind(this)
        this["getColor"] = this["getColor"].bind(this)
        this["getClass"] = this["getClass"].bind(this)
        this["setSegls"] = this["setSegls"].bind(this)
        this["setLines"] = this["setLines"].bind(this)
        this["clear"] = this["clear"].bind(this)
        this.color = {class:theme.funtree.class,async:theme.funtree.async,bound:theme.funtree.bound,bound_async:theme.funtree.bound_async,func:theme.funtree.func,func_async:theme.funtree.func_async,test0:theme.funtree.test0,test1:theme.funtree.test1,test2:theme.funtree.test2,test3:theme.funtree.test3}
    }

    funSyntax.prototype["clear"] = function ()
    {}

    funSyntax.prototype["setLines"] = function (lines)
    {
        console.log('setLines')
    }

    funSyntax.prototype["setSegls"] = function (segls)
    {}

    funSyntax.prototype["getClass"] = function (x, y)
    {
        return ''
    }

    funSyntax.prototype["getColor"] = function (x, y)
    {
        var char, clr, item, name

        item = this.tree.items[y]
        name = item.name
        char = name[x]
        if (char === ' ')
        {
            return [0,0,0]
        }
        if (item.clss)
        {
            clr = this.color.class
        }
        else if (item.test)
        {
            clr = this.color['test' + parseInt(belt.numIndent(item.name) / 2)]
        }
        else if (item.async)
        {
            clr = (item.bound ? this.color.bound_async : this.color.func_async)
        }
        else if (item.bound)
        {
            clr = this.color.bound
        }
        else
        {
            clr = this.color.func
        }
        if (item.static)
        {
            clr = color.brighten(clr,0.2)
        }
        else if (char === '@' && _k_.empty(name[x + 1]))
        {
            clr = this.color.class
        }
        if (char === '▸')
        {
            clr = color.darken(clr,0.5)
        }
        else if (char === '@')
        {
            clr = color.darken(clr,((clr === this.color.class ? 0.75 : 0.5)))
        }
        else if (char === SYMBOL.clss)
        {
            clr = color.darken(clr,0.2)
        }
        else if (_k_.in(char,SYMBOL.bound) && item.bound)
        {
            clr = color.darken(clr,0.5)
        }
        else if (_k_.in(char,SYMBOL.unbound))
        {
            clr = color.darken(clr,0.7)
        }
        return clr
    }

    funSyntax.prototype["getChar"] = function (x, y, char)
    {
        return char
    }

    return funSyntax
})()


funtree = (function ()
{
    _k_.extend(funtree, choices)
    function funtree (screen, name, features)
    {
        this["onFileIndexed"] = this["onFileIndexed"].bind(this)
        funtree.__super__.constructor.call(this,screen,name,features)
        this.state.syntax = new funSyntax(this)
        post.on('file.loaded',this.clear)
        post.on('file.indexed',this.onFileIndexed)
    }

    funtree.prototype["onFileIndexed"] = function (path, info)
    {
        var clss, clssl, func, funcs, indt, items, name, symbol, _118_22_

        if (path !== ked_session.get('editor▸file'))
        {
            return
        }
        if (_k_.empty(info.classes) && _k_.empty(info.funcs))
        {
            return
        }
        clssl = _k_.clone(info.classes)
        funcs = _k_.clone(info.funcs)
        var list = _k_.list(clssl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            clss = list[_a_]
            clss.file = ((_118_22_=clss.file) != null ? _118_22_ : path)
            clss.name = ' ' + SYMBOL.clss + ' ' + clss.name
        }
        var list1 = _k_.list(funcs)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            func = list1[_b_]
            if (func.test)
            {
                func.name = ' ' + belt.reindent(4,2,func.name)
            }
            else
            {
                if (func.async)
                {
                    if (func.bound)
                    {
                        symbol = SYMBOL.async_bound
                    }
                    else
                    {
                        symbol = SYMBOL.async_unbound
                    }
                }
                else
                {
                    if (func.bound)
                    {
                        symbol = SYMBOL.bound
                    }
                    else
                    {
                        symbol = SYMBOL.unbound
                    }
                }
                name = func.name
                if (func.static)
                {
                    name = '@' + name
                }
                indt = (func.class ? '   ' : ' ')
                func.name = indt + symbol + ' ' + name
            }
        }
        items = clssl.concat(funcs)
        items.sort(function (a, b)
        {
            return a.line - b.line
        })
        this.set(items,'name')
        return post.emit('redraw')
    }

    funtree.prototype["emitAction"] = function (action, choice, event)
    {
        if (_k_.empty(choice))
        {
            console.error('funtree.emitAction -- empty choice ▸ action:',action)
            console.error('funtree.emitAction -- empty choice ▸ event:',event)
            return
        }
        switch (action)
        {
            case 'right':
                post.emit('goto.line',choice.line - 1,'ind')
                return

            case 'click':
            case 'return':
                post.emit('goto.line',choice.line - 1,'ind')
                post.emit('focus','editor')
                return

            case 'drag':
                post.emit('goto.line',choice.line - 1,'ind')
                return

        }

        return funtree.__super__.emitAction.call(this,action,choice,event)
    }

    return funtree
})()

export default funtree;