import belt from "../tool/belt.js"

export default {joinLines:function ()
{
    var idxs, rngs

    this.moveCursorsToEndOfLines()
    idxs = belt.lineIndicesForPositions(this.allCursors())
    rngs = belt.rangesForJoiningLines(this.allLines(),idxs)
    return this.deleteRanges(rngs,this.allCursors())
},moveSelectionOrCursorLines:function (dir)
{
    var cursors, indices, lines, selections

    selections = this.allSelections()
    cursors = this.allCursors()
    indices = belt.lineIndicesForRangesOrPositions(selections,cursors)
    var _a_ = belt.moveLineRangesAndPositionsAtIndicesInDirection(this.allLines(),selections,cursors,indices,dir); lines = _a_[0]; selections = _a_[1]; cursors = _a_[2]

    this.setLines(lines)
    this.setSelections(selections)
    return this.setCursors(cursors)
},cloneSelectionAndCursorLines:function (dir)
{
    var blocks, cursors, lines, selections

    selections = this.allSelections()
    cursors = this.allCursors()
    lines = this.allLines()
    blocks = belt.blockRangesForRangesAndPositions(lines,selections,cursors)
    var _b_ = belt.cloneLineBlockRangesAndMoveRangesAndPositionsInDirection(lines,blocks,selections,cursors,dir); lines = _b_[0]; selections = _b_[1]; cursors = _b_[2]

    this.setLines(lines)
    this.setSelections(selections)
    return this.setCursors(cursors)
},toggleCommentAtSelectionOrCursorLines:function ()
{
    var cursors, indices, lines, selections

    selections = this.allSelections()
    cursors = this.allCursors()
    indices = belt.lineIndicesForRangesOrPositions(selections,cursors)
    var _c_ = belt.toggleCommentsInLineRangesAtIndices(this.allLines(),selections,cursors,indices); lines = _c_[0]; selections = _c_[1]; cursors = _c_[2]

    this.setLines(lines)
    this.setSelections(selections)
    return this.setCursors(cursors)
}}