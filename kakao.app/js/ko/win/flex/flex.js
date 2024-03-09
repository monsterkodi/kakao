// monsterkodi/kode 0.256.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

import pane from "./pane.js"

import handle from "./handle.js"

class Flex
{
    constructor (opt)
    {
        var horz, p, _16_38_, _17_37_, _33_34_, _38_25_

        this.handleSize = ((_16_38_=opt.handleSize) != null ? _16_38_ : 6)
        this.direction = ((_17_37_=opt.direction) != null ? _17_37_ : 'horizontal')
        this.snapFirst = opt.snapFirst
        this.snapLast = opt.snapLast
        this.onPaneSize = opt.onPaneSize
        this.onDragStart = opt.onDragStart
        this.onDrag = opt.onDrag
        this.onDragEnd = opt.onDragEnd
        horz = this.direction === 'horizontal'
        this.dimension = horz && 'width' || 'height'
        this.clientDim = horz && 'clientWidth' || 'clientHeight'
        this.axis = horz && 'x' || 'y'
        this.position = horz && 'left' || 'top'
        this.handleClass = horz && 'split-handle split-handle-horizontal' || 'split-handle split-handle-vertical'
        this.paddingA = horz && 'paddingLeft' || 'paddingTop'
        this.paddingB = horz && 'paddingRight' || 'paddingBottom'
        this.cursor = ((_33_34_=opt.cursor) != null ? _33_34_ : horz && 'ew-resize' || 'ns-resize')
        this.panes = []
        this.handles = []
        this.view = ((_38_25_=opt.view) != null ? _38_25_ : opt.panes[0].div.parentNode)
        this.view.style.display = 'flex'
        this.view.style.flexDirection = horz && 'row' || 'column'
        if (!_k_.empty(opt.panes))
        {
            var list = _k_.list(opt.panes)
            for (var _43_29_ = 0; _43_29_ < list.length; _43_29_++)
            {
                p = list[_43_29_]
                this.addPane(p)
            }
        }
    }

    addPane (p)
    {
        var lastPane, newPane

        newPane = new pane(_.defaults(p,{flex:this,index:this.panes.length}))
        if (lastPane = _.last(this.panes))
        {
            this.handles.push(new handle({flex:this,index:lastPane.index,panea:lastPane,paneb:newPane}))
        }
        this.panes.push(newPane)
        return this.relax()
    }

    popPane (opt = {})
    {
        if ((opt != null ? opt.relax : undefined) === false)
        {
            this.unrelax()
        }
        if (this.panes.length > 1)
        {
            this.panes.pop().del()
            this.handles.pop().del()
        }
        if ((opt != null ? opt.relax : undefined) !== false)
        {
            return this.relax()
        }
        else
        {
            return _k_.last(this.panes).setSize(_k_.last(this.panes).actualSize())
        }
    }

    shiftPane ()
    {
        var i

        if (this.panes.length > 1)
        {
            this.panes.shift().del()
            this.handles.shift().del()
        }
        for (var _93_18_ = i = 0, _93_22_ = this.panes.length; (_93_18_ <= _93_22_ ? i < this.panes.length : i > this.panes.length); (_93_18_ <= _93_22_ ? ++i : --i))
        {
            this.panes[i].index = i
        }
        for (var _96_18_ = i = 0, _96_22_ = this.handles.length; (_96_18_ <= _96_22_ ? i < this.handles.length : i > this.handles.length); (_96_18_ <= _96_22_ ? ++i : --i))
        {
            this.handles[i].index = i
        }
        return this.relax()
    }

    relax ()
    {
        var p

        this.relaxed = true
        var list = _k_.list(this.visiblePanes())
        for (var _110_14_ = 0; _110_14_ < list.length; _110_14_++)
        {
            p = list[_110_14_]
            if (p.div)
            {
                p.div.style.flex = "1 1 0"
            }
            p.size = 0
        }
    }

