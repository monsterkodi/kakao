var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var c, cells, l, line, lines, pairs, posl, rect, segls, spans, text

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let immutable = kxk.immutable

import belt from "../edit/tool/belt.js"

toExport["tool belt"] = function ()
{
    section("cells", function ()
    {
        l = belt.linesForText(`012
abc
XYZ`)
        cells = belt.cellsForLines(l)
        rect = belt.cellsInRect(cells,0,0,1,1)
        var list = _k_.list(rect)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            c.cell.fg = [255,0,0]
        }
        compare(cells[0][0].fg,[255,0,0])
        compare(cells[1][1].fg,[255,0,0])
        compare(cells[2][2].fg,[])
        compare(belt.clampCellRect(cells,0,0,1,1),[0,0,1,1])
        compare(belt.clampCellRect(cells,-1,-1,1,1),[0,0,1,1])
        compare(belt.cellsInRect(cells,0,0,1,1).map(function (n)
        {
            return n.cell.char
        }),['0','1','a','b'])
        compare(belt.cellsInRect(cells,1,1,1,1).map(function (n)
        {
            return n.cell.char
        }),['b'])
        compare(belt.cellsInRect(cells,0,0,2,0).map(function (n)
        {
            return n.cell.char
        }),['0','1','2'])
        compare(belt.cellsInRect(cells,1,2,2,2).map(function (n)
        {
            return n.cell.char
        }),['Y','Z'])
        compare(belt.cellNeighborsAtPos(cells,0,0).map(function (n)
        {
            return n.cell.char
        }),['0','1','a','b'])
    })
    section("extendLineRangesToPosition", function ()
    {
        lines = ['123','45','6']
        compare(belt.extendLineRangesFromPositionToPosition(lines,immutable([]),[0,0],[0,2]),[[0,0,0,2]])
        compare(belt.extendLineRangesFromPositionToPosition(lines,immutable([[0,0,1,0],[2,0,3,0]]),[1,1],[0,2]),[[0,0,1,0],[2,0,3,0],[1,1,0,2]])
    })
    section("jumpDelta", function ()
    {
        line = '1  '
        compare(belt.jumpDelta(line,0,1,['empty']),1)
        compare(belt.jumpDelta(line,1,1,['empty']),1)
        compare(belt.jumpDelta(line,2,1,['empty']),1)
        compare(belt.jumpDelta(line,3,1,['empty']),1)
        compare(belt.jumpDelta(line,4,1,['empty']),1)
        line = '    a = b ->  '
        compare(belt.jumpDelta(line,0,1,['ws']),4)
        compare(belt.jumpDelta(line,1,1,['ws']),3)
        compare(belt.jumpDelta(line,2,1,['ws']),2)
        compare(belt.jumpDelta(line,3,1,['ws']),1)
        compare(belt.jumpDelta(line,4,1,['ws']),1)
        compare(belt.jumpDelta(line,5,1,['ws']),1)
        compare(belt.jumpDelta(line,6,1,['ws']),1)
        compare(belt.jumpDelta(line,7,1,['ws']),1)
        compare(belt.jumpDelta(line,8,1,['ws']),1)
        compare(belt.jumpDelta(line,9,1,['ws']),1)
        compare(belt.jumpDelta(line,10,1,['ws']),1)
        compare(belt.jumpDelta(line,11,1,['ws']),1)
        compare(belt.jumpDelta(line,12,1,['ws']),2)
        line = '  ab += cd ;;  '
        compare(belt.jumpDelta(line,0,1,['word']),1)
        compare(belt.jumpDelta(line,1,1,['word']),1)
        compare(belt.jumpDelta(line,2,1,['word']),2)
        compare(belt.jumpDelta(line,3,1,['word']),1)
        compare(belt.jumpDelta(line,4,1,['word']),1)
        compare(belt.jumpDelta(line,5,1,['word']),1)
        compare(belt.jumpDelta(line,6,1,['word']),1)
        compare(belt.jumpDelta(line,7,1,['word']),1)
        compare(belt.jumpDelta(line,8,1,['word']),2)
        compare(belt.jumpDelta(line,9,1,['word']),1)
        compare(belt.jumpDelta(line,10,1,['word']),1)
        compare(belt.jumpDelta(line,11,1,['word']),1)
        compare(belt.jumpDelta(line,0,1,['punct']),1)
        compare(belt.jumpDelta(line,1,1,['punct']),1)
        compare(belt.jumpDelta(line,2,1,['punct']),1)
        compare(belt.jumpDelta(line,3,1,['punct']),1)
        compare(belt.jumpDelta(line,4,1,['punct']),1)
        compare(belt.jumpDelta(line,5,1,['punct']),2)
        compare(belt.jumpDelta(line,6,1,['punct']),1)
        compare(belt.jumpDelta(line,7,1,['punct']),1)
        compare(belt.jumpDelta(line,8,1,['punct']),1)
        compare(belt.jumpDelta(line,9,1,['punct']),1)
        compare(belt.jumpDelta(line,10,1,['punct']),1)
        compare(belt.jumpDelta(line,11,1,['punct']),2)
        compare(belt.jumpDelta(line,0,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,1,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,2,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,3,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,4,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,5,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,6,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,7,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,8,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,9,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,10,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,11,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,0,-1,['ws','word','punct']),0)
        compare(belt.jumpDelta(line,1,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,2,-1,['ws','word','punct']),-2)
        compare(belt.jumpDelta(line,3,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,4,-1,['ws','word','punct']),-2)
        compare(belt.jumpDelta(line,5,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,6,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,7,-1,['ws','word','punct']),-2)
        compare(belt.jumpDelta(line,8,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,9,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,10,-1,['ws','word','punct']),-2)
        compare(belt.jumpDelta(line,11,-1,['ws','word','punct']),-1)
        line = '  '
        compare(belt.jumpDelta(line,5,-1,['empty']),-3)
        compare(belt.jumpDelta(line,4,-1,['empty']),-2)
        compare(belt.jumpDelta(line,3,-1,['empty']),-1)
        compare(belt.jumpDelta(line,5,-1,['ws']),-1)
        compare(belt.jumpDelta(line,4,-1,['ws']),-1)
        compare(belt.jumpDelta(line,3,-1,['ws']),-1)
        compare(belt.jumpDelta(line,2,-1,['ws']),-2)
    })
    section("isPosInsideRange", function ()
    {
        compare(belt.isPosInsideRange([0,0],[0,0,1,0]),true)
        compare(belt.isPosInsideRange([1,0],[0,0,1,0]),true)
        compare(belt.isPosInsideRange([0,1],[0,0,1,0]),false)
        compare(belt.isPosInsideRange([7,1],[5,2,10,2]),false)
        compare(belt.isPosInsideRange([7,2],[5,2,10,2]),true)
        compare(belt.isPosInsideRange([5,2],[5,2,10,2]),true)
        compare(belt.isPosInsideRange([10,2],[5,2,10,2]),true)
        compare(belt.isPosInsideRange([4,2],[5,2,10,2]),false)
        compare(belt.isPosInsideRange([11,2],[5,2,10,2]),false)
        compare(belt.isPosInsideRange([7,3],[5,2,10,2]),false)
    })
    section("rangeContainsRange", function ()
    {
        compare(belt.rangeContainsRange([0,0,1,0],[0,0,0,0]),true)
        compare(belt.rangeContainsRange([0,0,1,0],[1,0,1,0]),true)
    })
    section("normalizeRanges", function ()
    {
        compare(belt.normalizeRanges([]),[])
        compare(belt.normalizeRanges([[0,1,3,4]]),[[0,1,3,4]])
        compare(belt.normalizeRanges([[0,4,3,1]]),[[3,1,0,4]])
        compare(belt.normalizeRanges([[3,1,0,4]]),[[3,1,0,4]])
        compare(belt.normalizeRanges([[3,4,2,4]]),[[2,4,3,4]])
        compare(belt.normalizeRanges([[0,0,9,9],[1,1,2,2]]),[[0,0,9,9],[1,1,2,2]])
        compare(belt.normalizeRanges([[1,1,2,2],[0,0,9,9]]),[[0,0,9,9],[1,1,2,2]])
    })
    section("mergeLineRanges", function ()
    {
        lines = ['1234567890','1234567890','1234567890']
        compare(belt.mergeLineRanges(lines,[[0,0,9,9],[1,1,2,2]]),[[0,0,9,9]])
        compare(belt.mergeLineRanges(lines,[[1,1,2,2],[0,0,9,9]]),[[0,0,9,9]])
        compare(belt.mergeLineRanges(lines,[[1,1,2,2],[0,0,9,9],[0,0,10,0],[0,8,9,9]]),[[0,0,9,9]])
        compare(belt.mergeLineRanges(lines,[[4,0,6,0],[8,0,10,0]]),[[4,0,6,0],[8,0,10,0]])
        compare(belt.mergeLineRanges(lines,[[4,0,6,0],[7,0,10,0]]),[[4,0,6,0],[7,0,10,0]])
        compare(belt.mergeLineRanges(lines,[[4,0,6,0],[6,0,10,0]]),[[4,0,10,0]])
        compare(belt.mergeLineRanges(lines,[[4,0,6,0],[5,0,10,0]]),[[4,0,10,0]])
        compare(belt.mergeLineRanges(lines,[[4,1,10,1],[0,2,4,2]]),[[4,1,4,2]])
    })
    section("rangeOfClosestWordToPos", function ()
    {
        lines = ['1 2  3   4','   ab ghij']
        compare(belt.rangeOfClosestWordToPos(lines,[0,0]),[0,0,1,0])
        compare(belt.rangeOfClosestWordToPos(lines,[1,0]),[0,0,1,0])
        compare(belt.rangeOfClosestWordToPos(lines,[2,0]),[2,0,3,0])
        compare(belt.rangeOfClosestWordToPos(lines,[3,0]),[2,0,3,0])
        compare(belt.rangeOfClosestWordToPos(lines,[4,0]),[2,0,3,0])
        compare(belt.rangeOfClosestWordToPos(lines,[5,0]),[5,0,6,0])
        compare(belt.rangeOfClosestWordToPos(lines,[0,1]),[3,1,5,1])
        compare(belt.rangeOfClosestWordToPos(lines,[5,1]),[3,1,5,1])
        compare(belt.rangeOfClosestWordToPos(lines,[6,1]),[6,1,10,1])
    })
    section("rangeOfWordOrWhitespaceLeftToPos", function ()
    {
        lines = ['1 2  3   4','   ab  ghij']
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(lines,[0,0]),undefined)
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(lines,[1,0]),[0,0,1,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(lines,[1,1]),[0,1,1,1])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(lines,[3,1]),[0,1,3,1])
        segls = kseg.segls(lines.join('\n'))
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[0,0]),undefined)
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[1,0]),[0,0,1,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[1,1]),[0,1,1,1])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[3,1]),[0,1,3,1])
        segls = kseg.segls('  🧑🌾  ab🌾cde')
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[1,0]),[0,0,1,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[2,0]),[0,0,2,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[3,0]),[2,0,3,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[4,0]),[2,0,3,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[5,0]),[3,0,4,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[6,0]),[3,0,4,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[7,0]),[4,0,5,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[8,0]),[4,0,6,0])
    })
    section("chunkBeforePos", function ()
    {
        segls = kseg.segls('\n1.4   x:z')
        compare(belt.chunkBeforePos(segls,[0,0]),'')
        compare(belt.chunkBeforePos(segls,[1,0]),'')
        compare(belt.chunkBeforePos(segls,[0,1]),'')
        compare(belt.chunkBeforePos(segls,[1,1]),'1')
        compare(belt.chunkBeforePos(segls,[3,1]),'1.4')
        compare(belt.chunkBeforePos(segls,[5,1]),'')
        compare(belt.chunkBeforePos(segls,[9,1]),'x:z')
    })
    section("chunkAfterPos", function ()
    {
        segls = kseg.segls('\n1.4   x:z')
        compare(belt.chunkAfterPos(segls,[0,0]),'')
        compare(belt.chunkAfterPos(segls,[1,0]),'')
        compare(belt.chunkAfterPos(segls,[0,1]),'1.4')
        compare(belt.chunkAfterPos(segls,[1,1]),'.4')
        compare(belt.chunkAfterPos(segls,[3,1]),'')
        compare(belt.chunkAfterPos(segls,[5,1]),'')
        compare(belt.chunkAfterPos(segls,[6,1]),'x:z')
        compare(belt.chunkAfterPos(segls,[7,1]),':z')
    })
    section("isFullLineRange", function ()
    {
        lines = ['','124','abcdef']
        compare(belt.isFullLineRange(lines,[0,0,0,1]),true)
        compare(belt.isFullLineRange(lines,[0,0,0,0]),true)
        compare(belt.isFullLineRange(lines,[0,1,3,1]),true)
        compare(belt.isFullLineRange(lines,[0,1,5,1]),true)
        compare(belt.isFullLineRange(lines,[0,1,2,1]),false)
        compare(belt.isFullLineRange(lines,[1,1,3,1]),false)
    })
    section("lineIndicesForRangesAndPositions", function ()
    {
        compare(belt.lineIndicesForRangesAndPositions([],[[1,1],[1,2],[1,3]]),[1,2,3])
        compare(belt.lineIndicesForRangesAndPositions([[0,0,2,0]],[[1,1],[1,2],[1,3]]),[0,1,2,3])
        compare(belt.lineIndicesForRangesAndPositions([[0,1,2,2]],[[1,6],[1,5],[1,4]]),[1,2,4,5,6])
    })
    section("linesIndicesForSpans", function ()
    {
        compare(belt.lineIndicesForSpans([]),[])
        compare(belt.lineIndicesForSpans([[0,1,0]]),[1])
        compare(belt.lineIndicesForSpans([[0,1,0],[1,1,1]]),[1])
    })
    section("blockRangesForRangesAndPositions", function ()
    {
        lines = kseg.segls(`line 1
line 2`)
        compare(belt.blockRangesForRangesAndPositions(lines,[],[[0,0],[0,1]]),[[0,0,6,1]])
        compare(belt.blockRangesForRangesAndPositions(lines,[[0,0,5,1]],[[0,0]]),[[0,0,6,1]])
        compare(belt.blockRangesForRangesAndPositions(lines,[[0,1,5,1]],[[0,0]]),[[0,0,6,1]])
        lines = kseg.segls(`line 1
line 2
line 3
line 4
line 5
line 6`)
        compare(belt.blockRangesForRangesAndPositions(lines,[],[[1,1],[1,2],[1,3]]),[[0,1,6,3]])
        compare(belt.blockRangesForRangesAndPositions(lines,[],[[6,5],[4,3],[2,1]]),[[0,1,6,1],[0,3,6,3],[0,5,6,5]])
    })
    section("isSpanLineRange", function ()
    {
        lines = ['','124','abcdef']
        compare(belt.isSpanLineRange(lines,[0,1,1,1]),true)
        compare(belt.isSpanLineRange(lines,[0,0,0,0]),false)
        compare(belt.isSpanLineRange(lines,[0,1,3,1]),false)
        compare(belt.isSpanLineRange(lines,[1,1,1,2]),false)
    })
    section("isPosAfterSpan", function ()
    {
        compare(belt.isPosAfterSpan([0,0],[1,0,5]),false)
        compare(belt.isPosAfterSpan([4,0],[1,0,5]),false)
        compare(belt.isPosAfterSpan([5,0],[1,0,5]),true)
        compare(belt.isPosAfterSpan([6,0],[1,0,5]),true)
        compare(belt.isPosAfterSpan([0,1],[1,0,5]),true)
    })
    section("isPosBeforeSpan", function ()
    {
        compare(belt.isPosBeforeSpan([0,0],[1,0,3]),true)
        compare(belt.isPosBeforeSpan([1,0],[1,0,3]),false)
        compare(belt.isPosBeforeSpan([3,1],[1,0,3]),false)
    })
    section("isPosInsideSpan", function ()
    {
        compare(belt.isPosInsideSpan([0,0],[1,0,3]),false)
        compare(belt.isPosInsideSpan([1,0],[1,0,3]),true)
        compare(belt.isPosInsideSpan([2,0],[1,0,3]),true)
        compare(belt.isPosInsideSpan([3,0],[1,0,3]),false)
    })
    section("nextSpanAfterPos", function ()
    {
        spans = [[1,0,3],[6,0,8],[2,1,5]]
        compare(belt.nextSpanAfterPos(spans,[4,0]),[6,0,8])
        compare(belt.nextSpanAfterPos(spans,[0,0]),[1,0,3])
        spans = [[0,21,11],[2,22,11],[5,23,11],[7,24,11]]
        compare(belt.nextSpanAfterPos(spans,[11,21]),[2,22,11])
        compare(belt.nextSpanAfterPos(spans,[11,22]),[5,23,11])
        compare(belt.nextSpanAfterPos(spans,[11,23]),[7,24,11])
        compare(belt.nextSpanAfterPos(spans,[11,24]),[0,21,11])
        spans = [[2,1,5],[2,2,5],[2,3,5]]
        compare(belt.nextSpanAfterPos(spans,[5,2]),[2,3,5])
        compare(belt.nextSpanAfterPos(spans,[5,3]),[2,1,5])
        compare(belt.nextSpanAfterPos(spans,[5,1]),[2,2,5])
        spans = [[1,4,3],[3,4,5]]
        compare(belt.nextSpanAfterPos(spans,[0,0]),[1,4,3])
        compare(belt.nextSpanAfterPos(spans,[3,4]),[3,4,5])
        compare(belt.nextSpanAfterPos(spans,[5,4]),[1,4,3])
    })
    section("prevSpanBeforePos", function ()
    {
        spans = [[1,0,3],[6,0,8],[2,1,5]]
        compare(belt.prevSpanBeforePos(spans,[0,0]),[2,1,5])
        compare(belt.prevSpanBeforePos(spans,[1,0]),[2,1,5])
        compare(belt.prevSpanBeforePos(spans,[2,0]),[2,1,5])
        compare(belt.prevSpanBeforePos(spans,[3,0]),[1,0,3])
        compare(belt.prevSpanBeforePos(spans,[4,0]),[1,0,3])
        compare(belt.prevSpanBeforePos(spans,[6,0]),[1,0,3])
        compare(belt.prevSpanBeforePos(spans,[7,0]),[1,0,3])
        compare(belt.prevSpanBeforePos(spans,[9,0]),[6,0,8])
        compare(belt.prevSpanBeforePos(spans,[0,1]),[6,0,8])
    })
    section("normalizePositions", function ()
    {
        compare(belt.normalizePositions([[0,0],[1,0],[2,0]]),[[0,0],[1,0],[2,0]])
        compare(belt.normalizePositions([[1,0],[2,0],[0,0]]),[[0,0],[1,0],[2,0]])
        compare(belt.normalizePositions([[1,0],[2,0],[1,0]]),[[1,0],[2,0]])
        compare(belt.normalizePositions([[2,2],[3,3],[1,1]]),[[1,1],[2,2],[3,3]])
        compare(belt.normalizePositions([[2,2],[0,3],[11,1]]),[[11,1],[2,2],[0,3]])
    })
    section("lineRangeAtPos", function ()
    {
        lines = belt.seglsForText(`🌾🧑`)
        compare(belt.lineRangeAtPos(lines,[0,0]),[0,0,4,0])
    })
    section("seglRangeAtPos", function ()
    {
        lines = belt.seglsForText(`🧑🌾`)
        compare(belt.seglRangeAtPos(lines,[0,0]),[0,0,2,0])
    })
    section("lineRangesInRange", function ()
    {
        lines = belt.seglsForText(`1

12
abc`)
        compare(belt.lineRangesInRange(lines,[0,0,0,2]),[[0,0,1,0],[0,1,0,1],[0,2,2,2]])
    })
    section("splitLineRanges", function ()
    {
        lines = belt.linesForText(`1

12
abc`)
        compare(belt.splitLineRanges(lines,[[0,0,1,2]]),[[0,0,1,0],[0,1,0,1],[0,2,1,2]])
        compare(belt.splitLineRanges(lines,[[0,2,1,2],[2,2,3,2]]),[[0,2,1,2],[2,2,3,2]])
    })
    section("seglsForText", function ()
    {
        segls = belt.seglsForText(`123
456

abc
def`)
        compare(segls,[['1','2','3'],['4','5','6'],[],['a','b','c'],['d','e','f']])
        section("seglsForRange", function ()
        {
            compare(belt.seglsForRange(segls,[0,0,3,4]),[['1','2','3'],['4','5','6'],[],['a','b','c'],['d','e','f']])
            compare(belt.seglsForRange(segls,[0,0,0,0]),[[]])
            compare(belt.seglsForRange(segls,[0,0,1,0]),[['1']])
            compare(belt.seglsForRange(segls,[3,0,0,1]),[[],[]])
            compare(belt.seglsForRange(segls,[3,0,1,1]),[[],['4']])
        })
    })
    section("rangesForLinesSplitAtPositions", function ()
    {
        lines = belt.linesForText(`123
456

abc
def`)
        compare(belt.rangesForLinesSplitAtPositions(lines,[]),[])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[0,0]]),[[0,0,0,0],[0,0,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[1,0]]),[[0,0,1,0],[1,0,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[0,2]]),[[0,0,0,2],[0,2,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[0,0],[1,0]]),[[0,0,0,0],[0,0,1,0],[1,0,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[3,0],[3,1]]),[[0,0,3,0],[3,0,3,1],[3,1,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[0,5]]),[[0,0,3,4],[3,4,3,4]])
    })
    section("rangesOfStringsInText", function ()
    {
        compare(belt.rangesOfStringsInText("hello"),[])
        compare(belt.rangesOfStringsInText("he'll'o"),[[2,0,6,0]])
    })
    section("widthOfLines", function ()
    {
        text = "ｔｈｅ　ｑｕｉｃｋ　ｂｒｏｗｎ　ｆｏｘ　ｊｕｍｐｓ"
        lines = belt.linesForText(text)
        compare(belt.widthOfLines(lines),50)
    })
    section("isRangeInString", function ()
    {
        lines = belt.linesForText(`123
'456'

'abc'
def`)
        compare(belt.isRangeInString(lines,[0,0,0,0]),false)
        compare(belt.isRangeInString(lines,[0,2,0,2]),false)
        compare(belt.isRangeInString(lines,[0,3,0,3]),false)
        compare(belt.isRangeInString(lines,[1,3,5,3]),false)
        compare(belt.isRangeInString(lines,[1,1,1,1]),true)
        compare(belt.isRangeInString(lines,[1,3,2,3]),true)
        compare(belt.isRangeInString(lines,[1,3,3,3]),true)
        compare(belt.isRangeInString(lines,[1,3,4,3]),true)
    })
    section("rangesOfPairsSurroundingPositions", function ()
    {
        lines = belt.linesForText(`01234567

'45""6'
'a#\{\}c'
[[{()}]]`)
        pairs = [["'","'"],['"','"'],['#{','}'],['[',']'],['(',')']]
        posl = [[4,0],[4,1],[4,2],[4,3],[4,4]]
        compare(belt.rangesOfPairsSurroundingPositions(lines,pairs,posl),[[3,2,5,2],[2,3,5,3],[3,4,5,4]])
    })
    section("spansOfNestedPairsAtPositions", function ()
    {
        lines = belt.linesForText(`01234567

'45""6'
'a#\{\}c'
[[{()}]]`)
        posl = [[4,0],[4,1],[4,2],[4,3],[4,4]]
        compare(belt.spansOfNestedPairsAtPositions(lines,posl),[[0,2,6,2],[0,3,6,3],[0,4,7,4],[1,4,6,4],[2,4,5,4],[3,4,4,4]])
    })
    section("openCloseSpansForPositions", function ()
    {
        segls = kseg.segls(`[[{()}]]
'45""6'
'a{}c'`)
        compare(belt.openCloseSpansForPositions(segls,[[0,0]]),[[0,0,1],[7,0,8]])
        compare(belt.openCloseSpansForPositions(segls,[[1,0]]),[[1,0,2],[6,0,7]])
        compare(belt.openCloseSpansForPositions(segls,[[2,0]]),[[2,0,3],[5,0,6]])
        compare(belt.openCloseSpansForPositions(segls,[[3,0]]),[[3,0,4],[4,0,5]])
        compare(belt.openCloseSpansForPositions(segls,[[4,0]]),[[3,0,4],[4,0,5]])
        compare(belt.openCloseSpansForPositions(segls,[[5,0]]),[[2,0,3],[5,0,6]])
        compare(belt.openCloseSpansForPositions(segls,[[6,0]]),[[1,0,2],[6,0,7]])
        compare(belt.openCloseSpansForPositions(segls,[[7,0]]),[[0,0,1],[7,0,8]])
        compare(belt.openCloseSpansForPositions(segls,[[8,0]]),[[0,0,1],[7,0,8]])
        compare(belt.openCloseSpansForPositions(segls,[[0,1]]),[])
        compare(belt.openCloseSpansForPositions(segls,[[6,1]]),[])
        compare(belt.stringDelimiterSpansForPositions(segls,[[0,1]]),[[0,1,1],[6,1,7]])
        compare(belt.stringDelimiterSpansForPositions(segls,[[6,1]]),[[0,1,1],[6,1,7]])
        compare(belt.normalizeSpans(belt.openCloseSpansForPositions(segls,[[2,2]])),[[2,2,3],[3,2,4]])
        compare(belt.normalizeSpans(belt.openCloseSpansForPositions(segls,[[3,2]])),[[2,2,3],[3,2,4]])
        compare(belt.normalizeSpans(belt.openCloseSpansForPositions(segls,[[4,2]])),[[2,2,3],[3,2,4]])
        compare(belt.normalizeSpans(belt.stringDelimiterSpansForPositions(segls,[[2,2]])),[[0,2,1],[5,2,6]])
        compare(belt.normalizeSpans(belt.stringDelimiterSpansForPositions(segls,[[3,2]])),[[0,2,1],[5,2,6]])
        compare(belt.normalizeSpans(belt.stringDelimiterSpansForPositions(segls,[[4,2]])),[[0,2,1],[5,2,6]])
        segls = kseg.segls(`next = lines[ap[1]][ap[0]]  `)
        compare(belt.openCloseSpansForPositions(segls,[[25,0]]),[[19,0,20],[25,0,26]])
        compare(belt.openCloseSpansForPositions(segls,[[26,0]]),[[19,0,20],[25,0,26]])
        segls = kseg.segls(`s[2]`)
        compare(belt.openCloseSpansForPositions(segls,[[4,0]]),[[1,0,2],[3,0,4]])
    })
    section("positionColumns", function ()
    {
        compare(belt.positionColumns([[0,0],[0,1]]),[[[0,0],[0,1]]])
        compare(belt.positionColumns([[0,0],[0,1],[1,1]]),[[[0,0],[0,1]],[[1,1]]])
    })
    section("indexOfExtremePositionInDirection", function ()
    {
        posl = [[12,3],[4,4],[3,6],[10,6],[5,7],[13,8],[2,11]]
        compare(belt.indexOfExtremePositionInDirection(posl,'left'),6)
        compare(belt.indexOfExtremePositionInDirection(posl,'down'),6)
        compare(belt.indexOfExtremePositionInDirection(posl,'right'),5)
        compare(belt.indexOfExtremePositionInDirection(posl,'up'),0)
        posl = [[3,3],[3,4],[3,5]]
        compare(belt.indexOfExtremePositionInDirection(posl,'left',0),0)
        compare(belt.indexOfExtremePositionInDirection(posl,'left',1),1)
        compare(belt.indexOfExtremePositionInDirection(posl,'left',2),2)
        compare(belt.indexOfExtremePositionInDirection(posl,'right',0),0)
        compare(belt.indexOfExtremePositionInDirection(posl,'right',1),1)
        compare(belt.indexOfExtremePositionInDirection(posl,'right',2),2)
    })
}
toExport["tool belt"]._section_ = true
toExport._test_ = true
export default toExport
