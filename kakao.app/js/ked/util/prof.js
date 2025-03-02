var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}};_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.b8=_k_.k.F256(_k_.k.b(8))

var prof

import kxk from "../../kxk.js"
let kstr = kxk.kstr


prof = (function ()
{
    function prof ()
    {}

    prof["tils"] = {}
    prof["til"] = function (args)
    {
        var key

        key = ''
        while (args.length)
        {
            key += args.shift()
            if (prof.tils[key])
            {
                return [key,prof.tils[key],args.join(' ')]
            }
            key += ' '
        }
        console.log(_k_.r5(`prof! ${_k_.g5(key)} doesn't match ${_k_.b8(Object.keys(prof.tils).join(' '))}`))
        return ['',[],'']
    }

    prof["tstr"] = function (til, idx)
    {
        return _k_.lpad(6,kstr.time(BigInt(process.hrtime(til[(idx < 0 ? til.length + idx : idx)])[1])))
    }

    prof["start"] = function (...args)
    {
        return prof.tils[args.join(' ')] = [process.hrtime()]
    }

    prof["time"] = function (...args)
    {
        var key, rst, til

        var _a_ = prof.til(args); key = _a_[0]; til = _a_[1]; rst = _a_[2]

        if (!_k_.empty(til))
        {
            til.push(process.hrtime())
            console.log(key,_k_.lpad(5,rst),prof.tstr(til,-2))
        }
    }

    prof["end"] = function (...args)
    {
        var key, rst, til

        var _a_ = prof.til(args); key = _a_[0]; til = _a_[1]; rst = _a_[2]

        if (!_k_.empty(til))
        {
            prof.time.apply(prof,[key,rst])
            console.log(key,_k_.lpad(5),prof.tstr(til,0))
        }
    }

    return prof
})()

export default prof;