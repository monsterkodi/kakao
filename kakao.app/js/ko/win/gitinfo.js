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
        this.diff = this.diff.bind(this)
        this.logChanges = this.logChanges.bind(this)
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

    diff ()
    {
        return this.status(true)
    }

    status (diff)
    {
        var logChanges, onMetaClick

        window.split.raise('terminal')
        window.terminal.clear()
        onMetaClick = this.onMetaClick
        logChanges = this.logChanges
        return Git.status(window.editor.currentFile).then(async function (status)
        {
            var change, changeInfo, file, line, lines, logFile, terminal

            if (_k_.empty(status))
            {
                return
            }
            logFile = function (change, file, status)
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
                return window.terminal.appendMeta({diss:Syntax.dissForTextAndSyntax(`${path}`,'ko'),href:file,clss:'gitInfoFile',click:onMetaClick,line:symbol,lineClss:'gitInfoLine ' + change})
            }
            terminal = window.terminal
            var list = _k_.list(status.deleted)
            for (var _129_21_ = 0; _129_21_ < list.length; _129_21_++)
            {
                file = list[_129_21_]
                logFile('deleted',file,status)
            }
            var list1 = _k_.list(status.added)
            for (var _132_21_ = 0; _132_21_ < list1.length; _132_21_++)
            {
                file = list1[_132_21_]
                logFile('added',file,status)
            }
            var list2 = _k_.list(status.changed)
            for (var _135_21_ = 0; _135_21_ < list2.length; _135_21_++)
            {
                file = list2[_135_21_]
                logFile('changed',file,status)
                if (diff && _k_.in(slash.ext(file),['kode']))
                {
                    changeInfo = await Git.diff(file)
                    console.log(changeInfo.changes)
                    var list3 = _k_.list(changeInfo.changes)
                    for (var _141_31_ = 0; _141_31_ < list3.length; _141_31_++)
                    {
                        change = list3[_141_31_]
                        console.log('change',change)
                        line = change.line
                        if (!_k_.empty(change.mod))
                        {
                            lines = change.mod.map(function (l)
                            {
                                return l.new
                            })
                            logChanges({lines:lines,file:changeInfo.file,line:line,info:change,change:'changed'})
                        }
                        if (!_k_.empty(change.add))
                        {
                            lines = change.add.map(function (l)
                            {
                                return l.new
                            })
                            logChanges({lines:lines,file:changeInfo.file,line:line,info:change,change:'added'})
                        }
                        if (!_k_.empty(change.del))
                        {
                            lines = change.del.map(function (l)
                            {
                                return l.old
                            })
                            logChanges({lines:lines,file:changeInfo.file,line:line,info:change,change:'deleted'})
                        }
                    }
                }
            }
            window.terminal.appendMeta({clss:'spacer'})
            return window.terminal.scroll.cursorToTop(7)
        })
    }
}

export default new GitInfo;