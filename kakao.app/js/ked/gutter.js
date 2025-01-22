var _k_ = {lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var gutter

import color from "./color.js"


gutter = (function ()
{
    function gutter (cells, state)
    {
        this.cells = cells
        this.state = state
    
        this.draw()
    }

    gutter.prototype["draw"] = function ()
    {
        var c, clr, col, i, linel, lineno, row, y

        this.cells.bg_rect(0,0,this.state.s.gutter - 1,-1,color.gutter)
        for (var _a_ = row = 0, _b_ = this.cells.t.rows(); (_a_ <= _b_ ? row < this.cells.t.rows() : row > this.cells.t.rows()); (_a_ <= _b_ ? ++row : --row))
        {
            y = this.state.s.view[1] + row
            lineno = _k_.lpad(this.state.s.gutter - 2,y + 1)
            var list = _k_.list(lineno)
            for (i = 0; i < list.length; i++)
            {
                c = list[i]
                col = i + 1
                if (col < this.cells.t.cols())
                {
                    if (y < this.state.s.lines.length)
                    {
                        linel = this.state.s.lines[y].length - this.state.s.view[0]
                        if (y === this.state.s.cursor[1])
                        {
                            if (linel > 0)
                            {
                                this.cells.bg_rect(this.state.s.gutter,row,this.state.s.gutter + linel,row,color.cursor_main)
                            }
                            this.cells.bg_rect(_k_.max(this.state.s.gutter,this.state.s.gutter + linel),row,-1,row,color.cursor_empty)
                        }
                        else
                        {
                            if (linel > 0)
                            {
                                this.cells.bg_rect(this.state.s.gutter,row,this.state.s.gutter + linel,row,color.editor)
                            }
                            this.cells.bg_rect(_k_.max(this.state.s.gutter,this.state.s.gutter + linel),row,-1,row,color.editor_empty)
                        }
                    }
                    clr = y === this.state.s.cursor[1] ? color.cursor : this.state.isSelectedLine(y) ? color.selection : color.linenr
                    this.cells.c[row][col].fg = clr
                    this.cells.c[row][col].char = c
                }
            }
        }
    }

    return gutter
})()

export default gutter;