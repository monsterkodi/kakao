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
    var _a_ = belt.insertTextAtPositions(this.allLines(),text,this.allCursors()); lines = _a_[0]; cursors = _a_[1]

    this.clearHighlights()
    this.setLines(lines)
    this.setCursors(cursors)
    return mode.postInsert(this)
},insertAsciiHeaderForSelectionOrWordAtCursor:function ()
{
    var cursors, lines, selections

    var _b_ = belt.insertAsciiHeaderForPositionsAndRanges(this.allLines(),this.allCursors(),this.allSelections()); lines = _b_[0]; cursors = _b_[1]; selections = _b_[2]

    this.clearHighlights()
    this.setLines(lines)
    this.setSelections(selections)
    return this.setCursors(cursors)
},surroundSelection:function (trigger, pair)
{
    var lines, posl

    console.log(`surroundSelection ${trigger} ${pair}`)
    var _c_ = belt.insertSurroundAtRanges(this.allLines(),this.allSelections(),trigger,pair); lines = _c_[0]; posl = _c_[1]

    this.setLines(lines)
    this.setSelections([])
    return this.setCursors(posl)
}}