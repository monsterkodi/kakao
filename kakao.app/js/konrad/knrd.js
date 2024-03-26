var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = performance.now(); }, profilend: function (id) { var b = performance.now()-_k_.hrtime[id]; let f=0.001; for (let u of ['s','ms','μs','ns']) { if (u=='ns' || (b*f)>=1) { return console.log(id+' '+(b*f)+' '+u); } f*=1000; }}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g2=_k_.k.F256(_k_.k.g(2));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.m3=_k_.k.F256(_k_.k.m(3));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3))

var knrd, __dirname

import kode from "../kode/kode.js"

import fs from "../kxk/fs.js"

import slash from "../kxk/slash.js"
let tilde = slash.tilde

import noon from "../kxk/noon.js"

import lib_kakao from "../../lib/lib_kakao.js"
let pug = lib_kakao.pug
let stylus = lib_kakao.stylus

__dirname = import.meta.dirname

knrd = async function (files = [], opt = {})
{
    var compText, file, ignore, jsDir, kodeDir, list, pugDir, rule, rules, skip, srcFile, srcText, tgtFile, tgtText, transpiled, _25_23_, _26_16_

    if (_k_.isStr(files))
    {
        files = [files]
    }
    opt.rerunWhenDirty = ((_25_23_=opt.rerunWhenDirty) != null ? _25_23_ : true)
    opt.verbose = ((_26_16_=opt.verbose) != null ? _26_16_ : false)
    if (opt.verbose)
    {
        console.log('opt',opt)
    }
    if (opt.verbose)
    {
        console.log('files',files)
    }
    _k_.profile('🔨')
    kodeDir = slash.path(__dirname + '/../../kode')
    pugDir = slash.path(__dirname + '/../../pug')
    jsDir = slash.path(__dirname + '/../../js')
    rules = {kode:{tgtExt:'js',srcDir:kodeDir,tgtDir:jsDir,compile:function (srcText, srcFile)
    {
        var k0de

        k0de = new kode({header:false})
        return k0de.compile(srcText,srcFile)
    }},styl:{tgtExt:'css',srcDir:pugDir,tgtDir:jsDir + '/css',compile:function (srcText, srcFile)
    {
        return stylus(srcText)
    }},pug:{tgtExt:'html',srcDir:pugDir,tgtDir:jsDir,compile:function (srcText, srcFile)
    {
        return pug(srcText)
    }},noon:{tgtExt:'json',srcDir:kodeDir,tgtDir:jsDir,compile:function (srcText, srcFile)
    {
        return JSON.stringify(noon.parse(srcText),null,'  ')
    }},ignore:['kolor/lang.noon']}
    if (_k_.empty(files))
    {
        list = await fs.list(kodeDir)
        list = list.concat(await fs.list(pugDir))
        list = list.filter(function (item)
        {
            return item.type === 'file'
        })
        files = list.map(function (item)
        {
            return item.path
        })
    }
    if (!opt.quiet)
    {
        console.log('🔨 ',files.length)
    }
    transpiled = 0
    var list1 = _k_.list(files)
    for (var _73_13_ = 0; _73_13_ < list1.length; _73_13_++)
    {
        file = list1[_73_13_]
        skip = false
        var list2 = _k_.list(rules.ignore)
        for (var _76_19_ = 0; _76_19_ < list2.length; _76_19_++)
        {
            ignore = list2[_76_19_]
            if (file.endsWith(ignore))
            {
                if (opt.verbose)
                {
                    console.log(_k_.w2('✘  '),_k_.w3(tilde(file)))
                }
                skip = true
                break
            }
        }
        if (skip)
        {
            continue
        }
        if (rule = rules[slash.ext(file)])
        {
            srcFile = file
            tgtFile = slash.swapExt(srcFile.replace(rule.srcDir,rule.tgtDir),rule.tgtExt)
            srcText = await fs.read(srcFile)
            tgtText = await fs.read(tgtFile)
            compText = rule.compile(srcText,srcFile)
            if (_k_.empty(compText))
            {
                console.log(_k_.y5('✘ '),_k_.r5(tilde(srcFile)),_k_.r4('transpiles to empty!'))
            }
            else
            {
                if (tgtText !== compText)
                {
                    transpiled++
                    await fs.write(tgtFile,compText)
                    if (!opt.quiet)
                    {
                        console.log(_k_.b5('✔ '),_k_.g5(tilde(tgtFile)))
                    }
                }
                else
                {
                    fs.touch(tgtFile)
                    if (opt.verbose)
                    {
                        console.log(_k_.g2('✔ '),_k_.m3(tilde(srcFile)))
                    }
                }
            }
        }
        else
        {
            console.error('unknown file type',file)
        }
        null
    }
    if (opt.rerunWhenDirty && transpiled)
    {
        _k_.profilend('🔨')
        return knrd(files,{rerunWhenDirty:false})
    }
}
export default knrd;