var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var addVaultItem, adjustValue, ask, clearInput, clearSitePassword, closeVaultItem, copyAndSavePattern, copyPassword, currentPassword, Delegate, deleteStash, editVaultKey, hasLock, hideLock, hidePattern, hideSettings, hideSitePassword, initBody, initButtons, initEvents, initInputBorder, lockClosed, lockOpen, logOut, makePassword, masterAnim, masterChanged, masterConfirmed, masterFade, masterSitePassword, masterStart, mstr, onButton, onPrefsKey, onStashKey, onVaultKey, openUrl, openVaultItem, patternChanged, patternConfirmed, prefInfo, readStash, resetStash, resetTimeout, saveBody, savePattern, saveVaultKey, say, setBool, setInput, setSite, setWinHeight, showHelp, showPassword, showPattern, showPrefs, showSettings, showSitePassword, showStash, showVault, siteChanged, startTimeout, stash, stashExists, stashFile, stashLoaded, stopTimeout, timeoutDelay, timeoutInSeconds, timeoutInterval, timeoutLast, timeoutPercent, timeoutTick, togglePattern, togglePrefs, toggleSettings, toggleStash, toggleVault, toggleVaultItem, unsay, updateFloppy, updateSiteFromClipboard, updateStashButton, vaultArrow, vaultValue, whisper, writeStash

import kakao from "../kakao.js"

import kxk from "../kxk.js"
let win = kxk.win
let about = kxk.about
let randInt = kxk.randInt
let uuid = kxk.uuid
let elem = kxk.elem
let ffs = kxk.ffs
let keyinfo = kxk.keyinfo
let post = kxk.post
let prefs = kxk.prefs
let slash = kxk.slash
let stopEvent = kxk.stopEvent
let $ = kxk.$

import urltools from "./tools/urltools.js"
import password from "./tools/password.js"
import cryptools from "./tools/cryptools.js"

window.WIN_WIDTH = 366
window.WIN_MIN_HEIGHT = 353
window.WIN_MAX_HEIGHT = 490
mstr = undefined
stashFile = '~/.turtle'
stash = undefined
stashExists = false
stashLoaded = false
currentPassword = undefined

resetStash = function ()
{
    stashLoaded = false
    clearInput('site')
    clearInput('password')
    clearInput('pattern')
    updateFloppy()
    return stash = {pattern:'',configs:{}}
}

setWinHeight = async function (h)
{
    var info

    info = await kakao('win.frameInfo')
    return kakao('win.setFrame',{x:info.frame.x,y:info.frame.y + info.frame.h - h,w:info.frame.w,h:h})
}

masterStart = function ()
{
    startTimeout(prefs.get('timeout',1))
    if (stashExists)
    {
        $('turtle').disabled = false
        updateSiteFromClipboard()
        showSitePassword()
        return masterSitePassword()
    }
    else
    {
        showSettings()
        return $('buttons').style.display = 'none'
    }
}

masterAnim = function ()
{
    var master

    master = $('master')
    master.value = ''
    setWinHeight(WIN_MAX_HEIGHT)
    return setTimeout(masterStart,300)
}

masterFade = function ()
{
    $('turtle').disabled = true
    return setWinHeight(WIN_MIN_HEIGHT)
}

masterConfirmed = async function ()
{
    var _90_35_, _91_35_

    if ((mstr != null ? mstr.length : undefined))
    {
        console.log('masterConfirmed',mstr,stashExists)
        if (stashExists)
        {
            await readStash()
            if (stashLoaded)
            {
                $('turtle').disabled = false
                say()
                masterAnim()
                if (($('master-timeout') != null)) { $('master-timeout').style.width = '100%' }
                if (($('master-timeout') != null)) { $('master-timeout').style.left = '0%' }
            }
            else
            {
                whisper(['oops?','what?','...?','nope!'][randInt(3)],2000)
            }
        }
        else
        {
            say(['Well chosen!','Nice one!','Good choice!'][randInt(2)],'And your <span class="open" onclick="showHelp();">password pattern?</span>')
            masterAnim()
        }
    }
    return true
}

patternConfirmed = function ()
{
    console.log('patternConfirmed')
    if ($("pattern").value.length && stash.pattern !== $("pattern").value)
    {
        if (stash.pattern === '')
        {
            say(['Also nice!','What a beautiful pattern!','The setup is done!'][randInt(2)],'Have fun generating passwords!',5000)
            $('turtle').disabled = false
        }
        else
        {
            if (!ask('change the default <i>pattern</i>?','if yes, press return again.'))
            {
                return
            }
            say('the new default pattern is','<i>' + $("pattern").value + '</i>',6000)
        }
        stash.pattern = $("pattern").value
        return writeStash()
    }
    else if (stash.pattern === $("pattern").value)
    {
        return toggleSettings()
    }
}

masterChanged = function ()
{
    if (stashExists)
    {
        say()
    }
    else
    {
        say('Welcome to <b>password-turtle</b>.','What will be your <span class="open" onclick="showHelp();">master key?</span>')
    }
    return logOut()
}

patternChanged = function ()
{
    updateFloppy()
    return masterSitePassword()
}

savePattern = async function ()
{
    var hash, site

    site = $('site').value
    hash = await cryptools.genHash(site + mstr)
    stash.configs[hash].pattern = $('pattern').value
    writeStash()
    return masterSitePassword()
}

