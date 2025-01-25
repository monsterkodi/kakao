var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var state

import immutable from "../kxk/immutable.js"
import kstr from "../kxk/kstr.js"

import color from "./color.js"
import syntax from "./syntax.js"


state = (function ()
{
    function state (cells)
    {
        this.cells = cells
    
        this["deselect"] = this["deselect"].bind(this)
        this["selectLine"] = this["selectLine"].bind(this)
        this["isSelectedLine"] = this["isSelectedLine"].bind(this)
        this["selectWord"] = this["selectWord"].bind(this)
        this["selectChunk"] = this["selectChunk"].bind(this)
        this["select"] = this["select"].bind(this)
        this["moveCursorAndSelect"] = this["moveCursorAndSelect"].bind(this)
        this["moveCursor"] = this["moveCursor"].bind(this)
        this["setCursor"] = this["setCursor"].bind(this)
        this["delete"] = this["delete"].bind(this)
        this["insertNewline"] = this["insertNewline"].bind(this)
        this["insert"] = this["insert"].bind(this)
        this["calcGutter"] = this["calcGutter"].bind(this)
        this.syntax = new syntax
        this.init([''])
    }

    state.prototype["init"] = function (lines, ext)
    {
        this.s = immutable({lines:lines,selections:[],cursor:[0,0],view:[0,0],gutter:this.calcGutter(lines.length)})
        this.syntax.setLines(lines,ext)
        return this.setCursor(0,0)
    }

    state.prototype["calcGutter"] = function (numLines)
    {
        return 2 + Math.ceil(Math.log10(numLines))
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
        this.s = this.s.set('lines',lines)
        x += text.length
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
        this.s = this.s.set('lines',lines)
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
        this.s = this.s.set('lines',lines)
        switch (type)
        {
            case 'back':
                x -= 1
                return this.setCursor(x,y)

        }

    }

    state.prototype["setCursor"] = function (x, y)
    {
        var view

        y = _k_.clamp(0,this.s.lines.length - 1,y)
        x = _k_.max(0,x)
        this.s = this.s.set('cursor',[x,y])
        view = this.s.view.asMutable()
        if (y >= view[1] + this.cells.t.rows() - 1)
        {
            view[1] = y - this.cells.t.rows() + 2
        }
        else if (y < view[1])
        {
            view[1] = y
        }
        view[0] = _k_.max(0,x - this.cells.t.cols() + this.s.gutter + 1)
        this.s = this.s.set('view',view)
        return this.cells.t.setCursor(x + this.s.gutter,y - this.s.view[1])
    }

    state.prototype["moveCursor"] = function (dir, steps = 1, merge = true)
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

        if (merge)
        {
            this.s = this.s.set('selections',this.mergeSelections(this.s.selections.asMutable()))
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
        }

        selection[0] = _k_.clamp(0,this.s.lines[selection[1]].length,selection[0])
        selection[2] = _k_.clamp(0,this.s.lines[selection[3]].length,selection[2])
        this.s = this.s.set('selections',this.mergeSelections(selections))
        return true
    }

    state.prototype["mergeSelections"] = function (sels)
    {
        var i, lastmrgd, mrgd, s

        if (_k_.empty(sels))
        {
            return []
        }
        sels = sels.map(function (a)
        {
            if (a[1] > a[3])
            {
                return [a[2],a[3],a[0],a[1]]
            }
            else
            {
                return a
            }
        })
        sels = sels.map(function (a)
        {
            if (a[1] === a[3] && a[0] > a[2])
            {
                return [a[2],a[1],a[0],a[3]]
            }
            else
            {
                return a
            }
        })
        sels.sort(function (a, b)
        {
            if (a[1] === b[1])
            {
                return a[0] - b[0]
            }
            else
            {
                return a[1] - b[1]
            }
        })
        sels = sels.filter(function (a)
        {
            return a[0] !== a[2] || a[1] !== a[3]
        })
        mrgd = []
        var list = _k_.list(sels)
        for (i = 0; i < list.length; i++)
        {
            s = list[i]
            lastmrgd = (!_k_.empty(mrgd) ? mrgd[mrgd.length - 1] : [])
            if (_k_.empty(mrgd) || s[1] > lastmrgd[3] || s[1] === lastmrgd[3] && s[0] > lastmrgd[2])
            {
                mrgd.push(s)
            }
            else if (s[3] > lastmrgd[3] || s[3] === lastmrgd[3] && s[2] > lastmrgd[2])
            {
                lastmrgd[2] = s[2]
                lastmrgd[3] = s[3]
            }
        }
        return mrgd
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

    state.prototype["selectLine"] = function (y)
    {
        return this.select([0,y],[this.s.lines[y].length,y])
    }

    state.prototype["deselect"] = function ()
    {
        if (!_k_.empty(this.s.selections))
        {
            this.s = this.s.set('selections',[])
            return true
        }
    }

    return state
})()

export default state;