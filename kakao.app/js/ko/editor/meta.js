// monsterkodi/kode 0.256.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var $, stopEvent

import ranges from "../tools/ranges.js"

import dom from "../../kxk/dom.js"

import elem from "../../kxk/elem.js"

import post from "../../kxk/post.js"

import slash from "../../kxk/slash.js"

$ = dom.$
stopEvent = dom.stopEvent

import File from '../tools/file.js'
class Meta
{
    constructor (editor)
    {
        var _37_26_

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
        this.elem.addEventListener('mousedown',this.onMouseDown)
    }

    onChanged (changeInfo)
    {
        var button, change, file, li, line, localChange, meta, _55_66_, _65_35_

        var list = _k_.list(changeInfo.changes)
        for (var _51_19_ = 0; _51_19_ < list.length; _51_19_++)
        {
            change = list[_51_19_]
            li = change.oldIndex
            if (change.change === 'deleted')
            {
                continue
            }
            var list1 = _k_.list(this.metasAtLineIndex(li))
            for (var _54_21_ = 0; _54_21_ < list1.length; _54_21_++)
            {
                meta = list1[_54_21_]
                if (meta[2].clss === "searchResult" && (meta[2].href != null))
                {
                    var _56_33_ = slash.splitFileLine(meta[2].href); file = _56_33_[0]; line = _56_33_[1]

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
                return kerror(`Meta.saveFileLineMetas -- readFile err:${err}`)
            }
            lines = data.split(/\r?\n/)
            var list = _k_.list(lineMetas)
            for (var _81_25_ = 0; _81_25_ < list.length; _81_25_++)
            {
                lineMeta = list[_81_25_]
                lines[lineMeta[0]] = lineMeta[1]
            }
            data = lines.join('\n')
            return File.save(file,data,function (err, file)
            {
                var meta

                if ((err != null))
                {
                    return kerror(`Meta.saveFileLineMetas -- writeFile err:${err}`)
                }
                var list1 = _k_.list(lineMetas)
                for (var _87_29_ = 0; _87_29_ < list1.length; _87_29_++)
                {
                    lineMeta = list1[_87_29_]
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
        var file, fileLineMetas, line, lineMetas, meta, mfile, _106_45_

        var list = _k_.list(this.metasAtLineIndex(li))
        for (var _95_17_ = 0; _95_17_ < list.length; _95_17_++)
        {
            meta = list[_95_17_]
            if (meta[2].state === 'unsaved')
            {
                var _97_29_ = slash.splitFileLine(meta[2].href); file = _97_29_[0]; line = _97_29_[1]

                break
            }
        }
        if (file)
        {
            fileLineMetas = {}
            var list1 = _k_.list(this.metas)
            for (var _102_21_ = 0; _102_21_ < list1.length; _102_21_++)
            {
                meta = list1[_102_21_]
                if (meta[2].state === 'unsaved')
                {
                    var _104_34_ = slash.splitFileLine(meta[2].href); mfile = _104_34_[0]; line = _104_34_[1]

                    if (mfile === file)
                    {
                        fileLineMetas[mfile] = ((_106_45_=fileLineMetas[mfile]) != null ? _106_45_ : [])
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
        var file, fileLineMetas, line, lineMetas, meta, _118_36_

        fileLineMetas = {}
        var list = _k_.list(this.metas)
        for (var _115_17_ = 0; _115_17_ < list.length; _115_17_++)
        {
            meta = list[_115_17_]
            if (meta[2].state === 'unsaved')
            {
                var _117_29_ = slash.splitFileLine(meta[2].href); file = _117_29_[0]; line = _117_29_[1]

                fileLineMetas[file] = ((_118_36_=fileLineMetas[file]) != null ? _118_36_ : [])
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
        var meta, metas, num, _145_38_, _148_108_, _149_81_

        metas = this.metasAtLineIndex(e.lineIndex)
        var list = _k_.list(metas)
        for (var _138_17_ = 0; _138_17_ < list.length; _138_17_++)
        {
            meta = list[_138_17_]
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
        var size, tx, ty, _171_76_, _172_81_

        size = this.editor.size
        tx = size.charWidth * meta[1][0] + size.offsetX + (((_171_76_=meta[2].xOffset) != null ? _171_76_ : 0))
        ty = size.lineHeight * (meta[0] - this.editor.scroll.top) + (((_172_81_=meta[2].yOffset) != null ? _172_81_ : 0))
        return this.setMetaPos(meta,tx,ty)
    }

    addDiv (meta)
    {
        var div, k, lh, size, sw, v, _1_13_, _188_52_, _198_24_

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
        var _218_19_

        if (!((meta != null ? meta[2] : undefined) != null))
        {
            return kerror('no line meta?',meta)
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
        var result, _261_28_, _261_38_, _262_38_

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
        var _280_32_

        if (!((lineMeta != null ? lineMeta[2] : undefined) != null))
        {
            return kerror('invalid line meta?',lineMeta)
        }
        this.lineMetas[lineMeta[0]] = ((_280_32_=this.lineMetas[lineMeta[0]]) != null ? _280_32_ : [])
        this.lineMetas[lineMeta[0]].push(lineMeta)
        this.metas.push(lineMeta)
        return lineMeta
    }

    moveLineMeta (lineMeta, d)
    {
        var _292_32_

        if (!(lineMeta != null) || d === 0)
        {
            return kerror('invalid move?',lineMeta,d)
        }
        _.pull(this.lineMetas[lineMeta[0]],lineMeta)
        if (_k_.empty(this.lineMetas[lineMeta[0]]))
        {
            delete this.lineMetas[lineMeta[0]]
        }
        lineMeta[0] += d
        this.lineMetas[lineMeta[0]] = ((_292_32_=this.lineMetas[lineMeta[0]]) != null ? _292_32_ : [])
        this.lineMetas[lineMeta[0]].push(lineMeta)
        return this.updatePos(lineMeta)
    }

    onLineAppended (e)
    {
        var meta

        var list = _k_.list(this.metasAtLineIndex(e.lineIndex))
        for (var _298_17_ = 0; _298_17_ < list.length; _298_17_++)
        {
            meta = list[_298_17_]
            if (meta[1][1] === 0)
            {
                meta[1][1] = e.text.length
            }
        }
    }

    metasAtLineIndex (li)
    {
        var _301_45_

        return ((_301_45_=this.lineMetas[li]) != null ? _301_45_ : [])
    }

    hrefAtLineIndex (li)
    {
        var meta, _306_47_

        var list = _k_.list(this.metasAtLineIndex(li))
        for (var _305_17_ = 0; _305_17_ < list.length; _305_17_++)
        {
            meta = list[_305_17_]
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
        for (var _316_17_ = 0; _316_17_ < list.length; _316_17_++)
        {
            meta = list[_316_17_]
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
            for (var _330_21_ = 0; _330_21_ < list.length; _330_21_++)
            {
                meta = list[_330_21_]
                this.delDiv(meta)
            }
            var list1 = _k_.list(rangesFromTopToBotInRanges(bot - num + 1,bot,this.metas))
            for (var _333_21_ = 0; _333_21_ < list1.length; _333_21_++)
            {
                meta = list1[_333_21_]
                this.addDiv(meta)
            }
        }
        else
        {
            var list2 = _k_.list(rangesFromTopToBotInRanges(bot + 1,bot - num,this.metas))
            for (var _337_21_ = 0; _337_21_ < list2.length; _337_21_++)
            {
                meta = list2[_337_21_]
                this.delDiv(meta)
            }
            var list3 = _k_.list(rangesFromTopToBotInRanges(top,top - num - 1,this.metas))
            for (var _340_21_ = 0; _340_21_ < list3.length; _340_21_++)
            {
                meta = list3[_340_21_]
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
        for (var _348_17_ = 0; _348_17_ < list.length; _348_17_++)
        {
            meta = list[_348_17_]
            this.updatePos(meta)
        }
    }

    onLineInserted (li)
    {
        var meta

        var list = _k_.list(rangesFromTopToBotInRanges(li,this.editor.numLines(),this.metas))
        for (var _353_17_ = 0; _353_17_ < list.length; _353_17_++)
        {
            meta = list[_353_17_]
            this.moveLineMeta(meta,1)
        }
        return this.updatePositionsBelowLineIndex(li)
    }

    onLineDeleted (li)
    {
        var meta

        while (meta = _.last(this.metasAtLineIndex(li)))
        {
            this.delMeta(meta)
        }
        var list = _k_.list(rangesFromTopToBotInRanges(li,this.editor.numLines(),this.metas))
        for (var _369_17_ = 0; _369_17_ < list.length; _369_17_++)
        {
            meta = list[_369_17_]
            this.moveLineMeta(meta,-1)
        }
        return this.updatePositionsBelowLineIndex(li)
    }

    onClearLines ()
    {
        var meta

        var list = _k_.list(this.metas)
        for (var _382_17_ = 0; _382_17_ < list.length; _382_17_++)
        {
            meta = list[_382_17_]
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
            return kerror('del no meta?')
        }
        _.pull(this.lineMetas[meta[0]],meta)
        _.pull(this.metas,meta)
        return this.delDiv(meta)
    }

    delClass (clss)
    {
        var clsss, meta, _404_34_

        var list = _k_.list(_k_.clone(this.metas))
        for (var _403_17_ = 0; _403_17_ < list.length; _403_17_++)
        {
            meta = list[_403_17_]
            clsss = (meta != null ? meta[2] != null ? (_404_34_=meta[2].clss) != null ? _404_34_.split(' ') : undefined : undefined : undefined)
            if (!_k_.empty((clsss)) && _k_.in(clss,clsss))
            {
                this.delMeta(meta)
            }
        }
    }
}

export default Meta;