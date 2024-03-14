var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var FileEditor

import dom from "../../kxk/dom.js"
let stopEvent = dom.stopEvent
let setStyle = dom.setStyle

import ffs from "../../kxk/ffs.js"

import kpos from "../../kxk/kpos.js"

import post from "../../kxk/post.js"

import popup from "../../kxk/popup.js"

import slash from "../../kxk/slash.js"

import Syntax from "./syntax.js"

import TextEditor from "./texteditor.js"


FileEditor = (function ()
{
    _k_.extend(FileEditor, TextEditor)
    function FileEditor (viewElem)
    {
        this["showContextMenu"] = this["showContextMenu"].bind(this)
        this["onContextMenu"] = this["onContextMenu"].bind(this)
        this["jumpTo"] = this["jumpTo"].bind(this)
        this["jumpToFile"] = this["jumpToFile"].bind(this)
        this["onCommandline"] = this["onCommandline"].bind(this)
        this["actionsInitialized"] = this["actionsInitialized"].bind(this)
        FileEditor.__super__.constructor.call(this,viewElem,{features:['Diffbar','Scrollbar','Numbers','Minimap','Meta','Autocomplete','Brackets','Strings','CursorLine'],fontSize:19})
        this.currentFile = null
        this.view.addEventListener('contextmenu',this.onContextMenu)
        post.on('commandline',this.onCommandline)
        post.on('jumpTo',this.jumpTo)
        post.on('jumpToFile',this.jumpToFile)
        this.setText('')
    }

    FileEditor.prototype["actionsInitialized"] = function ()
    {
        FileEditor.__super__.actionsInitialized.call(this)
    
        this.initPigments()
        return this.initInvisibles()
    }

    FileEditor.prototype["changed"] = function (changeInfo)
    {
        FileEditor.__super__.changed.call(this,changeInfo)
    
        var dirty

        if (changeInfo.changes.length)
        {
            dirty = this.do.hasChanges()
            if (this.dirty !== dirty)
            {
                this.dirty = dirty
                return post.emit('dirty',this.dirty)
            }
        }
    }

    FileEditor.prototype["clear"] = function ()
    {
        var _80_16_, _81_13_

        this.dirty = false
        this.setSalterMode(false)
        ;(this.diffbar != null ? this.diffbar.clear() : undefined)
        ;(this.meta != null ? this.meta.clear() : undefined)
        this.setLines([''])
        return this.do.reset()
    }

    FileEditor.prototype["setCurrentFile"] = function (file, restoreState)
    {
        var fileExists, _104_35_, _93_33_

        this.clear()
        this.currentFile = file
        this.setupFileType()
        fileExists = (this.currentFile != null)
        if (restoreState)
        {
            this.setText(restoreState.text())
            this.state = restoreState
            this.dirty = true
        }
        else if (fileExists)
        {
            ffs.read(this.currentFile).then(this.setText)
        }
        if (fileExists)
        {
            ;(window.tabs.activeTab() != null ? window.tabs.activeTab().setFile(this.currentFile) : undefined)
        }
        post.emit('file',this.currentFile)
        this.emit('file',this.currentFile)
        return post.emit('dirty',this.dirty)
    }

    FileEditor.prototype["currentDir"] = function ()
    {
        var _114_23_

        if ((this.currentFile != null))
        {
            return slash.dir(this.currentFile)
        }
        else
        {
            return slash.path(kakao.bundle.path)
        }
    }

    FileEditor.prototype["restoreFromTabState"] = function (tabState)
    {
        var _121_61_

        if (!(tabState.file != null))
        {
            return console.error("no tabState.file?")
        }
        return this.setCurrentFile(tabState.file,tabState.state)
    }

    FileEditor.prototype["shebangFileType"] = function ()
    {
        var ext, fileType, _134_27_

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
                d = window.split.commandlineHeight + window.split.handleHeight
                d = Math.min(d,this.scroll.scrollMax - this.scroll.scroll)
                if (e === 'hidden')
                {
                    d *= -1
                }
                return this.scroll.by(d)

        }

    }

    FileEditor.prototype["saveScrollCursorsAndSelections"] = function (opt)
    {
        var filePositions, s

        if (!this.currentFile)
        {
            return
        }
        s = {}
        s.main = this.state.main()
        if (this.numCursors() > 1 || this.cursorPos()[0] || this.cursorPos()[1])
        {
            s.cursors = this.state.cursors()
        }
        if (this.numSelections() && this.numSelections() < 10)
        {
            s.selections = this.state.selections()
        }
        if (this.numHighlights() && this.numHighlights() < 10)
        {
            s.highlights = this.state.highlights()
        }
        if (this.scroll.scroll)
        {
            s.scroll = this.scroll.scroll
        }
        filePositions = window.stash.get('filePositions',Object.create(null))
        if (!filePositions || typeof(filePositions) !== 'object')
        {
            filePositions = Object.create(null)
        }
        filePositions[this.currentFile] = s
        return window.stash.set('filePositions',filePositions)
    }

    FileEditor.prototype["restoreScrollCursorsAndSelections"] = function ()
    {
        var cursors, filePositions, s, _200_32_, _204_40_, _205_40_, _206_34_, _221_16_

        if (!this.currentFile)
        {
            return
        }
        filePositions = window.stash.get('filePositions',{})
        if ((filePositions[this.currentFile] != null))
        {
            s = filePositions[this.currentFile]
            cursors = ((_200_32_=s.cursors) != null ? _200_32_ : [[0,0]])
            cursors = cursors.map((function (c)
            {
                return [c[0],_k_.clamp(0,this.numLines() - 1,c[1])]
            }).bind(this))
            this.setCursors(cursors)
            this.setSelections(((_204_40_=s.selections) != null ? _204_40_ : []))
            this.setHighlights(((_205_40_=s.highlights) != null ? _205_40_ : []))
            this.setMain(((_206_34_=s.main) != null ? _206_34_ : 0))
            this.setState(this.state)
            if (s.scroll)
            {
                this.scroll.to(s.scroll)
            }
            this.scroll.cursorIntoView()
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
            this.scroll.cursorIntoView()
        }
        this.updateLayers()
        ;(this.numbers != null ? this.numbers.updateColors() : undefined)
        this.minimap.onEditorScroll()
        this.emit('cursor')
        return this.emit('selection')
    }

    FileEditor.prototype["jumpToFile"] = function (opt)
    {
        var file, fpos

        console.log('jumpToFile',opt)
        if (opt.newTab)
        {
            file = opt.file
            if (opt.line)
            {
                file += ':' + opt.line
            }
            if (opt.col)
            {
                file += ':' + opt.col
            }
            return post.emit('newTabWithFile',file)
        }
        else if (window.lastFocus === 'editor')
        {
            var _245_25_ = slash.splitFilePos(opt.file); file = _245_25_[0]; fpos = _245_25_[1]

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
        var classes, clss, file, files, find, func, funcs, i, info, infos, type, _267_19_

        console.log('FileEditor jumpTo',word,opt)
        if (typeof(word) === 'object' && !(opt != null))
        {
            opt = word
            word = opt.word
        }
        opt = (opt != null ? opt : {})
        if ((opt.file != null))
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
            classes = {}
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
            funcs = {}
            for (func in funcs)
            {
                infos = funcs[func]
                if (func.toLowerCase() === find)
                {
                    info = infos[0]
                    var list = _k_.list(infos)
                    for (var _292_26_ = 0; _292_26_ < list.length; _292_26_++)
                    {
                        i = list[_292_26_]
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
            files = {}
            for (file in files)
            {
                info = files[file]
                if (slash.name(file).toLowerCase() === find && file !== this.currentFile)
                {
                    this.jumpToFile({file:file,line:6})
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
        var counter, counterparts, cp, currext, ext, _353_41_, _358_41_

        cp = this.cursorPos()
        currext = slash.ext(this.currentFile)
        counterparts = {mm:['h'],cpp:['hpp','h'],cc:['hpp','h'],h:['cpp','c','mm'],hpp:['cpp','c'],coffee:['js','mjs'],kode:['js','mjs'],js:['coffee','kode'],mjs:['coffee','kode'],pug:['html'],html:['pug'],css:['styl'],styl:['css']}
        var list = ((_353_41_=counterparts[currext]) != null ? _353_41_ : [])
        for (var _353_16_ = 0; _353_16_ < list.length; _353_16_++)
        {
            ext = list[_353_16_]
            if (await ffs.fileExists(slash.swapExt(this.currentFile,ext)))
            {
                post.emit('loadFile',slash.swapExt(this.currentFile,ext))
                return true
            }
        }
        var list1 = ((_358_41_=counterparts[currext]) != null ? _358_41_ : [])
        for (var _358_16_ = 0; _358_16_ < list1.length; _358_16_++)
        {
            ext = list1[_358_16_]
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
                for (var _403_81_ = 0; _403_81_ < list.length; _403_81_++)
                {
                    l = list[_403_81_]
                    setStyle('.editor .layers ' + l,'transform',"translateX(0)")
                }
                var list1 = _k_.list(transi)
                for (var _404_76_ = 0; _404_76_ < list1.length; _404_76_++)
                {
                    t = list1[_404_76_]
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
            for (var _414_88_ = 0; _414_88_ < list.length; _414_88_++)
            {
                l = list[_414_88_]
                setStyle('.editor .layers ' + l,'transform',`translateX(${offsetX}px)`)
            }
            var list1 = _k_.list(transi)
            for (var _415_85_ = 0; _415_85_ < list1.length; _415_85_++)
            {
                t = list1[_415_85_]
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
        var fileMenu, fileSpan, getMenu, opt, RecentMenu

        if (!(absPos != null))
        {
            absPos = kpos(this.view.getBoundingClientRect().left,this.view.getBoundingClientRect().top)
        }
        opt = {items:[{text:'Browse',combo:'command+.',accel:'ctrl+.',cb:function ()
        {
            return window.commandline.startCommand('browse')
        }},{text:'Back',combo:'command+1',cb:function ()
        {
            return post.emit('menuAction','Navigate Backward')
        }},{text:''},{text:'Maximize',combo:'command+shift+y',accel:'ctrl+shift+y',cb:function ()
        {
            return window.split.maximizeEditor()
        }},{text:''},{text:'DevTools',combo:'alt+cmdctrl+i'}]}
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
        getMenu = function (template, name)
        {
            var item

            var list = _k_.list(template)
            for (var _476_21_ = 0; _476_21_ < list.length; _476_21_++)
            {
                item = list[_476_21_]
                if (item.text === name)
                {
                    return item
                }
            }
        }
        if (RecentMenu.length)
        {
            RecentMenu.push({text:''})
            RecentMenu.push({text:'Clear List'})
            fileMenu = getMenu(opt.items,'File')
            fileMenu.menu = [{text:'Recent',menu:RecentMenu},{text:''}].concat(fileMenu.menu)
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