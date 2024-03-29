var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import post from "../../kxk/post.js"

import slash from "../../kxk/slash.js"

import ffs from "../../kxk/ffs.js"

import linediff from "../tools/linediff.js"

import Git from "../tools/Git.js"

import Syntax from "../editor/Syntax.js"

class GitInfo
{
    constructor ()
    {
        this.onMetaClick = this.onMetaClick.bind(this)
    }

    onMetaClick (meta, event)
    {
        var href

        if (href = meta[2].href)
        {
            href += ':' + window.terminal.posForEvent(event)[0]
            post.emit('openFiles',[href],{newTab:event.metaKey})
        }
        return 'unhandled'
    }

    logText (text)
    {
        return window.terminal.appendMeta({clss:'searchHeader',diss:Syntax.dissForTextAndSyntax(text,'ko')})
    }

    logChanges (changes)
    {
        var diff, diffs, dss, extn, index, lineMeta, meta, syntaxName, sytx, text

        extn = slash.ext(changes.file)
        if (_k_.in(extn,Syntax.syntaxNames))
        {
            syntaxName = extn
        }
        else
        {
            syntaxName = 'txt'
        }
        sytx = new Syntax(syntaxName,function (i)
        {
            return changes.lines[i]
        })
        index = 0
        var list = _k_.list(changes.lines)
        for (var _56_17_ = 0; _56_17_ < list.length; _56_17_++)
        {
            text = list[_56_17_]
            dss = sytx.getDiss(index)
            if (changes.change === 'deleted')
            {
                dss.map(function (ds)
                {
                    return ds.clss += ' ' + 'git-deleted'
                })
            }
            else if (changes.change === 'changed')
            {
                diffs = linediff(changes.info.mod[index].old,changes.info.mod[index].new)
                var list1 = _k_.list(diffs)
                for (var _67_25_ = 0; _67_25_ < list1.length; _67_25_++)
                {
                    diff = list1[_67_25_]
                    if (diff.change === 'delete')
                    {
                        continue
                    }
                    lineMeta = {line:window.terminal.numLines(),start:diff.new,end:diff.new + diff.length,clss:'gitInfoChange'}
                    window.terminal.meta.add(lineMeta)
                }
            }
            meta = {diss:dss,href:`${changes.file}:${changes.line + index}`,clss:'searchResult',click:this.onMetaClick}
            window.terminal.appendMeta(meta)
            post.emit('search-result',meta)
            index += 1
        }
        return index
    }

    logFile (change, file, status)
    {
        var path, symbol

        symbol = ((function ()
        {
            switch (change)
            {
                case 'changed':
                    return '●'

                case 'added':
                    return '◼'

                case 'deleted':
                    return '✘'

            }

        }).bind(this))()
        path = slash.relative(file,status.gitDir)
        return window.terminal.appendMeta({diss:Syntax.dissForTextAndSyntax(`${path}`,'ko'),href:file,clss:'gitInfoFile',click:this.onMetaClick,line:symbol,lineClss:'gitInfoLine ' + change})
    }

    start ()
    {
        window.split.raise('terminal')
        window.terminal.clear()
        return Git.status(window.editor.currentFile).then((function (status)
        {
            var file, terminal

            if (_k_.empty(status))
            {
                return
            }
            terminal = window.terminal
            var list = _k_.list(status.deleted)
            for (var _130_21_ = 0; _130_21_ < list.length; _130_21_++)
            {
                file = list[_130_21_]
                this.logFile('deleted',file,status)
            }
            var list1 = _k_.list(status.added)
            for (var _133_21_ = 0; _133_21_ < list1.length; _133_21_++)
            {
                file = list1[_133_21_]
                this.logFile('added',file,status)
            }
            var list2 = _k_.list(status.changed)
            for (var _136_21_ = 0; _136_21_ < list2.length; _136_21_++)
            {
                file = list2[_136_21_]
                this.logFile('changed',file,status)
            }
            return terminal.scroll.cursorToTop(7)
        }).bind(this))
    }
}

export default new GitInfo;