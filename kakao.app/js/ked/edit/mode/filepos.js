var filepos


filepos = (function ()
{
    function filepos (state)
    {
        this.state = state
    
        this.name = 'filepos'
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
            console.log(`▪ ${posview} ${file}`)
            this.state.setCursors([posview.slice(0, 2)])
            return this.state.setView(posview.slice(2))
        }
    }

    return filepos
})()

export default filepos;