// monsterkodi/kode 0.249.0

var _k_

var Kakao

import post from './post.js'
import bundle from './bundle.js'
import Window from '../window.js'

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
    Kakao["window"] = Window
    Kakao["init"] = function (cb)
    {
        return Kakao.request('bundle.path').then(function (bundlePath)
        {
            bundle.path = bundlePath
            return cb(bundlePath)
        })
    }

    return Kakao
})()

window.kakao = Kakao
export default Kakao;