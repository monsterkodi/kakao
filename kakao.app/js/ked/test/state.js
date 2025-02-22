var toExport = {}
var cells, cur, mul, s, sel, text, txt

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import util from "../util/util.js"

import state from "../state.js"


global.lf = function (...args)
{
    console.log(args.map(function (a)
    {
        return `${a}`
    }).join(' '))
}
cells = {cols:55,rows:66}
s = new state(cells,'test')

txt = function (t)
{
    return compare(kseg.str(s.allLines()),t)
}

cur = function (x, y)
{
    return compare(s.mainCursor(),[x,y])
}

mul = function (...c)
{
    return compare(s.allCursors(),c)
}

sel = function (...r)
{
    return compare(s.allSelections(),r)
}
toExport["state"] = function ()
{
    text = `line 1
line 2
line 3`
    s.syntax.ext = 'kode'
    s.loadLines(util.linesForText(text))
    txt(text)
    section("editing", function ()
    {
        s.setMainCursor(1,1)
        cur(1,1)
        s.insert('x')
        cur(2,1)
        txt(`line 1
lxine 2
line 3`)
        s.delete('back')
        cur(1,1)
        txt(text)
    })
    section("move lines", function ()
    {
        s.moveSelectionOrCursorLines('up')
        cur(1,0)
        txt(`line 2
line 1
line 3`)
        s.moveSelectionOrCursorLines('down')
        cur(1,1)
        txt(text)
    })
    section("multiple", function ()
    {
        s.expandCursors('up')
        mul([1,0],[1,1])
        s.expandCursors('down')
        mul([1,0],[1,1],[1,2])
        s.moveCursors('left')
        mul([0,0],[0,1],[0,2])
        s.moveCursorsAndSelect('right')
        mul([1,0],[1,1],[1,2])
        sel([0,0,1,0],[0,1,1,1],[0,2,1,2])
        s.moveCursors('right',{jump:['ws','word','empty','punct']})
        mul([4,0],[4,1],[4,2])
        sel([0,0,1,0],[0,1,1,1],[0,2,1,2])
        s.selectAllLines()
        mul([4,0],[4,1],[4,2])
        sel([0,0,6,2])
        s.selectAllLines()
        mul([4,0],[4,1],[4,2])
        sel()
        s.moveCursors('right')
        s.moveCursorsAndSelect('left',{jump:['word']})
        s.moveCursorsAndSelect('left',{jump:['word']})
        mul([0,0],[0,1],[0,2])
        sel([0,0,5,0],[0,1,5,1],[0,2,5,2])
        s.insert('\n')
        mul([0,1],[0,3],[0,5])
        sel()
        txt(`
1

2

3`)
    })
    section("unicode", function ()
    {
        text = `s = "🧑🌾"
line 3`
        s.syntax.ext = 'kode'
        s.loadSegls(util.seglsForText(text))
        txt(text)
        s.toggleCommentAtSelectionOrCursorLines()
        txt(`# s = "🧑🌾"
line 3`)
        s.toggleCommentAtSelectionOrCursorLines()
        txt(text)
        section("selection", function ()
        {
            text = `'a'        ▸ 1
'🔧'       ▸ 2
'字'       ▸ 2
'字的模块' ▸ 8
'👁'        ▸ 1
'🖌'        ▸ 1
'🛠'        ▸ 1
'🧑‍🌾'       ▸ 4
'🔥'       ▸ 2
'💩'       ▸ 2`
            s.syntax.ext = 'kode'
            s.loadSegls(util.seglsForText(text))
            txt(text)
            s.selectAllLines()
            sel([0,0,14,9])
            s.moveCursorsToEndOfSelections()
            sel([0,0,14,9])
            mul([14,0],[14,1],[14,2],[14,3],[14,4],[14,5],[14,6],[14,7],[14,8],[14,9])
            s.deselect()
            sel()
            mul([14,0],[14,1],[14,2],[14,3],[14,4],[14,5],[14,6],[14,7],[14,8],[14,9])
            s.moveCursors('bol')
            mul([0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9])
            s.selectMoreLines()
            sel([0,0,14,9])
            mul([14,0],[14,1],[14,2],[14,3],[14,4],[14,5],[14,6],[14,7],[14,8],[14,9])
            s.deselect()
            s.delete('back')
            txt(`'a'        ▸ 
'🔧'       ▸ 
'字'       ▸ 
'字的模块' ▸ 
'👁'        ▸ 
'🖌'        ▸ 
'🛠'        ▸ 
'🧑‍🌾'       ▸ 
'🔥'       ▸ 
'💩'       ▸ `)
            s.delete('back')
            s.moveCursors('left')
            s.delete('back')
            txt(`'a'       ▸
'🔧'      ▸
'字'      ▸
'字的模块'▸
'👁'       ▸
'🖌'       ▸
'🛠'       ▸
'🧑‍🌾'      ▸
'🔥'      ▸
'💩'      ▸`)
            s.delete('back',true)
            txt(`'a'▸
'🔧'▸
'字'▸
'字的模块▸
'👁'▸
'🖌'▸
'🛠'▸
'🧑‍🌾'▸
'🔥'▸
'💩'▸`)
        })
    })
    section("empty", function ()
    {
        s.syntax.ext = 'kode'
        s.loadLines(util.linesForText(''))
        txt('')
        cur(0,0)
        s.insert('\n')
        txt('\n')
        cur(0,1)
        compare(s.allLines(),[[],[]])
    })
}
toExport["state"]._section_ = true
toExport._test_ = true
export default toExport
