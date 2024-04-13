var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kxk from "../../kxk.js"
let post = kxk.post
let elem = kxk.elem
let kpos = kxk.kpos
let slash = kxk.slash
let drag = kxk.drag
let popup = kxk.popup
let stopEvent = kxk.stopEvent
let $ = kxk.$

import Projects from "../tools/Projects.js"

import Tab from "./Tab.js"

class Tabs
{
    constructor (titlebar)
    {
        this.showContextMenu = this.showContextMenu.bind(this)
        this.onContextMenu = this.onContextMenu.bind(this)
        this.onDirty = this.onDirty.bind(this)
        this.revertFile = this.revertFile.bind(this)
        this.onStashLoaded = this.onStashLoaded.bind(this)
        this.stash = this.stash.bind(this)
        this.onDragStop = this.onDragStop.bind(this)
        this.onDragMove = this.onDragMove.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onNewTabWithFile = this.onNewTabWithFile.bind(this)
        this.onNewEmptyTab = this.onNewEmptyTab.bind(this)
        this.onCloseOtherTabs = this.onCloseOtherTabs.bind(this)
        this.onCloseTab = this.onCloseTab.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onFileLineChanges = this.onFileLineChanges.bind(this)
        this.onSendTabs = this.onSendTabs.bind(this)
        this.addPrjTab = this.addPrjTab.bind(this)
        this.getPrjTab = this.getPrjTab.bind(this)
        this.onProjectIndexed = this.onProjectIndexed.bind(this)
        this.reloadFile = this.reloadFile.bind(this)
        this.activeKoreTab = this.activeKoreTab.bind(this)
        this.setActive = this.setActive.bind(this)
        this.activate = this.activate.bind(this)
        this.delTab = this.delTab.bind(this)
        this.onEditorFocus = this.onEditorFocus.bind(this)
        this.onEditorFile = this.onEditorFile.bind(this)
        this.onKoreTabs = this.onKoreTabs.bind(this)
        this.emptyid = 0
        this.tabs = []
        this.div = $('title')
        this.div.classList.add('tabs')
        this.div.addEventListener('click',this.onClick)
        this.div.addEventListener('contextmenu',this.onContextMenu)
        this.drag = new drag({target:this.div,onStart:this.onDragStart,onMove:this.onDragMove,onStop:this.onDragStop})
        post.on('newTabWithFile',this.onNewTabWithFile)
        post.on('newEmptyTab',this.onNewEmptyTab)
        post.on('fileRemoved',this.delTab)
        post.on('fileChanged',this.reloadFile)
        post.on('closeTab',this.onCloseTab)
        post.on('closeOtherTabs',this.onCloseOtherTabs)
        post.on('stash',this.stash)
        post.on('dirty',this.onDirty)
        post.on('revertFile',this.revertFile)
        post.on('sendTabs',this.onSendTabs)
        post.on('fileLineChanges',this.onFileLineChanges)
        post.on('editorFocus',this.onEditorFocus)
        post.on('stashLoaded',this.onStashLoaded)
        kore.on('tabs',this.onKoreTabs)
        kore.on('editor|file',this.onEditorFile)
    }

    onKoreTabs (tabs)
    {
        var koreTab

        console.log('onKoreTabs',tabs)
        this.div.innerHTML = ''
        this.tabs = []
        var list = _k_.list(tabs)
        for (var _68_20_ = 0; _68_20_ < list.length; _68_20_++)
        {
            koreTab = list[_68_20_]
            this.tabs.push(new Tab(this,koreTab))
        }
    }

    koreTabs ()
    {
        return kore.get('tabs')
    }

    update ()
    {
        return kore.set('tabs',this.koreTabs())
    }

    koreTabForPath (path)
    {
        var tab

        var list = _k_.list(this.koreTabs())
        for (var _80_16_ = 0; _80_16_ < list.length; _80_16_++)
        {
            tab = list[_80_16_]
            if (slash.samePath(tab.path,path))
            {
                return tab
            }
        }
    }

    onEditorFile (path)
    {
        console.log('Tabs.onEditorFile',path)
        return this.addTab(path)
    }

    onEditorFocus (editor)
    {
        var tab

        if (editor.name === 'editor')
        {
            if (tab = this.koreTabForPath(window.textEditor.currentFile))
            {
                if (tab.tmp)
                {
                    delete tab.tmp
                }
                console.log('editorFocus',this.koreTabs())
                this.setActive(tab.path)
                return this.update()
            }
        }
    }

