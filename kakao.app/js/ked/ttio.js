var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var TTIO

import events from "../kxk/events.js"


TTIO = (function ()
{
    _k_.extend(TTIO, events)
    function TTIO ()
    {
        this["onData"] = this["onData"].bind(this)
        this["emitMouseEvent"] = this["emitMouseEvent"].bind(this)
        this["parseMouseEvent"] = this["parseMouseEvent"].bind(this)
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

    TTIO.prototype["parseMouseEvent"] = function (csi)
    {
        var code, col, event, mods, row, x, y

        var _a_ = csi.slice(1, -1).split(';').map(function (s)
        {
            return parseInt(s)
        }); code = _a_[0]; col = _a_[1]; row = _a_[2]

        x = col - 1
        y = row - 1
        event = {type:'release',x:x,y:y}
        mods = []
        if (code & 0b00100)
        {
            mods.push('shift')
        }
        if (code & 0b01000)
        {
            mods.push('alt')
        }
        if (code & 0b10000)
        {
            mods.push('ctrl')
        }
        if (!_k_.empty(mods))
        {
            event.mods = mods.join('+')
        }
        if (csi.endsWith('M'))
        {
            event.type = ((function ()
            {
                switch (code & 0b11100000)
                {
                    case 32:
                        return ((code & 0b11 === 3) ? 'move' : 'drag')

                    case 64:
                        return 'wheel'

                    case 0:
                        return 'press'

                }

            }).bind(this))()
        }
        if (event.type === 'wheel')
        {
            event.dir = ((function ()
            {
                switch (code & 0b11)
                {
                    case 0:
                        return 'up'

                    case 1:
                        return 'down'

                    case 2:
                        return 'left'

                    case 3:
                        return 'right'

                }

            }).bind(this))()
        }
        else if ((code & 0b11) !== 3)
        {
            event.button = ((function ()
            {
                switch (code & 0b11)
                {
                    case 0:
                        return 'left'

                    case 1:
                        return 'middle'

                    case 2:
                        return 'right'

                }

            }).bind(this))()
        }
        return event
    }

    TTIO.prototype["emitMouseEvent"] = function (event)
    {
        var diff, _193_23_

        if (event.type === 'press')
        {
            this.lastClick = ((_193_23_=this.lastClick) != null ? _193_23_ : {x:event.x,y:event.y,count:0,time:process.hrtime()})
            if (this.lastClick.y === event.x && this.lastClick.x === event.y)
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
                this.lastClick.y = event.x
                this.lastClick.x = event.y
                this.lastClick.count = 1
                this.lastClick.time = process.hrtime()
            }
            event.count = this.lastClick.count
        }
        return this.emit('mouse',event.type,event.x,event.y,event)
    }

    TTIO.prototype["onData"] = function (data)
    {
        var csi, esc, event, text, _234_23_

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
            if (csi.startsWith('<') && _k_.in(csi.slice(-1)[0],'Mm'))
            {
                if (event = this.parseMouseEvent(csi))
                {
                    return this.emitMouseEvent(event)
                }
                return lfc('unhandled?',csi)
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