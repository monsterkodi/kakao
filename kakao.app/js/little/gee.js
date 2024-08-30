var gee

import kxk from "../kxk.js"
let randInt = kxk.randInt
let randRange = kxk.randRange
let elem = kxk.elem
let post = kxk.post


gee = (function ()
{
    function gee (main)
    {
        this.main = main
    
        this["clearCanvas"] = this["clearCanvas"].bind(this)
        this["resize"] = this["resize"].bind(this)
        this["loaded"] = this["loaded"].bind(this)
        this["start"] = this["start"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["setNum"] = this["setNum"].bind(this)
        this["setSide"] = this["setSide"].bind(this)
        this.textureInfos = []
        this.canvas = elem('canvas',{class:'canvas'})
        this.main.appendChild(this.canvas)
        this.initWebGL()
        this.resize()
        this.setSide(10)
        this.camPosX = 0
        this.camPosY = 0
        this.camScale = 0.2
        post.on('resize',this.resize)
        this.start()
    }

    gee.prototype["initWebGL"] = function ()
    {
        var fragmentShader, fsSource, loadShader, r, vertexShader, vsSource

        this.gl = this.canvas.getContext('webgl2')
        vsSource = `#version 300 es
precision mediump float;
in vec2  aQuadVertex;
in vec2  aQuadPosition;
in vec2  aQuadScale;
in vec4  aQuadColor;
in vec4  aQuadUV;
in float aQuadRot;
uniform vec2 uCamPos;
uniform vec2 uCamScale;
out vec4 vColor;
out vec2 vUV;

void main(void) {
    vec2 vertex = aQuadVertex * aQuadScale;
    vec2 rotated = vertex*cos(aQuadRot)-vec2(-vertex.y,vertex.x)*sin(aQuadRot);
    vec2 pos = uCamScale * (rotated + aQuadPosition) - uCamPos;
    gl_Position = vec4(pos.x, pos.y, 0, 1);
    vColor = aQuadColor;
    vUV = mix(aQuadUV.xw,aQuadUV.zy,aQuadVertex+vec2(0.5, 0.5));
}
`
        fsSource = `#version 300 es
precision mediump float;
in vec4 vColor;
in vec2 vUV;
uniform sampler2D uSampler;
out vec4 fragColor;

void main(void) {
    //fragColor = vColor;
    fragColor = texture(uSampler,vUV)*vColor;
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
        this.dataBuffer = this.gl.createBuffer()
        this.positionLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadPosition')
        this.scaleLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadScale')
        this.colorLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadColor')
        this.uvLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadUV')
        return this.rotLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadRot')
    }

    gee.prototype["setSide"] = function (side)
    {
        this.side = side
    
        return this.setNum(this.side * this.side)
    }

    gee.prototype["setNum"] = function (num)
    {
        this.num = num
    
        return this.data = new Float32Array(this.num * 13)
    }

    gee.prototype["draw"] = function (time)
    {
        var a, attrib, b, camPos, camScale, cv, g, i, offset, p, px, py, r, sq, sq2, stride, sx, sy, u0, u1, v0, v1

        sq = Math.ceil(Math.sqrt(this.num))
        sq2 = sq / 2
        for (var _a_ = i = 0, _b_ = this.num; (_a_ <= _b_ ? i < this.num : i > this.num); (_a_ <= _b_ ? ++i : --i))
        {
            px = i % sq
            py = Math.floor(i / sq)
            sx = 1
            sy = 1
            p = i * 13
            this.data[p++] = px
            this.data[p++] = py
            this.data[p++] = sx
            this.data[p++] = sy
            cv = 0.05
            r = 1
            b = 1
            g = 1
            a = (1 + Math.cos(Math.min(px,py) * time / 30000)) / 2
            this.data[p++] = r
            this.data[p++] = g
            this.data[p++] = b
            this.data[p++] = a
            u0 = 0
            v0 = 0
            u1 = 196 / 4096
            v1 = 196 / 4096
            this.data[p++] = u0
            this.data[p++] = v0
            this.data[p++] = u1
            this.data[p++] = v1
            this.data[p++] = (px - py) * time / 10000
        }
        this.gl.useProgram(this.shaderProgram)
        if ((this.textureInfos[0] != null ? this.textureInfos[0].glTexture : undefined))
        {
            this.gl.activeTexture(this.gl.TEXTURE0)
            this.gl.bindTexture(this.gl.TEXTURE_2D,this.textureInfos[0].glTexture)
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.dataBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER,this.data,this.gl.STATIC_DRAW)
        stride = 13 * 4
        offset = 0
        attrib = (function (loc, cnt)
        {
            this.gl.vertexAttribPointer(loc,cnt,this.gl.FLOAT,false,stride,offset)
            this.gl.vertexAttribDivisor(loc,1)
            this.gl.enableVertexAttribArray(loc)
            return offset += 4 * cnt
        }).bind(this)
        attrib(this.positionLoc,2)
        attrib(this.scaleLoc,2)
        attrib(this.colorLoc,4)
        attrib(this.uvLoc,4)
        attrib(this.rotLoc,1)
        sx = this.camScale * this.aspect
        sy = this.camScale
        camScale = new Float32Array([sx,sy])
        this.gl.uniform2fv(this.gl.getUniformLocation(this.shaderProgram,'uCamScale'),camScale)
        camPos = new Float32Array([(sq2 - 0.5) * this.camScale * this.aspect + this.camPosX,(sq2 - 0.5) * this.camScale + this.camPosY])
        this.gl.uniform2fv(this.gl.getUniformLocation(this.shaderProgram,'uCamPos'),camPos)
        this.clearCanvas()
        return this.gl.drawArraysInstanced(this.gl.TRIANGLE_FAN,0,4,this.num)
    }

    gee.prototype["createTexture"] = function (image)
    {
        var texture

        if (!image)
        {
            return
        }
        texture = this.gl.createTexture()
        this.gl.bindTexture(this.gl.TEXTURE_2D,texture)
        this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,image)
        this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR)
        this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR)
        return texture
    }

    gee.prototype["start"] = function ()
    {
        var imageSources, promises

        imageSources = ['./tiles.png']
        promises = imageSources.map((function (src, textureIndex)
        {
            return new Promise((function (resolve)
            {
                var image

                image = new Image
                image.onerror = image.onload = (function ()
                {
                    this.textureInfos[textureIndex] = {image:image,size:[image.width,image.height],width:image.width,height:image.height,glTexture:this.createTexture(image)}
                    return resolve()
                }).bind(this)
                return image.src = src
            }).bind(this))
        }).bind(this))
        return Promise.all(promises).then(this.loaded)
    }

    gee.prototype["loaded"] = function ()
    {
        console.log('loaded',this.textureInfos)
    }

    gee.prototype["resize"] = function ()
    {
        var br

        br = this.main.getBoundingClientRect()
        this.canvas.width = br.width
        this.canvas.height = br.height
        this.aspect = this.canvas.height / this.canvas.width
        return this.gl.viewport(0,0,this.canvas.width,this.canvas.height)
    }

    gee.prototype["clearCanvas"] = function ()
    {
        this.gl.clearColor(0.1,0.1,0.1,1.0)
        return this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }

    return gee
})()

export default gee;