var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isArr: function (o) {return Array.isArray(o)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var fileeditor

import kxk from "../../../kxk.js"
let post = kxk.post
let kstr = kxk.kstr
let slash = kxk.slash

import nfs from "../../../kxk/nfs.js"

import belt from "../../edit/tool/belt.js"

import editor from "../../edit/editor.js"

import fileutil from "../../util/fileutil.js"

import indexer from "../../index/indexer.js"

import view from "../base/view.js"

import context from "../menu/context.js"

import mapscr from "./mapscr.js"


fileeditor = (function ()
{
    _k_.extend(fileeditor, editor)
    function fileeditor (screen, name)
    {
        var features

        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["jumpToCounterpart"] = this["jumpToCounterpart"].bind(this)
        this["jumpToWord"] = this["jumpToWord"].bind(this)
        this["onContextChoice"] = this["onContextChoice"].bind(this)
        this["onContext"] = this["onContext"].bind(this)
        this["onGotoEof"] = this["onGotoEof"].bind(this)
        this["onGotoBof"] = this["onGotoBof"].bind(this)
        this["onGotoLine"] = this["onGotoLine"].bind(this)
        this["onGitDiff"] = this["onGitDiff"].bind(this)
        this["onGitCommit"] = this["onGitCommit"].bind(this)
        this["setCurrentFile"] = this["setCurrentFile"].bind(this)
        features = ['scroll','gutter','mapscr','complete','filepos','replex','brckts','unype','salter','vimple','uniko']
        fileeditor.__super__.constructor.call(this,screen,name,features)
        if (this.feats.mapscr)
        {
            this.mapscr = new mapscr(this)
            this.mapscr.show()
        }
        post.on('editor.highlight',this.state.highlightText)
        post.on('goto.line',this.onGotoLine)
        post.on('goto.bof',this.onGotoBof)
        post.on('goto.eof',this.onGotoEof)
        post.on('git.diff',this.onGitDiff)
        post.on('git.commit',this.onGitCommit)
    }

    fileeditor.prototype["setCurrentFile"] = function (currentFile)
    {
        this.currentFile = currentFile
    
        var _53_15_

        this.gutter.gitChanges = {}
        return (this.mapscr != null ? this.mapscr.reload() : undefined)
    }

    fileeditor.prototype["onGitCommit"] = function ()
    {
        return this.gutter.gitChanges = {}
    }

    fileeditor.prototype["onGitDiff"] = function (diff)
    {
        var currentFile

        currentFile = ked_session.get('editor▸file')
        if (diff.file === currentFile)
        {
            return this.gutter.onGitDiff(diff)
        }
    }

    fileeditor.prototype["onGotoLine"] = function (row, col, view)
    {
        var mc

        mc = this.state.mainCursor()
        col = (col != null ? col : mc[0])
        if (_k_.isStr(col))
        {
            switch (col)
            {
                case 'ind':
                    col = belt.numIndent(this.state.s.lines[row])
                    break
            }

        }
        if (!_k_.empty(view))
        {
            this.state.setView(view)
            return this.state.setCursors([[col,row]])
        }
        else
        {
            return this.state.setCursors([[col,row]],{adjust:'topBotDelta'})
        }
    }

    fileeditor.prototype["onGotoBof"] = function ()
    {
        return this.state.moveCursors('bof')
    }

    fileeditor.prototype["onGotoEof"] = function ()
    {
        return this.state.moveCursors('eof')
    }

    fileeditor.prototype["onContext"] = function (event)
    {
        var word

        word = this.state.textOfSelectionOrWordAtCursor()
        if (!_k_.empty(word))
        {
            word = ` '${word}'`
        }
        return context.show(event.cell,this.onContextChoice,[`search${word}`,`find${word}`,'status'])
    }

    fileeditor.prototype["onContextChoice"] = function (choice)
    {
        if (choice.startsWith('search'))
        {
            return post.emit('searcher.show',kstr.trim(choice.slice(6, -1)," '"))
        }
        else if (choice.startsWith('find'))
        {
            return post.emit('finder.show',kstr.trim(choice.slice(4, -1)," '"))
        }
        else
        {
            switch (choice)
            {
                case 'status':
                    return post.emit('differ.status')

            }

        }
    }

    fileeditor.prototype["jumpToWord"] = function (word)
    {
        var clss, currentFile, fun, func, idx

        if (clss = indexer.singleton.classes[word])
        {
            post.emit('file.open',clss.file,clss.line - 1)
            return true
        }
        else if (func = indexer.singleton.funcs[word])
        {
            if (_k_.isArr(func))
            {
                currentFile = ked_session.get('editor▸file')
                var list = _k_.list(func)
                for (idx = 0; idx < list.length; idx++)
                {
                    fun = list[idx]
                    if (fun.file === currentFile)
                    {
                        func = func[(idx + 1) % func.length]
                        break
                    }
                }
                if (_k_.isArr(func))
                {
                    func = func[0]
                }
            }
            if (!_k_.empty(func.file))
            {
                post.emit('file.open',func.file,func.line - 1,'ind')
                return true
            }
        }
        else
        {
            console.log(`fileeditor.jumpToWord(${word}) nothing found to jump to`)
        }
        return false
    }

    fileeditor.prototype["jumpToCounterpart"] = async function ()
    {
        var counter, currentFile, currext, ext, file, _173_50_, _179_50_, _188_50_

        currentFile = ked_session.get('editor▸file')
        currext = slash.ext(currentFile)
        var list = ((_173_50_=fileutil.counterparts[currext]) != null ? _173_50_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            ext = list[_a_]
            if (await nfs.fileExists(slash.swapExt(currentFile,ext)))
            {
                post.emit('file.open',slash.swapExt(currentFile,ext))
                return
            }
        }
        var list1 = ((_179_50_=fileutil.counterparts[currext]) != null ? _179_50_ : [])
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            ext = list1[_b_]
            counter = slash.swapExt(currentFile,ext)
            file = fileutil.swapLastDir(counter,currext,ext)
            if (await nfs.fileExists(file))
            {
                post.emit('file.open',file)
                return
            }
        }
        var list2 = ((_188_50_=fileutil.counterparts[currext]) != null ? _188_50_ : [])
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            ext = list2[_c_]
            counter = slash.swapExt(currentFile,ext)
            if (_k_.in(currext,['noon']))
            {
                file = fileutil.swapLastDir(counter,'kode','js')
                if (await nfs.fileExists(file))
                {
                    post.emit('file.open',file)
                    return
                }
            }
            if (_k_.in(currext,['json']))
            {
                file = fileutil.swapLastDir(counter,'js','kode')
                if (await nfs.fileExists(file))
                {
                    post.emit('file.open',file)
                    return
                }
            }
        }
        console.log('cant find counterpart',currentFile)
    }

    fileeditor.prototype["onMouse"] = function (event)
    {
        var col, ret, row, start, word, x, y, _247_41_, _305_31_

        ret = fileeditor.__super__.onMouse.call(this,event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        var _a_ = this.eventPos(event); col = _a_[0]; row = _a_[1]

        switch (event.type)
        {
            case 'press':
                if (event.count > 1)
                {
                    if (!event.shift && event.button === 'left')
                    {
                        this.state.deselect()
                    }
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    this.state.clearHighlights()
                    if (event.count === 2)
                    {
                        if (event.alt)
                        {
                            this.state.selectChunk(x,y)
                        }
                        else
                        {
                            this.state.selectWord(x,y)
                        }
                    }
                    else
                    {
                        this.state.selectLine(y)
                    }
                    this.state.highlightSelection()
                    this.dragStart = _k_.copy(this.state.s.selections[0])
                    return {redraw:true}
                }
                else if (this.hover || (this.gutter != null ? this.gutter.cells.isInsideEvent(event) : undefined))
                {
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    if (event.cmd || event.ctrl)
                    {
                        if (word = belt.wordAtPos(this.state.s.lines,[x,y]))
                        {
                            console.log(`jumpToWord ${word}`,event)
                            if (this.jumpToWord(word))
                            {
                                return
                            }
                        }
                    }
                    this.dragStart = [x,y,x]
                    if (!event.shift && event.button === 'left')
                    {
                        this.state.deselect()
                    }
                    if (!event.alt)
                    {
                        this.state.clearCursors()
                    }
                    if (event.alt)
                    {
                        this.state.addCursor(x,y)
                    }
                    else
                    {
                        if (event.shift && this.state.s.cursors.length === 1)
                        {
                            this.state.setMainCursorAndSelect(x,y)
                        }
                        else
                        {
                            this.state.setMainCursor(x,y)
                        }
                    }
                    this.grabFocus()
                    return {redraw:true}
                }
                break
            case 'drag':
                if (this.dragStart)
                {
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    start = [this.dragStart[0],this.dragStart[1]]
                    if (y < this.dragStart[1])
                    {
                        start = [this.dragStart[2],this.dragStart[1]]
                    }
                    if (event.shift)
                    {
                        this.state.addRangeToSelectionWithMainCursorAtEnd(belt.rangeFromStartToEnd(start,[x,y]))
                    }
                    else
                    {
                        this.state.select(start,[x,y])
                    }
                    return {redraw:true}
                }
                break
            case 'release':
                delete this.dragStart
                break
            case 'move':
                if (this.hover)
                {
                    if (!this.hasFocus() && _k_.empty(view.currentPopup))
                    {
                        this.grabFocus()
                    }
                    post.emit('pointer','text')
                }
                else if ((this.gutter != null ? this.gutter.cells.isInsideEvent(event) : undefined))
                {
                    post.emit('pointer','vertical-text')
                }
                break
        }

        return this.hover
    }

    fileeditor.prototype["onWheel"] = function (event)
    {
        var start, steps, x, y

        if (event.cell[1] >= this.cells.y + this.cells.rows)
        {
            return
        }
        if (this.dragStart)
        {
            steps = 1
            if (event.shift)
            {
                steps *= 2
            }
            if (event.ctrl)
            {
                steps *= 2
            }
            if (event.alt)
            {
                steps *= 2
            }
            var _a_ = this.state.mainCursor(); x = _a_[0]; y = _a_[1]

            switch (event.dir)
            {
                case 'up':
                    y -= steps
                    break
                case 'down':
                    y += steps
                    break
                case 'left':
                    x -= 1
                    break
                case 'right':
                    x += 1
                    break
            }

            y = _k_.clamp(0,this.state.s.lines.length - 1,y)
            x = _k_.clamp(0,this.state.s.lines[y].length - 1,x)
            start = [this.dragStart[0],this.dragStart[1]]
            if (y < this.dragStart[1])
            {
                start = [this.dragStart[2],this.dragStart[1]]
            }
            if (this.state.select(start,[x,y]))
            {
                this.redraw()
            }
            return
        }
        return fileeditor.__super__.onWheel.call(this,event)
    }

    return fileeditor
})()

export default fileeditor;