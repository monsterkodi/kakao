var _k_ = {isFunc: function (o) {return typeof o === 'function'}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }}

var addToShelf, changeFontSize, changeZoom, reloadWin, resetFontSize, resetZoom, setFontSize, toggleCenterText, toggleTabPinned, Window

import kakao from "../../kakao.js"

import dom from "../../kxk/dom.js"
let stopEvent = dom.stopEvent

import post from "../../kxk/post.js"

import stash from "../../kxk/stash.js"

import store from "../../kxk/store.js"

import prefs from "../../kxk/prefs.js"

import watcher from "../tools/watcher.js"

import fps from "../tools/fps.js"

import scheme from "../tools/scheme.js"

import cwd from "../tools/cwd.js"

import projects from "../tools/projects.js"

import navigate from "../main/navigate.js"

import Split from "./Split.js"

import Info from "./Info.js"

import Tabs from "./Tabs.js"

import Titlebar from "./Titlebar.js"

import FileHandler from "./FileHandler.js"

import Terminal from "./Terminal.js"

import Editor from "../editor/Editor.js"

import CommandLine from "../commandline/CommandLine.js"

import FileEditor from "../editor/FileEditor.js"


Window = (function ()
{
    Window.prototype["onWindowAnimationTick"] = function (win, tickInfo)
    {}

    Window.prototype["onWindowResize"] = function (win, event)
    {}

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
        post.on('stash',function ()
        {
            return window.editor.saveScrollCursorsAndSelections()
        })
        window.aboutImage = kakao.bundle.img('about_ko.png')
    }

    Window.prototype["onWindowCreated"] = function (win)
    {
        var s

        kakao.send('window.setSize',750,750)
        kakao.send('window.center')
        this.id = win.id
        this.filehandler = window.filehandler = new FileHandler
        this.filewatcher = window.filewatcher = new watcher
        this.tabs = window.tabs = new Tabs(window.titlebar.elem)
        this.navigate = window.navigate = new navigate()
        this.split = window.split = new Split()
        this.terminal = window.terminal = new Terminal('terminal')
        this.editor = window.editor = new FileEditor('editor')
        this.commandline = window.commandline = new CommandLine('commandline-editor')
        this.info = window.info = new Info(this.editor)
        this.fps = window.fps = new fps()
        window.textEditor = window.focusEditor = this.editor
        window.setLastFocus(this.editor.name)
        post.on('prefsLoaded',(function ()
        {
            return scheme.set(prefs.get('scheme','dark'))
        }).bind(this))
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
        var action, _128_25_

        console.log('ko.Window.onMenuAction',name,opts)
        if (action = Editor.actionWithName(name))
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
                return console.log(`ko.window ${name} unimplemented!`)

            case 'Cycle Windows':
                return console.log(`ko.window ${name} unimplemented!`)

            case 'Arrange Windows':
                return console.log(`ko.window ${name} unimplemented!`)

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
                return post.toWins('closeWindow')

            case 'Small Browser':
                return window.commandline.startCommand('browse')

            case 'Large Browser':
                return window.commandline.startCommand('Browse')

            case 'Preferences':
                return post.emit('openFiles',[prefs.store.file],{newTab:true})

        }

    }

    return Window
})()

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
    clearListeners()
    return post.toMain('reloadWin',{winID:window.winID,file:window.editor.currentFile})
}

window.onresize = function ()
{
    var _265_14_

    window.split.resized()
    ;(window.win != null ? window.win.onMoved(window.win.getBounds()) : undefined)
    if (window.stash.get('centerText',false))
    {
        return window.editor.centerText(true,200)
    }
}
post.on('split',function (s)
{
    var _271_22_

    ;(window.filebrowser != null ? window.filebrowser.resized() : undefined)
    window.terminal.resized()
    window.commandline.resized()
    return window.editor.resized()
})

toggleCenterText = function ()
{
    var restoreInvisibles

    if (window.stash.get(`invisibles|${window.editor.currentFile}`,false))
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
    var _316_32_

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