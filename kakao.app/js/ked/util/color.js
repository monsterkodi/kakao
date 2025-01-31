var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }}

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
            return [255,255,255]
        }
        if (_k_.isNum(c))
        {
            return color.rgb(Number(c).toString(16))
        }
    }

    static hex (rgb)
    {
        return '#' + rgb.map(function (v)
        {
            return _k_.lpad(2,Number(v).toString(16),'0')
        }).join('')
    }

    static darken (c, f = 0.5)
    {
        return color.hex(color.rgb(c).map(function (v)
        {
            return _k_.clamp(0,255,parseInt(f * v))
        }))
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