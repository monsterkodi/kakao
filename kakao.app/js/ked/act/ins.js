var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

import kstr from "../../kxk/kstr.js"

export default {insert:function (text)
{
    var i, line, lines, s, split, x, y

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
        text = _k_.lpad(4 - this.s.cursor[0] % 4,' ')
    }
    var _b_ = this.s.cursor; x = _b_[0]; y = _b_[1]

    lines = this.s.lines.asMutable()
    line = lines[y]
    if (x > line.length)
    {
        line += _k_.lpad(x - line.length)
    }
    line = kstr.splice(line,x,0,text)
    lines.splice(y,1,line)
    this.setLines(lines)
    x += text.length
    this.syntax.updateLines(lines,[y])
    return this.setCursor(x,y)
},insertNewline:function ()
{
    var after, before, line, lines, x, y

    var _c_ = this.s.cursor; x = _c_[0]; y = _c_[1]

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