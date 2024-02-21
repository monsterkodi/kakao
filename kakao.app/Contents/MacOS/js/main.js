// monsterkodi/kode 0.249.0

var _k_

import Window from './window.js'
import Bundle from './lib/bundle.js'
import Kakao from './lib/kakao.js'
Kakao.request('bundle.path').then(function (bundlePath)
{
    Bundle.path = bundlePath
    window.kakao = Kakao
    return new Window
})