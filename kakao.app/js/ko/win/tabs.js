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
import File from "../tools/File.js"

import Tab from "./Tab.js"

class Tabs
{
    constructor (titlebar)
    {
        this.showContextMenu = this.showContextMenu.bind(this)
        this.onContextMenu = this.onContextMenu.bind(this)
        this.onSaveAll = this.onSaveAll.bind(this)
        this.revertFile = this.revertFile.bind(this)
        this.onStoreState = this.onStoreState.bind(this)
        this.onDirty = this.onDirty.bind(this)
        this.onDragStop = this.onDragStop.bind(this)
        this.onDragMove = this.onDragMove.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onNewTabWithFile = this.onNewTabWithFile.bind(this)
        this.onNewEmptyTab = this.onNewEmptyTab.bind(this)
        this.onCloseOtherTabs = this.onCloseOtherTabs.bind(this)
        this.onCloseTab = this.onCloseTab.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onProjectIndexed = this.onProjectIndexed.bind(this)
        this.onGitStatus = this.onGitStatus.bind(this)
        this.reloadFile = this.reloadFile.bind(this)
        this.setActive = this.setActive.bind(this)
        this.activate = this.activate.bind(this)
        this.delTab = this.delTab.bind(this)
        this.addTab = this.addTab.bind(this)
        this.onEditorFocus = this.onEditorFocus.bind(this)
        this.activeKorePrj = this.activeKorePrj.bind(this)
        this.activeKoreTab = this.activeKoreTab.bind(this)
        this.onKoreTabs = this.onKoreTabs.bind(this)
        this.update = this.update.bind(this)
        this.tabState = {}
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
        post.on('reloadFile',this.reloadFile)
        post.on('saveAll',this.onSaveAll)
        post.on('closeTab',this.onCloseTab)
        post.on('closeOtherTabs',this.onCloseOtherTabs)
        post.on('dirty',this.onDirty)
        post.on('storeState',this.onStoreState)
        post.on('revertFile',this.revertFile)
        post.on('editorFocus',this.onEditorFocus)
        post.on('stashLoaded',this.update)
        post.on('projectIndexed',this.onProjectIndexed)
        post.on('gitStatus',this.onGitStatus)
        kore.on('tabs',this.onKoreTabs)
        kore.on('editor|file',this.addTab)
    }

    koreTabs ()
    {
        return kore.get('tabs')
    }

    update (tabs)
    {
        return kore.set('tabs',(tabs != null ? tabs : this.koreTabs()))
    }

    onKoreTabs (tabs)
    {
        var koreTab

        this.div.innerHTML = ''
        this.tabs = []
        var list = _k_.list(tabs)
        for (var _67_20_ = 0; _67_20_ < list.length; _67_20_++)
        {
            koreTab = list[_67_20_]
            this.tabs.push(new Tab(this,koreTab))
        }
    }

    koreTabForPath (path)
    {
        var tab

        var list = _k_.list(this.koreTabs())
        for (var _72_16_ = 0; _72_16_ < list.length; _72_16_++)
        {
            tab = list[_72_16_]
            if (slash.samePath(tab.path,path))
            {
                return tab
            }
        }
    }

    fileTabsForPath (path)
    {
        return this.fileTabs().filter(function (t)
        {
            return t.path.startsWith(path)
        })
    }

    fileTabs ()
    {
        return this.koreTabs().filter(function (t)
        {
            return t.type === 'file'
        })
    }

    prjTabs ()
    {
        return this.koreTabs().filter(function (t)
        {
            return t.type === 'prj'
        })
    }

    numFileTabs ()
    {
        return this.fileTabs().length
    }

    prjTabForPath (path)
    {
        var tab

        var list = _k_.list(this.prjTabs())
        for (var _84_16_ = 0; _84_16_ < list.length; _84_16_++)
        {
            tab = list[_84_16_]
            if (path.startsWith(tab.path))
            {
                return tab
            }
        }
    }

