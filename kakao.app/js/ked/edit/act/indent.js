var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import belt from "../tool/belt.js"

export default {indentSelectedLines:function ()
{
    var cursors, indices, lines, selections

    if (_k_.empty(this.s.selections))
    {
        return
    }
    selections = this.allSelections()
    cursors = this.allCursors()
    indices = belt.lineIndicesForRangesOrPositions(selections,cursors)
    var _a_ = belt.indentLineRangesAndPositionsAtIndices(this.allLines(),selections,cursors,indices); lines = _a_[0]; selections = _a_[1]; cursors = _a_[2]

    this.setLines(lines)
    this.setSelections(selections)
    return this.setCursors(cursors)
},deindentSelectedOrCursorLines:function ()
{
    var cursors, indices, lines, selections

    selections = this.allSelections()
    cursors = this.allCursors()
    indices = belt.lineIndicesForRangesOrPositions(selections,cursors)
    var _b_ = belt.deindentLineRangesAndPositionsAtIndices(this.allLines(),selections,cursors,indices); lines = _b_[0]; selections = _b_[1]; cursors = _b_[2]

    this.setLines(lines)
    this.setSelections(selections)
    return this.setCursors(cursors)
}}