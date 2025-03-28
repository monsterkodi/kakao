var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var cells

import belt from "../../edit/tool/belt.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import rounded from "../../util/rounded.js"


cells = (function ()
{
    function cells (screen)
    {
        this.screen = screen
    
        this["adjustContrastForHighlight"] = this["adjustContrastForHighlight"].bind(this)
        this["img"] = this["img"].bind(this)
        this["draw_rounded_multi_cursor"] = this["draw_rounded_multi_cursor"].bind(this)
        this["draw_rounded_cursor"] = this["draw_rounded_cursor"].bind(this)
        this["draw_rounded_border"] = this["draw_rounded_border"].bind(this)
        this["draw_frame"] = this["draw_frame"].bind(this)
        this["fill_col"] = this["fill_col"].bind(this)
        this["fill_row"] = this["fill_row"].bind(this)
        this["fill_rect"] = this["fill_rect"].bind(this)
        this["bg_fill"] = this["bg_fill"].bind(this)
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
        this["get_fg"] = this["get_fg"].bind(this)
        this["get_bg"] = this["get_bg"].bind(this)
        this["get_char"] = this["get_char"].bind(this)
        this["set_fg_bg"] = this["set_fg_bg"].bind(this)
        this["set_fg"] = this["set_fg"].bind(this)
        this["set_bg"] = this["set_bg"].bind(this)
        this["set_ch_fg"] = this["set_ch_fg"].bind(this)
        this["set_char"] = this["set_char"].bind(this)
        this["set_unsafe"] = this["set_unsafe"].bind(this)
        this["set"] = this["set"].bind(this)
        this["add"] = this["add"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this.x = this.y = this.cols = this.rows = 0
    }

    cells.prototype["rect"] = function ()
    {
        return [this.x,this.y,this.x + this.cols - 1,this.y + this.rows - 1]
    }

    cells.prototype["layout"] = function (x, y, cols, rows)
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

    cells.prototype["inside"] = function (x, y)
    {
        return (0 <= x && x < this.cols) && (0 <= y && y < this.rows)
    }

    cells.prototype["outside"] = function (x, y)
    {
        return !this.inside(x,y)
    }

    cells.prototype["add"] = function (x, y, char, fg, bg)
    {
        if (this.inside(x,y))
        {
            return this.screen.add(this.wx(x),this.wy(y),char,fg,bg)
        }
        else
        {
            return Infinity
        }
    }

    cells.prototype["set"] = function (x, y, char, fg, bg)
    {
        if (this.inside(x,y))
        {
            return this.screen.set(this.wx(x),this.wy(y),char,fg,bg)
        }
    }

    cells.prototype["set_unsafe"] = function (x, y, char, fg, bg)
    {
        return this.screen.set(this.x + x,this.y + y,char,fg,bg)
    }

    cells.prototype["set_char"] = function (x, y, char)
    {
        if (this.inside(x,y))
        {
            return this.screen.set_char(this.wx(x),this.wy(y),char)
        }
    }

    cells.prototype["set_ch_fg"] = function (x, y, char, fg)
    {
        if (this.inside(x,y))
        {
            return this.screen.set_ch_fg(this.wx(x),this.wy(y),char,fg)
        }
    }

    cells.prototype["set_bg"] = function (x, y, bg)
    {
        if (this.inside(x,y))
        {
            return this.screen.set_bg(this.wx(x),this.wy(y),bg)
        }
    }

    cells.prototype["set_fg"] = function (x, y, fg)
    {
        if (this.inside(x,y))
        {
            return this.screen.set_fg(this.wx(x),this.wy(y),fg)
        }
    }

    cells.prototype["set_fg_bg"] = function (x, y, fg, bg)
    {
        if (this.inside(x,y))
        {
            return this.screen.set_fg_bg(this.wx(x),this.wy(y),fg,bg)
        }
    }

    cells.prototype["get_char"] = function (x, y)
    {
        return this.screen.get_char(this.wx(x),this.wy(y))
    }

    cells.prototype["get_bg"] = function (x, y)
    {
        return this.screen.get_bg(this.wx(x),this.wy(y))
    }

    cells.prototype["get_fg"] = function (x, y)
    {
        return this.screen.get_fg(this.wx(x),this.wy(y))
    }

    cells.prototype["isInsidePos"] = function (x, y)
    {
        var _a_ = belt.pos(x,y); x = _a_[0]; y = _a_[1]

        return ((0 <= x && x < this.cols)) && ((0 <= y && y < this.rows))
    }

    cells.prototype["isOutsidePos"] = function (x, y)
    {
        var _a_ = belt.pos(x,y); x = _a_[0]; y = _a_[1]

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
        var _a_ = belt.pos(x,y); x = _a_[0]; y = _a_[1]

        return [x - this.x,y - this.y]
    }

    cells.prototype["screenForPos"] = function (x, y)
    {
        var _a_ = belt.pos(x,y); x = _a_[0]; y = _a_[1]

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

    cells.prototype["bg_fill"] = function (x1, y1, x2, y2, bg)
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
        if (x1 > x2)
        {
            return
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
                        this.set_char(col,row,' ')
                    }
                }
            }
        }
    }

    cells.prototype["fill_rect"] = function (x1, y1, x2, y2, char, fg, bg)
    {
        var col, row

        x1 = _k_.clamp(0,this.cols - 1,x1)
        y1 = _k_.clamp(0,this.rows - 1,y1)
        if (x2 < 0)
        {
            x2 = this.cols + x2
        }
        if (y2 < 0)
        {
            y2 = this.rows + y2
        }
        for (var _a_ = row = y1, _b_ = y2; (_a_ <= _b_ ? row <= y2 : row >= y2); (_a_ <= _b_ ? ++row : --row))
        {
            for (var _c_ = col = x1, _d_ = x2; (_c_ <= _d_ ? col <= x2 : col >= x2); (_c_ <= _d_ ? ++col : --col))
            {
                this.set(col,row,char,fg,bg)
            }
        }
    }

    cells.prototype["fill_row"] = function (row, x1, x2, char, fg, bg)
    {
        var col

        if (x1 < 0 && x2 < 0)
        {
            return
        }
        x1 = _k_.clamp(0,this.cols - 1,x1)
        x2 = _k_.clamp(0,this.cols - 1,x2)
        if (x2 < x1)
        {
            return
        }
        for (var _a_ = col = x1, _b_ = x2; (_a_ <= _b_ ? col <= x2 : col >= x2); (_a_ <= _b_ ? ++col : --col))
        {
            this.set(col,row,char,fg,bg)
        }
    }

    cells.prototype["fill_col"] = function (col, y1, y2, char, fg, bg)
    {
        var row

        if (y1 < 0 && y2 < 0)
        {
            return
        }
        y1 = _k_.clamp(0,this.rows - 1,y1)
        y2 = _k_.clamp(0,this.rows - 1,y2)
        if (y2 < y1)
        {
            return
        }
        for (var _a_ = row = y1, _b_ = y2; (_a_ <= _b_ ? row <= y2 : row >= y2); (_a_ <= _b_ ? ++row : --row))
        {
            this.set(col,row,char,fg,bg)
        }
    }

    cells.prototype["draw_frame"] = function (x1, y1, x2, y2, opt)
    {
        var bg, fg, x, y, _168_16_, _176_20_, _177_20_

        if (x1 < 0 && x2 < 0)
        {
            return
        }
        if (y1 < 0 && y2 < 0)
        {
            return
        }
        if (x2 < 0)
        {
            x2 = this.cols + x2
        }
        if (y2 < 0)
        {
            y2 = this.rows + y2
        }
        opt = (opt != null ? opt : {})
        opt.pad = ((_168_16_=opt.pad) != null ? _168_16_ : [1,0])
        fg = ((_176_20_=opt.fg) != null ? _176_20_ : '#888')
        bg = ((_177_20_=opt.bg) != null ? _177_20_ : null)
        this.set(x1,y1,'╭',fg,bg)
        this.set(x2,y1,'╮',fg,bg)
        this.set(x1,y2,'╰',fg,bg)
        this.set(x2,y2,'╯',fg,bg)
        this.fill_row(y1,x1 + 1,x2 - 1,'─',fg,bg)
        this.fill_row(y2,x1 + 1,x2 - 1,'─',fg,bg)
        this.fill_col(x1,y1 + 1,y2 - 1,'│',fg,bg)
        this.fill_col(x2,y1 + 1,y2 - 1,'│',fg,bg)
        for (var _a_ = x = 0, _b_ = opt.pad[0]; (_a_ <= _b_ ? x < opt.pad[0] : x > opt.pad[0]); (_a_ <= _b_ ? ++x : --x))
        {
            this.fill_col(x1 + 1 + x,y1 + 1,y2 - 1,' ',fg,bg)
            this.fill_col(x2 - 1 - x,y1 + 1,y2 - 1,' ',fg,bg)
        }
        var list = _k_.list(opt.hdiv)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            y = list[_c_]
            this.set(x1,y,'',fg,bg)
            this.set(x2,y,'',fg,bg)
            this.fill_row(y,x1 + 1,x2 - 1,'─',fg,bg)
        }
    }

    cells.prototype["draw_rounded_border"] = function (x1, y1, x2, y2, opt)
    {
        var fg, _215_20_

        if (x1 < 0 && x2 < 0)
        {
            return
        }
        if (y1 < 0 && y2 < 0)
        {
            return
        }
        if (x2 < 0)
        {
            x2 = this.cols + x2
        }
        if (y2 < 0)
        {
            y2 = this.rows + y2
        }
        opt = (opt != null ? opt : {})
        fg = ((_215_20_=opt.fg) != null ? _215_20_ : '#888')
        this.img(x1,y1,'rounded.border.tl',fg)
        this.img(x2,y1,'rounded.border.tr',fg)
        this.img(x1,y2,'rounded.border.bl',fg)
        this.img(x2,y2,'rounded.border.br',fg)
        this.img(x1 + 1,y1,'rounded.border.t',fg,x2 - 1)
        this.img(x1,y1 + 1,'rounded.border.l',fg,x1,y2 - 1)
        if (x1 + 1 < x2)
        {
            this.img(x1 + 1,y2,'rounded.border.lb',fg)
        }
        if (x1 + 2 < x2)
        {
            this.img(x1 + 2,y2,'rounded.border.b',fg,x2 - 1)
        }
        if (y1 + 1 < y2)
        {
            this.img(x2,y1 + 1,'rounded.border.rt',fg,x2)
        }
        if (y1 + 2 < y2)
        {
            return this.img(x2,y1 + 2,'rounded.border.r',fg,x2,y2 - 1)
        }
    }

    cells.prototype["draw_rounded_cursor"] = function (x, y, fg)
    {
        return this.img(x,y,"rounded.cursor",fg)
    }

    cells.prototype["draw_rounded_multi_cursor"] = function (x, y, fg)
    {
        return this.img(x,y,"rounded.multi",fg)
    }

    cells.prototype["img"] = function (x, y, name, fg, xe, ye)
    {
        if (this.outside(x,y))
        {
            return
        }
        return rounded.place(this.wx(x),this.wy(y),name,fg,this.wx(xe),this.wy(ye))
    }

    cells.prototype["adjustContrastForHighlight"] = function (x, y, highlightColor)
    {
        var ofg

        ofg = this.get_fg(x,y)
        return this.set_fg(x,y,color.adjustForBackground(ofg,highlightColor))
    }

    return cells
})()

export default cells;