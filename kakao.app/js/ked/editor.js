var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.prototype.hasOwnProperty(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var editor

import events from "../kxk/events.js"
import matchr from "../kxk/matchr.js"
import kstr from "../kxk/kstr.js"

import state from "./state.js"
import theme from "./theme.js"

import util from "./util/util.js"
import color from "./util/color.js"

import view from "./view/view.js"


editor = (function ()
{
    _k_.extend(editor, view)
    function editor (screen, name)
    {
        this["onKey"] = this["onKey"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["isCursorVisible"] = this["isCursorVisible"].bind(this)
        this["isCursorInEmpty"] = this["isCursorInEmpty"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["postDraw"] = this["postDraw"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["init"] = this["init"].bind(this)
        editor.__super__.constructor.call(this,screen,name)
        this.state = new state(this.cells)
    }

    editor.prototype["init"] = function (x, y, w, h)
    {
        this.cells.init(x,y,w,h)
        return this.state.initView()
    }

    editor.prototype["draw"] = function ()
    {
        var bg, ch, checkColor, clr, cursor, cx, dta, emptyColor, fg, highlight, idx, li, line, linel, lines, mainCursor, rng, rngs, row, s, selection, syntax, view, x, xe, xs, y

        if (this.cells.rows <= 0 || this.cells.cols <= 0)
        {
            return
        }
        syntax = this.state.syntax
        s = this.state.s
        view = s.view.asMutable()
        lines = s.lines.asMutable()
        mainCursor = this.state.mainCursor()
        for (var _a_ = row = 0, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
        {
            y = row + view[1]
            if (y >= lines.length)
            {
                break
            }
            line = lines[y]
            if (!(line != null))
            {
                lf('empty line?',_k_.noon((lines)),y,row,view[1])
                lf('empty line?',lines.length,y)
                lf('???')
            }
            for (var _c_ = x = 0, _d_ = this.cells.cols; (_c_ <= _d_ ? x < this.cells.cols : x > this.cells.cols); (_c_ <= _d_ ? ++x : --x))
            {
                if (x < this.cells.cols && x + view[0] < line.length)
                {
                    fg = syntax.getColor(x + view[0],y)
                    ch = syntax.getChar(x + view[0],y,line[x + view[0]])
                    if (ch === "#")
                    {
                    }
                    checkColor = true
                    this.cells.set(x,row,ch,fg)
                }
            }
            emptyColor = theme[this.constructor.name + '_empty']
            if (y < lines.length)
            {
                linel = line.length - view[0]
                if (y === mainCursor[1])
                {
                    if (linel > 0)
                    {
                        this.cells.bg_rect(0,row,linel,row,theme[this.constructor.name + '_cursor_main'])
                    }
                    this.cells.bg_rect(_k_.max(0,linel),row,-1,row,theme[this.constructor.name + '_cursor_empty'])
                }
                else
                {
                    if (linel > 0)
                    {
                        this.cells.bg_rect(0,row,linel,row,theme[this.constructor.name])
                    }
                    this.cells.bg_rect(_k_.max(0,linel),row,-1,row,emptyColor)
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
                        this.cells.set_bg(x - view[0],y,theme.highlight)
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
                    bg = (util.isFullLineRange(lines,selection) ? theme.selection_line : theme.selection)
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
        bg = theme[this.constructor.name + '_cursor_multi']
        var list3 = _k_.list(s.cursors)
        for (var _17_ = 0; _17_ < list3.length; _17_++)
        {
            cursor = list3[_17_]
            if (this.isCursorVisible(cursor))
            {
                x = cursor[0] - view[0]
                y = cursor[1] - view[1]
                this.cells.set_bg(x,y,bg)
                this.cells.set_fg(x,y,theme[this.constructor.name + '_cursor_fg'])
            }
        }
        if (this.isCursorVisible())
        {
            bg = theme[this.constructor.name + '_cursor_bg']
            x = mainCursor[0] - view[0]
            y = mainCursor[1] - view[1]
            if (s.cursors.length <= 1)
            {
                if (this.isCursorInEmpty())
                {
                    bg = color.darken(bg)
                }
                else if (' ' === this.cells.get_char(x,y))
                {
                    bg = color.darken(bg,0.75)
                }
            }
            this.cells.set_bg(x,y,bg)
            this.cells.set_fg(x,y,theme[this.constructor.name + '_cursor_fg'])
        }
        return this.postDraw()
    }

    editor.prototype["postDraw"] = function ()
    {}

    editor.prototype["onMouse"] = function (type, sx, sy, event)
    {
        var col, row, start, x, y

        if (row >= this.cells.y + this.cells.rows)
        {
            return
        }
        var _a_ = this.cells.posForScreen(sx,sy); col = _a_[0]; row = _a_[1]

        switch (type)
        {
            case 'press':
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
                    return true
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
                        this.state.setMainCursor(x,y)
                    }
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
        }

        return true
    }

    editor.prototype["onWheel"] = function (col, row, dir, mods)
    {
        var start, steps, x, y

        if (row >= this.cells.y + this.cells.rows)
        {
            return
        }
        steps = ((function ()
        {
            switch (mods)
            {
                case 'shift':
                    return 4

                case 'shift+ctrl':
                    return 8

                case 'alt':
                    return 16

                case 'shift+alt':
                    return 32

                case 'ctrl+alt':
                    return 64

                case 'shift+ctrl+alt':
                    return 128

                default:
                    return 1
            }

        }).bind(this))()
        if (this.dragStart)
        {
            var _a_ = this.state.mainCursor(); x = _a_[0]; y = _a_[1]

            switch (dir)
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
        switch (dir)
        {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                this.state.scrollView(dir,steps)
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
        var visible

        cursor = (cursor != null ? cursor : this.state.mainCursor())
        visible = util.isPosInsideRange(cursor,this.state.rangeForVisibleLines())
        if (cursor[0] < this.state.s.view[0])
        {
            visible = false
        }
        return visible
    }

    editor.prototype["redraw"] = function ()
    {
        return this.emit('redraw')
    }

    editor.prototype["onKey"] = function (key, event)
    {
        lf('key',key)
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

            case 'ctrl+h':
                return this.state.setMainCursor(0,0)

            case 'ctrl+j':
                return this.state.setMainCursor(this.state.s.lines[this.state.s.lines.length - 1].length,this.state.s.lines.length - 1)

            case 'shift+ctrl+h':
                return this.state.moveCursorAndSelect('bof')

            case 'shift+ctrl+j':
                return this.state.moveCursorAndSelect('eof')

            case 'shift+up':
                return this.state.moveCursorAndSelect('up')

            case 'shift+down':
                return this.state.moveCursorAndSelect('down')

            case 'shift+left':
                return this.state.moveCursorAndSelect('left')

            case 'shift+right':
                return this.state.moveCursorAndSelect('right')

            case 'shift+cmd+right':
                return this.state.moveCursorAndSelect('eol')

            case 'shift+cmd+left':
                return this.state.moveCursorAndSelect('bol')

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

            case 'alt+left':
                return this.state.moveCursors('left',{jump:['ws','word','empty','punct']})

            case 'alt+right':
                return this.state.moveCursors('right',{jump:['ws','word','empty','punct']})

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

            case 'cmd+left':
            case 'ctrl+left':
                return this.state.moveCursorsToStartOfSelectionsOrIndentOrStartOfLines()

            case 'cmd+right':
            case 'ctrl+right':
                return this.state.moveCursorsToEndOfSelectionsOrLines()

            case 'cmd+g':
            case 'ctrl+g':
                return this.state.selectWordAtCursor_highlightSelection_selectNextHighlight()

            case 'cmd+d':
            case 'ctrl+d':
                return this.state.selectWordAtCursor_highlightSelection_addNextHighlightToSelection()

            case 'cmd+e':
            case 'ctrl+e':
                return this.state.highlightWordAtCursor_deselectCursorHighlight_moveCursorToNextHighlight()

            case 'alt+cmd+d':
                return this.state.selectWordAtCursor_highlightSelection_selectAllHighlights()

            case 'cmd+/':
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