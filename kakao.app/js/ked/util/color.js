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

        var _a_ = color.rgb(c); r = _a_[0]; g = _a_[1]; b = _a_[2]

        return `\x1b[48;2;${r};${g};${b}m`
    }

    static fg_rgb (c)
    {
        var b, g, r

        var _a_ = color.rgb(c); r = _a_[0]; g = _a_[1]; b = _a_[2]

        return `\x1b[38;2;${r};${g};${b}m`
    }

    static ul_rgb (c)
    {
        var b, g, r

        var _a_ = color.rgb(c); r = _a_[0]; g = _a_[1]; b = _a_[2]

        return `\x1b[58;2;${r};${g};${b}m`
    }
}

export default color;