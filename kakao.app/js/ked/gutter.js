var _k_ = {lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var gutter

import theme from "./theme.js"
import cells from "./cells.js"


gutter = (function ()
{
    function gutter (screen, state)
    {
        this.state = state
    
        this.cells = new cells(screen)
    }

    gutter.prototype["draw"] = function ()
    {
        var bg, c, col, fg, i, lineno, row, y

        for (var _a_ = row = 0, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
        {
            y = this.state.s.view[1] + row
            lineno = _k_.lpad(this.cells.cols - 1,y + 1)
            lineno += ' '
            var list = _k_.list(lineno)
            for (i = 0; i < list.length; i++)
            {
                c = list[i]
                col = i
                if (col < this.cells.rows)
                {
                    fg = y === this.state.s.cursor[1] ? theme.cursor : this.state.isSelectedLine(y) ? theme.selection : theme.linenr
                    bg = this.state.isSelectedLine(y) ? theme.gutter_sel : theme.gutter
                    this.cells.set(col,row,((y < this.state.s.lines.length) ? c : ' '),fg,bg)
                }
            }
        }
    }

    return gutter
})()

export default gutter;