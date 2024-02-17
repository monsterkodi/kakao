// monsterkodi/kode 0.249.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isFunc: function (o) {return typeof o === 'function'}}

var Slash

import path from './path.js'

Slash = (function ()
{
    function Slash ()
    {}

    Slash["logErrors"] = true
    Slash["path"] = function (p)
    {
        if (!p)
        {
            return p
        }
        p = path.normalize(p)
        if (!p)
        {
            console.log('no pee?',p)
            return p
        }
        if (p.endsWith(':.') && p.length === 3)
        {
            p = p.slice(0, 2)
        }
        if (p.endsWith(':') && p.length === 2)
        {
            p = p + '/'
        }
        return p
    }

    Slash["unslash"] = function (p)
    {
        var reg

        p = Slash.path(p)
        if (Slash.win())
        {
            if (p.length >= 3 && (p[0] === '/' && '/' === p[2]))
            {
                p = p[1] + ':' + p.slice(2)
            }
            reg = new RegExp("/",'g')
            p = p.replace(reg,'\\')
            if (p[1] === ':')
            {
                p = p[0].toUpperCase() + p.slice(1)
            }
        }
        return p
    }

    Slash["resolve"] = function (p)
    {
        if (!(p != null ? p.length : undefined))
        {
            p = process.cwd()
        }
        if (arguments.length > 1)
        {
            p = Slash.join.apply(0,arguments)
        }
        p = Slash.unenv(Slash.untilde(p))
        if (Slash.isRelative(p))
        {
            p = Slash.path(path.resolve(p))
        }
        else
        {
            p = Slash.path(p)
        }
        return p
    }

    Slash["split"] = function (p)
    {
        return Slash.path(p).split('/').filter(function (e)
        {
            return e.length
        })
    }

    Slash["splitDrive"] = function (p)
    {
        var filePath, parsed, root

        p = Slash.path(p)
        parsed = Slash.parse(p)
        root = parsed.root
        if (root.length > 1)
        {
            if (p.length > root.length)
            {
                filePath = p.slice(root.length - 1)
            }
            else
            {
                filePath = '/'
            }
            return [filePath,root.slice(0,root.length - 2)]
        }
        else if (parsed.dir.length > 1)
        {
            if (parsed.dir[1] === ':')
            {
                return [p.slice(2),parsed.dir[0]]
            }
        }
        else if (parsed.base.length === 2)
        {
            if (parsed.base[1] === ':')
            {
                return ['/',parsed.base[0]]
            }
        }
        return [Slash.path(p),'']
    }

    Slash["removeDrive"] = function (p)
    {
        return Slash.splitDrive(p)[0]
    }

    Slash["isRoot"] = function (p)
    {
        return Slash.removeDrive(p) === '/'
    }

    Slash["splitFileLine"] = function (p)
    {
        var c, clmn, d, f, l, line, split

        var _105_14_ = Slash.splitDrive(p); f = _105_14_[0]; d = _105_14_[1]

        split = String(f).split(':')
        if (split.length > 1)
        {
            line = parseInt(split[1])
        }
        if (split.length > 2)
        {
            clmn = parseInt(split[2])
        }
        l = c = 0
        if (Number.isInteger(line))
        {
            l = line
        }
        if (Number.isInteger(clmn))
        {
            c = clmn
        }
        if (d !== '')
        {
            d = d + ':'
        }
        return [d + split[0],Math.max(l,1),Math.max(c,0)]
    }

    Slash["splitFilePos"] = function (p)
    {
        var c, f, l

        var _117_16_ = Slash.splitFileLine(p); f = _117_16_[0]; l = _117_16_[1]; c = _117_16_[2]

        return [f,[c,l - 1]]
    }

    Slash["removeLinePos"] = function (p)
    {
        return Slash.splitFileLine(p)[0]
    }

    Slash["removeColumn"] = function (p)
    {
        var f, l

        var _122_14_ = Slash.splitFileLine(p); f = _122_14_[0]; l = _122_14_[1]

        if (l > 1)
        {
            return f + ':' + l
        }
        else
        {
            return f
        }
    }

    Slash["ext"] = function (p)
    {
        return path.extname(p).slice(1)
    }

    Slash["splitExt"] = function (p)
    {
        return [Slash.removeExt(p),Slash.ext(p)]
    }

    Slash["removeExt"] = function (p)
    {
        return Slash.join(Slash.dir(p),Slash.base(p))
    }

    Slash["swapExt"] = function (p, ext)
    {
        return Slash.removeExt(p) + (ext.startsWith('.') && ext || `.${ext}`)
    }

    Slash["join"] = function ()
    {
        return Slash.path([].map.call(arguments,Slash.path).join('/'))
    }

    Slash["joinFilePos"] = function (file, pos)
    {
        file = Slash.removeLinePos(file)
        if (!(pos != null) || !(pos[0] != null) || (pos[0] === pos[1] && pos[1] === 0))
        {
            return file
        }
        else if (pos[0])
        {
            return file + `:${pos[1] + 1}:${pos[0]}`
        }
        else
        {
            return file + `:${pos[1] + 1}`
        }
    }

    Slash["joinFileLine"] = function (file, line, col)
    {
        file = Slash.removeLinePos(file)
        if (!line)
        {
            return file
        }
        if (!col)
        {
            return `${file}:${line}`
        }
        return `${file}:${line}:${col}`
    }

    Slash["dirlist"] = function (p, opt, cb)
    {
        return this.list(p,opt,cb)
    }

    Slash["list"] = function (p, opt, cb)
    {
        return require('./dirlist')(p,opt,cb)
    }

    Slash["pathlist"] = function (p)
    {
        var list

        if (!(p != null ? p.length : undefined))
        {
            Slash.error("Slash.pathlist -- no path?")
            return []
        }
        p = Slash.normalize(p)
        if (p.length > 1 && p[p.length - 1] === '/' && p[p.length - 2] !== ':')
        {
            p = p.slice(0, p.length - 1)
        }
        list = [p]
        while (Slash.dir(p) !== '')
        {
            list.unshift(Slash.dir(p))
            p = Slash.dir(p)
        }
        return list
    }

    Slash["base"] = function (p)
    {
        return path.basename(Slash.sanitize(p),path.extname(Slash.sanitize(p)))
    }

    Slash["file"] = function (p)
    {
        return path.basename(Slash.sanitize(p))
    }

    Slash["extname"] = function (p)
    {
        return path.extname(Slash.sanitize(p))
    }

    Slash["basename"] = function (p, e)
    {
        return path.basename(Slash.sanitize(p),e)
    }

    Slash["isAbsolute"] = function (p)
    {
        p = Slash.sanitize(p)
        return p[1] === ':' || path.isAbsolute(p)
    }

    Slash["isRelative"] = function (p)
    {
        return !Slash.isAbsolute(p)
    }

    Slash["dirname"] = function (p)
    {
        return Slash.path(path.dirname(Slash.sanitize(p)))
    }

    Slash["normalize"] = function (p)
    {
        return Slash.path(Slash.sanitize(p))
    }

    Slash["dir"] = function (p)
    {
        p = Slash.normalize(p)
        if (Slash.isRoot(p))
        {
            return ''
        }
        p = path.dirname(p)
        if (p === '.')
        {
            return ''
        }
        p = Slash.path(p)
        if (p.endsWith(':') && p.length === 2)
        {
            p += '/'
        }
        return p
    }

    Slash["sanitize"] = function (p)
    {
        if (!(p != null ? p.length : undefined))
        {
            return Slash.error("Slash.sanitize -- no path?")
        }
        if (p[0] === '\n')
        {
            Slash.error(`leading newline in path! '${p}'`)
            return Slash.sanitize(p.substr(1))
        }
        if (p.endsWith('\n'))
        {
            Slash.error(`trailing newline in path! '${p}'`)
            return Slash.sanitize(p.substr(0,p.length - 1))
        }
        return p
    }

    Slash["parse"] = function (p)
    {
        var dict

        dict = path.parse(p)
        if (dict.dir.length === 2 && dict.dir[1] === ':')
        {
            dict.dir += '/'
        }
        if (dict.root.length === 2 && dict.root[1] === ':')
        {
            dict.root += '/'
        }
        return dict
    }

    Slash["home"] = function ()
    {
        return Slash.path(os.homedir())
    }

    Slash["tilde"] = function (p)
    {
        var _248_36_

        return (Slash.path(p) != null ? Slash.path(p).replace(Slash.home(),'~') : undefined)
    }

    Slash["untilde"] = function (p)
    {
        var _249_36_

        return (Slash.path(p) != null ? Slash.path(p).replace(/^\~/,Slash.home()) : undefined)
    }

    Slash["unenv"] = function (p)
    {
        var i, k, v

        i = p.indexOf('$',0)
        while (i >= 0)
        {
            for (k in process.env)
            {
                v = process.env[k]
                if (k === p.slice(i + 1,i + 1 + k.length))
                {
                    p = p.slice(0,i) + v + p.slice(i + k.length + 1)
                    break
                }
            }
            i = p.indexOf('$',i + 1)
        }
        return Slash.path(p)
    }

    Slash["relative"] = function (rel, to)
    {
        var rd, rl, td, tl

        if (!(to != null ? to.length : undefined))
        {
            to = process.cwd()
        }
        rel = Slash.resolve(rel)
        if (!Slash.isAbsolute(rel))
        {
            return rel
        }
        if (Slash.resolve(to) === rel)
        {
            return '.'
        }
        var _270_17_ = Slash.splitDrive(rel); rl = _270_17_[0]; rd = _270_17_[1]

        var _271_17_ = Slash.splitDrive(Slash.resolve(to)); tl = _271_17_[0]; td = _271_17_[1]

        if (rd && td && rd !== td)
        {
            return rel
        }
        return Slash.path(path.relative(tl,rl))
    }

    Slash["fileUrl"] = function (p)
    {
        return `file:///${Slash.encode(p)}`
    }

    Slash["samePath"] = function (a, b)
    {
        return Slash.resolve(a) === Slash.resolve(b)
    }

    Slash["escape"] = function (p)
    {
        return p.replace(/([\`\"])/g,'\\$1')
    }

    Slash["encode"] = function (p)
    {
        p = encodeURI(p)
        p = p.replace(/\#/g,"%23")
        p = p.replace(/\&/g,"%26")
        return p = p.replace(/\'/g,"%27")
    }

    Slash["pkg"] = function (p)
    {
        var _296_20_

        if (((p != null ? p.length : undefined) != null))
        {
            while (p.length && !(_k_.in(Slash.removeDrive(p),['.','/',''])))
            {
                if (Slash.dirExists(Slash.join(p,'.git' || Slash.fileExists(Slash.join(p,'package.noon' || Slash.fileExists(Slash.join(p,'package.json')))))))
                {
                    return Slash.resolve(p)
                }
                p = Slash.dir(p)
            }
        }
        return null
    }

    Slash["git"] = function (p, cb)
    {
        var _308_20_

        if (((p != null ? p.length : undefined) != null))
        {
            if (typeof(cb) === 'function')
            {
                Slash.dirExists(Slash.join(p,'.git'),function (stat)
                {
                    if (stat)
                    {
                        return cb(Slash.resolve(p))
                    }
                    else if (!(_k_.in(Slash.removeDrive(p),['.','/',''])))
                    {
                        return Slash.git(Slash.dir(p),cb)
                    }
                })
            }
            else
            {
                while (p.length && !(_k_.in(Slash.removeDrive(p),['.','/',''])))
                {
                    if (Slash.dirExists(Slash.join(p,'.git')))
                    {
                        return Slash.resolve(p)
                    }
                    p = Slash.dir(p)
                }
            }
        }
        return null
    }

    Slash["exists"] = function (p, cb)
    {
        var stat

        if (typeof(cb) === 'function')
        {
            try
            {
                if (!(p != null))
                {
                    cb()
                    return
                }
                p = Slash.resolve(Slash.removeLinePos(p))
                fs.access(p,(fs.R_OK | fs.F_OK),function (err)
                {
                    if ((err != null))
                    {
                        return cb()
                    }
                    else
                    {
                        return fs.stat(p,function (err, stat)
                        {
                            if ((err != null))
                            {
                                return cb()
                            }
                            else
                            {
                                return cb(stat)
                            }
                        })
                    }
                })
            }
            catch (err)
            {
                Slash.error("Slash.exists -- " + String(err))
            }
        }
        else
        {
            if ((p != null))
            {
                try
                {
                    p = Slash.resolve(Slash.removeLinePos(p))
                    if (stat = fs.statSync(p))
                    {
                        fs.accessSync(p,fs.R_OK)
                        return stat
                    }
                }
                catch (err)
                {
                    if (_k_.in(err.code,['ENOENT','ENOTDIR']))
                    {
                        return null
                    }
                    Slash.error("Slash.exists -- " + String(err))
                }
            }
        }
        return null
    }

    Slash["fileExists"] = function (p, cb)
    {
        console.error('slash.fileExists without callback')
    }

    Slash["dirExists"] = function (p, cb)
    {
        console.error('slash.fileExists without callback')
    }

    Slash["touch"] = function (p)
    {
        var dir

        try
        {
            dir = Slash.dir(p)
            if (!Slash.isDir(dir))
            {
                fs.mkdirSync(dir,{recursive:true})
            }
            if (!Slash.fileExists(p))
            {
                fs.writeFileSync(p,'')
            }
            return p
        }
        catch (err)
        {
            Slash.error("Slash.touch -- " + String(err))
            return false
        }
    }

    Slash["unused"] = function (p, cb)
    {
        var dir, ext, i, name, test

        name = Slash.base(p)
        dir = Slash.dir(p)
        ext = Slash.ext(p)
        ext = ext && '.' + ext || ''
        if (/\d\d$/.test(name))
        {
            name = name.slice(0,name.length - 2)
        }
        if (typeof(cb) === 'function')
        {
            return Slash.exists(p,function (stat)
            {
                var check, i, test

                if (!stat)
                {
                    cb(Slash.resolve(p))
                    return
                }
                i = 1
                test = ''
                check = function ()
                {
                    test = `${name}${`${i}`.padStart(2,'0')}${ext}`
                    if (dir)
                    {
                        test = Slash.join(dir,test)
                    }
                    return Slash.exists(test,function (stat)
                    {
                        if (stat)
                        {
                            i += 1
                            return check()
                        }
                        else
                        {
                            return cb(Slash.resolve(test))
                        }
                    })
                }
                return check()
            })
        }
        else
        {
            if (!Slash.exists(p))
            {
                return Slash.resolve(p)
            }
            for (i = 1; i <= 1000; i++)
            {
                test = `${name}${`${i}`.padStart(2,'0')}${ext}`
                if (dir)
                {
                    test = Slash.join(dir,test)
                }
                if (!Slash.exists(test))
                {
                    return Slash.resolve(test)
                }
            }
        }
    }

    Slash["isDir"] = function (p, cb)
    {
        return Slash.dirExists(p,cb)
    }

    Slash["isFile"] = function (p, cb)
    {
        return Slash.fileExists(p,cb)
    }

    Slash["isWritable"] = function (p, cb)
    {
        if (typeof(cb) === 'function')
        {
            try
            {
                return fs.access(Slash.resolve(p),(fs.constants.R_OK | fs.constants.W_OK),function (err)
                {
                    return cb(!err)
                })
            }
            catch (err)
            {
                Slash.error("Slash.isWritable -- " + String(err))
                return cb(false)
            }
        }
        else
        {
            try
            {
                fs.accessSync(Slash.resolve(p),(fs.constants.R_OK | fs.constants.W_OK))
                return true
            }
            catch (err)
            {
                return false
            }
        }
    }

    Slash["textext"] = null
    Slash["textbase"] = {profile:1,license:1,'.gitignore':1,'.npmignore':1}
    Slash["isText"] = function (p)
    {
        var ext, isBinary

        try
        {
            if (!Slash.textext)
            {
                Slash.textext = {}
                var list = _k_.list(require('textextensions'))
                for (var _489_24_ = 0; _489_24_ < list.length; _489_24_++)
                {
                    ext = list[_489_24_]
                    Slash.textext[ext] = true
                }
                Slash.textext['crypt'] = true
            }
            ext = Slash.ext(p)
            if (ext && (Slash.textext[ext] != null))
            {
                return true
            }
            if (Slash.textbase[Slash.basename(p).toLowerCase()])
            {
                return true
            }
            p = Slash.resolve(p)
            if (!Slash.isFile(p))
            {
                return false
            }
            isBinary = require('isbinaryfile')
            return !isBinary.isBinaryFileSync(p)
        }
        catch (err)
        {
            Slash.error("Slash.isText -- " + String(err))
            return false
        }
    }

    Slash["fetchText"] = function (p, cb)
    {
        if (!(_k_.isFunc(cb)))
        {
            console.error("Slash.fetchText -- no callback!")
            return
        }
        return fetch(p).then(function (response)
        {
            if (response.ok)
            {
                return response.text().then(function (text)
                {
                    return cb(text)
                })
            }
            else
            {
                console.error('ERROR:',response)
            }
        })
    }

    Slash["writeText"] = function (p, text, cb)
    {
        Slash.error("Slash.writeText -- no callback!")
        return ''
    }

    Slash["watch"] = function (p, cb)
    {
        var Watcher

        Watcher = require('./watcher')
        return Watcher.watch(p,cb)
    }

    Slash["unwatch"] = function (p, cb)
    {
        var Watcher

        Watcher = require('./watcher')
        return Watcher.unwatch(p,cb)
    }

    Slash["tmpfile"] = function (ext)
    {
        return Slash.join(os.tmpdir(),require('uuid').v1() + (ext && `.${ext}` || ''))
    }

    Slash["remove"] = function (p, cb)
    {
        if (cb)
        {
            return fs.remove(p,cb)
        }
        else
        {
            return fs.removeSync(p)
        }
    }

    Slash["reg"] = new RegExp("\\\\",'g')
    Slash["win"] = function ()
    {
        return path.sep === '\\'
    }

    Slash["error"] = function (msg)
    {
        if (this.logErrors)
        {
            console.error(msg)
        }
        return ''
    }

    return Slash
})()

export default Slash;