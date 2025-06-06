var _k_ = {isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

export default {
    actions:{menu:'Line',newline:{name:'Insert Newline',combos:['enter']},newlineAtEnd:{name:'Insert Newline at End',combo:'alt+enter'}},
    newlineAtEnd:function ()
    {
        this.moveCursorsToLineBoundary('right')
        return this.newline({indent:true})
    },
    newline:function (key, info)
    {
        var after, before, bl, c, doIndent, indent, nc, newCursors, _38_32_, _80_51_
    
        if (!(info != null) && _k_.isObj(key))
        {
            info = key
        }
        if (this.salterMode)
        {
            this.endSalter()
            this.singleCursorAtPos(_k_.last(this.cursors()))
            this.newlineAtEnd()
            return
        }
        doIndent = ((_38_32_=(info != null ? info.indent : undefined)) != null ? _38_32_ : !this.isCursorInIndent())
        this.surroundStack = []
        this.deleteSelection()
        this.do.start()
        if (this.salterMode)
        {
            newCursors = [rangeEndPos(this.rangeForLineAtIndex(this.mainCursor()[1]))]
            this.setSalterMode(false)
        }
        else
        {
            newCursors = this.do.cursors()
        }
        var list = _k_.list(this.do.cursors().reverse())
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            var _b_ = this.splitStateLineAtPos(this.do,c); before = _b_[0]; after = _b_[1]
    
            if (doIndent)
            {
                after = after.trimLeft()
            }
            if (doIndent)
            {
                indent = this.indentStringForLineAtIndex(c[1])
                if (_k_.in(this.fileType,['coffee','kode']))
                {
                    if (/(when|if)/.test(before))
                    {
                        if (after.startsWith('then '))
                        {
                            after = after.slice(4).trimLeft()
                            indent += this.indentString
                        }
                        else if (before.trim().endsWith('then'))
                        {
                            before = before.trimRight()
                            before = before.slice(0,before.length - 4)
                            indent += this.indentString
                        }
                    }
                }
            }
            else
            {
                if (c[0] <= indentationInLine(this.do.line(c[1])))
                {
                    indent = this.do.line(c[1]).slice(0,c[0])
                }
                else
                {
                    indent = ''
                }
            }
            bl = c[0]
            if (c[0] >= this.do.line(c[1]).length)
            {
                this.do.insert(c[1] + 1,indent)
            }
            else
            {
                this.do.insert(c[1] + 1,indent + after)
                if ((this.insertIndentedEmptyLineBetween != null) && before.trimRight().endsWith(this.insertIndentedEmptyLineBetween[0] && after.trimLeft().startsWith(this.insertIndentedEmptyLineBetween[1])))
                {
                    indent += this.indentString
                    this.do.insert(c[1] + 1,indent)
                }
                this.do.change(c[1],before)
            }
            var list1 = _k_.list(positionsFromPosInPositions(c,newCursors))
            for (var _c_ = 0; _c_ < list1.length; _c_++)
            {
                nc = list1[_c_]
                cursorDelta(nc,nc[1] === c[1] && indent.length - bl || 0,1)
            }
        }
        this.do.setCursors(newCursors)
        return this.do.end()
    }
}