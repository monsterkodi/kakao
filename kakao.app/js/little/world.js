var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var COL_BG, COL_CRITTER, COL_EGG, COL_EGG_DOT, COL_GRID, COL_LEAF, COL_PLANT, COL_SHADOW, COL_STARVE, COL_TUBE, cos, PI, sin, TAU, threshMold, world

import kxk from "../kxk.js"
let $ = kxk.$
let drag = kxk.drag
let stopEvent = kxk.stopEvent
let prefs = kxk.prefs
let post = kxk.post
let fade = kxk.fade
let randRange = kxk.randRange
let randInt = kxk.randInt
let randIntRange = kxk.randIntRange

import gee from "./gee.js"
import tweaky from "./tweaky.js"
import tube from "./tube.js"
import matrix from "./matrix.js"

cos = Math.cos
sin = Math.sin
PI = Math.PI

TAU = 2 * PI
COL_SHADOW = [0,0,0,0.1]
COL_BG = [0.15,0.15,0.15,1]
COL_GRID = [0,0,0,0.5]
COL_TUBE = [0.5,0.5,0.5,1]
COL_PLANT = [0,0.5,0,1]
COL_LEAF = [0,0.5,0,1]
COL_EGG = [1,1,1,1]
COL_CRITTER = [0.5,0.5,1,1]
COL_STARVE = [0.25,0.25,0.25,1]
COL_EGG_DOT = [0,0,0,0.5]

threshMold = function (p, n, m)
{
    return parseInt(p / m) !== parseInt(n / m)
}

