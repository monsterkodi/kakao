var _k_

import slash from "../../kxk/slash.js"

import post from "../../kxk/post.js"

import ffs from "../../kxk/ffs.js"

class DirWatch
{
    static watches = {}

    static watch (dir)
    {
        var _19_30_

        DirWatch.watches[dir] = ((_19_30_=DirWatch.watches[dir]) != null ? _19_30_ : 0)
        DirWatch.watches[dir]++
        console.log('watch',dir,DirWatch.watches)
    }

    static unwatch (dir)
    {
        DirWatch.watches[dir]--
        if (DirWatch.watches[dir] <= 0)
        {
            delete DirWatch.watches[dir]
        }
        console.log('unwatch',dir,DirWatch.watches)
    }

    static onChange (change, path)
    {
        var dir, k, v

        dir = slash.dir(path)
        for (k in DirWatch.watches)
        {
            v = DirWatch.watches[k]
            if (k === dir)
            {
                console.log('post.dirChanged',{change:change,path:path,dir:dir})
                post.emit('dirChanged',{change:change,path:path,dir:dir})
                return
            }
        }
    }
}

post.on('fs.change',DirWatch.onChange)
export default DirWatch;