    unrelax ()
    {
        var p

        this.relaxed = false
        var list = _k_.list(this.visiblePanes())
        for (var _117_14_ = 0; _117_14_ < list.length; _117_14_++)
        {
            p = list[_117_14_]
            p.size = p.actualSize()
        }
    }

    calculate ()
    {
        var avail, diff, flexPanes, h, p, visPanes, _147_19_

        visPanes = this.panes.filter(function (p)
        {
            return !p.collapsed
        })
        flexPanes = visPanes.filter(function (p)
        {
            return !p.fixed
        })
        avail = this.size()
        var list = _k_.list(this.handles)
        for (var _132_14_ = 0; _132_14_ < list.length; _132_14_++)
        {
            h = list[_132_14_]
            h.update()
            if (h.isVisible())
            {
                avail -= h.size()
            }
        }
        var list1 = _k_.list(visPanes)
        for (var _136_14_ = 0; _136_14_ < list1.length; _136_14_++)
        {
            p = list1[_136_14_]
            avail -= p.size
        }
        diff = avail / flexPanes.length
        var list2 = _k_.list(flexPanes)
        for (var _141_14_ = 0; _141_14_ < list2.length; _141_14_++)
        {
            p = list2[_141_14_]
            p.size += diff
        }
        var list3 = _k_.list(visPanes)
        for (var _144_14_ = 0; _144_14_ < list3.length; _144_14_++)
        {
            p = list3[_144_14_]
            p.setSize(p.size)
        }
        return (typeof this.onPaneSize === "function" ? this.onPaneSize() : undefined)
    }

    moveHandle (opt)
    {
        var handle

        handle = this.handles[opt.index]
        return this.moveHandleToPos(handle,opt.pos)
    }

    moveHandleToPos (handle, pos)
    {
        var deduct, leftOver, next, nextHandle, nextSize, nextVisFlex, offset, prev, prevHandle, prevSize, prevVisFlex, _169_36_, _169_59_, _170_36_, _170_59_, _178_21_, _197_20_, _219_19_

        pos = parseInt(pos)
        if (this.relaxed)
        {
            this.unrelax()
        }
        offset = pos - handle.actualPos()
        if (Math.abs(offset) < 1)
        {
            return
        }
        prev = ((_169_36_=this.prevAllInv(handle)) != null ? _169_36_ : ((_169_59_=this.prevVisFlex(handle)) != null ? _169_59_ : this.prevFlex(handle)))
        next = ((_170_36_=this.nextAllInv(handle)) != null ? _170_36_ : ((_170_59_=this.nextVisFlex(handle)) != null ? _170_59_ : this.nextFlex(handle)))
        delete prev.collapsed
        delete next.collapsed
        prevSize = prev.size + offset
        nextSize = next.size - offset
        if ((this.snapFirst != null) && prevSize < this.snapFirst && !this.prevVisPane(prev))
        {
            if (prevSize <= 0 || offset < this.snapFirst)
            {
                prevSize = -1
                nextSize = next.size + prev.size + this.handleSize
            }
        }
        else if (prevSize < 0)
        {
            leftOver = -prevSize
            prevHandle = handle.prev()
            while (leftOver > 0 && prevHandle && (prevVisFlex = this.prevVisFlex(prevHandle)))
            {
                deduct = Math.min(leftOver,prevVisFlex.size)
                leftOver -= deduct
                prevVisFlex.setSize(prevVisFlex.size - deduct)
                prevHandle = prevHandle.prev()
            }
            prevSize = 0
            nextSize -= leftOver
        }
        if ((this.snapLast != null) && nextSize < this.snapLast && !this.nextVisPane(next))
        {
            if (nextSize <= 0 || -offset < this.snapLast)
            {
                nextSize = -1
                prevSize = prev.size + next.size + this.handleSize
            }
        }
        else if (nextSize < 0)
        {
            leftOver = -nextSize
            nextHandle = handle.next()
            while (leftOver > 0 && nextHandle && (nextVisFlex = this.nextVisFlex(nextHandle)))
            {
                deduct = Math.min(leftOver,nextVisFlex.size)
                leftOver -= deduct
                nextVisFlex.setSize(nextVisFlex.size - deduct)
                nextHandle = nextHandle.next()
            }
            nextSize = 0
            prevSize -= leftOver
        }
        prev.setSize(prevSize)
        next.setSize(nextSize)
        this.update()
        return (typeof this.onPaneSize === "function" ? this.onPaneSize() : undefined)
    }

