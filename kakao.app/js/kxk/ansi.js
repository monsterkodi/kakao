var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var initStyles, STYLES, toHexString

import kstr from "./kstr.js"

STYLES = {f0:'#000',f1:'#F00',f2:'#0D0',f3:'#DD0',f4:'#00F',f5:'#D0D',f6:'#0DD',f7:'#AAA',f8:'#555',f9:'#F55',f10:'#5F5',f11:'#FF5',f12:'#55F',f13:'#F5F',f14:'#5FF',f15:'#FFF',b0:'#000',b1:'#A00',b2:'#0A0',b3:'#A50',b4:'#00A',b5:'#A0A',b6:'#0AA',b7:'#AAA',b8:'#555',b9:'#F55',b10:'#5F5',b11:'#FF5',b12:'#55F',b13:'#F5F',b14:'#5FF',b15:'#FFF'}

toHexString = function (num)
{
    num = num.toString(16)
    while (num.length < 2)
    {
        num = `0${num}`
    }
    return num
}

initStyles = function ()
{
    var b, blue, c, g, gray, green, l, n, r, red, rgb

    for (red = 0; red <= 5; red++)
    {
        for (green = 0; green <= 5; green++)
        {
            for (blue = 0; blue <= 5; blue++)
            {
                c = 16 + (red * 36) + (green * 6) + blue
                r = red > 0 ? red * 40 + 55 : 0
                g = green > 0 ? green * 40 + 55 : 0
                b = blue > 0 ? blue * 40 + 55 : 0
                rgb = (function () { var r_a_ = []; var list = [r,g,b]; for (var _b_ = 0; _b_ < list.length; _b_++)  { n = list[_b_];r_a_.push(toHexString(n))  } return r_a_ }).bind(this)().join('')
                STYLES[`f${c}`] = `#${rgb}`
                STYLES[`b${c}`] = `#${rgb}`
            }
        }
    }
    for (gray = 0; gray <= 23; gray++)
    {
        c = gray + 232
        l = toHexString(gray * 10 + 8)
        STYLES[`f${c}`] = `#${l}${l}${l}`
        STYLES[`b${c}`] = `#${l}${l}${l}`
    }
}
class Ansi
{
    static strip (s)
    {
        var STRIPANSI

        if (!(_k_.isStr(s)))
        {
            return s
        }
        STRIPANSI = /\x1B[[(?);]{0,2}(;?\d)*./g
        return s.replace(STRIPANSI,'')
    }

    static html (s)
    {
        var andi, d, diss, htmlLine, i, l, lines, span, _105_32_

        andi = new Ansi()
        lines = []
        var list = ((_105_32_=(s != null ? s.split('\n') : undefined)) != null ? _105_32_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            l = list[_a_]
            diss = andi.dissect(l)[1]
            htmlLine = ''
            for (var _b_ = i = 0, _c_ = diss.length; (_b_ <= _c_ ? i < diss.length : i > diss.length); (_b_ <= _c_ ? ++i : --i))
            {
                d = diss[i]
                span = d.styl && `<span style=\"${d.styl}\">${d.match}</span>` || d.match
                if (parseInt(i))
                {
                    if (diss[i - 1].start + diss[i - 1].match.length < d.start)
                    {
                        htmlLine += ' '
                    }
                }
                htmlLine += span
            }
            lines.push(htmlLine)
        }
        return lines.join('\n')
    }

    static colors ()
    {
        var b, blue, g, green, h, hex, n, r, red, rgb

        hex = ['#000000','#cd0000','#00cd00','#cdcd00','#0000ee','#cd00cd','#00cdcd','#e5e5e5','#7f7f7f','#ff0000','#00ff00','#ffff00','#5c5cff','#ff00ff','#00ffff','#ffffff']
        for (red = 0; red <= 5; red++)
        {
            for (green = 0; green <= 5; green++)
            {
                for (blue = 0; blue <= 5; blue++)
                {
                    r = (red > 0 ? red * 40 + 55 : 0)
                    g = (green > 0 ? green * 40 + 55 : 0)
                    b = (blue > 0 ? blue * 40 + 55 : 0)
                    rgb = (function () { var r_a_ = []; var list = [r,g,b]; for (var _b_ = 0; _b_ < list.length; _b_++)  { n = list[_b_];r_a_.push(toHexString(n))  } return r_a_ }).bind(this)().join('')
                    hex.push(`#${rgb}`)
                }
            }
        }
        for (g = 0; g < 24; g++)
        {
            h = g * 10 + 8
            hex.push(`#${toHexString(h)}${toHexString(h)}${toHexString(h)}`)
        }
        return hex
    }

    static bg (c)
    {
        var b, g, r

        var _a_ = kstr.hexColor(c); r = _a_[0]; g = _a_[1]; b = _a_[2]

        return `\x1b[48;2;${r};${g};${b}m`
    }

    static fg (c)
    {
        var b, g, r

        var _a_ = kstr.hexColor(c); r = _a_[0]; g = _a_[1]; b = _a_[2]

        return `\x1b[38;2;${r};${g};${b}m`
    }

    static bg256 (c)
    {
        return `\x1b[48;5;${Ansi.idx256(c)}m`
    }

    static idx256 (c)
    {
        var b, g, r

        var _a_ = kstr.hexColor(c); r = _a_[0]; g = _a_[1]; b = _a_[2]

        if ((r === g && g === b))
        {
            return 232 + parseInt((g - 8) / 10)
        }
        r = (r > 0 ? parseInt((r - 55) / 40) : 0)
        g = (g > 0 ? parseInt((g - 55) / 40) : 0)
        b = (b > 0 ? parseInt((b - 55) / 40) : 0)
        return 16 + (r * 36) + (g * 6) + b
    }

    static log256Colors ()
    {
        var i, j, s

        s = ''
        for (i = 0; i < 4; i++)
        {
            for (j = 0; j < 4; j++)
            {
                s += `\x1b[48;5;${i * 4 + j}m\x1b[38;5;${i * 4 + j}m ● \x1b[48;5;0m` + Ansi.bg256(Ansi.c256[i * 4 + j]) + Ansi.idx256(Ansi.c256[i * 4 + j]) + ' '
            }
            s += '\x1b[49m\n'
        }
        for (i = 0; i < 36; i++)
        {
            for (j = 0; j < 6; j++)
            {
                s += `\x1b[48;5;${i * 6 + j + 16}m\x1b[38;5;${i * 6 + j + 16}m ● \x1b[48;5;0m` + Ansi.bg256(Ansi.c256[i * 6 + j + 16]) + Ansi.idx256(Ansi.c256[i * 6 + j + 16]) + '  '
            }
            s += '\x1b[49m\n'
        }
        for (i = 0; i < 4; i++)
        {
            for (j = 0; j < 6; j++)
            {
                s += `\x1b[48;5;${i * 6 + j + 16 + 6 * 36}m\x1b[38;5;${i * 6 + j + 16 + 6 * 36}m ● \x1b[48;5;0m` + Ansi.bg256(Ansi.c256[i * 6 + j + 16 + 6 * 36]) + Ansi.idx256(Ansi.c256[i * 6 + j + 16 + 6 * 36]) + '  '
            }
            s += '\x1b[49m\n'
        }
        console.log(s)
    }

    dissect (input)
    {
        this.input = input
    
        this.diss = []
        this.text = ""
        this.tokenize()
        return [this.text,this.diss]
    }

    tokenize ()
    {
        var addStyle, addText, ansiCode, ansiHandler, ansiMatch, bg, delStyle, fg, handler, i, invert, length, process, resetStyle, setBG, setFG, st, start, toHighIntensity, tokens

        start = 0
        ansiHandler = 2
        ansiMatch = false
        invert = false
        fg = bg = ''
        st = []
        resetStyle = function ()
        {
            fg = bg = ''
            invert = false
            return st = []
        }
        addStyle = function (style)
        {
            if (!(_k_.in(style,st)))
            {
                return st.push(style)
            }
        }
        delStyle = function (style)
        {
            return st.splice(st.indexOf(style),1)
        }
        setFG = function (cs)
        {
            if (cs.length === 5)
            {
                return fg = `rgb(${cs[2]},${cs[3]},${cs[4]})`
            }
            else
            {
                return fg = STYLES[`f${cs[2]}`]
            }
        }
        setBG = function (cs)
        {
            if (cs.length === 5)
            {
                return bg = `rgb(${cs[2]},${cs[3]},${cs[4]})`
            }
            else
            {
                return bg = STYLES[`b${cs[2]}`]
            }
        }
        addText = (function (t)
        {
            var addMatch, addSpace, i, match, mstrt, space, sstrt

            start = this.text.length
            match = ''
            mstrt = start
            space = ''
            sstrt = start
            addMatch = (function ()
            {
                var style

                if (match.length)
                {
                    style = ''
                    if (invert)
                    {
                        if (bg.length)
                        {
                            style += `color:${bg};`
                        }
                        else
                        {
                            style += 'color:#000;'
                        }
                        if (fg.length)
                        {
                            style += `background-color:${fg};`
                        }
                        else
                        {
                            style += 'background-color:#fff;'
                        }
                    }
                    else
                    {
                        if (fg.length)
                        {
                            style += `color:${fg};`
                        }
                        if (bg.length)
                        {
                            style += `background-color:${bg};`
                        }
                    }
                    if (st.length)
                    {
                        style += st.join(';')
                    }
                    this.diss.push({match:match,start:mstrt,styl:style})
                    return match = ''
                }
            }).bind(this)
            addSpace = (function ()
            {
                if (space.length)
                {
                    this.diss.push({match:space,start:sstrt,styl:`background-color:${bg};`})
                    return space = ''
                }
            }).bind(this)
            for (var _a_ = i = 0, _b_ = t.length; (_a_ <= _b_ ? i < t.length : i > t.length); (_a_ <= _b_ ? ++i : --i))
            {
                if (t[i] !== ' ')
                {
                    if (match === '')
                    {
                        mstrt = start + i
                    }
                    match += t[i]
                    addSpace()
                }
                else
                {
                    if (bg.length)
                    {
                        if (space === '')
                        {
                            sstrt = start + i
                        }
                        space += t[i]
                    }
                    addMatch()
                }
            }
            addMatch()
            addSpace()
            this.text += t
            start = this.text.length
            return ''
        }).bind(this)
        toHighIntensity = function (c)
        {
            var i

            for (i = 0; i <= 7; i++)
            {
                if (c === STYLES[`f${i}`])
                {
                    return STYLES[`f${8 + i}`]
                }
            }
            return c
        }
        ansiCode = function (m, c)
        {
            var code, cs

            ansiMatch = true
            if (c.trim().length === 0)
            {
                c = '0'
            }
            cs = c.trimRight(';').split(';')
            var list = _k_.list(cs)
            for (var _c_ = 0; _c_ < list.length; _c_++)
            {
                code = list[_c_]
                code = parseInt(code,10)
                switch (code)
                {
                    case 0:
                        resetStyle()
                        break
                    case 1:
                        addStyle('font-weight:bold')
                        fg = toHighIntensity(fg)
                        break
                    case 2:
                        addStyle('opacity:0.5')
                        break
                    case 4:
                        addStyle('text-decoration:underline')
                        break
                    case 7:
                        invert = true
                        break
                    case 27:
                        invert = false
                        break
                    case 8:
                        addStyle('display:none')
                        break
                    case 9:
                        addStyle('text-decoration:line-through')
                        break
                    case 39:
                        fg = STYLES["f15"]
                        break
                    case 49:
                        bg = STYLES["b0"]
                        break
                    case 38:
                        setFG(cs)
                        break
                    case 48:
                        setBG(cs)
                        break
                    case 28:
                        delStyle('display:none')
                        break
                    case 22:
                        delStyle('font-weight:bold')
                        delStyle('opacity:0.5')
                        break
                    default:
                        if ((30 <= code && code <= 37))
                    {
                        fg = STYLES[`f${code - 30}`]
                    }
                    else if ((40 <= code && code <= 47))
                    {
                        bg = STYLES[`b${code - 40}`]
                    }
                    else if ((90 <= code && code <= 97))
                    {
                        fg = STYLES[`f${8 + code - 90}`]
                    }
                }

                if (_k_.in(code,[38,48]))
                {
                    break
                }
            }
            return ''
        }
        tokens = [{pattern:/^\x08+/,sub:''},{pattern:/^\x1b\[[012]?K/,sub:''},{pattern:/^\x1b\[((?:\d{1,3};?)+|)m/,sub:ansiCode},{pattern:/^\x1b\[?[\d;]{0,3}/,sub:''},{pattern:/^([^\x1b\x08\n]+)/,sub:addText}]
        process = (function (handler, i)
        {
            if (i > ansiHandler && ansiMatch)
            {
                return
            }
            ansiMatch = false
            return this.input = this.input.replace(handler.pattern,handler.sub)
        }).bind(this)
        while ((length = this.input.length) > 0)
        {
            var list = _k_.list(tokens)
            for (i = 0; i < list.length; i++)
            {
                handler = list[i]
                process(handler,i)
            }
            if (this.input.length === length)
            {
                break
            }
        }
    }
}

initStyles()
Ansi.c256 = Ansi.colors()
export default Ansi;