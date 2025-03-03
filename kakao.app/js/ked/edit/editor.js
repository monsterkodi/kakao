var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var editor

import kxk from "../../kxk.js"
let post = kxk.post

import util from "../util/util.js"

import scroll from "../view/scroll.js"
import gutter from "../view/gutter.js"
import mapscr from "../view/mapscr.js"
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
        this["onFinderApply"] = this["onFinderApply"].bind(this)
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
        if (this.name === 'editor')
        {
            post.on('finder.apply',this.onFinderApply)
        }
        if (this.feats.scrllr)
        {
            this.scroll = new scroll(this.screen,this.state,'right')
        }
        if (this.feats.scroll)
        {
            this.scroll = new scroll(this.screen,this.state,'left')
        }
        if (this.feats.gutter)
        {
            this.gutter = new gutter(this.screen,this.state)
        }
        if (this.feats.mapscr)
        {
            this.mapscr = new mapscr(this.screen,this.state)
            this.mapscr.show()
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
        var g, m, r, s, sl, sr, _65_17_

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
        var col, row, start, x, y, _162_31_, _77_30_, _77_39_, _78_30_, _79_32_, _89_41_

        if (((_77_30_=this.mapscr) != null ? typeof (_77_39_=_77_30_.onMouse) === "function" ? _77_39_(event) : undefined : undefined))
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
        var _a_ = this.cells.posForEvent(event); col = _a_[0]; row = _a_[1]

        switch (event.type)
        {
            case 'press':
                if (this.cells.isOutsideEvent(event))
                {
                    if (!(this.gutter != null ? this.gutter.cells.isInsideEvent(event) : undefined))
                    {
                        return
                    }
                }
                if (event.count > 1)
                {
                    if (!event.shift)
                    {
                        this.state.deselect()
                    }
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    if (event.count === 2)
                    {
                        if (event.alt)
                        {
                            this.state.selectChunk(x,y)
                        }
                        else
                        {
                            this.state.selectWord(x,y)
                        }
                    }
                    else
                    {
                        this.state.selectLine(y)
                    }
                    this.dragStart = _k_.copy(this.state.s.selections[0])
                    return true
                }
                else
                {
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    this.dragStart = [x,y,x]
                    if (!event.shift)
                    {
                        this.state.deselect()
                    }
                    if (!event.alt)
                    {
                        this.state.clearCursors()
                    }
                    if (event.alt)
                    {
                        this.state.addCursor(x,y)
                    }
                    else
                    {
                        if (event.shift && this.state.s.cursors.length === 1)
                        {
                            this.state.setMainCursorAndSelect(x,y)
                        }
                        else
                        {
                            this.state.setMainCursor(x,y)
                        }
                    }
                    this.grabFocus()
                    return true
                }
                break
            case 'drag':
                if (this.dragStart)
                {
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    start = [this.dragStart[0],this.dragStart[1]]
                    if (y < this.dragStart[1])
                    {
                        start = [this.dragStart[2],this.dragStart[1]]
                    }
                    if (event.shift)
                    {
                        this.state.addRangeToSelectionWithMainCursorAtEnd(util.rangeFromStartToEnd(start,[x,y]))
                    }
                    else
                    {
                        this.state.select(start,[x,y])
                    }
                    return true
                }
                break
            case 'release':
                delete this.dragStart
                break
            case 'move':
                if (this.cells.isInsideEvent(event))
                {
                    if (!this.hasFocus() && _k_.empty(view.currentPopup) || view.currentPopup === this.name)
                    {
                        console.log(`${this.name} grab focus`)
                        this.grabFocus()
                    }
                    post.emit('pointer','text')
                }
                else if ((this.gutter != null ? this.gutter.cells.isInsideEvent(event) : undefined))
                {
                    post.emit('pointer','vertical-text')
                }
                break
        }

        return false
    }

    editor.prototype["onWheel"] = function (event)
    {
        var col, inside, row, start, steps, x, y, _209_25_, _210_25_, _211_25_, _215_20_

        if (event.cell[1] >= this.cells.y + this.cells.rows)
        {
            return
        }
        if (this.name === 'editor')
        {
            steps = 1
            if (event.shift)
            {
                steps *= 2
            }
            if (event.ctrl)
            {
                steps *= 2
            }
            if (event.alt)
            {
                steps *= 2
            }
            if (this.dragStart)
            {
                var _a_ = this.state.mainCursor(); x = _a_[0]; y = _a_[1]

                switch (event.dir)
                {
                    case 'up':
                        y -= steps
                        break
                    case 'down':
                        y += steps
                        break
                    case 'left':
                        x -= 1
                        break
                    case 'right':
                        x += 1
                        break
                }

                y = _k_.clamp(0,this.state.s.lines.length - 1,y)
                x = _k_.clamp(0,this.state.s.lines[y].length - 1,x)
                start = [this.dragStart[0],this.dragStart[1]]
                if (y < this.dragStart[1])
                {
                    start = [this.dragStart[2],this.dragStart[1]]
                }
                if (this.state.select(start,[x,y]))
                {
                    this.redraw()
                }
                return
            }
        }
        var _b_ = this.cells.posForEvent(event); col = _b_[0]; row = _b_[1]

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
                this.state.scrollView(event.dir,steps)
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

    editor.prototype["onFinderApply"] = function (text)
    {
        this.state.highlightText(text)
        this.state.moveCursorToNextHighlight()
        return this.grabFocus()
    }

    editor.prototype["onKey"] = function (key, event)
    {
        var _286_20_, _290_21_, _295_24_

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