var _k_

class KFS
{
    static watch (p)
    {
        console.log('KFS.watch',p)
    }

    static async list (p)
    {
        return await kakao.request('fs.list',p)
    }

    static async listDeep (p)
    {
        return await kakao.request('fs.listDeep',p)
    }

    static async read (p)
    {
        return await kakao.request('fs.read',p)
    }

    static async write (p, t)
    {
        return await kakao.request('fs.write',p,t)
    }

    static async exists (p)
    {
        return await kakao.request('fs.exists',p)
    }

    static async fileExists (p)
    {
        return await kakao.request('fs.fileExists',p)
    }

    static async dirExists (p)
    {
        return await kakao.request('fs.dirExists',p)
    }

    static async isWritable (p)
    {
        return await kakao.request('fs.isWritable',p)
    }

    static async isReadable (p)
    {
        return await kakao.request('fs.isReadable',p)
    }

    static async remove (p)
    {
        return await kakao.request('fs.remove',p)
    }

    static async info (p)
    {
        return await kakao.request('fs.info',p)
    }

    static async isFile (p)
    {
        return await KFS.fileExists(p)
    }

    static async isDir (p)
    {
        return await KFS.dirExists(p)
    }
}

export default KFS;