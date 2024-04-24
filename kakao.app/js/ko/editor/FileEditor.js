var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var FileEditor

import kxk from "../../kxk.js"
let deleteBy = kxk.deleteBy
let ffs = kxk.ffs
let kpos = kxk.kpos
let post = kxk.post
let popup = kxk.popup
let slash = kxk.slash
let stopEvent = kxk.stopEvent
let setStyle = kxk.setStyle
let kstr = kxk.kstr

import File from "../tools/File.js"

import Syntax from "./Syntax.js"
import TextEditor from "./TextEditor.js"


FileEditor = (function ()
{
    _k_.extend(FileEditor, TextEditor)
    function FileEditor (viewElem)
    {
        this["showContextMenu"] = this["showContextMenu"].bind(this)
        this["onContextMenu"] = this["onContextMenu"].bind(this)
        this["jumpTo"] = this["jumpTo"].bind(this)
        this["jumpToFile"] = this["jumpToFile"].bind(this)
        this["jumpToFilePos"] = this["jumpToFilePos"].bind(this)
        this["restoreTab"] = this["restoreTab"].bind(this)
        this["onCommandline"] = this["onCommandline"].bind(this)
        this["setText"] = this["setText"].bind(this)
        FileEditor.__super__.constructor.call(this,viewElem,{features:['Diffbar','Scrollbar','Numbers','Minimap','Meta','AutoComplete','Brackets','Strings','CursorLine'],fontSize:19})
        this.currentFile = null
        this.view.addEventListener('contextmenu',this.onContextMenu)
        post.on('commandline',this.onCommandline)
        post.on('jumpTo',this.jumpTo)
        post.on('jumpToFile',this.jumpToFile)
        post.on('jumpToFilePos',this.jumpToFilePos)
        post.on('restoreTab',this.restoreTab)
        this.setText('')
        this.initInvisibles()
        this.initPigments()
    }

    FileEditor.prototype["changed"] = function (changeInfo)
    {
        FileEditor.__super__.changed.call(this,changeInfo)
    
        if (changeInfo.changes.length)
        {
            this.dirty = this.do.hasChanges()
            return post.emit('dirty',this.dirty)
        }
    }

    FileEditor.prototype["clear"] = function ()
    {
        var _70_16_, _71_13_

        this.dirty = false
        this.setSalterMode(false)
        ;(this.diffbar != null ? this.diffbar.clear() : undefined)
        ;(this.meta != null ? this.meta.clear() : undefined)
        this.setLines([''])
        return this.do.reset()
    }

    FileEditor.prototype["setCurrentFile"] = function (file)
    {
        this.clear()
        this.currentFile = file
        this.setupFileType()
        if (this.currentFile)
        {
            return ffs.read(this.currentFile).then(this.setText)
        }
    }

    FileEditor.prototype["setText"] = function (text = "")
    {
        FileEditor.__super__.setText.call(this,text)
    
        this.restoreFilePosition()
        post.emit('file',this.currentFile)
        return this.emit('file',this.currentFile)
    }

    FileEditor.prototype["currentDir"] = function ()
    {
        var _96_23_

        if ((this.currentFile != null))
        {
            return slash.dir(this.currentFile)
        }
        else
        {
            return slash.path(kakao.bundle.path)
        }
    }

    FileEditor.prototype["shebangFileType"] = function ()
    {
        var ext, fileType, _111_27_

        if (this.numLines())
        {
            fileType = Syntax.shebang(this.line(0))
        }
        if (fileType === 'txt')
        {
            if ((this.currentFile != null))
            {
                ext = slash.ext(this.currentFile)
                if (_k_.in(ext,Syntax.syntaxNames))
                {
                    return ext
                }
            }
        }
        else if (fileType)
        {
            return fileType
        }
        return FileEditor.__super__.shebangFileType.call(this)
    }

    FileEditor.prototype["onCommandline"] = function (e)
    {
        var d

        switch (e)
        {
            case 'hidden':
            case 'shown':
                d = window.split.commandlineHeight + window.split.flex.handleSize
                d = Math.min(d,this.scroll.scrollMax - this.scroll.scroll)
                if (e === 'hidden')
                {
                    d *= -1
                }
                return this.scroll.by(d)

        }

    }

    FileEditor.prototype["saveFilePosition"] = function ()
    {
        var cursor, filePositions

        if (!this.currentFile)
        {
            return
        }
        filePositions = window.stash.get('filePositions',{})
        if (!(_k_.isObj(filePositions)))
        {
            filePositions = {}
        }
        cursor = this.mainCursor()
        if (cursor[0] || cursor[1])
        {
            filePositions[this.currentFile] = `${cursor[0]} ${cursor[1]} ${this.scroll.scroll}`
        }
        else
        {
            delete filePositions[this.currentFile]
        }
        deleteBy(filePositions,function (f, fp)
        {
            return fp.startsWith('0 0 ')
        })
        return window.stash.set('filePositions',filePositions)
    }

    FileEditor.prototype["restoreTab"] = function (tab)
    {
        var state, text

        state = tab.state
        if (this.currentFile !== kore.get('editor|file'))
        {
            if (_k_.empty(this.currentFile) && !_k_.empty(kore.get('editor|file')))
            {
                console.warn('FileEditor.restoreTab -- empty @currentFile:',this.currentFile,kore.get('editor|file'))
            }
            else
            {
                console.error('FileEditor.restoreTab -- editor file mismatch!',this.currentFile,kore.get('editor|file'))
                return
            }
        }
        if (state.file !== tab.path)
        {
            console.error('FileEditor.restoreTab -- file path mismatch!',state.file,tab.path)
            console.log('state:',state)
            return
        }
        if (this.currentFile === state.file)
        {
            console.error('FileEditor.restoreTab -- trying to restore currentFile!',this.currentFile)
            return
        }
        post.emit('storeState',this.currentFile,this.do.tabState())
        this.currentFile = state.file
        if (state.file.startsWith('untitled-'))
        {
            text = state.state.text('\n')
        }
        else
        {
            this.do.setTabState(state)
            text = this.do.text()
        }
        this.setText(text)
        return kore.set('editor|file',this.currentFile)
    }

    FileEditor.prototype["restoreFilePosition"] = function ()
    {
        var cursor, filePositions, posScroll, _220_16_

        if (!this.currentFile)
        {
            return
        }
        filePositions = window.stash.get('filePositions',{})
        if (cursor = filePositions[this.currentFile])
        {
            posScroll = cursor.split(' ').map(function (c)
            {
                return parseInt(c)
            })
            this.singleCursorAtPos(posScroll)
            if (posScroll.length === 3)
            {
                this.scroll.scroll = 0
                this.scroll.by(_k_.last(posScroll))
            }
        }
        else
        {
            this.singleCursorAtPos([0,0])
            if (this.mainCursor()[1] === 0)
            {
                this.scroll.top = 0
            }
            this.scroll.bot = this.scroll.top - 1
            this.scroll.to(0)
        }
        this.updateLayers()
        ;(this.numbers != null ? this.numbers.updateColors() : undefined)
        this.minimap.onEditorScroll()
        this.emit('cursor')
        return this.emit('selection')
    }

    FileEditor.prototype["jumpToFilePos"] = function (opt)
    {
        if (opt.path === this.currentFile)
        {
            this.singleCursorAtPos([opt.col,opt.line - 1])
            return this.scroll.cursorToTop()
        }
        else
        {
            console.log('FileEditor.jumpToFilePos loadFile?',opt)
        }
    }

    FileEditor.prototype["jumpToFile"] = function (opt)
    {
        var file, fpos, _260_21_

        opt = (opt != null ? opt : {})
        if (_k_.isStr(opt))
        {
            opt = {path:opt}
        }
        if (File.isImage(opt.path))
        {
            return
        }
        if (window.lastFocus === 'editor')
        {
            var _251_25_ = slash.splitFilePos(opt.path); file = _251_25_[0]; fpos = _251_25_[1]

            opt.pos = fpos
            if (opt.col)
            {
                opt.pos[0] = opt.col
            }
            if (opt.line)
            {
                opt.pos[1] = opt.line - 1
            }
            opt.winID = window.winID
            opt.oldPos = this.cursorPos()
            opt.oldFile = this.currentFile
            opt.file = ((_260_21_=opt.file) != null ? _260_21_ : opt.path)
            return window.navigate.gotoFilePos(opt)
        }
        else
        {
            file = slash.joinFileLine(opt.path,opt.line,opt.col)
            return post.emit('loadFile',file)
        }
    }

    FileEditor.prototype["jumpTo"] = function (word, opt)
    {
        var classes, clss, file, files, find, func, funcs, i, info, infos, type, _283_19_

        if (typeof(word) === 'object' && !(opt != null))
        {
            opt = word
            word = opt.word
        }
        opt = (opt != null ? opt : {})
        if ((opt.path != null))
        {
            this.jumpToFile(opt)
            return true
        }
        if (_k_.empty(word))
        {
            return console.error('nothing to jump to?')
        }
        find = word.toLowerCase().trim()
        if (find[0] === '@')
        {
            find = find.slice(1)
        }
        if (_k_.empty(find))
        {
            return console.error('FileEditor.jumpTo -- nothing to find?')
        }
        type = (opt != null ? opt.type : undefined)
        if (!type || type === 'class')
        {
            classes = window.indexer.classes
            for (clss in classes)
            {
                info = classes[clss]
                if (clss.toLowerCase() === find)
                {
                    this.jumpToFile(info)
                    return true
                }
            }
        }
        if (!type || type === 'func')
        {
            funcs = window.indexer.funcs
            for (func in funcs)
            {
                infos = funcs[func]
                if (func.toLowerCase() === find)
                {
                    info = infos[0]
                    var list = _k_.list(infos)
                    for (var _308_26_ = 0; _308_26_ < list.length; _308_26_++)
                    {
                        i = list[_308_26_]
                        if (i.file === this.currentFile)
                        {
                            info = i
                        }
                    }
                    this.jumpToFile(info)
                    return true
                }
            }
        }
        if (!type || type === 'file')
        {
            files = window.indexer.files
            for (file in files)
            {
                info = files[file]
                if (slash.name(file).toLowerCase() === find && file !== this.currentFile)
                {
                    this.jumpToFile({path:file,line:6})
                }
            }
        }
        window.commandline.commands.search.start('search')
        window.commandline.commands.search.execute(word)
        window.split.do('show terminal')
        return true
    }

    FileEditor.prototype["jumpToCounterpart"] = async function ()
    {
        var counter, counterparts, cp, currext, ext, _355_41_, _360_41_

        cp = this.cursorPos()
        currext = slash.ext(this.currentFile)
        counterparts = {mm:['h'],cpp:['hpp','h'],cc:['hpp','h'],h:['cpp','c','mm'],hpp:['cpp','c'],coffee:['js','mjs'],kode:['js','mjs'],js:['coffee','kode'],mjs:['coffee','kode'],pug:['html'],html:['pug'],css:['styl'],styl:['css']}
        var list = ((_355_41_=counterparts[currext]) != null ? _355_41_ : [])
        for (var _355_16_ = 0; _355_16_ < list.length; _355_16_++)
        {
            ext = list[_355_16_]
            if (await ffs.fileExists(slash.swapExt(this.currentFile,ext)))
            {
                post.emit('loadFile',slash.swapExt(this.currentFile,ext))
                return true
            }
        }
        var list1 = ((_360_41_=counterparts[currext]) != null ? _360_41_ : [])
        for (var _360_16_ = 0; _360_16_ < list1.length; _360_16_++)
        {
            ext = list1[_360_16_]
            counter = slash.swapExt(this.currentFile,ext)
            counter = this.swapLastDir(counter,currext,ext)
            if (await ffs.fileExists(counter))
            {
                post.emit('loadFile',counter)
                return true
            }
        }
        console.log('cant find counterpart',this.currentFile)
        return true
    }

    FileEditor.prototype["swapLastDir"] = function (path, from, to)
    {
        var lastIndex

        lastIndex = path.lastIndexOf(`/${from}/`)
        if (lastIndex >= 0)
        {
            path = path.slice(0, typeof lastIndex === 'number' ? lastIndex+1 : Infinity) + to + path.slice(lastIndex + (`/${from}`).length)
        }
        return path
    }

    FileEditor.prototype["centerText"] = function (center, animate = 300)
    {
        var br, l, layers, newOffset, offsetX, resetTrans, t, transi, visCols

        this.size.centerText = center
        this.updateLayers()
        this.size.offsetX = Math.floor(this.size.charWidth / 2 + this.size.numbersWidth)
        if (center)
        {
            br = this.view.getBoundingClientRect()
            visCols = parseInt(br.width / this.size.charWidth)
            newOffset = parseInt(this.size.charWidth * (visCols - 100) / 2)
            this.size.offsetX = Math.max(this.size.offsetX,newOffset)
            this.size.centerText = true
        }
        else
        {
            this.size.centerText = false
        }
        this.updateLinePositions(animate)
        if (animate)
        {
            layers = ['.selections','.highlights','.cursors']
            transi = ['.selection','.highlight','.cursor'].concat(layers)
            resetTrans = (function ()
            {
                var l, t

                var list = _k_.list(layers)
                for (var _405_81_ = 0; _405_81_ < list.length; _405_81_++)
                {
                    l = list[_405_81_]
                    setStyle('.editor .layers ' + l,'transform',"translateX(0)")
                }
                var list1 = _k_.list(transi)
                for (var _406_76_ = 0; _406_76_ < list1.length; _406_76_++)
                {
                    t = list1[_406_76_]
                    setStyle('.editor .layers ' + t,'transition',"initial")
                }
                return this.updateLayers()
            }).bind(this)
            if (center)
            {
                offsetX = this.size.offsetX - this.size.numbersWidth - this.size.charWidth / 2
            }
            else
            {
                offsetX = Math.floor(this.size.charWidth / 2 + this.size.numbersWidth)
                offsetX -= this.size.numbersWidth + this.size.charWidth / 2
                offsetX *= -1
            }
            var list = _k_.list(layers)
            for (var _416_88_ = 0; _416_88_ < list.length; _416_88_++)
            {
                l = list[_416_88_]
                setStyle('.editor .layers ' + l,'transform',`translateX(${offsetX}px)`)
            }
            var list1 = _k_.list(transi)
            for (var _417_85_ = 0; _417_85_ < list1.length; _417_85_++)
            {
                t = list1[_417_85_]
                setStyle('.editor .layers ' + t,'transition',`all ${animate / 1000}s`)
            }
            return setTimeout(resetTrans,animate)
        }
        else
        {
            return this.updateLayers()
        }
    }

    FileEditor.prototype["onContextMenu"] = function (event)
    {
        return stopEvent(event,this.showContextMenu(kpos(event)))
    }

    FileEditor.prototype["showContextMenu"] = function (absPos)
    {
        var f, fileMenu, fileSpan, getMenu, opt, recent, RecentMenu, template

        if (!(absPos != null))
        {
            absPos = kpos(this.view.getBoundingClientRect().left,this.view.getBoundingClientRect().top)
        }
        opt = {items:[{text:'Browse',combo:'command+.',cb:function ()
        {
            return window.commandline.startCommand('browse')
        }},{text:'Back',combo:'command+1',cb:function ()
        {
            return post.emit('menuAction','Navigate Backward')
        }},{text:''},{text:'Maximize',combo:'command+,',cb:function ()
        {
            return window.split.maximizeEditor()
        }},{text:''},{text:'DevTools',combo:'alt+cmdctrl+i'},{text:''}]}
        template = _k_.clone(kakao.menuTemplate)
        opt.items = opt.items.concat(template)
        RecentMenu = []
        fileSpan = function (f)
        {
            var span

            if ((f != null))
            {
                span = Syntax.spanForTextAndSyntax(slash.tilde(slash.dir(f)),'browser')
                span += Syntax.spanForTextAndSyntax('/' + slash.name(f),'browser')
            }
            return span
        }
        recent = window.stash.get('recentFiles',[])
        recent = (recent != null ? recent : [])
        var list = _k_.list(recent)
        for (var _471_14_ = 0; _471_14_ < list.length; _471_14_++)
        {
            f = list[_471_14_]
            RecentMenu.unshift({html:fileSpan(f),arg:f,cb:function (arg)
            {
                return post.emit('loadFile',arg)
            }})
        }
        getMenu = function (template, name)
        {
            var item

            var list1 = _k_.list(template)
            for (var _479_21_ = 0; _479_21_ < list1.length; _479_21_++)
            {
                item = list1[_479_21_]
                if (item.text === name)
                {
                    return item
                }
            }
        }
        if (RecentMenu.length)
        {
            if (fileMenu = getMenu(opt.items,'File'))
            {
                fileMenu.menu = [{text:'Recent',menu:RecentMenu},{text:''}].concat(fileMenu.menu)
            }
        }
        opt.x = absPos.x
        opt.y = absPos.y
        return popup.menu(opt)
    }

    FileEditor.prototype["clickAtPos"] = function (p, event)
    {
        if (event.metaKey)
        {
            if (kpos(event).x <= this.size.numbersWidth)
            {
                this.singleCursorAtPos(p)
                return
            }
        }
        return FileEditor.__super__.clickAtPos.call(this,p,event)
    }

    FileEditor.prototype["handleModKeyComboCharEvent"] = function (mod, key, combo, char, event)
    {
        var split

        if ('unhandled' !== FileEditor.__super__.handleModKeyComboCharEvent.call(this,mod,key,combo,char,event))
        {
            return
        }
        switch (combo)
        {
            case 'alt+ctrl+enter':
                return window.commandline.commands.coffee.executeText(this.textOfSelectionForClipboard())

            case 'alt+ctrl+shift+enter':
                return window.commandline.commands.coffee.executeTextInMain(this.textOfSelectionForClipboardt())

            case 'command+alt+up':
            case 'alt+o':
                return this.jumpToCounterpart()

            case 'esc':
                split = window.split
                if (split.terminalVisible())
                {
                    split.hideTerminal()
                }
                else if (split.commandlineVisible())
                {
                    split.hideCommandline()
                }
                return

        }

        return 'unhandled'
    }

    return FileEditor
})()

export default FileEditor;