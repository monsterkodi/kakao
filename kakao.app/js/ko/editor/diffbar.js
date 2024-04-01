var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../kxk.js"
let elem = kxk.elem
let post = kxk.post

import linediff from "../tools/linediff.js"
import Git from "../tools/Git.js"

class Diffbar
{
    constructor (editor)
    {
        this.editor = editor
    
        this.updateScroll = this.updateScroll.bind(this)
        this.update = this.update.bind(this)
        this.onEditorFile = this.onEditorFile.bind(this)
        this.onMetaClick = this.onMetaClick.bind(this)
        this.elem = elem('canvas',{class:'diffbar'})
        this.elem.style.position = 'absolute'
        this.elem.style.left = '0'
        this.elem.style.top = '0'
        this.editor.view.appendChild(this.elem)
        this.editor.on('file',this.onEditorFile)
        this.editor.on('undone',this.update)
        this.editor.on('redone',this.update)
        this.editor.on('linesShown',this.updateScroll)
        post.on('gitStatus',this.update)
        post.on('gitDiff',this.update)
    }

    onMetaClick (meta, event)
    {
        var blockIndices

        if (event.metaKey)
        {
            return 'unhandled'
        }
        if (event.ctrlKey)
        {
            this.editor.singleCursorAtPos(rangeStartPos(meta))
            this.editor.toggleGitChangesInLines([meta[0]])
        }
        else
        {
            blockIndices = this.lineIndicesForBlockAtLine(meta[0])
            this.editor.do.start()
            this.editor.do.setCursors(blockIndices.map(function (i)
            {
                return [0,i]
            }))
            this.editor.do.end()
            this.editor.toggleGitChangesInLines(blockIndices)
        }
        return this
    }

    gitMetasAtLineIndex (li)
    {
        return this.editor.meta.metasAtLineIndex(li).filter(function (m)
        {
            return m[2].clss.startsWith('git')
        })
    }

    lineIndicesForBlockAtLine (li)
    {
        var ai, bi, lines, metas, toggled

        lines = []
        if (!_k_.empty((metas = this.gitMetasAtLineIndex(li))))
        {
            toggled = metas[0][2].toggled
            lines.push(li)
            bi = li - 1
            while (!_k_.empty((metas = this.gitMetasAtLineIndex(bi))))
            {
                if (metas[0][2].toggled !== toggled)
                {
                    break
                }
                lines.unshift(bi)
                bi--
            }
            ai = li + 1
            while (!_k_.empty((metas = this.gitMetasAtLineIndex(ai))))
            {
                if (metas[0][2].toggled !== toggled)
                {
                    break
                }
                lines.push(ai)
                ai++
            }
        }
        return lines
    }

    updateMetas ()
    {
        var add, boring, change, li, meta, mod, mods, _116_25_, _118_33_, _134_30_, _136_33_, _93_30_, _93_39_, _99_25_

        this.clearMetas()
        if (!((_93_30_=this.changes) != null ? (_93_39_=_93_30_.changes) != null ? _93_39_.length : undefined : undefined))
        {
            return
        }
        var list = _k_.list(this.changes.changes)
        for (var _95_19_ = 0; _95_19_ < list.length; _95_19_++)
        {
            change = list[_95_19_]
            boring = this.isBoring(change)
            if ((change.mod != null))
            {
                li = change.line - 1
                var list1 = _k_.list(change.mod)
                for (var _103_24_ = 0; _103_24_ < list1.length; _103_24_++)
                {
                    mod = list1[_103_24_]
                    meta = {line:li,clss:'git mod' + (boring && ' boring' || ''),git:'mod',change:mod,boring:boring,length:change.mod.length,click:this.onMetaClick}
                    this.editor.meta.addDiffMeta(meta)
                    li++
                }
            }
            if ((change.add != null))
            {
                mods = (change.mod != null) && change.mod.length || 0
                li = change.line - 1 + mods
                var list2 = _k_.list(change.add)
                for (var _121_24_ = 0; _121_24_ < list2.length; _121_24_++)
                {
                    add = list2[_121_24_]
                    meta = {line:li,clss:'git add' + (boring && ' boring' || ''),git:'add',change:add,length:change.add.length,boring:boring,click:this.onMetaClick}
                    this.editor.meta.addDiffMeta(meta)
                    li++
                }
            }
            else if ((change.del != null))
            {
                mods = (change.mod != null) && change.mod.length || 1
                li = change.line - 1 + mods
                meta = {line:li,clss:'git del' + (boring && ' boring' || ''),git:'del',change:change.del,length:1,boring:boring,click:this.onMetaClick}
                this.editor.meta.addDiffMeta(meta)
            }
        }
    }

