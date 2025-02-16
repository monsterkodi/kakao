var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var KED

import kxk from "../kxk.js"
let karg = kxk.karg
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post

import nfs from "../kxk/nfs.js"

import screen from "./view/screen.js"
import cells from "./view/cells.js"
import status from "./view/status.js"
import quicky from "./view/quicky.js"
import menu from "./view/menu.js"

import logfile from "./util/logfile.js"
import util from "./util/util.js"
import prjcts from "./util/prjcts.js"
import session from "./util/session.js"
import color from "./util/color.js"
import help from "./util/help.js"

import ttio from "./ttio.js"
import editor from "./editor.js"
import state from "./state.js"
import konsole from "./konsole.js"


KED = (function ()
{
    function KED ()
    {
        var args

        this["draw"] = this["draw"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onViewSize"] = this["onViewSize"].bind(this)
        this["onQuicky"] = this["onQuicky"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onPaste"] = this["onPaste"].bind(this)
        this["saveAs"] = this["saveAs"].bind(this)
        this["saveFile"] = this["saveFile"].bind(this)
        this["loadFile"] = this["loadFile"].bind(this)
        this["reloadFile"] = this["reloadFile"].bind(this)
        this["newFile"] = this["newFile"].bind(this)
        this["onException"] = this["onException"].bind(this)
        this["quit"] = this["quit"].bind(this)
        this.version = '0.0.4'
        args = karg(`
ked [file]
    options                      **
    version    log version       = false
    `,{preHelp:help.header(),version:this.version})
        process.on('uncaughtException',this.onException)
        this.viewSizes = {konsole:[0,0]}
        this.logfile = new logfile
        this.session = new session
        this.t = new ttio
        global.lfc = (function (...args)
        {
            var _39_64_

            lf.apply(null,args)
            if ((global.lc != null))
            {
                return global.lc.apply(null,args)
            }
        }).bind(this)
        this.screen = new screen(this.t)
        this.menu = new menu(this.screen)
        this.quicky = new quicky(this.screen)
        this.editor = new editor(this.screen,'editor',['scroll','gutter','mapscr'])
        this.konsole = new konsole(this.screen,'konsole',['scroll','gutter','mapscr','knob'])
        this.status = new status(this.screen,this.editor.state)
        lfc(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ked ${this.version} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`)
        this.editor.state.hasFocus = true
        post.on('redraw',this.redraw)
        post.on('window.focus',this.redraw)
        post.on('window.blur',this.redraw)
        post.on('view.size',this.onViewSize)
        post.on('quicky',this.onQuicky)
        post.on('file.new',this.newFile)
        post.on('quit',this.quit)
        this.mouseHandlers = [this.quicky,this.menu,this.konsole,this.editor]
        this.wheelHandlers = [this.quicky,this.menu,this.konsole,this.editor]
        this.keyHandlers = [this.quicky,this.menu,this.konsole,this.editor]
        this.t.on('key',this.onKey)
        this.t.on('mouse',this.onMouse)
        this.t.on('wheel',this.onWheel)
        this.t.on('resize',this.onResize)
        this.t.on('paste',this.onPaste)
        if (!_k_.empty(args.options))
        {
            this.loadFile(args.options[0])
        }
        else
        {
            this.newFile()
            this.menu.show(true)
        }
    }

    KED["run"] = function ()
    {
        return new KED()
    }

    KED.prototype["quit"] = async function (msg)
    {
        var _90_10_

        await this.session.save()
        lf("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛")
        ;(this.t != null ? this.t.quit() : undefined)
        return this.logfile.close(function ()
        {
            if ((msg != null))
            {
                console.error(msg)
            }
            return process.exit(((msg != null) ? 1 : 0))
        })
    }

    KED.prototype["onException"] = function (err)
    {
        return this.quit(err)
    }

    KED.prototype["newFile"] = function ()
    {
        var _112_22_

        delete this.currentFile
        this.status.file = ''
        this.editor.state.syntax.ext = 'txt'
        this.editor.state.loadLines([''])
        this.t.setCursor(0,0)
        ;(this.editor.mapscr != null ? this.editor.mapscr.reload() : undefined)
        return this.redraw()
    }

    KED.prototype["reloadFile"] = function ()
    {
        if (!_k_.empty(this.currentFile))
        {
            return this.loadFile(this.currentFile)
        }
        else
        {
            return this.newFile()
        }
    }

    KED.prototype["loadFile"] = async function (p)
    {
        var lines, start, text, _152_22_

        start = process.hrtime()
        if (slash.isAbsolute(p))
        {
            this.status.file = slash.tilde(p)
            this.currentFile = slash.absolute(p)
        }
        else
        {
            this.status.file = slash.normalize(p)
            this.currentFile = slash.path(process.cwd(),p)
        }
        this.currentFile = await nfs.resolveSymlink(this.currentFile)
        text = await nfs.read(this.currentFile)
        lines = util.linesForText(text)
        this.editor.state.syntax.ext = slash.ext(this.currentFile)
        this.editor.state.loadLines(lines)
        this.status.drawTime = kstr.time(BigInt(process.hrtime(start)[1]))
        ;(this.editor.mapscr != null ? this.editor.mapscr.reload() : undefined)
        this.redraw()
        prjcts.index(this.currentFile)
        return this
    }

    KED.prototype["saveFile"] = async function ()
    {
        var text

        text = this.editor.state.s.lines.asMutable().join('\n')
        if (!_k_.empty(this.currentFile))
        {
            await nfs.write(this.currentFile,text)
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

    KED.prototype["onMouse"] = function (event)
    {
        var handler

        if (event.type === 'wheel')
        {
            var list = _k_.list(this.wheelHandlers)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                handler = list[_a_]
                if (handler.onWheel(event))
                {
                    break
                }
            }
        }
        else
        {
            var list1 = _k_.list(this.mouseHandlers)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                handler = list1[_b_]
                if (handler.onMouse(event))
                {
                    break
                }
            }
        }
        return this.redraw()
    }

    KED.prototype["onKey"] = function (key, event)
    {
        var handler, result, _227_99_

        switch (key)
        {
            case 'alt+q':
            case 'ctrl+q':
            case 'cmd+esc':
                return this.quit()

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

            case 'cmd+n':
            case 'ctrl+n':
                return this.newFile()

            case 'alt+m':
                return this.menu.show()

            case 'cmd+p':
            case 'ctrl+p':
                return this.quicky.toggle(this.currentFile)

            case 'cmd+.':
            case 'ctrl+.':
                return this.quicky.gotoDirectory(((_227_99_=slash.dir(this.currentFile)) != null ? _227_99_ : process.cwd()))

        }

        var list = _k_.list(this.keyHandlers)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            handler = list[_a_]
            if (result = handler.onKey(key,event))
            {
                break
            }
        }
        if ((result != null ? result.redraw : undefined) !== false)
        {
            return this.redraw()
        }
    }

    KED.prototype["onQuicky"] = async function (event)
    {
        var exists, file

        if (slash.isAbsolute(event))
        {
            file = event
        }
        else
        {
            file = slash.absolute(event,slash.dir(this.currentFile))
        }
        if (slash.samePath(file,this.currentFile))
        {
            return
        }
        exists = await nfs.fileExists(file)
        if (exists)
        {
            return await this.loadFile(file)
        }
    }

    KED.prototype["onViewSize"] = function (name, x, y)
    {
        var _263_22_, _264_23_

        this.viewSizes[name] = [x,_k_.min(y,this.screen.rows - 1)]
        ;(this.editor.mapscr != null ? this.editor.mapscr.onResize() : undefined)
        return (this.konsole.mapscr != null ? this.konsole.mapscr.onResize() : undefined)
    }

    KED.prototype["onResize"] = function (cols, rows, size)
    {
        var _269_22_, _270_23_

        this.redraw()
        ;(this.editor.mapscr != null ? this.editor.mapscr.onResize() : undefined)
        return (this.konsole.mapscr != null ? this.konsole.mapscr.onResize() : undefined)
    }

    KED.prototype["redraw"] = function ()
    {
        clearImmediate(this.redrawId)
        return this.redrawId = setImmediate(this.draw)
    }

    KED.prototype["draw"] = function ()
    {
        var h, k, start, w

        start = process.hrtime()
        w = this.t.cols()
        h = this.t.rows()
        k = this.viewSizes.konsole[1]
        this.status.gutter = this.editor.state.gutterWidth()
        this.status.init(0,h - 1,w,1)
        this.editor.init(0,0,w,h - k - 1)
        this.konsole.init(0,h - k - 1,w,k)
        this.screen.init()
        if (!this.menu.greet)
        {
            this.editor.draw()
            this.status.draw()
            this.konsole.draw()
        }
        this.menu.draw()
        this.quicky.draw()
        this.screen.render()
        return this.status.drawTime = kstr.time(BigInt(process.hrtime(start)[1]))
    }

    return KED
})()

export default KED.run;
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    KED.run()
}