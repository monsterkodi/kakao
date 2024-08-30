var world

import kxk from "../kxk.js"
let $ = kxk.$
let randInt = kxk.randInt
let randRange = kxk.randRange
let randIntRange = kxk.randIntRange
let elem = kxk.elem
let prefs = kxk.prefs
let post = kxk.post

import tweaky from "./tweaky.js"


world = (function ()
{
    function world ()
    {
        this["singleStep"] = this["singleStep"].bind(this)
        this["toggleValues"] = this["toggleValues"].bind(this)
        this["togglePause"] = this["togglePause"].bind(this)
        this["clearCanvas"] = this["clearCanvas"].bind(this)
        this["resize"] = this["resize"].bind(this)
        this["start"] = this["start"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["setNum"] = this["setNum"].bind(this)
        this["setSide"] = this["setSide"].bind(this)
        this.main = $('main')
        this.pause = false
        this.canvas = elem('canvas',{class:'canvas'})
        this.main.appendChild(this.canvas)
        this.initWebGL()
        this.resize()
        this.tweaky = new tweaky(this.main)
        this.setSide(100)
        this.camPosX = 0
        this.camPosY = 0
        this.camScale = 0.02
        this.tweaky.init({side:{min:1,max:100,step:1,value:this.side,cb:this.setSide},camPosX:{min:-10,max:10,step:0.001,value:this.camPosX,cb:(function (camPosX)
        {
            this.camPosX = camPosX
        
            return this.draw()
        }).bind(this)},camPosY:{min:-10,max:10,step:0.001,value:this.camPosY,cb:(function (camPosY)
        {
            this.camPosY = camPosY
        
            return this.draw()
        }).bind(this)},camScale:{min:0.02,max:1,step:0.00001,value:this.camScale,cb:(function (camScale)
        {
            this.camScale = camScale
        
            return this.draw()
        }).bind(this)}})
        post.on('resize',this.resize)
        this.start()
    }

    world.prototype["initWebGL"] = function ()
    {
        var fragmentShader, fsSource, loadShader, r, vertexShader, vsSource

        this.gl = this.canvas.getContext('webgl2')
        vsSource = `attribute vec2 aQuadVertex;
attribute vec2 aQuadScale;
attribute vec2 aQuadPosition;
attribute vec4 aQuadColor;
uniform vec2 uCamPos;
uniform vec2 uCamScale;
varying vec4 vColor;

void main(void) {
    vec2 pos = uCamScale * (aQuadVertex * aQuadScale + aQuadPosition) - uCamPos;
    gl_Position = vec4(pos.x, pos.y, 0, 1);
    vColor = aQuadColor;
}
`
        fsSource = `
precision mediump float;
varying vec4 vColor;

void main(void) {
    gl_FragColor = vColor;
}`
        loadShader = (function (type, source)
        {
            var shader

            shader = this.gl.createShader(type)
            this.gl.shaderSource(shader,source)
            this.gl.compileShader(shader)
            if (!this.gl.getShaderParameter(shader,this.gl.COMPILE_STATUS))
            {
                console.error('An error occurred compiling the shader:',this.gl.getShaderInfoLog(shader))
                this.gl.deleteShader(shader)
                return null
            }
            return shader
        }).bind(this)
        vertexShader = loadShader(this.gl.VERTEX_SHADER,vsSource)
        fragmentShader = loadShader(this.gl.FRAGMENT_SHADER,fsSource)
        this.shaderProgram = this.gl.createProgram()
        this.gl.attachShader(this.shaderProgram,vertexShader)
        this.gl.attachShader(this.shaderProgram,fragmentShader)
        this.gl.linkProgram(this.shaderProgram)
        if (!this.gl.getProgramParameter(this.shaderProgram,this.gl.LINK_STATUS))
        {
            console.error('Unable to initialize the shader program:',this.gl.getProgramInfoLog(this.shaderProgram))
        }
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA,this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA)
        this.gl.enable(this.gl.BLEND)
        r = 0.5
        this.quad = new Float32Array([-r,-r,r,-r,r,r,-r,r])
        this.quadBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.quadBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER,this.quad,this.gl.STATIC_DRAW)
        this.quadVertexLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadVertex')
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.quadBuffer)
        this.gl.vertexAttribPointer(this.quadVertexLoc,2,this.gl.FLOAT,false,0,0)
        this.gl.enableVertexAttribArray(this.quadVertexLoc)
        this.poscalBuffer = this.gl.createBuffer()
        this.colorBuffer = this.gl.createBuffer()
        this.positionLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadPosition')
        this.scaleLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadScale')
        return this.colorLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadColor')
    }

    world.prototype["setSide"] = function (side)
    {
        this.side = side
    
        return this.setNum(this.side * this.side)
    }

    world.prototype["setNum"] = function (num)
    {
        this.num = num
    
        this.poscal = new Float32Array(this.num * 4)
        return this.colors = new Float32Array(this.num * 4)
    }

    world.prototype["draw"] = function ()
    {
        var a, aspect, b, c, camPos, camScale, g, i, p, px, py, r, sq, sq2, sx, sy

        sq = Math.ceil(Math.sqrt(this.num))
        sq2 = sq / 2
        for (var _a_ = i = 0, _b_ = this.num; (_a_ <= _b_ ? i < this.num : i > this.num); (_a_ <= _b_ ? ++i : --i))
        {
            px = i % sq
            py = Math.floor(i / sq)
            sx = 1
            sy = 1
            p = i * 4
            this.poscal[p++] = px
            this.poscal[p++] = py
            this.poscal[p++] = (1.2 + Math.sin(this.tickInfo.time / 1000)) * 0.5
            this.poscal[p++] = (1.2 + Math.cos(this.tickInfo.time / 1000)) * 0.5
            r = i / sq / sq + randRange(-0.05,0.05)
            b = (i % sq) / sq + randRange(-0.05,0.05)
            g = (r + b) / 2 + randRange(-0.05,0.05)
            a = 1
            c = i * 4
            this.colors[c++] = r
            this.colors[c++] = g
            this.colors[c++] = b
            this.colors[c++] = a
        }
        this.gl.useProgram(this.shaderProgram)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.poscalBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER,this.poscal,this.gl.STATIC_DRAW)
        this.gl.vertexAttribPointer(this.positionLoc,2,this.gl.FLOAT,false,16,0)
        this.gl.vertexAttribDivisor(this.positionLoc,1)
        this.gl.vertexAttribPointer(this.scaleLoc,2,this.gl.FLOAT,false,16,8)
        this.gl.vertexAttribDivisor(this.scaleLoc,1)
        this.gl.enableVertexAttribArray(this.positionLoc)
        this.gl.enableVertexAttribArray(this.scaleLoc)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.colorBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER,this.colors,this.gl.STATIC_DRAW)
        this.gl.vertexAttribPointer(this.colorLoc,4,this.gl.FLOAT,false,0,0)
        this.gl.vertexAttribDivisor(this.colorLoc,1)
        this.gl.enableVertexAttribArray(this.colorLoc)
        aspect = this.canvas.height / this.canvas.width
        sx = this.camScale * aspect
        sy = this.camScale
        camScale = new Float32Array([sx,sy])
        this.gl.uniform2fv(this.gl.getUniformLocation(this.shaderProgram,'uCamScale'),camScale)
        camPos = new Float32Array([(sq2 - 0.5) * this.camScale * aspect + this.camPosX,(sq2 - 0.5) * this.camScale + this.camPosY])
        this.gl.uniform2fv(this.gl.getUniformLocation(this.shaderProgram,'uCamPos'),camPos)
        this.clearCanvas()
        return this.gl.drawArraysInstanced(this.gl.TRIANGLE_FAN,0,4,this.num)
    }

    world.prototype["start"] = function ()
    {}

    world.prototype["resize"] = function ()
    {
        var br

        br = this.main.getBoundingClientRect()
        this.canvas.width = br.width
        this.canvas.height = br.height
        return this.gl.viewport(0,0,this.canvas.width,this.canvas.height)
    }

    world.prototype["clearCanvas"] = function ()
    {
        this.gl.clearColor(0.1,0.1,0.1,1.0)
        return this.gl.clear(this.gl.COLOR_BUFFER_BIT)
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

    world.prototype["tick"] = function (tickInfo)
    {
        this.tickInfo = tickInfo
    
        return this.draw()
    }

    return world
})()

export default world;