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
    function filepos (state)
    {
        this.state = state
    
        this.name = 'filepos'
        this.fileLoaded(ked_session.get("editor▸file"))
        post.emit('redraw')
    }

    filepos.prototype["cursorsSet"] = function ()
    {
        var curview, file

        if (file = ked_session.get("editor▸file"))
        {
            curview = this.state.mainCursor().concat(this.state.s.view)
            if (_k_.empty(filepos.fileposl))
            {
                filepos.fileposl.push([file,curview])
            }
            else if (filepos.fileposl.slice(-1)[0][0] === file)
            {
                filepos.fileposl.slice(-1)[0][1] = curview
            }
            else
            {
                kutil.pullIf(filepos.fileposl,function (fp)
                {
                    return fp[0] === file
                })
                filepos.fileposl.push([file,curview])
            }
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

    filepos.prototype["goBackward"] = function ()
    {
        var fp, offset

        console.log(`goBackward ${filepos.fileposl.length}`,filepos.fileposl)
        if (filepos.fileposl.length < 2)
        {
            return
        }
        offset = 2
        fp = filepos.fileposl[filepos.fileposl.length - offset]
        return post.emit('file.open',fp[0],fp[1][1],fp[1][0],[fp[1][2],fp[1][3]])
    }

    filepos.prototype["goForward"] = function ()
    {
        if (filepos.fileposl.length < 2)
        {
            return
        }
    }

    filepos.prototype["handleKey"] = function (key, event)
    {
        switch (key)
        {
            case 'cmd+1':
                return this.goBackward()

            case 'cmd+2':
                return this.goForward()

        }

        return 'unhandled'
    }

    return filepos
})()

export default filepos;