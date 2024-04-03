var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Browse

import kxk from "../../kxk.js"
let ffs = kxk.ffs
let post = kxk.post
let slash = kxk.slash
let $ = kxk.$

import kakao from "../../kakao.js"

import Command from "../commandline/Command.js"

import FileBrowser from "../browser/FileBrowser.js"


Browse = (function ()
{
    _k_.extend(Browse, Command)
    function Browse (commandline)
    {
        this["onBrowserItemActivated"] = this["onBrowserItemActivated"].bind(this)
        this["listClick"] = this["listClick"].bind(this)
        this["changedCallback"] = this["changedCallback"].bind(this)
        this["completeCallback"] = this["completeCallback"].bind(this)
        this["onFile"] = this["onFile"].bind(this)
        Browse.__super__.constructor.call(this,commandline)
        this.cmdID = 0
        this.browser = new FileBrowser($('browser'))
        this.commands = {}
        this.names = ['browse','Browse','shelf','Small Browser','Large Browser']
        post.on('file',this.onFile)
        this.browser.on('itemActivated',this.onBrowserItemActivated)
        this.syntaxName = 'browser'
    }

    Browse.prototype["onFile"] = function (file)
    {
        if (this.isActive() && this.getText() !== slash.tilde(file))
        {
            return this.setText(slash.tilde(file))
        }
    }

    Browse.prototype["clear"] = function ()
    {
        if (this.browser.cleanUp())
        {
            return
        }
        return Browse.__super__.clear.call(this)
    }

    Browse.prototype["start"] = function (action)
    {
        var name, _56_40_

        this.browser.start()
        if (action !== 'shelf')
        {
            if ((window.editor.currentFile != null))
            {
                this.setText(slash.tilde(window.editor.currentFile))
                this.browser.navigateToFile(window.editor.currentFile)
            }
            else
            {
                post.emit('filebrowser','loadItem',{path:kakao.bundle.path,type:'dir'})
            }
            this.browser.focus({force:true})
        }
        name = action
        if (action === 'shelf')
        {
            name = 'browse'
        }
        Browse.__super__.start.call(this,name)
        return {select:true,do:this.name === 'Browse' && 'half browser' || 'quart browser',focus:action === 'shelf' && 'shelf' || null}
    }

    Browse.prototype["completeCallback"] = function (files)
    {
        var items, matches, text

        if (!_k_.empty(this.getText().trim()))
        {
            text = slash.path(this.getText().trim())
            matches = files.filter(function (f)
            {
                return f.file.startsWith(text)
            })
            if (!_k_.empty(matches))
            {
                this.setText(slash.tilde(matches[0].file))
            }
            if (matches.length > 1)
            {
                items = matches.map(function (m)
                {
                    var item

                    item = {}
                    switch (m.type)
                    {
                        case 'file':
                            item.line = ' '
                            item.clss = 'file'
                            break
                        case 'dir':
                            item.line = '▸'
                            item.clss = 'directory'
                            break
                    }

                    item.text = slash.file(m.file)
                    item.file = m.file
                    return item
                })
                this.showItems(items)
                this.select(0)
                return
            }
        }
        return this.hideList()
    }

    Browse.prototype["complete"] = function ()
    {
        var text

        text = this.getText().trim()
        console.log('complete not implemented!',text)
    }

    Browse.prototype["onTabCompletion"] = function ()
    {
        this.complete()
        return true
    }

    Browse.prototype["commonPrefix"] = function (strA, strB)
    {
        var i, prefix

        prefix = ''
        for (var _146_18_ = i = 0, _146_22_ = Math.min(strA.length,strB.length); (_146_18_ <= _146_22_ ? i < Math.min(strA.length,strB.length) : i > Math.min(strA.length,strB.length)); (_146_18_ <= _146_22_ ? ++i : --i))
        {
            if (strA[i] !== strB[i])
            {
                break
            }
            prefix += strA[i]
        }
        return prefix
    }

    Browse.prototype["clearBrokenPartForFiles"] = function (files)
    {
        var brokenPath, file, l, longestMatch, prefix

        brokenPath = slash.path(this.getText())
        longestMatch = ''
        var list = _k_.list(files)
        for (var _156_17_ = 0; _156_17_ < list.length; _156_17_++)
        {
            file = list[_156_17_]
            file = file.file
            prefix = this.commonPrefix(file,brokenPath)
            if (prefix.length > longestMatch.length)
            {
                longestMatch = prefix
            }
        }
        l = this.getText().length
        if (!_k_.empty(longestMatch))
        {
            this.setText(slash.tilde(longestMatch))
            return this.complete()
        }
    }

    Browse.prototype["changedCallback"] = function (files)
    {
        var items, l, matches, path, s, text

        if (_k_.empty(this.getText().trim()))
        {
            this.hideList()
            return
        }
        path = slash.path(this.getText().trim())
        matches = files.filter(function (f)
        {
            return f.file.startsWith(path)
        })
        if (_k_.empty(matches))
        {
            this.clearBrokenPartForFiles(files)
            return
        }
        s = slash.tilde(path).length
        text = slash.tilde(slash.tilde(matches[0].file))
        this.setText(text)
        l = text.length
        this.commandline.selectSingleRange([0,[s,l]],{before:true})
        if (matches.length < 2)
        {
            return this.hideList()
        }
        else
        {
            items = matches.map(function (m)
            {
                var item

                item = {}
                switch (m.type)
                {
                    case 'file':
                        item.line = ' '
                        item.clss = 'file'
                        break
                    case 'dir':
                        item.line = '▸'
                        item.clss = 'directory'
                        break
                }

                item.text = slash.file(m.file)
                item.file = m.file
                return item
            })
            return this.showItems(items)
        }
    }

    Browse.prototype["changed"] = function (command)
    {
        console.log('browse.changed',command)
    }

    Browse.prototype["handleModKeyComboEvent"] = function (mod, key, combo, event)
    {
        var focusBrowser, _231_74_

        switch (combo)
        {
            case 'backspace':
                if (commandline.mainCursor()[0] === (commandline.selection(0) != null ? commandline.selection(0)[1][0] : undefined))
                {
                    commandline.do.start()
                    commandline.deleteSelection()
                    commandline.deleteBackward()
                    commandline.do.end()
                    return
                }
                break
            case 'enter':
                this.execute(this.getText())
                focusBrowser = (function ()
                {
                    return this.browser.focus({force:true})
                }).bind(this)
                setTimeout(focusBrowser,100)
                return

        }

        return 'unhandled'
    }

    Browse.prototype["listClick"] = function (index)
    {
        var file

        file = (this.commandList.items[index] != null ? this.commandList.items[index].file : undefined)
        if ((file != null))
        {
            file = slash.tilde(file)
        }
        file = (file != null ? file : this.commandList.line(index))
        this.selected = index
        return this.execute(file)
    }

    Browse.prototype["select"] = function (i)
    {
        var l, s, text, _266_42_, _272_20_, _273_20_

        this.selected = _k_.clamp(-1,(this.commandList != null ? this.commandList.numLines() : undefined) - 1,i)
        if (this.selected < 0)
        {
            this.hideList()
            return
        }
        ;(this.commandList != null ? this.commandList.selectSingleRange(this.commandList.rangeForLineAtIndex(this.selected)) : undefined)
        ;(this.commandList != null ? this.commandList.do.cursors([[0,this.selected]]) : undefined)
        text = slash.tilde(this.commandList.items[this.selected].file)
        this.setText(text)
        s = slash.file(text).length
        l = text.length
        return this.commandline.selectSingleRange([0,[l - s,l]])
    }

    Browse.prototype["selectListItem"] = function (dir)
    {
        var _283_34_

        if (!(this.commandList != null))
        {
            return
        }
        switch (dir)
        {
            case 'up':
                return this.select(this.selected - 1)

            case 'down':
                return this.select(this.selected + 1)

        }

    }

    Browse.prototype["cancel"] = function ()
    {
        this.hideList()
        return {focus:this.receiver,show:'editor'}
    }

    Browse.prototype["execute"] = async function (command)
    {
        var cmd, dirExists, fileExists

        if (!(command != null))
        {
            return console.error("no command?")
        }
        this.hideList()
        this.cmdID += 1
        cmd = command.trim()
        if (cmd.length)
        {
            dirExists = await ffs.dirExists(slash.removeLinePos(cmd))
            fileExists = await ffs.fileExists(slash.removeLinePos(cmd))
            if (dirExists)
            {
                this.browser.loadItem({path:cmd,type:'dir'})
                this.commandline.setText(cmd)
                return
            }
            else if (fileExists)
            {
                this.commandline.setText(cmd)
                post.emit('jumpToFile',{path:cmd})
                return
            }
            else
            {
                console.error('browse.execute -- neither file nor dir',slash.removeLinePos(cmd))
            }
        }
        console.error('browse.execute -- unhandled',cmd)
    }

    Browse.prototype["onBrowserItemActivated"] = function (item)
    {
        var pth, _335_32_, _335_56_, _342_64_, _342_72_, _344_61_, _344_69_

        if (!this.isActive())
        {
            ;((_335_32_=this.commandline.command) != null ? typeof (_335_56_=_335_32_.onBrowserItemActivated) === "function" ? _335_56_(item) : undefined : undefined)
            return
        }
        if (item.file)
        {
            pth = slash.tilde(item.file)
            if (item.type === 'dir')
            {
                pth += '/'
                if (item.name === '..' && ((_342_64_=this.browser.activeColumn()) != null ? (_342_72_=_342_64_.parent) != null ? _342_72_.file : undefined : undefined))
                {
                    pth = slash.tilde(((_344_61_=this.browser.activeColumn()) != null ? (_344_69_=_344_61_.parent) != null ? _344_69_.file : undefined : undefined))
                }
            }
            return this.commandline.setText(pth)
        }
    }

    return Browse
})()

export default Browse;