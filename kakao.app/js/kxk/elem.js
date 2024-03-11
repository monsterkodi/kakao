// monsterkodi/kode 0.256.0

var _k_ = {isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var elem, isElement

import proto from "./proto.js"


isElement = function (value)
{
    return (value != null ? value.nodeType : undefined) === 1 && !(_k_.isObj(value))
}

elem = function (typ, opt)
{
    var c, e, event, k, _28_15_, _32_16_, _36_19_, _41_17_

    if (typ && typeof(typ) === 'object')
    {
        opt = typ
        typ = opt.typ
    }
    opt = (opt != null ? opt : {})
    typ = (typ != null ? typ : 'div')
    e = document.createElement(typ)
    if (_k_.isStr(opt.text) || _k_.isNum(opt.text))
    {
        e.textContent = opt.text
        delete opt.text
    }
    if ((opt.html != null) && _k_.isStr(opt.html))
    {
        e.innerHTML = opt.html
        delete opt.html
    }
    if ((opt.child != null) && isElement(opt.child))
    {
        e.appendChild(opt.child)
        delete opt.child
    }
    if ((opt.children != null) && opt.children instanceof Array)
    {
        var list = _k_.list(opt.children)
        for (var _37_14_ = 0; _37_14_ < list.length; _37_14_++)
        {
            c = list[_37_14_]
            if (isElement(c))
            {
                e.appendChild(c)
            }
        }
        delete opt.children
    }
    if ((opt.parent != null) && isElement(opt.parent))
    {
        opt.parent.appendChild(e)
        delete opt.parent
    }
    var list1 = ['mousedown','mousemove','mouseup','click','dblclick']
    for (var _45_14_ = 0; _45_14_ < list1.length; _45_14_++)
    {
        event = list1[_45_14_]
        if (opt[event] && typeof(opt[event]) === 'function')
        {
            e.addEventListener(event,opt[event])
            delete opt[event]
        }
    }
    var list2 = _k_.list(Object.keys(opt))
    for (var _50_10_ = 0; _50_10_ < list2.length; _50_10_++)
    {
        k = list2[_50_10_]
        e.setAttribute(k,opt[k])
    }
    return e
}

elem.containsPos = function (div, pos)
{
    var br

    br = div.getBoundingClientRect()
    return (br.left <= pos.x && pos.x <= br.left + br.width) && (br.top <= pos.y && pos.y <= br.top + br.height)
}

elem.childIndex = function (e)
{
    return Array.prototype.indexOf.call(e.parentNode.childNodes,e)
}

elem.upAttr = function (element, attr)
{
    var a, _64_28_

    if (!(element != null))
    {
        return null
    }
    a = (typeof element.getAttribute === "function" ? element.getAttribute(attr) : undefined)
    if (a !== null && a !== '')
    {
        return a
    }
    return elem.upAttr(element.parentNode,attr)
}

elem.upProp = function (element, prop)
{
    if (!(element != null))
    {
        return null
    }
    if ((element[prop] != null))
    {
        return element[prop]
    }
    return elem.upProp(element.parentNode,prop)
}

elem.upElem = function (element, opt)
{
    var _77_30_, _78_31_, _79_31_, _79_57_, _79_68_, _80_32_, _80_55_

    if (!(element != null))
    {
        return null
    }
    if (((opt != null ? opt.tag : undefined) != null) && opt.tag === element.tagName)
    {
        return element
    }
    if (((opt != null ? opt.prop : undefined) != null) && (element[opt.prop] != null))
    {
        return element
    }
    if (((opt != null ? opt.attr : undefined) != null) && ((typeof element.getAttribute === "function" ? element.getAttribute(opt.attr) : undefined) != null))
    {
        return element
    }
    if (((opt != null ? opt.class : undefined) != null) && (element.classList != null ? element.classList.contains(opt.class) : undefined))
    {
        return element
    }
    return elem.upElem(element.parentNode,opt)
}

elem.downElem = function (element, opt)
{
    var child, found, _86_30_, _87_16_, _88_40_, _89_16_, _89_42_, _89_53_, _90_40_

    if (!(element != null))
    {
        return null
    }
    if (((opt != null ? opt.tag : undefined) != null) && opt.tag === element.tagName)
    {
        return element
    }
    if (((opt != null ? opt.prop : undefined) != null) && (element[opt.prop] != null))
    {
        if (!((opt != null ? opt.value : undefined) != null) || element[opt.prop] === opt.value)
        {
            return element
        }
    }
    if (((opt != null ? opt.attr : undefined) != null) && ((typeof element.getAttribute === "function" ? element.getAttribute(opt.attr) : undefined) != null))
    {
        if (!((opt != null ? opt.value : undefined) != null) || element.getAttribute(opt.attr) === opt.value)
        {
            return element
        }
    }
    var list = _k_.list(element.children)
    for (var _91_14_ = 0; _91_14_ < list.length; _91_14_++)
    {
        child = list[_91_14_]
        if (found = elem.downElem(child,opt))
        {
            return found
        }
    }
}
elem.isElement = isElement
export default elem;