var _k_ = {ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import util from "../util.js"

export default {joinLines:function ()
{
    var lines, x, y

    var _a_ = this.s.cursor; x = _a_[0]; y = _a_[1]

    lines = this.s.lines.asMutable()
    if (util.isInvalidLineIndex(lines,y))
    {
        return
    }
    x = lines[y].length
    this.setCursor(x,y)
    lines.splice(y,2,lines[y] + _k_.ltrim(lines[y + 1]))
    return this.setLines(lines)
}}