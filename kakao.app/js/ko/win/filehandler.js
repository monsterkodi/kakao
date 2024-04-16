var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}}

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
        this.onSaveDialog = this.onSaveDialog.bind(this)
        this.saveFileAs = this.saveFileAs.bind(this)
        this.saveChanges = this.saveChanges.bind(this)
        this.saveFile = this.saveFile.bind(this)
        this.reloadFile = this.reloadFile.bind(this)
        this.openFile = this.openFile.bind(this)
        this.onFile = this.onFile.bind(this)
        this.loadFile = this.loadFile.bind(this)
        post.on('saveFileAs',this.saveFileAs)
        post.on('saveFile',this.saveFile)
        post.on('saveChanges',this.saveChanges)
        post.on('loadFile',this.loadFile)
        post.on('openFile',this.openFile)
        post.on('file',this.onFile)
        post.on('reloadFile',this.reloadFile)
        post.on('openDialog',this.onOpenDialog)
        post.on('saveDialog',this.onSaveDialog)
        this.cursorToRestore = {}
    }

    loadFile (file, opt = {})
    {
        var filePos

        if ((file != null) && file.length <= 0)
        {
            file = null
        }
        editor.saveFilePosition()
        if ((file != null))
        {
            var _41_28_ = slash.splitFilePos(file); file = _41_28_[0]; filePos = _41_28_[1]

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
            if (editor.currentFile && editor.currentFile !== kore.get('editor|file'))
            {
                console.log('WTF!?',editor.currentFile,kore.get('editor|file'))
            }
            post.emit('storeState',kore.get('editor|file'),editor.do.tabState())
            editor.setCurrentFile(file)
            kore.set('editor|file',file)
            editor.restoreFilePosition()
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

    openFile (openDialogOpt)
    {
        this.openDialogOpt = openDialogOpt
    
        return kakao('fs.openDialog')
    }

    onOpenDialog (files)
    {
        var file, maxTabs, options, _92_33_

        if (_k_.empty(files))
        {
            return
        }
        options = ((_92_33_=this.openDialogOpt) != null ? _92_33_ : {})
        console.log('FileHandler.onOpenDialog',files,options)
        maxTabs = prefs.get('maximalNumberOfTabs',8)
        if (!options.newWindow)
        {
            files = files.slice(0, typeof maxTabs === 'number' ? maxTabs : -1)
        }
        if (files.length > maxTabs && !options.skipCheck)
        {
            console.log('messageBox for too may files not implemented!')
            return
        }
        if (_k_.empty(files))
        {
            return []
        }
        var list = _k_.list(files)
        for (var _121_17_ = 0; _121_17_ < list.length; _121_17_++)
        {
            file = list[_121_17_]
            if (options.newWindow)
            {
                console.log('FileHandler new window with file not implemented!')
            }
            post.emit('newTabWithFile',file)
        }
        post.emit('loadFile',_k_.last(files))
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

    saveFile (file)
    {
        file = (file != null ? file : kore.get('editor|file'))
        if (!(file != null) || file.startsWith('untitled'))
        {
            this.saveFileAs()
            return
        }
        editor.saveFilePosition()
        return File.save(file,editor.text(),function (saved)
        {
            var close

            if (!saved)
            {
                return console.error('File.save failed!')
            }
            if (saved !== kore.get('editor|file'))
            {
                close = kore.get('editor|file')
                post.emit('loadFile',saved)
                if (close.startsWith('untitled-'))
                {
                    return post.emit('delTab',close)
                }
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
        var _196_29_

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

    saveFileAs ()
    {
        return kakao('fs.saveDialog',slash.dir(kore.get('editor|file')))
    }

    onSaveDialog (file)
    {
        this.addToRecent(file)
        return this.saveFile(file)
    }
}

export default FileHandler;