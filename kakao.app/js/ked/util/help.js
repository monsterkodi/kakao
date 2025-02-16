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

    help["headerCells"] = function ()
    {
        var c, cells, dcells, ecells, h, kcells

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
        cells = util.cellsForLines(util.indentLines(util.linesForText(h),5))
        kcells = util.cellsInRect(cells,0,0,20,-1)
        var list = _k_.list(kcells)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            c.cell.fg = ((function ()
            {
                switch (c.cell.char)
                {
                    case ' ':
                        return [0,0,0]

                    default:
                        return [0,255,0]
                }

            }).bind(this))()
        }
        ecells = util.cellsInRect(cells,20,0,35,-1)
        var list1 = _k_.list(ecells)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            c = list1[_b_]
            c.cell.fg = ((function ()
            {
                switch (c.cell.char)
                {
                    case ' ':
                        return [0,0,0]

                    default:
                        return [120,120,255]
                }

            }).bind(this))()
        }
        dcells = util.cellsInRect(cells,36,0,-1,-1)
        var list2 = _k_.list(dcells)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            c = list2[_c_]
            c.cell.fg = ((function ()
            {
                switch (c.cell.char)
                {
                    case ' ':
                        return [0,0,0]

                    default:
                        return [255,160,0]
                }

            }).bind(this))()
        }
        color.glowEffect(cells)
        color.dimCellsColor(util.cellsWithChar(cells,'○'),'fg',0.35)
        color.variateCellsColor(util.cellsWithChar(cells,'○'),'fg',0.5)
        return cells
    }

    return help
})()

export default help;