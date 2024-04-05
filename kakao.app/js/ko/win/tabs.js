var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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
        this.onCloseTabOrWindow = this.onCloseTabOrWindow.bind(this)
        this.onEditorFocus = this.onEditorFocus.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onFileLineChanges = this.onFileLineChanges.bind(this)
        this.onSendTabs = this.onSendTabs.bind(this)
        this.addPrjTab = this.addPrjTab.bind(this)
        this.getPrjTab = this.getPrjTab.bind(this)
        this.onProjectIndexed = this.onProjectIndexed.bind(this)
        this.emptyid = 0
        this.tabs = []
        this.div = $('title')
        this.div.classList.add('tabs')
        this.div.addEventListener('click',this.onClick)
        this.div.addEventListener('contextmenu',this.onContextMenu)
        this.drag = new drag({target:this.div,onStart:this.onDragStart,onMove:this.onDragMove,onStop:this.onDragStop})
        post.on('newTabWithFile',this.onNewTabWithFile)
        post.on('newEmptyTab',this.onNewEmptyTab)
        post.on('closeTabOrWindow',this.onCloseTabOrWindow)
        post.on('closeOtherTabs',this.onCloseOtherTabs)
        post.on('stash',this.stash)
        post.on('dirty',this.onDirty)
        post.on('revertFile',this.revertFile)
        post.on('sendTabs',this.onSendTabs)
        post.on('fileLineChanges',this.onFileLineChanges)
        post.on('editorFocus',this.onEditorFocus)
        post.on('stashLoaded',this.onStashLoaded)
        post.on('projectIndexed',this.onProjectIndexed)
    }

    onProjectIndexed (prjPath)
    {
        return this.addPrjTab(prjPath)
    }

    getPrjFiles (file)
    {
        return this.getPrjTabs(file).map(function (t)
        {
            return t.file
        })
    }

    getPrjTabs (file)
    {
        var prjChildTabs, prjPath, tab

        prjChildTabs = []
        if (prjPath = Projects.dir(file))
        {
            var list = _k_.list(this.tabs)
            for (var _60_20_ = 0; _60_20_ < list.length; _60_20_++)
            {
                tab = list[_60_20_]
                if (Projects.dir(tab.file) === prjPath && tab.file !== prjPath)
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
        for (var _67_16_ = 0; _67_16_ < list.length; _67_16_++)
        {
            tab = list[_67_16_]
            if (tab.isPrj && tab.file === prjPath)
            {
                return tab
            }
        }
        return null
    }

    addPrjTab (prjPath)
    {
        var tab

        if (!prjPath)
        {
            return
        }
        if (!this.getPrjTab(prjPath))
        {
            tab = new Tab(this,prjPath,true)
            this.tabs.push(tab)
            this.sortTabs()
            return tab
        }
    }

    onSendTabs (winID)
    {
        var t, tab

        t = ''
        var list = _k_.list(this.tabs)
        for (var _85_16_ = 0; _85_16_ < list.length; _85_16_++)
        {
            tab = list[_85_16_]
            t += tab.div.innerHTML
        }
        return post.toWins('winTabs',window.winID,t)
    }

    onFileLineChanges (file, lineChanges)
    {
        var tab

        tab = this.tab(file)
        if ((tab != null) && tab !== this.activeTab())
        {
            return tab.foreignChanges(lineChanges)
        }
    }

    onClick (event)
    {
        var tab, tabElem

        if (tab = this.tab(event.target))
        {
            if (event.target.classList.contains('dot'))
            {
                this.onCloseTabOrWindow(tab)
            }
            else
            {
                tab.activate()
            }
        }
        else
        {
            if (tabElem = elem.upElem(event.target,{class:'tab'}))
            {
                console.log('remove tab elem',tabElem)
                tabElem.remove()
            }
        }
        return true
    }

    tab (id)
    {
        if (_k_.isNum(id))
        {
            return this.tabs[id]
        }
        if (elem.isElement(id))
        {
            return this.tabs.find(function (t)
            {
                return t.div.contains(id)
            })
        }
        if (_k_.isStr(id))
        {
            return this.tabs.find(function (t)
            {
                return t.file === id
            })
        }
    }

    activeTab (create)
    {
        var tab

        if (!this.tabs.length && create)
        {
            console.log('activeTab createEmpty')
            tab = this.onNewEmptyTab()
            tab.setActive()
            return tab
        }
        tab = this.tabs.find(function (t)
        {
            return t.isActive()
        })
        if (!tab && create)
        {
            tab = _k_.first(this.tabs)
            tab.setActive()
        }
        return tab
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

    onEditorFocus (editor)
    {
        var t

        if (editor.name === 'editor')
        {
            if (t = this.getTmpTab())
            {
                if (t.file === window.textEditor.currentFile)
                {
                    delete t.tmpTab
                    t.update()
                    return this.update()
                }
            }
        }
    }

    closeTab (tab)
    {
        if (_k_.empty(tab))
        {
            return
        }
        this.tabs.splice(this.tabs.indexOf(tab.close()),1)
        return this
    }

    onCloseTabOrWindow (tab)
    {
        if (this.numFileTabs() <= 1)
        {
            return post.emit('menuAction','close')
        }
        else
        {
            tab = (tab != null ? tab : this.activeTab())
            tab.nextOrPrev().activate()
            this.closeTab(tab)
            return this.update()
        }
    }

    onCloseOtherTabs ()
    {
        var t, tabsToClose

        if (!this.activeTab())
        {
            return
        }
        tabsToClose = this.tabs.filter((function (t)
        {
            return !t.pinned && t !== this.activeTab() && t !== this.getPrjTab(Projects.dir(this.activeTab().file))
        }).bind(this))
        var list = _k_.list(tabsToClose)
        for (var _206_14_ = 0; _206_14_ < list.length; _206_14_++)
        {
            t = list[_206_14_]
            this.closeTab(t)
        }
        return this.update()
    }

    addTab (file)
    {
        var maxTabs, newTab, prjPath, prjTab, prjTabs

        maxTabs = prefs.get('maximalNumberOfTabs',7)
        prjPath = Projects.dir(file)
        if (prjTab = this.getPrjTab(prjPath))
        {
            if (!_k_.empty(prjTab.hiddenPrjFiles))
            {
                if (!(_k_.in(file,prjTab.hiddenPrjFiles)))
                {
                    prjTab.hiddenPrjFiles.push(file)
                    while (prjTab.hiddenPrjFiles.length > maxTabs)
                    {
                        prjTab.hiddenPrjFiles.shift()
                    }
                }
                prjTab.update()
                return
            }
        }
        prjTabs = this.getPrjTabs(prjPath)
        if (prjTabs.length > maxTabs - 1)
        {
            var list = _k_.list(prjTabs)
            for (var _232_23_ = 0; _232_23_ < list.length; _232_23_++)
            {
                prjTab = list[_232_23_]
                if (!prjTab.dirty && !prjTab.pinned)
                {
                    this.closeTab(prjTab)
                    break
                }
            }
        }
        newTab = new Tab(this,file)
        this.tabs.push(newTab)
        this.addPrjTab(Projects.dir(file))
        return newTab
    }

    getTmpTab ()
    {
        var t

        var list = _k_.list(this.tabs)
        for (var _246_14_ = 0; _246_14_ < list.length; _246_14_++)
        {
            t = list[_246_14_]
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
            tab.file = file
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
        var tab

        console.log('onNewEmptyTab')
        this.emptyid += 1
        tab = this.addTab(`untitled-${this.emptyid}`).activate()
        this.update()
        return tab
    }

    onNewTabWithFile (file)
    {
        var col, line, tab

        var _269_26_ = slash.splitFileLine(file); file = _269_26_[0]; line = _269_26_[1]; col = _269_26_[2]

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
            var _309_17_ = [tb,ta]; ta = _309_17_[0]; tb = _309_17_[1]

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
            var _372_44_

            return (typeof t.stashInfo === "function" ? t.stashInfo() : undefined)
        })
        window.stash.set('tabs',infos)
        return this
    }

    onStashLoaded ()
    {
        var info, infos, tab

        infos = window.stash.get('tabs')
        if (_k_.empty(infos))
        {
            return
        }
        this.tabs = []
        while (infos.length)
        {
            info = infos.shift()
            if (info.prj)
            {
                post.emit('indexProject',info.prj)
                tab = this.addPrjTab(info.prj)
                if (info.hidden)
                {
                    tab.hiddenPrjFiles = info.hidden
                }
                tab.update()
            }
            else
            {
                tab = this.addTab(info.file)
            }
            if (info.active)
            {
                tab.activate()
            }
            if (info.pinned)
            {
                tab.togglePinned()
            }
        }
        return this.update()
    }

    revertFile (file)
    {
        var _400_36_

        return (this.tab(file) != null ? this.tab(file).revert() : undefined)
    }

    toggleExtension ()
    {
        var tab

        prefs.toggle('tabs|extension')
        var list = _k_.list(this.tabs)
        for (var _412_16_ = 0; _412_16_ < list.length; _412_16_++)
        {
            tab = list[_412_16_]
            tab.update()
        }
    }

    update ()
    {
        this.sortTabs()
        return this.stash()
    }

    sortTabs ()
    {
        var dangling, k, prjPath, prjTabs, remain, sorted, tab, v

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
        for (var _428_16_ = 0; _428_16_ < list.length; _428_16_++)
        {
            tab = list[_428_16_]
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
            else
            {
                console.log('no prjTabs?',k)
            }
        }
        this.tabs = this.tabs.concat(dangling)
        this.div.innerHTML = ''
        var list1 = _k_.list(this.tabs)
        for (var _452_16_ = 0; _452_16_ < list1.length; _452_16_++)
        {
            tab = list1[_452_16_]
            if (tab.div)
            {
                this.div.appendChild(tab.div)
            }
        }
    }

    onDirty (dirty)
    {
        var _460_20_

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