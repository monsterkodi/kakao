// monsterkodi/kode 0.256.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var $, jsClass, stopEvent

import dom from "../../kxk/dom.js"

import elem from "../../kxk/elem.js"

import matchr from "../../kxk/matchr.js"

import events from "../../kxk/events.js"

import req from "../tools/req.js"

$ = dom.$
stopEvent = dom.stopEvent

jsClass = {RegExp:['test','compile','exec','toString'],String:['endsWith','startsWith','split','slice','substring','padEnd','padStart','indexOf','match','trim','trimEnd','trimStart']}
class Autocomplete extends events
{
    constructor (editor)
    {
        super()
    
        var c, specials

        this.editor = editor
    
        this.onLinesSet = this.onLinesSet.bind(this)
        this.onWillDeleteLine = this.onWillDeleteLine.bind(this)
        this.onLineChanged = this.onLineChanged.bind(this)
        this.onLineInserted = this.onLineInserted.bind(this)
        this.onLinesAppended = this.onLinesAppended.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onWheel = this.onWheel.bind(this)
        this.close = this.close.bind(this)
        this.onEdit = this.onEdit.bind(this)
        this.wordinfo = {}
        this.mthdinfo = {}
        this.matchList = []
        this.clones = []
        this.cloned = []
        this.close()
        specials = "_-@#"
        this.especial = (function () { var r_38_34_ = []; var list = _k_.list(specials.split('')); for (var _38_34_ = 0; _38_34_ < list.length; _38_34_++)  { c = list[_38_34_];r_38_34_.push("\\" + c)  } return r_38_34_ }).bind(this)().join('')
        this.headerRegExp = new RegExp(`^[0${this.especial}]+$`)
        this.notSpecialRegExp = new RegExp(`[^${this.especial}]`)
        this.specialWordRegExp = new RegExp(`(\\s+|[\\w${this.especial}]+|[^\\s])`,'g')
        this.splitRegExp = new RegExp(`[^\\w\\d${this.especial}]+`,'g')
        this.methodRegExp = /([@]?\w+|@)\.(\w+)/
        this.moduleRegExp = /^\s*(\w+)\s*=\s*require\s+([\'\"][\.\/\w]+[\'\"])/
        this.newRegExp = /([@]?\w+)\s*=\s*new\s+(\w+)/
        this.baseRegExp = /\w\s+extends\s+(\w+)/
        this.editor.on('edit',this.onEdit)
        this.editor.on('linesSet',this.onLinesSet)
        this.editor.on('lineInserted',this.onLineInserted)
        this.editor.on('willDeleteLine',this.onWillDeleteLine)
        this.editor.on('lineChanged',this.onLineChanged)
        this.editor.on('linesAppended',this.onLinesAppended)
        this.editor.on('cursor',this.close)
        this.editor.on('blur',this.close)
    }

    parseModule (line)
    {
        var clss, key, match, _79_30_, _81_40_, _83_49_, _86_40_, _88_49_, _94_41_

        if (this.newRegExp.test(line))
        {
            match = line.match(this.newRegExp)
            try
            {
                clss = eval(match[2])
            }
            catch (err)
            {
                true
            }
            if (((clss != null ? clss.prototype : undefined) != null))
            {
                if (jsClass[match[2]])
                {
                    this.mthdinfo[match[1]] = ((_81_40_=this.mthdinfo[match[1]]) != null ? _81_40_ : {})
                    var list = _k_.list(jsClass[match[2]])
                    for (var _82_28_ = 0; _82_28_ < list.length; _82_28_++)
                    {
                        key = list[_82_28_]
                        this.mthdinfo[match[1]][key] = ((_83_49_=this.mthdinfo[match[1]][key]) != null ? _83_49_ : 1)
                    }
                }
            }
            else
            {
                if (this.mthdinfo[match[2]])
                {
                    this.mthdinfo[match[1]] = ((_86_40_=this.mthdinfo[match[1]]) != null ? _86_40_ : {})
                    var list1 = _k_.list(Object.keys(this.mthdinfo[match[2]]))
                    for (var _87_28_ = 0; _87_28_ < list1.length; _87_28_++)
                    {
                        key = list1[_87_28_]
                        this.mthdinfo[match[1]][key] = ((_88_49_=this.mthdinfo[match[1]][key]) != null ? _88_49_ : 1)
                    }
                }
            }
        }
        if (this.baseRegExp.test(line))
        {
            match = line.match(this.baseRegExp)
            if (this.mthdinfo[match[1]])
            {
                var list2 = _k_.list(Object.keys(this.mthdinfo[match[1]]))
                for (var _93_24_ = 0; _93_24_ < list2.length; _93_24_++)
                {
                    key = list2[_93_24_]
                    this.wordinfo[`@${key}`] = ((_94_41_=this.wordinfo[`@${key}`]) != null ? _94_41_ : {count:1})
                }
            }
        }
    }

    parseMethod (line)
    {
        var i, rgs, _106_40_, _107_56_

        if (!_k_.empty((rgs = matchr.ranges([this.methodRegExp,['obj','mth']],line))))
        {
            for (var _105_21_ = i = 0, _105_25_ = rgs.length - 1; (_105_21_ <= _105_25_ ? i < rgs.length - 1 : i > rgs.length - 1); (_105_21_ <= _105_25_ ? ++i : --i))
            {
                this.mthdinfo[rgs[i].match] = ((_106_40_=this.mthdinfo[rgs[i].match]) != null ? _106_40_ : {})
                this.mthdinfo[rgs[i].match][rgs[i + 1].match] = ((_107_56_=this.mthdinfo[rgs[i].match][rgs[i + 1].match]) != null ? _107_56_ : 0)
                this.mthdinfo[rgs[i].match][rgs[i + 1].match] += 1
                i++
            }
        }
    }

    completeMethod (info)
    {
        var lst, mcnt, mthds, obj

        lst = _k_.last(info.before.split(' '))
        obj = lst.slice(0,-1)
        if (!this.mthdinfo[obj])
        {
            return
        }
        mthds = Object.keys(this.mthdinfo[obj])
        mcnt = mthds.map((function (m)
        {
            return [m,this.mthdinfo[obj][m]]
        }).bind(this))
        mcnt.sort(function (a, b)
        {
            return a[1] !== b[1] && b[1] - a[1] || a[0].localeCompare(b[0])
        })
        this.firstMatch = mthds[0]
        return this.matchList = mthds.slice(1)
    }

    onEdit (info)
    {
        var d, m, matches, w, words, _141_28_, _163_41_

        this.close()
        this.word = _k_.last(info.before.split(this.splitRegExp))
        switch (info.action)
        {
            case 'delete':
                console.error('delete!!!!')
                if ((this.wordinfo[this.word] != null ? this.wordinfo[this.word].temp : undefined) && (this.wordinfo[this.word] != null ? this.wordinfo[this.word].count : undefined) <= 0)
                {
                    return delete this.wordinfo[this.word]
                }
                break
            case 'insert':
                if (!(this.word != null ? this.word.length : undefined))
                {
                    if (info.before.slice(-1)[0] === '.')
                    {
                        this.completeMethod(info)
                    }
                }
                else
                {
                    if (_k_.empty(this.wordinfo))
                    {
                        return
                    }
                    matches = _.pickBy(this.wordinfo,(function (c, w)
                    {
                        return w.startsWith(this.word) && w.length > this.word.length
                    }).bind(this))
                    matches = _.toPairs(matches)
                    var list = _k_.list(matches)
                    for (var _149_26_ = 0; _149_26_ < list.length; _149_26_++)
                    {
                        m = list[_149_26_]
                        d = this.editor.distanceOfWord(m[0])
                        m[1].distance = 100 - Math.min(d,100)
                    }
                    matches.sort(function (a, b)
                    {
                        return (b[1].distance + b[1].count + 1 / b[0].length) - (a[1].distance + a[1].count + 1 / a[0].length)
                    })
                    words = matches.map(function (m)
                    {
                        return m[0]
                    })
                    var list1 = _k_.list(words)
                    for (var _157_26_ = 0; _157_26_ < list1.length; _157_26_++)
                    {
                        w = list1[_157_26_]
                        if (!this.firstMatch)
                        {
                            this.firstMatch = w
                        }
                        else
                        {
                            this.matchList.push(w)
                        }
                    }
                }
                if (!(this.firstMatch != null))
                {
                    return
                }
                this.completion = this.firstMatch.slice(this.word.length)
                return this.open(info)

        }

    }

    open (info)
    {
        var c, ci, cr, cursor, index, inner, item, m, p, sibling, sp, spanInfo, wi, ws

        cursor = $('.main',this.editor.view)
        if (!(cursor != null))
        {
            console.error("Autocomplete.open --- no cursor?")
            return
        }
        this.span = elem('span',{class:'autocomplete-span'})
        this.span.textContent = this.completion
        this.span.style.opacity = 1
        this.span.style.background = "#44a"
        this.span.style.color = "#fff"
        cr = cursor.getBoundingClientRect()
        spanInfo = this.editor.lineSpanAtXY(cr.left,cr.top)
        if (!(spanInfo != null))
        {
            p = this.editor.posAtXY(cr.left,cr.top)
            ci = p[1] - this.editor.scroll.top
            return console.error(`no span for autocomplete? cursor topleft: ${parseInt(cr.left)} ${parseInt(cr.top)}`,info)
        }
        sp = spanInfo.span
        inner = sp.innerHTML
        this.clones.push(sp.cloneNode(true))
        this.clones.push(sp.cloneNode(true))
        this.cloned.push(sp)
        ws = this.word.slice(this.word.search(/\w/))
        wi = ws.length
        this.clones[0].innerHTML = inner.slice(0,spanInfo.offsetChar + 1)
        this.clones[1].innerHTML = inner.slice(spanInfo.offsetChar + 1)
        sibling = sp
        while (sibling = sibling.nextSibling)
        {
            this.clones.push(sibling.cloneNode(true))
            this.cloned.push(sibling)
        }
        sp.parentElement.appendChild(this.span)
        var list = _k_.list(this.cloned)
        for (var _215_14_ = 0; _215_14_ < list.length; _215_14_++)
        {
            c = list[_215_14_]
            c.style.display = 'none'
        }
        var list1 = _k_.list(this.clones)
        for (var _218_14_ = 0; _218_14_ < list1.length; _218_14_++)
        {
            c = list1[_218_14_]
            this.span.insertAdjacentElement('afterend',c)
        }
        this.moveClonesBy(this.completion.length)
        if (this.matchList.length)
        {
            this.list = elem({class:'autocomplete-list'})
            this.list.addEventListener('wheel',this.onWheel,{passive:true})
            this.list.addEventListener('mousedown',this.onMouseDown,{passive:true})
            index = 0
            var list2 = _k_.list(this.matchList)
            for (var _230_18_ = 0; _230_18_ < list2.length; _230_18_++)
            {
                m = list2[_230_18_]
                item = elem({class:'autocomplete-item',index:index++})
                item.textContent = m
                this.list.appendChild(item)
            }
            return cursor.appendChild(this.list)
        }
    }

    close ()
    {
        var c, _244_16_, _249_13_

        if ((this.list != null))
        {
            this.list.removeEventListener('wheel',this.onWheel)
            this.list.removeEventListener('click',this.onClick)
            this.list.remove()
        }
        ;(this.span != null ? this.span.remove() : undefined)
        this.selected = -1
        this.list = null
        this.span = null
        this.completion = null
        this.firstMatch = null
        var list = _k_.list(this.clones)
        for (var _256_14_ = 0; _256_14_ < list.length; _256_14_++)
        {
            c = list[_256_14_]
            c.remove()
        }
        var list1 = _k_.list(this.cloned)
        for (var _259_14_ = 0; _259_14_ < list1.length; _259_14_++)
        {
            c = list1[_259_14_]
            c.style.display = 'initial'
        }
        this.clones = []
        this.cloned = []
        this.matchList = []
        return this
    }

    onWheel (event)
    {
        this.list.scrollTop += event.deltaY
        return stopEvent(event)
    }

    onMouseDown (event)
    {
        var index

        index = elem.upAttr(event.target,'index')
        if (index)
        {
            this.select(index)
            this.onEnter()
        }
        return stopEvent(event)
    }

    onEnter ()
    {
        this.editor.pasteText(this.selectedCompletion())
        return this.close()
    }

    selectedCompletion ()
    {
        if (this.selected >= 0)
        {
            return this.matchList[this.selected].slice(this.word.length)
        }
        else
        {
            return this.completion
        }
    }

    navigate (delta)
    {
        if (!this.list)
        {
            return
        }
        return this.select(_k_.clamp(-1,this.matchList.length - 1,this.selected + delta))
    }

    select (index)
    {
        ;(this.list.children[this.selected] != null ? this.list.children[this.selected].classList.remove('selected') : undefined)
        this.selected = index
        if (this.selected >= 0)
        {
            ;(this.list.children[this.selected] != null ? this.list.children[this.selected].classList.add('selected') : undefined)
            ;(this.list.children[this.selected] != null ? this.list.children[this.selected].scrollIntoViewIfNeeded() : undefined)
        }
        this.span.innerHTML = this.selectedCompletion()
        this.moveClonesBy(this.span.innerHTML.length)
        if (this.selected < 0)
        {
            this.span.classList.remove('selected')
        }
        if (this.selected >= 0)
        {
            return this.span.classList.add('selected')
        }
    }

    prev ()
    {
        return this.navigate(-1)
    }

    next ()
    {
        return this.navigate(1)
    }

    last ()
    {
        return this.navigate(this.matchList.length - this.selected)
    }

    moveClonesBy (numChars)
    {
        var beforeLength, c, charOffset, ci, offset, spanOffset

        if (_k_.empty(this.clones))
        {
            return
        }
        beforeLength = this.clones[0].innerHTML.length
        for (var _328_19_ = ci = 1, _328_23_ = this.clones.length; (_328_19_ <= _328_23_ ? ci < this.clones.length : ci > this.clones.length); (_328_19_ <= _328_23_ ? ++ci : --ci))
        {
            c = this.clones[ci]
            offset = parseFloat(this.cloned[ci - 1].style.transform.split('translateX(')[1])
            charOffset = numChars
            if (ci === 1)
            {
                charOffset += beforeLength
            }
            c.style.transform = `translatex(${offset + this.editor.size.charWidth * charOffset}px)`
        }
        spanOffset = parseFloat(this.cloned[0].style.transform.split('translateX(')[1])
        spanOffset += this.editor.size.charWidth * beforeLength
        return this.span.style.transform = `translatex(${spanOffset}px)`
    }

    parseLinesDelayed (lines, opt)
    {
        var delay

        delay = (function (l, o)
        {
            return (function ()
            {
                return this.parseLines(l,o)
            }).bind(this)
        }).bind(this)
        if (lines.length > 1)
        {
            return setTimeout((delay(lines,opt)),200)
        }
    }

    parseLines (lines, opt)
    {
        var count, cursorWord, i, info, l, w, words, _358_27_, _383_37_, _384_35_, _385_36_

        this.close()
        if (!(lines != null))
        {
            return
        }
        cursorWord = this.cursorWord()
        var list = _k_.list(lines)
        for (var _357_14_ = 0; _357_14_ < list.length; _357_14_++)
        {
            l = list[_357_14_]
            if (!((l != null ? l.split : undefined) != null))
            {
                return console.error(`Autocomplete.parseLines -- line has no split? action: ${opt.action} line: ${l}`,lines)
            }
            if (l.length > 240)
            {
                continue
            }
            this.parseMethod(l)
            this.parseModule(l)
            words = l.split(this.splitRegExp)
            words = words.filter((function (w)
            {
                if (w === cursorWord)
                {
                    return false
                }
                if (this.word === w.slice(0,w.length - 1))
                {
                    return false
                }
                if (this.headerRegExp.test(w))
                {
                    return false
                }
                return true
            }).bind(this))
            var list1 = _k_.list(words)
            for (var _376_18_ = 0; _376_18_ < list1.length; _376_18_++)
            {
                w = list1[_376_18_]
                i = w.search(this.notSpecialRegExp)
                if (i > 0 && w[0] !== "#")
                {
                    w = w.slice(i)
                    if (!/^[\-]?[\d]+$/.test(w))
                    {
                        words.push(w)
                    }
                }
            }
            var list2 = _k_.list(words)
            for (var _382_18_ = 0; _382_18_ < list2.length; _382_18_++)
            {
                w = list2[_382_18_]
                info = ((_383_37_=this.wordinfo[w]) != null ? _383_37_ : {})
                count = ((_384_35_=info.count) != null ? _384_35_ : 0)
                count += ((_385_36_=(opt != null ? opt.count : undefined)) != null ? _385_36_ : 1)
                info.count = count
                if (opt.action === 'change')
                {
                    info.temp = true
                }
                this.wordinfo[w] = info
            }
        }
    }

    cursorWords ()
    {
        var after, befor, cp, cursr, words

        cp = this.editor.cursorPos()
        words = this.editor.wordRangesInLineAtIndex(cp[1],{regExp:this.specialWordRegExp})
        var _400_30_ = rangesSplitAtPosInRanges(cp,words); befor = _400_30_[0]; cursr = _400_30_[1]; after = _400_30_[2]

        return [this.editor.textsInRanges(befor),this.editor.textInRange(cursr),this.editor.textsInRanges(after)]
    }

    cursorWord ()
    {
        return this.cursorWords()[1]
    }

    onLinesAppended (lines)
    {
        return this.parseLines(lines,{action:'append'})
    }

    onLineInserted (li)
    {
        return this.parseLines([this.editor.line(li)],{action:'insert'})
    }

    onLineChanged (li)
    {
        return this.parseLines([this.editor.line(li)],{action:'change',count:0})
    }

    onWillDeleteLine (line)
    {
        return this.parseLines([line],{action:'delete',count:-1})
    }

    onLinesSet (lines)
    {
        if (lines.length)
        {
            return this.parseLinesDelayed(lines,{action:'set'})
        }
    }

    handleModKeyComboEvent (mod, key, combo, event)
    {
        var _425_39_, _430_16_

        if (!(this.span != null))
        {
            return 'unhandled'
        }
        switch (combo)
        {
            case 'enter':
                return this.onEnter()

        }

        if ((this.list != null))
        {
            switch (combo)
            {
                case 'down':
                    this.next()
                    return

                case 'up':
                    this.selected >= 0 ? this.prev() : this.last()
                    return

            }

        }
        this.close()
        return 'unhandled'
    }
}

export default Autocomplete;