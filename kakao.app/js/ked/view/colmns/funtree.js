var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var funtree

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import nfs from "../../../kxk/nfs.js"

import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import choices from "../menu/choices.js"

import rgxs from '../menu/quicky.json' with { type : "json" }

funtree = (function ()
{
    _k_.extend(funtree, choices)
    function funtree (screen, name, features)
    {
        this["onIndex"] = this["onIndex"].bind(this)
        funtree.__super__.constructor.call(this,screen,name,features)
        this.state.syntax.setRgxs(rgxs)
        post.on('indexer.indexed',this.onIndex)
    }

    funtree.prototype["onIndex"] = function (path, info)
    {
        var clss, clssl, func, funcs, items, _38_22_

        clssl = info.classes
        funcs = info.funcs
        var list = _k_.list(clssl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            clss = list[_a_]
            clss.file = ((_38_22_=clss.file) != null ? _38_22_ : path)
            clss.name = ' ● ' + clss.name
        }
        var list1 = _k_.list(funcs)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            func = list1[_b_]
            func.name = '   -> ' + func.name
        }
        items = clssl.concat(funcs)
        return this.set(items,'name')
    }

    funtree.prototype["emitAction"] = function (action, arg, event)
    {
        var c

        c = arg
        if (action !== 'hover')
        {
            console.log(`funtree.emitAction ${action}`,c)
        }
        switch (action)
        {
            case 'right':
                post.emit('goto.line',c.line - 1)
                return

            case 'click':
            case 'return':
                post.emit('goto.line',c.line - 1)
                post.emit('focus','editor')
                return

        }

        return funtree.__super__.emitAction.call(this,action,arg,event)
    }

    return funtree
})()

export default funtree;