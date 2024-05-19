var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../kxk.js"
let matchr = kxk.matchr

class Color
{
    constructor ()
    {
        var cfg

        this.colorize = this.colorize.bind(this)
        cfg = {'(sin|cos|a?tan|exp|log|hex)':'function','0x[0-9a-f]*':'hex','=':'equals','e[-+]':'exponent','[\\.]':'dot','[\\(\\)]':'bracket','\\d+':'digit','°':'digit','i':'complex','NaN':'nan','[π∞ϕ]':'constant','[∡√^]':'op0','[*/]':'op1','[+-]':'op2'}
        cfg[symbol.euler] = 'constant'
        this.config = matchr.config(cfg)
    }

    colorize (text)
    {
        var clss, colorized, index, rng, rngs, _47_28_

        rngs = matchr.ranges(this.config,text)
        colorized = ''
        index = 0
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            while (index < rng.start)
            {
                index += 1
                colorized += "&nbsp;"
            }
            if (index > rng.start)
            {
                continue
            }
            clss = ((_47_28_=rng.clss) != null ? _47_28_ : 'text')
            if (clss === 'hex')
            {
                colorized += "<span class=\"hex prefix\">0x</span>"
                colorized += `<span class=\"hex digit\">${rng.match.slice(2)}</span>`
            }
            else
            {
                colorized += `<span class=\"${clss}\">${rng.match}</span>`
            }
            index = rng.start + rng.match.length
        }
        while (index < text.length)
        {
            index += 1
            colorized += "&nbsp;"
        }
        return colorized
    }
}

export default (new Color()).colorize;