var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

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
import input from "./input.js"
import choices from "./choices.js"
import crumbs from "./crumbs.js"

import rgxs from './quicky.json' with { type : "json" }
int = parseInt

quicky = (function ()
{
    function quicky (screen)
    {
        this.screen = screen
    
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onInputChanged"] = this["onInputChanged"].bind(this)
        this["openFileInEditor"] = this["openFileInEditor"].bind(this)
        this["gotoFileOrDirectory"] = this["gotoFileOrDirectory"].bind(this)
        this["gotoDirectory"] = this["gotoDirectory"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["show"] = this["show"].bind(this)
        this.name = 'quicky'
        this.cells = new cells(this.screen)
        this.input = new input(this.screen,'quicky_input')
        this.crumbs = new crumbs(this.screen,'quicky_crumbs')
        this.choices = new choices(this.screen,'quicky_choices')
        this.choices.mapscr.hide()
        this.choices.state.syntax.setRgxs(rgxs)
        this.input.on('changed',this.onInputChanged)
        post.on('quicky.dir',this.gotoDirectory)
    }

    quicky.prototype["show"] = function ()
    {
        this.layout()
        return this.input.grabFocus()
    }

    quicky.prototype["layout"] = function ()
    {
        var cd, ch, cs, h, w, x, y

        x = parseInt(this.screen.cols / 4)
        y = parseInt(this.screen.rows / 4)
        w = parseInt(this.screen.cols / 2)
        h = parseInt(this.screen.rows / 2 - 4)
        cs = _k_.min(h,this.choices.num())
        if (this.crumbs.visible())
        {
            cs = h
        }
        ch = (this.crumbs.visible() ? 1 : 0)
        cd = (ch === 1 ? 1 : 0)
        this.input.init(x + 2,y + 1,w - 4,1)
        this.crumbs.init(x + 2,y + 3,w - 4,ch)
        this.choices.init(x + 2,y + 3 + cd,w - 3,cs)
        return this.cells.init(x,y,w,cs + 4 + cd)
    }

    quicky.prototype["hide"] = function ()
    {
        this.choices.mapscr.hide()
        this.cells.rows = 0
        post.emit('focus','editor')
        return {redraw:true}
    }

    quicky.prototype["hidden"] = function ()
    {
        return this.cells.rows <= 0
    }

    quicky.prototype["visible"] = function ()
    {
        return this.cells.rows > 0
    }

    quicky.prototype["toggle"] = function (currentFile)
    {
        if (this.hidden())
        {
            return this.open(currentFile)
        }
        else
        {
            return this.hide()
        }
    }

    quicky.prototype["open"] = function (currentFile)
    {
        return this.gotoFile(currentFile)
    }

    quicky.prototype["gotoFile"] = function (currentFile)
    {
        var ccol, indent, indents, item, items, maxind, weight

        this.currentFile = currentFile
    
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
        return this.show()
    }

    quicky.prototype["gotoDirectory"] = async function (dir, select)
    {
        var idx, item, items, parent, selectIndex, weight

        if (_k_.empty(dir))
        {
            return
        }
        dir = slash.untilde(dir)
        lf('quicky.gotoDirectory',dir)
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
        this.show()
        return this.choices.grabFocus()
    }

    quicky.prototype["gotoFileOrDirectory"] = async function (path)
    {
        var isDir, isFile

        isDir = await nfs.dirExists(path)
        if (isDir)
        {
            return await this.gotoDirectory(path)
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

    quicky.prototype["onInputChanged"] = function (text)
    {
        this.choices.filter(text)
        this.choices.state.selectLine(0)
        this.choices.state.setMainCursor(this.choices.state.s.lines[0].length,0)
        return this.layout()
    }

    quicky.prototype["postResult"] = function ()
    {
        var current

        switch (this.input.current())
        {
            case '/':
                return this.gotoDirectory('/')

            case '~':
                return this.gotoDirectory('~')

            case '.':
                return this.gotoDirectory(this.currentDir)

            case '..':
                return this.gotoDirectory(slash.dir(this.currentDir))

        }

        current = this.choices.current()
        lf('current choice',current)
        if (_k_.empty(current) && !_k_.empty(this.input.current()))
        {
            return this.gotoFileOrDirectory(this.input.current())
        }
        if (current.path)
        {
            return this.gotoFileOrDirectory(current.path)
        }
        return this.returnToEditor()
    }

    quicky.prototype["returnToEditor"] = function ()
    {
        this.hide()
        if (this.choices.num())
        {
            post.emit('quicky',this.currentChoice())
            return {redraw:false}
        }
        else
        {
            return {redraw:true}
        }
    }

    quicky.prototype["currentChoice"] = function ()
    {
        return _k_.trim(this.choices.current())
    }

    quicky.prototype["draw"] = function ()
    {
        var bg, fg

        if (this.hidden())
        {
            return
        }
        fg = theme.quicky_frame_fg
        bg = theme.quicky_frame_bg
        this.cells.draw_frame(0,0,-1,-1,{fg:fg,bg:bg,hdiv:[2]})
        this.input.draw()
        this.crumbs.draw()
        return this.choices.draw()
    }

    quicky.prototype["moveSelection"] = function (dir)
    {
        lf('moveSelection',dir)
        switch (dir)
        {
            case 'down':
                this.choices.selectNext()
                break
            case 'up':
                this.choices.selectPrev()
                break
        }

        this.choices.mapscr.hide()
        if (this.choices.current().path)
        {
            this.input.set('')
            this.preview(this.choices.current().path)
        }
        else
        {
            this.input.set(this.choices.state.selectedText())
        }
        this.input.selectAll()
        return this.choices.grabFocus()
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
            return this.choices.mapscr.hide()
        }
    }

    quicky.prototype["moveFocus"] = function ()
    {
        if (this.choices.hasFocus())
        {
            return this.input.grabFocus()
        }
        else
        {
            return this.choices.grabFocus()
        }
    }

    quicky.prototype["onKey"] = function (key, event)
    {
        var current, upDir, _378_69_

        if (this.hidden())
        {
            return
        }
        switch (event.combo)
        {
            case 'tab':
                return this.moveFocus()

            case 'esc':
                return this.hide()

            case 'return':
                return this.postResult()

            case 'up':
            case 'down':
                return this.moveSelection(event.combo)

        }

        if (this.choices.hasFocus())
        {
            current = this.choices.current()
            lf('current',current,key)
            switch (event.combo)
            {
                case 'right':
                    if (current.path)
                    {
                        if (current.tilde === ' ..')
                        {
                            return this.moveSelection('down')
                        }
                        if (current.type === 'file')
                        {
                            return post.emit('quicky',current.path)
                        }
                        else
                        {
                            this.choices.mapscr.hide()
                            return this.gotoFileOrDirectory(((_378_69_=current.link) != null ? _378_69_ : current.path))
                        }
                    }
                    break
                case 'left':
                    if (current.path)
                    {
                        upDir = slash.dir(this.currentDir)
                        this.choices.mapscr.hide()
                        return this.gotoDirectory(upDir,this.currentDir)
                    }
                    break
                case 'space':
                    if (current.path && current.type === 'file')
                    {
                        return post.emit('quicky',current.path)
                    }
                    break
            }

            this.input.grabFocus()
        }
        if (this.input.onKey(key,event))
        {
            return true
        }
        if (this.choices.onKey(key,event))
        {
            return true
        }
        return true
    }

    quicky.prototype["onMouse"] = function (type, sx, sy, event)
    {
        if (this.hidden())
        {
            return
        }
        if (this.input.onMouse(type,sx,sy,event))
        {
            return true
        }
        if (this.choices.onMouse(type,sx,sy,event))
        {
            return true
        }
        return true
    }

    quicky.prototype["onWheel"] = function (event)
    {
        if (this.hidden())
        {
            return
        }
        if (this.input.onWheel(event))
        {
            return true
        }
        if (this.choices.onWheel(event))
        {
            return true
        }
        return true
    }

    return quicky
})()

export default quicky;