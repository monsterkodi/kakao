var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var state

import immutable from "../kxk/immutable.js"
import kstr from "../kxk/kstr.js"

import color from "./color.js"
import syntax from "./syntax.js"
import util from "./util.js"

import child_process from "child_process"


state = (function ()
{
    function state (cells)
    {
        this.cells = cells
    
        this["deselect"] = this["deselect"].bind(this)
        this["isSelectedLine"] = this["isSelectedLine"].bind(this)
        this["selectLine"] = this["selectLine"].bind(this)
        this["selectWord"] = this["selectWord"].bind(this)
        this["selectChunk"] = this["selectChunk"].bind(this)
        this["select"] = this["select"].bind(this)
        this["rangeForVisibleLines"] = this["rangeForVisibleLines"].bind(this)
        this["setView"] = this["setView"].bind(this)
        this["scrollView"] = this["scrollView"].bind(this)
        this["moveCursorAndSelect"] = this["moveCursorAndSelect"].bind(this)
        this["moveCursor"] = this["moveCursor"].bind(this)
        this["setCursor"] = this["setCursor"].bind(this)
        this["deleteSelection"] = this["deleteSelection"].bind(this)
        this["delete"] = this["delete"].bind(this)
        this["insertNewline"] = this["insertNewline"].bind(this)
        this["insert"] = this["insert"].bind(this)
        this["paste"] = this["paste"].bind(this)
        this["copy"] = this["copy"].bind(this)
        this["cut"] = this["cut"].bind(this)
        this["calcGutter"] = this["calcGutter"].bind(this)
        this["setLines"] = this["setLines"].bind(this)
        this.syntax = new syntax
        this.s = immutable({lines:[''],selections:[],cursor:[0,0],view:[0,0],gutter:this.calcGutter(1)})
        this.setCursor(0,0)
    }

    state.prototype["setLines"] = function (lines)
    {
        this.syntax.setLines(lines)
        this.s = this.s.set('gutter',this.calcGutter(lines.length))
        return this.s = this.s.set('lines',lines)
    }

    state.prototype["calcGutter"] = function (numLines)
    {
        return 2 + Math.ceil(Math.log10(numLines))
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
        proc.stdin.write(util.textForLinesRanges(this.s.lines.asMutable(),this.s.selections.asMutable()))
        return proc.stdin.end()
    }

    state.prototype["paste"] = function ()
    {
        var text

        text = child_process.execSync('pbpaste').toString("utf8")
        return this.insert(text)
    }

    state.prototype["insert"] = function (text)
    {
        var i, line, lines, s, split, x, y

        split = text.split(/\r?\n/)
        if (split.length > 1)
        {
            var list = _k_.list(split)
            for (i = 0; i < list.length; i++)
            {
                s = list[i]
                this.insert(s)
                if (i < split.length - 1 || text !== '\n')
                {
                    this.insertNewline()
                }
            }
            return
        }
        x = this.s.cursor[0]
        y = this.s.cursor[1]
        lines = this.s.lines.asMutable()
        line = lines[y]
        line = kstr.splice(line,x,0,text)
        lines.splice(y,1,line)
        this.setLines(lines)
        x += text.length
        this.syntax.updateLines(lines,[y])
        return this.setCursor(x,y)
    }

    state.prototype["insertNewline"] = function ()
    {
        var after, before, line, lines, x, y

        x = this.s.cursor[0]
        y = this.s.cursor[1]
        lines = this.s.lines.asMutable()
        line = lines[y]
        before = line.slice(0, typeof x === 'number' ? x : -1)
        after = line.slice(x)
        lines.splice(y,1,before)
        lines.splice(y + 1,0,after)
        this.setLines(lines)
        y = y + 1
        x = 0
        return this.setCursor(x,y)
    }

    state.prototype["delete"] = function (type)
    {
        var line, lines, x, y

        x = this.s.cursor[0]
        y = this.s.cursor[1]
        lines = this.s.lines.asMutable()
        line = lines[y]
        switch (type)
        {
            case 'eol':
                line = line.slice(0, typeof x === 'number' ? x : -1)
                break
            case 'back':
                line = kstr.splice(line,x - 1,1)
                break
        }

        lines.splice(y,1,line)
        this.setLines(lines)
        switch (type)
        {
            case 'back':
                x -= 1
                this.setCursor(x,y)
                break
        }

        return this
    }

    state.prototype["deleteSelection"] = function ()
    {
        var cursor, lines, selections

        cursor = this.s.cursor.asMutable()
        lines = this.s.lines.asMutable()
        selections = this.s.selections.asMutable()
        var _a_ = util.deleteLinesRangesAndAdjustCursor(lines,selections,cursor); lines = _a_[0]; cursor = _a_[1]

        this.s = this.s.set('selections',[])
        this.setLines(lines)
        this.setCursor(cursor[0],cursor[1])
        return this
    }

    state.prototype["setCursor"] = function (x, y)
    {
        var view

        y = _k_.clamp(0,this.s.lines.length - 1,y)
        x = _k_.max(0,x)
        this.s = this.s.set('cursor',[x,y])
        view = this.s.view.asMutable()
        if (y >= view[1] + this.cells.rows - 1)
        {
            view[1] = y - this.cells.rows + 2
        }
        else if (y < view[1])
        {
            view[1] = y
        }
        if (view[1] > 0 && this.s.lines.length < this.cells.rows)
        {
            view[1] = 0
        }
        view[0] = _k_.max(0,x - this.cells.cols + this.s.gutter + 1)
        this.setView(view)
        return this.cells.t.setCursor(x + this.s.gutter,y - this.s.view[1])
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
        }

        return this.setCursor(c[0],c[1])
    }

    state.prototype["moveCursorAndSelect"] = function (dir)
    {
        var selection, selections

        selections = this.s.selections.asMutable()
        selection = [this.s.cursor[0],this.s.cursor[1],this.s.cursor[0],this.s.cursor[1]]
        selections.push(selection)
        this.moveCursor(dir,1,false)
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
        this.s = this.s.set('selections',util.mergeRanges(selections))
        return true
    }

    state.prototype["scrollView"] = function (dir, steps)
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
        view[1] = _k_.clamp(0,_k_.max(0,this.s.lines.length - this.cells.rows + 1),view[1])
        view[0] = _k_.max(0,view[0])
        this.setView(view)
        return this.cells.t.setCursor(this.s.cursor[0] + this.s.gutter - this.s.view[0],this.s.cursor[1] - this.s.view[1])
    }

    state.prototype["setView"] = function (view)
    {
        return this.s = this.s.set('view',view)
    }

    state.prototype["rangeForVisibleLines"] = function ()
    {
        return [this.s.view[0],this.s.view[1],this.s.view[0] + this.cells.cols - 1,this.s.view[1] + this.cells.rows - 1]
    }

    state.prototype["select"] = function (from, to)
    {
        var selections

        selections = []
        this.setCursor(to[0],to[1])
        if (from[1] > to[1])
        {
            var _a_ = [to,from]; from = _a_[0]; to = _a_[1]

        }
        else if (from[1] === to[1] && from[0] > to[0])
        {
            var _b_ = [to,from]; from = _b_[0]; to = _b_[1]

        }
        to[0] = _k_.clamp(0,this.s.lines[to[1]].length,to[0])
        from[0] = _k_.clamp(0,this.s.lines[from[1]].length,from[0])
        selections.push([from[0],from[1],to[0],to[1]])
        this.s = this.s.set('selections',selections)
        return true
    }

    state.prototype["selectChunk"] = function (x, y)
    {
        var line, re, rs

        line = this.s.lines[y]
        var _a_ = kstr.rangeOfClosestChunk(line,x); rs = _a_[0]; re = _a_[1]

        if (rs >= 0 && re >= 0)
        {
            return this.select([rs,y],[re + 1,y])
        }
    }

    state.prototype["selectWord"] = function (x, y)
    {
        var line, re, rs

        line = this.s.lines[y]
        var _a_ = kstr.rangeOfClosestWord(line,x); rs = _a_[0]; re = _a_[1]

        if (rs >= 0 && re >= 0)
        {
            return this.select([rs,y],[re + 1,y])
        }
    }

    state.prototype["selectLine"] = function (y = this.s.cursor[1])
    {
        if ((0 <= y && y < this.s.lines.length))
        {
            return this.select([0,y],[this.s.lines[y].length,y])
        }
    }

    state.prototype["isSelectedLine"] = function (y)
    {
        var selection

        var list = _k_.list(this.s.selections)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            selection = list[_a_]
            if (selection[3] === y && selection[2] === 0)
            {
                continue
            }
            if ((selection[1] <= y && y <= selection[3]))
            {
                return true
            }
        }
        return false
    }

    state.prototype["deselect"] = function ()
    {
        if (!_k_.empty(this.s.selections))
        {
            this.s = this.s.set('selections',[])
            return true
        }
        return false
    }

    return state
})()

export default state;