copyAndSavePattern = async function ()
{
    var hash, site, url

    copyPassword()
    site = $('site').value
    hash = await cryptools.genHash(site + mstr)
    if (!(stash.configs[hash] != null))
    {
        url = await cryptools.encrypt(site,mstr)
        stash.configs[hash] = {url:url}
        whisper('<u>password</u> copied and<br></i>pattern</i> remembered',2000)
        return savePattern()
    }
    else if (stash.configs[hash].pattern !== $('pattern').value)
    {
        if (!ask('Replace <i>' + stash.configs[hash].pattern + '</i>','with <i>' + $('pattern').value + '</i>?'))
        {
            return
        }
        say('Using <i>' + $('pattern').value + '</i>','for <b>' + site + '</b>',2000)
        return savePattern()
    }
}

copyPassword = function ()
{
    var pw

    resetTimeout()
    pw = currentPassword
    if ((pw != null ? pw.length : undefined))
    {
        kakao('clipboard.write',pw)
        $("password").focus()
        console.log('currentPassword',currentPassword)
        return whisper('<u>password</u> copied',2000)
    }
}

initEvents = function ()
{
    var border, input

    var list = _k_.list(document.querySelectorAll('input'))
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        input = list[_a_]
        input.addEventListener('focus',function (e)
        {
            var _175_70_

            ;($(e.target.id + '-border') != null ? $(e.target.id + '-border').classList.add('focus') : undefined)
            return true
        })
        input.addEventListener('blur',function (e)
        {
            var _176_70_

            ;($(e.target.id + '-border') != null ? $(e.target.id + '-border').classList.remove('focus') : undefined)
            return true
        })
        input.addEventListener('input',function (e)
        {
            var _178_35_

            if (($(e.target.id + '-ghost') != null)) { $(e.target.id + '-ghost').style.opacity = e.target.value.length ? 0 : 1 }
            return true
        })
        if (input.id !== 'master')
        {
            input.addEventListener('mouseenter',function (e)
            {
                return $(e.target).focus()
            })
        }
    }
    var list1 = _k_.list(document.querySelectorAll('.border'))
    for (var _b_ = 0; _b_ < list1.length; _b_++)
    {
        border = list1[_b_]
        if (border.id !== 'master-border')
        {
            border.addEventListener('mouseenter',function (e)
            {
                return $(e.target.id.substr(0,e.target.id.length - 7)).focus()
            })
        }
    }
    $('master').addEventListener('input',masterChanged)
    $('site').addEventListener('input',siteChanged)
    $('pattern').addEventListener('input',patternChanged)
    $('turtle').addEventListener('click',toggleStash)
    $('password').addEventListener('mousedown',copyPassword)
    $('turtle').addEventListener('mouseenter',function (e)
    {
        return $('turtle').focus()
    })
    return true
}

window.onclose = function (event)
{
    return prefs.save()
}

window.onfocus = function (event)
{
    var _215_17_, _216_17_, _218_19_

    resetTimeout()
    if (stashLoaded)
    {
        updateSiteFromClipboard()
        ;($("site") != null ? $("site").focus() : undefined)
        return ($("site") != null ? $("site").select() : undefined)
    }
    else
    {
        return ($("master") != null ? $("master").focus() : undefined)
    }
}
timeoutInterval = undefined
timeoutInSeconds = 0
timeoutDelay = 0
timeoutLast = undefined

timeoutPercent = function (pct)
{
    var mto

    if (mto = $('master-timeout'))
    {
        mto.style.width = pct + '%'
        return mto.style.left = (50 - pct / 2) + '%'
    }
}

timeoutTick = function ()
{
    var delta, now, pct

    now = Date.now()
    delta = (now - timeoutLast) / 1000
    timeoutLast = now
    timeoutInSeconds -= delta
    pct = 100 * timeoutInSeconds / timeoutDelay
    timeoutPercent(pct)
    if (timeoutInSeconds <= 0)
    {
        return logOut()
    }
}

startTimeout = function (mins)
{
    timeoutDelay = mins * 60
    stopTimeout()
    resetTimeout()
    if (mins)
    {
        timeoutLast = Date.now()
        timeoutInterval = setInterval(timeoutTick,1000)
    }
    return timeoutPercent(mins && 100 || 0)
}

stopTimeout = function ()
{
    if (timeoutInterval)
    {
        clearInterval(timeoutInterval)
        timeoutInterval = undefined
    }
    return timeoutPercent(0)
}

resetTimeout = function ()
{
    timeoutInSeconds = timeoutDelay
    if (timeoutInterval)
    {
        return timeoutPercent(100)
    }
}

logOut = function ()
{
    var _277_22_

    console.log('logout',$('master'),$('bubble'))
    stopTimeout()
    if (!($('bubble') != null))
    {
        restoreBody()
    }
    mstr = $('master').value
    setInput('master',mstr)
    $('master').focus()
    timeoutPercent(0)
    hideSitePassword()
    hideSettings()
    stashLoaded = false
    return masterFade()
}

saveBody = function ()
{
    var savedBody, savedFocus, savedSite, _299_29_, _302_26_

    resetTimeout()
    if (!($('bubble') != null))
    {
        return
    }
    savedFocus = document.activeElement.id
    savedSite = ($('site') != null ? $('site').value : undefined)
    savedBody = document.body.innerHTML
    return window.restoreBody = function (site)
    {
        var _320_25_

        resetTimeout()
        document.body.innerHTML = savedBody
        initEvents()
        setInput('pattern',stash.pattern)
        if ((site != null))
        {
            hideSettings()
            showSitePassword()
            setInput('site',site)
            masterSitePassword()
            return copyPassword()
        }
        else
        {
            setInput('site',savedSite)
            ;($(savedFocus) != null ? $(savedFocus).focus() : undefined)
            masterSitePassword()
            updateFloppy()
            if ($('settings').style.display !== 'none')
            {
                showSettings()
            }
            if (_k_.empty((stash.configs)) && savedFocus === 'stash')
            {
                return $('prefs').focus()
            }
        }
    }
}

