var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

import kxk from "../kxk.js"
let $ = kxk.$
let elem = kxk.elem
let kstr = kxk.kstr
let post = kxk.post

import color from "./color.js"

class Sheet
{
    constructor ()
    {
        this.onSheet = this.onSheet.bind(this)
        this.view = $("#sheet")
        this.calc = elem({class:'sheet-calc'})
        this.result = elem({class:'sheet-result'})
        this.view.appendChild(this.calc)
        this.view.appendChild(this.result)
        post.on('sheet',this.onSheet)
    }

    async compact ()
    {
        var info

        info = await kakao('win.frameInfo')
        return kakao('win.setFrame',{x:info.frame.x,y:info.frame.y,w:476,h:604})
    }

    async expand ()
    {
        var br, info, spaceAbove

        info = await kakao('win.frameInfo')
        spaceAbove = (info.screen.h + info.screen.y) - (info.frame.h + info.frame.y)
        if (spaceAbove > 25)
        {
            br = this.view.getBoundingClientRect()
            return kakao('win.setFrame',{x:info.frame.x,y:info.frame.y,w:476,h:_k_.max(654,info.frame.h + 30)})
        }
    }

    onSheet (action)
    {
        if (action === 'clear')
        {
            this.calc.innerHTML = ''
            this.result.innerHTML = ''
            this.compact()
            return
        }
        else if (action.text !== kstr(action.val))
        {
            this.calc.appendChild(elem({class:'sheet-line calc',html:color(action.text + ' =')}))
            this.result.appendChild(elem({class:'sheet-line result',html:color(action.val)}))
        }
        else
        {
            this.calc.appendChild(elem({class:'sheet-line calc',html:''}))
            this.result.appendChild(elem({class:'sheet-line result',html:color(action.val)}))
        }
        return this.expand()
    }
}

export default Sheet;