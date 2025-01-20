var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var args, KED

import ttio from "./ttio.js"
import linenr from "./linenr.js"
import cells from "./cells.js"

import kxk from "../kxk.js"
let karg = kxk.karg

args = karg(`ked [file]
    options                                   **
    version    log version                    = false`)

KED = (function ()
{
    function KED ()
    {
        this["onResize"] = this["onResize"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this.t = new ttio
        this.cells = new cells(this.t)
        this.linenr = new linenr(this.cells)
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
        }
        this.t.setCursor(4,0)
        this.onResize(this.t.cols(),this.t.rows())
    }

    KED["run"] = function ()
    {
        return new KED()
    }

    KED.prototype["onMouse"] = function (event, col, row, button)
    {
        switch (event)
        {
            case 'press':
                return this.t.write(`\x1b[${row};${col}H`)

        }

    }

    KED.prototype["onWheel"] = function (dir)
    {
        switch (dir)
        {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                return this.t.moveCursor(dir)

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
                return this.t.moveCursor(key)

            case 'ctrl+a':
                return this.t.write('\x1b[0G')

            case 'ctrl+e':
                return this.t.write(`\x1b[${this.t.cols()}G`)

            case 'ctrl+h':
                return this.t.write('\x1b[H')

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
        this.t.hideCursor()
        this.cells.init()
        this.linenr.draw()
        this.cells.render()
        return this.t.showCursor()
    }

    return KED
})()

export default KED.run;