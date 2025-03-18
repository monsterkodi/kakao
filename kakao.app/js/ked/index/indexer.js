var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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

class indexer
{
    static requireRegExp = /^\s*([\w\{\}]+)\s+=\s+require\s+[\'\"]([\.\/\w]+)[\'\"]/

    static includeRegExp = /^#include\s+[\"\<]([\.\/\w]+)[\"\>]/

    static methodRegExp = /^\s+([\@]?\w+|@)\s*\:\s*(\(?.*\)?)?\s*○?[=-]\>/

    static funcRegExp = /^\s*([\w\.]+)\s*[\:\=][^\(\)\'\"]*(\(.*\))?\s*○?[=-]\>/

    static postRegExp = /^\s*post\.on\s+[\'\"](\w+)[\'\"]\s*\,?\s*(\(.*\))?\s*[=-]\>/

    static testRegExp = /^\s*(▸\s+.+)/

    static splitRegExp = new RegExp("[^\\w\\d\\_]+",'g')

    static classRegExp = /^(\s*\S+\s*=)?\s*(class|function)\s+(\w+)/

    static classNameInLine (line)
    {
        var m

        m = line.match(indexer.classRegExp)
        return (m != null ? m[3] : undefined)
    }

    static methodNameInLine (line)
    {
        var m, rgs

        m = line.match(indexer.methodRegExp)
        if ((m != null))
        {
            rgs = matchr.ranges(indexer.methodRegExp,line)
            if (rgs[0].start > 11)
            {
                return null
            }
        }
        return (m != null ? m[1] : undefined)
    }

    static funcNameInLine (line)
    {
        var m, rgs

        if (m = line.match(indexer.funcRegExp))
        {
            rgs = matchr.ranges(indexer.funcRegExp,line)
            if (rgs[0].start > 7)
            {
                return null
            }
        }
        return (m != null ? m[1] : undefined)
    }

    static postNameInLine (line)
    {
        var m, rgs

        if (m = line.match(indexer.postRegExp))
        {
            rgs = matchr.ranges(indexer.postRegExp,line)
        }
        return (m != null ? m[1] : undefined)
    }

    static file (file)
    {
        return indexer.singleton.files[file]
    }

    static testWord (word)
    {
        if (word.length < 3)
        {
            return false
        }
        else if (_k_.in(word[0],['-',"#"]))
        {
            return false
        }
        else if (word[word.length - 1] === '-')
        {
            return false
        }
        else if (word[0] === '_' && word.length < 4)
        {
            return false
        }
        else if (/^[0\_\-\@\#]+$/.test(word))
        {
            return false
        }
        else if (/\d/.test(word))
        {
            return false
        }
        else
        {
            return true
        }
    }

    constructor ()
    {
        this.shiftQueue = this.shiftQueue.bind(this)
        this.index = this.index.bind(this)
        indexer.singleton = this
        post.on('index',(function (file)
        {
            return this.index(file)
        }).bind(this))
        post.on('file.change',(function (info)
        {
            if (this.files[info.path])
            {
                console.log(`indexer file.change ${info.path}`)
                return this.index(info.path,{refresh:true})
            }
        }).bind(this))
        this.imageExtensions = ['png','jpg','gif','tiff','pxm','icns']
        this.dirs = {}
        this.files = {}
        this.classes = {}
        this.funcs = {}
        this.words = {}
        this.queue = []
    }

    addFuncInfo (funcName, funcInfo)
    {
        var funcInfos, _115_37_

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
        funcInfos = ((_115_37_=this.funcs[funcName]) != null ? _115_37_ : [])
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

    async index (file, opt)
    {
        var fileExt

        if ((this.files[file] != null) && !(opt != null ? opt.refresh : undefined))
        {
            post.emit('file.indexed',file,this.files[file])
            return this.shiftQueue()
        }
        fileExt = slash.ext(file)
        if (_k_.in(fileExt,this.imageExtensions))
        {
            this.files[file] = {}
            return this.shiftQueue()
        }
        nfs.read(file).then((function (text)
        {
            var bound, boundIndex, className, cnt, currentClass, fileInfo, funcAdded, funcInfo, funcName, funcStack, hash, indent, isCpp, isHpp, isJS, li, line, lines, m, methodName, unbndIndex, word, words, _260_47_, _321_51_, _349_35_, _350_35_

            if (_k_.empty(text))
            {
                return this.shiftQueue()
            }
            hash = kstr.hash(text)
            if ((this.files[file] != null ? this.files[file].hash : undefined) === hash)
            {
                post.emit('file.indexed',file,this.files[file])
                return this.shiftQueue()
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
                return
            }
            else if (isJS)
            {
                return
            }
            else if (fileExt === 'mm')
            {
                return
            }
            else if (fileExt === 'styl')
            {
                return
            }
            else
            {
                for (var _a_ = li = 0, _b_ = lines.length; (_a_ <= _b_ ? li < lines.length : li > lines.length); (_a_ <= _b_ ? ++li : --li))
                {
                    line = lines[li]
                    if (line.trim().length)
                    {
                        indent = line.search(/\S/)
                        while (funcStack.length && indent <= _k_.last(funcStack)[0])
                        {
                            _k_.last(funcStack)[1].last = li - 1
                            funcInfo = funcStack.pop()[1]
                            funcInfo.class = ((_260_47_=funcInfo.class) != null ? _260_47_ : slash.name(file))
                            fileInfo.funcs.push(funcInfo)
                        }
                        if ((currentClass != null))
                        {
                            if (methodName = indexer.methodNameInLine(line))
                            {
                                unbndIndex = line.indexOf('->')
                                boundIndex = line.indexOf('=>')
                                bound = boundIndex > 0 && (unbndIndex < 0 || boundIndex < unbndIndex)
                                funcInfo = this.addMethod(currentClass,methodName,file,li,line.indexOf('○') >= 0,bound)
                                funcStack.push([indent,funcInfo])
                                funcAdded = true
                            }
                        }
                        else
                        {
                            if (indent < 2)
                            {
                                currentClass = null
                            }
                            if (funcName = indexer.funcNameInLine(line))
                            {
                                funcInfo = this.addFuncInfo(funcName,{line:li + 1,file:file,async:line.indexOf('○') >= 0})
                                funcStack.push([indent,funcInfo])
                                funcAdded = true
                            }
                            else if (funcName = indexer.postNameInLine(line))
                            {
                                funcInfo = this.addFuncInfo(funcName,{line:li + 1,file:file,post:true})
                                funcStack.push([indent,funcInfo])
                                funcAdded = true
                            }
                            m = line.match(indexer.testRegExp)
                            if (((m != null ? m[0] : undefined) != null))
                            {
                                funcInfo = this.addFuncInfo(m[0].replaceAll('▸ ',''),{line:li + 1,file:file,test:m[0].replaceAll('▸ ','')})
                                funcStack.push([indent,funcInfo])
                                funcAdded = true
                            }
                        }
                    }
                    words = line.split(indexer.splitRegExp)
                    var list = _k_.list(words)
                    for (var _c_ = 0; _c_ < list.length; _c_++)
                    {
                        word = list[_c_]
                        if (indexer.testWord(word))
                        {
                            cnt = ((_321_51_=this.words[word]) != null ? _321_51_ : 0)
                            this.words[word] = cnt + 1
                        }
                        switch (word)
                        {
                            case 'class':
                            case 'function':
                                if (className = indexer.classNameInLine(line))
                                {
                                    currentClass = className
                                    sds.set(this.classes,`${className}.file`,file)
                                    sds.set(this.classes,`${className}.line`,li + 1)
                                    fileInfo.classes.push({name:className,line:li + 1})
                                }
                                break
                        }

                    }
                }
            }
            if (funcAdded)
            {
                while (funcStack.length)
                {
                    _k_.last(funcStack)[1].last = li - 1
                    funcInfo = funcStack.pop()[1]
                    funcInfo.class = ((_349_35_=funcInfo.class) != null ? _349_35_ : slash.name(funcInfo.file))
                    funcInfo.class = ((_350_35_=funcInfo.class) != null ? _350_35_ : slash.name(file))
                    fileInfo.funcs.push(funcInfo)
                }
                post.emit('file.indexed',file,fileInfo)
            }
            this.files[file] = fileInfo
            return this.shiftQueue()
        }).bind(this))
        return this
    }

    shiftQueue ()
    {
        if (this.queue.length)
        {
            return this.indexFile(this.queue.shift())
        }
    }
}

export default indexer;