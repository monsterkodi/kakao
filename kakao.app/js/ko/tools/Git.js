var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}}

var Git

import kxk from "../../kxk.js"
let slash = kxk.slash
let post = kxk.post
let kermit = kxk.kermit


Git = (function ()
{
    Git["statusRequests"] = {}
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
        for (var _29_19_ = 0; _29_19_ < list.length; _29_19_++)
        {
            gitDir = list[_29_19_]
            if (file.startsWith(gitDir))
            {
                if (slash.dir(file).endsWith('.git/refs/heads'))
                {
                    if (_k_.in(slash.name(file),['master','main']))
                    {
                        Git.status(gitDir)
                        return
                    }
                }
            }
        }
    }

    Git["status"] = async function (file)
    {
        var dirSet, gitDir, gitStatus, header, key, line, lines, rel, status

        gitDir = await kakao('fs.git',file)
        status = {gitDir:gitDir,changed:[],deleted:[],added:[],files:{}}
        if (_k_.empty(gitDir) || this.statusRequests[gitDir])
        {
            return status
        }
        this.statusRequests[gitDir] = true
        gitStatus = await kakao('app.sh','/usr/bin/git',{arg:'status --porcelain',cwd:gitDir})
        delete this.statusRequests[gitDir]
        if (gitStatus.startsWith('fatal:'))
        {
            return status
        }
        lines = gitStatus.split('\n')
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
                    status.deleted.push(file)
                    break
                case 'MM':
                case ' M':
                    status.changed.push(file)
                    break
                case '??':
                    status.added.push(file)
                    break
            }

        }
        status.dirs = Array.from(dirSet).map(function (d)
        {
            return slash.path(gitDir,d)
        })
        var list = ['changed','added','deleted']
        for (var _82_16_ = 0; _82_16_ < list.length; _82_16_++)
        {
            key = list[_82_16_]
            var list1 = _k_.list(status[key])
            for (var _83_21_ = 0; _83_21_ < list1.length; _83_21_++)
            {
                file = list1[_83_21_]
                status.files[file] = key
            }
        }
        post.emit('gitStatus',status)
        return status
    }

    Git["diff"] = async function (file)
    {
        var after, afterSplit, before, change, diff, gitDir, i, line, lines, newLines, numNew, numOld, oldLines, status, x, _111_55_, _112_48_

        gitDir = await kakao('fs.git',file)
        diff = await kakao('app.sh','/usr/bin/git',{arg:`--no-pager diff --no-color -U0 --ignore-blank-lines ${file}`,cwd:gitDir})
        status = {file:file,changes:[]}
        lines = diff.split('\n')
        while (line = lines.shift())
        {
            if (line.startsWith('@@'))
            {
                var _108_35_ = line.split(' '); x = _108_35_[0]; before = _108_35_[1]; after = _108_35_[2]

                afterSplit = after.split(',')
                numOld = parseInt(((_111_55_=before.split(',')[1]) != null ? _111_55_ : 1))
                numNew = parseInt(((_112_48_=afterSplit[1]) != null ? _112_48_ : 1))
                change = {line:parseInt(afterSplit[0])}
                oldLines = []
                for (var _116_26_ = i = 0, _116_30_ = numOld; (_116_26_ <= _116_30_ ? i < numOld : i > numOld); (_116_26_ <= _116_30_ ? ++i : --i))
                {
                    oldLines.push(lines.shift().slice(1))
                }
                while (_k_.first(lines)[0] === '\\')
                {
                    lines.shift()
                }
                newLines = []
                for (var _121_26_ = i = 0, _121_30_ = numNew; (_121_26_ <= _121_30_ ? i < numNew : i > numNew); (_121_26_ <= _121_30_ ? ++i : --i))
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
                    for (var _130_30_ = i = 0, _130_34_ = Math.min(numOld,numNew); (_130_30_ <= _130_34_ ? i < Math.min(numOld,numNew) : i > Math.min(numOld,numNew)); (_130_30_ <= _130_34_ ? ++i : --i))
                    {
                        change.mod.push({old:change.old[i],new:change.new[i]})
                    }
                }
                if (numOld > numNew)
                {
                    change.del = []
                    for (var _135_30_ = i = numNew, _135_39_ = numOld; (_135_30_ <= _135_39_ ? i < numOld : i > numOld); (_135_30_ <= _135_39_ ? ++i : --i))
                    {
                        change.del.push({old:change.old[i]})
                    }
                }
                else if (numNew > numOld)
                {
                    change.add = []
                    for (var _140_30_ = i = numOld, _140_39_ = numNew; (_140_30_ <= _140_39_ ? i < numNew : i > numNew); (_140_30_ <= _140_39_ ? ++i : --i))
                    {
                        change.add.push({new:change.new[i]})
                    }
                }
                status.changes.push(change)
            }
        }
        return status
    }

    Git["history"] = async function (path)
    {
        var args, gitDir, history

        if (path)
        {
            args = ["--no-pager","log","--name-status","--no-color",path]
            history = await kakao('app.sh','/usr/bin/git',{args:args,cwd:slash.dir(path)})
        }
        else
        {
            gitDir = await kakao('fs.git',editor.currentFile)
            args = ["--no-pager","log","--name-status","--no-color",'.']
            history = await kakao('app.sh','/usr/bin/git',{args:args,cwd:kakao.bundle.path})
        }
        return kermit(`commit  ●commit
Author: ●author
Date:   ●date
●msg
■files
    ●type ●path`,history)
    }

    return Git
})()

export default Git;