var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var filepos

import kxk from "../../../kxk.js"
let post = kxk.post
let kutil = kxk.kutil
let slash = kxk.slash


filepos = (function ()
{
    filepos["autoStart"] = true
    filepos["fileposl"] = []
    filepos["offset"] = 0
    function filepos (state)
    {
        this.state = state
    
        this.name = 'filepos'
        this.fileLoaded(ked_session.get("editor▸file"))
        post.emit('redraw')
    }

    filepos.prototype["cursorsSet"] = function ()
    {
        var curview, file, fposl

        if (file = ked_session.get("editor▸file"))
        {
            curview = this.state.mainCursor().concat(this.state.s.view)
            fposl = filepos.fileposl
            if (_k_.empty(fposl))
            {
                fposl.push([file,curview])
            }
            else
            {
                if (filepos.offset && fposl.length > 1 && fposl[fposl.length - 1 - filepos.offset][0] === file)
                {
                    fposl[fposl.length - 1 - filepos.offset][1] = curview
                }
                else
                {
                    if (filepos.offset && fposl[fposl.length - 1 - filepos.offset][0] !== file)
                    {
                        filepos.offset = 0
                    }
                    kutil.pullIf(fposl,function (fp)
                    {
                        return fp[0] === file
                    })
                    fposl.push([file,curview])
                }
            }
            post.emit('status.filepos',fposl,filepos.offset)
            return ked_session.set(`editor▸filepos▸${file}`,curview)
        }
    }

    filepos.prototype["fileLoaded"] = function (file, row, col, view)
    {
        var posview

        if ((row != null))
        {
            return post.emit('goto.line',row,col,view)
        }
        else
        {
            if (posview = ked_session.get(`editor▸filepos▸${file}`))
            {
                this.state.setCursors([posview.slice(0, 2)])
                return this.state.setView(posview.slice(2))
            }
        }
    }

    filepos.prototype["swapPrevious"] = function ()
    {
        var fp, lf, pf

        if (filepos.fileposl.length < 2)
        {
            return
        }
        console.log(`filepos.swapPrevious ${filepos.offset} ${filepos.fileposl.length}`,filepos.fileposl)
        if (filepos.offset)
        {
            filepos.offset = 0
        }
        else
        {
            lf = filepos.fileposl.pop()
            pf = filepos.fileposl.pop()
            filepos.fileposl.push(lf)
            filepos.fileposl.push(pf)
        }
        fp = filepos.fileposl[filepos.fileposl.length - 1]
        post.emit('status.filepos',filepos.fileposl,filepos.offset)
        return post.emit('file.open',fp[0],fp[1][1],fp[1][0],[fp[1][2],fp[1][3]])
    }

    filepos.prototype["goBackward"] = function ()
    {
        var fp

        if (filepos.fileposl.length < 2)
        {
            return
        }
        if (filepos.offset >= filepos.fileposl.length - 1)
        {
            return
        }
        console.log(`filepos.goBackward ${filepos.offset} ${filepos.fileposl.length}`,filepos.fileposl)
        filepos.offset += 1
        fp = filepos.fileposl[filepos.fileposl.length - filepos.offset - 1]
        post.emit('status.filepos',filepos.fileposl,filepos.offset)
        return post.emit('file.open',fp[0],fp[1][1],fp[1][0],[fp[1][2],fp[1][3]])
    }

    filepos.prototype["goForward"] = function ()
    {
        var fp

        if (filepos.fileposl.length < 2)
        {
            return
        }
        if (filepos.offset <= 0)
        {
            return
        }
        console.log(`filepos.goForward ${filepos.offset} ${filepos.fileposl.length}`,filepos.fileposl)
        filepos.offset -= 1
        fp = filepos.fileposl[filepos.fileposl.length - filepos.offset - 1]
        post.emit('status.filepos',filepos.fileposl,filepos.offset)
        return post.emit('file.open',fp[0],fp[1][1],fp[1][0],[fp[1][2],fp[1][3]])
    }

    filepos.prototype["handleKey"] = function (key, event)
    {
        switch (key)
        {
            case 'alt+1':
                return this.goBackward()

            case 'alt+2':
                return this.goForward()

            case 'cmd+1':
                return this.swapPrevious()

        }

        return 'unhandled'
    }

    return filepos
})()

export default filepos;