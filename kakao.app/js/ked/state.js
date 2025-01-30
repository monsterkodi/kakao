var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var state

import immutable from "../kxk/immutable.js"
import kstr from "../kxk/kstr.js"

import del from "./act/del.js"
import insert from "./act/insert.js"
import select from "./act/select.js"
import join from "./act/join.js"
import indent from "./act/indent.js"

import syntax from "./syntax.js"

import util from "./util/util.js"

import child_process from "child_process"


state = (function ()
{
    function state (cells)
    {
        var act, k, v

        this.cells = cells
    
        this["rangeForVisibleLines"] = this["rangeForVisibleLines"].bind(this)
        this["setView"] = this["setView"].bind(this)
        this["adjustView"] = this["adjustView"].bind(this)
        this["scrollView"] = this["scrollView"].bind(this)
        this["moveCursorAndSelect"] = this["moveCursorAndSelect"].bind(this)
        this["moveCursor"] = this["moveCursor"].bind(this)
        this["setCursor"] = this["setCursor"].bind(this)
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
        this["loadLines"] = this["loadLines"].bind(this)
        this["setLines"] = this["setLines"].bind(this)
        this["clearLines"] = this["clearLines"].bind(this)
        this["set"] = this["set"].bind(this)
        var list = [del,insert,select,join,indent]
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
        this.s = immutable({lines:[''],selections:[],highlights:[],cursor:[0,0],view:[0,0]})
        this.h = [this.s]
        this.r = []
        this.setCursor(0,0)
    }

    state.prototype["set"] = function (item, ...args)
    {
        this.s = this.s.set.apply(this.s,[item].concat(args))
        this.h.pop()
        this.h.push(this.s)
        return this
    }

    state.prototype["clearLines"] = function ()
    {
        this.setLines([''])
        return this.setCursor(0,0)
    }

    state.prototype["setLines"] = function (lines)
    {
        this.syntax.setLines(lines)
        this.s = this.s.set('lines',lines)
        this.r = []
        return this.h.push(this.s)
    }

    state.prototype["loadLines"] = function (lines)
    {
        this.r = []
        this.h = []
        return this.setLines(lines)
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
        return this.syntax.setLines(this.s.lines.asMutable())
    }

    state.prototype["redo"] = function ()
    {
        if (_k_.empty(this.r))
        {
            return
        }
        this.h.push(this.r.pop())
        this.s = this.h.slice(-1)[0]
        return this.syntax.setLines(this.s.lines.asMutable())
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
            return delete this.beginIndex
        }
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
        if (_k_.empty(this.s.selections))
        {
            this.selectLine()
            if (!_k_.empty(this.s.selections))
            {
                this.cut()
            }
            return
        }
        this.copy()
        return this.deleteSelection()
    }

    state.prototype["copy"] = function ()
    {
        var proc

        if (_k_.empty(this.s.selections))
        {
            return
        }
        proc = child_process.spawn('pbcopy')
        proc.stdin.write(this.textForSelection())
        return proc.stdin.end()
    }

    state.prototype["paste"] = function ()
    {
        return this.insert(child_process.execSync('pbpaste').toString("utf8"))
    }

    state.prototype["setCursor"] = function (x, y)
    {
        var view

        y = _k_.clamp(0,this.s.lines.length - 1,y)
        x = _k_.max(0,x)
        this.set('cursor',[x,y])
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

    state.prototype["moveCursor"] = function (dir, steps = 1)
    {
        var c

        c = this.s.cursor.asMutable()
        switch (dir)
        {
            case 'left':
                c[0] -= 1
                break
            case 'right':
                c[0] += 1
                break
            case 'up':
                c[1] -= steps
                break
            case 'down':
                c[1] += steps
                break
            case 'eol':
                c[0] = this.s.lines[c[1]].length
                break
            case 'bol':
                c[0] = 0
                break
            case 'eof':
                c[1] = this.s.lines.length - 1
                c[0] = this.s.lines[c[1]].length
                break
        }

        return this.setCursor(c[0],c[1])
    }

    state.prototype["moveCursorAndSelect"] = function (dir)
    {
        var selection, selections

        selections = this.s.selections.asMutable()
        selection = [this.s.cursor[0],this.s.cursor[1],this.s.cursor[0],this.s.cursor[1]]
        selections.push(selection)
        this.moveCursor(dir,1)
        switch (dir)
        {
            case 'left':
                selection[0] = selection[0] - 1
                break
            case 'right':
                selection[2] = selection[2] + 1
                break
            case 'up':
                selection[1] = _k_.max(0,selection[1] - 1)
                break
            case 'down':
                selection[3] = _k_.min(this.s.lines.length - 1,selection[3] + 1)
                break
            case 'eol':
                selection[2] = Infinity
                break
            case 'bol':
                selection[0] = 0
                break
            case 'bof':
                selection[1] = 0
                selection[0] = 0
                break
            case 'eof':
                selection[3] = this.s.lines.length - 1
                selection[2] = this.s.lines[this.s.lines.length - 1].length
                break
        }

        selection[0] = _k_.clamp(0,this.s.lines[selection[1]].length,selection[0])
        selection[2] = _k_.clamp(0,this.s.lines[selection[3]].length,selection[2])
        this.set('selections',util.mergeRanges(selections))
        return this
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

    state.prototype["adjustView"] = function ()
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