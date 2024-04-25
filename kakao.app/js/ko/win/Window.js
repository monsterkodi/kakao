var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isFunc: function (o) {return typeof o === 'function'}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }}

var addToShelf, changeFontSize, changeZoom, resetFontSize, resetZoom, setFontSize, toggleCenterText, Window

import kakao from "../../kakao.js"

import kxk from "../../kxk.js"
let win = kxk.win
let stash = kxk.stash
let post = kxk.post
let prefs = kxk.prefs
let store = kxk.store
let stopEvent = kxk.stopEvent

import Kore from "./Kore.js"
import Split from "./Split.js"
import Info from "./Info.js"
import Tabs from "./Tabs.js"
import Menu from "./Menu.js"
import Navigate from "./Navigate.js"
import FileHandler from "./FileHandler.js"
import Terminal from "./Terminal.js"
import Viewer from "./Viewer.js"

import FileWatch from "../tools/FileWatch.js"
import Projects from "../tools/Projects.js"
import Indexer from "../tools/Indexer.js"
import Git from "../tools/Git.js"
import fps from "../tools/fps.js"
import scheme from "../tools/scheme.js"

import Editor from "../editor/Editor.js"
import Syntax from "../editor/Syntax.js"
import FileEditor from "../editor/FileEditor.js"

import Macro from "../commands/Macro.js"

import CommandLine from "../commandline/CommandLine.js"


Window = (function ()
{
    _k_.extend(Window, win.Delegate)
    Window.prototype["onWindowAboutToShow"] = function (win)
    {}

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

    Window.prototype["onWindowMenuTemplate"] = function (win, template)
    {
        return kakao.menuTemplate = Menu(template)
    }

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
            return window.editor.saveFilePosition()
        })
        window.aboutImage = kakao.bundle.img('about_ko.png')
        return Window.__super__.constructor.apply(this, arguments)
    }

    Window.prototype["onWindowWithoutStash"] = async function ()
    {
        console.log('onWindowWithoutStash!')
    }

    Window.prototype["onWindowCreated"] = function (win)
    {
        var a

        this.id = win.id
        a = 1 + 2 + 3
        new FileHandler
        new FileWatch
        new Git
        this.tabs = window.tabs = new Tabs(window.titlebar.elem)
        this.navigate = window.navigate = new Navigate()
        this.split = window.split = new Split()
        this.terminal = window.terminal = new Terminal('terminal')
        this.editor = window.editor = new FileEditor('editor')
        this.commandline = window.commandline = new CommandLine('commandline-editor')
        this.info = window.info = new Info(this.editor)
        this.fps = window.fps = new fps()
        this.indexer = window.indexer = new Indexer()
        this.viewer = window.viewer = new Viewer('editor')
        window.textEditor = window.focusEditor = this.editor
        window.setLastFocus(this.editor.name)
        this.editor.on('changed',function (changeInfo)
        {
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
        post.on('prefsLoaded',(function ()
        {
            return scheme.set(prefs.get('scheme','dark'))
        }).bind(this))
        post.on('stashLoaded',(function ()
        {
            this.editor.setFontSize(window.stash.get('fontSize',19))
            this.editor.centerText(window.stash.get('centerText'),0)
            return post.emit('loadFile',kore.get('editor|file'))
        }).bind(this))
        window.split.resized()
        window.info.reload()
        if (_k_.empty(window.tabs.tabs))
        {
            console.log('not tab! empty tab!')
            post.emit('newEmptyTab')
        }
        return this.editor.focus()
    }

    Window.prototype["onMoved"] = function (bounds)
    {
        return window.stash.set('bounds',bounds)
    }

    Window.prototype["onMenuAction"] = function (name, trail)
    {
        var action, _113_25_

        if (action = Editor.actionWithName(name))
        {
            if ((action.key != null) && _k_.isFunc(window.focusEditor[action.key]))
            {
                window.focusEditor[action.key]({name:name,trail:trail})
                return
            }
        }
        if ('unhandled' !== window.commandline.handleMenuAction(name,trail))
        {
            return
        }
        switch (name)
        {
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
                return kakao('window.new','ko.html',this.editor.currentFile)

            case 'Arrange Windows':
                return console.log(`ko.window ${name} unimplemented!`)

            case 'Toggle Scheme':
                return scheme.toggle()

            case 'Toggle Center Text':
                return toggleCenterText()

            case 'Toggle Tab Pinned':
                return toggleTabPinned()

            case 'Toggle Tab Extensions':
                return tabs.toggleExtension()

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

            case 'Open In New Window...':
                return post.emit('openFile',{newWindow:true})

            case 'Save':
                return post.emit('saveFile')

            case 'Save All':
                return post.emit('saveAll')

            case 'Save As ...':
                return post.emit('saveFileAs')

            case 'Revert':
                return post.emit('reloadFile',kore.get('editor|file'))

            case 'Close Tab':
                return post.emit('closeTab')

            case 'Close Other Tabs':
                return post.emit('closeOtherTabs')

            case 'Close Other Windows':
                return post.toWins('closeWindow')

            case 'Small Browser':
                return window.commandline.startCommand('browse')

            case 'Preferences':
                return post.emit('loadFile',prefs.store.file)

        }

        console.log('onMenuAction unhandled',name,trail)
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

window.onresize = function ()
{
    var _202_14_

    window.split.resized()
    ;(window.win != null ? window.win.onMoved(window.win.getBounds()) : undefined)
    if (window.stash.get('centerText',false))
    {
        return window.editor.centerText(true,200)
    }
}
post.on('split',function (s)
{
    var _208_22_, _209_19_

    ;(window.filebrowser != null ? window.filebrowser.resized() : undefined)
    ;(window.terminal != null ? window.terminal.resized() : undefined)
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

setFontSize = function (s)
{
    var _248_32_

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

kakao.preInit = async function ()
{
    await Syntax.init()
    await Editor.init()
    return await CommandLine.init()
}
kakao.init(function ()
{
    return new win(new Window)
})