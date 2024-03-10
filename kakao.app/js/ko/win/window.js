// monsterkodi/kode 0.256.0

var _k_ = {isFunc: function (o) {return typeof o === 'function'}}

var Window

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
    {
        console.log('onWindowAnimationTick',win.id)
    }

    Window.prototype["onWindowResize"] = function (win, event)
    {
        console.log('onWindowResize',win.id)
    }

    Window.prototype["onWindowFocus"] = function (win)
    {
        console.log('onWindowFocus',win.id)
    }

    Window.prototype["onWindowBlur"] = function (win)
    {
        console.log('onWindowBlur',win.id)
    }

    Window.prototype["onWindowKeyDown"] = function (win, keyInfo)
    {
        console.log('onWindowKeyDown',win.id)
    }

    Window.prototype["onWindowKeyUp"] = function (win, keyInfo)
    {
        console.log('onWindowKeyUp',win.id)
    }

    function Window ()
    {
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onMoved"] = this["onMoved"].bind(this)
        this["onWindowCreated"] = this["onWindowCreated"].bind(this)
        this.menuIcon = kakao.bundle.img('menu_ko.png')
        this.menuNoon = kakao.bundle.res('menu_ko.noon')
        window.aboutImage = kakao.bundle.img('about_ko.png')
    }

    Window.prototype["onWindowCreated"] = function (win)
    {
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
        window.textEditor = window.focusEditor = this.editor
        window.setLastFocus(this.editor.name)
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
                post.toOtherWins('fileLineChanges',this.editor.currentFile,changeInfo.changes)
                if (changeInfo.deletes === 1)
                {
                    return navigate.delFilePos({file:this.editor.currentFile,pos:[0,changeInfo.changes[0].oldIndex]})
                }
                else
                {
                    return navigate.addFilePos({file:this.editor.currentFile,pos:this.editor.cursorPos()})
                }
            }
        })
        post.emit('restore')
        return this.editor.focus()
    }

    Window.prototype["onMoved"] = function (bounds)
    {
        return window.stash.set('bounds',bounds)
    }

    Window.prototype["onMenuAction"] = function (name, opts)
    {
        var action, _135_25_

        return
        if (action = Editor.actionWithName(name))
        {
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
                return post.toMain('newWindowWithFile',editor.currentFile)

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
                return titlebar.showList()

            case 'Navigate Backward':
                return navigate.backward()

            case 'Navigate Forward':
                return navigate.forward()

            case 'Maximize Editor':
                return split.maximizeEditor()

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

        return Window.__super__.onMenuAction.call(this,name,opts)
    }

    return Window
})()

window.state = new store('state',{separator:'|'})
window.prefs = prefs

window.onblur = function (event)
{
    return post.emit('winFocus',false)
}

window.onfocus = function (event)
{
    post.emit('winFocus',true)
    if (document.activeElement.className === 'body')
    {
        if (split.editorVisible())
        {
            return split.focus('editor')
        }
        else
        {
            return split.focus('commandline-editor')
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