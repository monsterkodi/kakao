var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kstr from "../../kxk/kstr.js"

import util from "../util/util.js"

export default {select:function (from, to)
{
    var selections

    selections = []
    this.setMainCursor(to[0],to[1])
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
},selectWordAtCursor_highlightSelection_selectAllHighlights:function ()
{
    var pos

    if (!_k_.empty(this.s.highlights))
    {
        pos = this.mainCursor()
        if (this.s.selections.length < this.s.highlights.length)
        {
            this.selectAllHighlights()
        }
        else
        {
            this.moveCursorToNextHighlight(pos)
        }
        return
    }
    this.selectWordAtCursor_highlightSelection()
    return this.selectAllHighlights()
},highlightWordAtCursor_deselectCursorHighlight_moveCursorToNextHighlight:function ()
{
    if (!_k_.empty(this.s.highlights))
    {
        this.deselectCursorHighlight()
        this.moveCursorToNextHighlight()
        return
    }
    this.selectWordAtCursor_highlightSelection()
    return this.deselectCursorHighlight()
},selectWordAtCursor_highlightSelection_selectNextHighlight:function ()
{
    if (!_k_.empty(this.s.highlights))
    {
        this.clearCursors()
        this.selectNextHighlight()
    }
    return this.selectWordAtCursor_highlightSelection()
},selectWordAtCursor_highlightSelection_addNextHighlightToSelection:function ()
{
    if (!_k_.empty(this.s.highlights))
    {
        return this.addCurrentOrNextHighlightToSelection()
    }
    return this.selectWordAtCursor_highlightSelection()
},deselectCursorHighlight:function ()
{
    var prev

    if (_k_.empty(this.s.highlights))
    {
        return
    }
    if (_k_.empty(this.s.selections))
    {
        return
    }
    if (prev = util.prevSpanBeforePos(this.s.highlights,this.mainCursor()))
    {
        this.deselectSpan(prev)
        return this.setMainCursor(util.endOfSpan(prev))
    }
},selectAllHighlights:function ()
{
    var selections, span

    if (_k_.empty(this.s.highlights))
    {
        return
    }
    selections = []
    var list = _k_.list(this.s.highlights)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        span = list[_b_]
        selections.push(util.rangeForSpan(span))
        this.addCursor(util.endOfSpan(span))
    }
    return this.set('selections',selections)
},selectNextHighlight:function ()
{
    var next

    if (_k_.empty(this.s.highlights))
    {
        return
    }
    if (next = util.nextSpanAfterPos(this.s.highlights,this.mainCursor()))
    {
        this.selectSpan(next)
        return this.setMainCursor(util.endOfSpan(next))
    }
},addCurrentOrNextHighlightToSelection:function ()
{
    var prev

    if (prev = util.prevSpanBeforePos(this.s.highlights,this.mainCursor()))
    {
        if (!util.rangesContainSpan(this.s.selections,prev))
        {
            this.addSpanToSelection(prev)
            this.addCursor(util.endOfSpan(prev))
            return
        }
    }
    return this.addNextHighlightToSelection()
},addNextHighlightToSelection:function ()
{
    var next

    if (_k_.empty(this.s.highlights))
    {
        return
    }
    if (next = util.nextSpanAfterPos(this.s.highlights,this.mainCursor()))
    {
        this.addSpanToSelection(next)
        return this.addCursor(util.endOfSpan(next))
    }
},moveCursorToNextHighlight:function (pos)
{
    var next

    if (_k_.empty(this.s.highlights))
    {
        return
    }
    pos = (pos != null ? pos : this.mainCursor())
    if (next = util.nextSpanAfterPos(this.s.highlights,pos))
    {
        return this.setMainCursor(util.endOfSpan(next))
    }
},selectSpan:function (span)
{
    return this.set('selections',[util.rangeForSpan(span)])
},deselectSpan:function (span)
{
    var index, rng, selection, selections

    rng = util.rangeForSpan(span)
    selections = this.s.selections.asMutable()
    var list = _k_.list(selections)
    for (index = 0; index < list.length; index++)
    {
        selection = list[index]
        if (util.isSameRange(selection,rng))
        {
            selections.splice(index,1)
            break
        }
    }
    return this.set('selections',selections)
},addSpanToSelection:function (span)
{
    var selections

    selections = this.s.selections.asMutable()
    selections.push(util.rangeForSpan(span))
    return this.set('selections',selections)
},selectWordAtCursor_highlightSelection:function ()
{
    if (_k_.empty(this.s.selections))
    {
        this.selectWord(this.mainCursor())
    }
    return this.highlightSelection()
},highlightSelection:function ()
{
    var lines, selection, spans, text

    if (_k_.empty(this.s.selections))
    {
        return
    }
    spans = []
    lines = this.s.lines.asMutable()
    var list = _k_.list(this.s.selections.asMutable())
    for (var _d_ = 0; _d_ < list.length; _d_++)
    {
        selection = list[_d_]
        if (selection[1] !== selection[3])
        {
            continue
        }
        text = util.textForLinesRange(lines,selection)
        spans = spans.concat(util.lineSpansForText(lines,text))
    }
    return this.set('highlights',spans)
},highlightText:function (text)
{
    var lines, spans

    lines = this.s.lines.asMutable()
    spans = util.lineSpansForText(lines,text)
    return this.set('highlights',spans)
},selectChunk:function (x, y)
{
    var range

    if (range = util.rangeOfClosestChunkToPos(this.s.lines,util.pos(x,y)))
    {
        this.select(range.slice(0, 2),range.slice(2, 4))
    }
    return this
},selectWord:function (x, y)
{
    var range

    if (range = util.rangeOfClosestWordToPos(this.s.lines,util.pos(x,y)))
    {
        this.select(range.slice(0, 2),range.slice(2, 4))
    }
    return this
},selectLine:function (y)
{
    y = (y != null ? y : this.mainCursor()[1])
    if ((0 <= y && y < this.s.lines.length))
    {
        this.select([0,y],[this.s.lines[y].length,y])
    }
    return this
},selectAllLines:function ()
{
    this.moveCursor('bof')
    return this.moveCursorAndSelect('eof')
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
},isHighlightedLine:function (y)
{
    var highlight

    var list = _k_.list(this.s.highlights)
    for (var _f_ = 0; _f_ < list.length; _f_++)
    {
        highlight = list[_f_]
        if (highlight[1] === y)
        {
            return true
        }
    }
    return false
},isFullySelectedLine:function (y)
{
    var selection

    var list = _k_.list(this.s.selections)
    for (var _10_ = 0; _10_ < list.length; _10_++)
    {
        selection = list[_10_]
        if (selection[3] === y && selection[2] === 0)
        {
            continue
        }
        if ((selection[1] <= y && y <= selection[3]))
        {
            return util.isFullLineRange(this.s.lines.asMutable(),selection)
        }
    }
    return false
},deselect:function ()
{
    if (!_k_.empty(this.s.selections))
    {
        return this.set('selections',[])
    }
},clearHighlights:function ()
{
    if (!_k_.empty(this.s.highlights))
    {
        return this.set('highlights',[])
    }
},clearCursors:function ()
{
    if (this.s.cursors.length > 1)
    {
        return this.set('cursors',[this.mainCursor()])
    }
},clearCursorsHighlightsAndSelections:function ()
{
    this.clearCursors()
    this.clearHighlights()
    return this.deselect()
}}