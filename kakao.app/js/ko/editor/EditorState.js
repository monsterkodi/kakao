var _k_ = {isArr: function (o) {return Array.isArray(o)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var EditorState

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let immutable = kxk.immutable


EditorState = (function ()
{
    function EditorState (stateOrLines = [])
    {
        this.lineCache = []
        if (immutable.isImmutable(stateOrLines))
        {
            this.s = stateOrLines
        }
        else if (_k_.isArr(stateOrLines))
        {
            this.s = this.stateForLines(stateOrLines)
        }
    }

    EditorState.prototype["stateForLines"] = function (lineStrings)
    {
        var lineId, lineIndex, lines, lineString, linkId, links, mcy, nextLinkId

        lineId = 0
        linkId = 0
        lines = {}
        links = {'-1':[-1,linkId]}
        var list = _k_.list(lineStrings)
        for (lineIndex = 0; lineIndex < list.length; lineIndex++)
        {
            lineString = list[lineIndex]
            nextLinkId = (lineIndex < lineStrings.length - 1 ? linkId + 1 : null)
            lines[lineId] = lineString
            links[linkId] = [lineId,nextLinkId]
            linkId++
            lineId++
        }
        mcy = (lineId ? 0 : -1)
        return immutable({lineId:lineId,linkId:linkId,lines:lines,links:links,numLines:lineId,numOriginal:lineId,cursors:[[0,mcy]],selections:[],highlights:[],main:0})
    }

    EditorState.prototype["next"] = function (link)
    {
        if (!_k_.empty((link != null ? link[1] : undefined)))
        {
            return this.s.links[link[1]]
        }
    }

    EditorState.prototype["traverse"] = function (cb)
    {
        var lineIndex, next, prev

        lineIndex = 0
        prev = next = this.s.links['-1']
        while (next = this.next(prev))
        {
            if (!cb(lineIndex,next[0],prev[1]))
            {
                return
            }
            prev = next
            lineIndex++
        }
    }

    EditorState.prototype["line"] = function (i)
    {
        var l, li

        if (this.lineCache[i])
        {
            return this.lineCache[i]
        }
        l = null
        li = -1
        this.traverse((function (lineIndex, lineId, linkId)
        {
            l = this.s.lines[lineId]
            li = lineIndex
            return li < i
        }).bind(this))
        if (li === i)
        {
            this.lineCache[i] = kstr.detab(l)
        }
        else
        {
            console.log(`line ${i} traverse mismatch?`,li)
        }
        return this.lineCache[i]
    }

    EditorState.prototype["lines"] = function ()
    {
        var l

        l = []
        this.traverse((function (lineIndex, lineId, linkId)
        {
            l.push(this.s.lines[lineId])
            return true
        }).bind(this))
        return l
    }

    EditorState.prototype["seek"] = function (i)
    {
        var info, prev

        i = _k_.max(0,i)
        info = {}
        prev = null
        this.traverse((function (lineIndex, lineId, linkId)
        {
            info = {lineIndex:lineIndex,lineId:lineId,linkId:linkId,prev:prev}
            prev = linkId
            return lineIndex < i
        }).bind(this))
        return info
    }

    EditorState.prototype["seekLast"] = function ()
    {
        return this.seek(Infinity)
    }

    EditorState.prototype["deleteLine"] = function (i)
    {
        var info, s

        info = this.seek(i)
        if (info.lineIndex !== i)
        {
            return this
        }
        s = this.s
        if (!_k_.empty(info.prev))
        {
            s = s.setIn(['links',info.prev],[s.links[info.prev][0],s.links[info.linkId][1]])
        }
        s = s.setIn(['links',info.linkId])
        s = s.set('numLines',s.numLines - 1)
        return new EditorState(s)
    }

    EditorState.prototype["changeLine"] = function (i, t)
    {
        var info

        info = this.seek(i)
        return new EditorState(this.s.setIn(['lines',info.lineId],t))
    }

    EditorState.prototype["insertLine"] = function (i, t)
    {
        var info, s

        info = this.seek(i)
        s = this.s
        s = s.setIn(['lines',s.lineId],t)
        if (info.lineIndex >= i)
        {
            s = s.setIn(['links',s.linkId],[s.lineId,info.linkId])
            if (!_k_.empty(info.prev))
            {
                s = s.setIn(['links',info.prev],[s.links[info.prev][0],s.linkId])
            }
            else
            {
                s = s.setIn(['links','-1'],[-1,s.linkId])
            }
        }
        else
        {
            s = s.setIn(['links',s.linkId],[s.lineId,null])
            if (!_k_.empty(info))
            {
                s = s.setIn(['links',info.linkId],[s.links[info.linkId][0],s.linkId])
            }
        }
        s = s.set('lineId',s.lineId + 1)
        s = s.set('linkId',s.linkId + 1)
        s = s.set('numLines',s.numLines + 1)
        return new EditorState(s)
    }

    EditorState.prototype["appendLine"] = function (t)
    {
        return this.insertLine(Infinity,t)
    }

    EditorState.prototype["text"] = function (n = '\n')
    {
        return this.lines().join(n)
    }

    EditorState.prototype["tabline"] = function (i)
    {
        return this.lines()[i]
    }

    EditorState.prototype["cursors"] = function ()
    {
        return this.s.cursors.asMutable({deep:true})
    }

    EditorState.prototype["highlights"] = function ()
    {
        return this.s.highlights.asMutable({deep:true})
    }

    EditorState.prototype["selections"] = function ()
    {
        return this.s.selections.asMutable({deep:true})
    }

    EditorState.prototype["main"] = function ()
    {
        return this.s.main
    }

    EditorState.prototype["cursor"] = function (i)
    {
        return (this.s.cursors[i] != null ? this.s.cursors[i].asMutable({deep:true}) : undefined)
    }

    EditorState.prototype["selection"] = function (i)
    {
        return (this.s.selections[i] != null ? this.s.selections[i].asMutable({deep:true}) : undefined)
    }

    EditorState.prototype["highlight"] = function (i)
    {
        return (this.s.highlights[i] != null ? this.s.highlights[i].asMutable({deep:true}) : undefined)
    }

    EditorState.prototype["numLines"] = function ()
    {
        return this.s.numLines
    }

    EditorState.prototype["numCursors"] = function ()
    {
        return this.s.cursors.length
    }

    EditorState.prototype["numSelections"] = function ()
    {
        return this.s.selections.length
    }

    EditorState.prototype["numHighlights"] = function ()
    {
        return this.s.highlights.length
    }

    EditorState.prototype["mainCursor"] = function ()
    {
        return this.s.cursors[this.s.main].asMutable({deep:true})
    }

    EditorState.prototype["lineState"] = function (s)
    {
        var ns

        ns = new EditorState(s)
        ns.lineCache = this.lineCache
        return ns
    }

    EditorState.prototype["setSelections"] = function (s)
    {
        return this.lineState(this.s.set('selections',s))
    }

    EditorState.prototype["setHighlights"] = function (h)
    {
        return this.lineState(this.s.set('highlights',h))
    }

    EditorState.prototype["setCursors"] = function (c)
    {
        return this.lineState(this.s.set('cursors',c))
    }

    EditorState.prototype["setMain"] = function (m)
    {
        return this.lineState(this.s.set('main',m))
    }

    EditorState.prototype["addHighlight"] = function (h)
    {
        var m

        m = this.s.highlights.asMutable()
        m.push(h)
        return this.lineState(this.s.set('highlights',m))
    }

    return EditorState
})()

export default EditorState;