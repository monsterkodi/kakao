var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var fsbrow

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post

import nfs from "../../../kxk/nfs.js"

import walker from "../../util/walker.js"

import belt from "../../edit/tool/belt.js"

import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import quicky from "./quicky.js"
import fscol from "./fscol.js"

import rgxs from './quicky.json' with { type : "json" }

fsbrow = (function ()
{
    _k_.extend(fsbrow, quicky)
    function fsbrow (screen)
    {
        this.screen = screen
    
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["onFsColAction"] = this["onFsColAction"].bind(this)
        this["choicesFiltered"] = this["choicesFiltered"].bind(this)
        this["applyChoice"] = this["applyChoice"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["preview"] = this["preview"].bind(this)
        this["gotoDirOrOpenFile"] = this["gotoDirOrOpenFile"].bind(this)
        this["gotoDir"] = this["gotoDir"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        fsbrow.__super__.constructor.call(this,this.screen,'fsbrow')
        this.fscol = new fscol(this.screen,'fsbrow_fscol')
        this.setColor('bg',theme.quicky_bg)
        this.setColor('frame',theme.quicky_frame)
        this.fscol.on('action',this.onFsColAction)
        this.choices.mapscr.rowOffset = 1
        this.choices.frontRoundOffset = 2
        post.on('fsbrow.dir',this.gotoDir)
    }

    fsbrow.prototype["arrange"] = function ()
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
        fw = (this.fscol.visible() ? w / 2 - 1 : 0)
        cw = w - fw - 3
        x = parseInt(scx - w / 2)
        h = ch + ih + cr + 2
        fh = (this.fscol.visible() ? ch : 0)
        this.input.layout(x + 2,y + 1,w - 4,iz)
        this.crumbs.layout(x + 2,y + 1 + ih,w - 4,cr)
        this.choices.layout(x + 1,y + 1 + ih + cr,cw,ch)
        this.fscol.layout(x + 2 + cw,y + 1 + ih + cr,fw,fh)
        return this.cells.layout(x,y,w,h)
    }

    fsbrow.prototype["draw"] = function ()
    {
        var bg, fg, x, y

        if (this.hidden())
        {
            return
        }
        fsbrow.__super__.draw.call(this)
        if (this.fscol.visible())
        {
            this.fscol.draw()
            bg = this.color.bg
            fg = this.color.frame
            x = this.choices.cells.cols + 2
            this.cells.fill_col(x,2,this.cells.rows - 2,'│',fg,bg)
            this.cells.set(x,this.cells.rows - 1,'┴',fg,bg)
            x = this.choices.cells.cols - 1
            y = this.choices.currentIndex() - this.choices.state.s.view[1]
            this.choices.cells.fill_row(y,this.choices.current().tilde.length,x - 1,' ',bg,this.choices.color.current)
            this.choices.cells.set(x,y,'',this.choices.color.current,bg)
            if ((0 <= y && y < this.choices.cells.rows))
            {
                return this.choices.cells.set_unsafe(x + 1,y,'',fg,bg)
            }
        }
    }

    fsbrow.prototype["gotoDir"] = async function (dir, select)
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
        return this.showPathItems(items,select)
    }

    fsbrow.prototype["gotoDirOrOpenFile"] = async function (path)
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

    fsbrow.prototype["preview"] = async function (item)
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

    fsbrow.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.fscol.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return fsbrow.__super__.onMouse.call(this,event)
    }

    fsbrow.prototype["onWheel"] = function (event)
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
        return fsbrow.__super__.onWheel.call(this,event)
    }

    fsbrow.prototype["applyChoice"] = function (choice)
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

    fsbrow.prototype["choicesFiltered"] = function ()
    {
        return this.preview(this.choices.current())
    }

    fsbrow.prototype["onFsColAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'click':
                return this.applyChoice(choice)

        }

    }

    fsbrow.prototype["onChoicesAction"] = function (action, choice)
    {
        var upDir, _267_62_

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
                        return this.gotoDirOrOpenFile(((_267_62_=choice.link) != null ? _267_62_ : choice.path))
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

        return fsbrow.__super__.onChoicesAction.call(this,action,choice)
    }

    return fsbrow
})()

export default fsbrow;