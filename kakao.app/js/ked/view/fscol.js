var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var fscol

import kxk from "../../kxk.js"
let slash = kxk.slash
let post = kxk.post
let kstr = kxk.kstr

import nfs from "../../kxk/nfs.js"

import choices from "./choices.js"

import rgxs from './quicky.json' with { type : "json" }

fscol = (function ()
{
    _k_.extend(fscol, choices)
    function fscol (screen, name)
    {
        this["onMouse"] = this["onMouse"].bind(this)
        fscol.__super__.constructor.call(this,screen,name,['scrllr'])
        this.dirOpenSymbol = ''
        this.dirCloseSymbol = ''
        this.frontRoundOffset = 1
        this.state.syntax.setRgxs(rgxs)
    }

    fscol.prototype["show"] = function (dir)
    {
        this.cells.rows = 1
        return this.listDir(dir)
    }

    fscol.prototype["isCursorVisible"] = function ()
    {
        return false
    }

    fscol.prototype["visible"] = function ()
    {
        return this.cells.rows > 0
    }

    fscol.prototype["onMouse"] = function (event)
    {
        var col, row

        if (this.hidden())
        {
            return
        }
        var _a_ = this.cells.posForEvent(event); col = _a_[0]; row = _a_[1]

        if (this.hoverIndex >= 0 && (this.cells.isOutsideEvent(event) || this.state.isInvalidLineIndex(row)))
        {
            return this.unhover()
        }
        return fscol.__super__.onMouse.call(this,event)
    }

    fscol.prototype["listDir"] = async function (dir)
    {
        var item, items, selectIndex, weight

        try
        {
            items = await nfs.list(dir,{recursive:false})
        }
        catch (err)
        {
            console.log('list error',dir,String(err))
            return
        }
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.tilde = slash.file(item.path)
            item.tilde = (((item.type === 'dir') ? (this.dirCloseSymbol + ' ') : '  ')) + item.tilde
        }
        weight = (function (item)
        {
            var p, w

            p = slash.parse(item.path)
            w = 0
            if (item.tilde === this.dirCloseSymbol + ' ..')
            {
                return w
            }
            if (item.type === 'file')
            {
                w += 10000
            }
            if (item.tilde.startsWith(this.dirCloseSymbol + ' .'))
            {
                w += 1000
            }
            if (_k_.in(slash.ext(item.tilde),['js','json']))
            {
                w += 1
            }
            w += kstr.weight(p.file)
            return w
        }).bind(this)
        items.sort(function (a, b)
        {
            return weight(a) - weight(b)
        })
        items.unshift({tilde:''})
        selectIndex = 0
        this.set(items,'tilde')
        this.state.setView([0,0])
        return post.emit('redraw')
    }

    return fscol
})()

export default fscol;