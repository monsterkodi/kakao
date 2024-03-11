// monsterkodi/kode 0.256.0

var _k_ = {isFunc: function (o) {return typeof o === 'function'}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }}

var addToShelf, changeFontSize, changeZoom, reloadWin, resetFontSize, resetZoom, setFontSize, toggleCenterText, toggleTabPinned, Window

import kakao from "../../kakao.js"

import post from "../../kxk/post.js"

import stash from "../../kxk/stash.js"

import store from "../../kxk/store.js"

import prefs from "../../kxk/prefs.js"

import split from "./split.js"

import info from "./info.js"

import tabs from "./tabs.js"

import terminal from "./terminal.js"

import titlebar from "./titlebar.js"

import filehandler from "./filehandler.js"

import watcher from "../tools/watcher.js"

import fps from "../tools/fps.js"

import scheme from "../tools/scheme.js"

import editor from "../editor/editor.js"

import commandline from "../commandline/commandline.js"

import fileeditor from "../editor/fileeditor.js"

import cwd from "../tools/cwd.js"

import projects from "../tools/projects.js"

import navigate from "../main/navigate.js"


Window = (function ()
{
    Window.prototype["onWindowAnimationTick"] = function (win, tickInfo)
    {}

    Window.prototype["onWindowResize"] = function (win, event)
    {
        console.log('onWindowResize',win.id)
    }

    Window.prototype["onWindowFocus"] = function (win)
    {}

    Window.prototype["onWindowBlur"] = function (win)
    {}

    Window.prototype["onWindowKeyDown"] = function (win, keyInfo)
    {}

    Window.prototype["onWindowKeyUp"] = function (win, keyInfo)
    {}

    function Window ()
    {
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onMoved"] = this["onMoved"].bind(this)
        this["onWindowCreated"] = this["onWindowCreated"].bind(this)
        this.menuIcon = kakao.bundle.img('menu_ko.png')
        this.menuNoon = kakao.bundle.res('menu_ko.noon')
        post.on('menuAction',this.onMenuAction)
        window.aboutImage = kakao.bundle.img('about_ko.png')
    }

    Window.prototype["onWindowCreated"] = function (win)
    {
        var s

        this.id = win.id
        console.log('onWindowCreated',win.id)
        window.stash = new stash(`win/${this.id}`,{separator:'|'})
        this.filehandler = window.filehandler = new filehandler
        this.filewatcher = window.filewatcher = new watcher
        this.tabs = window.tabs = new tabs(window.titlebar.elem)
        this.titlebar = new titlebar
        this.navigate = window.navigate = new navigate()
        this.split = window.split = new split()
        this.terminal = window.terminal = new terminal('terminal')
        this.editor = window.editor = new fileeditor('editor')
        this.commandline = window.commandline = new commandline('commandline-editor')
        this.info = window.info = new info(this.editor)
        this.fps = window.fps = new fps()
        this.cwd = window.cwd = new cwd()
        console.log('split',this.split)
        window.textEditor = window.focusEditor = this.editor
        window.setLastFocus(this.editor.name)
        scheme.set(prefs.get('scheme','dark'))
        this.terminal.on('fileSearchResultChange',function (file, lineChange)
        {
            return post.toWins('fileLineChanges',file,[lineChange])
        })
        this.editor.on('changed',function (changeInfo)
        {
            if (changeInfo.foreign)
            {
                return
            }
            if (changeInfo.changes.length)
            {
                if (changeInfo.deletes === 1)
                {
                    return window.navigate.delFilePos({file:window.editor.currentFile,pos:[0,changeInfo.changes[0].oldIndex]})
                }
                else
                {
                    return window.navigate.addFilePos({file:window.editor.currentFile,pos:window.editor.cursorPos()})
                }
            }
        })
        s = window.stash.get('fontSize',prefs.get('editorFontSize',19))
        if (s)
        {
            this.editor.setFontSize(s)
        }
        if (window.stash.get('centerText'))
        {
            this.editor.centerText(true,0)
        }
        post.emit('restore')
        window.split.resized()
        window.info.reload()
        return this.editor.focus()
    }

    Window.prototype["onMoved"] = function (bounds)
    {
        return window.stash.set('bounds',bounds)
    }

    Window.prototype["onMenuAction"] = function (name, opts)
    {
        var action, _135_25_

        console.log('onMenuAction',name)
        if (action = editor.actionWithName(name))
        {
            console.log('editor.actionWithName',name)
            if ((action.key != null) && _k_.isFunc(window.focusEditor[action.key]))
            {
                window.focusEditor[action.key](opts.actarg)
                return
            }
        }
        if ('unhandled' !== window.commandline.handleMenuAction(name,opts))
        {
            return
        }
        switch (name)
        {
            case 'doMacro':
                return window.commandline.commands.macro.execute(opts.actarg)

            case 'Undo':
                return window.focusEditor.do.undo()

            case 'Redo':
                return window.focusEditor.do.redo()

            case 'Cut':
                return window.focusEditor.cut()

            case 'Copy':
                return window.focusEditor.copy()

            case 'Paste':
                return window.focusEditor.paste()

            case 'New Tab':
                return post.emit('newEmptyTab')

            case 'New Window':
                return post.toMain('newWindowWithFile',this.editor.currentFile)

            case 'Cycle Windows':
                return post.toMain('activateNextWindow',window.winID)

            case 'Arrange Windows':
                return post.toMain('arrangeWindows')

            case 'Toggle Scheme':
                return scheme.toggle()

            case 'Toggle Center Text':
                return toggleCenterText()

            case 'Toggle Tab Pinned':
                return toggleTabPinned()

            case 'Increase':
                return changeFontSize(1)

            case 'Decrease':
                return changeFontSize(-1)

            case 'Reset':
                return resetFontSize()

            case 'Open Window List':
                return this.titlebar.showList()

            case 'Navigate Backward':
                return this.navigate.backward()

            case 'Navigate Forward':
                return this.navigate.forward()

            case 'Maximize Editor':
                return this.split.maximizeEditor()

            case 'Add to Shelf':
                return addToShelf()

            case 'Toggle History':
                return window.filebrowser.shelf.toggleHistory()

            case 'Activate Next Tab':
                return window.tabs.navigate('right')

            case 'Activate Previous Tab':
                return window.tabs.navigate('left')

            case 'Move Tab Left':
                return window.tabs.move('left')

            case 'Move Tab Right':
                return window.tabs.move('right')

            case 'Open...':
                return post.emit('openFile')

            case 'Open In New Tab...':
                return post.emit('openFile',{newTab:true})

            case 'Open In New Window...':
                return post.emit('openFile',{newWindow:true})

            case 'Save':
                return post.emit('saveFile')

            case 'Save All':
                return post.emit('saveAll')

            case 'Save As ...':
                return post.emit('saveFileAs')

            case 'Revert':
                return post.emit('reloadFile')

            case 'Close Tab or Window':
                return post.emit('closeTabOrWindow')

            case 'Close Other Tabs':
                return post.emit('closeOtherTabs')

            case 'Close Other Windows':
                return post.toOtherWins('closeWindow')

            case 'Clear List':
                window.state.set('recentFiles',[])
                window.titlebar.refreshMenu()
                return

            case 'Preferences':
                return post.emit('openFiles',[prefs.store.file],{newTab:true})

            case 'Cycle Windows':
                opts = this.id
                break
        }

        console.log('onMenuAction unhandled',name)
    }

    return Window
})()