    restoreState (state)
    {
        var pane, s, si, _237_19_

        if (!(state != null ? state.length : undefined))
        {
            return
        }
        for (var _229_19_ = si = 0, _229_23_ = state.length; (_229_19_ <= _229_23_ ? si < state.length : si > state.length); (_229_19_ <= _229_23_ ? ++si : --si))
        {
            s = state[si]
            pane = this.pane(si)
            delete pane.collapsed
            if (s.size < 0)
            {
                pane.collapse()
            }
            if (s.size >= 0)
            {
                pane.setSize(s.size)
            }
        }
        this.updateHandles()
        return (typeof this.onPaneSize === "function" ? this.onPaneSize() : undefined)
    }

    getState ()
    {
        var p, state

        state = []
        var list = _k_.list(this.panes)
        for (var _241_14_ = 0; _241_14_ < list.length; _241_14_++)
        {
            p = list[_241_14_]
            state.push({id:p.id,size:p.size,pos:p.pos()})
        }
        return state
    }

    resized ()
    {
        return this.update().calculate()
    }

    update ()
    {
        return this.updatePanes().updateHandles()
    }

    updatePanes ()
    {
        var p

        var list = _k_.list(this.panes)
        for (var _257_39_ = 0; _257_39_ < list.length; _257_39_++)
        {
            p = list[_257_39_]
            p.update()
        }
        return this
    }

    updateHandles ()
    {
        var h

        var list = _k_.list(this.handles)
        for (var _258_39_ = 0; _258_39_ < list.length; _258_39_++)
        {
            h = list[_258_39_]
            h.update()
        }
        return this
    }

    handleStart (handle)
    {
        var _262_41_

        return (typeof this.onDragStart === "function" ? this.onDragStart() : undefined)
    }

    handleDrag (handle, drag)
    {
        var _265_15_

        this.moveHandleToPos(handle,drag.pos[this.axis] - this.pos() - 4)
        return (typeof this.onDrag === "function" ? this.onDrag() : undefined)
    }

    handleEnd ()
    {
        var _268_18_

        this.update()
        return (typeof this.onDragEnd === "function" ? this.onDragEnd() : undefined)
    }

    numPanes ()
    {
        return this.panes.length
    }

    visiblePanes ()
    {
        return this.panes.filter(function (p)
        {
            return p.isVisible()
        })
    }

    panePositions ()
    {
        var p

        return (function () { var r_278_40_ = []; var list = _k_.list(this.panes); for (var _278_40_ = 0; _278_40_ < list.length; _278_40_++)  { p = list[_278_40_];r_278_40_.push(p.pos())  } return r_278_40_ }).bind(this)()
    }

    paneSizes ()
    {
        var p

        return (function () { var r_279_39_ = []; var list = _k_.list(this.panes); for (var _279_39_ = 0; _279_39_ < list.length; _279_39_++)  { p = list[_279_39_];r_279_39_.push(p.size)  } return r_279_39_ }).bind(this)()
    }

    sizeOfPane (i)
    {
        return this.pane(i).size
    }

    posOfPane (i)
    {
        return this.pane(i).pos()
    }

    posOfHandle (i)
    {
        return this.handle(i).pos()
    }

