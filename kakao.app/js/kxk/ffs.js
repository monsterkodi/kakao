// monsterkodi/kode 0.256.0

var _k_

import slash from './slash.js'
class FS
{
    static logErrors = true

    static async listdir (dir, found)
    {
        console.log('ffs.listdir',dir)
    }

    static async list (p)
    {
        return await FS.listdir(p,[])
    }

    static async dirlist (p)
    {
        return await FS.listdir(p,[])
    }

    static async read (p)
    {
        return await kakao.request('fs.read',p)
    }

    static async write (p, text)
    {
        console.log('ffs.write',p)
    }

    static exists (p, cb)
    {
        console.log('ffs.exists',p)
    }

    static fileExists (p, cb)
    {
        console.log('ffs.fileExists',p)
    }

    static dirExists (p, cb)
    {
        console.log('ffs.dirExists',p)
    }

    static remove (p, cb)
    {
        console.log('ffs.remove',p)
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
        console.log('ffs.isWritable',p)
    }
}

export default FS;