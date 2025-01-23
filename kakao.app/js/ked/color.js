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

    static selection = '#333333'

    static cursor = '#ffff00'

    static linenr = '#1a1a1a'

    static gutter = '#0a0a0a'

    static scroll = '#222222'

    static scroll_dot = '#444444'

    static scroll_knob = '#4444ff'

    static scroll_doth = '#8888ff'

    static column = '#222222'

    static column_fg = '#000000'

    static status = '#222222'

    static status_fg = '#888888'

    static editor = '#0d0d0d'

    static editor_empty = '#0a0a0a'

    static text = '#ffffff'

    static cursor_main = '#202020'

    static cursor_empty = '#000000'

    static syntax = {'text':'#ffffff','punct':'#555555','keyword require':'#444444','punct require':'#3a3a3a','punct minor':'#303030','number':'#aaaaff','keyword':'#9999ff','punct function tail ligature':'#8888ff','punct compare':'#7777ff','punct compare ligature':'#6666ff','punct keyword':'#4444aa','punct keyword return':'#3333aa','punct range ligature':'#2222aa','punct function bound tail ligature':'#ff8888','text this':'#ffaa66','method class':'#ffff88','dictionary key':'#ffff77','method':'#ffff66','class':'#ffff44','function call':'#ffee00','obj':'#ffcc00','function':'#ffaa00','property':'#ff8800','punct method':'#aa6600','punct method class':'#aa6600','punct this':'#995500','punct function':'#884400','punct property':'#664400','comment triple header':'#00bb00','string single':'#00aa00','punct dictionary':'#009900','function argument':'#008800','text require string':'#007700','comment header':'#006600','punct comment triple':'#005500','punct string single':'#004400','punct comment':'#003300'}
}

export default color;