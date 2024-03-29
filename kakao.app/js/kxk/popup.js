var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var Popup

import dom from "./dom.js"
let elem = dom.elem
let stopEvent = dom.stopEvent

import post from "./post.js"

import slash from "./slash.js"

import keyinfo from "./keyinfo.js"


Popup = (function ()
{
    function Popup (opt)
    {
        var br, child, div, item, text

        this["onKeyDown"] = this["onKeyDown"].bind(this)
        this["onFocusOut"] = this["onFocusOut"].bind(this)
        this["onContextMenu"] = this["onContextMenu"].bind(this)
        this["onItemMouseUp"] = this["onItemMouseUp"].bind(this)
        this["onPopupMouseUp"] = this["onPopupMouseUp"].bind(this)
        this["onHover"] = this["onHover"].bind(this)
        this["activate"] = this["activate"].bind(this)
        this["close"] = this["close"].bind(this)
        this.focusElem = document.activeElement
        this.items = elem({class:'popup',tabindex:0})
        this.parent = opt.parent
        this.onClose = opt.onClose
        this.trail = opt.trail
        if (opt.class)
        {
            this.items.classList.add(opt.class)
        }
        var list = _k_.list(opt.items)
        for (var _26_17_ = 0; _26_17_ < list.length; _26_17_++)
        {
            item = list[_26_17_]
            if (item.hide)
            {
                continue
            }
            if (_k_.empty((item.text)) && _k_.empty((item.html)) && _k_.empty((item.child)) && _k_.empty((item.children)) && _k_.empty((item.img)))
            {
                div = elem('hr',{class:'popupItem separator'})
            }
            else
            {
                div = elem({class:'popupItem',text:item.text})
                if (!_k_.empty(item.html))
                {
                    div.innerHTML = item.html
                }
                else
                {
                    if (item.img)
                    {
                        div.appendChild(elem('img',{class:'popupImage',src:slash.fileUrl(item.img)}))
                    }
                    if (item.child)
                    {
                        div.appendChild(item.child)
                    }
                    if (item.children)
                    {
                        var list1 = _k_.list(item.children)
                        for (var _40_34_ = 0; _40_34_ < list1.length; _40_34_++)
                        {
                            child = list1[_40_34_]
                            div.appendChild(child)
                        }
                    }
                }
                div.item = item
                div.addEventListener('mouseup',this.onItemMouseUp)
                if (item.combo)
                {
                    text = keyinfo.short(item.combo)
                    div.appendChild(elem('span',{class:'popupCombo',text:text}))
                }
                else if (item.menu)
                {
                    div.appendChild(elem('span',{class:'popupCombo',text:'▶'}))
                }
            }
            this.items.appendChild(div)
        }
        document.body.appendChild(this.items)
        this.items.addEventListener('mouseup',this.onPopupMouseUp)
        this.items.addEventListener('contextmenu',this.onContextMenu)
        this.items.addEventListener('keydown',this.onKeyDown)
        this.items.addEventListener('focusout',this.onFocusOut)
        this.items.addEventListener('mouseover',this.onHover)
        br = this.items.getBoundingClientRect()
        if (opt.x + br.width > document.body.clientWidth)
        {
            this.items.style.left = `${document.body.clientWidth - br.width}px`
        }
        else
        {
            this.items.style.left = `${opt.x}px`
        }
        if (opt.y + br.height > document.body.clientHeight)
        {
            this.items.style.top = `${document.body.clientHeight - br.height}px`
        }
        else
        {
            this.items.style.top = `${opt.y}px`
        }
        if (opt.selectFirstItem !== false)
        {
            this.select(this.items.firstChild,{selectFirstItem:false})
        }
    }

    Popup.prototype["close"] = function (opt = {})
    {
        var _102_15_, _105_22_, _109_22_, _86_42_, _86_48_, _87_33_, _91_14_, _94_14_, _95_14_, _96_14_, _97_14_, _98_14_

        if (_k_.empty((this.parent)) || ((_86_42_=this.parentMenu()) != null ? (_86_48_=_86_42_.elem) != null ? _86_48_.classList.contains('menu') : undefined : undefined))
        {
            if ('skip' === (typeof this.onClose === "function" ? this.onClose() : undefined))
            {
                return
            }
        }
        ;(this.popup != null ? this.popup.close({focus:false}) : undefined)
        delete this.popup
        ;(this.items != null ? this.items.removeEventListener('mouseUp',this.onPopupMouseUp) : undefined)
        ;(this.items != null ? this.items.removeEventListener('keydown',this.onKeyDown) : undefined)
        ;(this.items != null ? this.items.removeEventListener('focusout',this.onFocusOut) : undefined)
        ;(this.items != null ? this.items.removeEventListener('mouseover',this.onHover) : undefined)
        ;(this.items != null ? this.items.remove() : undefined)
        delete this.items
        ;(this.parent != null ? this.parent.childClosed(this,opt) : undefined)
        if (opt.all)
        {
            if ((this.parent != null))
            {
                this.parent.close(opt)
            }
        }
        if (opt.focus !== false && !this.parent)
        {
            return (this.focusElem != null ? this.focusElem.focus() : undefined)
        }
    }

    Popup.prototype["childClosed"] = function (child, opt)
    {
        if (child === this.popup)
        {
            delete this.popup
            if (opt.focus !== false)
            {
                return this.focus()
            }
        }
    }

    Popup.prototype["select"] = function (item, opt = {})
    {
        var _128_17_, _131_17_, _135_20_

        if (!(item != null))
        {
            return
        }
        if ((this.popup != null))
        {
            this.popup.close({focus:false})
        }
        ;(this.selected != null ? this.selected.classList.remove('selected') : undefined)
        this.selected = item
        this.selected.classList.add('selected')
        if ((item.item != null ? item.item.menu : undefined) && opt.open !== false)
        {
            delete this.popup
            this.popupChild(item,opt)
        }
        return this.focus()
    }

    Popup.prototype["popupChild"] = function (item, opt = {})
    {
        var br, items

        if (items = item.item.menu)
        {
            if (this.popup)
            {
                return this.closePopup()
            }
            else
            {
                br = item.getBoundingClientRect()
                return this.popup = new Popup({items:items,parent:this,trail:this.trail + '▸' + item.item.text,x:br.left + br.width,y:br.top,selectFirstItem:(opt != null ? opt.selectFirstItem : undefined)})
            }
        }
    }

    Popup.prototype["closePopup"] = function ()
    {
        var _158_14_

        ;(this.popup != null ? this.popup.close({focus:false}) : undefined)
        return delete this.popup
    }

    Popup.prototype["navigateLeft"] = function ()
    {
        var m

        if (this.popup)
        {
            return this.closePopup()
        }
        else if (m = this.parentMenu())
        {
            return m.navigateLeft()
        }
        else if (this.parent)
        {
            return this.close({focus:false})
        }
    }

    Popup.prototype["activateOrNavigateRight"] = function ()
    {
        var _178_20_

        if ((this.selected != null))
        {
            if (!this.selected.item.menu)
            {
                return this.activate(this.selected)
            }
            else
            {
                return this.navigateRight()
            }
        }
    }

    Popup.prototype["navigateRight"] = function ()
    {
        var _187_25_, _190_25_

        if (this.popup)
        {
            return this.popup.select(this.popup.items.firstChild)
        }
        else if ((this.selected != null ? this.selected.item.menu : undefined))
        {
            return this.select(this.selected,{selectFirstItem:true})
        }
        else
        {
            return (this.parentMenu() != null ? this.parentMenu().navigateRight() : undefined)
        }
    }

    Popup.prototype["parentMenu"] = function ()
    {
        var _193_18_

        if ((this.parent != null) && !this.parent.parent)
        {
            return this.parent
        }
    }

    Popup.prototype["nextItem"] = function ()
    {
        var next, _205_38_

        if (next = this.selected)
        {
            while (next = next.nextSibling)
            {
                if (!_k_.empty((next.item != null ? next.item.text : undefined)))
                {
                    return next
                }
            }
        }
    }

    Popup.prototype["prevItem"] = function ()
    {
        var prev, _211_38_

        if (prev = this.selected)
        {
            while (prev = prev.previousSibling)
            {
                if (!_k_.empty((prev.item != null ? prev.item.text : undefined)))
                {
                    return prev
                }
            }
        }
    }

    Popup.prototype["activate"] = function (item)
    {
        var _222_20_, _222_24_, _224_39_, _227_52_

        if (((item.item != null ? item.item.cb : undefined) != null))
        {
            this.close({all:true})
            return item.item.cb(((_224_39_=item.item.arg) != null ? _224_39_ : item.item.text))
        }
        else if (!item.item.menu)
        {
            this.close({all:true})
            return post.emit('menuAction',((_227_52_=item.item.action) != null ? _227_52_ : item.item.text),this.trail)
        }
    }

    Popup.prototype["toggle"] = function (item)
    {
        if (this.popup)
        {
            this.popup.close({focus:false})
            return delete this.popup
        }
        else
        {
            return this.select(item,{selectFirstItem:false})
        }
    }

    Popup.prototype["onHover"] = function (event)
    {
        var item

        item = elem.upElem(event.target,{prop:'item'})
        if (item)
        {
            return this.select(item,{selectFirstItem:false})
        }
    }

    Popup.prototype["onPopupMouseUp"] = function (event)
    {
        stopEvent(event)
        if (this.selected)
        {
            return this.activate(this.selected)
        }
    }

    Popup.prototype["onItemMouseUp"] = function (event)
    {
        var item

        stopEvent(event)
        item = elem.upElem(event.target,{prop:'item'})
        if (item)
        {
            if (item.item.menu)
            {
                return this.toggle(item)
            }
            else
            {
                return this.activate(item)
            }
        }
    }

    Popup.prototype["onContextMenu"] = function (event)
    {
        return stopEvent(event)
    }

    Popup.prototype["focus"] = function ()
    {
        var _276_20_

        return (this.items != null ? this.items.focus() : undefined)
    }

    Popup.prototype["onFocusOut"] = function (event)
    {
        var _280_34_

        if (!(event.relatedTarget != null ? event.relatedTarget.classList.contains('popup') : undefined))
        {
            return this.close({all:true,focus:false})
        }
    }

    Popup.prototype["onKeyDown"] = function (event)
    {
        var combo, key, mod

        mod = keyinfo.forEvent(event).mod
        key = keyinfo.forEvent(event).key
        combo = keyinfo.forEvent(event).combo

        switch (combo)
        {
            case 'end':
            case 'page down':
                return stopEvent(event,this.select(this.items.lastChild,{selectFirstItem:false}))

            case 'home':
            case 'page up':
                return stopEvent(event,this.select(this.items.firstChild,{selectFirstItem:false}))

            case 'esc':
                return stopEvent(event,this.close())

            case 'down':
                return stopEvent(event,this.select(this.nextItem(),{selectFirstItem:false}))

            case 'up':
                return stopEvent(event,this.select(this.prevItem(),{selectFirstItem:false}))

            case 'enter':
            case 'space':
                return stopEvent(event,this.activateOrNavigateRight())

            case 'left':
                return stopEvent(event,this.navigateLeft())

            case 'right':
                return stopEvent(event,this.navigateRight())

        }

    }

    return Popup
})()

export default {menu:function (opt)
{
    return new Popup(opt)
}};