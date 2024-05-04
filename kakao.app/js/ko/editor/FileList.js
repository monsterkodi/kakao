var _k_

var FileList

import kxk from "../../kxk.js"
let slash = kxk.slash
let drag = kxk.drag
let elem = kxk.elem
let post = kxk.post

import Syntax from "./Syntax.js"


FileList = (function ()
{
    function FileList (editor)
    {
        this.editor = editor
    
        this["onClick"] = this["onClick"].bind(this)
        this["onAdd"] = this["onAdd"].bind(this)
        this["onClear"] = this["onClear"].bind(this)
        this["onEditorScrollOrCursor"] = this["onEditorScrollOrCursor"].bind(this)
        this["toggle"] = this["toggle"].bind(this)
        this["onDragMove"] = this["onDragMove"].bind(this)
        this.elem = elem({class:'filelist'})
        this.editor.view.appendChild(this.elem)
        this.editor.scroll.on('scroll',this.onEditorScrollOrCursor)
        this.editor.on('cursor',this.onEditorScrollOrCursor)
        post.on('list.toggle',this.toggle)
        post.on('filelist.clear',this.onClear)
        post.on('filelist.add',this.onAdd)
        this.drag = new drag({target:this.elem,onStart:this.onDragMove,onMove:this.onDragMove})
        this.toggle()
    }

    FileList.prototype["onDragMove"] = function (drag, event)
    {
        return this.onClick(event)
    }

    FileList.prototype["toggle"] = function ()
    {
        var filelistActive

        filelistActive = prefs.get('list|active',true)
        this.elem.style.display = (filelistActive ? 'inherit' : 'none')
        return this.onEditorScrollOrCursor()
    }

    FileList.prototype["onEditorScrollOrCursor"] = function ()
    {
        var botLine, mainLine, scroll, topLine

        scroll = this.editor.scroll.scroll
        topLine = parseInt(scroll / this.editor.scroll.lineHeight)
        botLine = topLine + this.editor.numFullLines()
        return mainLine = this.editor.mainCursor()[1] + 1
    }

    FileList.prototype["onClear"] = function ()
    {
        return this.elem.innerHTML = ''
    }

    FileList.prototype["onAdd"] = function (path, line)
    {
        var e, file

        file = slash.file(path)
        e = elem({class:'filelist-item',parent:this.elem,click:this.onClick,html:Syntax.spanForTextAndSyntax(file,'browser')})
        e.path = path
        return e.line = line
    }

    FileList.prototype["onClick"] = function (event)
    {
        var e

        e = elem.upElem(event,{prop:'path'})
        window.terminal.singleCursorAtPos([0,e.line - 1])
        return window.split.do("focus terminal")
    }

    return FileList
})()

export default FileList;