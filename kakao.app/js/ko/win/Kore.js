var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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
        for (var _76_16_ = 0; _76_16_ < list.length; _76_16_++)
        {
            tab = list[_76_16_]
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
        for (var _83_16_ = 0; _83_16_ < list.length; _83_16_++)
        {
            tab = list[_83_16_]
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
            for (var _101_22_ = li = -1, _101_27_ = s.linkId; (_101_22_ <= _101_27_ ? li < s.linkId : li > s.linkId); (_101_22_ <= _101_27_ ? ++li : --li))
            {
                cs += `${s.links[li][0]}◆${s.links[li][1]} `
            }
            cs += `▸ ${s.numLines} ${s.main} ${s.lineId} `
            cs += '▸ '
            for (var _107_22_ = ci = 0, _107_26_ = s.cursors.length; (_107_22_ <= _107_26_ ? ci < s.cursors.length : ci > s.cursors.length); (_107_22_ <= _107_26_ ? ++ci : --ci))
            {
                cs += `${s.cursors[ci][0]}■${s.cursors[ci][1]} `
            }
            cs += '▸ '
            var list = _k_.list(s.selections)
            for (var _112_19_ = 0; _112_19_ < list.length; _112_19_++)
            {
                sl = list[_112_19_]
                cs += `${sl[0]}●${sl[1][0]}■${sl[1][1]} `
            }
            cs += '▸ '
            var list1 = _k_.list(s.highlights)
            for (var _116_19_ = 0; _116_19_ < list1.length; _116_19_++)
            {
                sl = list1[_116_19_]
                cs += `${sl[0]}○${sl[1][0]}■${sl[1][1]} `
            }
            console.log('cs:',cs)
            return cs
        }
        comp = {}
        comp.lines = []
        for (var _124_18_ = li = 0, _124_22_ = state.state.lineId; (_124_18_ <= _124_22_ ? li < state.state.lineId : li > state.state.lineId); (_124_18_ <= _124_22_ ? ++li : --li))
        {
            comp.lines.push(state.state.lines[li])
        }
        comp.history = state.history.map(function (hs)
        {
            return compress(hs)
        })
        comp.history.push(compress(state.state))
        console.log('comp',comp)
        state.comp = comp
        return state
    }

    Kore.prototype["decompressState"] = function (state)
    {
        var comp, decomp, decompress, history

        if (comp = state.comp)
        {
            decompress = function (s)
            {
                var cursors, dcp, highlights, i, idx, lineId, lines, linkNum, links, main, numLines, numMain, selections, xy

                var _149_66_ = s.split('▸').map(function (s)
                {
                    return _k_.trim(s)
                }); links = _149_66_[0]; numMain = _149_66_[1]; cursors = _149_66_[2]; selections = _149_66_[3]; highlights = _149_66_[4]

                console.log('s',s)
                console.log('ss',links,numMain,cursors,selections,highlights)
                var _154_41_ = numMain.split(' ').map(function (n)
                {
                    return parseInt(n)
                }); numLines = _154_41_[0]; main = _154_41_[1]; lineId = _154_41_[2]

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
                for (var _165_27_ = idx = -1, _165_32_ = linkNum.length - 1; (_165_27_ <= _165_32_ ? idx < linkNum.length - 1 : idx > linkNum.length - 1); (_165_27_ <= _165_32_ ? ++idx : --idx))
                {
                    links[idx] = linkNum[idx + 1]
                }
                lines = {}
                for (var _169_25_ = i = 0, _169_29_ = lineId; (_169_25_ <= _169_29_ ? i < lineId : i > lineId); (_169_25_ <= _169_29_ ? ++i : --i))
                {
                    lines[i] = comp.lines[i]
                }
                dcp = {numLines:numLines,main:main,cursors:cursors,selections:selections,highlights:highlights,links:links,lines:lines,lineId:lineId}
                console.log('dcp:',dcp)
                return dcp
            }
            history = comp.history.map(function (hs)
            {
                return decompress(hs)
            })
            decomp = {file:state.file,state:history.pop(),redos:null,history:history}
            console.log('decomp',decomp)
            console.log('state',state)
        }
        return state
    }

    return Kore
})()

export default window.kore = new Kore;