var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import dom from "../../kxk/dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent

import post from "../../kxk/post.js"

import elem from "../../kxk/elem.js"

import drag from "../../kxk/drag.js"

import kpos from "../../kxk/kpos.js"

import slash from "../../kxk/slash.js"

import popup from "../../kxk/popup.js"

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
        this.onSaved = this.onSaved.bind(this)
        this.onFileSaved = this.onFileSaved.bind(this)
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
        post.on('fileSaved',this.onFileSaved)
        post.on('saved',this.onSaved)
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

        if (prjPath = Projects.dir(file))
        {
            prjChildTabs = []
            var list = _k_.list(this.tabs)
            for (var _66_20_ = 0; _66_20_ < list.length; _66_20_++)
            {
                tab = list[_66_20_]
                if (Projects.dir(tab.file) === prjPath && tab.file !== prjPath)
                {
                    prjChildTabs.push(tab)
                }
            }
        }
        return prjChildTabs
    }

    getPrjTab (file)
    {
        var prjPath, tab

        if (prjPath = Projects.dir(file))
        {
            var list = _k_.list(this.tabs)
            for (var _74_20_ = 0; _74_20_ < list.length; _74_20_++)
            {
                tab = list[_74_20_]
                if (tab.file === prjPath)
                {
                    return tab
                }
            }
        }
        return null
    }

    addPrjTab (file)
    {
        var prjPath

        if (prjPath = Projects.dir(file))
        {
            if (!this.getPrjTab(file))
            {
                this.tabs.push(new Tab(this,prjPath,true))
                return this.sortTabs()
            }
        }
    }

    onSendTabs (winID)
    {
        var t, tab

        t = ''
        var list = _k_.list(this.tabs)
        for (var _89_16_ = 0; _89_16_ < list.length; _89_16_++)
        {
            tab = list[_89_16_]
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

    onFileSaved (file, winID)
    {
        var tab

        if (winID === window.winID)
        {
            return console.error(`fileSaved from this window? ${file} ${winID}`)
        }
        tab = this.tab(file)
        if ((tab != null) && tab !== this.activeTab())
        {
            return tab.revert()
        }
    }

    onSaved (file)
    {
        var _110_18_

        return (this.tab(file) != null ? this.tab(file).setDirty(false) : undefined)
    }

    onClick (event)
    {
        var tab, tabElem, _127_52_

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
            console.log('no tab?',event.target,(event.target != null ? event.target.parentNode : undefined),this.tabs)
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

    fileTabs ()
    {
        return this.tabs.filter(function (t)
        {
            return !t.isPrj
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
        if (_k_.empty(this.tabs))
        {
            console.log('closeTab lastTab closed: create new empty tab~')
            this.onNewEmptyTab()
        }
        return this
    }

    onCloseTabOrWindow (tab)
    {
        if (this.numTabs() <= 1)
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
            return !t.pinned && t !== this.activeTab()
        }).bind(this))
        var list = _k_.list(tabsToClose)
        for (var _213_14_ = 0; _213_14_ < list.length; _213_14_++)
        {
            t = list[_213_14_]
            this.closeTab(t)
        }
        return this.update()
    }

    addTab (file)
    {
        var newTab

        newTab = new Tab(this,file)
        this.tabs.push(newTab)
        this.addPrjTab(file)
        return newTab
    }

    getTmpTab ()
    {
        var t

        var list = _k_.list(this.tabs)
        for (var _241_14_ = 0; _241_14_ < list.length; _241_14_++)
        {
            t = list[_241_14_]
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
            tab.tmpTab = true
        }
        tab.update()
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

        var _264_26_ = slash.splitFileLine(file); file = _264_26_[0]; line = _264_26_[1]; col = _264_26_[2]

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
        var index

        index = this.activeTab().index()
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
        index = (this.numTabs() + index) % this.numTabs()
        return this.tabs[index].activate()
    }

    swap (ta, tb)
    {
        if (!(ta != null) || !(tb != null))
        {
            return
        }
        if (ta.index() > tb.index())
        {
            var _296_17_ = [tb,ta]; ta = _296_17_[0]; tb = _296_17_[1]

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
        var files, pinned, t, tabs, _369_41_

        tabs = this.fileTabs()
        files = (function () { var r_362_32_ = []; var list = _k_.list(tabs); for (var _362_32_ = 0; _362_32_ < list.length; _362_32_++)  { t = list[_362_32_];r_362_32_.push(t.file)  } return r_362_32_ }).bind(this)()
        pinned = (function () { var r_363_34_ = []; var list1 = _k_.list(tabs); for (var _363_34_ = 0; _363_34_ < list1.length; _363_34_++)  { t = list1[_363_34_];r_363_34_.push(t.pinned)  } return r_363_34_ }).bind(this)()
        files = files.filter(function (file)
        {
            return !(file != null ? file.startsWith('untitled') : undefined)
        })
        return window.stash.set('tabs',{files:files,pinned:pinned,active:Math.min((this.activeTab() != null ? this.activeTab().index() : undefined),files.length - 1)})
    }

    onStashLoaded ()
    {
        var active, files, pi, pinned

        active = window.stash.get('tabs|active',0)
        files = window.stash.get('tabs|files')
        pinned = window.stash.get('tabs|pinned')
        pinned = (pinned != null ? pinned : [])
        if (_k_.empty(files))
        {
            return
        }
        this.tabs = []
        while (files.length)
        {
            this.addTab(files.shift())
        }
        ;(this.tabs[active] != null ? this.tabs[active].activate() : undefined)
        for (var _387_18_ = pi = 0, _387_22_ = pinned.length; (_387_18_ <= _387_22_ ? pi < pinned.length : pi > pinned.length); (_387_18_ <= _387_22_ ? ++pi : --pi))
        {
            if (pinned[pi])
            {
                this.tabs[pi].togglePinned()
            }
        }
        return this.update()
    }

    revertFile (file)
    {
        var _393_36_

        return (this.tab(file) != null ? this.tab(file).revert() : undefined)
    }

    toggleExtension ()
    {
        var tab

        prefs.toggle('tabs|extension')
        var list = _k_.list(this.tabs)
        for (var _405_16_ = 0; _405_16_ < list.length; _405_16_++)
        {
            tab = list[_405_16_]
            tab.update()
        }
    }

    update ()
    {
        console.log('Tabs.update')
        this.sortTabs()
        return this.stash()
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
        for (var _422_16_ = 0; _422_16_ < list.length; _422_16_++)
        {
            tab = list[_422_16_]
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
            this.tabs = this.tabs.concat(v)
        }
        this.tabs = this.tabs.concat(dangling)
        var list1 = _k_.list(this.tabs)
        for (var _439_16_ = 0; _439_16_ < list1.length; _439_16_++)
        {
            tab = list1[_439_16_]
            this.div.removeChild(tab.div)
            this.div.appendChild(tab.div)
        }
    }

    onDirty (dirty)
    {
        var _445_20_

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