var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var draw

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let kstr = kxk.kstr

import prof from "../util/prof.js"

import color from "../theme/color.js"
import theme from "../theme/theme.js"

import view from "../view/base/view.js"

import belt from "./tool/belt.js"

import mode from "./mode.js"


draw = (function ()
{
    _k_.extend(draw, view)
    function draw (screen, name, features)
    {
        var _22_54_, _23_54_

        this["draw"] = this["draw"].bind(this)
        draw.__super__.constructor.call(this,screen,name,features)
        this.color.bg = ((_22_54_=theme[this.name]) != null ? _22_54_ : theme.editor)
        this.color.empty = ((_23_54_=theme[this.name + '_empty']) != null ? _23_54_ : theme.editor_empty)
        this.color.cursor_main = theme[this.name + '_cursor_main']
        this.color.cursor_empty = theme[this.name + '_cursor_empty']
    }

    draw.prototype["draw"] = function ()
    {
        var bg, c, ch, checkColor, ci, clss, fg, firstIndex, firstSegi, headerClass, line, linel, lines, row, si, syntax, view, x, y, _101_17_, _105_15_, _106_15_, _107_15_, _86_42_

        if (this.hidden())
        {
            return
        }
        syntax = this.state.syntax
        view = this.state.s.view
        lines = this.state.s.lines
        bg = this.color.bg
        for (var _a_ = row = 0, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
        {
            checkColor = false
            headerClass = null
            y = row + view[1]
            if (y >= lines.length)
            {
                break
            }
            line = lines[y]
            linel = kseg.width(line) - view[0]
            c = 0
            firstIndex = kseg.indexAtWidth(line,view[0])
            firstSegi = kseg.segiAtWidth(line,view[0])
            if (firstIndex !== firstSegi)
            {
                c = 1
            }
            x = 0
            while (x < this.cells.cols)
            {
                ci = x + view[0]
                si = kseg.indexAtWidth(line,ci)
                if (si >= line.length)
                {
                    break
                }
                clss = syntax.getClass(ci,y)
                if (clss === 'invert_bg')
                {
                    fg = bg
                    bg = this.color.bg
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
                else if (_k_.in(ch,'0█') && clss.endsWith('header'))
                {
                    headerClass = clss
                }
                x += ((_86_42_=kseg.width(line[si])) != null ? _86_42_ : 1)
                if (x < this.cells.cols)
                {
                    c += this.cells.add(c,row,ch,fg,bg)
                }
                if (clss === 'invert_bg')
                {
                    bg = this.color.bg
                }
            }
            this.drawRowBackground(row,linel)
            if (checkColor)
            {
                this.drawColorPills(line,row,linel)
            }
            if (headerClass)
            {
                this.drawAsciiHeader(line,row,headerClass)
            }
        }
        this.drawTrailingRows()
        this.drawHighlights()
        this.drawSelections()
        ;(this.complete != null ? this.complete.draw() : undefined)
        this.drawCursors()
        ;(this.gutter != null ? this.gutter.draw() : undefined)
        ;(this.mapscr != null ? this.mapscr.draw() : undefined)
        ;(this.scroll != null ? this.scroll.draw() : undefined)
        mode.postDraw(this.state)
        return draw.__super__.draw.call(this)
    }

    draw.prototype["drawRowBackground"] = function (row, linel)
    {
        if (row + view[1] === this.state.mainCursor()[1])
        {
            if (linel > 0)
            {
                this.cells.bg_rect(0,row,linel,row,this.color.cursor_main)
            }
            if (linel < this.cells.cols)
            {
                return this.cells.bg_fill(_k_.max(0,linel),row,-1,row,this.color.cursor_empty)
            }
        }
        else
        {
            if (linel > 0)
            {
                this.cells.bg_rect(0,row,linel,row,this.color.bg)
            }
            return this.cells.bg_fill(_k_.max(0,linel),row,-1,row,this.color.empty)
        }
    }

    draw.prototype["drawTrailingRows"] = function ()
    {
        var row, vl

        vl = this.state.s.lines.length - this.state.s.view[1]
        if (vl >= this.cells.rows)
        {
            return
        }
        for (var _a_ = row = vl, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
        {
            this.cells.bg_fill(0,row,-1,row,this.color.empty)
        }
    }

    draw.prototype["drawHighlights"] = function ()
    {
        var bg, highlight, ul, vx, vy, x, y, _155_41_, _156_44_

        bg = ((_155_41_=theme[this.name + '_highlight']) != null ? _155_41_ : theme.editor_highlight)
        ul = ((_156_44_=theme[this.name + '_highlight_ul']) != null ? _156_44_ : theme.editor_highlight_ul)
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

    draw.prototype["drawSelections"] = function ()
    {
        var bg, li, linebg, selection, spanbg, x, xe, xs, y, _182_50_, _183_50_

        spanbg = ((_182_50_=theme[this.name + '_selection']) != null ? _182_50_ : theme.editor_selection)
        linebg = ((_183_50_=theme[this.name + '_selection_line']) != null ? _183_50_ : theme.editor_selection_line)
        if (!this.cells.screen.t.hasFocus)
        {
            spanbg = color.darken(spanbg)
            linebg = color.darken(linebg)
        }
        var list = _k_.list(this.state.s.selections)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            selection = list[_a_]
            bg = (belt.isSpanLineRange(this.state.s.lines,selection) ? spanbg : linebg)
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
                    xe = kseg.width(this.state.s.lines[li])
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
        var bg, cursor, fg, mainCursor, s, x, y, _225_41_, _241_46_

        s = this.state.s
        mainCursor = this.state.mainCursor()
        fg = ((_225_41_=theme[this.name + '_cursor_fg']) != null ? _225_41_ : theme.editor_cursor_fg)
        bg = mode.themeColor(this.state,'editor_cursor_multi')
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
            fg = ((_241_46_=theme[this.name + '_cursor_fg']) != null ? _241_46_ : theme.editor_cursor_fg)
            bg = mode.themeColor(this.state,'editor_cursor_main')
            if (!this.hasFocus())
            {
                bg = color.darken(bg)
            }
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

    draw.prototype["drawColorPills"] = function (line, row, linel)
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
                    this.cells.set(cx,row,'',clr,this.color.empty)
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
                    this.cells.set(cx,row,'',clr,this.color.empty)
                }
            }
        }
    }

    draw.prototype["drawAsciiHeader"] = function (line, row, clss)
    {
        var bg, ch, chunk, chunks, fg, x

        chunks = kseg.chunks(line)
        var list = _k_.list(chunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            chunk = list[_a_]
            if (!(_k_.in(chunk.segl[0],'0█')))
            {
                continue
            }
            x = chunk.index - this.state.s.view[0]
            ch = '▎'
            fg = theme.syntax[clss + ' highlight']
            bg = theme.syntax[clss]
            this.cells.set(x,row,ch,fg,bg)
            if (chunk.segl.length <= 1)
            {
                continue
            }
            x += chunk.segl.length - 1
            ch = '▋'
            fg = theme.syntax[clss]
            bg = theme.syntax[clss + ' shadow']
            this.cells.set(x,row,ch,fg,bg)
        }
    }

    return draw
})()

export default draw;