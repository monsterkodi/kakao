var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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

import cells from "./cells.js"
import crumbs from "./crumbs.js"
import inputchoice from "./inputchoice.js"

import rgxs from './quicky.json' with { type : "json" }
int = parseInt

quicky = (function ()
{
    _k_.extend(quicky, inputchoice)
    function quicky (screen)
    {
        this.screen = screen
    
        this["onChoiceAction"] = this["onChoiceAction"].bind(this)
        this["openFileInEditor"] = this["openFileInEditor"].bind(this)
        this["gotoDirOrOpenFile"] = this["gotoDirOrOpenFile"].bind(this)
        this["gotoDir"] = this["gotoDir"].bind(this)
        this["layout"] = this["layout"].bind(this)
        quicky.__super__.constructor.call(this,this.screen,'quicky',['mapview'])
        this.crumbs = new crumbs(this.screen,'quicky_crumbs')
        this.choices.state.syntax.setRgxs(rgxs)
        post.on('quicky.dir',this.gotoDir)
    }

    quicky.prototype["layout"] = function ()
    {
        var cr, cs, h, hs, ih, iz, scx, scy, w, x, y

        scx = parseInt(this.screen.cols / 2)
        scy = parseInt(this.screen.rows / 2)
        ih = (this.inputIsActive() ? 2 : 0)
        iz = _k_.max(0,ih - 1)
        hs = parseInt(this.screen.rows / 2)
        y = parseInt(scy - hs / 2 - ih)
        cr = (this.crumbs.visible() ? 1 : 0)
        cs = (this.crumbs.visible() ? hs : _k_.min(hs,this.choices.numFiltered()))
        w = _k_.min(_k_.min(this.screen.cols,42),_k_.max(32,parseInt(this.screen.cols / 2)))
        x = parseInt(scx - w / 2)
        h = cs + ih + cr + 2
        lf('quicky',h,cs,ih,cr)
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.crumbs.layout(x + 2,y + 1 + ih,w - 4,cr)
        this.choices.layout(x + 2,y + 1 + ih + cr,w - 3,cs)
        return this.cells.layout(x,y,w,h)
    }

    quicky.prototype["toggle"] = function (currentFile)
    {
        if (this.hidden())
        {
            return this.show(currentFile)
        }
        else
        {
            return this.hide()
        }
    }

    quicky.prototype["hideMap"] = function ()
    {
        return this.choices.mapscr.hide()
    }

    quicky.prototype["show"] = function (currentFile)
    {
        this.currentFile = currentFile
    
        var ccol, indent, indents, item, items, maxind, weight

        items = prjcts.files(this.currentFile)
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
        return quicky.__super__.show.call(this)
    }

    quicky.prototype["gotoDir"] = async function (dir, select)
    {
        var idx, item, items, parent, selectIndex, weight

        if (_k_.empty(dir))
        {
            return
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
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.tilde = slash.relative(item.path,this.currentDir)
            item.tilde = (((item.type === 'dir') ? ' ' : '  ')) + item.tilde
        }
        parent = slash.dir(this.currentDir)
        if (!_k_.empty(parent))
        {
            items.push({type:'dir',file:slash.name(parent),path:parent,tilde:' ..'})
        }
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
        items.sort(function (a, b)
        {
            return weight(a) - weight(b)
        })
        this.input.set('')
        selectIndex = (!_k_.empty(parent) && items.length > 1 ? 1 : 0)
        if (select)
        {
            var list1 = _k_.list(items)
            for (idx = 0; idx < list1.length; idx++)
            {
                item = list1[idx]
                if (slash.samePath(item.path,select))
                {
                    selectIndex = idx
                    break
                }
            }
        }
        this.preview(items[selectIndex].path)
        this.choices.set(items,'tilde')
        this.choices.state.selectLine(selectIndex)
        this.choices.state.setMainCursor(this.choices.state.s.lines[selectIndex].length,selectIndex)
        this.choices.state.setView([0,0])
        this.layout()
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

    quicky.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.layout()
        this.drawFrame()
        this.crumbs.draw()
        return this.drawChoices()
    }

    quicky.prototype["moveSelection"] = function (dir)
    {
        this.hideMap()
        quicky.__super__.moveSelection.call(this,dir)
        if (this.choices.current().path)
        {
            return this.preview(this.choices.current().path)
        }
    }

    quicky.prototype["preview"] = async function (file)
    {
        var lines, text

        if (_k_.in(slash.ext(file),walker.sourceFileExtensions))
        {
            text = await nfs.read(file)
            lines = util.linesForText(text)
            this.choices.mapscr.show()
            return this.choices.mapscr.setSyntaxLines(slash.ext(file),lines)
        }
        else
        {
            return this.hideMap()
        }
    }

    quicky.prototype["onChoiceAction"] = function (choice, action)
    {
        var upDir, _313_62_

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
                        return this.gotoDirOrOpenFile(((_313_62_=choice.link) != null ? _313_62_ : choice.path))
                    }
                }
                break
            case 'left':
                if (choice.path)
                {
                    upDir = slash.dir(this.currentDir)
                    this.hideMap()
                    return this.gotoDir(upDir,this.currentDir)
                }
                break
            case 'space':
                if (choice.path && v.type === 'file')
                {
                    return post.emit('quicky',choice.path)
                }
                break
        }

    }

    return quicky
})()

export default quicky;