initBody = function (name)
{
    var lst, scroll

    saveBody()
    lst = elem({class:'list',id:name + 'list'})
    scroll = elem({class:'scroll',id:name + 'scroll'})
    lst.appendChild(scroll)
    lst.appendChild(initButtons())
    document.body.innerHTML = ''
    return document.body.appendChild(lst)
}

initInputBorder = function (inp)
{
    inp.addEventListener('focus',function (e)
    {
        return $(e.target.parentElement).classList.add('focus')
    })
    inp.addEventListener('blur',function (e)
    {
        return $(e.target.parentElement).classList.remove('focus')
    })
    return inp.addEventListener('mouseenter',function (e)
    {
        return $(e.target).focus()
    })
}

initButtons = function ()
{
    var brd, btn, buttons, icn, icon, spn

    buttons = elem({id:'buttons',class:'buttons app-drag-region'})
    for (btn in {stash:'',vault:'',pttrn:'❇',prefs:'',help:''})
    {
        icon = {stash:'',vault:'',pttrn:'❇',prefs:'',help:''}[btn]
        spn = elem('span',{class:'button-span'})
        brd = elem({class:'button-border border',id:btn + '-border'})
        icn = elem({id:btn,class:'button',text:icon})
        spn.appendChild(brd)
        brd.appendChild(icn)
        buttons.appendChild(spn)
        icn.addEventListener('click',onButton)
    }
    return buttons
}

onButton = function (event)
{
    switch (event.target.id)
    {
        case 'stash':
            return toggleStash()

        case 'vault':
            return toggleVault()

        case 'pttrn':
            return togglePattern()

        case 'prefs':
            return togglePrefs()

        case 'help':
            return showHelp()

    }

}

deleteStash = function ()
{
    if (ask('delete all remembered <i>patterns</i>?','if yes, confirm again.'))
    {
        try
        {
            ffs.remove(stashFile)
            resetStash()
            stashExists = false
            $('master').value = ''
            $('master').focus()
            return masterChanged()
        }
        catch (err)
        {
            return say('woops!','can\'t remove file!')
        }
    }
}

writeStash = async function ()
{
    var str

    str = JSON.stringify(stash)
    await cryptools.encryptFile(stashFile,str,mstr)
    updateFloppy()
    if (!stashLoaded)
    {
        stash = ''
        await readStash()
        if (stashLoaded && JSON.stringify(stash) === str)
        {
            return toggleSettings()
        }
    }
}

readStash = async function ()
{
    var json

    try
    {
        json = await cryptools.decryptFile(stashFile,mstr)
        stashLoaded = true
        stash = JSON.parse(json)
        setInput('pattern',stash.pattern)
        return updateFloppy()
    }
    catch (err)
    {
        return resetStash()
    }
}

onStashKey = function (event)
{
    var char, combo, e, key, mod, _440_44_, _440_57_, _440_69_, _441_44_, _441_61_, _441_73_, _442_54_, _445_20_, _446_46_, _449_51_, _449_63_

    mod = keyinfo.forEvent(event).mod
    key = keyinfo.forEvent(event).key
    combo = keyinfo.forEvent(event).combo
    char = keyinfo.forEvent(event).char

    e = document.activeElement
    switch (combo)
    {
        case 'right':
        case 'down':
            return (e != null ? (_440_44_=e.parentElement) != null ? (_440_57_=_440_44_.nextSibling) != null ? (_440_69_=_440_57_.firstChild) != null ? _440_69_.focus() : undefined : undefined : undefined : undefined)

        case 'left':
        case 'up':
            return (e != null ? (_441_44_=e.parentElement) != null ? (_441_61_=_441_44_.previousSibling) != null ? (_441_73_=_441_61_.firstChild) != null ? _441_73_.focus() : undefined : undefined : undefined : undefined)

        case 'enter':
            return restoreBody((e != null ? (_442_54_=e.nextSibling) != null ? _442_54_.innerHTML : undefined : undefined))

        case 'command+backspace':
        case 'ctrl+backspace':
            if ((e != null ? (_445_20_=e.id) != null ? _445_20_.length : undefined : undefined))
            {
                if ((e.parentElement.nextSibling != null))
                {
                    e.parentElement.nextSibling.firstChild.focus()
                }
                else
                {
                    ;((_449_51_=e.parentElement.previousSibling) != null ? (_449_63_=_449_51_.firstChild) != null ? _449_63_.focus() : undefined : undefined)
                }
                delete stash.configs[e.id]
                e.parentElement.remove()
                writeStash()
                if (_k_.empty(stash.configs))
                {
                    return restoreBody()
                }
            }
            break
    }

}

toggleStash = function ()
{
    var _458_21_

    if (($('stashlist') != null))
    {
        return restoreBody()
    }
    else
    {
        return showStash()
    }
}

showStash = async function ()
{
    var config, hash, item, lock, site, siteSpan

    if (!stashLoaded)
    {
        return
    }
    if (_k_.empty(stash.configs))
    {
        showPrefs()
        return
    }
    initBody('stash')
    for (hash in stash.configs)
    {
        config = stash.configs[hash]
        site = await cryptools.decrypt(config.url,mstr)
        item = elem({class:'stash-item-border border'})
        item.appendChild(elem('input',{id:hash,type:'button',class:'stash-item'}))
        siteSpan = item.appendChild(elem('span',{class:'site',text:site}))
        lock = elem('span',{class:'lock'})
        item.appendChild(lock)
        if (config.pattern === stash.pattern)
        {
            lockClosed(lock)
        }
        else
        {
            lockOpen(lock)
            item.appendChild(elem('span',{class:'pattern',text:config.pattern}))
        }
        $('stashscroll').appendChild(item)
        item.addEventListener('mouseenter',function (event)
        {
            var _488_77_

            return (event.target.firstChild != null ? event.target.firstChild.focus() : undefined)
        })
        $(hash).addEventListener('click',function (event)
        {
            return restoreBody(event.target.nextSibling.innerHTML)
        })
        initInputBorder($(hash))
    }
    return $('stashscroll').firstChild.firstChild.focus()
}

