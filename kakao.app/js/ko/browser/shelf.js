var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, dbg: function (f,l,c,m,...a) { console.log(f + ':' + l + ':' + c + (m ? ' ' + m + '\n' : '\n') + a.map(function (a) { return _k_.noon(a) }).join(' '))}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.prototype.hasOwnProperty(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }}

var Shelf

import dom from "../../kxk/dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent

import util from "../../kxk/util.js"
let pullAllWith = util.pullAllWith

import ffs from "../../kxk/ffs.js"

import elem from "../../kxk/elem.js"

import post from "../../kxk/post.js"

import slash from "../../kxk/slash.js"

import keyinfo from "../../kxk/keyinfo.js"

import popup from "../../kxk/popup.js"

import File from "../tools/File.js"

import Column from "./Column.js"

import Row from "./Row.js"


Shelf = (function ()
{
    _k_.extend(Shelf, Column)
    function Shelf (browser)
    {
        this["onKeyUp"] = this["onKeyUp"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["showContextMenu"] = this["showContextMenu"].bind(this)
        this["removeObject"] = this["removeObject"].bind(this)
        this["onDblClick"] = this["onDblClick"].bind(this)
        this["onMouseOut"] = this["onMouseOut"].bind(this)
        this["onMouseOver"] = this["onMouseOver"].bind(this)
        this["onFocus"] = this["onFocus"].bind(this)
        this["onNavigateIndexChanged"] = this["onNavigateIndexChanged"].bind(this)
        this["onNavigateHistoryChanged"] = this["onNavigateHistoryChanged"].bind(this)
        this["clearHistory"] = this["clearHistory"].bind(this)
        this["toggleHistory"] = this["toggleHistory"].bind(this)
        this["loadGitStatus"] = this["loadGitStatus"].bind(this)
        this["onGitStatus"] = this["onGitStatus"].bind(this)
        this["onDrop"] = this["onDrop"].bind(this)
        this["onFile"] = this["onFile"].bind(this)
        this["makeRoot"] = this["makeRoot"].bind(this)
        Shelf.__super__.constructor.call(this,browser)
        this.items = []
        this.index = -1
        this.div.id = 'shelf'
        this.showHistory = window.stash.get('shelf|history',false)
        post.on('gitStatus',this.onGitStatus)
        post.on('addToShelf',this.addPath)
        post.on('navigateHistoryChanged',this.onNavigateHistoryChanged)
        post.on('navigateIndexChanged',this.onNavigateIndexChanged)
        post.on('file',this.onFile)
    }

    Shelf.prototype["makeRoot"] = function ()
    {
        return this.toggleHistory()
    }

    Shelf.prototype["activateRow"] = function (row)
    {
        var item, _51_19_

        ;($('.hover') != null ? $('.hover').classList.remove('hover') : undefined)
        item = row.item
        if (item.type === 'historySeparator')
        {
            row.setActive({emit:false})
            return
        }
        row.setActive({emit:true})
        if (item.type === 'file')
        {
            console.log('Shelf emit jumpToFile',item)
            return post.emit('jumpToFile',item)
        }
        else
        {
            return post.emit('filebrowser','loadItem',item)
        }
    }

    Shelf.prototype["onFile"] = function (file)
    {
        var index, item, matches

        if (_k_.empty(file))
        {
            return
        }
        if (this.navigatingRows)
        {
            delete this.navigatingRows
            return
        }
        for (var _80_22_ = index = 0, _80_26_ = this.items.length; (_80_22_ <= _80_26_ ? index < this.items.length : index > this.items.length); (_80_22_ <= _80_26_ ? ++index : --index))
        {
            if (this.items[index].path === file)
            {
                this.rows[index].setActive()
                return
            }
        }
        matches = []
        for (index in this.items)
        {
            item = this.items[index]
            if ((file != null ? file.startsWith(item.path) : undefined))
            {
                matches.push([index,item])
            }
        }
        if (!_k_.empty(matches))
        {
            matches.sort(function (a, b)
            {
                return b[1].path.length - a[1].path.length
            })
            var _92_26_ = _k_.first(matches); index = _92_26_[0]; item = _92_26_[1]

            return this.rows[index].setActive()
        }
    }

    Shelf.prototype["browserDidInitColumns"] = function ()
    {
        if (this.didInit)
        {
            return
        }
        this.didInit = true
        this.loadShelfItems()
        if (this.showHistory)
        {
            this.loadHistory()
        }
        return setTimeout(this.loadGitStatus,2000)
    }

    Shelf.prototype["loadShelfItems"] = function ()
    {
        var items

        items = window.stash.get("shelf|items")
        return this.setItems(items,{save:false})
    }

    Shelf.prototype["addPath"] = async function (path, opt)
    {
        if (await ffs.isDir(path))
        {
            return this.addDir(path,opt)
        }
        else
        {
            return this.addFile(path,opt)
        }
    }

    Shelf.prototype["itemPaths"] = function ()
    {
        return this.rows.map(function (r)
        {
            return r.path()
        })
    }

    Shelf.prototype["savePrefs"] = function ()
    {
        return prefs.set("shelf|items",this.items)
    }

    Shelf.prototype["setItems"] = function (items, opt)
    {
        var _139_15_

        this.items = items
    
        this.clear()
        this.items = ((_139_15_=this.items) != null ? _139_15_ : [])
        this.addItems(this.items)
        if ((opt != null ? opt.save : undefined) !== false)
        {
            this.savePrefs()
        }
        return this
    }

    Shelf.prototype["addItems"] = function (items, opt)
    {
        var item

        if (_k_.empty(items))
        {
            return
        }
        var list = _k_.list(items)
        for (var _150_17_ = 0; _150_17_ < list.length; _150_17_++)
        {
            item = list[_150_17_]
            this.rows.push(new Row(this,item))
        }
        this.scroll.update()
        return this
    }

    Shelf.prototype["addDir"] = function (dir, opt)
    {
        var item

        item = {name:slash.file(slash.tilde(dir)),type:'dir',file:slash.path(dir)}
        return this.addItem(item,opt)
    }

    Shelf.prototype["addFile"] = function (file, opt)
    {
        var item

        item = {name:slash.file(file),type:'file',file:slash.path(file)}
        if (File.isText(file))
        {
            item.textFile = true
        }
        return this.addItem(item,opt)
    }

    Shelf.prototype["addFiles"] = async function (files, opt)
    {
        var file

        _k_.dbg("kode/ko/browser/Shelf.kode", 176, 8, "files", files,opt)
        var list = _k_.list(files)
        for (var _178_17_ = 0; _178_17_ < list.length; _178_17_++)
        {
            file = list[_178_17_]
            if (await ffs.isDir(file))
            {
                this.addDir(file,opt)
            }
            else
            {
                this.addFile(file,opt)
            }
        }
    }

    Shelf.prototype["addItem"] = function (item, opt)
    {
        var index

        pullAllWith(this.items,[item])
        if ((opt != null ? opt.pos : undefined))
        {
            index = this.rowIndexAtPos(opt.pos)
            this.items.splice(Math.min(index,this.items.length),0,item)
        }
        else
        {
            this.items.push(item)
        }
        return this.setItems(this.items)
    }

    Shelf.prototype["onDrop"] = function (event)
    {
        var action, item, source

        action = event.getModifierState('Shift') && 'copy' || 'move'
        source = event.dataTransfer.getData('text/plain')
        item = this.browser.fileItem(source)
        return this.addItem(item,{pos:kpos(event)})
    }

    Shelf.prototype["isEmpty"] = function ()
    {
        return _k_.empty(this.rows)
    }

    Shelf.prototype["clear"] = function ()
    {
        this.clearSearch()
        this.div.scrollTop = 0
        this.table.innerHTML = ''
        this.rows = []
        return this.scroll.update()
    }

    Shelf.prototype["name"] = function ()
    {
        return 'shelf'
    }

    Shelf.prototype["onGitStatus"] = function (gitDir, status)
    {}

    Shelf.prototype["loadGitStatus"] = function ()
    {}

    Shelf.prototype["toggleHistory"] = function ()
    {
        this.showHistory = !this.showHistory
        if (this.showHistory)
        {
            this.loadHistory()
        }
        else
        {
            this.removeHistory()
        }
        return window.stash.set('shelf|history',this.showHistory)
    }

    Shelf.prototype["clearHistory"] = function ()
    {
        window.navigate.clear()
        if (this.showHistory)
        {
            return this.setHistoryItems([{file:window.editor.currentFile,pos:window.editor.mainCursor(),text:slash.file(window.editor.currentFile)}])
        }
    }

    Shelf.prototype["historySeparatorIndex"] = function ()
    {
        var i

        for (var _279_18_ = i = 0, _279_22_ = this.numRows(); (_279_18_ <= _279_22_ ? i < this.numRows() : i > this.numRows()); (_279_18_ <= _279_22_ ? ++i : --i))
        {
            if (this.row(i).item.type === 'historySeparator')
            {
                return i
            }
        }
        return this.numRows()
    }

    Shelf.prototype["removeHistory"] = function ()
    {
        var separatorIndex

        separatorIndex = this.historySeparatorIndex()
        while (this.numRows() && this.numRows() > separatorIndex)
        {
            this.removeRow(this.row(this.numRows() - 1))
        }
    }

    Shelf.prototype["onNavigateHistoryChanged"] = function (filePositions, currentIndex)
    {
        if (this.showHistory)
        {
            return this.setHistoryItems(filePositions)
        }
    }

    Shelf.prototype["onNavigateIndexChanged"] = function (currentIndex, currentItem)
    {
        var reverseIndex, _301_30_

        if (this.showHistory)
        {
            console.log('onNavigateIndexChanged',currentIndex,currentItem)
            reverseIndex = this.numRows() - currentIndex - 1
            return (this.row(reverseIndex) != null ? this.row(reverseIndex).setActive() : undefined)
        }
    }

    Shelf.prototype["loadHistory"] = function ()
    {}

    Shelf.prototype["setHistoryItems"] = function (items)
    {
        this.removeHistory()
        items.map(function (h)
        {
            h.type = 'file'
            return h.text = slash.removeColumn(h.text)
        })
        items.reverse()
        items.unshift({type:'historySeparator',icon:'history-icon'})
        return this.addItems(items)
    }

    Shelf.prototype["onFocus"] = function ()
    {
        this.div.classList.add('focus')
        if (this.browser.shelfSize < 200)
        {
            return this.browser.setShelfSize(200)
        }
    }

    Shelf.prototype["onMouseOver"] = function (event)
    {
        var _340_46_, _340_59_

        return ((_340_46_=this.row(event.target)) != null ? typeof (_340_59_=_340_46_.onMouseOver) === "function" ? _340_59_() : undefined : undefined)
    }

    Shelf.prototype["onMouseOut"] = function (event)
    {
        var _341_46_, _341_58_

        return ((_341_46_=this.row(event.target)) != null ? typeof (_341_58_=_341_46_.onMouseOut) === "function" ? _341_58_() : undefined : undefined)
    }

    Shelf.prototype["onDblClick"] = function (event)
    {
        return this.navigateCols('enter')
    }

    Shelf.prototype["navigateRows"] = function (key)
    {
        var index, navigate, row, _353_28_, _353_38_, _368_99_

        if (!this.numRows())
        {
            return console.error(`no rows in column ${this.index}?`)
        }
        index = ((_353_38_=(this.activeRow() != null ? this.activeRow().index() : undefined)) != null ? _353_38_ : -1)
        if (!(index != null) || Number.isNaN(index))
        {
            console.error(`no index from activeRow? ${index}?`,this.activeRow())
        }
        index = ((function ()
        {
            switch (key)
            {
                case 'up':
                    return index - 1

                case 'down':
                    return index + 1

                case 'home':
                    return 0

                case 'end':
                    return this.items.length

                case 'page up':
                    return index - this.numVisible()

                case 'page down':
                    return _k_.clamp(0,this.items.length,index + this.numVisible())

                default:
                    return index
            }

        }).bind(this))()
        if (!(index != null) || Number.isNaN(index))
        {
            console.error(`no index ${index}? ${this.numVisible()}`)
        }
        index = _k_.clamp(0,this.numRows() - 1,index)
        if (!((this.rows[index] != null ? this.rows[index].activate : undefined) != null))
        {
            console.error(`no row at index ${index}/${this.numRows() - 1}?`,this.numRows())
        }
        navigate = (function (action)
        {
            this.navigatingRows = true
            return post.emit('menuAction',action)
        }).bind(this)
        if (key === 'up' && index > this.items.length)
        {
            return navigate('Navigate Forward')
        }
        else if (key === 'down' && index > this.items.length + 1)
        {
            return navigate('Navigate Backward')
        }
        else
        {
            row = this.rows[index]
            row.setActive({emit:false})
            if (row.item.type === 'file')
            {
                return post.emit('jumpToFile',row.path)
            }
            else
            {
                return post.emit('filebrowser','loadItem',row.path,{focus:false})
            }
        }
    }

    Shelf.prototype["openFileInNewWindow"] = function ()
    {
        var item, _386_30_

        if (item = (this.activeRow() != null ? this.activeRow().item : undefined))
        {
            if (item.type === 'file' && item.textFile)
            {
                window.openFiles([item.path],{newWindow:true})
            }
        }
        return this
    }

    Shelf.prototype["removeObject"] = function ()
    {
        var nextOrPrev, row, _393_27_, _403_36_

        row = ((_393_27_=this.activeRow()) != null ? _393_27_ : this.selectedRow())
        if (row)
        {
            if (this.showHistory)
            {
                if (row.item.type === 'historySeparator')
                {
                    this.toggleHistory()
                    return
                }
                if (row.index() > this.historySeparatorIndex())
                {
                    window.navigate.delFilePos(row.item)
                }
            }
            nextOrPrev = ((_403_36_=row.next()) != null ? _403_36_ : row.prev())
            row.div.remove()
            this.items.splice(row.index(),1)
            this.rows.splice(row.index(),1)
            ;(nextOrPrev != null ? nextOrPrev.activate() : undefined)
            this.savePrefs()
        }
        return this
    }

    Shelf.prototype["showContextMenu"] = function (absPos)
    {
        var opt

        if (!(absPos != null))
        {
            absPos = pos(this.view.getBoundingClientRect().left,this.view.getBoundingClientRect().top)
        }
        opt = {items:[{text:'Toggle History',combo:'alt+h',cb:this.toggleHistory},{text:'Toggle Extensions',combo:'ctrl+e',cb:this.toggleExtensions},{text:'Remove',combo:'backspace',cb:this.removeObject},{text:'Clear History',cb:this.clearHistory}]}
        opt.x = absPos.x
        opt.y = absPos.y
        return popup.menu(opt)
    }

    Shelf.prototype["onKey"] = function (event)
    {
        var char, combo, key, mod

        mod = keyinfo.forEvent(event).mod
        key = keyinfo.forEvent(event).key
        combo = keyinfo.forEvent(event).combo
        char = keyinfo.forEvent(event).char

        switch (combo)
        {
            case 'command+enter':
            case 'ctrl+enter':
                return this.openFileInNewWindow()

            case 'backspace':
            case 'delete':
                return stopEvent(event,this.clearSearch().removeObject())

            case 'command+k':
            case 'ctrl+k':
                if (this.browser.cleanUp())
                {
                    return stopEvent(event)
                }
                break
            case 'ctrl+e':
                this.toggleExtensions()
                break
            case 'tab':
                if (this.search.length)
                {
                    this.doSearch('')
                }
                return stopEvent(event)

            case 'esc':
                if (this.dragDiv)
                {
                    this.dragDiv.drag.dragStop()
                    this.dragDiv.remove()
                    delete this.dragDiv
                }
                if (this.search.length)
                {
                    this.clearSearch()
                }
                return stopEvent(event)

            case 'up':
            case 'down':
            case 'page up':
            case 'page down':
            case 'home':
            case 'end':
                return stopEvent(event,this.navigateRows(key))

            case 'right':
            case 'alt+right':
            case 'enter':
                return stopEvent(event,this.focusBrowser())

        }

        if (_k_.in(mod,['shift','']) && char)
        {
            this.doSearch(char)
        }
        if (this.dragDiv)
        {
            return this.updateDragIndicator(event)
        }
    }

    Shelf.prototype["onKeyUp"] = function (event)
    {
        if (this.dragDiv)
        {
            return this.updateDragIndicator(event)
        }
    }

    return Shelf
})()

export default Shelf;