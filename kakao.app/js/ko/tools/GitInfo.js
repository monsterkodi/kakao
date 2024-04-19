var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var IGNORE_FILE_EXTS, SOURCE_FILE_EXTS, spacer

import kxk from "../../kxk.js"
let linediff = kxk.linediff
let post = kxk.post
let slash = kxk.slash
let ffs = kxk.ffs
let kstr = kxk.kstr

import Git from "./Git.js"
import Projects from "./Projects.js"

import Syntax from "../editor/Syntax.js"

SOURCE_FILE_EXTS = ['kode','styl','pug','h','mm','cpp','noon']
IGNORE_FILE_EXTS = ['js','css','json','html']

spacer = function ()
{
    return window.terminal.appendMeta({clss:'spacer'})
}
class GitInfo
{
    constructor ()
    {
        this.onMetaClick = this.onMetaClick.bind(this)
        this.logDiff = this.logDiff.bind(this)
        this.logChanges = this.logChanges.bind(this)
    }

    async history (path)
    {
        var change, commit, file, gitDir, history, symbol, text

        path = (path != null ? path : window.editor.currentFile)
        if (!path)
        {
            return
        }
        window.split.raise('terminal')
        window.terminal.clear()
        window.terminal.singleCursorAtPos([0,0])
        gitDir = await kakao('fs.git',path)
        history = await Git.history()
        var list = _k_.list(history)
        for (var _40_19_ = 0; _40_19_ < list.length; _40_19_++)
        {
            commit = list[_40_19_]
            text = `${commit.msg}`
            window.terminal.queueMeta({diss:Syntax.dissForTextAndSyntax(text,'git'),text:text,clss:'gitInfoFile',href:`macro diff ${commit.commit}`,click:this.onMetaClick})
            var list1 = _k_.list(commit.files)
            for (var _53_21_ = 0; _53_21_ < list1.length; _53_21_++)
            {
                file = list1[_53_21_]
                if (_k_.in(slash.ext(file.path),['js','css','html','json']))
                {
                    continue
                }
                symbol = ((function ()
                {
                    switch (file.type)
                    {
                        case 'M':
                            return ' '

                        case 'A':
                            return '■'

                        case 'D':
                            return '✘'

                        default:
                            return '▶'
                    }

                }).bind(this))()
                change = ((function ()
                {
                    switch (file.type)
                    {
                        case 'M':
                            return 'changed'

                        case 'A':
                            return 'added'

                        case 'D':
                            return 'deleted'

                        default:
                            return 'renamed'
                    }

                }).bind(this))()
                text = `        ${slash.tilde(file.path)}`
                window.terminal.queueMeta({diss:Syntax.dissForTextAndSyntax(text,'git'),text:text,clss:'gitInfoFile',href:`${gitDir}/${file.path}`,click:this.onMetaClick,line:symbol,lineClss:'gitInfoLine ' + change})
            }
        }
        return window.terminal.singleCursorAtPos([0,0])
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
            for (var _105_21_ = 0; _105_21_ < list.length; _105_21_++)
            {
                line = list[_105_21_]
                window.terminal.appendMeta({diss:Syntax.dissForTextAndSyntax(line,'kode')})
            }
            window.split.do('maximize editor')
            return Git.status(gitDir)
        }
    }

    async diff (revs)
    {
        var gitDir, p, patch, path

        if (_k_.empty(revs))
        {
            return this.status(true)
        }
        else
        {
            window.split.raise('terminal')
            window.terminal.clear()
            gitDir = await kakao('fs.git',editor.currentFile)
            patch = await Git.patch(revs[0])
            var list = _k_.list(patch)
            for (var _129_18_ = 0; _129_18_ < list.length; _129_18_++)
            {
                p = list[_129_18_]
                path = slash.path(gitDir,p.srcfile.slice(2))
                if (_k_.in(slash.ext(path),IGNORE_FILE_EXTS))
                {
                    continue
                }
                window.terminal.appendMeta({diss:Syntax.dissForTextAndSyntax(`${path}`,'ko'),href:path,clss:'gitInfoFile',click:this.onMetaClick,line:'●',lineClss:'gitInfoLine changed'})
                if (_k_.isArr(p.changes))
                {
                    this.logChanges(gitDir,path,p.changes)
                    spacer()
                }
            }
        }
    }

    logChanges (gitDir, path, changes)
    {
        var aline, an, change, dline, dn, ds, dss, line, linfo

        var list = _k_.list(changes)
        for (var _156_19_ = 0; _156_19_ < list.length; _156_19_++)
        {
            change = list[_156_19_]
            spacer()
            linfo = change.lineinfo.split(' ')
            if (linfo[0][0] === '-' && linfo[1][0] === '+')
            {
                var _162_28_ = linfo[0].slice(1).split(',').map(function (i)
                {
                    return parseInt(i)
                }); dline = _162_28_[0]; dn = _162_28_[1]

                var _163_28_ = linfo[1].slice(1).split(',').map(function (i)
                {
                    return parseInt(i)
                }); aline = _163_28_[0]; an = _163_28_[1]

                if (!(_k_.isNum(dn)))
                {
                    dn = 1
                }
                if (!(_k_.isNum(an)))
                {
                    an = 1
                }
            }
            var list1 = _k_.list(change.changedlines)
            for (var _167_21_ = 0; _167_21_ < list1.length; _167_21_++)
            {
                line = list1[_167_21_]
                switch (line.type)
                {
                    case '-':
                        dss = Syntax.dissForTextAndSyntax(line.line,slash.ext(path))
                        var list2 = _k_.list(dss)
                        for (var _172_31_ = 0; _172_31_ < list2.length; _172_31_++)
                        {
                            ds = list2[_172_31_]
                            ds.clss += ' ' + 'git-deleted'
                        }
                        window.terminal.appendMeta({diss:dss,href:path + ':' + dline,clss:'gitInfoDelete',click:this.onMetaClick,line:'✘'})
                        dline++
                        break
                    case '+':
                        window.terminal.appendMeta({diss:Syntax.dissForTextAndSyntax(line.line,slash.ext(path)),href:path + ':' + aline,clss:'gitInfoAdded',click:this.onMetaClick})
                        aline++
                        break
                }

            }
        }
    }

    logDiff (changes)
    {
        var diff, diffs, ds, dss, extn, index, linesAdded, metas, syntaxName, text

        extn = slash.ext(changes.file)
        if (_k_.in(extn,Syntax.syntaxNames))
        {
            syntaxName = extn
        }
        else
        {
            syntaxName = 'txt'
        }
        linesAdded = 0
        index = 0
        var list = _k_.list(changes.lines)
        for (var _207_17_ = 0; _207_17_ < list.length; _207_17_++)
        {
            text = list[_207_17_]
            dss = Syntax.dissForTextAndSyntax(text,syntaxName)
            if (_k_.empty(dss))
            {
                continue
            }
            switch (changes.change)
            {
                case 'deleted':
                    var list1 = _k_.list(dss)
                    for (var _217_27_ = 0; _217_27_ < list1.length; _217_27_++)
                    {
                        ds = list1[_217_27_]
                        ds.clss += ' ' + 'git-deleted'
                    }
                    window.terminal.appendMeta({line:'✘',diss:dss,href:`${changes.file}:${changes.line + index}`,clss:'gitInfoDelete',click:this.onMetaClick})
                    break
                case 'added':
                    window.terminal.appendMeta({diss:dss,href:`${changes.file}:${changes.line + index}`,clss:'gitInfoAdded',click:this.onMetaClick})
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
                            metas = []
                            var list2 = _k_.list(diffs)
                            for (var _250_37_ = 0; _250_37_ < list2.length; _250_37_++)
                            {
                                diff = list2[_250_37_]
                                metas.push({start:diff.index,end:diff.index + diff.length,clss:'gitInfoChange'})
                            }
                            dss = Syntax.dissForTextAndSyntax(changes.info.mod[index].old,syntaxName)
                            window.terminal.appendMeta({diss:dss,href:`${changes.file}:${changes.line + index}`,clss:'gitInfoDelete',click:this.onMetaClick,metas:metas})
                        }
                    }
                    else
                    {
                        metas = []
                        var list3 = _k_.list(diffs)
                        for (var _268_33_ = 0; _268_33_ < list3.length; _268_33_++)
                        {
                            diff = list3[_268_33_]
                            metas.push({start:diff.index,end:diff.index + diff.length,clss:'gitInfoChange'})
                        }
                        window.terminal.appendMeta({diss:dss,href:`${changes.file}:${changes.line + index}`,clss:'gitInfoAdded',click:this.onMetaClick,metas:metas})
                    }
                    break
                default:
                    console.log('CHANGE EVER COME HERE?')
                    var list4 = _k_.list(diffs)
                for (var _284_29_ = 0; _284_29_ < list4.length; _284_29_++)
                {
                    diff = list4[_284_29_]
                    window.terminal.appendMeta({line:window.terminal.numLines(),start:diff.index,end:diff.index + diff.length,clss:'gitInfoChange'})
                }
            }

            linesAdded++
            index += 1
        }
        if (linesAdded)
        {
            window.terminal.appendMeta({clss:'spacer'})
        }
        return index
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
            for (var _341_21_ = 0; _341_21_ < list.length; _341_21_++)
            {
                file = list[_341_21_]
                if (_k_.in(slash.ext(file),SOURCE_FILE_EXTS))
                {
                    logFile('deleted',file,status,diff)
                }
            }
            var list1 = _k_.list(status.added)
            for (var _346_21_ = 0; _346_21_ < list1.length; _346_21_++)
            {
                file = list1[_346_21_]
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
            if (diff)
            {
                var list2 = _k_.list(status.changed.filter(function (f)
                {
                    return _k_.in(slash.ext(f),SOURCE_FILE_EXTS)
                }))
                for (var _356_25_ = 0; _356_25_ < list2.length; _356_25_++)
                {
                    file = list2[_356_25_]
                    logFile('changed',file,status,NaN)
                    changeInfo = await Git.diff(file)
                    var list3 = _k_.list(changeInfo.changes)
                    for (var _362_31_ = 0; _362_31_ < list3.length; _362_31_++)
                    {
                        change = list3[_362_31_]
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

    onMetaClick (meta, event)
    {
        var href

        if (href = meta[2].href)
        {
            if (href.startsWith('macro '))
            {
                window.commandline.startCommand('macro')
                window.commandline.hideList()
                if (href.slice(6).startsWith('diff'))
                {
                    window.commandline.setText('history')
                }
                else
                {
                    window.commandline.setText(href.slice(6))
                }
                window.commandline.command.execute(href.slice(6))
            }
            else
            {
                if (href.indexOf(':') > 0)
                {
                    href += ':' + window.terminal.posForEvent(event)[0]
                }
                post.emit('loadFile',href)
            }
        }
        return 'unhandled'
    }
}

export default new GitInfo;