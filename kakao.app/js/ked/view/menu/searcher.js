var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = performance.now(); }, profilend: function (id) { var b = performance.now()-_k_.hrtime[id]; let f=0.001; for (let u of ['s','ms','μs','ns']) { if (u=='ns' || (b*f)>=1) { return console.log(id+' '+Number.parseFloat(b*f).toFixed(1)+' '+u); } f*=1000; }}}

var searcher

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let slash = kxk.slash

import nfs from "../../../kxk/nfs.js"

import belt from "../../edit/tool/belt.js"

import prjcts from "../../util/prjcts.js"

import finder from "./finder.js"
import searcherfile from "./searcherfile.js"


searcher = (function ()
{
    _k_.extend(searcher, finder)
    function searcher (screen, state)
    {
        this.screen = screen
        this.state = state
    
        this["onMouse"] = this["onMouse"].bind(this)
        this["layout"] = this["layout"].bind(this)
        searcher.__super__.constructor.call(this,this.screen,this.state,'searcher')
        this.sfils = []
    }

    searcher.prototype["layout"] = function ()
    {
        searcher.__super__.layout.call(this)
    
        var sfil, y

        var list = _k_.list(this.sfils)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            sfil = list[_a_]
            y = this.choices.cells.y - this.choices.state.s.view[1] + sfil.lineIndex
            sfil.layout(this.choices.cells.x,y,this.choices.cells.cols,1)
        }
    }

    searcher.prototype["draw"] = function ()
    {
        var sfil

        if (this.hidden())
        {
            return
        }
        searcher.__super__.draw.call(this)
        var list = _k_.list(this.sfils)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            sfil = list[_a_]
            if ((this.choices.state.s.view[1] <= sfil.lineIndex && sfil.lineIndex < this.choices.state.s.view[1] + this.choices.cells.rows))
            {
                sfil.draw()
            }
        }
    }

    searcher.prototype["onMouse"] = function (event)
    {
        var ret, sfil

        if (this.hidden())
        {
            return
        }
        var list = _k_.list(this.sfils)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            sfil = list[_a_]
            ret = sfil.onMouse(event)
            if ((ret != null ? ret.redraw : undefined))
            {
                return ret
            }
        }
        return searcher.__super__.onMouse.call(this,event)
    }

    searcher.prototype["emitFileOpen"] = function (choice)
    {
        var onOpen, textToHighlight

        textToHighlight = this.input.current()
        onOpen = (function (p)
        {
            console.log(`file.loaded ${p}`)
            post.emit('editor.highlight',textToHighlight)
            return post.removeListener('file.opened',onOpen)
        }).bind(this)
        post.on('file.loaded',onOpen)
        return searcher.__super__.emitFileOpen.call(this,choice)
    }

    searcher.prototype["highlightTextAndEmitRedraw"] = function (text)
    {
        console.log('highlight & redraw')
        this.layout()
        this.choices.state.highlightText(text)
        return post.emit('redraw')
    }

    searcher.prototype["show"] = async function (text)
    {
        var dir, editorFile, ext, file, files, filet, front, idx, index, segls, sfil, span, spans

        text = this.searchText(text)
        if (_k_.empty(text))
        {
            this.layout()
            this.input.grabFocus()
            post.emit('redraw')
            return
        }
        editorFile = ked_session.get('editor▸file')
        dir = prjcts.dir(editorFile)
        files = prjcts.files(editorFile)
        this.input.grabFocus()
        this.choices.clearEmpty()
        this.sfils = []
        this.layout()
        post.emit('redraw')
        var list = _k_.list(files)
        for (idx = 0; idx < list.length; idx++)
        {
            file = list[idx]
            filet = await nfs.readText(file)
            segls = kseg.segls(filet)
            spans = belt.lineSpansForText(segls,text)
            if (idx === files.length - 1)
            {
                this.highlightTextAndEmitRedraw(text)
            }
            if (_k_.empty(spans))
            {
                continue
            }
            _k_.profile('searcher')
            console.log(`append ${spans.length} results for ${file}`)
            front = belt.frontmostSpans(spans)
            ext = slash.ext(file)
            this.choices.add({line:''})
            index = this.choices.items.length
            sfil = new searcherfile(this.screen,`${this.name}_sfil_${index}`)
            sfil.lineIndex = index
            sfil.set(slash.relative(file,dir))
            this.sfils.push(sfil)
            this.choices.add({ext:ext,line:'●',type:'file',path:file,row:0,col:0})
            var list1 = _k_.list(front)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                span = list1[_b_]
                if (this.choices.items.slice(-1)[0].row !== span[1] - 1)
                {
                    this.choices.add({line:''})
                }
                this.choices.add({ext:ext,line:' ' + kseg.str(segls[span[1]]),path:file,row:span[1],col:span[2]})
            }
            _k_.profilend('searcher')
            if (this.hidden())
            {
                return
            }
            if (idx % 10 === 0 || idx === files.length - 1)
            {
                this.highlightTextAndEmitRedraw(text)
            }
        }
    }

    searcher.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
                return this.show(text)

            case 'change':
                return

        }

        return searcher.__super__.onInputAction.call(this,action,text)
    }

    return searcher
})()

export default searcher;