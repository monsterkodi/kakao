// monsterkodi/kode 0.249.0

var _k_

var About

import kakao from './kakao.js'

About = (function ()
{
    function About ()
    {}

    About["win"] = null
    About["url"] = null
    About["opt"] = null
    About["show"] = function (opt)
    {
        console.log('About.show',opt)
        About.opt = opt
        kakao.request('window.new',kakao.bundle.js('about.html')).then(function (win)
        {
            console.log('about win id',win)
        })
        About.win = win
        return win
    }

    About["blurAbout"] = function ()
    {
        var _141_24_

        if (!(About.opt != null ? About.opt.debug : undefined))
        {
            return About.closeAbout()
        }
    }

    About["closeAbout"] = function ()
    {
        var _150_17_

        ;(About.win != null ? About.win.close() : undefined)
        return About.win = null
    }

    return About
})()

export default About.show;