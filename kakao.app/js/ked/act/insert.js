var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kstr from "../../kxk/kstr.js"

import util from "../util/util.js"
import prof from "../util/prof.js"

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
},insertNewline:function ()
{
    var cursors, lines

    cursors = this.allCursors()
    lines = this.allLines()
    var _b_ = util.breakLinesAtPositions(lines,cursors); lines = _b_[0]; cursors = _b_[1]

    this.clearHighlights()
    this.setCursors(cursors)
    return this.setLines(lines)
}}