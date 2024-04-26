var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = performance.now(); }, profilend: function (id) { var b = performance.now()-_k_.hrtime[id]; let f=0.001; for (let u of ['s','ms','μs','ns']) { if (u=='ns' || (b*f)>=1) { return console.log(id+' '+Number.parseFloat(b*f).toFixed(1)+' '+u); } f*=1000; }}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../kxk.js"
let immutable = kxk.immutable
let post = kxk.post

import ranges from "../tools/ranges.js"

import EditorState from "./EditorState.js"

class Do
{
    constructor (editor)
    {
        this.editor = editor
    
        this.reset()
    }

    del ()
    {
        return post.removeListener('fileLineChanges',this.onFileLineChanges)
    }

    tabState ()
    {
        var _32_25_

        return {saveIndex:this.saveIndex,history:this.history,redos:this.redos,state:(this.state != null ? this.state.s : undefined),file:this.editor.currentFile}
    }

    setTabState (tabState)
    {
        this.groupCount = 0
        this.saveIndex = tabState.saveIndex
        this.history = tabState.history
        this.redos = tabState.redos
        return this.state = new EditorState(immutable(tabState.state))
    }

    reset ()
    {
        this.groupCount = 0
        this.saveIndex = 0
        this.history = []
        this.redos = []
        return this.state = null
    }

    hasChanges ()
    {
        var ts

        if (this.saveIndex < this.history.length)
        {
            ts = new EditorState(this.history[this.saveIndex])
            if (ts.text() === this.editor.text())
            {
                return false
            }
        }
        return true
    }

    start ()
    {
        this.groupCount += 1
        if (this.groupCount === 1)
        {
            this.startState = this.state = new EditorState(this.editor.state.s,this.editor.state.lineCache)
            if (_k_.empty((this.history)) || this.state.s !== _k_.last(this.history))
            {
                return this.history.push(this.state.s)
            }
        }
    }

    isDoing ()
    {
        return this.groupCount > 0
    }

    change (index, text)
    {
        return this.state = this.state.changeLine(index,text)
    }

    insert (index, text)
    {
        return this.state = this.state.insertLine(index,text)
    }

    delete (index)
    {
        if (this.numLines() >= 1 && (0 <= index && index < this.numLines()))
        {
            this.editor.emit('willDeleteLine',this.line(index))
            return this.state = this.state.deleteLine(index)
        }
    }

    end (opt)
    {
        var changes, _113_27_

        this.redos = []
        this.groupCount -= 1
        if (this.groupCount === 0)
        {
            changes = this.calculateChanges(this.startState,this.state)
            this.editor.setState(this.state)
            ;(typeof this.editor.changed === "function" ? this.editor.changed(changes) : undefined)
        }
        return null
    }

    undo ()
    {
        var changes, _135_27_

        if (this.history.length)
        {
            if (_k_.empty(this.redos))
            {
                this.redos.unshift(this.editor.state.s)
            }
            this.state = new EditorState(this.history.pop())
            this.redos.unshift(this.state.s)
            changes = this.calculateChanges(this.editor.state,this.state)
            this.editor.setState(this.state)
            return (typeof this.editor.changed === "function" ? this.editor.changed(changes) : undefined)
        }
    }

    redo ()
    {
        var changes, _156_27_

        if (this.redos.length)
        {
            if (this.redos.length > 1)
            {
                this.history.push(this.redos.shift())
            }
            this.state = new EditorState(this.redos[0])
            if (this.redos.length === 1)
            {
                this.redos = []
            }
            changes = this.calculateChanges(this.editor.state,this.state)
            this.editor.setState(this.state)
            return (typeof this.editor.changed === "function" ? this.editor.changed(changes) : undefined)
        }
    }

    select (newSelections)
    {
        if (newSelections.length)
        {
            newSelections = cleanRanges(newSelections)
            return this.state = this.state.setSelections(newSelections)
        }
        else
        {
            return this.state = this.state.setSelections([])
        }
    }