onVaultKey = function (event)
{
    var char, combo, e, hash, key, mod, _520_37_, _520_50_, _520_63_, _520_75_, _521_37_, _521_54_, _521_71_, _521_83_, _526_20_, _532_20_, _533_46_, _533_59_, _536_51_, _536_68_, _536_80_

    mod = keyinfo.forEvent(event).mod
    key = keyinfo.forEvent(event).key
    combo = keyinfo.forEvent(event).combo
    char = keyinfo.forEvent(event).char

    e = document.activeElement
    switch (combo)
    {
        case 'command+n':
        case 'ctrl+n':
            hash = uuid()
            stash.vault[hash] = {key:""}
            addVaultItem(hash,stash.vault[hash].key)
            $(hash).focus()
            toggleVaultItem(hash)
            return editVaultKey(hash)

        case 'down':
            return (e != null ? (_520_37_=e.parentElement) != null ? (_520_50_=_520_37_.nextSibling) != null ? (_520_63_=_520_50_.nextSibling) != null ? (_520_75_=_520_63_.firstChild) != null ? _520_75_.focus() : undefined : undefined : undefined : undefined : undefined)

        case 'up':
            return (e != null ? (_521_37_=e.parentElement) != null ? (_521_54_=_521_37_.previousSibling) != null ? (_521_71_=_521_54_.previousSibling) != null ? (_521_83_=_521_71_.firstChild) != null ? _521_83_.focus() : undefined : undefined : undefined : undefined : undefined)

        case 'left':
            return closeVaultItem((e != null ? e.id : undefined))

        case 'right':
            return openVaultItem((e != null ? e.id : undefined))

        case 'space':
            if (((e != null ? e.id : undefined) != null))
            {
                toggleVaultItem(e.id)
                return event.preventDefault()
            }
            break
        case 'command+backspace':
        case 'ctrl+backspace':
            if ((e != null ? (_532_20_=e.id) != null ? _532_20_.length : undefined : undefined))
            {
                if (((e.parentElement.nextSibling != null ? e.parentElement.nextSibling.nextSibling : undefined) != null))
                {
                    e.parentElement.nextSibling.nextSibling.firstChild.focus()
                }
                else
                {
                    ;((_536_51_=e.parentElement.previousSibling) != null ? (_536_68_=_536_51_.previousSibling) != null ? (_536_80_=_536_68_.firstChild) != null ? _536_80_.focus() : undefined : undefined : undefined)
                }
                delete stash.vault[e.id]
                e.parentElement.nextSibling.remove()
                e.parentElement.remove()
                return writeStash()
            }
            break
    }

}

toggleVault = function ()
{
    var _542_34_

    if (($('vaultlist') != null))
    {
        return restoreBody()
    }
    else
    {
        return showVault()
    }
}

adjustValue = function (value)
{
    value.style.height = 'auto'
    value.style.height = value.scrollHeight + 'px'
    if (value.scrollHeight < 46)
    {
        return value.style.height = '28px'
    }
}

vaultValue = function (hash)
{
    return $(hash).parentElement.nextSibling
}

vaultArrow = function (hash)
{
    return $(hash).nextSibling
}

openVaultItem = function (hash)
{
    vaultValue(hash).style.display = 'block'
    vaultArrow(hash).innerHTML = '▼'
    return vaultArrow(hash).classList.add('open')
}

closeVaultItem = function (hash)
{
    vaultValue(hash).style.display = 'none'
    vaultArrow(hash).innerHTML = '►'
    return vaultArrow(hash).classList.remove('open')
}

toggleVaultItem = function (hash)
{
    if (vaultValue(hash).style.display === 'none')
    {
        return openVaultItem(hash)
    }
    else
    {
        return closeVaultItem(hash)
    }
}

saveVaultKey = function (event)
{
    var input

    input = $('.vault-key',event.parentElement)
    stash.vault[input.id].key = event.value
    input.value = stash.vault[input.id].key
    return writeStash()
}

editVaultKey = function (hash)
{
    var border, inp

    border = $(hash).parentElement
    inp = elem('input',{class:'vault-overlay vault-key',type:'input',value:$('.vault-key',border).value})
    inp.addEventListener('keydown',function (event)
    {
        var input, key

        key = keyinfo.keynameForEvent(event)
        switch (key)
        {
            case 'esc':
                input = $('.vault-key',event.target.parentElement)
                event.target.value = input.value
                event.stopPropagation()
                return input.focus()

            case 'enter':
                input = $('.vault-key',event.target.parentElement)
                saveVaultKey(event.target)
                input.focus()
                return stopEvent(event)

        }

    })
    inp.addEventListener('change',function (event)
    {
        return saveVaultKey(event.target)
    })
    inp.addEventListener('blur',function (event)
    {
        return event.target.remove()
    })
    border.appendChild(inp)
    inp.focus()
    return inp.setSelectionRange(inp.value.length,inp.value.length)
}

