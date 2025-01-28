var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var args, KED

import ttio from "./ttio.js"
import gutter from "./gutter.js"
import editor from "./editor.js"
import status from "./status.js"
import screen from "./screen.js"
import cells from "./cells.js"
import state from "./state.js"
import scroll from "./scroll.js"

import logfile from "./util/logfile.js"
import util from "./util/util.js"

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
        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["saveFile"] = this["saveFile"].bind(this)
        this["loadFile"] = this["loadFile"].bind(this)
        this["reloadFile"] = this["reloadFile"].bind(this)
        if (args.version)
        {
            console.log('0.0.2')
            process.exit(0)
        }
        this.t = new ttio
        this.log = new logfile
        global.lf = (function (...args)
        {
            return this.log.write(args.map(function (a)
            {
                return `${a}`
            }).join(' '))
        }).bind(this)
        this.screen = new screen(this.t)
        this.editor = new editor(this.screen)
        this.gutter = new gutter(this.screen,this.editor.state)
        this.scroll = new scroll(this.screen,this.editor.state)
        this.status = new status(this.screen,this.editor.state)
        this.editor.on('redraw',this.redraw)
        this.mouseHandlers = [this.scroll,this.editor]
        this.t.on('key',this.onKey)
        this.t.on('mouse',this.onMouse)
        this.t.on('resize',this.redraw)
        this.t.on('paste',this.editor.onPaste)
        this.t.on('wheel',this.editor.onWheel)
        this.t.on('focus',function ()
        {})
        this.t.on('blur',function ()
        {})
        if (!_k_.empty(args.options))
        {
            this.loadFile(args.options[0])
        }
        else
        {
            this.editor.state.syntax.ext = 'txt'
            this.editor.state.loadLines([''])
            this.t.setCursor(0,0)
            this.redraw()
        }
    }

    KED["run"] = function ()
    {
        return new KED()
    }

    KED.prototype["reloadFile"] = function ()
    {
        return this.loadFile(this.status.file)
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
        this.editor.state.syntax.ext = slash.ext(p)
        this.editor.state.loadLines(lines)
        this.status.drawTime = kstr.time(BigInt(process.hrtime(start)[1]))
        return this.redraw()
    }

    KED.prototype["saveFile"] = async function ()
    {
        var text

        text = this.editor.state.s.lines.asMutable().join('\n')
        if (!_k_.empty(this.status.file))
        {
            await nfs.write(slash.untilde(this.status.file),text)
            return this.reloadFile()
        }
    }

    KED.prototype["onMouse"] = function (event, col, row, button, mods, count)
    {
        var handler

        var list = _k_.list(this.mouseHandlers)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            handler = list[_a_]
            if (handler.onMouse(event,col,row,button,mods,count))
            {
                return this.redraw()
            }
        }
    }

    KED.prototype["onKey"] = function (key)
    {
        switch (key)
        {
            case 'alt+q':
            case 'ctrl+d':
            case 'ctrl+q':
                return this.t.quit()

            case 'alt+r':
            case 'ctrl+r':
            case 'cmd+r':
                return this.reloadFile()

            case 'ctrl+s':
            case 'cmd+s':
                return this.saveFile()

        }

        return this.editor.onKey(key)
    }

    KED.prototype["redraw"] = function ()
    {
        var g, h, start, w

        start = process.hrtime()
        w = this.t.cols()
        h = this.t.rows()
        g = this.editor.state.gutterWidth()
        this.status.gutter = g
        if (false)
        {
            this.scroll.cells.init(w - 1,0,1,h - 1)
            this.gutter.cells.init(0,0,g,h - 1)
            this.status.cells.init(0,h - 1,w,1)
            this.editor.cells.init(g,0,w - g - 1,h - 1)
        }
        else
        {
            this.scroll.cells.init(0,0,1,h - 1)
            this.gutter.cells.init(1,0,g,h - 1)
            this.status.cells.init(0,h - 1,w,1)
            this.editor.cells.init(g + 1,0,w - g - 1,h - 1)
        }
        this.t.hideCursor()
        this.screen.init()
        this.gutter.draw()
        this.scroll.draw()
        this.status.draw()
        this.editor.draw()
        this.screen.render()
        this.editor.showCursorIfInView()
        return this.status.drawTime = kstr.time(BigInt(process.hrtime(start)[1]))
    }

    return KED
})()

export default KED.run;