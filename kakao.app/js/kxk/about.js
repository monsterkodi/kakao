var _k_

import dom from "../kxk/dom.js"
let $ = dom.$
let elem = dom.elem

import post from "./post.js"

import kakao from "../kakao.js"

kakao.init(function ()
{
    var main, _27_22_

    kakao('window.setSize',250,250)
    kakao('window.center')
    post.on('window.blur',function ()
    {
        return kakao('window.close')
    })
    window.onkeydown = function ()
    {
        return kakao('window.close')
    }
    main = $('#main')
    main.classList.add('app-drag-region')
    window.aboutImage = ((_27_22_=window.aboutImage) != null ? _27_22_ : kakao.bundle.img('about.png'))
    return elem('div',{class:'about',id:'about',parent:main,children:[elem('img',{class:'image',src:window.aboutImage}),elem('div',{class:'version',id:'version',text:'0.0.0'})]})
})