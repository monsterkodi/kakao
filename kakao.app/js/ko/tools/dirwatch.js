var _k_

import slash from "../../kxk/slash.js"

import post from "../../kxk/post.js"

class DirWatch
{
    static watches = {}

    static watch (dir)
    {
        var _18_30_

        DirWatch.watches[dir] = ((_18_30_=DirWatch.watches[dir]) != null ? _18_30_ : 0)
        return DirWatch.watches[dir]++
    }

    static unwatch (dir)
    {
        DirWatch.watches[dir]--
        if (DirWatch.watches[dir] <= 0)
        {
            return delete DirWatch.watches[dir]
        }
    }

    static onChange (change, path)
    {
        var dir, k, v

        dir = slash.dir(path)
        console.log('DirWatch.onChange',dir,Object.keys(DirWatch.watches).length)
        for (k in DirWatch.watches)
        {
            v = DirWatch.watches[k]
            if (k === dir)
            {
                post.emit('dirChanged',{change:change,path:path,dir:dir})
                return
            }
        }
    }
}

post.on('fs.change',DirWatch.onChange)
export default DirWatch;