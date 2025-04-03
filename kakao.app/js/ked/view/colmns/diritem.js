var diritem

import icons from "../../theme/icons.js"

import kxk from "../../../kxk.js"
let slash = kxk.slash


diritem = (function ()
{
    function diritem ()
    {}

    diritem["symbol"] = function (item)
    {
        var _24_59_

        switch (item.type)
        {
            case 'dir':
                return (item.open ? icons.dir_open : icons.dir_close)

            default:
                return ((_24_59_=icons[slash.ext(item.path)]) != null ? _24_59_ : icons.file)
        }

    }

    diritem["symbolName"] = function (item)
    {
        var name

        switch (slash.ext(item.path))
        {
            case 'kode':
            case 'noon':
            case 'json':
            case 'pug':
            case 'styl':
            case 'html':
            case 'js':
            case 'md':
                name = slash.name(item.path)
                break
            default:
                name = slash.file(item.path)
        }

        if (item.modified)
        {
            name += ' ✔'
        }
        if (item.added)
        {
            name += ' ✚'
        }
        return this.symbol(item) + '\u00A0' + name
    }

    return diritem
})()

export default diritem;