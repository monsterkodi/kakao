var _k_

import kxk from "../kxk.js"
let post = kxk.post
let elem = kxk.elem
let $ = kxk.$

import kakao from "../kakao.js"

kakao.init(function ()
{
    var main, _26_22_

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
    window.aboutImage = ((_26_22_=window.aboutImage) != null ? _26_22_ : kakao.bundle.img('about.png'))
    return elem('div',{class:'about',id:'about',parent:main,children:[elem('img',{class:'image',src:window.aboutImage}),elem('div',{class:'version',id:'version',text:'0.0.0'})]})
})