var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, isArr: function (o) {return Array.isArray(o)}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.b7=_k_.k.F256(_k_.k.b(7))

var differ

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let slash = kxk.slash

import nfs from "../../../kxk/nfs.js"

import belt from "../../edit/tool/belt.js"

import prjcts from "../../index/prjcts.js"

import git from "../../util/git.js"
import fileinfo from "../../util/fileinfo.js"

import searcher from "./searcher.js"
import searcherfile from "./searcherfile.js"


differ = (function ()
{
    _k_.extend(differ, searcher)
    function differ (screen)
    {
        this.screen = screen
    
        this["commit"] = this["commit"].bind(this)
        this["patch"] = this["patch"].bind(this)
        this["history"] = this["history"].bind(this)
        this["file"] = this["file"].bind(this)
        this["status"] = this["status"].bind(this)
        this["diff"] = this["diff"].bind(this)
        this["show"] = this["show"].bind(this)
        this["onFileLoaded"] = this["onFileLoaded"].bind(this)
        differ.__super__.constructor.call(this,this.screen,null,'differ')
        post.on('differ.status',this.status)
        post.on('differ.file',this.file)
        post.on('differ.history',this.history)
    }

    differ.prototype["emitFileOpen"] = function (choice)
    {
        post.emit('file.open',choice.path,choice.row,choice.col)
        return this.hide()
    }

    differ.prototype["onFileLoaded"] = function (file)
    {}

    differ.prototype["show"] = function ()
    {
        this.isVisible = true
        post.emit('view.show',this.name)
        this.arrange()
        this.input.grabFocus()
        this.choices.clearEmpty()
        this.sfils = []
        return {redraw:true}
    }

    differ.prototype["diff"] = function (diff)
    {
        var add, added, change, ext, file, items, li, modadd, modded, _85_32_, _86_32_

        file = diff.file
        ext = slash.ext(file)
        items = []
        var list = _k_.list(diff.changes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            change = list[_a_]
            if (_k_.empty(change.add) && _k_.empty(change.mod))
            {
                continue
            }
            modded = ((_85_32_=change.mod) != null ? _85_32_ : [])
            added = ((_86_32_=change.add) != null ? _86_32_ : [])
            modadd = modded.concat(added)
            if (_k_.empty(modadd.filter(function (m)
                {
                    return !_k_.empty(_k_.trim(m.new))
                })))
            {
                console.log('skip only whitespace',change)
                continue
            }
            items.push({line:''})
            var list1 = _k_.list(change.add)
            for (li = 0; li < list1.length; li++)
            {
                add = list1[li]
                if (!_k_.empty(_k_.trim(add.new)))
                {
                    items.push({line:' ' + add.new,path:file,row:change.line + li - 1,col:0})
                }
            }
            var list2 = _k_.list(change.mod)
            for (li = 0; li < list2.length; li++)
            {
                add = list2[li]
                if (!_k_.empty(_k_.trim(add.new)))
                {
                    items.push({line:' ' + add.new,path:file,row:change.line + li - 1,col:0})
                }
            }
        }
        items.push({line:''})
        this.choices.append(items,ext)
        return post.emit('redraw')
    }

    differ.prototype["status"] = async function ()
    {
        var currentFile, diff, file, fileHeader, lines, newl, noCounterpart, status, text

        currentFile = ked_session.get('editor▸file')
        status = await git.status(currentFile)
        if (_k_.empty(status))
        {
            return
        }
        if (_k_.empty(status.gitDir))
        {
            return
        }
        this.show()
        fileHeader = (function (change, file, status)
        {
            var path, sfil, symbol

            symbol = ((function ()
            {
                switch (change)
                {
                    case 'changed':
                        return '●'

                    case 'added':
                        return '◼'

                    case 'deleted':
                        return '✘'

                }

            }).bind(this))()
            path = slash.relative(file,status.gitDir)
            sfil = new searcherfile(this.screen,`${this.name}_sfil_${this.sfils.length}`)
            sfil.lineIndex = this.choices.items.length
            sfil.set(path)
            this.sfils.push(sfil)
            return this.choices.append([{line:symbol,type:'file',path:file,row:0,col:0}])
        }).bind(this)
        noCounterpart = function (file)
        {
            var counter, cpt, ext

            cpt = {js:'kode',pug:'html',css:'styl'}
            if (ext = cpt[slash.ext(file)])
            {
                counter = slash.swapExt(file,ext)
                if (status.files[counter])
                {
                    return
                }
                counter = fileinfo.swapLastDir(counter,slash.ext(file),ext)
                if (status.files[counter])
                {
                    return
                }
            }
            return true
        }
        var list = _k_.list(status.deleted)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            fileHeader('deleted',file,status)
        }
        var list1 = _k_.list(status.added)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            file = list1[_b_]
            fileHeader('added',file,status)
            if (noCounterpart(file))
            {
                text = await nfs.read(file)
                lines = belt.linesForText(text)
                newl = lines.map(function (l)
                {
                    return {new:l}
                })
                diff = {file:file,changes:[{line:1,add:newl}]}
                this.diff(diff)
            }
        }
        var list2 = _k_.list(status.changed)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            file = list2[_c_]
            fileHeader('changed',file,status)
            if (noCounterpart(file))
            {
                diff = await git.diff(file)
                if (this.hidden())
                {
                    console.log('hidden?')
                }
                if (!_k_.empty(diff))
                {
                    this.diff(diff)
                }
            }
        }
    }

    differ.prototype["file"] = async function ()
    {
        var currentFile, diff

        currentFile = ked_session.get('editor▸file')
        diff = await git.diff(currentFile)
        if (!_k_.empty(diff))
        {
            this.show()
            return this.diff(diff)
        }
    }

    differ.prototype["history"] = async function ()
    {
        var currentFile, f, gitDir, h, history, items, symbol

        history = await git.history()
        if (_k_.empty(history))
        {
            return
        }
        this.show()
        currentFile = ked_session.get('editor▸file')
        gitDir = await git.dir(currentFile)
        items = []
        var list = _k_.list(history)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            h = list[_a_]
            items.push({line:' ● ' + h.msg,commit:h.commit})
            var list1 = _k_.list(h.files)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                f = list1[_b_]
                symbol = ((function ()
                {
                    switch (f.type[0])
                    {
                        case 'D':
                            return '✘'

                        case 'A':
                            return '✔'

                        case 'R':
                            return '➜'

                        case 'M':
                            return '▪'

                        default:
                            return '◆'
                    }

                }).bind(this))()
                items.push({line:'      ' + symbol + ' ' + f.path,path:slash.path(gitDir,f.path),commit:h.commit})
            }
        }
        this.choices.append(items)
        return post.emit('redraw')
    }

    differ.prototype["patch"] = async function (rev)
    {
        var c, currentFile, file, gitDir, items, l, p, patch

        patch = await git.patch(rev)
        if (_k_.empty(patch))
        {
            return
        }
        console.log(`rev ${rev}`,patch)
        currentFile = ked_session.get('editor▸file')
        gitDir = await git.dir(currentFile)
        items = []
        var list = _k_.list(patch)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            p = list[_a_]
            file = slash.path(gitDir,p.tgtfile.slice(2))
            console.log(`file ${file}`)
            items.push({line:' ● ' + p.tgtfile.slice(2),path:file})
            if (_k_.isArr(p.changes))
            {
                var list1 = _k_.list(p.changes)
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    c = list1[_b_]
                    var list2 = _k_.list(c.changedlines)
                    for (var _c_ = 0; _c_ < list2.length; _c_++)
                    {
                        l = list2[_c_]
                        items.push({line:l.type + ' ' + l.line,path:file})
                    }
                }
            }
        }
        this.choices.set(items,'line')
        return post.emit('redraw')
    }

    differ.prototype["apply"] = function (choice)
    {
        if (!_k_.empty(choice))
        {
            if (choice.path)
            {
                return this.emitFileOpen(choice)
            }
            if (choice.commit)
            {
                return this.patch(choice.commit)
            }
        }
        console.log("differ.apply?",choice)
        return differ.__super__.apply.call(this,choice)
    }

    differ.prototype["commit"] = async function (msg)
    {
        var currentFile, gitDir, out

        currentFile = ked_session.get('editor▸file')
        gitDir = await git.dir(currentFile)
        if (_k_.empty(gitDir))
        {
            return
        }
        out = ''
        out += await git.exec("add .",{cwd:gitDir})
        out += await git.exec(`commit -m \"${msg}\"`,{cwd:gitDir})
        out += await git.exec("push -q",{cwd:gitDir})
        console.log(r4,`differ.commit\n${_k_.b7(out)}`)
    }

    differ.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
                if (!_k_.empty(text))
                {
                    this.commit(text)
                    return
                }
                break
        }

        return differ.__super__.onInputAction.call(this,action,text)
    }

    return differ
})()

export default differ;