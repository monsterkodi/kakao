import util from "../util/util.js"

export default {joinLines:function ()
{
    var idxs, rngs

    this.moveCursorsToEndOfLines()
    idxs = util.lineIndicesForPositions(this.allCursors())
    rngs = util.rangesForJoiningLines(this.allLines(),idxs)
    return this.deleteRanges(rngs,this.allCursors())
},moveSelectionOrCursorLines:function (dir)
{
    var cursors, indices, lines, selections

    selections = this.allSelections()
    cursors = this.allCursors()
    indices = util.lineIndicesForRangesOrPositions(selections,cursors)
    var _a_ = util.moveLineRangesAndPositionsAtIndicesInDirection(this.allLines(),selections,cursors,indices,dir); lines = _a_[0]; selections = _a_[1]; cursors = _a_[2]

    this.setLines(lines)
    this.setSelections(selections)
    return this.setCursors(cursors)
},cloneSelectionAndCursorLines:function (dir)
{
    var blocks, cursors, lines, selections

    selections = this.allSelections()
    cursors = this.allCursors()
    lines = this.allLines()
    blocks = util.blockRangesForRangesAndPositions(lines,selections,cursors)
    console.log(blocks)
    var _b_ = util.cloneLineBlockRangesAndMoveRangesAndPositionsInDirection(lines,blocks,selections,cursors,dir); lines = _b_[0]; selections = _b_[1]; cursors = _b_[2]

    this.setLines(lines)
    this.setSelections(selections)
    return this.setCursors(cursors)
},toggleCommentAtSelectionOrCursorLines:function ()
{
    var cursors, indices, lines, selections

    selections = this.allSelections()
    cursors = this.allCursors()
    indices = util.lineIndicesForRangesOrPositions(selections,cursors)
    var _c_ = util.toggleCommentsInLineRangesAtIndices(this.allLines(),selections,cursors,indices); lines = _c_[0]; selections = _c_[1]; cursors = _c_[2]

    this.setLines(lines)
    this.setSelections(selections)
    return this.setCursors(cursors)
}}