// monsterkodi/kode 0.256.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isFunc: function (o) {return typeof o === 'function'}}

var CHAR_BACKWARD_SLASH, CHAR_DOT, CHAR_FORWARD_SLASH, isPathSeparator, isPosixPathSeparator, normStr, sep, Slash

import os from './os.js'
sep = '/'
CHAR_FORWARD_SLASH = '/'.charCodeAt(0)
CHAR_BACKWARD_SLASH = '\\'.charCodeAt(0)
CHAR_DOT = '.'.charCodeAt(0)

isPosixPathSeparator = function (c)
{
    return c === CHAR_FORWARD_SLASH
}

isPathSeparator = function (c)
{
    return c === CHAR_FORWARD_SLASH || c === CHAR_BACKWARD_SLASH
}

normStr = function (path, isAbsolute, separator, isPathSeparator)
{
    var code, dots, i, lastSegmentLength, lastSlash, lastSlashIndex, res

    res = ''
    lastSegmentLength = 0
    lastSlash = -1
    dots = 0
    code = 0
    for (var _34_13_ = i = 0, _34_16_ = path.length; (_34_13_ <= _34_16_ ? i <= path.length : i >= path.length); (_34_13_ <= _34_16_ ? ++i : --i))
    {
        if (i < path.length)
        {
            code = path.charCodeAt(i)
        }
        else if (isPathSeparator(code))
        {
            break
        }
        else
        {
            code = CHAR_FORWARD_SLASH
        }
        if (isPathSeparator(code))
        {
            if (lastSlash === i - 1 || dots === 1)
            {
                true
            }
            else if (dots === 2)
            {
                if ((res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT))
                {
                    if (res.length > 2)
                    {
                        lastSlashIndex = res.lastIndexOf(separator)
                        if (lastSlashIndex === -1)
                        {
                            res = ''
                            lastSegmentLength = 0
                        }
                        else
                        {
                            res = res.slice(0,lastSlashIndex)
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator)
                        }
                        lastSlash = i
                        dots = 0
                        continue
                    }
                    else if (res.length !== 0)
                    {
                        res = ''
                        lastSegmentLength = 0
                        lastSlash = i
                        dots = 0
                        continue
                    }
                }
                if (!isAbsolute)
                {
                    res += (res.length > 0 ? `${separator}..` : '..')
                    lastSegmentLength = 2
                }
            }
            else
            {
                if (res.length > 0)
                {
                    res += `${separator}${path.slice(lastSlash + 1,i)}`
                }
                else
                {
                    res = path.slice(lastSlash + 1,i)
                }
                lastSegmentLength = i - lastSlash - 1
            }
            lastSlash = i
            dots = 0
        }
        else if (code === CHAR_DOT && dots !== -1)
        {
            dots++
        }
        else
        {
            dots = -1
        }
    }
    return res
}

