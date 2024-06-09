var tweaky

import kxk from "../kxk.js"
let elem = kxk.elem


tweaky = (function ()
{
    function tweaky (parent)
    {
        this.div = elem({class:'tweaky'})
        parent.appendChild(this.div)
    }

    tweaky.prototype["init"] = function (obj)
    {
        var k, v

        for (k in obj)
        {
            v = obj[k]
            this.slider(k,v)
        }
    }

    tweaky.prototype["slider"] = function (name, opt)
    {
        var input, range, row, step

        range = opt.max - opt.min
        step = opt.step
        if (!step && opt.steps)
        {
            step = range / opt.steps
        }
        step = (step != null ? step : 1)
        input = elem('input',{class:'tweaky-value',value:opt.value,type:'number',min:opt.min,max:opt.max,step:step})
        input.tabIndex = 1
        input.addEventListener('input',function (event)
        {
            return opt.cb(parseFloat(event.target.value))
        })
        row = elem({class:'tweaky-row',children:[elem({class:'tweaky-name',text:name}),input]})
        return this.div.appendChild(row)
    }

    return tweaky
})()

export default tweaky;