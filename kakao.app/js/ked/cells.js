var cells


cells = (function ()
{
    function cells (screen)
    {
        this.screen = screen
    
        this["bg_rect"] = this["bg_rect"].bind(this)
        this["screenForPos"] = this["screenForPos"].bind(this)
        this["posForScreen"] = this["posForScreen"].bind(this)
        this["isOutsideScreen"] = this["isOutsideScreen"].bind(this)
        this["isInsideScreen"] = this["isInsideScreen"].bind(this)
        this["set_bg"] = this["set_bg"].bind(this)
        this["set"] = this["set"].bind(this)
        this["init"] = this["init"].bind(this)
    }

    cells.prototype["init"] = function (x, y, cols, rows)
    {
        this.x = x
        this.y = y
        this.cols = cols
        this.rows = rows
    }

    cells.prototype["set"] = function (x, y, char, fg, bg)
    {
        return this.screen.set(this.x + x,this.y + y,char,fg,bg)
    }

    cells.prototype["set_bg"] = function (x, y, bg)
    {
        return this.screen.set_bg(this.x + x,this.y + y,bg)
    }

    cells.prototype["isInsideScreen"] = function (x, y)
    {
        return (this.x <= x && x < this.x + this.cols) && (this.y <= y && y < this.y + this.rows)
    }

    cells.prototype["isOutsideScreen"] = function (x, y)
    {
        return !this.isInsideScreen(x,y)
    }

    cells.prototype["posForScreen"] = function (x, y)
    {
        return [x - this.x,y - this.y]
    }

    cells.prototype["screenForPos"] = function (x, y)
    {
        return [x + this.x,y + this.y]
    }

    cells.prototype["bg_rect"] = function (x1, y1, x2, y2, bg)
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
                        this.set_bg(col,row,bg)
                    }
                }
            }
        }
    }

    return cells
})()

export default cells;