var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}};_k_.r6=_k_.k.F256(_k_.k.r(6));_k_.g4=_k_.k.F256(_k_.k.g(4))

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
        var dir, editorFile, file, files, filet, front, items, segls, span, spans, _53_35_

        text = this.searchText(text)
        if (_k_.empty(text))
        {
            return
        }
        console.log(_k_.g4(`${_k_.r6('searcher')} '${text}'`))
        editorFile = ked_session.get('editor▸file')
        dir = prjcts.dir(editorFile)
        files = prjcts.files(editorFile)
        var list = _k_.list(files)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            if (editorFile === file)
            {
                continue
            }
            filet = await nfs.readText(file)
            segls = kseg.segls(filet)
            spans = belt.lineSpansForText(segls,text)
            if (_k_.empty(spans))
            {
                continue
            }
            front = belt.frontmostSpans(spans)
            items = ((_53_35_=this.choices.items) != null ? _53_35_ : [])
            items.push({line:''})
            items.push({line:slash.relative(file,dir),path:file,row:0,col:0})
            var list1 = _k_.list(front)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                span = list1[_b_]
                items.push({line:''})
                items.push({line:kseg.str(segls[span[1]]),path:file,row:span[1],col:span[2]})
            }
            this.choices.set(items,'line')
            this.choices.state.highlightText(text)
            post.emit('redraw')
        }
    }

    return searcher
})()

export default searcher;