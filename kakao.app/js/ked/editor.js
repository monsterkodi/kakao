var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.prototype.hasOwnProperty(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var editor

import events from "../kxk/events.js"

import state from "./state.js"
import cells from "./cells.js"
import theme from "./theme.js"

import util from "./util/util.js"


editor = (function ()
{
    _k_.extend(editor, events)
    function editor (screen)
    {
        this.screen = screen
    
        this["onKey"] = this["onKey"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["isCursorVisible"] = this["isCursorVisible"].bind(this)
        this["showCursorIfInView"] = this["showCursorIfInView"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["postDraw"] = this["postDraw"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this.cells = new cells(this.screen)
        this.state = new state(this.cells)
        return editor.__super__.constructor.apply(this, arguments)
    }

    editor.prototype["draw"] = function ()
    {
        var ch, fg, li, line, linel, lines, row, s, selection, syntax, view, x, xe, xs, y

        if (this.cells.rows <= 0 || this.cells.cols <= 0)
        {
            return
        }
        syntax = this.state.syntax
        s = this.state.s
        view = s.view.asMutable()
        lines = s.lines.asMutable()
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
                if (y === s.cursor[1])
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
        var list = _k_.list(s.selections)
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            selection = list[_e_]
            for (var _f_ = li = selection[1], _10_ = selection[3]; (_f_ <= _10_ ? li <= selection[3] : li >= selection[3]); (_f_ <= _10_ ? ++li : --li))
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
                    for (var _11_ = x = xs, _12_ = xe; (_11_ <= _12_ ? x < xe : x > xe); (_11_ <= _12_ ? ++x : --x))
                    {
                        if ((0 <= x - view[0] && x - view[0] < this.cells.cols))
                        {
                            this.cells.set_bg(x - view[0],y,theme.selection)
                        }
                    }
                }
            }
        }
        if (this.isCursorVisible())
        {
            this.cells.set_bg(s.cursor[0] - view[0],s.cursor[1] - view[1],theme[this.constructor.name + '_cursor_bg'])
        }
        return this.postDraw()
    }

    editor.prototype["postDraw"] = function ()
    {}

    editor.prototype["onMouse"] = function (event, col, row, button, mods, count)
    {
        var start, x, y

        if (row >= this.cells.y + this.cells.rows)
        {
            return
        }
        var _a_ = this.cells.posForScreen(col,row); col = _a_[0]; row = _a_[1]

        switch (event)
        {
            case 'press':
                if (count > 1)
                {
                    this.state.deselect()
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    if (count === 2)
                    {
                        if (mods === 'alt')
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
                    if (mods !== 'ctrl')
                    {
                        this.state.deselect()
                    }
                    this.state.setCursor(x,y)
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
            x = this.state.s.cursor[0]
            y = this.state.s.cursor[1]
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

    editor.prototype["showCursorIfInView"] = function ()
    {
        var s, sx, sy

        s = this.state.s
        var _a_ = this.cells.screenForPos(s.cursor[0] - s.view[0],s.cursor[1] - s.view[1]); sx = _a_[0]; sy = _a_[1]

        this.screen.t.setCursor(sx,sy)
        return this.screen.t.showCursor(this.isCursorVisible())
    }

    editor.prototype["isCursorVisible"] = function ()
    {
        var visible

        visible = util.isPosInsideRange(this.state.s.cursor,this.state.rangeForVisibleLines())
        if (this.state.s.cursor[0] < this.state.s.view[0])
        {
            visible = false
        }
        return visible
    }

    editor.prototype["redraw"] = function ()
    {
        return this.emit('redraw')
    }

    editor.prototype["onKey"] = function (key)
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
                return this.state.setCursor(0,this.state.s.cursor[1])

            case 'ctrl+e':
                return this.state.setCursor(this.state.s.lines[this.state.s.cursor[1]].length,this.state.s.cursor[1])

            case 'ctrl+h':
                return this.state.setCursor(0,0)

            case 'ctrl+j':
                return this.state.setCursor(this.state.s.lines[this.state.s.lines.length - 1].length,this.state.s.lines.length - 1)

            case 'shift+ctrl+h':
                return this.state.moveCursorAndSelect('bof')

            case 'shift+ctrl+j':
                return this.state.moveCursorAndSelect('eof')

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

            case 'cmd+z':
                return this.state.undo()

            case 'cmd+y':
            case 'shift+cmd+z':
                return this.state.redo()

            case 'cmd+j':
                return this.state.joinLines()

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

            case 'esc':
                return this.state.deselect()

        }

        return this.state.insert(key)
    }

    return editor
})()

export default editor;