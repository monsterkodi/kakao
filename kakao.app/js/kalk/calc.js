var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

import kxk from "../kxk.js"
let scooter = kxk.scooter
let kstr = kxk.kstr
let post = kxk.post

import text from "./text.js"

class Calc
{
    static activeKey (txt, key)
    {
        var clean, cOnst, deg2rad, dot, float, nuber, open, rad2deg, unfin, value

        clean = _k_.empty(txt)
        cOnst = text.endsWithConstant(txt)
        value = text.endsWithValue(txt)
        float = text.endsWithFloat(txt)
        nuber = text.endsWithNumber(txt)
        unfin = text.endsWithUnfinished(txt)
        open = text.endsWithOpen(txt)
        deg2rad = txt.slice(-1)[0] === symbol.deg2rad
        rad2deg = txt.slice(-1)[0] === symbol.rad2deg
        dot = txt.slice(-1)[0] === symbol.dot
        switch (key)
        {
            case symbol.func:
            case symbol.numbers:
                return true

            case 'π':
            case 'ϕ':
            case symbol.euler:
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                return !cOnst && !deg2rad && !dot

            case 'c':
            case symbol.backspace:
                return !clean

            case '=':
                return !clean && !unfin

            case 'sin':
            case 'cos':
            case 'tan':
            case 'atan':
            case 'deg':
            case 'rad':
            case 'log':
            case symbol.sqrt:
            case symbol.exp:
                if (unfin)
                {
                    return false
                }
                return true

            case symbol.pow:
                return !unfin && !dot && !clean

            case symbol.rad2deg:
                return !unfin && !dot && !rad2deg

            case symbol.deg2rad:
                return !unfin && !dot && !deg2rad

            case symbol.oneoverx:
            case '∡':
            case '°':
                return !unfin && !clean && txt.slice(-1)[0] !== '°'

            case '+':
            case '-':
                return !text.endsWith(txt,['+','-','.','/','*'])

            case '/':
            case '*':
                return !clean && !text.endsWith(txt,['+','-','.','/','*'])

            case '.':
                return text.endsWithNumber(txt) && !text.endsWithFloat(txt)

            case '(':
                if (!text.endsWithUnfinished(txt) && !text.endsWithConstant(txt))
                {
                    return
                }
                break
            case ')':
                return !text.endsWithUnfinished(txt) && text.balance(txt) > 0

            default:
                if (_k_.in(key,text.unfinished))
            {
                return !_k_.empty(txt) && !text.endsWithUnfinished(txt)
            }
        }

        return false
    }

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
        var clean, cOnst, float, nuber, value

        if (!this.activeKey(txt,key))
        {
            return txt
        }
        clean = _k_.empty(txt)
        cOnst = text.endsWithConstant(txt)
        value = text.endsWithValue(txt)
        float = text.endsWithFloat(txt)
        nuber = text.endsWithNumber(txt)
        switch (key)
        {
            case 'sin':
            case 'cos':
            case 'tan':
            case 'atan':
            case symbol.sqrt:
            case 'deg':
            case 'rad':
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
            case symbol.exp:
                if (clean || text.endsWithOp(txt))
                {
                    txt += key + '^'
                }
                else if (float || cOnst || nuber(txt = this.calc('exp(' + txt + ')')))
                {
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