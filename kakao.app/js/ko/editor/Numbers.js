var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var Numbers

import kxk from "../../kxk.js"
let elem = kxk.elem
let events = kxk.events
let setStyle = kxk.setStyle
let $ = kxk.$


Numbers = (function ()
{
    _k_.extend(Numbers, events)
    function Numbers (editor)
    {
        this.editor = editor
    
        this["updateColor"] = this["updateColor"].bind(this)
        this["updateColors"] = this["updateColors"].bind(this)
        this["onFontSizeChange"] = this["onFontSizeChange"].bind(this)
        this["onClearLines"] = this["onClearLines"].bind(this)
        this["onLinesShifted"] = this["onLinesShifted"].bind(this)
        this["onLinesShown"] = this["onLinesShown"].bind(this)
        Numbers.__super__.constructor.call(this)
        this.lineDivs = {}
        this.elem = $('.numbers',this.editor.view)
        this.editor.on('clearLines',this.onClearLines)
        this.editor.on('linesShown',this.onLinesShown)
        this.editor.on('linesShifted',this.onLinesShifted)
        this.editor.on('fontSizeChanged',this.onFontSizeChange)
        this.editor.on('highlight',this.updateColors)
        this.editor.on('changed',this.updateColors)
        this.editor.on('linesSet',this.updateColors)
        this.onFontSizeChange()
    }

    Numbers.prototype["onLinesShown"] = function (top, bot, num)
    {
        var div, li

        this.elem.innerHTML = ''
        this.lineDivs = {}
        for (var _a_ = li = top, _b_ = bot; (_a_ <= _b_ ? li <= bot : li >= bot); (_a_ <= _b_ ? ++li : --li))
        {
            div = this.addLine(li)
            this.emit('numberAdded',{numberDiv:div,numberSpan:div.firstChild,lineIndex:li})
            this.updateColor(li)
        }
        return this.updateLinePositions()
    }

    Numbers.prototype["onLinesShifted"] = function (top, bot, num)
    {
        var divInto, oldBot, oldTop

        oldTop = top - num
        oldBot = bot - num
        divInto = (function (li, lo)
        {
            var numberDiv, numberSpan

            if (!this.lineDivs[lo])
            {
                console.log(`${this.editor.name}.onLinesShifted.divInto -- no number div? top ${top} bot ${bot} num ${num} lo ${lo} li ${li}`)
                return
            }
            numberDiv = this.lineDivs[li] = this.lineDivs[lo]
            delete this.lineDivs[lo]
            numberSpan = numberDiv.firstChild
            numberSpan.textContent = li + 1
            this.updateColor(li)
            return this.emit('numberChanged',{numberDiv:numberDiv,numberSpan:numberSpan,lineIndex:li})
        }).bind(this)
        if (num > 0)
        {
            while (oldBot < bot)
            {
                oldBot += 1
                divInto(oldBot,oldTop)
                oldTop += 1
            }
        }
        else
        {
            while (oldTop > top)
            {
                oldTop -= 1
                divInto(oldTop,oldBot)
                oldBot -= 1
            }
        }
        return this.updateLinePositions()
    }

    Numbers.prototype["updateLinePositions"] = function ()
    {
        var div, li, y

        for (li in this.lineDivs)
        {
            div = this.lineDivs[li]
            if (!(div != null ? div.style : undefined))
            {
                continue
            }
            y = this.editor.size.lineHeight * (li - this.editor.scroll.top)
            div.style.transform = `translate3d(0, ${y}px, 0)`
        }
    }

    Numbers.prototype["addLine"] = function (li)
    {
        var div

        div = elem({class:'linenumber',child:elem('span',{text:`${li + 1}`})})
        div.style.height = `${this.editor.size.lineHeight}px`
        this.lineDivs[li] = div
        this.elem.appendChild(div)
        return div
    }

    Numbers.prototype["onClearLines"] = function ()
    {
        this.lineDivs = {}
        return this.elem.innerHTML = ""
    }

    Numbers.prototype["onFontSizeChange"] = function ()
    {
        var fsz, _139_13_

        fsz = Math.min(22,this.editor.size.fontSize - 4)
        if ((this.elem != null)) { this.elem.style.fontSize = `${fsz}px` }
        return setStyle('.linenumber','padding-top',`${parseInt(this.editor.size.fontSize / 10)}px`)
    }

    Numbers.prototype["updateColors"] = function ()
    {
        var li

        if (this.editor.scroll.bot > this.editor.scroll.top)
        {
            for (var _a_ = li = this.editor.scroll.top, _b_ = this.editor.scroll.bot; (_a_ <= _b_ ? li <= this.editor.scroll.bot : li >= this.editor.scroll.bot); (_a_ <= _b_ ? ++li : --li))
            {
                this.updateColor(li)
            }
        }
    }

    Numbers.prototype["updateColor"] = function (li)
    {
        var ci, cls, hi, s, si, _157_35_

        if (!(this.lineDivs[li] != null))
        {
            return
        }
        if ((this.lineDivs[li].firstChild != null) && this.lineDivs[li].firstChild.classList.contains('gitInfoLine'))
        {
            return
        }
        si = (function () { var r_a_ = []; var list = _k_.list(rangesFromTopToBotInRanges(li,li,this.editor.selections())); for (var _b_ = 0; _b_ < list.length; _b_++)  { s = list[_b_];r_a_.push(s[0])  } return r_a_ }).bind(this)()
        hi = (function () { var r_c_ = []; var list1 = _k_.list(rangesFromTopToBotInRanges(li,li,this.editor.highlights())); for (var _d_ = 0; _d_ < list1.length; _d_++)  { s = list1[_d_];r_c_.push(s[0])  } return r_c_ }).bind(this)()
        ci = (function () { var r_e_ = []; var list2 = _k_.list(rangesFromTopToBotInRanges(li,li,rangesFromPositions(this.editor.cursors()))); for (var _f_ = 0; _f_ < list2.length; _f_++)  { s = list2[_f_];r_e_.push(s[0])  } return r_e_ }).bind(this)()
        cls = ''
        if (_k_.in(li,ci))
        {
            cls += ' cursored'
        }
        if (li === this.editor.mainCursor()[1])
        {
            cls += ' main'
        }
        if (_k_.in(li,si))
        {
            cls += ' selected'
        }
        if (_k_.in(li,hi))
        {
            cls += ' highligd'
        }
        return this.lineDivs[li].className = 'linenumber' + cls
    }

    return Numbers
})()

export default Numbers;