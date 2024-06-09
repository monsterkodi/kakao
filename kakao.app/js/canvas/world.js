var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
import valgrid from "./valgrid.js"


world = (function ()
{
    function world ()
    {
        this["singleStep"] = this["singleStep"].bind(this)
        this["slower"] = this["slower"].bind(this)
        this["faster"] = this["faster"].bind(this)
        this["togglePause"] = this["togglePause"].bind(this)
        this["resize"] = this["resize"].bind(this)
        this["start"] = this["start"].bind(this)
        this.pause = false
        this.types = 12
        this.stepsPerFrame = 1
        this.num = 1200
        this.forceFactor = 2
        this.frictionFactor = 0.4
        this.maxVelocity = 1
        this.minRadius = 0.025
        this.maxRadius = 0.075
        this.canvas = elem('canvas',{class:'canvas'})
        this.main = $('main')
        this.main.appendChild(this.canvas)
        this.tweaky = new tweaky(this.main)
        this.valgrid = new valgrid(this.main)
        this.valgrrd = new valgrid(this.main)
        this.tweaky.init({types:{min:2,max:32,step:1,value:this.types,cb:(function (types)
        {
            this.types = types
        
            return this.start()
        }).bind(this)},friction:{min:0,max:0.9,step:0.05,value:this.frictionFactor,cb:(function (frictionFactor)
        {
            this.frictionFactor = frictionFactor
        }).bind(this)},maxVelocity:{min:0,max:1,steps:100,value:this.maxVelocity,cb:(function (maxVelocity)
        {
            this.maxVelocity = maxVelocity
        }).bind(this)},minRadius:{min:0,max:1,steps:100,value:this.minRadius,cb:(function (minRadius)
        {
            this.minRadius = minRadius
        
            return this.start()
        }).bind(this)},maxRadius:{min:0,max:1,steps:100,value:this.maxRadius,cb:(function (maxRadius)
        {
            this.maxRadius = maxRadius
        
            return this.start()
        }).bind(this)}})
        post.on('resize',this.resize)
        this.resize()
        this.start()
    }

    world.prototype["start"] = function ()
    {
        var i

        this.matrix = this.randomMatrix(this.types)
        this.radii = this.randomRadii(this.types)
        this.colors = new Int32Array(this.num)
        this.ages = new Float32Array(this.num)
        this.positionsX = new Float32Array(this.num)
        this.positionsY = new Float32Array(this.num)
        this.velocitiesX = new Float32Array(this.num)
        this.velocitiesY = new Float32Array(this.num)
        this.hsl = []
        for (var _a_ = i = 0, _b_ = this.num; (_a_ <= _b_ ? i < this.num : i > this.num); (_a_ <= _b_ ? ++i : --i))
        {
            this.colors[i] = randInt(this.types)
            this.positionsX[i] = Math.random()
            this.positionsY[i] = Math.random()
            this.velocitiesX[i] = 0
            this.velocitiesY[i] = 0
            this.ages[i] = 0
            this.hsl[i] = `hsl(${360 * this.colors[i] / this.types},100%,50%)`
        }
        this.valgrid.init(this.matrix)
        return this.valgrrd.init(this.radii,{min:this.minRadius,max:this.maxRadius,colors:this.hsl})
    }

    world.prototype["randomMatrix"] = function (n)
    {
        var i, j, row, rows

        rows = []
        for (var _a_ = i = 0, _b_ = n; (_a_ <= _b_ ? i < n : i > n); (_a_ <= _b_ ? ++i : --i))
        {
            row = []
            for (var _c_ = j = 0, _d_ = n; (_c_ <= _d_ ? j < n : j > n); (_c_ <= _d_ ? ++j : --j))
            {
                row.push(Math.random() * 2 - 1)
            }
            rows.push(row)
        }
        return rows
    }

    world.prototype["randomRadii"] = function (n)
    {
        var i, j, row, rows

        rows = []
        for (var _a_ = i = 0, _b_ = n; (_a_ <= _b_ ? i < n : i > n); (_a_ <= _b_ ? ++i : --i))
        {
            row = []
            for (var _c_ = j = 0, _d_ = n; (_c_ <= _d_ ? j < n : j > n); (_c_ <= _d_ ? ++j : --j))
            {
                row.push(randRange(this.minRadius,this.maxRadius))
            }
            rows.push(row)
        }
        return rows
    }

    world.prototype["resize"] = function ()
    {
        var br

        br = this.main.getBoundingClientRect()
        this.size = _k_.min(br.width,br.height)
        this.canvas.width = this.size
        this.canvas.height = this.size
        this.canvas.style.left = `${(_k_.max(0,br.width - this.size)) / 2}px`
        return this.canvas.style.top = `${(_k_.max(0,br.height - this.size)) / 2}px`
    }

    world.prototype["togglePause"] = function ()
    {
        this.pause = !this.pause
        return post.emit('pause')
    }

    world.prototype["force"] = function (r, a)
    {
        var beta

        beta = 0.3
        if (r < beta)
        {
            return r / beta - 1
        }
        if ((beta < r && r < 1))
        {
            return a * (1 - Math.abs(2 * r - 1 - beta) / (1 - beta))
        }
        return 0
    }

    world.prototype["simulate"] = function (dt)
    {
        var f, i, j, r, rMax, rx, ry, totalForceX, totalForceY

        if (this.pause && !this.oneStep)
        {
            return
        }
        delete this.oneStep
        for (var _a_ = i = 0, _b_ = this.num; (_a_ <= _b_ ? i < this.num : i > this.num); (_a_ <= _b_ ? ++i : --i))
        {
            totalForceX = 0
            totalForceY = 0
            for (var _c_ = j = 0, _d_ = this.num; (_c_ <= _d_ ? j < this.num : j > this.num); (_c_ <= _d_ ? ++j : --j))
            {
                if (i === j)
                {
                    continue
                }
                rx = this.positionsX[j] - this.positionsX[i]
                ry = this.positionsY[j] - this.positionsY[i]
                if (rx > 0.5)
                {
                    rx = rx - 1
                }
                if (ry > 0.5)
                {
                    ry = ry - 1
                }
                if (rx < -0.5)
                {
                    rx = rx + 1
                }
                if (ry < -0.5)
                {
                    ry = ry + 1
                }
                r = Math.hypot(rx,ry)
                rMax = this.radii[this.colors[i]][this.colors[j]]
                if (r > 0 && r < rMax)
                {
                    f = this.force(r / rMax,this.matrix[this.colors[i]][this.colors[j]])
                    totalForceX += rx / r * f
                    totalForceY += ry / r * f
                }
            }
            totalForceX *= 0.1 * this.forceFactor
            totalForceY *= 0.1 * this.forceFactor
            this.velocitiesX[i] *= this.frictionFactor
            this.velocitiesY[i] *= this.frictionFactor
            this.velocitiesX[i] += totalForceX * dt
            this.velocitiesY[i] += totalForceY * dt
            if (Math.abs(this.velocitiesX[i]) < 0.001 && Math.abs(this.velocitiesY[i]) < 0.001)
            {
                this.ages[i] += 0.01
                if (this.ages[i] > 1)
                {
                    this.colors[i] = randInt(this.types)
                    this.positionsX[i] = Math.random()
                    this.positionsY[i] = Math.random()
                    this.velocitiesX[i] = 0.1 * Math.random() - 0.05
                    this.velocitiesY[i] = 0.1 * Math.random() - 0.05
                    this.ages[i] = 0
                }
            }
        }
        for (var _e_ = i = 0, _f_ = this.num; (_e_ <= _f_ ? i < this.num : i > this.num); (_e_ <= _f_ ? ++i : --i))
        {
            this.velocitiesX[i] = _k_.clamp(-this.maxVelocity,this.maxVelocity,this.velocitiesX[i])
            this.velocitiesY[i] = _k_.clamp(-this.maxVelocity,this.maxVelocity,this.velocitiesY[i])
            this.positionsX[i] += this.velocitiesX[i] * dt
            this.positionsY[i] += this.velocitiesY[i] * dt
            if (this.positionsX[i] < 0)
            {
                this.positionsX[i] += 1
            }
            if (this.positionsY[i] < 0)
            {
                this.positionsY[i] += 1
            }
            if (this.positionsX[i] > 1)
            {
                this.positionsX[i] -= 1
            }
            if (this.positionsY[i] > 1)
            {
                this.positionsY[i] -= 1
            }
        }
    }

    world.prototype["faster"] = function ()
    {
        this.forceFactor *= 2
        return this.forceFactor = _k_.min(16,this.forceFactor)
    }

    world.prototype["slower"] = function ()
    {
        this.forceFactor /= 2
        return this.forceFactor = _k_.max(1,this.forceFactor)
    }

    world.prototype["singleStep"] = function ()
    {
        this.oneStep = true
        this.pause = true
        return post.emit('pause')
    }

    world.prototype["tick"] = function (tickInfo)
    {
        var ctx, dt, i, screenX, screenY

        for (var _a_ = i = 0, _b_ = this.stepsPerFrame; (_a_ <= _b_ ? i < this.stepsPerFrame : i > this.stepsPerFrame); (_a_ <= _b_ ? ++i : --i))
        {
            dt = 0.05
            this.simulate(dt)
        }
        this.canvas.width = this.canvas.width
        ctx = this.canvas.getContext('2d')
        ctx.strokeStyle = "#111"
        ctx.strokeWidth = 1
        ctx.strokeRect(0,0,this.canvas.width,this.canvas.height)
        ctx.fillStyle = "#ff0"
        for (var _c_ = i = 0, _d_ = this.num; (_c_ <= _d_ ? i < this.num : i > this.num); (_c_ <= _d_ ? ++i : --i))
        {
            ctx.beginPath()
            screenX = this.positionsX[i] * this.canvas.width
            screenY = this.positionsY[i] * this.canvas.height
            ctx.arc(screenX,screenY,2,0,2 * Math.PI)
            ctx.fillStyle = this.hsl[i]
            ctx.fill()
        }
    }

    return world
})()

export default world;