world = (function ()
{
    _k_.extend(world, matrix)
    function world ()
    {
        var s

        this["singleStep"] = this["singleStep"].bind(this)
        this["gridQuadRect"] = this["gridQuadRect"].bind(this)
        this["roundedQuadRect"] = this["roundedQuadRect"].bind(this)
        this["drawCritter"] = this["drawCritter"].bind(this)
        this["drawEgg"] = this["drawEgg"].bind(this)
        this["drawTube"] = this["drawTube"].bind(this)
        this["drawPlant"] = this["drawPlant"].bind(this)
        this["toggleValues"] = this["toggleValues"].bind(this)
        this["togglePause"] = this["togglePause"].bind(this)
        this["onContextMenu"] = this["onContextMenu"].bind(this)
        this["onDragStop"] = this["onDragStop"].bind(this)
        this["onDragMove"] = this["onDragMove"].bind(this)
        this["onDragStart"] = this["onDragStart"].bind(this)
        this["mouseInWorld"] = this["mouseInWorld"].bind(this)
        this["eventPos"] = this["eventPos"].bind(this)
        this["win2Grid"] = this["win2Grid"].bind(this)
        this["win2Pos"] = this["win2Pos"].bind(this)
        this["onMouseMove"] = this["onMouseMove"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this.main = $('main')
        this.pause = false
        this.speed = 100
        this.ws = 40
        world.__super__.constructor.call(this)
        this.main.focus()
        this.g = new gee(this.main)
        this.g.camScale = 0.08
        this.g.camPosX = 1 / this.g.camScale
        this.g.camPosY = 1 / this.g.camScale
        this.main.addEventListener('mousemove',this.onMouseMove)
        this.g.updateCamera()
        this.tweaky = new tweaky(this.main)
        this.tweaky.init({speed:{min:10,max:100,step:1,value:this.speed,cb:(function (speed)
        {
            this.speed = speed
        }).bind(this)},maxAge:{min:1000,max:4000,step:100,value:this.critterMaxAge,cb:(function (critterMaxAge)
        {
            this.critterMaxAge = critterMaxAge
        }).bind(this)},leaves:{min:4,max:12,step:1,value:this.numLeaves,cb:(function (numLeaves)
        {
            this.numLeaves = numLeaves
        }).bind(this)},leafMaxAge:{min:1,max:100,step:1,value:this.leafMaxAge,cb:(function (leafMaxAge)
        {
            this.leafMaxAge = leafMaxAge
        }).bind(this)},eatTime:{min:1,max:100,step:1,value:this.critterEatTime,cb:(function (critterEatTime)
        {
            this.critterEatTime = critterEatTime
        }).bind(this)},starveTime:{min:5,max:100,step:1,value:this.critterStarveTime,cb:(function (critterStarveTime)
        {
            this.critterStarveTime = critterStarveTime
        }).bind(this)},eggTime:{min:100,max:500,step:10,value:this.critterEggTime,cb:(function (critterEggTime)
        {
            this.critterEggTime = critterEggTime
        }).bind(this)}})
        window.addEventListener('wheel',this.onWheel)
        this.main.addEventListener('contextmenu',this.onContextMenu)
        s = 82 / 4096
        this.tubeUV = [[s * 1,s * 2,s * 2,s * 3],[s * 2,s * 0,s * 3,s * 1],[s * 2,s * 1,s * 3,s * 2],[s * 2,s * 2,s * 3,s * 3],[s * 0,s * 2,s * 1,s * 3],[s * 0,s * 0,s * 1,s * 1]]
        this.quadUV = [(4096 - 80) / 4096,(4096 - 80) / 4096,(4096 - 2) / 4096,(4096 - 2) / 4096]
        this.circleUV = [s * 3.5,s * 0.5,s * 5.5,s * 2.5]
        this.circleTopUV = [s * 3.5,s * 0.5,s * 5.5,s * 1.5]
        this.pieUV = [[s * 3.5,s * 0.5,s * 4.5,s * 1.5],[s * 4.5,s * 0.5,s * 5.5,s * 1.5],[s * 4.5,s * 1.5,s * 5.5,s * 2.5],[s * 3.5,s * 1.5,s * 4.5,s * 2.5]]
        this.critterUV = [(4096 - 80) / 4096,(4096 - 80) / 4096,(4096 - 2) / 4096,(4096 - 2) / 4096]
        this.eggUV = this.circleUV
        this.mouse = {pos:[0,0]}
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

    world.prototype["eventPos"] = function (event)
    {
        return {x:event.clientX - this.g.br.left,y:event.clientY - this.g.br.top}
    }

    world.prototype["mouseInWorld"] = function ()
    {
        return this.isInWorld(this.mouse.pos)
    }

    world.prototype["onDragStart"] = function (drag, event)
    {
        var p

        if (!this.mouseInWorld())
        {
            return
        }
        p = this.win2Grid(drag.pos)
        if (event.button === 2)
        {
            this.delAt(p)
            return
        }
        if (!event.metaKey)
        {
            if (this.buildingAtPos(p))
            {
                return
            }
            return this.addPlant(p[0],p[1])
        }
        else
        {
            return this.dragPath = [this.win2Grid(drag.pos),this.win2Grid(drag.pos)]
        }
    }

    world.prototype["onDragMove"] = function (drag, event)
    {
        var k, l, p

        p = this.win2Grid(drag.pos)
        if (event.button === 2)
        {
            this.delAt(p)
            return
        }
        if (!event.metaKey)
        {
            if (this.buildingAtPos(p))
            {
                return
            }
            this.addPlant(p[0],p[1])
        }
        if (!this.dragPath)
        {
            return
        }
        l = this.dragPath.slice(-1)[0]
        k = this.dragPath.slice(-2,-1)[0]
        if ((k[0] === l[0] && l[0] === p[0]) && (k[1] === l[1] && l[1] === p[1]) && this.dragPath.length > 2)
        {
            return this.dragPath.pop()
        }
        else if ((k[0] === l[0] && l[0] === p[0]))
        {
            return l[1] = p[1]
        }
        else if ((k[1] === l[1] && l[1] === p[1]))
        {
            return l[0] = p[0]
        }
        else
        {
            this.dragPath.push(p)
            if (l[0] !== k[0] && l[1] !== k[1])
            {
                if (l[0] === k[0])
                {
                    return l[1] = p[1]
                }
                else
                {
                    return l[0] = p[0]
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

    world.prototype["drawPlant"] = function (p)
    {
        var af, col, l, li, ls, r, s

        s = 0.25
        this.g.addQuad(p.x,p.y,s,s,COL_PLANT,this.circleUV,0,0)
        s = 0.15
        r = 0.2
        for (var _a_ = li = 0, _b_ = p.leaves.length; (_a_ <= _b_ ? li < p.leaves.length : li > p.leaves.length); (_a_ <= _b_ ? ++li : --li))
        {
            l = p.leaves[li]
            af = l.age / this.leafMaxAge
            ls = s * _k_.clamp(0,1,af)
            col = [(((af > 1) ? 1 : 0)),(((af > 1) ? 1 : COL_LEAF[1])),COL_LEAF[2],COL_LEAF[3]]
            this.g.addQuad(p.x + cos(-li * TAU / this.numLeaves + PI) * r,p.y + sin(-li * TAU / this.numLeaves + PI) * r,ls,ls,col,this.circleUV,0,1)
        }
    }

    world.prototype["drawTube"] = function (x, y, idx)
    {
        var t

        if (_k_.empty(y))
        {
            t = x
            x = t.x
            y = t.y
            idx = t.idx
        }
        this.g.addQuad(x + 0.2,y - 0.2,1,1,COL_SHADOW,this.tubeUV[idx],0,0)
        return this.g.addQuad(x,y,1,1,COL_TUBE,this.tubeUV[idx],0,1)
    }

    world.prototype["drawEgg"] = function (e)
    {
        var a, ageFac, s

        ageFac = e.age / this.eggMaxAge
        s = fade(0.02,0.3,ageFac)
        a = 1
        if (e.age > this.eggMaxAge)
        {
            a = fade(1.0,0.0,(e.age - this.eggMaxAge) / this.eggFadeTime)
        }
        return this.g.addQuad(e.x,e.y,s,s,[COL_EGG[0],COL_EGG[1],COL_EGG[2],a],this.eggUV,0,1)
    }

    world.prototype["drawCritter"] = function (c)
    {
        var col, cx, cy, e, h, se, sx, sy, thrd

        sx = sy = fade(0.2,1,c.age / this.critterMaxAge)
        col = COL_CRITTER
        if (c.df)
        {
            sx *= 1 - c.df
            sy *= 1 - c.df
            col = COL_STARVE
        }
        else if (c.eat < 0)
        {
            h = _k_.clamp(0,1,-c.eat / this.critterStarveTime)
            col = [fade(COL_CRITTER[0],COL_STARVE[0],h),fade(COL_CRITTER[1],COL_STARVE[1],h),fade(COL_CRITTER[2],COL_STARVE[2],h),1]
        }
        if (c.sf > 0)
        {
            cx = c.tx
            cy = c.ty
        }
        else
        {
            cx = c.x
            cy = c.y
        }
        this.g.addQuad(cx,cy + 0.25 * sy,sx,sy * (1 / 2),col,this.circleTopUV,0,1)
        this.g.addQuad(cx - (1 / 4) * sx,cy - 0.0 * sy,0.5 * sx,0.5 * sy,col,this.circleUV,0,1)
        this.g.addQuad(cx + (1 / 12) * sx,cy - 0.0 * sy,(1 / 6) * sx,(1 / 6) * sy,col,this.circleUV,0,1)
        this.g.addQuad(cx + (3 / 12) * sx,cy - 0.0 * sy,(1 / 6) * sx,(1 / 6) * sy,col,this.circleUV,0,1)
        this.g.addQuad(cx + (5 / 12) * sx,cy - 0.0 * sy,(1 / 6) * sx,(1 / 6) * sy,col,this.circleUV,0,1)
        thrd = 1 / 3
        se = 0.6
        for (var _a_ = e = 0, _b_ = c.eggs; (_a_ <= _b_ ? e < c.eggs : e > c.eggs); (_a_ <= _b_ ? ++e : --e))
        {
            this.g.addQuad(cx + [-thrd,0,thrd][e] * se * sx,cy + [0.15,0.25,0.15][e] * sx,[1,1.25,1][e] * thrd * sx * se,[1,1.25,1][e] * thrd * se * sy,COL_EGG_DOT,this.circleUV,0,1)
        }
    }

    world.prototype["roundedQuadRect"] = function (x0, y0, x1, y1, color, layer = 0)
    {
        var _a_ = [_k_.min(x0,x1),_k_.max(x0,x1)]; x0 = _a_[0]; x1 = _a_[1]

        var _b_ = [_k_.min(y0,y1),_k_.max(y0,y1)]; y0 = _b_[0]; y1 = _b_[1]

        this.g.addQuad(x0,y0,1,1,color,this.pieUV[3],0,layer)
        this.g.addQuad(x1,y0,1,1,color,this.pieUV[2],0,layer)
        this.g.addQuad(x1,y1,1,1,color,this.pieUV[1],0,layer)
        this.g.addQuad(x0,y1,1,1,color,this.pieUV[0],0,layer)
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
        var c, e, p, t

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
            this.drawTube(t)
        }
        var list1 = _k_.list(this.plants)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            p = list1[_b_]
            this.drawPlant(p)
        }
        var list2 = _k_.list(this.critters)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            c = list2[_c_]
            this.drawCritter(c)
        }
        var list3 = _k_.list(this.eggs)
        for (var _d_ = 0; _d_ < list3.length; _d_++)
        {
            e = list3[_d_]
            this.drawEgg(e)
        }
        this.g.draw(this.tickInfo.time)
        return delete this.oneStep
    }

    world.prototype["simulate"] = function (tickInfo)
    {
        var sec

        if (this.pause && !this.oneStep)
        {
            return
        }
        if (isNaN(tickInfo.delta))
        {
            return
        }
        sec = this.speed * tickInfo.delta / 1000
        return this.advance(sec)
    }

    world.prototype["singleStep"] = function ()
    {
        this.oneStep = true
        this.pause = true
        return post.emit('pause')
    }

    return world
})()

export default world;