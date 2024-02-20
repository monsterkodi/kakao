// monsterkodi/kode 0.249.0

var _k_

import Bundle from './bundle.js'
import Window from './window.js'
import Kakao from './kakao.js'
Kakao.request('bundle.path').then(function (bundlePath)
{
    Bundle.path = bundlePath
    window.kakao = Kakao
    return new Window
})