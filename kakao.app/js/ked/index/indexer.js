var _k_ = {isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import kxk from "../../kxk.js"
let pickBy = kxk.pickBy
let pullIf = kxk.pullIf
let deleteBy = kxk.deleteBy
let kstr = kxk.kstr
let sds = kxk.sds
let matchr = kxk.matchr
let slash = kxk.slash
let post = kxk.post

import nfs from "../../kxk/nfs.js"

import fileutil from "../util/fileutil.js"

import prjcts from "./prjcts.js"
import index_utils from "./index_utils.js"
import index_kode from "./index_kode.js"
import index_styl from "./index_styl.js"
import index_js from "./index_js.js"
import index_hpp from "./index_hpp.js"
import index_mm from "./index_mm.js"

class indexer
{
    constructor ()
    {
        this.index = this.index.bind(this)
        this.onProjectIndexed = this.onProjectIndexed.bind(this)
        indexer.singleton = this
        post.on('project.indexed',this.onProjectIndexed)
        post.on('index',(function (file)
        {
            return this.index(file)
        }).bind(this))
        post.on('file.change',(function (info)
        {
            if (this.files[info.path])
            {
                return this.index(info.path,{refresh:true})
            }
        }).bind(this))
        this.dirs = Object.create(null)
        this.files = Object.create(null)
        this.classes = Object.create(null)
        this.funcs = Object.create(null)
        this.words = Object.create(null)
    }

    static file (file)
    {
        return this.singleton.files[file]
    }

    addFuncInfo (funcName, funcInfo)
    {
        var funcInfos, _58_37_

        if (!funcName)
        {
            return
        }
        if (funcName.length > 1 && funcName.startsWith('@'))
        {
            funcName = funcName.slice(1)
            funcInfo.static = true
        }
        funcInfo.name = funcName
        funcInfos = ((_58_37_=this.funcs[funcName]) != null ? _58_37_ : [])
        if (!(_k_.isArr(funcInfos)))
        {
            funcInfos = []
        }
        funcInfos.push(funcInfo)
        this.funcs[funcName] = funcInfos
        return funcInfo
    }

    addMethod (className, funcName, file, li, async, bound, statik = false)
    {
        var funcInfo

        funcInfo = this.addFuncInfo(funcName,{line:li + 1,file:file,class:className,async:async,bound:bound,static:statik})
        sds.set(this.classes,`${className}.methods.${funcInfo.name}`,funcInfo)
        return funcInfo
    }

    removeFile (file)
    {
        var infos, name

        if (!(this.files[file] != null))
        {
            return
        }
        for (name in this.funcs)
        {
            infos = this.funcs[name]
            pullIf(infos,function (v)
            {
                return v.file === file
            })
            if (!infos.length)
            {
                delete this.funcs[name]
            }
        }
        deleteBy(this.classes,function (k, v)
        {
            return v.file === file
        })
        return delete this.files[file]
    }

    applyIndexer (file, fileInfo, text, indexerClass)
    {
        var clss, func, funcAdded, funcInfo, indexr, parsed

        indexr = new indexerClass
        parsed = indexr.parse(text)
        funcAdded = !_k_.empty((parsed.classes)) || !_k_.empty((parsed.funcs))
        var list = _k_.list(parsed.classes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            clss = list[_a_]
            sds.set(this.classes,`${clss.name}.file`,file)
            sds.set(this.classes,`${clss.name}.line`,clss.line + 1)
            fileInfo.classes.push({clss:true,name:clss.name,line:clss.line + 1})
        }
        var list1 = _k_.list(parsed.funcs)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            func = list1[_b_]
            if (func.method)
            {
                funcInfo = this.addMethod(func.class,func.method,file,func.line,func.async,func.bound,func.static)
            }
            else
            {
                func.line = func.line + 1
                func.file = file
                funcInfo = this.addFuncInfo(func.name,func)
            }
            fileInfo.funcs.push(funcInfo)
        }
        this.files[file] = fileInfo
        return post.emit('file.indexed',file,fileInfo)
    }

    async onProjectIndexed (prjDir)
    {
        var file, files

        files = prjcts.projects[prjDir].files
        var list = _k_.list(files)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            await this.index(file)
        }
    }

    async index (file, opt)
    {
        var fileExt

        if ((this.files[file] != null) && !(opt != null ? opt.refresh : undefined))
        {
            post.emit('file.indexed',file,this.files[file])
            return
        }
        fileExt = slash.ext(file)
        if (_k_.in(fileExt,fileutil.imageExtensions))
        {
            this.files[file] = {}
            return
        }
        nfs.read(file).then((function (text)
        {
            var currentClass, fileInfo, funcAdded, funcStack, hash, isCpp, isHpp, isJS, lines

            if (_k_.empty(text))
            {
                return
            }
            hash = kstr.hash(text)
            if ((this.files[file] != null ? this.files[file].hash : undefined) === hash)
            {
                post.emit('file.indexed',file,this.files[file])
                return
            }
            lines = text.split(/\r?\n/)
            fileInfo = {lines:lines.length,funcs:[],classes:[],hash:hash}
            funcAdded = false
            funcStack = []
            currentClass = null
            isCpp = _k_.in(fileExt,['cpp','cc','c','frag','vert'])
            isHpp = _k_.in(fileExt,['hpp','h'])
            isJS = _k_.in(fileExt,['js','mjs'])
            if (isHpp || isCpp)
            {
                return this.applyIndexer(file,fileInfo,text,index_hpp)
            }
            else if (isJS)
            {
                return this.applyIndexer(file,fileInfo,text,index_js)
            }
            else if (fileExt === 'mm')
            {
                return this.applyIndexer(file,fileInfo,text,index_mm)
            }
            else if (fileExt === 'styl')
            {
                return this.applyIndexer(file,fileInfo,text,index_styl)
            }
            else if (fileExt === 'kode')
            {
                return this.applyIndexer(file,fileInfo,text,index_kode)
            }
        }).bind(this))
        return this
    }
}

export default indexer;