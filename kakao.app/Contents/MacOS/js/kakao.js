// monsterkodi/kode 0.249.0

var _k_

var Kakao


Kakao = (function ()
{
    function Kakao ()
    {}

    Kakao["post"] = function (msg)
    {
        return window.webkit.messageHandlers.kakao.postMessage(msg)
    }

    Kakao["request"] = function (route, ...args)
    {
        return window.webkit.messageHandlers.kakao_request.postMessage({route:route,args:args})
    }

    return Kakao
})()

export default Kakao;