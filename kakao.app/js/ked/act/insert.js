var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

import kstr from "../../kxk/kstr.js"

export default {insert:function (text)
{
    var ci, cursor, cursors, i, line, lines, s, split, x, y

    split = text.split(/\r?\n/)
    if (split.length > 1)
    {
        this.begin()
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
    if (text === '\t')
    {
        if (!_k_.empty(this.s.selections))
        {
            return this.indentSelectedLines()
        }
    }
    cursors = this.allCursors()
    lines = this.s.lines.asMutable()
    for (var _b_ = ci = cursors.length - 1, _c_ = 0; (_b_ <= _c_ ? ci <= 0 : ci >= 0); (_b_ <= _c_ ? ++ci : --ci))
    {
        cursor = cursors[ci]
        if (text === '\t')
        {
            text = _k_.lpad(4 - this.s.cursor[0] % 4,' ')
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
    this.set('cursors',cursors)
    return this.setCursor(cursors.slice(-1)[0])
},insertNewline:function ()
{
    var after, before, line, lines, x, y

    var _e_ = this.s.cursor; x = _e_[0]; y = _e_[1]

    lines = this.s.lines.asMutable()
    line = lines[y]
    before = line.slice(0, typeof x === 'number' ? x : -1)
    after = line.slice(x)
    lines.splice(y,1,before)
    lines.splice(y + 1,0,after)
    this.setLines(lines)
    y = y + 1
    x = 0
    return this.setCursor(x,y)
}}