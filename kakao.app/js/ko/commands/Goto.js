var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Goto

import Command from "../commandline/Command.js"


Goto = (function ()
{
    _k_.extend(Goto, Command)
    function Goto (commandline)
    {
        Goto.__super__.constructor.call(this,commandline)
    
        this.names = ['goto','selecto']
    }

    Goto.prototype["start"] = function (name)
    {
        Goto.__super__.start.call(this,name)
    
        var _31_26_, _31_36_

        this.initAndShowList()
        return {text:((_31_36_=(this.commandList != null ? this.commandList.line(0) : undefined)) != null ? _31_36_ : ''),select:true}
    }

    Goto.prototype["listItems"] = function ()
    {
        var clsss, files, func, funcs, items, k, name

        items = []
        this.types = {}
        files = window.indexer.files
        funcs = (files[window.editor.currentFile] != null ? files[window.editor.currentFile].funcs : undefined)
        funcs = (funcs != null ? funcs : [])
        var list = _k_.list(funcs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            func = list[_a_]
            items.push({text:func.name,line:'▸',clss:'method'})
            this.types[func.name] = 'func'
        }
        clsss = window.indexer.classes
        var list1 = _k_.list(Object.keys(clsss))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            k = list1[_b_]
            name = k
            items.push({text:k,line:'●',clss:'class'})
            this.types[name] = 'class'
        }
        return items
    }

    Goto.prototype["execute"] = function (command)
    {
        var editor, line, type, _88_35_

        command = Goto.__super__.execute.call(this,command)
        if (/^\-?\d+$/.test(command))
        {
            line = parseInt(command)
            editor = this.receivingEditor()
            if (!(editor != null))
            {
                return console.error(`no editor? focus: ${this.receiver}`)
            }
            if (line < 0)
            {
                line = editor.numLines() + line
            }
            else
            {
                line -= 1
            }
            line = _k_.clamp(0,editor.numLines() - 1,line)
            editor.singleCursorAtPos([0,line],{extend:this.name === 'selecto'})
            editor.scroll.cursorToTop()
            return {focus:this.receiver,do:`show ${editor.name}`}
        }
        else if (command.length)
        {
            type = ((_88_35_=this.types[command]) != null ? _88_35_ : 'func')
            window.editor.jumpTo(command,{type:type,dontList:true,extend:this.name === 'selecto'})
            return {focus:'editor',do:"show editor"}
        }
        else
        {
            return {text:''}
        }
    }

    return Goto
})()

export default Goto;