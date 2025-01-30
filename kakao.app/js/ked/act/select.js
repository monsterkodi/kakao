var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isArr: function (o) {return Array.isArray(o)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kstr from "../../kxk/kstr.js"

import util from "../util/util.js"

export default {select:function (from, to)
{
    var selections

    selections = []
    this.setCursor(to[0],to[1])
    if (from[1] > to[1] || from[1] === to[1] && from[0] > to[0])
    {
        var _a_ = [to,from]; from = _a_[0]; to = _a_[1]

    }
    to[1] = _k_.clamp(0,this.s.lines.length - 1,to[1])
    from[1] = _k_.clamp(0,this.s.lines.length - 1,from[1])
    to[0] = _k_.clamp(0,this.s.lines[to[1]].length,to[0])
    from[0] = _k_.clamp(0,this.s.lines[from[1]].length,from[0])
    selections.push([from[0],from[1],to[0],to[1]])
    return this.set('selections',selections)
},highlightSelectionOrWordAtCursor:function ()
{
    if (!_k_.empty(this.s.highlights))
    {
    }
    if (_k_.empty(this.s.selections))
    {
        this.selectWord(this.s.cursor)
    }
    if (!this.isSingleLineSelected())
    {
        return this
    }
    return this.highlightText(this.textForSelection())
},highlightText:function (text)
{
    var lines, spans

    lines = this.s.lines.asMutable()
    spans = util.lineSpansForText(lines,text)
    return this.set('highlights',spans)
},selectNextHighlight:function ()
{},selectChunk:function (x, y)
{
    var line, re, rs

    if (_k_.isArr(x) && _k_.empty(y))
    {
        var _b_ = x; x = _b_[0]; y = _b_[1]

    }
    if (this.isInvalidLineIndex(y))
    {
        return
    }
    line = this.s.lines[y]
    var _c_ = kstr.rangeOfClosestChunk(line,x); rs = _c_[0]; re = _c_[1]

    if (rs >= 0 && re >= 0)
    {
        this.select([rs,y],[re + 1,y])
    }
    return this
},selectWord:function (x, y)
{
    var range

    if (_k_.isArr(x) && _k_.empty(y))
    {
        var _d_ = x; x = _d_[0]; y = _d_[1]

    }
    if (range = util.rangeOfClosestWordToPos(this.s.lines,[x,y]))
    {
        this.select(range.slice(0, 2),range.slice(2, 4))
    }
    return this
},selectLine:function (y)
{
    y = (y != null ? y : this.s.cursor[1])
    if ((0 <= y && y < this.s.lines.length))
    {
        this.select([0,y],[this.s.lines[y].length,y])
    }
    return this
},textForSelection:function ()
{
    return util.textForLinesRanges(this.s.lines.asMutable(),this.s.selections.asMutable())
},isSingleLineSelected:function ()
{
    return this.s.selections.length === 1 && this.s.selections[0][1] === this.s.selections[0][3]
},isSelectedLine:function (y)
{
    var selection

    var list = _k_.list(this.s.selections)
    for (var _e_ = 0; _e_ < list.length; _e_++)
    {
        selection = list[_e_]
        if (selection[3] === y && selection[2] === 0)
        {
            continue
        }
        if ((selection[1] <= y && y <= selection[3]))
        {
            return true
        }
    }
    return false
},deselect:function ()
{
    if (!_k_.empty(this.s.selections))
    {
        this.set('selections',[])
    }
    if (!_k_.empty(this.s.highlights))
    {
        return this.set('highlights',[])
    }
}}