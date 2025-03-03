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
import icons from "../util/icons.js"
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
        this.frontRoundOffset = 0
    }

    dirtree.prototype["symbol"] = function (item)
    {
        var _30_51_

        switch (item.type)
        {
            case 'file':
                return ((_30_51_=icons[slash.ext(item.path)]) != null ? _30_51_ : icons.file)

            case 'dir':
                return (item.open ? icons.dir_open : icons.dir_close)

        }

    }

    dirtree.prototype["symbolName"] = function (item)
    {
        var name

        switch (slash.ext(item.path))
        {
            case 'kode':
            case 'noon':
            case 'json':
            case 'pug':
            case 'styl':
            case 'html':
            case 'js':
            case 'md':
                name = slash.name(item.path)
                break
            default:
                name = slash.file(item.path)
        }

        return this.symbol(item) + ' ' + name
    }

    dirtree.prototype["emitAction"] = function (action, arg)
    {
        var c

        c = arg
        switch (c.type)
        {
            case 'dir':
                switch (action)
                {
                    case 'click':
                    case 'space':
                        c.open = !c.open
                        c.open ? this.openDir(c) : this.closeDir(c)
                        return

                    case 'right':
                        if (!c.open)
                        {
                            this.openDir(c)
                        }
                        break
                }

                break
            case 'file':
                switch (action)
                {
                    case 'right':
                    case 'click':
                    case 'space':
                        return post.emit('quicky',c.path)

                }

                break
        }

        return dirtree.__super__.emitAction.call(this,action,arg)
    }

    dirtree.prototype["openDir"] = async function (dirItem)
    {
        var depth, index, item, items, _104_31_

        dirItem.open = true
        try
        {
            items = await nfs.list(dirItem.path,{recursive:false})
        }
        catch (err)
        {
            console.error('list error',err)
            return
        }
        dirItem.tilde = dirItem.tilde.replace(icons.dir_close,icons.dir_open)
        depth = (((_104_31_=dirItem.depth) != null ? _104_31_ : 0)) + 1
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.depth = depth
            item.tilde = _k_.lpad(1 + depth * 2) + this.symbolName(item)
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

        dirItem.tilde = dirItem.tilde.replace(icons.dir_open,icons.dir_close)
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
            item.tilde = ' ' + this.symbolName(item)
        }
        items.sort((function (a, b)
        {
            return this.weight(a) - this.weight(b)
        }).bind(this))
        select = (select != null ? select : items[1].path)
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