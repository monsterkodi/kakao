// monsterkodi/kakao 0.1.0

var _k_

var $, dom, elem, post

import kakao from "../kakao.js"

post = kakao.post
dom = kakao.dom

$ = dom.$
elem = dom.elem

kakao.init(function ()
{
    var main, _28_22_

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
    console.log('bundlePath',kakao.bundle.path,window.aboutImage)
    window.aboutImage = ((_28_22_=window.aboutImage) != null ? _28_22_ : kakao.bundle.img('about.png'))
    console.log('window.aboutImage',window.aboutImage)
    return elem('div',{class:'about',id:'about',parent:main,children:[elem('img',{class:'image',src:window.aboutImage}),elem('div',{class:'version',id:'version',text:'0.0.0'})]})
})