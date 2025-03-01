var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var frecent, int

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let pretty = kxk.pretty

int = parseInt

frecent = (function ()
{
    function frecent ()
    {}

    frecent["buckets"] = {file:{}}
    frecent["now"] = function ()
    {
        return Date.now()
    }

    frecent["frecent"] = function (item)
    {
        return item.rank / (1 + this.now() - item.time)
    }

    frecent["sample"] = function (key, delta, bucket)
    {
        var bi, item, rec, _23_30_

        this.buckets[bucket][key] = ((_23_30_=this.buckets[bucket][key]) != null ? _23_30_ : {rank:1,time:this.now()})
        rec = this.buckets[bucket][key]
        rec.rank += delta
        rec.time = this.now()
        var list = _k_.list(this.list(bucket))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            bi = list[_a_]
            item = this.buckets[bucket][bi]
        }
    }

    frecent["list"] = function (bucket)
    {
        var bkt, lst

        bkt = this.buckets[bucket]
        lst = Object.keys(bkt)
        lst.sort((function (a, b)
        {
            return this.frecent(bkt[b]) - this.frecent(bkt[a])
        }).bind(this))
        return lst
    }

    frecent["store"] = function (bucket)
    {
        var i, lst

        lst = {}
        var list = _k_.list(this.list(bucket))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            i = list[_a_]
            lst[i] = this.buckets[bucket][i]
        }
        return lst
    }

    frecent["fileAction"] = function (file, action)
    {
        var delta

        delta = ((function ()
        {
            switch (action)
            {
                case 'loaded':
                    return 1

                case 'saved':
                    return 10

            }

        }).bind(this))()
        return this.sample(file,delta,'file')
    }

    return frecent
})()

export default frecent;