var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}};_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.B5=_k_.k.B256(_k_.k.B(5));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w8=_k_.k.F256(_k_.k.w(8))

var parseStatus, pretty, report

import kxk from "../kxk.js"
let slash = kxk.slash

import kolor from "../kolor/kolor.js"
let klor = kolor.klor

import child_process from "child_process"

pretty = {path:function (f, p, c = klor.yellow)
{
    return p.split('/').map(function (n)
    {
        return c(n)
    }).join(klor.dim(c('/')))
},ext:function (e, c = klor.yellow)
{
    return (e.length ? klor.dim(c('.')) + c(e) : '')
},file:function (f, c = klor.yellow)
{
    return `${klor.bold(c(slash.name(f)))}${pretty.ext(slash.ext(f),c)}`
},filePath:function (p, c = klor.yellow)
{
    if (!_k_.empty(slash.dir(p)))
    {
        return `${pretty.path(slash.dir(p),c)}${pretty.path('/',c)}${pretty.file(slash.file(p),c)}`
    }
    else
    {
        return `${pretty.file(slash.file(p),c)}`
    }
},ranges:function (rgs)
{
    var cfunc, index, plain, result, rng

    result = ''
    plain = ''
    var list = _k_.list(rgs.slice(0, typeof ranges.length === 'number' ? ranges.length : -1))
    for (var _34_18_ = 0; _34_18_ < list.length; _34_18_++)
    {
        index = list[_34_18_]
        rng = rgs[index]
        while (plain.length < rng.start)
        {
            plain += ' '
            result += ' '
        }
        cfunc = (function ()
        {
            switch (rng.clss)
            {
                case 'text':
                    return function (s)
                    {
                        return klor.white(klor.dim(s))
                    }

                case 'comment':
                case 'text require string':
                    return function (s)
                    {
                        return klor.gray(klor.bold(s))
                    }

                case 'punct comment':
                case 'punct':
                case 'punct minor':
                case 'punct require':
                case 'keyword require':
                    return function (s)
                    {
                        return klor.gray(klor.dim(s))
                    }

                case 'function':
                case 'function call':
                case 'string single':
                case 'string double':
                case 'dir text':
                case 'property':
                case 'function argument':
                    return function (s)
                    {
                        return klor.green(klor.bold(s))
                    }

                case 'punct function call':
                case 'punct dir':
                case 'punct string single':
                case 'punct string double':
                case 'punct string double triple':
                    return function (s)
                    {
                        return klor.green(klor.dim(s))
                    }

                case 'obj':
                case 'class':
                case 'git file':
                case 'method class':
                case 'dictionary key':
                case 'module':
                    return function (s)
                    {
                        return klor.yellow(klor.bold(s))
                    }

                case 'punct git':
                case 'git ext':
                case 'punct method class':
                case 'punct dictionary':
                case 'punct function':
                    return function (s)
                    {
                        return klor.yellow(klor.dim(s))
                    }

                case 'number':
                case 'keyword':
                case 'url domain':
                    return function (s)
                    {
                        return klor.blue(klor.bold(s))
                    }

                case 'require':
                case 'punct property':
                    return function (s)
                    {
                        return klor.green(klor.dim(s))
                    }

                case 'punct semver':
                case 'url protocol':
                case 'punct url':
                    return function (s)
                    {
                        return klor.magenta(s)
                    }

                case 'semver':
                case 'dir url tld':
                case 'punct url tld':
                    return function (s)
                    {
                        return klor.magenta(klor.bold(s))
                    }

                case 'punct function tail ligature':
                case 'punct function async':
                case 'punct keyword':
                case 'punct await':
                case 'punct keyword return':
                    return function (s)
                    {
                        return klor.b5(klor.bold(s))
                    }

                case 'nil':
                    return function (s)
                    {
                        return klor.r2(klor.bold(s))
                    }

                default:
                    return function (s)
                {
                    console.log('s',s,rng.clss)
                    return klor.white(klor.bold(s))
                }
            }

        }).bind(this)
        plain += rng.match
        result += cfunc(rng.match)
    }
    return result
}}

