var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kxk from "../../kxk.js"
let elem = kxk.elem
let post = kxk.post
let slash = kxk.slash
let tooltip = kxk.tooltip

import File from "../tools/File.js"
import Git from "../tools/Git.js"
import Projects from "../tools/Projects.js"

import Render from "../editor/Render.js"
import Syntax from "../editor/Syntax.js"

class Tab
{
    constructor (tabs, file, isPrj)
    {
        this.tabs = tabs
        this.file = file
        this.isPrj = isPrj
    
        this.togglePinned = this.togglePinned.bind(this)
        this.onGitStatus = this.onGitStatus.bind(this)
        this.tooltipHtml = this.tooltipHtml.bind(this)
        this.dirty = false
        this.pinned = false
        this.div = elem({class:'tab app-drag-region',text:''})
        this.tabs.div.appendChild(this.div)
        this.update()
        if (this.isPrj)
        {
            post.on('gitStatus',this.onGitStatus)
            Git.status(this.file)
        }
    }

    stashInfo ()
    {
        var info

        info = {}
        if (this.isPrj)
        {
            info.prj = this.file
            if (this.hiddenPrjFiles)
            {
                info.hidden = this.hiddenPrjFiles
            }
        }
        else
        {
            info.file = this.file
            if (this.pinned)
            {
                info.pinned = true
            }
            if (this.isActive())
            {
                info.active = true
            }
        }
        return info
    }

    foreignChanges (lineChanges)
    {
        var _43_17_

        this.foreign = ((_43_17_=this.foreign) != null ? _43_17_ : [])
        this.foreign.push(lineChanges)
        return this.update()
    }

    reload ()
    {
        delete this.state
        this.dirty = false
        return this.update()
    }

    saveChanges ()
    {
        var change, changes, _63_23_

        if (this.state)
        {
            if ((this.foreign != null ? this.foreign.length : undefined))
            {
                var list = _k_.list(this.foreign)
                for (var _64_28_ = 0; _64_28_ < list.length; _64_28_++)
                {
                    changes = list[_64_28_]
                    var list1 = _k_.list(changes)
                    for (var _65_31_ = 0; _65_31_ < list1.length; _65_31_++)
                    {
                        change = list1[_65_31_]
                        switch (change.change)
                        {
                            case 'changed':
                                this.state.state = this.state.state.changeLine(change.doIndex,change.after)
                                break
                            case 'inserted':
                                this.state.state = this.state.state.insertLine(change.doIndex,change.after)
                                break
                            case 'deleted':
                                this.state.state = this.state.state.deleteLine(change.doIndex)
                                break
                        }

                    }
                }
            }
            if (this.state.state)
            {
                return File.save(this.state.file,this.state.state.text(),(function (file)
                {
                    if (!file)
                    {
                        return console.error(`tab.saveChanges failed ${err}`)
                    }
                    return this.revert()
                }).bind(this))
            }
            else
            {
                console.error('tab.saveChanges -- nothing to save?')
            }
        }
        else
        {
            return post.emit('saveChanges')
        }
    }

    setFile (newFile)
    {
        if (!slash.samePath(this.file,newFile))
        {
            this.file = slash.path(newFile)
            return this.update()
        }
    }

    storeState ()
    {
        if (window.editor.currentFile)
        {
            return this.state = window.editor.do.tabState()
        }
    }

    update ()
    {
        var diss, dot, file, html, i, name, sep, _148_16_

        this.div.innerHTML = ''
        this.div.classList.toggle('dirty',this.dirty)
        sep = '●'
        if (this.isPrj)
        {
            sep = ''
        }
        this.dot = elem('span',{class:'dot',text:sep})
        this.div.appendChild(this.dot)
        file = this.file
        diss = Syntax.dissForTextAndSyntax(slash.file(file),'ko')
        if (!prefs.get('tabs|extension'))
        {
            if (!_k_.empty(slash.ext(file)))
            {
                diss.pop()
                diss.pop()
            }
        }
        name = elem('span',{class:'name app-drag-region',html:Render.line(diss,{charWidth:0})})
        this.div.appendChild(name)
        if (this.isPrj)
        {
            this.div.classList.add('prj')
        }
        else
        {
            html = ''
            if (this.pinned)
            {
                html = `<svg width="100%" height="100%" viewBox="0 0 30 30" fill="transparent">
    <circle cx="15" cy="12" r="4" />
    <line x1="15" y1="16"  x2="15"  y2="22" stroke-linecap="round"></line>
</svg>`
            }
            else if (this.tmpTab)
            {
                html = `<svg width="100%" height="100%" viewBox="0 0 30 30">
    <circle cx="15" cy="9"  r="2" />
    <circle cx="15" cy="15" r="2" />
    <circle cx="15" cy="21" r="2" />
</svg>`
            }
            this.div.appendChild(elem('span',{class:'tabstate app-drag-region',html:html,click:this.togglePinned}))
        }
        if ((this.file != null))
        {
            this.tooltip = new tooltip({elem:name,bound:this.div,html:this.tooltipHtml,x:-2})
        }
        if (this.isPrj)
        {
            if (this.hiddenPrjFiles)
            {
                for (var _154_25_ = i = 0, _154_29_ = this.hiddenPrjFiles.length; (_154_25_ <= _154_29_ ? i < this.hiddenPrjFiles.length : i > this.hiddenPrjFiles.length); (_154_25_ <= _154_29_ ? ++i : --i))
                {
                    dot = elem('span',{class:'prjdot',text:'●'})
                    this.div.appendChild(dot)
                    if (this.hiddenPrjFiles[i] === window.textEditor.currentFile)
                    {
                        dot.classList.add('activeTab')
                    }
                }
            }
        }
        else if (this.dirty)
        {
            this.div.appendChild(elem('span',{class:'dot',text:'●'}))
        }
        return this
    }

