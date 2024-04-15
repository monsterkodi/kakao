var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../kxk.js"
let elem = kxk.elem
let slash = kxk.slash
let tooltip = kxk.tooltip

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
        this.div = elem({class:'tab app-drag-region'})
        this.tabs.div.appendChild(this.div)
        this.update()
        if (this.isPrj())
        {
            Git.status(this.path)
        }
    }

    update ()
    {
        var diss, dot, html, name, prj, sep, tab, tabs, _36_45_, _37_46_, _92_21_

        this.div.innerHTML = ''
        this.div.classList.toggle('dirty',(this.dirty != null))
        this.div.classList.toggle('active',(this.active != null))
        sep = '●'
        if (this.isPrj())
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
        if (this.isPrj())
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
            else if (this.tmp)
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
        if (this.isPrj())
        {
            if (Git.statusCache[this.path])
            {
                this.onGitStatus(Git.statusCache[this.path])
            }
            if (this.collapsed)
            {
                tabs = this.tabs.fileTabsForPath(this.path)
                var list = _k_.list(tabs)
                for (var _84_24_ = 0; _84_24_ < list.length; _84_24_++)
                {
                    tab = list[_84_24_]
                    dot = elem('span',{class:'prjdot',text:'■'})
                    this.div.appendChild(dot)
                    if (tab.active)
                    {
                        dot.classList.add('activeTab')
                    }
                }
            }
        }
        else
        {
            if ((this.dirty != null))
            {
                this.div.appendChild(elem('span',{class:'dot',text:'●'}))
            }
            if (prj = this.tabs.prjTabForPath(this.path))
            {
                if (prj.collapsed)
                {
                    this.div.style.display = 'none'
                }
            }
        }
        return this
    }

    tooltipHtml ()
    {
        var diss, html, numFiles, _108_16_

        if ((this.path != null))
        {
            diss = Syntax.dissForTextAndSyntax(slash.tilde(this.path),'ko')
            html = Render.line(diss,{wrapSpan:'tooltip-path'})
            if (this.isPrj() && (numFiles = Projects.files(this.path).length))
            {
                html += Render.line(Syntax.dissForTextAndSyntax(`${numFiles} files`,'git'),{wrapSpan:'tooltip-line'})
                Git.status(this.path)
            }
        }
        return html
    }

    onGitStatus (status)
    {
        var t, _129_19_, _129_24_

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

    togglePinned ()
    {
        var tab

        if (tab = this.tabs.koreTabForPath(this.path))
        {
            if (tab.tmp)
            {
                delete tab.tmp
            }
            else
            {
                if (tab.pinned)
                {
                    delete tab.pinned
                }
                else
                {
                    tab.pinned = true
                }
            }
            this.tabs.update()
        }
        return this
    }

    isPrj ()
    {
        return this.type === 'prj'
    }

    index ()
    {
        return this.tabs.tabs.indexOf(this)
    }
}

export default Tab;