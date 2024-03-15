var _k_

class Select
{
    constructor (browser)
    {
        this.browser = browser
    
        this.rows = []
        this.active = null
    }

    files ()
    {
        var rows

        rows = this.rows.filter(function (row)
        {
            return row.item.name !== '..'
        })
        return rows.map(function (row)
        {
            return row.item.path
        })
    }

    freeIndex ()
    {
        var index

        if (!this.active)
        {
            return -1
        }
        index = this.active.index()
        while (index < this.active.column.numRows() - 1)
        {
            index += 1
            if (!this.active.column.rows[index].isSelected())
            {
                return index
            }
        }
        index = this.active.index()
        while (index > 0)
        {
            index -= 1
            if (!this.active.column.rows[index].isSelected())
            {
                return index
            }
        }
        return -1
    }

    clear ()
    {
        var row, _40_25_

        var list = ((_40_25_=this.rows) != null ? _40_25_ : [])
        for (var _40_16_ = 0; _40_16_ < list.length; _40_16_++)
        {
            row = list[_40_16_]
            row.clearSelected()
        }
        this.rows = []
        return this.active = null
    }

    toggle (row)
    {
        var _50_32_

        if (row.column !== (this.active != null ? this.active.column : undefined))
        {
            this.row(row)
            return
        }
        if (row.isSelected())
        {
            console.log('unselect',row.item.path)
            row.clearActive()
            row.clearSelected()
            return this.rows.splice(this.rows.indexOf(row),1)
        }
        else
        {
            row.setSelected()
            this.active = row
            return this.rows.push(row)
        }
    }

    row (row, activate = true)
    {
        var _70_18_, _71_19_

        if (!row)
        {
            return
        }
        if ((this.active != null ? this.active.column : undefined) === row.column && activate)
        {
            ;(this.active != null ? this.active.clearActive() : undefined)
        }
        this.clear()
        this.rows = [row]
        this.active = row
        row.setSelected()
        if (!row.isActive() && activate)
        {
            return row.activate()
        }
    }

    to (row, moveActive = false)
    {
        var from, index, r, to, _106_19_

        if (!row)
        {
            return
        }
        if (row === this.active)
        {
            return
        }
        if (!this.active)
        {
            return
        }
        if (row.column !== this.active.column)
        {
            this.row(row)
            return
        }
        if (row.index() > this.active.index())
        {
            from = this.active.index() + 1
            to = row.index()
        }
        else
        {
            from = row.index()
            to = this.active.index() - 1
        }
        for (var _99_22_ = index = from, _99_28_ = to; (_99_22_ <= _99_28_ ? index <= to : index >= to); (_99_22_ <= _99_28_ ? ++index : --index))
        {
            r = this.active.column.rows[index]
            if (!r.isSelected())
            {
                r.setSelected()
                this.rows.push(r)
            }
        }
        if (moveActive)
        {
            ;(this.active != null ? this.active.clearActive() : undefined)
            this.active = row
            return this.active.setActive()
        }
    }
}

export default Select;