var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.r2=_k_.k.F256(_k_.k.r(2));_k_.R2=_k_.k.B256(_k_.k.R(2));_k_.R3=_k_.k.B256(_k_.k.R(3));_k_.y3=_k_.k.F256(_k_.k.y(3));_k_.Y4=_k_.k.B256(_k_.k.Y(4));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.y6=_k_.k.F256(_k_.k.y(6))

var args, kode, _134_21_, _134_27_

import fs from "../kxk/fs.js"
import slash from "../kxk/slash.js"
import karg from "../kxk/karg.js"

import lexer from "./lexer.js"
import print from "./print.js"
import parser from "./parser.js"
import scoper from "./scoper.js"
import stripol from "./stripol.js"
import returner from "./returner.js"
import operator from "./operator.js"
import renderer from "./renderer.js"

import vm from "vm"

class Kode
{
    constructor (args)
    {
        var _17_14_, _18_21_

        this.args = args
    
        this.args = ((_17_14_=this.args) != null ? _17_14_ : {})
        this.args.header = ((_18_21_=this.args.header) != null ? _18_21_ : true)
        this.version = '0.2.0'
        this.literals = ['bool','num','regex','single','double','triple']
        this.atoms = this.literals.concat(['var'])
        this.lexer = new lexer(this)
        this.parser = new parser(this)
        this.scoper = new scoper(this)
        this.stripol = new stripol(this)
        this.returner = new returner(this)
        this.operator = new operator(this)
        this.renderer = new renderer(this)
    }

    eval (text, file, glob)
    {
        var js, k, sandbox, v

        if (_k_.empty(text))
        {
            return
        }
        sandbox = vm.createContext()
        if (glob)
        {
            for (k in glob)
            {
                v = glob[k]
                sandbox[k] = v
            }
        }
        sandbox.__filename = (file != null ? file : 'eval')
        sandbox.__dirname = slash.dir(sandbox.__filename)
        sandbox.console = console
        sandbox.process = process
        sandbox.global = global
        try
        {
            js = this.compile(text,file)
            return vm.runInContext(js,sandbox)
        }
        catch (err)
        {
            console.error(err)
            throw err
        }
    }

    static compile (text, opt = {})
    {
        return (new Kode(opt)).compile(text)
    }

    compile (text, file)
    {
        if (_k_.empty(_k_.trim(text)))
        {
            return ''
        }
        return this.renderer.render(this.ast(text),file)
    }

    ast (text)
    {
        var ast, blocks, tokens

        tokens = this.lexer.tokenize(text)
        blocks = this.lexer.blockify(tokens)
        ast = this.parser.parse(blocks)
        ast = this.stripol.collect(ast)
        ast = this.scoper.collect(ast)
        ast = this.returner.collect(ast)
        return ast = this.operator.collect(ast)
    }

    astr (text, scopes)
    {
        return print.astr(this.ast(text),scopes)
    }

    async cli ()
    {
        var file, js, out, text

        if (this.args.compile)
        {
            console.log(this.compile(this.args.compile))
            return
        }
        if (this.args.eval)
        {
            console.log(this.eval(this.args.eval,'eval',global))
            return
        }
        var list = _k_.list(this.args.files)
        for (var _113_17_ = 0; _113_17_ < list.length; _113_17_++)
        {
            file = list[_113_17_]
            file = slash.path(file)
            if (this.args.verbose)
            {
                console.log(gray(file))
            }
            text = await fs.read(file)
            if (_k_.empty(text))
            {
                console.error(_k_.Y4(_k_.r2(`can't read ${_k_.R3(_k_.y5(file))}`)))
                continue
            }
            if (this.args.outdir)
            {
                js = this.compile(text,file)
                out = slash.swapExt(slash.path(this.args.outdir,slash.file(file)),'js')
                if (this.args.verbose)
                {
                    console.log(out)
                }
                if (!await fs.write(out,js))
                {
                    console.error(_k_.R2(_k_.y3(`can't write ${_k_.R3(_k_.y6(out))}`)))
                }
            }
            else if (this.args.js)
            {
                console.log(this.compile(text,file))
            }
            else if (this.args.run)
            {
                console.log(this.eval(text,file,global))
            }
            else
            {
                console.log(this.compile(text,file))
            }
        }
    }
}

export default Kode;
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    args = karg(`kode
    files       **
    eval        evaluate a string and print the result
    compile     transpile a string and print the result
    outdir      transpile files into output directory
    run         execute files                               = true
    js          print transpiled js code                    = false
    header      prepend output with version header          = false -H
    verbose     log more                                    = false
    debug       debug output                                = false`)
    kode = new Kode(args)
    kode.cli()
}