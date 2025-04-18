var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var IGNORE_FILE_EXTS, SOURCE_FILE_EXTS

import kxk from "../../kxk.js"
let linediff = kxk.linediff
let post = kxk.post
let slash = kxk.slash
let ffs = kxk.ffs
let kstr = kxk.kstr

import Syntax from "../editor/Syntax.js"

import Git from "./Git.js"
import Projects from "./Projects.js"

SOURCE_FILE_EXTS = ['kode','styl','pug','h','mm','cpp','noon']
IGNORE_FILE_EXTS = ['js','css','json','html']
class GitInfo
{
    constructor ()
    {
        this.onMetaClick = this.onMetaClick.bind(this)
        this.logDiff = this.logDiff.bind(this)
        this.logChanges = this.logChanges.bind(this)
        this.log = this.log.bind(this)
        this.diff = this.diff.bind(this)
        this.history = this.history.bind(this)
        post.on('git.log',this.log)
        post.on('git.diff',this.diff)
        post.on('git.status',this.status)
        post.on('git.commit',this.commit)
        post.on('git.history',this.history)
    }

    history (path)
    {
        return this.doHistory(path)
    }

    async doHistory (path)
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
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            commit = list[_a_]
            text = `${commit.msg}`
            window.terminal.queueMeta({diss:Syntax.dissForTextAndSyntax(text,'git'),text:text,clss:'gitInfoFile',href:`macro log ${commit.commit}`,click:this.onMetaClick,line:'●'})
            var list1 = _k_.list(commit.files)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                file = list1[_b_]
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
        window.split.do('minimize editor')
        window.split.do('focus terminal')
        return window.terminal.singleCursorAtPos([0,0])
    }

    async commit (msg)
    {
        var gitDir, line, m, out

        window.split.raise('terminal')
        window.terminal.clear()
        window.terminal.appendMeta({diss:Syntax.dissForTextAndSyntax(`commit ${msg}`,'kode')})
        console.log('GitInfo.commit',msg)
        console.log('GitInfo.commit editor|file',kore.get('editor|file'))
        console.log('GitInfo.commit currentFile',window.textEditor.currentFile)
        console.log('GitInfo.commit Projects.current',Projects.current())
        gitDir = Projects.dir(kore.get('editor|file'))
        gitDir = (gitDir != null ? gitDir : Projects.current())
        if (_k_.empty(gitDir))
        {
            gitDir = await kakao('fs.git',kore.get('editor|file'))
        }
        if (gitDir)
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
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                line = list[_a_]
                window.terminal.appendMeta({diss:Syntax.dissForTextAndSyntax(line,'kode')})
            }
            window.split.do('maximize editor')
            return Git.status(gitDir)
        }
    }

    diff (prjDir)
    {
        window.commandline.startCommand('macro')
        this.status({diff:true,prjDir:prjDir})
        window.split.do('minimize editor')
        window.commandline.setText('commit ')
        return window.commandline.selectNone()
    }

    log (rev)
    {
        return this.doLog(rev)
    }

    async doLog (rev)
    {
        var gitDir, p, patch, path

        window.split.raise('terminal')
        window.terminal.clear()
        gitDir = await kakao('fs.git',editor.currentFile)
        patch = await Git.patch(rev)
        var list = _k_.list(patch)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            p = list[_a_]
            path = slash.path(gitDir,p.srcfile.slice(2))
            if (_k_.in(slash.ext(path),IGNORE_FILE_EXTS))
            {
                continue
            }
            window.terminal.appendMeta({diss:Syntax.dissForTextAndSyntax(`${path}`,'ko'),href:path,list:path,clss:'gitInfoFile',click:this.onMetaClick,line:'●',lineClss:'gitInfoLine changed'})
            if (_k_.isArr(p.changes))
            {
                this.logChanges(gitDir,path,p.changes)
                window.terminal.appendMeta({clss:'spacer'})
            }
        }
        return window.terminal.do.resetHistory()
    }

    logChanges (gitDir, path, changes)
    {
        var aline, an, change, dline, dn, ds, dss, line, linfo

        var list = _k_.list(changes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            change = list[_a_]
            window.terminal.appendMeta({clss:'spacer'})
            linfo = change.lineinfo.split(' ')
            if (linfo[0][0] === '-' && linfo[1][0] === '+')
            {
                var _b_ = linfo[0].slice(1).split(',').map(function (i)
                {
                    return parseInt(i)
                }); dline = _b_[0]; dn = _b_[1]

                var _c_ = linfo[1].slice(1).split(',').map(function (i)
                {
                    return parseInt(i)
                }); aline = _c_[0]; an = _c_[1]

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
            for (var _d_ = 0; _d_ < list1.length; _d_++)
            {
                line = list1[_d_]
                switch (line.type)
                {
                    case '-':
                        dss = Syntax.dissForTextAndSyntax(line.line,slash.ext(path))
                        var list2 = _k_.list(dss)
                        for (var _e_ = 0; _e_ < list2.length; _e_++)
                        {
                            ds = list2[_e_]
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
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            text = list[_a_]
            dss = Syntax.dissForTextAndSyntax(text,syntaxName)
            if (_k_.empty(dss))
            {
                continue
            }
            switch (changes.change)
            {
                case 'deleted':
                    var list1 = _k_.list(dss)
                    for (var _b_ = 0; _b_ < list1.length; _b_++)
                    {
                        ds = list1[_b_]
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
                            for (var _c_ = 0; _c_ < list2.length; _c_++)
                            {
                                diff = list2[_c_]
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
                        for (var _d_ = 0; _d_ < list3.length; _d_++)
                        {
                            diff = list3[_d_]
                            metas.push({start:diff.index,end:diff.index + diff.length,clss:'gitInfoChange'})
                        }
                        window.terminal.appendMeta({diss:dss,href:`${changes.file}:${changes.line + index}`,clss:'gitInfoAdded',click:this.onMetaClick,metas:metas})
                    }
                    break
                default:
                    console.log('CHANGE EVER COME HERE?')
                    var list4 = _k_.list(diffs)
                for (var _e_ = 0; _e_ < list4.length; _e_++)
                {
                    diff = list4[_e_]
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

    async status (opt = {})
    {
        var logDiff, onMetaClick, _346_19_, _347_19_

        opt.diff = ((_346_19_=opt.diff) != null ? _346_19_ : false)
        opt.prjDir = ((_347_19_=opt.prjDir) != null ? _347_19_ : Projects.dir(editor.currentFile))
        window.split.raise('terminal')
        window.terminal.clear()
        onMetaClick = this.onMetaClick
        logDiff = this.logDiff
        if (_k_.empty(opt.prjDir))
        {
            if (globalThis.kakao)
            {
                opt.prjDir = await globalThis.kakao('fs.git',editor.currentFile)
            }
            else
            {
                console.error('GitInfo.status -- no prjDir and no kakao?')
                return
            }
        }
        return Git.status(opt.prjDir).then(async function (status)
        {
            var change, changeInfo, file, line, lines, logFile, text

            if (_k_.empty(status))
            {
                return
            }
            if (_k_.empty(status.gitDir))
            {
                return
            }
            console.log('GitInfo.status got',status)
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
                window.terminal.appendMeta({diss:Syntax.dissForTextAndSyntax(`${path}`,'ko'),href:file,list:file,clss:'gitInfoFile',click:onMetaClick,line:symbol,lineClss:'gitInfoLine ' + change})
                if (spacer)
                {
                    return window.terminal.appendMeta({clss:'spacer'})
                }
            }
            var list = _k_.list(status.deleted)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                file = list[_a_]
                if (_k_.in(slash.ext(file),SOURCE_FILE_EXTS))
                {
                    logFile('deleted',file,status,opt.diff)
                }
            }
            var list1 = _k_.list(status.added)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                file = list1[_b_]
                if (_k_.in(slash.ext(file),SOURCE_FILE_EXTS))
                {
                    logFile('added',file,status,opt.diff)
                    if (!opt.diff)
                    {
                        continue
                    }
                    text = await ffs.read(file)
                    lines = text.split('\n')
                    logDiff({lines:lines,line:1,file:file,change:'added'})
                }
            }
            var list2 = _k_.list(status.changed.filter(function (f)
            {
                return _k_.in(slash.ext(f),SOURCE_FILE_EXTS)
            }))
            for (var _c_ = 0; _c_ < list2.length; _c_++)
            {
                file = list2[_c_]
                logFile('changed',file,status)
                if (opt.diff)
                {
                    changeInfo = await Git.diff(file)
                    var list3 = _k_.list(changeInfo.changes)
                    for (var _d_ = 0; _d_ < list3.length; _d_++)
                    {
                        change = list3[_d_]
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
            window.terminal.scroll.cursorToTop(7)
            return window.terminal.do.resetHistory()
        })
    }

    onMetaClick (meta, event)
    {
        var cmmd, href

        if (href = meta[2].href)
        {
            if (href.startsWith('macro '))
            {
                window.commandline.startCommand('macro')
                window.commandline.hideList()
                cmmd = href.slice(6)
                if (cmmd.startsWith('log'))
                {
                    window.commandline.setText('history')
                }
                else
                {
                    window.commandline.setText(cmmd)
                }
                window.commandline.command.execute(cmmd)
            }
            else
            {
                if (href.indexOf(':') > 0)
                {
                    href += ':' + window.terminal.posForEvent(event)[0]
                }
                post.emit('loadFile',href)
                window.split.do('quart terminal')
            }
        }
        return 'unhandled'
    }
}

export default new GitInfo;