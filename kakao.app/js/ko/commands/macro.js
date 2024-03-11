// monsterkodi/kode 0.256.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

var Macro

import slash from "../../kxk/slash.js"

import prefs from "../../kxk/prefs.js"

import post from "../../kxk/post.js"

import ffs from "../../kxk/ffs.js"

import salt from "../tools/salt.js"

import req from "../tools/req.js"

import command from "../commandline/command.js"

import syntax from "../editor/syntax.js"

import transform from "../editor/actions/transform.js"


Macro = (function ()
{
    _k_.extend(Macro, command)
    Macro["macroNames"] = ['clean','help','dbg','class','req','inv','blink','color','fps','cwd','git','unix']
    function Macro (commandline)
    {
        Macro.__super__.constructor.call(this,commandline)
    
        this.macros = Macro.macroNames
        this.macros = this.macros.concat(transform.transformNames)
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

        items = this.history.concat(this.macros)
        return (function () { var r_59_74_ = []; var list = _k_.list(items); for (var _59_74_ = 0; _59_74_ < list.length; _59_74_++)  { i = list[_59_74_];r_59_74_.push({text:i,line:_k_.in(i,this.macros) && '◼' || '◆',type:'macro'})  } return r_59_74_ }).bind(this)()
    }

    Macro.prototype["execute"] = function (command)
    {
        var cleaned, clss, cmds, cmmd, cp, dir, editor, file, indent, insert, li, line, lines, lst, num, s, step, t, terminal, text, ti, words, wordsInArgsOrCursorsOrSelection, _125_35_, _126_35_, _211_40_

        if (_k_.empty(command))
        {
            return kerror('no command!')
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
                ws = editor.textsInRanges.concat(editor.selections())
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
            case 'cwd':
                (window.cwd != null ? window.cwd.toggle() : undefined)
                break
            case 'git':
                (gitinfo != null ? gitinfo.start() : undefined)
                break
            case 'err':
                throw new Error('err')
                break
            case 'help':
                terminal = window.terminal
                break
            case 'req':
                if (!(_k_.in(slash.ext(editor.currentFile),['coffee','kode'])))
                {
                    return
                }
                lines = req(editor.currentFile,editor.lines(),editor)
                if (!_k_.empty(lines))
                {
                    editor.do.start()
                    var list = _k_.list(lines)
                    for (var _161_29_ = 0; _161_29_ < list.length; _161_29_++)
                    {
                        line = list[_161_29_]
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
                for (var _186_27_ = ti = 0, _186_31_ = words.length - lst; (_186_27_ <= _186_31_ ? ti < words.length - lst : ti > words.length - lst); (_186_27_ <= _186_31_ ? ++ti : --ti))
                {
                    t = words[ti]
                    insert += `${t}:\#{kstr ${t}} `
                }
                insert = insert.trimRight()
                insert += '"'
                if (lst)
                {
                    insert += (function () { var r_192_61_ = []; for (var _192_65_ = ti = words.length - lst, _192_86_ = words.length; (_192_65_ <= _192_86_ ? ti < words.length : ti > words.length); (_192_65_ <= _192_86_ ? ++ti : --ti))  { r_192_61_.push(`, kstr(${words[ti]})`)  } return r_192_61_ }).bind(this)().join('')
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
                dir = (editor.currentFile != null) && slash.dir(editor.currentFile) || process.cwd()
                file = slash.join(dir,clss.toLowerCase() + '.kode')
                if (slash.fileExists(file))
                {
                    return {text:`file ${file} exists!`}
                }
                text = "###\n"
                text += (function () { var r_216_33_ = []; var list1 = _k_.list(salt(clss).split('\n')); for (var _216_33_ = 0; _216_33_ < list1.length; _216_33_++)  { s = list1[_216_33_];r_216_33_.push(s)  } return r_216_33_ }).bind(this)().join('\n')
                text += "\n###\n"
                text += `
function ${clss}

    @: () ->

export ${clss}
`
                ffs.write(file,text).then(function (file)
                {
                    return post.emit('newTabWithFile',file)
                })
                return {focus:editor.name}

            case 'clean':
                editor.do.start()
                for (var _241_27_ = li = 0, _241_31_ = editor.numLines(); (_241_27_ <= _241_31_ ? li < editor.numLines() : li > editor.numLines()); (_241_27_ <= _241_31_ ? ++li : --li))
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
                if (transform.transformNames && _k_.in(cmmd,transform.transformNames))
            {
                window.textEditor.transform.do.apply(null,[window.textEditor,cmmd].concat(cmds))
            }
            else
            {
                kerror('unhandled macro',cmmd,transform.transformNames)
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