addVaultItem = function (hash, vaultKey, vaultValue)
{
    var arrow, input, item, value

    item = elem({class:'vault-item-border border'})
    input = elem('input',{class:'vault-item vault-key',type:'button',id:hash,value:vaultKey})
    arrow = elem({class:'vault-arrow',text:'►'})
    item.appendChild(input)
    item.appendChild(arrow)
    $('vaultscroll').appendChild(item)
    value = elem('textarea',{class:'vault-value',wrap:'off',rows:1})
    value.innerHTML = vaultValue || ''
    $('vaultscroll').appendChild(value)
    adjustValue(value)
    value.style.display = 'none'
    initInputBorder(input)
    item.addEventListener('mouseenter',function (e)
    {
        var _633_67_

        return (e.target.firstChild != null ? e.target.firstChild.focus() : undefined)
    })
    arrow.addEventListener('click',function (e)
    {
        return toggleVaultItem($(e.target).parentElement.firstChild.id)
    })
    input.addEventListener('click',function (e)
    {
        return toggleVaultItem($(e.target).id)
    })
    input.addEventListener('keydown',function (e)
    {
        if (keyinfo.keynameForEvent(e) === 'enter')
        {
            return editVaultKey($(e.target).id)
        }
    })
    value.addEventListener('focus',function (e)
    {
        var selToEnd

        selToEnd = function ()
        {
            return this.selectionStart = this.selectionEnd = this.value.length
        }
        return setTimeout(selToEnd.bind(e.target),1)
    })
    value.addEventListener('input',function (e)
    {
        return adjustValue(e.target)
    })
    return value.addEventListener('change',function (e)
    {
        input = $('.vault-key',e.target.previousSibling)
        stash.vault[input.id].value = e.target.value
        return writeStash()
    })
}

showVault = function ()
{
    var vaultHash, _652_22_

    if (!stashLoaded)
    {
        return
    }
    initBody('vault')
    if (!(stash.vault != null) || _k_.empty(Object.keys(stash.vault)))
    {
        stash.vault = {}
        stash.vault[uuid()] = {key:"title",value:"some secret"}
    }
    var list = _k_.list(Object.keys(stash.vault))
    for (var _c_ = 0; _c_ < list.length; _c_++)
    {
        vaultHash = list[_c_]
        addVaultItem(vaultHash,stash.vault[vaultHash].key,stash.vault[vaultHash].value)
    }
    return $('vaultscroll').firstChild.firstChild.focus()
}
prefInfo = {timeout:{type:'int',text:'autoclose delay',min:1},mask:{type:'bool',text:'mask locked passwords'},confirm:{type:'bool',text:'confirm changes'}}

togglePrefs = function ()
{
    var _678_21_

    if (($('prefslist') != null))
    {
        return restoreBody()
    }
    else
    {
        return showPrefs()
    }
}

