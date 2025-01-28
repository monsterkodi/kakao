var _k_ = {lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var gutter

import color from "./color.js"


gutter = (function ()
{
    function gutter (cells, state)
    {
        this.cells = cells
        this.state = state
    }

    gutter.prototype["draw"] = function ()
    {
        var bg, c, col, fg, i, lineno, row, y

        for (var _a_ = row = 0, _b_ = this.cells.rows - 1; (_a_ <= _b_ ? row < this.cells.rows - 1 : row > this.cells.rows - 1); (_a_ <= _b_ ? ++row : --row))
        {
            y = this.state.s.view[1] + row
            lineno = _k_.lpad(this.state.s.gutter - 2,y + 1)
            lineno += ' '
            var list = _k_.list(lineno)
            for (i = 0; i < list.length; i++)
            {
                c = list[i]
                col = i + 1
                if (col < this.cells.rows)
                {
                    fg = y === this.state.s.cursor[1] ? color.cursor : this.state.isSelectedLine(y) ? color.selection : color.linenr
                    bg = this.state.isSelectedLine(y) ? color.gutter_sel : color.gutter
                    this.cells.set(col,row,((y < this.state.s.lines.length) ? c : ' '),fg,bg)
                }
            }
        }
    }

    return gutter
})()

export default gutter;