    addTab (path)
    {
        if (!this.koreTabForPath(path))
        {
            this.koreTabs().push({type:'file',path:path})
        }
        this.setActive(path)
        this.update()
        return this
    }

    delTab (path)
    {
        var index, tab, tabs

        if (tab = this.koreTabForPath(path))
        {
            tabs = this.koreTabs()
            index = tabs.indexOf(tab)
            if (tab.active)
            {
                if (index + 1 < tabs.length)
                {
                    tabs[index + 1].active = true
                }
                else if (index - 1 >= 0)
                {
                    tabs[index - 1].active = true
                }
            }
            console.log('Tabs.delTab',index,tabs)
            tabs.splice(index,1)
            console.log('Tabs.delTab',tabs)
            return kore.set('tabs',tabs)
        }
    }

    activate (path)
    {
        var tab

        console.log('Tabs.activate',path)
        if (tab = this.koreTabForPath(path))
        {
            this.setActive(path)
            console.log('Tabs.activate',tab)
            if (tab.type === 'file')
            {
                console.log('Tabs.activate jumpToFile',path)
                post.emit('jumpToFile',path)
            }
            else
            {
                tab.collapsed = !tab.collapsed
            }
            return this.update()
        }
    }

    setActive (path)
    {
        var tab

        var list = _k_.list(this.koreTabs())
        for (var _192_16_ = 0; _192_16_ < list.length; _192_16_++)
        {
            tab = list[_192_16_]
            tab.active = slash.samePath(tab.path,path)
        }
    }

    activeKoreTab ()
    {
        var tab

        var list = _k_.list(this.koreTabs())
        for (var _197_16_ = 0; _197_16_ < list.length; _197_16_++)
        {
            tab = list[_197_16_]
            if (tab.active)
            {
                return tab
            }
        }
    }

    reloadFile (file)
    {
        console.log('Tabs.reloadFile',file)
    }

    onProjectIndexed (prjPath)
    {
        return this.addPrjTab(prjPath)
    }

    getPrjFiles (file)
    {
        return this.getPrjTabs(file).map(function (t)
        {
            return t.path
        })
    }

    getPrjTabs (file)
    {
        var prjChildTabs, prjPath, tab

        prjChildTabs = []
        if (prjPath = Projects.dir(file))
        {
            var list = _k_.list(this.tabs)
            for (var _250_20_ = 0; _250_20_ < list.length; _250_20_++)
            {
                tab = list[_250_20_]
                if (Projects.dir(tab.path) === prjPath && tab.path !== prjPath)
                {
                    prjChildTabs.push(tab)
                }
            }
        }
        return prjChildTabs
    }

    getPrjTab (prjPath)
    {
        var tab

        var list = _k_.list(this.tabs)
        for (var _257_16_ = 0; _257_16_ < list.length; _257_16_++)
        {
            tab = list[_257_16_]
            if (tab.isPrj && tab.path === prjPath)
            {
                return tab
            }
        }
        return null
    }

    addPrjTab (prjPath)
    {
        console.log('addPrjTab',prjPath)
    }

    onSendTabs (winID)
    {
        var t, tab

        t = ''
        var list = _k_.list(this.tabs)
        for (var _277_16_ = 0; _277_16_ < list.length; _277_16_++)
        {
            tab = list[_277_16_]
            t += tab.div.innerHTML
        }
        return post.toWins('winTabs',window.winID,t)
    }

    onFileLineChanges (file, lineChanges)
    {}

    onClick (event)
    {
        var tab

        console.log('Tabs.onClick',event.target)
        if (tab = this.tab(event.target))
        {
            console.log('Tabs.onClick path',tab.path)
            if (event.target.classList.contains('dot'))
            {
                console.log('deltab',tab.path)
                this.delTab(tab.path)
            }
            else
            {
                console.log('activate tab!',tab)
                this.activate(tab.path)
            }
        }
        return true
    }

    tab (id)
    {
        var t, tabDiv

        if (_k_.isNum(id))
        {
            return this.tabs[id]
        }
        if (elem.isElement(id))
        {
            tabDiv = elem.upElem(id,{class:'tab'})
            console.log('tabDiv',tabDiv)
            t = this.tabs.find(function (t)
            {
                return t.div === tabDiv
            })
            console.log('t',t)
            if (!t)
            {
                console.log(this.tabs)
                console.log(this.tabs.map(function (t)
                {
                    return t.div
                }))
            }
            return t
        }
        if (_k_.isStr(id))
        {
            return this.tabs.find(function (t)
            {
                return t.path === id
            })
        }
    }

