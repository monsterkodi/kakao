var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../kxk.js"
let scheme = kxk.scheme
let elem = kxk.elem
let drag = kxk.drag

class Scroller
{
    constructor (column, parent)
    {
        this.column = column
        this.parent = parent
    
        this.update = this.update.bind(this)
        this.onScroll = this.onScroll.bind(this)
        this.onWheel = this.onWheel.bind(this)
        this.onDrag = this.onDrag.bind(this)
        this.onStart = this.onStart.bind(this)
        this.elem = elem({class:'scrollbar right',parent:this.parent})
        this.handle = elem({class:'scrollhandle right',parent:this.elem})
        this.target = this.column.table
        this.drag = new drag({target:this.elem,onStart:this.onStart,onMove:this.onDrag,cursor:'ns-resize'})
        this.elem.addEventListener('wheel',this.onWheel,{passive:true})
        this.column.div.addEventListener('wheel',this.onWheel,{passive:true})
        this.target.addEventListener('scroll',this.onScroll)
    }

    numRows ()
    {
        return this.column.numRows()
    }

    visRows ()
    {
        return 1 + parseInt(this.height() / this.column.rowHeight())
    }

    rowHeight ()
    {
        return this.column.rowHeight()
    }

    height ()
    {
        return this.parent.getBoundingClientRect().height
    }

    onStart (drag, event)
    {
        var br, ln, ly, sy

        br = this.elem.getBoundingClientRect()
        sy = _k_.clamp(0,this.height(),event.clientY - br.top)
        ln = parseInt(this.numRows() * sy / this.height())
        ly = (ln - this.visRows() / 2) * this.rowHeight()
        return this.target.scrollTop = ly
    }

    onDrag (drag)
    {
        var delta

        delta = (drag.delta.y / (this.visRows() * this.rowHeight())) * this.numRows() * this.rowHeight()
        this.target.scrollTop += delta
        return this.update()
    }

    onWheel (event)
    {
        if (Math.abs(event.deltaX) >= 2 * Math.abs(event.deltaY) || Math.abs(event.deltaY) === 0)
        {
            return this.target.scrollLeft += event.deltaX
        }
        else
        {
            return this.target.scrollTop += event.deltaY
        }
    }

    onScroll (event)
    {
        return this.update()
    }

    toIndex (i)
    {
        var newTop, row

        row = this.column.rows[i].div
        newTop = this.target.scrollTop
        if (newTop < row.offsetTop + 2 * this.rowHeight() - this.height())
        {
            newTop = row.offsetTop + 2 * this.rowHeight() - this.height()
        }
        else if (newTop > row.offsetTop - this.rowHeight())
        {
            newTop = row.offsetTop - this.rowHeight()
        }
        this.target.scrollTop = parseInt(newTop)
        return this.update()
    }

    update ()
    {
        var bh, cf, cs, longColor, scrollHeight, scrollTop, shortColor, vh

        if (this.numRows() * this.rowHeight() < this.height())
        {
            this.elem.style.display = 'none'
            this.handle.style.top = "0"
            this.handle.style.height = "0"
            this.handle.style.width = "0"
        }
        else
        {
            this.elem.style.display = 'block'
            bh = this.numRows() * this.rowHeight()
            vh = Math.min((this.visRows() * this.rowHeight()),this.height())
            scrollTop = parseInt((this.target.scrollTop / bh) * vh)
            scrollHeight = parseInt(((this.visRows() * this.rowHeight()) / bh) * vh)
            scrollHeight = Math.max(scrollHeight,parseInt(this.rowHeight() / 4))
            scrollTop = Math.min(scrollTop,this.height() - scrollHeight)
            scrollTop = Math.max(0,scrollTop)
            this.handle.style.top = `${scrollTop}px`
            this.handle.style.height = `${scrollHeight}px`
            this.handle.style.width = "2px"
            longColor = scheme.colorForClass('scroller long')
            shortColor = scheme.colorForClass('scroller short')
            cf = 1 - _k_.clamp(0,1,(scrollHeight - 10) / 200)
            cs = scheme.fadeColor(longColor,shortColor,cf)
            this.handle.style.backgroundColor = cs
        }
        return this.handle.style.right = `-${this.target.scrollLeft}px`
    }
}

export default Scroller;