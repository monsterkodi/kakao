var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var Kore

import kxk from "../../kxk.js"
let isEqual = kxk.isEqual
let immutable = kxk.immutable
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
            console.log('set tabs',value)
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
            console.log('get tabs',r)
        }
        return r
    }

    Kore.prototype["compressTabStates"] = function (tabs)
    {
        var tab

        var list = _k_.list(tabs)
        for (var _87_16_ = 0; _87_16_ < list.length; _87_16_++)
        {
            tab = list[_87_16_]
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
        for (var _94_16_ = 0; _94_16_ < list.length; _94_16_++)
        {
            tab = list[_94_16_]
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
            for (var _112_22_ = li = -1, _112_27_ = s.linkId; (_112_22_ <= _112_27_ ? li < s.linkId : li > s.linkId); (_112_22_ <= _112_27_ ? ++li : --li))
            {
                cs += `${s.links[li][0]}◆${s.links[li][1]} `
            }
            cs += `▸ ${s.numLines} ${s.main} ${s.lineId} `
            cs += '▸ '
            for (var _118_22_ = ci = 0, _118_26_ = s.cursors.length; (_118_22_ <= _118_26_ ? ci < s.cursors.length : ci > s.cursors.length); (_118_22_ <= _118_26_ ? ++ci : --ci))
            {
                cs += `${s.cursors[ci][0]}■${s.cursors[ci][1]} `
            }
            cs += '▸ '
            var list = _k_.list(s.selections)
            for (var _123_19_ = 0; _123_19_ < list.length; _123_19_++)
            {
                sl = list[_123_19_]
                cs += `${sl[0]}●${sl[1][0]}■${sl[1][1]} `
            }
            cs += '▸ '
            var list1 = _k_.list(s.highlights)
            for (var _127_19_ = 0; _127_19_ < list1.length; _127_19_++)
            {
                sl = list1[_127_19_]
                cs += `${sl[0]}○${sl[1][0]}■${sl[1][1]} `
            }
            return cs
        }
        comp = {file:state.file,redos:[]}
        comp.lines = []
        for (var _133_18_ = li = 0, _133_22_ = state.state.lineId; (_133_18_ <= _133_22_ ? li < state.state.lineId : li > state.state.lineId); (_133_18_ <= _133_22_ ? ++li : --li))
        {
            comp.lines.push(state.state.lines[li])
        }
        comp.history = state.history.map(function (hs)
        {
            return compress(hs)
        })
        comp.history.push(compress(state.state))
        console.log('comp',comp)
        return comp
    }

    Kore.prototype["decompressState"] = function (state)
    {
        var decomp, decompress, file, history

        console.log('decompressState',state)
        if (_k_.empty(state.history))
        {
            return
        }
        decompress = function (s)
        {
            var comp, cursors, highlights, i, idx, lineId, lines, linkNum, links, main, numLines, numMain, selections, xy

            console.log('decompress s',s)
            if (!(_k_.isStr(s)))
            {
                return
            }
            var _161_62_ = s.split('▸').map(function (s)
            {
                return _k_.trim(s)
            }); links = _161_62_[0]; numMain = _161_62_[1]; cursors = _161_62_[2]; selections = _161_62_[3]; highlights = _161_62_[4]

            var _163_37_ = numMain.split(' ').map(function (n)
            {
                return parseInt(n)
            }); numLines = _163_37_[0]; main = _163_37_[1]; lineId = _163_37_[2]

            xy = function (s)
            {
                return s.split('■').map(function (n)
                {
                    return parseInt(n)
                })
            }
            cursors = cursors.split(' ').map(xy)
            selections = (_k_.empty(selections) ? [] : selections.split(' ').map(function (ss)
            {
                var sss

                console.log('ss',ss)
                sss = ss.split('●')
                return [parseInt(sss[0]),xy(sss[1])]
            }))
            highlights = (_k_.empty(highlights) ? [] : highlights.split(' ').map(function (ss)
            {
                var sss

                console.log('ss',ss)
                sss = ss.split('○')
                return [parseInt(sss[0]),xy(sss[1])]
            }))
            linkNum = links.split(' ').map(function (s)
            {
                return s.split('◆').map(function (n)
                {
                    return parseInt(n)
                })
            })
            links = {}
            for (var _174_23_ = idx = -1, _174_28_ = linkNum.length - 1; (_174_23_ <= _174_28_ ? idx < linkNum.length - 1 : idx > linkNum.length - 1); (_174_23_ <= _174_28_ ? ++idx : --idx))
            {
                links[idx] = linkNum[idx + 1]
            }
            lines = {}
            for (var _178_21_ = i = 0, _178_25_ = lineId; (_178_21_ <= _178_25_ ? i < lineId : i > lineId); (_178_21_ <= _178_25_ ? ++i : --i))
            {
                lines[i] = state.lines[i]
            }
            comp = {numLines:numLines,main:main,cursors:cursors,selections:selections,highlights:highlights,links:links,lines:lines,lineId:lineId}
            comp = immutable(comp)
            console.log('comp:',comp)
            return comp
        }
        history = state.history.map(function (hs)
        {
            return decompress(hs)
        })
        file = state.file
        console.log('file:',file)
        console.log('history>',history)
        state = history.pop()
        console.log('state:',state)
        console.log('history:',history)
        decomp = {file:file,state:state,history:history,redos:[]}
        console.log('decomp:',decomp)
        return decomp
    }

    return Kore
})()

export default window.kore = new Kore;