    activeTab ()
    {
        return this.tabs.find(function (t)
        {
            return t.isActive()
        })
    }

    numTabs ()
    {
        return this.tabs.length
    }

    numFileTabs ()
    {
        return this.fileTabs().length
    }

    numPrjTabs ()
    {
        return this.prjTabs().length
    }

    fileTabs ()
    {
        return this.tabs.filter(function (t)
        {
            return !t.isPrj
        })
    }

    prjTabs ()
    {
        return this.tabs.filter(function (t)
        {
            return t.isPrj
        })
    }

    tabAtX (x)
    {
        return this.tabs.find(function (t)
        {
            var br

            br = t.div.getBoundingClientRect()
            return (br.left <= x && x <= br.left + br.width)
        })
    }

    onCloseTab ()
    {
        var tab

        console.log('closeTab',this.numFileTabs())
        if (this.numFileTabs() <= 1)
        {
            return post.emit('menuAction','close')
        }
        else
        {
            if (this.koreTabForPath(editor.currentFile))
            {
                return this.delTab(editor.currentFile)
            }
            else if (tab = this.activeKoreTab())
            {
                return this.delTab(tab.path)
            }
        }
    }

    onCloseOtherTabs ()
    {
        return kore.set('tabs',[this.activeKoreTab()])
    }

    getTmpTab ()
    {
        var t

        var list = _k_.list(this.tabs)
        for (var _391_14_ = 0; _391_14_ < list.length; _391_14_++)
        {
            t = list[_391_14_]
            if (t.tmpTab)
            {
                return t
            }
        }
    }

    addTmpTab (file)
    {
        var tab

        if (tab = this.getTmpTab())
        {
            tab.path = file
        }
        else
        {
            tab = this.addTab(file)
            if ((tab != null)) { tab.tmpTab = true }
        }
        ;(tab != null ? tab.update() : undefined)
        return tab
    }

    onNewEmptyTab ()
    {
        console.log('onNewEmptyTab')
        this.emptyid += 1
        return this.addTab(`untitled-${this.emptyid}`)
    }

    onNewTabWithFile (file)
    {
        var col, line, tab

        var _412_26_ = slash.splitFileLine(file); file = _412_26_[0]; line = _412_26_[1]; col = _412_26_[2]

        if (tab = this.tab(file))
        {
            post.emit('jumpToFile',{path:file,line:line,col:col})
        }
        else
        {
            this.addTab(file).activate()
        }
        this.update()
        if (line || col)
        {
            return post.emit('singleCursorAtPos',[col,line - 1])
        }
    }

    navigate (key)
    {
        var activeTab, fileTabs, index

        if (activeTab = this.activeTab())
        {
            fileTabs = this.fileTabs()
            index = fileTabs.indexOf(activeTab)
            index += ((function ()
            {
                switch (key)
                {
                    case 'left':
                        return -1

                    case 'right':
                        return 1

                }

            }).bind(this))()
            index = (fileTabs.length + index) % fileTabs.length
            if (fileTabs[index].isPrj)
            {
                console.log('prjTab',this.tabs[index])
            }
            else
            {
                return fileTabs[index].activate()
            }
        }
    }

    swap (ta, tb)
    {
        if (!(ta != null) || !(tb != null))
        {
            return
        }
        if (ta.index() > tb.index())
        {
            var _452_17_ = [tb,ta]; ta = _452_17_[0]; tb = _452_17_[1]

        }
        this.tabs[ta.index()] = tb
        this.tabs[tb.index() + 1] = ta
        this.div.insertBefore(tb.div,ta.div)
        return this.update()
    }

    move (key)
    {
        var tab

        tab = this.activeTab()
        switch (key)
        {
            case 'left':
                return this.swap(tab,tab.prev())

            case 'right':
                return this.swap(tab,tab.next())

        }

    }

    onDragStart (d, event)
    {
        var br

        if (event.target.classList.contains('tab'))
        {
            return 'skip'
        }
        if (event.target.classList.contains('tabstate'))
        {
            return 'skip'
        }
        this.dragTab = this.tab(event.target)
        if (_k_.empty(this.dragTab))
        {
            return 'skip'
        }
        if (event.button !== 0)
        {
            return 'skip'
        }
        this.dragDiv = this.dragTab.div.cloneNode(true)
        this.dragTab.div.style.opacity = '0'
        br = this.dragTab.div.getBoundingClientRect()
        this.dragDiv.style.position = 'absolute'
        this.dragDiv.style.top = `${br.top}px`
        this.dragDiv.style.left = `${br.left}px`
        this.dragDiv.style.width = `${br.width}px`
        this.dragDiv.style.height = `${br.height}px`
        this.dragDiv.style.flex = 'unset'
        this.dragDiv.style.pointerEvents = 'none'
        return document.body.appendChild(this.dragDiv)
    }

