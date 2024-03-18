var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import slash from "../../kxk/slash.js"

import prefs from "../../kxk/prefs.js"

import post from "../../kxk/post.js"

import util from "../../kxk/util.js"
let pullAllWith = util.pullAllWith

class Navigate
{
    constructor (main)
    {
        this.main = main
    
        this.navigate = this.navigate.bind(this)
        post.on('navigate',this.navigate)
        this.filePositions = prefs.get('filePositions',[])
        this.currentIndex = -1
        this.navigating = false
    }

    addToHistory (file, pos)
    {
        var filePos, fp, i

        if (!(file != null))
        {
            return
        }
        pos = (pos != null ? pos : [0,0])
        if (!pos[0] && !pos[1] && this.filePositions.length)
        {
            for (var _39_22_ = i = this.filePositions.length - 1, _39_47_ = 0; (_39_22_ <= _39_47_ ? i <= 0 : i >= 0); (_39_22_ <= _39_47_ ? ++i : --i))
            {
                fp = this.filePositions[i]
                if (slash.samePath(fp.file,file))
                {
                    pos = fp.pos
                    break
                }
            }
        }
        pullAllWith(this.filePositions,[{file:file,pos:pos}],function (a, b)
        {
            return slash.samePath(a.file,b.file) && (a.pos[1] === b.pos[1] || a.pos[1] <= 1)
        })
        filePos = slash.tilde(slash.joinFilePos(file,pos))
        if ((this.filePositions.slice(-1)[0] != null ? this.filePositions.slice(-1)[0].file : undefined) === file && (this.filePositions.slice(-1)[0] != null ? this.filePositions.slice(-1)[0].pos[1] : undefined) === pos[1] - 1)
        {
            this.filePositions.pop()
        }
        this.filePositions.push({file:file,pos:pos,line:pos[1] + 1,column:pos[0],name:filePos,text:slash.file(filePos)})
        while (this.filePositions.length > prefs.get('navigateHistoryLength',100))
        {
            this.filePositions.shift()
        }
        console.log('setFilePositions',this.filePositions)
        return prefs.set('filePositions',this.filePositions)
    }

    navigate (opt)
    {
        var hasFile, _108_39_, _98_30_, _98_45_

        switch (opt.action)
        {
            case 'clear':
                this.filePositions = []
                return this.currentIndex = -1

            case 'backward':
                if (!this.filePositions.length)
                {
                    return
                }
                this.currentIndex = _k_.clamp(0,Math.max(0,this.filePositions.length - 2),this.currentIndex - 1)
                this.navigating = true
                return this.loadFilePos(this.filePositions[this.currentIndex],opt)

            case 'forward':
                if (!this.filePositions.length)
                {
                    return
                }
                this.currentIndex = _k_.clamp(0,this.filePositions.length - 1,this.currentIndex + 1)
                this.navigating = true
                return this.loadFilePos(this.filePositions[this.currentIndex],opt)

            case 'delFilePos':
                opt.item.line = ((_98_30_=opt.item.line) != null ? _98_30_ : (opt.item.pos != null ? opt.item.pos[1] : undefined) + 1)
                this.filePositions = this.filePositions.filter(function (f)
                {
                    return f.file !== opt.item.file || f.line !== opt.item.line
                })
                this.currentIndex = _k_.clamp(0,this.filePositions.length - 1,this.currentIndex)
                return post.toWins('navigateHistoryChanged',this.filePositions,this.currentIndex)

            case 'addFilePos':
                console.log('addFilePos',opt)
                if (!(opt != null ? (_108_39_=opt.file) != null ? _108_39_.length : undefined : undefined))
                {
                    return
                }
                this.addToHistory(opt.oldFile,opt.oldPos)
                hasFile = this.filePositions.find(function (v)
                {
                    return v.file === opt.file
                })
                if (!this.navigating || !hasFile || _k_.in((opt != null ? opt.for : undefined),['edit','goto']))
                {
                    if (_k_.in((opt != null ? opt.for : undefined),['edit','goto']))
                    {
                        this.navigating = false
                    }
                    this.addToHistory(opt.file,opt.pos)
                    this.currentIndex = this.filePositions.length - 1
                    if ((opt != null ? opt.for : undefined) === 'goto')
                    {
                        post.toWins('navigateHistoryChanged',this.filePositions,this.currentIndex)
                        return this.loadFilePos(this.filePositions[this.currentIndex],opt)
                    }
                    else
                    {
                        this.currentIndex = this.filePositions.length
                        return post.toWins('navigateHistoryChanged',this.filePositions,this.currentIndex)
                    }
                }
                break
        }

    }

    loadFilePos (filePos, opt)
    {
        if ((opt != null ? opt.newWindow : undefined))
        {
            console.log('navigate new window with file not implemented!')
        }
        else
        {
            post.emit('loadFile',`${filePos.file}:${filePos.pos[1] + 1}:${filePos.pos[0]}`)
        }
        return filePos
    }

    delFilePos (item)
    {
        return post.emit('navigate',{action:'delFilePos',item:item})
    }

    addFilePos (opt)
    {
        opt.action = 'addFilePos'
        opt.for = 'edit'
        return post.emit('navigate',opt)
    }

    gotoFilePos (opt)
    {
        opt.action = 'addFilePos'
        opt.for = 'goto'
        return post.emit('navigate',opt)
    }

    backward ()
    {
        return post.emit('navigate',{action:'backward'})
    }

    forward ()
    {
        return post.emit('navigate',{action:'forward'})
    }

    clear ()
    {
        return post.emit('navigate',{action:'clear'})
    }
}

export default Navigate;