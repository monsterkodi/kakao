var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var gutter

import prof from "../../util/prof.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"


gutter = (function ()
{
    _k_.extend(gutter, view)
    function gutter (screen, state)
    {
        this.state = state
    
        gutter.__super__.constructor.call(this,screen,this.state.owner() + '.gutter')
    }

    gutter.prototype["draw"] = function ()
    {
        var bg, c, col, fg, hasCursor, highlighted, i, lineno, mainCursor, row, selected, spansel, y, _40_101_

        mainCursor = this.state.mainCursor()
        for (var _a_ = row = 0, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
        {
            y = this.state.s.view[1] + row
            lineno = _k_.lpad(this.cells.cols - 1,y + 1)
            lineno += ' '
            hasCursor = this.state.isAnyCursorInLine(y)
            selected = this.state.isSelectedLine(y)
            highlighted = this.state.isHighlightedLine(y)
            spansel = this.state.isSpanSelectedLine(y)
            var list = _k_.list(lineno)
            for (i = 0; i < list.length; i++)
            {
                c = list[i]
                col = i
                if (col < this.cells.rows)
                {
                    fg = y === mainCursor[1] ? color.darken(theme.editor_cursor_main,(this.state.hasFocus != null),{1:0.5}) : hasCursor ? theme.editor_cursor_multi : spansel ? theme.editor_selection : selected ? theme.editor_selection_line : highlighted ? theme.editor_highlight : theme.linenr
                    if ((selected || hasCursor || highlighted) && !this.cells.screen.t.hasFocus)
                    {
                        fg = color.darken(fg)
                    }
                    bg = spansel ? theme.gutter_selected : selected ? theme.gutter_fully_selected : theme.gutter
                    if (selected && !this.cells.screen.t.hasFocus)
                    {
                        bg = color.darken(bg)
                    }
                    this.cells.set(col,row,((y < this.state.s.lines.length) ? c : ' '),fg,bg)
                }
            }
        }
    }

    return gutter
})()

export default gutter;