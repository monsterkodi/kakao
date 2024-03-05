// monsterkodi/kode 0.256.0

var _k_

var kode

import Kode from '../kompile.js'

kode = function ()
{
    return new Kode()
}
export default {ast:function (c, p)
{
    return kode().astr(c,false)
},ke:function (c)
{
    try
    {
        return kode().eval(c)
    }
    catch (err)
    {
        console.log(c)
        console.log(err)
    }
},kc:function (c, f)
{
    var k

    k = kode().compile(c,f)
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
}};