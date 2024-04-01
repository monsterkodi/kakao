var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../kxk.js"
let post = kxk.post
let ffs = kxk.ffs

import Walker from "./Walker.js"

class Projects
{
    static projects = {}

    static allFiles = {}

    static indexing = null

    static queue = []

    static files (path)
    {
        var _20_59_

        return ((_20_59_=(Projects.projects[this.dir(path)] != null ? Projects.projects[this.dir(path)].files : undefined)) != null ? _20_59_ : [])
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
            if (Projects.projects[path])
            {
                return this.projects[path].dir
            }
            for (prjPath in Projects.projects)
            {
                project = Projects.projects[prjPath]
                if (path.startsWith(prjPath))
                {
                    return prjPath
                }
            }
        }
        return null
    }

    static async indexProject (file)
    {
        var prjPath, result, walker, _51_19_

        prjPath = await ffs.pkg(file)
        if (this.indexing)
        {
            if (this.indexing === prjPath)
            {
                return
            }
            this.queue = ((_51_19_=this.queue) != null ? _51_19_ : [])
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
        walker = new Walker({root:prjPath,maxDepth:12,maxFiles:5000,file:(function (f)
        {
            return post.emit('index',f)
        }).bind(this)})
        result = await walker.start()
        if (result)
        {
            this.projects[prjPath] = {dir:prjPath,files:result.files}
            var list = _k_.list(result.files)
            for (var _72_21_ = 0; _72_21_ < list.length; _72_21_++)
            {
                file = list[_72_21_]
                this.allFiles[file] = prjPath
            }
            console.log('projects',this.projects)
            console.log('allFiles',this.allFiles)
            post.emit('projectIndexed',prjPath)
        }
        delete this.indexing
        if (!_k_.empty(this.queue))
        {
            console.log('dequeue',this.queue[0])
            return await this.indexProject(this.queue.shift())
        }
    }
}

post.on('fileLoaded',function (file)
{
    return Projects.indexProject(file)
})
post.on('indexProject',function (file)
{
    return Projects.indexProject(file)
})
export default Projects;