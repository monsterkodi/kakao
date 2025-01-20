var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var args, KED

import ttio from "./ttio.js"

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
                return this.t.write('\x1b[A')

            case 'down':
                return this.t.write('\x1b[B')

            case 'left':
                return this.t.write('\x1b[D')

            case 'right':
                return this.t.write('\x1b[C')

        }

    }

    KED.prototype["onKey"] = function (key)
    {
        switch (key)
        {
            case 'up':
                return this.t.write('\x1b[A')

            case 'down':
                return this.t.write('\x1b[B')

            case 'left':
                return this.t.write('\x1b[D')

            case 'right':
                return this.t.write('\x1b[C')

            case 'ctrl+c':
                return process.exit(0)

        }

        return this.t.write(key)
    }

    KED.prototype["onResize"] = function (cols, rows)
    {}

    return KED
})()

export default KED.run;