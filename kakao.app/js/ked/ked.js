var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var args, KED

import ttio from "./ttio.js"
import gutter from "./gutter.js"
import status from "./status.js"
import cells from "./cells.js"
import state from "./state.js"
import draw from "./draw.js"
import logfile from "./logfile.js"
import scroll from "./scroll.js"
import color from "./color.js"
import util from "./util.js"

import kxk from "../kxk.js"
let karg = kxk.karg
let kstr = kxk.kstr
let slash = kxk.slash

import nfs from "../kxk/nfs.js"

args = karg(`ked [file]
    options                                   **
    version    log version                    = false`)

KED = (function ()
{
    function KED ()
    {
        this["redraw"] = this["redraw"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onPaste"] = this["onPaste"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["scrollView"] = this["scrollView"].bind(this)
        this["showCursorIfInView"] = this["showCursorIfInView"].bind(this)
        this["setCursor"] = this["setCursor"].bind(this)
        this["moveCursor"] = this["moveCursor"].bind(this)
        this["moveCursorAndSelect"] = this["moveCursorAndSelect"].bind(this)
        this["joinLines"] = this["joinLines"].bind(this)
        this["delete"] = this["delete"].bind(this)
        this["insert"] = this["insert"].bind(this)
        this["paste"] = this["paste"].bind(this)
        this["copy"] = this["copy"].bind(this)
        this["cut"] = this["cut"].bind(this)
        this["saveFile"] = this["saveFile"].bind(this)
        this["reloadFile"] = this["reloadFile"].bind(this)
        this["loadFile"] = this["loadFile"].bind(this)
        this.t = new ttio
        this.log = new logfile
        global.lf = (function (...args)
        {
            return this.log.write(args.map(function (a)
            {
                return `${a}`
            }).join(' '))
        }).bind(this)
        this.cells = new cells(this.t)
        this.state = new state(this.cells)
        this.draw = new draw(this.cells)
        this.gutter = new gutter(this.cells,this.state)
        this.scroll = new scroll(this.cells,this.state)
        this.status = new status(this.cells,this.state)
        this.mouseHandlers = [this.scroll]
        this.t.on('key',this.onKey)
        this.t.on('paste',this.onPaste)
        this.t.on('mouse',this.onMouse)
        this.t.on('wheel',this.onWheel)
        this.t.on('resize',this.onResize)
        this.t.on('focus',function ()
        {})
        this.t.on('blur',function ()
        {})
        if (args.version)
        {
            console.log('0.0.1')
            process.exit(0)
        }
        if (!_k_.empty(args.options))
        {
            this.loadFile(args.options[0])
        }
        else
        {
            this.state.init([''])
            this.t.setCursor(4,0)
            this.onResize(this.t.cols(),this.t.rows())
        }
    }

    KED["run"] = function ()
    {
        return new KED()
    }

    KED.prototype["loadFile"] = async function (p)
    {
        var lines, start, text

        start = process.hrtime()
        if (slash.isAbsolute(p))
        {
            this.status.file = slash.tilde(p)
        }
        else
        {
            this.status.file = slash.normalize(p)
        }
        text = await nfs.read(slash.untilde(p))
        lines = text.split(/\r?\n/)
        this.state.syntax.ext = slash.ext(p)
        this.state.loadLines(lines)
        this.status.drawTime = kstr.time(BigInt(process.hrtime(start)[1]))
        return this.redraw()
    }

    KED.prototype["reloadFile"] = function ()
    {
        return this.loadFile(this.status.file)
    }

    KED.prototype["saveFile"] = async function ()
    {
        var text

        text = this.state.s.lines.asMutable().join('\n')
        await nfs.write(slash.untilde(this.status.file),text)
        return this.reloadFile()
    }

    KED.prototype["cut"] = function ()
    {
        this.state.cut()
        return this.redraw()
    }

    KED.prototype["copy"] = function ()
    {
        return this.state.copy()
    }

    KED.prototype["paste"] = function ()
    {
        this.state.paste()
        return this.redraw()
    }

    KED.prototype["insert"] = function (text)
    {
        this.state.insert(text)
        return this.redraw()
    }

    KED.prototype["delete"] = function (type)
    {
        this.state.delete(type)
        return this.redraw()
    }

    KED.prototype["joinLines"] = function ()
    {
        this.state.joinLines()
        return this.redraw()
    }

    KED.prototype["moveCursorAndSelect"] = function (dir)
    {
        this.state.moveCursorAndSelect(dir)
        return this.redraw()
    }

    KED.prototype["moveCursor"] = function (dir, steps)
    {
        this.state.moveCursor(dir,steps)
        return this.redraw()
    }

    KED.prototype["setCursor"] = function (x, y)
    {
        this.state.setCursor(x,y)
        return this.redraw()
    }

    KED.prototype["showCursorIfInView"] = function ()
    {
        var show

        show = util.isPosInsideRange(this.state.s.cursor,this.state.rangeForVisibleLines())
        if (this.state.s.cursor[0] < this.state.s.view[0])
        {
            show = false
        }
        return this.t.showCursor(show)
    }

    KED.prototype["scrollView"] = function (dir, steps)
    {
        this.state.scrollView(dir,steps)
        return this.redraw()
    }

    KED.prototype["onMouse"] = function (event, col, row, button, mods, count)
    {
        var handler, start, x, y

        var list = _k_.list(this.mouseHandlers)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            handler = list[_a_]
            if (handler.onMouse(event,col,row,button,mods,count))
            {
                this.redraw()
                return
            }
        }
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
                    return this.redraw()
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
                    return this.redraw()
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
                        return this.redraw()
                    }
                }
                break
            case 'release':
                return delete this.dragStart

        }

    }

    KED.prototype["onWheel"] = function (dir, mods)
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

    KED.prototype["onKey"] = function (key)
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

            case 'alt+q':
            case 'ctrl+d':
            case 'ctrl+q':
                return this.t.quit()

            case 'alt+c':
            case 'cmd+c':
            case 'ctrl+c':
                return this.copy()

            case 'alt+x':
            case 'cmd+x':
            case 'ctrl+x':
                return this.cut()

            case 'alt+v':
            case 'cmd+v':
            case 'ctrl+v':
                return this.paste()

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

            case 'alt+r':
            case 'ctrl+r':
            case 'cmd+r':
                return this.reloadFile()

            case 'ctrl+s':
            case 'cmd+s':
                return this.saveFile()

            case 'esc':
                this.state.deselect()
                this.redraw()
                return

        }

        return this.insert(key)
    }

    KED.prototype["onPaste"] = function (text)
    {
        lf(`onPaste ${text.length} >>>${text}<<<`)
        return this.insert(text)
    }

    KED.prototype["onResize"] = function (cols, rows)
    {
        return this.redraw()
    }

    KED.prototype["redraw"] = function ()
    {
        var start

        start = process.hrtime()
        this.t.store()
        this.t.hideCursor()
        this.cells.init()
        this.gutter.draw()
        this.scroll.draw()
        this.status.draw()
        this.draw.state(this.state)
        this.cells.render()
        this.showCursorIfInView()
        this.t.restore()
        return this.status.drawTime = kstr.time(BigInt(process.hrtime(start)[1]))
    }

    return KED
})()

export default KED.run;