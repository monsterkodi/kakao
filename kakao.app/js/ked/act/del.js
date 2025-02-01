var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import kstr from "../../kxk/kstr.js"

import util from "../util/util.js"

export default {delete:function (type, mods)
{
    var before, dc, line, lines, remove, rng, x, y

    if (type === 'back' && !_k_.empty(this.s.selections))
    {
        this.deleteSelection()
        return this
    }
    var _a_ = this.mainCursor(); x = _a_[0]; y = _a_[1]

    if (type === 'back' && util.isLinesPosOutside(this.s.lines,[x,y]))
    {
        this.setMainCursor(this.s.lines[y].length,y)
        return this
    }
    lines = this.s.lines.asMutable()
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
    var cursor, lines, selections

    if (_k_.empty(this.s.selections))
    {
        return
    }
    cursor = this.mainCursor()
    lines = this.allLines()
    selections = this.allSelections()
    var _b_ = util.deleteLinesRangesAndAdjustCursor(lines,selections,cursor); lines = _b_[0]; cursor = _b_[1]

    this.deselect()
    this.setLines(lines)
    this.setMainCursor(cursor)
    this.clearHighlights()
    return this
}}