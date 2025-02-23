var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var int, quicky

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let noon = kxk.noon

import nfs from "../../kxk/nfs.js"

import prjcts from "../util/prjcts.js"
import walker from "../util/walker.js"
import util from "../util/util.js"

import editor from "../editor.js"
import theme from "../theme.js"

import inputchoice from "./inputchoice.js"
import crumbs from "./crumbs.js"
import fscol from "./fscol.js"

import rgxs from './quicky.json' with { type : "json" }
int = parseInt

quicky = (function ()
{
    _k_.extend(quicky, inputchoice)
    function quicky (screen)
    {
        this.screen = screen
    
        this["onChoiceAction"] = this["onChoiceAction"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["openFileInEditor"] = this["openFileInEditor"].bind(this)
        this["gotoDirOrOpenFile"] = this["gotoDirOrOpenFile"].bind(this)
        this["showFiles"] = this["showFiles"].bind(this)
        this["gotoDir"] = this["gotoDir"].bind(this)
        this["layout"] = this["layout"].bind(this)
        quicky.__super__.constructor.call(this,this.screen,'quicky',['mapview'])
        this.crumbs = new crumbs(this.screen,'quicky_crumbs')
        this.fscol = new fscol(this.screen,'quicky_fscol')
        this.choices.state.syntax.setRgxs(rgxs)
        post.on('quicky.dir',this.gotoDir)
        post.on('quicky.files',this.showFiles)
    }

    quicky.prototype["layout"] = function ()
    {
        var ch, cr, cw, fh, fw, h, hs, ih, iz, scx, scy, w, x, y

        scx = parseInt(this.screen.cols / 2)
        scy = parseInt(this.screen.rows / 2)
        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
        hs = parseInt(this.screen.rows / 2)
        y = parseInt(scy - hs / 2 - ih)
        cr = (this.crumbs.visible() ? 1 : 0)
        ch = (this.crumbs.visible() ? hs : _k_.min(hs,this.choices.numFiltered()))
        w = _k_.min(_k_.min(this.screen.cols,42),_k_.max(32,parseInt(this.screen.cols / 2)))
        x = parseInt(scx - w / 2)
        h = ch + ih + cr + 2
        fw = (this.fscol.visible() ? parseInt((w - 3) / 2) : 0)
        fh = (this.fscol.visible() ? ch : 0)
        cw = w - 3 - fw
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.crumbs.layout(x + 2,y + 1 + ih,w - 4,cr)
        this.choices.layout(x + 2,y + 1 + ih + cr,cw,ch)
        this.fscol.layout(x + 2 + cw,y + 1 + ih + cr,fw,fh)
        return this.cells.layout(x,y,w,h)
    }

    quicky.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.layout()
        this.drawFrame()
        this.crumbs.draw()
        this.fscol.draw()
        return this.drawChoices()
    }

    quicky.prototype["toggle"] = function (currentFile)
    {
        if (this.hidden())
        {
            return this.showProjectFiles(currentFile)
        }
        else
        {
            return this.hide()
        }
    }

    quicky.prototype["showProjectFiles"] = function (currentFile)
    {
        this.currentFile = currentFile
    
        var ccol, indent, indents, item, items, maxind, weight

        items = prjcts.files(this.currentFile)
        if (_k_.empty(items))
        {
            return this.gotoDir(process.cwd())
        }
        this.currentDir = slash.dir(this.currentFile)
        items = items.map((function (i)
        {
            return slash.relative(i,this.currentDir)
        }).bind(this))
        this.crumbs.hide()
        ccol = parseInt(this.screen.cols / 2) - 5
        maxind = 0
        indents = []
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            indent = slash.dir(item).length
            if (indent)
            {
                indent += 1
            }
            maxind = _k_.max(maxind,indent)
            indents.push(indent)
        }
        items = items.map((function (i, n)
        {
            return _k_.rpad(ccol,_k_.lpad(maxind - indents[n]) + i)
        }).bind(this))
        weight = function (item)
        {
            var p, w

            p = slash.parse(item)
            w = 0
            w += item.split('/').length * 256
            w += kstr.weight(p.name)
            return w
        }
        items.sort(function (a, b)
        {
            return weight(a) - weight(b)
        })
        this.input.set('')
        this.choices.set(items)
        this.choices.state.selectLine(0)
        this.choices.state.setMainCursor(this.choices.state.s.lines[0].length,0)
        this.choices.state.setView([0,0])
        return this.show()
    }

    quicky.prototype["gotoDir"] = async function (dir, select)
    {
        var item, items, parent, weight

        if (_k_.empty(dir))
        {
            dir = process.cwd()
        }
        dir = slash.untilde(dir)
        try
        {
            items = await nfs.list(dir,{recursive:false})
        }
        catch (err)
        {
            lf('list error',err)
            return
        }
        this.currentDir = dir
        this.crumbs.show(this.currentDir)
        weight = function (item)
        {
            var p, w

            p = slash.parse(item.path)
            w = 0
            if (item.tilde === ' ..')
            {
                return w
            }
            if (item.type === 'file')
            {
                w += 10000
            }
            if (item.tilde.startsWith(' .'))
            {
                w += 1000
            }
            if (_k_.in(slash.ext(item.tilde),['js','json']))
            {
                w += 1
            }
            w += kstr.weight(p.file)
            return w
        }
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.tilde = slash.relative(item.path,this.currentDir)
            item.tilde = (((item.type === 'dir') ? ' ' : '  ')) + item.tilde
        }
        items.sort(function (a, b)
        {
            return weight(a) - weight(b)
        })
        parent = slash.dir(this.currentDir)
        items.unshift({type:'dir',file:slash.name(parent),path:parent,tilde:(parent ? ' ..' : '')})
        select = items[1].path
        this.choices.mapscr.rowOffset = 1
        return this.showPathItems(items,select)
    }

    quicky.prototype["showFiles"] = function (files)
    {
        var items

        items = files.map(function (path)
        {
            return {path:path,type:'file',tilde:slash.file(path)}
        })
        this.crumbs.hide()
        this.choices.mapscr.rowOffset = 0
        return this.showPathItems(items)
    }

    quicky.prototype["showPathItems"] = function (items, select)
    {
        var idx, item, selectIndex

        this.input.set('')
        selectIndex = 0
        if (select)
        {
            var list = _k_.list(items)
            for (idx = 0; idx < list.length; idx++)
            {
                item = list[idx]
                if (slash.samePath(item.path,select))
                {
                    selectIndex = idx
                    break
                }
            }
        }
        this.preview(items[selectIndex])
        this.choices.set(items,'tilde')
        this.choices.state.selectLine(selectIndex)
        this.choices.state.setMainCursor(this.choices.state.s.lines[selectIndex].length,selectIndex)
        this.choices.state.setView([0,0])
        this.show()
        return this.choices.grabFocus()
    }

    quicky.prototype["gotoDirOrOpenFile"] = async function (path)
    {
        var isDir, isFile

        isDir = await nfs.dirExists(path)
        if (isDir)
        {
            return await this.gotoDir(path)
        }
        else
        {
            isFile = await nfs.fileExists(path)
            if (isFile)
            {
                return this.openFileInEditor(path)
            }
        }
    }

    quicky.prototype["openFileInEditor"] = function (file)
    {
        this.hide()
        post.emit('quicky',file)
        return {redraw:false}
    }

    quicky.prototype["applyChoice"] = function ()
    {
        var current

        switch (this.input.current())
        {
            case '/':
                return this.gotoDir('/')

            case '~':
                return this.gotoDir('~')

            case '.':
                return this.gotoDir(this.currentDir)

            case '..':
                return this.gotoDir(slash.dir(this.currentDir))

        }

        current = this.choices.current()
        if (_k_.empty(current) && !_k_.empty(this.input.current()))
        {
            this.gotoDirOrOpenFile(this.input.current())
            return {redraw:true}
        }
        if ((current != null ? current.path : undefined))
        {
            this.gotoDirOrOpenFile(current.path)
            return {redraw:true}
        }
        return this.returnToEditor()
    }

    quicky.prototype["returnToEditor"] = function ()
    {
        this.hide()
        if (this.choices.numFiltered())
        {
            post.emit('quicky',this.currentChoice())
        }
        return {redraw:true}
    }

    quicky.prototype["moveSelection"] = function (dir)
    {
        switch (dir)
        {
            case 'down':
                if (!this.choices.hasNext())
                {
                    return
                }
                break
            case 'up':
                if (!this.choices.hasPrev())
                {
                    return
                }
                break
        }

        this.hideMap()
        quicky.__super__.moveSelection.call(this,dir)
        return this.preview(this.choices.current())
    }

    quicky.prototype["choicesFiltered"] = function ()
    {
        return this.preview(this.choices.current())
    }

    quicky.prototype["preview"] = async function (item)
    {
        var segls, text

        if (_k_.empty((item != null ? item.path : undefined)))
        {
            return this.hideMap()
        }
        if (item.type === 'file' && _k_.in(slash.ext(item.path),walker.sourceFileExtensions))
        {
            text = await nfs.read(item.path)
            segls = util.seglsForText(text)
            this.choices.mapscr.show()
            this.choices.mapscr.setSyntaxSegls(slash.ext(item.path),segls)
        }
        else
        {
            this.hideMap()
        }
        if (item.type === 'dir' && !item.tilde.endsWith('..'))
        {
            this.fscol.show(item.path)
        }
        else
        {
            this.fscol.hide()
        }
        return post.emit('redraw')
    }

    quicky.prototype["hideMap"] = function ()
    {
        return this.choices.mapscr.hide()
    }

    quicky.prototype["onMouse"] = function (event)
    {
        if (this.hidden())
        {
            return
        }
        if (this.fscol.onMouse(event))
        {
            return true
        }
        return quicky.__super__.onMouse.call(this,event)
    }

    quicky.prototype["onWheel"] = function (event)
    {
        if (this.hidden())
        {
            return
        }
        if (this.fscol.onWheel(event))
        {
            return true
        }
        return quicky.__super__.onWheel.call(this,event)
    }

    quicky.prototype["onChoiceAction"] = function (choice, action)
    {
        var upDir, _382_62_

        switch (action)
        {
            case 'right':
                if (choice.path)
                {
                    if (choice.tilde === ' ..')
                    {
                        return this.moveSelection('down')
                    }
                    if (choice.type === 'file')
                    {
                        return post.emit('quicky',choice.path)
                    }
                    else
                    {
                        this.hideMap()
                        return this.gotoDirOrOpenFile(((_382_62_=choice.link) != null ? _382_62_ : choice.path))
                    }
                }
                break
            case 'left':
            case 'delete':
                if (choice.path)
                {
                    upDir = slash.dir(this.currentDir)
                    if (_k_.empty(upDir))
                    {
                        return
                    }
                    this.hideMap()
                    return this.gotoDir(upDir,this.currentDir)
                }
                break
            case 'space':
                if (choice.path && choice.type === 'file')
                {
                    return post.emit('quicky',choice.path)
                }
                break
        }

    }

    return quicky
})()

export default quicky;