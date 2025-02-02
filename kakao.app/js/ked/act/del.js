var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import kstr from "../../kxk/kstr.js"

import util from "../util/util.js"

export default {delete:function (type, mods)
{
    var before, ci, cursor, cursors, dc, line, lines, remove, rng, x, y

    if (type === 'back' && !_k_.empty(this.s.selections))
    {
        return this.deleteSelection()
    }
    lines = this.allLines()
    cursors = this.allCursors()
    for (var _a_ = ci = cursors.length - 1, _b_ = 0; (_a_ <= _b_ ? ci <= 0 : ci >= 0); (_a_ <= _b_ ? ++ci : --ci))
    {
        cursor = cursors[ci]
        var _c_ = cursor; x = _c_[0]; y = _c_[1]

        if (type === 'back' && cursors.length === 1 && util.isLinesPosOutside(this.s.lines,[x,y]))
        {
            return this.setMainCursor(this.s.lines[y].length,y)
        }
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
                        line = lines[y] + line
                        cursor[0] = x
                        cursor[1] = y
                    }
                }
                else
                {
                    if (_k_.in(mods,['cmd','alt']))
                    {
                        rng = util.rangeOfWordOrWhitespaceLeftToPos(lines,cursor)
                        dc = rng[2] - rng[0]
                        line = kstr.splice(line,x - dc,dc)
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
                            line = kstr.splice(line,x - dc,dc)
                        }
                        else
                        {
                            dc = 1
                            line = kstr.splice(line,x - dc,dc)
                        }
                    }
                }
                break
        }

        util.moveCursorsInSameLineBy(cursors,cursor,-dc)
        lines.splice(y,remove,line)
    }
    this.setLines(lines)
    this.setCursors(cursors)
    this.clearHighlights()
    return this
},deleteOld:function (type, mods)
{
    var before, dc, line, lines, remove, rng, x, y

    if (type === 'back' && !_k_.empty(this.s.selections))
    {
        this.deleteSelection()
        return this
    }
    var _d_ = this.mainCursor(); x = _d_[0]; y = _d_[1]

    if (type === 'back' && util.isLinesPosOutside(this.s.lines,[x,y]))
    {
        this.setMainCursor(this.s.lines[y].length,y)
        return this
    }
    lines = this.allLines()
    line = lines[y]
    remove = 1
    switch (type)
    {
        case 'eol':
            line = line.slice(0, typeof x === 'number' ? x : -1)
            break
        case 'back':
            if (x === 0)
            {
                if (y <= 0)
                {
                    return
                }
                y -= 1
                x = lines[y].length
                remove = 2
                line = lines[y] + line
            }
            else
            {
                if (_k_.in(mods,['cmd','alt']))
                {
                    rng = util.rangeOfWordOrWhitespaceLeftToPos(lines,this.mainCursor())
                    dc = rng[2] - rng[0]
                    x -= dc
                    line = kstr.splice(line,x,dc)
                }
                else
                {
                    before = util.textFromBolToPos(lines,this.mainCursor())
                    if (util.isOnlyWhitespace(before))
                    {
                        dc = x % 4
                        if (dc === 0)
                        {
                            dc = 4
                        }
                        x -= dc
                        line = kstr.splice(line,x,dc)
                    }
                    else
                    {
                        x -= 1
                        line = kstr.splice(line,x,1)
                    }
                }
            }
            break
    }

    lines.splice(y,remove,line)
    this.setLines(lines)
    this.setMainCursor(x,y)
    return this
},deleteSelection:function ()
{
    var cursors, lines, selections

    if (_k_.empty(this.s.selections))
    {
        return
    }
    if (!this.beginIndex)
    {
        this.pushState()
    }
    cursors = this.allCursors()
    lines = this.allLines()
    selections = this.allSelections()
    var _e_ = util.deleteLineRangesAndAdjustPositions(lines,selections,cursors); lines = _e_[0]; cursors = _e_[1]

    this.deselect()
    this.clearHighlights()
    this.setLines(lines)
    this.setCursors(cursors)
    return this
}}