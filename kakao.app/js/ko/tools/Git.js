var _k_ = {first: function (o) {return o != null ? o.length ? o[0] : undefined : o}}

var Git


Git = (function ()
{
    function Git ()
    {}

    Git["diff"] = async function (file)
    {
        var after, afterSplit, before, change, diff, i, info, line, lines, newLines, numNew, numOld, oldLines, x, _28_55_, _29_48_

        console.log('Git.diff',file)
        diff = await kakao('app.sh','/usr/bin/git','--no-pager','diff','--no-color','-U0',file)
        console.log('Git.diff',diff)
        info = {file:file,changes:[]}
        lines = diff.split('\n')
        while (line = lines.shift())
        {
            if (line.startsWith('@@'))
            {
                var _25_35_ = line.split(' '); x = _25_35_[0]; before = _25_35_[1]; after = _25_35_[2]

                afterSplit = after.split(',')
                numOld = parseInt(((_28_55_=before.split(',')[1]) != null ? _28_55_ : 1))
                numNew = parseInt(((_29_48_=afterSplit[1]) != null ? _29_48_ : 1))
                change = {line:parseInt(afterSplit[0])}
                oldLines = []
                for (var _33_26_ = i = 0, _33_30_ = numOld; (_33_26_ <= _33_30_ ? i < numOld : i > numOld); (_33_26_ <= _33_30_ ? ++i : --i))
                {
                    oldLines.push(lines.shift().slice(1))
                }
                while (_k_.first(lines)[0] === '\\')
                {
                    lines.shift()
                }
                newLines = []
                for (var _38_26_ = i = 0, _38_30_ = numNew; (_38_26_ <= _38_30_ ? i < numNew : i > numNew); (_38_26_ <= _38_30_ ? ++i : --i))
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
                    for (var _47_30_ = i = 0, _47_34_ = Math.min(numOld,numNew); (_47_30_ <= _47_34_ ? i < Math.min(numOld,numNew) : i > Math.min(numOld,numNew)); (_47_30_ <= _47_34_ ? ++i : --i))
                    {
                        change.mod.push({old:change.old[i],new:change.new[i]})
                    }
                }
                if (numOld > numNew)
                {
                    change.del = []
                    for (var _52_30_ = i = numNew, _52_39_ = numOld; (_52_30_ <= _52_39_ ? i < numOld : i > numOld); (_52_30_ <= _52_39_ ? ++i : --i))
                    {
                        change.del.push({old:change.old[i]})
                    }
                }
                else if (numNew > numOld)
                {
                    change.add = []
                    for (var _57_30_ = i = numOld, _57_39_ = numNew; (_57_30_ <= _57_39_ ? i < numNew : i > numNew); (_57_30_ <= _57_39_ ? ++i : --i))
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