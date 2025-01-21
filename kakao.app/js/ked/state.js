var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var state

import immutable from "../kxk/immutable.js"


state = (function ()
{
    function state (cells)
    {
        this.cells = cells
    
        this["draw"] = this["draw"].bind(this)
        this["deselect"] = this["deselect"].bind(this)
        this["selectLine"] = this["selectLine"].bind(this)
        this["selectWord"] = this["selectWord"].bind(this)
        this["select"] = this["select"].bind(this)
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
        var doRedraw, view

        y = _k_.clamp(0,this.s.lines.length - 1,y)
        x = _k_.clamp(0,this.s.lines[y].length,x)
        this.s = this.s.set('cursor',[x,y])
        if (y > this.s.view[1] + this.cells.t.rows())
        {
            view = this.s.view.asMutable()
            view[1] = y - this.cells.t.rows()
            this.s = this.s.set('view',view)
            doRedraw = true
        }
        else if (y < this.s.view[1])
        {
            view = this.s.view.asMutable()
            view[1] = y
            this.s = this.s.set('view',view)
            doRedraw = true
        }
        this.cells.t.setCursor(x + this.s.gutter,y - this.s.view[1])
        return doRedraw
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
        }

        return this.setCursor(c[0],c[1])
    }

    state.prototype["select"] = function (from, to)
    {
        var ll, selections, x1, x2, y

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
        for (var _c_ = y = from[1], _d_ = to[1]; (_c_ <= _d_ ? y <= to[1] : y >= to[1]); (_c_ <= _d_ ? ++y : --y))
        {
            ll = _k_.max(0,this.s.lines[y].length)
            if (y === from[1])
            {
                x1 = _k_.clamp(0,ll,from[0])
            }
            else
            {
                x1 = 0
            }
            if (y === to[1])
            {
                x2 = _k_.clamp(0,ll,to[0])
            }
            else
            {
                x2 = ll
            }
            if (x1 < x2)
            {
                selections.push([x1,y,x2])
            }
        }
        this.s = this.s.set('selections',selections)
        return true
    }

    state.prototype["selectWord"] = function (x, y)
    {}

    state.prototype["selectLine"] = function (y)
    {
        return this.select([0,y],[this.s.lines.length - 1,y])
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
        var li, line, selection, x, y

        for (var _a_ = y = 0, _b_ = this.cells.t.rows(); (_a_ <= _b_ ? y < this.cells.t.rows() : y > this.cells.t.rows()); (_a_ <= _b_ ? ++y : --y))
        {
            li = y + this.s.view[1]
            line = this.s.lines[li]
            for (var _c_ = x = 0, _d_ = _k_.min(line.length,this.cells.t.cols() - this.s.gutter); (_c_ <= _d_ ? x < _k_.min(line.length,this.cells.t.cols() - this.s.gutter) : x > _k_.min(line.length,this.cells.t.cols() - this.s.gutter)); (_c_ <= _d_ ? ++x : --x))
            {
                if (x + this.s.gutter < this.cells.t.cols())
                {
                    this.cells.c[y][x + this.s.gutter].fg = 'ffffff'
                    this.cells.c[y][x + this.s.gutter].char = line[x]
                }
            }
        }
        var list = _k_.list(this.s.selections)
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            selection = list[_e_]
            li = selection[1]
            y = li - this.s.view[1]
            if ((this.s.view[1] <= li && li < this.s.view[1] + this.cells.t.rows()))
            {
                for (var _f_ = x = selection[0], _10_ = selection[2]; (_f_ <= _10_ ? x < selection[2] : x > selection[2]); (_f_ <= _10_ ? ++x : --x))
                {
                    if (x + this.s.gutter < this.cells.t.cols())
                    {
                        this.cells.c[y][x + this.s.gutter].bg = '444488'
                    }
                }
            }
        }
    }

    return state
})()

export default state;