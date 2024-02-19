// monsterkodi/kode 0.249.0

var _k_

import Bundle from './bundle.js'
import Window from './window.js'
import Kakao from './kakao.js'
Kakao.request('bundle.path').then(function (p)
{
    var win

    window.kakao = Kakao
    Bundle.path = p
    return win = new Window
})