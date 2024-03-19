var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var getMenu, Menu

import slash from "../../kxk/slash.js"

import transform from "../editor/actions/transform.js"

import Editor from "../editor/Editor.js"

import Macro from "../commands/Macro.js"


getMenu = function (template, name)
{
    var item

    var list = _k_.list(template)
    for (var _17_13_ = 0; _17_13_ < list.length; _17_13_++)
    {
        item = list[_17_13_]
        if (item.text === name)
        {
            return item
        }
    }
}

Menu = function (template)
{
    var actions, combo, commandMenu, editMenu, EditMenu, item, k, key, macro, MacroMenu, menu, menuName, modName, submenu, transform, transformList, transformMenu, TransformMenu, transformSubmenu, v, value, _40_38_, _44_40_, _48_33_, _49_44_, _51_43_, _52_39_, _69_27_

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
                    submenu[menuName] = ((_40_38_=submenu[menuName]) != null ? _40_38_ : [])
                }
                for (k in value)
                {
                    v = value[k]
                    if (v.name && v.combo)
                    {
                        combo = ((_44_40_=v.combo) != null ? _44_40_ : v.accel)
                        item = {text:v.name,accel:combo}
                        if ((v.menu != null))
                        {
                            submenu[v.menu] = ((_49_44_=submenu[v.menu]) != null ? _49_44_ : [])
                        }
                        if (v.separator)
                        {
                            submenu[((_51_43_=v.menu) != null ? _51_43_ : menuName)].push({text:''})
                        }
                        submenu[((_52_39_=v.menu) != null ? _52_39_ : menuName)].push(item)
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
    MacroMenu = [{text:'Macro',combo:'command+m',accel:'ctrl+m',command:'macro'}]
    var list = _k_.list(Macro.macroNames)
    for (var _61_14_ = 0; _61_14_ < list.length; _61_14_++)
    {
        macro = list[_61_14_]
        MacroMenu.push({text:macro,action:'doMacro'})
    }
    commandMenu = getMenu(template,'Command')
    commandMenu.menu = commandMenu.menu.concat({text:'Macro',menu:MacroMenu})
    if (((transform != null ? transform.Transform : undefined) != null))
    {
        TransformMenu = []
        for (transformMenu in transform.Transform.transformMenus)
        {
            transformList = transform.Transform.transformMenus[transformMenu]
            transformSubmenu = []
            var list1 = _k_.list(transformList)
            for (var _73_26_ = 0; _73_26_ < list1.length; _73_26_++)
            {
                transform = list1[_73_26_]
                transformSubmenu.push({text:transform,action:'doTransform'})
            }
            TransformMenu.push({text:transformMenu,menu:transformSubmenu})
        }
        editMenu.menu = editMenu.menu.concat({text:'Transform',menu:TransformMenu})
    }
    return template
}
export default Menu;