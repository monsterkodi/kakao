var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

import kstr from "../../kxk/kstr.js"

import util from "../util/util.js"

export default {insert:function (text)
{
    var ci, cursor, cursors, i, line, lines, s, split, x, y

    split = text.split(/\r?\n/)
    if (split.length > 1)
    {
        this.begin()
        this.deleteSelection()
        var list = _k_.list(split)
        for (i = 0; i < list.length; i++)
        {
            s = list[i]
            this.insert(s)
            if (i < split.length - 1 || text !== '\n')
            {
                this.insertNewline()
            }
        }
        this.end()
        return
    }
    if (!_k_.empty(this.s.selections))
    {
        if (text === '\t')
        {
            return this.indentSelectedLines()
        }
        if (this.s.cursors.length === 1)
        {
            this.deleteSelection()
        }
    }
    cursors = this.allCursors()
    lines = this.allLines()
    for (var _b_ = ci = cursors.length - 1, _c_ = 0; (_b_ <= _c_ ? ci <= 0 : ci >= 0); (_b_ <= _c_ ? ++ci : --ci))
    {
        cursor = cursors[ci]
        if (text === '\t')
        {
            text = _k_.lpad(4 - cursor[0] % 4,' ')
        }
        var _d_ = cursor; x = _d_[0]; y = _d_[1]

        if (y >= lines.length)
        {
            return lf('[ERROR] cursor outside lines?')
        }
        line = lines[y]
        if (x > line.length)
        {
            line += _k_.lpad(x - line.length)
        }
        line = kstr.splice(line,x,0,text)
        lines.splice(y,1,line)
        cursor[0] += text.length
    }
    this.setLines(lines)
    return this.setCursors(cursors,cursors.length - 1)
},insertNewline:function ()
{
    var cursors, lines

    cursors = this.allCursors()
    lines = this.allLines()
    var _e_ = util.breakLinesAtPositions(lines,cursors); lines = _e_[0]; cursors = _e_[1]

    this.setCursors(cursors)
    return this.setLines(lines)
}}