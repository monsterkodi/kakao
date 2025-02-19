var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var c, cells, l, line, lines, rect, spans

import util from "../util/util.js"

import kxk from "../../kxk.js"
let kseg = kxk.kseg


global.lf = function (...args)
{
    console.log(args.map(function (a)
    {
        return `${a}`
    }).join(' '))
}
toExport["util"] = function ()
{
    section("cells", function ()
    {
        l = util.linesForText(`012
abc
XYZ`)
        cells = util.cellsForLines(l)
        rect = util.cellsInRect(cells,0,0,1,1)
        var list = _k_.list(rect)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            c.cell.fg = [255,0,0]
        }
        compare(cells[0][0].fg,[255,0,0])
        compare(cells[1][1].fg,[255,0,0])
        compare(cells[2][2].fg,[])
        compare(util.clampCellRect(cells,0,0,1,1),[0,0,1,1])
        compare(util.clampCellRect(cells,-1,-1,1,1),[0,0,1,1])
        compare(util.cellsInRect(cells,0,0,1,1).map(function (n)
        {
            return n.cell.char
        }),['0','1','a','b'])
        compare(util.cellsInRect(cells,1,1,1,1).map(function (n)
        {
            return n.cell.char
        }),['b'])
        compare(util.cellsInRect(cells,0,0,2,0).map(function (n)
        {
            return n.cell.char
        }),['0','1','2'])
        compare(util.cellsInRect(cells,-2,-1,-1,-1).map(function (n)
        {
            return n.cell.char
        }),['Y','Z'])
        compare(util.cellNeighborsAtPos(cells,0,0).map(function (n)
        {
            return n.cell.char
        }),['0','1','a','b'])
    })
    section("extendLineRangesToPosition", function ()
    {
        lines = ['123','45','6']
        compare(util.extendLineRangesFromPositionToPosition(lines,[],[0,0],[0,2]),[[0,0,0,2]])
        compare(util.extendLineRangesFromPositionToPosition(lines,[[0,0,1,0],[2,0,3,0]],[1,1],[0,2]),[[0,0,1,0],[2,0,3,0],[1,1,0,2]])
    })
    section("jumpDelta", function ()
    {
        line = '1  '
        compare(util.jumpDelta(line,0,1,['empty']),1)
        compare(util.jumpDelta(line,1,1,['empty']),1)
        compare(util.jumpDelta(line,2,1,['empty']),1)
        compare(util.jumpDelta(line,3,1,['empty']),1)
        compare(util.jumpDelta(line,4,1,['empty']),1)
        line = '    a = b ->  '
        compare(util.jumpDelta(line,0,1,['ws']),4)
        compare(util.jumpDelta(line,1,1,['ws']),3)
        compare(util.jumpDelta(line,2,1,['ws']),2)
        compare(util.jumpDelta(line,3,1,['ws']),1)
        compare(util.jumpDelta(line,4,1,['ws']),1)
        compare(util.jumpDelta(line,5,1,['ws']),1)
        compare(util.jumpDelta(line,6,1,['ws']),1)
        compare(util.jumpDelta(line,7,1,['ws']),1)
        compare(util.jumpDelta(line,8,1,['ws']),1)
        compare(util.jumpDelta(line,9,1,['ws']),1)
        compare(util.jumpDelta(line,10,1,['ws']),1)
        compare(util.jumpDelta(line,11,1,['ws']),1)
        compare(util.jumpDelta(line,12,1,['ws']),2)
        line = '  ab += cd ;;  '
        compare(util.jumpDelta(line,0,1,['word']),1)
        compare(util.jumpDelta(line,1,1,['word']),1)
        compare(util.jumpDelta(line,2,1,['word']),2)
        compare(util.jumpDelta(line,3,1,['word']),1)
        compare(util.jumpDelta(line,4,1,['word']),1)
        compare(util.jumpDelta(line,5,1,['word']),1)
        compare(util.jumpDelta(line,6,1,['word']),1)
        compare(util.jumpDelta(line,7,1,['word']),1)
        compare(util.jumpDelta(line,8,1,['word']),2)
        compare(util.jumpDelta(line,9,1,['word']),1)
        compare(util.jumpDelta(line,10,1,['word']),1)
        compare(util.jumpDelta(line,11,1,['word']),1)
        compare(util.jumpDelta(line,0,1,['punct']),1)
        compare(util.jumpDelta(line,1,1,['punct']),1)
        compare(util.jumpDelta(line,2,1,['punct']),1)
        compare(util.jumpDelta(line,3,1,['punct']),1)
        compare(util.jumpDelta(line,4,1,['punct']),1)
        compare(util.jumpDelta(line,5,1,['punct']),2)
        compare(util.jumpDelta(line,6,1,['punct']),1)
        compare(util.jumpDelta(line,7,1,['punct']),1)
        compare(util.jumpDelta(line,8,1,['punct']),1)
        compare(util.jumpDelta(line,9,1,['punct']),1)
        compare(util.jumpDelta(line,10,1,['punct']),1)
        compare(util.jumpDelta(line,11,1,['punct']),2)
        compare(util.jumpDelta(line,0,1,['ws','word','punct']),2)
        compare(util.jumpDelta(line,1,1,['ws','word','punct']),1)
        compare(util.jumpDelta(line,2,1,['ws','word','punct']),2)
        compare(util.jumpDelta(line,3,1,['ws','word','punct']),1)
        compare(util.jumpDelta(line,4,1,['ws','word','punct']),1)
        compare(util.jumpDelta(line,5,1,['ws','word','punct']),2)
        compare(util.jumpDelta(line,6,1,['ws','word','punct']),1)
        compare(util.jumpDelta(line,7,1,['ws','word','punct']),1)
        compare(util.jumpDelta(line,8,1,['ws','word','punct']),2)
        compare(util.jumpDelta(line,9,1,['ws','word','punct']),1)
        compare(util.jumpDelta(line,10,1,['ws','word','punct']),1)
        compare(util.jumpDelta(line,11,1,['ws','word','punct']),2)
        compare(util.jumpDelta(line,0,-1,['ws','word','punct']),0)
        compare(util.jumpDelta(line,1,-1,['ws','word','punct']),-1)
        compare(util.jumpDelta(line,2,-1,['ws','word','punct']),-2)
        compare(util.jumpDelta(line,3,-1,['ws','word','punct']),-1)
        compare(util.jumpDelta(line,4,-1,['ws','word','punct']),-2)
        compare(util.jumpDelta(line,5,-1,['ws','word','punct']),-1)
        compare(util.jumpDelta(line,6,-1,['ws','word','punct']),-1)
        compare(util.jumpDelta(line,7,-1,['ws','word','punct']),-2)
        compare(util.jumpDelta(line,8,-1,['ws','word','punct']),-1)
        compare(util.jumpDelta(line,9,-1,['ws','word','punct']),-1)
        compare(util.jumpDelta(line,10,-1,['ws','word','punct']),-2)
        compare(util.jumpDelta(line,11,-1,['ws','word','punct']),-1)
        line = '  '
        compare(util.jumpDelta(line,5,-1,['empty']),-3)
        compare(util.jumpDelta(line,4,-1,['empty']),-2)
        compare(util.jumpDelta(line,3,-1,['empty']),-1)
        compare(util.jumpDelta(line,5,-1,['ws']),-1)
        compare(util.jumpDelta(line,4,-1,['ws']),-1)
        compare(util.jumpDelta(line,3,-1,['ws']),-1)
        compare(util.jumpDelta(line,2,-1,['ws']),-2)
    })
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
    section("mergeLineRanges", function ()
    {
        lines = ['1234567890','1234567890','1234567890']
        compare(util.mergeLineRanges(lines,[[0,0,9,9],[1,1,2,2]]),[[0,0,9,9]])
        compare(util.mergeLineRanges(lines,[[1,1,2,2],[0,0,9,9]]),[[0,0,9,9]])
        compare(util.mergeLineRanges(lines,[[1,1,2,2],[0,0,9,9],[0,0,10,0],[0,8,9,9]]),[[0,0,9,9]])
        compare(util.mergeLineRanges(lines,[[4,0,6,0],[8,0,10,0]]),[[4,0,6,0],[8,0,10,0]])
        compare(util.mergeLineRanges(lines,[[4,0,6,0],[7,0,10,0]]),[[4,0,6,0],[7,0,10,0]])
        compare(util.mergeLineRanges(lines,[[4,0,6,0],[6,0,10,0]]),[[4,0,10,0]])
        compare(util.mergeLineRanges(lines,[[4,0,6,0],[5,0,10,0]]),[[4,0,10,0]])
        compare(util.mergeLineRanges(lines,[[4,1,10,1],[0,2,4,2]]),[[4,1,4,2]])
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
    section("isSpanLineRange", function ()
    {
        lines = ['','124','abcdef']
        compare(util.isSpanLineRange(lines,[0,1,1,1]),true)
        compare(util.isSpanLineRange(lines,[0,0,0,0]),false)
        compare(util.isSpanLineRange(lines,[0,1,3,1]),false)
        compare(util.isSpanLineRange(lines,[1,1,1,2]),false)
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
        lines = util.linesForText(`1

12
abc`)
        compare(util.splitLineRanges(lines,[[0,0,1,2]]),[[0,0,1,0],[0,1,0,1],[0,2,1,2]])
        compare(util.splitLineRanges(lines,[[0,2,1,2],[2,2,3,2]]),[[0,2,1,2],[2,2,3,2]])
    })
    section("linesForText", function ()
    {
        lines = util.linesForText(`123
456

abc
def`)
        compare(lines,[['1','2','3'],['4','5','6'],[],['a','b','c'],['d','e','f']])
        section("linesForRange", function ()
        {
            compare(util.linesForRange(lines,[0,0,3,4]),[['1','2','3'],['4','5','6'],[],['a','b','c'],['d','e','f']])
            compare(util.linesForRange(lines,[0,0,0,0]),[[]])
            compare(util.linesForRange(lines,[0,0,1,0]),[['1']])
            compare(util.linesForRange(lines,[3,0,0,1]),[[],[]])
            compare(util.linesForRange(lines,[3,0,1,1]),[[],['4']])
        })
    })
    section("rangesForLinePositions", function ()
    {
        lines = util.linesForText(`123
456

abc
def`)
        compare(util.rangesForLinePositions(lines,[]),[])
        compare(util.rangesForLinePositions(lines,[[0,0]]),[[0,0,0,0],[0,0,3,4]])
        compare(util.rangesForLinePositions(lines,[[1,0]]),[[0,0,1,0],[1,0,3,4]])
        compare(util.rangesForLinePositions(lines,[[0,2]]),[[0,0,0,2],[0,2,3,4]])
        compare(util.rangesForLinePositions(lines,[[0,0],[1,0]]),[[0,0,0,0],[0,0,1,0],[1,0,3,4]])
        compare(util.rangesForLinePositions(lines,[[3,0],[3,1]]),[[0,0,3,0],[3,0,3,1],[3,1,3,4]])
    })
    section("deleteLineRangesAndAdjustPositions", function ()
    {
        lines = ['1234567890','abcdefghij']
        compare(util.deleteLineRangesAndAdjustPositions(lines,[[5,0,5,0]],[[5,1]]),[lines,[[5,1]]])
        compare(util.deleteLineRangesAndAdjustPositions(lines,[[5,0,6,0]],[[5,1]]),[['123457890','abcdefghij'],[[5,1]]])
        compare(util.deleteLineRangesAndAdjustPositions(lines,[[5,0,5,1]],[[5,1]]),[['12345fghij'],[[5,0]]])
        compare(util.deleteLineRangesAndAdjustPositions(lines,[[0,1,1,1]],[[0,1]]),[['1234567890','bcdefghij'],[[0,1]]])
        compare(util.deleteLineRangesAndAdjustPositions(lines,[[5,0,3,1]],[[3,1]]),[['12345defghij'],[[5,0]]])
        compare(util.deleteLineRangesAndAdjustPositions(lines,[[3,0,5,1]],[[3,1]]),[['123fghij'],[[3,0]]])
        lines = ['line 1','line 2','line 3']
        compare(util.deleteLineRangesAndAdjustPositions(lines,[[0,0,6,1]],[[6,0],[6,1]]),[['line 3'],[[0,0]]])
    })
    section("insertTextAtPositions", function ()
    {
        section("single spans", function ()
        {
            lines = util.linesForText(`line 1
line 2`)
            compare(util.insertTextAtPositions(lines,'',[[0,0]]),[kseg.segls('line 1\nline 2'),[[0,0]]])
            compare(util.insertTextAtPositions(lines,'a ',[[0,0]]),[kseg.segls('a line 1\nline 2'),[[2,0]]])
        })
        section("newlines", function ()
        {
            lines = util.linesForText(`line 1
line 2`)
            lines = util.linesForText(`◆1
◆2
◆3
◆4`)
        })
    })
    section("moveLineRangesAndPositionsAtIndicesInDirection", function ()
    {
        lines = ['a','b','c']
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[],[1],'down'),[['a','c','b'],[],[]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[],[2],'down'),[['a','b','c'],[],[]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[],[1,2],'down'),[['a','b','c'],[],[]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[],[0,2],'down'),[['a','b','c'],[],[]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[],[1],'up'),[['b','a','c'],[],[]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[],[2],'up'),[['a','c','b'],[],[]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[],[1,2],'up'),[['b','c','a'],[],[]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[],[0,2],'up'),[['a','b','c'],[],[]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[[0,1]],[1],'down'),[['a','c','b'],[],[[0,2]]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[[0,1],[1,1]],[1],'down'),[['a','c','b'],[],[[0,2],[1,2]]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[[0,1],[1,1]],[1],'down'),[['a','c','b'],[],[[0,2],[1,2]]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[[0,1]],[1],'up'),[['b','a','c'],[],[[0,0]]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[[0,1],[1,1]],[1],'up'),[['b','a','c'],[],[[0,0],[1,0]]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[[0,1],[1,1]],[1],'up'),[['b','a','c'],[],[[0,0],[1,0]]])
        lines = ['a','b','c','d','e']
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[[0,1],[0,2],[0,3]],[1,2,3],'up'),[['b','c','d','a','e'],[],[[0,0],[0,1],[0,2]]])
        compare(util.moveLineRangesAndPositionsAtIndicesInDirection(lines,[],[[0,1],[0,2],[0,3]],[1,2,3],'down'),[['a','e','b','c','d'],[],[[0,2],[0,3],[0,4]]])
    })
}
toExport["util"]._section_ = true
toExport._test_ = true
export default toExport
