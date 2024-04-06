var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var IGNORE_FILE_EXTS, SOURCE_FILE_EXTS

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let ffs = kxk.ffs

import linediff from "../tools/linediff.js"
import Git from "../tools/Git.js"
import Projects from "../tools/Projects.js"

import Syntax from "../editor/Syntax.js"

SOURCE_FILE_EXTS = ['kode','styl','pug','h','mm','cpp','noon']
IGNORE_FILE_EXTS = ['js','css','json']
class GitInfo
{
    constructor ()
    {
        this.diff = this.diff.bind(this)
        this.logDiff = this.logDiff.bind(this)
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
        var gitDir, line, m, out

        window.split.raise('terminal')
        window.terminal.clear()
        window.terminal.appendMeta({diss:Syntax.dissForTextAndSyntax(`commit ${msg}`,'kode')})
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
            window.terminal.clear()
            var list = _k_.list(out.split('\n'))
            for (var _57_21_ = 0; _57_21_ < list.length; _57_21_++)
            {
                line = list[_57_21_]
                window.terminal.appendMeta({diss:Syntax.dissForTextAndSyntax(line,'kode')})
            }
            window.split.do('maximize editor')
            return Git.status(gitDir)
        }
    }

    logDiff (changes)
    {
        var diff, diffs, dss, extn, index, linesAdded, meta, syntaxName, sytx, text

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
        for (var _86_17_ = 0; _86_17_ < list.length; _86_17_++)
        {
            text = list[_86_17_]
            dss = sytx.getDiss(index)
            if (_k_.empty(dss))
            {
                continue
            }
            switch (changes.change)
            {
                case 'deleted':
                    window.terminal.meta.add({line:window.terminal.numLines(),start:0,end:text.length,clss:'gitInfoDelete'})
                    break
                case 'added':
                    window.terminal.meta.add({line:window.terminal.numLines(),start:0,end:text.length,clss:'gitInfoAdded'})
                    break
                case 'changed':
                    if (linediff.isBoring(changes.info.mod[index].old,changes.info.mod[index].new))
                    {
                        index += 1
                        continue
                    }
                    diffs = linediff(changes.info.mod[index].old,changes.info.mod[index].new)
                    if (_k_.empty(diffs) && !_k_.trim(changes.info.mod[index].old).startsWith("#"))
                    {
                        diffs = linediff(changes.info.mod[index].new,changes.info.mod[index].old)
                        if (!_k_.empty(diffs))
                        {
                            var list1 = _k_.list(diffs)
                            for (var _121_37_ = 0; _121_37_ < list1.length; _121_37_++)
                            {
                                diff = list1[_121_37_]
                                window.terminal.meta.add({line:window.terminal.numLines(),start:diff.index,end:diff.index + diff.length,clss:'gitInfoDelete'})
                            }
                            dss = Syntax.dissForTextAndSyntax(changes.info.mod[index].old,syntaxName)
                        }
                    }
                    break
                default:
                    var list2 = _k_.list(diffs)
                for (var _131_29_ = 0; _131_29_ < list2.length; _131_29_++)
                {
                    diff = list2[_131_29_]
                    window.terminal.meta.add({line:window.terminal.numLines(),start:diff.index,end:diff.index + diff.length,clss:'gitInfoChange'})
                }
            }

            meta = {diss:dss,href:`${changes.file}:${changes.line + index}`,clss:'searchResult',click:this.onMetaClick}
            window.terminal.appendMeta(meta)
            post.emit('search-result',meta)
            linesAdded++
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
        var logDiff, onMetaClick

        window.split.raise('terminal')
        window.terminal.clear()
        onMetaClick = this.onMetaClick
        logDiff = this.logDiff
        return Git.status(window.editor.currentFile).then(async function (status)
        {
            var change, changeInfo, file, line, lines, logFile, text

            if (_k_.empty(status))
            {
                return
            }
            logFile = function (change, file, status, spacer)
            {
                var path, symbol

                if (_k_.in(slash.ext(file),IGNORE_FILE_EXTS))
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
            for (var _198_21_ = 0; _198_21_ < list.length; _198_21_++)
            {
                file = list[_198_21_]
                if (_k_.in(slash.ext(file),SOURCE_FILE_EXTS))
                {
                    logFile('deleted',file,status,diff)
                }
            }
            var list1 = _k_.list(status.added)
            for (var _203_21_ = 0; _203_21_ < list1.length; _203_21_++)
            {
                file = list1[_203_21_]
                if (_k_.in(slash.ext(file),SOURCE_FILE_EXTS))
                {
                    logFile('added',file,status,diff)
                    if (!diff)
                    {
                        continue
                    }
                    text = await ffs.read(file)
                    lines = text.split('\n')
                    logDiff({lines:lines,line:1,file:file,change:'added'})
                }
            }
            var list2 = _k_.list(status.changed)
            for (var _212_21_ = 0; _212_21_ < list2.length; _212_21_++)
            {
                file = list2[_212_21_]
                if (_k_.in(slash.ext(file),SOURCE_FILE_EXTS))
                {
                    logFile('changed',file,status,diff)
                    if (!diff)
                    {
                        continue
                    }
                    changeInfo = await Git.diff(file)
                    var list3 = _k_.list(changeInfo.changes)
                    for (var _220_31_ = 0; _220_31_ < list3.length; _220_31_++)
                    {
                        change = list3[_220_31_]
                        line = change.line
                        if (!_k_.empty(change.mod))
                        {
                            lines = change.mod.map(function (l)
                            {
                                return l.new
                            })
                            logDiff({lines:lines,file:changeInfo.file,line:line,info:change,change:'changed'})
                        }
                        if (!_k_.empty(change.add))
                        {
                            lines = change.add.map(function (l)
                            {
                                return l.new
                            })
                            logDiff({lines:lines,file:changeInfo.file,line:line,info:change,change:'added'})
                        }
                        if (!_k_.empty(change.del))
                        {
                            lines = change.del.map(function (l)
                            {
                                return l.old
                            })
                            logDiff({lines:lines,file:changeInfo.file,line:line,info:change,change:'deleted'})
                        }
                    }
                }
            }
            window.terminal.appendMeta({clss:'spacer'})
            return window.terminal.scroll.cursorToTop(7)
        })
    }

    async history (path)
    {
        var history

        window.split.raise('terminal')
        window.terminal.clear()
        path = (path != null ? path : window.editor.currentFile)
        if (!path)
        {
            return
        }
        console.log('Git.history -- ',path)
        history = await Git.history(path)
        console.log('GitInfo.history ▸',history)
        return history
    }
}

export default new GitInfo;