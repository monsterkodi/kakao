import belt from "../tool/belt.js"

export default {
    joinLines:function ()
    {
        var idxs, rngs
    
        this.moveCursorsToEndOfLines()
        idxs = belt.lineIndicesForPositions(this.s.cursors)
        rngs = belt.rangesForJoiningLines(this.s.lines,idxs)
        return this.deleteRanges(rngs,this.allCursors())
    },
    moveSelectionOrCursorLines:function (dir)
    {
        var cursors, indices, lines, selections
    
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        var _a_ = belt.moveLineRangesAndPositionsAtIndicesInDirection(this.s.lines,this.s.selections,this.s.cursors,indices,dir); lines = _a_[0]; selections = _a_[1]; cursors = _a_[2]
    
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    cloneSelectionAndCursorLines:function (dir)
    {
        var blocks, cursors, lines, selections
    
        blocks = belt.blockRangesForRangesAndPositions(this.s.lines,this.s.selections,this.s.cursors)
        var _b_ = belt.cloneLineBlockRangesAndMoveRangesAndPositionsInDirection(this.s.lines,blocks,this.s.selections,this.s.cursors,dir); lines = _b_[0]; selections = _b_[1]; cursors = _b_[2]
    
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    toggleCommentAtSelectionOrCursorLines:function ()
    {
        var cursors, indices, lines, selections
    
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        var _c_ = belt.toggleCommentsInLineRangesAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices); lines = _c_[0]; selections = _c_[1]; cursors = _c_[2]
    
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    },
    toggleCommentTypeAtSelectionOrCursorLines:function ()
    {
        var cursors, indices, lines, selections
    
        indices = belt.lineIndicesForRangesOrPositions(this.s.selections,this.s.cursors)
        var _d_ = belt.toggleCommentTypesInLineRangesAtIndices(this.s.lines,this.s.selections,this.s.cursors,indices); lines = _d_[0]; selections = _d_[1]; cursors = _d_[2]
    
        this.setLines(lines)
        this.setSelections(selections)
        return this.setCursors(cursors)
    }
}