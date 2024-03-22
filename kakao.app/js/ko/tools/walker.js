var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}}

import slash from "../../kxk/slash.js"

import ffs from "../../kxk/ffs.js"

import File from "./File.js"

class Walker
{
    constructor (cfg)
    {
        var _19_25_, _20_25_, _21_25_, _22_25_, _23_25_, _24_25_, _25_25_

        this.cfg = cfg
    
        this.cfg.files = []
        this.cfg.maxDepth = ((_19_25_=this.cfg.maxDepth) != null ? _19_25_ : 3)
        this.cfg.dotFiles = ((_20_25_=this.cfg.dotFiles) != null ? _20_25_ : false)
        this.cfg.maxFiles = ((_21_25_=this.cfg.maxFiles) != null ? _21_25_ : 500)
        this.cfg.ignore = ((_22_25_=this.cfg.ignore) != null ? _22_25_ : ['node_modules','build','Build','Library','Applications'])
        this.cfg.include = ((_23_25_=this.cfg.include) != null ? _23_25_ : ['.konrad.noon','.gitignore','.npmignore'])
        this.cfg.ignoreExt = ((_24_25_=this.cfg.ignoreExt) != null ? _24_25_ : ['asar'])
        this.cfg.includeExt = ((_25_25_=this.cfg.includeExt) != null ? _25_25_ : File.sourceFileExtensions)
    }

    ignore (p)
    {}

    async start ()
    {
        var dir, ext, file, item, items, listDir, p, toWalk, _63_31_, _97_17_

        dir = this.cfg.root
        this.running = true
        toWalk = [dir]
        while (!_k_.empty(toWalk))
        {
            listDir = toWalk.shift()
            items = await ffs.list(listDir)
            var list = _k_.list(items)
            for (var _56_21_ = 0; _56_21_ < list.length; _56_21_++)
            {
                item = list[_56_21_]
                file = item.file
                ext = slash.ext(file)
                p = item.path
                if ((typeof this.cfg.filter === "function" ? this.cfg.filter(p) : undefined))
                {
                    this.ignore(p)
                    continue
                }
                else if (_k_.in(file,['.DS_Store','Icon\r']) || _k_.in(ext,['pyc']))
                {
                    this.ignore(p)
                    continue
                }
                else if (_k_.in(file,this.cfg.ignore))
                {
                    this.ignore(p)
                    continue
                }
                else if (_k_.in(file,this.cfg.include))
                {
                    this.cfg.files.push(item.path)
                }
                else if (file.startsWith('.'))
                {
                    if (this.cfg.dotFiles)
                    {
                        this.cfg.files.push(item.path)
                    }
                    else
                    {
                        this.ignore(p)
                        continue
                    }
                }
                else if (_k_.in(ext,this.cfg.ignoreExt))
                {
                    this.ignore(p)
                    continue
                }
                else if (_k_.in(ext,this.cfg.includeExt) || this.cfg.includeExt.indexOf('') >= 0)
                {
                    this.cfg.files.push(item.path)
                }
                if (_k_.isFunc(this.cfg.path))
                {
                    this.cfg.path(item.path)
                }
                if (item.type === 'dir')
                {
                    if (_k_.isFunc(this.cfg.dir))
                    {
                        if (!this.cfg.dir(item.path))
                        {
                            continuer
                        }
                    }
                    toWalk.push(item.path)
                }
                else
                {
                    if (_k_.in(ext,this.cfg.includeExt) || _k_.in(slash.file(item.path),this.cfg.include) || this.cfg.includeExt.indexOf('') >= 0)
                    {
                        if (_k_.isFunc(this.cfg.file))
                        {
                            this.cfg.file(item.path)
                        }
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
        ;(typeof this.cfg.done === "function" ? this.cfg.done(this) : undefined)
        return this.cfg
    }

    stop ()
    {
        this.running = false
        return this.walker = null
    }
}

export default Walker;