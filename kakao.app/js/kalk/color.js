var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../kxk.js"
let matchr = kxk.matchr

class Color
{
    constructor ()
    {
        this.colorize = this.colorize.bind(this)
        this.config = matchr.config({'=':'equals','e[-+]':'exponent','[\\.]':'dot','[\\(\\)]':'bracket','\\d+':'digit','°':'digit','i':'complex','(sin|cos|tan|exp|log)':'function','NaN':'nan','[πℇx∞ϕ]':'constant','[∡√^]':'op0','[*/]':'op1','[+-]':'dot'})
    }

    colorize (text)
    {
        var colorized, index, rng, rngs

        rngs = matchr.ranges(this.config,text)
        colorized = ''
        index = 0
        var list = _k_.list(rngs)
        for (var _35_16_ = 0; _35_16_ < list.length; _35_16_++)
        {
            rng = list[_35_16_]
            while (index < rng.start)
            {
                index += 1
                colorized += "&nbsp;"
            }
            if (index > rng.start)
            {
                continue
            }
            colorized += `<span class=\"${rng.value}\">${rng.match}</span>`
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