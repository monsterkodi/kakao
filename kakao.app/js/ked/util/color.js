var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var int

import kxk from "../../kxk.js"
let kstr = kxk.kstr


int = function (s)
{
    return parseInt(s)
}
class color
{
    static use256colors = _k_.in('256color',process.env.TERM)

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

    static _256 (c)
    {
        var b, g, r

        var _a_ = color.rgb(c); r = _a_[0]; g = _a_[1]; b = _a_[2]

        if ((r === g && g === b))
        {
            232 + int
            return 24 * g / 255
        }
        else
        {
            r = parseInt(5 * r / 255)
            g = parseInt(5 * g / 255)
            b = parseInt(5 * b / 255)
            return 16 + 36 * r + 6 * g + b
        }
    }

    static bg_rgb (c)
    {
        var b, g, r

        lf('256?',this.use256colors)
        if (this.use256colors)
        {
            return `\x1b[48;5;${color._256(c)}m`
        }
        else
        {
            var _a_ = color.rgb(c); r = _a_[0]; g = _a_[1]; b = _a_[2]

            return `\x1b[48;2;${r};${g};${b}m`
        }
    }

    static fg_rgb (c)
    {
        var b, g, r

        if (this.use256colors)
        {
            return `\x1b[38;5;${color._256(c)}m`
        }
        else
        {
            var _a_ = color.rgb(c); r = _a_[0]; g = _a_[1]; b = _a_[2]

            return `\x1b[38;2;${r};${g};${b}m`
        }
    }

    static ul_rgb (c)
    {
        var b, g, r

        var _a_ = color.rgb(c); r = _a_[0]; g = _a_[1]; b = _a_[2]

        return `\x1b[58;2;${r};${g};${b}m`
    }
}

export default color;