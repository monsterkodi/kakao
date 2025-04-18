var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var EditorScroll

import kxk from "../../kxk.js"
let events = kxk.events


EditorScroll = (function ()
{
    _k_.extend(EditorScroll, events)
    function EditorScroll (editor)
    {
        this.editor = editor
    
        var _16_46_

        this["setLineHeight"] = this["setLineHeight"].bind(this)
        this["setNumLines"] = this["setNumLines"].bind(this)
        this["setViewHeight"] = this["setViewHeight"].bind(this)
        this["reset"] = this["reset"].bind(this)
        this["setTop"] = this["setTop"].bind(this)
        this["by"] = this["by"].bind(this)
        this["to"] = this["to"].bind(this)
        this["start"] = this["start"].bind(this)
        EditorScroll.__super__.constructor.call(this)
        this.lineHeight = ((_16_46_=this.editor.size.lineHeight) != null ? _16_46_ : 0)
        this.viewHeight = -1
        this.init()
    }

    EditorScroll.prototype["init"] = function ()
    {
        this.scroll = 0
        this.offsetTop = 0
        this.offsetSmooth = 0
        this.viewHeight = -1
        this.fullHeight = -1
        this.fullLines = -1
        this.viewLines = -1
        this.scrollMax = -1
        this.numLines = -1
        this.top = -1
        return this.bot = -1
    }

    EditorScroll.prototype["start"] = function (viewHeight, numLines)
    {
        this.viewHeight = viewHeight
        this.numLines = numLines
    
        this.fullHeight = this.numLines * this.lineHeight
        this.top = 0
        this.bot = this.top - 1
        this.calc()
        return this.by(0)
    }

    EditorScroll.prototype["calc"] = function ()
    {
        if (this.viewHeight <= 0)
        {
            return
        }
        this.scrollMax = Math.max(0,this.fullHeight - this.viewHeight)
        this.fullLines = Math.floor(this.viewHeight / this.lineHeight)
        return this.viewLines = Math.ceil(this.viewHeight / this.lineHeight) + 1
    }

    EditorScroll.prototype["to"] = function (p)
    {
        return this.by(p - this.scroll)
    }

    EditorScroll.prototype["by"] = function (delta, x)
    {
        var offset, scroll, top

        if (this.viewLines < 0)
        {
            return
        }
        if (x)
        {
            this.editor.layerScroll.scrollLeft += x
        }
        if (!delta && this.top < this.bot)
        {
            return
        }
        scroll = this.scroll
        if (Number.isNaN(delta))
        {
            delta = 0
        }
        this.scroll = parseInt(_k_.clamp(0,this.scrollMax,this.scroll + delta))
        top = parseInt(this.scroll / this.lineHeight)
        this.offsetSmooth = this.scroll - top * this.lineHeight
        this.setTop(top)
        offset = 0
        offset += this.offsetSmooth
        offset += (top - this.top) * this.lineHeight
        if (offset !== this.offsetTop || scroll !== this.scroll)
        {
            this.offsetTop = parseInt(offset)
            this.updateOffset()
            return this.emit('scroll',this.scroll,this.offsetTop)
        }
    }

    EditorScroll.prototype["setTop"] = function (top)
    {
        var num, oldBot, oldTop

        oldTop = this.top
        oldBot = this.bot
        this.bot = Math.min(top + this.viewLines,this.numLines - 1)
        this.top = Math.max(0,this.bot - this.viewLines)
        if (oldTop === this.top && oldBot === this.bot)
        {
            return
        }
        if ((this.top > oldBot) || (this.bot < oldTop) || (oldBot < oldTop))
        {
            num = this.bot - this.top + 1
            if (num > 0)
            {
                return this.emit('showLines',this.top,this.bot,num)
            }
        }
        else
        {
            num = this.top - oldTop
            if (0 < Math.abs(num))
            {
                return this.emit('shiftLines',this.top,this.bot,num)
            }
        }
    }

    EditorScroll.prototype["lineIndexIsInView"] = function (li)
    {
        return (this.top <= li && li <= this.bot)
    }

    EditorScroll.prototype["reset"] = function ()
    {
        this.emit('clearLines')
        this.init()
        return this.updateOffset()
    }

    EditorScroll.prototype["setViewHeight"] = function (h)
    {
        if (this.viewHeight !== h)
        {
            this.bot = this.top - 1
            this.viewHeight = h
            this.calc()
            return this.by(0)
        }
    }

    EditorScroll.prototype["setNumLines"] = function (n, opt)
    {
        if (this.numLines !== n)
        {
            this.fullHeight = n * this.lineHeight
            if (n)
            {
                if ((opt != null ? opt.showLines : undefined) !== false)
                {
                    this.bot = this.top - 1
                }
                this.numLines = n
                this.calc()
                return this.by(0)
            }
            else
            {
                this.init()
                return this.emit('clearLines')
            }
        }
    }

    EditorScroll.prototype["setLineHeight"] = function (h)
    {
        if (this.lineHeight !== h)
        {
            this.lineHeight = h
            this.fullHeight = this.numLines * this.lineHeight
            this.calc()
            return this.by(0)
        }
    }

    EditorScroll.prototype["updateOffset"] = function ()
    {
        return this.editor.layers.style.transform = `translate3d(0,-${this.offsetTop}px, 0)`
    }

    EditorScroll.prototype["cursorToTop"] = function (topDist = 7)
    {
        var cp, hl, rg, sl

        cp = this.editor.cursorPos()
        if (cp[1] - this.top > topDist)
        {
            rg = [this.top,Math.max(0,cp[1] - 1)]
            sl = this.editor.selectionsInLineIndexRange(rg)
            hl = this.editor.highlightsInLineIndexRange(rg)
            if ((sl.length === 0 && 0 === hl.length))
            {
                return this.by(this.lineHeight * (cp[1] - this.top - topDist))
            }
        }
    }

    EditorScroll.prototype["cursorIntoView"] = function ()
    {
        var delta

        if (delta = this.deltaToEnsureMainCursorIsVisible())
        {
            this.by(delta * this.lineHeight - this.offsetSmooth)
            this.updateCursorOffset()
        }
        return null
    }

    EditorScroll.prototype["deltaToEnsureMainCursorIsVisible"] = function ()
    {
        var cl, maindelta, offset, _232_31_, _232_46_

        maindelta = 0
        cl = this.editor.mainCursor()[1]
        offset = ((_232_46_=(this.editor.config != null ? this.editor.config.scrollOffset : undefined)) != null ? _232_46_ : 2)
        if (cl < this.top + offset + this.offsetTop / this.lineHeight)
        {
            maindelta = cl - (this.top + offset + this.offsetTop / this.lineHeight)
        }
        else if (cl > this.top + this.fullLines - offset - 1)
        {
            maindelta = cl - (this.top + this.fullLines - offset - 1)
        }
        return maindelta
    }

    EditorScroll.prototype["updateCursorOffset"] = function ()
    {
        var charWidth, cx, layersWidth, offsetX, scrollLeft

        offsetX = this.editor.size.offsetX
        charWidth = this.editor.size.charWidth
        layersWidth = this.editor.layersWidth
        scrollLeft = this.editor.layerScroll.scrollLeft
        cx = this.editor.mainCursor()[0] * charWidth + offsetX
        if (cx - scrollLeft > layersWidth)
        {
            return this.editor.layerScroll.scrollLeft = Math.max(0,cx - layersWidth + charWidth)
        }
        else if (cx - offsetX - scrollLeft < 0)
        {
            return this.editor.layerScroll.scrollLeft = Math.max(0,cx - offsetX)
        }
    }

    EditorScroll.prototype["info"] = function ()
    {
        return {topbot:`${this.top} .. ${this.bot} = ${this.bot - this.top} / ${this.numLines} lines`,scroll:`${this.scroll} offsetTop ${this.offsetTop} viewHeight ${this.viewHeight} scrollMax ${this.scrollMax} fullLines ${this.fullLines} viewLines ${this.viewLines}`}
    }

    return EditorScroll
})()

export default EditorScroll;