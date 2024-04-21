var _k_

import kakao from "./kakao.js"

import kxk from "./kxk.js"
let win = kxk.win
let elem = kxk.elem
let $ = kxk.$

kakao.init(function ()
{
    var main

    new win
    main = $('main')
    return elem({text:'func = () -> => a == b:{}, c()',parent:main})
})