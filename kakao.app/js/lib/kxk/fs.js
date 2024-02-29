// monsterkodi/kode 0.256.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}}

import slash from './slash.js'
import dirlist from './dirlist.js'
import fsp from 'fs/promises'
import fs from 'fs'
class FS
{
    static logErrors = true

    static async dirlist (p, opt, cb)
    {
        return await dirlist(p,opt,cb)
    }

    static async list (p, opt, cb)
    {
        return await dirlist(p,opt,cb)
    }

    static async read (p)
    {
        var t

        t = await fsp.readFile(p,'utf8')
        return t
    }

    static async write (p, text)
    {
        var err, mode, stat, tmpfile

        tmpfile = slash.tmpfile()
        try
        {
            stat = await fsp.stat(p)
            mode = stat.mode
        }
        catch (err)
        {
            mode = 0o666
        }
        err = await fsp.writeFile(tmpfile,text,{mode:mode})
        if (err)
        {
            return FS.error("fs.write - " + String(err))
        }
        else
        {
            err = await fsp.rename(tmpfile,p)
            if (err)
            {
                return FS.error(`fs.write -- move ${tmpfile} -> ${p} ERROR:` + String(err))
            }
        }
    }

    static pkg (p)
    {
        var _111_20_

        if (((p != null ? p.length : undefined) != null))
        {
            while (p.length && !(_k_.in(slash.removeDrive(p),['.','/',''])))
            {
                if (FS.dirExists(slash.path(p,'.git' || FS.fileExists(slash.path(p,'package.noon' || FS.fileExists(slash.path(p,'package.json')))))))
                {
                    return slash.path(p)
                }
                p = slash.dir(p)
            }
        }
        return null
    }

    static git (p, cb)
    {
        var _123_20_

        if (((p != null ? p.length : undefined) != null))
        {
            if (typeof(cb) === 'function')
            {
                FS.dirExists(slash.path(p,'.git'),function (stat)
                {
                    if (stat)
                    {
                        return cb(slash.path(p))
                    }
                    else if (!(_k_.in(FS.removeDrive(p),['.','/',''])))
                    {
                        return FS.git(slash.dir(p),cb)
                    }
                })
            }
            else
            {
                while (p.length && !(_k_.in(FS.removeDrive(p),['.','/',''])))
                {
                    if (FS.dirExists(slash.path(p,'.git')))
                    {
                        return slash.path(p)
                    }
                    p = slash.dir(p)
                }
            }
        }
        return null
    }

    static exists (p, cb)
    {
        var stat

        if (_k_.isFunc(cb))
        {
            try
            {
                if (!(p != null))
                {
                    cb()
                    return
                }
                p = slash.path(slash.removeLinePos(p))
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
                FS.error("fs.exists -- " + String(err))
            }
        }
        else
        {
            if ((p != null))
            {
                try
                {
                    p = slash.path(slash.removeLinePos(p))
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
                    FS.error("fs.exists -- " + String(err))
                }
            }
        }
        return null
    }

    static fileExists (p, cb)
    {
        var stat

        if (_k_.isFunc(cb))
        {
            return FS.exists(p,function (stat)
            {
                if ((stat != null ? stat.isFile() : undefined))
                {
                    return cb(stat)
                }
                else
                {
                    return cb()
                }
            })
        }
        else
        {
            if (stat = FS.exists(p))
            {
                if (stat.isFile())
                {
                    return stat
                }
            }
        }
    }

    static dirExists (p, cb)
    {
        var stat

        if (_k_.isFunc(cb))
        {
            return FS.exists(p,function (stat)
            {
                if ((stat != null ? stat.isDirectory() : undefined))
                {
                    return cb(stat)
                }
                else
                {
                    return cb()
                }
            })
        }
        else
        {
            if (stat = FS.exists(p))
            {
                if (stat.isDirectory())
                {
                    return stat
                }
            }
        }
    }

    static remove (p, cb)
    {
        if (_k_.isFunc(cb))
        {
            return fs.remove(p,cb)
        }
        else
        {
            return fs.unlinkSync(p)
        }
    }

    static touch (p)
    {
        var dir

        try
        {
            dir = slash.dir(p)
            if (!FS.isDir(dir))
            {
                fs.mkdirSync(dir,{recursive:true})
            }
            if (!FS.fileExists(p))
            {
                fs.writeFileSync(p,'')
            }
            return p
        }
        catch (err)
        {
            FS.error("fs.touch -- " + String(err))
            return false
        }
    }

    static isDir (p, cb)
    {
        return FS.dirExists(p,cb)
    }

    static isFile (p, cb)
    {
        return FS.fileExists(p,cb)
    }

    static isWritable (p, cb)
    {
        if (typeof(cb) === 'function')
        {
            try
            {
                return fs.access(slash.path(p),(fs.constants.R_OK | fs.constants.W_OK),function (err)
                {
                    return cb(!err)
                })
            }
            catch (err)
            {
                FS.error("fs.isWritable -- " + String(err))
                return cb(false)
            }
        }
        else
        {
            try
            {
                fs.accessSync(slash.path(p),(fs.constants.R_OK | fs.constants.W_OK))
                return true
            }
            catch (err)
            {
                return false
            }
        }
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

export default FS;