var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var state

import immutable from "../kxk/immutable.js"


state = (function ()
{
    function state (cells)
    {
        this.cells = cells
    
        this["moveCursor"] = this["moveCursor"].bind(this)
        this["setCursor"] = this["setCursor"].bind(this)
        this.init([''])
    }

    state.prototype["init"] = function (lines)
    {
        return this.s = immutable({lines:lines,selections:[],cursor:[0,0],view:[0,0]})
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
        this.cells.t.setCursor(x + 4,y - this.s.view[1])
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

    state.prototype["draw"] = function ()
    {
        var li, line, x, y

        for (var _a_ = y = 0, _b_ = this.cells.t.rows(); (_a_ <= _b_ ? y < this.cells.t.rows() : y > this.cells.t.rows()); (_a_ <= _b_ ? ++y : --y))
        {
            li = y + this.s.view[1]
            line = this.s.lines[li]
            for (var _c_ = x = 0, _d_ = _k_.min(line.length,this.cells.t.cols() - 4); (_c_ <= _d_ ? x < _k_.min(line.length,this.cells.t.cols() - 4) : x > _k_.min(line.length,this.cells.t.cols() - 4)); (_c_ <= _d_ ? ++x : --x))
            {
                this.cells.c[y][x + 4].fg = 'ffffff'
                this.cells.c[y][x + 4].char = line[x]
            }
        }
    }

    return state
})()

export default state;