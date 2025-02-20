var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let kseg = kxk.kseg

import util from "../util/util.js"

export default {delete:function (type, mods)
{
    var before, ci, cursor, cursors, dc, line, lines, remove, rng, x, y

    if (_k_.in(type,['back','next']) && !_k_.empty(this.s.selections))
    {
        return this.deleteSelection()
    }
    lines = this.allLines()
    cursors = this.allCursors()
    if (cursors.length === 1 && _k_.in(type,['back','next']) && util.isLinesPosOutside(lines,cursors[0]))
    {
        return this.setMainCursor(lines[cursors[0]].length,cursors[0])
    }
    for (var _a_ = ci = cursors.length - 1, _b_ = 0; (_a_ <= _b_ ? ci <= 0 : ci >= 0); (_a_ <= _b_ ? ++ci : --ci))
    {
        cursor = cursors[ci]
        var _c_ = cursor; x = _c_[0]; y = _c_[1]

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
                        x = lines[y].length
                        remove = 2
                        line = kseg.join(lines[y],line)
                        cursor[0] = x
                        cursor[1] = y
                    }
                }
                else
                {
                    if (mods === 'alt')
                    {
                        rng = util.rangeOfWordOrWhitespaceLeftToPos(lines,cursor)
                        dc = rng[2] - rng[0]
                    }
                    else
                    {
                        before = util.textFromBolToPos(lines,cursor)
                        if (util.isOnlyWhitespace(before))
                        {
                            dc = x % 4
                            if (dc === 0)
                            {
                                dc = 4
                            }
                        }
                        else
                        {
                            dc = 1
                        }
                    }
                    line = line.slice(0, x - dc).concat(line.slice(x))
                }
                break
            case 'next':
                if (x === lines[y].length)
                {
                    if (cursors.length === 1)
                    {
                        if (y >= lines.length - 1)
                        {
                            return
                        }
                        x = lines[y].length
                        remove = 2
                        line = line.concat(lines[y + 1])
                        cursor[0] = x
                        cursor[1] = y
                    }
                }
                else
                {
                    if (mods === 'alt')
                    {
                        if (rng = util.rangeOfWordOrWhitespaceRightToPos(lines,cursor))
                        {
                            dc = rng[2] - rng[0]
                            line = line.slice(0, typeof x === 'number' ? x : -1).concat(line.slice(x + dc))
                        }
                    }
                    else
                    {
                        dc = 1
                        line = line.slice(0, typeof x === 'number' ? x : -1).concat(line.slice(x + dc))
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
    if (!this.beginIndex)
    {
        this.pushState()
    }
    var _d_ = util.deleteLineRangesAndAdjustPositions(this.allLines(),rngs,posl); lines = _d_[0]; cursors = _d_[1]

    this.deselect()
    this.clearHighlights()
    this.setLines(lines)
    return this.setCursors(cursors)
}}