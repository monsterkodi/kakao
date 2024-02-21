// monsterkodi/kode 0.249.0

var _k_

var Kakao

import post from './post.js'
import bundle from './bundle.js'

Kakao = (function ()
{
    function Kakao ()
    {}

    Kakao["post"] = function (route, ...args)
    {
        return window.webkit.messageHandlers.kakao.postMessage({route:route,args:args})
    }

    Kakao["request"] = function (route, ...args)
    {
        return window.webkit.messageHandlers.kakao_request.postMessage({route:route,args:args})
    }

    Kakao["receive"] = function (msg)
    {
        return post.emit(msg)
    }

    Kakao["bundle"] = bundle
    return Kakao
})()

export default Kakao;