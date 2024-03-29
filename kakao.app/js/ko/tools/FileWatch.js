var _k_

import slash from "../../kxk/slash.js"

import post from "../../kxk/post.js"

class FileWatch
{
    constructor ()
    {
        this.onChange = this.onChange.bind(this)
        this.onUnwatch = this.onUnwatch.bind(this)
        this.onWatch = this.onWatch.bind(this)
        this.watchers = {}
        post.on('fs.change',this.onChange)
        post.on('watch',this.onWatch)
        post.on('unwatch',this.onUnwatch)
    }

    onWatch (file)
    {
        var _31_24_

        file = slash.untilde(slash.path(file))
        this.watchers[file] = ((_31_24_=this.watchers[file]) != null ? _31_24_ : 0)
        return this.watchers[file]++
    }

    onUnwatch (file)
    {
        file = slash.untilde(slash.path(file))
        if ((this.watchers[file] != null))
        {
            this.watchers[file]--
            if (this.watchers[file] <= 0)
            {
                return delete this.watchers[file]
            }
        }
    }

    onChange (change, path)
    {
        var k, v

        console.log('FileWatch.onChange',path,Object.keys(this.watchers).length)
        for (k in this.watchers)
        {
            v = this.watchers[k]
            if (k === path)
            {
                console.log('filewatch!',change,path)
                switch (change)
                {
                    case 'deleted':
                        post.emit('removeFile',path)
                        break
                    case 'changed':
                        post.emit('reloadFile',path)
                        break
                }

                return
            }
        }
    }
}

export default FileWatch;