var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

class color
{
    static rgb (c)
    {
        if (_k_.isStr(c))
        {
            if (c.length === 7)
            {
                c = c.slice(1)
            }
            if (c.length === 6)
            {
                return [Number.parseInt(c.slice(0, 2),16),Number.parseInt(c.slice(2, 4),16),Number.parseInt(c.slice(4, 6),16)]
            }
            if (c.length === 3)
            {
                return [Number.parseInt(c[0],16),Number.parseInt(c[1],16),Number.parseInt(c[2],16)]
            }
            return [1,1,1]
        }
        if (_k_.isNum(c))
        {
            return color.rgb(Number(c).toString(16))
        }
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

    static selection = '#444488'

    static cursor = '#ffff00'

    static linenr = '#1a1a1a'

    static gutter = '#0a0a0a'

    static scroll = '#222222'

    static scroll_dot = '#333333'

    static scroll_knob = '#4444ff'

    static scroll_doth = '#8888ff'

    static column = '#222222'

    static column_fg = '#000000'

    static status = '#222222'

    static status_fg = "#888888"

    static editor = '#181818'

    static text = '#ffffff'

    static cursor_main = '#2f2f2f'

    static editor_empty = '#0a0a0a'

    static cursor_empty = '#000000'
}

export default color;