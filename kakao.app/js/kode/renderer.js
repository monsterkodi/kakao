var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, each_r: function (o) {return Array.isArray(o) ? [] : typeof o == 'string' ? o.split('') : {}}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, isArr: function (o) {return Array.isArray(o)}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}};_k_.R4=_k_.k.B256(_k_.k.R(4))

var kolorNames

import kstr from "../kxk/kstr.js"
import slash from "../kxk/slash.js"
import fs from "../kxk/fs.js"

import utils from "./utils.js"
let firstLineCol = utils.firstLineCol
let lastLineCol = utils.lastLineCol

import print from "./print.js"

kolorNames = ['r','g','b','c','m','y','w']
class Renderer
{
    constructor (kode)
    {
        var _19_30_, _20_30_

        this.kode = kode
    
        this.js = this.js.bind(this)
        this.debug = (this.kode.args != null ? this.kode.args.debug : undefined)
        this.verbose = (this.kode.args != null ? this.kode.args.verbose : undefined)
        this.hint = {_k_:{}}
        this.varstack = []
    }

    render (ast, source)
    {
        var s, vl

        this.file = source
        this.source = slash.relative(source,process.cwd())
        this.ast = ast
        this.hint = {_k_:{}}
        this.varstack = [ast.vars]
        this.indent = ''
        s = ''
        if (this.kode.args.header)
        {
            s += this.js(`// monsterkodi/kakao ${this.kode.version}\n\n`,true)
        }
        s += this.js("var _k_\n\n",true)
        if (!_k_.empty(ast.vars))
        {
            vl = this.sortVars(ast.vars)
            s += this.js(`var ${vl}\n\n`,true)
        }
        s += this.nodes(ast.exps,'\n',true)
        if (this.hint.section)
        {
            s = 'var toExport = {}\n' + s
            s += '\ntoExport._test_ = true'
            s += '\nexport default toExport\n'
        }
        s = this.header(s)
        return s
    }

    js (s, tl)
    {
        var _66_15_

        ;(this.srcmap != null ? this.srcmap.commit(s,tl) : undefined)
        return s
    }

