var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}}

var Git

import slash from "../../kxk/slash.js"


Git = (function ()
{
    function Git ()
    {}

    Git["status"] = async function (file)
    {
        var dirSet, gitDir, header, info, key, line, lines, rel, status

        gitDir = await kakao('fs.git',file)
        status = await kakao('app.sh','/usr/bin/git','status','--porcelain',gitDir)
        console.log('Git.status',gitDir,status)
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
        for (var _48_16_ = 0; _48_16_ < list.length; _48_16_++)
        {
            key = list[_48_16_]
            var list1 = _k_.list(info[key])
            for (var _49_21_ = 0; _49_21_ < list1.length; _49_21_++)
            {
                file = list1[_49_21_]
                info.files[file] = key
            }
        }
        console.log('Git.status info',info)
        return info
    }

    Git["diff"] = async function (file)
    {
        var after, afterSplit, before, change, diff, i, info, line, lines, newLines, numNew, numOld, oldLines, x, _73_55_, _74_48_

        diff = await kakao('app.sh','/usr/bin/git','--no-pager','diff','--no-color','-U0',file)
        info = {file:file,changes:[]}
        lines = diff.split('\n')
        while (line = lines.shift())
        {
            if (line.startsWith('@@'))
            {
                var _70_35_ = line.split(' '); x = _70_35_[0]; before = _70_35_[1]; after = _70_35_[2]

                afterSplit = after.split(',')
                numOld = parseInt(((_73_55_=before.split(',')[1]) != null ? _73_55_ : 1))
                numNew = parseInt(((_74_48_=afterSplit[1]) != null ? _74_48_ : 1))
                change = {line:parseInt(afterSplit[0])}
                oldLines = []
                for (var _78_26_ = i = 0, _78_30_ = numOld; (_78_26_ <= _78_30_ ? i < numOld : i > numOld); (_78_26_ <= _78_30_ ? ++i : --i))
                {
                    oldLines.push(lines.shift().slice(1))
                }
                while (_k_.first(lines)[0] === '\\')
                {
                    lines.shift()
                }
                newLines = []
                for (var _83_26_ = i = 0, _83_30_ = numNew; (_83_26_ <= _83_30_ ? i < numNew : i > numNew); (_83_26_ <= _83_30_ ? ++i : --i))
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
                    for (var _92_30_ = i = 0, _92_34_ = Math.min(numOld,numNew); (_92_30_ <= _92_34_ ? i < Math.min(numOld,numNew) : i > Math.min(numOld,numNew)); (_92_30_ <= _92_34_ ? ++i : --i))
                    {
                        change.mod.push({old:change.old[i],new:change.new[i]})
                    }
                }
                if (numOld > numNew)
                {
                    change.del = []
                    for (var _97_30_ = i = numNew, _97_39_ = numOld; (_97_30_ <= _97_39_ ? i < numOld : i > numOld); (_97_30_ <= _97_39_ ? ++i : --i))
                    {
                        change.del.push({old:change.old[i]})
                    }
                }
                else if (numNew > numOld)
                {
                    change.add = []
                    for (var _102_30_ = i = numOld, _102_39_ = numNew; (_102_30_ <= _102_39_ ? i < numNew : i > numNew); (_102_30_ <= _102_39_ ? ++i : --i))
                    {
                        change.add.push({new:change.new[i]})
                    }
                }
                info.changes.push(change)
            }
        }
        console.log('Git.diff',info)
        return info
    }

    return Git
})()

export default Git;