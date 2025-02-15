var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var int

import kxk from "../../kxk.js"
let kstr = kxk.kstr

import ansi from "../../kxk/ansi.js"


int = function (s)
{
    return parseInt(s)
}
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
        return kstr.darkenColor(c,f)
    }

    static bg_rgb (c)
    {
        var b, g, r

        if (_k_.empty(c))
        {
            return '\x1b[49m'
        }
        var _a_ = color.rgb(c); r = _a_[0]; g = _a_[1]; b = _a_[2]

        return `\x1b[48;2;${r};${g};${b}m`
    }

    static fg_rgb (c)
    {
        var b, g, r

        if (_k_.empty(c))
        {
            return '\x1b[39m'
        }
        var _a_ = color.rgb(c); r = _a_[0]; g = _a_[1]; b = _a_[2]

        return `\x1b[38;2;${r};${g};${b}m`
    }

    static ul_rgb (c)
    {
        var b, g, r

        if (_k_.empty(c))
        {
            return '\x1b[59m'
        }
        var _a_ = color.rgb(c); r = _a_[0]; g = _a_[1]; b = _a_[2]

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
            resl.push(rl + '\x1b[49m\x1b[39m')
        }
        return resl
    }
}

export default color;