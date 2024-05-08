var _k_

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

    onSheet (action)
    {
        switch (action)
        {
            case 'clear':
                this.calc.innerHTML = ''
                return this.result.innerHTML = ''

            default:
                if (action.text !== kstr(action.val))
            {
                this.calc.appendChild(elem({class:'sheet-line calc',html:color(action.text + ' =')}))
                return this.result.appendChild(elem({class:'sheet-line result',html:color(action.val)}))
            }
            else
            {
                this.calc.appendChild(elem({class:'sheet-line calc',html:''}))
                return this.result.appendChild(elem({class:'sheet-line result',html:color(action.val)}))
            }
        }

    }
}

export default Sheet;