var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var unype

import kseg from "../../../kxk/kseg.js"

import theme from "../../theme/theme.js"

import fonts from '../../util/fonts.json' with { type : "json" }

unype = (function ()
{
    unype["map"] = {}
    function unype ()
    {
        var char, def, font, idx, text

        this.name = 'unype'
        this.font = 'large'
        if (_k_.empty(unype.map))
        {
            def = fonts.default.join(' ')
            for (font in fonts)
            {
                text = fonts[font]
                if (font === 'default')
                {
                    continue
                }
                unype.map[font] = {}
                var list = _k_.list(kseg(text.join(' ')))
                for (idx = 0; idx < list.length; idx++)
                {
                    char = list[idx]
                    if (def[idx] !== ' ')
                    {
                        unype.map[font][def[idx]] = char
                    }
                }
            }
            unype.map['full width'][' '] = '　'
        }
    }

    unype.prototype["insert"] = function (text)
    {
        var repl

        if (this.font === 'large')
        {
            text = '\x1b]66;s=2;' + text + '\x1b\x5c'
        }
        else
        {
            if (repl = unype.map[this.font][text])
            {
                text = repl
            }
        }
        return text
    }

    unype.prototype["themeColor"] = function (colorName, defaultColor)
    {
        switch (colorName)
        {
            case 'cursor.multi':
                return theme.scroll.hover

            case 'cursor.main':
                return theme.scroll.dot

        }

        return defaultColor
    }

    return unype
})()

export default unype;