    setCursors (newCursors, opt)
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
                    mainIndex = newCursors.indexOf(posClosestToPosInPositions(this.editor.mainCursor(),newCursors))
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
        this.state = this.state.setCursors(newCursors)
        return this.state = this.state.setMain(mainIndex)
    }

    calculateChanges (oldState, newState)
    {
        var changes, dd, deletions, insertions, newLines, ni, nl, oi, ol, oldLines

        oi = 0
        ni = 0
        dd = 0
        changes = []
        oldLines = oldState.lines()
        newLines = newState.lines()
        insertions = 0
        deletions = 0
        if (oldLines !== newLines)
        {
            ol = oldLines[oi]
            nl = newLines[ni]
            while (oi < oldLines.length)
            {
                if (!(nl != null))
                {
                    deletions += 1
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
                        deletions += 1
                        ol = oldLines[oi]
                    }
                    else if (ol === newLines[ni + 1] && oldLines[oi + 1] !== newLines[ni + 1])
                    {
                        changes.push({change:'inserted',newIndex:ni,doIndex:oi + dd,after:nl})
                        ni += 1
                        dd += 1
                        insertions += 1
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
                insertions += 1
                changes.push({change:'inserted',newIndex:ni,doIndex:ni,after:nl})
                ni += 1
                nl = newLines[ni]
            }
        }
        return {changes:changes,inserts:insertions,deletes:deletions,cursors:oldState.s.cursors !== newState.s.cursors,selects:oldState.s.selections !== newState.s.selections}
    }

    merge ()
    {
        var a, b, c, la, lb, lc, li, numLines

        return
        _k_.profile('Do.merge')
        while (this.history.length > 1)
        {
            b = this.history[this.history.length - 2]
            a = _k_.last(this.history)
            if (a.text() === b.text())
            {
                if (this.history.length > 2)
                {
                    console.log('splice history1',this.history.length - 2)
                    this.history.splice(this.history.length - 2,1)
                }
                else
                {
                    console.log('bail history1')
                    return
                }
            }
            else if (this.history.length > 2)
            {
                c = this.history[this.history.length - 3]
                if ((a.numLines() === b.numLines() && b.numLines() === c.numLines()))
                {
                    numLines = a.numLines()
                    for (var _319_31_ = li = 0, _319_35_ = numLines; (_319_31_ <= _319_35_ ? li < numLines : li > numLines); (_319_31_ <= _319_35_ ? ++li : --li))
                    {
                        _k_.profile('lines')
                        la = a.line(li)
                        lb = b.line(li)
                        lc = c.line(li)
                        _k_.profilend('lines')
                        if (la === lb && lc !== lb || la !== lb && lc === lb)
                        {
                            return
                        }
                    }
                    console.log('splice history2',this.history.length - 2)
                    this.history.splice(this.history.length - 2,1)
                }
                else
                {
                    return
                }
            }
            else
            {
                return
            }
        }
        _k_.profilend('Do.merge')
    }

    cleanCursors (cs)
    {
        var c, ci, p

        var list = _k_.list(cs)
        for (var _340_14_ = 0; _340_14_ < list.length; _340_14_++)
        {
            p = list[_340_14_]
            p[0] = Math.max(p[0],0)
            p[1] = _k_.clamp(0,this.state.numLines() - 1,p[1])
        }
        sortPositions(cs)
        if (cs.length > 1)
        {
            for (var _347_22_ = ci = cs.length - 1, _347_36_ = 0; (_347_22_ <= _347_36_ ? ci < 0 : ci > 0); (_347_22_ <= _347_36_ ? ++ci : --ci))
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

    text ()
    {
        return this.state.text()
    }

    line (i)
    {
        return this.state.line(i)
    }

    cursor (i)
    {
        return this.state.cursor(i)
    }

    highlight (i)
    {
        return this.state.highlight(i)
    }

    selection (i)
    {
        return this.state.selection(i)
    }

    lines ()
    {
        return this.state.lines()
    }

    cursors ()
    {
        return this.state.cursors()
    }

    highlights ()
    {
        return this.state.highlights()
    }

    selections ()
    {
        return this.state.selections()
    }

    numLines ()
    {
        return this.state.numLines()
    }

    numCursors ()
    {
        return this.state.numCursors()
    }

    numSelections ()
    {
        return this.state.numSelections()
    }

    numHighlights ()
    {
        return this.state.numHighlights()
    }

    textInRange (r)
    {
        var _376_41_

        return (this.state.line(r[0]) != null ? this.state.line(r[0]).slice(r[1][0],r[1][1]) : undefined)
    }

    mainCursor ()
    {
        return this.state.mainCursor()
    }

    rangeForLineAtIndex (i)
    {
        return [i,[0,this.line(i).length]]
    }
}

export default Do;