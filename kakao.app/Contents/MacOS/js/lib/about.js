// monsterkodi/kode 0.249.0

var _k_

var $, About, dom, elem, post

import kakao from './kakao.js'
post = kakao.post
dom = kakao.dom

$ = dom.$
elem = dom.elem


About = (function ()
{
    About["show"] = function ()
    {
        return kakao.request('window.new','about.html')
    }

    function About ()
    {
        this["close"] = this["close"].bind(this)
        post.on('window.blur',this.close)
    }

    About.prototype["close"] = function ()
    {
        return kakao.send('window.close')
    }

    About.prototype["openURL"] = function ()
    {}

    return About
})()

if (document.title === 'about')
{
    kakao.init(function ()
    {
        var aboutWin, main

        aboutWin = new About
        main = $('#main')
        main.classList.add('app-drag-region')
        elem('div',{class:'about',id:'about',parent:main,children:[elem('img',{class:'image',src:kakao.bundle.img('about.png')}),elem('div',{class:'version',id:'version',text:'0.0.0'})]})
        return window.onkeydown = aboutWin.close
    })
}
export default About.show;