    onDragMove (d, e)
    {
        var tab

        this.dragDiv.style.transform = `translateX(${d.deltaSum.x}px)`
        if (tab = this.tabAtX(d.pos.x))
        {
            if (tab.index() !== this.dragTab.index())
            {
                return this.swap(tab,this.dragTab)
            }
        }
    }

    onDragStop (d, e)
    {
        this.dragTab.div.style.opacity = ''
        return this.dragDiv.remove()
    }

    stash ()
    {
        var infos

        infos = this.tabs.map(function (t)
        {
            var _515_44_

            return (typeof t.stashInfo === "function" ? t.stashInfo() : undefined)
        })
        window.stash.set('tabs',infos)
        return this
    }

    onStashLoaded ()
    {
        return this.update()
    }

    revertFile (file)
    {
        var _522_36_

        return (this.tab(file) != null ? this.tab(file).revert() : undefined)
    }

    toggleExtension ()
    {
        var tab

        prefs.toggle('tabs|extension')
        var list = _k_.list(this.tabs)
        for (var _534_16_ = 0; _534_16_ < list.length; _534_16_++)
        {
            tab = list[_534_16_]
            tab.update()
        }
    }

    sortTabs ()
    {
        var dangling, k, prjPath, prjTabs, remain, sorted, tab, v

        console.log('sortTabs')
        sorted = this.tabs.filter(function (t)
        {
            return t.isPrj
        })
        remain = this.tabs.filter(function (t)
        {
            return !t.isPrj
        })
        prjTabs = {}
        var list = _k_.list(sorted)
        for (var _551_16_ = 0; _551_16_ < list.length; _551_16_++)
        {
            tab = list[_551_16_]
            prjTabs[tab.file] = [tab]
        }
        dangling = []
        while (tab = remain.shift())
        {
            prjPath = Projects.dir(tab.file)
            if (!_k_.empty(prjTabs[prjPath]))
            {
                prjTabs[prjPath].push(tab)
            }
            else
            {
                dangling.push(tab)
            }
        }
        this.tabs = []
        for (k in prjTabs)
        {
            v = prjTabs[k]
            if (v.length > 1)
            {
                this.tabs = this.tabs.concat(v)
            }
            else if (v.length === 1 && !_k_.empty(v[0].hiddenPrjFiles))
            {
                this.tabs.push(v[0])
            }
        }
        this.tabs = this.tabs.concat(dangling)
        this.div.innerHTML = ''
        var list1 = _k_.list(this.tabs)
        for (var _575_16_ = 0; _575_16_ < list1.length; _575_16_++)
        {
            tab = list1[_575_16_]
            if (tab.div)
            {
                this.div.appendChild(tab.div)
            }
        }
        return kore.set('tabs',this.tabs.map(function (t)
        {
            var i

            i = {type:(t.isPrj ? 'prj' : 'file'),path:t.file}
            if (t.tmpTab)
            {
                i.tmp = true
            }
            if (t.pinned)
            {
                i.pinned = true
            }
            if (t.collapsed)
            {
                i.collapsed = true
            }
            return i
        }))
    }

    onDirty (dirty)
    {
        var _592_20_

        return (this.activeTab() != null ? this.activeTab().setDirty(dirty) : undefined)
    }

    onContextMenu (event)
    {
        return stopEvent(event,this.showContextMenu(kpos(event)))
    }

    showContextMenu (absPos)
    {
        var opt, tab

        if (tab = this.tab(event.target))
        {
            tab.activate()
        }
        if (!(absPos != null))
        {
            absPos = kpos(this.view.getBoundingClientRect().left,this.view.getBoundingClientRect().top)
        }
        opt = {items:[{text:'Close Other Tabs',combo:'ctrl+shift+w'},{text:'New Window',combo:'ctrl+shift+n'},{text:'Toggle Tab Extensions',combo:'alt+cmdctrl+t'}]}
        opt.x = absPos.x
        opt.y = absPos.y
        return popup.menu(opt)
    }
}

export default Tabs;