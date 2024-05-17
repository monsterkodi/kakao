var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var world

import kxk from "../kxk.js"
let $ = kxk.$
let randInt = kxk.randInt
let randIntRange = kxk.randIntRange
let elem = kxk.elem
let prefs = kxk.prefs
let post = kxk.post


world = (function ()
{
    function world ()
    {
        var main

        this["singleStep"] = this["singleStep"].bind(this)
        this["slower"] = this["slower"].bind(this)
        this["faster"] = this["faster"].bind(this)
        this["togglePause"] = this["togglePause"].bind(this)
        this["resize"] = this["resize"].bind(this)
        this["start"] = this["start"].bind(this)
        this.pause = false
        this.cellSize = prefs.get('cellSize',20)
        this.width = 230
        this.height = 130
        this.stepsPerFrame = 1
        this.canvas = elem('canvas',{class:'gridCanvas'})
        main = $('main')
        main.insertBefore(this.canvas,main.firstChild)
        this.container = $('scrollContainer')
        this.content = $('scrollContent')
        this.start()
        this.updateCellSize()
        post.on('resize',this.resize)
    }

    world.prototype["start"] = function ()
    {
        var a, e, fg, r, t, x, xd, y, yd

        this.count = {'':0,'':0,'✣':0,'':0,'':0}
        this.cells = {}
        for (var _46_17_ = x = 0, _46_20_ = this.width; (_46_17_ <= _46_20_ ? x <= this.width : x >= this.width); (_46_17_ <= _46_20_ ? ++x : --x))
        {
            for (var _47_21_ = y = 0, _47_24_ = this.height; (_47_21_ <= _47_24_ ? y <= this.height : y >= this.height); (_47_21_ <= _47_24_ ? ++y : --y))
            {
                r = randInt(1000)
                if (r < 3)
                {
                    t = ''
                    fg = "#ff0"
                    e = 500 + randInt(1200)
                    xd = randIntRange(-1,1)
                    yd = randIntRange(-1,1)
                    a = randInt(5000)
                }
                else if (r < 10)
                {
                    switch (randInt(4))
                    {
                        case 0:
                            xd = 1
                            yd = 0
                            break
                        case 1:
                            xd = -1
                            yd = 0
                            break
                        case 2:
                            xd = 0
                            yd = 1
                            break
                        case 3:
                            xd = 0
                            yd = -1
                            break
                    }

                    t = '✣'
                    fg = "#00f"
                    e = 500 + randInt(5200)
                    a = randInt(5000)
                }
                else
                {
                    continue
                }
                this.setCell(x,y,{fg:fg,t:t,xd:xd,yd:yd,e:e,a:a,o:0})
            }
        }
    }

    world.prototype["resize"] = function ()
    {
        var br, cr, lx, ly, ox, oy, sx, sy

        br = this.container.getBoundingClientRect()
        cr = this.content.getBoundingClientRect()
        sx = _k_.clamp(0,this.width,parseInt(this.container.scrollLeft / this.cellSize))
        sy = _k_.clamp(0,this.height,parseInt(this.container.scrollTop / this.cellSize))
        lx = _k_.clamp(0,this.width,parseInt(sx + br.width / this.cellSize))
        ly = _k_.clamp(0,this.height,parseInt(sy + br.height / this.cellSize))
        ox = _k_.max(0,cr.x - br.x)
        if (cr.height < br.height)
        {
            oy = (br.height - cr.height) / 2
        }
        else
        {
            oy = _k_.max(0,cr.y - br.y)
        }
        this.canvas.style.left = `${ox}px`
        this.canvas.style.top = `${oy}px`
        this.canvas.width = _k_.min(br.width,cr.width)
        return this.canvas.height = _k_.min(br.height,cr.height)
    }

    world.prototype["togglePause"] = function ()
    {
        this.pause = !this.pause
        return post.emit('pause')
    }

    world.prototype["zoom"] = function (delta)
    {
        this.cellSize += delta
        this.cellSize = _k_.clamp(3,60,this.cellSize)
        prefs.set('cellSize',this.cellSize)
        return this.updateCellSize()
    }

    world.prototype["updateCellSize"] = function ()
    {
        this.content.style.width = `${this.cellSize * this.width}px`
        this.content.style.height = `${this.cellSize * this.height}px`
        return this.resize()
    }

    world.prototype["newAt"] = function (x, y)
    {
        return (this.newCells[(x + this.width) % this.width] != null ? this.newCells[(x + this.width) % this.width][(y + this.height) % this.height] : undefined)
    }

    world.prototype["cellAt"] = function (x, y)
    {
        return (this.cells[(x + this.width) % this.width] != null ? this.cells[(x + this.width) % this.width][(y + this.height) % this.height] : undefined)
    }

    world.prototype["setCell"] = function (x, y, o)
    {
        var _96_48_

        this.cells[(x + this.width) % this.width] = ((_96_48_=this.cells[(x + this.width) % this.width]) != null ? _96_48_ : {})
        return this.cells[(x + this.width) % this.width][(y + this.height) % this.height] = o
    }

    world.prototype["newCell"] = function (x, y, o)
    {
        var _97_51_

        this.newCells[(x + this.width) % this.width] = ((_97_51_=this.newCells[(x + this.width) % this.width]) != null ? _97_51_ : {})
        return this.newCells[(x + this.width) % this.width][(y + this.height) % this.height] = o
    }

    world.prototype["simCell"] = function (x, y, cell)
    {
        var d, e, forward, neighbor, stems

        if (_k_.in(cell.t,''))
        {
            if (!this.newAt(x,y))
            {
                this.newCell(x,y,cell)
            }
            return
        }
        cell.e = cell.e - 1
        if (cell.e <= 0)
        {
            return
        }
        cell.a = cell.a + 1
        switch (cell.t)
        {
            case '':
                if (cell.a === 1000)
                {
                    cell.fg = '#f00'
                }
                else if (cell.a === 5000)
                {
                    cell.fg = '#ff0'
                }
                if (forward = this.cellAt(x + cell.xd,y + cell.yd))
                {
                    if (forward.t === '')
                    {
                        cell.e = cell.e + 50
                        cell.e = _k_.min(1000,cell.e)
                        this.newCell(x + cell.xd,y + cell.yd,cell)
                        return
                    }
                    if (forward.t === '')
                    {
                        cell.e = cell.e + 100
                        cell.e = _k_.min(1000,cell.e)
                        this.newCell(x + cell.xd,y + cell.yd,cell)
                        return
                    }
                    if (cell.a > 1000 && forward !== cell && forward.t === '' && forward.a > 1000)
                    {
                        var list = [[-1,0],[1,0],[0,-1],[0,1]]
                        for (var _138_30_ = 0; _138_30_ < list.length; _138_30_++)
                        {
                            d = list[_138_30_]
                            if (!this.newAt(x + d[0],y + d[1]))
                            {
                                cell.o += 1
                                e = parseInt(cell.e / 2)
                                cell.e = e
                                this.newCell(x,y,cell)
                                this.newCell(x + cell.xd,y + cell.yd,{t:'',fg:'#800',a:0,o:0,e:e,xd:randIntRange(-1,1),yd:randIntRange(-1,1)})
                            }
                            return
                        }
                    }
                }
                else if (randInt(10) < 6)
                {
                    if (!this.newAt(x + cell.xd,y + cell.yd))
                    {
                        this.newCell(x + cell.xd,y + cell.yd,cell)
                        return
                    }
                }
                if (randInt(5) <= 1)
                {
                    cell.xd = randIntRange(-1,1)
                    cell.yd = randIntRange(-1,1)
                }
                break
            case '✣':
                switch (cell.a)
                {
                    case 2500:
                        cell.fg = '#11f'
                        break
                    case 5000:
                        cell.fg = '#33f'
                        break
                    case 7500:
                        cell.fg = '#44f'
                        break
                    default:
                        if (cell.a > 10000)
                    {
                        this.newCell(x,y,{t:'',fg:'#a04',e:20000,a:0})
                        return
                    }
                }

                stems = 0
                var list1 = [[-1,0],[1,0],[0,-1],[0,1]]
                for (var _166_22_ = 0; _166_22_ < list1.length; _166_22_++)
                {
                    d = list1[_166_22_]
                    if (neighbor = this.cellAt(x + d[0],y + d[1]))
                    {
                        if (neighbor.t === '')
                        {
                            cell.e = cell.e + 1
                        }
                        else if (neighbor.t === '✣')
                        {
                            stems++
                        }
                    }
                }
                if (stems === 1)
                {
                    cell.e = cell.e + 1
                }
                if (randInt(10) < 4)
                {
                    if (!this.cellAt(x + cell.xd,y + cell.yd) && !this.newAt(x + cell.xd,y + cell.yd))
                    {
                        if (randInt(200) <= 1)
                        {
                            this.newCell(x + cell.xd,y + cell.yd,{t:'',fg:'#800',e:0})
                        }
                        else if (stems <= 1 && randInt(this.count['✣']) <= 4)
                        {
                            this.newCell(x + cell.xd,y + cell.yd,{t:'✣',fg:'#00f',e:50 + randInt(200),a:0})
                        }
                    }
                    else
                    {
                        switch (randInt(4))
                        {
                            case 0:
                                cell.xd = 1
                                cell.yd = 0
                                break
                            case 1:
                                cell.xd = -1
                                cell.yd = 0
                                break
                            case 2:
                                cell.xd = 0
                                cell.yd = 1
                                break
                            case 3:
                                cell.xd = 0
                                cell.yd = -1
                                break
                        }

                    }
                }
                break
        }

        if (!this.newAt(x,y))
        {
            return this.newCell(x,y,cell)
        }
    }

    world.prototype["simulate"] = function ()
    {
        var cell, x, y

        if (this.pause && !this.oneStep)
        {
            return
        }
        delete this.oneStep
        this.newCells = {}
        for (var _207_17_ = x = 0, _207_21_ = this.width; (_207_17_ <= _207_21_ ? x < this.width : x > this.width); (_207_17_ <= _207_21_ ? ++x : --x))
        {
            for (var _208_21_ = y = 0, _208_25_ = this.height; (_208_21_ <= _208_25_ ? y < this.height : y > this.height); (_208_21_ <= _208_25_ ? ++y : --y))
            {
                if (cell = this.cellAt(x,y))
                {
                    this.simCell(x,y,cell)
                }
            }
        }
        return this.cells = this.newCells
    }

    world.prototype["faster"] = function ()
    {
        this.stepsPerFrame *= 4
        return this.stepsPerFrame = _k_.min(64,this.stepsPerFrame)
    }

    world.prototype["slower"] = function ()
    {
        this.stepsPerFrame /= 4
        return this.stepsPerFrame = _k_.max(1,this.stepsPerFrame)
    }

    world.prototype["singleStep"] = function ()
    {
        this.oneStep = true
        this.pause = true
        return post.emit('pause')
    }

    world.prototype["tick"] = function (tickInfo)
    {
        var br, cell, ctx, cx, cy, i, lx, ly, sx, sy, t, x, y

        for (var _226_17_ = i = 0, _226_21_ = this.stepsPerFrame; (_226_17_ <= _226_21_ ? i < this.stepsPerFrame : i > this.stepsPerFrame); (_226_17_ <= _226_21_ ? ++i : --i))
        {
            this.simulate()
        }
        var list = _k_.list('✣')
        for (var _229_14_ = 0; _229_14_ < list.length; _229_14_++)
        {
            t = list[_229_14_]
            this.count[t] = 0
        }
        for (var _231_17_ = x = 0, _231_21_ = this.width; (_231_17_ <= _231_21_ ? x < this.width : x > this.width); (_231_17_ <= _231_21_ ? ++x : --x))
        {
            for (var _232_21_ = y = 0, _232_25_ = this.height; (_232_21_ <= _232_25_ ? y < this.height : y > this.height); (_232_21_ <= _232_25_ ? ++y : --y))
            {
                if (cell = this.cellAt(x,y))
                {
                    this.count[cell.t] += 1
                }
            }
        }
        if (this.count[''])
        {
            this.count[''] += this.stepsPerFrame
        }
        br = this.container.getBoundingClientRect()
        sx = _k_.clamp(0,this.width,parseInt(this.container.scrollLeft / this.cellSize))
        sy = _k_.clamp(0,this.height,parseInt(this.container.scrollTop / this.cellSize))
        lx = _k_.clamp(0,this.width,parseInt(sx + br.width / this.cellSize))
        ly = _k_.clamp(0,this.height,parseInt(sy + br.height / this.cellSize))
        this.canvas.width = this.canvas.width
        ctx = this.canvas.getContext('2d')
        ctx.font = `${this.cellSize}px fontMono`
        for (var _251_17_ = x = sx, _251_21_ = lx; (_251_17_ <= _251_21_ ? x <= lx : x >= lx); (_251_17_ <= _251_21_ ? ++x : --x))
        {
            for (var _252_21_ = y = sy, _252_25_ = ly; (_252_21_ <= _252_25_ ? y <= ly : y >= ly); (_252_21_ <= _252_25_ ? ++y : --y))
            {
                if (cell = this.cellAt(x,y))
                {
                    cx = (x - sx) * this.cellSize
                    cy = (y - sy) * this.cellSize
                    if (cell.t)
                    {
                        ctx.fillStyle = cell.fg
                        if (this.cellSize > 10)
                        {
                            ctx.fillText(cell.t,cx,cy)
                        }
                        else
                        {
                            ctx.fillRect(cx,cy,this.cellSize / 2,this.cellSize / 2)
                        }
                    }
                }
            }
        }
    }

    return world
})()

export default world;