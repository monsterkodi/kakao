var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kxk from "../../../kxk.js"
let kstr = kxk.kstr

import util from "../../util/util.js"
import prof from "../../util/prof.js"

export default {insert:function (text)
{
    var cursors, lines

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
    var _a_ = util.insertTextAtPositions(lines,text,cursors); lines = _a_[0]; cursors = _a_[1]

    this.clearHighlights()
    this.setLines(lines)
    return this.setCursors(cursors)
},insertAsciiHeaderForSelectionOrWordAtCursor:function ()
{
    var cursors, lines, selections

    selections = this.allSelections()
    cursors = this.allCursors()
    lines = this.allLines()
    var _b_ = util.insertAsciiHeaderForPositionsAndRanges(lines,cursors,selections); lines = _b_[0]; cursors = _b_[1]; selections = _b_[2]

    this.clearHighlights()
    this.setLines(lines)
    this.setSelections(selections)
    return this.setCursors(cursors)
}}