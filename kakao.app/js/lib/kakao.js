// monsterkodi/kode 0.256.0

var _k_

var Kakao

console.log('kakao')
import bundle from './bundle.js'
import kxk from './kxk/kxk.js'

Kakao = (function ()
{
    function Kakao ()
    {}

    Kakao["init"] = function (cb)
    {
        return Kakao.request('bundle.path').then(function (bundlePath)
        {
            bundle.path = bundlePath
            return cb(bundlePath)
        })
    }

    Kakao["send"] = function (route, ...args)
    {
        return window.webkit.messageHandlers.kakao.postMessage({route:route,args:args})
    }

    Kakao["request"] = function (route, ...args)
    {
        return window.webkit.messageHandlers.kakao_request.postMessage({route:route,args:args})
    }

    Kakao["receive"] = function (msg)
    {
        return kxk.post.emit(msg)
    }

    Kakao["bundle"] = bundle
    Kakao["window"] = kxk.win
    Kakao["dom"] = kxk.dom
    Kakao["post"] = kxk.post
    return Kakao
})()

window.kakao = Kakao
export default Kakao;