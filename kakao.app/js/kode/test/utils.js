// monsterkodi/kakao 0.1.0

var _k_

var kde

import kode from "../kode.js"


kde = function ()
{
    return new kode({header:false})
}
export default {ast:function (c, p)
{
    return kde().astr(c,false)
},ke:function (c)
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
},kc:function (c, f)
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
}}