var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import dom from "../../kxk/dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent

import util from "../../kxk/util.js"
let pull = util.pull

import kxk from "../../kxk.js"
let elem = kxk.elem
let post = kxk.post
let slash = kxk.slash

import ranges from "../tools/ranges.js"

import File from "../tools/File.js"

class Meta
{
    constructor (editor)
    {
        var _34_26_, _38_13_

        this.editor = editor
    
        this.clear = this.clear.bind(this)
        this.onClearLines = this.onClearLines.bind(this)
        this.onLineDeleted = this.onLineDeleted.bind(this)
        this.onLineInserted = this.onLineInserted.bind(this)
        this.onLinesShifted = this.onLinesShifted.bind(this)
        this.onLinesShown = this.onLinesShown.bind(this)
        this.onLineAppended = this.onLineAppended.bind(this)
        this.onNumber = this.onNumber.bind(this)
        this.onChanged = this.onChanged.bind(this)
        this.metas = []
        this.lineMetas = {}
        this.elem = $(".meta",this.editor.view)
        this.editor.on('changed',this.onChanged)
        this.editor.on('lineAppended',this.onLineAppended)
        this.editor.on('clearLines',this.onClearLines)
        this.editor.on('lineInserted',this.onLineInserted)
        this.editor.on('lineDeleted',this.onLineDeleted)
        this.editor.on('linesShown',this.onLinesShown)
        this.editor.on('linesShifted',this.onLinesShifted)
        if ((this.editor.numbers != null))
        {
            this.editor.numbers.on('numberAdded',this.onNumber)
            this.editor.numbers.on('numberChanged',this.onNumber)
        }
        ;(this.elem != null ? this.elem.addEventListener('mousedown',this.onMouseDown) : undefined)
    }

    onChanged (changeInfo)
    {
        var button, change, file, li, line, localChange, meta, _52_66_, _62_35_

        var list = _k_.list(changeInfo.changes)
        for (var _48_19_ = 0; _48_19_ < list.length; _48_19_++)
        {
            change = list[_48_19_]
            li = change.oldIndex
            if (change.change === 'deleted')
            {
                continue
            }
            var list1 = _k_.list(this.metasAtLineIndex(li))
            for (var _51_21_ = 0; _51_21_ < list1.length; _51_21_++)
            {
                meta = list1[_51_21_]
                if (meta[2].clss === "searchResult" && (meta[2].href != null))
                {
                    var _53_33_ = slash.splitFileLine(meta[2].href); file = _53_33_[0]; line = _53_33_[1]

                    line -= 1
                    localChange = _k_.clone(change)
                    localChange.oldIndex = line
                    localChange.newIndex = line
                    localChange.doIndex = line
                    localChange.after = this.editor.line(meta[0])
                    this.editor.emit('fileSearchResultChange',file,localChange)
                    meta[2].state = 'unsaved'
                    if ((meta[2].span != null))
                    {
                        button = this.saveButton(li)
                        if (!meta[2].span.innerHTML.startsWith("<span"))
                        {
                            meta[2].span.innerHTML = button
                        }
                    }
                }
            }
        }
    }

    saveFileLineMetas (file, lineMetas)
    {
        return fs.readFile(file,{encoding:'utf8'},function (err, data)
        {
            var lineMeta, lines

            if ((err != null))
            {
                return console.error(`Meta.saveFileLineMetas -- readFile err:${err}`)
            }
            lines = data.split(/\r?\n/)
            var list = _k_.list(lineMetas)
            for (var _79_25_ = 0; _79_25_ < list.length; _79_25_++)
            {
                lineMeta = list[_79_25_]
                lines[lineMeta[0]] = lineMeta[1]
            }
            data = lines.join('\n')
            return File.save(file,data,function (file)
            {
                var meta

                if (!file)
                {
                    return console.error(`Meta.saveFileLineMetas -- writeFile err:${err}`)
                }
                var list1 = _k_.list(lineMetas)
                for (var _85_29_ = 0; _85_29_ < list1.length; _85_29_++)
                {
                    lineMeta = list1[_85_29_]
                    if (meta = lineMeta[2])
                    {
                        if (meta[2])
                        {
                            delete meta[2].state
                        }
                        if ((meta[2] != null ? meta[2].span : undefined))
                        {
                            meta[2].span.innerHTML = lineMeta[0] + 1
                        }
                    }
                }
                return post.emit('search-saved',file)
            })
        })
    }

