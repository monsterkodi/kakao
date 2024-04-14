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
        for (var _60_20_ = 0; _60_20_ < list.length; _60_20_++)
        {
            koreTab = list[_60_20_]
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
        for (var _69_16_ = 0; _69_16_ < list.length; _69_16_++)
        {
            tab = list[_69_16_]
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
        var prjPath

        if (!this.koreTabForPath(path))
        {
            if (prjPath = Projects.dir(path))
            {
                if (!this.koreTabForPath(prjPath))
                {
                    this.koreTabs().push({type:'prj',path:prjPath})
                }
            }
            this.koreTabs().push({type:'file',path:path,tmp:true})
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
        var dangling, i, k, prjPath, prjTabs, remain, sorted, tab, tabs, v, _139_33_

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
        for (var _133_16_ = 0; _133_16_ < list.length; _133_16_++)
        {
            tab = list[_133_16_]
            prjTabs[tab.path] = [tab]
        }
        dangling = []
        while (tab = remain.shift())
        {
            if (prjPath = Projects.dir(tab.path))
            {
                prjTabs[prjPath] = ((_139_33_=prjTabs[prjPath]) != null ? _139_33_ : [{type:prj,path:prjPath}])
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
                for (var _151_25_ = i = v.length - 2, _151_37_ = 0; (_151_25_ <= _151_37_ ? i <= 0 : i >= 0); (_151_25_ <= _151_37_ ? ++i : --i))
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
        var tab, _203_26_, _203_31_

        var list = _k_.list(this.koreTabs())
        for (var _199_16_ = 0; _199_16_ < list.length; _199_16_++)
        {
            tab = list[_199_16_]
            delete tab.active
            if (slash.samePath(tab.path,path))
            {
                tab.active = true
                ;((_203_26_=this.tab(path)) != null ? (_203_31_=_203_26_.div) != null ? _203_31_.scrollIntoViewIfNeeded() : undefined : undefined)
            }
        }
    }

    activeKoreTab ()
    {
        var tab

        var list = _k_.list(this.koreTabs())
        for (var _207_16_ = 0; _207_16_ < list.length; _207_16_++)
        {
            tab = list[_207_16_]
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
            for (var _213_20_ = 0; _213_20_ < list.length; _213_20_++)
            {
                tab = list[_213_20_]
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

        if (tab = this.koreTabForPath(file))
        {
            delete tab.dirty
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

    numFileTabs ()
    {
        return this.fileTabs().length
    }

    fileTabs ()
    {
        return this.koreTabs().filter(function (t)
        {
            return t.type === 'file'
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
        for (var _310_21_ = index = tabs.length - 1, _310_36_ = 0; (_310_21_ <= _310_36_ ? index <= 0 : index >= 0); (_310_21_ <= _310_36_ ? ++index : --index))
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
        return this.addTab(`untitled-${this.emptyid}`)
    }

    onNewTabWithFile (file)
    {
        var col, line, tab

        var _331_26_ = slash.splitFileLine(file); file = _331_26_[0]; line = _331_26_[1]; col = _331_26_[2]

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
            tabs = this.koreTabs().filter(function (t)
            {
                return t.type === 'file'
            })
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
                    var _411_25_ = [tb,ta]; ta = _411_25_[0]; tb = _411_25_[1]

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
            var _442_44_

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
        var _448_36_

        return (this.tab(file) != null ? this.tab(file).revert() : undefined)
    }

    toggleExtension ()
    {
        var tab

        prefs.toggle('tabs|extension')
        var list = _k_.list(this.tabs)
        for (var _460_16_ = 0; _460_16_ < list.length; _460_16_++)
        {
            tab = list[_460_16_]
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
        opt = {items:[{text:'Close Other Tabs',combo:'alt+cmdctrl+w'},{text:'New Window',combo:'ctrl+shift+n'},{text:'Toggle Tab Extensions',combo:'alt+cmdctrl+t'}]}
        opt.x = absPos.x
        opt.y = absPos.y
        return popup.menu(opt)
    }
}

export default Tabs;