var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var CommandList

import matchr from "../../kxk/matchr.js"

import salt from "../tools/salt.js"

import Syntax from "../editor/Syntax.js"

import TextEditor from "../editor/TextEditor.js"


CommandList = (function ()
{
    _k_.extend(CommandList, TextEditor)
    function CommandList (command, viewElem, opt)
    {
        var _25_41_

        this.command = command
    
        this["dequeueMeta"] = this["dequeueMeta"].bind(this)
        this["onMetaClick"] = this["onMetaClick"].bind(this)
        CommandList.__super__.constructor.call(this,viewElem,{features:['Scrollbar','Numbers','Meta'],lineHeight:1.4,fontSize:19,scrollOffset:0,syntaxName:((_25_41_=opt.syntaxName) != null ? _25_41_ : 'ko')})
        this.name = 'commandlist-editor'
        this.items = []
        this.metaQueue = []
        this.maxLines = 17
    }

    CommandList.prototype["addItems"] = function (items)
    {
        var index, item, rngs, text, viewHeight, _50_30_, _50_42_, _55_29_, _57_24_, _65_32_, _68_32_

        this.clear()
        index = 0
        viewHeight = this.size.lineHeight * Math.min(this.maxLines,items.length)
        this.view.style.height = `${viewHeight}px`
        if (viewHeight !== this.scroll.viewHeight)
        {
            this.resized()
        }
        var list = _k_.list(items)
        for (var _48_17_ = 0; _48_17_ < list.length; _48_17_++)
        {
            item = list[_48_17_]
            if (!(item != null))
            {
                continue
            }
            text = (typeof (((_50_30_=item.text) != null ? _50_30_ : item)).trim === "function" ? (((_50_30_=item.text) != null ? _50_30_ : item)).trim() : undefined)
            if (!(text != null ? text.length : undefined))
            {
                continue
            }
            this.items.push(item)
            rngs = ((_55_29_=item.rngs) != null ? _55_29_ : [])
            if ((item.clss != null))
            {
                rngs.push({match:text,start:0,clss:item.clss,index:0})
            }
            this.appendMeta({line:((_65_32_=item.line) != null ? _65_32_ : ' '),text:text,rngs:rngs,type:((_68_32_=item.type) != null ? _68_32_ : this.config.syntaxName),clss:'commandlistItem',index:index,click:this.onMetaClick})
            index += 1
        }
    }

    CommandList.prototype["onMetaClick"] = function (meta)
    {
        return this.command.listClick(meta[2].index)
    }

    CommandList.prototype["appendLineDiss"] = function (text, diss = [])
    {
        if ((diss != null ? diss.length : undefined))
        {
            this.syntax.setDiss(this.numLines(),diss)
        }
        return this.appendText(text)
    }

    CommandList.prototype["appendMeta"] = function (meta)
    {
        var diss, r, rngs, text, _103_20_, _105_25_, _106_29_

        if (!(meta != null))
        {
            return console.error('CommandList.appendMeta -- no meta?')
        }
        this.meta.addDiv(this.meta.append(meta))
        if ((meta.diss != null))
        {
            return this.appendLineDiss(Syntax.lineForDiss(meta.diss),meta.diss)
        }
        else if ((meta.text != null) && meta.text.trim().length)
        {
            r = ((_106_29_=meta.rngs) != null ? _106_29_ : [])
            text = meta.text.trim()
            rngs = r.concat(Syntax.rangesForTextAndSyntax(text,meta.type || 'ko'))
            matchr.sortRanges(rngs)
            diss = matchr.dissect(rngs,{join:true})
            return this.appendLineDiss(text,diss)
        }
    }

    CommandList.prototype["queueMeta"] = function (meta)
    {
        this.metaQueue.push(meta)
        clearTimeout(this.metaTimer)
        return this.metaTimer = setTimeout(this.dequeueMeta,0)
    }

    CommandList.prototype["dequeueMeta"] = function ()
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

    CommandList.prototype["clear"] = function ()
    {
        var _132_13_

        this.items = []
        ;(this.meta != null ? this.meta.clear() : undefined)
        return CommandList.__super__.clear.call(this)
    }

    return CommandList
})()

export default CommandList;