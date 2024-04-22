var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, file: function () { return import.meta.url.substring(7); }};_k_.G2=_k_.k.B256(_k_.k.G(2));_k_.y8=_k_.k.F256(_k_.k.y(8))

var file, files, hdr, test

import fs from "./kxk/fs.js"
import slash from "./kxk/slash.js"

import tester from "./kode/tester.js"

if (process.argv.slice(-1)[0] === 'brief')
{
    tester.logSections = false
}
if (process.argv.slice(-1)[0] === 'silent')
{
    tester.logSections = false
    tester.logModules = false
}

hdr = function (h)
{
    console.log(_k_.G2(_k_.y8(' ' + _k_.rpad(33,h) + ' ')))
}
if (1)
{
    hdr('kxk')
    files = await fs.list(slash.path(_k_.dir(),'kxk/test'))
    var list = _k_.list(files)
    for (var _24_13_ = 0; _24_13_ < list.length; _24_13_++)
    {
        file = list[_24_13_]
        if (file.path === _k_.file())
        {
            continue
        }
        test = await import(file.path)
        tester.test(test.default)
    }
}
if (1)
{
    hdr('kode')
    files = await fs.list(slash.path(_k_.dir(),'kode/test'))
    var list1 = _k_.list(files)
    for (var _32_13_ = 0; _32_13_ < list1.length; _32_13_++)
    {
        file = list1[_32_13_]
        test = await import(file.path)
        tester.test(test.default)
    }
}
if (1)
{
    hdr('kolor')
    file = slash.path(_k_.dir(),'kolor/test.js')
    test = await import(file)
    tester.test(test.default)
}
if (1)
{
    hdr('ko')
    files = await fs.list(slash.path(_k_.dir(),'ko/test'))
    var list2 = _k_.list(files)
    for (var _45_13_ = 0; _45_13_ < list2.length; _45_13_++)
    {
        file = list2[_45_13_]
        test = await import(file.path)
        tester.test(test.default)
    }
}
tester.summarize()