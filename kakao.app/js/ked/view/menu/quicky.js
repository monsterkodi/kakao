var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var quicky

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let kutil = kxk.kutil
let noon = kxk.noon

import nfs from "../../../kxk/nfs.js"

import prjcts from "../../util/prjcts.js"
import walker from "../../util/walker.js"

import belt from "../../edit/tool/belt.js"

import editor from "../../edit/editor.js"

import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import crumbs from "../base/crumbs.js"

import inputchoice from "./inputchoice.js"
import fscol from "./fscol.js"

import rgxs from './quicky.json' with { type : "json" }

quicky = (function ()
{
    _k_.extend(quicky, inputchoice)
    function quicky (screen)
    {
        this.screen = screen
    
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["onFsColAction"] = this["onFsColAction"].bind(this)
        this["onCrumbsAction"] = this["onCrumbsAction"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["preview"] = this["preview"].bind(this)
        this["openFileInEditor"] = this["openFileInEditor"].bind(this)
        this["gotoDirOrOpenFile"] = this["gotoDirOrOpenFile"].bind(this)
        this["showFiles"] = this["showFiles"].bind(this)
        this["gotoDir"] = this["gotoDir"].bind(this)
        this["layout"] = this["layout"].bind(this)
        quicky.__super__.constructor.call(this,this.screen,'quicky',['mapview','scroll'])
        this.crumbs = new crumbs(this.screen,'quicky_crumbs')
        this.fscol = new fscol(this.screen,'quicky_fscol')
        this.crumbs.padLast = true
        this.choices.state.syntax.setRgxs(rgxs)
        this.choices.on('select',this.preview)
        this.crumbs.on('action',this.onCrumbsAction)
        this.fscol.on('action',this.onFsColAction)
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
        this.choices.layout(x + 1,y + 1 + ih + cr,cw,ch)
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
        this.drawChoices()
        return this.drawAdditions()
    }

    quicky.prototype["drawAdditions"] = function ()
    {
        var bg, fg, x, y

        if (this.fscol.visible())
        {
            fg = theme.quicky_frame_fg
            bg = theme.quicky_frame_bg
            x = this.choices.cells.cols + 2
            this.cells.fill_col(x,2,this.cells.rows - 2,'│',fg,bg)
            this.cells.set(x,this.cells.rows - 1,'┴',fg,bg)
            x = this.choices.cells.cols - 1
            y = this.choices.currentIndex() - this.choices.state.s.view[1]
            this.choices.cells.fill_row(y,this.choices.current().tilde.length,x - 1,' ',bg,this.choices.color.current)
            this.choices.cells.set(x,y,'',this.choices.color.current,bg)
            if ((0 <= y && y < this.choices.cells.rows))
            {
                return this.choices.cells.set_unsafe(x + 1,y,'┤',fg,bg)
            }
        }
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
            console.log('list error',err)
            return
        }
        this.currentDir = dir
        this.crumbs.show(this.currentDir)
        weight = (function (item)
        {
            var p, w

            p = slash.parse(item.path)
            w = 0
            if (item.tilde === icons.dir + ' ..')
            {
                return w
            }
            if (item.type === 'file')
            {
                w += 10000
            }
            if (item.tilde.startsWith(icons.dir + ' .'))
            {
                w += 1000
            }
            if (_k_.in(slash.ext(item.tilde),['js','json']))
            {
                w += 1
            }
            w += kstr.weight(p.file)
            return w
        }).bind(this)
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.tilde = slash.relative(item.path,this.currentDir)
            item.tilde = (((item.type === 'dir') ? (icons.dir + ' ') : '  ')) + item.tilde
        }
        items.sort(function (a, b)
        {
            return weight(a) - weight(b)
        })
        parent = slash.dir(this.currentDir)
        items.unshift({type:'dir',file:slash.name(parent),path:parent,tilde:(parent ? (icons.dir + ' ..') : '')})
        select = (select != null ? select : items[1].path)
        this.choices.mapscr.rowOffset = 1
        this.choices.frontRoundOffset = 2
        return this.showPathItems(items,select)
    }

    quicky.prototype["showFiles"] = function (files)
    {
        var items

        items = files.map(function (path)
        {
            return {path:path,type:'file',tilde:' ' + slash.file(path)}
        })
        this.crumbs.hide()
        this.choices.mapscr.rowOffset = 0
        this.choices.frontRoundOffset = 0
        return this.showPathItems(items)
    }

    quicky.prototype["showProjectFiles"] = function (currentFile)
    {
        this.currentFile = currentFile
    
        var items, weight

        items = prjcts.files(this.currentFile)
        items = items.concat(ked_session.recentFiles())
        if (_k_.empty(items))
        {
            return this.gotoDir(process.cwd())
        }
        items = kutil.uniq(items)
        this.currentDir = slash.dir(this.currentFile)
        if (_k_.empty(this.currentDir))
        {
            this.currentDir = process.cwd()
        }
        this.crumbs.hide()
        this.choices.mapscr.rowOffset = 0
        weight = (function (item)
        {
            var i, p, s, t, w

            t = item.tilde
            p = slash.parse(t)
            w = 0
            w += (t.split('../').length - 1) * 1024 * 4
            var list = _k_.list(slash.split(p.dir))
            for (i = 0; i < list.length; i++)
            {
                s = list[i]
                w += kstr.weight(s) / ((i + 1) * (i + 1))
            }
            return w
        }).bind(this)
        items = items.map((function (path)
        {
            var prs, rel

            rel = slash.relative(path,this.currentDir)
            if (slash.isAbsolute(rel))
            {
                prs = slash.parse(rel)
                rel = slash.join(slash.split(prs.dir).slice(-2),prs.file)
            }
            return {type:'file',path:path,tilde:' ' + rel}
        }).bind(this))
        items.sort(function (a, b)
        {
            return weight(a) - weight(b)
        })
        this.choices.mapscr.rowOffset = 0
        this.choices.frontRoundOffset = 0
        return this.showPathItems(items)
    }

    quicky.prototype["showPathItems"] = function (items, select)
    {
        var idx, item, selectIndex

        this.input.set('')
        selectIndex = 0
        if (select)
        {
            select = slash.untilde(select)
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
        this.choices.state.setMainCursor(0,selectIndex)
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
        post.emit('focus','editor')
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
        return this.choices.moveSelection(dir)
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
            segls = belt.seglsForText(text)
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
            this.choices.hoverForSubmenu = true
        }
        else
        {
            this.fscol.hide()
            this.choices.hoverForSubmenu = false
        }
        return post.emit('redraw')
    }

    quicky.prototype["hideMap"] = function ()
    {
        return this.choices.mapscr.hide()
    }

    quicky.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.crumbs.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.fscol.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = quicky.__super__.onMouse.call(this,event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return this.hover
    }

    quicky.prototype["onWheel"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.fscol.onWheel(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return quicky.__super__.onWheel.call(this,event)
    }

    quicky.prototype["applyChoice"] = function (choice)
    {
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

        if (_k_.empty(choice) && !_k_.empty(this.input.current()))
        {
            this.gotoDirOrOpenFile(this.input.current())
            return {redraw:true}
        }
        if (_k_.empty(choice))
        {
            return {redraw:false}
        }
        if (_k_.empty(choice.path))
        {
            return {redraw:false}
        }
        this.gotoDirOrOpenFile(choice.path)
        return {redraw:true}
    }

    quicky.prototype["onCrumbsAction"] = function (action, path)
    {
        switch (action)
        {
            case 'click':
                return this.applyChoice({tilde:path,path:slash.untilde(path)})

        }

    }

    quicky.prototype["onFsColAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'click':
                return this.applyChoice(choice)

        }

    }

    quicky.prototype["onInputAction"] = function (action, text)
    {
        return quicky.__super__.onInputAction.call(this,action,text)
    }

    quicky.prototype["onChoicesAction"] = function (action, choice)
    {
        var upDir, _421_62_

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
                        return this.gotoDirOrOpenFile(((_421_62_=choice.link) != null ? _421_62_ : choice.path))
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

        return quicky.__super__.onChoicesAction.call(this,action,choice)
    }

    return quicky
})()

export default quicky;