    saveLine (li)
    {
        var file, fileLineMetas, line, lineMetas, meta, mfile, _104_45_

        var list = _k_.list(this.metasAtLineIndex(li))
        for (var _93_17_ = 0; _93_17_ < list.length; _93_17_++)
        {
            meta = list[_93_17_]
            if (meta[2].state === 'unsaved')
            {
                var _95_29_ = slash.splitFileLine(meta[2].href); file = _95_29_[0]; line = _95_29_[1]

                break
            }
        }
        if (file)
        {
            fileLineMetas = {}
            var list1 = _k_.list(this.metas)
            for (var _100_21_ = 0; _100_21_ < list1.length; _100_21_++)
            {
                meta = list1[_100_21_]
                if (meta[2].state === 'unsaved')
                {
                    var _102_34_ = slash.splitFileLine(meta[2].href); mfile = _102_34_[0]; line = _102_34_[1]

                    if (mfile === file)
                    {
                        fileLineMetas[mfile] = ((_104_45_=fileLineMetas[mfile]) != null ? _104_45_ : [])
                        fileLineMetas[mfile].push([line - 1,this.editor.line(meta[0]),meta])
                    }
                }
            }
            for (file in fileLineMetas)
            {
                lineMetas = fileLineMetas[file]
                this.saveFileLineMetas(file,lineMetas)
            }
        }
    }

    saveChanges ()
    {
        var file, fileLineMetas, line, lineMetas, meta, _116_36_

        fileLineMetas = {}
        var list = _k_.list(this.metas)
        for (var _113_17_ = 0; _113_17_ < list.length; _113_17_++)
        {
            meta = list[_113_17_]
            if (meta[2].state === 'unsaved')
            {
                var _115_29_ = slash.splitFileLine(meta[2].href); file = _115_29_[0]; line = _115_29_[1]

                fileLineMetas[file] = ((_116_36_=fileLineMetas[file]) != null ? _116_36_ : [])
                fileLineMetas[file].push([line - 1,this.editor.line(meta[0]),meta])
            }
        }
        for (file in fileLineMetas)
        {
            lineMetas = fileLineMetas[file]
            this.saveFileLineMetas(file,lineMetas)
        }
        return fileLineMetas.length
    }

    saveButton (li)
    {
        return `<span class=\"saveButton\" onclick=\"window.terminal.meta.saveLine(${li});\">&#128190;</span>`
    }

    onNumber (e)
    {
        var meta, metas, num, _143_38_, _146_108_, _147_81_

        metas = this.metasAtLineIndex(e.lineIndex)
        var list = _k_.list(metas)
        for (var _136_17_ = 0; _136_17_ < list.length; _136_17_++)
        {
            meta = list[_136_17_]
            meta[2].span = e.numberSpan
            e.numberSpan.className = ''
            e.numberSpan.parentNode.className = 'linenumber'
            switch (meta[2].clss)
            {
                case 'searchResult':
                case 'termCommand':
                case 'termResult':
                case 'coffeeCommand':
                case 'coffeeResult':
                case 'commandlistItem':
                case 'gitInfoFile':
                    num = meta[2].state === 'unsaved' && this.saveButton(meta[0])
                    if (!num)
                    {
                        num = (meta[2].line != null) && meta[2].line
                    }
                    if (!num)
                    {
                        num = slash.splitFileLine(meta[2].href)[1]
                    }
                    if (!num)
                    {
                        num = '?'
                    }
                    if ((meta[2].lineClss != null))
                    {
                        e.numberSpan.parentNode.className = 'linenumber ' + meta[2].lineClss
                    }
                    if ((meta[2].lineClss != null))
                    {
                        e.numberSpan.className = meta[2].lineClss
                    }
                    e.numberSpan.innerHTML = num
                    break
                case 'spacer':
                    e.numberSpan.innerHTML = '&nbsp;'
                    break
            }

        }
    }

    setMetaPos (meta, tx, ty)
    {
        if (meta[2].div)
        {
            if (meta[2].no_x)
            {
                return meta[2].div.style.transform = `translateY(${ty}px)`
            }
            else
            {
                return meta[2].div.style.transform = `translate(${tx}px,${ty}px)`
            }
        }
    }

    updatePos (meta)
    {
        var size, tx, ty, _169_76_, _170_81_

        size = this.editor.size
        tx = size.charWidth * meta[1][0] + size.offsetX + (((_169_76_=meta[2].xOffset) != null ? _169_76_ : 0))
        ty = size.lineHeight * (meta[0] - this.editor.scroll.top) + (((_170_81_=meta[2].yOffset) != null ? _170_81_ : 0))
        return this.setMetaPos(meta,tx,ty)
    }

