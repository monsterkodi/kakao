var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var TTIO

import events from "../kxk/events.js"


TTIO = (function ()
{
    _k_.extend(TTIO, events)
    function TTIO ()
    {
        this["onData"] = this["onData"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["setCursor"] = this["setCursor"].bind(this)
        this["restore"] = this["restore"].bind(this)
        this["store"] = this["store"].bind(this)
        this["rows"] = this["rows"].bind(this)
        this["cols"] = this["cols"].bind(this)
        this["showCursor"] = this["showCursor"].bind(this)
        this["hideCursor"] = this["hideCursor"].bind(this)
        this["clear"] = this["clear"].bind(this)
        this["write"] = this["write"].bind(this)
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
        this.write('\x1b[>4;2m')
        this.write('\x1b[5 q')
        process.stdout.on('resize',this.onResize)
        process.stdin.on('data',this.onData)
        return TTIO.__super__.constructor.apply(this, arguments)
    }

    TTIO.prototype["write"] = function (str)
    {
        return process.stdout.write(str)
    }

    TTIO.prototype["clear"] = function ()
    {
        this.write('\x1b[2J')
        return this.write('\x1b[H')
    }

    TTIO.prototype["hideCursor"] = function ()
    {
        return this.write('\x1b[?25l')
    }

    TTIO.prototype["showCursor"] = function ()
    {
        return this.write('\x1b[?25h')
    }

    TTIO.prototype["cols"] = function ()
    {
        return process.stdout.columns
    }

    TTIO.prototype["rows"] = function ()
    {
        return process.stdout.rows
    }

    TTIO.prototype["store"] = function ()
    {
        return this.write('\x1b7')
    }

    TTIO.prototype["restore"] = function ()
    {
        return this.write('\x1b8')
    }

    TTIO.prototype["setCursor"] = function (x, y)
    {
        return this.write(`\x1b[${y + 1};${x + 1}H`)
    }

    TTIO.prototype["onResize"] = function ()
    {
        return this.emit('resize',this.cols(),this.rows())
    }

    TTIO.prototype["onData"] = function (data)
    {
        var code, col, key, row, seq

        if (data[0] === 0x1b)
        {
            seq = data.slice(1).toString('utf8')
            if (seq.startsWith('[<'))
            {
                var _a_ = seq.slice(2, -1).split(';').map(function (s)
                {
                    return parseInt(s)
                }); code = _a_[0]; col = _a_[1]; row = _a_[2]

                if (seq.endsWith('M'))
                {
                    switch (code)
                    {
                        case 0:
                            return this.emit('mouse','press',col,row,'left')

                        case 2:
                            return this.emit('mouse','press',col,row,'right')

                        case 32:
                            return this.emit('mouse','drag',col,row,'left')

                        case 34:
                            return this.emit('mouse','drag',col,row,'right')

                        case 35:
                        case 39:
                        case 43:
                        case 45:
                        case 47:
                        case 51:
                        case 59:
                        case 63:
                            return this.emit('mouse','move',col,row,'')

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
                            return this.emit('mouse','release',col,row,'left')

                        case 2:
                            return this.emit('mouse','release',col,row,'right')

                    }

                    console.log('mouse release?',seq)
                    return
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

                    case '[1;15A':
                        return this.emit('key','ctrl+alt+cmd+up')

                    case '[1;15B':
                        return this.emit('key','ctrl+alt+cmd+down')

                    case '[1;15C':
                        return this.emit('key','ctrl+alt+cmd+right')

                    case '[1;15D':
                        return this.emit('key','ctrl+alt+cmd+left')

                    case '[27;9;120~':
                        return this.emit('key','cmd+x')

                    case '[27;9;121~':
                        return this.emit('key','cmd+y')

                    case '[27;9;122~':
                        return this.emit('key','cmd+z')

                }

                console.log('DATA',data,seq,seq.slice(1))
                return
            }
            else if (data.length === 1)
            {
                return emit('key','esc')
            }
            else
            {
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
            switch (data[0])
            {
                case 0x01:
                    return this.emit('key','ctrl+a')

                case 0x03:
                    return this.emit('key','ctrl+c')

                case 0x05:
                    return this.emit('key','ctrl+e')

                case 0x11:
                    return this.emit('key','ctrl+q')

                case 0x08:
                    return this.emit('key','ctrl+h')

                case 0x0b:
                    return this.emit('key','ctrl+k')

                case 0x0d:
                    return this.emit('key','return')

                case 0x7f:
                    return this.emit('key','delete')

                case 0x20:
                    return this.emit('key','space')

                case 0x09:
                    return this.emit('key','tab')

            }

            key = data.toString('utf8')
            if (key && data[0] >= 0x21)
            {
                return this.emit('key',key)
            }
            else
            {
                console.log('key>',key,data,data.length,data[0])
            }
        }
    }

    return TTIO
})()

export default TTIO;