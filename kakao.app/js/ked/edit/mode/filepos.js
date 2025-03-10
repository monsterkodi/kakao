var filepos

import kxk from "../../../kxk.js"
let post = kxk.post


filepos = (function ()
{
    filepos["autoStart"] = true
    function filepos (state)
    {
        this.state = state
    
        this.name = 'filepos'
        this.fileLoaded(ked_session.get("editor▸file"))
        post.emit('redraw')
    }

    filepos.prototype["cursorsSet"] = function ()
    {
        var file

        if (file = ked_session.get('editor▸file'))
        {
            return ked_session.set(`editor▸filepos▸${file}`,this.state.mainCursor().concat(this.state.s.view))
        }
    }

    filepos.prototype["fileLoaded"] = function (file)
    {
        var posview

        if (posview = ked_session.get(`editor▸filepos▸${file}`))
        {
            this.state.setCursors([posview.slice(0, 2)])
            return this.state.setView(posview.slice(2))
        }
    }

    filepos.prototype["handleKey"] = function (key, event)
    {
        switch (key)
        {
            case 'cmd+1':
                console.log('go back')
                break
            case 'cmd+2':
                console.log('go forward')
                break
        }

        return 'unhandled'
    }

    return filepos
})()

export default filepos;