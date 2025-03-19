var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.b8=_k_.k.F256(_k_.k.b(8));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2))

var KED

import kxk from "../kxk.js"
let karg = kxk.karg
let kstr = kxk.kstr
let kseg = kxk.kseg
let slash = kxk.slash
let post = kxk.post

import nfs from "../kxk/nfs.js"

import prjcts from "./index/prjcts.js"
import indexer from "./index/indexer.js"

import logfile from "./util/logfile.js"
import session from "./util/session.js"
import help from "./util/help.js"
import frecent from "./util/frecent.js"
import watcher from "./util/watcher.js"

import belt from "./edit/tool/belt.js"

import mode from "./edit/mode.js"

import view from "./view/base/view.js"

import status from "./view/status/status.js"

import fileeditor from "./view/editor/fileeditor.js"

import screen from "./view/screen/screen.js"
import ttio from "./view/screen/ttio.js"

import menu from "./view/menu/menu.js"
import finder from "./view/menu/finder.js"
import searcher from "./view/menu/searcher.js"
import context from "./view/menu/context.js"

import browse from "./view/colmns/browse.js"
import dircol from "./view/colmns/dircol.js"
import funcol from "./view/colmns/funcol.js"
import quicky from "./view/colmns/quicky.js"

global.int = parseInt