report = async function (status, opt = {})
{
    var aheadBehind, b, c, change, changes, cmd, diff, gitFile, gitPath, k, l, lame, ls, m, prfx, relPath, res, rgs, split, start

    changes = []
    var list = _k_.list(status.files)
    for (k = 0; k < list.length; k++)
    {
        gitFile = list[k]
        relPath = slash.relative(gitFile,process.cwd())
        l = {deleted:r1,created:w2,changed:g1}
        m = {deleted:r4,created:w5,changed:g4}
        b = {deleted:R5,created:W1,changed:G1}
        if (_k_.in(k,Object.keys(m)))
        {
            prfx = b[k]("  ")
            prfx += reset('  ')
            lame = _k_.in(slash.ext(gitFile),['js','json'])
            change = prfx + pretty.filePath(relPath,(lame && l[k] || m[k]))
            if (_k_.in(k,['changed','created']) && opt.diff)
            {
                if (lame)
                {
                    continue
                }
                cmd = `git --no-pager diff -U0  --ignore-blank-lines --ignore-space-at-eol --no-color ${gitFile}`
                res = child_process.execSync(cmd,{encoding:'utf8',cwd:status.gitDir})
                console.log('diff res',cmd,res,status.gitDir)
                diff = ""
                c = _k_.w2('●')
                start = 0
                var list1 = _k_.list(res.split(/\r?\n/))
                for (var _146_22_ = 0; _146_22_ < list1.length; _146_22_++)
                {
                    l = list1[_146_22_]
                    ls = l
                    if (_k_.in(ls.substr(0,4),['+++ ','--- ']))
                    {
                    }
                    else if (ls[0] === '@')
                    {
                        split = ls.split('@@')
                        split = split[1].split(' +')
                        split = split[1].split(',')
                        start = parseInt(split[0])
                        diff += "\n" + c
                        c = _k_.w2('●')
                    }
                    else if ((ls[0] === '+'))
                    {
                        diff += "\n "
                        start++
                        rgs = kolor.ranges(ls.substr(1),slash.ext(gitFile))
                        if (!_k_.empty(rgs))
                        {
                            diff += pretty.ranges(rgs)
                        }
                        else
                        {
                            diff += _k_.w8(ls.substr(1))
                        }
                    }
                    else if ((ls[0] === '-'))
                    {
                        diff += "\n " + _k_.w3(ls.substr(1))
                    }
                }
                if ((diff.length))
                {
                    change += diff + "\n" + _k_.w2('●')
                }
            }
            changes.push(change)
        }
    }
    relPath = slash.relative(status.gitDir,process.cwd())
    if (relPath === '')
    {
        relPath = '.'
    }
    gitPath = pretty.filePath(relPath,klor.w5)
    aheadBehind = function ()
    {
        var st

        if (status.ahead || status.behind)
        {
            st = ''
            if (status.ahead)
            {
                st += _k_.w3(`▲ ${status.ahead}`)
            }
            if (status.behind)
            {
                st += _k_.r5(`▼ ${status.behind}`)
            }
            return st = _k_.rpad(4,st)
        }
        else
        {
            return ''
        }
    }
    console.log(_k_.B5('    ' + gitPath + ' ') + ' ')
    var list2 = _k_.list(changes)
    for (var _192_10_ = 0; _192_10_ < list2.length; _192_10_++)
    {
        c = list2[_192_10_]
        console.log(c)
    }
}

parseStatus = function (gitStatus, gitDir)
{
    var dirSet, file, key, line, lines, list, rel, status

    lines = gitStatus.split('\n')
    status = {gitDir:gitDir,deleted:[],created:[],changed:[],files:{}}
    dirSet = new Set
    while (line = lines.shift())
    {
        rel = line.slice(3)
        file = slash.path(gitDir,line.slice(3))
        while ((rel = slash.dir(rel)) !== '')
        {
            dirSet.add(rel)
        }
        switch (line.slice(0,2))
        {
            case ' D':
                status.deleted.push(file)
                break
            case 'MM':
            case ' M':
                status.changed.push(file)
                break
            case '??':
                status.created.push(file)
                break
        }

    }
    status.dirs = Array.from(dirSet).map(function (d)
    {
        return slash.path(gitDir,d)
    })
    list = ['deleted','created','changed']
    var list1 = _k_.list(list)
    for (var _228_12_ = 0; _228_12_ < list1.length; _228_12_++)
    {
        key = list1[_228_12_]
        var list2 = _k_.list(status[key])
        for (var _229_17_ = 0; _229_17_ < list2.length; _229_17_++)
        {
            file = list2[_229_17_]
            status.files[file] = key
        }
    }
    return status
}
export default async function (opt = {})
{
    return new Promise(function (resolve, reject)
    {
        opt = {shell:true}
        return child_process.exec('git rev-parse --show-toplevel',opt,function (err, gitDir, stderr)
        {
            if (err)
            {
                console.error('ERROR',err)
                return reject()
            }
            else if (!_k_.empty(gitDir))
            {
                gitDir = _k_.trim(gitDir,' \n')
                console.log('gitDir',gitDir)
                return child_process.exec('/usr/bin/git status --porcelain',opt,function (err, status, stderr)
                {
                    if (err)
                    {
                        console.error('ERROR',err)
                        return reject()
                    }
                    else if (!_k_.empty(status))
                    {
                        report(parseStatus(status,gitDir),opt)
                        return resolve()
                    }
                })
            }
        })
    })
};