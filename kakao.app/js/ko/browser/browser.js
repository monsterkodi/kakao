// monsterkodi/kode 0.256.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Browser, setStyle

import column from "./column.js"

import flex from "../win/flex/flex.js"

import dom from "../../kxk/dom.js"

import kpos from "../../kxk/kpos.js"

import elem from "../../kxk/elem.js"

import slash from "../../kxk/slash.js"

import events from "../../kxk/events.js"

setStyle = dom.setStyle


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
        setStyle('.browserRow .ext','display',window.state.get('browser|hideExtensions') && 'none' || 'initial')
        return Browser.__super__.constructor.apply(this, arguments)
    }

    Browser.prototype["initColumns"] = function ()
    {
        var _37_23_, _41_16_

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
        return this.flex = new flex({view:this.cols,onPaneSize:this.updateColumnScrolls})
    }

    Browser.prototype["columnAtPos"] = function (pos)
    {
        var col

        var list = _k_.list(this.columns)
        for (var _56_16_ = 0; _56_16_ < list.length; _56_16_++)
        {
            col = list[_56_16_]
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
        for (var _63_16_ = 0; _63_16_ < list.length; _63_16_++)
        {
            col = list[_63_16_]
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
        var col, index, nuidx, row, _106_39_, _106_52_, _97_34_, _97_42_

        this.select.clear()
        if (key === 'up')
        {
            if (this.activeColumnIndex() > 0)
            {
                if (col = this.activeColumn())
                {
                    if (row = col.activeRow())
                    {
                        this.loadItem(this.fileItem(row.item.file))
                    }
                    else
                    {
                        this.loadItem(this.fileItem(col.path()))
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
            index = ((_97_42_=(this.focusColumn() != null ? this.focusColumn().index : undefined)) != null ? _97_42_ : 0)
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
                ;((_106_39_=this.columns[nuidx].focus()) != null ? (_106_52_=_106_39_.activeRow()) != null ? _106_52_.activate() : undefined : undefined)
            }
        }
        this.updateColumnScrolls()
        return this
    }

    Browser.prototype["focus"] = function (opt)
    {
        var _118_29_

        ;(this.lastDirOrSrcColumn() != null ? this.lastDirOrSrcColumn().focus(opt) : undefined)
        return this
    }

    Browser.prototype["focusColumn"] = function ()
    {
        var c

        var list = _k_.list(this.columns)
        for (var _122_14_ = 0; _122_14_ < list.length; _122_14_++)
        {
            c = list[_122_14_]
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
            for (var _134_22_ = c = colIndex, _134_33_ = this.numCols(); (_134_22_ <= _134_33_ ? c < this.numCols() : c > this.numCols()); (_134_22_ <= _134_33_ ? ++c : --c))
            {
                this.clearColumn(c)
            }
        }
        var list = _k_.list(this.columns)
        for (var _137_16_ = 0; _137_16_ < list.length; _137_16_++)
        {
            col = list[_137_16_]
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
        for (var _151_16_ = 0; _151_16_ < list.length; _151_16_++)
        {
            col = list[_151_16_]
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
        for (var _158_16_ = 0; _158_16_ < list.length; _158_16_++)
        {
            col = list[_158_16_]
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
        var _166_20_

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
        col = new column(this)
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
        for (var _201_18_ = i = 0, _201_22_ = this.columns.length; (_201_18_ <= _201_22_ ? i < this.columns.length : i > this.columns.length); (_201_18_ <= _201_22_ ? ++i : --i))
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
        var _213_42_, _213_50_

        return this.clearColumnsFrom(((_213_50_=(this.lastDirColumn() != null ? this.lastDirColumn().index : undefined)) != null ? _213_50_ : 0),{pop:true})
    }

    Browser.prototype["shiftColumnsTo"] = function (col)
    {
        var i

        for (var _217_18_ = i = 0, _217_22_ = col; (_217_18_ <= _217_22_ ? i < col : i > col); (_217_18_ <= _217_22_ ? ++i : --i))
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
        var num, _236_24_

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
        var _257_33_

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
        for (var _269_14_ = 0; _269_14_ < list.length; _269_14_++)
        {
            c = list[_269_14_]
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

    Browser.prototype["convertImage"] = function (row)
    {
        var file, item, tmpImg

        item = row.item
        file = item.file
        tmpImg = slash.join(os.tmpdir(),`ko-${slash.name(file)}.png`)
        return childp.exec(`/usr/bin/sips -s format png \"${file}\" --out \"${tmpImg}\"`,(function (err)
        {
            if ((err != null))
            {
                return console.error(`can't convert image ${file}: ${err}`)
            }
            return this.loadImage(row,tmpImg)
        }).bind(this))
    }

    Browser.prototype["loadImage"] = function (row, file)
    {
        var cnt, col

        if (!row.isActive())
        {
            return
        }
        col = this.emptyColumn((opt != null ? opt.column : undefined))
        this.clearColumnsFrom(col.index)
        cnt = elem({class:'browserImageContainer',child:elem('img',{class:'browserImage',src:slash.fileUrl(file)})})
        return col.table.appendChild(cnt)
    }

    return Browser
})()

export default Browser;