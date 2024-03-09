// monsterkodi/kode 0.256.0

var _k_ = {isFunc: function (o) {return typeof o === 'function'}}

var commandline, editor, filehandler, filewatcher, info, mainmenu, split, tabs, terminal, titlebar, Window

import kakao from "../../kakao.js"

import split from "./split.js"

import titlebar from "./titlebar.js"

import info from "./info.js"

split = null
info = null
editor = null
mainmenu = null
terminal = null
commandline = null
titlebar = null
tabs = null
filehandler = null
filewatcher = null

Window = (function ()
{
    Window.prototype["onWindowCreated"] = function (win)
    {
        console.log('onWindowCreated',win.id)
    }

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
        var cwd, fps, navigate, s

        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onMoved"] = this["onMoved"].bind(this)
        this.menuIcon = kakao.bundle.img('menu_ko.png')
        this.menuNoon = kakao.bundle.res('menu_ko.noon')
        window.aboutImage = kakao.bundle.img('about_ko.png')
        console.log(window.aboutImage)
        return
        filehandler = window.filehandler = new FileHandler
        filewatcher = window.filewatcher = new FileWatcher
        tabs = window.tabs = new Tabs(window.titlebar.elem)
        titlebar = new Titlebar
        navigate = window.navigate = new Navigate()
        split = window.split = new Split()
        terminal = window.terminal = new Terminal('terminal')
        editor = window.editor = new FileEditor('editor')
        commandline = window.commandline = new Commandline('commandline-editor')
        info = window.info = new Info(editor)
        fps = window.fps = new FPS()
        cwd = window.cwd = new CWD()
        window.textEditor = window.focusEditor = editor
        window.setLastFocus(editor.name)
        restoreWin()
        scheme.set(prefs.get('scheme','dark'))
        terminal.on('fileSearchResultChange',function (file, lineChange)
        {
            return post.toWins('fileLineChanges',file,[lineChange])
        })
        editor.on('changed',function (changeInfo)
        {
            if (changeInfo.foreign)
            {
                return
            }
            if (changeInfo.changes.length)
            {
                post.toOtherWins('fileLineChanges',editor.currentFile,changeInfo.changes)
                if (changeInfo.deletes === 1)
                {
                    return navigate.delFilePos({file:editor.currentFile,pos:[0,changeInfo.changes[0].oldIndex]})
                }
                else
                {
                    return navigate.addFilePos({file:editor.currentFile,pos:editor.cursorPos()})
                }
            }
        })
        s = window.stash.get('fontSize',prefs.get('editorFontSize',19))
        if (s)
        {
            editor.setFontSize(s)
        }
        if (window.stash.get('centerText'))
        {
            editor.centerText(true,0)
        }
        post.emit('restore')
        editor.focus()
    }

    Window.prototype["onMoved"] = function (bounds)
    {
        return window.stash.set('bounds',bounds)
    }

    Window.prototype["onMenuAction"] = function (name, opts)
    {
        var action, _129_25_

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

kakao.init(function ()
{
    var kwin

    return kwin = new kakao.window(new Window)
})