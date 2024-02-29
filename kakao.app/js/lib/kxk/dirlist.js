// monsterkodi/kode 0.256.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var dirlist, listdir

import slash from './slash.js'

listdir = async function (dir, found)
{
    var absPath, dirent, dirents, file, fs, isDir

    fs = await import('fs/promises')
    fs = fs.default
    dirents = await fs.readdir(dir,{withFileTypes:true})
    var list = _k_.list(dirents)
    for (var _27_15_ = 0; _27_15_ < list.length; _27_15_++)
    {
        dirent = list[_27_15_]
        file = dirent.name
        isDir = !dirent.isFile()
        absPath = dir + '/' + file
        found.push({type:(isDir ? 'dir' : 'file'),name:file,path:absPath})
        if (isDir)
        {
            await listdir(absPath,found)
        }
    }
    return found
}

dirlist = async function (dirPath)
{
    return await listdir(dirPath,[])
}
export default dirlist;