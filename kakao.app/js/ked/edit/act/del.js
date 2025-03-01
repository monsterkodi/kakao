var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let kseg = kxk.kseg

import util from "../../util/util.js"

export default {delete:function (type, jump)
{
    var ci, cursor, cursors, dc, line, lines, minBeforeWs, remove, rng, segi, x, y

    if (_k_.in(type,['back','next']) && !_k_.empty(this.s.selections))
    {
        return this.deleteSelection()
    }
    lines = this.allLines()
    cursors = this.allCursors()
    if (cursors.length === 1 && _k_.in(type,['back','next']) && util.isLinesPosOutside(lines,cursors[0]))
    {
        return this.setMainCursor(kseg.width(lines[cursors[0][1]]),cursors[0][1])
    }
    if (type === 'back')
    {
        minBeforeWs = Infinity
        var list = _k_.list(cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cursor = list[_a_]
            rng = util.rangeOfWhitespaceLeftToPos(lines,cursor)
            minBeforeWs = _k_.min(minBeforeWs,rng[2] - rng[0])
        }
    }
    for (var _b_ = ci = cursors.length - 1, _c_ = 0; (_b_ <= _c_ ? ci <= 0 : ci >= 0); (_b_ <= _c_ ? ++ci : --ci))
    {
        cursor = cursors[ci]
        var _d_ = cursor; x = _d_[0]; y = _d_[1]

        line = lines[y]
        remove = 1
        dc = 0
        switch (type)
        {
            case 'eol':
                line = line.slice(0, typeof x === 'number' ? x : -1)
                break
            case 'back':
                if (x === 0)
                {
                    if (cursors.length === 1)
                    {
                        if (y <= 0)
                        {
                            return
                        }
                        y -= 1
                        x = kseg.width(lines[y])
                        remove = 2
                        line = kseg.join(lines[y],line)
                        cursor[0] = x
                        cursor[1] = y
                    }
                }
                else
                {
                    if (jump)
                    {
                        if (rng = util.rangeOfWordOrWhitespaceLeftToPos(lines,cursor))
                        {
                            dc = rng[2] - rng[0]
                        }
                        else
                        {
                            dc = 1
                        }
                    }
                    else
                    {
                        if (minBeforeWs > 1)
                        {
                            dc = x % 4
                            if (dc === 0)
                            {
                                dc = 4
                            }
                            dc = _k_.min(minBeforeWs,dc)
                        }
                        else
                        {
                            dc = 1
                        }
                    }
                    if (x <= kseg.width(line))
                    {
                        segi = kseg.indexAtWidth(line,x)
                        line = kseg.join(line.slice(0, segi - dc),line.slice(segi))
                    }
                }
                break
            case 'next':
                if (x === kseg.width(lines[y]))
                {
                    if (cursors.length === 1)
                    {
                        if (y >= lines.length - 1)
                        {
                            return
                        }
                        x = kseg.width(lines[y])
                        remove = 2
                        line = kseg.join(line,lines[y + 1])
                        cursor[0] = x
                        cursor[1] = y
                    }
                }
                else
                {
                    if (jump)
                    {
                        if (rng = util.rangeOfWordOrWhitespaceRightToPos(lines,cursor))
                        {
                            dc = rng[2] - rng[0]
                            line = kseg.join(line.slice(0, typeof x === 'number' ? x : -1),line.slice(x + dc))
                        }
                    }
                    else
                    {
                        dc = 1
                        line = kseg.join(line.slice(0, typeof x === 'number' ? x : -1),line.slice(x + dc))
                    }
                    cursor[0] += dc
                }
                break
        }

        util.moveCursorsInSameLineBy(cursors,cursor,-dc)
        lines.splice(y,remove,line)
    }
    this.clearHighlights()
    this.setLines(lines)
    return this.setCursors(cursors)
},deleteSelection:function ()
{
    return this.deleteRanges(this.allSelections(),this.allCursors())
},deleteRanges:function (rngs, posl)
{
    var cursors, lines

    if (_k_.empty(rngs))
    {
        return
    }
    posl = (posl != null ? posl : this.allCursors())
    if (!this.beginIndex)
    {
        this.pushState()
    }
    var _e_ = util.deleteLineRangesAndAdjustPositions(this.allLines(),rngs,posl); lines = _e_[0]; cursors = _e_[1]

    this.deselect()
    this.clearHighlights()
    this.setLines(lines)
    return this.setCursors(cursors)
}}