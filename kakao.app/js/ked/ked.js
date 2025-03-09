var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.prototype.hasOwnProperty(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }};_k_.b8=_k_.k.F256(_k_.k.b(8));_k_.w2=_k_.k.F256(_k_.k.w(2))

var KED

import kxk from "../kxk.js"
let karg = kxk.karg
let kstr = kxk.kstr
let kseg = kxk.kseg
let slash = kxk.slash
let post = kxk.post

import nfs from "../kxk/nfs.js"

import logfile from "./util/logfile.js"
import prjcts from "./util/prjcts.js"
import session from "./util/session.js"
import help from "./util/help.js"
import julia from "./util/julia.js"
import frecent from "./util/frecent.js"
import watcher from "./util/watcher.js"

import view from "./view/base/view.js"

import quicky from "./view/menu/quicky.js"
import menu from "./view/menu/menu.js"
import finder from "./view/menu/finder.js"

import status from "./view/status/status.js"

import screen from "./view/screen/screen.js"
import ttio from "./view/screen/ttio.js"

import funcol from "./view/funcol/funcol.js"

import fileeditor from "./view/editor/fileeditor.js"

import belt from "./edit/tool/belt.js"

import mode from "./edit/mode.js"

global.int = parseInt

KED = (function ()
{
    function KED ()
    {
        var args

        this["draw"] = this["draw"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onViewResize"] = this["onViewResize"].bind(this)
        this["onViewSize"] = this["onViewSize"].bind(this)
        this["onQuicky"] = this["onQuicky"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onPaste"] = this["onPaste"].bind(this)
        this["saveAs"] = this["saveAs"].bind(this)
        this["saveFile"] = this["saveFile"].bind(this)
        this["openFile"] = this["openFile"].bind(this)
        this["loadFile"] = this["loadFile"].bind(this)
        this["reloadFile"] = this["reloadFile"].bind(this)
        this["onFileChange"] = this["onFileChange"].bind(this)
        this["newFile"] = this["newFile"].bind(this)
        this["onException"] = this["onException"].bind(this)
        this["quit"] = this["quit"].bind(this)
        this["onSessionLoaded"] = this["onSessionLoaded"].bind(this)
        this.version = '0.3.1'
        args = karg(`
ked [file]
    options                      **
    version    log version       = false
    `,{preHelp:help.header(),version:this.version})
        process.on('uncaughtException',this.onException)
        this.session = new session
        this.logfile = new logfile(this.session.name)
        global.ked_session = this.session
        this.session.on('loaded',this.onSessionLoaded)
        this.viewSizes = {funcol:[20,0]}
        this.t = new ttio
        this.julia = new julia
        this.screen = new screen(this.t)
        this.menu = new menu(this.screen)
        this.quicky = new quicky(this.screen)
        this.finder = new finder(this.screen)
        this.editor = new fileeditor(this.screen,'editor',['scroll','gutter','mapscr','complete','salter','uniko','vimple','unype','brckts','filepos'])
        this.funcol = new funcol(this.screen,'funcol',['scroll','knob'])
        this.status = new status(this.screen,this.editor.state)
        console.log(_k_.w2(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ${_k_.b8(this.session.name)} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
        this.editor.state.hasFocus = true
        post.on('redraw',this.redraw)
        post.on('window.focus',this.redraw)
        post.on('window.blur',this.redraw)
        post.on('view.size',this.onViewSize)
        post.on('view.resize',this.onViewResize)
        post.on('quicky',this.onQuicky)
        post.on('file.new',this.newFile)
        post.on('file.open',this.openFile)
        post.on('quit',this.quit)
        post.on('fs.change',this.onFileChange)
        this.mouseHandlers = [this.finder,this.quicky,this.menu,this.editor,this.status,this.funcol]
        this.wheelHandlers = [this.finder,this.quicky,this.menu,this.editor,this.funcol]
        this.keyHandlers = [this.finder,this.quicky,this.menu,this.editor,this.funcol]
        this.t.on('key',this.onKey)
        this.t.on('mouse',this.onMouse)
        this.t.on('wheel',this.onWheel)
        this.t.on('resize',this.onResize)
        this.t.on('paste',this.onPaste)
        if (!_k_.empty(args.options))
        {
            this.loadFile(args.options[0])
        }
    }

    KED.prototype["onSessionLoaded"] = function ()
    {
        var file

        if (_k_.empty(this.currentFile))
        {
            if (file = ked_session.get("editor▸file"))
            {
                return this.loadFile(file)
            }
            else
            {
                return this.menu.show(true)
            }
        }
    }

    KED["run"] = function ()
    {
        return new KED()
    }

    KED.prototype["layout"] = function ()
    {
        var fcw, h, w

        w = this.t.cols()
        h = this.t.rows()
        fcw = this.viewSizes.funcol[0]
        this.funcol.layout(0,0,fcw,h)
        this.status.layout(fcw,0,w - fcw,1)
        return this.editor.layout(fcw,1,w - fcw,h - 1)
    }

    KED.prototype["quit"] = async function (msg)
    {
        var _138_10_

        clearImmediate(this.redrawId)
        this.quitting = true
        await this.session.save()
        console.log(_k_.w2(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ${_k_.b8(this.session.name)} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`))
        if ((msg != null))
        {
            console.error(`${msg}`,_k_.noon((msg)))
        }
        ;(this.t != null ? this.t.quit() : undefined)
        return this.logfile.close(function ()
        {
            if ((msg != null))
            {
                process.stderr.write(`${msg}`)
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
        var _166_22_

        delete this.currentFile
        this.status.setFile('')
        this.editor.state.syntax.ext = 'txt'
        this.editor.state.loadLines([''])
        this.t.setCursor(0,0)
        this.t.setTitle('kėd')
        ;(this.editor.mapscr != null ? this.editor.mapscr.reload() : undefined)
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

    KED.prototype["loadFile"] = async function (p)
    {
        var segls, start, text, _219_22_

        start = process.hrtime()
        if (slash.isAbsolute(p))
        {
            this.currentFile = slash.absolute(p)
        }
        else
        {
            this.currentFile = slash.path(process.cwd(),p)
        }
        this.currentFile = await nfs.resolveSymlink(this.currentFile)
        this.status.setFile(slash.tilde(this.currentFile))
        global.ked_editor_file = this.currentFile
        text = await nfs.readText(this.currentFile)
        if (text === undefined)
        {
            text = '○ binary ○'
        }
        segls = belt.seglsForText(text)
        this.editor.state.syntax.ext = slash.ext(this.currentFile)
        this.editor.state.loadSegls(segls)
        this.status.time = process.hrtime(start)[1]
        this.status.drawTime = kstr.time(BigInt(this.status.time))
        ;(this.editor.mapscr != null ? this.editor.mapscr.reload() : undefined)
        ked_session.set("editor▸file",this.currentFile)
        mode.fileLoaded(this.editor.state,this.currentFile)
        this.redraw()
        prjcts.index(this.currentFile)
        watcher.watch(this.currentFile)
        this.t.setTitle(slash.name(this.status.file))
        this.saveSessionFile(this.currentFile,'loaded')
        return this
    }

    KED.prototype["openFile"] = function (path)
    {
        this.loadFile(path)
        return this.editor.grabFocus()
    }

    KED.prototype["saveFile"] = async function ()
    {
        var text

        text = kseg.str(this.editor.state.allLines())
        if (!_k_.empty(this.currentFile))
        {
            await nfs.write(this.currentFile,text)
            this.editor.state.clearHistory()
            this.redraw()
            return this.saveSessionFile(this.currentFile,'saved')
        }
    }

    KED.prototype["saveAs"] = function ()
    {
        console.log('saveAs')
    }

    KED.prototype["saveSessionFile"] = function (file, type)
    {
        frecent.fileAction(file,type)
        return this.session.set('files▸recent',frecent.store('file'))
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
        if (redraw)
        {
            return this.redraw()
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
                return this.quicky.toggle(this.currentFile)

            case 'cmd+f':
            case 'ctrl+f':
                return this.finder.show(this.editor.state.textOfSelectionOrWordAtCursor())

            case 'cmd+o':
            case 'ctrl+o':
            case 'cmd+.':
            case 'ctrl+.':
                return this.quicky.gotoDir(slash.dir(this.currentFile))

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

    KED.prototype["onQuicky"] = async function (path)
    {
        var exists, file

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
            this.redraw()
            return
        }
        exists = await nfs.fileExists(file)
        if (exists)
        {
            return await this.loadFile(file)
        }
    }

    KED.prototype["onViewSize"] = function (name, pos)
    {
        var x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        this.viewSizes[name] = [_k_.min(x,this.screen.cols - 1),_k_.min(y,this.screen.rows - 1)]
        return this.redraw()
    }

    KED.prototype["onViewResize"] = function (name, side, delta)
    {
        var idx

        idx = ((side === 'right') ? 0 : 1)
        this.viewSizes[name][idx] += delta
        this.viewSizes[name][idx] = _k_.max(0,this.viewSizes[name][idx])
        return this.redraw()
    }

    KED.prototype["onResize"] = function (cols, rows, size)
    {
        var _381_22_

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
        this.layout()
        if (!this.menu.greet)
        {
            this.editor.draw()
            this.status.draw()
            this.funcol.draw()
        }
        this.menu.draw()
        this.quicky.draw()
        this.finder.draw()
        this.screen.render()
        this.status.time = process.hrtime(start)[1]
        return this.status.drawTime = kstr.time(BigInt(this.status.time))
    }

    return KED
})()

export default KED.run;
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    KED.run()
}