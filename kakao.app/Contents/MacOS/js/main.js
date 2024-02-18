// monsterkodi/kode 0.249.0

var _k_

var $, c, e, main

if (e = document.getElementById('main'))
{
    c = document.createElement('div')
    c.textContent = "hello from main"
    e.appendChild(c)
}
import dom from './dom.js'
import elem from './elem.js'
$ = dom.$

main = $('main')
window.webkit.messageHandlers.kakao.postMessage('in main!')
window.webkit.messageHandlers.kakao_reply.postMessage('in main!')
elem({class:'test',text:'hello again!',parent:main,click:(function ()
{
    return window.webkit.messageHandlers.kakao.postMessage('hello from main!')
}).bind(this)})
elem({class:'test',text:'ping!',parent:main,click:(function ()
{
    return window.webkit.messageHandlers.kakao_reply.postMessage('ping!').then(function (reply, err)
    {
        console.log(reply,err)
        if (!err)
        {
            return elem({class:'test',text:reply,parent:main})
        }
    })
}).bind(this)})