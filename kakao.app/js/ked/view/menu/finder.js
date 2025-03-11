var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.r6=_k_.k.F256(_k_.k.r(6));_k_.g4=_k_.k.F256(_k_.k.g(4))

var finder

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let kutil = kxk.kutil

import belt from "../../edit/tool/belt.js"

import inputchoice from "./inputchoice.js"


finder = (function ()
{
    _k_.extend(finder, inputchoice)
    function finder (screen, state, name = 'finder')
    {
        this.screen = screen
        this.state = state
    
        this["onInputChange"] = this["onInputChange"].bind(this)
        this["layout"] = this["layout"].bind(this)
        finder.__super__.constructor.call(this,this.screen,name,['gutter','scroll'])
        this.choices.state.skipAdjustViewForMainCursor = true
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
        this.choices.layout(x + 2,y + 3,w - 3,cs)
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
        var cursorLine, lines, _89_78_

        if (_k_.empty(text))
        {
            cursorLine = this.state.mainCursor()[1]
        }
        text = this.searchText(text)
        if (_k_.empty(text))
        {
            return
        }
        console.log(_k_.g4(`${_k_.r6('finder.show')} '${text}'`))
        this.state.highlightText(text)
        lines = belt.frontmostSpans(this.state.s.highlights).map((function (span)
        {
            return {line:kseg.str(this.state.s.lines[span[1]]),row:span[1],col:span[2]}
        }).bind(this))
        this.choices.state.syntax.setExt('kode')
        this.choices.set(lines,'line')
        this.choices.state.highlightText(text)
        if (cursorLine)
        {
            this.choices.select(((_89_78_=kutil.findIndex(lines,function (l)
            {
                return l.row === cursorLine
            })) != null ? _89_78_ : 0))
        }
        else
        {
            this.choices.selectFirst()
        }
        this.layout()
        return this.input.grabFocus()
    }

    finder.prototype["apply"] = function (choice)
    {
        if (!_k_.empty(choice))
        {
            if (choice.path)
            {
                post.emit('file.open',choice.path,choice.row,choice.col)
            }
            else
            {
                console.log(`${this.name}.apply goto.line`,choice.row,choice.col)
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

    finder.prototype["onInputChange"] = function (text)
    {}

    finder.prototype["onInputAction"] = function (action, text)
    {
        console.log(`${this.name}.onInputAction ${action} ▸${text}◂`)
        switch (action)
        {
            case 'submit':
                return this.apply(text)

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