Slash = (function ()
{
    function Slash ()
    {}

    Slash["sep"] = '/'
    Slash["logErrors"] = true
    Slash["path"] = function (p)
    {
        if (!p)
        {
            return p
        }
        if (arguments.length > 1)
        {
            p = Array.from(arguments).join('/')
        }
        p = Slash.normalize(p)
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

    Slash["relative"] = function (rel, to)
    {
        to = Slash.path(to)
        if (_k_.empty(rel))
        {
            return to
        }
        rel = Slash.path(rel)
        if (to === rel)
        {
            return '.'
        }
        console.log(`relative ${rel} to ${to}`)
        return rel
    }

    Slash["normalize"] = function (path)
    {
        var isAbsolute, trailingSeparator

        if (!(_k_.isStr(path)))
        {
            return path
        }
        if (path.length === 0)
        {
            return ''
        }
        isAbsolute = isPathSeparator(path.charCodeAt(0))
        trailingSeparator = isPathSeparator(path.charCodeAt(path.length - 1))
        path = normStr(path,isAbsolute,'/',isPathSeparator)
        if (path.length === 0)
        {
            if (isAbsolute)
            {
                return '/'
            }
            return (trailingSeparator ? './' : '.')
        }
        if (trailingSeparator)
        {
            path += '/'
        }
        return (isAbsolute ? `/${path}` : path)
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

        var _213_14_ = Slash.splitDrive(p); f = _213_14_[0]; d = _213_14_[1]

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

        var _225_16_ = Slash.splitFileLine(p); f = _225_16_[0]; l = _225_16_[1]; c = _225_16_[2]

        return [f,[c,l - 1]]
    }

    Slash["removeLinePos"] = function (p)
    {
        return Slash.splitFileLine(p)[0]
    }

    Slash["removeColumn"] = function (p)
    {
        var f, l

        var _230_14_ = Slash.splitFileLine(p); f = _230_14_[0]; l = _230_14_[1]

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
        return Slash.parse(p).ext
    }

    Slash["removeExt"] = function (p)
    {
        var d

        d = Slash.parse(p)
        return Slash.path(d.dir,d.name)
    }

    Slash["splitExt"] = function (p)
    {
        return [Slash.removeExt(p),Slash.ext(p)]
    }

    Slash["swapExt"] = function (p, ext)
    {
        return Slash.removeExt(p) + (ext.startsWith('.') && ext || `.${ext}`)
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

    Slash["file"] = function (p)
    {
        return Slash.parse(p).file
    }

    Slash["isAbsolute"] = function (p)
    {
        return (p != null ? p[0] : undefined) === Slash.sep
    }

    Slash["isRelative"] = function (p)
    {
        return !Slash.isAbsolute(p)
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

    Slash["parse"] = function (p)
    {
        var components, dots, ext, file, name

        p = Slash.path(p)
        components = p.split(Slash.sep)
        file = components.slice(-1)[0]
        dots = file.split('.')
        ext = ((dots.length > 1 && dots.slice(-1)[0].length) ? dots.pop() : '')
        name = dots.join('.')
        return {dir:components.slice(0, -1).join('/'),file:file,name:name,ext:ext}
    }

    Slash["home"] = function ()
    {
        return Slash.path(os.homedir)
    }

    Slash["tilde"] = function (p)
    {
        var _343_36_

        return (Slash.path(p) != null ? Slash.path(p).replace(Slash.home(),'~') : undefined)
    }

    Slash["untilde"] = function (p)
    {
        var _344_36_

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

    Slash["fileUrl"] = function (p)
    {
        return `file:///${Slash.encode(p)}`
    }

    Slash["samePath"] = function (a, b)
    {
        return Slash.path(a) === Slash.path(b)
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
        var _377_20_

        if (((p != null ? p.length : undefined) != null))
        {
            while (p.length && !(_k_.in(Slash.removeDrive(p),['.','/',''])))
            {
                if (Slash.dirExists(Slash.path(p,'.git' || Slash.fileExists(Slash.path(p,'package.noon' || Slash.fileExists(Slash.path(p,'package.json')))))))
                {
                    return Slash.path(p)
                }
                p = Slash.dir(p)
            }
        }
        return null
    }

    Slash["git"] = function (p, cb)
    {
        var _389_20_

        if (((p != null ? p.length : undefined) != null))
        {
            if (typeof(cb) === 'function')
            {
                Slash.dirExists(Slash.path(p,'.git'),function (stat)
                {
                    if (stat)
                    {
                        return cb(Slash.path(p))
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
                    if (Slash.dirExists(Slash.path(p,'.git')))
                    {
                        return Slash.path(p)
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
                p = Slash.path(Slash.removeLinePos(p))
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
                    p = Slash.path(Slash.removeLinePos(p))
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
                return fs.access(Slash.path(p),(fs.constants.R_OK | fs.constants.W_OK),function (err)
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
                fs.accessSync(Slash.path(p),(fs.constants.R_OK | fs.constants.W_OK))
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
                for (var _528_24_ = 0; _528_24_ < list.length; _528_24_++)
                {
                    ext = list[_528_24_]
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
            p = Slash.path(p)
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

    Slash["readText"] = function (p, cb)
    {
        if (!(_k_.isFunc(cb)))
        {
            return Bun.file(p).text()
        }
        return kakao.request('fs.readText',p).then(function (text, err)
        {
            if (!err)
            {
                return cb(text)
            }
            else
            {
                console.error(err)
            }
        })
    }

    Slash["writeText"] = function (p, text, cb)
    {
        var tmpfile

        tmpfile = Slash.tmpfile()
        if (typeof(cb) === 'function')
        {
            try
            {
                import('fs')
                .
                then
                return (function (fs)
                {
                    return this.fileExists(p,function (stat)
                    {
                        var mode, _563_42_

                        mode = ((_563_42_=(stat != null ? stat.mode : undefined)) != null ? _563_42_ : 0o666)
                        return fs.writeFile(tmpfile,text,{mode:mode},function (err)
                        {
                            if (err)
                            {
                                Slash.error("Slash.writeText - " + String(err))
                                return cb('')
                            }
                            else
                            {
                                return fs.move(tmpfile,p,{overwrite:true},function (err)
                                {
                                    if (err)
                                    {
                                        Slash.error(`Slash.writeText -- move ${tmpfile} -> ${p} ERROR:` + String(err))
                                        return cb('')
                                    }
                                    else
                                    {
                                        return cb(p)
                                    }
                                })
                            }
                        })
                    })
                }).bind(this)
            }
            catch (err)
            {
                return cb(Slash.error("Slash.writeText --- " + String(err)))
            }
        }
        else
        {
            try
            {
                fs.writeFileSync(tmpfile,text)
                fs.moveSync(tmpfile,p,{overwrite:true})
                return p
            }
            catch (err)
            {
                Slash.error("Slash.writeText -- " + String(err))
            }
            return ''
        }
    }

    Slash["write"] = async function (p, text)
    {
        var crypto, err, fs, fsprom, mode, os, stat, tmpdir, tmpfile, uuid, _599_26_

        fsprom = await import('fs/promises')
        fs = fsprom.default
        os = await import('os')
        tmpdir = os.default.tmpdir
        crypto = await import('crypto')
        uuid = crypto.default.randomUUID
        tmpfile = Slash.path(tmpdir(),uuid())
        err = await fs.access(p,(fs.R_OK | fs.F_OK))
        stat = await fs.stat(p)
        mode = ((_599_26_=(stat != null ? stat.mode : undefined)) != null ? _599_26_ : 0o666)
        err = await fs.writeFile(tmpfile,text,{mode:mode})
        if (err)
        {
            return Slash.error("Slash.writeText - " + String(err))
        }
        else
        {
            err = await fs.rename(tmpfile,p)
            if (err)
            {
                return Slash.error(`Slash.writeText -- move ${tmpfile} -> ${p} ERROR:` + String(err))
            }
        }
    }

    Slash["tmpfile"] = function (ext)
    {
        return Slash.path(os.tmpdir(),require('uuid').v1() + (ext && `.${ext}` || ''))
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
        return Slash.sep === '\\'
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