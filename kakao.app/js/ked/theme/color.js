var _k_ = {isArr: function (o) {return Array.isArray(o)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }}

var key, val

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let randRange = kxk.randRange

import belt from "../edit/tool/belt.js"

class color
{
    static readabilityCache = {}

    static ansi256 = ['#000000','#800000','#008000','#808000','#000080','#800080','#008080','#c0c0c0','#808080','#ff0000','#00ff00','#ffff00','#0000ff','#ff00ff','#00ffff','#ffffff','#000000','#00005f','#000087','#0000af','#0000d7','#0000ff','#005f00','#005f5f','#005f87','#005faf','#005fd7','#005fff','#008700','#00875f','#008787','#0087af','#0087d7','#0087ff','#00af00','#00af5f','#00af87','#00afaf','#00afd7','#00afff','#00d700','#00d75f','#00d787','#00d7af','#00d7d7','#00d7ff','#00ff00','#00ff5f','#00ff87','#00ffaf','#00ffd7','#00ffff','#5f0000','#5f005f','#5f0087','#5f00af','#5f00d7','#5f00ff','#5f5f00','#5f5f5f','#5f5f87','#5f5faf','#5f5fd7','#5f5fff','#5f8700','#5f875f','#5f8787','#5f87af','#5f87d7','#5f87ff','#5faf00','#5faf5f','#5faf87','#5fafaf','#5fafd7','#5fafff','#5fd700','#5fd75f','#5fd787','#5fd7af','#5fd7d7','#5fd7ff','#5fff00','#5fff5f','#5fff87','#5fffaf','#5fffd7','#5fffff','#870000','#87005f','#870087','#8700af','#8700d7','#8700ff','#875f00','#875f5f','#875f87','#875faf','#875fd7','#875fff','#878700','#87875f','#878787','#8787af','#8787d7','#8787ff','#87af00','#87af5f','#87af87','#87afaf','#87afd7','#87afff','#87d700','#87d75f','#87d787','#87d7af','#87d7d7','#87d7ff','#87ff00','#87ff5f','#87ff87','#87ffaf','#87ffd7','#87ffff','#af0000','#af005f','#af0087','#af00af','#af00d7','#af00ff','#af5f00','#af5f5f','#af5f87','#af5faf','#af5fd7','#af5fff','#af8700','#af875f','#af8787','#af87af','#af87d7','#af87ff','#afaf00','#afaf5f','#afaf87','#afafaf','#afafd7','#afafff','#afd700','#afd75f','#afd787','#afd7af','#afd7d7','#afd7ff','#afff00','#afff5f','#afff87','#afffaf','#afffd7','#afffff','#d70000','#d7005f','#d70087','#d700af','#d700d7','#d700ff','#d75f00','#d75f5f','#d75f87','#d75faf','#d75fd7','#d75fff','#d78700','#d7875f','#d78787','#d787af','#d787d7','#d787ff','#d7af00','#d7af5f','#d7af87','#d7afaf','#d7afd7','#d7afff','#d7d700','#d7d75f','#d7d787','#d7d7af','#d7d7d7','#d7d7ff','#d7ff00','#d7ff5f','#d7ff87','#d7ffaf','#d7ffd7','#d7ffff','#ff0000','#ff005f','#ff0087','#ff00af','#ff00d7','#ff00ff','#ff5f00','#ff5f5f','#ff5f87','#ff5faf','#ff5fd7','#ff5fff','#ff8700','#ff875f','#ff8787','#ff87af','#ff87d7','#ff87ff','#ffaf00','#ffaf5f','#ffaf87','#ffafaf','#ffafd7','#ffafff','#ffd700','#ffd75f','#ffd787','#ffd7af','#ffd7d7','#ffd7ff','#ffff00','#ffff5f','#ffff87','#ffffaf','#ffffd7','#ffffff','#080808','#121212','#1c1c1c','#262626','#303030','#3a3a3a','#444444','#4e4e4e','#585858','#606060','#666666','#767676','#808080','#8a8a8a','#949494','#9e9e9e','#a8a8a8','#b2b2b2','#bcbcbc','#c6c6c6','#d0d0d0','#dadada','#e4e4e4','#eeeeee']

    static hex (c)
    {
        return (_k_.isArr(c) ? kstr.hexColor(c) : c)
    }

    static values (c)
    {
        return (_k_.isStr(c) ? kstr.hexColor(c) : c)
    }

    static darken (c, f = 0.5)
    {
        if (_k_.empty(c))
        {
            return [0,0,0]
        }
        return c.map(function (v)
        {
            return _k_.clamp(0,255,parseInt(f * v))
        })
    }

    static brighten (c, f = 0.5)
    {
        if (_k_.empty(c))
        {
            return [255,255,255]
        }
        return c.map(function (v)
        {
            return _k_.clamp(0,255,parseInt((1 + f) * v))
        })
    }

    static vibrant (c, f = 0.5)
    {
        var w

        if (_k_.empty(c))
        {
            return [128,128,128]
        }
        w = (c[0] + c[1] + c[2]) / 3
        if (c[0] * c[1] * c[2] === 0)
        {
            w *= 2
        }
        return [_k_.min(255,parseInt(c[0] * f + w * (1 - f))),_k_.min(255,parseInt(c[1] * f + w * (1 - f))),_k_.min(255,parseInt(c[2] * f + w * (1 - f)))]
    }

