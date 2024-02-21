// monsterkodi/kode 0.249.0

var _k_

var $, About, elem

import kakao from './kakao.js'
import post from './post.js'
import dom from './dom.js'
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
        return kakao.post('window.close')
    }

    About.prototype["openURL"] = function ()
    {}

    return About
})()

if (document.title === 'about')
{
    kakao.init(function ()
    {
        var about, aboutWin, image, main

        aboutWin = new About
        main = $('#main')
        main.classList.add('app-drag-region')
        about = elem({class:'about',id:'about',parent:main})
        image = elem('img',{class:'image',src:kakao.bundle.img('about.png'),parent:about})
        elem({class:'version',id:'version',text:'0.0.0',parent:about})
        return window.onkeydown = aboutWin.close
    })
}
export default About.show;