var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var cells

import color from "./color.js"
import util from "./util.js"


cells = (function ()
{
    function cells (t)
    {
        this.t = t
    
        this["render"] = this["render"].bind(this)
        this["set"] = this["set"].bind(this)
        this["bg_rect"] = this["bg_rect"].bind(this)
        this["init"] = this["init"].bind(this)
        this.init()
    }

    cells.prototype["init"] = function ()
    {
        this.rows = this.t.rows()
        this.cols = this.t.cols()
        return this.c = util.cells(this.rows,this.cols)
    }

    cells.prototype["bg_rect"] = function (x1, y1, x2, y2, c)
    {
        var col, row

        if (x1 < 0)
        {
            x1 = this.cols + x1
        }
        if (x2 < 0)
        {
            x2 = this.cols + x2
        }
        if (y1 < 0)
        {
            y1 = this.rows + y1
        }
        if (y2 < 0)
        {
            y2 = this.rows + y2
        }
        for (var _a_ = row = y1, _b_ = y2; (_a_ <= _b_ ? row <= y2 : row >= y2); (_a_ <= _b_ ? ++row : --row))
        {
            if (row < this.rows)
            {
                for (var _c_ = col = x1, _d_ = x2; (_c_ <= _d_ ? col <= x2 : col >= x2); (_c_ <= _d_ ? ++col : --col))
                {
                    if (col < this.cols)
                    {
                        this.c[row][col].bg = c
                    }
                }
            }
        }
    }

    cells.prototype["set"] = function (x, y, char, fg, bg)
    {
        if (x < this.cols && y < this.rows)
        {
            this.c[y][x].char = char
            if (!_k_.empty(fg))
            {
                this.c[y][x].fg = fg
            }
            if (!_k_.empty(bg))
            {
                return this.c[y][x].bg = bg
            }
        }
    }

    cells.prototype["render"] = function ()
    {
        var bg, fg, pbg, pfg, s, x, y

        this.t.setCursor(0,0)
        s = ''
        pbg = ''
        pfg = ''
        for (var _a_ = y = 0, _b_ = this.rows; (_a_ <= _b_ ? y < this.rows : y > this.rows); (_a_ <= _b_ ? ++y : --y))
        {
            for (var _c_ = x = 0, _d_ = this.cols; (_c_ <= _d_ ? x < this.cols : x > this.cols); (_c_ <= _d_ ? ++x : --x))
            {
                if (!_k_.empty(this.c[y][x].bg))
                {
                    bg = color.bg_rgb(this.c[y][x].bg)
                    if (bg !== pbg)
                    {
                        s += bg
                        pbg = bg
                    }
                }
                if (!_k_.empty(this.c[y][x].fg))
                {
                    fg = color.fg_rgb(this.c[y][x].fg)
                    if (fg !== pfg)
                    {
                        s += fg
                        pfg = fg
                    }
                }
                s += this.c[y][x].char
            }
            s += '\n'
        }
        return this.t.write(s.slice(0, -1))
    }

    return cells
})()

export default cells;