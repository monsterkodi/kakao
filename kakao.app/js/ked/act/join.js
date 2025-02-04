import util from "../util/util.js"

export default {joinLines:function ()
{
    var idxs, rngs

    this.moveCursorsToEndOfLines()
    idxs = util.lineIndicesForPositions(this.allCursors())
    rngs = util.rangesForJoiningLines(this.allLines(),idxs)
    return this.deleteRanges(rngs,this.allCursors())
},moveSelectedOrCursorLines:function (dir)
{}}