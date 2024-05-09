var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.r3=_k_.k.F256(_k_.k.r(3));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.b5=_k_.k.F256(_k_.k.b(5))

var build, pow, scooter

import pepe from "./pepe.js"

import kode from "../kode/kode.js"


pow = function (str)
{
    var splt

    splt = str.split('^')
    if (splt.length > 1)
    {
        str = `pow(${splt[0]}, ${pow(splt.slice(1).join('^'))})`
    }
    return str
}

build = function (str)
{
    var dep, pep

    pep = pepe(str)
    if (pep.length > 1 || !(_k_.isStr(pep[0])))
    {
        dep = pepe.depepe(pep,build)
        str = dep
    }
    str = pow(str)
    return str
}

scooter = function (str)
{
    var b, k, r

    str = str.replace(/log\(/g,'Math.log(')
    b = `{PI, E, sqrt, pow, cos, sin, tan, acos, asin, atan} = Math
rad = d -> PI*d/180.0
deg = r -> r*180.0/PI
`
    b += '(' + build(str) + ')'
    k = new kode
    r = k.eval(b)
    console.log(_k_.b5(str),_k_.r3(b),_k_.g5(r))
    return r
}
export default scooter;