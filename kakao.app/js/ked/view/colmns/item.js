var item

import kxk from "../../../kxk.js"
let slash = kxk.slash


item = (function ()
{
    function item ()
    {}

    item["symbol"] = function (item)
    {
        var _23_52_

        switch (item.type)
        {
            case 'file':
                return ((_23_52_=icons[slash.ext(item.path)]) != null ? _23_52_ : icons.file)

            case 'dir':
                return (item.open ? icons.dir_open : icons.dir_close)

        }

    }

    item["symbolName"] = function (item)
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

        return this.symbol(item) + ' ' + name
    }

    return item
})()

export default item;