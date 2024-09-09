var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var gee

import kxk from "../kxk.js"
let randInt = kxk.randInt
let randRange = kxk.randRange
let elem = kxk.elem
let post = kxk.post

import geell from "./geell.js"


gee = (function ()
{
    _k_.extend(gee, geell)
    function gee (main)
    {
        this.main = main
    
        this["addQuad"] = this["addQuad"].bind(this)
        this["addCircle"] = this["addCircle"].bind(this)
        this["addRect"] = this["addRect"].bind(this)
        this["addRoundedFrame"] = this["addRoundedFrame"].bind(this)
        this["addTubeRect"] = this["addTubeRect"].bind(this)
        this["addTube"] = this["addTube"].bind(this)
        this["addPipe"] = this["addPipe"].bind(this)
        this["addNumber"] = this["addNumber"].bind(this)
        return gee.__super__.constructor.apply(this, arguments)
    }

    gee.prototype["addNumber"] = function (px, py, sz, number, color = [1,1,1,1], layer = 0)
    {
        var n, ni

        n = Math.ceil(Math.log10(number))
        for (var _a_ = ni = 0, _b_ = n; (_a_ <= _b_ ? ni <= n : ni >= n); (_a_ <= _b_ ? ++ni : --ni))
        {
            this.addQuad(px + ni * sz,py,1,1,color,this.numberUV[1],0,layer,sz)
        }
    }

    gee.prototype["addPipe"] = function (x1, y1, x2, y2, sz, color, layer = 0)
    {
        this.addCircle(x1,y1,sz,color,layer)
        this.addCircle(x2,y2,sz,color,layer)
        if (y1 === y2)
        {
            return this.addRect(x1,y1 - sz / 2,x2,y2 + sz / 2,color,layer)
        }
    }

    gee.prototype["addTube"] = function (px, py, ti, tt, color, layer = 0, scale = 1)
    {
        return this.addQuad(px,py,1,1,color,this.tubeUV[ti][tt],0,layer,scale)
    }

    gee.prototype["addTubeRect"] = function (x1, y1, x2, y2, ti, color, layer = 0)
    {
        var _a_ = [_k_.min(x1,x2),_k_.max(x1,x2)]; x1 = _a_[0]; x2 = _a_[1]

        var _b_ = [_k_.min(y1,y2),_k_.max(y1,y2)]; y1 = _b_[0]; y2 = _b_[1]

        this.addTube(x2,y2,ti,1,color,layer)
        this.addTube(x2,y1,ti,3,color,layer)
        this.addTube(x1,y1,ti,4,color,layer)
        this.addTube(x1,y2,ti,5,color,layer)
        this.addQuad((x1 + x2) / 2,y1,x2 - x1 - 1,1,color,this.tubeUV[ti][0],0,layer)
        this.addQuad((x1 + x2) / 2,y2,x2 - x1 - 1,1,color,this.tubeUV[ti][0],0,layer)
        this.addQuad(x1,(y1 + y2) / 2,1,y2 - y1 - 1,color,this.tubeUV[ti][2],0,layer)
        return this.addQuad(x2,(y1 + y2) / 2,1,y2 - y1 - 1,color,this.tubeUV[ti][2],0,layer)
    }

    gee.prototype["addRoundedFrame"] = function (x1, y1, x2, y2, color, layer = 0, radius = 1, ti = 4)
    {
        var scale

        scale = 1 / radius
        var _a_ = [_k_.min(x1,x2),_k_.max(x1,x2)]; x1 = _a_[0]; x2 = _a_[1]

        var _b_ = [_k_.min(y1,y2),_k_.max(y1,y2)]; y1 = _b_[0]; y2 = _b_[1]

        this.addTube(x2,y2,ti,1,color,layer,radius)
        this.addTube(x2,y1,ti,3,color,layer,radius)
        this.addTube(x1,y1,ti,4,color,layer,radius)
        this.addTube(x1,y2,ti,5,color,layer,radius)
        this.addQuad((x1 + x2) / 2,y1,(x2 - x1 - radius) * scale,1,color,this.tubeUV[ti][0],0,layer,radius)
        this.addQuad((x1 + x2) / 2,y2,(x2 - x1 - radius) * scale,1,color,this.tubeUV[ti][0],0,layer,radius)
        this.addQuad(x1,(y1 + y2) / 2,1,(y2 - y1 - radius) * scale,color,this.tubeUV[ti][2],0,layer,radius)
        return this.addQuad(x2,(y1 + y2) / 2,1,(y2 - y1 - radius) * scale,color,this.tubeUV[ti][2],0,layer,radius)
    }

    gee.prototype["addRect"] = function (x1, y1, x2, y2, color, layer = 0)
    {
        var cx, cy, sx, sy

        var _a_ = [_k_.min(x1,x2),_k_.max(x1,x2)]; x1 = _a_[0]; x2 = _a_[1]

        var _b_ = [_k_.min(y1,y2),_k_.max(y1,y2)]; y1 = _b_[0]; y2 = _b_[1]

        cx = (x1 + x2) / 2
        cy = (y1 + y2) / 2
        sx = x2 - x1
        sy = y2 - y1
        return this.addQuad(cx,cy,sx,sy,color,this.quadUV,0,layer)
    }

    gee.prototype["addCircle"] = function (px, py, sz, color, layer = 0)
    {
        return this.addQuad(px,py,sz,sz,color,this.circleUV,0,layer)
    }

    gee.prototype["addQuad"] = function (px, py, sx, sy, color, uv, rot = 0, layer = 0, scale = 1)
    {
        var p

        if (this.numQuads[layer] >= this.quadsPerLayer)
        {
            return
        }
        p = (this.layerStart[layer] + this.numQuads[layer]) * this.quadDataLength
        this.data[p++] = px
        this.data[p++] = py
        this.data[p++] = scale * sx
        this.data[p++] = scale * sy
        this.data[p++] = color[0]
        this.data[p++] = color[1]
        this.data[p++] = color[2]
        this.data[p++] = color[3]
        this.data[p++] = uv[0]
        this.data[p++] = uv[1]
        this.data[p++] = uv[2]
        this.data[p++] = uv[3]
        this.data[p++] = rot
        return this.numQuads[layer]++
    }

    return gee
})()

export default gee;