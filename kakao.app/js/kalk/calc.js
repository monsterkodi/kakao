var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

import kxk from "../kxk.js"
let scooter = kxk.scooter
let kstr = kxk.kstr
let post = kxk.post

import text from "./text.js"

class Calc
{
    static calc (expr)
    {
        var val

        if (_k_.empty(expr))
        {
            return ''
        }
        expr = text.close(expr)
        expr = _k_.trim(expr,' \n')
        val = scooter(expr)
        ;(post != null ? post.emit('sheet',{text:expr,val:val}) : undefined)
        return val
    }

    static textKey (txt, key)
    {
        switch (key)
        {
            case 'sin':
            case 'cos':
            case 'tan':
            case 'atan':
            case symbol.sqrt:
            case 'deg':
            case 'rad':
            case symbol.exp:
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
            case symbol.oneoverx:
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
            case symbol.euler:
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