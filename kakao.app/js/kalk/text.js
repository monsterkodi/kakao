var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

class Text
{
    static balance (txt)
    {
        var c, o

        o = 0
        var list = _k_.list(txt)
        for (var _14_14_ = 0; _14_14_ < list.length; _14_14_++)
        {
            c = list[_14_14_]
            switch (c)
            {
                case '(':
                    o += 1
                    break
                case ')':
                    o -= 1
                    break
            }

        }
        return o
    }

    static close (txt)
    {
        var o

        o = this.balance(txt)
        while (o > 0)
        {
            o -= 1
            txt += ')'
        }
        return txt
    }

    static clean (txt)
    {
        var o

        o = this.balance(txt)
        while (o > 0)
        {
            o -= 1
            txt = txt.replace('(',' ')
        }
        return txt
    }

    static numbers = ['0','1','2','3','4','5','6','7','8','9']

    static constants = ['ℇ','π','ϕ','°']

    static unfinished = ['.','+','-','/','*','^','(']

    static popChar (txt)
    {
        return txt.substr(0,txt.length - 1)
    }

    static isInteger (txt)
    {
        return /\d+/.test(txt)
    }

    static endsWith (txt, chars)
    {
        return txt.length && _k_.in(txt[txt.length - 1],chars)
    }

    static endsWithFloat (txt)
    {
        return /\.\d+$/.test(txt)
    }

    static endsWithValue (txt)
    {
        return this.endsWithNumber(txt) || this.endsWithConstant(txt) || txt === '∞'
    }

    static endsWithNumber (txt)
    {
        return this.endsWith(txt,this.numbers)
    }

    static endsWithConstant (txt)
    {
        return this.endsWith(txt,this.constants)
    }

    static endsWithUnfinished (txt)
    {
        return this.endsWith(txt,this.unfinished)
    }

    static removeZeroInfinity (txt)
    {
        var popped

        popped = this.popChar(txt)
        if (txt === '∞')
        {
            return popped
        }
        if (this.endsWith(txt,['0']) && !(this.endsWith(popped,['.']) || this.endsWithNumber(popped)))
        {
            return popped
        }
        else
        {
            return txt
        }
    }
}

export default Text;