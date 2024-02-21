// monsterkodi/kode 0.249.0

var _k_

var $, About

import kakao from './kakao.js'
import post from './post.js'
import dom from './dom.js'
import elem from './elem.js'
$ = dom.$


About = (function ()
{
    About["show"] = function ()
    {
        return kakao.request('window.new','about.html').then(function (win)
        {
            console.log('about win id',win)
        })
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
    kakao.request('bundle.path').then(function (bundlePath)
    {
        var about, image, main, win

        kakao.bundle.path = bundlePath
        win = new About
        main = $('#main')
        main.classList.add('app-drag-region')
        about = elem({class:'about',id:'about',tabIndex:0,parent:main})
        image = elem('img',{class:'image',src:kakao.bundle.res('img/about.png'),parent:about})
        elem({class:'version',id:'version',text:'0.0.0',parent:about})
        return window.onkeydown = win.close
    })
}
export default About.show;