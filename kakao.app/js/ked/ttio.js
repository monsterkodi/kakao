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
        this["write"] = this["write"].bind(this)
        if (process.stdin.isTTY)
        {
            process.stdin.setRawMode(true)
        }
        this.write('\x1b[?1000h')
        this.write('\x1b[?1001h')
        this.write('\x1b[?1003h')
        this.write('\x1b[?1004h')
        this.write('\x1b[?1006h')
        this.write('\x1b[>4;2m')
        process.stdout.on('resize',this.onResize)
        process.stdin.on('data',this.onData)
        return TTIO.__super__.constructor.apply(this, arguments)
    }

    TTIO.prototype["write"] = function (str)
    {
        return process.stdout.write(str)
    }

    TTIO.prototype["onResize"] = function ()
    {
        return this.emit('resize',process.stdout.columns,process.stdout.rows)
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
                            return this.emit('mouse','move',col,row,'')

                        case 64:
                            return this.emit('wheel','up')

                        case 65:
                            return this.emit('wheel','down')

                        case 66:
                            return this.emit('wheel','left')

                        case 67:
                            return this.emit('wheel','right')

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

                console.log('DATA',data,seq)
                return
            }
            else if (data.length === 1)
            {
                return emit('key','esc')
            }
            else
            {
                console.log('seq?',seq,data)
            }
        }
        else
        {
            switch (data[0])
            {
                case 0x01:
                    return this.write('\x1b[0G')

                case 0x05:
                    return this.write(`\x1b[${process.stdout.columns}G`)

                case 0x03:
                    return this.emit('key','ctrl+c')

                case 0x08:
                    return this.write('\x1b[H')

                case 0x0b:
                    return this.write('\x1b[0K')

                case 0x0d:
                    return this.write('\n')

                case 0x7f:
                    return this.write('\x1b[D\x1b[P')

                case 0x20:
                    return this.write(' ')

                case 0x09:
                    return this.write('\x1b[I')

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