window.state = new store('state',{separator:'|'})
window.prefs = prefs
post.on('singleCursorAtPos',function (pos, opt)
{
    window.editor.singleCursorAtPos(pos,opt)
    return window.editor.scroll.cursorToTop()
})
post.on('focusEditor',function ()
{
    return window.split.focus('editor')
})
post.on('cloneFile',function ()
{
    return post.toMain('newWindowWithFile',window.editor.currentFile)
})
post.on('closeWindow',function ()
{
    return post.emit('menuAction','Close')
})
post.on('saveStash',function ()
{
    return saveStash()
})
post.on('clearStash',function ()
{
    return clearStash()
})
post.on('editorFocus',function (editor)
{
    window.setLastFocus(window.editor.name)
    window.focusEditor = window.editor
    if (window.editor.name !== 'commandline-editor')
    {
        return window.textEditor = window.editor
    }
})
post.on('mainlog',function ()
{})
post.on('ping',function (wID, argA, argB)
{
    return post.toWin(wID,'pong',window.winID,argA,argB)
})
post.on('postEditorState',function ()
{
    return post.toAll('editorState',window.winID,{lines:window.editor.lines(),cursors:window.editor.cursors(),main:window.editor.mainCursor(),selections:window.editor.selections(),highlights:window.editor.highlights()})
})

