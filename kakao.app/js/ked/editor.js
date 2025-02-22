var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var editor

import events from "../kxk/events.js"
import matchr from "../kxk/matchr.js"
import kstr from "../kxk/kstr.js"
import kseg from "../kxk/kseg.js"
import post from "../kxk/post.js"

import util from "./util/util.js"
import color from "./util/color.js"

import view from "./view/view.js"
import scroll from "./view/scroll.js"
import gutter from "./view/gutter.js"
import mapscr from "./view/mapscr.js"
import mapview from "./view/mapview.js"

import state from "./state.js"
import theme from "./theme.js"


editor = (function ()
{
    _k_.extend(editor, view)
    function editor (screen, name, features)
    {
        this["onKey"] = this["onKey"].bind(this)
        this["onFinderApply"] = this["onFinderApply"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["onFocus"] = this["onFocus"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["isCursorVisible"] = this["isCursorVisible"].bind(this)
        this["isCursorInEmpty"] = this["isCursorInEmpty"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        editor.__super__.constructor.call(this,screen,name,features)
        this.state = new state(this.cells,this.name)
        post.on('focus',this.onFocus)
        if (this.name === 'editor')
        {
            post.on('finder.apply',this.onFinderApply)
        }
        if (this.feats.scrllr)
        {
            this.scroll = new scroll(this.screen,this.state)
        }
        if (this.feats.scroll)
        {
            this.scroll = new scroll(this.screen,this.state)
        }
        if (this.feats.gutter)
        {
            this.gutter = new gutter(this.screen,this.state)
        }
        if (this.feats.mapscr)
        {
            this.mapscr = new mapscr(this.screen,this.state)
            this.mapscr.show()
        }
        if (this.feats.mapview)
        {
            this.mapscr = new mapview(this.screen,this.state)
        }
    }

    editor.prototype["layout"] = function (x, y, w, h)
    {
        var g, m, r, s, sl, sr

        g = m = s = 0
        sl = sr = 0
        if (this.scroll)
        {
            s = 1
            if (this.feats.scrllr)
            {
                sr = s
                this.scroll.layout(x + w - sr,y,s,h)
            }
            else
            {
                sl = s
                this.scroll.layout(x,y,s,h)
            }
        }
        if (this.gutter)
        {
            g = this.state.gutterWidth()
            this.gutter.layout(x + sl,y,g,h)
        }
        if (this.mapscr)
        {
            m = (this.mapscr.visible() ? 10 : 0)
            r = (this.mapscr.visible() ? h : 0)
            this.mapscr.layout(x + w - sr - 10,y,m,r)
        }
        this.cells.layout(x + sl + g,y,w - s - g - m,h)
        return this.state.initView()
    }

    editor.prototype["draw"] = function ()
    {
        var bg, c, ch, checkColor, ci, cursor, emptyColor, fg, highlight, li, line, linel, lines, mainCursor, row, s, selection, si, syntax, view, x, xe, xs, y, _103_42_, _160_41_, _161_44_, _197_15_, _198_15_, _199_15_, _82_26_

        if (this.hidden())
        {
            return
        }
        syntax = this.state.syntax
        s = this.state.s
        view = s.view.asMutable()
        lines = this.state.allLines()
        mainCursor = this.state.mainCursor()
        bg = ((_82_26_=theme[this.name]) != null ? _82_26_ : theme['editor'])
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
                fg = syntax.getColor(ci,y)
                ch = syntax.getChar(ci,y,line[si])
                if (ch === "#")
                {
                    checkColor = true
                }
                c += this.cells.add(c,row,ch,fg,bg)
                x += ((_103_42_=kseg.width(line[si])) != null ? _103_42_ : 1)
            }
            emptyColor = theme[this.name + '_empty']
            if (y === mainCursor[1])
            {
                if (linel > 0)
                {
                    this.cells.bg_rect(0,row,linel,row,theme[this.name + '_cursor_main'])
                }
                this.cells.bg_fill(_k_.max(0,linel),row,-1,row,theme[this.name + '_cursor_empty'])
            }
            else
            {
                if (linel > 0)
                {
                    this.cells.bg_rect(0,row,linel,row,theme[this.name])
                }
                this.cells.bg_fill(_k_.max(0,linel),row,-1,row,emptyColor)
            }
            if (checkColor)
            {
                this.drawColors(line,row,linel,emptyColor)
            }
        }
        if (lines.length - view[1] < this.cells.rows)
        {
            for (var _c_ = row = lines.length - view[1], _d_ = this.cells.rows; (_c_ <= _d_ ? row < this.cells.rows : row > this.cells.rows); (_c_ <= _d_ ? ++row : --row))
            {
                this.cells.bg_fill(0,row,-1,row,emptyColor)
            }
        }
        bg = theme.highlight
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        var list = _k_.list(s.highlights)
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            highlight = list[_e_]
            y = highlight[1] - view[1]
            if (y >= this.cells.rows)
            {
                break
            }
            for (var _f_ = x = highlight[0], _10_ = highlight[2]; (_f_ <= _10_ ? x < highlight[2] : x > highlight[2]); (_f_ <= _10_ ? ++x : --x))
            {
                this.cells.set_bg(x - view[0],y,bg)
                this.cells.set_char(x - view[0],y,color.ul_rgb('ffffff') + '\x1b[4:1m' + this.cells.get_char(x - view[0],y) + '\x1b[4:0m')
            }
        }
        var list1 = _k_.list(s.selections)
        for (var _11_ = 0; _11_ < list1.length; _11_++)
        {
            selection = list1[_11_]
            for (var _12_ = li = selection[1], _13_ = selection[3]; (_12_ <= _13_ ? li <= selection[3] : li >= selection[3]); (_12_ <= _13_ ? ++li : --li))
            {
                y = li - view[1]
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
                bg = (util.isSpanLineRange(lines,selection) ? theme.selection : theme.selection_line)
                if (!this.cells.screen.t.hasFocus)
                {
                    bg = color.darken(bg)
                }
                for (var _14_ = x = xs, _15_ = xe; (_14_ <= _15_ ? x < xe : x > xe); (_14_ <= _15_ ? ++x : --x))
                {
                    this.cells.set_bg(x - view[0],y,bg)
                }
            }
        }
        fg = ((_160_41_=theme[this.name + '_cursor_fg']) != null ? _160_41_ : theme['editor_cursor_fg'])
        bg = ((_161_44_=theme[this.name + '_cursor_multi']) != null ? _161_44_ : theme['editor_cursor_multi'])
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        var list2 = _k_.list(s.cursors)
        for (var _16_ = 0; _16_ < list2.length; _16_++)
        {
            cursor = list2[_16_]
            if (_k_.eql(cursor, mainCursor))
            {
                continue
            }
            if (this.isCursorVisible(cursor))
            {
                x = cursor[0] - view[0]
                y = cursor[1] - view[1]
                this.cells.set_bg(x,y,bg)
                this.cells.set_fg(x,y,fg)
            }
        }
        if (this.isCursorVisible())
        {
            fg = theme[this.name + '_cursor_fg']
            fg = (fg != null ? fg : theme['editor' + '_cursor_fg'])
            bg = theme[this.name + ((this.hasFocus() ? '_cursor_bg' : '_cursor_blur'))]
            bg = (bg != null ? bg : theme['editor' + ((this.hasFocus() ? '_cursor_bg' : '_cursor_blur'))])
            x = mainCursor[0] - view[0]
            y = mainCursor[1] - view[1]
            if (s.cursors.length <= 1)
            {
                if (this.isCursorInEmpty())
                {
                    bg = color.darken(bg,0.7)
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
            this.cells.set_bg(x,y,bg)
            this.cells.set_fg(x,y,fg)
        }
        ;(this.scroll != null ? this.scroll.draw() : undefined)
        ;(this.gutter != null ? this.gutter.draw() : undefined)
        ;(this.mapscr != null ? this.mapscr.draw() : undefined)
        return editor.__super__.draw.call(this)
    }

    editor.prototype["drawColors"] = function (line, row, linel, emptyColor)
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

    editor.prototype["onMouse"] = function (event)
    {
        var col, row, start, x, y, _229_30_, _229_39_, _230_30_, _240_41_, _308_31_

        if (((_229_30_=this.mapscr) != null ? typeof (_229_39_=_229_30_.onMouse) === "function" ? _229_39_(event) : undefined : undefined))
        {
            return true
        }
        if ((this.scroll != null ? this.scroll.onMouse(event) : undefined))
        {
            return true
        }
        if (editor.__super__.onMouse.call(this,event))
        {
            return true
        }
        var _a_ = this.cells.posForEvent(event); col = _a_[0]; row = _a_[1]

        switch (event.type)
        {
            case 'press':
                if (this.cells.isOutsideEvent(event))
                {
                    if (!(this.gutter != null ? this.gutter.cells.isInsideEvent(event) : undefined))
                    {
                        return
                    }
                }
                if (event.count > 1)
                {
                    if (!event.shift)
                    {
                        this.state.deselect()
                    }
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    if (event.count === 2)
                    {
                        if (event.alt)
                        {
                            this.state.selectChunk(x,y)
                        }
                        else
                        {
                            this.state.selectWord(x,y)
                        }
                    }
                    else
                    {
                        this.state.selectLine(y)
                    }
                    this.dragStart = _k_.copy(this.state.s.selections[0])
                    true
                }
                else
                {
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    this.dragStart = [x,y,x]
                    if (!event.shift)
                    {
                        this.state.deselect()
                    }
                    if (!event.alt)
                    {
                        this.state.clearCursors()
                    }
                    if (event.alt)
                    {
                        this.state.addCursor(x,y)
                    }
                    else
                    {
                        if (event.shift && this.state.s.cursors.length === 1)
                        {
                            this.state.setMainCursorAndSelect(x,y)
                        }
                        else
                        {
                            this.state.setMainCursor(x,y)
                        }
                    }
                    this.grabFocus()
                    return true
                }
                break
            case 'drag':
                if (this.dragStart)
                {
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    start = [this.dragStart[0],this.dragStart[1]]
                    if (y < this.dragStart[1])
                    {
                        start = [this.dragStart[2],this.dragStart[1]]
                    }
                    if (event.shift)
                    {
                        this.state.addRangeToSelectionWithMainCursorAtEnd(util.rangeFromStartToEnd(start,[x,y]))
                    }
                    else
                    {
                        this.state.select(start,[x,y])
                    }
                    return true
                }
                break
            case 'release':
                delete this.dragStart
                break
            case 'move':
                if (this.cells.isInsideEvent(event))
                {
                    post.emit('pointer','text')
                }
                else if ((this.gutter != null ? this.gutter.cells.isInsideEvent(event) : undefined))
                {
                    post.emit('pointer','vertical-text')
                }
                break
        }

        return false
    }

    editor.prototype["onWheel"] = function (event)
    {
        var col, row, start, steps, x, y

        if (event.cell[1] >= this.cells.y + this.cells.rows)
        {
            return
        }
        if (this.name === 'editor')
        {
            steps = 1
            if (event.shift)
            {
                steps *= 2
            }
            if (event.ctrl)
            {
                steps *= 2
            }
            if (event.alt)
            {
                steps *= 2
            }
            if (this.dragStart)
            {
                var _a_ = this.state.mainCursor(); x = _a_[0]; y = _a_[1]

                switch (event.dir)
                {
                    case 'up':
                        y -= steps
                        break
                    case 'down':
                        y += steps
                        break
                    case 'left':
                        x -= 1
                        break
                    case 'right':
                        x += 1
                        break
                }

                y = _k_.clamp(0,this.state.s.lines.length - 1,y)
                x = _k_.clamp(0,this.state.s.lines[y].length - 1,x)
                start = [this.dragStart[0],this.dragStart[1]]
                if (y < this.dragStart[1])
                {
                    start = [this.dragStart[2],this.dragStart[1]]
                }
                if (this.state.select(start,[x,y]))
                {
                    this.redraw()
                }
                return
            }
        }
        var _b_ = this.cells.posForEvent(event); col = _b_[0]; row = _b_[1]

        if (!this.cells.isInsideEvent(event))
        {
            return
        }
        switch (event.dir)
        {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                this.state.scrollView(event.dir,steps)
                break
        }

        return this.redraw()
    }

    editor.prototype["isCursorInEmpty"] = function (cursor)
    {
        cursor = (cursor != null ? cursor : this.state.mainCursor())
        return util.isLinesPosOutside(this.state.s.lines,cursor)
    }

    editor.prototype["isCursorVisible"] = function (cursor)
    {
        var v

        cursor = (cursor != null ? cursor : this.state.mainCursor())
        v = this.state.s.view
        return (v[0] <= cursor[0] && cursor[0] < v[0] + this.cells.cols) && (v[1] <= cursor[1] && cursor[1] < v[1] + this.cells.rows)
    }

    editor.prototype["grabFocus"] = function ()
    {
        post.emit('focus',this.name)
        return this.redraw()
    }

    editor.prototype["hasFocus"] = function ()
    {
        return this.state.hasFocus
    }

    editor.prototype["onFocus"] = function (name)
    {
        return this.state.hasFocus = (name === this.name)
    }

    editor.prototype["redraw"] = function ()
    {
        return post.emit('redraw')
    }

    editor.prototype["onFinderApply"] = function (text)
    {
        lf('finderApply',text)
        return this.state.highlightText(text)
    }

    editor.prototype["onKey"] = function (key, event)
    {
        if (!this.hasFocus())
        {
            return
        }
        if (this.state.s.cursors.length === 1)
        {
            switch (key)
            {
                case 'ctrl+alt+up':
                    return this.state.moveCursors('up',{count:8})

                case 'ctrl+alt+down':
                    return this.state.moveCursors('down',{count:8})

                case 'ctrl+alt+left':
                    return this.state.moveCursors('left',{count:8})

                case 'ctrl+alt+right':
                    return this.state.moveCursors('right',{count:8})

                case 'shift+ctrl+alt+up':
                    return this.state.moveCursors('up',{count:16})

                case 'shift+ctrl+alt+down':
                    return this.state.moveCursors('down',{count:16})

                case 'shift+ctrl+alt+left':
                    return this.state.moveCursors('left',{count:16})

                case 'shift+ctrl+alt+right':
                    return this.state.moveCursors('right',{count:16})

            }

        }
        switch (key)
        {
            case 'up':
                return this.state.moveCursors('up')

            case 'down':
                return this.state.moveCursors('down')

            case 'left':
                return this.state.moveCursors('left')

            case 'right':
                return this.state.moveCursors('right')

            case 'cmd+left':
            case 'ctrl+left':
                return this.state.moveCursors(['bos','ind_bol'])

            case 'cmd+right':
            case 'ctrl+right':
                return this.state.moveCursors(['eos','ind_eol'])

            case 'alt+left':
                return this.state.moveCursors('left',{jump:['ws','word','empty','punct']})

            case 'alt+right':
                return this.state.moveCursors('right',{jump:['ws','word','empty','punct']})

            case 'shift+alt+right':
                return this.state.moveCursorsAndSelect('right',{jump:['ws','word','empty','punct']})

            case 'shift+alt+left':
                return this.state.moveCursorsAndSelect('left',{jump:['ws','word','empty','punct']})

            case 'shift+up':
                return this.state.moveCursorsAndSelect('up')

            case 'shift+down':
                return this.state.moveCursorsAndSelect('down')

            case 'shift+left':
                return this.state.moveCursorsAndSelect('left')

            case 'shift+right':
                return this.state.moveCursorsAndSelect('right')

            case 'shift+cmd+right':
                return this.state.moveCursorsAndSelect('ind_eol')

            case 'shift+cmd+left':
                return this.state.moveCursorsAndSelect('ind_bol')

            case 'shift+ctrl+h':
                return this.state.moveCursorsAndSelect('bof')

            case 'shift+ctrl+j':
                return this.state.moveCursorsAndSelect('eof')

            case 'shift+alt+cmd+up':
                return this.state.moveMainCursorInDirection('up',{keep:true})

            case 'shift+alt+cmd+down':
                return this.state.moveMainCursorInDirection('down',{keep:true})

            case 'shift+alt+cmd+left':
                return this.state.moveMainCursorInDirection('left',{keep:true})

            case 'shift+alt+cmd+right':
                return this.state.moveMainCursorInDirection('right',{keep:true})

            case 'home':
                return this.state.singleCursorAtIndentOrStartOfLine()

            case 'end':
                return this.state.singleCursorAtEndOfLine()

            case 'pageup':
                return this.state.singleCursorPage('up')

            case 'pagedown':
                return this.state.singleCursorPage('down')

            case 'ctrl+h':
                return this.state.setMainCursor(0,0)

            case 'ctrl+j':
                return this.state.setMainCursor(this.state.s.lines[this.state.s.lines.length - 1].length,this.state.s.lines.length - 1)

            case 'alt+d':
                return this.state.delete('next','alt')

            case 'shift+ctrl+k':
            case 'entf':
                return this.state.delete('next')

            case 'ctrl+k':
                return this.state.delete('eol')

            case 'delete':
                return this.state.delete('back')

            case 'ctrl+delete':
                return this.state.delete('back',true)

            case 'cmd+delete':
                return this.state.delete('back',true)

            case 'shift+tab':
                return this.state.deindentSelectedOrCursorLines()

            case 'tab':
                return this.state.insert('\t')

            case 'alt+x':
            case 'cmd+x':
            case 'ctrl+x':
                return this.state.cut()

            case 'alt+c':
            case 'cmd+c':
            case 'ctrl+c':
                return this.state.copy()

            case 'alt+v':
            case 'cmd+v':
            case 'ctrl+v':
                return this.state.paste()

            case 'alt+up':
                return this.state.moveSelectionOrCursorLines('up')

            case 'alt+down':
                return this.state.moveSelectionOrCursorLines('down')

            case 'cmd+up':
            case 'ctrl+up':
                return this.state.expandCursors('up')

            case 'cmd+down':
            case 'ctrl+down':
                return this.state.expandCursors('down')

            case 'shift+cmd+up':
            case 'shift+ctrl+up':
                return this.state.contractCursors('up')

            case 'shift+cmd+down':
            case 'shift+ctrl+down':
                return this.state.contractCursors('down')

            case 'cmd+z':
            case 'ctrl+z':
                return this.state.undo()

            case 'shift+cmd+z':
            case 'cmd+y':
            case 'ctrl+y':
                return this.state.redo()

            case 'cmd+a':
            case 'ctrl+a':
                return this.state.selectAllLines()

            case 'cmd+j':
            case 'ctrl+j':
                return this.state.joinLines()

            case 'cmd+l':
            case 'ctrl+l':
                return this.state.selectMoreLines()

            case 'shift+cmd+l':
            case 'shift+ctrl+l':
                return this.state.selectLessLines()

            case 'cmd+e':
            case 'ctrl+e':
                return this.state.highlightWordAtCursor_deselectCursorHighlight_moveCursorToNextHighlight()

            case 'cmd+d':
            case 'ctrl+d':
                return this.state.selectWordAtCursor_highlightSelection_addNextHighlightToSelection()

            case 'cmd+g':
            case 'ctrl+g':
                return this.state.selectWordAtCursor_highlightSelection_selectNextHighlight()

            case 'alt+cmd+d':
            case 'alt+ctrl+d':
                return this.state.selectWordAtCursor_highlightSelection_selectAllHighlights()

            case 'cmd+/':
            case 'ctrl+/':
                return this.state.toggleCommentAtSelectionOrCursorLines()

            case 'esc':
                return this.state.clearCursorsHighlightsAndSelections()

        }

        if (!_k_.empty(event.char))
        {
            return this.state.insert(event.char)
        }
        else
        {
            if (!(_k_.in(key,['shift','ctrl','alt','cmd'])))
            {
                return lfc('editor.onKey?',key)
            }
        }
    }

    return editor
})()

export default editor;