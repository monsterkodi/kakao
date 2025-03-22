var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var differ

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let slash = kxk.slash

import nfs from "../../../kxk/nfs.js"

import belt from "../../edit/tool/belt.js"

import prjcts from "../../index/prjcts.js"

import git from "../../util/git.js"

import searcher from "./searcher.js"
import searcherfile from "./searcherfile.js"


differ = (function ()
{
    _k_.extend(differ, searcher)
    function differ (screen)
    {
        this.screen = screen
    
        this["status"] = this["status"].bind(this)
        this["diff"] = this["diff"].bind(this)
        this["show"] = this["show"].bind(this)
        differ.__super__.constructor.call(this,this.screen,null,'differ')
        post.on('differ.status',this.status)
    }

    differ.prototype["emitFileOpen"] = function (choice)
    {
        console.log('emit file.open')
        return post.emit('file.open',choice.path,choice.row,choice.col)
    }

    differ.prototype["show"] = function ()
    {
        this.isVisible = true
        post.emit('view.show',this.name)
        this.arrange()
        this.input.grabFocus()
        this.choices.clearEmpty()
        this.sfils = []
        return {redraw:true}
    }

    differ.prototype["diff"] = function (diff)
    {
        var add, change, ext, file, items, li

        file = diff.file
        ext = slash.ext(file)
        items = []
        var list = _k_.list(diff.changes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            change = list[_a_]
            items.push({line:''})
            var list1 = _k_.list(change.add)
            for (li = 0; li < list1.length; li++)
            {
                add = list1[li]
                items.push({line:' ' + add.new,path:file,row:change.line + li - 1,col:0})
            }
            var list2 = _k_.list(change.mod)
            for (li = 0; li < list2.length; li++)
            {
                add = list2[li]
                items.push({line:' ' + add.new,path:file,row:change.line + li - 1,col:0})
            }
        }
        items.push({line:''})
        this.choices.append(items,ext)
        return post.emit('redraw')
    }

    differ.prototype["status"] = async function ()
    {
        var currentFile, diff, file, lines, logFile, newl, status, text

        currentFile = ked_session.get('editor▸file')
        status = await git.status(currentFile)
        if (_k_.empty(status))
        {
            return
        }
        if (_k_.empty(status.gitDir))
        {
            return
        }
        this.show()
        logFile = (function (change, file, status)
        {
            var path, sfil, symbol

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
            sfil = new searcherfile(this.screen,`${this.name}_sfil_${this.sfils.length}`)
            sfil.lineIndex = this.choices.items.length
            sfil.set(path)
            this.sfils.push(sfil)
            return this.choices.append([{line:symbol,type:'file',path:file,row:0,col:0}])
        }).bind(this)
        var list = _k_.list(status.deleted)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            if (true)
            {
                logFile('deleted',file,status)
            }
        }
        var list1 = _k_.list(status.added)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            file = list1[_b_]
            if (true)
            {
                logFile('added',file,status)
                text = await nfs.read(file)
                lines = belt.linesForText(text)
                newl = lines.map(function (l)
                {
                    return {new:l}
                })
                diff = {file:file,changes:[{line:1,add:newl}]}
                this.diff(diff)
            }
        }
        var list2 = _k_.list(status.changed)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            file = list2[_c_]
            logFile('changed',file,status)
            diff = await git.diff(file)
            if (this.hidden())
            {
                console.log('hidden?')
            }
            if (!_k_.empty(diff))
            {
                this.diff(diff)
            }
        }
    }

    differ.prototype["apply"] = function (choice)
    {
        if ((choice != null ? choice.path : undefined))
        {
            return this.emitFileOpen(choice)
        }
        return differ.__super__.apply.call(this,choice)
    }

    differ.prototype["onInputAction"] = function (action, text)
    {
        console.log(`differ.commit? action:${action} '${text}'`)
        return differ.__super__.onInputAction.call(this,action,text)
    }

    return differ
})()

export default differ;