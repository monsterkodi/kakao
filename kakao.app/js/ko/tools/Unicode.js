var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var Unicode

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let ffs = kxk.ffs


Unicode = (function ()
{
    function Unicode ()
    {
        this["onUnicode"] = this["onUnicode"].bind(this)
        ffs.read(slash.path(_k_.dir(),'../../../kode/ko/tools/Uniko.txt')).then((function (uniko)
        {
            this.uniko = uniko
        }).bind(this))
        post.on('unicode',this.onUnicode)
    }

    Unicode.prototype["onUnicode"] = function ()
    {
        var line

        window.split.raise('terminal')
        window.terminal.clear()
        window.terminal.singleCursorAtPos([0,0])
        var list = _k_.list(this.uniko.split('\n'))
        for (var _25_17_ = 0; _25_17_ < list.length; _25_17_++)
        {
            line = list[_25_17_]
            window.terminal.queueMeta({text:line,line:'●'})
        }
    }

    return Unicode
})()

export default Unicode;