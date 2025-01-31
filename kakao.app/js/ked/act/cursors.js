var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import util from "../util/util.js"

export default {allCursors:function ()
{
    var cursors

    cursors = this.s.cursors.asMutable()
    cursors.push(this.s.cursor.asMutable())
    return util.normalizePositions(cursors,this.s.lines.length - 1)
},expandCursors:function (dir)
{
    var c, cursors, dy, newCursors

    cursors = this.allCursors()
    dy = (dir === 'up' ? -1 : 1)
    newCursors = []
    var list = _k_.list(cursors)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        c = list[_a_]
        newCursors.push([c[0],c[1] + dy])
    }
    cursors = cursors.concat(newCursors)
    return this.set('cursors',cursors)
},addCursor:function (x, y)
{
    var cursors, pos

    pos = util.pos(x,y)
    cursors = this.allCursors()
    this.setCursor(pos)
    cursors.push(pos)
    return this.set('cursors',cursors)
},moveCursor:function (dir, steps = 1)
{
    var c, cursors

    if (this.s.highlights.length)
    {
        this.deselect()
    }
    cursors = this.allCursors()
    var list = _k_.list(cursors)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        c = list[_b_]
        switch (dir)
        {
            case 'left':
                c[0] -= 1
                break
            case 'right':
                c[0] += 1
                break
            case 'up':
                c[1] -= steps
                break
            case 'down':
                c[1] += steps
                break
            case 'eol':
                c[0] = this.s.lines[c[1]].length
                break
            case 'bol':
                c[0] = 0
                break
            case 'bof':
                c[0] = 0
                c[1] = 0
                break
            case 'eof':
                c[1] = this.s.lines.length - 1
                c[0] = this.s.lines[c[1]].length
                break
        }

    }
    this.setCursor(cursors.slice(-1)[0])
    return this.set('cursors',cursors)
}}