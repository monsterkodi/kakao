// monsterkodi/kode 0.256.0

var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var basename, CHAR_BACKWARD_SLASH, CHAR_DOT, CHAR_FORWARD_SLASH, dirname, extname, isAbsolute, isPathSeparator, isPosixPathSeparator, join, normalize, normStr, parse, sep

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
    for (var _32_13_ = i = 0, _32_16_ = path.length; (_32_13_ <= _32_16_ ? i <= path.length : i >= path.length); (_32_13_ <= _32_16_ ? ++i : --i))
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

normalize = function (path)
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

join = function (...args)
{
    return args.join(sep)
}

isAbsolute = function (path)
{
    return path[0] === sep
}

parse = function (path)
{
    var base, components, dots, ext, name

    components = path.split(sep)
    base = components.slice(-1)[0]
    dots = base.split('.')
    ext = ((dots.length > 1 && dots.slice(-1)[0].length) ? '.' + dots.pop() : '')
    name = dots.join('.')
    return {root:(path[0] === sep ? sep : ''),dir:join.apply(null,components.slice(0, -1)),base:base,name:name,ext:ext}
}

extname = function (path)
{
    return parse(path).ext
}

dirname = function (path)
{
    return parse(path).dir
}

basename = function (path, ext)
{
    var p

    p = parse(path)
    return (ext === p.ext ? p.name : p.base)
}
export default {sep:sep,join:join,parse:parse,extname:extname,dirname:dirname,basename:basename,normalize:normalize,isAbsolute:isAbsolute};