// monsterkodi/kode 0.256.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var Editor, __dirname

import buffer from "./buffer.js"

import syntax from "./syntax.js"

import ffs from "../../kxk/ffs.js"

import kstr from "../../kxk/kstr.js"

import slash from "../../kxk/slash.js"

import Do from './do.js'
__dirname = slash.dir(import.meta.url.slice(7))

Editor = (function ()
{
    _k_.extend(Editor, buffer)
    Editor["actions"] = null
    function Editor (name, config)
    {
        var _41_27_

        this["actionsInitialized"] = this["actionsInitialized"].bind(this)
        this.stringCharacters = {"'":'single','"':'double'}
        this.bracketCharacters = {open:{'[':']','{':'}','(':')'},close:{},regexps:[]}
        Editor.__super__.constructor.call(this)
        this.name = name
        this.config = (config != null ? config : {})
        this.config.syntaxName = ((_41_27_=this.config.syntaxName) != null ? _41_27_ : 'txt')
        this.indentString = _k_.lpad(4,"")
        this.stickySelection = false
        this.syntax = new syntax(this.config.syntaxName,this.line,this.lines)
        this.do = new Do(this)
        if (_k_.empty(Editor.actions))
        {
            Editor.initActions(this)
        }
        else
        {
            this.actionsInitialized()
        }
    }

    Editor.prototype["del"] = function ()
    {
        return this.do.del()
    }

    Editor.prototype["actionsInitialized"] = function ()
    {
        return this.setupFileType()
    }

    Editor["initActions"] = async function (editor)
    {
        var actionFile, actions, filelist, item, k, key, v, value, _88_50_

        Editor.actions = []
        filelist = await ffs.list(slash.path(__dirname,'actions'))
        var list = _k_.list(filelist)
        for (var _75_17_ = 0; _75_17_ < list.length; _75_17_++)
        {
            item = list[_75_17_]
            actionFile = item.path
            if (!(_k_.in(slash.ext(actionFile),['js','mjs','coffee','kode'])))
            {
                continue
            }
            actions = await import(actionFile)
            for (key in actions.default)
            {
                value = actions.default[key]
                if (_k_.isFunc(value))
                {
                    this.prototype[key] = value
                }
                else if (key === 'actions')
                {
                    for (k in value)
                    {
                        v = value[k]
                        if (!(_k_.isStr(v)))
                        {
                            if (!(v.key != null))
                            {
                                v.key = k
                            }
                            Editor.actions.push(v)
                        }
                    }
                }
            }
        }
        return (editor != null ? editor.actionsInitialized() : undefined)
    }

    Editor["actionWithName"] = function (name)
    {
        var action

        console.log(name,Editor.actions)
        var list = _k_.list(Editor.actions)
        for (var _99_19_ = 0; _99_19_ < list.length; _99_19_++)
        {
            action = list[_99_19_]
            if (action.name === name)
            {
                return action
            }
        }
        return null
    }

    Editor.prototype["shebangFileType"] = function ()
    {
        var _110_31_, _110_44_

        return ((_110_44_=(this.config != null ? this.config.syntaxName : undefined)) != null ? _110_44_ : 'txt')
    }

    Editor.prototype["setupFileType"] = function ()
    {
        var newType, oldType

        oldType = this.fileType
        newType = this.shebangFileType()
        if (this.syntax)
        {
            this.syntax.name = newType
        }
        this.setFileType(newType)
        if (oldType !== this.fileType)
        {
            return this.emit('fileTypeChanged',this.fileType)
        }
    }

    Editor.prototype["setFileType"] = function (fileType)
    {
        var cstr, k, key, reg, v, _157_21_

        this.fileType = fileType
    
        switch (this.fileType)
        {
            case 'md':
                this.stringCharacters['*'] = 'bold'
                break
            case 'noon':
                this.stringCharacters['|'] = 'pipe'
                break
        }

        switch (this.fileType)
        {
            case 'html':
                this.bracketCharacters.open['<'] = '>'
                break
        }

        for (k in this.bracketCharacters.open)
        {
            v = this.bracketCharacters.open[k]
            this.bracketCharacters.close[v] = k
        }
        this.bracketCharacters.regexp = []
        var list = ['open','close']
        for (var _152_16_ = 0; _152_16_ < list.length; _152_16_++)
        {
            key = list[_152_16_]
            cstr = Object.keys(this.bracketCharacters[key]).join('')
            reg = new RegExp(`[${kstr.escapeRegexp(cstr)}]`)
            this.bracketCharacters.regexps.push([reg,key])
        }
        ;(typeof this.initSurround === "function" ? this.initSurround() : undefined)
        this.indentNewLineMore = null
        this.indentNewLineLess = null
        this.insertIndentedEmptyLineBetween = '{}'
        switch (this.fileType)
        {
            case 'coffee':
            case 'kode':
                this.indentNewLineMore = {lineEndsWith:['->','=>',':','='],lineRegExp:/^(\s+when|\s*if|\s*else\s+if\s+)(?!.*\sthen\s)|(^|\s)(else\s*$|switch\s|for\s|while\s|class\s)/}
                break
        }

        this.multiComment = ((function ()
        {
            switch (this.fileType)
            {
                case 'coffee':
                case 'kode':
                    return {open:'###',close:'###'}

                case 'html':
                case 'md':
                    return {open:'<!--',close:'-->'}

                case 'styl':
                case 'cpp':
                case 'mm':
                case 'c':
                case 'h':
                case 'hpp':
                case 'cxx':
                case 'cs':
                case 'js':
                case 'mjs':
                case 'scss':
                case 'ts':
                case 'swift':
                case 'frag':
                case 'vert':
                    return {open:'/*',close:'*/'}

            }

        }).bind(this))()
        this.lineComment = ((function ()
        {
            switch (this.fileType)
            {
                case 'coffee':
                case 'kode':
                case 'sh':
                case 'bat':
                case 'noon':
                case 'ko':
                case 'txt':
                case 'fish':
                    return '#'

                case 'styl':
                case 'cpp':
                case 'mm':
                case 'c':
                case 'h':
                case 'hpp':
                case 'cxx':
                case 'cs':
                case 'js':
                case 'mjs':
                case 'scss':
                case 'ts':
                case 'swift':
                case 'frag':
                case 'vert':
                    return '//'

                case 'iss':
                case 'ini':
                    return ';'

            }

        }).bind(this))()
        if (this.lineComment)
        {
            return this.headerRegExp = new RegExp(`^(\\s*${kstr.escapeRegexp(this.lineComment)}\\s*)?(\\s*0[0\\s]+)$`)
        }
    }

    Editor.prototype["setText"] = function (text = "")
    {
        var lines

        if (this.syntax.name === 'txt')
        {
            this.syntax.name = syntax.shebang(text.slice(0,text.search(/\r?\n/)))
        }
        lines = text.split(/\n/)
        this.newlineCharacters = '\n'
        if (!_k_.empty(lines))
        {
            if (lines[0].endsWith('\r'))
            {
                lines = text.split(/\r?\n/)
                this.newlineCharacters = '\r\n'
            }
        }
        return this.setLines(lines)
    }

    Editor.prototype["setLines"] = function (lines)
    {
        this.syntax.setLines(lines)
        Editor.__super__.setLines.call(this,lines)
        return this.emit('linesSet',lines)
    }

    Editor.prototype["textOfSelectionForClipboard"] = function ()
    {
        if (this.numSelections())
        {
            return this.textOfSelection()
        }
        else
        {
            return this.textInRanges(this.rangesForCursorLines())
        }
    }

    Editor.prototype["splitStateLineAtPos"] = function (state, pos)
    {
        var l

        l = state.line(pos[1])
        if (!(l != null))
        {
            kerror(`no line at pos ${pos}?`)
        }
        if (!(l != null))
        {
            return ['','']
        }
        return [l.slice(0,pos[0]),l.slice(pos[0])]
    }

    Editor.prototype["emitEdit"] = function (action)
    {
        var line, mc

        mc = this.mainCursor()
        line = this.line(mc[1])
        return this.emit('edit',{action:action,line:line,before:line.slice(0,mc[0]),after:line.slice(mc[0]),cursor:mc})
    }

    Editor.prototype["indentStringForLineAtIndex"] = function (li)
    {
        var e, il, indentLength, line, thisIndent, _269_33_, _270_50_, _276_52_

        while (_k_.empty((this.line(li).trim())) && li > 0)
        {
            li--
        }
        if ((0 <= li && li < this.numLines()))
        {
            il = 0
            line = this.line(li)
            thisIndent = this.indentationAtLineIndex(li)
            indentLength = this.indentString.length
            if ((this.indentNewLineMore != null))
            {
                if ((this.indentNewLineMore.lineEndsWith != null ? this.indentNewLineMore.lineEndsWith.length : undefined))
                {
                    var list = _k_.list(this.indentNewLineMore.lineEndsWith)
                    for (var _271_26_ = 0; _271_26_ < list.length; _271_26_++)
                    {
                        e = list[_271_26_]
                        if (line.trim().endsWith(e))
                        {
                            il = thisIndent + indentLength
                            break
                        }
                    }
                }
                if (il === 0)
                {
                    if ((this.indentNewLineMore.lineRegExp != null) && this.indentNewLineMore.lineRegExp.test(line))
                    {
                        il = thisIndent + indentLength
                    }
                }
            }
            if (il === 0)
            {
                il = thisIndent
            }
            il = Math.max(il,this.indentationAtLineIndex(li + 1))
            return _k_.lpad(il,"")
        }
        else
        {
            return ''
        }
    }

    return Editor
})()

export default Editor;