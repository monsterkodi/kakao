// monsterkodi/kode 0.256.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var CHAR_BACKWARD_SLASH, CHAR_DOT, CHAR_FORWARD_SLASH, isPathSeparator, isPosixPathSeparator, normStr, sep

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
class Slash
{
    static sep = '/'

    static logErrors = true

    static path (p)
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
        p = Slash.untilde(p)
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

    static unslash (p)
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

    static relative (rel, to)
    {
        var dd, r, rc, tc

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
        if (rel.startsWith(to))
        {
            r = rel.slice(to.length)
            if (r[0] === Slash.sep)
            {
                r = r.slice(1)
            }
            return r
        }
        rc = Slash.split(rel)
        tc = Slash.split(to)
        dd = ''
        while (rc[0] === tc[0])
        {
            rc.shift()
            tc.shift()
            dd += '../'
        }
        if (!_k_.empty(dd))
        {
            return dd + rc.join('/')
        }
        while (!_k_.empty(tc))
        {
            tc.shift()
            dd += '../'
        }
        if (!_k_.empty(dd))
        {
            return dd + rc.join('/')
        }
        return rel
    }

    static normalize (path)
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

    static split (p)
    {
        return Slash.path(p).split('/').filter(function (e)
        {
            return e.length
        })
    }

    static splitDrive (p)
    {
        var parsed

        p = Slash.path(p)
        parsed = Slash.parse(p)
        if (parsed.dir.length > 1)
        {
            if (parsed.dir[1] === ':')
            {
                return [p.slice(2),parsed.dir[0]]
            }
        }
        else if (parsed.file.length === 2)
        {
            if (parsed.file[1] === ':')
            {
                return ['/',parsed.file[0]]
            }
        }
        return [Slash.path(p),'']
    }

    static removeDrive (p)
    {
        return Slash.splitDrive(p)[0]
    }

    static isRoot (p)
    {
        return Slash.removeDrive(p) === '/'
    }

    static splitFileLine (p)
    {
        var c, clmn, d, f, l, line, split

        var _238_14_ = Slash.splitDrive(p); f = _238_14_[0]; d = _238_14_[1]

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

    static splitFilePos (p)
    {
        var c, f, l

        var _250_16_ = Slash.splitFileLine(p); f = _250_16_[0]; l = _250_16_[1]; c = _250_16_[2]

        return [f,[c,l - 1]]
    }

    static removeLinePos (p)
    {
        return Slash.splitFileLine(p)[0]
    }

    static removeColumn (p)
    {
        var f, l

        var _255_14_ = Slash.splitFileLine(p); f = _255_14_[0]; l = _255_14_[1]

        if (l > 1)
        {
            return f + ':' + l
        }
        else
        {
            return f
        }
    }

    static ext (p)
    {
        return Slash.parse(p).ext
    }

    static removeExt (p)
    {
        var d

        d = Slash.parse(p)
        return Slash.path(d.dir,d.name)
    }

    static splitExt (p)
    {
        return [Slash.removeExt(p),Slash.ext(p)]
    }

    static swapExt (p, ext)
    {
        return Slash.removeExt(p) + (ext.startsWith('.') && ext || `.${ext}`)
    }

    static joinFilePos (file, pos)
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

    static joinFileLine (file, line, col)
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

    static pathlist (p)
    {
        var list

        if (!(p != null ? p.length : undefined))
        {
            Slash.error("Slash.pathlist -- no path?")
            return []
        }
        p = Slash.path(p)
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

    static dir (p)
    {
        return Slash.parse(p).dir
    }

    static file (p)
    {
        return Slash.parse(p).file
    }

    static name (p)
    {
        return Slash.parse(p).name
    }

    static isAbsolute (p)
    {
        return (p != null ? p[0] : undefined) === Slash.sep
    }

    static isRelative (p)
    {
        return !Slash.isAbsolute(p)
    }

    static parse (p)
    {
        var components, dir, dots, ext, file, name

        p = Slash.path(p)
        if (p.endsWith(Slash.sep))
        {
            p = p.slice(0, -1)
        }
        components = p.split(Slash.sep)
        file = components.slice(-1)[0]
        dots = file.split('.')
        ext = ((dots.length > 1 && dots.slice(-1)[0].length) ? dots.pop() : '')
        name = dots.join('.')
        dir = components.slice(0, -1).join('/')
        if (Slash.isAbsolute(p) && _k_.empty(dir))
        {
            dir = Slash.sep
        }
        return {dir:dir,file:file,name:name,ext:ext}
    }

    static home ()
    {
        return process.env.HOME
    }

    static user ()
    {
        return process.env.USER
    }

    static tmpdir ()
    {
        return process.env.TMPDIR
    }

    static tmpfile (ext)
    {
        return Slash.path(Slash.tmpdir(),`${Date.now()}` + (ext && `.${ext}` || ''))
    }

    static tilde (p)
    {
        return (p != null ? p.replace(Slash.home(),'~') : undefined)
    }

    static untilde (p)
    {
        return (p != null ? p.replace(/^\~/,Slash.home()) : undefined)
    }

    static unenv (p)
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

    static fileUrl (p)
    {
        return `file:///${Slash.encode(p)}`
    }

    static samePath (a, b)
    {
        return Slash.path(a) === Slash.path(b)
    }

    static escape (p)
    {
        return p.replace(/([\`\"])/g,'\\$1')
    }

    static encode (p)
    {
        p = encodeURI(p)
        p = p.replace(/\#/g,"%23")
        p = p.replace(/\&/g,"%26")
        return p = p.replace(/\'/g,"%27")
    }

    static sanitize (p)
    {
        while (_k_.in(p[0],'\n\r\t'))
        {
            p = p.slice(1)
        }
        while (_k_.in(p.slice(-1)[0],'\n\r\t'))
        {
            p = p.slice(0, -1)
        }
        return p
    }

    static textext = null

    static textbase = {profile:1,license:1,'.gitignore':1,'.npmignore':1}

    static reg = new RegExp("\\\\",'g')

    static win ()
    {
        return Slash.sep === '\\'
    }

    static error (msg)
    {
        if (this.logErrors)
        {
            console.error(msg)
        }
        return ''
    }
}

export default Slash;