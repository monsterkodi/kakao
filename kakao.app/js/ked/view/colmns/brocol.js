var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var brocol

import kxk from "../../../kxk.js"
let slash = kxk.slash
let post = kxk.post
let kstr = kxk.kstr

import nfs from "../../../kxk/nfs.js"

import icons from "../../theme/icons.js"

import choices from "../menu/choices.js"

import diritem from "./diritem.js"

import rgxs from './quicky.json' with { type : "json" }

brocol = (function ()
{
    _k_.extend(brocol, choices)
    function brocol (screen, name)
    {
        this["onMouse"] = this["onMouse"].bind(this)
        brocol.__super__.constructor.call(this,screen,name,['scrllr'])
        this.frontRoundOffset = 2
        this.state.syntax.setRgxs(rgxs)
    }

    brocol.prototype["show"] = function (dir)
    {
        this.listDir(dir)
        return brocol.__super__.show.call(this)
    }

    brocol.prototype["isCursorVisible"] = function ()
    {
        return false
    }

    brocol.prototype["onMouse"] = function (event)
    {
        var col, ret, row

        if (this.hidden())
        {
            return
        }
        var _a_ = this.cells.posForEvent(event); col = _a_[0]; row = _a_[1]

        ret = brocol.__super__.onMouse.call(this,event)
        if (this.hoverIndex >= 0 && (!(this.hover) || this.state.isInvalidLineIndex(row)))
        {
            return this.unhover()
        }
        return ret
    }

    brocol.prototype["listDir"] = async function (dir)
    {
        var item, items, weight

        try
        {
            items = await nfs.list(dir,{recursive:false})
        }
        catch (err)
        {
            this.clear()
            post.emit('redraw')
            return
        }
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.tilde = ' ' + diritem.symbolName(item)
        }
        weight = (function (item)
        {
            var p, w

            p = slash.parse(item.path)
            w = 0
            if (item.type === 'file')
            {
                w += 10000
            }
            if (item.tilde.startsWith(icons.dir + ' .'))
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
        this.set(items,'tilde')
        this.state.setView([0,0])
        return post.emit('redraw')
    }

    return brocol
})()

export default brocol;