var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, noon: function (obj) { 
    var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; 
    var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; 
    var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = '|'+k+'|' } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; 
    var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; 
    return toStr(obj);
}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var TTIO

import kxk from "../../../kxk.js"
let events = kxk.events
let post = kxk.post
let kstr = kxk.kstr

import nfs from "../../../kxk/nfs.js"

import rounded from "../../util/img/rounded.js"


TTIO = (function ()
{
    _k_.extend(TTIO, events)
    function TTIO ()
    {
        this["onData"] = this["onData"].bind(this)
        this["parseData"] = this["parseData"].bind(this)
        this["emitMouseEvent"] = this["emitMouseEvent"].bind(this)
        this["parseMouse"] = this["parseMouse"].bind(this)
        this["setPointerStyle"] = this["setPointerStyle"].bind(this)
        this["onPointer"] = this["onPointer"].bind(this)
        this["keyEventForCombo"] = this["keyEventForCombo"].bind(this)
        this["keyEventForChar"] = this["keyEventForChar"].bind(this)
        this["parseRaw"] = this["parseRaw"].bind(this)
        this["parseEsc"] = this["parseEsc"].bind(this)
        this["parseCsi"] = this["parseCsi"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["restore"] = this["restore"].bind(this)
        this["store"] = this["store"].bind(this)
        this["showCursor"] = this["showCursor"].bind(this)
        this["hideCursor"] = this["hideCursor"].bind(this)
        this["requestCursor"] = this["requestCursor"].bind(this)
        this["setCursor"] = this["setCursor"].bind(this)
        this["rows"] = this["rows"].bind(this)
        this["cols"] = this["cols"].bind(this)
        this["clear"] = this["clear"].bind(this)
        this["quit"] = this["quit"].bind(this)
        this["write"] = this["write"].bind(this)
        this.store()
        this.hasFocus = true
        this.imgIds = 100
        this.lastplImgs = {}
        this.placedImgs = {}
        this.modifiers = ['cmd','ctrl','alt','shift']
        this.activeMods = {}
        this.hideCursor()
        if (process.stdin.isTTY)
        {
            process.stdin.setRawMode(true)
        }
        this.write('\x1b[?1000h')
        this.write('\x1b[?1002h')
        this.write('\x1b[?1003h')
        this.write('\x1b[?1004h')
        this.write('\x1b[?1006h')
        this.write('\x1b[?1016h')
        this.write('\x1b[?1049h')
        this.write('\x1b[?2004h')
        this.write('\x1b[>1s')
        this.write('\x1b[>1u')
        this.write('\x1b[=31;1u')
        process.stdout.on('resize',this.onResize)
        process.stdin.on('data',this.onData)
        post.on('pointer',this.onPointer)
        this.setTitle('kėd')
        global.ked_ttio = this
        setTimeout(this.onResize,10)
        return TTIO.__super__.constructor.apply(this, arguments)
    }

    TTIO.prototype["write"] = function (str)
    {
        return process.stdout.write(str)
    }

    TTIO.prototype["quit"] = function ()
    {
        process.stdout.removeListener('resize',this.onResize)
        process.stdin.removeListener('data',this.onData)
        this.clear()
        this.write('\x1b[>0s')
        this.write('\x1b[<u')
        this.write('\x1b[?1000l')
        this.write('\x1b[?1002l')
        this.write('\x1b[?1003l')
        this.write('\x1b[?1004l')
        this.write('\x1b[?1006l')
        this.write('\x1b[?1016l')
        this.write('\x1b[?1049l')
        this.write('\x1b[?2004l')
        this.write('\x1b[?1049l')
        this.showCursor()
        return this.restore()
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

    TTIO.prototype["setTitle"] = function (t)
    {
        return this.write(`\x1b]2;${t}\x1b\\`)
    }

    TTIO.prototype["placeLineImage"] = function (id, cx, y, py, ry = 1)
    {
        var cy, oy, pl, placement

        for (var _a_ = placement = 0, _b_ = ry; (_a_ <= _b_ ? placement < ry : placement > ry); (_a_ <= _b_ ? ++placement : --placement))
        {
            pl = py + placement
            cy = y + parseInt(pl / this.cellsz[1])
            oy = pl % this.cellsz[1]
            this.setCursor(cx,cy)
            this.write(`\x1b_Gq=1,a=p,i=${id},p=${placement + 1},X=0,Y=${oy},C=1\x1b\\`)
        }
    }

    TTIO.prototype["placeImageOverlay"] = function (id, x, y, py, pw, ph)
    {
        if (!this.overlayID)
        {
            this.overlayID = this.sendImg(rounded.rect(300,400,0,[255,255,255,2]),1)
        }
        this.setCursor(x,y)
        return this.write(`\x1b_Gq=1,a=p,i=${this.overlayID},p=${id},X=0,Y=${py},w=${pw},h=${ph},z=1000,C=1\x1b\\`)
    }

    TTIO.prototype["hideImageOverlay"] = function (id)
    {
        return this.write(`\x1b_Gq=1,a=d,d=i,i=${this.overlayID},p=${id}\x1b\\`)
    }

    TTIO.prototype["sendImg"] = function (img, id)
    {
        var base64

        if (_k_.empty(id))
        {
            this.imgIds += 1
            id = this.imgIds
        }
        base64 = img.png.toString('base64')
        this.write(`\x1b_Gq=1,i=${id},f=100;${base64}\x1b\\`)
        img.id = id
        return id
    }

    TTIO.prototype["placeImg"] = function (img, x, y, px, py, pw, ph, z)
    {
        var placed, _160_32_, _164_16_, _167_28_

        if (_k_.empty(img.id))
        {
            this.sendImg(img)
        }
        this.setCursor(x,y)
        px = (px != null ? px : 0)
        py = (py != null ? py : 0)
        pw = (pw != null ? pw : this.cellsz[0])
        ph = (ph != null ? ph : this.cellsz[1])
        if (placed = (this.lastplImgs[img.id] != null ? this.lastplImgs[img.id][[x,y,px,py,pw,ph]] : undefined))
        {
            this.placedImgs[img.id] = ((_160_32_=this.placedImgs[img.id]) != null ? _160_32_ : {})
            this.placedImgs[img.id][[x,y,px,py,pw,ph]] = placed
            return
        }
        img.pid = ((_164_16_=img.pid) != null ? _164_16_ : 0)
        img.pid++
        this.placedImgs[img.id] = ((_167_28_=this.placedImgs[img.id]) != null ? _167_28_ : {})
        this.placedImgs[img.id][[x,y,px,py,pw,ph].toString()] = img.pid
        z = (z != null ? z : 1000)
        return this.write(`\x1b_Gq=1,a=p,i=${img.id},p=${img.pid},X=${px},Y=${py},w=${pw},h=${ph},z=${z},C=1\x1b\\`)
    }

    TTIO.prototype["hideImg"] = function (id, pl)
    {
        return this.write(`\x1b_Gq=1,a=d,d=i,i=${id},p=${pl}\x1b\\`)
    }

    TTIO.prototype["removeImgs"] = function ()
    {
        var iid, plid, pos, posplids

        for (iid in this.lastplImgs)
        {
            posplids = this.lastplImgs[iid]
            for (pos in posplids)
            {
                plid = posplids[pos]
                if (_k_.empty((this.placedImgs[iid])) || _k_.empty((this.placedImgs[iid][pos])))
                {
                    this.hideImg(iid,plid)
                }
            }
        }
        this.lastplImgs = this.placedImgs
        return this.placedImgs = {}
    }

    TTIO.prototype["hideImage"] = function (id)
    {
        return this.write(`\x1b_Gq=1,a=d,d=i,i=${id}\x1b\\`)
    }

    TTIO.prototype["deleteImage"] = function (id)
    {
        return this.write(`\x1b_Gq=1,a=d,d=I,i=${id}\x1b\\`)
    }

    TTIO.prototype["deleteImagesInRange"] = function (start, end)
    {
        if (!(_k_.isNum(start)))
        {
            return console.log(`range start '${start}' not a number`)
        }
        if (!(_k_.isNum(end)))
        {
            return console.log(`range end '${end}' not a number`)
        }
        return this.write(`\x1b_Gq=2,a=d,d=R,x=${start},y=${end}\x1b\\`)
    }

    TTIO.prototype["sendImageData"] = function (data, id, w, h, bytesperpixel = 3)
    {
        var base64, chunk, chunks, i

        base64 = data.toString('base64')
        if (base64.length > 4096)
        {
            chunk = base64.slice(0, 4096)
            this.write(`\x1b_Gq=1,i=${id},p=${id},f=${8 * bytesperpixel},s=${w},v=${h},m=1;${chunk}\x1b\\`)
            chunks = Math.ceil(base64.length / 4096)
            for (var _a_ = i = 1, _b_ = chunks; (_a_ <= _b_ ? i < chunks : i > chunks); (_a_ <= _b_ ? ++i : --i))
            {
                chunk = base64.slice(i * 4096, typeof _k_.min((i + 1) * 4096,base64.length) === 'number' ? _k_.min((i + 1) * 4096,base64.length) : -1)
                this.write(`\x1b_Gq=1,m=${((i === chunks - 1) ? 0 : 1)};${chunk}\x1b\\`)
            }
        }
        else
        {
            return this.write(`\x1b_Gq=1,i=${id},p=${id},f=${8 * bytesperpixel},s=${w},v=${h};${base64}\x1b\\`)
        }
    }

    TTIO.prototype["setCursor"] = function (x, y)
    {
        return this.write(`\x1b[${y + 1};${x + 1}H`)
    }

    TTIO.prototype["requestCursor"] = function ()
    {
        return this.write("\x1b[6n")
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
        this.emit('preResize')
        return this.write('\x1b[14t')
    }

    TTIO.prototype["parseKitty"] = function (csi, data)
    {
        var char, code, combo, di, event, key, mbit, mods, splt, type

        if (!(_k_.in(csi.slice(-1)[0],'uABCDFH~')))
        {
            if (_k_.in(':3u',csi))
            {
                console.log('?????',data.length)
                for (var _a_ = di = 1, _b_ = data.length; (_a_ <= _b_ ? di < data.length : di > data.length); (_a_ <= _b_ ? ++di : --di))
                {
                    console.log(`${di} 0x${data[di].toString(16)} ${String.fromCodePoint(data[di])}`)
                }
            }
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

                case 'H':
                    return 'home'

                case 'F':
                    return 'end'

            }

        }).bind(this))()
        if (csi.slice(-1)[0] === '~')
        {
            key = ((function ()
            {
                switch (csi.slice(0, -1).split(';')[0])
                {
                    case '3':
                        return 'entf'

                    case '5':
                        return 'pageup'

                    case '6':
                        return 'pagedown'

                }

            }).bind(this))()
        }
        char = ''
        if (csi.slice(-1)[0] === 'u')
        {
            code = parseInt(csi)
            if (_k_.empty(code))
            {
                return
            }
            key = ((function ()
            {
                switch (code)
                {
                    case 9:
                        return 'tab'

                    case 27:
                        return 'esc'

                    case 32:
                        return 'space'

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

                    case 'space':
                        return ' '

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
                code = parseInt(splt[2])
                if (!_k_.empty(code))
                {
                    char = String.fromCodePoint(code)
                }
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
        event = {key:key,combo:combo,type:type,char:char}
        return event
    }

    TTIO.prototype["parseCsi"] = function (csi)
    {
        switch (csi)
        {
            case 'H':
                return this.keyEventForCombo('home')

            case 'F':
                return this.keyEventForCombo('end')

            case '3~':
                return this.keyEventForCombo('entf')

            case '5~':
                return this.keyEventForCombo('pageup')

            case '6~':
                return this.keyEventForCombo('pagedown')

            case 'Z':
                return this.keyEventForCombo('shift+z','Z')

            case 'I':
                this.hasFocus = true
                post.emit('window.focus')
                return {type:'focus'}

            case 'O':
                this.hasFocus = false
                post.emit('window.blur')
                return {type:'focus'}

        }

        console.log(`--------------------- unhandled csi? |${csi}|`)
        return null
    }

    TTIO.prototype["parseEsc"] = function (esc)
    {
        var code, event, key

        if (esc.length === 1)
        {
            code = esc.charCodeAt(0)
            if ((1 <= code && code <= 26))
            {
                key = String.fromCharCode(code + 96)
                return this.keyEventForCombo(`alt+cmd+${key}`)
            }
            if (esc === '\\')
            {
                return
            }
        }
        else
        {
            if (esc.startsWith('_G'))
            {
                return
            }
        }
        switch (esc)
        {
            case 'OP':
                return this.keyEventForCombo('f1')

            case 'OQ':
                return this.keyEventForCombo('f2')

            case 'OR':
                return this.keyEventForCombo('f3')

            case 'OS':
                return this.keyEventForCombo('f4')

            default:
                console.log('esc',esc.charCodeAt(0),esc.length)
        }

        if (event = this.keyEventForChar(esc))
        {
            return event
        }
        console.log('---- esc',esc)
        return null
    }

    TTIO.prototype["parseRaw"] = function (raw)
    {
        var char, event

        if (raw.length === 1)
        {
            switch (raw[0])
            {
                case 0x9:
                    return this.keyEventForCombo('tab')

                case 0xd:
                    return this.keyEventForCombo('return','\n')

                case 0x1b:
                    return this.keyEventForCombo('esc')

                case 0x7f:
                    return this.keyEventForCombo('delete')

            }

            if ((0x1 <= raw[0] && raw[0] <= 0x1a))
            {
                return this.keyEventForCombo(`ctrl+${String.fromCharCode(raw[0] + 96)}`)
            }
            char = raw.toString('utf8')
            if (event = this.keyEventForChar(char))
            {
                return event
            }
            if (raw[0] > 127)
            {
                raw[0] -= 128
                return parseEsc(raw.toString,'utf8')
            }
        }
    }

    TTIO.prototype["keyEventForChar"] = function (char)
    {
        var key

        if (char.length)
        {
            key = char.toLowerCase()
            return {key:key,type:'press',combo:(key !== char ? 'shift' : ''),char:char}
        }
    }

    TTIO.prototype["keyEventForCombo"] = function (combo, char = '')
    {
        return {key:combo.split('+').slice(-1)[0],type:'press',combo:combo,char:char}
    }

    TTIO.prototype["onPointer"] = function (style)
    {
        if (style !== this.pointerStyle)
        {
            this.pointerStyle = style
            return this.setPointerStyle(this.pointerStyle)
        }
    }

    TTIO.prototype["setPointerStyle"] = function (pointerStyle = 'pointer')
    {
        return this.write(`\x1b]22;${pointerStyle}\x1b\\`)
    }

    TTIO.prototype["parseMouse"] = function (csi)
    {
        var code, cx, cy, event, m, mods, px, py

        var _a_ = csi.slice(1, -1).split(';').map(function (s)
        {
            return parseInt(s)
        }); code = _a_[0]; px = _a_[1]; py = _a_[2]

        if (_k_.empty(this.cellsz))
        {
            return
        }
        cx = parseInt(px / this.cellsz[0])
        cy = parseInt(py / this.cellsz[1])
        event = {type:'release',cell:[cx,cy],pixel:[px,py]}
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
        var list = ['shift','ctrl','alt','cmd']
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            m = list[_b_]
            event[m] = (_k_.in(m,mods))
        }
        if (csi.endsWith('M'))
        {
            event.type = ((function ()
            {
                switch (code & 0b11100000)
                {
                    case 32:
                        return (((code & 0b11) === 3) ? 'move' : 'drag')

                    case 64:
                        return 'wheel'

                    case 0:
                        return 'press'

                }

            }).bind(this))()
        }
        else
        {
            event.type = ((function ()
            {
                switch (code)
                {
                    case 35:
                        return 'move'

                    default:
                        return 'release'
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
        var diff, _526_23_, _547_20_

        if (event.type === 'press')
        {
            this.lastClick = ((_526_23_=this.lastClick) != null ? _526_23_ : {x:event.cell[0],y:event.cell[1],count:0,time:process.hrtime()})
            if (this.lastClick.x === event.cell[0] && this.lastClick.y === event.cell[1])
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
                this.lastClick.x = event.cell[0]
                this.lastClick.y = event.cell[1]
                this.lastClick.count = 1
                this.lastClick.time = process.hrtime()
            }
            event.count = this.lastClick.count
        }
        this.lastPixels = ((_547_20_=this.lastPixels) != null ? _547_20_ : [])
        if (this.lastPixels.length >= 4)
        {
            event.delta = [event.pixel[0] - this.lastPixels[0][0],event.pixel[1] - this.lastPixels[0][1]]
        }
        this.lastPixels.push(event.pixel)
        if (this.lastPixels.length > 4)
        {
            this.lastPixels.shift()
        }
        event.cmd = this.activeMods.cmd
        return this.emit('mouse',event)
    }

    TTIO.prototype["parseData"] = function (data)
    {
        var e, raw, s, seq, seqs, type

        seqs = []
        s = 0
        while (s < data.length)
        {
            type = data[s] === 0x1b && data[s + 1] === 0x5b ? 'csi' : data[s] === 0x1b ? 'esc' : 'raw'
            e = s + 1
            while (e < data.length)
            {
                if (data[e] === 0x1b)
                {
                    break
                }
                e += 1
            }
            raw = data.slice(s, typeof e === 'number' ? e : -1)
            seq = {type:type,data:raw}
            switch (type)
            {
                case 'csi':
                    seq.csi = data.slice(s + 2, typeof e === 'number' ? e : -1).toString('utf8')
                    break
                case 'esc':
                    seq.esc = data.slice(s + 1, typeof e === 'number' ? e : -1).toString('utf8')
                    break
                case 'raw':
                    seq.raw = raw.toString('utf8')
                    break
            }

            s = e
            seqs.push(seq)
        }
        if (seq.length > 1)
        {
            console.log(`multiseq ${seq.length}`)
        }
        return seqs
    }

    TTIO.prototype["onData"] = function (data)
    {
        var csi, dataStr, esc, event, i, pxs, raw, seq, text, _603_23_

        if ((this.pasteBuffer != null))
        {
            dataStr = data.toString('utf8')
            if (dataStr.endsWith('\x1b[201~'))
            {
                this.pasteBuffer += data.slice(0, -6).toString('utf8')
                console.log('tty paste end',_k_.noon((this.pasteBuffer)))
                this.emit('paste',kstr.clean(this.pasteBuffer))
                delete this.pasteBuffer
            }
            else
            {
                this.pasteBuffer += dataStr
                console.log('tty paste cont',_k_.noon((this.pasteBuffer)))
            }
            return
        }
        var list = _k_.list(this.parseData(data))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            seq = list[_a_]
            data = seq.data
            csi = seq.csi
            esc = seq.esc
            raw = seq.raw
            if (csi)
            {
                if (csi.startsWith('4;') && csi.endsWith('t'))
                {
                    pxs = csi.slice(2, -1).split(';').map(function (p)
                    {
                        return parseInt(p)
                    })
                    this.pixels = [pxs[1],pxs[0]]
                    this.cellsz = [parseInt(this.pixels[0] / this.cols()),parseInt(this.pixels[1] / this.rows())]
                    this.emit('resize',this.cols(),this.rows(),this.pixels,this.cellsz)
                    continue
                }
                if (csi.startsWith('200~'))
                {
                    this.pasteBuffer = data.slice(6).toString('utf8')
                    console.log('tty paste start',_k_.noon((this.pasteBuffer)))
                    continue
                }
                if (csi.startsWith('201~'))
                {
                    console.log('tty paste end',_k_.noon((this.pasteBuffer)))
                    this.emit('paste',kstr.clean(this.pasteBuffer))
                    delete this.pasteBuffer
                    continue
                }
                if (csi.startsWith('<') && _k_.in(csi.slice(-1)[0],'Mm'))
                {
                    if (event = this.parseMouse(csi))
                    {
                        this.emitMouseEvent(event)
                        continue
                    }
                    console.log('unhandled mouse event?',csi)
                    continue
                }
                if (event = this.parseKitty(csi,data))
                {
                    if (event.type === 'release')
                    {
                        if (_k_.in(event.key,this.modifiers))
                        {
                            this.activeMods[event.key] = false
                        }
                        this.emit('release',event.combo,event)
                        continue
                    }
                    else
                    {
                        if (_k_.in(event.key,this.modifiers))
                        {
                            this.activeMods[event.key] = true
                        }
                        this.emit('key',event.combo,event)
                        continue
                    }
                }
                if (event = this.parseCsi(csi))
                {
                    if (_k_.in(event.type,['press','repeat']))
                    {
                        this.emit('key',event.combo,event)
                        continue
                    }
                    if (event.type === 'release')
                    {
                        console.log(`ignored csi key release ${_k_.noon(event)}`)
                        continue
                    }
                    if (event.type === 'focus')
                    {
                        continue
                    }
                }
                console.log(`-------------- unhandled csi ${csi}`)
            }
            else if (esc)
            {
                if (event = this.parseEsc(esc))
                {
                    if (_k_.in(event.type,['press','repeat']))
                    {
                        this.emit('key',event.combo,event)
                        continue
                    }
                }
                if (esc === '\\')
                {
                    continue
                }
                if (esc.startsWith('_G'))
                {
                    continue
                }
            }
            else
            {
                if (event = this.parseRaw(data))
                {
                    if (_k_.in(event.type,['press','repeat']))
                    {
                        this.emit('key',event.combo,event)
                        continue
                    }
                }
                text = data.toString('utf8')
                if (text.length > 1)
                {
                    console.log('paste?',text)
                    continue
                }
            }
            console.log("unhandled sequence:",seq)
            for (var _b_ = i = 0, _c_ = data.length; (_b_ <= _c_ ? i < data.length : i > data.length); (_b_ <= _c_ ? ++i : --i))
            {
                console.log(`${i} 0x${data[i].toString(16)} ▸${(data[i] === 0x1b ? 'esc' : String.fromCodePoint(data[i]))}◂`)
            }
            console.log(`${data.length} bytes ▪`)
        }
    }

    return TTIO
})()

export default TTIO;