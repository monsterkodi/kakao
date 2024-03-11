// monsterkodi/kode 0.256.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import post from "../../kxk/post.js"

import slash from "../../kxk/slash.js"

import ffs from "../../kxk/ffs.js"

import linediff from "../tools/linediff.js"

import syntax from "../editor/syntax.js"

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
        var terminal

        terminal = window.terminal
        return terminal.appendMeta({clss:'searchHeader',diss:syntax.dissForTextAndSyntax(text,'ko')})
    }

    logChanges (changes)
    {
        var diff, diffs, dss, extn, index, lineMeta, meta, syntaxName, sytx, terminal, text

        terminal = window.terminal
        extn = slash.ext(changes.file)
        if (_k_.in(extn,syntax.syntaxNames))
        {
            syntaxName = extn
        }
        else
        {
            syntaxName = 'txt'
        }
        sytx = new syntax(syntaxName,function (i)
        {
            return changes.lines[i]
        })
        index = 0
        var list = _k_.list(changes.lines)
        for (var _58_17_ = 0; _58_17_ < list.length; _58_17_++)
        {
            text = list[_58_17_]
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
                for (var _69_25_ = 0; _69_25_ < list1.length; _69_25_++)
                {
                    diff = list1[_69_25_]
                    if (diff.change === 'delete')
                    {
                        continue
                    }
                    lineMeta = {line:terminal.numLines(),start:diff.new,end:diff.new + diff.length,clss:'gitInfoChange'}
                    terminal.meta.add(lineMeta)
                }
            }
            meta = {diss:dss,href:`${changes.file}:${changes.line + index}`,clss:'searchResult',click:this.onMetaClick}
            terminal.appendMeta(meta)
            post.emit('search-result',meta)
            index += 1
        }
        return index
    }

    logFile (change, file)
    {
        var meta, symbol, terminal, text

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
        text = `  ${symbol} `
        terminal = window.terminal
        meta = {diss:syntax.dissForTextAndSyntax(`${slash.tilde(file)}`,'ko'),href:file,clss:'gitInfoFile',click:this.onMetaClick,line:symbol,lineClss:'gitInfoLine ' + change}
        terminal.appendMeta(meta)
        return terminal.appendMeta({clss:'spacer'})
    }

    start ()
    {
        var dirOrFile, terminal, _125_35_

        dirOrFile = ((_125_35_=window.cwd.cwd) != null ? _125_35_ : window.editor.currentFile)
        window.split.raise('terminal')
        terminal = window.terminal
        terminal.clear()
        return hub.info(dirOrFile,(function (info)
        {
            var change, changeInfo, data, file, line, lines

            if (_k_.empty(info))
            {
                return
            }
            terminal = window.terminal
            terminal.appendMeta({clss:'salt',text:slash.tilde(info.gitDir)})
            terminal.appendMeta({clss:'spacer'})
            var list = _k_.list(info.deleted)
            for (var _139_21_ = 0; _139_21_ < list.length; _139_21_++)
            {
                file = list[_139_21_]
                this.logFile('deleted',file)
            }
            var list1 = _k_.list(info.added)
            for (var _143_21_ = 0; _143_21_ < list1.length; _143_21_++)
            {
                file = list1[_143_21_]
                this.logFile('added',file)
                if (slash.isText(file))
                {
                    data = ffs.read(file)
                    lines = data.split(/\r?\n/)
                    line = 1
                    line += this.logChanges({lines:lines,file:file,line:line,change:'new'})
                }
                terminal.appendMeta({clss:'spacer'})
            }
            var list2 = _k_.list(info.changed)
            for (var _156_27_ = 0; _156_27_ < list2.length; _156_27_++)
            {
                changeInfo = list2[_156_27_]
                this.logFile('changed',changeInfo.file)
                var list3 = _k_.list(changeInfo.changes)
                for (var _160_27_ = 0; _160_27_ < list3.length; _160_27_++)
                {
                    change = list3[_160_27_]
                    line = change.line
                    if (!_k_.empty(change.mod))
                    {
                        lines = change.mod.map(function (l)
                        {
                            return l.new
                        })
                        line += this.logChanges({lines:lines,file:changeInfo.file,line:line,info:change,change:'changed'})
                    }
                    if (!_k_.empty(change.add))
                    {
                        lines = change.add.map(function (l)
                        {
                            return l.new
                        })
                        line += this.logChanges({lines:lines,file:changeInfo.file,line:line,info:change,change:'added'})
                    }
                    if (!_k_.empty(change.del))
                    {
                        lines = change.del.map(function (l)
                        {
                            return l.old
                        })
                        line += this.logChanges({lines:lines,file:changeInfo.file,line:line,info:change,change:'deleted'})
                    }
                    terminal.appendMeta({clss:'spacer'})
                }
            }
            return terminal.scroll.cursorToTop(7)
        }).bind(this))
    }
}

module.exports = new GitInfo