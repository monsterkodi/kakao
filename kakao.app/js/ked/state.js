var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var state

import immutable from "../kxk/immutable.js"
import kstr from "../kxk/kstr.js"

import color from "./color.js"


state = (function ()
{
    function state (cells)
    {
        this.cells = cells
    
        this["draw"] = this["draw"].bind(this)
        this["deselect"] = this["deselect"].bind(this)
        this["selectLine"] = this["selectLine"].bind(this)
        this["isSelectedLine"] = this["isSelectedLine"].bind(this)
        this["selectWord"] = this["selectWord"].bind(this)
        this["selectChunk"] = this["selectChunk"].bind(this)
        this["select"] = this["select"].bind(this)
        this["moveCursorAndSelect"] = this["moveCursorAndSelect"].bind(this)
        this["moveCursor"] = this["moveCursor"].bind(this)
        this["setCursor"] = this["setCursor"].bind(this)
        this["calcGutter"] = this["calcGutter"].bind(this)
        this.init([''])
    }

    state.prototype["init"] = function (lines)
    {
        this.s = immutable({lines:lines,selections:[],cursor:[0,0],view:[0,0],gutter:this.calcGutter(lines.length)})
        return this.setCursor(0,0)
    }

    state.prototype["calcGutter"] = function (numLines)
    {
        return 2 + Math.ceil(Math.log10(numLines))
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
        }

        if (merge)
        {
            this.s = this.s.set('selections',this.mergeSelections(this.s.selections.asMutable()))
        }
        return this.setCursor(c[0],c[1])
    }

    state.prototype["moveCursorAndSelect"] = function (dir)
    {
        var cpos, selection, selections

        cpos = -1
        selections = this.s.selections.asMutable()
        selection = [this.s.cursor[0],this.s.cursor[1],this.s.cursor[0],this.s.cursor[1]]
        selections.push(selection)
        switch (dir)
        {
            case 'up':
            case 'left':
                cpos = 0
                break
            case 'down':
            case 'right':
                cpos = 2
                break
        }

        this.moveCursor(dir,1,false)
        switch (dir)
        {
            case 'left':
                selection[cpos] = selection[cpos] - 1
                break
            case 'right':
                selection[cpos] = selection[cpos] + 1
                break
            case 'up':
                selection[cpos + 1] = _k_.max(0,selection[cpos + 1] - 1)
                break
            case 'down':
                selection[cpos + 1] = _k_.min(this.s.lines.length - 1,selection[cpos + 1] + 1)
                break
        }

        selection[0] = _k_.clamp(0,this.s.lines[selection[1]].length,selection[0])
        selection[2] = _k_.clamp(0,this.s.lines[selection[3]].length,selection[2])
        this.s = this.s.set('selections',selections)
        return true
    }

    state.prototype["mergeSelections"] = function (sels)
    {
        var i, mrgd, s

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
            if (_k_.empty(mrgd) || s[1] > mrgd[mrgd.length - 1][3] || s[0] > mrgd[mrgd.length - 1][2])
            {
                mrgd.push(s)
            }
            else if (s[3] > mrgd[mrgd.length - 1][3] || s[2] > mrgd[mrgd.length - 1][2])
            {
                mrgd[mrgd.length - 1][2] = s[2]
                mrgd[mrgd.length - 1][3] = s[3]
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

    state.prototype["draw"] = function ()
    {
        var li, line, linel, row, selection, x, xe, xs, y

        for (var _a_ = row = 0, _b_ = this.cells.t.rows() - 1; (_a_ <= _b_ ? row < this.cells.t.rows() - 1 : row > this.cells.t.rows() - 1); (_a_ <= _b_ ? ++row : --row))
        {
            y = row + this.s.view[1]
            line = this.s.lines[y]
            for (var _c_ = x = 0, _d_ = this.cells.t.cols() - this.s.gutter; (_c_ <= _d_ ? x < this.cells.t.cols() - this.s.gutter : x > this.cells.t.cols() - this.s.gutter); (_c_ <= _d_ ? ++x : --x))
            {
                if (x + this.s.gutter < this.cells.t.cols() && x + this.s.view[0] < line.length)
                {
                    this.cells.c[row][x + this.s.gutter].fg = color.text
                    this.cells.c[row][x + this.s.gutter].char = line[x + this.s.view[0]]
                }
            }
            if (y < this.s.lines.length)
            {
                linel = line.length - this.s.view[0]
                if (y === this.s.cursor[1])
                {
                    if (linel > 0)
                    {
                        this.cells.bg_rect(this.s.gutter,row,this.s.gutter + linel,row,color.cursor_main)
                    }
                    this.cells.bg_rect(_k_.max(this.s.gutter,this.s.gutter + linel),row,-1,row,color.cursor_empty)
                }
                else
                {
                    if (linel > 0)
                    {
                        this.cells.bg_rect(this.s.gutter,row,this.s.gutter + linel,row,color.editor)
                    }
                    this.cells.bg_rect(_k_.max(this.s.gutter,this.s.gutter + linel),row,-1,row,color.editor_empty)
                }
            }
        }
        var list = _k_.list(this.s.selections)
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            selection = list[_e_]
            for (var _f_ = li = selection[1], _10_ = selection[3]; (_f_ <= _10_ ? li <= selection[3] : li >= selection[3]); (_f_ <= _10_ ? ++li : --li))
            {
                y = li - this.s.view[1]
                if ((this.s.view[1] <= li && li < this.s.view[1] + this.cells.t.rows() - 1))
                {
                    if (li === selection[1])
                    {
                        xs = selection[0]
                    }
                    else
                    {
                        xs = 0
                    }
                    if (li === selection[3])
                    {
                        xe = selection[2]
                    }
                    else
                    {
                        xe = this.s.lines[li].length
                    }
                    for (var _11_ = x = xs, _12_ = xe; (_11_ <= _12_ ? x < xe : x > xe); (_11_ <= _12_ ? ++x : --x))
                    {
                        if ((this.s.gutter <= x - this.s.view[0] + this.s.gutter && x - this.s.view[0] + this.s.gutter < this.cells.t.cols()))
                        {
                            this.cells.c[y][x - this.s.view[0] + this.s.gutter].bg = color.selection
                        }
                    }
                }
            }
        }
    }

    return state
})()

export default state;