    tooltipHtml ()
    {
        var diss, html, numFiles, _165_16_

        if ((this.file != null))
        {
            diss = Syntax.dissForTextAndSyntax(slash.tilde(this.file),'ko')
            html = Render.line(diss,{wrapSpan:'tooltip-path'})
            if (this.isPrj && (numFiles = Projects.files(this.file).length))
            {
                html += Render.line(Syntax.dissForTextAndSyntax(`${numFiles} files`,'git'),{wrapSpan:'tooltip-line'})
                Git.status(this.file)
            }
        }
        return html
    }

    onGitStatus (status)
    {
        var t, _186_19_, _186_24_

        if (status.gitDir !== this.file)
        {
            return
        }
        if (((this.tooltip != null ? this.tooltip.div : undefined) != null))
        {
            if (status.deleted.length)
            {
                this.tooltip.div.innerHTML += Render.line(Syntax.dissForTextAndSyntax(`▲ ${status.deleted.length} deleted`,'git'),{wrapSpan:'tooltip-line'})
            }
            if (status.added.length)
            {
                this.tooltip.div.innerHTML += Render.line(Syntax.dissForTextAndSyntax(`■ ${status.added.length} added`,'git'),{wrapSpan:'tooltip-line'})
            }
            if (status.changed.length)
            {
                this.tooltip.div.innerHTML += Render.line(Syntax.dissForTextAndSyntax(`● ${status.changed.length} changed`,'git'),{wrapSpan:'tooltip-line'})
            }
        }
        t = ''
        if (status.deleted.length)
        {
            t += '<div class="git-status-icon git-deleted deleted-triangle">▲</div>'
        }
        if (status.added.length)
        {
            t += '<div class="git-status-icon git-added       added-square">■</div>'
        }
        if (status.changed.length)
        {
            t += '<div class="git-status-icon git-changed   changed-circle">●</div>'
        }
        return this.dot.innerHTML = t
    }

    index ()
    {
        return this.tabs.tabs.indexOf(this)
    }

    prev ()
    {
        if (this.index() > 0)
        {
            return this.tabs.tab(this.index() - 1)
        }
    }

    next ()
    {
        if (this.index() < this.tabs.numTabs() - 1)
        {
            return this.tabs.tab(this.index() + 1)
        }
    }

    nextOrPrev ()
    {
        var _200_27_

        return ((_200_27_=this.next()) != null ? _200_27_ : this.prev())
    }

    close ()
    {
        var _208_16_

        if (this.dirty)
        {
            this.saveChanges()
        }
        this.div.remove()
        ;(this.tooltip != null ? this.tooltip.del() : undefined)
        post.emit('tabClosed',this.file)
        return this
    }

    setDirty (dirty)
    {
        if (this.dirty !== dirty)
        {
            this.dirty = dirty
            if (this.dirty)
            {
                delete this.tmpTab
            }
            this.update()
        }
        return this
    }

    togglePinned ()
    {
        this.pinned = !this.pinned
        delete this.tmpTab
        this.update()
        return this
    }

    revert ()
    {
        delete this.foreign
        delete this.state
        this.dirty = false
        this.update()
        this.tabs.update()
        return this
    }

    activate ()
    {
        var file, hidden, tab

        if (this.isPrj)
        {
            if (this.hiddenPrjFiles)
            {
                hidden = this.hiddenPrjFiles
                delete this.hiddenPrjFiles
                var list = _k_.list(hidden)
                for (var _260_25_ = 0; _260_25_ < list.length; _260_25_++)
                {
                    file = list[_260_25_]
                    tab = this.tabs.addTab(file)
                    if (window.textEditor.currentFile === file)
                    {
                        tab.setActive()
                    }
                }
            }
            else
            {
                this.hiddenPrjFiles = this.tabs.getPrjFiles(this.file)
                var list1 = _k_.list(this.tabs.getPrjTabs(this.file))
                for (var _266_24_ = 0; _266_24_ < list1.length; _266_24_++)
                {
                    tab = list1[_266_24_]
                    this.tabs.closeTab(tab)
                }
            }
            this.update()
            this.tabs.update()
        }
        else
        {
            post.emit('jumpToFile',this.file)
        }
        return this
    }

    finishActivation ()
    {
        var changes, _282_19_

        this.setActive()
        if (!_k_.empty(this.state))
        {
            window.editor.do.setTabState(this.state)
            delete this.state
        }
        if ((this.foreign != null ? this.foreign.length : undefined))
        {
            var list = _k_.list(this.foreign)
            for (var _283_24_ = 0; _283_24_ < list.length; _283_24_++)
            {
                changes = list[_283_24_]
                window.editor.do.foreignChanges(changes)
            }
            delete this.foreign
        }
        this.tabs.update()
        return this
    }

    isActive ()
    {
        return this.div.classList.contains('active')
    }

    setActive ()
    {
        if (!this.isActive())
        {
            this.div.classList.add('active')
        }
        return this
    }

    clearActive ()
    {
        this.div.classList.remove('active')
        return this
    }
}

export default Tab;