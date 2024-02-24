// monsterkodi/kode 0.252.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import Lexer from './lexer.js'
import print from './print.js'
import Parser from './parser.js'
import Scoper from './scoper.js'
import Stripol from './stripol.js'
import Returner from './returner.js'
import Operator from './operator.js'
import Renderer from './renderer.js'
class Kode
{
    constructor (args)
    {
        this.args = args
    
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

    static compile (text, opt = {})
    {
        return (new Kode(opt)).compile(text)
    }

    compile (text, file)
    {
        var ast, js

        if (_k_.empty(_k_.trim(text)))
        {
            return ''
        }
        ast = this.ast(text)
        js = this.renderer.render(ast,file)
        return js
    }

    ast (text)
    {
        var block, tokens

        if (this.args.verbose || this.args.debug || this.args.kode)
        {
            print.code('kode',text,'coffee')
        }
        tokens = this.lexer.tokenize(text)
        if (this.args.raw)
        {
            print.noon('raw tokens',tokens)
        }
        if (this.args.tokens)
        {
            print.tokens('tokens',tokens)
        }
        block = this.lexer.blockify(tokens)
        if (this.args.raw)
        {
            print.noon('raw block',block)
        }
        if (this.args.block)
        {
            print.block('tl block',block)
        }
        return this.operator.collect(this.returner.collect(this.scoper.collect(this.stripol.collect(this.parser.parse(block)))))
    }
}

export default Kode.compile;