showPrefs = function ()
{
    var bool, border, buttons, input, item, key, list, pref, value

    if (!stashLoaded)
    {
        return
    }
    initBody('prefs')
    list = $('.list')
    buttons = $('.buttons')
    border = elem({id:'pattern-border',class:'border',children:[elem('input',{id:'pattern',class:'main-input',type:'input',name:'pattern'}),elem('span',{children:[elem({id:'floppy',class:'ghost'}),elem({id:'pattern-ghost',class:'ghost',text:'pattern'})]})]})
    list.insertBefore(border,buttons)
    setInput('pattern',stash.pattern)
    updateFloppy()
    for (key in prefInfo)
    {
        pref = prefInfo[key]
        value = prefs.get(key)
        item = elem({class:'pref-item-border border'})
        input = elem('input',{id:key,type:'button',class:'pref-item'})
        item.appendChild(input)
        item.appendChild(elem('span',{class:'pref',text:pref.text}))
        switch (pref.type)
        {
            case 'bool':
                bool = elem('span',{class:'bool'})
                item.appendChild(bool)
                setBool(bool,value)
                break
            case 'int':
                item.appendChild(elem('span',{class:'int',text:value && value + ' min' || 'never'}))
                break
            case 'shortcut':
                item.appendChild(elem('span',{class:'shortcut',text:value}))
                break
        }

        $('prefsscroll').appendChild(item)
        initInputBorder(input)
        input.addEventListener('click',function (event)
        {
            var inp, inputChanged, intValue, msg

            key = event.target.id
            pref = prefInfo[key]
            switch (pref.type)
            {
                case 'bool':
                    prefs.set(key,!prefs.get(key))
                    bool = $('.bool',event.target.parentElement)
                    setBool(bool,prefs.get(key))
                    if (key === 'dark')
                    {
                        return toggleStyle()
                    }
                    break
                case 'int':
                    inputChanged = function (event)
                    {
                        var intValue, prefKey, _752_101_

                        input = $('input.pref-item',event.target.parentElement)
                        prefKey = input.id
                        intValue = parseInt(event.target.value)
                        if (isNaN(intValue))
                        {
                            intValue = 0
                        }
                        if ((prefInfo[prefKey].min != null) && intValue)
                        {
                            intValue = Math.max(prefInfo[prefKey].min,intValue)
                        }
                        $('.int',event.target.parentElement).innerHTML = intValue && intValue + ' min' || 'never'
                        prefs.set(prefKey,intValue)
                        if (prefKey === 'timeout')
                        {
                            startTimeout(intValue)
                        }
                        event.preventDefault()
                        return input.focus()
                    }
                    border = event.target.parentElement
                    intValue = parseInt($('.int',event.target.parentElement).innerHTML)
                    if (isNaN(intValue))
                    {
                        intValue = 0
                    }
                    inp = elem('input',{class:'pref-overlay int',value:intValue})
                    inp.addEventListener('blur',function (event)
                    {
                        return event.target.remove()
                    })
                    inp.addEventListener('change',inputChanged)
                    inp.addEventListener('keydown',function (event)
                    {
                        var inc, newValue, prefKey, _780_113_

                        key = keyinfo.keynameForEvent(event)
                        event.stopPropagation()
                        if (!(_k_.in('+',key)))
                        {
                            switch (key)
                            {
                                case 'esc':
                                    event.target.value = $('.int',event.target.parentElement)
                                    event.preventDefault()
                                    return $('input',event.target.parentElement).focus()

                                case 'up':
                                case 'down':
                                    prefKey = $('input',event.target.parentElement).id
                                    inc = prefInfo[prefKey].inc || 1
                                    newValue = parseInt(event.target.value) + (key === 'up' && inc || -inc)
                                    if ((prefInfo[prefKey].min != null))
                                    {
                                        newValue = Math.max(newValue,prefInfo[prefKey].min)
                                    }
                                    event.target.value = newValue
                                    return event.preventDefault()

                                case 'enter':
                                    return inputChanged(event)

                                case '0':
                                case '1':
                                case '2':
                                case '3':
                                case '4':
                                case '5':
                                case '6':
                                case '7':
                                case '8':
                                case '9':
                                case 'enter':
                                case 'backspace':
                                case 'left':
                                case 'right':
                                case 'tab':
                                    return 1

                                default:
                                    return event.preventDefault()
                            }

                        }
                    })
                    border.appendChild(inp)
                    return inp.focus()

                case 'shortcut':
                    border = event.target.parentElement
                    msg = elem('input',{class:'pref-overlay shortcut',type:'button',value:'press the shortcut'})
                    msg.addEventListener('keydown',function (event)
                    {
                        var combo, mod, prefKey

                        mod = keyinfo.forEvent(event).mod
                        key = keyinfo.forEvent(event).key
                        combo = keyinfo.forEvent(event).combo

                        input = $('input',event.target.parentElement)
                        if (combo.indexOf('+') >= 0 && key !== '')
                        {
                            stopEvent(event)
                            $('.shortcut',event.target.parentElement).innerHTML = combo
                            prefKey = input.id
                            prefs.set(prefKey,combo)
                            return input.focus()
                        }
                        else if (!keyinfo.isModifier(key) && key !== '')
                        {
                            switch (key)
                            {
                                case 'esc':
                                case 'enter':
                                case 'tab':
                                    stopEvent(event)
                                    return input.focus()

                                case 'backspace':
                                    $('.shortcut',event.target.parentElement).innerHTML = ''
                                    prefs.set(prefKey,'')
                                    return input.focus()

                                default:
                                    event.target.value = 'no modifier'
                                    return event.stopPropagation()
                            }

                        }
                        else
                        {
                            return event.target.value = keyinfo.modifiersForEvent(event)
                        }
                    })
                    msg.addEventListener('blur',function (event)
                    {
                        return event.target.remove()
                    })
                    border.appendChild(msg)
                    return msg.focus()

            }

        })
    }
    return $('prefsscroll').firstChild.firstChild.focus()
}

onPrefsKey = function (event)
{
    var active, key, _851_49_, _851_62_, _851_79_, _852_36_, _852_49_, _857_40_, _857_57_, _857_69_

    key = keyinfo.keynameForEvent(event)
    if (active = document.activeElement)
    {
        switch (key)
        {
            case 'right':
            case 'down':
                return (($('input',$(((_851_49_=active.parentElement) != null ? (_851_62_=_851_49_.nextSibling) != null ? _851_62_.firstChild.id : undefined : undefined))) != null) || ((_852_36_=active.parentElement) != null ? (_852_49_=_852_36_.nextSibling) != null ? _852_49_.firstChild : undefined : undefined)).focus()

            case 'left':
            case 'up':
                if (active.id === 'ok')
                {
                    return $('input',active.parentElement.parentElement.previousSibling).focus()
                }
                else
                {
                    return ((_857_40_=active.parentElement) != null ? (_857_57_=_857_40_.previousSibling) != null ? (_857_69_=_857_57_.firstChild) != null ? _857_69_.focus() : undefined : undefined : undefined)
                }
                break
        }

    }
}

openUrl = function (url)
{
    return kakao('open',url)
}

showHelp = function ()
{
    return kakao('open',"https://monsterkodi.github.io/password-turtle/manual.html")
}
window.showHelp = showHelp

setSite = function (site)
{
    setInput('site',site)
    return siteChanged()
}

siteChanged = function ()
{
    if ($("site").value.length === 0)
    {
        hideLock()
        clearInput('password')
        return
    }
    return masterSitePassword()
}

updateSiteFromClipboard = async function ()
{
    var clipboardContent, domain

    clipboardContent = await kakao('clipboard.get')
    if (domain = urltools.extractDomain(clipboardContent))
    {
        return setSite(domain)
    }
}

makePassword = function (hash, config)
{
    return password.make(hash,config.pattern)
}

showPassword = async function (config)
{
    var hash, pass, url

    url = await cryptools.decrypt(config.url,mstr)
    hash = await cryptools.genHash(url + mstr)
    pass = currentPassword = makePassword(hash,config)
    if (hasLock() && prefs.get('mask'))
    {
        pass = _k_.rpad(currentPassword.length,'','●')
    }
    if (url === _k_.trim($("site").value))
    {
        return setInput('password',pass)
    }
}

