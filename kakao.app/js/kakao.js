var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}}

var k, kakao, Kakao, v

import bundle from "./bundle.js"

import kxk from "./kxk/kxk.js"


Kakao = (function ()
{
    function Kakao ()
    {}

    Kakao["init"] = async function (cb)
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
        if (_k_.isStr(msg))
        {
            return kxk.post.emit(msg)
        }
        else if (_k_.isObj(msg))
        {
            return kxk.post.emit.apply(null,[msg.name].concat(msg.args))
        }
    }

    Kakao["bundle"] = bundle
    Kakao["window"] = kxk.win
    Kakao["dom"] = kxk.dom
    Kakao["post"] = kxk.post
    Kakao["ffs"] = kxk.ffs
    return Kakao
})()


kakao = function ()
{
    return Kakao.request.apply(null,arguments)
}
for (k in Kakao)
{
    v = Kakao[k]
    kakao[k] = v
}
window.kakao = kakao
window.process = {env:{home:'sweet/home',tmpdir:'/tmp',user:'kakao_user'}}
export default kakao;