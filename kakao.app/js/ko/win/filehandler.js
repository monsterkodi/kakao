var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}}

import kxk from "../../kxk.js"
let pull = kxk.pull
let reversed = kxk.reversed
let prefs = kxk.prefs
let slash = kxk.slash
let post = kxk.post
let ffs = kxk.ffs

import Projects from "../tools/Projects.js"
import File from "../tools/File.js"

class FileHandler
{
    constructor ()
    {
        this.saveFileAs = this.saveFileAs.bind(this)
        this.openFile = this.openFile.bind(this)
        this.saveChanges = this.saveChanges.bind(this)
        this.saveFile = this.saveFile.bind(this)
        this.saveAll = this.saveAll.bind(this)
        this.removeFile = this.removeFile.bind(this)
        this.reloadActiveTab = this.reloadActiveTab.bind(this)
        this.reloadFile = this.reloadFile.bind(this)
        this.reloadTab = this.reloadTab.bind(this)
        this.openFiles = this.openFiles.bind(this)
        this.onFile = this.onFile.bind(this)
        this.loadFile = this.loadFile.bind(this)
        post.on('fileChanged',this.reloadFile)
        post.on('fileRemoved',this.removeFile)
        post.on('saveFileAs',this.saveFileAs)
        post.on('saveFile',this.saveFile)
        post.on('saveAll',this.saveAll)
        post.on('saveChanges',this.saveChanges)
        post.on('reloadTab',this.reloadTab)
        post.on('reloadFile',this.reloadActiveTab)
        post.on('loadFile',this.loadFile)
        post.on('openFile',this.openFile)
        post.on('openFiles',this.openFiles)
        post.on('file',this.onFile)
        this.cursorToRestore = {}
    }

    loadFile (file, opt = {})
    {
        var activeTab, filePos, restoreState, tab, _74_49_

        if ((file != null) && file.length <= 0)
        {
            file = null
        }
        editor.saveScrollCursorsAndSelections()
        if ((file != null))
        {
            var _44_28_ = slash.splitFilePos(file); file = _44_28_[0]; filePos = _44_28_[1]

            if ((filePos != null) && (filePos[0] || filePos[1]))
            {
                this.cursorToRestore[file] = filePos
            }
            if (!file.startsWith('untitled'))
            {
                file = slash.path(file)
            }
        }
        if (file !== (editor != null ? editor.currentFile : undefined) || !_k_.empty(filePos) || opt.reload)
        {
            this.addToRecent(file)
            tab = tabs.tab(file)
            if (_k_.empty(tab))
            {
                tab = tabs.addTmpTab(file)
            }
            if (activeTab = tabs.activeTab())
            {
                if (tab !== activeTab)
                {
                    activeTab.clearActive()
                    if (activeTab.dirty)
                    {
                        activeTab.storeState()
                    }
                }
            }
            if ((tab != null ? tab.state : undefined))
            {
                restoreState = tab.state.state
            }
            editor.setCurrentFile(file,restoreState)
            if (tab)
            {
                ;(tab != null ? tab.finishActivation() : undefined)
            }
            else
            {
                ;(tabs.getPrjTab(Projects.dir(file)) != null ? tabs.getPrjTab(Projects.dir(file)).update() : undefined)
            }
            post.emit('fileLoaded',file)
            editor.restoreScrollCursorsAndSelections()
        }
        return split.raise('editor')
    }

    onFile (file)
    {
        var filePos

        if (filePos = this.cursorToRestore[file])
        {
            editor.singleCursorAtPos(filePos)
            editor.scroll.cursorToTop()
            return delete this.cursorToRestore[file]
        }
    }

    openFiles (files, options)
    {
        var file, maxTabs

        console.log('FileHandler.openFiles',files)
        if (_k_.empty(files))
        {
            return
        }
        options = (options != null ? options : {})
        maxTabs = prefs.get('maximalNumberOfTabs',8)
        if (!options.newWindow)
        {
            files = files.slice(0, typeof maxTabs === 'number' ? maxTabs : -1)
        }
        if (files.length >= Math.max(11,maxTabs) && !options.skipCheck)
        {
            window.win.messageBox({type:'warning',buttons:['Cancel','Open All'],defaultId:1,cancelId:0,title:'A Lot of Files Warning',message:`You have selected ${files.length} files.`,detail:'Are you sure you want to open that many files?',cb:(function (answer)
            {
                if (answer === 1)
                {
                    options.skipCheck = true
                    return this.openFiles(ofiles,options)
                }
            }).bind(this)})
            return
        }
        if (_k_.empty(files))
        {
            return []
        }
        window.stash.set('openFilePath',slash.dir(files[0]))
        var list = _k_.list(files)
        for (var _131_17_ = 0; _131_17_ < list.length; _131_17_++)
        {
            file = list[_131_17_]
            ffs.fileExists(slash.removeFilePos(file)).then(function (exists)
            {
                if (!exists)
                {
                    return
                }
                if (options.newWindow)
                {
                    console.log('FileHandler new window with file not implemented!')
                }
                return post.emit('newTabWithFile',file)
            })
        }
        return true
    }

