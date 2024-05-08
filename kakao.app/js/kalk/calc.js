var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import kxk from "../kxk.js"
let kstr = kxk.kstr
let post = kxk.post

import text from "./text.js"

class Calc
{
    static calc (expr)
    {
        var evl, val, _29_20_, _31_28_

        if (_k_.empty(expr))
        {
            return ''
        }
        expr = text.close(expr)
        expr = expr.replace(/∡/,'(180/pi)*')
        expr = expr.replace(/√/g,'sqrt')
        expr = expr.replace(/π/g,'pi')
        expr = expr.replace(/ϕ/g,'phi')
        expr = expr.replace(/ℇ/g,'E')
        expr = expr.replace(/∞/g,'Infinity')
        expr = expr.replace(/°/g,' deg')
        evl = math.evaluate(expr)
        if ((evl.value != null))
        {
            val = kstr(evl.value)
        }
        else if ((evl.toString != null))
        {
            val = evl.toString()
        }
        else
        {
            val = kstr(evl)
        }
        val = val.replace(/Infinity/g,'∞')
        expr = expr.replace(/\(180\/pi\)\*/,'∡')
        expr = expr.replace(/sqrt/g,'√')
        expr = expr.replace(/pi/g,'π')
        expr = expr.replace(/E/g,'ℇ')
        expr = expr.replace(/phi/g,'ϕ')
        expr = expr.replace(/Infinity/g,'∞')
        expr = expr.replace(/deg/g,'°')
        if (expr.startsWith('∡'))
        {
            val += '°'
        }
        ;(post != null ? post.emit('sheet',{text:expr,val:val}) : undefined)
        return val = val.replace(/NaN/g,'')
    }

    static textKey (txt, key)
    {
        switch (key)
        {
            case 'sin':
            case 'cos':
            case 'tan':
            case '√':
            case 'deg':
            case 'rad':
            case 'exp':
            case 'log':
                if (!_k_.empty((txt)) && text.endsWithValue(txt))
                {
                    txt = this.calc(key + '(' + txt)
                }
                else if (!text.endsWith(txt,['.']))
                {
                    txt += key + '('
                }
                break
            case '°':
                if (text.endsWithNumber(txt))
                {
                    txt += key
                }
                break
            case '=':
                txt = this.calc(txt)
                break
            case '1/x':
                txt = this.calc('1/(' + txt + ')')
                break
            case '∡':
                txt = this.calc('∡(' + txt + ')')
                break
            case '+':
            case '-':
                if (!text.endsWith(txt,['+','-','.']))
                {
                    txt += key
                }
                break
            case '.':
                if (text.endsWithNumber(txt) && !text.endsWithFloat(txt))
                {
                    txt += key
                }
                break
            case 'π':
            case 'ℇ':
                if (!text.endsWithConstant(txt))
                {
                    txt += key
                }
                break
            case '(':
                if (!text.endsWithUnfinished(txt) && !text.endsWithConstant(txt))
                {
                    txt += key
                }
                break
            case ')':
                if (!text.endsWithUnfinished(txt) && text.balance(txt) > 0)
                {
                    txt += key
                }
                break
            default:
                if (_k_.in(key,text.unfinished))
            {
                if (!_k_.empty(txt))
                {
                    if (!text.endsWithUnfinished(txt))
                    {
                        txt += key
                    }
                }
            }
            else if (!text.endsWithConstant(txt))
            {
                txt = text.removeZeroInfinity(txt) + key
            }
        }

        return txt
    }
}

export default Calc;