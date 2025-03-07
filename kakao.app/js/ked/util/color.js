var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isArr: function (o) {return Array.isArray(o)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let randRange = kxk.randRange

import ansi from "../../kxk/ansi.js"

import util from "./util.js"

class color
{
    static rgb (c)
    {
        return kstr.hexColor(c)
    }

    static hex (c)
    {
        return kstr.hexColor(c)
    }

    static darken (c, f)
    {
        if (_k_.empty(c))
        {
            return [0,0,0]
        }
        return kstr.scaleColor(c,f)
    }

    static brighten (c, f)
    {
        if (_k_.empty(c))
        {
            return [255,255,255]
        }
        return kstr.scaleColor(c,1 + f)
    }

    static bg_rgb (c)
    {
        var b, g, r

        if (_k_.empty(c))
        {
            return '\x1b[49m'
        }
        if (_k_.isArr(c))
        {
            var _a_ = c; r = _a_[0]; g = _a_[1]; b = _a_[2]

        }
        if (_k_.isStr(c))
        {
            var _b_ = color.rgb(c); r = _b_[0]; g = _b_[1]; b = _b_[2]

        }
        return `\x1b[48;2;${r};${g};${b}m`
    }

    static fg_rgb (c)
    {
        var b, g, r

        if (_k_.empty(c))
        {
            return '\x1b[39m'
        }
        if (_k_.isArr(c))
        {
            var _a_ = c; r = _a_[0]; g = _a_[1]; b = _a_[2]

        }
        if (_k_.isStr(c))
        {
            var _b_ = color.rgb(c); r = _b_[0]; g = _b_[1]; b = _b_[2]

        }
        return `\x1b[38;2;${r};${g};${b}m`
    }

    static ul_rgb (c)
    {
        var b, g, r

        if (_k_.empty(c))
        {
            return '\x1b[59m'
        }
        if (_k_.isArr(c))
        {
            var _a_ = c; r = _a_[0]; g = _a_[1]; b = _a_[2]

        }
        if (_k_.isStr(c))
        {
            var _b_ = color.rgb(c); r = _b_[0]; g = _b_[1]; b = _b_[2]

        }
        return `\x1b[58;2;${r};${g};${b}m`
    }

    static randomBackgroundColors (lines, bg, fg)
    {
        var char, clr, idx, line, resl, rl

        resl = []
        var list = _k_.list(lines)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            line = list[_a_]
            rl = ''
            rl += color.fg_rgb(fg)
            var list1 = _k_.list(line)
            for (idx = 0; idx < list1.length; idx++)
            {
                char = list1[idx]
                clr = ''
                if (char === ' ')
                {
                    if (idx && line[idx - 1] !== ' ')
                    {
                        clr = '\x1b[49m'
                    }
                }
                else
                {
                    clr = color.bg_rgb(this.darken(bg,0.75 + Math.random() * 0.25))
                }
                rl += clr + char
            }
            resl.push(rl + '\x1b[49m')
        }
        return resl
    }

    static linesForCells (cells)
    {
        var cell, idx, line, lines, row

        lines = []
        var list = _k_.list(cells)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            row = list[_a_]
            line = ''
            var list1 = _k_.list(row)
            for (idx = 0; idx < list1.length; idx++)
            {
                cell = list1[idx]
                line += color.bg_rgb(cell.bg)
                line += color.fg_rgb(cell.fg)
                line += cell.char
            }
            lines.push(line + '\x1b[49m')
        }
        return lines
    }

    static glowEffect (cells, strength = 0.5)
    {
        var cell, df, dx, dy, nbc, nbcs, row, scl, sum, vi, x, y

        var list = _k_.list(cells)
        for (y = 0; y < list.length; y++)
        {
            row = list[y]
            var list1 = _k_.list(row)
            for (x = 0; x < list1.length; x++)
            {
                cell = list1[x]
                nbcs = util.cellNeighborsAtPos(cells,x,y,6,3)
                if (_k_.empty(nbcs))
                {
                    continue
                }
                sum = [0,0,0]
                var list2 = _k_.list(nbcs)
                for (var _c_ = 0; _c_ < list2.length; _c_++)
                {
                    nbc = list2[_c_]
                    dx = nbc.pos[0] - x
                    dy = nbc.pos[1] - y
                    df = 1 - _k_.max(0,Math.sqrt(dx * dx + dy * dy) / 6)
                    for (vi = 0; vi <= 2; vi++)
                    {
                        sum[vi] += nbc.cell.fg[vi] * df
                    }
                }
                scl = strength * 0.014
                scl = scl * randRange(0.98,1.02)
                sum = sum.map(function (v)
                {
                    return _k_.clamp(0,255,parseInt(scl * v))
                })
                cell.bg = sum
            }
        }
        return cells
    }

    static variateCellsColor (cells, type, amount)
    {
        var cell, clr, f

        var list = _k_.list(cells)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cell = list[_a_]
            clr = cell.cell[type]
            f = 1 + randRange(-amount / 2,amount / 2)
            clr = clr.map(function (v)
            {
                return parseInt(_k_.clamp(0,255,v * f))
            })
            cell.cell[type] = clr
        }
    }

    static dimCellsColor (cells, type, amount)
    {
        var cell, clr

        var list = _k_.list(cells)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cell = list[_a_]
            clr = cell.cell[type]
            clr = clr.map(function (v)
            {
                return parseInt(_k_.clamp(0,255,v * amount))
            })
            cell.cell[type] = clr
        }
    }

    static contrast (c1, c2)
    {
        var c, db, dg, dr, v1, v2

        v1 = color.rgb(c1)
        v2 = color.rgb(c2)
        dr = (v2[0] - v1[0]) / 256
        dg = (v2[1] - v1[1]) / 256
        db = (v2[2] - v1[2]) / 256
        c = dr + dg + db
        return 1 + c / 3
    }
}

export default color;