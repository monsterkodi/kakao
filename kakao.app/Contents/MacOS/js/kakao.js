// monsterkodi/kode 0.249.0

var _k_

var Kakao


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
        console.log('msg from app:',msg)
    }

    return Kakao
})()

export default Kakao;