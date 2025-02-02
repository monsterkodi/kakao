var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import kstr from "../../kxk/kstr.js"

import util from "../util/util.js"

export default {delete:function (type, mods)
{
    var before, cursor, cursors, dc, line, lines, remove, rng, x, y

    if (type === 'back' && !_k_.empty(this.s.selections))
    {
        this.deleteSelection()
        return this
    }
    cursors = this.allCursors()
    var list = _k_.list(cursors)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        cursor = list[_a_]
        var _b_ = cursor(); x = _b_[0]; y = _b_[1]

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

    }
    lines.splice(y,remove,line)
    this.setLines(lines)
    this.setCursors(cursors)
    return this
},deleteOld:function (type, mods)
{
    var before, dc, line, lines, remove, rng, x, y

    if (type === 'back' && !_k_.empty(this.s.selections))
    {
        this.deleteSelection()
        return this
    }
    var _c_ = this.mainCursor(); x = _c_[0]; y = _c_[1]

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
    cursors = this.allCursors()
    lines = this.allLines()
    selections = this.allSelections()
    var _d_ = util.deleteLinesRangesAndAdjustCursors(lines,selections,cursors); lines = _d_[0]; cursors = _d_[1]

    this.deselect()
    this.setLines(lines)
    this.setCursors(cursors)
    this.clearHighlights()
    return this
}}