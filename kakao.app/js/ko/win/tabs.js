var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

import dom from "../../kxk/dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent

import post from "../../kxk/post.js"

import elem from "../../kxk/elem.js"

import drag from "../../kxk/drag.js"

import kpos from "../../kxk/kpos.js"

import slash from "../../kxk/slash.js"

import popup from "../../kxk/popup.js"

import Tab from "./tab.js"

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
        this.onFileSaved = this.onFileSaved.bind(this)
        this.onFileLineChanges = this.onFileLineChanges.bind(this)
        this.onSendTabs = this.onSendTabs.bind(this)
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
        post.on('stashLoaded',this.onStashLoaded)
        post.on('revertFile',this.revertFile)
        post.on('sendTabs',this.onSendTabs)
        post.on('fileLineChanges',this.onFileLineChanges)
        post.on('fileSaved',this.onFileSaved)
        post.on('editorFocus',this.onEditorFocus)
    }

    onSendTabs (winID)
    {
        var t, tab

        t = ''
        var list = _k_.list(this.tabs)
        for (var _54_16_ = 0; _54_16_ < list.length; _54_16_++)
        {
            tab = list[_54_16_]
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

    onClick (event)
    {
        var tab

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
            this.onNewEmptyTab()
        }
        return this
    }

    onCloseTabOrWindow (tab)
    {
        console.log('onCloseTabOrWindow',this.numTabs())
        if (this.numTabs() <= 1)
        {
            return post.emit('menuAction','close')
        }
        else
        {
            tab = (tab != null ? tab : this.activeTab())
            console.log('activeTab',tab)
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
        for (var _164_14_ = 0; _164_14_ < list.length; _164_14_++)
        {
            t = list[_164_14_]
            this.closeTab(t)
        }
        return this.update()
    }

    addTab (file)
    {
        var index

        if (this.tabs.length >= prefs.get('maximalNumberOfTabs',8))
        {
            for (var _177_26_ = index = 0, _177_30_ = this.tabs.length; (_177_26_ <= _177_30_ ? index < this.tabs.length : index > this.tabs.length); (_177_26_ <= _177_30_ ? ++index : --index))
            {
                if (!this.tabs[index].dirty && !this.tabs[index].pinned)
                {
                    this.closeTab(this.tabs[index])
                    break
                }
            }
        }
        this.tabs.push(new Tab(this,file))
        return _k_.last(this.tabs)
    }

    getTmpTab ()
    {
        var t

        var list = _k_.list(this.tabs)
        for (var _187_14_ = 0; _187_14_ < list.length; _187_14_++)
        {
            t = list[_187_14_]
            if (t.tmpTab)
            {
                return t
            }
        }
    }

    addTmpTab (file)
    {
        var tab

        this.closeTab(this.getTmpTab())
        tab = this.addTab(file)
        tab.tmpTab = true
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

        var _209_26_ = slash.splitFileLine(file); file = _209_26_[0]; line = _209_26_[1]; col = _209_26_[2]

        if (tab = this.tab(file))
        {
            tab.activate()
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
            var _240_17_ = [tb,ta]; ta = _240_17_[0]; tb = _240_17_[1]

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
        var files, pinned, t, _312_41_

        files = (function () { var r_305_32_ = []; var list = _k_.list(this.tabs); for (var _305_32_ = 0; _305_32_ < list.length; _305_32_++)  { t = list[_305_32_];r_305_32_.push(t.file)  } return r_305_32_ }).bind(this)()
        pinned = (function () { var r_306_34_ = []; var list1 = _k_.list(this.tabs); for (var _306_34_ = 0; _306_34_ < list1.length; _306_34_++)  { t = list1[_306_34_];r_306_34_.push(t.pinned)  } return r_306_34_ }).bind(this)()
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
        for (var _332_18_ = pi = 0, _332_22_ = pinned.length; (_332_18_ <= _332_22_ ? pi < pinned.length : pi > pinned.length); (_332_18_ <= _332_22_ ? ++pi : --pi))
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
        var _338_36_

        return (this.tab(file) != null ? this.tab(file).revert() : undefined)
    }

    update ()
    {
        var pkg, tab

        this.stash()
        if (_k_.empty(this.tabs))
        {
            return
        }
        pkg = this.tabs[0].pkg
        this.tabs[0].showPkg()
        var list = _k_.list(this.tabs.slice(1))
        for (var _354_16_ = 0; _354_16_ < list.length; _354_16_++)
        {
            tab = list[_354_16_]
            if (tab.pkg === pkg)
            {
                tab.hidePkg()
            }
            else
            {
                pkg = tab.pkg
                tab.showPkg()
            }
        }
        return this
    }

    onDirty (dirty)
    {
        var _364_20_

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
        opt = {items:[{text:'Close Other Tabs',combo:'ctrl+shift+w'},{text:'New Window',combo:'ctrl+shift+n'}]}
        opt.x = absPos.x
        opt.y = absPos.y
        return popup.menu(opt)
    }
}

export default Tabs;