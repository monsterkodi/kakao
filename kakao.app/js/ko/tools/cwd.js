var _k_

var $

import syntax from "../editor/syntax.js"

import dom from "../../kxk/dom.js"

import post from "../../kxk/post.js"

import elem from "../../kxk/elem.js"

import slash from "../../kxk/slash.js"

$ = dom.$

class CWD
{
    constructor ()
    {
        this.stash = this.stash.bind(this)
        this.restore = this.restore.bind(this)
        this.onCwdSet = this.onCwdSet.bind(this)
        this.elem = elem({class:'cwd'})
        $('commandline-span').appendChild(this.elem)
        post.on('stash',this.stash)
        post.on('restore',this.restore)
        post.on('cwdSet',this.onCwdSet)
        this.restore()
    }

    onCwdSet (cwd)
    {
        var html, text

        this.cwd = cwd
    
        text = slash.tilde(this.cwd)
        html = syntax.spanForTextAndSyntax(text,'browser')
        return this.elem.innerHTML = html
    }

    visible ()
    {
        return this.elem.style.display !== 'none'
    }

    restore ()
    {}

    stash ()
    {}

    toggle ()
    {
        this.elem.style.display = this.visible() && 'none' || 'unset'
        return this.stash()
    }
}

export default CWD;