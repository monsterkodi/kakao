var toExport = {}
var lines

import util from "../util.js"

toExport["util"] = function ()
{
    section("isPosInsideRange", function ()
    {
        compare(util.isPosInsideRange([0,0],[0,0,1,0]),true)
        compare(util.isPosInsideRange([0,1],[0,0,1,0]),false)
        compare(util.isPosInsideRange([7,1],[5,2,10,2]),false)
        compare(util.isPosInsideRange([7,2],[5,2,10,2]),true)
        compare(util.isPosInsideRange([5,2],[5,2,10,2]),true)
        compare(util.isPosInsideRange([10,2],[5,2,10,2]),true)
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
    section("deleteRangesAndAdjustCursor", function ()
    {
        lines = ['1234567890','abcdefghij']
        compare(util.deleteLinesRangesAndAdjustCursor(lines,[[5,0,5,0]],[5,1]),[lines,[5,1]])
        compare(util.deleteLinesRangesAndAdjustCursor(lines,[[5,0,6,0]],[5,1]),[['123457890','abcdefghij'],[5,1]])
        compare(util.deleteLinesRangesAndAdjustCursor(lines,[[5,0,5,1]],[5,1]),[['12345fghij'],[5,0]])
    })
}
toExport["util"]._section_ = true
toExport._test_ = true
export default toExport
