var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}};_k_.b4=_k_.k.F256(_k_.k.b(4));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.b6=_k_.k.F256(_k_.k.b(6));_k_.b7=_k_.k.F256(_k_.k.b(7));_k_.b8=_k_.k.F256(_k_.k.b(8))

var KED

import nfs from "../kxk/nfs.js"

import kxk from "../kxk.js"
let karg = kxk.karg
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post

import ttio from "./ttio.js"
import editor from "./editor.js"
import state from "./state.js"
import konsole from "./konsole.js"

import screen from "./view/screen.js"
import cells from "./view/cells.js"
import status from "./view/status.js"

import logfile from "./util/logfile.js"
import util from "./util/util.js"


KED = (function ()
{
    function KED ()
    {
        var args, h

        this["redraw"] = this["redraw"].bind(this)
        this["onViewSize"] = this["onViewSize"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onPaste"] = this["onPaste"].bind(this)
        this["saveAs"] = this["saveAs"].bind(this)
        this["saveFile"] = this["saveFile"].bind(this)
        this["loadFile"] = this["loadFile"].bind(this)
        this["reloadFile"] = this["reloadFile"].bind(this)
        this["onException"] = this["onException"].bind(this)
        this.version = '0.0.2'
        h = ''
        h += _k_.b8("    ███   ███  ████████  ███████  \n")
        h += _k_.b7("    ███  ███   ███       ███   ███\n")
        h += _k_.b6("    ███████    ███████   ███   ███\n")
        h += _k_.b5("    ███  ███   ███       ███   ███\n")
        h += _k_.b4("    ███   ███  ████████  ███████  \n")
        h = '\n\n' + h + '\n'
        args = karg(`
ked [file]
    options                      **
    
    version    log version       = false
    `,{preHelp:h,version:this.version})
        process.on('uncaughtException',this.onException)
        this.viewSizes = {konsole:[0,0]}
        this.logfile = new logfile
        this.t = new ttio
        global.lfc = (function (...args)
        {
            var _45_64_

            lf.apply(null,args)
            if ((global.lc != null))
            {
                return global.lc.apply(null,args)
            }
        }).bind(this)
        this.screen = new screen(this.t)
        this.editor = new editor(this.screen,'editor',['scroll','gutter'])
        this.konsole = new konsole(this.screen,'konsole',['scroll','gutter','knob'])
        this.status = new status(this.screen,this.editor.state)
        lfc('▸                                         ked',this.version)
        this.editor.on('redraw',this.redraw)
        post.on('view.size',this.onViewSize)
        this.mouseHandlers = [this.konsole,this.editor]
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
        return new KED()
    }

    KED.prototype["onException"] = function (err)
    {
        var _87_10_

        ;(this.t != null ? this.t.quit() : undefined)
        console.error(err)
        return this.logfile.close(function ()
        {
            return process.exit(1)
        })
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
        lines = util.linesForText(text)
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
            case 'cmd+esc':
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

    KED.prototype["onViewSize"] = function (name, x, y)
    {
        return this.viewSizes[name] = [x,y]
    }

    KED.prototype["redraw"] = function ()
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
        this.editor.draw()
        this.konsole.draw()
        this.status.draw()
        this.screen.render()
        return this.status.drawTime = kstr.time(BigInt(process.hrtime(start)[1]))
    }

    return KED
})()

export default KED.run;
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    console.log('◆main')
    KED.run()
}