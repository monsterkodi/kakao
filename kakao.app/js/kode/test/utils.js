var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.w3=_k_.k.F256(_k_.k.w(3))

var kdd, kde

import kode from "../kode.js"


kde = function ()
{
    return new kode({header:false})
}

kdd = function ()
{
    return new kode({header:false,debug:true,verbose:true})
}
export default {
    ast:function (c, p)
    {
        return kde().astr(c,false)
    },
    ke:function (c)
    {
        try
        {
            return kde().eval(c)
        }
        catch (err)
        {
            console.log(c)
            console.log(err)
        }
    },
    kc:function (c, f)
    {
        var k
    
        k = kde().compile(c,f)
        if (k.startsWith('// monsterkodi/kode'))
        {
            k = k.slice(k.indexOf('\n') + 2)
        }
        if (k.startsWith('var _k_'))
        {
            k = k.slice(k.indexOf('\n') + 2)
        }
        if (k.startsWith('var '))
        {
            k = k.slice(k.indexOf('\n') + 2)
        }
        return k
    },
    kd:function (c, f)
    {
        var k
    
        k = kdd().compile(c,f)
        if (k.startsWith('// monsterkodi/kode'))
        {
            k = k.slice(k.indexOf('\n') + 2)
        }
        if (k.startsWith('var _k_'))
        {
            k = k.slice(k.indexOf('\n') + 2)
        }
        if (k.startsWith('var '))
        {
            k = k.slice(k.indexOf('\n') + 2)
        }
        return k
    },
    kf:function (c, f)
    {
        var r
    
        r = kde().compile(c,f)
        if (r !== undefined)
        {
            return `${_k_.w3('compilation of')}\n${c}\n${_k_.w3('should have failed! instead it returned')}\n${r}`
        }
        else
        {
            return true
        }
    }
}