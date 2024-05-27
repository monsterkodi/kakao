import kakao from "../kakao.js"

import kxk from "../kxk.js"
let win = kxk.win
let elem = kxk.elem
let post = kxk.post
let $ = kxk.$

kakao.init(function ()
{
    return new win({onWindowWillShow:function ()
    {
        var frame, icon, offset, size, _19_37_, _20_41_, _21_50_

        frame = {x:-300,y:0,w:400,h:40}
        kakao('window.setFrame',frame,true)
        size = ((_19_37_=window.statusIconSize) != null ? _19_37_ : 22)
        offset = ((_20_41_=window.statusIconOffset) != null ? _20_41_ : -8)
        icon = kakao.bundle.img(((_21_50_=window.statusIcon) != null ? _21_50_ : 'menu_kakao.png'))
        document.body.appendChild(elem('img',{src:icon,width:`${size}px`,height:`${size}px`}))
        return requestAnimationFrame(function ()
        {
            kakao('status.icon',{x:0,y:offset,w:size,h:38})
            return requestAnimationFrame(function ()
            {
                return kakao('window.close')
            })
        })
    }})
})