window.editorWithName = function (n)
{
    switch (n)
    {
        case 'command':
        case 'commandline':
            return window.commandline

        case 'terminal':
            return window.terminal

        case 'editor':
            return window.editor

        default:
            return window.editor
    }

}

reloadWin = function ()
{
    saveStash()
    clearListeners()
    return post.toMain('reloadWin',{winID:window.winID,file:window.editor.currentFile})
}

window.onresize = function ()
{
    var _298_14_

    window.split.resized()
    ;(window.win != null ? window.win.onMoved(window.win.getBounds()) : undefined)
    if (window.stash.get('centerText',false))
    {
        return window.editor.centerText(true,200)
    }
}
post.on('split',function (s)
{
    var _304_22_

    ;(window.filebrowser != null ? window.filebrowser.resized() : undefined)
    window.terminal.resized()
    window.commandline.resized()
    return window.editor.resized()
})

toggleCenterText = function ()
{
    var restoreInvisibles

    if (window.state.get(`invisibles|${window.editor.currentFile}`,false))
    {
        window.editor.toggleInvisibles()
        restoreInvisibles = true
    }
    if (!window.stash.get('centerText',false))
    {
        window.stash.set('centerText',true)
        window.editor.centerText(true)
    }
    else
    {
        window.stash.set('centerText',false)
        window.editor.centerText(false)
    }
    if (restoreInvisibles)
    {
        return window.editor.toggleInvisibles()
    }
}

toggleTabPinned = function ()
{
    var t

    if (t = window.tabs.activeTab())
    {
        return t.togglePinned()
    }
}

setFontSize = function (s)
{
    var _349_32_

    if (!(_k_.isNum(s)))
    {
        s = prefs.get('editorFontSize',19)
    }
    s = _k_.clamp(8,100,s)
    window.stash.set("fontSize",s)
    window.editor.setFontSize(s)
    if ((window.editor.currentFile != null))
    {
        return post.emit('loadFile',window.editor.currentFile,{reload:true})
    }
}

changeFontSize = function (d)
{
    var f

    if (window.editor.size.fontSize >= 20)
    {
        f = 2
    }
    else if (window.editor.size.fontSize >= 30)
    {
        f = 4
    }
    else if (window.editor.size.fontSize >= 50)
    {
        f = 10
    }
    else
    {
        f = 1
    }
    return setFontSize(window.editor.size.fontSize + f * d)
}

resetFontSize = function ()
{
    var defaultFontSize

    defaultFontSize = prefs.get('editorFontSize',19)
    window.stash.set('fontSize',defaultFontSize)
    return setFontSize(defaultFontSize)
}

addToShelf = function ()
{
    var fb, path

    if (window.lastFocus === 'shelf')
    {
        return
    }
    fb = window.filebrowser
    if (window.lastFocus.startsWith(fb.name))
    {
        path = fb.columnWithName(window.lastFocus).activePath()
    }
    else
    {
        path = window.editor.currentFile
    }
    return post.emit('addToShelf',path)
}

resetZoom = function ()
{
    webframe.setZoomFactor(1)
    return window.editor.resized()
}

changeZoom = function (d)
{
    var z

    z = webframe.getZoomFactor()
    z *= 1 + d / 20
    z = _k_.clamp(0.36,5.23,z)
    webframe.setZoomFactor(z)
    return window.editor.resized()
}

window.onblur = function (event)
{
    return post.emit('winFocus',false)
}

window.onfocus = function (event)
{
    post.emit('winFocus',true)
    if (document.activeElement.className === 'body')
    {
        if (window.split.editorVisible())
        {
            return window.split.focus('editor')
        }
        else
        {
            return window.split.focus('commandline-editor')
        }
    }
}

window.setLastFocus = function (name)
{
    return window.lastFocus = name
}
kakao.init(function ()
{
    var kwin

    return kwin = new kakao.window(new Window)
})