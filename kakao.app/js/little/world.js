var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var world

import kxk from "../kxk.js"
let $ = kxk.$
let drag = kxk.drag
let stopEvent = kxk.stopEvent
let randInt = kxk.randInt
let randRange = kxk.randRange
let randIntRange = kxk.randIntRange
let elem = kxk.elem
let prefs = kxk.prefs
let post = kxk.post

import tweaky from "./tweaky.js"
import gee from "./gee.js"


world = (function ()
{
    function world ()
    {
        var s

        this["gridQuadRect"] = this["gridQuadRect"].bind(this)
        this["roundedQuadRect"] = this["roundedQuadRect"].bind(this)
        this["addTube"] = this["addTube"].bind(this)
        this["singleStep"] = this["singleStep"].bind(this)
        this["toggleValues"] = this["toggleValues"].bind(this)
        this["togglePause"] = this["togglePause"].bind(this)
        this["onContextMenu"] = this["onContextMenu"].bind(this)
        this["onDrag"] = this["onDrag"].bind(this)
        this["onDragStart"] = this["onDragStart"].bind(this)
        this["win2Grid"] = this["win2Grid"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this.main = $('main')
        this.pause = false
        this.g = new gee(this.main)
        window.addEventListener('wheel',this.onWheel)
        this.main.addEventListener('contextmenu',this.onContextMenu)
        s = 82 / 4096
        this.tubeUV = [[s * 1,s * 2,s * 2,s * 3],[s * 2,s * 0,s * 3,s * 1],[s * 2,s * 1,s * 3,s * 2],[s * 2,s * 2,s * 3,s * 3],[s * 0,s * 2,s * 1,s * 3],[s * 0,s * 0,s * 1,s * 1]]
        this.quadUV = [(4096 - 80) / 4096,(4096 - 80) / 4096,(4096 - 2) / 4096,(4096 - 2) / 4096]
        this.circleUV = [[s * 3.5,s * 0.5,s * 4.5,s * 1.5],[s * 4.5,s * 0.5,s * 5.5,s * 1.5],[s * 4.5,s * 1.5,s * 5.5,s * 2.5],[s * 3.5,s * 1.5,s * 4.5,s * 2.5]]
        this.drag = new drag({target:this.g.canvas,onStart:this.onDragStart,onMove:this.onDrag,cursor:'pointer'})
    }

    world.prototype["onWheel"] = function (event)
    {
        if (event.ctrlKey)
        {
            this.g.camScale -= event.deltaY / 1000
            this.g.camScale = _k_.clamp(0.01,0.2,this.g.camScale)
        }
        else
        {
            this.g.camPosX += event.deltaX / 4000
            this.g.camPosY -= event.deltaY / 4000
        }
        this.g.camPosX = _k_.clamp(-this.g.side * this.g.aspect / 2 * this.g.camScale,this.g.side * this.g.aspect / 2 * this.g.camScale,this.g.camPosX)
        this.g.camPosY = _k_.clamp(-this.g.side / 2 * this.g.camScale,this.g.side / 2 * this.g.camScale,this.g.camPosY)
        return this.g.updateCamera()
    }

    world.prototype["win2Grid"] = function (pos)
    {
        var x, y

        x = (((pos.x - this.g.br.left) / this.g.br.width - 0.5) * 2 + this.g.camPosX) / (this.g.camScale * this.g.aspect)
        y = (((pos.y - this.g.br.top) / this.g.br.height - 0.5) * -2 + this.g.camPosY) / this.g.camScale
        x = Math.round(x)
        y = Math.round(y)
        return [x,y]
    }

    world.prototype["onDragStart"] = function (drag, event)
    {
        this.dragPath = [this.win2Grid(drag.pos),this.win2Grid(drag.pos)]
        console.log(this.dragPath)
    }

    world.prototype["onDrag"] = function (drag, event)
    {
        var g, l, p

        l = this.dragPath.slice(-1)[0]
        p = this.dragPath.slice(-2,-1)[0]
        g = this.win2Grid(drag.pos)
        if ((l[0] === p[0] && p[0] === g[0]))
        {
            l[1] = g[1]
        }
        else if ((l[1] === p[1] && p[1] === g[1]))
        {
            l[0] = g[0]
        }
        else
        {
            this.dragPath.push(g)
        }
        console.log(this.dragPath)
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

    world.prototype["simulate"] = function ()
    {
        if (this.pause && !this.oneStep)
        {
            return
        }
        return delete this.oneStep
    }

    world.prototype["singleStep"] = function ()
    {
        this.oneStep = true
        this.pause = true
        return post.emit('pause')
    }

    world.prototype["addTube"] = function (x, y, idx)
    {
        var u

        u = this.tubeUV[idx]
        this.g.addQuad(x + 0.2,y - 0.2,1,1,[0,0,0,0.25],u,0,0)
        return this.g.addQuad(x,y,1,1,[1,1,0,1],u,0,1)
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
        var e, l, p, pi, s, x, y

        this.tickInfo = tickInfo
    
        this.roundedQuadRect(0,-0.5,8.5,8,[0,0,0,0.15])
        this.roundedQuadRect(-0.25,-0.25,8.25,8.25,[0.15,0.15,0.15,1])
        this.gridQuadRect(0,0,8,8,[0,0,0,0.5],0)
        this.addTube(0,3,0)
        this.addTube(1,3,3)
        this.addTube(1,4,2)
        this.addTube(1,5,5)
        this.addTube(2,5,0)
        this.addTube(3,5,1)
        this.addTube(3,4,2)
        this.addTube(3,3,3)
        this.addTube(2,3,5)
        this.addTube(2,2,4)
        this.addTube(3,2,0)
        if (this.dragPath)
        {
            for (var _a_ = pi = 1, _b_ = this.dragPath.length; (_a_ <= _b_ ? pi < this.dragPath.length : pi > this.dragPath.length); (_a_ <= _b_ ? ++pi : --pi))
            {
                p = this.dragPath[pi - 1]
                l = this.dragPath[pi]
                if (p[0] === l[0])
                {
                    var _c_ = [_k_.min(p[1],l[1]),_k_.max(p[1],l[1])]; s = _c_[0]; e = _c_[1]

                    if (s < e)
                    {
                        this.addTube(p[0],p[1],3)
                        for (var _d_ = y = s + 1, _e_ = e; (_d_ <= _e_ ? y < e : y > e); (_d_ <= _e_ ? ++y : --y))
                        {
                            this.addTube(p[0],y,2)
                        }
                    }
                }
                else
                {
                    var _f_ = [_k_.min(p[0],l[0]),_k_.max(p[0],l[0])]; s = _f_[0]; e = _f_[1]

                    if (s < e)
                    {
                        this.addTube(p[0],p[1],5)
                        for (var _10_ = x = s + 1, _11_ = e; (_10_ <= _11_ ? x < e : x > e); (_10_ <= _11_ ? ++x : --x))
                        {
                            this.addTube(x,p[1],0)
                        }
                    }
                }
            }
        }
        return this.g.draw(this.tickInfo.time)
    }

    return world
})()

export default world;