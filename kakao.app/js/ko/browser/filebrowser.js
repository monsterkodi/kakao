var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var FileBrowser

import dom from "../../kxk/dom.js"
let $ = dom.$

import slash from "../../kxk/slash.js"

import elem from "../../kxk/elem.js"

import drag from "../../kxk/drag.js"

import post from "../../kxk/post.js"

import ffs from "../../kxk/ffs.js"

import File from "../tools/File.js"

import Select from "./Select.js"

import Info from "./Info.js"

import Browser from "./Browser.js"

import Shelf from "./Shelf.js"


FileBrowser = (function ()
{
    _k_.extend(FileBrowser, Browser)
    function FileBrowser (view)
    {
        this["onShelfDrag"] = this["onShelfDrag"].bind(this)
        this["onGitStatus"] = this["onGitStatus"].bind(this)
        this["applyGitStatusFiles"] = this["applyGitStatusFiles"].bind(this)
        this["getGitStatus"] = this["getGitStatus"].bind(this)
        this["updateColumnScrolls"] = this["updateColumnScrolls"].bind(this)
        this["loadDirItems"] = this["loadDirItems"].bind(this)
        this["onDirChanged"] = this["onDirChanged"].bind(this)
        this["onFileIndexed"] = this["onFileIndexed"].bind(this)
        this["onFileBrowser"] = this["onFileBrowser"].bind(this)
        this["refresh"] = this["refresh"].bind(this)
        this["navigateToFile"] = this["navigateToFile"].bind(this)
        this["onFile"] = this["onFile"].bind(this)
        this["browse"] = this["browse"].bind(this)
        FileBrowser.__super__.constructor.call(this,view)
        window.filebrowser = this
        this.loadID = 0
        this.shelf = new Shelf(this)
        this.select = new Select(this)
        this.name = 'FileBrowser'
        this.srcCache = {}
        post.on('browse',this.browse)
        post.on('filebrowser',this.onFileBrowser)
        post.on('gitStatus',this.onGitStatus)
        post.on('fileIndexed',this.onFileIndexed)
        post.on('dirChanged',this.onDirChanged)
        this.shelfResize = elem('div',{class:'shelfResize'})
        this.shelfResize.style.position = 'absolute'
        this.shelfResize.style.top = '0px'
        this.shelfResize.style.bottom = '0px'
        this.shelfResize.style.left = '194px'
        this.shelfResize.style.width = '6px'
        this.shelfResize.style.cursor = 'ew-resize'
        this.drag = new drag({target:this.shelfResize,onMove:this.onShelfDrag})
        this.shelfSize = window.state.get('shelf|size',200)
        this.initColumns()
    }

    FileBrowser.prototype["dropAction"] = function (action, sources, target)
    {
        var source

        if (slash.isFile(target))
        {
            target = slash.dir(target)
        }
        var list = _k_.list(sources)
        for (var _72_19_ = 0; _72_19_ < list.length; _72_19_++)
        {
            source = list[_72_19_]
            if (action === 'move')
            {
                if (source === target || slash.dir(source) === target)
                {
                    console.log('noop',source,target)
                    return
                }
            }
        }
        var list1 = _k_.list(sources)
        for (var _79_19_ = 0; _79_19_ < list1.length; _79_19_++)
        {
            source = list1[_79_19_]
            switch (action)
            {
                case 'move':
                    File.rename(source,target,(function (source, target)
                    {}).bind(this))
                    break
                case 'copy':
                    File.copy(source,target,(function (source, target)
                    {}).bind(this))
                    break
            }

        }
    }

    FileBrowser.prototype["columnForFile"] = function (file)
    {
        var column, _88_28_

        var list = _k_.list(this.columns)
        for (var _87_19_ = 0; _87_19_ < list.length; _87_19_++)
        {
            column = list[_87_19_]
            if ((column.parent != null ? column.parent.file : undefined) === slash.dir(file))
            {
                return column
            }
        }
    }

    FileBrowser.prototype["sharedColumnIndex"] = function (file)
    {
        var col, column

        col = 0
        var list = _k_.list(this.columns)
        for (var _101_19_ = 0; _101_19_ < list.length; _101_19_++)
        {
            column = list[_101_19_]
            if (column.isDir() && file.startsWith(column.path()))
            {
                col += 1
            }
            else
            {
                break
            }
        }
        if (col === 1 && slash.dir(file) !== (this.columns[0] != null ? this.columns[0].path() : undefined))
        {
            return 0
        }
        return Math.max(-1,col - 2)
    }

    FileBrowser.prototype["browse"] = function (file, opt)
    {
        console.log('browse',file,opt)
        if (file)
        {
            return this.loadItem(this.fileItem(file),opt)
        }
    }

    FileBrowser.prototype["onFile"] = function (file)
    {
        if (file && this.flex)
        {
            return this.navigateToFile(file)
        }
    }

    FileBrowser.prototype["navigateToFile"] = function (file)
    {
        var col, filelist, index, item, lastPath, opt, paths, row, _132_35_

        lastPath = (this.lastDirColumn() != null ? this.lastDirColumn().path() : undefined)
        file = slash.path(file)
        if (file === lastPath || file === this.lastColumnPath() || slash.isRelative(file))
        {
            return
        }
        col = this.sharedColumnIndex(file)
        filelist = slash.pathlist(file)
        if (col >= 0)
        {
            paths = filelist.slice(filelist.indexOf(this.columns[col].path()) + 1)
        }
        else
        {
            paths = filelist.slice(filelist.length - 2)
        }
        this.clearColumnsFrom(col + 1,{pop:true,clear:col + paths.length})
        while (this.numCols() < paths.length)
        {
            this.addColumn()
        }
        for (var _153_22_ = index = 0, _153_26_ = paths.length; (_153_22_ <= _153_26_ ? index < paths.length : index > paths.length); (_153_22_ <= _153_26_ ? ++index : --index))
        {
            item = this.fileItem(paths[index])
            switch (item.type)
            {
                case 'file':
                    this.loadFileItem(item,col + 1 + index)
                    break
                case 'dir':
                    opt = {}
                    if (index < paths.length - 1)
                    {
                        opt.active = paths[index + 1]
                    }
                    this.loadDirItem(item,col + 1 + index,opt)
                    break
            }

        }
        if (col = this.lastDirColumn())
        {
            if (row = col.row(slash.file(file)))
            {
                return row.setActive()
            }
        }
    }

    FileBrowser.prototype["refresh"] = function ()
    {
        this.srcCache = {}
        if (this.lastUsedColumn())
        {
            return this.navigateToFile(this.lastUsedColumn().path())
        }
    }

    FileBrowser.prototype["fileItem"] = function (path)
    {
        var p

        p = slash.path(path)
        return {file:p,type:undefined,name:slash.file(p)}
    }

    FileBrowser.prototype["onFileBrowser"] = function (action, item, arg)
    {
        switch (action)
        {
            case 'loadItem':
                return this.loadItem(item,arg)

            case 'activateItem':
                return this.activateItem(item,arg)

        }

    }

    FileBrowser.prototype["loadDir"] = function (path)
    {
        return this.loadItem({type:'dir',file:path})
    }

    FileBrowser.prototype["loadItem"] = function (item, opt)
    {
        var _220_18_, _222_55_

        console.log('loadItem',item,opt)
        opt = (opt != null ? opt : {active:'..',focus:true})
        item.name = ((_220_18_=item.name) != null ? _220_18_ : slash.file(item.file))
        this.clearColumnsFrom(1,{pop:true,clear:((_222_55_=opt.clear) != null ? _222_55_ : 1)})
        switch (item.type)
        {
            case 'dir':
                this.loadDirItem(item,0,opt)
                break
            case 'file':
                opt.activate = item.file
                while (this.numCols() < 2)
                {
                    this.addColumn()
                }
                this.loadDirItem(this.fileItem(slash.dir(item.file)),0,opt)
                break
            default:
                ffs.isDir(item.file).then((function (stat)
            {
                if (stat)
                {
                    return this.loadDirItem(item,0,opt)
                }
            }).bind(this))
                return
        }

        if (opt.focus)
        {
            return (this.columns[0] != null ? this.columns[0].focus() : undefined)
        }
    }

    FileBrowser.prototype["activateItem"] = function (item, col)
    {
        this.clearColumnsFrom(col + 2,{pop:true})
        switch (item.type)
        {
            case 'dir':
                return this.loadDirItem(item,col + 1,{focus:false})

            case 'file':
                this.loadFileItem(item,col + 1)
                if (item.textFile || File.isText(item.file))
                {
                    console.log('FileBrowser emit jumpToFile',item)
                    return post.emit('jumpToFile',item)
                }
                break
        }

    }

    FileBrowser.prototype["loadFileItem"] = function (item, col = 0)
    {
        var file

        this.clearColumnsFrom(col,{pop:true})
        while (col >= this.numCols())
        {
            this.addColumn()
        }
        file = item.path
        this.columns[col].parent = item
        if (File.isImage(file))
        {
            this.imageInfoColumn(col,file)
        }
        else
        {
            switch (slash.ext(file))
            {
                case 'tiff':
                case 'tif':
                    if (!slash.win())
                    {
                        this.convertImage(row)
                    }
                    else
                    {
                        this.fileInfoColumn(col,file)
                    }
                    break
                case 'pxm':
                    if (!slash.win())
                    {
                        this.convertPXM(row)
                    }
                    else
                    {
                        this.fileInfoColumn(col,file)
                    }
                    break
                default:
                    if (File.isText(item.file))
                {
                    this.loadSourceItem(item,col)
                }
                    if (!File.isCode(item.file))
                {
                    this.fileInfoColumn(col,file)
                }
            }

        }
        post.emit('load',{column:col,item:item})
        return this.updateColumnScrolls()
    }

    FileBrowser.prototype["imageInfoColumn"] = function (col, file)
    {
        this.columns[col].crumb.hide()
        return this.columns[col].table.appendChild(Info.image(file))
    }

    FileBrowser.prototype["fileInfoColumn"] = function (col, file)
    {
        this.columns[col].crumb.hide()
        return this.columns[col].table.appendChild(Info.file(file))
    }

    FileBrowser.prototype["onFileIndexed"] = function (file, info)
    {
        var _323_36_, _323_44_, _324_73_

        this.srcCache[file] = info
        if (file === ((_323_36_=this.lastUsedColumn()) != null ? (_323_44_=_323_36_.parent) != null ? _323_44_.file : undefined : undefined))
        {
            return this.loadSourceItem({file:file,type:'file'},(this.lastUsedColumn() != null ? this.lastUsedColumn().index : undefined))
        }
    }

    FileBrowser.prototype["loadSourceItem"] = function (item, col)
    {
        var clss, clsss, func, funcs, info, items, text, _339_29_, _344_27_

        info = this.srcCache[item.file]
        if (_k_.empty(info))
        {
            return
        }
        items = []
        clsss = ((_339_29_=info.classes) != null ? _339_29_ : [])
        var list = _k_.list(clsss)
        for (var _340_17_ = 0; _340_17_ < list.length; _340_17_++)
        {
            clss = list[_340_17_]
            text = '● ' + clss.name
            items.push({name:clss.name,text:text,type:'class',file:item.file,line:clss.line})
        }
        funcs = ((_344_27_=info.funcs) != null ? _344_27_ : [])
        var list1 = _k_.list(funcs)
        for (var _345_17_ = 0; _345_17_ < list1.length; _345_17_++)
        {
            func = list1[_345_17_]
            if (func.test === 'describe')
            {
                text = '● ' + func.name
            }
            else if (func.static)
            {
                if (func.async)
                {
                    text = ' ○◆ ' + func.name
                }
                else
                {
                    text = '  ◆ ' + func.name
                }
            }
            else if (func.post)
            {
                text = '  ⬢ ' + func.name
            }
            else
            {
                if (func.async)
                {
                    text = ' ○▸ ' + func.name
                }
                else
                {
                    text = '  ▸ ' + func.name
                }
            }
            items.push({name:func.name,text:text,type:'func',file:item.file,line:func.line})
        }
        if (!_k_.empty(items))
        {
            items.sort(function (a, b)
            {
                return a.line - b.line
            })
            return this.columns[col].loadItems(items,item)
        }
    }

    FileBrowser.prototype["onDirChanged"] = function (info)
    {
        var column

        var list = _k_.list(this.columns)
        for (var _374_19_ = 0; _374_19_ < list.length; _374_19_++)
        {
            column = list[_374_19_]
            if (column.path() === info.dir)
            {
                this.loadDirItem({file:info.dir,type:'dir'},column.index,{active:column.activePath(),focus:false})
            }
            if (column.path() === info.path && info.change === 'remove')
            {
                column.clear()
            }
        }
    }

    FileBrowser.prototype["loadDirItem"] = function (item, col = 0, opt = {})
    {
        var dir

        if (col > 0 && item.name === '/')
        {
            return
        }
        dir = item.file
        console.log('loadDirItem',dir)
        ffs.list(dir).then((function (items)
        {
            console.log('loadDir items',items)
            this.loadDirItems(dir,item,items,col,opt)
            return post.emit('dir',dir)
        }).bind(this))
        return true
    }

    FileBrowser.prototype["loadDirItems"] = function (dir, item, items, col, opt)
    {
        var lastColumn, row, _418_52_, _422_85_, _426_14_

        console.log('loadDirItems',dir,item,items,col,opt)
        this.updateColumnScrolls()
        if (this.skipOnDblClick && col > 0)
        {
            delete this.skipOnDblClick
            return
        }
        while (col >= this.numCols())
        {
            this.addColumn()
        }
        this.columns[col].loadItems(items,item)
        post.emit('load',{column:col,item:item})
        if (opt.activate)
        {
            if (row = this.columns[col].row(slash.file(opt.activate)))
            {
                row.activate()
                post.emit('load',{column:col + 1,item:row.item})
            }
        }
        else if (opt.active)
        {
            ;(this.columns[col].row(slash.file(opt.active)) != null ? this.columns[col].row(slash.file(opt.active)).setActive() : undefined)
        }
        this.getGitStatus(item,col)
        if (opt.focus !== false && _k_.empty((document.activeElement)) && _k_.empty((($('.popup') != null ? $('.popup').outerHTML : undefined))))
        {
            if (lastColumn = this.lastDirColumn())
            {
                lastColumn.focus()
            }
        }
        ;(typeof opt.cb === "function" ? opt.cb({column:col,item:item}) : undefined)
        if (col >= 2 && this.columns[0].width() < 250)
        {
            return this.columns[1].makeRoot()
        }
    }

    FileBrowser.prototype["initColumns"] = function ()
    {
        FileBrowser.__super__.initColumns.call(this)
    
        this.view.insertBefore(this.shelf.div,this.view.firstChild)
        this.view.insertBefore(this.shelfResize,null)
        this.shelf.browserDidInitColumns()
        return this.setShelfSize(this.shelfSize)
    }

    FileBrowser.prototype["columnAtPos"] = function (pos)
    {
        var column

        if (column = FileBrowser.__super__.columnAtPos.call(this,pos))
        {
            return column
        }
        if (elem.containsPos(this.shelf.div,pos))
        {
            return this.shelf
        }
    }

    FileBrowser.prototype["lastColumnPath"] = function ()
    {
        var lastColumn

        if (lastColumn = this.lastUsedColumn())
        {
            return lastColumn.path()
        }
    }

    FileBrowser.prototype["lastDirColumn"] = function ()
    {
        var lastColumn

        if (lastColumn = this.lastUsedColumn())
        {
            if (lastColumn.isDir())
            {
                return lastColumn
            }
            else
            {
                return lastColumn.prevColumn()
            }
        }
    }

    FileBrowser.prototype["lastDirOrSrcColumn"] = function ()
    {
        var lastColumn

        if (lastColumn = this.lastUsedColumn())
        {
            if (lastColumn.isDir() || lastColumn.isSrc())
            {
                return lastColumn
            }
            else
            {
                return lastColumn.prevColumn()
            }
        }
    }

    FileBrowser.prototype["onBackspaceInColumn"] = function (column)
    {
        return column.backspaceSearch()
    }

    FileBrowser.prototype["onDeleteInColumn"] = function (column)
    {
        if (column.searchDiv)
        {
            return column.clearSearch()
        }
        else
        {
            return column.moveToTrash()
        }
    }

    FileBrowser.prototype["updateColumnScrolls"] = function ()
    {
        FileBrowser.__super__.updateColumnScrolls.call(this)
    
        var _491_14_

        return (this.shelf != null ? this.shelf.scroll.update() : undefined)
    }

    FileBrowser.prototype["getGitStatus"] = function (item, col)
    {
        var file, _501_25_, _501_38_

        file = ((_501_25_=item.file) != null ? _501_25_ : (item.parent != null ? item.parent.file : undefined))
        if (_k_.empty(file))
        {
            return
        }
    }

    FileBrowser.prototype["applyGitStatusFiles"] = function (col, files)
    {
        return (this.columns[col] != null ? this.columns[col].updateGitFiles(files) : undefined)
    }

    FileBrowser.prototype["onGitStatus"] = function (gitDir, status)
    {}

    FileBrowser.prototype["onShelfDrag"] = function (drag, event)
    {
        var shelfSize

        shelfSize = _k_.clamp(0,400,drag.pos.x)
        return this.setShelfSize(shelfSize)
    }

    FileBrowser.prototype["setShelfSize"] = function (shelfSize)
    {
        this.shelfSize = shelfSize
    
        window.state.set('shelf|size',this.shelfSize)
        this.shelfResize.style.left = `${this.shelfSize}px`
        this.shelf.div.style.width = `${this.shelfSize}px`
        this.cols.style.left = `${this.shelfSize}px`
        return this.updateColumnScrolls()
    }

    FileBrowser.prototype["toggleShelf"] = function ()
    {
        var _541_29_

        if (this.shelfSize < 1)
        {
            this.setShelfSize(200)
        }
        else
        {
            console.log('toggleShelf lastUsedColumn.focus')
            ;(this.lastUsedColumn() != null ? this.lastUsedColumn().focus() : undefined)
            this.setShelfSize(0)
        }
        return this.updateColumnScrolls()
    }

    return FileBrowser
})()

export default FileBrowser;