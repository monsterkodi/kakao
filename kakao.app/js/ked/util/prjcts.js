var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import nfs from "../../kxk/nfs.js"

import walker from "./walker.js"

class prjcts
{
    static queue = []

    static projects = {}

    static allFiles = {}

    static indexing = null

    static files (path)
    {
        var _20_49_

        return ((_20_49_=(this.projects[this.dir(path)] != null ? this.projects[this.dir(path)].files : undefined)) != null ? _20_49_ : [])
    }

    static dir (path)
    {
        var prjPath, project

        if (!_k_.empty(path))
        {
            path = slash.absolute(path,process.cwd())
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
        var exists, prjPath, result, walk, _70_19_

        if (!(_k_.isStr(file)))
        {
            lf('prjcts.index file not a str?',file)
            return
        }
        if (file.startsWith('untitled-'))
        {
            return
        }
        file = slash.absolute(file,process.cwd())
        exists = await nfs.exists(file)
        if (!exists)
        {
            return
        }
        prjPath = await nfs.prj(file)
        prjPath = (prjPath != null ? prjPath : slash.dir(file))
        if (this.indexing)
        {
            if (this.indexing === prjPath)
            {
                return
            }
            this.queue = ((_70_19_=this.queue) != null ? _70_19_ : [])
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
        walk = new walker({root:prjPath,maxDepth:12,maxFiles:10000,file:(function (f)
        {
            return post.emit('prjcts.file.indexed',f)
        }).bind(this)})
        result = await walk.start()
        if (result)
        {
            this.projects[prjPath] = {dir:prjPath,files:result.files}
            var list = _k_.list(result.files)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                file = list[_a_]
                this.allFiles[file] = prjPath
            }
            post.emit('prjcts.project.indexed',prjPath)
        }
        delete this.indexing
        if (!_k_.empty(this.queue))
        {
            return await this.index(this.queue.shift())
        }
    }
}

export default prjcts;