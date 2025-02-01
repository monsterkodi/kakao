var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

import util from "../util/util.js"

export default {indentSelectedLines:function ()
{
    var indices, li, lines, x, y

    if (_k_.empty(this.s.selections))
    {
        return
    }
    var _a_ = this.mainCursor(); x = _a_[0]; y = _a_[1]

    lines = this.allLines()
    indices = util.lineIndicesForRanges(this.s.selections)
    var list = _k_.list(indices)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        li = list[_b_]
        lines[li] = _k_.lpad(4,' ') + lines[li]
    }
    return this.setLines(lines)
},deindent:function ()
{
    var ind, li, lines

    if (!_k_.empty(this.s.selections))
    {
        return this.deindentSelectedLines()
    }
    lines = this.allLines()
    li = this.mainCursor()[1]
    if (ind = util.numIndent(lines[li]))
    {
        lines[li] = lines[li].slice(_k_.min(ind,4))
        this.setLines(lines)
        return this.setMainCursor(0,li)
    }
},deindentSelectedLines:function ()
{
    var ind, indices, li, lines

    if (_k_.empty(this.s.selections))
    {
        return
    }
    lines = this.allLines()
    indices = util.lineIndicesForRanges(this.s.selections)
    var list = _k_.list(indices)
    for (var _c_ = 0; _c_ < list.length; _c_++)
    {
        li = list[_c_]
        if (ind = util.numIndent(lines[li]))
        {
            lines[li] = lines[li].slice(_k_.min(ind,4))
        }
    }
    return this.setLines(lines)
}}