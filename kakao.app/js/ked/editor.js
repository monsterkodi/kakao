var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.prototype.hasOwnProperty(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var editor

import events from "../kxk/events.js"

import state from "./state.js"
import cells from "./cells.js"
import theme from "./theme.js"

import util from "./util/util.js"
import color from "./util/color.js"


editor = (function ()
{
    _k_.extend(editor, events)
    function editor (screen)
    {
        this.screen = screen
    
        this["onKey"] = this["onKey"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["isCursorVisible"] = this["isCursorVisible"].bind(this)
        this["isCursorInEmpty"] = this["isCursorInEmpty"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["postDraw"] = this["postDraw"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["init"] = this["init"].bind(this)
        this.cells = new cells(this.screen)
        this.state = new state(this.cells)
        return editor.__super__.constructor.apply(this, arguments)
    }

    editor.prototype["init"] = function (x, y, w, h)
    {
        this.cells.init(x,y,w,h)
        return this.state.initView()
    }

    editor.prototype["draw"] = function ()
    {
        var bg, ch, cursor, fg, highlight, li, line, linel, lines, mainCursor, row, s, selection, syntax, view, x, xe, xs, y

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
                    this.cells.set(x,row,ch,fg)
                }
            }
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
                    this.cells.bg_rect(_k_.max(0,linel),row,-1,row,theme[this.constructor.name + '_empty'])
                }
            }
        }
        var list = _k_.list(s.highlights)
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            highlight = list[_e_]
            y = highlight[1] - view[1]
            if ((0 <= y && y < this.cells.rows))
            {
                for (var _f_ = x = highlight[0], _10_ = highlight[2]; (_f_ <= _10_ ? x < highlight[2] : x > highlight[2]); (_f_ <= _10_ ? ++x : --x))
                {
                    if ((0 <= x - view[0] && x - view[0] < this.cells.cols))
                    {
                        this.cells.set_bg(x - view[0],y,theme.highlight)
                        this.cells.set_char(x - view[0],y,color.ul_rgb('ffffff') + '\x1b[4:1m' + this.cells.get_char(x - view[0],y) + '\x1b[4:0m')
                    }
                }
            }
        }
        var list1 = _k_.list(s.selections)
        for (var _11_ = 0; _11_ < list1.length; _11_++)
        {
            selection = list1[_11_]
            for (var _12_ = li = selection[1], _13_ = selection[3]; (_12_ <= _13_ ? li <= selection[3] : li >= selection[3]); (_12_ <= _13_ ? ++li : --li))
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
                    for (var _14_ = x = xs, _15_ = xe; (_14_ <= _15_ ? x < xe : x > xe); (_14_ <= _15_ ? ++x : --x))
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
        var list2 = _k_.list(s.cursors)
        for (var _16_ = 0; _16_ < list2.length; _16_++)
        {
            cursor = list2[_16_]
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
                    this.state.deselect()
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    if (event.count === 2)
                    {
                        if (event.mods === 'alt')
                        {
                            this.state.clearCursorsHighlightsAndSelections()
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
                    if (_k_.empty(event.mods))
                    {
                        this.state.clearCursorsHighlightsAndSelections()
                    }
                    if (event.mods === 'alt')
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
                    if (this.state.select(start,[x,y]))
                    {
                        return true
                    }
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
        switch (key)
        {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                return this.state.moveCursor(key)

            case 'ctrl+up':
                return this.state.moveCursor('up',4)

            case 'ctrl+down':
                return this.state.moveCursor('down',4)

            case 'ctrl+left':
                return this.state.moveCursor('left',4)

            case 'ctrl+right':
                return this.state.moveCursor('right',4)

            case 'ctrl+alt+up':
                return this.state.moveCursor('up',8)

            case 'ctrl+alt+down':
                return this.state.moveCursor('down',8)

            case 'ctrl+alt+left':
                return this.state.moveCursor('left',8)

            case 'ctrl+alt+right':
                return this.state.moveCursor('right',8)

            case 'shift+ctrl+alt+up':
                return this.state.moveCursor('up',16)

            case 'shift+ctrl+alt+down':
                return this.state.moveCursor('down',16)

            case 'shift+ctrl+alt+left':
                return this.state.moveCursor('left',16)

            case 'shift+ctrl+alt+right':
                return this.state.moveCursor('right',16)

            case 'ctrl+a':
                return this.state.singleCursorAtIndentOrStartOfLine()

            case 'ctrl+e':
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

            case 'cmd+a':
                return this.state.selectAllLines()

            case 'ctrl+k':
                return this.state.delete('eol')

            case 'delete':
                return this.state.delete('back')

            case 'cmd+delete':
                return this.state.delete('back','cmd')

            case 'alt+delete':
                return this.state.delete('back','alt')

            case 'shift+tab':
                return this.state.deindent()

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

            case 'cmd+down':
                return this.state.expandCursors('down')

            case 'cmd+up':
                return this.state.expandCursors('up')

            case 'cmd+z':
                return this.state.undo()

            case 'cmd+y':
            case 'shift+cmd+z':
                return this.state.redo()

            case 'cmd+j':
                return this.state.joinLines()

            case 'cmd+left':
                return this.state.moveCursorsToIndentOrStartOfLines()

            case 'cmd+right':
                return this.state.moveCursorsToEndOfLines()

            case 'cmd+g':
                return this.state.selectWordAtCursor_highlightSelection_selectNextHighlight()

            case 'cmd+d':
                return this.state.selectWordAtCursor_highlightSelection_addNextHighlightToSelection()

            case 'cmd+e':
                return this.state.highlightWordAtCursor_deselectCursorHighlight_moveCursorToNextHighlight()

            case 'alt+cmd+d':
                return this.state.selectWordAtCursor_highlightSelection_selectAllHighlights()

            case 'esc':
                return this.state.clearCursorsHighlightsAndSelections()

        }

        if (!_k_.empty(event.char))
        {
            this.state.deleteSelection()
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