// monsterkodi/kode 0.249.0

var _k_

var main

import dom from './dom.js'
import elem from './elem.js'
import Bundle from './bundle.js'
import Window from './window.js'
import Kakao from './kakao.js'
main = dom.$('main')
elem({class:'test',text:'hello!',parent:main,click:(function ()
{
    return Kakao.post('hello from main!')
}).bind(this)})
elem({class:'test',text:'ping!',parent:main,click:(function ()
{
    return Kakao.request('test.ping','ping!').then(function (reply)
    {
        return elem({class:'test',text:reply,parent:main})
    })
}).bind(this)})
elem({class:'test',text:'send!',parent:main,click:(function ()
{
    return Kakao.request('test.struct',{hello:'world!',int:1}).then(function (reply)
    {
        return elem({class:'test',text:`${reply.input} ${reply.output}`,parent:main})
    })
}).bind(this)})
Kakao.request('Bundle.path').then(function (p)
{
    var win

    Bundle.path = p
    return win = new Window
})