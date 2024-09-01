var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var TUBE_BL, TUBE_BR, TUBE_H, TUBE_TL, TUBE_TR, TUBE_V, world

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

TUBE_H = 0
TUBE_TR = 1
TUBE_V = 2
TUBE_BR = 3
TUBE_BL = 4
TUBE_TL = 5

world = (function ()
{
    function world ()
    {
        var s

        this["gridQuadRect"] = this["gridQuadRect"].bind(this)
        this["roundedQuadRect"] = this["roundedQuadRect"].bind(this)
        this["drawTube"] = this["drawTube"].bind(this)
        this["singleStep"] = this["singleStep"].bind(this)
        this["toggleValues"] = this["toggleValues"].bind(this)
        this["togglePause"] = this["togglePause"].bind(this)
        this["onContextMenu"] = this["onContextMenu"].bind(this)
        this["onDragStop"] = this["onDragStop"].bind(this)
        this["onDrag"] = this["onDrag"].bind(this)
        this["onDragStart"] = this["onDragStart"].bind(this)
        this["win2Grid"] = this["win2Grid"].bind(this)
        this["win2Pos"] = this["win2Pos"].bind(this)
        this["onMouseMove"] = this["onMouseMove"].bind(this)
        this["eventPos"] = this["eventPos"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this.main = $('main')
        this.pause = false
        this.ws = 20
        this.g = new gee(this.main)
        this.g.camScale = 0.1
        this.g.camPosX = 1 / this.g.camScale
        this.g.camPosY = 1 / this.g.camScale
        this.main.addEventListener('mousemove',this.onMouseMove)
        this.g.updateCamera()
        window.addEventListener('wheel',this.onWheel)
        this.main.addEventListener('contextmenu',this.onContextMenu)
        s = 82 / 4096
        this.tubeUV = [[s * 1,s * 2,s * 2,s * 3],[s * 2,s * 0,s * 3,s * 1],[s * 2,s * 1,s * 3,s * 2],[s * 2,s * 2,s * 3,s * 3],[s * 0,s * 2,s * 1,s * 3],[s * 0,s * 0,s * 1,s * 1]]
        this.quadUV = [(4096 - 80) / 4096,(4096 - 80) / 4096,(4096 - 2) / 4096,(4096 - 2) / 4096]
        this.circleUV = [[s * 3.5,s * 0.5,s * 4.5,s * 1.5],[s * 4.5,s * 0.5,s * 5.5,s * 1.5],[s * 4.5,s * 1.5,s * 5.5,s * 2.5],[s * 3.5,s * 1.5,s * 4.5,s * 2.5]]
        this.drag = new drag({target:this.g.canvas,onStart:this.onDragStart,onMove:this.onDrag,onStop:this.onDragStop,cursor:'pointer'})
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
            this.g.camPosX += event.deltaX / (10000 * this.g.camScale)
            this.g.camPosY -= event.deltaY / (10000 * this.g.camScale)
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

        x = _k_.clamp(0,this.ws,Math.round(x))
        y = _k_.clamp(0,this.ws,Math.round(y))
        return [x,y]
    }

    world.prototype["onDragStart"] = function (drag, event)
    {
        return this.dragPath = [this.win2Grid(drag.pos),this.win2Grid(drag.pos)]
    }

    world.prototype["onDrag"] = function (drag, event)
    {
        var g, l, p

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
        console.log('dragStop')
        return delete this.dragPath
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

    world.prototype["drawTube"] = function (x, y, idx)
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
        var e, l, n, p, pi, s, t, x, y

        this.tickInfo = tickInfo
    
        this.roundedQuadRect(0,-0.5,this.ws + 0.5,this.ws,[0,0,0,0.15])
        this.roundedQuadRect(-0.25,-0.25,this.ws + 0.25,this.ws + 0.25,[0.15,0.15,0.15,1])
        this.gridQuadRect(0,0,this.ws,this.ws,[0,0,0,0.5],0)
        if (this.dragPath)
        {
            this.drawTube(this.dragPath[0][0],this.dragPath[0][1],(this.dragPath[0][0] === this.dragPath[1][0] ? TUBE_V : TUBE_H))
            for (var _a_ = pi = 1, _b_ = this.dragPath.length; (_a_ <= _b_ ? pi < this.dragPath.length : pi > this.dragPath.length); (_a_ <= _b_ ? ++pi : --pi))
            {
                p = this.dragPath[pi - 1]
                l = this.dragPath[pi]
                if (p[0] === l[0])
                {
                    var _c_ = [_k_.min(p[1],l[1]),_k_.max(p[1],l[1])]; s = _c_[0]; e = _c_[1]

                    if (s < e)
                    {
                        t = TUBE_V
                        if (pi < this.dragPath.length - 1)
                        {
                            n = this.dragPath[pi + 1]
                            if (p[1] < l[1])
                            {
                                t = (n[0] > l[0] ? TUBE_TL : TUBE_TR)
                            }
                            else
                            {
                                t = (n[0] > l[0] ? TUBE_BL : TUBE_BR)
                            }
                        }
                        this.drawTube(l[0],l[1],t)
                        for (var _d_ = y = s + 1, _e_ = e; (_d_ <= _e_ ? y < e : y > e); (_d_ <= _e_ ? ++y : --y))
                        {
                            this.drawTube(p[0],y,TUBE_V)
                        }
                    }
                }
                else
                {
                    var _f_ = [_k_.min(p[0],l[0]),_k_.max(p[0],l[0])]; s = _f_[0]; e = _f_[1]

                    if (s < e)
                    {
                        t = TUBE_H
                        if (pi < this.dragPath.length - 1)
                        {
                            n = this.dragPath[pi + 1]
                            if (p[0] < l[0])
                            {
                                t = (n[1] > l[1] ? TUBE_BR : TUBE_TR)
                            }
                            else
                            {
                                t = (n[1] > l[1] ? TUBE_BL : TUBE_TL)
                            }
                        }
                        this.drawTube(l[0],l[1],t)
                        for (var _10_ = x = s + 1, _11_ = e; (_10_ <= _11_ ? x < e : x > e); (_10_ <= _11_ ? ++x : --x))
                        {
                            this.drawTube(x,p[1],TUBE_H)
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