    reloadTab (file)
    {
        if (file === (editor != null ? editor.currentFile : undefined))
        {
            return this.loadFile((editor != null ? editor.currentFile : undefined),{reload:true})
        }
        else
        {
            return post.emit('revertFile',file)
        }
    }

    reloadFile (file)
    {
        var tab

        if (!file)
        {
            return this.reloadActiveTab()
        }
        else if (tab = tabs.tab(file))
        {
            if (tab === tabs.activeTab())
            {
                console.log('FileHandler.reloadFile reloadActiveTab',file)
                return this.reloadActiveTab()
            }
            else
            {
                console.log('FileHandler.reloadFile reload inactive tab',file)
                return tab.reload()
            }
        }
    }

    reloadActiveTab ()
    {
        var tab, _180_29_

        if (tab = tabs.activeTab())
        {
            tab.reload()
        }
        this.loadFile(editor.currentFile,{reload:true})
        if ((editor.currentFile != null))
        {
            return post.toWins('reloadTab',editor.currentFile)
        }
    }

    removeFile (file)
    {
        var neighborTab, tab

        if (tab = tabs.tab(file))
        {
            if (tab === tabs.activeTab())
            {
                if (neighborTab = tab.nextOrPrev())
                {
                    neighborTab.activate()
                }
            }
            return tabs.closeTab(tab)
        }
    }

    saveAll ()
    {
        var tab

        var list = _k_.list(tabs.tabs)
        for (var _205_16_ = 0; _205_16_ < list.length; _205_16_++)
        {
            tab = list[_205_16_]
            if (tab.dirty)
            {
                if (tab === tabs.activeTab())
                {
                    this.saveFile(tab.file)
                }
                else
                {
                    if (!tab.file.startsWith('untitled'))
                    {
                        tab.saveChanges()
                    }
                }
            }
        }
    }

    saveFile (file)
    {
        var tabState

        file = (file != null ? file : editor.currentFile)
        if (!(file != null) || file.startsWith('untitled'))
        {
            this.saveFileAs()
            return
        }
        editor.saveScrollCursorsAndSelections()
        tabState = editor.do.tabState()
        return File.save(file,editor.text(),function (saved)
        {
            if (!saved)
            {
                return console.error('File.save failed!')
            }
            if (saved !== editor.currentFile)
            {
                return post.emit('loadFile',saved)
            }
        })
    }

    addToRecent (file)
    {
        var recent

        recent = window.stash.get('recentFiles',[])
        if (file === _k_.first(recent))
        {
            return
        }
        pull(recent,file)
        recent.unshift(file)
        while (recent.length > prefs.get('recentFilesLength',15))
        {
            recent.pop()
        }
        window.stash.set('recentFiles',recent)
        return window.commandline.commands.open.setHistory(reversed(recent))
    }

    saveChanges ()
    {
        var _266_29_

        if ((editor.currentFile != null) && editor.do.hasChanges())
        {
            return File.save(editor.currentFile,editor.text(),function (file)
            {
                if (!file)
                {
                    console.error(`FileHandler.saveChanges failed ${err}`)
                }
            })
        }
    }

    openFile (opt)
    {
        var cb, dir, _282_18_

        cb = function (files)
        {
            return post.emit('openFiles',files,opt)
        }
        if ((editor != null ? editor.currentFile : undefined))
        {
            dir = slash.dir(editor.currentFile)
        }
        dir = (dir != null ? dir : slash.path('.'))
        return (window.win != null ? window.win.openFileDialog({title:'Open File',defaultPath:window.stash.get('openFilePath',dir),properties:['openFile','multiSelections'],cb:cb}) : undefined)
    }

    saveFileAs ()
    {
        var cb, _302_18_

        cb = (function (file)
        {
            console.log('saveFileAs',file)
            this.addToRecent(file)
            return this.saveFile(file)
        }).bind(this)
        return (window.win != null ? window.win.saveFileDialog({title:'Save File As',defaultPath:slash.unslash((editor != null ? editor.currentDir() : undefined)),cb:cb}) : undefined)
    }
}

export default FileHandler;