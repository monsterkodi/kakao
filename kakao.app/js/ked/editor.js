var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var editor

import events from "../kxk/events.js"

import state from "./state.js"

import util from "./util/util.js"


editor = (function ()
{
    _k_.extend(editor, events)
    function editor (cells)
    {
        this.cells = cells
    
        this["onKey"] = this["onKey"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["onPaste"] = this["onPaste"].bind(this)
        this["deselect"] = this["deselect"].bind(this)
        this["redo"] = this["redo"].bind(this)
        this["undo"] = this["undo"].bind(this)
        this["paste"] = this["paste"].bind(this)
        this["copy"] = this["copy"].bind(this)
        this["cut"] = this["cut"].bind(this)
        this["saveFile"] = this["saveFile"].bind(this)
        this["showCursorIfInView"] = this["showCursorIfInView"].bind(this)
        this["setCursor"] = this["setCursor"].bind(this)
        this["moveCursor"] = this["moveCursor"].bind(this)
        this["moveCursorAndSelect"] = this["moveCursorAndSelect"].bind(this)
        this["joinLines"] = this["joinLines"].bind(this)
        this["delete"] = this["delete"].bind(this)
        this["insert"] = this["insert"].bind(this)
        this["scrollView"] = this["scrollView"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this.state = new state(this.cells)
        return editor.__super__.constructor.apply(this, arguments)
    }

    editor.prototype["onMouse"] = function (event, col, row, button, mods, count)
    {
        var start, x, y

        switch (event)
        {
            case 'press':
                if (count > 1)
                {
                    this.state.deselect()
                    x = col + this.state.s.view[0] - this.state.s.gutter
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
                    x = col + this.state.s.view[0] - this.state.s.gutter
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
                    x = col + this.state.s.view[0] - this.state.s.gutter
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

    editor.prototype["onWheel"] = function (dir, mods)
    {
        var start, steps, x, y

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
                return this.scrollView(dir,steps)

        }

    }

    editor.prototype["scrollView"] = function (dir, steps)
    {
        this.state.scrollView(dir,steps)
        return this.redraw()
    }

    editor.prototype["insert"] = function (text)
    {
        this.state.insert(text)
        return this.redraw()
    }

    editor.prototype["delete"] = function (type, mods)
    {
        this.state.delete(type,mods)
        return this.redraw()
    }

    editor.prototype["joinLines"] = function ()
    {
        this.state.joinLines()
        return this.redraw()
    }

    editor.prototype["moveCursorAndSelect"] = function (dir)
    {
        this.state.moveCursorAndSelect(dir)
        return this.redraw()
    }

    editor.prototype["moveCursor"] = function (dir, steps)
    {
        this.state.moveCursor(dir,steps)
        return this.redraw()
    }

    editor.prototype["setCursor"] = function (x, y)
    {
        this.state.setCursor(x,y)
        return this.redraw()
    }

    editor.prototype["showCursorIfInView"] = function ()
    {
        var show

        show = util.isPosInsideRange(this.state.s.cursor,this.state.rangeForVisibleLines())
        if (this.state.s.cursor[0] < this.state.s.view[0])
        {
            show = false
        }
        return this.cells.t.showCursor(show)
    }

    editor.prototype["saveFile"] = async function ()
    {
        var text

        text = this.editor.state.s.lines.asMutable().join('\n')
        await nfs.write(slash.untilde(this.status.file),text)
        return this.reloadFile()
    }

    editor.prototype["cut"] = function ()
    {
        this.state.cut()
        return this.redraw()
    }

    editor.prototype["copy"] = function ()
    {
        return this.state.copy()
    }

    editor.prototype["paste"] = function ()
    {
        this.state.paste()
        return this.redraw()
    }

    editor.prototype["undo"] = function ()
    {
        this.state.undo()
        return this.redraw()
    }

    editor.prototype["redo"] = function ()
    {
        this.state.redo()
        return this.redraw()
    }

    editor.prototype["deselect"] = function ()
    {
        this.state.deselect()
        return this.redraw()
    }

    editor.prototype["onPaste"] = function (text)
    {
        return this.insert(text)
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
                return this.moveCursor(key)

            case 'ctrl+up':
                return this.moveCursor('up',4)

            case 'ctrl+down':
                return this.moveCursor('down',4)

            case 'ctrl+left':
                return this.moveCursor('left',4)

            case 'ctrl+right':
                return this.moveCursor('right',4)

            case 'ctrl+alt+up':
                return this.moveCursor('up',8)

            case 'ctrl+alt+down':
                return this.moveCursor('down',8)

            case 'ctrl+alt+left':
                return this.moveCursor('left',8)

            case 'ctrl+alt+right':
                return this.moveCursor('right',8)

            case 'shift+ctrl+alt+up':
                return this.moveCursor('up',16)

            case 'shift+ctrl+alt+down':
                return this.moveCursor('down',16)

            case 'shift+ctrl+alt+left':
                return this.moveCursor('left',16)

            case 'shift+ctrl+alt+right':
                return this.moveCursor('right',16)

            case 'ctrl+a':
                return this.setCursor(0,this.state.s.cursor[1])

            case 'ctrl+e':
                return this.setCursor(this.state.s.lines[this.state.s.cursor[1]].length,this.state.s.cursor[1])

            case 'ctrl+h':
                return this.setCursor(0,0)

            case 'ctrl+j':
                return this.setCursor(this.state.s.lines[this.state.s.lines.length - 1].length,this.state.s.lines.length - 1)

            case 'shift+ctrl+h':
                return this.moveCursorAndSelect('bof')

            case 'shift+ctrl+j':
                return this.moveCursorAndSelect('eof')

            case 'ctrl+k':
                return this.delete('eol')

            case 'delete':
                return this.delete('back')

            case 'cmd+delete':
                return this.delete('back','cmd')

            case 'alt+delete':
                return this.delete('back','alt')

            case 'alt+x':
            case 'cmd+x':
            case 'ctrl+x':
                return this.cut()

            case 'alt+c':
            case 'cmd+c':
            case 'ctrl+c':
                return this.copy()

            case 'alt+v':
            case 'cmd+v':
            case 'ctrl+v':
                return this.paste()

            case 'cmd+z':
                return this.undo()

            case 'cmd+y':
            case 'shift+cmd+z':
                return this.redo()

            case 'cmd+j':
                return this.joinLines()

            case 'shift+up':
                return this.moveCursorAndSelect('up')

            case 'shift+down':
                return this.moveCursorAndSelect('down')

            case 'shift+left':
                return this.moveCursorAndSelect('left')

            case 'shift+right':
                return this.moveCursorAndSelect('right')

            case 'shift+cmd+right':
                return this.moveCursorAndSelect('eol')

            case 'shift+cmd+left':
                return this.moveCursorAndSelect('bol')

            case 'esc':
                return this.deselect()

        }

        return this.insert(key)
    }

    return editor
})()

export default editor;