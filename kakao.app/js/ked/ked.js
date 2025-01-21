var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var args, KED

import ttio from "./ttio.js"
import linenr from "./linenr.js"
import cells from "./cells.js"
import state from "./state.js"

import kxk from "../kxk.js"
let karg = kxk.karg

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
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["setCursor"] = this["setCursor"].bind(this)
        this["moveCursor"] = this["moveCursor"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["loadFile"] = this["loadFile"].bind(this)
        this.t = new ttio
        this.cells = new cells(this.t)
        this.state = new state(this.cells)
        this.linenr = new linenr(this.cells,this.state)
        this.t.on('key',this.onKey)
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
            console.log('file(s):',args.options)
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
        var lines, text

        text = await nfs.read(p)
        lines = text.split(/\r?\n/)
        console.log('lines',lines)
        this.state.init(lines)
        return this.onResize(this.t.cols(),this.t.rows())
    }

    KED.prototype["onMouse"] = function (event, col, row, button)
    {
        switch (event)
        {
            case 'press':
                if (this.state.setCursor(col - this.state.s.view[0] - 5,row - this.state.s.view[1] - 1))
                {
                    return this.redraw()
                }
                break
        }

    }

    KED.prototype["moveCursor"] = function (dir, steps)
    {
        if (this.state.moveCursor(dir,steps))
        {
            return this.redraw()
        }
    }

    KED.prototype["setCursor"] = function (x, y)
    {
        if (this.state.setCursor(x,y))
        {
            return this.redraw()
        }
    }

    KED.prototype["onWheel"] = function (dir, mods)
    {
        var steps

        steps = ((function ()
        {
            switch (mods)
            {
                case 'shift':
                    return 2

                case 'shift+ctrl':
                    return 4

                case 'alt':
                    return 8

                case 'shift+alt':
                    return 16

                case 'ctrl+alt':
                    return 32

                case 'shift+ctrl+alt':
                    return 64

                default:
                    return 1
            }

        }).bind(this))()
        switch (dir)
        {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                return this.moveCursor(dir,steps)

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

            case 'shift+ctrl+h':
                return this.setCursor(this.state.s.lines.slice(-1)[0].length,this.state.s.lines.length - 1)

            case 'ctrl+k':
                return this.t.write('\x1b[0K')

            case 'return':
                return this.t.write('\n')

            case 'space':
                return this.t.write(' ')

            case 'delete':
                return this.t.write('\x1b[D\x1b[P')

            case 'tab':
                return this.t.write('    ')

            case 'ctrl+c':
                return process.exit(0)

            case 'ctrl+q':
                return process.exit(0)

        }

        return this.t.write(key)
    }

    KED.prototype["onResize"] = function (cols, rows)
    {
        return this.redraw()
    }

    KED.prototype["redraw"] = function ()
    {
        this.t.hideCursor()
        this.cells.init()
        this.linenr.draw()
        this.state.draw()
        this.cells.render()
        return this.t.showCursor()
    }

    return KED
})()

export default KED.run;