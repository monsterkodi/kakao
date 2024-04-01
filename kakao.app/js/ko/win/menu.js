var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var getMenu, Menu

import kxk from "../../kxk.js"
let slash = kxk.slash

import Editor from "../editor/Editor.js"

import Macro from "../commands/Macro.js"


getMenu = function (template, name)
{
    var item

    var list = _k_.list(template)
    for (var _16_13_ = 0; _16_13_ < list.length; _16_13_++)
    {
        item = list[_16_13_]
        if (item.text === name)
        {
            return item
        }
    }
}

Menu = function (template)
{
    var actions, commandMenu, editMenu, EditMenu, item, k, key, macro, MacroMenu, menu, menuName, modName, submenu, transform, transformList, transformMenu, TransformMenu, transformSubmenu, transformText, v, value, _39_38_, _45_33_, _46_44_, _48_43_, _49_39_, _67_27_

    if (_k_.isArr(template))
    {
        template = _k_.clone(template)
    }
    else
    {
        console.log('no array?',typeof(template),template)
        template = []
    }
    submenu = {Misc:[]}
    EditMenu = []
    for (modName in Editor.actionModules)
    {
        actions = Editor.actionModules[modName]
        for (key in actions)
        {
            value = actions[key]
            menuName = 'Misc'
            if (key === 'actions')
            {
                if ((value['menu'] != null))
                {
                    menuName = value['menu']
                    submenu[menuName] = ((_39_38_=submenu[menuName]) != null ? _39_38_ : [])
                }
                for (k in value)
                {
                    v = value[k]
                    if (v.name && v.combo)
                    {
                        item = {text:v.name,combo:v.combo}
                        if ((v.menu != null))
                        {
                            submenu[v.menu] = ((_46_44_=submenu[v.menu]) != null ? _46_44_ : [])
                        }
                        if (v.separator)
                        {
                            submenu[((_48_43_=v.menu) != null ? _48_43_ : menuName)].push({text:''})
                        }
                        submenu[((_49_39_=v.menu) != null ? _49_39_ : menuName)].push(item)
                    }
                }
            }
        }
    }
    for (key in submenu)
    {
        menu = submenu[key]
        EditMenu.push({text:key,menu:menu})
    }
    editMenu = getMenu(template,'Edit')
    editMenu.menu = editMenu.menu.concat(EditMenu)
    MacroMenu = [{text:'Macro',combo:'command+m',command:'macro'}]
    var list = _k_.list(Macro.macroNames)
    for (var _58_14_ = 0; _58_14_ < list.length; _58_14_++)
    {
        macro = list[_58_14_]
        MacroMenu.push({text:macro,action:'doMacro'})
    }
    commandMenu = getMenu(template,'Command')
    commandMenu.menu = commandMenu.menu.concat({text:'Macro',menu:MacroMenu})
    transform = Editor.actionModules.transform
    if (((transform != null ? transform.Transform : undefined) != null))
    {
        TransformMenu = []
        for (transformMenu in transform.Transform.transformMenus)
        {
            transformList = transform.Transform.transformMenus[transformMenu]
            transformSubmenu = []
            var list1 = _k_.list(transformList)
            for (var _71_30_ = 0; _71_30_ < list1.length; _71_30_++)
            {
                transformText = list1[_71_30_]
                transformSubmenu.push({text:transformText,action:'doTransform'})
            }
            TransformMenu.push({text:transformMenu,menu:transformSubmenu})
        }
        editMenu.menu = editMenu.menu.concat({text:'Transform',menu:TransformMenu})
    }
    return template
}
export default Menu;