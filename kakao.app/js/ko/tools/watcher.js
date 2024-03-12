// monsterkodi/kakao 0.1.0

var _k_

import slash from "../../kxk/slash.js"

import post from "../../kxk/post.js"

class Watcher
{
    static id = 0

    constructor (file)
    {
        this.file = file
    
        this.onRename = this.onRename.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onExists = this.onExists.bind(this)
        this.id = Watcher.id++
        slash.exists(this.file,this.onExists)
    }

    onExists (stat)
    {
        if (!stat)
        {
            return
        }
        if (!this.id)
        {
            return
        }
        this.mtime = stat.mtimeMs
        this.w = fs.watch(this.file)
        this.w.on('change',(function (changeType, p)
        {
            if (changeType === 'change')
            {
                return slash.exists(this.file,this.onChange)
            }
            else
            {
                return setTimeout(((function ()
                {
                    return slash.exists(this.file,this.onRename)
                }).bind(this)),200)
            }
        }).bind(this))
        return this.w.on('unlink',(function (p)
        {
            console.log(`unlink ${this.id}`,slash.file(this.file))
        }).bind(this))
    }

    onChange (stat)
    {
        if (stat.mtimeMs !== this.mtime)
        {
            this.mtime = stat.mtimeMs
            return post.emit('reloadFile',this.file)
        }
    }

    onRename (stat)
    {
        if (!stat)
        {
            this.stop()
            return post.emit('removeFile',this.file)
        }
    }

    stop ()
    {
        var _51_10_

        ;(this.w != null ? this.w.close() : undefined)
        delete this.w
        return this.id = 0
    }
}

class FileWatcher
{
    constructor ()
    {
        this.onUnwatch = this.onUnwatch.bind(this)
        this.onWatch = this.onWatch.bind(this)
        this.watchers = {}
        post.on('watch',this.onWatch)
        post.on('unwatch',this.onUnwatch)
    }

    onWatch (file)
    {
        file = slash.path(file)
        if (!(this.watchers[file] != null))
        {
            return this.watchers[file] = new Watcher(file)
        }
    }

    onUnwatch (file)
    {
        file = slash.path(file)
        ;(this.watchers[file] != null ? this.watchers[file].stop() : undefined)
        return delete this.watchers[file]
    }
}

export default FileWatcher;