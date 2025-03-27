var toExport = {}
var lines, posl, result, rngs, words

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let immutable = kxk.immutable

import belt from "../edit/tool/belt.js"

toExport["tool edit"] = function ()
{
    section("toggleCommentTypesInLineRangesAtIndices", function ()
    {
        lines = belt.seglsForText(`code = true
# comment
# a
code = 'yes' # trailing`)
        result = belt.seglsForText(`code = true
###
comment
a
###
code = 'yes' # trailing`)
    })
    section("deleteLineRangesAndAdjustPositions", function ()
    {
        lines = belt.seglsForText(`1234567890
abcdefghij`)
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[5,0,5,0]],[[5,1]]),[lines,[[5,1]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[5,0,6,0]],[[5,1]]),[[kseg('123457890'),kseg('abcdefghij')],[[5,1]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[5,0,5,1]],[[5,1]]),[[kseg('12345fghij')],[[5,0]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[0,1,1,1]],[[0,1]]),[[kseg('1234567890'),kseg('bcdefghij')],[[0,1]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[5,0,3,1]],[[3,1]]),[[kseg('12345defghij')],[[5,0]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[3,0,5,1]],[[3,1]]),[[kseg('123fghij')],[[3,0]]])
        lines = belt.seglsForText(`line 1
line 2
line 3`)
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[0,0,6,1]],[[6,0],[6,1]]),[[kseg('line 3')],[[0,0]]])
    })
    section("insertTextAtPositions", function ()
    {
        section("single spans", function ()
        {
            lines = belt.seglsForText(`line 1
line 2`)
            compare(belt.insertTextAtPositions(lines,'',[[0,0]]),[kseg.segls('line 1\nline 2'),[[0,0]]])
            compare(belt.insertTextAtPositions(lines,'a ',[[0,0]]),[kseg.segls('a line 1\nline 2'),[[2,0]]])
            compare(belt.insertTextAtPositions(lines,'a ',[[0,0],[0,1]]),[kseg.segls('a line 1\na line 2'),[[2,0],[2,1]]])
            compare(belt.insertTextAtPositions(lines,'x',[[0,0],[2,0]]),[kseg.segls('xlixne 1\nline 2'),[[1,0],[4,0]]])
            compare(belt.insertTextAtPositions(lines,'x',[[0,0],[2,0],[6,0]]),[kseg.segls('xlixne 1x\nline 2'),[[1,0],[4,0],[9,0]]])
            compare(belt.insertTextAtPositions(lines,'z',[[0,0],[2,0],[6,0],[1,1],[2,1],[4,1]]),[kseg.segls('zlizne 1z\nlziznez 2'),[[1,0],[4,0],[9,0],[2,1],[4,1],[7,1]]])
            compare(belt.insertTextAtPositions(lines,'ｔ',[[0,0]]),[kseg.segls('ｔline 1\nline 2'),[[2,0]]])
            compare(belt.insertTextAtPositions(kseg.segls('ｔline 1\nline 2'),'ｔ',[[2,0]]),[kseg.segls('ｔｔline 1\nline 2'),[[4,0]]])
        })
        section("multiple lines into single cursor", function ()
        {
            lines = belt.seglsForText(`line 1
line 2`)
            compare(belt.insertTextAtPositions(lines,'a\nb',[[0,0]]),[kseg.segls('a\nb\nline 1\nline 2'),[[0,2]]])
            compare(belt.insertTextAtPositions(lines,'a\nb',[[2,0]]),[kseg.segls('lia\nbne 1\nline 2'),[[1,1]]])
            compare(belt.insertTextAtPositions(lines,'a\nb',[[0,1]]),[kseg.segls('line 1\na\nb\nline 2'),[[0,3]]])
            compare(belt.insertTextAtPositions(lines,'a\n',[[0,1]]),[kseg.segls('line 1\na\nline 2'),[[0,2]]])
        })
        section("multiple lines into multi cursor", function ()
        {
            lines = belt.seglsForText(`1234
5678`)
            compare(belt.insertTextAtPositions(lines,'X\nY',[[0,0],[0,1]]),[kseg.segls('X1234\nY5678'),[[1,0],[1,1]]])
            compare(belt.insertTextAtPositions(lines,'X\nY',[[0,0],[1,0],[2,0],[3,0]]),[kseg.segls('X1Y2X3Y4\n5678'),[[1,0],[3,0],[5,0],[7,0]]])
            compare(belt.insertTextAtPositions(lines,'@\n$\n%',[[0,0],[1,0],[2,0],[3,0]]),[kseg.segls('@1$2%3@4\n5678'),[[1,0],[3,0],[5,0],[7,0]]])
        })
        section("newlines", function ()
        {
            lines = belt.seglsForText(`line 1
line 2`)
            compare(belt.insertTextAtPositions(lines,'\n',[[2,0]]),[kseg.segls('li\nne 1\nline 2'),[[0,1]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[6,0]]),[kseg.segls('line 1\n\nline 2'),[[0,1]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[0,1]]),[kseg.segls('line 1\n\nline 2'),[[0,2]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[2,1]]),[kseg.segls('line 1\nli\nne 2'),[[0,2]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[6,1]]),[kseg.segls('line 1\nline 2\n'),[[0,2]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[0,0],[0,1]]),[kseg.segls('\nline 1\n\nline 2'),[[0,1],[0,3]]])
            lines = belt.seglsForText(`◆1
◆2
◆3
◆4`)
            compare(belt.insertTextAtPositions(lines,'\n',[[1,0],[1,1],[1,2],[1,3]]),[kseg.segls('◆\n1\n◆\n2\n◆\n3\n◆\n4'),[[0,1],[0,3],[0,5],[0,7]]])
        })
        section("into indented lines", function ()
        {
            lines = belt.seglsForText(`◆1
    ◆2
        ◆3`)
            section("single span", function ()
            {
                compare(belt.insertTextAtPositions(lines,'~!',[[4,1]]),[kseg.segls('◆1\n    ~!◆2\n        ◆3'),[[6,1]]])
                compare(belt.insertTextAtPositions(lines,'#{',[[2,2]]),[kseg.segls('◆1\n    ◆2\n  #{      ◆3'),[[4,2]]])
            })
            section("newline into single cursor", function ()
            {
                compare(belt.insertTextAtPositions(lines,'\n',[[4,1]]),[kseg.segls('◆1\n    \n    ◆2\n        ◆3'),[[4,2]]])
            })
            section("multiple lines into single cursor", function ()
            {
                compare(belt.insertTextAtPositions(lines,'a\nb',[[4,1]]),[kseg.segls('◆1\n    a\n    b\n    ◆2\n        ◆3'),[[4,3]]])
            })
        })
    })
    section("insertSurroundAtRanges", function ()
    {
        lines = belt.seglsForText(`line1
line2`)
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],'}',['{','}']),[kseg.segls('l{in}e1\nline2'),[[5,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0],[1,1,3,1]],']',['[',']']),[kseg.segls('l[in]e1\nl[in]e2'),[[5,0],[5,1]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],'{',['{','}']),[kseg.segls('l{in}e1\nline2'),[[2,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0],[1,1,3,1]],'[',['[',']']),[kseg.segls('l[in]e1\nl[in]e2'),[[2,0],[2,1]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],'"',['"','"']),[kseg.segls('l"in"e1\nline2'),[[5,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0],[1,1,3,1]],'"',['"','"']),[kseg.segls('l"in"e1\nl"in"e2'),[[5,0],[5,1]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],"}",['#{','}']),[kseg.segls("l\#{in}e1\nline2"),[[6,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],"#",['#{','}']),[kseg.segls("l\#{in}e1\nline2"),[[3,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0],[1,1,3,1]],'"',['"','"']),[kseg.segls('l"in"e1\nl"in"e2'),[[5,0],[5,1]]])
    })
    section("moveLineRangesAndPositionsAtIndicesInDirection", function ()
    {
        lines = immutable(['a','b','c'])
        rngs = immutable([])
        posl = immutable([])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[1],'down'),[['a','c','b'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[2],'down'),[['a','b','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[1,2],'down'),[['a','b','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[0,2],'down'),[['a','b','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[1],'up'),[['b','a','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[2],'up'),[['a','c','b'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[1,2],'up'),[['b','c','a'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[0,2],'up'),[['a','b','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1]]),[1],'down'),[['a','c','b'],[],[[0,2]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[1,1]]),[1],'down'),[['a','c','b'],[],[[0,2],[1,2]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[1,1]]),[1],'down'),[['a','c','b'],[],[[0,2],[1,2]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1]]),[1],'up'),[['b','a','c'],[],[[0,0]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[1,1]]),[1],'up'),[['b','a','c'],[],[[0,0],[1,0]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[1,1]]),[1],'up'),[['b','a','c'],[],[[0,0],[1,0]]])
        lines = immutable(['a','b','c','d','e'])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[0,2],[0,3]]),[1,2,3],'up'),[['b','c','d','a','e'],[],[[0,0],[0,1],[0,2]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[0,2],[0,3]]),[1,2,3],'down'),[['a','e','b','c','d'],[],[[0,2],[0,3],[0,4]]])
    })
    section("prepareWordsForCompletion", function ()
    {
        words = belt.linesForText(`Alice
Alice!
Alice!"
Alice)--
Alice,
Alice,)
Alice.
Alice:
Alice;
Alice’s
Alice’s,`)
        compare(belt.prepareWordsForCompletion('A','A',words),['Alice','Alice’s'])
        compare(belt.prepareWordsForCompletion('"','"',['"#fff"']),['"#','"#fff"'])
        compare(belt.prepareWordsForCompletion('f','f',['func()']),['func','func()'])
        compare(belt.prepareWordsForCompletion('fa','fa',['f']),[])
        compare(belt.prepareWordsForCompletion('w','w',['word[@turd.length..]']),['word','word[@turd.length..]'])
        compare(belt.prepareWordsForCompletion('a.b','a.b',['a.b.c.d']),['a.b.','a.b.c.d'])
        compare(belt.prepareWordsForCompletion('word','word',['word[@turd.length..]']),['word[@turd.length..]'])
        compare(belt.prepareWordsForCompletion('k','k',['kseg','key']),['key','kseg'])
        compare(belt.prepareWordsForCompletion('he','he',['hello','hell']),['hell','hello'])
        compare(belt.prepareWordsForCompletion('he','he',['"hello"','@hell']),['hell','hello'])
        compare(belt.prepareWordsForCompletion('a.','.',['0.1','1.234','obj.prop']),['.prop'])
        compare(belt.prepareWordsForCompletion('0.','.',['0.1','1.234','obj.prop']),['.1'])
        compare(belt.prepareWordsForCompletion('3.1','1',['1.123','1.234','obj.prop']),[])
        compare(belt.prepareWordsForCompletion('rugga','r',['rofl','rug']),['rofl','rug'])
        compare(belt.prepareWordsForCompletion('rugga','ru',['rug']),['rug'])
        compare(belt.prepareWordsForCompletion('mc','mc',['mc[0]','mc[1]']),['mc[0]','mc[1]'])
    })
    section("indentLineRangesAndPositionsAtIndices", function ()
    {
        lines = belt.seglsForText(`◆1
    ◆2
        ◆3`)
        posl = immutable([[0,0,1,1]])
        rngs = immutable([[0,1],[1,1]])
        compare(belt.indentLineRangesAndPositionsAtIndices(lines,posl,rngs,[0,1]),[[kseg('    ◆1'),kseg('        ◆2'),kseg('        ◆3')],[[4,0,5,1]],[[4,1],[5,1]]])
    })
    section("deindentLineRangesAndPositionsAtIndices", function ()
    {
        lines = belt.seglsForText(`◆1
    ◆2
        ◆3`)
        posl = immutable([[0,1,1,2]])
        rngs = immutable([[0,1],[1,2]])
        compare(belt.deindentLineRangesAndPositionsAtIndices(lines,posl,rngs,[1,2]),[[kseg('◆1'),kseg('◆2'),kseg('    ◆3')],[[0,1,0,2]],[[0,1],[0,2]]])
    })
}
toExport["tool edit"]._section_ = true
toExport._test_ = true
export default toExport
