var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var FuncList

import kxk from "../../kxk.js"
let elem = kxk.elem
let post = kxk.post

import FuncItems from "../tools/FuncItems.js"
import Indexer from "../tools/Indexer.js"

import Syntax from "./Syntax.js"


FuncList = (function ()
{
    function FuncList (editor)
    {
        this.editor = editor
    
        this["onFileIndexed"] = this["onFileIndexed"].bind(this)
        this["onEditorFile"] = this["onEditorFile"].bind(this)
        this.elem = elem({class:'funclist'})
        this.editor.view.appendChild(this.elem)
        post.on('fileIndexed',this.onFileIndexed)
        kore.on('editor|file',this.onEditorFile)
    }

    FuncList.prototype["onEditorFile"] = function (file)
    {
        var info

        if (info = Indexer.file(file))
        {
            return this.onFileIndexed(file,info)
        }
    }

    FuncList.prototype["onFileIndexed"] = function (file, info)
    {
        var item, items

        if (file === kore.get('editor|file'))
        {
            items = FuncItems.forIndexerInfo(file,info)
            console.log('FuncList.onFileIndexed',file,info,items)
            this.elem.innerHTML = ''
            var list = _k_.list(items)
            for (var _43_21_ = 0; _43_21_ < list.length; _43_21_++)
            {
                item = list[_43_21_]
                elem({parent:this.elem,html:Syntax.spanForTextAndSyntax(item.text,'browser')})
            }
        }
    }

    return FuncList
})()

export default FuncList;