var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var complete

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let kutil = kxk.kutil
let post = kxk.post

import theme from "../util/theme.js"
import util from "../util/util.js"


complete = (function ()
{
    function complete (editor)
    {
        this.editor = editor
    
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onEditorLayout"] = this["onEditorLayout"].bind(this)
        this.name = this.editor.name + '_complete'
        this.choices = new choices_class(this.editor.cells.screen,`${this.name}_choices`,['scrllr'])
        this.choices.focusable = false
        this.choices.rounded = false
        this.choices.scroll.handle = '▐'
        this.choices.scroll.color.bg = theme.editor_complete_choices
        this.choices.scroll.color.knob = theme.editor_complete_choices_scroll
        this.choices.scroll.color.dot = theme.editor_complete_choices_scroll
        this.choices.on('action',this.onChoicesAction)
        this.visible = false
    }

    complete.prototype["hide"] = function ()
    {
        return this.visible = false
    }

    complete.prototype["hidden"] = function ()
    {
        return !this.visible
    }

    complete.prototype["onEditorLayout"] = function ()
    {
        if (this.hidden())
        {
            return
        }
    }

    complete.prototype["handleKey"] = function (key, event)
    {
        if (this.hidden() || _k_.empty(this.words))
        {
            return 'unhandled'
        }
        switch (key)
        {
            case 'tab':
            case 'right':
            case 'return':
                return this.apply()

            case 'esc':
                return this.hide()

            case 'up':
            case 'down':
                if (this.words.length > 1)
                {
                    return this.moveSelection(key)
                }
                break
        }

        return 'unhandled'
    }

    complete.prototype["onMouse"] = function (event)
    {
        var cret

        if (this.hidden())
        {
            return
        }
        cret = this.choices.onMouse(event)
        if (!cret && _k_.in(event.type,['press','drag','release']))
        {
            this.hide()
            return
        }
        return cret
    }

    complete.prototype["onWheel"] = function (event)
    {
        if (this.hidden())
        {
            return
        }
        return this.choices.onWheel(event)
    }

    complete.prototype["moveSelection"] = function (dir)
    {
        return this.choices.moveSelection(dir)
    }

    complete.prototype["apply"] = function ()
    {
        this.editor.state.insert(this.currentWord().slice(this.turd.length))
        post.emit('focus','editor')
        return this.hide()
    }

    complete.prototype["onChoicesAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'click':
                return this.apply()

        }

        console.log(`onChoicesAction ${action} ${choice}`)
    }

    complete.prototype["currentWord"] = function ()
    {
        var word

        word = this.choices.current()
        if (_k_.empty(word))
        {
            word = this.words[0]
        }
        return word
    }

    complete.prototype["word"] = function (turd)
    {
        this.turd = turd
    
        var ch, ci, cx, cy, h, head, mc, mlw, x, y

        if (_k_.empty(this.turd))
        {
            this.visible = false
            return
        }
        this.words = kseg.chunks(this.editor.state.allLines()).map(function (chunk)
        {
            return kseg.str(chunk.segl)
        })
        this.words = kutil.uniq(this.words)
        this.words = this.words.filter((function (w)
        {
            return w.startsWith(this.turd) && w !== this.turd
        }).bind(this))
        this.words = util.cleanWordsForCompletion(this.words)
        this.words.sort()
        if (_k_.in(this.turd,'rt'))
        {
            console.log(`@turd ${this.turd}`)
            switch (this.turd)
            {
                case 'r':
                    this.words.unshift('r⮐ ')
                    break
                case 't':
                    this.words.unshift('t➜')
                    break
            }

        }
        if (_k_.empty(this.words))
        {
            this.visible = false
            return
        }
        this.visible = true
        mc = this.editor.state.mainCursor()
        head = this.words[0]
        cx = mc[0] - this.editor.state.s.view[0]
        cy = mc[1] - this.editor.state.s.view[1]
        var list = _k_.list(head.slice(this.turd.length))
        for (ci = 0; ci < list.length; ci++)
        {
            ch = list[ci]
            this.editor.cells.set(cx + ci,cy,ch,'#fff',theme.selection)
        }
        if (this.words.length <= 1)
        {
            return this.choices.clear()
        }
        else
        {
            mlw = util.widthOfLines(this.words)
            h = _k_.min(8,this.words.length)
            x = this.editor.cells.x + cx - this.turd.length
            y = this.editor.cells.y + cy + 1
            this.choices.layout(x,y,mlw + 1,h)
            this.choices.set(this.words)
            return this.choices.selectFirst()
        }
    }

    complete.prototype["draw"] = function ()
    {
        var bg, ch, ci, cx, cy, fx, fy, h, mc, w, word, x, y, _192_52_

        if (this.hidden() || _k_.empty(this.words))
        {
            return
        }
        mc = this.editor.state.mainCursor()
        cx = mc[0] - this.editor.state.s.view[0]
        cy = mc[1] - this.editor.state.s.view[1]
        word = this.currentWord()
        var list = _k_.list(word.slice(this.turd.length))
        for (ci = 0; ci < list.length; ci++)
        {
            ch = list[ci]
            bg = ((_192_52_=theme[this.editor.name + '_selection']) != null ? _192_52_ : theme.editor_selection)
            this.editor.cells.set(cx + ci,cy,ch,'#fff',bg)
        }
        if (this.words.length <= 1)
        {
            return
        }
        fx = cx - this.turd.length - 1
        x = fx + 1 + this.editor.cells.x
        y = cy + this.editor.cells.y + 2
        w = this.choices.cells.cols + 1
        h = this.choices.cells.rows
        fy = cy + 1
        this.editor.cells.draw_frame(fx,fy,fx + w + 1,fy + h + 1,{fg:theme.editor_complete_choices,bg:'#000'})
        this.choices.layout(x,y,w,h)
        return this.choices.draw()
    }

    return complete
})()

export default complete;