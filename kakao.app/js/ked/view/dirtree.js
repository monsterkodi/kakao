var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var dirtree

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let noon = kxk.noon

import nfs from "../../kxk/nfs.js"

import prjcts from "../util/prjcts.js"
import util from "../util/util.js"

import choices from "./choices.js"
import crumbs from "./crumbs.js"

import rgxs from './quicky.json' with { type : "json" }

dirtree = (function ()
{
    _k_.extend(dirtree, choices)
    function dirtree (screen, name, features)
    {
        this["setRoot"] = this["setRoot"].bind(this)
        dirtree.__super__.constructor.call(this,screen,name,features)
        this.state.syntax.setRgxs(rgxs)
    }

    dirtree.prototype["setRoot"] = async function (path)
    {
        var dir, item, items, select, selectIndex, weight

        dir = slash.untilde(path)
        try
        {
            items = await nfs.list(dir,{recursive:false})
        }
        catch (err)
        {
            console.error('list error',err)
            return
        }
        this.currentRoot = dir
        weight = function (item)
        {
            var p, w

            p = slash.parse(item.path)
            w = 0
            if (item.type === 'file')
            {
                w += 10000
            }
            w += kstr.weight(p.file)
            return w
        }
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.tilde = slash.relative(item.path,this.currentRoot)
            item.tilde = (((item.type === 'dir') ? '⏵ ' : '  ')) + item.tilde
        }
        items.sort(function (a, b)
        {
            return weight(a) - weight(b)
        })
        select = (select != null ? select : items[1].path)
        this.frontRoundOffset = 1
        this.set(items,'tilde')
        selectIndex = 0
        this.state.selectLine(selectIndex)
        this.state.setMainCursor(0,selectIndex)
        return this.state.setView([0,0])
    }

    return dirtree
})()

export default dirtree;