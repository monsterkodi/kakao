var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Do

import kxk from "../../kxk.js"
let isEqual = kxk.isEqual
let immutable = kxk.immutable
let profile = kxk.profile
let events = kxk.events

import ranges from "../tools/ranges.js"

import DoState from "./DoState.js"


Do = (function ()
{
    _k_.extend(Do, events)
    function Do (lines = [])
    {
        Do.__super__.constructor.call(this)
    
        this.setLines(lines)
    }

    Do.prototype["tabState"] = function ()
    {
        var c, changes, chg, index, nxt, o, prv

        changes = []
        for (var _a_ = index = 0, _b_ = this.history.length - 1 - this.undos; (_a_ <= _b_ ? index < this.history.length - 1 - this.undos : index > this.history.length - 1 - this.undos); (_a_ <= _b_ ? ++index : --index))
        {
            chg = this.calculateChanges(this.history[index],this.history[index + 1])
            if (!_k_.empty((chg != null ? chg.changes : undefined)))
            {
                o = {}
                var list = _k_.list(chg.changes)
                for (var _c_ = 0; _c_ < list.length; _c_++)
                {
                    c = list[_c_]
                    switch (c.change)
                    {
                        case 'changed':
                            o[`■ ${c.doIndex}`] = `■${c.after}■`
                            break
                        case 'inserted':
                            o[`● ${c.doIndex}`] = `●${c.after}●`
                            break
                        case 'deleted':
                            o[`○ ${c.doIndex} ${c.oldIndex}`] = '○'
                            break
                    }

                }
                changes.push(o)
            }
        }
        if (changes.length > 1)
        {
            index = changes.length - 1
            while (index > 0)
            {
                prv = changes[index - 1]
                nxt = changes[index]
                if (isEqual(Object.keys(prv),Object.keys(nxt)))
                {
                    changes.splice(index - 1,1)
                }
                index--
            }
        }
        return changes
    }

    Do.prototype["setTabState"] = function (tabState)
    {
        var changes, index, key, type, value

        var list = _k_.list(tabState)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            changes = list[_a_]
            this.start()
            for (key in changes)
            {
                value = changes[key]
                var _b_ = key.split(' '); type = _b_[0]; index = _b_[1]

                switch (type)
                {
                    case '○':
                        this.delete(index)
                        break
                    case '●':
                        this.insert(index,value.slice(1, value.length - 1))
                        break
                    case '■':
                        this.change(index,value.slice(1, value.length - 1))
                        break
                }

            }
            this.end()
        }
        return this
    }

    Do["applyStateToText"] = function (tabState, text)
    {
        var changes, index, key, lines, tmpDo, type, value

        lines = text.split(/\r?\n/)
        tmpDo = new Do(lines)
        var list = _k_.list(tabState)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            changes = list[_a_]
            for (key in changes)
            {
                value = changes[key]
                var _b_ = key.split(' '); type = _b_[0]; index = _b_[1]

                switch (type)
                {
                    case '○':
                        tmpDo.delete(index)
                        break
                    case '●':
                        tmpDo.insert(index,value.slice(1, value.length - 1))
                        break
                    case '■':
                        tmpDo.change(index,value.slice(1, value.length - 1))
                        break
                }

            }
        }
        return tmpDo.text()
    }

    Do.prototype["setLines"] = function (lines)
    {
        this.state = new DoState(lines)
        this.reset()
        return this.history.push(this.state.s)
    }

    Do.prototype["resetHistory"] = function ()
    {
        return this.setLines(this.lines())
    }

    Do.prototype["reset"] = function ()
    {
        this.undos = 0
        this.doCount = 0
        return this.history = []
    }

    Do.prototype["start"] = function ()
    {
        return this.doCount += 1
    }

    Do.prototype["isDoing"] = function ()
    {
        return this.doCount > 0
    }

    Do.prototype["end"] = function (opt)
    {
        var changes

        this.doCount -= 1
        if (this.doCount === 0)
        {
            changes = this.calculateChanges(this.history.slice(-1)[0],this.state.s)
            this.history.push(this.state.s)
            if (!_k_.empty(changes))
            {
                this.emit('changes',changes)
            }
        }
        return null
    }

    Do.prototype["change"] = function (index, text)
    {
        return this.state.changeLine(index,text)
    }

    Do.prototype["insert"] = function (index, text)
    {
        return this.state.insertLine(index,text)
    }

    Do.prototype["delete"] = function (index)
    {
        return this.state.deleteLine(index)
    }

    Do.prototype["append"] = function (text)
    {
        return this.state.appendLine(text)
    }

    Do.prototype["undo"] = function ()
    {
        var changes

        if (this.undos + 1 < this.history.length)
        {
            this.undos += 1
            changes = this.calculateChanges(this.state.s,this.history[this.history.length - 1 - this.undos])
            this.state = new DoState(this.history[this.history.length - 1 - this.undos])
            if (!_k_.empty(changes))
            {
                return this.emit('changes',changes)
            }
        }
    }

    Do.prototype["redo"] = function ()
    {
        var changes

        if (this.undos <= 0)
        {
            return
        }
        if (this.undos - 1 < this.history.length)
        {
            this.undos -= 1
            changes = this.calculateChanges(this.state.s,this.history[this.history.length - 1 - this.undos])
            this.state = new DoState(this.history[this.history.length - 1 - this.undos])
            return this.emit('changes',changes)
        }
    }

    Do.prototype["select"] = function (newSelections)
    {
        if (newSelections.length)
        {
            newSelections = cleanRanges(newSelections)
            return this.state.setSelections(newSelections)
        }
        else
        {
            return this.state.setSelections([])
        }
    }

    Do.prototype["setCursors"] = function (newCursors, opt)
    {
        var mainCursor, mainIndex

        if (!(newCursors != null) || newCursors.length < 1)
        {
            return console.error("Do.setCursors -- empty cursors?")
        }
        if ((opt != null ? opt.main : undefined))
        {
            switch (opt.main)
            {
                case 'first':
                    mainIndex = 0
                    break
                case 'last':
                    mainIndex = newCursors.length - 1
                    break
                case 'closest':
                    mainIndex = newCursors.indexOf(posClosestToPosInPositions(this.state.mainCursor(),newCursors))
                    break
                default:
                    mainIndex = newCursors.indexOf(opt.main)
                    if (mainIndex < 0)
                {
                    mainIndex = parseInt(opt.main)
                }
            }

        }
        else
        {
            mainIndex = newCursors.length - 1
        }
        mainCursor = newCursors[mainIndex]
        this.cleanCursors(newCursors)
        mainIndex = newCursors.indexOf(posClosestToPosInPositions(mainCursor,newCursors))
        this.state.setCursors(newCursors)
        return this.state.setMain(mainIndex)
    }

    Do.prototype["setMain"] = function (m)
    {
        return this.state.set('main',m)
    }

    Do.prototype["setSelections"] = function (s)
    {
        return this.state.setSelections(s)
    }

    Do.prototype["setHighlights"] = function (h)
    {
        return this.state.setHighlights(h)
    }

    Do.prototype["addHighlight"] = function (h)
    {
        return this.state.addHighlight(h)
    }

    Do.prototype["cleanCursors"] = function (cs)
    {
        var c, ci, p

        var list = _k_.list(cs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            p = list[_a_]
            p[0] = Math.max(p[0],0)
            p[1] = _k_.clamp(0,this.state.numLines() - 1,p[1])
        }
        sortPositions(cs)
        if (cs.length > 1)
        {
            for (var _b_ = ci = cs.length - 1, _c_ = 0; (_b_ <= _c_ ? ci < 0 : ci > 0); (_b_ <= _c_ ? ++ci : --ci))
            {
                c = cs[ci]
                p = cs[ci - 1]
                if (c[1] === p[1] && c[0] === p[0])
                {
                    cs.splice(ci,1)
                }
            }
        }
        return cs
    }

    Do.prototype["hasChanges"] = function ()
    {
        var changes

        if (_k_.empty(this.history))
        {
            return false
        }
        changes = this.calculateChanges(this.history[0],this.state.s)
        if (_k_.empty(changes))
        {
            return false
        }
        return changes.changes.length > 0
    }

    Do.prototype["calculateChanges"] = function (oldState, newState)
    {
        var changes, dd, deletes, inserts, newLines, ni, nl, oi, ol, oldLines

        if (_k_.empty(oldState))
        {
            return
        }
        if (_k_.empty(newState))
        {
            return
        }
        oi = 0
        ni = 0
        dd = 0
        changes = []
        oldLines = DoState.lines(oldState)
        newLines = DoState.lines(newState)
        inserts = 0
        deletes = 0
        if (oldLines !== newLines)
        {
            ol = oldLines[oi]
            nl = newLines[ni]
            while (oi < oldLines.length)
            {
                if (!(nl != null))
                {
                    deletes += 1
                    changes.push({change:'deleted',oldIndex:oi,doIndex:oi + dd})
                    oi += 1
                    dd -= 1
                }
                else if (ol === nl)
                {
                    oi += 1
                    ni += 1
                    ol = oldLines[oi]
                    nl = newLines[ni]
                }
                else
                {
                    if (nl === oldLines[oi + 1] && ol === newLines[ni + 1])
                    {
                        changes.push({change:'changed',oldIndex:oi,newIndex:ni,doIndex:oi + dd,after:nl})
                        oi += 1
                        ni += 1
                        changes.push({change:'changed',oldIndex:oi,newIndex:ni,doIndex:oi + dd,after:ol})
                        oi += 1
                        ni += 1
                        ol = oldLines[oi]
                        nl = newLines[ni]
                    }
                    else if (nl === oldLines[oi + 1] && oldLines[oi + 1] !== newLines[ni + 1])
                    {
                        changes.push({change:'deleted',oldIndex:oi,doIndex:oi + dd})
                        oi += 1
                        dd -= 1
                        deletes += 1
                        ol = oldLines[oi]
                    }
                    else if (ol === newLines[ni + 1] && oldLines[oi + 1] !== newLines[ni + 1])
                    {
                        changes.push({change:'inserted',newIndex:ni,doIndex:oi + dd,after:nl})
                        ni += 1
                        dd += 1
                        inserts += 1
                        nl = newLines[ni]
                    }
                    else
                    {
                        changes.push({change:'changed',oldIndex:oi,newIndex:ni,doIndex:oi + dd,after:nl})
                        oi += 1
                        ol = oldLines[oi]
                        ni += 1
                        nl = newLines[ni]
                    }
                }
            }
            while (ni < newLines.length)
            {
                inserts += 1
                changes.push({change:'inserted',newIndex:ni,doIndex:ni,after:nl})
                ni += 1
                nl = newLines[ni]
            }
        }
        return {changes:changes,inserts:inserts,deletes:deletes,cursors:oldState.cursors !== newState.cursors,selects:oldState.selections !== newState.selections}
    }

    Do.prototype["text"] = function ()
    {
        return this.state.text()
    }

    Do.prototype["line"] = function (i)
    {
        return this.state.line(i)
    }

    Do.prototype["cursor"] = function (i)
    {
        return this.state.cursor(i)
    }

    Do.prototype["highlight"] = function (i)
    {
        return this.state.highlight(i)
    }

    Do.prototype["selection"] = function (i)
    {
        return this.state.selection(i)
    }

    Do.prototype["lines"] = function ()
    {
        return this.state.lines()
    }

    Do.prototype["cursors"] = function ()
    {
        return this.state.cursors()
    }

    Do.prototype["highlights"] = function ()
    {
        return this.state.highlights()
    }

    Do.prototype["selections"] = function ()
    {
        return this.state.selections()
    }

    Do.prototype["numLines"] = function ()
    {
        return this.state.numLines()
    }

    Do.prototype["numCursors"] = function ()
    {
        return this.state.numCursors()
    }

    Do.prototype["numSelections"] = function ()
    {
        return this.state.numSelections()
    }

    Do.prototype["numHighlights"] = function ()
    {
        return this.state.numHighlights()
    }

    Do.prototype["textInRange"] = function (r)
    {
        var _386_39_

        return (this.state.line(r[0]) != null ? this.state.line(r[0]).slice(r[1][0],r[1][1]) : undefined)
    }

    Do.prototype["mainCursor"] = function ()
    {
        return this.state.mainCursor()
    }

    Do.prototype["rangeForLineAtIndex"] = function (i)
    {
        return [i,[0,this.line(i).length]]
    }

    return Do
})()

export default Do;