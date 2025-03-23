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
        this["draw"] = this["draw"].bind(this)
        draw.__super__.constructor.call(this,screen,name,features)
        this.setColor('bg',theme.editor.bg)
        this.setColor('empty',theme.editor.empty)
        this.setColor('cursor',theme.cursor)
        this.setColor('selection',theme.selection)
        this.setColor('highlight',theme.highlight)
    }

    draw.prototype["draw"] = function ()
    {
        var bg, c, ch, checkColor, ci, clss, fg, firstIndex, firstSegi, headerClass, line, linel, lines, row, si, syntax, view, x, y, _103_17_, _105_17_, _107_15_, _108_15_, _109_15_, _45_58_, _87_45_

        if (this.hidden())
        {
            return
        }
        syntax = this.state.syntax
        view = this.state.s.view
        lines = this.state.s.lines
        if ((this.complete != null))
        {
            lines = this.complete.preDrawLines(lines)
        }
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
                fg = syntax.getColor(ci,y)
                ch = syntax.getChar(ci,y,line[si])
                if (ch === "#")
                {
                    checkColor = true
                }
                else if (_k_.in(ch,'0█'))
                {
                    clss = syntax.getClass(ci,y)
                    if (clss.endsWith('header'))
                    {
                        headerClass = clss
                    }
                }
                x += ((_87_45_=kseg.segWidth(line[si])) != null ? _87_45_ : 1)
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
        ;(this.complete != null ? this.complete.drawCompletion() : undefined)
        this.drawCursors()
        ;(this.complete != null ? this.complete.drawPopup() : undefined)
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
                this.cells.bg_rect(0,row,linel,row,this.color.cursor.main)
            }
            if (linel < this.cells.cols)
            {
                return this.cells.bg_fill(_k_.max(0,linel),row,-1,row,this.color.cursor.empty)
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
        var bg, bgc, highlight, hlc, ul, ulc, vx, vy, x, y

        bg = this.color.highlight.bg
        ul = this.color.highlight.ul
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
                hlc = this.cells.get_char(x - vx,y)
                switch (hlc)
                {
                    case '{':
                    case '[':
                    case '(':
                    case ')':
                    case ']':
                    case '}':
                        ulc = this.color.highlight.bracket_ul
                        bgc = this.color.highlight.bracket
                        break
                    case "'":
                    case '"':
                        ulc = this.color.highlight.string_ul
                        bgc = this.color.highlight.string
                        break
                    default:
                        ulc = ul
                        bgc = bg
                }

                this.cells.set_bg(x - vx,y,bgc)
                this.cells.set_char(x - vx,y,color.ul_rgb(ulc) + '\x1b[4:1m' + hlc + '\x1b[4:0m')
                this.cells.adjustContrastForHighlight(x - vx,y,bgc)
            }
        }
    }

    draw.prototype["drawSelections"] = function ()
    {
        var bg, li, linebg, selection, spanbg, x, xe, xs, y

        spanbg = this.color.selection.span
        linebg = this.color.selection.line
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
                    this.cells.adjustContrastForHighlight(x,y,bg)
                }
            }
        }
    }

    draw.prototype["drawCursors"] = function ()
    {
        var bg, cursor, fg, mainCursor, s, x, y

        s = this.state.s
        mainCursor = this.state.mainCursor()
        fg = theme.cursor.fg
        bg = mode.themeColor(this.state,'cursor.multi',theme.cursor.multi)
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
            fg = theme.cursor.fg
            bg = mode.themeColor(this.state,'cursor.main',theme.cursor.main)
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
        var cx, dta, idx, rng, rngs

        if (rngs = kstr.colorRanges(kseg.str(line)))
        {
            cx = _k_.max(0,linel) + 1
            var list = _k_.list(rngs)
            for (idx = 0; idx < list.length; idx++)
            {
                rng = list[idx]
                dta = 4
                if (idx === 0)
                {
                    this.cells.set(cx,row,'',rng.color,this.color.empty)
                    cx += 1
                    dta--
                }
                if (idx === rngs.length - 1)
                {
                    dta--
                }
                this.cells.bg_rect(cx,row,cx + dta,row,rng.color)
                cx += dta
                if (idx === rngs.length - 1)
                {
                    this.cells.set(cx,row,'',rng.color,this.color.empty)
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