var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var complete

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let kutil = kxk.kutil

import theme from "../util/theme.js"
import util from "../util/util.js"


complete = (function ()
{
    function complete (editor)
    {
        this.editor = editor
    
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onEditorLayout"] = this["onEditorLayout"].bind(this)
        this.name = this.editor.name + '_complete'
        this.choices = new choices_class(this.editor.cells.screen,`${this.name}_choices`)
        this.choices.focusable = false
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

            case 'up':
            case 'down':
                if (this.words.length > 1)
                {
                    return this.moveSelection(key)
                }
                break
            case 'esc':
                return this.hide()

        }

        return 'unhandled'
    }

    complete.prototype["onMouse"] = function (event)
    {
        if (this.hidden())
        {
            return
        }
        return this.choices.onMouse(event)
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
        this.editor.state.insert(this.choices.current().slice(this.turd.length))
        return this.hide()
    }

    complete.prototype["word"] = function (turd)
    {
        this.turd = turd
    
        var ch, ci, cx, cy, h, head, mc, mlw, x, y

        if (_k_.empty(this.turd))
        {
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
        this.words.sort()
        if (_k_.empty(this.words))
        {
            console.log(`${this.name} ▸${this.turd}◂ no completion`)
            this.visible = false
            return
        }
        console.log(`${this.name} ▸${this.turd}◂`,this.words)
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
            return
        }
        mlw = util.maxLineWidth(this.words)
        h = _k_.min(8,this.words.length)
        x = this.editor.cells.x + cx - this.turd.length
        y = this.editor.cells.y + cy + 1
        this.choices.layout(x,y,mlw + 1,h)
        this.choices.set(this.words)
        return this.choices.selectFirst()
    }

    complete.prototype["draw"] = function ()
    {
        var bg, ch, ci, cx, cy, mc, x, y, _151_52_

        if (this.hidden() || _k_.empty(this.words))
        {
            return
        }
        mc = this.editor.state.mainCursor()
        cx = mc[0] - this.editor.state.s.view[0]
        cy = mc[1] - this.editor.state.s.view[1]
        var list = _k_.list(this.choices.current().slice(this.turd.length))
        for (ci = 0; ci < list.length; ci++)
        {
            ch = list[ci]
            bg = ((_151_52_=theme[this.editor.name + '_selection']) != null ? _151_52_ : theme.editor_selection)
            this.editor.cells.set(cx + ci,cy,ch,'#fff',bg)
        }
        if (this.words.length <= 1)
        {
            return
        }
        x = this.editor.cells.x + cx - this.turd.length
        y = this.editor.cells.y + cy + 1
        this.choices.layout(x,y,this.choices.cells.cols + 1,this.choices.cells.rows)
        return this.choices.draw()
    }

    return complete
})()

export default complete;