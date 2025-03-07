var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var unype

import fonts from '../../util/fonts.json' with { type : "json" }

unype = (function ()
{
    unype["map"] = {}
    function unype ()
    {
        var char, def, font, idx, text

        this.name = 'unype'
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

        if (repl = unype.map['crazy'][text])
        {
            text = repl
        }
        return text
    }

    return unype
})()

export default unype;