    addDiv (meta)
    {
        var div, k, lh, size, sw, v, _1_13_, _186_52_, _196_24_

        size = this.editor.size
        sw = size.charWidth * (meta[1][1] - meta[1][0])
        lh = size.lineHeight
        div = elem({class:`meta ${((_1_13_=meta[2].clss) != null ? _1_13_ : '')}`})
        if ((meta[2].html != null))
        {
            div.innerHTML = meta[2].html
        }
        meta[2].div = div
        div.meta = meta
        if (meta[2].toggled)
        {
            div.classList.add('toggled')
        }
        if (!meta[2].no_h)
        {
            div.style.height = `${lh}px`
        }
        if ((meta[2].style != null))
        {
            for (k in meta[2].style)
            {
                v = meta[2].style[k]
                div.style[k] = v
            }
        }
        if (!meta[2].no_x)
        {
            div.style.width = `${sw}px`
        }
        this.elem.appendChild(div)
        return this.updatePos(meta)
    }

    delDiv (meta)
    {
        var _216_19_

        if (!((meta != null ? meta[2] : undefined) != null))
        {
            return console.error('no line meta?',meta)
        }
        ;(meta[2].div != null ? meta[2].div.remove() : undefined)
        return meta[2].div = null
    }

    add (meta)
    {
        var lineMeta

        lineMeta = this.addLineMeta([meta.line,[meta.start,meta.end],meta])
        if ((this.editor.scroll.top <= meta.line && meta.line <= this.editor.scroll.bot))
        {
            return this.addDiv(lineMeta)
        }
    }

    addDiffMeta (meta)
    {
        meta.diff = true
        return this.addNumberMeta(meta)
    }

    addNumberMeta (meta)
    {
        var lineMeta

        meta.no_x = true
        lineMeta = this.addLineMeta([meta.line,[0,0],meta])
        if ((this.editor.scroll.top <= meta.line && meta.line <= this.editor.scroll.bot))
        {
            return this.addDiv(lineMeta)
        }
    }

    onMouseDown (event)
    {
        var result, _259_28_, _259_38_, _260_38_

        if (((event.target.meta != null ? event.target.meta[2].click : undefined) != null))
        {
            result = (event.target.meta != null ? event.target.meta[2].click(event.target.meta,event) : undefined)
            if (result !== 'unhandled')
            {
                return stopEvent(event)
            }
        }
    }

    append (meta)
    {
        var lineMeta

        lineMeta = this.addLineMeta([this.editor.numLines(),[0,0],meta])
        return lineMeta
    }

    addLineMeta (lineMeta)
    {
        var _278_32_

        if (!((lineMeta != null ? lineMeta[2] : undefined) != null))
        {
            return console.error('invalid line meta?',lineMeta)
        }
        this.lineMetas[lineMeta[0]] = ((_278_32_=this.lineMetas[lineMeta[0]]) != null ? _278_32_ : [])
        this.lineMetas[lineMeta[0]].push(lineMeta)
        this.metas.push(lineMeta)
        return lineMeta
    }

    moveLineMeta (lineMeta, d)
    {
        var _290_32_

        if (!(lineMeta != null) || d === 0)
        {
            return console.error('invalid move?',lineMeta,d)
        }
        pull(this.lineMetas[lineMeta[0]],lineMeta)
        if (_k_.empty(this.lineMetas[lineMeta[0]]))
        {
            delete this.lineMetas[lineMeta[0]]
        }
        lineMeta[0] += d
        this.lineMetas[lineMeta[0]] = ((_290_32_=this.lineMetas[lineMeta[0]]) != null ? _290_32_ : [])
        this.lineMetas[lineMeta[0]].push(lineMeta)
        return this.updatePos(lineMeta)
    }

    onLineAppended (e)
    {
        var meta

        var list = _k_.list(this.metasAtLineIndex(e.lineIndex))
        for (var _296_17_ = 0; _296_17_ < list.length; _296_17_++)
        {
            meta = list[_296_17_]
            if (meta[1][1] === 0)
            {
                meta[1][1] = e.text.length
            }
        }
    }

    metasAtLineIndex (li)
    {
        var _299_45_

        return ((_299_45_=this.lineMetas[li]) != null ? _299_45_ : [])
    }

