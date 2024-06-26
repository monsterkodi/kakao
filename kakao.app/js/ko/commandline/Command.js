var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Command

import kxk from "../../kxk.js"
let pull = kxk.pull
let reversed = kxk.reversed
let krzl = kxk.krzl
let elem = kxk.elem

import CommandList from "./CommandList.js"


Command = (function ()
{
    function Command (commandline)
    {
        this.commandline = commandline
    
        this["hideList"] = this["hideList"].bind(this)
        this["onBlur"] = this["onBlur"].bind(this)
        this["onBot"] = this["onBot"].bind(this)
        this["listClick"] = this["listClick"].bind(this)
        this["restoreState"] = this["restoreState"].bind(this)
        this.syntaxName = 'ko'
        this.maxHistory = 20
        this.history = []
        this.krzl = new krzl
    }

    Command.prototype["state"] = function ()
    {
        return {text:this.getText(),name:this.name}
    }

    Command.prototype["restoreState"] = function (state)
    {
        if ((state != null ? state.name : undefined))
        {
            this.name = state.name
        }
        return this.loadState()
    }

    Command.prototype["start"] = function (name)
    {
        var text

        this.setName(name)
        this.loadState()
        text = this.getText()
        if (!(text != null ? text.length : undefined))
        {
            text = this.last()
        }
        return {text:text,select:true}
    }

    Command.prototype["execute"] = function (command)
    {
        var _69_23_

        if (_k_.empty(command))
        {
            return console.error('no command!')
        }
        if ((this.commandList != null))
        {
            if ((0 <= this.selected && this.selected < this.commandList.numLines()))
            {
                command = this.commandList.line(this.selected)
            }
            this.hideList()
        }
        command = command.trim()
        this.setCurrent(command)
        return command
    }

    Command.prototype["changed"] = function (command)
    {
        var items, _89_34_

        if (!(this.commandList != null))
        {
            return
        }
        command = command.trim()
        items = this.listItems()
        if (items.length)
        {
            if (command.length)
            {
                this.krzl.values = items
                this.krzl.extract = function (o)
                {
                    if ((o != null))
                    {
                        if (_k_.isStr(o))
                        {
                            return o
                        }
                        if (_k_.isStr(o.text))
                        {
                            return o.text
                        }
                    }
                    return ''
                }
                items = this.krzl.filter(command)
            }
            this.showItems(this.weightedItems(items,{currentText:command}))
            this.select(0)
            return this.positionList()
        }
    }

    Command.prototype["weight"] = function (item, opt)
    {
        var w

        w = 0
        w += item.text.startsWith(opt.currentText) && 65535 * (opt.currentText.length / item.text.length) || 0
        return w
    }

    Command.prototype["weightedItems"] = function (items, opt)
    {
        return items.sort((function (a, b)
        {
            return this.weight(b,opt) - this.weight(a,opt)
        }).bind(this))
    }

    Command.prototype["cancel"] = function ()
    {
        this.hideList()
        return {text:'',focus:this.receiver,show:'editor'}
    }

    Command.prototype["clear"] = function ()
    {
        if (window.terminal.numLines() > 0)
        {
            window.terminal.clear()
            return {}
        }
        else
        {
            return {text:''}
        }
    }

    Command.prototype["initAndShowList"] = function ()
    {
        this.showList()
        this.showItems(this.listItems())
        this.select(0)
        return this.positionList()
    }

    Command.prototype["showList"] = function ()
    {
        var listView, _153_27_

        if (!(this.commandList != null))
        {
            listView = elem({class:`commandlist ${this.prefsID}`})
            window.split.elem.appendChild(listView)
            return this.commandList = new CommandList(this,'.commandlist',{syntaxName:this.syntaxName})
        }
    }

    Command.prototype["listItems"] = function ()
    {
        return reversed(this.history)
    }

    Command.prototype["showItems"] = function (items)
    {
        var _165_34_, _167_39_

        if (!(this.commandList != null) && !items.length)
        {
            return
        }
        if (!items.length)
        {
            return this.hideList()
        }
        if (!(this.commandList != null))
        {
            this.showList()
        }
        this.commandList.addItems(items)
        return this.positionList()
    }

    Command.prototype["listClick"] = function (index)
    {
        this.selected = index
        return this.execute(this.commandList.line(index))
    }

    Command.prototype["onBot"] = function (bot)
    {
        return this.positionList()
    }

    Command.prototype["positionList"] = function ()
    {
        var flex, listHeight, listTop, spaceBelow, _180_34_

        if (!(this.commandList != null))
        {
            return
        }
        flex = window.split.flex
        flex.update()
        listTop = flex.posOfPane(2)
        listHeight = this.commandList.view.getBoundingClientRect().height
        spaceBelow = flex.size() - listTop
        if (spaceBelow < listHeight)
        {
            if (flex.sizeOfPane(0) > spaceBelow)
            {
                listTop = flex.posOfHandle(0) - listHeight
                if (listTop < 0)
                {
                    this.commandList.view.style.height = `${listHeight + listTop}px`
                    listTop = 0
                }
            }
            else
            {
                this.commandList.view.style.height = `${spaceBelow}px`
            }
        }
        return this.commandList.view.style.top = `${listTop}px`
    }

    Command.prototype["select"] = function (i)
    {
        var _203_34_

        if (!(this.commandList != null))
        {
            return
        }
        this.selected = _k_.clamp(-1,this.commandList.numLines() - 1,i)
        if (this.selected >= 0)
        {
            this.commandList.selectSingleRange(this.commandList.rangeForLineAtIndex(this.selected),{before:true})
        }
        else
        {
            this.commandList.singleCursorAtPos([0,0])
        }
        return this.commandList.scroll.cursorIntoView()
    }

    Command.prototype["selectListItem"] = function (dir)
    {
        switch (dir)
        {
            case 'up':
                return this.setAndSelectText(this.prev())

            case 'down':
                return this.setAndSelectText(this.next())

        }

    }

    Command.prototype["prev"] = function ()
    {
        var _224_23_

        if ((this.commandList != null))
        {
            this.select(_k_.clamp(-1,this.commandList.numLines() - 1,this.selected - 1))
            if (this.selected < 0)
            {
                this.hideList()
            }
            else
            {
                return this.commandList.line(this.selected)
            }
        }
        else
        {
            if (this.selected < 0)
            {
                this.selected = this.history.length - 1
            }
            else if (this.selected > 0)
            {
                this.selected -= 1
            }
            return this.history[this.selected]
        }
        return ''
    }

    Command.prototype["next"] = function ()
    {
        var _245_27_, _248_23_

        if (!(this.commandList != null) && this.listItems().length)
        {
            this.showItems(this.listItems())
            this.select(-1)
        }
        if ((this.commandList != null))
        {
            this.select(_k_.clamp(0,this.commandList.numLines() - 1,this.selected + 1))
            return this.commandList.line(this.selected)
        }
        else if (this.history.length)
        {
            this.selected = _k_.clamp(0,this.history.length - 1,this.selected + 1)
            return new this.history[this.selected]
        }
        else
        {
            this.selected = -1
            return ''
        }
    }

    Command.prototype["onBlur"] = function ()
    {
        if (!this.skipBlur)
        {
            return this.hideList()
        }
        else
        {
            return this.skipBlur = null
        }
    }

    Command.prototype["hideList"] = function ()
    {
        var _279_23_, _282_29_

        if (!this)
        {
            console.error('hideList dafuk?')
            return
        }
        this.selected = -1
        if ((this.commandList != null))
        {
            this.commandList.del()
            ;(this.commandList.view != null ? this.commandList.view.remove() : undefined)
            return this.commandList = null
        }
    }

    Command.prototype["historyKey"] = function ()
    {
        return 'history'
    }

    Command.prototype["clearHistory"] = function ()
    {
        this.history = []
        this.selected = -1
        return this.setState(this.historyKey(),this.history)
    }

    Command.prototype["setHistory"] = function (history)
    {
        this.history = history
    
        return this.setState(this.historyKey(),this.history)
    }

    Command.prototype["setCurrent"] = function (command)
    {
        var _305_36_

        if (!(this.history != null))
        {
            this.loadState()
        }
        if (!(_k_.isArr(this.history)))
        {
            console.error(`Command.setCurrent -- ${this.historyKey()} : history not an array?`,typeof(this.history))
            this.history = []
        }
        pull(this.history,command)
        if (command.trim().length)
        {
            this.history.push(command)
        }
        while (this.history.length > this.maxHistory)
        {
            this.history.shift()
        }
        this.selected = this.history.length - 1
        return this.setState(this.historyKey(),this.history)
    }

    Command.prototype["current"] = function ()
    {
        var _316_36_

        return ((_316_36_=this.history[this.selected]) != null ? _316_36_ : '')
    }

    Command.prototype["last"] = function ()
    {
        var _319_23_

        if ((this.commandList != null))
        {
            this.selected = this.commandList.numLines() - 1
            this.commandList.line(this.selected)
        }
        else
        {
            this.selected = this.history.length - 1
            if (this.selected >= 0)
            {
                return this.history[this.selected]
            }
        }
        return ''
    }

    Command.prototype["setText"] = function (t)
    {
        this.currentText = t
        return this.commandline.setText(t)
    }

    Command.prototype["setAndSelectText"] = function (t)
    {
        this.currentText = t
        return this.commandline.setAndSelectText(t)
    }

    Command.prototype["getText"] = function ()
    {
        return this.commandline.line(0)
    }

    Command.prototype["setName"] = function (n)
    {
        this.name = n
        return this.commandline.setName(n)
    }

    Command.prototype["complete"] = function ()
    {
        var _350_34_

        if (!(this.commandList != null))
        {
            return
        }
        if (this.commandList.line(this.selected) !== this.getText() && this.commandList.line(this.selected).startsWith(this.getText()))
        {
            this.setText(this.commandList.line(this.selected))
            return true
        }
    }

    Command.prototype["grabFocus"] = function ()
    {
        return this.commandline.focus()
    }

    Command.prototype["setReceiver"] = function (receiver)
    {
        if (receiver === 'body')
        {
            return
        }
        return this.receiver = (receiver != null ? receiver : 'editor')
    }

    Command.prototype["receivingEditor"] = function ()
    {
        return window.editorWithName(this.receiver)
    }

    Command.prototype["setPrefsID"] = function (id)
    {
        this.prefsID = id
        return this.loadState()
    }

    Command.prototype["loadState"] = function ()
    {
        var _390_17_, _391_28_, _391_39_

        this.history = this.getState(this.historyKey(),[])
        this.history = ((_390_17_=this.history) != null ? _390_17_ : [])
        return this.selected = (this.history != null ? this.history.length : undefined) - ((_391_39_=1) != null ? _391_39_ : 0)
    }

    Command.prototype["setState"] = function (key, value)
    {
        if (!this.prefsID)
        {
            return
        }
        if (this.prefsID)
        {
            return window.stash.set(`command|${this.prefsID}|${key}`,value)
        }
    }

    Command.prototype["getState"] = function (key, value)
    {
        if (!this.prefsID)
        {
            return value
        }
        return window.stash.get(`command|${this.prefsID}|${key}`,value)
    }

    Command.prototype["delState"] = function (key)
    {
        if (!this.prefsID)
        {
            return
        }
        return window.stash.del(`command|${this.prefsID}|${key}`)
    }

    Command.prototype["isActive"] = function ()
    {
        return this.commandline.command === this
    }

    Command.prototype["globalModKeyComboEvent"] = function (mod, key, combo, event)
    {
        return 'unhandled'
    }

    Command.prototype["handleModKeyComboEvent"] = function (mod, key, combo, event)
    {
        var _423_31_

        switch (combo)
        {
            case 'page up':
            case 'page down':
                if ((this.commandList != null))
                {
                    return this.select(_k_.clamp(0,this.commandList.numLines() - 1,this.selected + (this.commandList.numFullLines() - 1) * (combo === 'page up' && -1 || 1)))
                }
                break
        }

        return 'unhandled'
    }

    Command.prototype["onTabCompletion"] = function (combo)
    {
        if (this.commandline.isCursorAtEndOfLine())
        {
            this.complete()
            return true
        }
        else if (combo === 'tab')
        {
            return true
        }
        else
        {
            return false
        }
    }

    return Command
})()

export default Command;