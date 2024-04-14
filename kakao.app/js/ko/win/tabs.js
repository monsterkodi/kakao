var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

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
        this.onProjectIndexed = this.onProjectIndexed.bind(this)
        this.reloadFile = this.reloadFile.bind(this)
        this.activeKorePrj = this.activeKorePrj.bind(this)
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
        post.on('editorFocus',this.onEditorFocus)
        post.on('stashLoaded',this.onStashLoaded)
        post.on('projectIndexed',this.onProjectIndexed)
        kore.on('tabs',this.onKoreTabs)
        kore.on('editor|file',this.onEditorFile)
    }

    onKoreTabs (tabs)
    {
        var koreTab

        this.div.innerHTML = ''
        this.tabs = []
        var list = _k_.list(tabs)
        for (var _64_20_ = 0; _64_20_ < list.length; _64_20_++)
        {
            koreTab = list[_64_20_]
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
        for (var _73_16_ = 0; _73_16_ < list.length; _73_16_++)
        {
            tab = list[_73_16_]
            if (slash.samePath(tab.path,path))
            {
                return tab
            }
        }
    }

    onEditorFile (path)
    {
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
            this.setActive(path)
            this.cleanTabs()
            this.tab(path).div.scrollIntoViewIfNeeded()
            return
        }
        this.setActive(path)
        this.update()
        return this
    }

    cleanTabs ()
    {
        var dangling, k, prjPath, prjTabs, remain, sorted, tab, tabs, v

        tabs = this.koreTabs()
        sorted = tabs.filter(function (t)
        {
            return t.type === 'prj'
        })
        remain = tabs.filter(function (t)
        {
            return t.type !== 'prj'
        })
        prjTabs = {}
        var list = _k_.list(sorted)
        for (var _129_16_ = 0; _129_16_ < list.length; _129_16_++)
        {
            tab = list[_129_16_]
            prjTabs[tab.path] = [tab]
        }
        dangling = []
        while (tab = remain.shift())
        {
            prjPath = Projects.dir(tab.path)
            if (!_k_.empty(prjTabs[prjPath]))
            {
                prjTabs[prjPath].push(tab)
            }
            else
            {
                dangling.push(tab)
            }
        }
        tabs = []
        for (k in prjTabs)
        {
            v = prjTabs[k]
            tabs = tabs.concat(v)
        }
        if (!_k_.empty(dangling))
        {
            console.log('dangling',dangling)
            tabs = tabs.concat(dangling)
        }
        console.log('cleanTabs',tabs)
        return kore.set('tabs',tabs)
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
            tabs.splice(index,1)
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
            if (tab.type === 'file')
            {
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
        var tab, _197_26_, _197_31_

        var list = _k_.list(this.koreTabs())
        for (var _193_16_ = 0; _193_16_ < list.length; _193_16_++)
        {
            tab = list[_193_16_]
            delete tab.active
            if (slash.samePath(tab.path,path))
            {
                tab.active = true
                ;((_197_26_=this.tab(path)) != null ? (_197_31_=_197_26_.div) != null ? _197_31_.scrollIntoViewIfNeeded() : undefined : undefined)
            }
        }
    }

    activeKoreTab ()
    {
        var tab

        var list = _k_.list(this.koreTabs())
        for (var _202_16_ = 0; _202_16_ < list.length; _202_16_++)
        {
            tab = list[_202_16_]
            if (tab.active)
            {
                return tab
            }
        }
    }

    activeKorePrj ()
    {
        var fileTab, tab

        if (fileTab = this.activeKoreTab())
        {
            var list = _k_.list(this.koreTabs())
            for (var _208_20_ = 0; _208_20_ < list.length; _208_20_++)
            {
                tab = list[_208_20_]
                if (tab.type === 'prj' && fileTab.path.startsWith(tab.path))
                {
                    return tab
                }
            }
        }
    }

    reloadFile (file)
    {
        var tab

        console.log('Tabs.reloadFile',file)
        if (tab = this.koreTabForPath(file))
        {
            tab.dirty = false
            return this.update()
        }
    }

    onProjectIndexed (path)
    {
        this.koreTabs().push({type:'prj',path:path})
        return this.cleanTabs()
    }

    onClick (event)
    {
        var tab, _254_54_

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
        else
        {
            console.error('no tab?',event.target,(event.target != null ? event.target.parentNode : undefined),this.tabs)
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
        return kore.set('tabs',[this.activeKorePrj(),this.activeKoreTab()])
    }

    getTmpTab ()
    {
        var t

        var list = _k_.list(this.tabs)
        for (var _325_14_ = 0; _325_14_ < list.length; _325_14_++)
        {
            t = list[_325_14_]
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

        var _346_26_ = slash.splitFileLine(file); file = _346_26_[0]; line = _346_26_[1]; col = _346_26_[2]

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
        var index, tab, tabs

        if (tab = this.activeKoreTab())
        {
            tabs = this.koreTabs()
            index = tabs.indexOf(tab)
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
            if ((0 <= index && index < tabs.length))
            {
                return this.activate(tabs[index].path)
            }
        }
    }

    move (key)
    {
        var tab

        if (tab = this.activeKoreTab())
        {
            switch (key)
            {
                case 'left':
                    return this.shiftTab(tab,-1)

                case 'right':
                    return this.shiftTab(tab,1)

            }

        }
    }

    shiftTab (tab, delta)
    {
        var index, tabs

        tabs = this.koreTabs()
        index = tabs.indexOf(tab)
        tabs.splice(index,1)
        tabs.splice(index + delta,0,tab)
        return this.cleanTabs()
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
        this.dragIndex = this.dragTab.index()
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
        var dragIndex, hovrIndex, swap, tab

        swap = (function (ta, tb)
        {
            if ((ta != null) && (tb != null))
            {
                if (ta.index() > tb.index())
                {
                    var _426_25_ = [tb,ta]; ta = _426_25_[0]; tb = _426_25_[1]

                }
                this.tabs[ta.index()] = tb
                this.tabs[tb.index() + 1] = ta
                return this.div.insertBefore(tb.div,ta.div)
            }
        }).bind(this)
        this.dragDiv.style.transform = `translateX(${d.deltaSum.x}px)`
        if (tab = this.tabAtX(d.pos.x))
        {
            dragIndex = this.dragTab.index()
            hovrIndex = tab.index()
            if (dragIndex > hovrIndex)
            {
                return swap(this.tabs[hovrIndex],this.tabs[dragIndex])
            }
            else if (dragIndex < hovrIndex)
            {
                return swap(this.tabs[dragIndex],this.tabs[hovrIndex])
            }
        }
    }

    onDragStop (d, e)
    {
        var index

        index = this.dragTab.index()
        this.dragTab.div.style.opacity = ''
        this.dragDiv.remove()
        if (index !== this.dragIndex)
        {
            console.log('shift',index - this.dragIndex)
            return this.shiftTab(this.koreTabs()[this.dragIndex],index - this.dragIndex)
        }
    }

    stash ()
    {
        var infos

        infos = this.tabs.map(function (t)
        {
            var _457_44_

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
        var _464_36_

        return (this.tab(file) != null ? this.tab(file).revert() : undefined)
    }

    toggleExtension ()
    {
        var tab

        prefs.toggle('tabs|extension')
        var list = _k_.list(this.tabs)
        for (var _476_16_ = 0; _476_16_ < list.length; _476_16_++)
        {
            tab = list[_476_16_]
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
        for (var _493_16_ = 0; _493_16_ < list.length; _493_16_++)
        {
            tab = list[_493_16_]
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
        for (var _517_16_ = 0; _517_16_ < list1.length; _517_16_++)
        {
            tab = list1[_517_16_]
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
        var tab

        if (tab = this.activeKoreTab())
        {
            if (dirty)
            {
                tab.dirty = true
            }
            else
            {
                delete tab.dirty
            }
            return this.update()
        }
    }

    onContextMenu (event)
    {
        var tab

        if (tab = this.tab(event.target))
        {
            this.activate(tab.path)
        }
        stopEvent(event)
        return this.showContextMenu(kpos(event))
    }

    showContextMenu (absPos)
    {
        var opt

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