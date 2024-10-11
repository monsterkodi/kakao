var Three

import kxk from "../kxk.js"
let deg2rad = kxk.deg2rad
let randInt = kxk.randInt
let randRange = kxk.randRange

import gridhelper from "./lib/gridhelper.js"

import noise from "./noise.js"
let perlin3 = noise.perlin3
let simplex3 = noise.simplex3

import * as three from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js'

Three = (function ()
{
    function Three (view)
    {
        this.view = view
    
        this["animate"] = this["animate"].bind(this)
        this["metaballs"] = this["metaballs"].bind(this)
        this["onMouseMove"] = this["onMouseMove"].bind(this)
        this["onWindowResize"] = this["onWindowResize"].bind(this)
        this["init"] = this["init"].bind(this)
        this.renderer = new three.WebGLRenderer()
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.view.clientWidth,this.view.clientHeight)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = three.PCFSoftShadowMap
        this.renderer.setClearColor(new three.Color(0.0005,0.0005,0.0005))
        this.view.appendChild(this.renderer.domElement)
        this.raycaster = new three.Raycaster()
        this.mouse = new three.Vector2(1,1)
        this.unitX = new three.Vector3(1,0,0)
        this.unitY = new three.Vector3(0,1,0)
        this.unitZ = new three.Vector3(0,0,1)
        this.vec = new three.Vector3
        this.quat = new three.Quaternion
        this.matrix = new three.Matrix4
        this.matrixTrans = new three.Matrix4
        this.matrixTrans.makeTranslation(0,0.01,0)
        this.color = new three.Color(0.01,0.01,0.01)
        this.colors = [new three.Color(0.2,0,0),new three.Color(0,0,2),new three.Color(5,0.4,0),new three.Color(0.5,0.5,10)]
        this.init()
    }

    Three.prototype["init"] = function ()
    {
        var amount, bloomPass, color, count, enableColors, enableUvs, geom, geometry, i, material, matrix, maxPolyCount, offset, outputPass, renderScene, size, x, y, z

        amount = 50
        count = amount * amount * 1
        this.camera = new three.PerspectiveCamera(40,this.view.clientWidth / this.view.clientHeight,0.1,1000)
        this.camera.position.set(0,2 * amount,2 * amount)
        this.camera.lookAt(0,amount / 2,0)
        this.scene = new three.Scene()
        this.lightIntensityAmbient = 1
        this.lightIntensityPlayer = 1
        this.lightIntensityShadow = 10
        this.lightAmbient = new three.AmbientLight(0xffffff,this.lightIntensityAmbient)
        this.scene.add(this.lightAmbient)
        this.lightPlayer = new three.PointLight(0xffffff,this.lightIntensityPlayer,0,0.5)
        this.lightPlayer.position.copy(this.camera.position)
        this.scene.add(this.lightPlayer)
        this.lightShadow = new three.DirectionalLight(0xffffff,this.lightIntensityShadow)
        this.lightShadow.castShadow = true
        this.lightShadow.position.set(-10,30,30)
        this.lightShadow.target.position.set(0,0,0)
        this.lightShadow.shadow.mapSize.width = 4096
        this.lightShadow.shadow.mapSize.height = 4096
        this.lightShadow.shadow.camera.near = 0.5
        this.lightShadow.shadow.camera.far = 50
        this.lightShadow.shadow.camera.left = -50
        this.lightShadow.shadow.camera.right = 50
        this.lightShadow.shadow.camera.top = 50
        this.lightShadow.shadow.camera.bottom = -50
        this.scene.add(this.lightShadow)
        this.lightShadowHelper = new three.DirectionalLightHelper(this.lightShadow,5,new three.Color(0xffff00))
        this.lightShadowHelper.visible = false
        this.scene.add(this.lightShadowHelper)
        this.shadowCameraHelper = new three.CameraHelper(this.lightShadow.shadow.camera)
        this.shadowCameraHelper.visible = false
        this.scene.add(this.shadowCameraHelper)
        this.axesHelper = new three.AxesHelper(10)
        this.axesHelper.position.set(0,0.1,0)
        this.axesHelper.visible = false
        this.axesHelper.material.depthWrite = false
        this.axesHelper.material.depthTest = false
        this.axesHelper.material.depthFunc = three.NeverDepth
        this.scene.add(this.axesHelper)
        this.gridHelper = new gridhelper()
        this.gridHelper.visible = false
        this.scene.add(this.gridHelper)
        geometry = new three.BoxGeometry(1,1,1)
        material = new three.MeshStandardMaterial({color:0xffffff,metalness:0.5,roughness:0.5,flatShading:true,dithering:true})
        this.mesh = new three.InstancedMesh(geometry,material,count)
        this.mesh.receiveShadow = true
        this.mesh.castShadow = true
        i = 0
        offset = (amount - 1) / 2
        matrix = new three.Matrix4()
        for (var _a_ = x = 0, _b_ = amount; (_a_ <= _b_ ? x < amount : x > amount); (_a_ <= _b_ ? ++x : --x))
        {
            for (y = 0; y < 1; y++)
            {
                for (var _c_ = z = 0, _d_ = amount; (_c_ <= _d_ ? z < amount : z > amount); (_c_ <= _d_ ? ++z : --z))
                {
                    matrix.setPosition(offset - x,1 + y,offset - z)
                    this.mesh.setMatrixAt(i,matrix)
                    this.mesh.setColorAt(i,this.color)
                    i++
                }
            }
        }
        geom = new three.PlaneGeometry(1500,1500)
        this.shadowFloor = new three.Mesh(geom,new three.ShadowMaterial({color:0x000000,opacity:0.2,depthWrite:false}))
        this.shadowFloor.rotateX(deg2rad(-90))
        this.shadowFloor.receiveShadow = true
        this.resolution = 100
        color = new three.Color(1,1,1)
        material = new three.MeshLambertMaterial({color:color,vertexColors:true,flatShading:true,dithering:true})
        enableUvs = false
        enableColors = true
        maxPolyCount = 500000
        this.mc = new MarchingCubes(this.resolution,material,enableUvs,enableColors,maxPolyCount)
        this.mc.position.set(0,10,0)
        this.mc.scale.set(50,50,50)
        this.mc.receiveShadow = true
        this.mc.castShadow = true
        this.scene.add(this.mc)
        this.metaballs()
        renderScene = new RenderPass(this.scene,this.camera)
        size = new three.Vector2(this.view.clientWidth,this.view.clientHeight)
        bloomPass = new UnrealBloomPass(size,0.3,0,1.01)
        outputPass = new OutputPass()
        if (true)
        {
            this.controls = new OrbitControls(this.camera,this.renderer.domElement)
            this.controls.maxPolarAngle = Math.PI * 0.5
            this.controls.minDistance = 13
            this.controls.maxDistance = 300
            this.controls.enableDamping = true
            this.controls.minPolarAngle = -Math.PI
            this.controls.maxPolarAngle = Math.PI
            this.controls.target.set(0,1,0)
        }
        this.composer = new EffectComposer(this.renderer)
        this.composer.setPixelRatio(window.devicePixelRatio)
        this.composer.setSize(this.view.clientWidth,this.view.clientHeight)
        this.composer.addPass(renderScene)
        this.composer.addPass(bloomPass)
        this.composer.addPass(outputPass)
        window.addEventListener('resize',this.onWindowResize)
        document.addEventListener('mousemove',this.onMouseMove)
        this.renderer.setAnimationLoop(this.animate)
        this.renderer.toneMapping = three.ReinhardToneMapping
        return this.renderer.toneMappingExposure = Math.pow(1,4.0)
    }

    Three.prototype["onWindowResize"] = function ()
    {
        this.camera.aspect = this.view.clientWidth / this.view.clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.view.clientWidth,this.view.clientHeight)
        return this.composer.setSize(this.view.clientWidth,this.view.clientHeight)
    }

    Three.prototype["onMouseMove"] = function (event)
    {
        event.preventDefault()
        this.mouse.x = (event.clientX / this.view.clientWidth) * 2 - 1
        this.mouse.y = -((event.clientY - 30) / this.view.clientHeight) * 2 + 1
        return this.mouse
    }

    Three.prototype["metaballs"] = function ()
    {
        var b, c, g, numblobs, r, rainbow, ss, strength, subtract, x, y, yn, z

        this.mc.reset()
        rainbow = [new three.Color(0xff0000),new three.Color(0xffbb00),new three.Color(0xffff00),new three.Color(0x00ff00),new three.Color(0x0000ff),new three.Color(0x9400bd),new three.Color(0xc800eb)]
        subtract = 12
        numblobs = 14
        strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1)
        for (var _a_ = x = 0, _b_ = this.resolution; (_a_ <= _b_ ? x < this.resolution : x > this.resolution); (_a_ <= _b_ ? ++x : --x))
        {
            for (var _c_ = y = 0, _d_ = this.resolution; (_c_ <= _d_ ? y < this.resolution : y > this.resolution); (_c_ <= _d_ ? ++y : --y))
            {
                for (var _e_ = z = 0, _f_ = this.resolution; (_e_ <= _f_ ? z < this.resolution : z > this.resolution); (_e_ <= _f_ ? ++z : --z))
                {
                    if (x > 1 && y > 1 && z > 1 && x < this.resolution - 2 && y < this.resolution - 2 && z < this.resolution - 2)
                    {
                        ss = 30
                        this.mc.setCell(x,y,z,100 * (Math.max(0,simplex3(x / ss,y / ss,z / ss) + 0.3)))
                    }
                    c = (function (v)
                    {
                        return 0.5 * Math.sin(8 * Math.PI * v / this.resolution) + 0.5
                    }).bind(this)
                    yn = y / this.resolution
                    b = yn * yn * yn * yn
                    ss = 180
                    r = 1 * Math.max(0,simplex3(x / ss,y / ss,z / ss) + 0.05)
                    r = r * r * r * r
                    g = r / 2
                    this.mc.setColor(x,y,z,r,g,Math.max(0,b - r))
                }
            }
        }
        return this.mc.update()
    }

    Three.prototype["animate"] = function ()
    {
        var d, instanceId, intersection, r, _297_17_

        this.raycaster.setFromCamera(this.mouse,this.camera)
        intersection = this.raycaster.intersectObject(this.mesh)
        if (intersection.length > 0)
        {
            instanceId = intersection[0].instanceId
            r = Math.random()
            this.mesh.setColorAt(instanceId,this.color.set(r * 0.5,r * 0.5,1 + r * 10))
            this.mesh.getMatrixAt(instanceId,this.matrix)
            this.matrix.multiply(this.matrixTrans)
            this.mesh.setMatrixAt(instanceId,this.matrix)
            this.mesh.instanceColor.needsUpdate = true
            this.mesh.instanceMatrix.needsUpdate = true
        }
        intersection = this.raycaster.intersectObject(this.shadowFloor)
        this.lightPlayer.position.copy(this.camera.position)
        this.lightShadow.position.copy(this.camera.position)
        this.quat.copy(this.camera.quaternion)
        this.vec.copy(this.unitX)
        this.vec.applyQuaternion(this.quat)
        this.vec.multiplyScalar(-20)
        this.lightShadow.position.add(this.vec)
        this.vec.copy(this.unitY)
        this.vec.applyQuaternion(this.quat)
        this.vec.multiplyScalar(10)
        this.lightShadow.position.add(this.vec)
        d = intersection.distance
        this.lightShadow.shadow.camera.far = 400
        ;(this.controls != null ? this.controls.update() : undefined)
        return this.composer.render()
    }

    return Three
})()

export default Three;