var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kxk from "../../../kxk.js"
let kstr = kxk.kstr

import prof from "../../util/prof.js"

import belt from "../tool/belt.js"

import mode from "../mode.js"

export default {insert:function (text)
{
    var cursors, lines

    text = mode.insert(this,text)
    if (!_k_.empty(this.s.selections))
    {
        if (text === '\t')
        {
            return this.indentSelectedLines()
        }
        this.deleteSelection()
    }
    cursors = this.allCursors()
    lines = this.allLines()
    var _a_ = belt.insertTextAtPositions(lines,text,cursors); lines = _a_[0]; cursors = _a_[1]

    this.clearHighlights()
    this.setLines(lines)
    return this.setCursors(cursors)
},insertAsciiHeaderForSelectionOrWordAtCursor:function ()
{
    var cursors, lines, selections

    selections = this.allSelections()
    cursors = this.allCursors()
    lines = this.allLines()
    var _b_ = belt.insertAsciiHeaderForPositionsAndRanges(lines,cursors,selections); lines = _b_[0]; cursors = _b_[1]; selections = _b_[2]

    this.clearHighlights()
    this.setLines(lines)
    this.setSelections(selections)
    return this.setCursors(cursors)
},surroundSelection:function (pair)
{
    var lines, selections

    selections = this.allSelections()
    lines = this.allLines()
    var _c_ = belt.insertSurroundAtRanges(lines,selections,pair); lines = _c_[0]; selections = _c_[1]

    this.clearHighlights()
    this.setLines(lines)
    this.setSelections(selections)
    return this.setCursors('bos')
}}