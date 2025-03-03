var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

var dirtree

import kxk from "../../kxk.js"
let kutil = kxk.kutil
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
        this["clickChoiceAtIndex"] = this["clickChoiceAtIndex"].bind(this)
        dirtree.__super__.constructor.call(this,screen,name,features)
        this.state.syntax.setRgxs(rgxs)
        this.dirOpenSymbol = ''
        this.dirCloseSymbol = ''
    }

    dirtree.prototype["clickChoiceAtIndex"] = function (index)
    {
        dirtree.__super__.clickChoiceAtIndex.call(this,index)
    
        var c

        c = this.current()
        switch (c.type)
        {
            case 'dir':
                c.open = !c.open
                c.open ? this.openDir(c) : this.closeDir(c)
                break
        }

        return this.set(this.items,'tilde')
    }

    dirtree.prototype["openDir"] = async function (dirItem)
    {
        var depth, index, item, items, _57_31_

        try
        {
            items = await nfs.list(dirItem.path,{recursive:false})
        }
        catch (err)
        {
            console.error('list error',err)
            return
        }
        dirItem.tilde = dirItem.tilde.replace(this.dirCloseSymbol,this.dirOpenSymbol)
        depth = (((_57_31_=dirItem.depth) != null ? _57_31_ : 1)) + 1
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.depth = depth
            item.tilde = slash.file(item.path)
            item.tilde = _k_.lpad(depth * 2,(((item.type === 'dir') ? (this.dirCloseSymbol + ' ') : '  '))) + item.tilde
        }
        items.sort((function (a, b)
        {
            return this.weight(a) - this.weight(b)
        }).bind(this))
        index = this.items.indexOf(dirItem)
        kutil.insert(this.items,index + 1,items)
        return this.set(this.items,'tilde')
    }

    dirtree.prototype["closeDir"] = function (dirItem)
    {
        var index, numChildren

        dirItem.tilde = dirItem.tilde.replace(this.dirOpenSymbol,this.dirCloseSymbol)
        index = this.items.indexOf(dirItem)
        numChildren = 0
        while (this.items[index + numChildren + 1].path.startsWith(dirItem.path))
        {
            numChildren += 1
        }
        kutil.replace(this.items,index + 1,numChildren,[])
        return this.set(this.items,'tilde')
    }

    dirtree.prototype["setRoot"] = async function (path)
    {
        var dir, item, items, select, selectIndex

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
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.tilde = slash.relative(item.path,this.currentRoot)
            item.tilde = (((item.type === 'dir') ? (this.dirCloseSymbol + ' ') : '  ')) + item.tilde
        }
        items.sort((function (a, b)
        {
            return this.weight(a) - this.weight(b)
        }).bind(this))
        select = (select != null ? select : items[1].path)
        this.frontRoundOffset = 1
        this.set(items,'tilde')
        selectIndex = 0
        this.state.selectLine(selectIndex)
        this.state.setMainCursor(0,selectIndex)
        return this.state.setView([0,0])
    }

    dirtree.prototype["weight"] = function (item)
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

    return dirtree
})()

export default dirtree;