    header (s)
    {
        var c, hr, ht, i, kf, ks, ps, u

        if (_k_.empty(Object.keys(this.hint._k_)))
        {
            return s
        }
        kf = {isNum:"function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}",isObj:"function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}",isArr:"function (o) {return Array.isArray(o)}",isStr:"function (o) {return typeof o === 'string' || o instanceof String}",isFunc:"function (o) {return typeof o === 'function'}",isElem:"function (o) {return o != null && typeof o === 'object' && o.nodeType === 1}",list:"function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}",first:"function (o) {return o != null ? o.length ? o[0] : undefined : o}",last:"function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}",min:"function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }",max:"function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }",empty:"function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}",in:"function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}",extend:"function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}",each_r:"function (o) {return Array.isArray(o) ? [] : typeof o == 'string' ? o.split('') : {}}",dbg:"function (f,l,c,m,...a) { console.log(f + ':' + l + ':' + c + (m ? ' ' + m + '\\n' : '\\n') + a.map(function (a) { return _k_.noon(a) }).join(' '))}",profile:"function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = performance.now(); }",profilend:"function (id) { var b = performance.now()-_k_.hrtime[id]; let f=0.001; for (let u of ['s','ms','μs','ns']) { if (u=='ns' || (b*f)>=1) { return console.log(id+' '+(b*f)+' '+u); } f*=1000; }}",assert:"function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}",clamp:"function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }",copy:"function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }",clone:"function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }",eql:"function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }",noon:"function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\\n')) { sp = k.split('\\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /\ \ /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.prototype.hasOwnProperty(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\\n') || ((ind !== '') && '\\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }",k:"{ f:(r,g,b)=>'\\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\\x1b[39m',new RegExp('\\\\x1b\\\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\\x1b[49m',new RegExp('\\\\x1b\\\\[49m','g'))}",lpad:"function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}",rpad:"function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}",trim:"function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}",rtrim:"function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}",ltrim:"function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}",dir:"function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }",file:"function () { return import.meta.url.substring(7); }"}
        if (this.hint._k_.eql)
        {
            this.hint._k_.isStr = true
            this.hint._k_.list = true
            this.hint._k_.empty = true
        }
        if (this.hint._k_.noon)
        {
            this.hint._k_.in = true
            this.hint._k_.list = true
        }
        if (this.hint._k_.trim)
        {
            this.hint._k_.ltrim = true
            this.hint._k_.rtrim = true
        }
        if (this.hint._k_.clamp)
        {
            this.hint._k_.isNum = true
        }
        if (this.hint._k_.ltrim)
        {
            this.hint._k_.in = true
        }
        if (this.hint._k_.rtrim)
        {
            this.hint._k_.in = true
        }
        if (this.hint._k_.dbg)
        {
            this.hint._k_.noon = true
        }
        hr = (function (o) {
            var r = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (k, v)
            {
                if (kf[k])
                {
                    return [k,`${k}: ${kf[k]}`]
                }
            })(k, o[k])
                if (m != null && m[0] != null)
                {
                    r[m[0]] = m[1]
                }
            }
            return typeof o == 'string' ? r.join('') : r
        })(this.hint._k_)
        ks = Object.values(hr).join(', ')
        ps = ''
        if (this.hint._k_.k)
        {
            var list = _k_.list(kolorNames)
            for (var _126_18_ = 0; _126_18_ < list.length; _126_18_++)
            {
                c = list[_126_18_]
                for (i = 1; i <= 8; i++)
                {
                    u = c.toUpperCase()
                    if (this.hint._k_[c + i] || this.hint._k_[u + c + (9 - i)])
                    {
                        ps += ';_k_.' + c + i + '=' + `_k_.k.F256(_k_.k.${c}(${i}))`
                    }
                    if (this.hint._k_[u + i] || this.hint._k_[u + c + i])
                    {
                        ps += ';_k_.' + u + i + '=' + `_k_.k.B256(_k_.k.${u}(${i}))`
                    }
                    if (this.hint._k_[u + c + i])
                    {
                        ps += ';_k_.' + u + c + i + '=' + `s=>_k_.${u}${i}(_k_.${c}${9 - i}(s))`
                    }
                }
            }
        }
        ht = `var _k_ = {${ks}}${ps}\n\n`
        s = s.replace("var _k_\n\n",ht)
        return s
    }

    nodes (nodes, sep = ',', tl)
    {
        var a, i, s, stripped

        if (!(nodes != null))
        {
            console.log('no nodes?!?',this.stack,this.sheap)
            print.ast('no nodes',this.ast)
            return ''
        }
        s = ''
        for (var _155_17_ = i = 0, _155_21_ = nodes.length; (_155_17_ <= _155_21_ ? i < nodes.length : i > nodes.length); (_155_17_ <= _155_21_ ? ++i : --i))
        {
            a = this.atom(nodes[i])
            if (sep[0] === '\n')
            {
                stripped = kstr.lstrip(a)
                if (_k_.in(stripped[0],'(['))
                {
                    a = ';' + a
                }
                else if (stripped.startsWith('function'))
                {
                    a = `(${a})`
                }
            }
            a += i < nodes.length - 1 ? sep : ''
            if (tl)
            {
                this.js(a,tl)
            }
            s += a
        }
        return s
    }

    node (exp)
    {
        var a, k, s, v, _182_19_, _182_33_

        if (!exp)
        {
            return ''
        }
        if ((exp.type != null) && (exp.text != null))
        {
            return this.token(exp)
        }
        if (exp instanceof Array)
        {
            return (function () { var r_184_52_ = []; var list = _k_.list(exp); for (var _184_52_ = 0; _184_52_ < list.length; _184_52_++)  { a = list[_184_52_];r_184_52_.push(this.node(a))  } return r_184_52_ }).bind(this)().join(';\n')
        }
        s = ''
        for (k in exp)
        {
            v = exp[k]
            s += ((function ()
            {
                switch (k)
                {
                    case 'if':
                        return this.if(v)

                    case 'for':
                        return this.for(v)

                    case 'while':
                        return this.while(v)

                    case 'return':
                        return this.return(v)

                    case 'await':
                        return this.await(v)

                    case 'class':
                        return this.class(v)

                    case 'function':
                        return this.function(v)

                    case 'switch':
                        return this.switch(v)

                    case 'when':
                        return this.when(v)

                    case 'use':
                        return this.use(v)

                    case 'import':
                        return this.import(v)

                    case 'export':
                        return this.export(v)

                    case 'assert':
                        return this.assert(v)

                    case 'qmrkop':
                        return this.qmrkop(v)

                    case 'stripol':
                        return this.stripol(v)

                    case 'dirFile':
                        return this.dirFile(v)

                    case 'main':
                        return this.main(v)

                    case 'qmrkcolon':
                        return this.qmrkcolon(v)

                    case 'operation':
                        return this.operation(v)

                    case 'section':
                        return this.section(v)

                    case 'subsect':
                        return this.subsect(v)

                    case 'compare':
                        return this.compare(v)

                    case 'incond':
                        return this.incond(v)

                    case 'parens':
                        return this.parens(v)

                    case 'object':
                        return this.object(v)

                    case 'keyval':
                        return this.keyval(v)

                    case 'array':
                        return this.array(v)

                    case 'lcomp':
                        return this.lcomp(v)

                    case 'index':
                        return this.index(v)

                    case 'slice':
                        return this.slice(v)

                    case 'prop':
                        return this.prop(v)

                    case 'each':
                        return this.each(v)

                    case 'func':
                        return this.func(v)

                    case 'call':
                        return this.call(v)

                    case 'try':
                        return this.try(v)

                    default:
                        console.log(_k_.R4(`renderer.node unhandled key ${k} in exp`),exp)
                        return ''
                }

            }).bind(this))()
        }
        return s
    }

    atom (exp)
    {
        return this.fixAsserts(this.node(exp))
    }

    qmrkop (p)
    {
        var lhs, vn

        if (p.lhs.type === 'var' || !p.qmrk)
        {
            lhs = this.atom(p.lhs)
            return `(${lhs} != null ? ${lhs} : ${this.atom(p.rhs)})`
        }
        else
        {
            vn = this.makeVar(p.qmrk)
            return `((${vn}=${this.atom(p.lhs)}) != null ? ${vn} : ${this.atom(p.rhs)})`
        }
    }

    qmrkcolon (p)
    {
        return `(${this.atom(p.lhs)} ? ${this.atom(p.mid)} : ${this.atom(p.rhs)})`
    }

    assert (p)
    {
        if (p.obj.type !== 'var' && !p.obj.index)
        {
            return '▾' + this.node(p.obj) + `▸${p.qmrk.line}_${p.qmrk.col}◂`
        }
        else
        {
            return '▾' + this.node(p.obj) + `▸${0}_${0}◂`
        }
    }

    fixAsserts (s)
    {
        var i, l, mtch, n, rhs, splt, t

        if (!(s != null) || s.length === 0)
        {
            return ''
        }
        if (_k_.in(s,['▾',"'▾'",'"▾"']))
        {
            return s
        }
        while (s[0] === '▾')
        {
            s = s.slice(1)
        }
        if (/(?<!['"\[])[▾]/.test(s))
        {
            i = s.indexOf('▾')
            if ((n = s.indexOf('\n',i)) > i)
            {
                return s.slice(0, typeof i === 'number' ? i : -1) + this.fixAsserts(s.slice(i + 1, typeof n === 'number' ? n : -1)) + this.fixAsserts(s.slice(n))
            }
            else
            {
                return s.slice(0, typeof i === 'number' ? i : -1) + this.fixAsserts(s.slice(i + 1))
            }
        }
        splt = s.split(/▸\d+_\d+◂/)
        mtch = s.match(/▸\d+_\d+◂/g)
        if (splt.length > 1)
        {
            mtch = mtch.map(function (m)
            {
                return `_${m.slice(1, -1)}_`
            })
            if (splt.slice(-1)[0] === '')
            {
                if (splt.length > 2)
                {
                    splt.pop()
                    mtch.pop()
                    t = splt.shift()
                    while (splt.length)
                    {
                        t += '▸' + mtch.shift().slice(1, -1) + '◂'
                        t += splt.shift()
                    }
                    t = this.fixAsserts(t)
                }
                else
                {
                    t = splt[0]
                }
                return `(${t} != null)`
            }
            s = ''
            for (var _310_21_ = i = 0, _310_25_ = mtch.length; (_310_21_ <= _310_25_ ? i < mtch.length : i > mtch.length); (_310_21_ <= _310_25_ ? ++i : --i))
            {
                if (mtch.length > 1)
                {
                    rhs = i ? (mtch[i - 1] !== "_0_0_" ? mtch[i - 1] : l) + splt[i] : splt[0]
                    if (mtch[i] !== "_0_0_")
                    {
                        l = `(${mtch[i]}=${rhs})`
                    }
                    else
                    {
                        l = rhs
                    }
                }
                else
                {
                    l = splt[0]
                }
                if (splt[i + 1][0] === '(')
                {
                    s += `typeof ${l} === \"function\" ? `
                }
                else
                {
                    s += `${l} != null ? `
                }
            }
            if (mtch.length > 1)
            {
                if (mtch.slice(-1)[0] !== "_0_0_")
                {
                    s += mtch.slice(-1)[0] + splt.slice(-1)[0]
                }
                else
                {
                    s += l + splt.slice(-1)[0]
                }
            }
            else
            {
                s += splt[0] + splt[1]
            }
            for (var _334_21_ = i = 0, _334_25_ = mtch.length; (_334_21_ <= _334_25_ ? i < mtch.length : i > mtch.length); (_334_21_ <= _334_25_ ? ++i : --i))
            {
                s += " : undefined"
            }
            s = `(${s})`
        }
        return s
    }

    use (n)
    {
        var item, jsFile, kodeFile, m, mod, name, relFile, s, _356_25_, _375_25_, _392_29_

        s = ''
        if (!_k_.empty(n.items))
        {
            if (n.toUse.length > 1)
            {
                console.error('items for multiple modules?!')
            }
            m = n.toUse[0]
            mod = ((_356_25_=m.text) != null ? _356_25_ : m)
            name = slash.name(mod)
            s += 'import ' + name
            if (mod[0] === '.')
            {
                s += ` from \"${slash.swapExt(mod,'js')}\"\n`
            }
            else
            {
                s += ` from \"${mod}\"\n`
            }
            var list = _k_.list(n.items)
            for (var _366_21_ = 0; _366_21_ < list.length; _366_21_++)
            {
                item = list[_366_21_]
                s += `let ${item} = ${name}.${item}\n`
            }
        }
        else if (!_k_.empty(n.name))
        {
            if (n.toUse.length > 1)
            {
                console.error('named import for multiple modules?!')
            }
            m = n.toUse[0]
            mod = ((_375_25_=m.text) != null ? _375_25_ : m)
            name = slash.name(mod)
            s += 'import ' + n.name
            if (mod[0] === '.')
            {
                s += ` from \"${slash.swapExt(mod,'js')}\"\n`
            }
            else
            {
                s += ` from \"${mod}\"\n`
            }
        }
        else
        {
            var list1 = _k_.list(n.toUse)
            for (var _387_18_ = 0; _387_18_ < list1.length; _387_18_++)
            {
                m = list1[_387_18_]
                name = slash.name(m.text)
                s += 'import ' + name
                mod = ((_392_29_=m.text) != null ? _392_29_ : m)
                if (this.file)
                {
                    if (mod[0] === '.')
                    {
                        kodeFile = slash.path(slash.dir(this.file),mod + '.kode')
                        jsFile = slash.path(slash.dir(this.file),mod + '.js')
                    }
                    else
                    {
                        kodeFile = slash.path(slash.dir(this.file),name + '.kode')
                        jsFile = slash.path(slash.dir(this.file),name + '.js')
                    }
                    if (mod[0] === '.')
                    {
                        relFile = slash.relative(jsFile,slash.dir(this.file))
                        if (relFile[0] !== '.')
                        {
                            relFile = './' + relFile
                        }
                        s += ` from \"${relFile}\"\n`
                    }
                    else
                    {
                        s += ` from \"${mod}\"\n`
                    }
                }
                else
                {
                    if (mod[0] === '.')
                    {
                        s += ` from \"${slash.swapExt(mod,'js')}\"\n`
                    }
                    else
                    {
                        s += ` from \"${mod}\"\n`
                    }
                }
            }
        }
        return s
    }

    import (n)
    {
        var s

        s = ''
        s += 'import '
        s += this.nodes(n.args,' ')
        return s
    }

    export (n)
    {
        var a, s

        s = ''
        s += 'export '
        if (_k_.isArr(n.args))
        {
            a = this.nodes(n.args,' ')
            if (a[0] === "{")
            {
                s += 'default ' + a
            }
            else
            {
                s += '{ ' + a + ' };'
            }
        }
        else
        {
            s += 'default ' + this.node(n.args)
            s += ';'
        }
        return s
    }

    dirFile (n)
    {
        var s

        s = ''
        if (n === 'dir')
        {
            this.hint._k_.dir = true
            s = "_k_.dir()"
        }
        if (n === 'file')
        {
            this.hint._k_.file = true
            s = "_k_.file()"
        }
        return s
    }

    main (n)
    {
        var idt, s

        idt = _k_.rpad(4)
        s = 'if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])'
        s += '\n{\n'
        s += idt + this.nodes(n,'\n' + idt)
        s += '\n}'
        return s
    }

    class (n)
    {
        var b, bind, bn, con, e, mi, mthds, s, superCall, _496_29_, _502_50_

        s = ''
        s += `class ${n.name.text}`
        if (n.extends)
        {
            s += " extends " + n.extends.map((function (e)
            {
                return this.node(e)
            }).bind(this)).join(', ')
        }
        s += '\n{'
        mthds = n.body
        if ((mthds != null ? mthds.length : undefined))
        {
            var _491_24_ = this.prepareMethods(mthds); con = _491_24_[0]; bind = _491_24_[1]

            if (bind.length)
            {
                var list = _k_.list(con.keyval.val.func.body.exps)
                for (var _495_22_ = 0; _495_22_ < list.length; _495_22_++)
                {
                    e = list[_495_22_]
                    if ((e.call != null ? e.call.callee.text : undefined) === 'super')
                    {
                        superCall = con.keyval.val.func.body.exps.splice(con.keyval.val.func.body.exps.indexOf(e),1)[0]
                        break
                    }
                }
                var list1 = _k_.list(bind)
                for (var _500_22_ = 0; _500_22_ < list1.length; _500_22_++)
                {
                    b = list1[_500_22_]
                    bn = b.keyval.val.func.name.text
                    con.keyval.val.func.body.exps = ((_502_50_=con.keyval.val.func.body.exps) != null ? _502_50_ : [])
                    con.keyval.val.func.body.exps.unshift({type:'code',text:`this.${bn} = this.${bn}.bind(this)`})
                }
                if (superCall)
                {
                    con.keyval.val.func.body.exps.unshift(superCall)
                }
            }
            this.indent = '    '
            for (var _511_22_ = mi = 0, _511_26_ = mthds.length; (_511_22_ <= _511_26_ ? mi < mthds.length : mi > mthds.length); (_511_22_ <= _511_26_ ? ++mi : --mi))
            {
                if (mi)
                {
                    s += '\n'
                }
                s += this.mthd(mthds[mi])
            }
            s += '\n'
            this.indent = ''
        }
        s += '}\n'
        return s
    }

    super (p)
    {
        if (this.mthdName)
        {
            if (this.mthdName === 'constructor')
            {
                return `${p.callee.text}(${this.nodes(p.args,',')})`
            }
            else
            {
                return `${p.callee.text}.${this.mthdName}(${this.nodes(p.args,',')})`
            }
        }
        else if (this.fncnName && this.fncsName)
        {
            return `${this.fncnName}.__super__.${this.fncsName}.call(this${(!_k_.empty(p.args) ? (',' + this.nodes(p.args,',')) : '')})`
        }
    }

    mthd (n)
    {
        var s, _547_32_

        if (n.keyval)
        {
            s = '\n'
            if ((n.keyval.val.func != null))
            {
                this.mthdName = n.keyval.val.func.name.text
                s += this.indent + this.func(n.keyval.val.func)
                delete this.mthdName
            }
            else
            {
                if (n.keyval.key.text.startsWith('@'))
                {
                    s += this.indent + 'static ' + n.keyval.key.text.slice(1) + ' = ' + this.node(n.keyval.val)
                }
                else
                {
                    console.log('what is this?',n)
                }
            }
        }
        return s
    }

    function (n)
    {
        var b, bind, bn, callsSuper, con, e, mi, mthds, s, _587_50_, _593_46_

        this.fncnName = n.name.text
        s = '\n'
        s += `${this.fncnName} = (function ()\n`
        s += '{\n'
        if (n.extends)
        {
            var list = _k_.list(n.extends)
            for (var _573_18_ = 0; _573_18_ < list.length; _573_18_++)
            {
                e = list[_573_18_]
                this.hint._k_.extend = true
                s += `    _k_.extend(${n.name.text}, ${this.node(e)})`
            }
            s += '\n'
        }
        mthds = n.body
        if ((mthds != null ? mthds.length : undefined))
        {
            var _582_24_ = this.prepareMethods(mthds); con = _582_24_[0]; bind = _582_24_[1]

            if (bind.length)
            {
                var list1 = _k_.list(bind)
                for (var _585_22_ = 0; _585_22_ < list1.length; _585_22_++)
                {
                    b = list1[_585_22_]
                    bn = b.keyval.val.func.name.text
                    con.keyval.val.func.body.exps = ((_587_50_=con.keyval.val.func.body.exps) != null ? _587_50_ : [])
                    con.keyval.val.func.body.exps.unshift({type:'code',text:`this[\"${bn}\"] = this[\"${bn}\"].bind(this)`})
                }
            }
            if (n.extends)
            {
                con.keyval.val.func.body.exps = ((_593_46_=con.keyval.val.func.body.exps) != null ? _593_46_ : [])
                var list2 = _k_.list(con.keyval.val.func.body.exps)
                for (var _594_22_ = 0; _594_22_ < list2.length; _594_22_++)
                {
                    e = list2[_594_22_]
                    if (e.call && e.call.callee.text === 'super')
                    {
                        callsSuper = true
                        break
                    }
                }
                if (!callsSuper)
                {
                    con.keyval.val.func.body.exps.push({type:'code',text:`return ${this.fncnName}.__super__.constructor.apply(this, arguments)`})
                }
            }
            this.indent = '    '
            for (var _604_22_ = mi = 0, _604_26_ = mthds.length; (_604_22_ <= _604_26_ ? mi < mthds.length : mi > mthds.length); (_604_22_ <= _604_26_ ? ++mi : --mi))
            {
                s += this.funcs(mthds[mi],n.name.text)
                s += '\n'
            }
            this.indent = ''
        }
        delete this.fncnName
        s += `    return ${n.name.text}\n`
        s += '})()\n'
        return s
    }

    funcs (n, className)
    {
        var f, member, s, _624_23_, _624_28_, _639_23_, _639_28_, _639_34_

        s = ''
        if (f = ((_624_23_=n.keyval) != null ? (_624_28_=_624_23_.val) != null ? _624_28_.func : undefined : undefined))
        {
            if (f.name.text === 'constructor')
            {
                this.fncsName = 'constructor'
                s = this.indent + this.func(f,'function ' + className)
                s += '\n'
            }
            else if (f.name.text.startsWith('static'))
            {
                this.fncsName = f.name.text.slice(7)
                s = this.indent + this.func(f,`${className}[\"${this.fncsName}\"] = function`)
                s += '\n'
            }
            else
            {
                this.fncsName = f.name.text
                s = this.indent + this.func(f,`${className}.prototype[\"${this.fncsName}\"] = function`)
                s += '\n'
            }
            delete this.fncsName
        }
        else
        {
            if (((_639_23_=n.keyval) != null ? (_639_28_=_639_23_.key) != null ? (_639_34_=_639_28_.text) != null ? _639_34_[0] : undefined : undefined : undefined) === '@')
            {
                member = n.keyval.key.text.slice(1)
                s = this.indent + `${className}[\"${member}\"] = ` + this.node(n.keyval.val)
            }
        }
        return s
    }

    prepareMethods (mthds)
    {
        var ast, bind, con, m, name, _668_37_

        bind = []
        var list = _k_.list(mthds)
        for (var _653_14_ = 0; _653_14_ < list.length; _653_14_++)
        {
            m = list[_653_14_]
            if (!m.keyval)
            {
                print.ast('not an method?',m)
                print.ast('not an method?',mthds)
                continue
            }
            if (!m.keyval.val.func)
            {
                continue
            }
            name = m.keyval.val.func.name.text
            if (_k_.in(name,['@','constructor']))
            {
                if (con)
                {
                    console.error('more than one constructor?')
                }
                m.keyval.val.func.name.text = 'constructor'
                con = m
            }
            else if ((name != null ? name.startsWith('@') : undefined))
            {
                m.keyval.val.func.name.text = 'static ' + name.slice(1)
            }
            else if ((m.keyval.val.func != null ? m.keyval.val.func.arrow.text : undefined) === '=>')
            {
                bind.push(m)
            }
        }
        if ((bind.length || this.fncnName) && !con)
        {
            ast = this.kode.ast("constructor: ->")
            con = ast.exps[0].object.keyvals[0]
            con.keyval.val.func.name = {type:'name',text:'constructor'}
            mthds.unshift(con)
        }
        return [con,bind]
    }

    func (n, name)
    {
        var args, gi, s, str, t, ths, vs, _691_22_, _691_29_, _704_21_, _704_29_, _714_22_, _714_32_

        if (!n)
        {
            return ''
        }
        gi = this.ind()
        name = (name != null ? name : ((_691_29_=(n.name != null ? n.name.text : undefined)) != null ? _691_29_ : 'function'))
        if (n.arrow.text[0] === '○')
        {
            if (name.indexOf('function') >= 0)
            {
                name = name.replace('function','async function')
            }
            else if (name.indexOf('static') >= 0)
            {
                name = name.replace('static','static async')
            }
            else
            {
                name = 'async ' + name
            }
        }
        s = name
        s += ' ('
        args = ((_704_21_=n.args) != null ? (_704_29_=_704_21_.parens) != null ? _704_29_.exps : undefined : undefined)
        if (args)
        {
            var _706_23_ = this.args(args); str = _706_23_[0]; ths = _706_23_[1]

            s += str
        }
        s += ')\n'
        s += gi + '{'
        this.varstack.push(n.body.vars)
        if (((_714_22_=n.body.exps) != null ? _714_22_[0] != null ? (_714_32_=_714_22_[0].call) != null ? _714_32_.callee.text : undefined : undefined : undefined) === 'super')
        {
            s += '\n'
            s += this.indent + this.node(n.body.exps.shift())
            s += '\n' + gi
        }
        if (!_k_.empty(n.body.vars))
        {
            s += '\n'
            vs = this.sortVars(n.body.vars)
            s += this.indent + `var ${vs}\n`
        }
        if (!_k_.empty(ths))
        {
            s += '\n'
            var list = _k_.list(ths)
            for (var _727_18_ = 0; _727_18_ < list.length; _727_18_++)
            {
                t = list[_727_18_]
                s += this.indent + t + '\n'
            }
            s += gi
        }
        if (!_k_.empty(n.body.exps))
        {
            s += '\n'
            s += this.indent + this.nodes(n.body.exps,'\n' + this.indent)
            s += '\n' + gi
        }
        s += '}'
        this.varstack.pop()
        this.ded()
        if (n.arrow.text === '=>' && !n.name)
        {
            s = `(${s}).bind(this)`
        }
        return s
    }

    args (args)
    {
        var a, str, ths, used

        ths = []
        used = {}
        if (args.length > 1 && args.slice(-1)[0].text === '...' && args.slice(-2,-1)[0].type === 'var')
        {
            args.pop()
            args.slice(-1)[0].text = '...' + args.slice(-1)[0].text
        }
        var list = _k_.list(args)
        for (var _763_14_ = 0; _763_14_ < list.length; _763_14_++)
        {
            a = list[_763_14_]
            if (a.text)
            {
                used[a.text] = a.text
            }
        }
        args = args.map((function (a)
        {
            var i, l, t, txt, _778_63_

            t = this.node(a)
            if ((t != null ? t.startsWith('this.') : undefined))
            {
                l = _k_.trim(t.split('=')[0])
                txt = l.slice(5)
                if (used[txt])
                {
                    for (i = 1; i <= 100; i++)
                    {
                        if (!used[txt + i])
                        {
                            ths.push(`this.${txt} = ${txt + i}`)
                            txt += i
                            used[txt] = txt
                            return `${txt}` + (((_778_63_=t.split('=')[1]) != null ? _778_63_ : ''))
                        }
                    }
                }
                else
                {
                    ths.push(`${l} = ${txt}`)
                }
                return t.slice(5)
            }
            return t
        }).bind(this))
        str = args.join(', ')
        return [str,ths]
    }

    return (n)
    {
        var s

        s = 'return ' + this.node(n.val)
        return _k_.trim(s)
    }

    await (n)
    {
        var s

        s = 'await ' + this.node(n.exp)
        return _k_.trim(s)
    }

    call (p)
    {
        var callee, msg

        if (_k_.in(p.callee.text,['log','warn','error']))
        {
            p.callee.text = `console.${p.callee.text}`
        }
        callee = this.node(p.callee)
        if (p.args)
        {
            if (callee.length === 2 && /[1-8]/.test(callee[1]) && _k_.in(callee[0].toLowerCase(),kolorNames))
            {
                this.hint._k_.k = true
                this.hint._k_[callee] = true
                return `_k_.${callee}(${this.nodes(p.args,',')})`
            }
            if (callee.length === 3 && /[1-8]/.test(callee[2]) && _k_.in(callee[0].toLowerCase(),kolorNames) && _k_.in(callee[1],kolorNames))
            {
                this.hint._k_.k = true
                this.hint._k_[callee] = true
                return `_k_.${callee}(${this.nodes(p.args,',')})`
            }
            switch (callee)
            {
                case 'new':
                case 'throw':
                    return `${callee} ${this.nodes(p.args,',')}`

                case 'int':
                    return `parseInt(${this.nodes(p.args,',')})`

                case 'float':
                    return `parseFloat(${this.nodes(p.args,',')})`

                case 'super':
                    return this.super(p)

                case 'dbg':
                    this.hint._k_.dbg = true
                    if (_k_.in(p.args[0].type,['var']) || (p.args[0] != null ? p.args[0].prop : undefined) || (p.args[0] != null ? p.args[0].call : undefined))
                    {
                        msg = '"'
                        msg += this.node(p.args[0])
                        msg += '"'
                    }
                    else
                    {
                        msg = 'null'
                    }
                    return `_k_.dbg(${'\"' + (this.source || '???') + '\"'}, ${p.callee.line}, ${p.callee.col}, ${msg}, ${this.nodes(p.args,',')})`

                case 'clamp':
                case 'first':
                case 'last':
                case 'min':
                case 'max':
                case 'lpad':
                case 'rpad':
                case 'trim':
                case 'ltrim':
                case 'rtrim':
                    this.hint._k_[callee] = true
                    return `_k_.${callee}(${this.nodes(p.args,',')})`

                case '▴':
                    this.hint._k_.assert = true
                    if (_k_.in(p.args[0].type,['single','double','triple']))
                    {
                        msg = p.args[0].text
                        p.args.shift()
                    }
                    else
                    {
                        msg = '"assert failed!"'
                    }
                    msg += ' + " ' + this.nodes(p.args,',') + '"'
                    return `_k_.assert(${'\"' + (this.source || '???') + '\"'}, ${p.callee.line}, ${p.callee.col}, ${msg}, ${this.nodes(p.args,',')})`

                default:
                    return `${callee}(${this.nodes(p.args,',')})`
            }

        }
        else
        {
            return `${callee}()`
        }
    }

    prof (p)
    {
        if (_k_.in(p.text,['●','●▸']))
        {
            this.hint._k_.profile = true
            this.hint._k_.profilend = true
            return `_k_.profile('${p.id}')`
        }
        else if (p.text === '●▪')
        {
            this.hint._k_.profilend = true
            return `_k_.profilend('${p.id}')`
        }
    }

    if (n)
    {
        var elif, first, gi, last, s

        first = firstLineCol(n)
        last = lastLineCol(n)
        if ((first.line === last.line && n.else && !n.returns) || n.inline)
        {
            return this.ifInline(n)
        }
        gi = this.ind()
        s = ''
        s += `if (${this.atom(n.cond)})\n`
        s += gi + "{\n"
        if (!_k_.empty(n.then))
        {
            s += this.indent + this.nodes(n.then,'\n' + this.indent) + '\n'
        }
        s += gi + "}"
        var list = _k_.list(n.elifs)
        for (var _903_17_ = 0; _903_17_ < list.length; _903_17_++)
        {
            elif = list[_903_17_]
            s += '\n'
            s += gi + `else if (${this.atom(elif.elif.cond)})\n`
            s += gi + "{\n"
            if (!_k_.empty(elif.elif.then))
            {
                s += this.indent + this.nodes(elif.elif.then,'\n' + this.indent) + '\n'
            }
            s += gi + "}"
        }
        if (n.else)
        {
            s += '\n'
            s += gi + 'else\n'
            s += gi + "{\n"
            if (!_k_.empty(n.else))
            {
                s += this.indent + this.nodes(n.else,'\n' + this.indent) + '\n'
            }
            s += gi + "}"
        }
        this.ded()
        return s
    }

    ifInline (n, dontClose)
    {
        var e, s, _933_17_

        s = ''
        s += `${this.atom(n.cond)} ? `
        if ((n.then != null ? n.then.length : undefined))
        {
            s += (function () { var r_934_33_ = []; var list = _k_.list(n.then); for (var _934_33_ = 0; _934_33_ < list.length; _934_33_++)  { e = list[_934_33_];r_934_33_.push(this.atom(e))  } return r_934_33_ }).bind(this)().join(', ')
        }
        if (n.elifs)
        {
            var list1 = _k_.list(n.elifs)
            for (var _937_18_ = 0; _937_18_ < list1.length; _937_18_++)
            {
                e = list1[_937_18_]
                s += ' : '
                s += this.ifInline(e.elif,true)
            }
        }
        if (n.else)
        {
            s += ' : '
            if (n.else.length === 1)
            {
                s += this.atom(n.else[0])
            }
            else
            {
                s += '(' + (function () { var r_946_42_ = []; var list2 = _k_.list(n.else); for (var _946_42_ = 0; _946_42_ < list2.length; _946_42_++)  { e = list2[_946_42_];r_946_42_.push(this.atom(e))  } return r_946_42_ }).bind(this)().join(', ') + ')'
            }
        }
        else if (!dontClose)
        {
            s += ' : undefined'
        }
        return s
    }

    each (n)
    {
        var fnc, i, numArgs, rv, _1004_35_, _959_33_

        numArgs = (n.fnc.func.args != null ? n.fnc.func.args.parens.exps.length : undefined)
        rv = 'r' + this.makeVar(n.each)
        i = this.indent
        if (numArgs === 1)
        {
            this.hint._k_.each_r = true
            this.ind()
            fnc = this.node(n.fnc)
            this.ded()
            return `${i}(function (o) {
${i}    var ${rv} = _k_.each_r(o)
${i}    for (var k in o)
${i}    {   
${i}        var m = (${fnc})(o[k])
${i}        if (m != null)
${i}        {
${i}            ${rv}[k] = m
${i}        }
${i}    }
${i}    return typeof o == 'string' ? ${rv}.join('') : ${rv}
${i}})(${this.node(n.lhs)})`
        }
        else if (numArgs)
        {
            this.hint._k_.each_r = true
            this.ind()
            fnc = this.node(n.fnc)
            this.ded()
            return `${i}(function (o) {
${i}    var r = _k_.each_r(o)
${i}    for (var k in o)
${i}    {   
${i}        var m = (${fnc})(k, o[k])
${i}        if (m != null && m[0] != null)
${i}        {
${i}            r[m[0]] = m[1]
${i}        }
${i}    }
${i}    return typeof o == 'string' ? r.join('') : r
${i}})(${this.node(n.lhs)})`
        }
        else
        {
            if ((n.fnc.func.body.exps != null ? n.fnc.func.body.exps.length : undefined) > 0)
            {
                this.hint._k_.each_r = true
                this.ind()
                fnc = this.node(n.fnc)
                this.ded()
                return `${i}(function (o) {
${i}    var r = _k_.each_r(o)
${i}    for (var k in o)
${i}    {   
${i}        var m = (${fnc})(o[k])
${i}        if (m != null)
${i}        {
${i}            r[k] = m
${i}        }
${i}    }
${i}    return typeof o == 'string' ? r.join('') : r
${i}})(${this.node(n.lhs)})
    `
            }
            else
            {
                return `${i}(function (o) { return Array.isArray(o) ? [] : typeof o == 'string' ? '' : {} })(${this.node(n.lhs)})`
            }
        }
    }

    for (n)
    {
        if (!n.then)
        {
            this.verb('for expected then',n)
        }
        switch (n.inof.text)
        {
            case 'in':
                return this.for_in(n)

            case 'of':
                return this.for_of(n)

            default:
                console.error('for expected in/of')
        }

    }

    for_in (n, varPrefix = '', lastPrefix = '', lastPostfix = '', lineBreak)
    {
        var e, eb, g2, gi, iterVar, j, list, listVar, nl, postfix, prefix, s, v, _1056_27_, _1078_28_

        if (!n.list.qmrkop && !n.list.array && !n.list.slice)
        {
            this.hint._k_.list = true
            list = `_k_.list(${this.atom(n.list)})`
        }
        else
        {
            if (((_1056_27_=n.list.array) != null ? _1056_27_.items[0] != null ? _1056_27_.items[0].slice : undefined : undefined) || n.list.slice)
            {
                return this.for_in_range(n,varPrefix,lastPrefix,lastPostfix,lineBreak)
            }
            list = this.node(n.list)
        }
        if (!list || list === 'undefined')
        {
            print.noon('no list for',n.list)
            print.ast('no list for',n.list)
        }
        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        listVar = this.freshVar('list')
        iterVar = this.makeVar(n.inof)
        s = ''
        s += `var ${listVar} = ${list}` + eb
        if (n.vals.text)
        {
            s += gi + `for (var ${iterVar} = 0; ${iterVar} < ${listVar}.length; ${iterVar}++)` + nl
            s += gi + "{" + nl
            s += g2 + `${n.vals.text} = ${listVar}[${iterVar}]` + eb
        }
        else if ((n.vals.array != null ? n.vals.array.items : undefined))
        {
            s += gi + `for (var ${iterVar} = 0; ${iterVar} < ${listVar}.length; ${iterVar}++)` + nl
            s += gi + "{" + nl
            for (var _1081_21_ = j = 0, _1081_25_ = n.vals.array.items.length; (_1081_21_ <= _1081_25_ ? j < n.vals.array.items.length : j > n.vals.array.items.length); (_1081_21_ <= _1081_25_ ? ++j : --j))
            {
                v = n.vals.array.items[j]
                s += g2 + `${v.text} = ${listVar}[${iterVar}][${j}]` + eb
            }
        }
        else if (n.vals.length > 1)
        {
            iterVar = n.vals[1].text
            s += gi + `for (${iterVar} = 0; ${iterVar} < ${listVar}.length; ${iterVar}++)` + nl
            s += gi + "{" + nl
            s += g2 + `${varPrefix}${n.vals[0].text} = ${listVar}[${iterVar}]` + eb
        }
        var list1 = _k_.list(n.then)
        for (var _1090_14_ = 0; _1090_14_ < list1.length; _1090_14_++)
        {
            e = list1[_1090_14_]
            prefix = lastPrefix && e === n.then.slice(-1)[0] ? lastPrefix : ''
            postfix = lastPostfix && e === n.then.slice(-1)[0] ? lastPostfix : ''
            s += g2 + prefix + this.node(e) + postfix + nl
        }
        s += gi + "}"
        if (!lineBreak)
        {
            this.ded()
        }
        return s
    }

    for_in_range (n, varPrefix, lastPrefix, lastPostfix, lineBreak)
    {
        var e, eb, end, g2, gi, invCmp, iterCmp, iterDir, iterEnd, iterStart, iterVar, llc, loopCheck, loopStart, loopUpdate, lv, nl, postfix, prefix, rlc, rv, s, slice, start, _1107_28_, _1107_46_, _1117_32_

        slice = ((_1107_46_=((_1107_28_=n.list.array) != null ? _1107_28_.items[0] != null ? _1107_28_.items[0].slice : undefined : undefined)) != null ? _1107_46_ : n.list.slice)
        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        iterVar = ((_1117_32_=n.vals.text) != null ? _1117_32_ : n.vals[0].text)
        iterStart = this.node(slice.from)
        iterEnd = this.node(slice.upto)
        start = parseInt(iterStart)
        end = parseInt(iterEnd)
        iterCmp = slice.dots.text === '...' ? '<' : '<='
        invCmp = slice.dots.text === '...' ? '>' : '>='
        iterDir = '++'
        if (Number.isFinite(start) && Number.isFinite(end))
        {
            if (start > end)
            {
                iterCmp = slice.dots.text === '...' ? '>' : '>='
                iterDir = '--'
            }
            loopStart = `${iterVar} = ${iterStart}`
            loopCheck = `${iterVar} ${iterCmp} ${iterEnd}`
            loopUpdate = `${iterVar}${iterDir}`
        }
        else
        {
            llc = firstLineCol(slice.from)
            rlc = firstLineCol(slice.upto)
            lv = this.makeVar(llc)
            rv = this.makeVar(rlc)
            loopStart = `var ${lv} = ${iterVar} = ${iterStart}, ${rv} = ${iterEnd}`
            loopCheck = `(${lv} <= ${rv} ? ${iterVar} ${iterCmp} ${iterEnd} : ${iterVar} ${invCmp} ${iterEnd})`
            loopUpdate = `(${lv} <= ${rv} ? ++${iterVar} : --${iterVar})`
        }
        s = ''
        s += `for (${loopStart}; ${loopCheck}; ${loopUpdate})` + nl
        s += gi + "{" + nl
        var list = _k_.list(n.then)
        for (var _1155_14_ = 0; _1155_14_ < list.length; _1155_14_++)
        {
            e = list[_1155_14_]
            prefix = lastPrefix && e === n.then.slice(-1)[0] ? lastPrefix : ''
            postfix = lastPostfix && e === n.then.slice(-1)[0] ? lastPostfix : ''
            s += g2 + prefix + this.node(e) + postfix + nl
        }
        s += gi + "}"
        if (!lineBreak)
        {
            this.ded()
        }
        return s
    }

    for_of (n, varPrefix = '', lastPrefix = '', lastPostfix = '', lineBreak)
    {
        var e, eb, g2, gi, key, nl, obj, postfix, prefix, s, val, _1177_26_

        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        key = ((_1177_26_=n.vals.text) != null ? _1177_26_ : (n.vals[0] != null ? n.vals[0].text : undefined))
        val = (n.vals[1] != null ? n.vals[1].text : undefined)
        obj = this.node(n.list)
        s = ''
        s += `for (${varPrefix}${key} in ${obj})` + nl
        s += gi + "{" + nl
        if (val)
        {
            s += g2 + `${varPrefix}${val} = ${obj}[${key}]` + eb
        }
        var list = _k_.list(n.then)
        for (var _1186_14_ = 0; _1186_14_ < list.length; _1186_14_++)
        {
            e = list[_1186_14_]
            prefix = lastPrefix && e === n.then.slice(-1)[0] ? lastPrefix : ''
            postfix = lastPostfix && e === n.then.slice(-1)[0] ? lastPostfix : ''
            s += g2 + prefix + this.node(e) + postfix + nl
        }
        s += gi + "}"
        if (!lineBreak)
        {
            this.ded()
        }
        return s
    }

    lcomp (n)
    {
        var comp, v

        v = 'r' + this.makeVar(n.for.inof)
        comp = (function (f)
        {
            switch (f.inof.text)
            {
                case 'in':
                    return this.for_in(f,'var ',`${v}.push(`,')',' ')

                case 'of':
                    return this.for_of(f,'var ',`${v}.push(`,')',' ')

            }

        }).bind(this)
        return `(function () { var ${v} = []; ${comp(n.for)} return ${v} }).bind(this)()`
    }

    while (n)
    {
        var gi, s

        gi = this.ind()
        s = ''
        s += `while (${this.atom(n.cond)})\n`
        s += gi + "{\n"
        if (!_k_.empty(n.then))
        {
            s += this.indent + this.nodes(n.then,'\n' + this.indent) + '\n'
        }
        s += gi + "}"
        this.ded()
        return s
    }

    switch (n)
    {
        var e, gi, s

        if (!n.match)
        {
            console.error('switch expected match',n)
        }
        if (!n.whens)
        {
            console.error('switch expected whens',n)
        }
        gi = this.ind()
        s = ''
        s += `switch (${this.node(n.match)})\n`
        s += gi + "{\n"
        var list = _k_.list(n.whens)
        for (var _1250_14_ = 0; _1250_14_ < list.length; _1250_14_++)
        {
            e = list[_1250_14_]
            s += gi + this.node(e) + '\n'
        }
        if (!_k_.empty(n.else))
        {
            s += this.indent + 'default:\n'
            var list1 = _k_.list(n.else)
            for (var _1255_18_ = 0; _1255_18_ < list1.length; _1255_18_++)
            {
                e = list1[_1255_18_]
                s += this.indent + '    ' + this.node(e) + '\n'
            }
        }
        s += gi + "}\n"
        this.ded()
        return s
    }

    when (n)
    {
        var e, gi, i, s

        if (!n.vals)
        {
            return console.error('when expected vals',n)
        }
        s = ''
        var list = _k_.list(n.vals)
        for (var _1274_14_ = 0; _1274_14_ < list.length; _1274_14_++)
        {
            e = list[_1274_14_]
            i = e !== n.vals[0] && this.indent || '    '
            s += i + 'case ' + this.node(e) + ':\n'
        }
        var list1 = _k_.list(n.then)
        for (var _1277_14_ = 0; _1277_14_ < list1.length; _1277_14_++)
        {
            e = list1[_1277_14_]
            gi = this.ind()
            s += gi + '    ' + this.node(e) + '\n'
            this.ded()
        }
        if (!(n.then && n.then.slice(-1)[0] && n.then.slice(-1)[0].return))
        {
            s += this.indent + '    ' + 'break'
        }
        return s
    }

    try (n)
    {
        var gi, s

        s = ''
        gi = this.ind()
        s += 'try\n'
        s += gi + '{\n'
        s += this.indent + this.nodes(n.exps,'\n' + this.indent)
        s += '\n'
        s += gi + '}'
        if (n.catch)
        {
            s += '\n'
            s += gi + `catch (${this.node(n.catch.errr) || 'err'})\n`
            s += gi + '{\n'
            s += this.indent + this.nodes(n.catch.exps,'\n' + this.indent)
            s += '\n'
            s += gi + '}'
        }
        if (n.finally)
        {
            s += '\n'
            s += gi + 'finally\n'
            s += gi + '{\n'
            s += this.indent + this.nodes(n.finally,'\n' + this.indent)
            s += '\n'
            s += gi + '}'
        }
        this.ded()
        return s
    }

    token (tok)
    {
        var s, _1336_28_

        s = tok.type === 'comment' ? this.comment(tok) : tok.type === 'this' ? 'this' : tok.type === 'triple' ? '`' + tok.text.slice(3, -3) + '`' : tok.type === 'bool' && tok.text === 'yes' ? 'true' : tok.type === 'bool' && tok.text === 'no' ? 'false' : (tok.type != null ? tok.type.startsWith('prof') : undefined) ? this.prof(tok) : tok.text
        this.js(s,tok)
        return s
    }

    comment (tok)
    {
        var _1352_19_

        if ((tok.text != null ? tok.text.startsWith('###') : undefined))
        {
            return '/*' + tok.text.slice(3, -3) + '*/' + '\n'
        }
        else if (tok.text.startsWith('#'))
        {
            return _k_.rpad(tok.col) + '//' + tok.text.slice(1)
        }
        else
        {
            console.error("# comment token expected")
            return ''
        }
    }

    operation (op)
    {
        var close, first, i, ind, keyval, lhs, o, open, opmap, prfx, ro, s, sep, v, val, _1385_29_, _1385_40_, _1417_25_, _1417_43_, _1417_54_, _1417_64_, _1441_18_, _1441_29_, _1446_25_, _1490_43_

        opmap = function (o)
        {
            var omp, _1378_19_

            omp = {and:'&&',or:'||',not:'!',empty:'_k_.empty',valid:'!_k_.empty',eql:'_k_.eql','==':'===','!=':'!=='}
            return ((_1378_19_=omp[o]) != null ? _1378_19_ : o)
        }
        o = opmap(op.operator.text)
        sep = ' '
        if ((!op.lhs && !(_k_.in(op.operator.text,['delete','new']))) || !op.rhs)
        {
            sep = ''
        }
        if (_k_.in(o,['<','<=','===','!==','>=','>','_k_.eql']))
        {
            ro = opmap(((_1385_29_=op.rhs) != null ? (_1385_40_=_1385_29_.operation) != null ? _1385_40_.operator.text : undefined : undefined))
            if (_k_.in(ro,['<','<=','===','!==','>=','>','_k_.eql']))
            {
                return '(' + this.atom(op.lhs) + sep + o + sep + this.atom(op.rhs.operation.lhs) + ' && ' + kstr.lstrip(this.atom(op.rhs)) + ')'
            }
        }
        open = close = ''
        if (o === '=')
        {
            if (op.lhs.object)
            {
                s = ''
                var list = _k_.list(op.lhs.object.keyvals)
                for (var _1396_31_ = 0; _1396_31_ < list.length; _1396_31_++)
                {
                    keyval = list[_1396_31_]
                    ind = op.lhs.object.keyvals.indexOf(keyval) > 0 ? this.indent : ''
                    s += ind + `${keyval.text} = ${this.atom(op.rhs)}.${keyval.text}\n`
                }
                return s
            }
            if (op.lhs.array)
            {
                v = this.makeVar(op.operator)
                s = `var ${v} = ${this.atom(op.rhs)}`
                var list1 = _k_.list(op.lhs.array.items)
                for (var _1405_28_ = 0; _1405_28_ < list1.length; _1405_28_++)
                {
                    val = list1[_1405_28_]
                    i = op.lhs.array.items.indexOf(val)
                    s += `; ${val.text} = ${v}[${i}]`
                }
                return s + '\n'
            }
            if (op.lhs && this.containsAssert(op.lhs))
            {
                s = "if (" + this.atom(this.pruneAssert(op.lhs)) + `) { ${this.node(this.clearAsserts(op.lhs))} = ` + this.atom(op.rhs) + " }"
                return s
            }
        }
        else if (o === '!')
        {
            if ((op.rhs != null ? op.rhs.incond : undefined) || _k_.in(((_1417_43_=op.rhs) != null ? (_1417_54_=_1417_43_.operation) != null ? (_1417_64_=_1417_54_.operator) != null ? _1417_64_.text : undefined : undefined : undefined),['=','is']))
            {
                open = '('
                close = ')'
            }
        }
        else if (_k_.in(op.operator.text,['empty','valid']))
        {
            this.hint._k_.empty = true
            if (op.operator.text === 'valid')
            {
                this.hint._k_.valid = true
            }
            open = '('
            close = ')'
        }
        else if (op.operator.text === 'eql')
        {
            this.hint._k_[op.operator.text] = true
            return `_k_.${op.operator.text}(${this.node(op.lhs)}, ${this.node(op.rhs)})`
        }
        else if (_k_.in(op.operator.text,['copy','clone']))
        {
            this.hint._k_[op.operator.text] = true
            return `_k_.${op.operator.text}(${this.node(op.rhs)})`
        }
        else if (op.operator.text === 'noon')
        {
            this.hint._k_.noon = true
            return `_k_.noon(${this.node(op.rhs)})`
        }
        else if (((_1441_18_=op.rhs) != null ? (_1441_29_=_1441_18_.operation) != null ? _1441_29_.operator.text : undefined : undefined) === '=')
        {
            open = '('
            close = ')'
        }
        else if (op.operator.text === 'is')
        {
            if (_k_.in((op.rhs != null ? op.rhs.type : undefined),['single','double','triple']))
            {
                return `typeof(${this.atom(op.lhs)}) === ${this.node(op.rhs)}`
            }
            else
            {
                if (op.rhs.text === 'num')
                {
                    lhs = this.atom(op.lhs)
                    this.hint._k_.isNum = true
                    return `_k_.isNum(${lhs})`
                }
                else if (op.rhs.text === 'obj')
                {
                    if (op.lhs.type === 'num')
                    {
                        return 'false'
                    }
                    else
                    {
                        lhs = this.atom(op.lhs)
                        this.hint._k_.isObj = true
                        return `_k_.isObj(${lhs})`
                    }
                }
                else if (op.rhs.text === 'arr')
                {
                    if (op.lhs.type === 'num')
                    {
                        return 'false'
                    }
                    else
                    {
                        lhs = this.atom(op.lhs)
                        this.hint._k_.isArr = true
                        return `_k_.isArr(${lhs})`
                    }
                }
                else if (op.rhs.text === 'str')
                {
                    lhs = this.atom(op.lhs)
                    this.hint._k_.isStr = true
                    return `_k_.isStr(${lhs})`
                }
                else if (op.rhs.text === 'func')
                {
                    lhs = this.atom(op.lhs)
                    this.hint._k_.isFunc = true
                    return `_k_.isFunc(${lhs})`
                }
                else if (op.rhs.text === 'elem')
                {
                    lhs = this.atom(op.lhs)
                    this.hint._k_.isElem = true
                    return `_k_.isElem(${lhs})`
                }
                else
                {
                    return `${this.atom(op.lhs)} instanceof ${this.atom(op.rhs)}`
                }
            }
        }
        first = firstLineCol(op.lhs)
        prfx = first.col === 0 && (op.rhs != null ? op.rhs.func : undefined) ? '\n' : ''
        lhs = op.lhs ? this.atom(op.lhs) + sep : ''
        return prfx + lhs + o + sep + open + kstr.lstrip(this.atom(op.rhs) + close)
    }

    incond (p)
    {
        this.hint._k_.in = true
        return `_k_.in(${this.atom(p.lhs)},${this.atom(p.rhs)})`
    }

    parens (p)
    {
        return `(${this.nodes(p.exps)})`
    }

    object (p)
    {
        var nodes

        nodes = p.keyvals.map((function (s)
        {
            return this.atom(s)
        }).bind(this))
        nodes = nodes.map(function (n)
        {
            if (_k_.in(':',n))
            {
                return n
            }
            else
            {
                return `${n}:${n}`
            }
        })
        return `{${nodes.join(',')}}`
    }

    keyval (p)
    {
        var key

        key = this.node(p.key)
        if (!(_k_.in(key[0],"'\"")) && /[\.\,\;\*\+\-\/\=\|]/.test(key))
        {
            key = `'${key}'`
        }
        return `${key}:${this.atom(p.val)}`
    }

    prop (p)
    {
        return `${this.node(p.obj)}.${this.node(p.prop)}`
    }

    index (p)
    {
        var addOne, from, ni, slice, u, upper, upto, _1559_32_, _1563_32_, _1565_25_, _1565_54_, _1581_27_

        if (slice = p.slidx.slice)
        {
            from = (slice.from != null) ? this.node(slice.from) : '0'
            addOne = slice.dots.text === '..'
            upto = (slice.upto != null) ? this.node(slice.upto) : '-1'
            if ((slice.upto != null ? slice.upto.type : undefined) === 'num' || (slice.upto != null ? slice.upto.operation : undefined) || upto === '-1')
            {
                u = parseInt(upto)
                if (Number.isFinite(u))
                {
                    if (u === -1 && addOne)
                    {
                        upper = ''
                    }
                    else
                    {
                        if (addOne)
                        {
                            u += 1
                        }
                        upper = `, ${u}`
                    }
                }
                else
                {
                    upper = `, ${upto}`
                }
            }
            else
            {
                if (addOne)
                {
                    if (upto)
                    {
                        upper = `, typeof ${upto} === 'number' ? ${upto}+1 : Infinity`
                    }
                }
                else
                {
                    upper = `, typeof ${upto} === 'number' ? ${upto} : -1`
                }
            }
            return `${this.node(p.idxee)}.slice(${from}${(upper != null ? upper : '')})`
        }
        else
        {
            if ((p.slidx.text != null ? p.slidx.text[0] : undefined) === '-')
            {
                ni = parseInt(p.slidx.text)
                if (ni === -1)
                {
                    return `${this.node(p.idxee)}.slice(${ni})[0]`
                }
                else
                {
                    return `${this.node(p.idxee)}.slice(${ni},${ni + 1})[0]`
                }
            }
            return `${this.node(p.idxee)}[${this.node(p.slidx)}]`
        }
    }

    array (p)
    {
        if ((p.items[0] != null ? p.items[0].slice : undefined))
        {
            return this.slice(p.items[0].slice)
        }
        else
        {
            return `[${this.nodes(p.items,',')}]`
        }
    }

    slice (p)
    {
        var from, o, upto, x, _1611_41_

        if ((p.from.type === 'num' && 'num' === (p.upto != null ? p.upto.type : undefined)))
        {
            from = parseInt(p.from.text)
            upto = parseInt(p.upto.text)
            if (upto - from <= 10)
            {
                if (p.dots.text === '...')
                {
                    upto--
                }
                return '[' + ((function () { var r_1616_30_ = []; for (var _1616_34_ = x = from, _1616_40_ = upto; (_1616_34_ <= _1616_40_ ? x <= upto : x >= upto); (_1616_34_ <= _1616_40_ ? ++x : --x))  { r_1616_30_.push(x)  } return r_1616_30_ }).bind(this)().join(',')) + ']'
            }
            else
            {
                o = p.dots.text === '...' ? '<' : '<='
                return `(function() { var r = []; for (var i = ${from}; i ${o} ${upto}; i++){ r.push(i); } return r; }).apply(this)`
            }
        }
        else
        {
            o = p.dots.text === '...' ? '<' : '<='
            return `(function() { var r = []; for (var i = ${this.node(p.from)}; i ${o} ${this.node(p.upto)}; i++){ r.push(i); } return r; }).apply(this)`
        }
    }

    stripol (chunks)
    {
        var c, chunk, s, t

        s = '`'
        var list = _k_.list(chunks)
        for (var _1633_18_ = 0; _1633_18_ < list.length; _1633_18_++)
        {
            chunk = list[_1633_18_]
            t = chunk.text
            switch (chunk.type)
            {
                case 'open':
                    s += t + '${'
                    break
                case 'midl':
                    s += '}' + t + '${'
                    break
                case 'close':
                    s += '}' + t
                    break
                default:
                    if (chunk.code)
                {
                    c = this.nodes(chunk.code.exps)
                    if (c[0] === ';')
                    {
                        c = c.slice(1)
                    }
                    s += c
                }
            }

        }
        s += '`'
        return s
    }

    section (p)
    {
        var gi, s

        this.hint.section = true
        gi = this.ind()
        s = `toExport[${p.title.text}] = function ()\n`
        s += gi + '{\n'
        if (!_k_.empty(p.exps))
        {
            s += this.indent + this.nodes(p.exps,'\n' + this.indent,true) + '\n'
        }
        s += gi + '}\n'
        s += `toExport[${p.title.text}]._section_ = true`
        this.ded()
        return s
    }

    subsect (p)
    {
        var gi, s

        gi = this.ind()
        s = `section(${p.title.text}, function ()\n`
        s += gi + '{\n'
        if (!_k_.empty(p.exps))
        {
            s += this.indent + this.nodes(p.exps,'\n' + this.indent) + '\n'
        }
        s += gi + '})'
        this.ded()
        return s
    }

    compare (p)
    {
        var s

        s = 'compare(' + this.node(p.lhs) + ',' + this.node(p.rhs) + ')'
        return s
    }

    containsAssert (e)
    {
        if (!e)
        {
            return false
        }
        if (e.assert)
        {
            return true
        }
        if (e.prop)
        {
            return this.containsAssert(e.prop.obj)
        }
        if (e.index)
        {
            return this.containsAssert(e.index.idxee)
        }
        if (e.call)
        {
            return this.containsAssert(e.call.callee)
        }
        return false
    }

    pruneAssert (e)
    {
        if (!e)
        {
            return e
        }
        if (e.prop)
        {
            return this.pruneAssert(e.prop.obj)
        }
        if (e.index)
        {
            return this.pruneAssert(e.index.idxee)
        }
        if (e.call)
        {
            return this.pruneAssert(e.call.callee)
        }
        return e
    }

    clearAsserts (e)
    {
        var c

        if (!e)
        {
            return e
        }
        if (e.assert)
        {
            return this.clearAsserts(e.assert.obj)
        }
        if (e.prop)
        {
            c = _k_.clone(e)
            c.prop.obj = this.clearAsserts(e.prop.obj)
            return c
        }
        if (e.index)
        {
            c = _k_.clone(e)
            c.index.idxee = this.clearAsserts(e.index.idxee)
            return c
        }
        if (e.call)
        {
            c = _k_.clone(e)
            c.call.callee = this.clearAsserts(e.call.callee)
            return c
        }
        return e
    }

    sortVars (vars)
    {
        var v, vl

        vl = (function () { var r_1733_27_ = []; var list = _k_.list(vars); for (var _1733_27_ = 0; _1733_27_ < list.length; _1733_27_++)  { v = list[_1733_27_];r_1733_27_.push(v.text)  } return r_1733_27_ }).bind(this)()
        vl.sort(function (a, b)
        {
            if (a[0] === '_' && b[0] !== '_')
            {
                return 1
            }
            else if (a[0] !== '_' && b[0] === '_')
            {
                return -1
            }
            else
            {
                return a.localeCompare(b)
            }
        })
        return vl.join(', ')
    }

    freshVar (name, suffix = 0)
    {
        var v, vars

        var list = _k_.list(this.varstack)
        for (var _1748_17_ = 0; _1748_17_ < list.length; _1748_17_++)
        {
            vars = list[_1748_17_]
            var list1 = _k_.list(vars)
            for (var _1749_18_ = 0; _1749_18_ < list1.length; _1749_18_++)
            {
                v = list1[_1749_18_]
                if (v.text === name + (suffix || ''))
                {
                    return this.freshVar(name,suffix + 1)
                }
            }
        }
        this.varstack.slice(-1)[0].push({text:name + (suffix || '')})
        return name + (suffix || '')
    }

    makeVar (tok)
    {
        return `_${tok.line}_${tok.col}_`
    }

    verb ()
    {
        if (this.debug)
        {
            return console.log.apply(console.log,arguments)
        }
    }

    ind ()
    {
        var oi

        oi = this.indent
        this.indent += '    '
        return oi
    }

    ded ()
    {
        return this.indent = this.indent.slice(0, -4)
    }
}

export default Renderer;