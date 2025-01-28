var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var TTIO

import events from "../kxk/events.js"


TTIO = (function ()
{
    _k_.extend(TTIO, events)
    function TTIO ()
    {
        this["onData"] = this["onData"].bind(this)
        this["emitMousePress"] = this["emitMousePress"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["restore"] = this["restore"].bind(this)
        this["store"] = this["store"].bind(this)
        this["showCursor"] = this["showCursor"].bind(this)
        this["hideCursor"] = this["hideCursor"].bind(this)
        this["setCursor"] = this["setCursor"].bind(this)
        this["rows"] = this["rows"].bind(this)
        this["cols"] = this["cols"].bind(this)
        this["clear"] = this["clear"].bind(this)
        this["quit"] = this["quit"].bind(this)
        this["write"] = this["write"].bind(this)
        this.store()
        if (process.stdin.isTTY)
        {
            process.stdin.setRawMode(true)
        }
        this.write('\x1b[?45h')
        this.write('\x1b[?1000h')
        this.write('\x1b[?1002h')
        this.write('\x1b[?1003h')
        this.write('\x1b[?1004h')
        this.write('\x1b[?1006h')
        this.write('\x1b[?1049h')
        this.write('\x1b[?2004h')
        this.write('\x1b[>4;2m')
        this.write('\x1b[6 q')
        process.stdout.on('resize',this.onResize)
        process.stdin.on('data',this.onData)
        return TTIO.__super__.constructor.apply(this, arguments)
    }

    TTIO.prototype["write"] = function (str)
    {
        return process.stdout.write(str)
    }

    TTIO.prototype["quit"] = function ()
    {
        this.clear()
        this.write('\x1b[?1049l')
        this.restore()
        return process.exit(0)
    }

    TTIO.prototype["clear"] = function ()
    {
        this.write('\x1b[2J')
        return this.write('\x1b[H')
    }

    TTIO.prototype["cols"] = function ()
    {
        return process.stdout.columns
    }

    TTIO.prototype["rows"] = function ()
    {
        return process.stdout.rows
    }

    TTIO.prototype["setCursor"] = function (x, y)
    {
        return this.write(`\x1b[${y + 1};${x + 1}H`)
    }

    TTIO.prototype["hideCursor"] = function ()
    {
        return this.write('\x1b[?25l')
    }

    TTIO.prototype["showCursor"] = function (show = true)
    {
        if (show)
        {
            return this.write('\x1b[?25h')
        }
        else
        {
            return this.hideCursor()
        }
    }

    TTIO.prototype["store"] = function ()
    {
        return this.write('\x1b7')
    }

    TTIO.prototype["restore"] = function ()
    {
        return this.write('\x1b8')
    }

    TTIO.prototype["onResize"] = function ()
    {
        return this.emit('resize',this.cols(),this.rows())
    }

    TTIO.prototype["emitMousePress"] = function (col, row, button, mods = '')
    {
        var diff, _70_19_

        this.lastClick = ((_70_19_=this.lastClick) != null ? _70_19_ : {row:row,col:col,count:0,time:process.hrtime()})
        if (this.lastClick.col === col && this.lastClick.row === row)
        {
            diff = process.hrtime(this.lastClick.time)
            this.lastClick.time = process.hrtime()
            if (diff[0] < 1 && diff[1] < 500000000)
            {
                this.lastClick.count += 1
            }
            else
            {
                this.lastClick.count = 1
            }
        }
        else
        {
            this.lastClick.col = col
            this.lastClick.row = row
            this.lastClick.count = 1
            this.lastClick.time = process.hrtime()
        }
        return this.emit('mouse','press',col,row,button,mods,this.lastClick.count)
    }

    TTIO.prototype["onData"] = function (data)
    {
        var code, col, key, modc, mods, row, seq, text, x, y, _99_23_

        if ((this.pasteBuffer != null))
        {
            this.pasteBuffer += data.toString('utf8')
            if (this.pasteBuffer.endsWith('\x1b[201~'))
            {
                this.pasteBuffer = this.pasteBuffer.slice(0, -6)
                this.emit('paste',this.pasteBuffer)
                delete this.pasteBuffer
            }
            return
        }
        if (data[0] === 0x1b)
        {
            seq = data.slice(1).toString('utf8')
            if (seq === '[200~')
            {
                this.pasteBuffer = ''
                return
            }
            if (seq.startsWith('[<'))
            {
                var _a_ = seq.slice(2, -1).split(';').map(function (s)
                {
                    return parseInt(s)
                }); code = _a_[0]; col = _a_[1]; row = _a_[2]

                x = col - 1
                y = row - 1
                if (seq.endsWith('M'))
                {
                    switch (code)
                    {
                        case 0:
                            return this.emitMousePress(x,y,'left')

                        case 2:
                            return this.emitMousePress(x,y,'right')

                        case 4:
                            return this.emitMousePress(x,y,'left','shift')

                        case 8:
                            return this.emitMousePress(x,y,'left','alt')

                        case 16:
                            return this.emitMousePress(x,y,'left','ctrl')

                        case 24:
                            return this.emitMousePress(x,y,'left','ctrl+alt')

                        case 32:
                            return this.emit('mouse','drag',x,y,'left')

                        case 34:
                            return this.emit('mouse','drag',x,y,'right')

                        case 36:
                            return this.emit('mouse','drag',x,y,'left','shift')

                        case 40:
                            return this.emit('mouse','drag',x,y,'left','alt')

                        case 48:
                            return this.emit('mouse','drag',x,y,'left','ctrl')

                        case 35:
                            return this.emit('mouse','move',x,y,'')

                        case 39:
                            return this.emit('mouse','move',x,y,'','shift')

                        case 51:
                            return this.emit('mouse','move',x,y,'','ctrl')

                        case 43:
                            return this.emit('mouse','move',x,y,'','alt')

                        case 47:
                            return this.emit('mouse','move',x,y,'','shift+alt')

                        case 55:
                            return this.emit('mouse','move',x,y,'','shift+ctrl')

                        case 59:
                            return this.emit('mouse','move',x,y,'','ctrl+alt')

                        case 63:
                            return this.emit('mouse','move',x,y,'','shift+ctrl+alt')

                        case 64:
                            return this.emit('wheel','up')

                        case 68:
                            return this.emit('wheel','up','shift')

                        case 72:
                            return this.emit('wheel','up','alt')

                        case 76:
                            return this.emit('wheel','up','shift+alt')

                        case 84:
                            return this.emit('wheel','up','shift+ctrl')

                        case 88:
                            return this.emit('wheel','up','ctrl+alt')

                        case 92:
                            return this.emit('wheel','up','shift+ctrl+alt')

                        case 65:
                            return this.emit('wheel','down')

                        case 69:
                            return this.emit('wheel','down','shift')

                        case 73:
                            return this.emit('wheel','down','alt')

                        case 77:
                            return this.emit('wheel','down','shift+alt')

                        case 85:
                            return this.emit('wheel','down','shift+ctrl')

                        case 89:
                            return this.emit('wheel','down','ctrl+alt')

                        case 93:
                            return this.emit('wheel','down','shift+ctrl+alt')

                        case 66:
                            return this.emit('wheel','left')

                        case 70:
                            return this.emit('wheel','left','shift')

                        case 74:
                            return this.emit('wheel','left','alt')

                        case 78:
                            return this.emit('wheel','left','shift+alt')

                        case 86:
                            return this.emit('wheel','left','shift+ctrl')

                        case 90:
                            return this.emit('wheel','left','ctrl+alt')

                        case 94:
                            return this.emit('wheel','left','shift+ctrl+alt')

                        case 67:
                            return this.emit('wheel','right')

                        case 71:
                            return this.emit('wheel','right','shift')

                        case 75:
                            return this.emit('wheel','right','alt')

                        case 79:
                            return this.emit('wheel','right','shift+alt')

                        case 87:
                            return this.emit('wheel','right','shift+ctrl')

                        case 91:
                            return this.emit('wheel','right','ctrl+alt')

                        case 95:
                            return this.emit('wheel','right','shift+ctrl+alt')

                    }

                    console.log('mouse press?',seq)
                    return
                }
                else if (seq.endsWith('m'))
                {
                    switch (code)
                    {
                        case 0:
                            return this.emit('mouse','release',x,y,'left')

                        case 2:
                            return this.emit('mouse','release',x,y,'right')

                        case 4:
                            return this.emit('mouse','release',x,y,'left','shift')

                        case 8:
                            return this.emit('mouse','release',x,y,'left','alt')

                        case 16:
                            return this.emit('mouse','release',x,y,'left','ctrl')

                        case 24:
                            return this.emit('mouse','release',x,y,'left','ctrl+alt')

                    }

                    console.log('mouse release?',seq)
                    return
                }
            }
            else if (seq.startsWith('[27;9;') && seq.endsWith('~'))
            {
                code = parseInt(seq.split(';').slice(-1)[0])
                switch (code)
                {
                    case 90:
                        return this.emit('key','shift+cmd+z')

                }

                return this.emit('key',`cmd+${String.fromCodePoint(code)}`)
            }
            else if (seq.startsWith('[27;5;') && seq.endsWith('~'))
            {
                code = 32 + parseInt(seq.split(';').slice(-1)[0])
                return this.emit('key',`shift+ctrl+${String.fromCodePoint(code)}`)
            }
            else if (seq.startsWith('[27;') && seq.endsWith('~'))
            {
                code = parseInt(seq.split(';').slice(-1)[0])
                modc = parseInt(seq.split(';').slice(-2,-1)[0])
                mods = ((function ()
                {
                    switch (modc)
                    {
                        case 4:
                            return 'shift+alt'

                        case 6:
                            return 'shift+ctrl'

                        case 7:
                            return 'ctrl+alt'

                        case 8:
                            return 'shift+ctrl+alt'

                        case 10:
                            return 'shift+cmd'

                        case 11:
                            return 'alt+cmd'

                        case 12:
                            return 'shift+alt+cmd'

                        case 13:
                            return 'ctrl+cmd'

                        case 14:
                            return 'shift+ctrl+cmd'

                        default:
                            return 'alt'
                    }

                }).bind(this))()
                switch (code)
                {
                    case 127:
                        return this.emit('key',mods + '+delete')

                }

            }
            else if (seq.startsWith('['))
            {
                switch (seq[1])
                {
                    case 'O':
                        return this.emit('blur')

                    case 'I':
                        return this.emit('focus')

                    case 'A':
                        return this.emit('key','up')

                    case 'B':
                        return this.emit('key','down')

                    case 'D':
                        return this.emit('key','left')

                    case 'C':
                        return this.emit('key','right')

                }

                switch (seq.slice(0))
                {
                    case '[1;3A':
                        return this.emit('key','alt+up')

                    case '[1;3B':
                        return this.emit('key','alt+down')

                    case '[1;2A':
                        return this.emit('key','shift+up')

                    case '[1;2B':
                        return this.emit('key','shift+down')

                    case '[1;2C':
                        return this.emit('key','shift+right')

                    case '[1;2D':
                        return this.emit('key','shift+left')

                    case '[1;4A':
                        return this.emit('key','shift+alt+up')

                    case '[1;4B':
                        return this.emit('key','shift+alt+down')

                    case '[1;4C':
                        return this.emit('key','shift+alt+right')

                    case '[1;4D':
                        return this.emit('key','shift+alt+left')

                    case '[1;5A':
                        return this.emit('key','ctrl+up')

                    case '[1;5B':
                        return this.emit('key','ctrl+down')

                    case '[1;5C':
                        return this.emit('key','ctrl+right')

                    case '[1;5D':
                        return this.emit('key','ctrl+left')

                    case '[1;6A':
                        return this.emit('key','shift+ctrl+up')

                    case '[1;6B':
                        return this.emit('key','shift+ctrl+down')

                    case '[1;6C':
                        return this.emit('key','shift+ctrl+right')

                    case '[1;6D':
                        return this.emit('key','shift+ctrl+left')

                    case '[1;7A':
                        return this.emit('key','ctrl+alt+up')

                    case '[1;7B':
                        return this.emit('key','ctrl+alt+down')

                    case '[1;7C':
                        return this.emit('key','ctrl+alt+right')

                    case '[1;7D':
                        return this.emit('key','ctrl+alt+left')

                    case '[1;8A':
                        return this.emit('key','shift+ctrl+alt+up')

                    case '[1;8B':
                        return this.emit('key','shift+ctrl+alt+down')

                    case '[1;8C':
                        return this.emit('key','shift+ctrl+alt+right')

                    case '[1;8D':
                        return this.emit('key','shift+ctrl+alt+left')

                    case '[1;10C':
                        return this.emit('key','shift+cmd+right')

                    case '[1;10D':
                        return this.emit('key','shift+cmd+left')

                    case '[1;15A':
                        return this.emit('key','ctrl+alt+cmd+up')

                    case '[1;15B':
                        return this.emit('key','ctrl+alt+cmd+down')

                    case '[1;15C':
                        return this.emit('key','ctrl+alt+cmd+right')

                    case '[1;15D':
                        return this.emit('key','ctrl+alt+cmd+left')

                }

                console.log('DATA',data,seq,seq.slice(1))
                return
            }
            else if (data.length === 1)
            {
                return this.emit('key','esc')
            }
            else
            {
                if (data.length === 2)
                {
                    switch (data[1])
                    {
                        case 0x15:
                            return this.emit('key','cmd+delete')

                    }

                }
                switch (seq[0])
                {
                    case 'b':
                        return this.emit('key','alt+left')

                    case 'f':
                        return this.emit('key','alt+right')

                }

                console.log('seq?',seq,data)
            }
        }
        else
        {
            text = data.toString('utf8')
            if (text.length > 1)
            {
                lf('paste?',text.length,text)
                return this.emit('paste',text)
            }
            switch (data[0])
            {
                case 0x09:
                    return this.emit('key','\t')

                case 0x0d:
                    return this.emit('key','\n')

                case 0x20:
                    return this.emit('key',' ')

                case 0x7f:
                    return this.emit('key','delete')

            }

            key = (0x1 <= data[0] && data[0] <= 0x1a) ? `ctrl+${String.fromCodePoint(96 + data[0])}` : data.toString('utf8')
            key = ((function ()
            {
                switch (key)
                {
                    case 'å':
                        return 'alt+a'

                    case '∫':
                        return 'alt+b'

                    case 'ç':
                        return 'alt+c'

                    case '∂':
                        return 'alt+d'

                    case '´':
                        return 'alt+e'

                    case 'ƒ':
                        return 'alt+f'

                    case '©':
                        return 'alt+g'

                    case '˙':
                        return 'alt+h'

                    case 'ˆ':
                        return 'alt+i'

                    case '∆':
                        return 'alt+j'

                    case '˚':
                        return 'alt+k'

                    case '¬':
                        return 'alt+l'

                    case 'µ':
                        return 'alt+m'

                    case '˜':
                        return 'alt+n'

                    case 'ø':
                        return 'alt+o'

                    case 'π':
                        return 'alt+π'

                    case 'œ':
                        return 'alt+q'

                    case '®':
                        return 'alt+r'

                    case 'ß':
                        return 'alt+s'

                    case '†':
                        return 'alt+t'

                    case '¨':
                        return 'alt+u'

                    case '√':
                        return 'alt+v'

                    case '∑':
                        return 'alt+w'

                    case '≈':
                        return 'alt+x'

                    case '¥':
                        return 'alt+y'

                    case 'Ω':
                        return 'alt+z'

                    case 'Å':
                        return 'shift+alt+a'

                    case 'ı':
                        return 'shift+alt+b'

                    case 'Ç':
                        return 'shift+alt+c'

                    case 'Î':
                        return 'shift+alt+d'

                    case '´':
                        return 'shift+alt+e'

                    case 'Ï':
                        return 'shift+alt+f'

                    case '˝':
                        return 'shift+alt+g'

                    case 'Ó':
                        return 'shift+alt+h'

                    case 'ˆ':
                        return 'shift+alt+i'

                    case 'Ô':
                        return 'shift+alt+j'

                    case '':
                        return 'shift+alt+k'

                    case 'Ò':
                        return 'shift+alt+l'

                    case 'Â':
                        return 'shift+alt+m'

                    case '˜':
                        return 'shift+alt+n'

                    case 'Ø':
                        return 'shift+alt+o'

                    case '∏':
                        return 'shift+alt+p'

                    case 'Œ':
                        return 'shift+alt+q'

                    case '‰':
                        return 'shift+alt+r'

                    case 'Í':
                        return 'shift+alt+s'

                    case 'ˇ':
                        return 'shift+alt+t'

                    case '¨':
                        return 'shift+alt+u'

                    case '◊':
                        return 'shift+alt+v'

                    case '„':
                        return 'shift+alt+w'

                    case '˛':
                        return 'shift+alt+x'

                    case 'Á':
                        return 'shift+alt+y'

                    case '¸':
                        return 'shift+alt+z'

                    default:
                        return key
                }

            }).bind(this))()
            if (key)
            {
                return this.emit('key',key)
            }
            else
            {
                return lf('key?',key,data,data.length,data[0])
            }
        }
    }

    return TTIO
})()

export default TTIO;