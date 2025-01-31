var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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
        this.write('\x1b[?1000h')
        this.write('\x1b[?1002h')
        this.write('\x1b[?1003h')
        this.write('\x1b[?1004h')
        this.write('\x1b[?1006h')
        this.write('\x1b[?1049h')
        this.write('\x1b[?2004h')
        this.write('\x1b[>1u')
        this.write('\x1b[=31;1u')
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
        this.write('\x1b[<u')
        this.showCursor()
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
        var diff, _75_19_

        this.lastClick = ((_75_19_=this.lastClick) != null ? _75_19_ : {row:row,col:col,count:0,time:process.hrtime()})
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

    TTIO.prototype["parseKittyEvent"] = function (csi)
    {
        var char, code, combo, key, mbit, mods, splt, type

        if (!(_k_.in(csi.slice(-1)[0],'uABCD')))
        {
            return
        }
        key = ((function ()
        {
            switch (csi.slice(-1)[0])
            {
                case 'A':
                    return 'up'

                case 'B':
                    return 'down'

                case 'D':
                    return 'left'

                case 'C':
                    return 'right'

            }

        }).bind(this))()
        char = ''
        if (csi.slice(-1)[0] === 'u')
        {
            code = parseInt(csi)
            key = ((function ()
            {
                switch (code)
                {
                    case 9:
                        return 'tab'

                    case 27:
                        return 'esc'

                    case 13:
                        return 'return'

                    case 127:
                        return 'delete'

                    case 57441:
                        return 'shift'

                    case 57442:
                        return 'ctrl'

                    case 57443:
                        return 'alt'

                    case 57444:
                        return 'cmd'

                    default:
                        return String.fromCodePoint(code)
                }

            }).bind(this))()
            char = ((function ()
            {
                switch (key)
                {
                    case 'tab':
                        return '\t'

                    case 'return':
                        return '\n'

                    default:
                        return ''
                }

            }).bind(this))()
        }
        mods = []
        type = 'press'
        splt = csi.slice(0, -1).split(';')
        if (splt.length > 1)
        {
            if (splt[1].endsWith(':2'))
            {
                type = 'repeat'
            }
            if (splt[1].endsWith(':3'))
            {
                type = 'release'
            }
            if (splt.length > 2)
            {
                char = String.fromCodePoint(parseInt(splt[2]))
            }
            mbit = parseInt(splt[1]) - 1
            if (mbit & 0x1)
            {
                mods.push('shift')
            }
            if (mbit & 0x4)
            {
                mods.push('ctrl')
            }
            if (mbit & 0x2)
            {
                mods.push('alt')
            }
            if (mbit & 0x8)
            {
                mods.push('cmd')
            }
        }
        if (!(_k_.in(key,mods)))
        {
            mods.push(key)
        }
        combo = mods.join('+')
        return {key:key,combo:combo,type:type,char:char}
    }

    TTIO.prototype["onData"] = function (data)
    {
        var code, col, csi, esc, event, row, text, x, y, _178_23_

        if (data[0] === 0x1b && data[1] === 0x5b)
        {
            csi = data.slice(2).toString('utf8')
        }
        else if (data[0] === 0x1b)
        {
            esc = data.slice(1).toString('utf8')
            lf('esc',esc)
        }
        else
        {
            lf('dta',data)
        }
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
        if (csi)
        {
            if (event = this.parseKittyEvent(csi))
            {
                if (event.type === 'release')
                {
                    return this.emit('release',event.combo,event)
                }
                else
                {
                    return this.emit('key',event.combo,event)
                }
            }
            if (csi.startsWith('200~'))
            {
                this.pasteBuffer = ''
                if (csi.endsWith('\x1b[201~'))
                {
                    this.onData(data.slice(6))
                }
                return
            }
            if (csi.startsWith('<'))
            {
                var _a_ = csi.slice(1, -1).split(';').map(function (s)
                {
                    return parseInt(s)
                }); code = _a_[0]; col = _a_[1]; row = _a_[2]

                x = col - 1
                y = row - 1
                if (csi.endsWith('M'))
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
                            return this.emit('wheel',x,y,'up')

                        case 68:
                            return this.emit('wheel',x,y,'up','shift')

                        case 72:
                            return this.emit('wheel',x,y,'up','alt')

                        case 76:
                            return this.emit('wheel',x,y,'up','shift+alt')

                        case 84:
                            return this.emit('wheel',x,y,'up','shift+ctrl')

                        case 88:
                            return this.emit('wheel',x,y,'up','ctrl+alt')

                        case 92:
                            return this.emit('wheel',x,y,'up','shift+ctrl+alt')

                        case 65:
                            return this.emit('wheel',x,y,'down')

                        case 69:
                            return this.emit('wheel',x,y,'down','shift')

                        case 73:
                            return this.emit('wheel',x,y,'down','alt')

                        case 77:
                            return this.emit('wheel',x,y,'down','shift+alt')

                        case 85:
                            return this.emit('wheel',x,y,'down','shift+ctrl')

                        case 89:
                            return this.emit('wheel',x,y,'down','ctrl+alt')

                        case 93:
                            return this.emit('wheel',x,y,'down','shift+ctrl+alt')

                        case 66:
                            return this.emit('wheel',x,y,'left')

                        case 70:
                            return this.emit('wheel',x,y,'left','shift')

                        case 74:
                            return this.emit('wheel',x,y,'left','alt')

                        case 78:
                            return this.emit('wheel',x,y,'left','shift+alt')

                        case 86:
                            return this.emit('wheel',x,y,'left','shift+ctrl')

                        case 90:
                            return this.emit('wheel',x,y,'left','ctrl+alt')

                        case 94:
                            return this.emit('wheel',x,y,'left','shift+ctrl+alt')

                        case 67:
                            return this.emit('wheel',x,y,'right')

                        case 71:
                            return this.emit('wheel',x,y,'right','shift')

                        case 75:
                            return this.emit('wheel',x,y,'right','alt')

                        case 79:
                            return this.emit('wheel',x,y,'right','shift+alt')

                        case 87:
                            return this.emit('wheel',x,y,'right','shift+ctrl')

                        case 91:
                            return this.emit('wheel',x,y,'right','ctrl+alt')

                        case 95:
                            return this.emit('wheel',x,y,'right','shift+ctrl+alt')

                    }

                    lfc('mouse press?',csi)
                    return
                }
                else if (csi.endsWith('m'))
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

                    lfc('mouse release?',csi)
                    return
                }
            }
        }
        else if (esc)
        {
            return lfc('esc',esc)
        }
        else
        {
            text = data.toString('utf8')
            if (text.length > 1)
            {
                lfc('paste?',data[0] === 0x1b,data.slice(1),text.length,text)
                return this.emit('paste',text)
            }
            return lfc('unhandled?',data,data.length,data[0],data.slice(1))
        }
    }

    return TTIO
})()

export default TTIO;