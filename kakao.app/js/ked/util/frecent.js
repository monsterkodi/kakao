var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var frecent

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let pretty = kxk.pretty
let post = kxk.post


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

    frecent["sample"] = function (bucket, key, delta)
    {
        var bi, item, rec, _27_30_

        if (_k_.empty(key))
        {
            console.error("frecent.sample - needs key to sample! got",key)
            return
        }
        this.buckets[bucket][key] = ((_27_30_=this.buckets[bucket][key]) != null ? _27_30_ : {rank:1,time:this.now()})
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

    frecent["score"] = function (bucket)
    {
        var pth, rec

        for (pth in this.buckets[bucket])
        {
            rec = this.buckets[bucket][pth]
            rec.score = this.frecent(rec)
        }
    }

    frecent["list"] = function (bucket)
    {
        var bkt, lst

        this.score(bucket)
        bkt = this.buckets[bucket]
        lst = Object.keys(bkt)
        lst.sort((function (a, b)
        {
            return bkt[b].score - bkt[a].score
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
        this.sample('file',file,delta)
        return this.score('file')
    }

    return frecent
})()

post.on('session.merge',function (recent)
{
    var file, maxRecent, newRecent

    if (!_k_.empty(recent.files))
    {
        if (!_k_.empty(recent.files.recent))
        {
            maxRecent = 60
            newRecent = {}
            var list = _k_.list(Object.keys(recent.files.recent).slice(0, typeof maxRecent === 'number' ? maxRecent : -1))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                file = list[_a_]
                newRecent[file] = recent.files.recent[file]
            }
            frecent.buckets['file'] = newRecent
            return recent.files.recent = newRecent
        }
    }
})
export default frecent;