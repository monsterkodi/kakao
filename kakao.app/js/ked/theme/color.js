var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isArr: function (o) {return Array.isArray(o)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let randRange = kxk.randRange

import ansi from "../../kxk/ansi.js"

import belt from "../edit/tool/belt.js"

class color
{
    static ansi256 = ['#000000','#800000','#008000','#808000','#000080','#800080','#008080','#c0c0c0','#808080','#ff0000','#00ff00','#ffff00','#0000ff','#ff00ff','#00ffff','#ffffff','#000000','#00005f','#000087','#0000af','#0000d7','#0000ff','#005f00','#005f5f','#005f87','#005faf','#005fd7','#005fff','#008700','#00875f','#008787','#0087af','#0087d7','#0087ff','#00af00','#00af5f','#00af87','#00afaf','#00afd7','#00afff','#00d700','#00d75f','#00d787','#00d7af','#00d7d7','#00d7ff','#00ff00','#00ff5f','#00ff87','#00ffaf','#00ffd7','#00ffff','#5f0000','#5f005f','#5f0087','#5f00af','#5f00d7','#5f00ff','#5f5f00','#5f5f5f','#5f5f87','#5f5faf','#5f5fd7','#5f5fff','#5f8700','#5f875f','#5f8787','#5f87af','#5f87d7','#5f87ff','#5faf00','#5faf5f','#5faf87','#5fafaf','#5fafd7','#5fafff','#5fd700','#5fd75f','#5fd787','#5fd7af','#5fd7d7','#5fd7ff','#5fff00','#5fff5f','#5fff87','#5fffaf','#5fffd7','#5fffff','#870000','#87005f','#870087','#8700af','#8700d7','#8700ff','#875f00','#875f5f','#875f87','#875faf','#875fd7','#875fff','#878700','#87875f','#878787','#8787af','#8787d7','#8787ff','#87af00','#87af5f','#87af87','#87afaf','#87afd7','#87afff','#87d700','#87d75f','#87d787','#87d7af','#87d7d7','#87d7ff','#87ff00','#87ff5f','#87ff87','#87ffaf','#87ffd7','#87ffff','#af0000','#af005f','#af0087','#af00af','#af00d7','#af00ff','#af5f00','#af5f5f','#af5f87','#af5faf','#af5fd7','#af5fff','#af8700','#af875f','#af8787','#af87af','#af87d7','#af87ff','#afaf00','#afaf5f','#afaf87','#afafaf','#afafd7','#afafff','#afd700','#afd75f','#afd787','#afd7af','#afd7d7','#afd7ff','#afff00','#afff5f','#afff87','#afffaf','#afffd7','#afffff','#d70000','#d7005f','#d70087','#d700af','#d700d7','#d700ff','#d75f00','#d75f5f','#d75f87','#d75faf','#d75fd7','#d75fff','#d78700','#d7875f','#d78787','#d787af','#d787d7','#d787ff','#d7af00','#d7af5f','#d7af87','#d7afaf','#d7afd7','#d7afff','#d7d700','#d7d75f','#d7d787','#d7d7af','#d7d7d7','#d7d7ff','#d7ff00','#d7ff5f','#d7ff87','#d7ffaf','#d7ffd7','#d7ffff','#ff0000','#ff005f','#ff0087','#ff00af','#ff00d7','#ff00ff','#ff5f00','#ff5f5f','#ff5f87','#ff5faf','#ff5fd7','#ff5fff','#ff8700','#ff875f','#ff8787','#ff87af','#ff87d7','#ff87ff','#ffaf00','#ffaf5f','#ffaf87','#ffafaf','#ffafd7','#ffafff','#ffd700','#ffd75f','#ffd787','#ffd7af','#ffd7d7','#ffd7ff','#ffff00','#ffff5f','#ffff87','#ffffaf','#ffffd7','#ffffff','#080808','#121212','#1c1c1c','#262626','#303030','#3a3a3a','#444444','#4e4e4e','#585858','#606060','#666666','#767676','#808080','#8a8a8a','#949494','#9e9e9e','#a8a8a8','#b2b2b2','#bcbcbc','#c6c6c6','#d0d0d0','#dadada','#e4e4e4','#eeeeee']

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
                nbcs = belt.cellNeighborsAtPos(cells,x,y,6,3)
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