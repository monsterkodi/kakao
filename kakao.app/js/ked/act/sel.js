var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kstr from "../../kxk/kstr.js"

import util from "../util/util.js"

export default {select:function (from, to)
{
    var selections

    selections = []
    this.setCursor(to[0],to[1])
    if (from[1] > to[1])
    {
        var _a_ = [to,from]; from = _a_[0]; to = _a_[1]

    }
    else if (from[1] === to[1] && from[0] > to[0])
    {
        var _b_ = [to,from]; from = _b_[0]; to = _b_[1]

    }
    to[1] = _k_.clamp(0,this.s.lines.length - 1,to[1])
    from[1] = _k_.clamp(0,this.s.lines.length - 1,from[1])
    to[0] = _k_.clamp(0,this.s.lines[to[1]].length,to[0])
    from[0] = _k_.clamp(0,this.s.lines[from[1]].length,from[0])
    selections.push([from[0],from[1],to[0],to[1]])
    this.set('selections',selections)
    return true
},selectChunk:function (x, y)
{
    var line, re, rs

    if (this.isInvalidLineIndex(y))
    {
        return
    }
    line = this.s.lines[y]
    var _c_ = kstr.rangeOfClosestChunk(line,x); rs = _c_[0]; re = _c_[1]

    if (rs >= 0 && re >= 0)
    {
        return this.select([rs,y],[re + 1,y])
    }
},selectWord:function (x, y)
{
    var range

    if (range = util.rangeOfClosestWordToPos(this.s.lines,[x,y]))
    {
        return this.select(range.slice(0, 2),range.slice(2, 4))
    }
},selectLine:function (y)
{
    y = (y != null ? y : this.s.cursor[1])
    if ((0 <= y && y < this.s.lines.length))
    {
        return this.select([0,y],[this.s.lines[y].length,y])
    }
},isSelectedLine:function (y)
{
    var selection

    var list = _k_.list(this.s.selections)
    for (var _d_ = 0; _d_ < list.length; _d_++)
    {
        selection = list[_d_]
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
        return this.set('selections',[])
    }
}}