// monsterkodi/kakao 0.1.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var $, Commandline, stopEvent, __dirname

import dom from "../../kxk/dom.js"

import ffs from "../../kxk/ffs.js"

import elem from "../../kxk/elem.js"

import post from "../../kxk/post.js"

import slash from "../../kxk/slash.js"

import texteditor from "../editor/texteditor.js"

$ = dom.$
stopEvent = dom.stopEvent

__dirname = slash.dir(import.meta.url.slice(7))

Commandline = (function ()
{
    _k_.extend(Commandline, texteditor)
    function Commandline (viewElem)
    {
        this["onCmmdClick"] = this["onCmmdClick"].bind(this)
        this["onSplit"] = this["onSplit"].bind(this)
        this["restore"] = this["restore"].bind(this)
        this["stash"] = this["stash"].bind(this)
        this["onSearchText"] = this["onSearchText"].bind(this)
        Commandline.__super__.constructor.call(this,viewElem,{features:[],fontSize:24,syntaxName:'commandline'})
        this.mainCommands = ['browse','goto','open','search','find','macro']
        this.hideCommands = ['selecto','Browse','shelf']
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
            var _48_17_, _50_20_

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
        var _64_23_

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
        var _78_19_

        if ((this.command != null))
        {
            return window.stash.set('commandline',this.command.state())
        }
    }

    Commandline.prototype["restore"] = function ()
    {
        var activeID, name, state, _85_29_, _87_27_, _95_41_

        state = window.stash.get('commandline')
        this.setText(((_85_29_=(state != null ? state.text : undefined)) != null ? _85_29_ : ""))
        name = ((_87_27_=(state != null ? state.name : undefined)) != null ? _87_27_ : 'open')
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
            return (this.commands[name] != null ? typeof (_95_41_=this.commands[name].restoreState) === "function" ? _95_41_(state) : undefined : undefined)
        }
    }

    Commandline.prototype["loadCommands"] = async function ()
    {
        var command, commandClass, commandModule, file, files

        files = await ffs.list(slash.path(__dirname,'../commands'))
        var list = _k_.list(files)
        for (var _107_17_ = 0; _107_17_ < list.length; _107_17_++)
        {
            file = list[_107_17_]
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
        var _146_26_

        this.setLines([(t != null ? t : '')])
        return (typeof this.singleCursorAtPos === "function" ? this.singleCursorAtPos([this.line(0).length,0]) : undefined)
    }

    Commandline.prototype["changed"] = function (changeInfo)
    {
        var _1_8_, _160_20_

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
        var _164_16_, _164_23_

        ;((_164_16_=this.command) != null ? typeof (_164_23_=_164_16_.onBot) === "function" ? _164_23_(s[1]) : undefined : undefined)
        return this.positionList()
    }

    Commandline.prototype["startCommand"] = function (name)
    {
        var activeID, r, _175_20_

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
        var _215_33_

        return this.results((this.command != null ? this.command.execute(this.line(0)) : undefined))
    }

    Commandline.prototype["results"] = function (r)
    {
        var _225_34_, _226_34_, _228_47_, _229_48_, _230_45_

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
        var _233_32_

        return this.results((this.command != null ? this.command.cancel() : undefined))
    }

    Commandline.prototype["clear"] = function ()
    {
        var _236_29_

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
        var _248_20_, _252_16_, _252_26_

        if (!(this.list != null))
        {
            this.list = elem({class:'list commands'})
            this.positionList()
            window.split.elem.appendChild(this.list)
        }
        ;((_252_16_=this.command) != null ? typeof (_252_26_=_252_16_.hideList) === "function" ? _252_26_() : undefined : undefined)
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
        console.log('listCommands',this.mainCommands)
        console.log('listCommands',this.commands)
        var list = _k_.list(this.mainCommands)
        for (var _266_17_ = 0; _266_17_ < list.length; _266_17_++)
        {
            name = list[_266_17_]
            cmmd = this.commands[name]
            if (_k_.empty(cmmd))
            {
                continue
            }
            console.log(name,cmmd)
            for (var _270_22_ = ci = 0, _270_26_ = cmmd.names.length; (_270_22_ <= _270_26_ ? ci < cmmd.names.length : ci > cmmd.names.length); (_270_22_ <= _270_26_ ? ++ci : --ci))
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
        var _285_13_

        ;(this.list != null ? this.list.remove() : undefined)
        return this.list = null
    }

    Commandline.prototype["positionList"] = function ()
    {
        var flex, listHeight, listTop, spaceAbove, spaceBelow, _296_27_

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
        var _308_13_, _308_22_, _309_16_, _309_29_

        ;((_308_13_=this.list) != null ? typeof (_308_22_=_308_13_.resized) === "function" ? _308_22_() : undefined : undefined)
        ;((_309_16_=this.command) != null ? (_309_29_=_309_16_.commandList) != null ? _309_29_.resized() : undefined : undefined)
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
        console.log('handleMenuAction',name)
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
        var _340_19_

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
        var split, _1_8_, _348_19_, _356_55_, _357_55_, _367_58_

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