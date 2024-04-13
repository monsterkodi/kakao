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
    constructor (tabs, koreTab)
    {
        var k, v

        this.tabs = tabs
    
        this.togglePinned = this.togglePinned.bind(this)
        this.onGitStatus = this.onGitStatus.bind(this)
        this.tooltipHtml = this.tooltipHtml.bind(this)
        for (k in koreTab)
        {
            v = koreTab[k]
            this[k] = v
        }
        console.log('Tab@',koreTab)
        this.div = elem({class:'tab app-drag-region',text:this.path})
        this.tabs.div.appendChild(this.div)
        this.update()
        if (this.isPrj)
        {
            post.on('gitStatus',this.onGitStatus)
            Git.status(this.path)
        }
    }

    stashInfo ()
    {
        var info

        info = {}
        if (this.isPrj)
        {
            info.prj = this.path
            info.collapsed = this.collapsed
        }
        else
        {
            info.path = this.path
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
        var _45_17_

        this.foreign = ((_45_17_=this.foreign) != null ? _45_17_ : [])
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
        var change, changes, _65_23_

        if (this.state)
        {
            if ((this.foreign != null ? this.foreign.length : undefined))
            {
                var list = _k_.list(this.foreign)
                for (var _66_28_ = 0; _66_28_ < list.length; _66_28_++)
                {
                    changes = list[_66_28_]
                    var list1 = _k_.list(changes)
                    for (var _67_31_ = 0; _67_31_ < list1.length; _67_31_++)
                    {
                        change = list1[_67_31_]
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
        if (!slash.samePath(this.path,newFile))
        {
            this.path = slash.path(newFile)
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
        var diss, html, name, sep

        this.div.innerHTML = ''
        this.div.classList.toggle('dirty',this.dirty)
        this.div.classList.toggle('active',this.active)
        sep = '●'
        if (this.isPrj)
        {
            sep = ''
        }
        this.dot = elem('span',{class:'dot',text:sep})
        this.div.appendChild(this.dot)
        diss = Syntax.dissForTextAndSyntax(slash.file(this.path),'ko')
        if (!prefs.get('tabs|extension'))
        {
            if (!_k_.empty(slash.ext(this.path)))
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
        this.tooltip = new tooltip({elem:name,bound:this.div,html:this.tooltipHtml,x:-2})
        if (this.isPrj)
        {
            if (this.collapsed)
            {
                console.log('collapsed prj',this.path,this.tabs.prjTabs)
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

        if ((this.path != null))
        {
            diss = Syntax.dissForTextAndSyntax(slash.tilde(this.path),'ko')
            html = Render.line(diss,{wrapSpan:'tooltip-path'})
            if (this.isPrj && (numFiles = Projects.files(this.path).length))
            {
                html += Render.line(Syntax.dissForTextAndSyntax(`${numFiles} files`,'git'),{wrapSpan:'tooltip-line'})
                Git.status(this.path)
            }
        }
        return html
    }

    onGitStatus (status)
    {
        var t, _186_19_, _186_24_

        if (status.gitDir !== this.path)
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
        post.emit('tabClosed',this.path)
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
}

export default Tab;