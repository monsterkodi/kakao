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
import konsole from "./konsole.js"

import logfile from "./util/logfile.js"
import util from "./util/util.js"

import kxk from "../kxk.js"
let karg = kxk.karg
let kstr = kxk.kstr
let slash = kxk.slash

import nfs from "../kxk/nfs.js"

args = karg(`ked [file]
    options                      **
    version    log version       = false`)

KED = (function ()
{
    function KED ()
    {
        this["redraw"] = this["redraw"].bind(this)
        this["onKonsoleRows"] = this["onKonsoleRows"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onPaste"] = this["onPaste"].bind(this)
        this["saveAs"] = this["saveAs"].bind(this)
        this["saveFile"] = this["saveFile"].bind(this)
        this["loadFile"] = this["loadFile"].bind(this)
        this["reloadFile"] = this["reloadFile"].bind(this)
        this["onException"] = this["onException"].bind(this)
        this.version = '0.0.2'
        if (args.version)
        {
            console.log(this.version)
            process.exit(0)
        }
        process.on('uncaughtException',this.onException)
        this.konsoleRows = 0
        this.t = new ttio
        this.logfile = new logfile
        global.lfc = (function (...args)
        {
            var _36_64_

            lf.apply(null,args)
            if ((global.lc != null))
            {
                return global.lc.apply(null,args)
            }
        }).bind(this)
        this.screen = new screen(this.t)
        this.editor = new editor(this.screen)
        this.konsole = new konsole(this.screen)
        this.gutter = new gutter(this.screen,this.editor.state)
        this.scroll = new scroll(this.screen,this.editor.state)
        this.status = new status(this.screen,this.editor.state)
        lfc('ked',this.version)
        this.editor.on('redraw',this.redraw)
        this.konsole.on('konsoleRows',this.onKonsoleRows)
        this.mouseHandlers = [this.scroll,this.konsole,this.editor]
        this.wheelHandlers = [this.konsole,this.editor]
        this.keyHandlers = [this.konsole,this.editor]
        this.t.on('key',this.onKey)
        this.t.on('mouse',this.onMouse)
        this.t.on('wheel',this.onWheel)
        this.t.on('resize',this.redraw)
        this.t.on('paste',this.onPaste)
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
        var ked

        return ked = new KED()
    }

    KED.prototype["onException"] = function (err)
    {
        this.t.quit()
        console.error(err)
        return process.exit(1)
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

    KED.prototype["saveAs"] = function ()
    {
        return lfc('saveAs')
    }

    KED.prototype["onPaste"] = function (text)
    {
        this.editor.state.insert(text)
        return this.redraw()
    }

    KED.prototype["onMouse"] = function (type, sx, sy, event)
    {
        var handler

        if (type === 'wheel')
        {
            var list = _k_.list(this.wheelHandlers)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                handler = list[_a_]
                handler.onWheel(sx,sy,event.dir,event.mods)
            }
        }
        else
        {
            var list1 = _k_.list(this.mouseHandlers)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                handler = list1[_b_]
                if (handler.onMouse(type,sx,sy,event))
                {
                    break
                }
            }
        }
        return this.redraw()
    }

    KED.prototype["onKey"] = function (key, event)
    {
        var handler

        switch (key)
        {
            case 'alt+q':
            case 'ctrl+q':
                this.t.quit()
                process.exit(0)
                break
            case 'alt+r':
            case 'ctrl+r':
            case 'cmd+r':
                return this.reloadFile()

            case 'ctrl+s':
            case 'cmd+s':
                return this.saveFile()

            case 'shift+cmd+s':
            case 'shift+ctrl+s':
                return this.saveAs()

        }

        var list = _k_.list(this.keyHandlers)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            handler = list[_a_]
            if (handler.onKey(key,event))
            {
                break
            }
        }
        return this.redraw()
    }

    KED.prototype["onKonsoleRows"] = function (konsoleRows)
    {
        this.konsoleRows = konsoleRows
    }

    KED.prototype["redraw"] = function ()
    {
        var c, g, h, s, start, w

        start = process.hrtime()
        w = this.t.cols()
        h = this.t.rows()
        s = 1
        c = this.konsoleRows
        g = this.editor.state.gutterWidth()
        this.status.gutter = g
        if (false)
        {
            this.scroll.cells.init(w - s,0,s,h - c - 1)
            this.gutter.cells.init(0,0,g,h - c - 1)
            this.status.cells.init(0,h - 1,w,1)
            this.editor.init(g,0,w - g - s,h - c - 1)
            this.konsole.init(0,h - 1 - c,w - g - s,c)
        }
        else
        {
            this.scroll.cells.init(0,0,s,h - c - 1)
            this.gutter.cells.init(s,0,g,h - c - 1)
            this.status.cells.init(0,h - 1,w,1)
            this.editor.init(g + s,0,w - g - s,h - c - 1)
            this.konsole.init(0,h - 1 - c,w - g - s,c)
        }
        this.screen.init()
        this.gutter.draw()
        this.scroll.draw()
        this.status.draw()
        this.editor.draw()
        this.konsole.draw()
        this.screen.render()
        return this.status.drawTime = kstr.time(BigInt(process.hrtime(start)[1]))
    }

    return KED
})()

export default KED.run;