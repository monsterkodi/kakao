var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

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
        var layer

        this.main = main
    
        this["clearCanvas"] = this["clearCanvas"].bind(this)
        this["resize"] = this["resize"].bind(this)
        this["loaded"] = this["loaded"].bind(this)
        this["loadTiles"] = this["loadTiles"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["addQuad"] = this["addQuad"].bind(this)
        this.textureInfos = []
        this.canvas = elem('canvas',{class:'canvas'})
        this.main.appendChild(this.canvas)
        this.initGL()
        this.numLayers = 2
        this.quadsPerLayer = 100000
        this.layerStart = []
        this.numQuads = []
        for (var _a_ = layer = 0, _b_ = this.numLayers; (_a_ <= _b_ ? layer < this.numLayers : layer > this.numLayers); (_a_ <= _b_ ? ++layer : --layer))
        {
            this.layerStart.push(layer * this.quadsPerLayer)
            this.numQuads.push(0)
        }
        this.quadDataLength = 13
        this.maxQuads = this.quadsPerLayer * this.numLayers
        this.data = new Float32Array(this.maxQuads * this.quadDataLength)
        this.camPosX = 0
        this.camPosY = 0
        this.camScale = 0.2
        post.on('resize',this.resize)
        this.loadTiles()
    }

    gee.prototype["initGL"] = function ()
    {
        var fsSource, loadShader, r, vsSource

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
    vec2 pos = uCamScale * (rotated + aQuadPosition) - uCamPos * uCamScale;
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
                console.error('Shader compilation failed:',this.gl.getShaderInfoLog(shader))
                this.gl.deleteShader(shader)
                return null
            }
            return shader
        }).bind(this)
        this.shaderProgram = this.gl.createProgram()
        this.gl.attachShader(this.shaderProgram,loadShader(this.gl.VERTEX_SHADER,vsSource))
        this.gl.attachShader(this.shaderProgram,loadShader(this.gl.FRAGMENT_SHADER,fsSource))
        this.gl.linkProgram(this.shaderProgram)
        if (!this.gl.getProgramParameter(this.shaderProgram,this.gl.LINK_STATUS))
        {
            console.error('Shader linking failed:',this.gl.getProgramInfoLog(this.shaderProgram))
        }
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA,this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA)
        this.gl.enable(this.gl.BLEND)
        r = 0.5
        this.quad = new Float32Array([-r,-r,r,-r,r,r,-r,r])
        this.bufCamScale = new Float32Array(2)
        this.bufCamPos = new Float32Array(2)
        this.quadVertexLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadVertex')
        this.positionLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadPosition')
        this.scaleLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadScale')
        this.colorLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadColor')
        this.uvLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadUV')
        this.rotLoc = this.gl.getAttribLocation(this.shaderProgram,'aQuadRot')
        this.camScaleLoc = this.gl.getUniformLocation(this.shaderProgram,'uCamScale')
        this.camPosLoc = this.gl.getUniformLocation(this.shaderProgram,'uCamPos')
        this.quadBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.quadBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER,this.quad,this.gl.STATIC_DRAW)
        this.gl.vertexAttribPointer(this.quadVertexLoc,2,this.gl.FLOAT,false,0,0)
        this.gl.enableVertexAttribArray(this.quadVertexLoc)
        return this.dataBuffer = this.gl.createBuffer()
    }

    gee.prototype["addQuad"] = function (px, py, sx, sy, color, uv, rot = 0, layer = 0)
    {
        var p

        if (this.numQuads[layer] >= this.quadsPerLayer)
        {
            return
        }
        p = (this.layerStart[layer] + this.numQuads[layer]) * this.quadDataLength
        this.data[p++] = px
        this.data[p++] = py
        this.data[p++] = sx
        this.data[p++] = sy
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

    gee.prototype["draw"] = function (time)
    {
        var attrib, offset, stride

        this.gl.useProgram(this.shaderProgram)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.dataBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER,this.data,this.gl.DYNAMIC_DRAW)
        stride = this.quadDataLength * 4
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
        this.gl.uniform2fv(this.camScaleLoc,this.bufCamScale)
        this.gl.uniform2fv(this.camPosLoc,this.bufCamPos)
        this.clearCanvas()
        this.gl.drawArraysInstanced(this.gl.TRIANGLE_FAN,0,4,this.maxQuads)
        this.numQuads[0] = 0
        this.numQuads[1] = 0
        return this.data.fill(0,0,this.data.length)
    }

    gee.prototype["updateCamera"] = function ()
    {
        this.bufCamScale[0] = this.camScale * this.aspect
        this.bufCamScale[1] = this.camScale
        this.bufCamPos[0] = this.camPosX
        return this.bufCamPos[1] = this.camPosY
    }

    gee.prototype["loadTiles"] = function ()
    {
        var imageSources, promises

        imageSources = ['./tiles0000.png']
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
        if ((this.textureInfos[0] != null ? this.textureInfos[0].glTexture : undefined))
        {
            this.gl.activeTexture(this.gl.TEXTURE0)
            this.gl.bindTexture(this.gl.TEXTURE_2D,this.textureInfos[0].glTexture)
        }
        return this.resize()
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

    gee.prototype["resize"] = function ()
    {
        var devicePixelRatio, maxDim

        this.br = this.main.getBoundingClientRect()
        console.log(this.br.left,this.br.top)
        devicePixelRatio = window.devicePixelRatio || 1
        this.canvas.width = this.br.width * devicePixelRatio
        this.canvas.height = this.br.height * devicePixelRatio
        this.aspect = this.canvas.height / this.canvas.width
        maxDim = this.gl.getParameter(this.gl.MAX_VIEWPORT_DIMS)
        this.canvas.style.width = this.br.width + "px"
        this.canvas.style.height = this.br.height + "px"
        this.gl.viewport(0,0,_k_.min(this.canvas.width,maxDim),_k_.min(this.canvas.height,maxDim))
        return this.updateCamera()
    }

    gee.prototype["clearCanvas"] = function ()
    {
        this.gl.clearColor(0.1,0.1,0.1,1.0)
        return this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }

    return gee
})()

export default gee;