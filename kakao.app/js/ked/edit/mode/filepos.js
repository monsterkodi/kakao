var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.b6=_k_.k.F256(_k_.k.b(6))

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
        var curview, file, fp

        if (file = ked_session.get('editor▸file'))
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
            var list = _k_.list(filepos.fileposl)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                fp = list[_a_]
                console.log(`○ ${_k_.b6(slash.file(fp[0]))} ${fp[1][0]} ${fp[1][1]} ${fp[1][2]} ${fp[1][3]}`)
            }
            return ked_session.set(`editor▸filepos▸${file}`,curview)
        }
    }

    filepos.prototype["fileLoaded"] = function (file, row, col, view)
    {
        var posview

        if ((row != null))
        {
            console.log(`filepos.fileLoaded post goto.line ${row} ${col} ${(view != null ? view[0] : undefined)} ${(view != null ? view[1] : undefined)}`)
            return post.emit('goto.line',row,col,view)
        }
        else
        {
            if (posview = ked_session.get(`editor▸filepos▸${file}`))
            {
                console.log(`filepos.fileLoaded apply session ${posview} ${file}`)
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