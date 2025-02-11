var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import nfs from "../kxk/nfs.js"

import walker from "./walker.js"

class prjcts
{
    static queue = []

    static projects = {}

    static allFiles = {}

    static indexing = null

    constructor ()
    {
        post.on('prjcts.index',this.index)
    }

    static files (path)
    {
        var _22_55_

        return ((_22_55_=(prjcts.projects[this.dir(path)] != null ? prjcts.projects[this.dir(path)].files : undefined)) != null ? _22_55_ : [])
    }

    static dir (path)
    {
        var prjPath, project

        if (!_k_.empty(path))
        {
            if (prjPath = this.allFiles[path])
            {
                return prjPath
            }
            if (prjcts.projects[path])
            {
                return this.projects[path].dir
            }
            for (prjPath in prjcts.projects)
            {
                project = prjcts.projects[prjPath]
                if (path.startsWith(prjPath))
                {
                    return prjPath
                }
            }
        }
        lf('missing prj?',path)
        return null
    }

    static async index (file)
    {
        var exists, prjPath, result, walker, _67_19_

        if (!(_k_.isStr(file)))
        {
            console.log('prjcts.index file not a str?',file)
            return
        }
        if (file.startsWith('untitled-'))
        {
            return
        }
        lf('prjcts.index ●',file)
        exists = await ffs.exists(file)
        if (!exists)
        {
            return
        }
        prjPath = await ffs.git(file)
        prjPath = (prjPath != null ? prjPath : slash.dir(file))
        if (this.indexing)
        {
            if (this.indexing === prjPath)
            {
                return
            }
            this.queue = ((_67_19_=this.queue) != null ? _67_19_ : [])
            if (!(_k_.in(prjPath,this.queue)))
            {
                this.queue.push(prjPath)
            }
            return
        }
        if (!_k_.empty(this.projects[prjPath]))
        {
            return
        }
        this.indexing = prjPath
        walker = new Walker({root:prjPath,maxDepth:12,maxFiles:10000,file:(function (f)
        {
            return post.emit('index',f)
        }).bind(this)})
        result = await walker.start()
        if (result)
        {
            this.projects[prjPath] = {dir:prjPath,files:result.files}
            var list = _k_.list(result.files)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                file = list[_a_]
                this.allFiles[file] = prjPath
            }
            console.log('Projects indexed',prjPath,this.projects)
            post.emit('projectIndexed',prjPath)
        }
        delete this.indexing
        if (!_k_.empty(this.queue))
        {
            console.log('dequeue',this.queue[0])
            return await this.index(this.queue.shift())
        }
    }
}

export default prjcts;