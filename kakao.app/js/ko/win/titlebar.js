var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import post from "../../kxk/post.js"

import elem from "../../kxk/elem.js"

import dom from "../../kxk/dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent

class Titlebar
{
    constructor ()
    {
        this.onWinTabs = this.onWinTabs.bind(this)
        this.onWinFocus = this.onWinFocus.bind(this)
        this.onSticky = this.onSticky.bind(this)
        this.onNumWins = this.onNumWins.bind(this)
        console.log('KO WIN TITLEBAR')
        this.elem = $('titlebar')
        this.selected = -1
        document.body.addEventListener('focusout',this.closeList)
        document.body.addEventListener('focusin',this.closeList)
        this.info = {numWins:1,sticky:false,focus:true}
        post.on('numWins',this.onNumWins)
        post.on('winFocus',this.onWinFocus)
        post.on('winTabs',this.onWinTabs)
        post.on('sticky',this.onSticky)
    }

    onNumWins (numWins)
    {
        if (this.info.numWins !== numWins)
        {
            return this.info.numWins = numWins
        }
    }

    onSticky (sticky)
    {
        if (this.info.sticky !== sticky)
        {
            return this.info.sticky = sticky
        }
    }

    onWinFocus (focus)
    {
        if (this.info.focus !== focus)
        {
            this.info.focus = focus
            return this.elem.classList.toggle('focus',this.info.focus)
        }
    }

    listWinInfos (winInfos)
    {
        var activateWindow, div, info

        this.list.innerHTML = ""
        var list = _k_.list(winInfos)
        for (var _61_17_ = 0; _61_17_ < list.length; _61_17_++)
        {
            info = list[_61_17_]
            if (info.id === window.winID)
            {
                continue
            }
            div = elem({class:"winlist-item",children:[elem('span',{class:'wintabs',text:''})]})
            div.winID = info.id
            activateWindow = (function (id)
            {
                return (function (event)
                {
                    this.loadWindowWithID(id)
                    return stopEvent(event)
                }).bind(this)
            }).bind(this)
            div.addEventListener('mousedown',activateWindow(info.id))
            this.list.appendChild(div)
        }
        post.toWins('sendTabs',window.winID)
        this.navigate('down')
        return this
    }

    onWinTabs (winID, tabs)
    {
        var div, w, width, _83_27_

        if (!(this.list != null))
        {
            return
        }
        if (winID === window.winID)
        {
            return
        }
        var list = _k_.list(this.list.children)
        for (var _85_16_ = 0; _85_16_ < list.length; _85_16_++)
        {
            div = list[_85_16_]
            if (div.winID === winID)
            {
                if (w = $('.wintabs',div))
                {
                    w.innerHTML = tabs
                }
                width = div.getBoundingClientRect().width
                break
            }
        }
    }

    globalModKeyComboEvent (mod, key, combo, event)
    {
        switch (combo)
        {
            case 'command+alt+left':
            case 'command+alt+right':
                return winow.tabs.navigate(key)

            case 'command+alt+shift+left':
            case 'command+alt+shift+right':
                return window.tabs.move(key)

        }

        return 'unhandled'
    }
}

export default Titlebar;