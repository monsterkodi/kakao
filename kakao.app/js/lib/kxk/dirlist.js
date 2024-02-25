// monsterkodi/kode 0.256.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var dirlist, listdir

import slash from './slash.js'
import fs from 'fs/promises'

listdir = async function (dir, found)
{
    var absPath, file, files, isDir, stat

    files = await fs.readdir(dir)
    var list = _k_.list(files)
    for (var _24_13_ = 0; _24_13_ < list.length; _24_13_++)
    {
        file = list[_24_13_]
        stat = await fs.stat(slash.join(dir,file))
        isDir = stat.mode & 0o040000
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