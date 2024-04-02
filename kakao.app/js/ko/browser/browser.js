var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Browser

import kxk from "../../kxk.js"
let kpos = kxk.kpos
let elem = kxk.elem
let slash = kxk.slash
let events = kxk.events
let setStyle = kxk.setStyle

import Flex from "../win/flex/Flex.js"

import Column from "./Column.js"


Browser = (function ()
{
    _k_.extend(Browser, events)
    function Browser (view)
    {
        this.view = view
    
        this["refresh"] = this["refresh"].bind(this)
        this["updateColumnScrolls"] = this["updateColumnScrolls"].bind(this)
        this["focus"] = this["focus"].bind(this)
        this.columns = []
        setStyle('.browserRow .ext','display',window.stash.get('browser|hideExtensions') && 'none' || 'initial')
        return Browser.__super__.constructor.apply(this, arguments)
    }

    Browser.prototype["initColumns"] = function ()
    {
        var _29_23_, _33_16_

        if ((this.cols != null) && this.cols.parentNode === this.view)
        {
            return
        }
        this.view.innerHTML = ''
        if ((this.cols != null))
        {
            this.view.appendChild(this.cols)
            return
        }
        this.cols = elem({class:'browser',id:'columns'})
        this.view.appendChild(this.cols)
        this.columns = []
        return this.flex = new Flex({view:this.cols,onPaneSize:this.updateColumnScrolls})
    }

    Browser.prototype["columnAtPos"] = function (pos)
    {
        var col

        var list = _k_.list(this.columns)
        for (var _48_16_ = 0; _48_16_ < list.length; _48_16_++)
        {
            col = list[_48_16_]
            if (elem.containsPos(col.div,pos))
            {
                return col
            }
        }
        return null
    }

    Browser.prototype["columnAtX"] = function (x)
    {
        var col, cpos, pos

        var list = _k_.list(this.columns)
        for (var _55_16_ = 0; _55_16_ < list.length; _55_16_++)
        {
            col = list[_55_16_]
            cpos = kpos(col.div.getBoundingClientRect().left,col.div.getBoundingClientRect().top)
            pos = kpos(x,cpos.y)
            if (elem.containsPos(col.div,pos))
            {
                return col
            }
        }
        return null
    }

    Browser.prototype["rowAtPos"] = function (pos)
    {
        var col

        if (col = this.columnAtPos(pos))
        {
            return col.rowAtPos(pos)
        }
        return null
    }

    Browser.prototype["navigate"] = function (key)
    {
        var col, index, nuidx, row, _89_34_, _89_42_, _98_39_, _98_52_

        this.select.clear()
        if (key === 'up')
        {
            if (this.activeColumnIndex() > 0)
            {
                if (col = this.activeColumn())
                {
                    if (row = col.activeRow())
                    {
                        this.loadItem(row.item)
                    }
                    else
                    {
                        this.loadItem(this.dirItem(col.path()))
                    }
                }
            }
            else
            {
                if (!slash.isRoot(this.columns[0].path()))
                {
                    this.loadItem(this.fileItem(slash.dir(this.columns[0].path())))
                }
            }
        }
        else
        {
            index = ((_89_42_=(this.focusColumn() != null ? this.focusColumn().index : undefined)) != null ? _89_42_ : 0)
            nuidx = index + ((function ()
            {
                switch (key)
                {
                    case 'left':
                    case 'up':
                        return -1

                    case 'right':
                        return 1

                    default:
                        return 0
                }

            }).bind(this))()
            nuidx = _k_.clamp(0,this.numCols() - 1,nuidx)
            if (nuidx === index)
            {
                return
            }
            if (this.columns[nuidx].numRows())
            {
                ;((_98_39_=this.columns[nuidx].focus()) != null ? (_98_52_=_98_39_.activeRow()) != null ? _98_52_.activate() : undefined : undefined)
            }
        }
        this.updateColumnScrolls()
        return this
    }

    Browser.prototype["focus"] = function (opt)
    {
        var _110_29_

        ;(this.lastDirOrSrcColumn() != null ? this.lastDirOrSrcColumn().focus(opt) : undefined)
        return this
    }

    Browser.prototype["focusColumn"] = function ()
    {
        var c

        var list = _k_.list(this.columns)
        for (var _114_14_ = 0; _114_14_ < list.length; _114_14_++)
        {
            c = list[_114_14_]
            if (c.hasFocus())
            {
                return c
            }
        }
    }

    Browser.prototype["emptyColumn"] = function (colIndex)
    {
        var c, col

        if ((colIndex != null))
        {
            for (var _126_22_ = c = colIndex, _126_33_ = this.numCols(); (_126_22_ <= _126_33_ ? c < this.numCols() : c > this.numCols()); (_126_22_ <= _126_33_ ? ++c : --c))
            {
                this.clearColumn(c)
            }
        }
        var list = _k_.list(this.columns)
        for (var _129_16_ = 0; _129_16_ < list.length; _129_16_++)
        {
            col = list[_129_16_]
            if (col.isEmpty())
            {
                return col
            }
        }
        return this.addColumn()
    }

    Browser.prototype["activeColumn"] = function ()
    {
        return this.column(this.activeColumnIndex())
    }

    Browser.prototype["activeColumnIndex"] = function ()
    {
        var col

        var list = _k_.list(this.columns)
        for (var _143_16_ = 0; _143_16_ < list.length; _143_16_++)
        {
            col = list[_143_16_]
            if (col.hasFocus())
            {
                return col.index
            }
        }
        return 0
    }

    Browser.prototype["lastUsedColumn"] = function ()
    {
        var col, used

        used = null
        var list = _k_.list(this.columns)
        for (var _150_16_ = 0; _150_16_ < list.length; _150_16_++)
        {
            col = list[_150_16_]
            if (!col.isEmpty())
            {
                used = col
            }
            else
            {
                break
            }
        }
        return used
    }

    Browser.prototype["hasEmptyColumns"] = function ()
    {
        return this.columns.slice(-1)[0].isEmpty()
    }

    Browser.prototype["height"] = function ()
    {
        var _158_20_

        return (this.flex != null ? this.flex.height() : undefined)
    }

    Browser.prototype["numCols"] = function ()
    {
        return this.columns.length
    }

    Browser.prototype["column"] = function (i)
    {
        if ((0 <= i && i < this.numCols()))
        {
            return this.columns[i]
        }
    }

    Browser.prototype["addColumn"] = function ()
    {
        var col

        if (!this.flex)
        {
            return
        }
        col = new Column(this)
        this.columns.push(col)
        this.flex.addPane({div:col.div,size:50})
        return col
    }

    Browser.prototype["clearColumn"] = function (index)
    {
        if (index < this.columns.length)
        {
            return this.columns[index].clear()
        }
    }

    Browser.prototype["shiftColumn"] = function ()
    {
        var i

        if (!this.flex)
        {
            return
        }
        if (!this.columns.length)
        {
            return
        }
        this.clearColumn(0)
        this.flex.shiftPane()
        this.columns.shift()
        for (var _193_18_ = i = 0, _193_22_ = this.columns.length; (_193_18_ <= _193_22_ ? i < this.columns.length : i > this.columns.length); (_193_18_ <= _193_22_ ? ++i : --i))
        {
            this.columns[i].setIndex(i)
        }
    }

    Browser.prototype["popColumn"] = function (opt)
    {
        if (!this.flex)
        {
            return
        }
        this.clearColumn(this.columns.length - 1)
        this.flex.popPane(opt)
        return this.columns.pop()
    }

    Browser.prototype["popEmptyColumns"] = function (opt)
    {
        var _205_42_, _205_50_

        return this.clearColumnsFrom(((_205_50_=(this.lastDirColumn() != null ? this.lastDirColumn().index : undefined)) != null ? _205_50_ : 0),{pop:true})
    }

    Browser.prototype["shiftColumnsTo"] = function (col)
    {
        var i

        for (var _209_18_ = i = 0, _209_22_ = col; (_209_18_ <= _209_22_ ? i < col : i > col); (_209_18_ <= _209_22_ ? ++i : --i))
        {
            this.shiftColumn()
        }
        return this.updateColumnScrolls()
    }

    Browser.prototype["clear"] = function ()
    {
        return this.clearColumnsFrom(0,{pop:true})
    }

    Browser.prototype["clearColumnsFrom"] = function (c = 0, opt = {pop:false})
    {
        var num, _228_24_

        if (!(c != null) || c < 0)
        {
            return console.error(`clearColumnsFrom ${c}?`)
        }
        num = this.numCols()
        if (opt.pop)
        {
            if ((opt.clear != null))
            {
                while (c <= opt.clear)
                {
                    this.clearColumn(c)
                    c++
                }
            }
            while (c < num)
            {
                this.popColumn()
                c++
            }
        }
        else
        {
            while (c < num)
            {
                this.clearColumn(c)
                c++
            }
        }
    }

    Browser.prototype["isMessy"] = function ()
    {
        return !this.flex.relaxed || this.hasEmptyColumns()
    }

    Browser.prototype["cleanUp"] = function ()
    {
        var _249_33_

        if (!(this.flex != null))
        {
            return false
        }
        if (!this.isMessy())
        {
            return false
        }
        this.popEmptyColumns()
        this.flex.relax()
        return true
    }

    Browser.prototype["resized"] = function ()
    {
        return this.updateColumnScrolls()
    }

    Browser.prototype["updateColumnScrolls"] = function ()
    {
        var c

        var list = _k_.list(this.columns)
        for (var _261_14_ = 0; _261_14_ < list.length; _261_14_++)
        {
            c = list[_261_14_]
            c.scroll.update()
        }
    }

    Browser.prototype["reset"] = function ()
    {
        delete this.cols
        return this.initColumns()
    }

    Browser.prototype["stop"] = function ()
    {
        this.cols.remove()
        return this.cols = null
    }

    Browser.prototype["start"] = function ()
    {
        return this.initColumns()
    }

    Browser.prototype["refresh"] = function ()
    {
        return reset()
    }

    Browser.prototype["loadImage"] = function (row, file)
    {
        var cnt, col

        if (!row.isActive())
        {
            return
        }
        col = this.emptyColumn((opt != null ? opt.col : undefined))
        this.clearColumnsFrom(col.index)
        cnt = elem({class:'browserImageContainer',child:elem('img',{class:'browserImage',src:slash.fileUrl(file)})})
        return col.table.appendChild(cnt)
    }

    return Browser
})()

export default Browser;