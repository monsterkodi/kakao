var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../kxk.js"
let immutable = kxk.immutable
let post = kxk.post

import ranges from "../tools/ranges.js"

import DoState from "./DoState.js"

class Do2
{
    constructor (lines = [])
    {
        this.setLines(lines)
    }

    tabState ()
    {
        return {history:this.history,undos:this.undos}
    }

    setTabState (tabState)
    {
        this.doCount = 0
        this.history = tabState.history
        return this.undos = tabState.undos
    }

    setLines (lines)
    {
        this.state = new DoState(lines)
        this.reset()
        return this.history.push(this.state.s)
    }

    reset ()
    {
        this.undos = 0
        this.doCount = 0
        return this.history = []
    }

    start ()
    {
        return this.doCount += 1
    }

    isDoing ()
    {
        return this.doCount > 0
    }

    end (opt)
    {
        this.doCount -= 1
        if (this.doCount === 0)
        {
            this.history.push(this.state.s)
        }
        return null
    }

    change (index, text)
    {
        return this.state.changeLine(index,text)
    }

    insert (index, text)
    {
        return this.state.insertLine(index,text)
    }

    delete (index)
    {
        return this.state.deleteLine(index)
    }

    undo ()
    {
        if (this.undos + 1 < this.history.length)
        {
            this.undos += 1
            return this.state = new DoState(this.history[this.history.length - 1 - this.undos])
        }
    }

    redo ()
    {
        if (this.undos <= 0)
        {
            return
        }
        if (this.undos - 1 < this.history.length)
        {
            this.undos -= 1
            return this.state = new DoState(this.history[this.history.length - 1 - this.undos])
        }
    }

    select (newSelections)
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

    cleanCursors (cs)
    {
        var c, ci, p

        var list = _k_.list(cs)
        for (var _167_14_ = 0; _167_14_ < list.length; _167_14_++)
        {
            p = list[_167_14_]
            p[0] = Math.max(p[0],0)
            p[1] = _k_.clamp(0,this.state.numLines() - 1,p[1])
        }
        sortPositions(cs)
        if (cs.length > 1)
        {
            for (var _174_22_ = ci = cs.length - 1, _174_36_ = 0; (_174_22_ <= _174_36_ ? ci < 0 : ci > 0); (_174_22_ <= _174_36_ ? ++ci : --ci))
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

    calculateChanges (oldState, newState)
    {
        var changes, dd, deletes, inserts, newLines, ni, nl, oi, ol, oldLines

        oi = 0
        ni = 0
        dd = 0
        changes = []
        oldLines = oldState.lines()
        newLines = newState.lines()
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
        return {changes:changes,inserts:inserts,deletes:deletes,cursors:oldState.s.cursors !== newState.s.cursors,selects:oldState.s.selections !== newState.s.selections}
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
        var _291_41_

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

export default Do2;