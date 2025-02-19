var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var edit

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let kseg = kxk.kseg

import prof from "./prof.js"


edit = (function ()
{
    function edit ()
    {}

    edit["insertTextAtPositions"] = function (lines, text, posl)
    {
        var after, before, idx, indent, insertLineIndex, insl, lidx, line, newls, newpl, pos, posLineIndent, rng, rngs, txtls, x, y

        if (_k_.empty(text))
        {
            return [lines,posl]
        }
        if (text === '\t')
        {
            pos = posl[0]
            text = _k_.lpad(4 - pos[0] % 4,' ')
        }
        text = kstr.detab(text)
        txtls = this.linesForText(text)
        newls = []
        newpl = []
        rngs = this.rangesForLinePositions(lines,posl)
        var list = _k_.list(rngs)
        for (idx = 0; idx < list.length; idx++)
        {
            rng = list[idx]
            after = this.linesForRange(lines,rng)
            if (idx > 0)
            {
                var _b_ = posl[idx - 1]; x = _b_[0]; y = _b_[1]

                if (!_k_.empty(before))
                {
                    line = before.pop()
                }
                else
                {
                    line = newls.pop()
                }
                if (x > line.length)
                {
                    line = line.concat(_k_.lpad(x - line.length).split(''))
                }
                if (txtls.length > 1)
                {
                    if (posl.length > 1 && text !== '\n')
                    {
                        insertLineIndex = (idx - 1) % txtls.length
                        before.push(line.concat(txtls[insertLineIndex]))
                        newpl.push([_k_.last(before).length,newls.length + before.length - 1])
                        before.push(before.pop().concat(after.shift()))
                    }
                    else
                    {
                        posLineIndent = this.numIndent(line)
                        indent = kseg(_k_.lpad(posLineIndent))
                        before.push(line.concat(txtls[0]))
                        var list1 = _k_.list(txtls.slice(1))
                        for (lidx = 0; lidx < list1.length; lidx++)
                        {
                            insl = list1[lidx]
                            before.push(indent.concat(insl))
                        }
                        if (x > posLineIndent)
                        {
                            newpl.push([_k_.last(before).length,newls.length + before.length - 1])
                            before.push(before.pop().concat(after.shift()))
                        }
                        else
                        {
                            after.unshift(indent.concat(after.shift()))
                            if (text === '\n')
                            {
                                before.pop()
                            }
                            newpl.push([indent.length,newls.length + before.length])
                        }
                    }
                    newls = newls.concat(before)
                }
                else
                {
                    newpl.push([line.length + txtls[0].length,newls.length + before.length])
                    line = line.concat(txtls[0])
                    line = line.concat(after.shift())
                    newls = newls.concat(before)
                    newls.push(line)
                }
            }
            before = after
        }
        newls = newls.concat(before)
        return [newls,newpl]
    }

    edit["deleteLineRangesAndAdjustPositions"] = function (lines, rngs, posl)
    {
        var partialLast, ri, rng

        lines = _k_.copy(lines)
        posl = _k_.clone(posl)
        for (var _a_ = ri = rngs.length - 1, _b_ = 0; (_a_ <= _b_ ? ri <= 0 : ri >= 0); (_a_ <= _b_ ? ++ri : --ri))
        {
            rng = rngs[ri]
            if (rng[2] === 0 && rng[3] > rng[1])
            {
                rng = [rng[0],rng[1],lines[rng[3] - 1].length,rng[3] - 1]
            }
            posl = this.adjustPositionsForDeletedLineRange(posl,lines,rng)
            if (rng[1] === rng[3])
            {
                if (rng[0] === 0 && rng[2] === lines[rng[1]].length)
                {
                    lines.splice(rng[1],1)
                }
                else
                {
                    lines.splice(rng[1],1,lines[rng[1]].slice(0, typeof rng[0] === 'number' ? rng[0] : -1).concat(lines[rng[1]].slice(rng[2])))
                }
            }
            else
            {
                if (rng[2] === lines[rng[3]].length)
                {
                    lines.splice(rng[3],1)
                }
                else
                {
                    lines.splice(rng[3],1,lines[rng[3]].slice(rng[2]))
                    partialLast = true
                }
                if (rng[3] - rng[1] >= 2)
                {
                    lines.splice(rng[1] + 1,rng[3] - rng[1] - 1)
                }
                if (rng[0] === 0)
                {
                    lines.splice(rng[1],1)
                }
                else
                {
                    lines.splice(rng[1],1,lines[rng[1]].slice(0, typeof rng[0] === 'number' ? rng[0] : -1))
                    if (partialLast)
                    {
                        lines.splice(rng[1],2,lines[rng[1]] + lines[rng[1] + 1])
                    }
                }
            }
        }
        return [lines,posl]
    }

    edit["adjustPositionsForDeletedLineRange"] = function (posl, lines, rng)
    {
        var pi, pos

        for (var _a_ = pi = posl.length - 1, _b_ = 0; (_a_ <= _b_ ? pi <= 0 : pi >= 0); (_a_ <= _b_ ? ++pi : --pi))
        {
            pos = posl[pi]
            if (this.isPosTouchingRange(pos,rng))
            {
                pos[0] = rng[0]
                pos[1] = rng[1]
            }
            else if (this.isPosAfterRange(pos,rng))
            {
                if (pos[1] === rng[3])
                {
                    pos[0] -= rng[2] - rng[0]
                    if (rng[1] < rng[3])
                    {
                        pos[1] -= rng[3] - rng[1]
                    }
                }
                else
                {
                    pos[1] -= this.numFullLinesInRange(lines,rng)
                }
            }
            else
            {
                break
            }
        }
        return this.removeDuplicatePositions(posl)
    }

    edit["moveCursorsInSameLineBy"] = function (cursors, cursor, delta)
    {
        var ci

        ci = cursors.indexOf(cursor)
        while (true)
        {
            cursors[ci][0] += delta
            ci++
            if (ci >= cursors.length)
            {
                return
            }
            if (cursors[ci][1] > cursor[1])
            {
                return
            }
        }
    }

    edit["addLinesBelowPositionsToRanges"] = function (lines, posl, rngs)
    {
        var addLineAtIndex, c, newp, newr

        newp = []
        newr = _k_.copy(rngs)
        addLineAtIndex = (function (c, i)
        {
            var range

            range = this.rangeOfLine(lines,i)
            if (this.isEmptyRange(range))
            {
                range[1] += 1
            }
            newr.push(range)
            return newp.push(this.endOfRange(range))
        }).bind(this)
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            if (!this.rangesContainLine(rngs,c[1]))
            {
                addLineAtIndex(c,c[1])
            }
            else
            {
                if (c[1] < lines.length - 1)
                {
                    addLineAtIndex(c,c[1] + 1)
                }
            }
        }
        return [newp,newr]
    }

    edit["removeLinesAtPositionsFromRanges"] = function (lines, posl, rngs)
    {
        var idx, newp, newr, pos, rng

        newp = []
        newr = this.splitLineRanges(lines,rngs)
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            if (rng = this.rangeInRangesTouchingPos(newr,pos))
            {
                idx = newr.indexOf(rng)
                if (idx > 0)
                {
                    newp.push(this.endOfRange(newr[idx - 1]))
                }
                else
                {
                    newp.push(this.endOfRange(newr[idx]))
                }
                newr.splice(idx,1)
            }
            else
            {
                newp.push(pos)
            }
        }
        return [newp,newr]
    }

    edit["rangeForJoiningLine"] = function (lines, idx)
    {
        return [lines[idx].length,idx,0,idx + 1]
    }

    edit["rangesForJoiningLines"] = function (lines, idxs)
    {
        return idxs.map(function (idx)
        {
            return this.rangeForJoiningLine(lines,idx)
        })
    }

    edit["moveLineRangesAndPositionsAtIndicesInDirection"] = function (lines, rngs, posl, indices, dir)
    {
        var d, ii, index, newLines, newPosl, newRngs, pos, re, rng, rs

        if (_k_.empty(indices) || dir === 'down' && indices.slice(-1)[0] >= lines.length - 1 || dir === 'up' && indices[0] <= 0)
        {
            return [lines,rngs,posl]
        }
        newLines = _k_.copy(lines)
        newRngs = _k_.copy(rngs)
        newPosl = _k_.copy(posl)
        var _a_ = ((function ()
        {
            switch (dir)
            {
                case 'down':
                    return [indices.length - 1,0]

                case 'up':
                    return [0,indices.length - 1]

            }

        }).bind(this))(); rs = _a_[0]; re = _a_[1]

        for (var _b_ = ii = rs, _c_ = re; (_b_ <= _c_ ? ii <= re : ii >= re); (_b_ <= _c_ ? ++ii : --ii))
        {
            index = indices[ii]
            switch (dir)
            {
                case 'down':
                    newLines.splice(index,2,newLines[index + 1],newLines[index])
                    break
                case 'up':
                    newLines.splice(index - 1,2,newLines[index],newLines[index - 1])
                    break
            }

            var list = _k_.list(newPosl)
            for (var _d_ = 0; _d_ < list.length; _d_++)
            {
                pos = list[_d_]
                if (pos[1] === index)
                {
                    pos[1] += ((function ()
                    {
                        switch (dir)
                        {
                            case 'down':
                                return 1

                            case 'up':
                                return -1

                        }

                    }).bind(this))()
                }
            }
            var list1 = _k_.list(newRngs)
            for (var _e_ = 0; _e_ < list1.length; _e_++)
            {
                rng = list1[_e_]
                if (rng[1] === index)
                {
                    d = ((function ()
                    {
                        switch (dir)
                        {
                            case 'down':
                                return 1

                            case 'up':
                                return -1

                        }

                    }).bind(this))()
                    rng[1] += d
                    rng[3] += d
                }
            }
        }
        return [newLines,newRngs,newPosl]
    }

    edit["toggleCommentsInLineRangesAtIndices"] = function (lines, rngs, posl, indices)
    {
        var comIndent, comment, comStart, d, indent, index, line, minIndent, newLine, newLines, newPosl, newRngs

        if (_k_.empty(indices))
        {
            return [lines,rngs,posl]
        }
        newLines = _k_.copy(lines)
        newRngs = _k_.copy(rngs)
        newPosl = _k_.copy(posl)
        comStart = '#'
        minIndent = Infinity
        var list = _k_.list(indices)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            index = list[_a_]
            var _b_ = this.splitLineIndent(newLines[index]); indent = _b_[0]; line = _b_[1]

            if (!kseg.startsWith(line,comStart))
            {
                comment = comStart
                minIndent = _k_.min(indent.length,minIndent)
            }
        }
        if (comment)
        {
            comIndent = kseg.repeat(minIndent)
        }
        var list1 = _k_.list(indices)
        for (var _c_ = 0; _c_ < list1.length; _c_++)
        {
            index = list1[_c_]
            var _d_ = this.splitLineIndent(newLines[index]); indent = _d_[0]; line = _d_[1]

            if (comment)
            {
                indent = kseg.repeat(indent.length - minIndent)
                newLine = kseg.join(comIndent,comment,indent,' ',line)
            }
            else
            {
                d = (line[comStart.length] === ' ' ? 1 : 0)
                newLine = kseg.join(indent,line.slice(comStart.length + d))
            }
            newLines.splice(index,1,newLine)
        }
        return [newLines,newRngs,newPosl]
    }

    edit["deindentLineRangesAndPositionsAtIndices"] = function (lines, rngs, posl, indices)
    {
        var indent, index, line, newLines, newPosl, newRngs, pos, rng, sc

        if (_k_.empty(indices))
        {
            return [lines,rngs,posl]
        }
        newLines = _k_.copy(lines)
        newRngs = _k_.copy(rngs)
        newPosl = _k_.copy(posl)
        var list = _k_.list(indices)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            index = list[_a_]
            var _b_ = this.splitLineIndent(newLines[index]); indent = _b_[0]; line = _b_[1]

            if (indent.length)
            {
                sc = _k_.min(4,indent.length)
                newLines.splice(index,1,indent.slice(sc) + line)
                var list1 = _k_.list(newPosl)
                for (var _c_ = 0; _c_ < list1.length; _c_++)
                {
                    pos = list1[_c_]
                    if (pos[1] === index)
                    {
                        pos[0] = _k_.max(0,pos[0] - sc)
                    }
                }
                var list2 = _k_.list(newRngs)
                for (var _d_ = 0; _d_ < list2.length; _d_++)
                {
                    rng = list2[_d_]
                    if (rng[1] === index)
                    {
                        rng[0] = _k_.max(0,rng[0] - sc)
                        rng[2] = _k_.max(0,rng[2] - sc)
                    }
                }
            }
        }
        return [newLines,newRngs,newPosl]
    }

    edit["indentLineRangesAndPositionsAtIndices"] = function (lines, rngs, posl, indices)
    {
        var indent, index, line, newLines, newPosl, newRngs, pos, rng

        if (_k_.empty(indices))
        {
            return [lines,rngs,posl]
        }
        newLines = _k_.copy(lines)
        newRngs = _k_.copy(rngs)
        newPosl = _k_.copy(posl)
        var list = _k_.list(indices)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            index = list[_a_]
            var _b_ = this.splitLineIndent(newLines[index]); indent = _b_[0]; line = _b_[1]

            newLines[index] = _k_.lpad(4,' ') + newLines[index]
            var list1 = _k_.list(newPosl)
            for (var _c_ = 0; _c_ < list1.length; _c_++)
            {
                pos = list1[_c_]
                if (pos[1] === index)
                {
                    pos[0] += 4
                }
            }
            var list2 = _k_.list(newRngs)
            for (var _d_ = 0; _d_ < list2.length; _d_++)
            {
                rng = list2[_d_]
                if (rng[1] === index)
                {
                    rng[0] += 4
                    rng[2] += 4
                }
            }
        }
        return [newLines,newRngs,newPosl]
    }

    edit["extendLineRangesFromPositionToPosition"] = function (lines, rngs, start, pos)
    {
        var newRngs, rng

        if (_k_.empty(rngs))
        {
            return [this.rangeFromStartToEnd(start,pos)]
        }
        newRngs = _k_.copy(rngs)
        if (rng = this.rangeInRangesTouchingPos(newRngs,start))
        {
            if (this.isPosAfterRange(pos,rng))
            {
                rng[2] = pos[0]
                rng[3] = pos[1]
            }
            else if (this.isPosBeforeRange(pos,rng))
            {
                rng[0] = pos[0]
                rng[1] = pos[1]
            }
        }
        else
        {
            newRngs.push(this.rangeFromStartToEnd(start,pos))
        }
        return newRngs
    }

    edit["extendLineRangesByMovingPositionsInDirection"] = function (lines, rngs, posl, dir, opt)
    {
        var ind, line, nc, newPosl, newRngs, pos, rng

        newRngs = _k_.copy(rngs)
        newPosl = _k_.copy(posl)
        var list = _k_.list(newPosl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            line = lines[pos[1]]
            rng = [pos[0],pos[1],pos[0],pos[1]]
            newRngs.push(rng)
            switch (dir)
            {
                case 'left':
                case 'right':
                    nc = this.numCharsFromPosToWordOrPunctInDirection(lines,pos,dir,opt)
                    pos[0] += nc
                    break
                case 'up':
                    pos[1] -= 1
                    break
                case 'down':
                    pos[1] += 1
                    break
                case 'eol':
                    pos[0] = line.length
                    break
                case 'bol':
                    pos[0] = 0
                    break
                case 'bof':
                    pos[0] = 0
                    pos[1] = 0
                    break
                case 'eof':
                    pos[1] = lines.length - 1
                    pos[0] = lines[lines.length - 1].length
                    break
                case 'ind_bol':
                    ind = this.numIndent(line)
                    pos[0] = (pos[0] > ind ? ind : 0)
                    break
                case 'ind_eol':
                    ind = this.numIndent(line)
                    pos[0] = (pos[0] < ind ? ind : line.length)
                    break
            }

            switch (dir)
            {
                case 'left':
                    rng[0] = rng[0] + nc
                    break
                case 'right':
                    rng[2] = rng[2] + nc
                    break
                case 'up':
                    rng[1] = _k_.max(0,rng[1] - 1)
                    break
                case 'down':
                    rng[3] = _k_.min(lines.length - 1,rng[3] + 1)
                    break
                case 'eol':
                    rng[2] = Infinity
                    break
                case 'bol':
                    rng[0] = 0
                    break
                case 'bof':
                    rng[1] = rng[0] = 0
                    break
                case 'eof':
                    rng[3] = lines.length - 1
                    rng[2] = lines[lines.length - 1].length
                    break
                case 'ind_bol':
                    ind = this.numIndent(line)
                    rng[0] = (rng[0] > ind ? ind : 0)
                    break
                case 'ind_eol':
                    ind = this.numIndent(line)
                    rng[2] = (rng[2] < ind ? ind : line.length)
                    break
            }

            if (rng[1] < lines.length)
            {
                rng[0] = _k_.clamp(0,lines[rng[1]].length,rng[0])
            }
            if (rng[3] < lines.length)
            {
                rng[2] = _k_.clamp(0,lines[rng[3]].length,rng[2])
            }
        }
        return [newRngs,newPosl]
    }

    return edit
})()

export default edit;