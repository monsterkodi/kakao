var _k_

import slash from "../../kxk/slash.js"

import post from "../../kxk/post.js"

import ffs from "../../kxk/ffs.js"

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
        ffs.exists(this.file).then(this.onExists)
    }

    onExists (stat)
    {}

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
        var _52_10_

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