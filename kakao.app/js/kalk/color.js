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
        var clss, colorized, index, rng, rngs, _42_29_

        rngs = matchr.ranges(this.config,text)
        console.log('rngs',rngs)
        colorized = ''
        index = 0
        var list = _k_.list(rngs)
        for (var _36_16_ = 0; _36_16_ < list.length; _36_16_++)
        {
            rng = list[_36_16_]
            while (index < rng.start)
            {
                index += 1
                colorized += "&nbsp;"
            }
            if (index > rng.start)
            {
                continue
            }
            clss = ((_42_29_=rng.value) != null ? _42_29_ : 'text')
            colorized += `<span class=\"${clss}\">${rng.match}</span>`
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