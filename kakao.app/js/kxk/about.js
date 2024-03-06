// monsterkodi/kode 0.256.0

var _k_

var $, dom, elem, post

import kakao from '../kakao.js'
post = kakao.post
dom = kakao.dom

$ = dom.$
elem = dom.elem

window.kakao.init(function ()
{
    var main

    kakao.send('window.setSize',250,250)
    kakao.send('window.center')
    post.on('window.blur',function ()
    {
        return kakao.send('window.close')
    })
    window.onkeydown = function ()
    {
        return kakao.send('window.close')
    }
    main = $('#main')
    main.classList.add('app-drag-region')
    return elem('div',{class:'about',id:'about',parent:main,children:[elem('img',{class:'image',src:kakao.bundle.img('about.png')}),elem('div',{class:'version',id:'version',text:'0.0.0'})]})
})