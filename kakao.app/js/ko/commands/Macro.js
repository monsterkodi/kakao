var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

var Macro

import kxk from "../../kxk.js"
let reversed = kxk.reversed
let uniq = kxk.uniq
let clippo = kxk.clippo
let scooter = kxk.scooter
let slash = kxk.slash
let prefs = kxk.prefs
let post = kxk.post
let ffs = kxk.ffs

import salt from "../tools/salt.js"
import req from "../tools/req.js"
import GitInfo from "../tools/GitInfo.js"

import Syntax from "../editor/Syntax.js"
import Editor from "../editor/Editor.js"

import Command from "../commandline/Command.js"


Macro = (function ()
{
    _k_.extend(Macro, Command)
    Macro["macroNames"] = ['clean','help','class','unicode','clippo','inv','blink','color','fps','status','diff','history','count','sort','case','lower','upper']
    function Macro (commandline)
    {
        Macro.__super__.constructor.call(this,commandline)
    
        this.macros = Macro.macroNames
        this.macros = this.macros.concat(Editor.actionModules.transform.Transform.transformNames)
        this.names = ['macro']
    }

    Macro.prototype["start"] = function (name)
    {
        Macro.__super__.start.call(this,name)
    
        var text

        text = this.last()
        if (!(text != null ? text.length : undefined))
        {
            text = 'dbg'
        }
        return {text:text,select:true}
    }

    Macro.prototype["listItems"] = function ()
    {
        var i, items

        items = uniq(reversed(this.history).concat(this.macros))
        return (function () { var r_54_74_ = []; var list = _k_.list(items); for (var _54_74_ = 0; _54_74_ < list.length; _54_74_++)  { i = list[_54_74_];r_54_74_.push({text:i,line:_k_.in(i,this.macros) && '◼' || '◆',type:'macro'})  } return r_54_74_ }).bind(this)()
    }

    Macro.prototype["execute"] = function (command, trail)
    {
        var cleaned, clss, cmds, cmmd, cp, dir, editor, file, helpFile, i, indent, insert, l, li, line, lines, lst, num, result, s, step, t, text, ti, transform, words, wordsInArgsOrCursorsOrSelection, _126_35_, _274_42_

        if (_k_.empty(command))
        {
            return console.error('no command!')
        }
        command = Macro.__super__.execute.call(this,command)
        editor = window.editor
        cp = editor.cursorPos()
        cmds = command.split(/\s+/)
        cmmd = cmds.shift()
        wordsInArgsOrCursorsOrSelection = function (argl, opt)
        {
            var cw, ws

            if (argl.length)
            {
                return argl
            }
            else
            {
                cw = editor.wordsAtCursors(positionsNotInRanges(editor.cursors(),editor.selections()),opt)
                ws = uniq(cw.concat(editor.textsInRanges(editor.selections())))
                return ws.filter(function (w)
                {
                    return w.trim().length
                })
            }
        }
        switch (cmmd)
        {
            case 'inv':
                window.textEditor.toggleInvisibles()
                break
            case 'blink':
                editor.toggleBlink()
                if (prefs.get('blink'))
                {
                    this.commandline.startBlink()
                }
                else
                {
                    this.commandline.stopBlink()
                }
                break
            case 'color':
            case 'colors':
                editor.togglePigments()
                break
            case 'fps':
                (window.fps != null ? window.fps.toggle() : undefined)
                break
            case 's':
            case 'ks':
            case 'status':
            case 'git':
                post.emit('git.status')
                break
            case 'h':
            case 'history':
                post.emit('git.history')
                break
            case 'd':
            case 'kd':
            case 'diff':
                post.emit('git.diff',cmds)
                break
            case 'log':
                post.emit('git.log',cmds)
                break
            case 'c':
            case 'kc':
            case 'commit':
            case 'ci':
                post.emit('git.commit',cmds)
                break
            case 'pb':
            case 'paste':
            case 'clippo':
                window.split.raise('terminal')
                window.terminal.clear()
                var list = _k_.list(reversed(clippo.history))
                for (var _166_22_ = 0; _166_22_ < list.length; _166_22_++)
                {
                    t = list[_166_22_]
                    window.terminal.queueMeta({text:'',line:'&nbsp;'})
                    var list1 = _k_.list(t.split('\n'))
                    for (i = 0; i < list1.length; i++)
                    {
                        l = list1[i]
                        window.terminal.queueMeta({diss:Syntax.dissForTextAndSyntax(l,'kode'),text:l,clss:'clippoResult',click:(function (t)
                        {
                            return function ()
                            {
                                return kakao('clipboard.set',t)
                            }
                        })(t),line:i + 1})
                    }
                }
                window.terminal.queueMeta({text:'',line:'&nbsp;'})
                return {focus:'terminal'}

            case 'u':
            case 'unicode':
                post.emit('unicode')
                break
            case 'help':
                helpFile = slash.path(kakao.bundle.path,'kode/ko/help.noon')
                ffs.read(helpFile).then(function (text)
                {
                    window.terminal.clear()
                    var list2 = _k_.list(text.split('\n'))
                    for (var _204_26_ = 0; _204_26_ < list2.length; _204_26_++)
                    {
                        l = list2[_204_26_]
                        window.terminal.appendLineDiss(l,Syntax.dissForTextAndSyntax(l,'noon'))
                    }
                    window.terminal.scroll.cursorToTop(1)
                    return window.split.do('show terminal')
                })
                break
            case 'req':
                if (!(_k_.in(slash.ext(editor.currentFile),['kode'])))
                {
                    return
                }
                lines = req(editor.currentFile,editor.lines(),editor)
                if (!_k_.empty(lines))
                {
                    editor.do.start()
                    var list2 = _k_.list(lines)
                    for (var _223_29_ = 0; _223_29_ < list2.length; _223_29_++)
                    {
                        line = list2[_223_29_]
                        if (line.op === 'insert')
                        {
                            editor.do.insert(line.index,line.text)
                        }
                        else
                        {
                            editor.do.change(line.index,line.text)
                        }
                    }
                    editor.do.end()
                    return {do:"focus editor"}
                }
                break
            case 'dbg':
                li = cp[1]
                indent = editor.indentStringForLineAtIndex(li)
                if (!editor.isCursorInIndent() && !editor.isCursorInLastLine())
                {
                    li += 1
                }
                insert = indent + 'log "'
                insert += editor.funcInfoAtLineIndex(li)
                lst = cmds.length && parseInt(cmds[0]) || 0
                if (lst)
                {
                    cmds.shift()
                }
                words = wordsInArgsOrCursorsOrSelection(cmds,{include:"#@.-"})
                for (var _248_27_ = ti = 0, _248_31_ = words.length - lst; (_248_27_ <= _248_31_ ? ti < words.length - lst : ti > words.length - lst); (_248_27_ <= _248_31_ ? ++ti : --ti))
                {
                    t = words[ti]
                    insert += `${t}:\#{kstr ${t}} `
                }
                insert = insert.trimRight()
                insert += '"'
                if (lst)
                {
                    insert += (function () { var r_254_61_ = []; for (var _254_65_ = ti = words.length - lst, _254_86_ = words.length; (_254_65_ <= _254_86_ ? ti < words.length : ti > words.length); (_254_65_ <= _254_86_ ? ++ti : --ti))  { r_254_61_.push(`, kstr(${words[ti]})`)  } return r_254_61_ }).bind(this)().join('')
                }
                editor.do.start()
                editor.do.insert(li,insert)
                editor.singleCursorAtPos([editor.line(li).length,li])
                editor.do.end()
                {focus:editor.name}
                break
            case 'class':
                clss = cmds.length && cmds[0] || _k_.last(editor.textsInRanges(editor.selections()))
                clss = (clss != null ? clss : 'Class')
                dir = (editor.currentFile != null) && slash.dir(editor.currentFile) || kakao.bundle.app('kode')
                file = slash.path(dir,clss + '.kode')
                text = "###\n"
                text += (function () { var r_278_33_ = []; var list3 = _k_.list(salt(clss).split('\n')); for (var _278_33_ = 0; _278_33_ < list3.length; _278_33_++)  { s = list3[_278_33_];r_278_33_.push(s)  } return r_278_33_ }).bind(this)().join('\n')
                text += "\n###\n"
                text += `
function ${clss}

    @: ->

export ${clss}
`
                ffs.write(file,text).then(function (file)
                {
                    return post.emit('loadFile',file)
                })
                return {focus:editor.name}

            case 'clean':
                editor.do.start()
                for (var _303_27_ = li = 0, _303_31_ = editor.numLines(); (_303_27_ <= _303_31_ ? li < editor.numLines() : li > editor.numLines()); (_303_27_ <= _303_31_ ? ++li : --li))
                {
                    line = editor.line(li)
                    cleaned = line.trimRight()
                    if (line !== cleaned)
                    {
                        editor.do.change(li,cleaned)
                    }
                }
                editor.do.end()
                break
            case 'unix':
                editor.newlineCharacters = '\n'
                post.emit('saveFile')
                break
            case 'header':
                editor.toggleHeader()
                break
            case 'col':
                num = cmds.length > 0 && parseInt(cmds[0]) || 10
                step = cmds.length > 1 && parseInt(cmds[1]) || 1
                editor.cursorColumns(num,step)
                break
            case 'line':
                num = cmds.length > 0 && parseInt(cmds[0]) || 10
                step = cmds.length > 1 && parseInt(cmds[1]) || 1
                editor.cursorLines(num,step)
                break
            default:
                transform = Editor.actionModules.transform.Transform
                if (transform.transformNames && _k_.in(cmmd,transform.transformNames))
            {
                window.textEditor.transform.do.apply(window.textEditor.transform,[cmmd].concat(cmds))
            }
            else
            {
                try
                {
                    result = scooter(cmmd)
                    kakao('clipboard.set',result)
                    return {select:true,text:result}
                }
                catch (err)
                {
                    console.log("scooter can't calculate",cmmd)
                }
                console.error('unhandled macro',cmmd,transform.transformNames)
                if (_k_.last(this.history) === command.trim())
                {
                    this.history.pop()
                }
            }
        }

        return {select:true}
    }

    return Macro
})()

export default Macro;