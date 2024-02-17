// monsterkodi/kode 0.249.0

var _k_

var $, c, e, main

if (e = document.getElementById('main'))
{
    c = document.createElement('div')
    c.textContent = "hello from main"
    e.appendChild(c)
}
import dom from './dom.js'
import elem from './elem.js'
$ = dom.$

main = $('main')
elem({class:'test',text:'hello again!',parent:main})
export default true;