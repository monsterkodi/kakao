var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}}

var Git

import slash from "../../kxk/slash.js"

import post from "../../kxk/post.js"


Git = (function ()
{
    function Git ()
    {
        this["onFileChanged"] = this["onFileChanged"].bind(this)
        this["onProjectIndexed"] = this["onProjectIndexed"].bind(this)
        this.gitDirs = []
        post.on('projectIndexed',this.onProjectIndexed)
        post.on('fileChanged',this.onFileChanged)
    }

    Git.prototype["onProjectIndexed"] = function (prjPath)
    {
        return kakao('fs.git',prjPath).then((function (gitDir)
        {
            if (!_k_.empty(gitDir) && !(_k_.in(gitDir,this.gitDirs)))
            {
                return this.gitDirs.push(slash.path(gitDir,'.git'))
            }
        }).bind(this))
    }

    Git.prototype["onFileChanged"] = function (file)
    {
        var gitDir

        var list = _k_.list(this.gitDirs)
        for (var _28_19_ = 0; _28_19_ < list.length; _28_19_++)
        {
            gitDir = list[_28_19_]
            if (file.startsWith(gitDir))
            {
                if (slash.dir(file).endsWith('refs/heads'))
                {
                    if (_k_.in(slash.name(file),['master','main']))
                    {
                        console.log('git ref changed:',file)
                        return
                    }
                }
            }
        }
    }

    Git["status"] = async function (file)
    {
        var dirSet, gitDir, header, info, key, line, lines, rel, status

        gitDir = await kakao('fs.git',file)
        status = await kakao('app.sh','/usr/bin/git','status','--porcelain',gitDir)
        if (status.startsWith('fatal:'))
        {
            return {}
        }
        lines = status.split('\n')
        info = {gitDir:gitDir,changed:[],deleted:[],added:[],files:{}}
        dirSet = new Set
        while (line = lines.shift())
        {
            rel = line.slice(3)
            file = slash.path(gitDir,line.slice(3))
            while ((rel = slash.dir(rel)) !== '')
            {
                dirSet.add(rel)
            }
            header = line.slice(0,2)
            switch (header)
            {
                case ' D':
                    info.deleted.push(file)
                    break
                case ' M':
                    info.changed.push(file)
                    break
                case '??':
                    info.added.push(file)
                    break
            }

        }
        info.dirs = Array.from(dirSet).map(function (d)
        {
            return slash.path(gitDir,d)
        })
        var list = ['changed','added','deleted']
        for (var _76_16_ = 0; _76_16_ < list.length; _76_16_++)
        {
            key = list[_76_16_]
            var list1 = _k_.list(info[key])
            for (var _77_21_ = 0; _77_21_ < list1.length; _77_21_++)
            {
                file = list1[_77_21_]
                info.files[file] = key
            }
        }
        return info
    }

    Git["diff"] = async function (file)
    {
        var after, afterSplit, before, change, diff, i, info, line, lines, newLines, numNew, numOld, oldLines, x, _107_55_, _108_48_

        diff = await kakao('app.sh','/usr/bin/git','--no-pager','diff','--no-color','-U0',file)
        info = {file:file,changes:[]}
        lines = diff.split('\n')
        while (line = lines.shift())
        {
            if (line.startsWith('@@'))
            {
                var _104_35_ = line.split(' '); x = _104_35_[0]; before = _104_35_[1]; after = _104_35_[2]

                afterSplit = after.split(',')
                numOld = parseInt(((_107_55_=before.split(',')[1]) != null ? _107_55_ : 1))
                numNew = parseInt(((_108_48_=afterSplit[1]) != null ? _108_48_ : 1))
                change = {line:parseInt(afterSplit[0])}
                oldLines = []
                for (var _112_26_ = i = 0, _112_30_ = numOld; (_112_26_ <= _112_30_ ? i < numOld : i > numOld); (_112_26_ <= _112_30_ ? ++i : --i))
                {
                    oldLines.push(lines.shift().slice(1))
                }
                while (_k_.first(lines)[0] === '\\')
                {
                    lines.shift()
                }
                newLines = []
                for (var _117_26_ = i = 0, _117_30_ = numNew; (_117_26_ <= _117_30_ ? i < numNew : i > numNew); (_117_26_ <= _117_30_ ? ++i : --i))
                {
                    newLines.push(lines.shift().slice(1))
                }
                while (_k_.first(lines)[0] === '\\')
                {
                    lines.shift()
                }
                if (oldLines.length)
                {
                    change.old = oldLines
                }
                if (newLines.length)
                {
                    change.new = newLines
                }
                if (numOld && numNew)
                {
                    change.mod = []
                    for (var _126_30_ = i = 0, _126_34_ = Math.min(numOld,numNew); (_126_30_ <= _126_34_ ? i < Math.min(numOld,numNew) : i > Math.min(numOld,numNew)); (_126_30_ <= _126_34_ ? ++i : --i))
                    {
                        change.mod.push({old:change.old[i],new:change.new[i]})
                    }
                }
                if (numOld > numNew)
                {
                    change.del = []
                    for (var _131_30_ = i = numNew, _131_39_ = numOld; (_131_30_ <= _131_39_ ? i < numOld : i > numOld); (_131_30_ <= _131_39_ ? ++i : --i))
                    {
                        change.del.push({old:change.old[i]})
                    }
                }
                else if (numNew > numOld)
                {
                    change.add = []
                    for (var _136_30_ = i = numOld, _136_39_ = numNew; (_136_30_ <= _136_39_ ? i < numNew : i > numNew); (_136_30_ <= _136_39_ ? ++i : --i))
                    {
                        change.add.push({new:change.new[i]})
                    }
                }
                info.changes.push(change)
            }
        }
        return info
    }

    return Git
})()

export default Git;