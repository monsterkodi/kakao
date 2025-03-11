var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var searcher

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let slash = kxk.slash

import nfs from "../../../kxk/nfs.js"

import belt from "../../edit/tool/belt.js"

import prjcts from "../../util/prjcts.js"

import finder from "./finder.js"


searcher = (function ()
{
    _k_.extend(searcher, finder)
    function searcher (screen, state)
    {
        this.screen = screen
        this.state = state
    
        searcher.__super__.constructor.call(this,this.screen,this.state,'searcher')
    }

    searcher.prototype["show"] = async function (text)
    {
        var dir, editorFile, file, files, filet, front, idx, items, segls, selectedIndex, span, spans, _62_35_

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
        this.choices.state.setMainCursor(0,0)
        this.choices.set([],'line')
        this.layout()
        this.input.grabFocus()
        post.emit('redraw')
        var list = _k_.list(files)
        for (idx = 0; idx < list.length; idx++)
        {
            file = list[idx]
            filet = await nfs.readText(file)
            segls = kseg.segls(filet)
            spans = belt.lineSpansForText(segls,text)
            if (_k_.empty(spans))
            {
                continue
            }
            front = belt.frontmostSpans(spans)
            items = ((_62_35_=this.choices.items) != null ? _62_35_ : [])
            items.push({line:''})
            items.push({line:slash.relative(file,dir),type:'file',path:file,row:0,col:0})
            var list1 = _k_.list(front)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                span = list1[_b_]
                if (items.slice(-1)[0].row !== span[1] - 1)
                {
                    items.push({line:''})
                }
                items.push({line:kseg.str(segls[span[1]]),path:file,row:span[1],col:span[2]})
            }
            if (this.hidden())
            {
                return
            }
            selectedIndex = this.choices.state.s.cursors[0][1]
            this.choices.set(items,'line')
            this.choices.state.highlightText(text)
            this.choices.select(selectedIndex)
            this.layout()
            post.emit('redraw')
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