    pane (i)
    {
        return _k_.isNum(i) && this.panes[i] || _k_.isStr(i) && _.find(this.panes,function (p)
        {
            return p.id === i
        }) || i
    }

    handle (i)
    {
        return _k_.isNum(i) && this.handles[i] || i
    }

    height ()
    {
        return this.view.getBoundingClientRect().height
    }

    size ()
    {
        return this.view.getBoundingClientRect()[this.dimension]
    }

    pos ()
    {
        return this.view.getBoundingClientRect()[this.position]
    }

    isCollapsed (i)
    {
        return this.pane(i).collapsed
    }

    collapse (i)
    {
        var pane

        if (pane = this.pane(i))
        {
            if (!pane.collapsed)
            {
                pane.collapse()
                return this.calculate()
            }
        }
    }

    expand (i, factor = 0.5)
    {
        var flex, pane, size, _311_38_

        if (pane = this.pane(i))
        {
            if (pane.collapsed)
            {
                pane.expand()
                if (flex = this.closestVisFlex(pane))
                {
                    size = ((_311_38_=pane.fixed) != null ? _311_38_ : flex.size * factor)
                    flex.size -= size
                    pane.size = size
                }
                return this.calculate()
            }
        }
    }

    nextVisPane (p)
    {
        var next, pi

        pi = this.panes.indexOf(p)
        if (pi >= this.panes.length - 1)
        {
            return null
        }
        next = this.panes[pi + 1]
        if (next.isVisible())
        {
            return next
        }
        return this.nextVisPane(next)
    }

    prevVisPane (p)
    {
        var pi, prev

        pi = this.panes.indexOf(p)
        if (pi <= 0)
        {
            return null
        }
        prev = this.panes[pi - 1]
        if (prev.isVisible())
        {
            return prev
        }
        return this.prevVisPane(prev)
    }

    closestVisFlex (p)
    {
        var d, isVisFlexPane, pi

        d = 1
        pi = this.panes.indexOf(p)
        isVisFlexPane = (function (i)
        {
            if (i >= 0 && i < this.panes.length)
            {
                if (!this.panes[i].collapsed && !this.panes[i].fixed)
                {
                    return true
                }
            }
        }).bind(this)
        while (d < this.panes.length - 1)
        {
            if (isVisFlexPane(pi + d))
            {
                return this.panes[pi + d]
            }
            else if (isVisFlexPane(pi - d))
            {
                return this.panes[pi - d]
            }
            d++
        }
    }

    travPrev (h, f)
    {
        return f(h) && h.panea || h.index > 0 && this.travPrev(this.handles[h.index - 1],f) || null
    }

    travNext (h, f)
    {
        return f(h) && h.paneb || h.index < this.handles.length - 1 && this.travNext(this.handles[h.index + 1],f) || null
    }

    prevVisFlex (h)
    {
        return this.travPrev(h,function (v)
        {
            return !v.panea.collapsed && !v.panea.fixed
        })
    }

    nextVisFlex (h)
    {
        return this.travNext(h,function (v)
        {
            return !v.paneb.collapsed && !v.paneb.fixed
        })
    }

    prevFlex (h)
    {
        return this.travPrev(h,function (v)
        {
            return !v.panea.fixed
        })
    }

    nextFlex (h)
    {
        return this.travNext(h,function (v)
        {
            return !v.paneb.fixed
        })
    }

    prevVis (h)
    {
        return this.travPrev(h,function (v)
        {
            return !v.panea.collapsed
        })
    }

    nextVis (h)
    {
        return this.travNext(h,function (v)
        {
            return !v.paneb.collapsed
        })
    }

    prevAllInv (h)
    {
        var p

        p = !this.prevVis(h) && h.panea || null
        ;(p != null ? p.expand() : undefined)
        return p
    }

    nextAllInv (h)
    {
        var p

        p = !this.nextVis(h) && h.paneb || null
        ;(p != null ? p.expand() : undefined)
        return p
    }
}

export default Flex;