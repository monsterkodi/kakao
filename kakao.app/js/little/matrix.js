var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var matrix

import kxk from "../kxk.js"
let fade = kxk.fade
let randRange = kxk.randRange
let randInt = kxk.randInt
let randIntRange = kxk.randIntRange


matrix = (function ()
{
    function matrix ()
    {
        this["randomOffsetCross"] = this["randomOffsetCross"].bind(this)
        this["randomOffset"] = this["randomOffset"].bind(this)
        this["neighborLeaf"] = this["neighborLeaf"].bind(this)
        this["leafToEatAt"] = this["leafToEatAt"].bind(this)
        this["tubeAt"] = this["tubeAt"].bind(this)
        this["plantAt"] = this["plantAt"].bind(this)
        this["objectOfTypeAt"] = this["objectOfTypeAt"].bind(this)
        this["neighbors"] = this["neighbors"].bind(this)
        this["validNeighbors"] = this["validNeighbors"].bind(this)
        this["emptyNeighbor"] = this["emptyNeighbor"].bind(this)
        this["buildingAt"] = this["buildingAt"].bind(this)
        this["isEmpty"] = this["isEmpty"].bind(this)
        this["isInWorld"] = this["isInWorld"].bind(this)
        this["objectAt"] = this["objectAt"].bind(this)
        this["del"] = this["del"].bind(this)
        this["delAt"] = this["delAt"].bind(this)
        this["addPlant"] = this["addPlant"].bind(this)
        this["addTube"] = this["addTube"].bind(this)
        this["addCritter"] = this["addCritter"].bind(this)
        this["addEgg"] = this["addEgg"].bind(this)
        this["addObject"] = this["addObject"].bind(this)
        this["anim"] = this["anim"].bind(this)
        this["moveObjectFrom"] = this["moveObjectFrom"].bind(this)
        this["animate"] = this["animate"].bind(this)
        this["critterEggPeriod"] = this["critterEggPeriod"].bind(this)
        this["critterEggFactor"] = this["critterEggFactor"].bind(this)
        this["advance"] = this["advance"].bind(this)
        this["start"] = this["start"].bind(this)
        this["setCritterAge"] = this["setCritterAge"].bind(this)
        this.PLANT = 0
        this.EGG = 1
        this.CRITTER = 2
        this.TUBE = 3
        this.NUM_TYPES = 4
        this.ws = 40
        this.eggFadeTime = 6.0
        this.eggMoveTime = 3.0
        this.critMoveTime = 4.0
        this.critDieTime = 4.0
        this.numLeaves = 8
        this.setCritterAge(600)
        this.critterNumEggs = 3
        this.eggMaxAge = 200
        this.leafMaxAge = 50
        this.critterEatPeriod = 50
        this.critterStarveTime = 50
        this.tweaky.init({speed:{min:1,max:100,step:1,value:this.speed,cb:(function (speed)
        {
            this.speed = speed
        }).bind(this)},leaves:{min:4,max:12,step:1,value:this.numLeaves,cb:(function (numLeaves)
        {
            this.numLeaves = numLeaves
        }).bind(this)},leafAge:{min:1,max:100,step:1,value:this.leafMaxAge,cb:(function (leafMaxAge)
        {
            this.leafMaxAge = leafMaxAge
        }).bind(this)},eggAge:{min:10,max:200,step:10,value:this.eggMaxAge,cb:(function (eggMaxAge)
        {
            this.eggMaxAge = eggMaxAge
        }).bind(this)},critterAge:{min:60,max:600,step:10,value:this.critterMaxAge,cb:this.setCritterAge},eatPeriod:{min:1,max:100,step:1,value:this.critterEatPeriod,cb:(function (critterEatPeriod)
        {
            this.critterEatPeriod = critterEatPeriod
        }).bind(this)},starveTime:{min:1,max:100,step:1,value:this.critterStarveTime,cb:(function (critterStarveTime)
        {
            this.critterStarveTime = critterStarveTime
        }).bind(this)}})
        this.start()
    }

    matrix.prototype["setCritterAge"] = function (critterMaxAge)
    {
        this.critterMaxAge = critterMaxAge
    
        return this.critterAdultAge = parseInt(this.critterMaxAge / 3)
    }

    matrix.prototype["start"] = function ()
    {
        var column, t, x, y

        this.anims = []
        this.grid = []
        this.types = []
        for (var _a_ = t = 0, _b_ = this.NUM_TYPES; (_a_ <= _b_ ? t < this.NUM_TYPES : t > this.NUM_TYPES); (_a_ <= _b_ ? ++t : --t))
        {
            this.types.push([])
        }
        this.eggs = this.types[this.EGG]
        this.critters = this.types[this.CRITTER]
        this.plants = this.types[this.PLANT]
        this.tubes = this.types[this.TUBE]
        for (var _c_ = x = 0, _d_ = this.ws; (_c_ <= _d_ ? x < this.ws : x > this.ws); (_c_ <= _d_ ? ++x : --x))
        {
            column = []
            for (var _e_ = y = 0, _f_ = this.ws; (_e_ <= _f_ ? y < this.ws : y > this.ws); (_e_ <= _f_ ? ++y : --y))
            {
                column.push(null)
            }
            this.grid.push(column)
        }
        this.addEgg(this.ws / 2,this.ws / 2)
        for (var _10_ = x = 0, _11_ = this.ws / 3; (_10_ <= _11_ ? x <= this.ws / 3 : x >= this.ws / 3); (_10_ <= _11_ ? ++x : --x))
        {
            for (var _12_ = y = 0, _13_ = this.ws / 3; (_12_ <= _13_ ? y <= this.ws / 3 : y >= this.ws / 3); (_12_ <= _13_ ? ++y : --y))
            {
                this.addPlant(x * 3,y * 3)
            }
        }
    }

    matrix.prototype["advance"] = function (sec)
    {
        var c, e, l, n, op, p, _107_21_

        var list = _k_.list(this.eggs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            e = list[_a_]
            e.age += sec
            if (e.age > this.eggMaxAge && e.age - sec <= this.eggMaxAge)
            {
                this.addCritter(e.x,e.y)
            }
            if (e.age > this.eggMaxAge + this.eggFadeTime)
            {
                this.del(e)
            }
        }
        var list1 = _k_.list(this.critters)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            c = list1[_b_]
            c.age += sec
            c.eat -= sec
            if (c.age > this.critterMaxAge || c.eat < -this.critterStarveTime)
            {
                c.df = ((_107_21_=c.df) != null ? _107_21_ : 0)
                c.df += sec / this.critDieTime
                continue
            }
            if (c.eat < 0)
            {
                if (l = this.neighborLeaf(c))
                {
                    c.eat = this.critterEatPeriod
                    l.age = 0
                }
            }
            if (c.p)
            {
                continue
            }
            if (c.ox || c.oy)
            {
                continue
            }
            if (Math.floor((c.age - this.critterAdultAge) / this.critterEggPeriod(c)) > c.eggs)
            {
                if (n = this.emptyNeighbor(c))
                {
                    e = this.addEgg(n.x,n.y)
                    this.moveObjectFrom(e,c,this.eggMoveTime)
                    this.anim(c,'p',1,0,2)
                }
                c.eggs++
            }
            if (this.critterEggFactor(c) > 0.9)
            {
                continue
            }
            n = this.randomOffset(c)
            if (this.isInWorld(n) && this.isEmpty(n))
            {
                op = {x:c.x,y:c.y}
                this.grid[c.x][c.y] = null
                c.x = n[0]
                c.y = n[1]
                this.grid[c.x][c.y] = c
                this.moveObjectFrom(c,op,this.critMoveTime)
            }
        }
        var list2 = _k_.list(this.plants)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            p = list2[_c_]
            var list3 = _k_.list(p.leaves)
            for (var _d_ = 0; _d_ < list3.length; _d_++)
            {
                l = list3[_d_]
                l.age += sec
            }
        }
        return this.animate(sec)
    }

    matrix.prototype["critterEggFactor"] = function (c)
    {
        var f

        f = 0
        if (c.age > this.critterAdultAge && c.eggs < this.critterNumEggs)
        {
            f = (c.age - this.critterAdultAge) / this.critterEggPeriod(c)
            f -= c.eggs
        }
        return f
    }

    matrix.prototype["critterEggPeriod"] = function (c)
    {
        return (this.critterMaxAge - this.critterAdultAge) / (this.critterNumEggs + 1)
    }

    matrix.prototype["animate"] = function (sec)
    {
        var a, ai, d

        if (_k_.empty(this.anims))
        {
            return
        }
        for (var _a_ = ai = this.anims.length - 1, _b_ = 0; (_a_ <= _b_ ? ai <= 0 : ai >= 0); (_a_ <= _b_ ? ++ai : --ai))
        {
            a = this.anims[ai]
            d = (sec / a.d) * (a.t - a.s)
            a.o[a.m] += d
            if ((d > 0 && a.o[a.m] > a.t) || (d < 0 && a.o[a.m] < a.t))
            {
                a.o[a.m] = a.t
                this.anims.splice(ai,1)
            }
        }
    }

    matrix.prototype["moveObjectFrom"] = function (o, s, d = 1)
    {
        this.anim(o,'ox',s.x - o.x,0,d)
        return this.anim(o,'oy',s.y - o.y,0,d)
    }

    matrix.prototype["anim"] = function (o, m, s, t, d)
    {
        if (d <= 0)
        {
            return
        }
        if (s === t)
        {
            return
        }
        o[m] = s
        return this.anims.push({o:o,m:m,s:s,t:t,d:d})
    }

    matrix.prototype["addObject"] = function (x, y, o)
    {
        this.delAt([x,y])
        o.x = parseInt(x)
        o.y = parseInt(y)
        this.grid[o.x][o.y] = o
        this.types[o.type].push(o)
        return o
    }

    matrix.prototype["addEgg"] = function (x, y)
    {
        return this.addObject(x,y,{type:this.EGG,age:0})
    }

    matrix.prototype["addCritter"] = function (x, y)
    {
        return this.addObject(x,y,{type:this.CRITTER,age:0,sx:0,sy:0,sf:0,eggs:0,eat:this.critterEatPeriod})
    }

    matrix.prototype["addTube"] = function (x, y, idx)
    {
        return this.addObject(x,y,{type:this.TUBE,idx:idx})
    }

    matrix.prototype["addPlant"] = function (x, y)
    {
        var l, leaves

        leaves = []
        for (var _a_ = l = 0, _b_ = this.numLeaves; (_a_ <= _b_ ? l < this.numLeaves : l > this.numLeaves); (_a_ <= _b_ ? ++l : --l))
        {
            leaves.push({age:l * this.leafMaxAge / this.numLeaves})
        }
        return this.addObject(x,y,{type:this.PLANT,leaves:leaves})
    }

    matrix.prototype["delAt"] = function (p)
    {
        var o

        if (o = this.objectAt(p))
        {
            return this.del(o)
        }
    }

    matrix.prototype["del"] = function (o)
    {
        this.types[o.type].splice(this.types[o.type].indexOf(o),1)
        return this.grid[o.x][o.y] = null
    }

    matrix.prototype["objectAt"] = function (p)
    {
        if (this.isInWorld(p))
        {
            return this.grid[p[0]][p[1]]
        }
    }

    matrix.prototype["isInWorld"] = function (p)
    {
        return p[0] >= 0 && p[1] >= 0 && p[0] < this.ws && p[1] < this.ws
    }

    matrix.prototype["isEmpty"] = function (p)
    {
        return !this.objectAt(p)
    }

    matrix.prototype["buildingAt"] = function (p)
    {
        var o

        if (o = this.objectAt(p))
        {
            return _k_.in(o.type,[this.PLANT])
        }
        return false
    }

    matrix.prototype["emptyNeighbor"] = function (o)
    {
        var c, en, x, y

        en = []
        for (x = -1; x <= 1; x++)
        {
            for (y = -1; y <= 1; y++)
            {
                if ((x === y && y === 0))
                {
                    continue
                }
                c = [o.x + x,o.y + y]
                if (!this.isInWorld(c))
                {
                    continue
                }
                if (this.isEmpty(c))
                {
                    en.push({x:c[0],y:c[1]})
                }
            }
        }
        if (en.length)
        {
            return en[randInt(en.length)]
        }
        return null
    }

    matrix.prototype["validNeighbors"] = function (o)
    {
        var c, vn, x, y

        vn = []
        for (x = -1; x <= 1; x++)
        {
            for (y = -1; y <= 1; y++)
            {
                if ((x === y && y === 0))
                {
                    continue
                }
                c = [o.x + x,o.y + y]
                if (this.isInWorld(c))
                {
                    vn.push(c)
                }
            }
        }
        return vn
    }

    matrix.prototype["neighbors"] = function (o)
    {
        var n, x, y

        n = []
        for (x = -1; x <= 1; x++)
        {
            for (y = -1; y <= 1; y++)
            {
                if ((x === y && y === 0))
                {
                    continue
                }
                n.push([o.x + x,o.y + y])
            }
        }
        return n
    }

    matrix.prototype["objectOfTypeAt"] = function (type, p)
    {
        var o

        if (o = this.objectAt(p))
        {
            if (o.type !== type)
            {
                return null
            }
        }
        return o
    }

    matrix.prototype["plantAt"] = function (p)
    {
        return this.objectOfTypeAt(this.PLANT,p)
    }

    matrix.prototype["tubeAt"] = function (p)
    {
        return this.objectOfTypeAt(this.TUBE,p)
    }

    matrix.prototype["leafToEatAt"] = function (p)
    {
        var l, pl

        if (pl = this.plantAt(p))
        {
            var list = _k_.list(pl.leaves)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                l = list[_a_]
                if (l.age > this.leafMaxAge)
                {
                    return l
                }
            }
        }
        return null
    }

    matrix.prototype["neighborLeaf"] = function (o)
    {
        var l, nl, vn

        nl = []
        var list = _k_.list(this.neighbors(o))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            vn = list[_a_]
            if (l = this.leafToEatAt(vn))
            {
                nl.push(l)
            }
        }
        if (nl.length)
        {
            return nl[randInt(nl.length)]
        }
        return null
    }

    matrix.prototype["randomOffset"] = function (c)
    {
        var o

        o = [[-1,1],[0,1],[1,1],[-1,0],[1,0],[-1,-1],[0,-1],[1,-1]][randInt(8)]
        return [c.x + o[0],c.y + o[1]]
    }

    matrix.prototype["randomOffsetCross"] = function (c)
    {
        var o

        o = [[0,1],[-1,0],[1,0],[0,-1]][randInt(4)]
        return [c.x + o[0],c.y + o[1]]
    }

    return matrix
})()

export default matrix;