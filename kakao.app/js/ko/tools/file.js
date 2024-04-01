var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var icons, __dirname

import kxk from "../../kxk.js"
let slash = kxk.slash
let ffs = kxk.ffs

icons = {}
__dirname = slash.dir(import.meta.url.slice(7))
ffs.read(slash.path(__dirname,'icons.json')).then(function (t)
{
    return icons = JSON.parse(t)
})
class File
{
    static sourceFileExtensions = ['kode','coffee','styl','swift','pug','md','noon','txt','json','sh','py','cpp','mm','cc','c','cs','h','hpp','ts','js','mjs','frag','vert']

    static isCode (file)
    {
        return _k_.in(slash.ext(file),['coffee','kode','py','cpp','cc','mm','c','cs','ts','js','mjs','h','hpp','frag','vert'])
    }

    static isImage (file)
    {
        return _k_.in(slash.ext(file),['gif','png','jpg','jpeg','svg','bmp','ico'])
    }

    static isText (file)
    {
        return true
    }

    static async rename (from, to)
    {
        var _38_35_

        await ffs.mkdir(slash.dir(to))
        if (await ffs.isDir(to))
        {
            to = slash.path(to,slash.file(from))
        }
        if (await ffs.move(from,to))
        {
            if (editor.currentFile === from)
            {
                editor.currentFile = to
                if ((tabs.activeTab() != null ? tabs.activeTab().file : undefined) === from)
                {
                    tabs.activeTab().setFile(to)
                }
                if (commandline.command.name === 'browse')
                {
                    if (commandline.text() === slash.tilde(from))
                    {
                        commandline.setText(slash.tilde(to))
                    }
                }
                if (!tabs.tab(to))
                {
                    console.log('recreate tab!',tabs.activeTab().file,to)
                }
            }
            return [from,to]
        }
        else
        {
            return null
        }
    }

    static async duplicate (from)
    {
        return await ffs.duplicate(from)
    }

    static async copy (from, to)
    {
        if (await ffs.isDir(to))
        {
            to = slash.path(to,slash.file(from))
        }
        return await ffs.copy(from,to)
    }

    static iconClassName (file)
    {
        var clss

        file = slash.removeLinePos(file)
        clss = icons.ext[slash.ext(file)]
        clss = (clss != null ? clss : icons.base[slash.name(file).toLowerCase()])
        clss = (clss != null ? clss : 'file')
        return `icon ${clss}`
    }

    static save (file, text, cb)
    {
        return ffs.write(file,text).then(cb)
    }

    static span (text)
    {
        var base, clss, ext, span

        base = slash.name(text)
        ext = slash.ext(text).toLowerCase()
        clss = !_k_.empty((ext)) && ' ' + ext || ''
        if (base.startsWith('.'))
        {
            clss += ' dotfile'
        }
        span = `<span class='text${clss}'>` + base + "</span>"
        if (!_k_.empty(ext))
        {
            span += `<span class='ext punct${clss}'>.</span>` + `<span class='ext text${clss}'>` + ext + "</span>"
        }
        return span
    }

    static crumbSpan (file)
    {
        var i, root, s, spans, split

        if (_k_.in(file,['/','']))
        {
            return "<span>/</span>"
        }
        spans = []
        root = ''
        if (slash.isAbsolute(file))
        {
            spans.push("")
            root = '/'
        }
        split = slash.split(file)
        for (var _100_18_ = i = 0, _100_22_ = split.length - 1; (_100_18_ <= _100_22_ ? i < split.length - 1 : i > split.length - 1); (_100_18_ <= _100_22_ ? ++i : --i))
        {
            s = split[i]
            spans.push(`<div class='inline path' id='${root}${split.slice(0, typeof i === 'number' ? i+1 : Infinity).join('/')}'>${s}</div>`)
        }
        spans.push(`<div class='inline' id='${file}'>${split.slice(-1)[0]}</div>`)
        return spans.join("<span class='punct'>/</span>")
    }
}

export default File;