KED = (function ()
{
    function KED ()
    {
        this["draw"] = this["draw"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onViewSize"] = this["onViewSize"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["showFinderOrSearcher"] = this["showFinderOrSearcher"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onPaste"] = this["onPaste"].bind(this)
        this["saveAs"] = this["saveAs"].bind(this)
        this["saveSessionFile"] = this["saveSessionFile"].bind(this)
        this["saveFile"] = this["saveFile"].bind(this)
        this["loadFile"] = this["loadFile"].bind(this)
        this["onQuicky"] = this["onQuicky"].bind(this)
        this["openFile"] = this["openFile"].bind(this)
        this["reloadFile"] = this["reloadFile"].bind(this)
        this["onFileChange"] = this["onFileChange"].bind(this)
        this["newFile"] = this["newFile"].bind(this)
        this["quit"] = this["quit"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        this["onSessionLoaded"] = this["onSessionLoaded"].bind(this)
        this.version = '0.6.0'
        this.args = karg(`
ked [file]
    options                                       **
    new        start with empty buffer          = false
    fresh      don't load previous session      = false
    timeout    session save timeout in ms       = 1000
    version    log version                      = false
    `,{preHelp:help.header(),version:this.version})
        process.on('uncaughtException',this.quit)
        this.session = new session(this.args)
        this.logfile = new logfile(this.session.name)
        global.ked_session = this.session
        this.session.on('loaded',this.onSessionLoaded)
        this.t = new ttio
        this.screen = new screen(this.t)
        this.indexer = new indexer
        this.menu = new menu(this.screen)
        this.quicky = new quicky(this.screen)
        this.browse = new browse(this.screen)
        this.editor = new fileeditor(this.screen,'editor')
        this.dircol = new dircol(this.screen,'dircol',['scroll','knob'])
        this.funcol = new funcol(this.screen,'funcol',['scroll','knob'])
        this.finder = new finder(this.screen,this.editor.state)
        this.searcher = new searcher(this.screen,this.editor.state)
        this.status = new status(this.screen,this.editor.state)
        this.context = new context(this.screen)
        console.log(_k_.w2(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ${_k_.b8(this.session.name)} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
        this.editor.state.hasFocus = true
        post.on('redraw',this.redraw)
        post.on('window.focus',this.redraw)
        post.on('window.blur',this.redraw)
        post.on('view.size',this.onViewSize)
        post.on('quicky',this.onQuicky)
        post.on('file.new',this.newFile)
        post.on('file.open',this.openFile)
        post.on('quit',this.quit)
        post.on('file.change',this.onFileChange)
        this.contextHandlers = [this.editor,this.dircol,this.funcol]
        this.mouseHandlers = [this.context,this.finder,this.searcher,this.quicky,this.browse,this.menu,this.editor,this.status,this.dircol,this.funcol]
        this.wheelHandlers = [this.finder,this.searcher,this.quicky,this.browse,this.menu,this.editor,this.dircol,this.funcol]
        this.keyHandlers = [this.context,this.finder,this.searcher,this.quicky,this.browse,this.menu,this.editor,this.dircol,this.funcol]
        this.t.on('key',this.onKey)
        this.t.on('mouse',this.onMouse)
        this.t.on('wheel',this.onWheel)
        this.t.on('resize',this.onResize)
        this.t.on('paste',this.onPaste)
        if (!_k_.empty(this.args.options))
        {
            this.loadFile(this.args.options[0])
        }
        else if (this.args.fresh)
        {
            this.hideEditor()
            this.menu.show(true)
        }
        else if (this.args.new)
        {
            this.newFile()
        }
    }

    KED.prototype["showEditor"] = function ()
    {
        this.editor.show()
        this.status.show()
        this.dircol.show()
        return this.funcol.show()
    }

    KED.prototype["hideEditor"] = function ()
    {
        this.editor.hide()
        this.status.hide()
        this.dircol.hide()
        return this.funcol.hide()
    }

    KED["run"] = function ()
    {
        return new KED()
    }

    KED.prototype["onSessionLoaded"] = function ()
    {
        var file

        if (this.args.fresh)
        {
            return
        }
        if (this.args.new)
        {
            return
        }
        if (_k_.empty(this.currentFile))
        {
            if (file = ked_session.get("editor▸file"))
            {
                return this.loadFile(file)
            }
            else
            {
                this.hideEditor()
                return this.menu.show(true)
            }
        }
    }

    KED.prototype["arrange"] = function ()
    {
        var dcw, fcw, h, w

        w = this.t.cols()
        h = this.t.rows()
        dcw = this.dircol.cells.cols
        fcw = this.funcol.cells.cols
        if (this.dircol.hidden() || !this.dircol.active)
        {
            dcw = 0
        }
        if (this.funcol.hidden() || !this.funcol.active)
        {
            fcw = 0
        }
        if (this.viewSizeDelta)
        {
            switch (this.viewSizeDelta.name)
            {
                case this.dircol.name:
                    dcw = this.dircol.cells.cols + this.viewSizeDelta.delta
                    break
                case this.funcol.name:
                    fcw = this.funcol.cells.cols + this.viewSizeDelta.delta
                    break
            }

            delete this.viewSizeDelta
        }
        if (this.dircol.visible() && this.dircol.active)
        {
            this.dircol.layout(0,0,dcw,h)
        }
        if (this.funcol.visible() && this.funcol.active)
        {
            this.funcol.layout(w - fcw,1,fcw,h - 1)
        }
        this.status.layout(dcw,0,w - dcw,1)
        return this.editor.layout(dcw,1,w - dcw - fcw,h - 1)
    }

    KED.prototype["quit"] = async function (msg)
    {
        var _190_10_

        clearImmediate(this.redrawId)
        this.quitting = true
        await this.session.save()
        console.log(_k_.w2(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ${_k_.b8(this.session.name)} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`))
        if ((msg != null))
        {
            if (msg.stack)
            {
                console.error(msg.stack)
            }
            console.error(`${_k_.y5(msg)}`)
        }
        ;(this.t != null ? this.t.quit() : undefined)
        return this.logfile.close(function ()
        {
            if ((msg != null ? msg.stack : undefined))
            {
                process.stderr.write(`${_k_.r4(msg.stack)}\n`)
            }
            if ((msg != null))
            {
                process.stderr.write(`${_k_.y5(msg)}`)
            }
            return process.exit(((msg != null) ? 1 : 0))
        })
    }

    KED.prototype["newFile"] = function ()
    {
        var _215_22_

        delete this.currentFile
        this.status.setFile('')
        this.editor.state.syntax.ext = 'txt'
        this.editor.state.loadLines([''])
        this.t.setCursor(0,0)
        this.t.setTitle('kėd')
        ;(this.editor.mapscr != null ? this.editor.mapscr.reload() : undefined)
        this.showEditor()
        return this.redraw()
    }

    KED.prototype["onFileChange"] = function (event)
    {
        if (event.path === this.currentFile)
        {
            switch (event.change)
            {
                case 'delete':
                    return this.newFile()

                case 'rename':
                    return this.reloadFile()

            }

        }
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

    KED.prototype["openFile"] = function (path, row, col, view)
    {
        this.loadFile(path,row,col,view)
        return this.editor.grabFocus()
    }

    KED.prototype["onQuicky"] = async function (path)
    {
        var file

        if (!_k_.empty(this.loadingFile))
        {
            return
        }
        if (slash.isAbsolute(path))
        {
            file = path
        }
        else
        {
            file = slash.absolute(path,slash.dir(this.currentFile))
        }
        if (slash.samePath(file,this.currentFile))
        {
            return
        }
        return await this.loadFile(file)
    }

    KED.prototype["loadFile"] = async function (p, row, col, view)
    {
        var absFile, colors, exists, segls, start, text, _333_22_

        start = process.hrtime()
        if (slash.isAbsolute(p))
        {
            absFile = slash.absolute(p)
        }
        else
        {
            absFile = slash.path(process.cwd(),p)
        }
        if (slash.samePath(absFile,this.loadingFile))
        {
            return
        }
        this.loadingFile = absFile
        exists = await nfs.fileExists(this.loadingFile)
        if (!exists)
        {
            console.log(`file doesn't exist! ${this.loadingFile}`)
            delete this.loadingFile
            return
        }
        this.loadingFile = await nfs.resolveSymlink(this.loadingFile)
        text = await nfs.readText(this.loadingFile)
        this.currentFile = this.loadingFile
        delete this.loadingFile
        this.status.setFile(slash.tilde(this.currentFile))
        global.ked_editor_file = this.currentFile
        if (text === undefined)
        {
            text = '○ binary ○'
        }
        var _a_ = belt.colorSeglsForText(text); colors = _a_[0]; segls = _a_[1]

        if (!_k_.empty(colors))
        {
            this.editor.state.syntax.ext = '__ansi__'
            console.log('colors',colors)
            this.editor.state.syntax.setColors(colors)
        }
        else
        {
            this.editor.state.syntax.ext = slash.ext(this.currentFile)
        }
        this.editor.state.loadSegls(segls)
        this.status.time = process.hrtime(start)[1]
        ;(this.editor.mapscr != null ? this.editor.mapscr.reload() : undefined)
        ked_session.set("editor▸file",this.currentFile)
        mode.fileLoaded(this.editor.state,this.currentFile,row,col,view)
        post.emit('file.loaded',this.currentFile)
        this.showEditor()
        this.redraw()
        this.indexer.index(this.currentFile)
        prjcts.index(this.currentFile)
        watcher.watch(this.currentFile)
        this.t.setTitle(slash.name(this.status.file))
        this.saveSessionFile(this.currentFile,'loaded')
        return this
    }

    KED.prototype["saveFile"] = async function ()
    {
        var text

        text = kseg.str(this.editor.state.s.lines)
        if (!_k_.empty(this.currentFile))
        {
            await nfs.write(this.currentFile,text)
            this.editor.state.clearHistory()
            this.redraw()
            return this.saveSessionFile(this.currentFile,'saved')
        }
    }

    KED.prototype["saveSessionFile"] = function (file, type)
    {
        frecent.fileAction(file,type)
        return this.session.set('files▸recent',frecent.store('file'))
    }

    KED.prototype["saveAs"] = function ()
    {
        console.log('todo: saveAs')
    }

    KED.prototype["onPaste"] = function (text)
    {
        this.editor.state.insert(text)
        return this.redraw()
    }

    KED.prototype["onMouse"] = function (event)
    {
        var handler, redraw, ret

        if (event.type === 'wheel')
        {
            var list = _k_.list(this.wheelHandlers)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                handler = list[_a_]
                if (ret = handler.onWheel(event))
                {
                    if (ret.redraw === true)
                    {
                        this.redraw()
                    }
                    return
                }
            }
            return
        }
        redraw = false
        var list1 = _k_.list(this.mouseHandlers)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            handler = list1[_b_]
            if (ret = handler.onMouse(event))
            {
                event.handled = true
                if (ret.redraw === true)
                {
                    redraw = true
                }
                if (event.type !== 'move' || _k_.in(handler.name,view.popups))
                {
                    break
                }
            }
        }
        if (event.button === 'right')
        {
            var list2 = _k_.list(this.contextHandlers)
            for (var _c_ = 0; _c_ < list2.length; _c_++)
            {
                handler = list2[_c_]
                if (ret = handler.onContext(event))
                {
                    if (ret.redraw === true)
                    {
                        redraw = true
                    }
                    break
                }
            }
        }
        if (redraw)
        {
            return this.redraw()
        }
    }

    KED.prototype["showFinderOrSearcher"] = function ()
    {
        if (this.finder.visible() && !_k_.empty(this.finder.input.current()))
        {
            return this.searcher.show(this.finder.input.current())
        }
        else
        {
            return this.finder.show()
        }
    }

    KED.prototype["onKey"] = function (key, event)
    {
        var handler, result

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

            case 'alt+.':
            case 'alt+m':
                return this.menu.show()

            case 'cmd+p':
            case 'ctrl+p':
                return this.quicky.showProjectFiles(this.currentFile)

            case 'cmd+f':
            case 'ctrl+f':
                return this.showFinderOrSearcher()

            case 'shift+cmd+f':
            case 'shift+ctrl+f':
                return this.searcher.show()

            case 'cmd+o':
            case 'ctrl+o':
            case 'cmd+.':
            case 'ctrl+.':
                return this.browse.gotoDir(slash.dir(this.currentFile))

            case "cmd+'":
            case "ctrl+'":
                return post.emit('funcol.toggle')

        }

        var list = _k_.list(this.keyHandlers)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            handler = list[_a_]
            if (handler.hidden())
            {
                continue
            }
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

    KED.prototype["onViewSize"] = function (name, side, delta)
    {
        this.viewSizeDelta = {name:name,side:side,delta:delta}
        return this.redraw()
    }

    KED.prototype["onResize"] = function (cols, rows, size)
    {
        var mcw, _489_22_

        mcw = parseInt(cols / 6)
        if (mcw >= 16)
        {
            this.dircol.cells.cols = mcw
            this.funcol.cells.cols = mcw
            this.dircol.show()
            this.funcol.show()
        }
        else
        {
            this.dircol.hide()
            this.funcol.hide()
        }
        this.redraw()
        return (this.editor.mapscr != null ? this.editor.mapscr.onResize() : undefined)
    }

    KED.prototype["redraw"] = function ()
    {
        if (this.quitting)
        {
            return
        }
        clearImmediate(this.redrawId)
        return this.redrawId = setImmediate(this.draw)
    }

    KED.prototype["draw"] = function ()
    {
        var start

        if (this.quitting)
        {
            return
        }
        start = process.hrtime()
        this.status.gutter = this.editor.state.gutterWidth()
        this.screen.init()
        this.arrange()
        if (this.menu.greet.hidden())
        {
            this.editor.draw()
            this.status.draw()
            this.dircol.draw()
            this.funcol.draw()
        }
        this.menu.draw()
        this.quicky.draw()
        this.browse.draw()
        this.finder.draw()
        this.searcher.draw()
        this.context.draw()
        this.screen.render()
        return this.status.time = process.hrtime(start)[1]
    }

    return KED
})()

export default KED.run;
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    KED.run()
}