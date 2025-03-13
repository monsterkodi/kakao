var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var finder

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let kutil = kxk.kutil

import theme from "../../theme/theme.js"

import belt from "../../edit/tool/belt.js"

import inputchoice from "./inputchoice.js"


finder = (function ()
{
    _k_.extend(finder, inputchoice)
    function finder (screen, state, name = 'finder')
    {
        this.screen = screen
        this.state = state
    
        this["layout"] = this["layout"].bind(this)
        this["lineno"] = this["lineno"].bind(this)
        finder.__super__.constructor.call(this,this.screen,name,['gutter','scroll'])
        this.setColor('bg',theme.finder_bg)
        this.setColor('frame',theme.finder_frame)
        this.choices.setColor('bg',this.color.bg)
        this.choices.setColor('empty',this.color.bg)
        this.choices.gutter.setColor('bg',this.color.bg)
        this.choices.scroll.setColor('bg',this.color.bg)
        this.input.setColor('bg',this.color.bg)
        this.input.setColor('empty',this.color.bg)
        this.choices.state.skipAdjustViewForMainCursor = true
        this.choices.state.syntax.setExt('kode')
        this.choices.gutter.lineno = this.lineno
        this.choices.gutter.color.highlight = theme.linenr
    }

    finder.prototype["lineno"] = function (y)
    {
        var pad

        pad = this.choices.gutter.cells.cols - 1
        if ((0 <= y && y < this.choices.fuzzied.length))
        {
            if (this.choices.fuzzied[y].type === 'file')
            {
                return _k_.lpad(pad,'●') + ' '
            }
            if (_k_.isNum(this.choices.fuzzied[y].row))
            {
                return _k_.lpad(pad,this.choices.fuzzied[y].row + 1) + ' '
            }
        }
        return _k_.lpad(pad + 1)
    }

    finder.prototype["layout"] = function ()
    {
        var cs, h, w, x, y

        x = parseInt(this.screen.cols / 8)
        y = parseInt(this.screen.rows / 8)
        w = parseInt(this.screen.cols * 3 / 4)
        h = parseInt(this.screen.rows * 3 / 4 - 4)
        cs = _k_.min(h,this.choices.numFiltered())
        this.input.layout(x + 2,y + 1,w - 4,1)
        this.choices.layout(x + 1,y + 3,w - 3,cs)
        return this.cells.layout(x,y,w,cs + 4)
    }

    finder.prototype["searchText"] = function (text)
    {
        if (_k_.empty(text))
        {
            text = this.state.textOfSelectionOrWordAtCursor()
            if (!_k_.empty(text))
            {
                this.input.set(text)
                this.input.selectAll()
            }
            else
            {
                text = ''
            }
        }
        return text
    }

    finder.prototype["show"] = function (text)
    {
        var cursorLine, front, span, _123_87_

        if (_k_.empty(text))
        {
            cursorLine = this.state.mainCursor()[1]
        }
        text = this.searchText(text)
        if (_k_.empty(text))
        {
            this.layout()
            this.input.grabFocus()
            return
        }
        this.state.highlightText(text)
        this.choices.clearEmpty()
        front = belt.frontmostSpans(this.state.s.highlights)
        var list = _k_.list(front)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            if (this.choices.items.length > 1 && this.choices.items.slice(-1)[0].row !== span[1] - 1)
            {
                this.choices.add({line:''})
            }
            this.choices.add({ext:'kode',line:' ' + kseg.str(this.state.s.lines[span[1]]),row:span[1],col:span[2]})
        }
        this.choices.state.highlightText(text)
        if (cursorLine)
        {
            this.choices.select(((_123_87_=kutil.findIndex(this.choices.items,function (l)
            {
                return l.row === cursorLine
            })) != null ? _123_87_ : 0))
        }
        else
        {
            this.choices.selectFirst()
        }
        this.layout()
        return this.input.grabFocus()
    }

    finder.prototype["emitFileOpen"] = function (choice)
    {
        return post.emit('file.open',choice.path,choice.row,choice.col)
    }

    finder.prototype["apply"] = function (choice)
    {
        if (!_k_.empty(choice))
        {
            if (choice.path)
            {
                this.emitFileOpen(choice)
            }
            else
            {
                post.emit('goto.line',choice.row,choice.col)
            }
        }
        post.emit('focus','editor')
        this.hide()
        return {redraw:true}
    }

    finder.prototype["applyChoice"] = function (choice)
    {
        return this.apply(choice)
    }

    finder.prototype["onChoicesAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'left':
                this.input.grabFocus()
                return true

        }

        return finder.__super__.onChoicesAction.call(this,action,choice)
    }

    finder.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
                return this.apply(this.choices.current())

            case 'change':
                if (!_k_.empty(text))
                {
                    return this.show(text)
                }
                else
                {
                    return this.choices.clear()
                }
                break
        }

        return finder.__super__.onInputAction.call(this,action,text)
    }

    return finder
})()

export default finder;