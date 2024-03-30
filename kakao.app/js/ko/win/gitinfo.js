var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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

    async commit (msg)
    {
        var gitDir, m, out

        if (gitDir = await kakao('fs.git',window.textEditor.currentFile))
        {
            m = msg.join(' ')
            if (_k_.empty(m))
            {
                m = 'misc'
            }
            out = ''
            out += await kakao('app.sh','/usr/bin/git',{cwd:gitDir,arg:"add ."})
            out += await kakao('app.sh','/usr/bin/git',{cwd:gitDir,arg:['commit','-m',m]})
            out += await kakao('app.sh','/usr/bin/git',{cwd:gitDir,arg:"push -q"})
            console.log('out:',out)
        }
    }

    logChanges (changes)
    {
        var diff, diffs, dss, extn, index, isBoring, lineMeta, linesAdded, meta, syntaxName, sytx, text

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
        sytx.setLines(changes.lines)
        linesAdded = 0
        index = 0
        var list = _k_.list(changes.lines)
        for (var _76_17_ = 0; _76_17_ < list.length; _76_17_++)
        {
            text = list[_76_17_]
            isBoring = false
            dss = sytx.getDiss(index)
            if (changes.change === 'deleted')
            {
                dss.map(function (ds)
                {
                    return ds.clss += ' ' + 'git-deleted'
                })
                lineMeta = {line:window.terminal.numLines(),start:0,end:text.length,clss:'gitInfoDelete'}
                window.terminal.meta.add(lineMeta)
            }
            else if (changes.change === 'added')
            {
                lineMeta = {line:window.terminal.numLines(),start:0,end:text.length,clss:'gitInfoAdded'}
                window.terminal.meta.add(lineMeta)
            }
            else if (changes.change === 'changed')
            {
                isBoring = linediff.isBoring(changes.info.mod[index].old,changes.info.mod[index].new)
                if (!isBoring)
                {
                    diffs = linediff(changes.info.mod[index].old,changes.info.mod[index].new)
                    var list1 = _k_.list(diffs)
                    for (var _108_29_ = 0; _108_29_ < list1.length; _108_29_++)
                    {
                        diff = list1[_108_29_]
                        if (diff.change === 'delete')
                        {
                            continue
                        }
                        lineMeta = {line:window.terminal.numLines(),start:diff.new,end:diff.new + diff.length,clss:'gitInfoChange'}
                        window.terminal.meta.add(lineMeta)
                    }
                }
            }
            if (!isBoring)
            {
                meta = {diss:dss,href:`${changes.file}:${changes.line + index}`,clss:'searchResult',click:this.onMetaClick}
                window.terminal.appendMeta(meta)
                post.emit('search-result',meta)
                linesAdded++
            }
            index += 1
        }
        if (linesAdded)
        {
            window.terminal.appendMeta({clss:'spacer'})
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
            var change, changeInfo, file, line, lines, logFile, text

            console.log('status',status)
            if (_k_.empty(status))
            {
                return
            }
            logFile = function (change, file, status, spacer)
            {
                var path, symbol

                if (_k_.in(slash.ext(file),['js','css']))
                {
                    return
                }
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
                window.terminal.appendMeta({diss:Syntax.dissForTextAndSyntax(`${path}`,'ko'),href:file,clss:'gitInfoFile',click:onMetaClick,line:symbol,lineClss:'gitInfoLine ' + change})
                if (spacer)
                {
                    return window.terminal.appendMeta({clss:'spacer'})
                }
            }
            var list = _k_.list(status.deleted)
            for (var _177_21_ = 0; _177_21_ < list.length; _177_21_++)
            {
                file = list[_177_21_]
                if (_k_.in(slash.ext(file),['kode','styl','pug']))
                {
                    logFile('deleted',file,status,diff)
                }
            }
            var list1 = _k_.list(status.added)
            for (var _182_21_ = 0; _182_21_ < list1.length; _182_21_++)
            {
                file = list1[_182_21_]
                if (_k_.in(slash.ext(file),['kode','styl','pug']))
                {
                    logFile('added',file,status,diff)
                    if (!diff)
                    {
                        continue
                    }
                    text = await ffs.read(file)
                    lines = text.split('\n')
                    logChanges({lines:lines,line:1,file:file,change:'added'})
                }
            }
            var list2 = _k_.list(status.changed)
            for (var _191_21_ = 0; _191_21_ < list2.length; _191_21_++)
            {
                file = list2[_191_21_]
                if (_k_.in(slash.ext(file),['kode','styl','pug']))
                {
                    logFile('changed',file,status,diff)
                    if (!diff)
                    {
                        continue
                    }
                    changeInfo = await Git.diff(file)
                    var list3 = _k_.list(changeInfo.changes)
                    for (var _199_31_ = 0; _199_31_ < list3.length; _199_31_++)
                    {
                        change = list3[_199_31_]
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