    activeKoreTab ()
    {
        var tab

        var list = _k_.list(this.koreTabs())
        for (var _89_16_ = 0; _89_16_ < list.length; _89_16_++)
        {
            tab = list[_89_16_]
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
            for (var _95_20_ = 0; _95_20_ < list.length; _95_20_++)
            {
                tab = list[_95_20_]
                if (tab.type === 'prj' && fileTab.path.startsWith(tab.path))
                {
                    return tab
                }
            }
        }
    }

    onEditorFocus (editor)
    {
        var tab

        if (editor.name === 'editor')
        {
            if (tab = this.koreTabForPath(kore.get('editor|file')))
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
        var prjPath

        console.log('addTab',path)
        if (_k_.empty(path))
        {
            return
        }
        if (!this.koreTabForPath(path))
        {
            if (prjPath = Projects.dir(path))
            {
                if (!this.koreTabForPath(prjPath))
                {
                    this.koreTabs().push({type:'prj',path:prjPath})
                }
            }
            this.koreTabs().push({type:'file',path:path,tmp:!path.startsWith('untitled-')})
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
        var dangling, i, k, prjPath, prjTabs, remain, sorted, tab, tabs, v, _159_33_

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
        for (var _153_16_ = 0; _153_16_ < list.length; _153_16_++)
        {
            tab = list[_153_16_]
            prjTabs[tab.path] = [tab]
        }
        dangling = []
        while (tab = remain.shift())
        {
            if (prjPath = Projects.dir(tab.path))
            {
                prjTabs[prjPath] = ((_159_33_=prjTabs[prjPath]) != null ? _159_33_ : [{type:prj,path:prjPath}])
                prjTabs[prjPath].push(tab)
            }
            else
            {
                dangling.push(tab)
            }
        }
        for (k in prjTabs)
        {
            v = prjTabs[k]
            if (v.length <= 1)
            {
                delete prjTabs[k]
            }
        }
        tabs = []
        for (k in prjTabs)
        {
            v = prjTabs[k]
            if (v.slice(-1)[0].tmp)
            {
                for (var _171_25_ = i = v.length - 2, _171_37_ = 0; (_171_25_ <= _171_37_ ? i <= 0 : i >= 0); (_171_25_ <= _171_37_ ? ++i : --i))
                {
                    if (v[i].tmp)
                    {
                        v.splice(i,1)
                    }
                }
            }
            tabs = tabs.concat(v)
        }
        if (!_k_.empty(dangling))
        {
            console.log('dangling',dangling)
            tabs = tabs.concat(dangling)
        }
        return this.update(tabs)
    }

    delTab (path)
    {
        var index, tab, tabs

        if (tab = this.koreTabForPath(path))
        {
            tabs = this.fileTabs()
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
            tabs = this.koreTabs()
            index = tabs.indexOf(tab)
            tabs.splice(index,1)
            this.update(tabs)
            return this.activate(this.activeKoreTab().path)
        }
    }

    activate (path)
    {
        var tab

        if (tab = this.koreTabForPath(path))
        {
            if (tab.type === 'file')
            {
                this.setActive(path)
                if (tab.dirty && this.tabState[tab.path])
                {
                    console.log('restoreTab',tab.path,this.tabState[tab.path])
                    post.emit('restoreTab',tab,this.tabState[tab.path])
                    delete this.tabState[tab.path]
                    return
                }
                return post.emit('jumpToFile',path)
            }
            else
            {
                tab.collapsed = !tab.collapsed
                return this.update()
            }
        }
    }

    setActive (path)
    {
        var tab, _230_26_, _230_31_

        var list = _k_.list(this.koreTabs())
        for (var _226_16_ = 0; _226_16_ < list.length; _226_16_++)
        {
            tab = list[_226_16_]
            delete tab.active
            if (slash.samePath(tab.path,path))
            {
                tab.active = true
                ;((_230_26_=this.tab(path)) != null ? (_230_31_=_230_26_.div) != null ? _230_31_.scrollIntoViewIfNeeded() : undefined : undefined)
            }
        }
    }

    reloadFile (file)
    {
        var tab

        file = (file != null ? file : kore.get('editor|file'))
        if (tab = this.koreTabForPath(file))
        {
            delete tab.dirty
            return this.update()
        }
    }

    onGitStatus (status)
    {
        var tab

        if (tab = this.koreTabForPath(status.gitDir))
        {
            if (tab.type === 'prj')
            {
                return this.tab(status.gitDir).onGitStatus(status)
            }
        }
    }

    onProjectIndexed (path)
    {
        this.koreTabs().push({type:'prj',path:path})
        return this.cleanTabs()
    }

    onClick (event)
    {
        var tab

        if (tab = this.tab(event.target))
        {
            if (event.target.classList.contains('dot'))
            {
                this.delTab(tab.path)
            }
            else
            {
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
            t = this.tabs.find(function (t)
            {
                return t.div === tabDiv
            })
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
        var active, index, tab, tabs

        active = this.activeKoreTab()
        tabs = this.koreTabs()
        for (var _327_21_ = index = tabs.length - 1, _327_36_ = 0; (_327_21_ <= _327_36_ ? index <= 0 : index >= 0); (_327_21_ <= _327_36_ ? ++index : --index))
        {
            tab = tabs[index]
            if (tab === active)
            {
                continue
            }
            if (!tab.pinned && tab.type === 'file')
            {
                tabs.splice(index,1)
            }
        }
        return this.cleanTabs()
    }

    onNewEmptyTab ()
    {
        console.log('onNewEmptyTab')
        this.emptyid += 1
        this.addTab(`untitled-${this.emptyid}`)
        return this.activate(`untitled-${this.emptyid}`)
    }

    onNewTabWithFile (file)
    {
        var col, line, path, prjPath

        var _349_26_ = slash.splitFileLine(file); path = _349_26_[0]; line = _349_26_[1]; col = _349_26_[2]

        if (!this.koreTabForPath(path))
        {
            if (prjPath = Projects.dir(path))
            {
                if (!this.koreTabForPath(prjPath))
                {
                    this.koreTabs().push({type:'prj',path:prjPath})
                }
            }
            this.koreTabs().push({type:'file',path:path})
            return this.cleanTabs()
        }
    }

    navigate (key)
    {
        var index, tab, tabs

        if (tab = this.activeKoreTab())
        {
            tabs = this.fileTabs()
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
            return this.shiftTab(this.koreTabs()[this.dragIndex],index - this.dragIndex)
        }
    }

    toggleExtension ()
    {
        var tab

        prefs.toggle('tabs|extension')
        var list = _k_.list(this.tabs)
        for (var _458_16_ = 0; _458_16_ < list.length; _458_16_++)
        {
            tab = list[_458_16_]
            tab.update()
        }
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

    onStoreState (path)
    {
        var tab

        if (tab = this.koreTabForPath(path))
        {
            if (tab.dirty)
            {
                this.tabState[tab.path] = window.editor.do.tabState()
                console.log('store tab state',tab.path)
                console.log('      tab  text',this.tabState[tab.path].state.s.lines.join('\n'))
            }
        }
    }

    revertFile (path)
    {
        var tab

        delete this.tabState[path]
        if (tab = this.koreTabForPath(path))
        {
            delete tab.dirty
        }
        return this.update()
    }

    onSaveAll ()
    {
        var state, tab

        var list = _k_.list(this.koreTabs())
        for (var _512_16_ = 0; _512_16_ < list.length; _512_16_++)
        {
            tab = list[_512_16_]
            if (tab.dirty)
            {
                if (tab.active)
                {
                    post.emit('saveFile')
                }
                else
                {
                    if (tab.path.startsWith('untitled'))
                    {
                        continue
                    }
                    if (state = this.tabState[tab.path])
                    {
                        File.save(state.file,state.state.text(),function (file)
                        {
                            if (!file)
                            {
                                console.error(`Tabs.onSaveAll failed to save ${state.file}`)
                            }
                        })
                    }
                }
                delete tab.dirty
            }
        }
        return this.update()
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
        opt = {items:[{text:'Close Other Tabs',combo:'alt+cmdctrl+w'},{text:'New Window',combo:'cmdctrl+shift+n'},{text:'Toggle Tab Extensions',combo:'alt+cmdctrl+t'}]}
        opt.x = absPos.x
        opt.y = absPos.y
        return popup.menu(opt)
    }
}

export default Tabs;