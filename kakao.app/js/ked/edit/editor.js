var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var editor

import kxk from "../../kxk.js"
let post = kxk.post

import util from "../util/util.js"

import scroll from "../view/scroll.js"
import gutter from "../view/gutter.js"
import mapscr from "../view/mapscr.js"
import mapview from "../view/mapview.js"

import state from "./state.js"
import draw from "./draw.js"


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
            this.scroll = new scroll(this.screen,this.state)
        }
        if (this.feats.scroll)
        {
            this.scroll = new scroll(this.screen,this.state)
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
    }

    editor.prototype["layout"] = function (x, y, w, h)
    {
        var g, m, r, s, sl, sr

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
        return this.state.initView()
    }

    editor.prototype["onMouse"] = function (event)
    {
        var col, row, start, x, y, _153_31_, _74_30_, _74_39_, _75_30_, _85_41_

        if (((_74_30_=this.mapscr) != null ? typeof (_74_39_=_74_30_.onMouse) === "function" ? _74_39_(event) : undefined : undefined))
        {
            return true
        }
        if ((this.scroll != null ? this.scroll.onMouse(event) : undefined))
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
                    true
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
        var col, row, start, steps, x, y

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

        if (!this.cells.isInsideEvent(event))
        {
            return
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

        return this.redraw()
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
        return this.state.moveCursorToNextHighlight()
    }

    editor.prototype["onKey"] = function (key, event)
    {
        if (!this.hasFocus())
        {
            return
        }
        if (this.state.s.cursors.length === 1)
        {
            switch (key)
            {
                case 'ctrl+alt+up':
                    return this.state.moveCursors('up',{count:8})

                case 'ctrl+alt+down':
                    return this.state.moveCursors('down',{count:8})

                case 'ctrl+alt+left':
                    return this.state.moveCursors('left',{count:8})

                case 'ctrl+alt+right':
                    return this.state.moveCursors('right',{count:8})

                case 'shift+ctrl+alt+up':
                    return this.state.moveCursors('up',{count:16})

                case 'shift+ctrl+alt+down':
                    return this.state.moveCursors('down',{count:16})

                case 'shift+ctrl+alt+left':
                    return this.state.moveCursors('left',{count:16})

                case 'shift+ctrl+alt+right':
                    return this.state.moveCursors('right',{count:16})

            }

        }
        switch (key)
        {
            case 'up':
                return this.state.moveCursors('up')

            case 'down':
                return this.state.moveCursors('down')

            case 'left':
                return this.state.moveCursors('left')

            case 'right':
                return this.state.moveCursors('right')

            case 'cmd+left':
            case 'ctrl+left':
                return this.state.moveCursors(['bos','ind_bol'])

            case 'cmd+right':
            case 'ctrl+right':
                return this.state.moveCursors(['eos','ind_eol'])

            case 'alt+left':
                return this.state.moveCursors('left',{jump:['ws','word','empty','punct']})

            case 'alt+right':
                return this.state.moveCursors('right',{jump:['ws','word','empty','punct']})

            case 'shift+alt+right':
                return this.state.moveCursorsAndSelect('right',{jump:['ws','word','empty','punct']})

            case 'shift+alt+left':
                return this.state.moveCursorsAndSelect('left',{jump:['ws','word','empty','punct']})

            case 'shift+up':
                return this.state.moveCursorsAndSelect('up')

            case 'shift+down':
                return this.state.moveCursorsAndSelect('down')

            case 'shift+left':
                return this.state.moveCursorsAndSelect('left')

            case 'shift+right':
                return this.state.moveCursorsAndSelect('right')

            case 'shift+cmd+right':
                return this.state.moveCursorsAndSelect('ind_eol')

            case 'shift+cmd+left':
                return this.state.moveCursorsAndSelect('ind_bol')

            case 'shift+ctrl+h':
                return this.state.moveCursorsAndSelect('bof')

            case 'shift+ctrl+j':
                return this.state.moveCursorsAndSelect('eof')

            case 'shift+alt+cmd+up':
                return this.state.moveMainCursorInDirection('up',{keep:true})

            case 'shift+alt+cmd+down':
                return this.state.moveMainCursorInDirection('down',{keep:true})

            case 'shift+alt+cmd+left':
                return this.state.moveMainCursorInDirection('left',{keep:true})

            case 'shift+alt+cmd+right':
                return this.state.moveMainCursorInDirection('right',{keep:true})

            case 'alt+up':
                return this.state.moveSelectionOrCursorLines('up')

            case 'alt+down':
                return this.state.moveSelectionOrCursorLines('down')

            case 'shift+alt+up':
                return this.state.cloneSelectionAndCursorLines('up')

            case 'shift+alt+down':
                return this.state.cloneSelectionAndCursorLines('down')

            case 'cmd+up':
            case 'ctrl+up':
                return this.state.expandCursors('up')

            case 'cmd+down':
            case 'ctrl+down':
                return this.state.expandCursors('down')

            case 'shift+cmd+up':
            case 'shift+ctrl+up':
                return this.state.contractCursors('up')

            case 'shift+cmd+down':
            case 'shift+ctrl+down':
                return this.state.contractCursors('down')

            case 'pageup':
                return this.state.singleCursorPage('up')

            case 'pagedown':
                return this.state.singleCursorPage('down')

            case 'home':
                return this.state.singleCursorAtIndentOrStartOfLine()

            case 'end':
                return this.state.singleCursorAtEndOfLine()

            case 'ctrl+h':
                return this.state.setMainCursor(0,0)

            case 'ctrl+j':
                return this.state.setMainCursor(this.state.s.lines[this.state.s.lines.length - 1].length,this.state.s.lines.length - 1)

            case 'alt+d':
                return this.state.delete('next',true)

            case 'shift+ctrl+k':
            case 'entf':
                return this.state.delete('next')

            case 'ctrl+k':
                return this.state.delete('eol')

            case 'delete':
                return this.state.delete('back')

            case 'ctrl+delete':
                return this.state.delete('back',true)

            case 'cmd+delete':
                return this.state.delete('back',true)

            case 'shift+tab':
                return this.state.deindentSelectedOrCursorLines()

            case 'tab':
                return this.state.insert('\t')

            case 'alt+x':
            case 'cmd+x':
            case 'ctrl+x':
                return this.state.cut()

            case 'alt+c':
            case 'cmd+c':
            case 'ctrl+c':
                return this.state.copy()

            case 'alt+v':
            case 'cmd+v':
            case 'ctrl+v':
                return this.state.paste()

            case 'cmd+z':
            case 'ctrl+z':
                return this.state.undo()

            case 'shift+cmd+z':
            case 'cmd+y':
            case 'ctrl+y':
                return this.state.redo()

            case 'cmd+a':
            case 'ctrl+a':
                return this.state.selectAllLines()

            case 'cmd+j':
            case 'ctrl+j':
                return this.state.joinLines()

            case 'cmd+l':
            case 'ctrl+l':
                return this.state.selectMoreLines()

            case 'shift+cmd+l':
            case 'shift+ctrl+l':
                return this.state.selectLessLines()

            case 'cmd+e':
            case 'ctrl+e':
                return this.state.highlightWordAtCursor_deselectCursorHighlight_moveCursorToNextHighlight()

            case 'cmd+d':
            case 'ctrl+d':
                return this.state.selectWordAtCursor_highlightSelection_addNextHighlightToSelection()

            case 'cmd+g':
            case 'ctrl+g':
                return this.state.selectWordAtCursor_highlightSelection_selectNextHighlight()

            case 'shift+cmd+e':
            case 'shift+ctrl+e':
                return this.state.highlightWordAtCursor_deselectCursorHighlight_moveCursorToPrevHighlight()

            case 'shift+cmd+d':
            case 'shift+ctrl+d':
                return this.state.selectWordAtCursor_highlightSelection_addPrevHighlightToSelection()

            case 'shift+cmd+g':
            case 'shift+ctrl+g':
                return this.state.selectWordAtCursor_highlightSelection_selectPrevHighlight()

            case 'alt+cmd+d':
            case 'alt+ctrl+d':
                return this.state.selectWordAtCursor_highlightSelection_selectAllHighlights()

            case 'cmd+/':
            case 'ctrl+/':
                return this.state.toggleCommentAtSelectionOrCursorLines()

            case 'esc':
                return this.state.clearCursorsHighlightsAndSelections()

        }

        if (!_k_.empty(event.char))
        {
            return this.state.insert(event.char)
        }
        else
        {
            if (!(_k_.in(key,['shift','ctrl','alt','cmd'])))
            {
                return lfc('editor.onKey?',key)
            }
        }
    }

    return editor
})()

export default editor;