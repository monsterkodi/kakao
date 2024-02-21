// monsterkodi/kode 0.249.0

var _k_

import Window from './window.js'
import kakao from './lib/kakao.js'
kakao.request('bundle.path').then(function (bundlePath)
{
    kakao.bundle.path = bundlePath
    return new Window
})