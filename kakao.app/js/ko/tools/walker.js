var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}}

import slash from "../../kxk/slash.js"

import ffs from "../../kxk/ffs.js"

import File from "./File.js"

class Walker
{
    constructor (cfg)
    {
        var _19_25_, _20_25_, _21_25_, _22_25_, _23_25_, _24_25_, _25_25_, _26_25_

        this.cfg = cfg
    
        this.cfg.files = []
        this.cfg.maxDepth = ((_19_25_=this.cfg.maxDepth) != null ? _19_25_ : 3)
        this.cfg.dotFiles = ((_20_25_=this.cfg.dotFiles) != null ? _20_25_ : false)
        this.cfg.includeDirs = ((_21_25_=this.cfg.includeDirs) != null ? _21_25_ : true)
        this.cfg.maxFiles = ((_22_25_=this.cfg.maxFiles) != null ? _22_25_ : 500)
        this.cfg.ignore = ((_23_25_=this.cfg.ignore) != null ? _23_25_ : ['node_modules','build','Build','Library','Applications'])
        this.cfg.include = ((_24_25_=this.cfg.include) != null ? _24_25_ : ['.konrad.noon','.gitignore','.npmignore'])
        this.cfg.ignoreExt = ((_25_25_=this.cfg.ignoreExt) != null ? _25_25_ : ['asar'])
        this.cfg.includeExt = ((_26_25_=this.cfg.includeExt) != null ? _26_25_ : File.sourceFileExtensions)
    }

    async start ()
    {
        var dir, ext, file, item, items, listDir, toWalk, _100_21_, _59_34_, _63_43_, _88_36_, _93_37_

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
                var list = _k_.list(items)
                for (var _54_25_ = 0; _54_25_ < list.length; _54_25_++)
                {
                    item = list[_54_25_]
                    file = item.file
                    ext = slash.ext(file)
                    if ((typeof this.cfg.filter === "function" ? this.cfg.filter(p) : undefined))
                    {
                        return this.ignore(p)
                    }
                    else if (_k_.in(file,['.DS_Store','Icon\r']) || _k_.in(ext,['pyc']))
                    {
                        return this.ignore(p)
                    }
                    else if ((this.cfg.includeDir != null) && slash.dir(p) === this.cfg.includeDir)
                    {
                        this.cfg.files.push(item.path)
                        if (_k_.in(file,this.cfg.ignore))
                        {
                            this.ignore(p)
                        }
                        if (file.startsWith('.') && !this.cfg.dotFiles)
                        {
                            this.ignore(p)
                        }
                    }
                    else if (_k_.in(file,this.cfg.ignore))
                    {
                        return this.ignore(p)
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
                            return this.ignore(p)
                        }
                    }
                    else if (_k_.in(ext,this.cfg.ignoreExt))
                    {
                        return this.ignore(p)
                    }
                    else if (_k_.in(ext,this.cfg.includeExt) || this.cfg.includeExt.indexOf('') >= 0)
                    {
                        this.cfg.files.push(item.path)
                    }
                    else if (stat.isDirectory())
                    {
                        if (p !== this.cfg.root && this.cfg.includeDirs)
                        {
                            this.cfg.files.push(item.path)
                        }
                    }
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