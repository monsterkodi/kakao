var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import color from "./color.js"

class draw
{
    constructor (cells)
    {
        this.cells = cells
    
        this.state = this.state.bind(this)
    }

    state (state)
    {
        var li, line, linel, row, selection, x, xe, xs, y

        this.s = state.s
        this.syntax = state.syntax
        for (var _a_ = row = 0, _b_ = this.cells.t.rows() - 1; (_a_ <= _b_ ? row < this.cells.t.rows() - 1 : row > this.cells.t.rows() - 1); (_a_ <= _b_ ? ++row : --row))
        {
            y = row + this.s.view[1]
            if (y >= this.s.lines.length)
            {
                break
            }
            line = this.s.lines[y]
            for (var _c_ = x = 0, _d_ = this.cells.cols - this.s.gutter; (_c_ <= _d_ ? x < this.cells.cols - this.s.gutter : x > this.cells.cols - this.s.gutter); (_c_ <= _d_ ? ++x : --x))
            {
                if (x + this.s.gutter < this.cells.cols && x + this.s.view[0] < line.length)
                {
                    this.cells.c[row][x + this.s.gutter].fg = this.syntax.getColor(x + this.s.view[0],y)
                    this.cells.c[row][x + this.s.gutter].char = this.syntax.getChar(x + this.s.view[0],y,line[x + this.s.view[0]])
                }
            }
            if (y < this.s.lines.length)
            {
                linel = line.length - this.s.view[0]
                if (y === this.s.cursor[1])
                {
                    if (linel > 0)
                    {
                        this.cells.bg_rect(this.s.gutter,row,this.s.gutter + linel,row,color.cursor_main)
                    }
                    this.cells.bg_rect(_k_.max(this.s.gutter,this.s.gutter + linel),row,-1,row,color.cursor_empty)
                }
                else
                {
                    if (linel > 0)
                    {
                        this.cells.bg_rect(this.s.gutter,row,this.s.gutter + linel,row,color.editor)
                    }
                    this.cells.bg_rect(_k_.max(this.s.gutter,this.s.gutter + linel),row,-1,row,color.editor_empty)
                }
            }
        }
        var list = _k_.list(this.s.selections)
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            selection = list[_e_]
            for (var _f_ = li = selection[1], _10_ = selection[3]; (_f_ <= _10_ ? li <= selection[3] : li >= selection[3]); (_f_ <= _10_ ? ++li : --li))
            {
                y = li - this.s.view[1]
                if ((this.s.view[1] <= li && li < this.s.view[1] + this.cells.rows - 1))
                {
                    if (li === selection[1])
                    {
                        xs = selection[0]
                    }
                    else
                    {
                        xs = 0
                    }
                    if (li === selection[3])
                    {
                        xe = selection[2]
                    }
                    else
                    {
                        xe = this.s.lines[li].length
                    }
                    for (var _11_ = x = xs, _12_ = xe; (_11_ <= _12_ ? x < xe : x > xe); (_11_ <= _12_ ? ++x : --x))
                    {
                        if ((this.s.gutter <= x - this.s.view[0] + this.s.gutter && x - this.s.view[0] + this.s.gutter < this.cells.cols))
                        {
                            this.cells.c[y][x - this.s.view[0] + this.s.gutter].bg = color.selection
                        }
                    }
                }
            }
        }
    }
}

export default draw;