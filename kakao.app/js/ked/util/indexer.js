var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = performance.now(); }, profilend: function (id) { var b = performance.now()-_k_.hrtime[id]; let f=0.001; for (let u of ['s','ms','μs','ns']) { if (u=='ns' || (b*f)>=1) { return console.log(id+' '+Number.parseFloat(b*f).toFixed(1)+' '+u); } f*=1000; }}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

import kxk from "../../kxk.js"
let pickBy = kxk.pickBy
let pullIf = kxk.pullIf
let deleteBy = kxk.deleteBy
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
        return window.indexer.files[file]
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
        post.on('index',(function (file)
        {
            return this.indexFile(file)
        }).bind(this))
        post.on('saved',(function (file)
        {
            return this.indexFile(file,{refresh:true})
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
        var funcInfos, _112_37_

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
        funcInfos = ((_112_37_=this.funcs[funcName]) != null ? _112_37_ : [])
        if (!(_k_.isArr(funcInfos)))
        {
            funcInfos = []
        }
        funcInfos.push(funcInfo)
        this.funcs[funcName] = funcInfos
        return funcInfo
    }

    addMethod (className, funcName, file, li, async, bound, statik)
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

    applyIndexer (file, fileInfo, text, IndexerClass)
    {
        var clss, func, funcAdded, funcInfo, indexer, parsed

        indexer = new IndexerClass
        parsed = indexer.parse(text)
        funcAdded = !_k_.empty((parsed.classes)) || !_k_.empty((parsed.funcs))
        var list = _k_.list(parsed.classes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            clss = list[_a_]
            sds.set(this.classes,`${clss.name}.file`,file)
            sds.set(this.classes,`${clss.name}.line`,clss.line + 1)
            fileInfo.classes.push({name:clss.name,line:clss.line + 1})
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
    }

    async index (file, opt)
    {
        var fileExt, isCpp, isHpp, isJS

        _k_.profile('indexFile')
        console.log(`indexer.index ${file}`)
        if ((opt != null ? opt.refresh : undefined))
        {
            this.removeFile(file)
        }
        if ((this.files[file] != null))
        {
            post.emit('fileIndexed',file,this.files[file])
            return this.shiftQueue()
        }
        fileExt = slash.ext(file)
        if (_k_.in(fileExt,this.imageExtensions))
        {
            this.files[file] = {}
            return this.shiftQueue()
        }
        isCpp = _k_.in(fileExt,['cpp','cc','c','frag','vert'])
        isHpp = _k_.in(fileExt,['hpp','h'])
        isJS = _k_.in(fileExt,['js','mjs'])
        nfs.read(file).then((function (text)
        {
            var className, cnt, currentClass, fileInfo, funcAdded, funcInfo, funcName, funcStack, indent, li, line, lines, m, methodName, word, words, _247_47_, _305_51_, _333_35_, _334_35_

            if (_k_.empty(text))
            {
                return
            }
            lines = text.split(/\r?\n/)
            fileInfo = {lines:lines.length,funcs:[],classes:[]}
            funcAdded = false
            funcStack = []
            currentClass = null
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
                            funcInfo.class = ((_247_47_=funcInfo.class) != null ? _247_47_ : slash.name(file))
                            fileInfo.funcs.push(funcInfo)
                        }
                        if ((currentClass != null))
                        {
                            if (methodName = indexer.methodNameInLine(line))
                            {
                                funcInfo = this.addMethod(currentClass,methodName,file,li,line.indexOf('○') >= 0,line.indexOf('=>') >= 0)
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
                            cnt = ((_305_51_=this.words[word]) != null ? _305_51_ : 0)
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
                    funcInfo.class = ((_333_35_=funcInfo.class) != null ? _333_35_ : slash.name(funcInfo.file))
                    funcInfo.class = ((_334_35_=funcInfo.class) != null ? _334_35_ : slash.name(file))
                    fileInfo.funcs.push(funcInfo)
                }
                post.emit('indexer.indexed',file,fileInfo)
            }
            this.files[file] = fileInfo
            return this.shiftQueue()
        }).bind(this))
        _k_.profilend('indexFile')
        return this
    }

    shiftQueue ()
    {
        var file

        if (this.queue.length)
        {
            file = this.queue.shift()
            return this.indexFile(file)
        }
    }
}

export default indexer;