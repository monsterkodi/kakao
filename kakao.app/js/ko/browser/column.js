var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Column

import lib_ko from "../../../lib/lib_ko.js"
let fuzzy = lib_ko.fuzzy

import dom from "../../kxk/dom.js"
let $ = dom.$
let setStyle = dom.setStyle
let stopEvent = dom.stopEvent

import ffs from "../../kxk/ffs.js"

import kpos from "../../kxk/kpos.js"

import elem from "../../kxk/elem.js"

import drag from "../../kxk/drag.js"

import post from "../../kxk/post.js"

import prefs from "../../kxk/prefs.js"

import slash from "../../kxk/slash.js"

import popup from "../../kxk/popup.js"

import keyinfo from "../../kxk/keyinfo.js"

import DirWatch from "../tools/DirWatch.js"

import File from "../tools/File.js"

import Crumb from "./Crumb.js"

import Scroller from "./Scroller.js"

import Row from "./Row.js"


Column = (function ()
{
    function Column (browser)
    {
        var _42_21_, _65_34_

        this.browser = browser
    
        this["onKeyUp"] = this["onKeyUp"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["showContextMenu"] = this["showContextMenu"].bind(this)
        this["onContextMenu"] = this["onContextMenu"].bind(this)
        this["makeRoot"] = this["makeRoot"].bind(this)
        this["open"] = this["open"].bind(this)
        this["explorer"] = this["explorer"].bind(this)
        this["duplicateFile"] = this["duplicateFile"].bind(this)
        this["newFolder"] = this["newFolder"].bind(this)
        this["addToShelf"] = this["addToShelf"].bind(this)
        this["moveToTrash"] = this["moveToTrash"].bind(this)
        this["toggleExtensions"] = this["toggleExtensions"].bind(this)
        this["toggleDotFiles"] = this["toggleDotFiles"].bind(this)
        this["sortByDateAdded"] = this["sortByDateAdded"].bind(this)
        this["sortByType"] = this["sortByType"].bind(this)
        this["sortByName"] = this["sortByName"].bind(this)
        this["removeObject"] = this["removeObject"].bind(this)
        this["clearSearch"] = this["clearSearch"].bind(this)
        this["onDblClick"] = this["onDblClick"].bind(this)
        this["onMouseOut"] = this["onMouseOut"].bind(this)
        this["onMouseOver"] = this["onMouseOver"].bind(this)
        this["onBlur"] = this["onBlur"].bind(this)
        this["onFocus"] = this["onFocus"].bind(this)
        this["insertDir"] = this["insertDir"].bind(this)
        this["insertFile"] = this["insertFile"].bind(this)
        this["removeFile"] = this["removeFile"].bind(this)
        this["onDragStop"] = this["onDragStop"].bind(this)
        this["onDragMove"] = this["onDragMove"].bind(this)
        this["onDragStart"] = this["onDragStart"].bind(this)
        this.searchTimer = null
        this.search = ''
        this.items = []
        this.rows = []
        this.div = elem({class:'browserColumn',tabIndex:6,id:this.name()})
        this.content = elem({class:'browserColumnContent',parent:this.div})
        this.table = elem({class:'browserColumnTable',parent:this.content})
        ;(this.browser.cols != null ? this.browser.cols.appendChild(this.div) : undefined)
        this.div.addEventListener('focus',this.onFocus)
        this.div.addEventListener('blur',this.onBlur)
        this.div.addEventListener('keydown',this.onKey)
        this.div.addEventListener('keyup',this.onKeyUp)
        this.div.addEventListener('mouseover',this.onMouseOver)
        this.div.addEventListener('mouseout',this.onMouseOut)
        this.div.addEventListener('dblclick',this.onDblClick)
        this.div.addEventListener('contextmenu',this.onContextMenu)
        this.drag = new drag({target:this.div,onStart:this.onDragStart,onMove:this.onDragMove,onStop:this.onDragStop})
        this.crumb = new Crumb(this)
        this.scroll = new Scroller(this,this.content)
        this.setIndex((this.browser.columns != null ? this.browser.columns.length : undefined))
    }

    Column.prototype["loadItems"] = async function (items, parent)
    {
        var dir, item, updir, _105_46_, _106_73_, _81_98_

        console.log('loadItems',items)
        this.clear()
        this.parent = parent
        if (this.index === 0 || this.index - 1 < this.browser.numCols() && (this.browser.columns[this.index - 1].activeRow() != null ? this.browser.columns[this.index - 1].activeRow().item.file : undefined) === '..' && !slash.isRoot(this.parent.path))
        {
            if (!(_k_.in((items[0] != null ? items[0].file : undefined),['..','/'])))
            {
                dir = this.parent.path
                updir = slash.dir(dir)
                if (updir !== dir)
                {
                    items.unshift({file:'..',type:'dir',file:updir})
                }
            }
        }
        this.items = items
        this.div.classList.remove('browserColumnCode')
        this.crumb.show()
        if (this.parent.type === 'dir')
        {
            DirWatch.watch(this.parent.path)
            this.crumb.setFile(this.parent.path)
        }
        else
        {
            if (File.isCode(this.parent.path))
            {
                this.crumb.setFile(this.parent.path)
                this.div.classList.add('browserColumnCode')
            }
        }
        if (!(this.parent != null))
        {
            console.error("no parent item?")
        }
        if (!(this.parent.type != null))
        {
            console.error("loadItems -- no parent type?",this.parent)
        }
        if (!_k_.empty(this.items))
        {
            var list = _k_.list(this.items)
            for (var _109_21_ = 0; _109_21_ < list.length; _109_21_++)
            {
                item = list[_109_21_]
                this.rows.push(new Row(this,item))
            }
            this.scroll.update()
        }
        if (this.parent.type === 'dir' && slash.samePath('~/Downloads',this.parent.path))
        {
            this.sortByDateAdded()
        }
        return this
    }

    Column.prototype["updateDragIndicator"] = function (event)
    {
        var _126_16_, _127_16_

        ;(this.dragInd != null ? this.dragInd.classList.toggle('copy',event.shiftKey) : undefined)
        return (this.dragInd != null ? this.dragInd.classList.toggle('move',event.ctrlKey || event.metaKey || event.altKey) : undefined)
    }

    Column.prototype["onDragStart"] = function (d, e)
    {
        var _148_32_

        this.dragStartRow = this.row(e.target)
        delete this.toggle
        if (this.dragStartRow)
        {
            if (e.shiftKey)
            {
                return this.browser.select.to(this.dragStartRow)
            }
            else if (e.metaKey || e.altKey || e.ctrlKey)
            {
                if (!this.dragStartRow.isSelected())
                {
                    return this.browser.select.toggle(this.dragStartRow)
                }
                else
                {
                    return this.toggle = true
                }
            }
            else
            {
                if (this.dragStartRow.isSelected())
                {
                    return this.deselect = true
                }
                else
                {
                    ;(this.activeRow() != null ? this.activeRow().clearActive() : undefined)
                    return this.browser.select.row(this.dragStartRow,false)
                }
            }
        }
        else
        {
            if (this.hasFocus() && this.activeRow())
            {
                return this.browser.select.row(this.activeRow())
            }
        }
    }

    Column.prototype["onDragMove"] = function (d, e)
    {
        var onSpringLoadTimeout, pos, row, rowClone, _206_27_

        if (this.dragStartRow && !this.dragDiv && !_k_.empty(this.browser.select.files()))
        {
            if (Math.abs(d.deltaSum.x) < 20 && Math.abs(d.deltaSum.y) < 10)
            {
                return
            }
            delete this.toggle
            delete this.deselect
            this.dragDiv = elem('div')
            this.dragDiv.drag = d
            this.dragDiv.files = this.browser.select.files()
            pos = kpos(e.pageX,e.pageY)
            row = this.browser.select.rows[0]
            this.dragDiv.style.position = 'absolute'
            this.dragDiv.style.opacity = "0.7"
            this.dragDiv.style.top = `${pos.y - d.deltaSum.y}px`
            this.dragDiv.style.left = `${pos.x - d.deltaSum.x}px`
            this.dragDiv.style.width = `${this.width() - 12}px`
            this.dragDiv.style.pointerEvents = 'none'
            this.dragInd = elem({class:'dragIndicator'})
            this.dragDiv.appendChild(this.dragInd)
            var list = _k_.list(this.browser.select.rows)
            for (var _185_20_ = 0; _185_20_ < list.length; _185_20_++)
            {
                row = list[_185_20_]
                rowClone = row.div.cloneNode(true)
                rowClone.style.flex = 'unset'
                rowClone.style.pointerEvents = 'none'
                rowClone.style.border = 'none'
                rowClone.style.marginBottom = '-1px'
                this.dragDiv.appendChild(rowClone)
            }
            document.body.appendChild(this.dragDiv)
            this.focus({activate:false})
        }
        if (this.dragDiv)
        {
            onSpringLoadTimeout = (function ()
            {
                var column

                if (column = this.browser.columnForFile(this.browser.springLoadTarget))
                {
                    if (row = column.row(this.browser.springLoadTarget))
                    {
                        return row.activate()
                    }
                }
            }).bind(this)
            clearTimeout(this.browser.springLoadTimer)
            delete this.browser.springLoadTarget
            if (row = this.browser.rowAtPos(d.pos))
            {
                if ((row.item != null ? row.item.type : undefined) === 'dir')
                {
                    this.browser.springLoadTimer = setTimeout(onSpringLoadTimeout,1000)
                    this.browser.springLoadTarget = row.item.path
                }
            }
            this.updateDragIndicator(e)
            return this.dragDiv.style.transform = `translateX(${d.deltaSum.x}px) translateY(${d.deltaSum.y}px)`
        }
    }

    Column.prototype["onDragStop"] = function (d, e)
    {
        var action, column, files, row, target, _224_19_, _233_33_, _235_38_, _269_28_

        clearTimeout(this.browser.springLoadTimer)
        delete this.browser.springLoadTarget
        if ((this.dragDiv != null))
        {
            this.dragDiv.remove()
            files = this.dragDiv.files
            delete this.dragDiv
            delete this.dragStartRow
            if (row = this.browser.rowAtPos(d.pos))
            {
                column = row.column
                target = (row.item != null ? row.item.path : undefined)
            }
            else if (column = this.browser.columnAtPos(d.pos))
            {
                target = (column.parent != null ? column.parent.path : undefined)
            }
            else
            {
                console.log('no drop target')
                return
            }
            action = e.shiftKey && 'copy' || 'move'
            if (column === this.browser.shelf)
            {
                if (target && (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey))
                {
                    console.log('drop into shelf item')
                    return this.browser.dropAction(action,files,target)
                }
                else
                {
                    console.log('add to shelf')
                    return this.browser.shelf.addFiles(files,{pos:d.pos})
                }
            }
            else
            {
                console.log('drop into folder column',target)
                return this.browser.dropAction(action,files,target)
            }
        }
        else
        {
            if (e.button === 0)
            {
                this.focus({activate:false,force:true})
            }
            if (row = this.row(e.target))
            {
                if (row.isSelected())
                {
                    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
                    {
                        if (this.toggle)
                        {
                            delete this.toggle
                            return this.browser.select.toggle(row)
                        }
                    }
                    else
                    {
                        if (this.deselect)
                        {
                            delete this.deselect
                            return this.browser.select.row(row)
                        }
                        else
                        {
                            return row.activate()
                        }
                    }
                }
            }
            else
            {
                return (this.activeRow() != null ? this.activeRow().clearActive() : undefined)
            }
        }
    }

    Column.prototype["removeFile"] = function (file)
    {
        var row

        if (row = this.row(slash.file(file)))
        {
            this.removeRow(row)
            return this.scroll.update()
        }
    }

    Column.prototype["insertFile"] = function (file)
    {
        var item, row

        item = this.browser.fileItem(file)
        row = new Row(this,item)
        this.rows.push(row)
        return row
    }

    Column.prototype["insertDir"] = function (dir)
    {
        var item, row

        item = this.browser.dirItem(dir)
        row = new Row(this,item)
        this.rows.push(row)
        return row
    }

    Column.prototype["unshiftItem"] = function (item)
    {
        this.items.unshift(item)
        this.rows.unshift(new Row(this,item))
        this.table.insertBefore(this.table.lastChild,this.table.firstChild)
        this.scroll.update()
        return this.rows[0]
    }

    Column.prototype["pushItem"] = function (item)
    {
        this.items.push(item)
        this.rows.push(new Row(this,item))
        this.scroll.update()
        return this.rows.slice(-1)[0]
    }

    Column.prototype["addItem"] = function (item)
    {
        var row

        row = this.pushItem(item)
        this.sortByName()
        return row
    }

    Column.prototype["setItems"] = function (items, opt)
    {
        var item, _336_46_, _337_72_

        this.items = items
    
        this.browser.clearColumn(this.index)
        this.parent = opt.parent
        if (!(this.parent != null))
        {
            console.error("no parent item?")
        }
        if (!(this.parent.type != null))
        {
            console.error("setItems -- no parent type?",this.parent)
        }
        var list = _k_.list(this.items)
        for (var _339_17_ = 0; _339_17_ < list.length; _339_17_++)
        {
            item = list[_339_17_]
            this.rows.push(new Row(this,item))
        }
        this.scroll.update()
        return this
    }

    Column.prototype["isDir"] = function ()
    {
        var _351_22_

        return (this.parent != null ? this.parent.type : undefined) === 'dir'
    }

    Column.prototype["isFile"] = function ()
    {
        var _352_22_

        return (this.parent != null ? this.parent.type : undefined) === 'file'
    }

    Column.prototype["isSrc"] = function ()
    {
        var _354_18_

        if ((this.parent != null ? this.parent.type : undefined) === 'file')
        {
            if (_k_.in((this.items[0] != null ? this.items[0].type : undefined),['class','func']))
            {
                return true
            }
        }
        return false
    }

    Column.prototype["isEmpty"] = function ()
    {
        return _k_.empty(this.parent)
    }

    Column.prototype["clear"] = function ()
    {
        var _361_18_, _361_36_

        if ((this.parent != null ? this.parent.path : undefined) && (this.parent != null ? this.parent.type : undefined) === 'dir')
        {
            DirWatch.unwatch(this.parent.path)
        }
        delete this.parent
        this.clearSearch()
        this.div.scrollTop = 0
        this.table.innerHTML = ''
        this.crumb.clear()
        this.rows = []
        return this.scroll.update()
    }

    Column.prototype["setIndex"] = function (index)
    {
        var _373_17_

        this.index = index
    
        if ((this.crumb != null))
        {
            return this.crumb.elem.columnIndex = this.index
        }
    }

    Column.prototype["width"] = function ()
    {
        return this.div.getBoundingClientRect().width
    }

    Column.prototype["activateRow"] = function (row)
    {
        var _383_35_

        return (this.row(row) != null ? this.row(row).activate() : undefined)
    }

    Column.prototype["activeRow"] = function ()
    {
        return this.rows.find(function (r)
        {
            return r.isActive()
        })
    }

    Column.prototype["activePath"] = function ()
    {
        var _386_31_, _386_40_

        return ((_386_40_=(this.activeRow() != null ? this.activeRow().path() : undefined)) != null ? _386_40_ : this.parent.path)
    }

    Column.prototype["selectedRow"] = function ()
    {
        return this.rows.find(function (r)
        {
            return r.isSelected()
        })
    }

    Column.prototype["row"] = function (row)
    {
        if (Number.isInteger(row))
        {
            return (0 <= row && row < this.numRows()) && this.rows[row] || null
        }
        else if (typeof(row) === 'string')
        {
            return this.rows.find(function (r)
            {
                return r.item.file === row || r.item.path === row
            })
        }
        else if (row instanceof HTMLElement)
        {
            return this.rows.find(function (r)
            {
                return r.div.contains(row)
            })
        }
        else
        {
            return row
        }
    }

    Column.prototype["nextColumn"] = function ()
    {
        return this.browser.column(this.index + 1)
    }

    Column.prototype["prevColumn"] = function ()
    {
        return this.browser.column(this.index - 1)
    }

    Column.prototype["name"] = function ()
    {
        return `${this.browser.name}:${this.index}`
    }

    Column.prototype["path"] = function ()
    {
        var _399_20_, _399_27_

        return ((_399_27_=(this.parent != null ? this.parent.path : undefined)) != null ? _399_27_ : '')
    }

    Column.prototype["numRows"] = function ()
    {
        var _401_32_

        return ((_401_32_=this.rows.length) != null ? _401_32_ : 0)
    }

    Column.prototype["rowHeight"] = function ()
    {
        var _402_46_

        return ((_402_46_=(this.rows[0] != null ? this.rows[0].div.clientHeight : undefined)) != null ? _402_46_ : 0)
    }

    Column.prototype["numVisible"] = function ()
    {
        return this.rowHeight() && parseInt(this.browser.height() / this.rowHeight()) || 0
    }

    Column.prototype["rowAtPos"] = function (pos)
    {
        return this.row(this.rowIndexAtPos(pos))
    }

    Column.prototype["rowIndexAtPos"] = function (pos)
    {
        var dy, rh

        dy = pos.y - this.content.getBoundingClientRect().top
        rh = this.rowHeight()
        if (dy >= 0 && rh > 0)
        {
            return Math.floor(dy / rh)
        }
        else
        {
            return -1
        }
    }

    Column.prototype["hasFocus"] = function ()
    {
        return this.div.classList.contains('focus')
    }

    Column.prototype["focus"] = function (opt)
    {
        opt = (opt != null ? opt : {})
        if (!opt.force && !window.lastFocus.startsWith(this.browser.name))
        {
            return this
        }
        if (!this.activeRow() && this.numRows() && opt.activate !== false)
        {
            this.rows[0].setActive()
        }
        this.div.focus()
        this.div.classList.add('focus')
        window.setLastFocus(this.name())
        return this
    }

    Column.prototype["onFocus"] = function ()
    {
        return this.div.classList.add('focus')
    }

    Column.prototype["onBlur"] = function ()
    {
        return this.div.classList.remove('focus')
    }

    Column.prototype["focusBrowser"] = function ()
    {
        console.log('focusBrowser')
        return this.browser.focus({force:true})
    }

    Column.prototype["onMouseOver"] = function (event)
    {
        var _451_46_, _451_59_

        return ((_451_46_=this.row(event.target)) != null ? typeof (_451_59_=_451_46_.onMouseOver) === "function" ? _451_59_() : undefined : undefined)
    }

    Column.prototype["onMouseOut"] = function (event)
    {
        var _452_46_, _452_58_

        return ((_452_46_=this.row(event.target)) != null ? typeof (_452_58_=_452_46_.onMouseOut) === "function" ? _452_58_() : undefined : undefined)
    }

    Column.prototype["onDblClick"] = function (event)
    {
        var item, _457_27_

        this.browser.skipOnDblClick = true
        item = (this.activeRow() != null ? this.activeRow().item : undefined)
        if (item.type === 'dir')
        {
            this.browser.clearColumnsFrom(1,{pop:true})
            return this.browser.loadDirItem(item,0,{activate:false})
        }
        else
        {
            return editor.focus()
        }
    }

    Column.prototype["extendSelection"] = function (key)
    {
        var index, toIndex, _467_28_, _467_38_

        if (!this.numRows())
        {
            return console.error(`no rows in column ${this.index}?`)
        }
        index = ((_467_38_=(this.activeRow() != null ? this.activeRow().index() : undefined)) != null ? _467_38_ : -1)
        if (!(index != null) || Number.isNaN(index))
        {
            console.error(`no index from activeRow? ${index}?`,this.activeRow())
        }
        toIndex = ((function ()
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
                    return this.numRows() - 1

                case 'page up':
                    return Math.max(0,index - this.numVisible())

                case 'page down':
                    return Math.min(this.numRows() - 1,index + this.numVisible())

                default:
                    return index
            }

        }).bind(this))()
        return this.browser.select.to(this.row(toIndex),true)
    }

    Column.prototype["navigateRows"] = function (key)
    {
        var index, newIndex, _490_28_, _490_38_

        if (!this.numRows())
        {
            return console.error(`no rows in column ${this.index}?`)
        }
        index = ((_490_38_=(this.activeRow() != null ? this.activeRow().index() : undefined)) != null ? _490_38_ : -1)
        if (!(index != null) || Number.isNaN(index))
        {
            console.error(`no index from activeRow? ${index}?`,this.activeRow())
        }
        newIndex = ((function ()
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
                    return this.numRows() - 1

                case 'page up':
                    return index - this.numVisible()

                case 'page down':
                    return index + this.numVisible()

                default:
                    return index
            }

        }).bind(this))()
        if (!(newIndex != null) || Number.isNaN(newIndex))
        {
            console.error(`no index ${newIndex}? ${this.numVisible()}`)
        }
        newIndex = _k_.clamp(0,this.numRows() - 1,newIndex)
        if (newIndex !== index)
        {
            return this.rows[newIndex].activate(null,this.parent.type === 'file')
        }
    }

    Column.prototype["navigateCols"] = function (key)
    {
        var item, type, _517_38_

        switch (key)
        {
            case 'up':
                this.browser.navigate('up')
                break
            case 'left':
                this.browser.navigate('left')
                break
            case 'right':
                this.browser.navigate('right')
                break
            case 'enter':
                if (item = (this.activeRow() != null ? this.activeRow().item : undefined))
                {
                    type = item.type
                    if (type === 'dir')
                    {
                        this.browser.loadItem(item)
                    }
                    else if (item.path)
                    {
                        post.emit('jumpTo',item)
                        post.emit('focus','editor')
                    }
                }
                break
        }

        return this
    }

    Column.prototype["navigateRoot"] = function (key)
    {
        switch (key)
        {
            case 'left':
                this.browser.browse(slash.dir(this.parent.path))
                break
            case 'right':
                this.browser.browse(this.activeRow().item.path)
                break
        }

        return this
    }

    Column.prototype["doSearch"] = function (char)
    {
        if (!this.numRows())
        {
            return
        }
        if (!this.searchDiv)
        {
            this.searchDiv = elem({class:'browserSearch'})
        }
        return this.setSearch(this.search + char)
    }

    Column.prototype["backspaceSearch"] = function ()
    {
        if (this.searchDiv && this.search.length)
        {
            return this.setSearch(this.search.slice(0, this.search.length - 1))
        }
    }

    Column.prototype["setSearch"] = function (search)
    {
        var activeIndex, fuzzied, row, rows, _559_35_, _559_45_

        this.search = search
    
        clearTimeout(this.searchTimer)
        this.searchTimer = setTimeout(this.clearSearch,2000)
        this.searchDiv.textContent = this.search
        activeIndex = ((_559_45_=(this.activeRow() != null ? this.activeRow().index() : undefined)) != null ? _559_45_ : 0)
        if ((this.search.length === 1))
        {
            activeIndex += 1
        }
        if (activeIndex >= this.numRows())
        {
            activeIndex = 0
        }
        var list = [this.rows.slice(activeIndex),this.rows.slice(0,activeIndex + 1)]
        for (var _563_17_ = 0; _563_17_ < list.length; _563_17_++)
        {
            rows = list[_563_17_]
            fuzzied = fuzzy.filter(this.search,rows,{extract:function (r)
            {
                return r.item.name
            }})
            if (fuzzied.length)
            {
                row = fuzzied[0].original
                row.div.appendChild(this.searchDiv)
                row.activate()
                break
            }
        }
        return this
    }

    Column.prototype["clearSearch"] = function ()
    {
        var _576_18_

        this.search = ''
        ;(this.searchDiv != null ? this.searchDiv.remove() : undefined)
        delete this.searchDiv
        return this
    }

    Column.prototype["removeObject"] = function ()
    {
        var nextOrPrev, row, _583_36_

        if (row = this.activeRow())
        {
            nextOrPrev = ((_583_36_=row.next()) != null ? _583_36_ : row.prev())
            this.removeRow(row)
            ;(nextOrPrev != null ? nextOrPrev.activate() : undefined)
        }
        return this
    }

    Column.prototype["removeRow"] = function (row)
    {
        var _591_28_, _591_36_, _591_54_

        if (row === this.activeRow())
        {
            if (((_591_28_=this.nextColumn()) != null ? (_591_36_=_591_28_.parent) != null ? _591_36_.path : undefined : undefined) === (row.item != null ? row.item.path : undefined))
            {
                this.browser.clearColumnsFrom(this.index + 1)
            }
        }
        row.div.remove()
        this.items.splice(row.index(),1)
        return this.rows.splice(row.index(),1)
    }

    Column.prototype["sortByName"] = function ()
    {
        var row

        this.rows.sort(function (a, b)
        {
            return (a.item.type + a.item.name).localeCompare(b.item.type + b.item.name)
        })
        this.table.innerHTML = ''
        var list = _k_.list(this.rows)
        for (var _610_16_ = 0; _610_16_ < list.length; _610_16_++)
        {
            row = list[_610_16_]
            this.table.appendChild(row.div)
        }
        return this
    }

    Column.prototype["sortByType"] = function ()
    {
        var row

        this.rows.sort(function (a, b)
        {
            var atype, btype

            atype = a.item.type === 'file' && slash.ext(a.item.path) || '___'
            btype = b.item.type === 'file' && slash.ext(b.item.path) || '___'
            return (a.item.type + atype + a.item.name).localeCompare(b.item.type + btype + b.item.name,undefined,{numeric:true})
        })
        this.table.innerHTML = ''
        var list = _k_.list(this.rows)
        for (var _622_16_ = 0; _622_16_ < list.length; _622_16_++)
        {
            row = list[_622_16_]
            this.table.appendChild(row.div)
        }
        return this
    }

    Column.prototype["sortByDateAdded"] = function ()
    {
        var row

        this.rows.sort(function (a, b)
        {
            var _628_39_, _628_62_

            return (b.item.stat != null ? b.item.stat.atimeMs : undefined) - (a.item.stat != null ? a.item.stat.atimeMs : undefined)
        })
        this.table.innerHTML = ''
        var list = _k_.list(this.rows)
        for (var _631_16_ = 0; _631_16_ < list.length; _631_16_++)
        {
            row = list[_631_16_]
            this.table.appendChild(row.div)
        }
        return this
    }

    Column.prototype["toggleDotFiles"] = function ()
    {
        var stateKey

        if (this.parent.type === 'dir')
        {
            stateKey = `browser▸showHidden▸${this.parent.path}`
            if (prefs.get(stateKey))
            {
                prefs.del(stateKey)
            }
            else
            {
                prefs.set(stateKey,true)
            }
            this.browser.loadDirItem(this.parent,this.index,{ignoreCache:true})
        }
        return this
    }

    Column.prototype["toggleExtensions"] = function ()
    {
        var stateKey

        stateKey = "browser|hideExtensions"
        window.stash.set(stateKey,!window.stash.get(stateKey,false))
        setStyle('.browserRow .ext','display',window.stash.get(stateKey) && 'none' || 'initial')
        return this
    }

    Column.prototype["moveToTrash"] = function ()
    {
        var index, row, selectRow

        index = this.browser.select.freeIndex()
        if (index >= 0)
        {
            selectRow = this.row(index)
        }
        var list = _k_.list(this.browser.select.rows)
        for (var _671_16_ = 0; _671_16_ < list.length; _671_16_++)
        {
            row = list[_671_16_]
            ffs.trash(row.path()).then((function (d)
            {
                if (d)
                {
                    return this.removeRow(row)
                }
            }).bind(this))
        }
        if (selectRow)
        {
            return this.browser.select.row(selectRow)
        }
        else
        {
            return this.navigateCols('left')
        }
    }

    Column.prototype["addToShelf"] = function ()
    {
        var pathToShelf

        if (pathToShelf = this.activePath())
        {
            return post.emit('addToShelf',pathToShelf)
        }
    }

    Column.prototype["newFolder"] = function ()
    {
        var newDir

        newDir = slash.path(this.path(),'New folder')
        return ffs.mkdir(newDir).then((function (d)
        {
            var row

            if (d)
            {
                console.log('new folder',d)
                row = this.insertFile(d)
                console.log('new row',row)
                this.browser.select.row(row)
                return row.editName()
            }
        }).bind(this))
    }

    Column.prototype["duplicateFile"] = function ()
    {
        var item

        var list = _k_.list(this.browser.select.items())
        for (var _704_17_ = 0; _704_17_ < list.length; _704_17_++)
        {
            item = list[_704_17_]
            File.duplicate(item.path).then((function (target)
            {
                var col, row

                if (target)
                {
                    console.log('duplicated',target)
                    if (this.parent.type === 'file')
                    {
                        col = this.prevColumn()
                        col.focus()
                    }
                    else
                    {
                        col = this
                    }
                    if (item.type === 'file')
                    {
                        row = col.insertFile(target)
                    }
                    else
                    {
                        row = col.insertDir(target)
                    }
                    return this.browser.select.row(row)
                }
            }).bind(this))
        }
    }

    Column.prototype["explorer"] = function ()
    {
        return open(slash.dir(this.activePath()))
    }

    Column.prototype["open"] = function ()
    {
        return open(this.activePath())
    }

    Column.prototype["updateGitFiles"] = function (files)
    {
        var file, icon, row, status

        var list = _k_.list(this.rows)
        for (var _740_16_ = 0; _740_16_ < list.length; _740_16_++)
        {
            row = list[_740_16_]
            if (!(_k_.in(row.item.type,['dir','file'])))
            {
                return
            }
            if (!row.div)
            {
                return
            }
            status = files[row.item.path]
            if (icon = $('.browserStatusIcon',row.div))
            {
                icon.remove()
            }
            if ((status != null))
            {
                row.div.appendChild(elem('span',{class:`git-${status}-icon browserStatusIcon`}))
            }
            else if (row.item.type === 'dir')
            {
                for (file in files)
                {
                    status = files[file]
                    if (row.item.file !== '..' && file.startsWith(row.item.path))
                    {
                        row.div.appendChild(elem('span',{class:"git-dirs-icon browserStatusIcon"}))
                        break
                    }
                }
            }
        }
    }

    Column.prototype["makeRoot"] = function ()
    {
        if (!this.parent)
        {
            return
        }
        this.browser.shiftColumnsTo(this.index)
        if (this.browser.columns[0].items[0].file !== '..')
        {
            this.unshiftItem({file:'..',type:'dir',path:slash.dir(this.parent.path)})
        }
        return this.crumb.setFile(this.parent.path)
    }

    Column.prototype["onContextMenu"] = function (event, column)
    {
        var absPos, opt

        stopEvent(event)
        absPos = kpos(event)
        if (!column)
        {
            return this.showContextMenu(absPos)
        }
        else
        {
            opt = {items:[{text:'Root',cb:this.makeRoot},{text:'Add to Shelf',combo:'alt+shift+.',cb:(function ()
            {
                return post.emit('addToShelf',this.parent.path)
            }).bind(this)},{text:'Explorer',combo:'alt+e',cb:(function ()
            {
                return open(this.parent.path)
            }).bind(this)}]}
            opt.x = absPos.x
            opt.y = absPos.y
            return popup.menu(opt)
        }
    }

    Column.prototype["showContextMenu"] = function (absPos)
    {
        var opt

        if (!(absPos != null))
        {
            absPos = kpos(this.div.getBoundingClientRect().left,this.div.getBoundingClientRect().top)
        }
        opt = {items:[{text:'Toggle Invisible',combo:'ctrl+i',cb:this.toggleDotFiles},{text:'Toggle Extensions',combo:'ctrl+e',cb:this.toggleExtensions},{text:''},{text:'Explorer',combo:'alt+e',cb:this.explorer},{text:''},{text:'Add to Shelf',combo:'alt+shift+.',cb:this.addToShelf},{text:''},{text:'Delete',combo:'ctrl+backspace',cb:this.moveToTrash},{text:'',hide:this.parent.type === 'file'},{text:'Duplicate',combo:'ctrl+d',cb:this.duplicateFile,hide:this.parent.type === 'file'},{text:'New Folder',combo:'alt+n',cb:this.newFolder,hide:this.parent.type === 'file'}]}
        if (this.parent.type !== 'file')
        {
            opt.items = opt.items.concat([{text:''},{text:'Sort',menu:[{text:'By Name',combo:'ctrl+n',cb:this.sortByName},{text:'By Type',combo:'ctrl+t',cb:this.sortByType},{text:'By Date',combo:'ctrl+a',cb:this.sortByDateAdded}]}])
        }
        opt.x = absPos.x
        opt.y = absPos.y
        return popup.menu(opt)
    }

    Column.prototype["copyPaths"] = function ()
    {
        var paths

        paths = this.browser.select.files().join('\n')
        electron.clipboard.writeText(paths)
        return paths
    }

    Column.prototype["cutPaths"] = function ()
    {
        return this.browser.cutPaths = this.copyPaths()
    }

    Column.prototype["pastePaths"] = function ()
    {
        var action, paths, target, text, _893_23_

        text = electron.clipboard.readText()
        paths = text.split('\n')
        if (text === this.browser.cutPaths)
        {
            action = 'move'
        }
        else
        {
            action = 'copy'
        }
        target = this.parent.path
        if ((this.activeRow() != null ? this.activeRow().item.type : undefined) === 'dir')
        {
            target = this.activeRow().item.path
        }
        return this.browser.dropAction(action,paths,target)
    }

    Column.prototype["onKey"] = function (event)
    {
        var char, combo, key, mod, _930_88_

        mod = keyinfo.forEvent(event).mod
        key = keyinfo.forEvent(event).key
        combo = keyinfo.forEvent(event).combo
        char = keyinfo.forEvent(event).char

        switch (combo)
        {
            case 'shift+`':
            case '~':
                return stopEvent(event,this.browser.browse('~'))

            case '/':
                return stopEvent(event,this.browser.browse('/'))

            case 'backspace':
                return stopEvent(event,this.browser.onBackspaceInColumn(this))

            case 'delete':
                return stopEvent(event,this.browser.onDeleteInColumn(this))

            case 'alt+left':
                return stopEvent(event,window.split.focus('shelf'))

            case 'alt+shift+.':
                return stopEvent(event,this.addToShelf())

            case 'alt+e':
                return stopEvent(event,this.explorer())

            case 'alt+n':
                return stopEvent(event,this.newFolder())

            case 'ctrl+x':
            case 'command+x':
                return stopEvent(event,this.cutPaths())

            case 'ctrl+c':
            case 'command+c':
                return stopEvent(event,this.copyPaths())

            case 'ctrl+v':
            case 'command+v':
                return stopEvent(event,this.pastePaths())

            case 'page up':
            case 'page down':
            case 'home':
            case 'end':
                return stopEvent(event,this.navigateRows(key))

            case 'enter':
            case 'alt+up':
                return stopEvent(event,this.navigateCols(key))

            case 'command+up':
            case 'ctrl+up':
                return stopEvent(event,this.navigateRows('home'))

            case 'command+down':
            case 'ctrl+down':
                return stopEvent(event,this.navigateRows('end'))

            case 'ctrl+t':
                return stopEvent(event,this.sortByType())

            case 'ctrl+n':
                return stopEvent(event,this.sortByName())

            case 'ctrl+a':
                return stopEvent(event,this.sortByDateAdded())

            case 'ctrl+e':
                return stopEvent(event,this.toggleExtensions())

            case 'command+i':
            case 'ctrl+i':
                return stopEvent(event,this.toggleDotFiles())

            case 'command+d':
            case 'ctrl+d':
                return stopEvent(event,this.duplicateFile())

            case 'command+k':
            case 'ctrl+k':
                if (this.browser.cleanUp())
                {
                    return stopEvent(event)
                }
                break
            case 'f2':
                return stopEvent(event,(this.activeRow() != null ? this.activeRow().editName() : undefined))

            case 'shift+up':
            case 'shift+down':
            case 'shift+home':
            case 'shift+end':
            case 'shift+page up':
            case 'shift+page down':
                return stopEvent(event,this.extendSelection(key))

            case 'command+left':
            case 'command+right':
            case 'ctrl+left':
            case 'ctrl+right':
                return stopEvent(event,this.navigateRoot(key))

            case 'command+backspace':
            case 'ctrl+backspace':
            case 'command+delete':
            case 'ctrl+delete':
                return stopEvent(event,this.moveToTrash())

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
                else if (this.browser.select.files().length > 1)
                {
                    this.browser.select.row(this.activeRow())
                }
                else if (this.search.length)
                {
                    this.clearSearch()
                }
                return stopEvent(event)

        }

        if (_k_.in(combo,['up','down']))
        {
            return stopEvent(event,this.navigateRows(key))
        }
        if (_k_.in(combo,['left','right']))
        {
            return stopEvent(event,this.navigateCols(key))
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

    Column.prototype["onKeyUp"] = function (event)
    {
        if (this.dragDiv)
        {
            return this.updateDragIndicator(event)
        }
    }

    return Column
})()

export default Column;