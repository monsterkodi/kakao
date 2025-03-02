var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var draw

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let kstr = kxk.kstr

import color from "../util/color.js"
import theme from "../util/theme.js"
import prof from "../util/prof.js"
import util from "../util/util.js"

import view from "../view/view.js"


draw = (function ()
{
    _k_.extend(draw, view)
    function draw (screen, name, features)
    {
        this["draw"] = this["draw"].bind(this)
        draw.__super__.constructor.call(this,screen,name,features)
    }

    draw.prototype["draw"] = function ()
    {
        var bg, c, ch, checkColor, ci, clss, emptyColor, fg, line, linel, lines, mainCursor, row, s, si, syntax, view, x, y, _38_26_, _39_45_, _66_42_, _69_38_, _78_17_, _82_15_, _83_15_, _84_15_

        if (this.hidden())
        {
            return
        }
        syntax = this.state.syntax
        s = this.state.s
        view = s.view.asMutable()
        lines = this.state.allLines()
        mainCursor = this.state.mainCursor()
        bg = ((_38_26_=theme[this.name]) != null ? _38_26_ : theme.editor)
        emptyColor = ((_39_45_=theme[this.name + '_empty']) != null ? _39_45_ : theme.editor_empty)
        for (var _a_ = row = 0, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
        {
            y = row + view[1]
            if (y >= lines.length)
            {
                break
            }
            line = lines[y]
            linel = kseg.width(line) - view[0]
            x = c = 0
            while (x < this.cells.cols)
            {
                ci = x + view[0]
                si = kseg.segiAtWidth(line,ci)
                if (si >= line.length)
                {
                    break
                }
                clss = syntax.getClass(ci,y)
                if (clss === 'invert_bg')
                {
                    fg = bg
                    bg = theme.editor
                }
                else
                {
                    fg = syntax.getColor(clss)
                }
                ch = syntax.getChar(ci,y,line[si])
                if (ch === "#")
                {
                    checkColor = true
                }
                c += this.cells.add(c,row,ch,fg,bg)
                x += ((_66_42_=kseg.width(line[si])) != null ? _66_42_ : 1)
                if (clss === 'invert_bg')
                {
                    bg = ((_69_38_=theme[this.name]) != null ? _69_38_ : theme.editor)
                }
            }
            this.drawRowBackground(row,linel,emptyColor)
            if (checkColor)
            {
                this.drawColors(line,row,linel,emptyColor)
            }
        }
        this.drawTrailingRows()
        this.drawHighlights()
        this.drawSelections(lines)
        ;(this.complete != null ? this.complete.draw() : undefined)
        this.drawCursors()
        ;(this.scroll != null ? this.scroll.draw() : undefined)
        ;(this.gutter != null ? this.gutter.draw() : undefined)
        ;(this.mapscr != null ? this.mapscr.draw() : undefined)
        return draw.__super__.draw.call(this)
    }

    draw.prototype["drawRowBackground"] = function (row, linel, emptyColor)
    {
        if (row + view[1] === this.state.mainCursor()[1])
        {
            if (linel > 0)
            {
                this.cells.bg_rect(0,row,linel,row,theme[this.name + '_cursor_main'])
            }
            if (linel < this.cells.cols)
            {
                return this.cells.bg_fill(_k_.max(0,linel),row,-1,row,theme[this.name + '_cursor_empty'])
            }
        }
        else
        {
            if (linel > 0)
            {
                this.cells.bg_rect(0,row,linel,row,theme[this.name])
            }
            return this.cells.bg_fill(_k_.max(0,linel),row,-1,row,emptyColor)
        }
    }

    draw.prototype["drawTrailingRows"] = function ()
    {
        var emptyColor, row, vl, _118_45_

        vl = this.state.s.lines.length - this.state.s.view[1]
        if (vl >= this.cells.rows)
        {
            return
        }
        emptyColor = ((_118_45_=theme[this.name + '_empty']) != null ? _118_45_ : theme.editor_empty)
        for (var _a_ = row = vl, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
        {
            this.cells.bg_fill(0,row,-1,row,emptyColor)
        }
    }

    draw.prototype["drawHighlights"] = function ()
    {
        var bg, highlight, ul, vx, vy, x, y, _130_41_, _131_44_

        bg = ((_130_41_=theme[this.name + '_highlight']) != null ? _130_41_ : theme.editor_highlight)
        ul = ((_131_44_=theme[this.name + '_highlight_ul']) != null ? _131_44_ : theme.editor_highlight_ul)
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        var _a_ = this.state.s.view; vx = _a_[0]; vy = _a_[1]

        var list = _k_.list(this.state.s.highlights)
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            highlight = list[_b_]
            y = highlight[1] - vy
            if (y >= this.cells.rows)
            {
                break
            }
            for (var _c_ = x = highlight[0], _d_ = highlight[2]; (_c_ <= _d_ ? x < highlight[2] : x > highlight[2]); (_c_ <= _d_ ? ++x : --x))
            {
                this.cells.set_bg(x - vx,y,bg)
                this.cells.set_char(x - vx,y,color.ul_rgb(ul) + '\x1b[4:1m' + this.cells.get_char(x - vx,y) + '\x1b[4:0m')
            }
        }
    }

    draw.prototype["drawSelections"] = function (lines)
    {
        var bg, li, linebg, selection, spanbg, x, xe, xs, y, _157_50_, _158_50_

        spanbg = ((_157_50_=theme[this.name + '_selection']) != null ? _157_50_ : theme.editor_selection)
        linebg = ((_158_50_=theme[this.name + '_selection_line']) != null ? _158_50_ : theme.editor_selection_line)
        if (!this.cells.screen.t.hasFocus)
        {
            spanbg = color.darken(spanbg)
            linebg = color.darken(linebg)
        }
        var list = _k_.list(this.state.s.selections)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            selection = list[_a_]
            bg = (util.isSpanLineRange(lines,selection) ? spanbg : linebg)
            for (var _b_ = li = selection[1], _c_ = selection[3]; (_b_ <= _c_ ? li <= selection[3] : li >= selection[3]); (_b_ <= _c_ ? ++li : --li))
            {
                y = li - this.state.s.view[1]
                if (y >= this.cells.rows)
                {
                    break
                }
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
                    xe = kseg.width(lines[li])
                }
                for (var _d_ = x = xs, _e_ = xe; (_d_ <= _e_ ? x < xe : x > xe); (_d_ <= _e_ ? ++x : --x))
                {
                    this.cells.set_bg(x - this.state.s.view[0],y,bg)
                }
            }
        }
    }

    draw.prototype["drawCursors"] = function ()
    {
        var bg, cursor, fcb, fg, mainCursor, s, x, y, _200_44_, _201_44_, _214_46_, _216_37_

        s = this.state.s
        mainCursor = this.state.mainCursor()
        fg = ((_200_44_=theme[this.name + '_cursor_fg']) != null ? _200_44_ : theme.editor_cursor_fg)
        bg = ((_201_44_=theme[this.name + '_cursor_multi']) != null ? _201_44_ : theme.editor_cursor_multi)
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        var list = _k_.list(s.cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cursor = list[_a_]
            if (_k_.eql(cursor, mainCursor))
            {
                continue
            }
            if (this.isCursorVisible(cursor))
            {
                this.cells.set_fg_bg(cursor[0] - s.view[0],cursor[1] - s.view[1],fg,bg)
            }
        }
        if (this.isCursorVisible(mainCursor))
        {
            fg = ((_214_46_=theme[this.name + '_cursor_fg']) != null ? _214_46_ : theme.editor_cursor_fg)
            fcb = (this.hasFocus() ? '_cursor_bg' : '_cursor_blur')
            bg = ((_216_37_=theme[this.name + fcb]) != null ? _216_37_ : theme['editor' + fcb])
            var _b_ = [mainCursor[0] - s.view[0],mainCursor[1] - s.view[1]]; x = _b_[0]; y = _b_[1]

            if (s.cursors.length <= 1)
            {
                if (this.isCursorInEmpty())
                {
                    bg = color.darken(bg,0.5)
                }
                else if (' ' === this.cells.get_char(x,y))
                {
                    bg = color.darken(bg,0.8)
                }
            }
            if (!this.cells.screen.t.hasFocus)
            {
                bg = color.darken(bg)
            }
            return this.cells.set_fg_bg(x,y,fg,bg)
        }
    }

    draw.prototype["drawColors"] = function (line, row, linel, emptyColor)
    {
        var clr, cx, dta, idx, rng, rngs

        if (rngs = kstr.colorRanges(kseg.str(line)))
        {
            cx = _k_.max(0,linel) + 1
            var list = _k_.list(rngs)
            for (idx = 0; idx < list.length; idx++)
            {
                rng = list[idx]
                clr = color.rgb(rng.color)
                dta = 4
                if (idx === 0)
                {
                    this.cells.set(cx,row,'',clr,emptyColor)
                    cx += 1
                    dta--
                }
                if (idx === rngs.length - 1)
                {
                    dta--
                }
                this.cells.bg_rect(cx,row,cx + dta,row,rng.match)
                cx += dta
                if (idx === rngs.length - 1)
                {
                    this.cells.set(cx,row,'',clr,emptyColor)
                }
            }
        }
    }

    return draw
})()

export default draw;