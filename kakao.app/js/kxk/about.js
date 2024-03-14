var _k_

import dom from "../kxk/dom.js"
let $ = dom.$
let elem = dom.elem

import post from "./post.js"

import kakao from "../kakao.js"

kakao.init(function ()
{
    var main, _27_22_

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
    window.aboutImage = ((_27_22_=window.aboutImage) != null ? _27_22_ : kakao.bundle.img('about.png'))
    console.log('window.aboutImage',window.aboutImage)
    return elem('div',{class:'about',id:'about',parent:main,children:[elem('img',{class:'image',src:window.aboutImage}),elem('div',{class:'version',id:'version',text:'0.0.0'})]})
})