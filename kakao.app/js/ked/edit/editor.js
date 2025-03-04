var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var editor

import kxk from "../../kxk.js"
let post = kxk.post

import util from "../util/util.js"

import scroll from "../view/scroll.js"
import mapview from "../view/mapview.js"
import view from "../view/view.js"

import state from "./state.js"
import draw from "./draw.js"
import complete from "./complete.js"


editor = (function ()
{
    _k_.extend(editor, draw)
    function editor (screen, name, features)
    {
        this["onKey"] = this["onKey"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["onFocus"] = this["onFocus"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["isCursorVisible"] = this["isCursorVisible"].bind(this)
        this["isCursorInEmpty"] = this["isCursorInEmpty"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["layout"] = this["layout"].bind(this)
        editor.__super__.constructor.call(this,screen,name,features)
        this.state = new state(this.cells,this.name)
        post.on('focus',this.onFocus)
        if (this.feats.scrllr)
        {
            this.scroll = new scroll(this.screen,this.state,'right')
        }
        if (this.feats.scroll)
        {
            this.scroll = new scroll(this.screen,this.state,'left')
        }
        if (this.feats.mapview)
        {
            this.mapscr = new mapview(this.screen,this.state)
        }
        if (this.feats.complete)
        {
            this.complete = new complete(this)
        }
    }

    editor.prototype["layout"] = function (x, y, w, h)
    {
        var g, m, r, s, sl, sr, _60_17_

        g = m = s = 0
        sl = sr = 0
        if (this.scroll)
        {
            s = 1
            if (this.feats.scrllr)
            {
                sr = s
                this.scroll.layout(x + w - sr,y,s,h)
            }
            else
            {
                sl = s
                this.scroll.layout(x,y,s,h)
            }
        }
        if (this.gutter)
        {
            g = this.state.gutterWidth()
            this.gutter.layout(x + sl,y,g,h)
        }
        if (this.mapscr)
        {
            m = (this.mapscr.visible() ? 10 : 0)
            r = (this.mapscr.visible() ? h : 0)
            this.mapscr.layout(x + w - sr - 10,y,m,r)
        }
        this.cells.layout(x + sl + g,y,w - s - g - m,h)
        ;(this.complete != null ? this.complete.onEditorLayout() : undefined)
        return this.state.initView()
    }

    editor.prototype["onMouse"] = function (event)
    {
        var _72_30_, _72_39_, _73_30_, _74_32_

        if (((_72_30_=this.mapscr) != null ? typeof (_72_39_=_72_30_.onMouse) === "function" ? _72_39_(event) : undefined : undefined))
        {
            return true
        }
        if ((this.scroll != null ? this.scroll.onMouse(event) : undefined))
        {
            return true
        }
        if ((this.complete != null ? this.complete.onMouse(event) : undefined))
        {
            return true
        }
        if (editor.__super__.onMouse.call(this,event))
        {
            return true
        }
        return false
    }

    editor.prototype["onWheel"] = function (event)
    {
        var inside, _90_25_, _91_25_, _92_25_, _96_20_

        if (event.cell[1] >= this.cells.y + this.cells.rows)
        {
            return
        }
        inside = this.cells.isInsideEvent(event)
        inside |= (this.scroll != null ? this.scroll.cells.isInsideEvent(event) : undefined)
        inside |= (this.gutter != null ? this.gutter.cells.isInsideEvent(event) : undefined)
        inside |= (this.mapscr != null ? this.mapscr.cells.isInsideEvent(event) : undefined)
        if (!inside)
        {
            return
        }
        if ((this.complete != null))
        {
            if (this.complete.onWheel(event))
            {
                return true
            }
        }
        switch (event.dir)
        {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                this.state.scrollView(event.dir)
                break
        }

        return true
    }

    editor.prototype["isCursorInEmpty"] = function (cursor)
    {
        cursor = (cursor != null ? cursor : this.state.mainCursor())
        return util.isLinesPosOutside(this.state.s.lines,cursor)
    }

    editor.prototype["isCursorVisible"] = function (cursor)
    {
        var v

        cursor = (cursor != null ? cursor : this.state.mainCursor())
        v = this.state.s.view
        return (v[0] <= cursor[0] && cursor[0] < v[0] + this.cells.cols) && (v[1] <= cursor[1] && cursor[1] < v[1] + this.cells.rows)
    }

    editor.prototype["grabFocus"] = function ()
    {
        post.emit('focus',this.name)
        return this.redraw()
    }

    editor.prototype["hasFocus"] = function ()
    {
        return this.state.hasFocus
    }

    editor.prototype["onFocus"] = function (name)
    {
        return this.state.hasFocus = (name === this.name)
    }

    editor.prototype["redraw"] = function ()
    {
        return post.emit('redraw')
    }

    editor.prototype["onKey"] = function (key, event)
    {
        var _161_20_, _165_21_, _170_24_

        if (!this.hasFocus())
        {
            return
        }
        if ((this.complete != null))
        {
            if (this.complete.handleKey(key,event) !== 'unhandled')
            {
                return
            }
        }
        if (this.state.handleKey(key,event) !== 'unhandled')
        {
            ;(this.complete != null ? this.complete.hide() : undefined)
            return
        }
        if (!_k_.empty(event.char))
        {
            this.state.insert(event.char)
            if ((this.complete != null))
            {
                if (_k_.empty(this.state.chunkAfterCursor()))
                {
                    console.log(`complete ${this.state.chunkBeforeCursor()}`)
                    return this.complete.word(this.state.chunkBeforeCursor())
                }
            }
        }
        else
        {
            if (!(_k_.in(key,['shift','ctrl','alt','cmd'])))
            {
                console.log('editor.onKey?',key)
            }
        }
    }

    return editor
})()

export default editor;