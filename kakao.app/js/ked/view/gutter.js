var _k_ = {lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var gutter

import theme from "../theme.js"

import cells from "./cells.js"


gutter = (function ()
{
    function gutter (screen, state)
    {
        this.state = state
    
        this.cells = new cells(screen)
    }

    gutter.prototype["init"] = function (x, y, w, h)
    {
        return this.cells.init(x,y,w,h)
    }

    gutter.prototype["draw"] = function ()
    {
        var bg, c, col, fg, fullysel, hasCursor, highlighted, i, lineno, mainCursor, row, selected, y

        mainCursor = this.state.mainCursor()
        for (var _a_ = row = 0, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
        {
            y = this.state.s.view[1] + row
            lineno = _k_.lpad(this.cells.cols - 1,y + 1)
            lineno += ' '
            hasCursor = this.state.isAnyCursorInLine(y)
            selected = this.state.isSelectedLine(y)
            highlighted = this.state.isHighlightedLine(y)
            fullysel = this.state.isFullySelectedLine(y)
            var list = _k_.list(lineno)
            for (i = 0; i < list.length; i++)
            {
                c = list[i]
                col = i
                if (col < this.cells.rows)
                {
                    fg = y === mainCursor[1] ? (this.state.hasFocus ? theme.editor_cursor_bg : theme.editor_cursor_blur) : hasCursor ? theme.editor_cursor_multi : fullysel ? theme.selection_line : selected ? theme.selection : highlighted ? theme.highlight : theme.linenr
                    bg = fullysel ? theme.gutter_fully_selected : selected ? theme.gutter_selected : theme.gutter
                    this.cells.set(col,row,((y < this.state.s.lines.length) ? c : ' '),fg,bg)
                }
            }
        }
    }

    return gutter
})()

export default gutter;