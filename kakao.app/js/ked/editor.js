var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var editor

import events from "../kxk/events.js"
import matchr from "../kxk/matchr.js"
import kstr from "../kxk/kstr.js"
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
        var feature

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
        this["init"] = this["init"].bind(this)
        editor.__super__.constructor.call(this,screen,name,features)
        this.state = new state(this.cells,this.name)
        post.on('focus',this.onFocus)
        if (this.name === 'editor')
        {
            post.on('finder.apply',this.onFinderApply)
        }
        var list = _k_.list(features)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            feature = list[_a_]
            switch (feature)
            {
                case 'scrllr':
                case 'scroll':
                    this.scroll = new scroll(this.screen,this.state)
                    break
                case 'gutter':
                    this.gutter = new gutter(this.screen,this.state)
                    break
                case 'mapscr':
                    this.mapscr = new mapscr(this.screen,this.state)
                    this.mapscr.show()
                    break
                case 'mapview':
                    this.mapscr = new mapview(this.screen,this.state)
                    break
            }

        }
    }

    editor.prototype["init"] = function (x, y, w, h)
    {
        var g, m, s, sl, sr

        g = m = s = 0
        sl = sr = 0
        if (this.scroll)
        {
            s = 1
            if (this.feats.scrllr)
            {
                sr = s
                this.scroll.init(x + w - sr,y,s,h)
            }
            else
            {
                sl = s
                this.scroll.init(x,y,s,h)
            }
        }
        if (this.gutter)
        {
            g = this.state.gutterWidth()
            this.gutter.init(x + sl,y,g,h)
        }
        if (this.mapscr)
        {
            m = (this.mapscr.visible() ? 10 : 0)
            this.mapscr.init(x + w - sr - 10,y,m,h)
        }
        this.cells.init(x + sl + g,y,w - sr - g - m,h)
        return this.state.initView()
    }

    editor.prototype["draw"] = function ()
    {
        var bg, ch, checkColor, clr, cursor, cx, dta, emptyColor, fg, highlight, idx, li, line, linel, lines, mainCursor, rng, rngs, row, s, selection, syntax, view, x, xe, xs, y, _165_41_, _166_44_, _200_15_, _201_15_, _82_26_

        if (this.cells.rows <= 0 || this.cells.cols <= 0)
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
            if (y < lines.length)
            {
                line = lines[y]
            }
            if (y < lines.length)
            {
                for (var _c_ = x = 0, _d_ = this.cells.cols; (_c_ <= _d_ ? x < this.cells.cols : x > this.cells.cols); (_c_ <= _d_ ? ++x : --x))
                {
                    if (x + view[0] < line.length)
                    {
                        fg = syntax.getColor(x + view[0],y)
                        ch = syntax.getChar(x + view[0],y,line[x + view[0]])
                        if (ch === "#")
                        {
                        }
                        checkColor = true
                        this.cells.set(x,row,ch,fg,bg)
                    }
                }
            }
            emptyColor = theme[this.name + '_empty']
            if (y < lines.length)
            {
                linel = line.length - view[0]
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
                    if (rngs = kstr.colorRanges(line))
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
            }
            else
            {
                this.cells.bg_fill(0,row,-1,row,emptyColor)
            }
        }
        bg = theme.highlight
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        var list1 = _k_.list(s.highlights)
        for (var _f_ = 0; _f_ < list1.length; _f_++)
        {
            highlight = list1[_f_]
            y = highlight[1] - view[1]
            if ((0 <= y && y < this.cells.rows))
            {
                for (var _10_ = x = highlight[0], _11_ = highlight[2]; (_10_ <= _11_ ? x < highlight[2] : x > highlight[2]); (_10_ <= _11_ ? ++x : --x))
                {
                    if ((0 <= x - view[0] && x - view[0] < this.cells.cols))
                    {
                        this.cells.set_bg(x - view[0],y,bg)
                        this.cells.set_char(x - view[0],y,color.ul_rgb('ffffff') + '\x1b[4:1m' + this.cells.get_char(x - view[0],y) + '\x1b[4:0m')
                    }
                }
            }
        }
        var list2 = _k_.list(s.selections)
        for (var _12_ = 0; _12_ < list2.length; _12_++)
        {
            selection = list2[_12_]
            for (var _13_ = li = selection[1], _14_ = selection[3]; (_13_ <= _14_ ? li <= selection[3] : li >= selection[3]); (_13_ <= _14_ ? ++li : --li))
            {
                y = li - view[1]
                if ((view[1] <= li && li < view[1] + this.cells.rows))
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
                        xe = lines[li].length
                    }
                    bg = (util.isSpanLineRange(lines,selection) ? theme.selection : theme.selection_line)
                    if (!this.cells.screen.t.hasFocus)
                    {
                        bg = color.darken(bg)
                    }
                    for (var _15_ = x = xs, _16_ = xe; (_15_ <= _16_ ? x < xe : x > xe); (_15_ <= _16_ ? ++x : --x))
                    {
                        if ((0 <= x - view[0] && x - view[0] < this.cells.cols))
                        {
                            this.cells.set_bg(x - view[0],y,bg)
                        }
                    }
                }
            }
        }
        fg = ((_165_41_=theme[this.name + '_cursor_fg']) != null ? _165_41_ : theme['editor_cursor_fg'])
        bg = ((_166_44_=theme[this.name + '_cursor_multi']) != null ? _166_44_ : theme['editor_cursor_multi'])
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        var list3 = _k_.list(s.cursors)
        for (var _17_ = 0; _17_ < list3.length; _17_++)
        {
            cursor = list3[_17_]
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
        return editor.__super__.draw.call(this)
    }

    editor.prototype["onMouse"] = function (event)
    {
        var col, row, start, x, y, _214_30_, _214_39_, _215_30_, _225_41_

        if (((_214_30_=this.mapscr) != null ? typeof (_214_39_=_214_30_.onMouse) === "function" ? _214_39_(event) : undefined : undefined))
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
                    this.cells.screen.t.setPointerStyle('xterm')
                }
                break
        }

        return false
    }

    editor.prototype["onWheel"] = function (event)
    {
        var start, steps, x, y

        if (event.cell[1] >= this.cells.y + this.cells.rows)
        {
            return
        }
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

            case 'shift+alt+up':
                return this.state.moveMainCursorInDirection('up',{keep:true})

            case 'shift+alt+down':
                return this.state.moveMainCursorInDirection('down',{keep:true})

            case 'shift+alt+left':
                return this.state.moveMainCursorInDirection('left',{keep:true})

            case 'shift+alt+right':
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

            case 'cmd+delete':
                return this.state.delete('back','cmd')

            case 'alt+delete':
                return this.state.delete('back','alt')

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