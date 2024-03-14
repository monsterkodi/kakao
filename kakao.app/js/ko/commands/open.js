var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var Open, relative

import lib_ko from "../../../lib/lib_ko.js"
let fuzzy = lib_ko.fuzzy

import util from "../../kxk/util.js"
let uniqBy = util.uniqBy

import post from "../../kxk/post.js"

import slash from "../../kxk/slash.js"

import projects from "../tools/projects.js"

import Command from "../commandline/Command.js"

import File from "../tools/File.js"


relative = function (rel, to)
{
    var r, tilde

    r = slash.relative(rel,to)
    if (r.startsWith('../../'))
    {
        tilde = slash.tilde(rel)
        if (tilde.length < r.length)
        {
            r = tilde
        }
    }
    if (rel.length < r.length)
    {
        r = rel
    }
    return r
}

Open = (function ()
{
    _k_.extend(Open, Command)
    function Open (commandline)
    {
        this["weight"] = this["weight"].bind(this)
        this["onFile"] = this["onFile"].bind(this)
        Open.__super__.constructor.call(this,commandline)
        post.on('file',this.onFile)
        this.names = ['open','new window']
        this.files = []
        this.file = null
        this.dir = null
        this.pkg = null
        this.selected = 0
    }

    Open.prototype["onFile"] = function (file)
    {
        if (this.isActive())
        {
            if (_k_.empty(file))
            {
                return this.setText('')
            }
            else if (this.getText() !== slash.file(file))
            {
                return this.setText(slash.tilde(file))
            }
        }
    }

    Open.prototype["changed"] = function (cmmd)
    {
        var f, file, fuzzied, items, pos

        cmmd = cmmd.trim()
        var _67_20_ = slash.splitFilePos((cmmd != null ? cmmd : this.getText().trim())); file = _67_20_[0]; pos = _67_20_[1]

        items = this.listItems({currentText:cmmd,maxItems:10000})
        if (cmmd.length)
        {
            fuzzied = fuzzy.filter(slash.file(file),items,{extract:function (o)
            {
                return o.text
            }})
            items = (function () { var r_74_38_ = []; var list = _k_.list(fuzzied); for (var _74_38_ = 0; _74_38_ < list.length; _74_38_++)  { f = list[_74_38_];r_74_38_.push(f.original)  } return r_74_38_ }).bind(this)()
            items.sort(function (a, b)
            {
                return b.weight - a.weight
            })
        }
        if (items.length)
        {
            this.showItems(items.slice(0,300))
            this.select(0)
            return this.positionList()
        }
        else
        {
            return this.hideList()
        }
    }

    Open.prototype["complete"] = function ()
    {
        console.log('complete not implemented!')
    }

    Open.prototype["weight"] = function (item, opt)
    {
        var b, extensionBonus, f, lengthPenalty, localBonus, n, nameBonus, r, relBonus, updirPenalty, _132_26_

        f = item.file
        r = item.text
        b = slash.file(f)
        n = slash.name(f)
        relBonus = 0
        nameBonus = 0
        if ((opt.currentText != null ? opt.currentText.length : undefined))
        {
            relBonus = r.startsWith(opt.currentText) && 65535 * (opt.currentText.length / r.length) || 0
            nameBonus = n.startsWith(opt.currentText) && 2184 * (opt.currentText.length / n.length) || 0
        }
        extensionBonus = ((function ()
        {
            switch (slash.ext(b))
            {
                case 'coffee':
                case 'kode':
                    return 1000

                case 'cpp':
                case 'hpp':
                case 'mm':
                case 'h':
                    return 90

                case 'md':
                case 'styl':
                case 'pug':
                    return 50

                case 'noon':
                    return 25

                case 'js':
                case 'mjs':
                    return -5

                case 'json':
                case 'html':
                    return -10

                default:
                    return 0
            }

        }).bind(this))()
        if (this.file && slash.ext(this.file) === slash.ext(b))
        {
            extensionBonus += 1000
        }
        lengthPenalty = slash.dir(f).length
        updirPenalty = r.split('../').length * 819
        if (f.startsWith(this.dir))
        {
            localBonus = Math.max(0,(5 - r.split('/').length) * 4095)
        }
        else
        {
            localBonus = Math.max(0,(5 - r.split('../').length) * 819)
        }
        return item.weight = localBonus + relBonus + nameBonus + extensionBonus - lengthPenalty - updirPenalty
    }

    Open.prototype["weightedItems"] = function (items, opt)
    {
        items.sort((function (a, b)
        {
            return b.weight - a.weight
        }).bind(this))
        return items
    }

    Open.prototype["listItems"] = function (opt)
    {
        var f, file, iconSpan, item, items, rel, _175_21_, _176_17_, _187_41_, _189_19_

        opt = (opt != null ? opt : {})
        opt.maxItems = ((_175_21_=opt.maxItems) != null ? _175_21_ : 200)
        opt.flat = ((_176_17_=opt.flat) != null ? _176_17_ : true)
        iconSpan = function (file)
        {
            var className

            className = File.iconClassName(file)
            return `<span class='${className} openFileIcon'/>`
        }
        items = []
        this.lastFileIndex = 0
        if (!(this.dir != null))
        {
            this.dir = slash.path('~')
        }
        if ((this.history != null) && !opt.currentText && this.history.length > 1)
        {
            f = this.history[this.history.length - 2]
            item = Object.create(null)
            item.text = relative(f,this.dir)
            item.line = iconSpan(f)
            item.file = f
            item.weight = this.weight(item,opt)
            items.push(item)
            this.lastFileIndex = 0
        }
        if (!_k_.empty(this.files))
        {
            var list = _k_.list(this.files)
            for (var _203_21_ = 0; _203_21_ < list.length; _203_21_++)
            {
                file = list[_203_21_]
                rel = relative(file,this.dir)
                if (rel.length)
                {
                    item = Object.create(null)
                    item.line = iconSpan(file)
                    item.text = rel
                    item.file = file
                    item.weight = this.weight(item,opt)
                    items.push(item)
                }
            }
        }
        items = this.weightedItems(items,opt)
        items = uniqBy(items,'text')
        return items.slice(0,opt.maxItems)
    }

    Open.prototype["showHistory"] = function ()
    {
        var f, item, items

        if (this.history.length > 1 && this.selected <= 0)
        {
            items = []
            var list = _k_.list(this.history)
            for (var _231_18_ = 0; _231_18_ < list.length; _231_18_++)
            {
                f = list[_231_18_]
                item = Object.create(null)
                item.text = relative(f,this.dir)
                item.file = f
                items.push(item)
            }
            items.pop()
            this.showItems(items)
            this.select(items.length - 1)
            return this.setAndSelectText(items[this.selected].text)
        }
        else
        {
            return 'unhandled'
        }
    }

    Open.prototype["showFirst"] = function ()
    {
        var _247_58_, _247_65_

        if (this.commandList && this.selected === ((_247_58_=this.commandList.meta) != null ? (_247_65_=_247_58_.metas) != null ? _247_65_.length : undefined : undefined) - 1)
        {
            this.showItems(this.listItems())
            return this.select(0)
        }
        else
        {
            return 'unhandled'
        }
    }

    Open.prototype["cancel"] = function (name)
    {
        var _262_27_

        if (name === this.names[0])
        {
            if ((this.commandList != null) && this.lastFileIndex === this.selected)
            {
                return this.execute()
            }
        }
        return Open.__super__.cancel.call(this,name)
    }

    Open.prototype["start"] = function (name)
    {
        var dir, item, _283_40_, _297_41_

        this.setName(name)
        if ((this.commandline.lastFocus === 'commandline-editor' && 'commandline-editor' === window.lastFocus))
        {
            this.file = window.editor.currentFile
            if (dir = slash.path(this.commandline.text()))
            {
                this.dir = dir
            }
            else
            {
                this.dir = ((_283_40_=slash.dir(this.file)) != null ? _283_40_ : kakao.bundle.app('kode'))
            }
        }
        else if (this.commandline.lastFocus === 'shelf' || this.commandline.lastFocus.startsWith('FileBrowser'))
        {
            item = window.filebrowser.lastUsedColumn().parent
            switch (item.type)
            {
                case 'dir':
                    this.file = window.editor.currentFile
                    this.dir = item.file
                    break
                case 'file':
                    this.file = item.file
                    this.dir = slash.dir(this.file)
                    break
            }

        }
        else if ((window.editor.currentFile != null))
        {
            this.file = window.editor.currentFile
            this.dir = slash.dir(this.file)
        }
        else
        {
            this.file = null
            this.dir = kakao.bundle.app('kode')
        }
        this.files = projects.files(this.dir)
        this.loadState()
        this.showList()
        this.showItems(this.listItems())
        this.grabFocus()
        this.select(0)
        return {text:this.commandList.line(this.selected),select:true}
    }

    Open.prototype["execute"] = function (command)
    {
        var file, path, pos, _328_27_

        if (this.selected < 0)
        {
            return {status:'failed'}
        }
        path = (this.commandList != null ? this.commandList.line(this.selected) : undefined)
        this.hideList()
        if (!_k_.empty(path))
        {
            var _334_24_ = slash.splitFilePos(command); file = _334_24_[0]; pos = _334_24_[1]

            file = this.resolvedPath(path)
            file = slash.joinFilePos(file,pos)
            if (this.name === 'new window')
            {
                console.log('open new window with file not implemented!')
            }
            else
            {
                post.emit('jumpToFile',{type:'file',path:file})
            }
            Open.__super__.execute.call(this,file)
            return {text:file,focus:'editor',show:'editor',status:'ok'}
        }
        else
        {
            return {status:'failed'}
        }
    }

    Open.prototype["resolvedPath"] = function (p, parent = this.dir)
    {
        if (!(p != null))
        {
            return ((parent != null ? parent : slash.path('~')))
        }
        if (_k_.in(p[0],['~','/']) || p[1] === ':')
        {
            return slash.path(p)
        }
        else
        {
            return slash.path(parent,p)
        }
    }

    Open.prototype["handleModKeyComboEvent"] = function (mod, key, combo, event)
    {
        switch (combo)
        {
            case 'up':
                return this.showHistory()

            case 'down':
                return this.showFirst()

        }

        return Open.__super__.handleModKeyComboEvent.call(this,mod,key,combo,event)
    }

    return Open
})()

export default Open;