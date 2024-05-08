var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import kxk from "../kxk.js"
let $ = kxk.$
let elem = kxk.elem
let post = kxk.post
let stopEvent = kxk.stopEvent

class Keys
{
    constructor ()
    {
        this.onButton = this.onButton.bind(this)
        this.key = this.key.bind(this)
        this.row = this.row.bind(this)
        this.setKeys = this.setKeys.bind(this)
        this.onKeys = this.onKeys.bind(this)
        this.view = $('#keys')
        this.table = elem('table',{class:'key-table',cellSpacing:'7px'})
        this.view.appendChild(this.table)
        this.numberKeys()
        post.on('keys',this.onKeys)
    }

    onKeys (action)
    {
        switch (action)
        {
            case 'functions':
                return this.functionKeys()

            case 'numbers':
                return this.numberKeys()

        }

    }

    setKeys (keys1, keys)
    {
        var row

        this.keys = keys1
    
        this.table.innerHTML = ''
        var list = _k_.list(keys)
        for (var _29_16_ = 0; _29_16_ < list.length; _29_16_++)
        {
            row = list[_29_16_]
            this.table.appendChild(row)
        }
    }

    row (children)
    {
        return elem('tr',{class:'key-row',children:children})
    }

    key (text, clss = '')
    {
        var cfg

        if (text === '_')
        {
            return elem('td',{class:'key hidden'})
        }
        else
        {
            cfg = {class:'key ' + clss,text:text,click:this.onButton}
            if (clss.indexOf('wide') >= 0)
            {
                cfg.colSpan = 2
            }
            if (clss.indexOf('tall') >= 0)
            {
                cfg.rowSpan = 2
            }
            return elem('td',cfg)
        }
    }

    numberKeys ()
    {
        return this.setKeys('numbers',[this.row([this.key('c','tall'),this.key('√','op0'),this.key('^','op0'),this.key('/','op1'),this.key('*','op1')]),this.row([this.key('7','digit'),this.key('8','digit'),this.key('9','digit'),this.key('-','dot')]),this.row([this.key('⌫'),this.key('4','digit'),this.key('5','digit'),this.key('6','digit'),this.key('+','dot')]),this.row([this.key('ƒ','tall bottom function'),this.key('1','digit'),this.key('2','digit'),this.key('3','digit'),this.key('=','tall bottom')]),this.row([this.key('0','wide digit right'),this.key('.','dot')])])
    }

    functionKeys ()
    {
        return this.setKeys('functions',[this.row([this.key('c','tall'),this.key('√','op0'),this.key('^','op0'),this.key('/','op1'),this.key('*','op1')]),this.row([this.key('sin','function'),this.key('cos','function'),this.key('π','constant'),this.key('-','dot')]),this.row([this.key('⌫'),this.key('tan','function'),this.key('log','function'),this.key('ℇ','constant'),this.key('+','dot')]),this.row([this.key('ℵ','tall bottom digit'),this.key('1/x','op1'),this.key('∡','op1'),this.key('ϕ','constant'),this.key('=','tall bottom equals')]),this.row([this.key('(','bracket'),this.key('°','digit'),this.key(')','bracket')])])
    }

    onButton (event)
    {
        return post.emit('button',event.target.innerHTML.trim())
    }

    toggleKeys ()
    {
        switch (this.keys)
        {
            case 'numbers':
                return this.functionKeys()

            default:
                return this.numberKeys()
        }

    }

    globalModKeyComboEvent (mod, key, combo, event)
    {
        switch (combo)
        {
            case 'tab':
                return stopEvent(event,this.toggleKeys())

            case '/':
            case '*':
            case '+':
            case '-':
            case '=':
            case '.':
                return post.emit('button',combo)

            case 'enter':
                return post.emit('button','=')

            case 'backspace':
                return post.emit('button','⌫')

            case 'delete':
            case 'esc':
                return post.emit('button','c')

            case 'shift+8':
                return post.emit('button','*')

            case 'shift+6':
                return post.emit('button','^')

            case 'shift+=':
                return post.emit('button','+')

            case 'shift+9':
                return post.emit('button','(')

            case 'shift+0':
                return post.emit('button',')')

            case 'e':
                return post.emit('button','ℇ')

            case 'c':
                return post.emit('button','c')

            case 'p':
                return post.emit('button','π')

            case 's':
                return post.emit('button','sin')

            case 'shift+c':
                return post.emit('button','cos')

            case 't':
                return post.emit('button','tan')

            case 'd':
                return post.emit('button','°')

            case 'r':
                return post.emit('button','√')

            case 'l':
                return post.emit('button','log')

            case 'x':
                return post.emit('button','exp')

            case 'i':
                return post.emit('button','1/x')

            case 'num lock':
                return stopEvent(event,post.emit('button','c'))

        }

        if (combo.startsWith('numpad'))
        {
            return post.emit('button',combo.split(' ')[1])
        }
        else if (_k_.in(combo,[0,1,2,3,4,5,6,7,8,9].map(function (i)
            {
                return `${i}`
            })))
        {
            return post.emit('button',combo)
        }
        return 'unhandled'
    }
}

export default Keys;