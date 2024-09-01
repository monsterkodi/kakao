var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var COL_BG, COL_CRITTER, COL_EGG, COL_GRID, COL_SHADOW, COL_TUBE, threshMold, world

import kxk from "../kxk.js"
let $ = kxk.$
let drag = kxk.drag
let stopEvent = kxk.stopEvent
let prefs = kxk.prefs
let post = kxk.post
let fade = kxk.fade
let randInt = kxk.randInt

import gee from "./gee.js"
import tweaky from "./tweaky.js"
import tube from "./tube.js"

COL_SHADOW = [0,0,0,0.1]
COL_BG = [0.15,0.15,0.15,1]
COL_GRID = [0,0,0,0.5]
COL_TUBE = [0.5,0.5,0.5,1]
COL_EGG = [1,1,1,1]
COL_CRITTER = [1,0.5,0,1]

threshMold = function (p, n, m)
{
    var pi, pn

    pi = parseInt(p / m)
    pn = parseInt(n / m)
    return pi !== pn
}

world = (function ()
{
    function world ()
    {
        var s

        this["gridQuadRect"] = this["gridQuadRect"].bind(this)
        this["roundedQuadRect"] = this["roundedQuadRect"].bind(this)
        this["drawCritter"] = this["drawCritter"].bind(this)
        this["drawEgg"] = this["drawEgg"].bind(this)
        this["drawTube"] = this["drawTube"].bind(this)
        this["addTube"] = this["addTube"].bind(this)
        this["addCritter"] = this["addCritter"].bind(this)
        this["addEgg"] = this["addEgg"].bind(this)
        this["singleStep"] = this["singleStep"].bind(this)
        this["simulate"] = this["simulate"].bind(this)
        this["toggleValues"] = this["toggleValues"].bind(this)
        this["togglePause"] = this["togglePause"].bind(this)
        this["onContextMenu"] = this["onContextMenu"].bind(this)
        this["onDragStop"] = this["onDragStop"].bind(this)
        this["onDragMove"] = this["onDragMove"].bind(this)
        this["onDragStart"] = this["onDragStart"].bind(this)
        this["emptyNeighbor"] = this["emptyNeighbor"].bind(this)
        this["isEmpty"] = this["isEmpty"].bind(this)
        this["isInWorld"] = this["isInWorld"].bind(this)
        this["mouseInWorld"] = this["mouseInWorld"].bind(this)
        this["win2Grid"] = this["win2Grid"].bind(this)
        this["win2Pos"] = this["win2Pos"].bind(this)
        this["onMouseMove"] = this["onMouseMove"].bind(this)
        this["eventPos"] = this["eventPos"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this.main = $('main')
        this.pause = false
        this.ws = 10
        this.tubes = []
        this.eggs = []
        this.critters = []
        this.critterMaxAge = 127
        this.critterEggPeriod = 19
        this.eggMaxAge = 7
        this.addEgg(this.ws / 2,this.ws / 2)
        this.g = new gee(this.main)
        this.g.camScale = 0.08
        this.g.camPosX = 1 / this.g.camScale
        this.g.camPosY = 1 / this.g.camScale
        this.main.addEventListener('mousemove',this.onMouseMove)
        this.g.updateCamera()
        window.addEventListener('wheel',this.onWheel)
        this.main.addEventListener('contextmenu',this.onContextMenu)
        s = 82 / 4096
        this.tubeUV = [[s * 1,s * 2,s * 2,s * 3],[s * 2,s * 0,s * 3,s * 1],[s * 2,s * 1,s * 3,s * 2],[s * 2,s * 2,s * 3,s * 3],[s * 0,s * 2,s * 1,s * 3],[s * 0,s * 0,s * 1,s * 1]]
        this.quadUV = [(4096 - 80) / 4096,(4096 - 80) / 4096,(4096 - 2) / 4096,(4096 - 2) / 4096]
        this.eggUV = [s * 3.5,s * 0.5,s * 5.5,s * 2.5]
        this.critterUV = [(4096 - 80) / 4096,(4096 - 80) / 4096,(4096 - 2) / 4096,(4096 - 2) / 4096]
        this.circleUV = [[s * 3.5,s * 0.5,s * 4.5,s * 1.5],[s * 4.5,s * 0.5,s * 5.5,s * 1.5],[s * 4.5,s * 1.5,s * 5.5,s * 2.5],[s * 3.5,s * 1.5,s * 4.5,s * 2.5]]
        this.drag = new drag({target:this.g.canvas,onStart:this.onDragStart,onMove:this.onDragMove,onStop:this.onDragStop,cursor:'pointer'})
    }

    world.prototype["onWheel"] = function (event)
    {
        if (event.ctrlKey || event.metaKey)
        {
            this.g.camScale -= event.deltaY / ((event.metaKey ? 40000 : 4000))
            this.g.camScale = _k_.clamp(0.01,0.2,this.g.camScale)
        }
        else
        {
            this.g.camPosX += event.deltaX / (4000 * this.g.camScale)
            this.g.camPosY -= event.deltaY / (4000 * this.g.camScale)
        }
        this.g.camPosX = _k_.clamp(0,this.ws,this.g.camPosX)
        this.g.camPosY = _k_.clamp(0,this.ws,this.g.camPosY)
        return this.g.updateCamera()
    }

    world.prototype["eventPos"] = function (event)
    {
        return {x:event.clientX - this.g.br.left,y:event.clientY - this.g.br.top}
    }

    world.prototype["onMouseMove"] = function (event)
    {
        var winPos

        winPos = this.eventPos(event)
        return this.mouse = {grid:this.win2Grid(winPos),pos:this.win2Pos(winPos),win:winPos}
    }

    world.prototype["win2Pos"] = function (winPos)
    {
        var x, y

        x = (((winPos.x - this.g.br.left) / this.g.br.width - 0.5) * 2) / (this.g.camScale * this.g.aspect) + this.g.camPosX
        y = (((winPos.y - this.g.br.top) / this.g.br.height - 0.5) * -2) / this.g.camScale + this.g.camPosY
        return [x,y]
    }

    world.prototype["win2Grid"] = function (winPos)
    {
        var x, y

        var _a_ = this.win2Pos(winPos); x = _a_[0]; y = _a_[1]

        x = _k_.clamp(0,this.ws - 1,Math.round(x))
        y = _k_.clamp(0,this.ws - 1,Math.round(y))
        return [x,y]
    }

    world.prototype["mouseInWorld"] = function ()
    {
        return this.isInWorld(this.mouse.pos)
    }

    world.prototype["isInWorld"] = function (p)
    {
        return p[0] >= 0 && p[1] >= 0 && p[0] < this.ws && p[1] < this.ws
    }

    world.prototype["isEmpty"] = function (p)
    {
        var c, e

        var list = _k_.list(this.critters)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            if (c.x === p[0] && c.y === p[1])
            {
                return false
            }
        }
        var list1 = _k_.list(this.eggs)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            e = list1[_b_]
            if (c.x === p[0] && c.y === p[1])
            {
                return false
            }
        }
        return true
    }

    world.prototype["emptyNeighbor"] = function (c)
    {
        var x, y

        for (x = -1; x <= 1; x++)
        {
            for (y = -1; y <= 1; y++)
            {
                if ((x === y && y === 0))
                {
                    continue
                }
                c = [c.x + x,c.y + y]
                if (!this.isInWorld(c))
                {
                    continue
                }
                if (this.isEmpty(c))
                {
                    return {x:c[0],y:c[1]}
                }
            }
        }
        return null
    }

    world.prototype["onDragStart"] = function (drag, event)
    {
        if (!this.mouseInWorld())
        {
            return
        }
        console.log(this.mouse.pos)
        return this.dragPath = [this.win2Grid(drag.pos),this.win2Grid(drag.pos)]
    }

    world.prototype["onDragMove"] = function (drag, event)
    {
        var g, l, p

        if (!this.dragPath)
        {
            return
        }
        l = this.dragPath.slice(-1)[0]
        p = this.dragPath.slice(-2,-1)[0]
        g = this.win2Grid(drag.pos)
        if ((g[0] === l[0] && l[0] === p[0]) && (g[1] === l[1] && l[1] === p[1]) && this.dragPath.length > 2)
        {
            return this.dragPath.pop()
        }
        else if ((l[0] === p[0] && p[0] === g[0]))
        {
            return l[1] = g[1]
        }
        else if ((l[1] === p[1] && p[1] === g[1]))
        {
            return l[0] = g[0]
        }
        else
        {
            this.dragPath.push(g)
            if (l[0] !== g[0] && l[1] !== g[1])
            {
                if (l[0] === p[0])
                {
                    return l[1] = g[1]
                }
                else
                {
                    return l[0] = g[0]
                }
            }
        }
    }

    world.prototype["onDragStop"] = function (drag, event)
    {
        if (this.dragPath)
        {
            tube.path(this.dragPath,this.addTube)
            return delete this.dragPath
        }
    }

    world.prototype["onContextMenu"] = function (event)
    {
        return stopEvent(event)
    }

    world.prototype["togglePause"] = function ()
    {
        this.pause = !this.pause
        return post.emit('pause')
    }

    world.prototype["toggleValues"] = function ()
    {}

    world.prototype["simulate"] = function (tickInfo)
    {
        var c, e, moveTarget, n, sec

        if (this.pause && !this.oneStep)
        {
            return
        }
        delete this.oneStep
        sec = tickInfo.delta / 1000
        var list = _k_.list(this.eggs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            e = list[_a_]
            e.age += sec
            if (e.age > this.eggMaxAge)
            {
                this.eggs.splice(this.eggs.indexOf(e),1)
                this.addCritter(e.x,e.y)
            }
        }
        var list1 = _k_.list(this.critters)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            c = list1[_b_]
            c.age += sec
            if (c.age > this.critterMaxAge)
            {
                this.critters.splice(this.critters.indexOf(c),1)
                continue
            }
            if (threshMold(c.age - sec,c.age,this.critterEggPeriod))
            {
                if (n = this.emptyNeighbor(c))
                {
                    this.addEgg(n.x,n.y)
                }
                else
                {
                    console.log('no place for egg')
                }
            }
            moveTarget = [c.x + randInt(3) - 1,c.y + randInt(3) - 1]
            if (this.isInWorld(moveTarget) && this.isEmpty(moveTarget))
            {
                c.x = moveTarget[0]
                c.y = moveTarget[1]
            }
        }
    }

    world.prototype["singleStep"] = function ()
    {
        this.oneStep = true
        this.pause = true
        return post.emit('pause')
    }

    world.prototype["addEgg"] = function (x, y)
    {
        return this.eggs.push({x:x,y:y,age:0})
    }

    world.prototype["addCritter"] = function (x, y)
    {
        return this.critters.push({x:x,y:y,age:0})
    }

    world.prototype["addTube"] = function (x, y, idx)
    {
        return this.tubes.push([x,y,idx])
    }

    world.prototype["drawTube"] = function (x, y, idx)
    {
        this.g.addQuad(x + 0.2,y - 0.2,1,1,COL_SHADOW,this.tubeUV[idx],0,0)
        return this.g.addQuad(x,y,1,1,COL_TUBE,this.tubeUV[idx],0,1)
    }

    world.prototype["drawEgg"] = function (e)
    {
        var s

        s = fade(0.2,1,e.age / this.eggMaxAge)
        return this.g.addQuad(e.x,e.y,s,s,COL_EGG,this.eggUV,0,1)
    }

    world.prototype["drawCritter"] = function (c)
    {
        var s

        s = fade(0.2,1,c.age / this.critterMaxAge)
        return this.g.addQuad(c.x,c.y,s,s,COL_CRITTER,this.critterUV,0,1)
    }

    world.prototype["roundedQuadRect"] = function (x0, y0, x1, y1, color, layer = 0)
    {
        var _a_ = [_k_.min(x0,x1),_k_.max(x0,x1)]; x0 = _a_[0]; x1 = _a_[1]

        var _b_ = [_k_.min(y0,y1),_k_.max(y0,y1)]; y0 = _b_[0]; y1 = _b_[1]

        this.g.addQuad(x0,y0,1,1,color,this.circleUV[3],0,layer)
        this.g.addQuad(x1,y0,1,1,color,this.circleUV[2],0,layer)
        this.g.addQuad(x1,y1,1,1,color,this.circleUV[1],0,layer)
        this.g.addQuad(x0,y1,1,1,color,this.circleUV[0],0,layer)
        this.g.addQuad((x0 + x1) / 2,(y0 + y1) / 2,(x1 - x0) - 1,(y1 - y0) + 1,color,this.quadUV,0,layer)
        this.g.addQuad(x0,(y0 + y1) / 2,1,(y1 - y0) - 1,color,this.quadUV,0,layer)
        return this.g.addQuad(x1,(y0 + y1) / 2,1,(y1 - y0) - 1,color,this.quadUV,0,layer)
    }

    world.prototype["gridQuadRect"] = function (x0, y0, x1, y1, color, layer = 0, w = 0.02)
    {
        var sx, sy, x, y

        var _a_ = [_k_.min(x0,x1),_k_.max(x0,x1)]; x0 = _a_[0]; x1 = _a_[1]

        var _b_ = [_k_.min(y0,y1),_k_.max(y0,y1)]; y0 = _b_[0]; y1 = _b_[1]

        sx = x1 - x0
        sy = y1 - y0
        for (var _c_ = x = 0, _d_ = sx; (_c_ <= _d_ ? x <= sx : x >= sx); (_c_ <= _d_ ? ++x : --x))
        {
            this.g.addQuad(x,sx / 2,w,sx,[0,0,0,0.15],this.quadUV,0,layer)
        }
        for (var _e_ = y = 0, _f_ = sy; (_e_ <= _f_ ? y <= sy : y >= sy); (_e_ <= _f_ ? ++y : --y))
        {
            this.g.addQuad(sy / 2,y,sy,w,[0,0,0,0.15],this.quadUV,0,layer)
        }
    }

    world.prototype["tick"] = function (tickInfo)
    {
        var c, e, t

        this.tickInfo = tickInfo
    
        this.simulate(this.tickInfo)
        this.roundedQuadRect(0,-0.5,this.ws - 0.5,this.ws - 1,COL_SHADOW)
        this.roundedQuadRect(-0.25,-0.25,this.ws - 0.75,this.ws - 0.75,COL_BG)
        this.gridQuadRect(0,0,this.ws - 1,this.ws - 1,COL_GRID)
        if (this.dragPath)
        {
            tube.path(this.dragPath,this.drawTube)
        }
        var list = _k_.list(this.tubes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            t = list[_a_]
            this.drawTube(t[0],t[1],t[2])
        }
        var list1 = _k_.list(this.critters)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            c = list1[_b_]
            this.drawCritter(c)
        }
        var list2 = _k_.list(this.eggs)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            e = list2[_c_]
            this.drawEgg(e)
        }
        return this.g.draw(this.tickInfo.time)
    }

    return world
})()

export default world;