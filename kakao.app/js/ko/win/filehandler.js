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
        this.reloadFile = this.reloadFile.bind(this)
        this.openFiles = this.openFiles.bind(this)
        this.onFile = this.onFile.bind(this)
        this.loadFile = this.loadFile.bind(this)
        post.on('saveFileAs',this.saveFileAs)
        post.on('saveFile',this.saveFile)
        post.on('saveChanges',this.saveChanges)
        post.on('loadFile',this.loadFile)
        post.on('openFile',this.openFile)
        post.on('openFiles',this.openFiles)
        post.on('file',this.onFile)
        this.cursorToRestore = {}
    }

    loadFile (file, opt = {})
    {
        var filePos

        if ((file != null) && file.length <= 0)
        {
            file = null
        }
        editor.saveScrollCursorsAndSelections()
        if ((file != null))
        {
            var _39_28_ = slash.splitFilePos(file); file = _39_28_[0]; filePos = _39_28_[1]

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
            post.emit('storeState',kore.get('editor|file'))
            editor.setCurrentFile(file)
            kore.set('editor|file',file)
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
        for (var _108_17_ = 0; _108_17_ < list.length; _108_17_++)
        {
            file = list[_108_17_]
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
                return post.emit('loadFile',file)
            })
        }
        return true
    }

    reloadFile (file)
    {
        if (file === kore.get('editor|file'))
        {
            return this.loadFile(file,{reload:true})
        }
        else
        {
            return post.emit('revertFile',file)
        }
    }

    saveAll ()
    {
        console.log('FileHandler.saveAll not implemented!')
    }

    saveFile (file)
    {
        file = (file != null ? file : kore.get('editor|file'))
        if (!(file != null) || file.startsWith('untitled'))
        {
            this.saveFileAs()
            return
        }
        editor.saveScrollCursorsAndSelections()
        return File.save(file,editor.text(),function (saved)
        {
            if (!saved)
            {
                return console.error('File.save failed!')
            }
            console.log('file saved!!',saved)
            if (saved !== kore.get('editor|file'))
            {
                return post.emit('loadFile',saved)
            }
            else
            {
                return post.emit('reloadFile',saved)
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
        var _202_29_

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
        var cb, dir, _218_18_

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
        var cb, _238_18_

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