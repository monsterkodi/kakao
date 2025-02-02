var toExport = {}
var lines, spans

import util from "../util/util.js"

toExport["util"] = function ()
{
    section("isPosInsideRange", function ()
    {
        compare(util.isPosInsideRange([0,0],[0,0,1,0]),true)
        compare(util.isPosInsideRange([0,1],[0,0,1,0]),false)
        compare(util.isPosInsideRange([7,1],[5,2,10,2]),false)
        compare(util.isPosInsideRange([7,2],[5,2,10,2]),true)
        compare(util.isPosInsideRange([5,2],[5,2,10,2]),true)
        compare(util.isPosInsideRange([10,2],[5,2,10,2]),false)
        compare(util.isPosInsideRange([4,2],[5,2,10,2]),false)
        compare(util.isPosInsideRange([11,2],[5,2,10,2]),false)
        compare(util.isPosInsideRange([7,3],[5,2,10,2]),false)
    })
    section("normalizeRanges", function ()
    {
        compare(util.normalizeRanges([]),[])
        compare(util.normalizeRanges([[0,1,3,4]]),[[0,1,3,4]])
        compare(util.normalizeRanges([[0,4,3,1]]),[[3,1,0,4]])
        compare(util.normalizeRanges([[3,1,0,4]]),[[3,1,0,4]])
        compare(util.normalizeRanges([[3,4,2,4]]),[[2,4,3,4]])
        compare(util.normalizeRanges([[0,0,9,9],[1,1,2,2]]),[[0,0,9,9],[1,1,2,2]])
        compare(util.normalizeRanges([[1,1,2,2],[0,0,9,9]]),[[0,0,9,9],[1,1,2,2]])
    })
    section("mergeRanges", function ()
    {
        compare(util.mergeRanges([[0,0,9,9],[1,1,2,2]]),[[0,0,9,9]])
        compare(util.mergeRanges([[1,1,2,2],[0,0,9,9]]),[[0,0,9,9]])
        compare(util.mergeRanges([[1,1,2,2],[0,0,9,9],[0,0,10,0],[0,8,9,9]]),[[0,0,9,9]])
        compare(util.mergeRanges([[4,0,6,0],[8,0,10,0]]),[[4,0,6,0],[8,0,10,0]])
        compare(util.mergeRanges([[4,0,6,0],[7,0,10,0]]),[[4,0,6,0],[7,0,10,0]])
        compare(util.mergeRanges([[4,0,6,0],[6,0,10,0]]),[[4,0,10,0]])
        compare(util.mergeRanges([[4,0,6,0],[5,0,10,0]]),[[4,0,10,0]])
    })
    section("deleteRangesAndAdjustCursors", function ()
    {
        lines = ['1234567890','abcdefghij']
        compare(util.deleteLinesRangesAndAdjustCursors(lines,[[5,0,5,1]],[[5,1]]),[['12345fghij'],[[5,0]]])
    })
    section("rangeOfClosestWordToPos", function ()
    {
        lines = ['1 2  3   4','   ab  ghij']
        compare(util.rangeOfClosestWordToPos(lines,[0,0]),[0,0,1,0])
        compare(util.rangeOfClosestWordToPos(lines,[1,0]),[2,0,3,0])
        compare(util.rangeOfClosestWordToPos(lines,[2,0]),[2,0,3,0])
        compare(util.rangeOfClosestWordToPos(lines,[3,0]),[2,0,3,0])
        compare(util.rangeOfClosestWordToPos(lines,[4,0]),[5,0,6,0])
        compare(util.rangeOfClosestWordToPos(lines,[0,1]),[3,1,5,1])
        compare(util.rangeOfClosestWordToPos(lines,[5,1]),[3,1,5,1])
        compare(util.rangeOfClosestWordToPos(lines,[6,1]),[7,1,11,1])
    })
    section("rangeOfWordOrWhitespaceLeftToPos", function ()
    {
        lines = ['1 2  3   4','   ab  ghij']
        compare(util.rangeOfWordOrWhitespaceLeftToPos(lines,[0,0]),undefined)
        compare(util.rangeOfWordOrWhitespaceLeftToPos(lines,[1,0]),[0,0,1,0])
        compare(util.rangeOfWordOrWhitespaceLeftToPos(lines,[1,1]),[0,1,1,1])
        compare(util.rangeOfWordOrWhitespaceLeftToPos(lines,[3,1]),[0,1,3,1])
    })
    section("isFullLineRange", function ()
    {
        lines = ['','124','abcdef']
        compare(util.isFullLineRange(lines,[0,0,0,1]),true)
        compare(util.isFullLineRange(lines,[0,0,0,0]),true)
        compare(util.isFullLineRange(lines,[0,1,3,1]),true)
        compare(util.isFullLineRange(lines,[0,1,5,1]),true)
        compare(util.isFullLineRange(lines,[0,1,2,1]),false)
        compare(util.isFullLineRange(lines,[1,1,3,1]),false)
    })
    section("isPosAfterSpan", function ()
    {
        compare(util.isPosAfterSpan([0,0],[1,0,5]),false)
        compare(util.isPosAfterSpan([4,0],[1,0,5]),false)
        compare(util.isPosAfterSpan([5,0],[1,0,5]),true)
        compare(util.isPosAfterSpan([6,0],[1,0,5]),true)
        compare(util.isPosAfterSpan([0,1],[1,0,5]),true)
    })
    section("isPosBeforeSpan", function ()
    {
        compare(util.isPosBeforeSpan([0,0],[1,0,3]),true)
        compare(util.isPosBeforeSpan([1,0],[1,0,3]),false)
        compare(util.isPosBeforeSpan([3,1],[1,0,3]),false)
    })
    section("isPosInsideSpan", function ()
    {
        compare(util.isPosInsideSpan([0,0],[1,0,3]),false)
        compare(util.isPosInsideSpan([1,0],[1,0,3]),true)
        compare(util.isPosInsideSpan([2,0],[1,0,3]),true)
        compare(util.isPosInsideSpan([3,0],[1,0,3]),false)
    })
    section("nextSpanAfterPos", function ()
    {
        spans = [[1,0,3],[6,0,8],[2,1,5]]
        compare(util.nextSpanAfterPos(spans,[4,0]),[6,0,8])
        compare(util.nextSpanAfterPos(spans,[0,0]),[1,0,3])
        spans = [[0,21,11],[2,22,11],[5,23,11],[7,24,11]]
        compare(util.nextSpanAfterPos(spans,[11,21]),[2,22,11])
        compare(util.nextSpanAfterPos(spans,[11,22]),[5,23,11])
        compare(util.nextSpanAfterPos(spans,[11,23]),[7,24,11])
        compare(util.nextSpanAfterPos(spans,[11,24]),[0,21,11])
        spans = [[2,1,5],[2,2,5],[2,3,5]]
        compare(util.nextSpanAfterPos(spans,[5,2]),[2,3,5])
        compare(util.nextSpanAfterPos(spans,[5,3]),[2,1,5])
        compare(util.nextSpanAfterPos(spans,[5,1]),[2,2,5])
        spans = [[1,4,3],[3,4,5]]
        compare(util.nextSpanAfterPos(spans,[0,0]),[1,4,3])
        compare(util.nextSpanAfterPos(spans,[3,4]),[3,4,5])
        compare(util.nextSpanAfterPos(spans,[5,4]),[1,4,3])
    })
    section("prevSpanBeforePos", function ()
    {
        spans = [[1,0,3],[6,0,8],[2,1,5]]
        compare(util.prevSpanBeforePos(spans,[0,0]),[2,1,5])
        compare(util.prevSpanBeforePos(spans,[1,0]),[2,1,5])
        compare(util.prevSpanBeforePos(spans,[2,0]),[2,1,5])
        compare(util.prevSpanBeforePos(spans,[3,0]),[1,0,3])
        compare(util.prevSpanBeforePos(spans,[4,0]),[1,0,3])
        compare(util.prevSpanBeforePos(spans,[6,0]),[1,0,3])
        compare(util.prevSpanBeforePos(spans,[7,0]),[1,0,3])
        compare(util.prevSpanBeforePos(spans,[9,0]),[6,0,8])
        compare(util.prevSpanBeforePos(spans,[0,1]),[6,0,8])
    })
    section("normalizePositions", function ()
    {
        compare(util.normalizePositions([[0,0],[1,0],[2,0]]),[[0,0],[1,0],[2,0]])
        compare(util.normalizePositions([[1,0],[2,0],[0,0]]),[[0,0],[1,0],[2,0]])
        compare(util.normalizePositions([[1,0],[2,0],[1,0]]),[[1,0],[2,0]])
        compare(util.normalizePositions([[2,2],[3,3],[1,1]]),[[1,1],[2,2],[3,3]])
        compare(util.normalizePositions([[2,2],[0,3],[11,1]]),[[11,1],[2,2],[0,3]])
    })
    section("lineRangesInRange", function ()
    {
        lines = ['1','','12','abc']
        compare(util.lineRangesInRange(lines,[0,0,0,2]),[[0,0,1,0],[0,1,0,1],[0,2,2,2]])
    })
    section("splitLineRanges", function ()
    {
        lines = ['1','','12','abc']
        compare(util.splitLineRanges(lines,[[0,0,1,2]]),[[0,0,1,0],[0,1,0,1],[0,2,1,2]])
    })
}
toExport["util"]._section_ = true
toExport._test_ = true
export default toExport
