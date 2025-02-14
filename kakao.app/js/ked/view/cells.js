var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var cells

import theme from "../theme.js"

import util from "../util/util.js"
import color from "../util/color.js"


cells = (function ()
{
    function cells (screen)
    {
        this.screen = screen
    
        this["draw_frame"] = this["draw_frame"].bind(this)
        this["fill_rect"] = this["fill_rect"].bind(this)
        this["bg_rect"] = this["bg_rect"].bind(this)
        this["posForEvent"] = this["posForEvent"].bind(this)
        this["screenForPos"] = this["screenForPos"].bind(this)
        this["posForScreen"] = this["posForScreen"].bind(this)
        this["isOutsideEvent"] = this["isOutsideEvent"].bind(this)
        this["isInsideEvent"] = this["isInsideEvent"].bind(this)
        this["isOutsideScreen"] = this["isOutsideScreen"].bind(this)
        this["isInsideScreen"] = this["isInsideScreen"].bind(this)
        this["isOutsidePos"] = this["isOutsidePos"].bind(this)
        this["isInsidePos"] = this["isInsidePos"].bind(this)
        this["get_char"] = this["get_char"].bind(this)
        this["set_fg"] = this["set_fg"].bind(this)
        this["set_bg"] = this["set_bg"].bind(this)
        this["set_char"] = this["set_char"].bind(this)
        this["set"] = this["set"].bind(this)
        this["init"] = this["init"].bind(this)
        this.init(0,0,0,0)
    }

    cells.prototype["init"] = function (x, y, cols, rows)
    {
        this.x = x
        this.y = y
        this.cols = cols
        this.rows = rows
    }

    cells.prototype["wx"] = function (x)
    {
        return (x < 0 ? this.x + this.cols + x : this.x + x)
    }

    cells.prototype["wy"] = function (y)
    {
        return (y < 0 ? this.y + this.rows + y : this.y + y)
    }

    cells.prototype["set"] = function (x, y, char, fg, bg)
    {
        return this.screen.set(this.wx(x),this.wy(y),char,fg,bg)
    }

    cells.prototype["set_char"] = function (x, y, char)
    {
        return this.screen.set_char(this.wx(x),this.wy(y),char)
    }

    cells.prototype["set_bg"] = function (x, y, bg)
    {
        return this.screen.set_bg(this.wx(x),this.wy(y),bg)
    }

    cells.prototype["set_fg"] = function (x, y, fg)
    {
        return this.screen.set_fg(this.wx(x),this.wy(y),fg)
    }

    cells.prototype["get_char"] = function (x, y)
    {
        return this.screen.get_char(this.wx(x),this.wy(y))
    }

    cells.prototype["isInsidePos"] = function (x, y)
    {
        var _a_ = util.pos(x,y); x = _a_[0]; y = _a_[1]

        return ((0 <= x && x < this.cols)) && ((0 <= y && y < this.rows))
    }

    cells.prototype["isOutsidePos"] = function (x, y)
    {
        var _a_ = util.pos(x,y); x = _a_[0]; y = _a_[1]

        return x < 0 || x >= this.cols || y < 0 || y >= this.rows
    }

    cells.prototype["isInsideScreen"] = function (x, y)
    {
        return this.isInsidePos(this.posForScreen(x,y))
    }

    cells.prototype["isOutsideScreen"] = function (x, y)
    {
        return this.isOutsidePos(this.posForScreen(x,y))
    }

    cells.prototype["isInsideEvent"] = function (evt)
    {
        return this.isInsidePos(this.posForEvent(evt))
    }

    cells.prototype["isOutsideEvent"] = function (evt)
    {
        return this.isOutsidePos(this.posForEvent(evt))
    }

    cells.prototype["posForScreen"] = function (x, y)
    {
        var _a_ = util.pos(x,y); x = _a_[0]; y = _a_[1]

        return [x - this.x,y - this.y]
    }

    cells.prototype["screenForPos"] = function (x, y)
    {
        var _a_ = util.pos(x,y); x = _a_[0]; y = _a_[1]

        return [x + this.x,y + this.y]
    }

    cells.prototype["posForEvent"] = function (evt)
    {
        return this.posForScreen(evt.cell)
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

    cells.prototype["fill_rect"] = function (x1, y1, x2, y2, char, fg, bg)
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
                        this.set(col,row,char,fg,bg)
                    }
                }
            }
        }
    }

    cells.prototype["draw_frame"] = function (x1, y1, x2, y2, opt)
    {
        var bg, fg, x, y, _102_16_, _110_20_, _111_20_

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
        opt = (opt != null ? opt : {})
        opt.pad = ((_102_16_=opt.pad) != null ? _102_16_ : [1,0])
        fg = ((_110_20_=opt.fg) != null ? _110_20_ : '#888888')
        bg = ((_111_20_=opt.bg) != null ? _111_20_ : null)
        this.set(x1,y1,'╭',fg,bg)
        this.set(x2,y1,'╮',fg,bg)
        this.set(x1,y2,'╰',fg,bg)
        this.set(x2,y2,'╯',fg,bg)
        this.fill_rect(x1 + 1,y1,x2 - 1,y1,'─',fg,bg)
        this.fill_rect(x1 + 1,y2,x2 - 1,y2,'─',fg,bg)
        this.fill_rect(x1,y1 + 1,x1,y2 - 1,'│',fg,bg)
        this.fill_rect(x2,y1 + 1,x2,y2 - 1,'│',fg,bg)
        for (var _a_ = x = 0, _b_ = opt.pad[0]; (_a_ <= _b_ ? x < opt.pad[0] : x > opt.pad[0]); (_a_ <= _b_ ? ++x : --x))
        {
            this.fill_rect(x1 + 1 + x,y1 + 1,x1 + 1 + x,y2 - 1,' ',fg,bg)
        }
        var list = _k_.list(opt.hdiv)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            y = list[_c_]
            this.set(x1,y,'├',fg,bg)
            this.set(x2,y,'┤',fg,bg)
            this.fill_rect(x1 + 1,y,x2 - 1,y,'─',fg,bg)
        }
    }

    cells.prototype["draw_path"] = function (x, y, pth, bg)
    {
        var ci, fg, lastDot, lastSlash

        lastSlash = pth.lastIndexOf('/')
        lastDot = pth.lastIndexOf('.')
        for (var _a_ = ci = 0, _b_ = pth.length; (_a_ <= _b_ ? ci < pth.length : ci > pth.length); (_a_ <= _b_ ? ++ci : --ci))
        {
            fg = (ci > lastSlash ? 'file' : 'dir')
            fg = theme[fg]
            if ((lastSlash <= lastDot && lastDot <= ci))
            {
                fg = color.darken(fg)
            }
            if (_k_.in(pth[ci],'./'))
            {
                fg = color.darken(fg)
            }
            this.set(x,y,pth[ci],fg,bg)
            x += 1
        }
        return pth.length
    }

    return cells
})()

export default cells;