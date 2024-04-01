var _k_

import kxk from "../../kxk.js"
let post = kxk.post

class FileWatch
{
    constructor ()
    {
        this.onChange = this.onChange.bind(this)
        post.on('fs.change',this.onChange)
    }

    onChange (change, path)
    {
        switch (change)
        {
            case 'created':
                return post.emit('fileCreated',path)

            case 'deleted':
                return post.emit('fileRemoved',path)

            case 'changed':
                return post.emit('fileChanged',path)

        }

    }
}

export default FileWatch;