masterSitePassword = async function ()
{
    var config, currentSite, hash, site, _923_20_

    site = _k_.trim($("site").value)
    if (!(site != null ? site.length : undefined) || !(mstr != null ? mstr.length : undefined))
    {
        clearInput('password')
        hideLock()
        return ""
    }
    hash = await cryptools.genHash(site + mstr)
    if (((stash.configs != null ? stash.configs[hash] : undefined) != null))
    {
        config = stash.configs[hash]
        if (config.pattern === stash.pattern)
        {
            lockClosed($('lock'))
        }
        else
        {
            lockOpen($('lock'))
        }
    }
    else
    {
        config = {}
        config.url = await cryptools.encrypt(site,mstr)
        config.pattern = $('pattern').value
        hideLock()
    }
    currentSite = _k_.trim($("site").value)
    if (currentSite === site)
    {
        return showPassword(config)
    }
}

clearSitePassword = async function ()
{
    var hash, site

    site = $('site').value
    hash = await cryptools.genHash(site + mstr)
    if ((stash.configs[hash] != null))
    {
        if (ask('Forget <i>' + stash.configs[hash].pattern + '</i>','for <b>' + site + '</b>?'))
        {
            delete stash.configs[hash]
            say('The <b>' + site + '</b>','<i>pattern</i> is forgotten',2000)
            writeStash()
            return masterSitePassword()
        }
    }
}

toggleSettings = function ()
{
    var _964_22_

    resetTimeout()
    if (!($('bubble') != null))
    {
        restoreBody()
        if ($('settings').style.display === 'none')
        {
            hideSitePassword()
            return showSettings()
        }
    }
    else if (stashLoaded)
    {
        if ($('settings').style.display !== 'none')
        {
            hideSettings()
            return showSitePassword()
        }
        else
        {
            hideSitePassword()
            return showSettings()
        }
    }
}

showSettings = function ()
{
    var _979_16_

    ;($('buttons') != null ? $('buttons').remove() : undefined)
    updateFloppy()
    $('settings').appendChild(initButtons())
    $('settings').style.display = 'initial'
    $('pattern').focus()
    return updateStashButton()
}

hideSettings = function ()
{
    var _989_16_

    $('settings').style.display = 'none'
    ;($('buttons') != null ? $('buttons').remove() : undefined)
    if (stashExists)
    {
        say()
    }
    if ($('pattern').value.length === 0 && (stash != null ? stash.pattern : undefined))
    {
        setInput('pattern',stash.pattern)
        return patternChanged()
    }
}

togglePattern = function ()
{
    var settings

    console.log('tp')
    restoreBody()
    settings = $('settings')
    console.log(settings,settings.style.display)
    if (settings.style.display !== 'none')
    {
        return hidePattern()
    }
    else
    {
        return showPattern()
    }
}

showPattern = function ()
{
    var _1007_16_

    ;($('buttons') != null ? $('buttons').remove() : undefined)
    updateFloppy()
    $('settings').appendChild(initButtons())
    $('settings').style.display = 'initial'
    $('pattern').focus()
    return updateStashButton()
}

hidePattern = function ()
{
    var _1017_16_

    $('settings').style.display = 'none'
    ;($('buttons') != null ? $('buttons').remove() : undefined)
    if (stashExists)
    {
        say()
    }
    if ($('pattern').value.length === 0 && (stash != null ? stash.pattern : undefined))
    {
        setInput('pattern',stash.pattern)
        return patternChanged()
    }
}

hideSitePassword = function ()
{
    $('site-border').style.opacity = 0
    $('site-border').classList.add('no-pointer')
    $('site').disabled = true
    $('password-border').style.opacity = 0
    $('password-border').classList.add('no-pointer')
    return $('password').disabled = true
}

showSitePassword = function ()
{
    var _1035_34_

    if (!($('site-border') != null))
    {
        return
    }
    $('site-border').style.opacity = 1
    $('site-border').classList.remove('no-pointer')
    $('site').disabled = false
    $('password-border').style.opacity = 1
    $('password-border').classList.remove('no-pointer')
    $('password').disabled = false
    return $('site').focus()
}

clearInput = function (input)
{
    return setInput(input,'')
}

setInput = function (input, value)
{
    var ghost

    $(input).value = value
    if (ghost = $(input + '-ghost'))
    {
        return ghost.style.opacity = (value.length === 0 && 1 || 0)
    }
}

hasLock = function ()
{
    return $('lock').classList.contains('open') || $('lock').classList.contains('closed')
}

hideLock = function ()
{
    $('lock').classList.remove('open')
    return $('lock').classList.remove('closed')
}

lockClosed = function (e)
{
    e.innerHTML = '<span></span>'
    e.classList.remove('open')
    return e.classList.add('closed')
}

lockOpen = function (e)
{
    e.innerHTML = '<span></span>'
    e.classList.remove('closed')
    return e.classList.add('open')
}

setBool = function (e, b)
{
    e.innerHTML = b && '<span></span>' || '<span></span>'
    e.classList.remove(b && 'bool-false' || 'bool-true')
    return e.classList.add(b && 'bool-true' || 'bool-false')
}

updateFloppy = function ()
{
    var floppy

    if (floppy = $('floppy'))
    {
        floppy.innerHTML = ''
        if ((stash != null ? stash.pattern : undefined) !== $("pattern").value || (stash != null ? stash.pattern : undefined) === '')
        {
            return floppy.classList.remove('saved')
        }
        else
        {
            return floppy.classList.add('saved')
        }
    }
}

updateStashButton = function ()
{
    var _1088_18_, _1089_25_, _1091_18_, _1092_25_

    if (_k_.empty(stash.configs))
    {
        if (($('stash') != null)) { $('stash').disabled = true }
        return ($('stash-border') != null ? $('stash-border').classList.add('disabled') : undefined)
    }
    else
    {
        if (($('stash') != null)) { $('stash').disabled = false }
        return ($('stash-border') != null ? $('stash-border').classList.remove('disabled') : undefined)
    }
}
unsay = undefined

