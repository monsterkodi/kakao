var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var Commandline, __dirname

import ffs from "../../kxk/ffs.js"

import elem from "../../kxk/elem.js"

import post from "../../kxk/post.js"

import slash from "../../kxk/slash.js"

import dom from "../../kxk/dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent

import TextEditor from "../editor/texteditor.js"

__dirname = slash.dir(import.meta.url.slice(7))

Commandline = (function ()
{
    _k_.extend(Commandline, TextEditor)
    function Commandline (viewElem)
    {
        this["onCmmdClick"] = this["onCmmdClick"].bind(this)
        this["onSplit"] = this["onSplit"].bind(this)
        this["restore"] = this["restore"].bind(this)
        this["stash"] = this["stash"].bind(this)
        this["onSearchText"] = this["onSearchText"].bind(this)
        Commandline.__super__.constructor.call(this,viewElem,{features:[],fontSize:24,syntaxName:'commandline'})
        this.mainCommands = ['browse','goto','open','search','find','macro']
        this.hideCommands = ['selecto','Browse','shelf','Small Browser','Large Browser']
        this.size.lineHeight = 30
        this.scroll.setLineHeight(this.size.lineHeight)
        this.button = $('commandline-button')
        this.button.classList.add('empty')
        this.button.addEventListener('mousedown',this.onCmmdClick)
        this.commands = {}
        this.command = null
        this.loadCommands()
        post.on('split',this.onSplit)
        post.on('restore',this.restore)
        post.on('stash',this.stash)
        post.on('searchText',this.onSearchText)
        this.view.onblur = (function ()
        {
            var _46_17_, _48_20_

            this.button.classList.remove('active')
            ;(this.list != null ? this.list.remove() : undefined)
            this.list = null
            return (this.command != null ? this.command.onBlur() : undefined)
        }).bind(this)
        this.view.onfocus = (function ()
        {
            var _1_8_

            return this.button.className = `commandline-button active ${(this.command != null ? this.command.prefsID : undefined)}`
        }).bind(this)
    }

    Commandline.prototype["onSearchText"] = function (text)
    {
        var _62_23_

        if (window.split.commandlineVisible())
        {
            if (!(_k_.in((this.command != null ? this.command.prefsID : undefined),['search','find'])))
            {
                this.startCommand('find')
            }
        }
        this.commands.find.currentText = text
        this.commands.search.currentText = text
        return this.setAndSelectText(text)
    }

    Commandline.prototype["stash"] = function ()
    {
        var _76_19_

        if ((this.command != null))
        {
            return window.stash.set('commandline',this.command.state())
        }
    }

    Commandline.prototype["restore"] = function ()
    {
        var activeID, name, state, _83_29_, _85_27_, _93_41_

        state = window.stash.get('commandline')
        this.setText(((_83_29_=(state != null ? state.text : undefined)) != null ? _83_29_ : ""))
        name = ((_85_27_=(state != null ? state.name : undefined)) != null ? _85_27_ : 'open')
        if (this.command = this.commandForName(name))
        {
            activeID = document.activeElement.id
            if (activeID.startsWith('column'))
            {
                activeID = 'editor'
            }
            this.command.setReceiver(activeID !== 'commandline-editor' && activeID || null)
            this.setName(name)
            this.button.className = `commandline-button active ${this.command.prefsID}`
            return (this.commands[name] != null ? typeof (_93_41_=this.commands[name].restoreState) === "function" ? _93_41_(state) : undefined : undefined)
        }
    }

    Commandline.prototype["loadCommands"] = async function ()
    {
        var command, commandClass, commandModule, file, files

        files = await ffs.list(slash.path(__dirname,'../commands'))
        var list = _k_.list(files)
        for (var _105_17_ = 0; _105_17_ < list.length; _105_17_++)
        {
            file = list[_105_17_]
            if (!(_k_.in(slash.ext(file.path),['js','mjs'])))
            {
                continue
            }
            try
            {
                commandModule = await import(file.path)
                commandClass = commandModule.default
                command = new commandClass(this)
                command.setPrefsID(commandClass.name.toLowerCase())
                this.commands[command.prefsID] = command
            }
            catch (err)
            {
                console.error(`can't load command from file '${file.path}': ${err}`)
                throw err
            }
        }
    }

    Commandline.prototype["setName"] = function (name)
    {
        this.button.innerHTML = name
        return this.layers.style.width = this.view.style.width
    }

    Commandline.prototype["setLines"] = function (l)
    {
        this.scroll.reset()
        return Commandline.__super__.setLines.call(this,l)
    }

    Commandline.prototype["setAndSelectText"] = function (t)
    {
        this.setLines([(t != null ? t : '')])
        this.selectAll()
        return this.selectSingleRange(this.rangeForLineAtIndex(0))
    }

    Commandline.prototype["setText"] = function (t)
    {
        var _137_26_

        this.setLines([(t != null ? t : '')])
        return (typeof this.singleCursorAtPos === "function" ? this.singleCursorAtPos([this.line(0).length,0]) : undefined)
    }

    Commandline.prototype["changed"] = function (changeInfo)
    {
        var _1_8_, _152_20_

        console.log('changed',changeInfo)
        this.hideList()
        Commandline.__super__.changed.call(this,changeInfo)
        if (changeInfo.changes.length)
        {
            this.button.className = `commandline-button active ${(this.command != null ? this.command.prefsID : undefined)}`
            return (this.command != null ? this.command.changed(this.line(0)) : undefined)
        }
    }

    Commandline.prototype["onSplit"] = function (s)
    {
        var _156_16_, _156_23_

        ;((_156_16_=this.command) != null ? typeof (_156_23_=_156_16_.onBot) === "function" ? _156_23_(s[1]) : undefined : undefined)
        return this.positionList()
    }

    Commandline.prototype["startCommand"] = function (name)
    {
        var activeID, r, _167_20_

        r = (this.command != null ? this.command.cancel(name) : undefined)
        if ((r != null ? r.status : undefined) === 'ok')
        {
            this.results(r)
            return
        }
        window.split.showCommandline()
        if (this.command = this.commandForName(name))
        {
            activeID = document.activeElement.id
            if (activeID.startsWith('column'))
            {
                activeID = 'editor'
            }
            if (activeID && activeID !== 'commandline-editor')
            {
                this.command.setReceiver(activeID)
            }
            this.lastFocus = window.lastFocus
            this.view.focus()
            this.setName(name)
            console.log('startCommand',name)
            this.results(this.command.start(name))
            if (_k_.in(name,['search','find']))
            {
                window.textEditor.highlightTextOfSelectionOrWordAtCursor()
                this.view.focus()
            }
            return this.button.className = `commandline-button active ${this.command.prefsID}`
        }
        else
        {
            console.error(`no command ${name}`)
        }
    }

    Commandline.prototype["commandForName"] = function (name)
    {
        var c, n

        for (n in this.commands)
        {
            c = this.commands[n]
            if (n === name || _k_.in(name,c.names))
            {
                return c
            }
        }
    }

    Commandline.prototype["execute"] = function ()
    {
        var _207_33_

        return this.results((this.command != null ? this.command.execute(this.line(0)) : undefined))
    }

    Commandline.prototype["results"] = function (r)
    {
        var _217_34_, _218_34_, _220_47_, _221_48_, _222_45_

        if (((r != null ? r.name : undefined) != null))
        {
            this.setName(r.name)
        }
        if (((r != null ? r.text : undefined) != null))
        {
            this.setText(r.text)
        }
        ;(r != null ? r.select : undefined) ? this.selectAll() : this.selectNone()
        if (((r != null ? r.show : undefined) != null))
        {
            window.split.show(r.show)
        }
        if (((r != null ? r.focus : undefined) != null))
        {
            window.split.focus(r.focus)
        }
        if (((r != null ? r.do : undefined) != null))
        {
            window.split.do(r.do)
        }
        return this
    }

    Commandline.prototype["cancel"] = function ()
    {
        var _225_32_

        return this.results((this.command != null ? this.command.cancel() : undefined))
    }

    Commandline.prototype["clear"] = function ()
    {
        var _228_29_

        if (this.text() === '')
        {
            return this.results((this.command != null ? this.command.clear() : undefined))
        }
        else
        {
            return Commandline.__super__.clear.call(this)
        }
    }

    Commandline.prototype["onCmmdClick"] = function (event)
    {
        var _240_20_

        if (!(this.list != null))
        {
            this.list = elem({class:'list commands'})
            this.positionList()
            window.split.elem.appendChild(this.list)
        }
        this.command.hideList()
        this.listCommands()
        this.focus()
        this.positionList()
        return stopEvent(event)
    }

    Commandline.prototype["listCommands"] = function ()
    {
        var ci, cmmd, cname, div, name, namespan, start

        this.list.innerHTML = ""
        this.list.style.display = 'unset'
        var list = _k_.list(this.mainCommands)
        for (var _255_17_ = 0; _255_17_ < list.length; _255_17_++)
        {
            name = list[_255_17_]
            cmmd = this.commands[name]
            if (_k_.empty(cmmd))
            {
                continue
            }
            for (var _259_22_ = ci = 0, _259_26_ = cmmd.names.length; (_259_22_ <= _259_26_ ? ci < cmmd.names.length : ci > cmmd.names.length); (_259_22_ <= _259_26_ ? ++ci : --ci))
            {
                cname = cmmd.names[ci]
                if (_k_.in(cname,this.hideCommands))
                {
                    continue
                }
                div = elem({class:"list-item"})
                namespan = `<span class=\"ko command ${cmmd.prefsID}\" style=\"position:absolute; left: ${ci > 0 && 80 || 12}px\">${cname}</span>`
                div.innerHTML = namespan
                start = (function (name)
                {
                    return (function (event)
                    {
                        this.hideList()
                        this.startCommand(name)
                        return stopEvent(event)
                    }).bind(this)
                }).bind(this)
                div.addEventListener('mousedown',start(cname))
                this.list.appendChild(div)
            }
        }
    }

    Commandline.prototype["hideList"] = function ()
    {
        var _274_13_

        ;(this.list != null ? this.list.remove() : undefined)
        return this.list = null
    }

    Commandline.prototype["positionList"] = function ()
    {
        var flex, listHeight, listTop, spaceAbove, spaceBelow, _285_27_

        if (!(this.list != null))
        {
            return
        }
        listHeight = this.list.getBoundingClientRect().height
        flex = window.split.flex
        listTop = flex.posOfPane(2)
        spaceBelow = flex.size() - listTop
        spaceAbove = flex.sizeOfPane(0)
        if (spaceBelow < listHeight && spaceAbove > spaceBelow)
        {
            listTop = spaceAbove - listHeight
        }
        if (this.list)
        {
            return this.list.style.top = `${listTop}px`
        }
    }

    Commandline.prototype["resized"] = function ()
    {
        var _297_13_, _297_22_, _298_16_, _298_29_

        ;((_297_13_=this.list) != null ? typeof (_297_22_=_297_13_.resized) === "function" ? _297_22_() : undefined : undefined)
        ;((_298_16_=this.command) != null ? (_298_29_=_298_16_.commandList) != null ? _298_29_.resized() : undefined : undefined)
        return Commandline.__super__.resized.call(this)
    }

    Commandline.prototype["focusTerminal"] = function ()
    {
        if (window.terminal.numLines() === 0)
        {
            window.terminal.singleCursorAtPos([0,0])
        }
        return window.split.do("focus terminal")
    }

    Commandline.prototype["handleMenuAction"] = function (name, opt)
    {
        console.log('handleMenuAction',name,(opt != null ? opt.command : undefined))
        if ((opt != null ? opt.command : undefined))
        {
            if (this.commandForName(opt.command))
            {
                this.startCommand(opt.command)
                return
            }
        }
        return 'unhandled'
    }

    Commandline.prototype["globalModKeyComboEvent"] = function (mod, key, combo, event)
    {
        var _329_19_

        if (combo === 'esc')
        {
            if (document.activeElement === this.view)
            {
                stopEvent(event)
                return this.cancel()
            }
        }
        if ((this.command != null))
        {
            return this.command.globalModKeyComboEvent(mod,key,combo,event)
        }
        return 'unhandled'
    }

    Commandline.prototype["handleModKeyComboCharEvent"] = function (mod, key, combo, char, event)
    {
        var split, _1_8_, _337_19_, _345_55_, _346_55_, _356_58_

        console.log('handleModKeyComboEvent',mod,key,combo,char)
        if ((this.command != null))
        {
            if ('unhandled' !== this.command.handleModKeyComboEvent(mod,key,combo,event))
            {
                return
            }
        }
        split = window.split
        switch (combo)
        {
            case 'enter':
                return this.execute()

            case 'command+enter':
                return this.execute() + window.split.do(`focus ${(this.command != null ? this.command.focus : undefined)}`)

            case 'command+shift+enter':
                return this.focusTerminal()

            case 'up':
                return (this.command != null ? this.command.selectListItem('up') : undefined)

            case 'down':
                return (this.command != null ? this.command.selectListItem('down') : undefined)

            case 'esc':
                return this.cancel()

            case 'command+k':
                return this.clear()

            case 'shift+tab':
                return

            case 'home':
            case 'command+up':
                return split.do('maximize editor')

            case 'end':
            case 'command+down':
                return split.do('minimize editor')

            case 'alt+up':
                return split.do('enlarge editor')

            case 'ctrl+up':
                return split.do('enlarge editor by 20')

            case 'alt+down':
                return split.do('reduce editor')

            case 'ctrl+down':
                return split.do('reduce editor by 20')

            case 'right':
            case 'tab':
                if ((this.command != null ? this.command.onTabCompletion(combo) : undefined))
                {
                    return
                }
                break
        }

        return Commandline.__super__.handleModKeyComboCharEvent.call(this,mod,key,combo,char,event)
    }

    return Commandline
})()

export default Commandline;