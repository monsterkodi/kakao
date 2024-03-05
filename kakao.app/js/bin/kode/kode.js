// monsterkodi/kode 0.256.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import Lexer from './lexer.js'
import print from './print.js'
import Parser from './parser.js'
import Scoper from './scoper.js'
import Stripol from './stripol.js'
import Returner from './returner.js'
import Operator from './operator.js'
import Renderer from './renderer.js'
import slash from '../../lib/kxk/slash.js'
import vm from 'vm'
class Kode
{
    constructor (args)
    {
        var _24_14_

        this.args = args
    
        this.args = ((_24_14_=this.args) != null ? _24_14_ : {})
        this.args.header = true
        this.version = '0.256.0'
        this.literals = ['bool','num','regex','single','double','triple']
        this.atoms = this.literals.concat(['var'])
        this.lexer = new Lexer(this)
        this.parser = new Parser(this)
        this.scoper = new Scoper(this)
        this.stripol = new Stripol(this)
        this.returner = new Returner(this)
        this.operator = new Operator(this)
        this.renderer = new Renderer(this)
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

    astr (text, scopes)
    {
        return print.astr(this.ast(text),scopes)
    }

    ast (text)
    {
        var block, tokens

        tokens = this.lexer.tokenize(text)
        block = this.lexer.blockify(tokens)
        return this.operator.collect(this.returner.collect(this.scoper.collect(this.stripol.collect(this.parser.parse(block)))))
    }
}

export default Kode;