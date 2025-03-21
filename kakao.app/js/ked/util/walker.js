var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}}

import kxk from "../../kxk.js"
let slash = kxk.slash

import nfs from "../../kxk/nfs.js"

class walker
{
    static indexFileExtensions = ['kode','mm','zig','cc','c','h','hpp','cpp']

    static dotFileExtensions = ['bashrc','bash_history','gitconfig','gitignore_global','lesshst','npmrc','nvimrc','profile','zprofile','zsh_history','zshrc']

    static sourceFileExtensions = walker.indexFileExtensions.concat(walker.dotFileExtensions,['ts','js','mjs','swift','styl','css','pug','html','md','noon','json','txt','log','sh','fish','py','frag','vert','config','lua','toml','conf','gitignore','plist'])

    constructor (cfg)
    {
        this.cfg = cfg
    
        var _22_25_, _23_25_, _24_25_, _25_25_, _26_25_, _27_25_, _28_25_

        this.stop = this.stop.bind(this)
        this.start = this.start.bind(this)
        this.cfg.files = []
        this.cfg.maxDepth = ((_22_25_=this.cfg.maxDepth) != null ? _22_25_ : 3)
        this.cfg.dotFiles = ((_23_25_=this.cfg.dotFiles) != null ? _23_25_ : false)
        this.cfg.maxFiles = ((_24_25_=this.cfg.maxFiles) != null ? _24_25_ : 15000)
        this.cfg.ignore = ((_25_25_=this.cfg.ignore) != null ? _25_25_ : ['node_modules','build','Build','Library','Applications'])
        this.cfg.include = ((_26_25_=this.cfg.include) != null ? _26_25_ : ['.konrad.noon','.gitignore','.npmignore'])
        this.cfg.ignoreExt = ((_27_25_=this.cfg.ignoreExt) != null ? _27_25_ : ['asar'])
        this.cfg.includeExt = ((_28_25_=this.cfg.includeExt) != null ? _28_25_ : walker.sourceFileExtensions)
    }

    async start ()
    {
        var dir, ext, file, item, items, listDir, p, toWalk, _64_31_, _92_17_

        dir = this.cfg.root
        this.running = true
        toWalk = [dir]
        while (!_k_.empty(toWalk))
        {
            listDir = toWalk.shift()
            items = await nfs.list(listDir,{recursive:false})
            var list = _k_.list(items)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                item = list[_a_]
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
                            continue
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

    ignore (p)
    {}
}

export default walker;