    static saturate (c, s = 1.0, l = 1.0)
    {
        var hsl

        hsl = this.rgbToHsl(c)
        hsl[1] *= s
        hsl[2] *= l
        return this.hslToRgb(hsl)
    }

    static rgbToHsl (c)
    {
        var b, delta, g, h, l, r, s, vmax, vmin

        var _a_ = c; r = _a_[0]; g = _a_[1]; b = _a_[2]

        r /= 255
        g /= 255
        b /= 255
        vmax = Math.max(r,g,b)
        vmin = Math.min(r,g,b)
        delta = vmax - vmin
        h = 0
        s = 0
        l = (vmax + vmin) / 2
        if (delta !== 0)
        {
            s = l > 0.5 ? delta / (2 - vmax - vmin) : delta / (vmax + vmin)
            switch (vmax)
            {
                case r:
                    h = (g - b) / delta + (g < b ? 6 : 0)
                    break
                case g:
                    h = (b - r) / delta + 2
                    break
                case b:
                    h = (r - g) / delta + 4
                    break
            }

            h /= 6
        }
        return [h * 360,s * 100,l * 100]
    }

    static hslToRgb (c)
    {
        var b, g, h, hue2rgb, l, p, q, r, s

        var _a_ = c; h = _a_[0]; s = _a_[1]; l = _a_[2]

        h /= 360
        s /= 100
        l /= 100
        r = 0
        g = 0
        b = 0
        if (s === 0)
        {
            r = g = b = l
        }
        else
        {
            hue2rgb = function (p, q, t)
            {
                if (t < 0)
                {
                    t += 1
                }
                if (t > 1)
                {
                    t -= 1
                }
                if (t < 1 / 6)
                {
                    return p + (q - p) * 6 * t
                }
                if (t < 1 / 2)
                {
                    return q
                }
                if (t < 2 / 3)
                {
                    return p + (q - p) * (2 / 3 - t) * 6
                }
                return p
            }
            q = l < 0.5 ? l * (1 + s) : l + s - l * s
            p = 2 * l - q
            r = hue2rgb(p,q,h + 1 / 3)
            g = hue2rgb(p,q,h)
            b = hue2rgb(p,q,h - 1 / 3)
        }
        return [Math.round(r * 255),Math.round(g * 255),Math.round(b * 255)]
    }

    static bg_rgb (c)
    {
        if (_k_.empty(c))
        {
            return '\x1b[49m'
        }
        return `\x1b[48;2;${c[0]};${c[1]};${c[2]}m`
    }

    static fg_rgb (c)
    {
        if (_k_.empty(c))
        {
            return '\x1b[39m'
        }
        return `\x1b[38;2;${c[0]};${c[1]};${c[2]}m`
    }

    static ul_rgb (c)
    {
        if (_k_.empty(c))
        {
            return '\x1b[59m'
        }
        return `\x1b[58;2;${c[0]};${c[1]};${c[2]}m`
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
        var c, db, dg, dr

        dr = (c2[0] - c1[0]) / 256
        dg = (c2[1] - c1[1]) / 256
        db = (c2[2] - c1[2]) / 256
        c = dr + dg + db
        return 1 + c / 3
    }

    static adjustForBackground (fg, bg)
    {
        var clr, _312_35_

        color.readabilityCache[bg] = ((_312_35_=color.readabilityCache[bg]) != null ? _312_35_ : {})
        if (clr = color.readabilityCache[bg][fg])
        {
            return clr
        }
        return color.readabilityCache[bg][fg] = this.ensureReadability(fg,bg)
    }

    static luminance (c)
    {
        var b, g, r

        var _a_ = c; r = _a_[0]; g = _a_[1]; b = _a_[2]

        r = r / 255
        g = g / 255
        b = b / 255
        r = r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4
        g = g <= 0.03928 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4
        b = b <= 0.03928 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    static ensureReadability (fg, bg)
    {
        var bgLuminance, cnt, contrast, contrastRatio, fgLuminance, fgo, h, l, s, step, targetContrast

        if (_k_.empty(fg) || !(_k_.isNum(fg[0])))
        {
            return fg
        }
        if (_k_.empty(bg) || !(_k_.isNum(bg[0])))
        {
            return fg
        }
        fgo = _k_.copy(fg)
        contrastRatio = function (l1, l2)
        {
            return (_k_.max(l1,l2) + 0.05) / (_k_.min(l1,l2) + 0.05)
        }
        fgLuminance = this.luminance(fg)
        bgLuminance = this.luminance(bg)
        contrast = contrastRatio(fgLuminance,bgLuminance)
        targetContrast = 4.5
        var _a_ = this.rgbToHsl(fg); h = _a_[0]; s = _a_[1]; l = _a_[2]

        step = (bgLuminance > 0.5 ? -5 : 5)
        cnt = 0
        while (cnt < 50)
        {
            cnt++
            fg = this.hslToRgb([h,s,l])
            fgLuminance = this.luminance(fg)
            contrast = contrastRatio(fgLuminance,bgLuminance)
            if (contrast >= targetContrast)
            {
                console.log(`✔ ${cnt}`)
                return fg
            }
            l += step
            if (l < 0 || l > 100)
            {
                step = -step
            }
        }
        console.log(`fail ${fgo} ${bg}`)
        return fgo
    }
}

for (key in color.ansi256)
{
    val = color.ansi256[key]
    color.ansi256[key] = color.values(val)
}
export default color;