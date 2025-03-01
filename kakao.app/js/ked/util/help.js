var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var help

import util from "./util.js"
import color from "./color.js"


help = (function ()
{
    function help ()
    {}

    help["header"] = function ()
    {
        return '\n' + color.linesForCells(this.headerCells()).join('\n') + '\n'
    }

    help["headerCells"] = function (color1, color2, color3)
    {
        var c, cells, dcells, ecells, h, kcells

        color1 = (color1 != null ? color1 : [0,255,0])
        color2 = (color2 != null ? color2 : [120,120,255])
        color3 = (color3 != null ? color3 : [255,160,0])
        h = `


╭───╮                ╭───╮                ╭───╮     
│○○○│                │○○○│                │○○○│     
│○○○│                ╰───╯                │○○○│     
│○○○│     ╭───╮    ╭───────╮       ╭──────╯○○○│     
│○○○│   ╭─╯○○○│  ╭─╯○○○○○○○╰─╮   ╭─╯○○○○○○○○○○│     
│○○○│ ╭─╯○○╭──╯ ╭╯○○╭─────╮○○╰╮ ╭╯○○╭─────╮○○○│     
│○○○╰─╯○○╭─╯    │○○○│     │○○○│ │○○○│     │○○○│     
│○○○○○○○○│      │○○○╰─────╯○○○│ │○○○│     │○○○│     
│○○○╭─╮○○╰─╮    │○○○╭─────────╯ │○○○│     │○○○│     
│○○○│ ╰─╮○○╰─╮  │○○○│     ╭───╮ │○○○│     │○○○│     
│○○○│   ╰─╮○○╰╮ ╰╮○○╰─────╯○○╭╯ ╰╮○○╰─────╯○○╭╯     
│○○○│     │○○○│  ╰─╮○○○○○○○╭─╯   ╰─╮○○○○○○○╭─╯      
╰───╯     ╰───╯    ╰───────╯       ╰───────╯        


`
        cells = util.cellsForLines(util.indentLines(util.seglsForText(h),5))
        kcells = util.cellsInRect(cells,0,0,20,cells.length - 1)
        var list = _k_.list(kcells)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            switch (c.cell.char)
            {
                case ' ':
                    c.cell.fg = [0,0,0]
                    break
                default:
                    c.cell.fg = color1
            }

        }
        ecells = util.cellsInRect(cells,20,0,35,cells.length - 1)
        var list1 = _k_.list(ecells)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            c = list1[_b_]
            switch (c.cell.char)
            {
                case ' ':
                    c.cell.fg = [0,0,0]
                    break
                default:
                    c.cell.fg = color2
            }

        }
        dcells = util.cellsInRect(cells,36,0,cells[0].length - 1,cells.length - 1)
        var list2 = _k_.list(dcells)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            c = list2[_c_]
            switch (c.cell.char)
            {
                case ' ':
                    c.cell.fg = [0,0,0]
                    break
                default:
                    c.cell.fg = color3
            }

        }
        color.glowEffect(cells)
        color.dimCellsColor(util.cellsWithChar(cells,'○'),'fg',0.26)
        color.variateCellsColor(util.cellsWithChar(cells,'○'),'fg',0.15)
        return cells
    }

    return help
})()

export default help;