    hrefAtLineIndex (li)
    {
        var meta, _304_47_

        var list = _k_.list(this.metasAtLineIndex(li))
        for (var _303_17_ = 0; _303_17_ < list.length; _303_17_++)
        {
            meta = list[_303_17_]
            if ((meta[2].href != null))
            {
                return meta[2].href
            }
        }
    }

    onLinesShown (top, bot, num)
    {
        var meta

        var list = _k_.list(this.metas)
        for (var _314_17_ = 0; _314_17_ < list.length; _314_17_++)
        {
            meta = list[_314_17_]
            this.delDiv(meta)
            if ((top <= meta[0] && meta[0] <= bot))
            {
                this.addDiv(meta)
            }
        }
    }

    onLinesShifted (top, bot, num)
    {
        var meta

        if (num > 0)
        {
            var list = _k_.list(rangesFromTopToBotInRanges(top - num,top - 1,this.metas))
            for (var _328_21_ = 0; _328_21_ < list.length; _328_21_++)
            {
                meta = list[_328_21_]
                this.delDiv(meta)
            }
            var list1 = _k_.list(rangesFromTopToBotInRanges(bot - num + 1,bot,this.metas))
            for (var _331_21_ = 0; _331_21_ < list1.length; _331_21_++)
            {
                meta = list1[_331_21_]
                this.addDiv(meta)
            }
        }
        else
        {
            var list2 = _k_.list(rangesFromTopToBotInRanges(bot + 1,bot - num,this.metas))
            for (var _335_21_ = 0; _335_21_ < list2.length; _335_21_++)
            {
                meta = list2[_335_21_]
                this.delDiv(meta)
            }
            var list3 = _k_.list(rangesFromTopToBotInRanges(top,top - num - 1,this.metas))
            for (var _338_21_ = 0; _338_21_ < list3.length; _338_21_++)
            {
                meta = list3[_338_21_]
                this.addDiv(meta)
            }
        }
        return this.updatePositionsBelowLineIndex(top)
    }

    updatePositionsBelowLineIndex (li)
    {
        var meta, size

        size = this.editor.size
        var list = _k_.list(rangesFromTopToBotInRanges(li,this.editor.scroll.bot,this.metas))
        for (var _346_17_ = 0; _346_17_ < list.length; _346_17_++)
        {
            meta = list[_346_17_]
            this.updatePos(meta)
        }
    }

    onLineInserted (li)
    {
        var meta

        var list = _k_.list(rangesFromTopToBotInRanges(li,this.editor.numLines(),this.metas))
        for (var _351_17_ = 0; _351_17_ < list.length; _351_17_++)
        {
            meta = list[_351_17_]
            this.moveLineMeta(meta,1)
        }
        return this.updatePositionsBelowLineIndex(li)
    }

    onLineDeleted (li)
    {
        var meta

        while (meta = _k_.last(this.metasAtLineIndex(li)))
        {
            this.delMeta(meta)
        }
        var list = _k_.list(rangesFromTopToBotInRanges(li,this.editor.numLines(),this.metas))
        for (var _367_17_ = 0; _367_17_ < list.length; _367_17_++)
        {
            meta = list[_367_17_]
            this.moveLineMeta(meta,-1)
        }
        return this.updatePositionsBelowLineIndex(li)
    }

    onClearLines ()
    {
        var meta

        var list = _k_.list(this.metas)
        for (var _380_17_ = 0; _380_17_ < list.length; _380_17_++)
        {
            meta = list[_380_17_]
            this.delDiv(meta)
        }
        this.metas = []
        this.lineMetas = {}
        return this.elem.innerHTML = ""
    }

    clear ()
    {
        this.elem.innerHTML = ""
        this.metas = []
        return this.lineMetas = {}
    }

    delMeta (meta)
    {
        if (!(meta != null))
        {
            return console.error('del no meta?')
        }
        pull(this.lineMetas[meta[0]],meta)
        pull(this.metas,meta)
        return this.delDiv(meta)
    }

    delClass (clss)
    {
        var clsss, meta, _402_34_

        var list = _k_.list(_k_.clone(this.metas))
        for (var _401_17_ = 0; _401_17_ < list.length; _401_17_++)
        {
            meta = list[_401_17_]
            clsss = (meta != null ? meta[2] != null ? (_402_34_=meta[2].clss) != null ? _402_34_.split(' ') : undefined : undefined : undefined)
            if (!_k_.empty((clsss)) && _k_.in(clss,clsss))
            {
                this.delMeta(meta)
            }
        }
    }
}

export default Meta;