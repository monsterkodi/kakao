var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Shelf

import kxk from "../../kxk.js"
let pullAllWith = kxk.pullAllWith
let ffs = kxk.ffs
let elem = kxk.elem
let post = kxk.post
let slash = kxk.slash
let keyinfo = kxk.keyinfo
let popup = kxk.popup
let stopEvent = kxk.stopEvent
let $ = kxk.$

import File from "../tools/File.js"
import Git from "../tools/Git.js"

import Row from "./Row.js"
import Column from "./Column.js"


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
        this["addPath"] = this["addPath"].bind(this)
        this["onStashLoaded"] = this["onStashLoaded"].bind(this)
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
        post.on('stashLoaded',this.onStashLoaded)
        post.on('file',this.onFile)
    }

    Shelf.prototype["makeRoot"] = function ()
    {
        return this.toggleHistory()
    }

    Shelf.prototype["activateRow"] = function (row)
    {
        var item, _43_19_

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
        for (var _75_22_ = index = 0, _75_26_ = this.items.length; (_75_22_ <= _75_26_ ? index < this.items.length : index > this.items.length); (_75_22_ <= _75_26_ ? ++index : --index))
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
            var _87_26_ = _k_.first(matches); index = _87_26_[0]; item = _87_26_[1]

            return this.rows[index].setActive()
        }
    }

    Shelf.prototype["onStashLoaded"] = function ()
    {
        this.loadShelfItems()
        if (this.showHistory)
        {
            this.loadHistory()
        }
        return setTimeout(this.loadGitStatus,100)
    }

    Shelf.prototype["loadShelfItems"] = function ()
    {
        var items

        items = window.prefs.get("shelf|items")
        return this.setItems(items,{save:false})
    }

    Shelf.prototype["addPath"] = function (path, opt)
    {
        if (ffs.isDir(path).then((function (isDir)
            {
                if (isDir)
                {
                    return this.addDir(path,opt)
                }
                else
                {
                    return this.addFile(path,opt)
                }
            }).bind(this)))
        {
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
        var _132_15_

        this.items = items
    
        this.clear()
        this.items = ((_132_15_=this.items) != null ? _132_15_ : [])
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
        for (var _143_17_ = 0; _143_17_ < list.length; _143_17_++)
        {
            item = list[_143_17_]
            this.rows.push(new Row(this,item))
        }
        this.scroll.update()
        return this
    }

    Shelf.prototype["addDir"] = function (dir, opt)
    {
        var item

        item = {name:slash.file(slash.tilde(dir)),type:'dir',path:slash.path(dir)}
        return this.addItem(item,opt)
    }

    Shelf.prototype["addFile"] = function (file, opt)
    {
        var item

        item = {name:slash.file(file),path:slash.path(file),type:'file'}
        if (File.isText(file))
        {
            item.textFile = true
        }
        return this.addItem(item,opt)
    }

    Shelf.prototype["addFiles"] = async function (files, opt)
    {
        var file

        var list = _k_.list(files)
        for (var _169_17_ = 0; _169_17_ < list.length; _169_17_++)
        {
            file = list[_169_17_]
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
        item = this.browser.pathItem(source)
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

    Shelf.prototype["onGitStatus"] = function (status)
    {
        var row, _219_48_

        var list = _k_.list(this.rows)
        for (var _217_16_ = 0; _217_16_ < list.length; _217_16_++)
        {
            row = list[_217_16_]
            if (row.path().startsWith(status.gitDir))
            {
                ;($('.browserStatusIcon',row.div) != null ? $('.browserStatusIcon',row.div).remove() : undefined)
                if (_k_.in(row.path(),status.dirs))
                {
                    row.div.appendChild(elem('span',{class:"git-dirs-icon browserStatusIcon"}))
                }
                else if (status.files[row.path()])
                {
                    row.div.appendChild(elem('span',{class:`git-${status.files[row.path()]}-icon browserStatusIcon`}))
                }
            }
        }
        return this
    }

    Shelf.prototype["loadGitStatus"] = function ()
    {
        var row

        var list = _k_.list(this.rows)
        for (var _228_16_ = 0; _228_16_ < list.length; _228_16_++)
        {
            row = list[_228_16_]
            Git.status(row.path()).then((function (row)
            {
                return function (status)
                {
                    var _230_48_

                    ;($('.browserStatusIcon',row.div) != null ? $('.browserStatusIcon',row.div).remove() : undefined)
                    if (_k_.in(row.path(),status.dirs))
                    {
                        return row.div.appendChild(elem('span',{class:"git-dirs-icon browserStatusIcon"}))
                    }
                    else if (status.files[row.path()])
                    {
                        return row.div.appendChild(elem('span',{class:`git-${status.files[row.path()]}-icon browserStatusIcon`}))
                    }
                }
            })(row))
        }
        return this
    }

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

        for (var _264_18_ = i = 0, _264_22_ = this.numRows(); (_264_18_ <= _264_22_ ? i < this.numRows() : i > this.numRows()); (_264_18_ <= _264_22_ ? ++i : --i))
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
        var reverseIndex, _286_30_

        if (this.showHistory)
        {
            console.log('onNavigateIndexChanged',currentIndex,currentItem)
            reverseIndex = this.numRows() - currentIndex - 1
            return (this.row(reverseIndex) != null ? this.row(reverseIndex).setActive() : undefined)
        }
    }

    Shelf.prototype["loadHistory"] = function ()
    {
        return this.setHistoryItems(window.navigate.filePositions)
    }

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
        var _325_46_, _325_59_

        return ((_325_46_=this.row(event.target)) != null ? typeof (_325_59_=_325_46_.onMouseOver) === "function" ? _325_59_() : undefined : undefined)
    }

    Shelf.prototype["onMouseOut"] = function (event)
    {
        var _326_46_, _326_58_

        return ((_326_46_=this.row(event.target)) != null ? typeof (_326_58_=_326_46_.onMouseOut) === "function" ? _326_58_() : undefined : undefined)
    }

    Shelf.prototype["onDblClick"] = function (event)
    {
        return this.navigateCols('enter')
    }

    Shelf.prototype["navigateRows"] = function (key)
    {
        var index, navigate, row, _338_28_, _338_38_, _353_99_

        if (!this.numRows())
        {
            return console.error(`no rows in column ${this.index}?`)
        }
        index = ((_338_38_=(this.activeRow() != null ? this.activeRow().index() : undefined)) != null ? _338_38_ : -1)
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
        var item, _371_30_

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
        var nextOrPrev, row, _378_27_, _388_36_

        row = ((_378_27_=this.activeRow()) != null ? _378_27_ : this.selectedRow())
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
            nextOrPrev = ((_388_36_=row.next()) != null ? _388_36_ : row.prev())
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

            case 'enter':
                return stopEvent(event,this.navigateCols(key))

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

            case 'tab':
                if (this.search.length)
                {
                    this.doSearch('')
                    return stopEvent(event)
                }
                break
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