    isBoring (change)
    {
        var c, _158_21_, _162_21_, _166_21_

        if ((change.mod != null))
        {
            var list = _k_.list(change.mod)
            for (var _159_18_ = 0; _159_18_ < list.length; _159_18_++)
            {
                c = list[_159_18_]
                if (!linediff.isBoring(c.old,c.new))
                {
                    return false
                }
            }
        }
        if ((change.add != null))
        {
            var list1 = _k_.list(change.add)
            for (var _163_18_ = 0; _163_18_ < list1.length; _163_18_++)
            {
                c = list1[_163_18_]
                if (!_k_.empty(c.new.trim()))
                {
                    return false
                }
            }
        }
        if ((change.del != null))
        {
            var list2 = _k_.list(change.del)
            for (var _167_18_ = 0; _167_18_ < list2.length; _167_18_++)
            {
                c = list2[_167_18_]
                if (!_k_.empty(c.old.trim()))
                {
                    return false
                }
            }
        }
        return true
    }

    onEditorFile ()
    {
        return this.update()
    }

    update ()
    {
        if (this.editor.currentFile)
        {
            return Git.diff(this.editor.currentFile).then((function (changes)
            {
                this.changes = changes
                this.updateMetas()
                return this.updateScroll()
            }).bind(this))
        }
        else
        {
            this.changes = null
            this.updateMetas()
            this.updateScroll()
            return this.editor.emit('diffbarUpdated',this.changes)
        }
    }

    updateScroll ()
    {
        var alpha, boring, ctx, h, length, lh, li, meta, w, _226_45_

        w = 2
        h = this.editor.scroll.viewHeight
        lh = h / this.editor.numLines()
        ctx = this.elem.getContext('2d')
        this.elem.width = w
        this.elem.height = h
        alpha = function (o)
        {
            return 0.5 + Math.max(0,(16 - o * lh) * (0.5 / 16))
        }
        if (this.changes)
        {
            var list = _k_.list(this.editor.meta.metas)
            for (var _224_21_ = 0; _224_21_ < list.length; _224_21_++)
            {
                meta = list[_224_21_]
                if (!((meta != null ? meta[2] != null ? meta[2].git : undefined : undefined) != null))
                {
                    continue
                }
                li = meta[0]
                length = meta[2].length
                boring = meta[2].boring
                ctx.fillStyle = ((function ()
                {
                    switch (meta[2].git)
                    {
                        case 'mod':
                            if (boring)
                            {
                                return `rgba(50, 50,50,${alpha(length)})`
                            }
                            else
                            {
                                return `rgba( 0,255, 0,${alpha(length)})`
                            }
                            break
                        case 'del':
                            if (boring)
                            {
                                return `rgba(50,50,50,${alpha(length)})`
                            }
                            else
                            {
                                return `rgba(255,0,0,${alpha(length)})`
                            }
                            break
                        case 'add':
                            if (boring)
                            {
                                return `rgba(50,50,50,${alpha(length)})`
                            }
                            else
                            {
                                return `rgba(160,160,255,${alpha(length)})`
                            }
                            break
                    }

                }).bind(this))()
                ctx.fillRect(0,li * lh,w,lh)
            }
        }
    }

    clear ()
    {
        this.clearMetas()
        return this.elem.width = 2
    }

    clearMetas ()
    {
        return this.editor.meta.delClass('git')
    }
}

export default Diffbar;