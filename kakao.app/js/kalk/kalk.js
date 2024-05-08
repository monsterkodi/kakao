var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var cpy, currentSelection, cut, onCombo, onMenuAction, paste

console.log('kljsla')
import kakao from "../kakao.js"

import kxk from "../kxk.js"
let win = kxk.win
let post = kxk.post
let stopEvent = kxk.stopEvent

console.log('kalk')
import keys from "./keys.js"
import input from "./input.js"
import sheet from "./sheet.js"

post.on('calc',function (calc)
{
    window.input.setText(calc)
    return post.emit('button','=')
})

currentSelection = function ()
{
    var selection

    selection = document.getSelection().toString()
    if (!_k_.empty(selection))
    {
        return selection
    }
    return ''
}

cpy = function ()
{
    var selection

    if (selection = currentSelection())
    {
        return kakao('clipboard.write',selection)
    }
    else
    {
        return kakao('clipboard.write',window.input.text())
    }
}

cut = function ()
{
    var selection

    cpy()
    if (selection = currentSelection())
    {
        return document.getSelection().deleteFromDocument()
    }
    else
    {
        return window.input.clear()
    }
}

paste = async function ()
{
    var text

    text = await kakao('clipboard.read')
    return window.input.setText(window.input.text() + text)
}

onCombo = function (combo, info)
{
    if ('unhandled' !== window.keys.globalModKeyComboEvent(info.mod,info.key,info.combo,info.event))
    {
        return stopEvent(info.event)
    }
    switch (combo)
    {
        case 'ctrl+v':
            return paste()

        case 'ctrl+c':
            return cpy()

        case 'ctrl+x':
            return cut()

    }

}
post.on('combo',onCombo)

onMenuAction = function (action, args)
{
    switch (action)
    {
        case 'Cut':
            return cut()

        case 'Copy':
            return cpy()

        case 'Paste':
            return paste()

        case 'Clear All':
            post.emit('sheet','clear')
            return post.emit('menuAction','Clear')

        case 'Save':
            return post.toMain('saveBuffer')

    }

}
post.on('menuAction',onMenuAction)

window.onresize = function ()
{
    return post.emit('resize')
}
kakao.init(function ()
{
    console.log('init')
    new win(new win.Delegate)
    window.sheet = new sheet
    window.input = new input
    window.keys = new keys
    return this
})