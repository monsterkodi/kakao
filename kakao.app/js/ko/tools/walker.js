var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isFunc: function (o) {return typeof o === 'function'}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import slash from "../../kxk/slash.js"

import ffs from "../../kxk/ffs.js"

import File from "./File.js"

class Walker
{
    constructor (cfg)
    {
        var _20_25_, _21_25_, _22_25_, _23_25_, _24_25_, _25_25_, _26_25_, _27_25_

        this.cfg = cfg
    
        this.cfg.files = []
        this.cfg.stats = []
        this.cfg.maxDepth = ((_20_25_=this.cfg.maxDepth) != null ? _20_25_ : 3)
        this.cfg.dotFiles = ((_21_25_=this.cfg.dotFiles) != null ? _21_25_ : false)
        this.cfg.includeDirs = ((_22_25_=this.cfg.includeDirs) != null ? _22_25_ : true)
        this.cfg.maxFiles = ((_23_25_=this.cfg.maxFiles) != null ? _23_25_ : 500)
        this.cfg.ignore = ((_24_25_=this.cfg.ignore) != null ? _24_25_ : ['node_modules','build','Build','Library','Applications'])
        this.cfg.include = ((_25_25_=this.cfg.include) != null ? _25_25_ : ['.konrad.noon','.gitignore','.npmignore'])
        this.cfg.ignoreExt = ((_26_25_=this.cfg.ignoreExt) != null ? _26_25_ : ['asar'])
        this.cfg.includeExt = ((_27_25_=this.cfg.includeExt) != null ? _27_25_ : File.sourceFileExtensions)
    }

    async start ()
    {
        var dir, ext, file, item, items, listDir, toWalk, _103_37_, _116_21_, _98_36_

        dir = this.cfg.root
        console.log('Walker.start',dir)
        if (1)
        {
            this.running = true
            toWalk = [dir]
            while (!_k_.empty(toWalk))
            {
                listDir = toWalk.shift()
                items = await ffs.list(listDir)
                console.log('Walker items',items)
                var list = _k_.list(items)
                for (var _55_25_ = 0; _55_25_ < list.length; _55_25_++)
                {
                    item = list[_55_25_]
                    console.log('item',item)
                    file = item.file
                    ext = slash.ext(file)
                    console.log('file',file,ext)
                    if (_k_.isFunc(this.cfg.path))
                    {
                        this.cfg.path(item.path)
                    }
                    if (item.type === 'dir')
                    {
                        if (this.cfg.includeDirs)
                        {
                            ;(typeof this.cfg.dir === "function" ? this.cfg.dir(item.path) : undefined)
                        }
                    }
                    else
                    {
                        if (_k_.in(ext,this.cfg.includeExt) || _k_.in(slash.file(item.path),this.cfg.include) || this.cfg.includeExt.indexOf('') >= 0)
                        {
                            ;(typeof this.cfg.file === "function" ? this.cfg.file(item.path) : undefined)
                        }
                    }
                    if (this.cfg.files.length > this.cfg.maxFiles)
                    {
                        console.log('maxFiles reached')
                        break
                    }
                }
            }
            this.running = false
            return (typeof this.cfg.done === "function" ? this.cfg.done(this) : undefined)
        }
    }

    stop ()
    {
        this.running = false
        return this.walker = null
    }
}

export default Walker;