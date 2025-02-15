var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var int, quicky

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let noon = kxk.noon

import nfs from "../../kxk/nfs.js"

import prjcts from "../util/prjcts.js"

import editor from "../editor.js"
import theme from "../theme.js"

import cells from "./cells.js"
import input from "./input.js"
import choices from "./choices.js"

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
        this.choices = new choices(this.screen,'quicky_choices')
        this.choices.state.syntax.setRgxs(rgxs)
        this.input.on('changed',this.onInputChanged)
    }

    quicky.prototype["show"] = function ()
    {
        this.layout()
        return this.input.grabFocus()
    }

    quicky.prototype["layout"] = function ()
    {
        var c, h, w, x, y

        x = parseInt(this.screen.cols / 4)
        y = parseInt(this.screen.rows / 4)
        w = parseInt(this.screen.cols / 2)
        h = parseInt(this.screen.rows / 2)
        c = _k_.min(h,this.choices.num())
        this.input.init(x + 2,y + 1,w - 4,1)
        this.choices.init(x + 2,y + 3,w - 3,c)
        return this.cells.init(x,y,w,c + 4)
    }

    quicky.prototype["hide"] = function ()
    {
        this.cells.rows = 0
        post.emit('focus','editor')
        post.emit('redraw')
        return true
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
    
        lf('quicky.gotoFile',this.currentFile)
        items = prjcts.files(this.currentFile)
        this.currentDir = slash.dir(this.currentFile)
        items = items.map((function (i)
        {
            return slash.relative(i,this.currentDir)
        }).bind(this))
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

    quicky.prototype["gotoDirectory"] = async function (dir)
    {
        var item, items, parent, tilde, weight

        if (_k_.empty(dir))
        {
            return
        }
        this.currentDir = slash.untilde(dir)
        items = await nfs.list(this.currentDir,{recursive:false})
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            tilde = slash.tilde(item.path)
            item.tilde = (tilde === '~' ? item.path : tilde)
        }
        parent = slash.dir(this.currentDir)
        if (!_k_.empty(parent))
        {
            items.push({type:'dir',file:slash.name(parent),path:parent,tilde:'..'})
        }
        weight = function (item)
        {
            var p, w

            p = slash.parse(item.tilde)
            w = 0
            w += item.tilde.split('/').length * 256
            w += kstr.weight(p.name)
            return w
        }
        items.sort(function (a, b)
        {
            return weight(a) - weight(b)
        })
        this.input.set('..')
        this.input.selectAll()
        this.choices.set(items,'tilde')
        this.choices.state.selectLine(0)
        this.choices.state.setMainCursor(this.choices.state.s.lines[0].length,0)
        this.choices.state.setView([0,0])
        return this.show()
    }

    quicky.prototype["gotoFileOrDirectory"] = async function (path)
    {
        var isDir

        isDir = await nfs.dirExists(path)
        if (isDir)
        {
            return await this.gotoDirectory(path)
        }
        else
        {
            return this.openFileInEditor(path)
        }
    }

    quicky.prototype["openFileInEditor"] = function (file)
    {
        this.cells.rows = 0
        post.emit('focus','editor')
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
        if (_k_.empty(current) && !_k_.empty(this.input.current()))
        {
            return this.gotoFileOrDirectory(this.input.current())
        }
        if (current.tilde)
        {
            return this.gotoFileOrDirectory(current.tilde)
        }
        return this.returnToEditor()
    }

    quicky.prototype["returnToEditor"] = function ()
    {
        this.cells.rows = 0
        post.emit('focus','editor')
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
        return this.choices.draw()
    }

    quicky.prototype["moveSelection"] = function (dir)
    {
        switch (dir)
        {
            case 'down':
                this.choices.state.selectNextLine()
                break
            case 'up':
                this.choices.state.selectPrevLine()
                break
        }

        this.input.set(this.choices.state.selectedText())
        return this.input.selectAll()
    }

    quicky.prototype["onKey"] = function (key, event)
    {
        if (this.hidden())
        {
            return
        }
        switch (event.combo)
        {
            case 'esc':
                return this.hide()

            case 'return':
                return this.postResult()

            case 'up':
            case 'down':
                if (this.input.state.hasFocus)
                {
                    return this.moveSelection(event.combo)
                }
                break
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