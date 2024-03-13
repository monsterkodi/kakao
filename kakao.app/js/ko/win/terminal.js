var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var Terminal

import dom from "../../kxk/dom.js"
let stopEvent = dom.stopEvent

import post from "../../kxk/post.js"

import kpos from "../../kxk/kpos.js"

import popup from "../../kxk/popup.js"

import salt from "../tools/salt.js"

import syntax from "../editor/syntax.js"

import texteditor from "../editor/texteditor.js"


Terminal = (function ()
{
    _k_.extend(Terminal, texteditor)
    function Terminal (viewElem)
    {
        this["showContextMenu"] = this["showContextMenu"].bind(this)
        this["onContextMenu"] = this["onContextMenu"].bind(this)
        this["dequeueMeta"] = this["dequeueMeta"].bind(this)
        this["actionsInitialized"] = this["actionsInitialized"].bind(this)
        Terminal.__super__.constructor.call(this,viewElem,{features:['Scrollbar','Numbers','Minimap','Meta'],fontSize:15})
        this.view.addEventListener("contextmenu",this.onContextMenu)
        this.metaQueue = []
        this.setLines([''])
    }

    Terminal.prototype["actionsInitialized"] = function ()
    {
        Terminal.__super__.actionsInitialized.call(this)
    
        return this.initInvisibles()
    }

    Terminal.prototype["appendLineDiss"] = function (text, diss = [])
    {
        var tail

        if ((diss != null ? diss.length : undefined))
        {
            this.syntax.setDiss(this.numLines(),diss)
        }
        tail = this.cursorPos()[1] === this.numLines() - 1 && this.numCursors() === 1
        this.appendText(text)
        if (tail)
        {
            this.singleCursorAtPos([0,this.numLines() - 1])
            return this.scroll.to(this.scroll.fullHeight)
        }
    }

    Terminal.prototype["appendDiss"] = function (diss)
    {
        return this.appendLineDiss(syntax.lineForDiss(diss),diss)
    }

    Terminal.prototype["appendMeta"] = function (meta)
    {
        var l, _65_21_, _80_21_

        if (!(meta != null))
        {
            return console.error('Terminal.appendMeta -- no meta?')
        }
        this.meta.append(meta)
        if ((meta.diss != null))
        {
            return this.appendLineDiss(syntax.lineForDiss(meta.diss),meta.diss)
        }
        else if (meta.clss === 'salt')
        {
            this.appendMeta({clss:'spacer'})
            var list = _k_.list(salt(meta.text).split('\n'))
            for (var _72_22_ = 0; _72_22_ < list.length; _72_22_++)
            {
                l = list[_72_22_]
                this.appendMeta({clss:'spacer',text:'# ' + l})
            }
            return this.appendMeta({clss:'spacer'})
        }
        else if (meta.clss === 'termCommand')
        {
            return this.appendLineDiss(meta.command,syntax.dissForTextAndSyntax(meta.command,'term'))
        }
        else if ((meta.text != null))
        {
            return this.appendLineDiss(meta.text)
        }
        else
        {
            return this.appendLineDiss('')
        }
    }

    Terminal.prototype["queueMeta"] = function (meta)
    {
        this.metaQueue.push(meta)
        clearTimeout(this.metaTimer)
        return this.metaTimer = setTimeout(this.dequeueMeta,0)
    }

    Terminal.prototype["dequeueMeta"] = function ()
    {
        var count, meta

        count = 0
        while (meta = this.metaQueue.shift())
        {
            this.appendMeta(meta)
            count += 1
            if (count > 20)
            {
                break
            }
        }
        clearTimeout(this.metaTimer)
        if (this.metaQueue.length)
        {
            return this.metaTimer = setTimeout(this.dequeueMeta,0)
        }
    }

    Terminal.prototype["clear"] = function ()
    {
        this.meta.clear()
        this.singleCursorAtPos([0,0])
        return Terminal.__super__.clear.call(this)
    }

    Terminal.prototype["onContextMenu"] = function (event)
    {
        return stopEvent(event,this.showContextMenu(kpos(event)))
    }

    Terminal.prototype["showContextMenu"] = function (absPos)
    {
        var opt

        if (!(absPos != null))
        {
            absPos = kpos(this.view.getBoundingClientRect().left,this.view.getBoundingClientRect().top)
        }
        opt = {items:[{text:'Clear',combo:'alt+k',cb:this.clear},{text:'Close',combo:'alt+ctrl+k',cb:window.split.hideTerminal}]}
        opt.x = absPos.x
        opt.y = absPos.y
        return popup.menu(opt)
    }

    Terminal.prototype["handleModKeyComboCharEvent"] = function (mod, key, combo, char, event)
    {
        var href, split

        if ('unhandled' !== Terminal.__super__.handleModKeyComboCharEvent.call(this,mod,key,combo,char,event))
        {
            return
        }
        switch (combo)
        {
            case 'enter':
                if (href = this.meta.hrefAtLineIndex(this.cursorPos()[1]))
                {
                    post.emit('loadFile',`${href}`)
                }
                return

            case 'ctrl+enter':
            case 'command+enter':
                if (href = this.meta.hrefAtLineIndex(this.cursorPos()[1]))
                {
                    post.emit('loadFile',`${href}`)
                    window.editor.focus()
                }
                return

            case 'ctrl+s':
            case 'command+s':
                if (this.meta.saveChanges())
                {
                    return
                }
                break
            case 'esc':
                split = window.split
                split.focus('commandline-editor')
                split.do('enlarge editor')
                return

        }

        return 'unhandled'
    }

    return Terminal
})()

export default Terminal;