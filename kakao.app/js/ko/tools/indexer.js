var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

import util from "../../kxk/util.js"
let pickBy = util.pickBy

import matchr from "../../kxk/matchr.js"

import slash from "../../kxk/slash.js"

import post from "../../kxk/post.js"

import ffs from "../../kxk/ffs.js"

import Walker from "./Walker.js"

class Indexer
{
    static requireRegExp = /^\s*([\w\{\}]+)\s+=\s+require\s+[\'\"]([\.\/\w]+)[\'\"]/

    static includeRegExp = /^#include\s+[\"\<]([\.\/\w]+)[\"\>]/

    static methodRegExp = /^\s+([\@]?\w+|@)\s*\:\s*(\(.*\))?\s*○?[=-]\>/

    static funcRegExp = /^\s*([\w\.]+)\s*[\:\=][^\(\)]*(\(.*\))?\s*○?[=-]\>/

    static postRegExp = /^\s*post\.on\s+[\'\"](\w+)[\'\"]\s*\,?\s*(\(.*\))?\s*[=-]\>/

    static testRegExp = /^\s*(▸\s+.+)/

    static splitRegExp = new RegExp("[^\\w\\d\\_]+",'g')

    static classRegExp = /^(\s*\S+\s*=)?\s*(class|function)\s+(\w+)/

    static classNameInLine (line)
    {
        var m

        m = line.match(Indexer.classRegExp)
        return (m != null ? m[3] : undefined)
    }

    static methodNameInLine (line)
    {
        var m, rgs

        m = line.match(Indexer.methodRegExp)
        if ((m != null))
        {
            rgs = matchr.ranges(Indexer.methodRegExp,line)
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

        if (m = line.match(Indexer.funcRegExp))
        {
            rgs = matchr.ranges(Indexer.funcRegExp,line)
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

        if (m = line.match(Indexer.postRegExp))
        {
            rgs = matchr.ranges(Indexer.postRegExp,line)
        }
        return (m != null ? m[1] : undefined)
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
        this.onSourceInfoForFile = this.onSourceInfoForFile.bind(this)
        this.onGet = this.onGet.bind(this)
        post.on('fileLoaded',this.indexProject)
        this.imageExtensions = ['png','jpg','gif','tiff','pxm','icns']
        this.dirs = {}
        this.files = {}
        this.classes = {}
        this.funcs = {}
        this.words = {}
        this.queue = []
        this.indexedProjects = []
    }

    onGet (key, ...filter)
    {
        var names, value, _114_45_, _115_43_, _116_43_, _117_43_, _118_42_

        switch (key)
        {
            case 'counts':
                return {classes:((_114_45_=this.classes.length) != null ? _114_45_ : 0),files:((_115_43_=this.files.length) != null ? _115_43_ : 0),funcs:((_116_43_=this.funcs.length) != null ? _116_43_ : 0),words:((_117_43_=this.words.length) != null ? _117_43_ : 0),dirs:((_118_42_=this.dirs.length) != null ? _118_42_ : 0)}

            case 'file':
                return this.files[filter[0]]

            case 'project':
                return this.projectInfo(filter[0])

        }

        value = this[key]
        if (!_k_.empty(filter))
        {
            names = _.filter(filter,function (c)
            {
                return !_k_.empty(c)
            })
            if (!_k_.empty(names))
            {
                names = names.map(function (c)
                {
                    return (c != null ? c.toLowerCase() : undefined)
                })
                value = pickBy(value,function (key)
                {
                    var cn, lc

                    var list = _k_.list(names)
                    for (var _134_27_ = 0; _134_27_ < list.length; _134_27_++)
                    {
                        cn = list[_134_27_]
                        lc = key.toLowerCase()
                        if (cn.length > 1 && lc.indexOf(cn) >= 0 || lc.startsWith(cn))
                        {
                            return true
                        }
                    }
                })
            }
        }
        return value
    }

    onSourceInfoForFile (opt)
    {
        var file

        file = opt.item.file
        if ((this.files[file] != null))
        {
            return post.toWin(opt.winID,'sourceInfoForFile',this.files[file],opt)
        }
    }

    projectInfo (path)
    {
        var project

        var list = _k_.list(this.indexedProjects)
        for (var _154_20_ = 0; _154_20_ < list.length; _154_20_++)
        {
            project = list[_154_20_]
            if (slash.samePath(project.dir,path) || path.startsWith(project.dir + '/'))
            {
                return project
            }
        }
        return {}
    }

    async indexProject (file)
    {
        var prjPath, sleep, walker, _169_24_

        sleep = async function (ms)
        {
            await new Promise((function (r)
            {
                return setTimeout(r,ms)
            }).bind(this))
            return true
        }
        prjPath = await ffs.pkg(file)
        if (this.currentlyIndexing)
        {
            if (this.currentlyIndexing === prjPath)
            {
                return
            }
            this.indexQueue = ((_169_24_=this.indexQueue) != null ? _169_24_ : [])
            if (!(_k_.in(prjPath,this.indexQueue)))
            {
                this.indexQueue.push(prjPath)
                console.log('Indexer.indexProject -- queue',this.indexQueue)
            }
            return
        }
        this.currentlyIndexing = prjPath
        walker = new Walker({root:prjPath,maxDepth:12,maxFiles:5000,file:(function (f)
        {
            console.log('Indexer.walker.file',f)
        }).bind(this)})
        await walker.start()
        delete this.currentlyIndexing
        if (!_k_.empty(this.indexQueue))
        {
            console.log('dequeue',this.indexQueue[0])
            return await this.indexProject(this.indexQueue.shift())
        }
    }

    addFuncInfo (funcName, funcInfo)
    {
        var funcInfos, _281_37_

        if (!funcName)
        {
            console.log(`addFuncInfo ${funcName}`,funcInfo)
        }
        if (funcName.length > 1 && funcName.startsWith('@'))
        {
            funcName = funcName.slice(1)
            funcInfo.static = true
        }
        funcInfo.name = funcName
        funcInfos = ((_281_37_=this.funcs[funcName]) != null ? _281_37_ : [])
        funcInfos.push(funcInfo)
        this.funcs[funcName] = funcInfos
        return funcInfo
    }

    addMethod (className, funcName, file, li, async)
    {
        var funcInfo

        funcInfo = this.addFuncInfo(funcName,{line:li + 1,file:file,class:className,async:async})
        _.set(this.classes,`${className}.methods.${funcInfo.name}`,funcInfo)
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
            _.remove(infos,function (v)
            {
                return v.file === file
            })
            if (!infos.length)
            {
                delete this.funcs[name]
            }
        }
        this.classes = _.omitBy(this.classes,function (v)
        {
            return v.file === file
        })
        return delete this.files[file]
    }

    indexFile (file, opt)
    {
        var fileExt, isCpp, isHpp

        console.log('Indexer.indexFile',file)
        return
        if ((opt != null ? opt.refresh : undefined))
        {
            this.removeFile(file)
        }
        if ((this.files[file] != null))
        {
            return this.shiftQueue()
        }
        fileExt = slash.ext(file)
        if (_k_.in(fileExt,this.imageExtensions))
        {
            this.files[file] = {}
            return this.shiftQueue()
        }
        isCpp = _k_.in(fileExt,['cpp','cc','mm','c','frag','vert'])
        isHpp = _k_.in(fileExt,['hpp','h'])
        slash.readText(file,(function (text)
        {
            var abspath, className, clss, currentClass, ext, fileInfo, func, funcAdded, funcInfo, funcName, funcStack, indent, indexHpp, li, line, lines, m, methodName, parsed, r, required, word, words, _387_43_, _477_57_, _496_35_, _497_35_

            lines = text.split(/\r?\n/)
            fileInfo = {lines:lines.length,funcs:[],classes:[]}
            funcAdded = false
            funcStack = []
            currentClass = null
            if (isHpp || isCpp)
            {
                indexHpp = new IndexHpp
                parsed = indexHpp.parse(text)
                funcAdded = !_k_.empty((parsed.classes)) || !_k_.empty((parsed.funcs))
                var list = _k_.list(parsed.classes)
                for (var _362_25_ = 0; _362_25_ < list.length; _362_25_++)
                {
                    clss = list[_362_25_]
                    _.set(this.classes,`${clss.name}.file`,file)
                    _.set(this.classes,`${clss.name}.line`,clss.line + 1)
                    fileInfo.classes.push({name:clss.name,line:clss.line + 1})
                }
                var list1 = _k_.list(parsed.funcs)
                for (var _371_25_ = 0; _371_25_ < list1.length; _371_25_++)
                {
                    func = list1[_371_25_]
                    funcInfo = this.addMethod(func.class,func.method,file,func.line)
                    fileInfo.funcs.push(funcInfo)
                }
            }
            else
            {
                for (var _376_27_ = li = 0, _376_31_ = lines.length; (_376_27_ <= _376_31_ ? li < lines.length : li > lines.length); (_376_27_ <= _376_31_ ? ++li : --li))
                {
                    line = lines[li]
                    if (line.trim().length)
                    {
                        indent = line.search(/\S/)
                        while (funcStack.length && indent <= _k_.last(funcStack)[0])
                        {
                            _k_.last(funcStack)[1].last = li - 1
                            funcInfo = funcStack.pop()[1]
                            funcInfo.class = ((_387_43_=funcInfo.class) != null ? _387_43_ : slash.base(file))
                            fileInfo.funcs.push(funcInfo)
                        }
                        if ((currentClass != null))
                        {
                            if (methodName = Indexer.methodNameInLine(line))
                            {
                                funcInfo = this.addMethod(currentClass,methodName,file,li,line.indexOf('○') >= 0)
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
                            if (funcName = Indexer.funcNameInLine(line))
                            {
                                funcInfo = this.addFuncInfo(funcName,{line:li + 1,file:file,async:line.indexOf('○') >= 0})
                                funcStack.push([indent,funcInfo])
                                funcAdded = true
                            }
                            else if (funcName = Indexer.postNameInLine(line))
                            {
                                funcInfo = this.addFuncInfo(funcName,{line:li + 1,file:file,post:true})
                                funcStack.push([indent,funcInfo])
                                funcAdded = true
                            }
                            m = line.match(Indexer.testRegExp)
                            if (((m != null ? m[0] : undefined) != null))
                            {
                                funcInfo = this.addFuncInfo(m[0].replaceAll('▸ ',''),{line:li + 1,file:file,test:m[0].replaceAll('▸ ','')})
                                funcStack.push([indent,funcInfo])
                                funcAdded = true
                            }
                        }
                    }
                    words = line.split(Indexer.splitRegExp)
                    var list2 = _k_.list(words)
                    for (var _442_29_ = 0; _442_29_ < list2.length; _442_29_++)
                    {
                        word = list2[_442_29_]
                        if (Indexer.testWord(word))
                        {
                            _.update(this.words,`${word}.count`,function (n)
                            {
                                return ((n != null ? n : 0)) + 1
                            })
                        }
                        switch (word)
                        {
                            case 'class':
                            case 'function':
                                if (className = Indexer.classNameInLine(line))
                                {
                                    currentClass = className
                                    _.set(this.classes,`${className}.file`,file)
                                    _.set(this.classes,`${className}.line`,li + 1)
                                    fileInfo.classes.push({name:className,line:li + 1})
                                }
                                break
                            case 'require':
                                m = line.match(Indexer.requireRegExp)
                                if (((m != null ? m[1] : undefined) != null) && (m[2] != null))
                                {
                                    r = ((_477_57_=fileInfo.require) != null ? _477_57_ : [])
                                    r.push([m[1],m[2]])
                                    fileInfo.require = r
                                    abspath = slash.resolve(slash.join(slash.dir(file),m[2]))
                                    if (!(_k_.in(slash.ext(abspath),['json'])))
                                    {
                                        var list3 = ['kode','coffee']
                                        for (var _482_48_ = 0; _482_48_ < list3.length; _482_48_++)
                                        {
                                            ext = list3[_482_48_]
                                            required = `${abspath}.${ext}`
                                            if ((m[2][0] === '.') && (!(this.files[required] != null)) && (this.queue.indexOf(required) < 0))
                                            {
                                                if (slash.isFile(required))
                                                {
                                                    console.log('!!!!',required)
                                                    this.queue.push(required)
                                                }
                                            }
                                        }
                                    }
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
                    funcInfo.class = ((_496_35_=funcInfo.class) != null ? _496_35_ : slash.name(funcInfo.file))
                    funcInfo.class = ((_497_35_=funcInfo.class) != null ? _497_35_ : slash.name(file))
                    fileInfo.funcs.push(funcInfo)
                }
                if ((opt != null ? opt.post : undefined) !== false)
                {
                    post.toWins('classesCount',_.size(this.classes))
                    post.toWins('funcsCount',_.size(this.funcs))
                    post.toWins('fileIndexed',file,fileInfo)
                }
            }
            this.files[file] = fileInfo
            if ((opt != null ? opt.post : undefined) !== false)
            {
                post.toWins('filesCount',_.size(this.files))
            }
            return this.shiftQueue()
        }).bind(this))
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

export default Indexer;