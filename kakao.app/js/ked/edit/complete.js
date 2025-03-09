var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.b8=_k_.k.F256(_k_.k.b(8));_k_.y6=_k_.k.F256(_k_.k.y(6))

var complete

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let kutil = kxk.kutil
let post = kxk.post

import theme from "../theme/theme.js"

import belt from "./tool/belt.js"

import specs from "./specs.js"


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
        this.choices.color.bg = theme.editor_complete_choices
        this.choices.scroll.handle = '▐'
        this.choices.scroll.color.bg = theme.editor_complete_choices
        this.choices.scroll.color.knob = theme.editor_complete_choices_scroll
        this.choices.scroll.color.dot = theme.editor_complete_choices_scroll
        this.choices.on('action',this.onChoicesAction)
        this.visible = false
    }

    complete.prototype["complete"] = function ()
    {
        if (_k_.empty(this.editor.state.chunkAfterCursor()))
        {
            return this.word(this.editor.state.chunkBeforeCursor())
        }
    }

    complete.prototype["word"] = function (turd)
    {
        this.turd = turd
    
        var ch, ci, cx, cy, h, head, inserts, mc, mlw, x, y

        console.log(`complete.word ${_k_.b8(this.turd)}`)
        if (_k_.empty(this.turd))
        {
            this.visible = false
            return
        }
        this.words = kseg.chunks(this.editor.state.s.lines).map(function (chunk)
        {
            return chunk.chunk
        })
        this.words = belt.prepareWordsForCompletion(this.turd,this.words)
        this.words.sort()
        console.log(`@words ${_k_.y6(this.words.length)}`,this.words)
        if (inserts = specs.trigger[this.turd])
        {
            this.words = inserts.concat(this.words)
        }
        this.visible = !_k_.empty(this.words)
        if (_k_.empty(this.words))
        {
            return
        }
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
            mlw = _k_.max(1,belt.widthOfLines(this.words))
            h = _k_.min(8,this.words.length)
            x = this.editor.cells.x + cx - this.turd.length
            y = this.editor.cells.y + cy + 1
            this.choices.layout(x,y,mlw + 3,h)
            this.choices.set(this.words.map(function (w)
            {
                return ' ' + w
            }))
            return this.choices.selectFirst()
        }
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
        var key, word

        word = this.currentWord()
        if (key = specs.inserts[word])
        {
            this.editor.state.delete('back')
            this.editor.state.insert(word)
        }
        else
        {
            this.editor.state.insert(word.slice(this.turd.length))
        }
        post.emit('focus','editor')
        return this.complete()
    }

    complete.prototype["onChoicesAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'click':
                return this.apply()

        }

    }

    complete.prototype["currentWord"] = function ()
    {
        var word

        word = this.choices.current({trim:'front'})
        if (_k_.empty(word))
        {
            word = this.words[0]
        }
        return word
    }

    complete.prototype["draw"] = function ()
    {
        var bg, ch, ci, cx, cy, fx, fy, h, mc, w, word, x, y, _219_52_

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
            bg = ((_219_52_=theme[this.editor.name + '_selection']) != null ? _219_52_ : theme.editor_selection)
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