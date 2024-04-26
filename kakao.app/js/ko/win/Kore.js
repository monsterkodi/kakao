var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var Kore

import kxk from "../../kxk.js"
let isEqual = kxk.isEqual
let events = kxk.events


Kore = (function ()
{
    _k_.extend(Kore, events)
    function Kore ()
    {
        this["get"] = this["get"].bind(this)
        this["set"] = this["set"].bind(this)
        return Kore.__super__.constructor.apply(this, arguments)
    }

    Kore.prototype["set"] = function (key, value)
    {
        if (key === 'tabs')
        {
            value = this.compressTabStates(value)
        }
        stash.set(`kore|${key}`,value)
        return this.emit(key,value)
    }

    Kore.prototype["get"] = function (key, def)
    {
        var r

        r = stash.get(`kore|${key}`,def)
        if (key === 'tabs')
        {
            r = this.decompressTabStates(r)
        }
        return r
    }

    Kore.prototype["compressTabStates"] = function (tabs)
    {
        var tab

        var list = _k_.list(tabs)
        for (var _70_16_ = 0; _70_16_ < list.length; _70_16_++)
        {
            tab = list[_70_16_]
            if (tab.state)
            {
                tab.state = this.compressState(tab.state)
            }
        }
        return tabs
    }

    Kore.prototype["decompressTabStates"] = function (tabs)
    {
        var tab

        var list = _k_.list(tabs)
        for (var _77_16_ = 0; _77_16_ < list.length; _77_16_++)
        {
            tab = list[_77_16_]
            if (tab.state)
            {
                tab.state = this.decompressState(tab.state)
            }
        }
        return tabs
    }

    Kore.prototype["compressState"] = function (state)
    {
        var comp, compress, li

        console.log('compressState',state)
        compress = function (s)
        {
            var ci, cs, li, sl

            cs = ''
            for (var _90_22_ = li = -1, _90_27_ = s.linkId; (_90_22_ <= _90_27_ ? li < s.linkId : li > s.linkId); (_90_22_ <= _90_27_ ? ++li : --li))
            {
                cs += `${s.links[li][0]} ${s.links[li][1]} `
            }
            cs += `▸ ${s.numLines} ${s.main} `
            cs += '▸ '
            for (var _96_22_ = ci = 0, _96_26_ = s.cursors.length; (_96_22_ <= _96_26_ ? ci < s.cursors.length : ci > s.cursors.length); (_96_22_ <= _96_26_ ? ++ci : --ci))
            {
                cs += `${s.cursors[ci][0]} ${s.cursors[ci][1]} `
            }
            cs += '▸ '
            var list = _k_.list(s.selections)
            for (var _101_19_ = 0; _101_19_ < list.length; _101_19_++)
            {
                sl = list[_101_19_]
                cs += `${sl[0]} ${sl[1][0]} ${sl[1][1]} `
            }
            cs += '▸ '
            var list1 = _k_.list(s.highlights)
            for (var _105_19_ = 0; _105_19_ < list1.length; _105_19_++)
            {
                sl = list1[_105_19_]
                cs += `${sl[0]} ${sl[1][0]} ${sl[1][1]} `
            }
            console.log(cs)
            return cs
        }
        comp = {}
        comp.lines = []
        for (var _113_18_ = li = 0, _113_22_ = state.state.lineId; (_113_18_ <= _113_22_ ? li < state.state.lineId : li > state.state.lineId); (_113_18_ <= _113_22_ ? ++li : --li))
        {
            comp.lines.push(state.state.lines[li])
        }
        comp.history = state.history.map(function (hs)
        {
            return compress(hs)
        })
        comp.history.push(compress(state.state))
        console.log(comp)
        state.comp = comp
        return state
    }

    Kore.prototype["decompressState"] = function (state)
    {
        var li, lk, ls, nxt, s, vi, vs

        if (s = state.state)
        {
            if (ls = s.ls)
            {
                lk = {}
                vs = ls.split(' ')
                li = -1
                vi = 0
                while (vi < vs.length - 1)
                {
                    nxt = parseInt(vs[vi + 1])
                    if (Number.isNaN(nxt))
                    {
                        nxt = null
                    }
                    lk[li] = [parseInt(vs[vi]),nxt]
                    li++
                    vi += 2
                }
                if (!isEqual(lk,s.links))
                {
                    console.log('not equal▸',lk)
                    console.log('not equal ',s.links)
                }
            }
        }
        return state
    }

    return Kore
})()

export default window.kore = new Kore;