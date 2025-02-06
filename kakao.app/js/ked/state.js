var _k_ = {isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var state

import immutable from "../kxk/immutable.js"
import kstr from "../kxk/kstr.js"

import del from "./act/del.js"
import insert from "./act/insert.js"
import select from "./act/select.js"
import join from "./act/join.js"
import indent from "./act/indent.js"
import multi from "./act/multi.js"

import syntax from "./syntax.js"

import util from "./util/util.js"

import child_process from "child_process"
import os from "os"


state = (function ()
{
    function state (cells)
    {
        var act, k, v

        this.cells = cells
    
        this["rangeForVisibleLines"] = this["rangeForVisibleLines"].bind(this)
        this["setView"] = this["setView"].bind(this)
        this["initView"] = this["initView"].bind(this)
        this["adjustViewForMainCursor"] = this["adjustViewForMainCursor"].bind(this)
        this["scrollView"] = this["scrollView"].bind(this)
        this["paste"] = this["paste"].bind(this)
        this["copy"] = this["copy"].bind(this)
        this["cut"] = this["cut"].bind(this)
        this["gutterWidth"] = this["gutterWidth"].bind(this)
        this["hasRedo"] = this["hasRedo"].bind(this)
        this["isDirty"] = this["isDirty"].bind(this)
        this["end"] = this["end"].bind(this)
        this["begin"] = this["begin"].bind(this)
        this["redo"] = this["redo"].bind(this)
        this["undo"] = this["undo"].bind(this)
        this["isInvalidLineIndex"] = this["isInvalidLineIndex"].bind(this)
        this["isValidLineIndex"] = this["isValidLineIndex"].bind(this)
        this["clearLines"] = this["clearLines"].bind(this)
        this["loadLines"] = this["loadLines"].bind(this)
        this["allLines"] = this["allLines"].bind(this)
        this["setLines"] = this["setLines"].bind(this)
        this["set"] = this["set"].bind(this)
        var list = [del,insert,select,join,indent,multi]
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            act = list[_a_]
            for (k in act)
            {
                v = act[k]
                this[k] = v.bind(this)
            }
        }
        this.syntax = new syntax
        this.s = immutable({lines:[''],selections:[],highlights:[],cursors:[[0,0]],main:0,view:[0,0]})
        this.h = [this.s]
        this.r = []
    }

    state.prototype["set"] = function (item, arg)
    {
        this.s = this.s.set(item,arg)
        this.swapState()
        return this
    }

    state.prototype["setSelections"] = function (selections)
    {
        return this.set('selections',util.mergeLineRanges(this.allLines(),selections))
    }

    state.prototype["setHighlights"] = function (highlights)
    {
        return this.set('highlights',util.normalizeSpans(highlights))
    }

    state.prototype["setCursors"] = function (cursors, main)
    {
        var cur, idx, mainCursor

        if (_k_.isArr(main))
        {
            main = util.indexOfPosInPositions(main,cursors)
        }
        if (_k_.isNum(main) && main < 0)
        {
            main = cursors.length + main
        }
        if ((main != null))
        {
            mainCursor = _k_.copy(cursors[_k_.clamp(0,cursors.length - 1,main)])
        }
        else
        {
            mainCursor = this.mainCursor()
        }
        cursors = util.normalizePositions(cursors,this.s.lines.length - 1)
        this.s = this.s.set('cursors',cursors)
        main = -1
        var list = _k_.list(cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            cur = list[idx]
            if (_k_.eql(cur, mainCursor))
            {
                main = idx
                break
            }
        }
        if (main < 0)
        {
            main = this.s.main
        }
        main = _k_.clamp(0,this.s.cursors.length - 1,main)
        this.s = this.s.set('main',main)
        this.adjustViewForMainCursor()
        this.swapState()
        return this
    }

    state.prototype["setLines"] = function (lines)
    {
        this.syntax.setLines(lines)
        this.s = this.s.set('lines',lines)
        this.r = []
        return this.pushState()
    }

    state.prototype["allLines"] = function ()
    {
        return this.s.lines.asMutable()
    }

    state.prototype["loadLines"] = function (lines)
    {
        this.clearCursorsHighlightsAndSelections()
        this.r = []
        this.h = []
        return this.setLines(lines)
    }

    state.prototype["clearLines"] = function ()
    {
        this.setLines([''])
        return this.setMainCursor(0,0)
    }

    state.prototype["isValidLineIndex"] = function (li)
    {
        return (0 <= li && li < this.s.lines.length)
    }

    state.prototype["isInvalidLineIndex"] = function (li)
    {
        return !this.isValidLineIndex(li)
    }

    state.prototype["undo"] = function ()
    {
        if (this.h.length <= 1)
        {
            return
        }
        this.r.push(this.h.pop())
        this.s = this.h.slice(-1)[0]
        return this.syntax.setLines(this.allLines())
    }

    state.prototype["redo"] = function ()
    {
        if (_k_.empty(this.r))
        {
            return
        }
        this.h.push(this.r.pop())
        this.s = this.h.slice(-1)[0]
        return this.syntax.setLines(this.allLines())
    }

    state.prototype["begin"] = function ()
    {
        return this.beginIndex = this.h.length
    }

    state.prototype["end"] = function ()
    {
        if (!_k_.empty(this.beginIndex))
        {
            this.h.splice(this.beginIndex,this.h.length - this.beginIndex - 1)
            delete this.beginIndex
        }
        return this
    }

    state.prototype["pushState"] = function ()
    {
        this.h.push(this.s)
        return this
    }

    state.prototype["swapState"] = function ()
    {
        this.h.pop()
        return this.pushState()
    }

    state.prototype["isDirty"] = function ()
    {
        return this.h.length > 1
    }

    state.prototype["hasRedo"] = function ()
    {
        return this.r.length > 0
    }

    state.prototype["gutterWidth"] = function ()
    {
        return _k_.max(4,2 + Math.ceil(Math.log10(this.s.lines.length + 1)))
    }

    state.prototype["cut"] = function ()
    {
        var lines

        if (_k_.empty(this.s.selections))
        {
            this.selectCursorLines()
            if (!_k_.empty(this.s.selections))
            {
                return this.cut()
            }
            if (util.isEmptyLineAtPos(this.allLines(),this.mainCursor()))
            {
                lines = this.allLines()
                lines.splice(this.mainCursor()[1],1)
                this.setLines(lines)
            }
            return
        }
        this.copy()
        return this.deleteSelection()
    }

    state.prototype["copy"] = function ()
    {
        var proc

        switch (os.platform())
        {
            case 'darwin':
                proc = child_process.spawn('pbcopy')
                return proc.stdin.end(this.textForSelectionOrCursorLines())

            case 'linux':
                proc = child_process.spawn('xsel',['-i','--clipboard'])
                proc.stdin.write(this.textForSelectionOrCursorLines())
                return proc.stdin.end()

            case 'win32':
                proc = child_process.spawn(`${_k_.dir()}/../../bin/utf8clip.exe`)
                proc.stdin.write(this.textForSelectionOrCursorLines())
                return proc.stdin.end()

        }

    }

    state.prototype["paste"] = function ()
    {
        switch (os.platform())
        {
            case 'darwin':
                return this.insert(child_process.execSync('pbpaste').toString("utf8"))

            case 'linux':
                return this.insert(child_process.execSync('xsel').toString("utf8"))

            case 'win32':
                return this.insert(child_process.execSync(`${_k_.dir()}/../../bin/utf8clip.exe`).toString("utf8"))

        }

    }

    state.prototype["scrollView"] = function (dir, steps = 1)
    {
        var sx, sy, view

        sx = sy = 0
        switch (dir)
        {
            case 'left':
                sx = -1
                break
            case 'right':
                sx = 1
                break
            case 'up':
                sy = -steps
                break
            case 'down':
                sy = steps
                break
        }

        view = this.s.view.asMutable()
        view[0] += sx
        view[1] += sy
        view[1] = _k_.clamp(0,_k_.max(0,this.s.lines.length - this.cells.rows),view[1])
        view[0] = _k_.max(0,view[0])
        return this.setView(view)
    }

    state.prototype["adjustViewForMainCursor"] = function ()
    {
        var view, x, y

        var _a_ = this.mainCursor(); x = _a_[0]; y = _a_[1]

        view = this.s.view.asMutable()
        if (y >= view[1] + this.cells.rows - 1)
        {
            view[1] = y - this.cells.rows + 1
        }
        else if (y < view[1])
        {
            view[1] = y
        }
        if (view[1] > 0 && this.s.lines.length < this.cells.rows)
        {
            view[1] = 0
        }
        view[0] = _k_.max(0,x - this.cells.cols + 1)
        return this.setView(view)
    }

    state.prototype["initView"] = function ()
    {
        var view

        view = this.s.view.asMutable()
        view[1] = _k_.clamp(0,_k_.max(0,this.s.lines.length - this.cells.rows),view[1])
        view[0] = _k_.max(0,view[0])
        return this.setView(view)
    }

    state.prototype["setView"] = function (view)
    {
        this.set('view',view)
        return this
    }

    state.prototype["rangeForVisibleLines"] = function ()
    {
        return [this.s.view[0],this.s.view[1],this.s.view[0] + this.cells.cols - 1,this.s.view[1] + this.cells.rows - 1]
    }

    return state
})()

export default state;