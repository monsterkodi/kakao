var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import slash from "./slash.js"

import fs from "fs"

import fsp from 'fs/promises'
class NFS
{
    static async listdir (dir, opt)
    {
        var absPath, dirent, dirents, file, isDir, _24_22_, _25_18_

        opt = (opt != null ? opt : {})
        opt.recursive = ((_24_22_=opt.recursive) != null ? _24_22_ : true)
        opt.found = ((_25_18_=opt.found) != null ? _25_18_ : [])
        dir = await NFS.resolveSymlink(dir)
        dirents = await fsp.readdir(dir,{withFileTypes:true})
        var list = _k_.list(dirents)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dirent = list[_a_]
            file = dirent.name
            isDir = dirent.isDirectory()
            if (isDir && _k_.in(file,['node_modules','.git']))
            {
                continue
            }
            absPath = slash.path(dir,file)
            opt.found.push({type:(isDir ? 'dir' : 'file'),file:file,path:absPath})
            if (isDir && opt.recursive)
            {
                await NFS.listdir(absPath,opt)
            }
        }
        return opt.found
    }

    static list = NFS.listdir

    static dirlist = NFS.listdir

    static async resolveSymlink (p)
    {
        var r, stat

        stat = await fsp.lstat(p)
        if (stat.isSymbolicLink())
        {
            r = await fsp.readlink(p)
            return r
        }
        return p
    }

    static async read (p)
    {
        try
        {
            return await fsp.readFile(p,'utf8')
        }
        catch (err)
        {
            return ''
        }
    }

    static async write (p, text)
    {
        var dir, file, tmp

        file = slash.untilde(p)
        dir = slash.dir(file)
        tmp = slash.tmpfile()
        await fsp.mkdir(dir,{recursive:true})
        if (await fsp.access(dir,fs.constants.W_OK))
        {
            return {error:`can't access ${dir}`}
        }
        if (await fsp.writeFile(tmp,text))
        {
            return {error:`can't write ${tmp}`}
        }
        if (await fsp.rename(tmp,file))
        {
            return {error:`can't move ${tmp} to ${file}`}
        }
        return file
    }

    static async info (p)
    {
        try
        {
            return await fsp.stat(p)
        }
        catch (err)
        {
            console.error("nfs.info -- " + String(err))
        }
    }

    static async mkdir (p)
    {
        try
        {
            await fsp.mkdir(p,{recursive:true})
        }
        catch (err)
        {
            if (err.code !== 'EEXIST')
            {
                return {error:`nfs.mkdir -- ${String(err)}`}
            }
        }
        return p
    }

    static async exists (p)
    {
        try
        {
            if (!(p != null))
            {
                return
            }
            p = slash.absolute(slash.removeLinePos(p),process.cwd())
            return await fsp.stat(p)
        }
        catch (err)
        {
            return null
        }
    }

    static async type (p)
    {
        var stat

        if (stat = await NFS.exists(p))
        {
            return (stat.isFile() ? 'file' : 'dir')
        }
    }

    static async fileExists (p)
    {
        var stat

        stat = await NFS.exists(p)
        if ((stat != null ? stat.isFile() : undefined))
        {
            return stat
        }
    }

    static async isFile (p)
    {
        return NFS.fileExists(p)
    }

    static async dirExists (p)
    {
        var stat

        stat = await NFS.exists(p)
        if ((stat != null ? stat.isDirectory() : undefined))
        {
            return stat
        }
    }

    static async isDir (p)
    {
        return NFS.dirExists(p)
    }

    static async remove (p)
    {
        return await fsp.rm(p,{force:true,recursive:true})
    }

    static async copy (from, to)
    {
        if (await NFS.isDir(to))
        {
            to = slash.path(to,slash.file(from))
        }
        return await fsp.cp(from,to,{recursive:true})
    }

    static async move (from, to)
    {
        if (await NFS.isDir(to))
        {
            to = slash.path(to,slash.file(from))
        }
        if (await NFS.exists(from))
        {
            return await fsp.rename(from,to)
        }
    }

    static async git (p)
    {
        var git

        git = slash.path(p)
        while (git.length && git !== "/")
        {
            if (await NFS.isDir(slash.path(git,'.git')))
            {
                return git
            }
            git = slash.dir(git)
        }
    }

    static async pkg (p)
    {
        var pkg

        pkg = slash.path(p)
        while (pkg.length && pkg !== "/")
        {
            if (await NFS.isFile(slash.path(pkg,'package.json')))
            {
                return pkg
            }
            pkg = slash.dir(pkg)
        }
    }

    static async prj (p)
    {
        var pth

        pth = slash.path(p)
        if (await NFS.isFile(pth))
        {
            pth = slash.dir(pth)
        }
        while (pth.length && pth !== "/")
        {
            if (await NFS.isDir(slash.path(pth,'.git')))
            {
                return pth
            }
            if (await NFS.isFile(slash.path(pth,'package.json')))
            {
                return pth
            }
            if (await NFS.isFile(slash.path(slash.dir(pth),'kakao.kode')))
            {
                return pth
            }
            pth = slash.dir(pth)
        }
        return pth
    }

    static async isWritable (p)
    {
        console.error('todo')
    }

    static async isReadable (p)
    {
        console.error('todo')
    }

    static async duplicate (p)
    {
        console.error('todo')
    }

    static async trash (p)
    {
        console.error('todo')
    }
}

export default NFS;