var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}};_k_.r6=_k_.k.F256(_k_.k.r(6));_k_.g4=_k_.k.F256(_k_.k.g(4));_k_.m5=_k_.k.F256(_k_.k.m(5))

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
    
        this["show"] = this["show"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        this["lineno"] = this["lineno"].bind(this)
        finder.__super__.constructor.call(this,this.screen,name,['gutter','scroll'])
        this.autoHideInput = false
        if (this.name === 'finder')
        {
            post.on('finder.show',this.show)
        }
        this.setColor('bg',theme.finder.bg)
        this.setColor('frame',theme.finder.frame)
        this.choices.state.skipAdjustViewForMainCursor = true
        this.choices.state.syntax.setExt('kode')
        this.choices.gutter.lineno = this.lineno
        this.choices.gutter.setColor('highlight',theme.gutter.fg)
        this.choices.gutter.setColor('bg_fully_selected',theme.finder.bg)
    }

    finder.prototype["lineno"] = function (y)
    {
        var pad, _47_43_

        pad = this.choices.gutter.cells.cols - 1
        if ((0 <= y && y < this.choices.fuzzied.length))
        {
            if (this.choices.fuzzied[y].type === 'file')
            {
                if ((this.choices.fuzzied[y].line != null))
                {
                    return _k_.lpad(pad,this.choices.fuzzied[y].line) + ' '
                }
                else
                {
                    return _k_.lpad(pad,'●') + ' '
                }
            }
            if (_k_.isNum(this.choices.fuzzied[y].row))
            {
                return _k_.lpad(pad,this.choices.fuzzied[y].row + 1) + ' '
            }
        }
        return _k_.lpad(pad + 1)
    }

    finder.prototype["arrange"] = function ()
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

    finder.prototype["show"] = function (text)
    {
        var cursorLine, front, span, _113_87_

        if (_k_.empty(text))
        {
            cursorLine = this.state.mainCursor()[1]
        }
        text = this.searchText(text)
        console.log(_k_.g4(`${_k_.r6('finder.show')} ${_k_.m5(this.name)} '${text}'`))
        if (_k_.empty(text))
        {
            this.choices.clear()
            this.input.show()
            return finder.__super__.show.call(this)
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
            this.choices.select(((_113_87_=kutil.findIndex(this.choices.items,function (l)
            {
                return l.row === cursorLine
            })) != null ? _113_87_ : 0))
        }
        else
        {
            this.choices.selectFirst()
        }
        this.input.show()
        this.input.grabFocus()
        return finder.__super__.show.call(this)
    }

    finder.prototype["searchText"] = function (text)
    {
        if (_k_.empty(text))
        {
            text = this.state.textOfSelectionOrWordAtCursor()
        }
        text = (text != null ? text : '')
        if (text !== this.input.current())
        {
            this.input.set(text)
            this.input.state.moveCursors('eol')
        }
        return text
    }

    finder.prototype["apply"] = function (choice)
    {
        if (!_k_.empty(choice))
        {
            post.emit('goto.line',choice.row,choice.col)
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