whisper = function (boo)
{
    if ((unsay != null))
    {
        clearTimeout(unsay)
    }
    unsay = undefined
    if (arguments.length > 1)
    {
        unsay = setTimeout(say,arguments[1])
    }
    $('bubble').className = 'whisper'
    return $('say').innerHTML = boo
}

say = function ()
{
    var al, delay

    if ((unsay != null))
    {
        clearTimeout(unsay)
    }
    unsay = undefined
    if (arguments.length === 0)
    {
        $('say').innerHTML += ' '
        return $('bubble').className = 'silent'
    }
    else
    {
        al = [].slice.call(arguments,0)
        if (al.length === 3)
        {
            delay = al.pop()
            unsay = setTimeout(say,delay)
        }
        $('bubble').className = "say"
        return $('say').innerHTML = al.join("<br>")
    }
}

ask = function ()
{
    if (prefs.get('confirm',true))
    {
        if (!$('say').innerHTML.endsWith(arguments[arguments.length - 1]))
        {
            say.apply(say,arguments)
            $('bubble').className = "ask"
            return false
        }
    }
    return true
}

Delegate = (function ()
{
    function Delegate ()
    {
        var main

        this["onWindowCreated"] = this["onWindowCreated"].bind(this)
        this.aboutImage = kakao.bundle.img('about_turtle.png')
        this.aboutURL = "https://github.com/monsterkodi/password-turtle"
        main = $('main')
    }

    Delegate.prototype["onWindowWillShow"] = function ()
    {
        initEvents()
        $("master").blur()
        $("master").focus()
        hideSitePassword()
        hideSettings()
        resetStash()
        return ffs.exists(stashFile).then(function (exists)
        {
            stashExists = exists
            if (!stashExists)
            {
                return masterChanged()
            }
        })
    }

    Delegate.prototype["onWindowWithoutStash"] = function ()
    {
        kakao('win.setSize',window.WIN_WIDTH,window.WIN_MIN_HEIGHT)
        return kakao('win.center')
    }

    Delegate.prototype["onWindowRestoreFrameFromStash"] = function (win, stashFrame)
    {
        var frame

        frame = _k_.copy(stashFrame)
        frame.y = frame.y + frame.h - WIN_MIN_HEIGHT
        frame.h = WIN_MIN_HEIGHT
        kakao('window.setFrame',frame,true)
        return true
    }

    Delegate.prototype["onWindowCreated"] = function ()
    {
        kakao('win.setMinSize',window.WIN_WIDTH,window.WIN_MIN_HEIGHT)
        return kakao('win.setMaxSize',window.WIN_WIDTH,window.WIN_MAX_HEIGHT)
    }

    Delegate.prototype["onWindowKeyDown"] = function (win, keyinfo)
    {
        var btnames, char, combo, e, key, mod, _1201_34_, _1206_25_, _1207_25_, _1208_25_, _1210_31_

        mod = keyinfo.mod
        key = keyinfo.key
        combo = keyinfo.combo
        char = keyinfo.char

        console.log('onWindowKeyDown',combo,keyinfo)
        resetTimeout()
        switch (combo)
        {
            case 'command+w':
            case 'ctrl+w':
                return kakao('window.close')

            case 'command+q':
            case 'ctrl+q':
                return kakao('app.quit')

            case 'command+.':
            case 'ctrl+.':
                return toggleAbout()

            case 'command+alt+i':
                return kakao('window.toggleInspector')

            case 'alt+i':
            case 'ctrl+i':
                return toggleStyle()

            case 'esc':
                if (!($('bubble') != null))
                {
                    return restoreBody()
                }
                else if ($('settings').style.display !== 'none')
                {
                    return toggleSettings()
                }
                else
                {
                    return kakao('window.hide')
                }
                break
        }

        if (($('stashlist') != null))
        {
            return onStashKey(event)
        }
        if (($('vaultlist') != null))
        {
            return onVaultKey(event)
        }
        if (($('prefslist') != null))
        {
            return onPrefsKey(event)
        }
        if (!($('site') != null))
        {
            return
        }
        e = document.activeElement
        if (e === $('password'))
        {
            switch (combo)
            {
                case 'command+backspace':
                case 'ctrl+backspace':
                    clearSitePassword()
                    return

                case 'left':
                case 'right':
                case 'up':
                case 'down':
                    $('site').focus()
                    $('site').setSelectionRange(0,$('site').value.length)
                    event.preventDefault()
                    return

            }

        }
        if (e === $('master') && !$('master').value.length)
        {
            if (_k_.in(key,['backspace','enter']))
            {
                logOut()
                return
            }
        }
        btnames = ['stash','vault','prefs','about','help']
        if (_k_.in(e.id,btnames))
        {
            switch (key)
            {
                case 'left':
                case 'up':
                    $(btnames[btnames.indexOf(e.id) - 1]).focus()
                    break
                case 'right':
                case 'down':
                    $(btnames[btnames.indexOf(e.id) + 1]).focus()
                    break
            }

        }
        switch (key)
        {
            case 'enter':
                switch (e.id)
                {
                    case "master":
                        return masterConfirmed()

                    case "site":
                        return copyPassword()

                    case "password":
                        return copyAndSavePattern()

                    case "pattern":
                        return patternConfirmed()

                }

                break
        }

        return 'unhandled'
    }

    Delegate.prototype["onWindowKeyUp"] = function (win, keyinfo)
    {
        return 'unhandled'
    }

    return Delegate
})()

kakao.init(function ()
{
    new win(new Delegate)
    return this
})