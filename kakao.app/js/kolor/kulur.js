var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w8=_k_.k.F256(_k_.k.w(8))

var actExt, addAndJoinValues, addValue, addValues, blockComment, blocked, chunk, chunked, chunkIndex, codeTypes, coffeePunct, coffeeWord, commentHeader, cppMacro, cppPointer, cppWord, cssWord, dashArrow, dict, dissect, escape, ext, extStack, extTop, fillComment, float, FLOAT, funcArgs, getChunk, getmatch, getValue, handl, handlers, hashComment, HEADER, HEX, HEXNUM, interpolation, jsonPunct, jsonWord, jsPunct, jsWord, keyword, kodePunct, kodeWord, kolorize, kolorizeChunks, LI, line, mdPunct, mmMacro, mmString, NEWLINE, nimComment, noonComment, noonProp, noonPunct, noonWord, notCode, number, NUMBER, obj, parse, popExt, popStack, property, PUNCT, pushExt, pushStack, ranges, regexp, setValue, shPunct, simpleString, slashComment, SPACE, stack, stacked, stackTop, starComment, swtch, syntax, thisCall, topType, tripleRegexp, tripleString, urlPunct, urlWord, xmlPunct

import kseg from "../kxk/kseg.js"

import klor from "../kxk/klor.js"

import extlang from "./extlang.js"
let exts = extlang.exts
let lang = extlang.lang

swtch = {pug:{script:{next:'.',to:'js',indent:1}},md:{coffeescript:{turd:'```',to:'coffee',end:'```',add:'code triple'},javascript:{turd:'```',to:'js',end:'```',add:'code triple'}}}
var list = _k_.list(exts)
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    ext = list[_a_]
    swtch.md[ext] = {turd:'```',to:ext,end:'```',add:'code triple'}
}
SPACE = /\s/
HEADER = /^[0█]+$/u
PUNCT = /[^\wäöüßÄÖÜáéíóúÁÉÍÓÚñÑçÇàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãõÃÕåÅæÆœŒøØłŁđĐ]+/u
NUMBER = /^\d+$/
FLOAT = /^\d+f$/
HEXNUM = /^0x[a-fA-F\d]+$/
HEX = /^[a-fA-F\d]+$/
NEWLINE = /\r?\n/
LI = /(\sli\d\s|\sh\d\s)/
codeTypes = ['interpolation','code triple']

chunked = function (segls, ext)
{
    var chnk, chnks, chunkd, chunks, clss, isUniko, l, lastWord, lastWordIndex, lineno, m, pushLastWord, s, segIndex, segs, t, turd

    if (ext[0] === '.')
    {
        ext = ext.slice(1)
    }
    if (!(_k_.in(ext,exts)))
    {
        ext = 'txt'
    }
    lineno = 0
    chunkd = []
    var list1 = _k_.list(segls)
    for (var _b_ = 0; _b_ < list1.length; _b_++)
    {
        segs = list1[_b_]
        chnks = {chunks:[],chars:0,index:lineno++,number:lineno,ext:ext}
        chunkd.push(chnks)
        if (_k_.empty(segs))
        {
            continue
        }
        chunks = kseg.chunks(kseg.detab(segs))
        if (_k_.empty(chunks))
        {
            continue
        }
        lastWord = null
        lastWordIndex = -1
        pushLastWord = function ()
        {
            if (lastWord !== null)
            {
                chnks.chunks.push({start:kseg.widthAtSegi(segs,lastWordIndex),length:kseg.width(lastWord),match:kseg.str(lastWord),clss:'text'})
                lastWord = null
                return lastWordIndex = -1
            }
        }
        var list2 = _k_.list(chunks)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            chnk = list2[_c_]
            pushLastWord()
            var list3 = _k_.list(chnk.segl)
            for (segIndex = 0; segIndex < list3.length; segIndex++)
            {
                s = list3[segIndex]
                isUniko = function (ch, cc)
                {
                    var isu

                    isu = cc >= 2000
                    if (isu)
                    {
                        if (_k_.in(ch,'■▪◆●○▸➜⮐'))
                        {
                            return false
                        }
                    }
                    return isu
                }
                if (m = PUNCT.exec(s))
                {
                    pushLastWord()
                    turd = ''
                    var list4 = _k_.list(chnk.segl.slice(segIndex))
                    for (var _e_ = 0; _e_ < list4.length; _e_++)
                    {
                        t = list4[_e_]
                        if (PUNCT.test(t))
                        {
                            turd += t
                        }
                        else
                        {
                            break
                        }
                    }
                    clss = 'punct'
                    if (isUniko(s,s.charCodeAt(0)))
                    {
                        clss = 'text unicode'
                    }
                    else
                    {
                        clss = 'punct'
                        if (_k_.in(s,[',',';','{','}','(',')']))
                        {
                            clss += ' minor'
                        }
                    }
                    chnks.chunks.push({start:kseg.widthAtSegi(segs,chnk.index + segIndex),length:kseg.width(s),match:s,turd:turd,clss:clss})
                }
                else
                {
                    if (lastWord === null)
                    {
                        lastWord = []
                        lastWordIndex = chnk.index + segIndex
                    }
                    lastWord.push(s)
                }
            }
        }
        pushLastWord()
        if (chnks.chunks.length)
        {
            l = _k_.last(chnks.chunks)
            chnks.chars = l.start + l.length
        }
    }
    return chunkd
}
extStack = []
stack = []
handl = []
extTop = null
stackTop = null
notCode = false
topType = ''
ext = ''
line = null
chunk = null
chunkIndex = 0

fillComment = function (n)
{
    var c, i, mightBeHeader, restChunks

    for (var _f_ = i = 0, _10_ = n; (_f_ <= _10_ ? i < n : i > n); (_f_ <= _10_ ? ++i : --i))
    {
        addValue(i,'comment')
    }
    if (chunkIndex < line.chunks.length - n)
    {
        restChunks = line.chunks.slice(chunkIndex + n)
        mightBeHeader = true
        var list1 = _k_.list(restChunks)
        for (var _11_ = 0; _11_ < list1.length; _11_++)
        {
            c = list1[_11_]
            c.clss = 'comment'
            if (mightBeHeader && !HEADER.test(c.match))
            {
                mightBeHeader = false
            }
        }
        if (mightBeHeader)
        {
            var list2 = _k_.list(restChunks)
            for (var _12_ = 0; _12_ < list2.length; _12_++)
            {
                c = list2[_12_]
                c.clss += ' header'
            }
        }
    }
    return line.chunks.length - chunkIndex + n
}

hashComment = function ()
{
    if (stackTop && topType !== 'regexp triple')
    {
        return
    }
    if (stackTop && stackTop.lineno === line.number)
    {
        return
    }
    if (chunk.match === "#")
    {
        return fillComment(1)
    }
}

noonComment = function ()
{
    if (stackTop)
    {
        return
    }
    if (chunk.match === "#" && chunkIndex === 0)
    {
        return fillComment(1)
    }
}

slashComment = function ()
{
    var _202_17_

    if (stackTop)
    {
        return
    }
    if ((chunk.turd != null ? chunk.turd.startsWith("//") : undefined))
    {
        return fillComment(2)
    }
}

blockComment = function ()
{
    var type

    if (!chunk.turd || chunk.turd.length < 3)
    {
        return
    }
    type = 'comment triple'
    if (topType && !(_k_.in(topType,['interpolation',type])))
    {
        return
    }
    if (chunk.turd.slice(0, 3) === '###')
    {
        if (topType === type)
        {
            popStack()
        }
        else
        {
            pushStack({type:type,strong:true})
        }
        return addAndJoinValues(3,type)
    }
}

nimComment = function ()
{
    var type

    if (!chunk.turd || chunk.turd.length < 2)
    {
        return
    }
    type = 'comment triple'
    if (topType && !(_k_.in(topType,['interpolation',type])))
    {
        return
    }
    if (_k_.in(chunk.turd.slice(0, 3),["#[","]#"]))
    {
        if (topType === type)
        {
            popStack()
        }
        else
        {
            pushStack({type:type,strong:true})
        }
        return addAndJoinValues(2,type)
    }
}

starComment = function ()
{
    var type

    if (!chunk.turd)
    {
        return
    }
    type = 'comment triple'
    if (topType && topType !== type)
    {
        return
    }
    if (chunk.turd.slice(0, 2) === '/*' && !topType)
    {
        pushStack({type:type,strong:true})
        return addValues(2,type)
    }
    if (chunk.turd.slice(0, 2) === '*/' && topType === type)
    {
        popStack()
        return addValues(2,type)
    }
}

funcArgs = function ()
{
    var ch, turd, _265_31_

    if (notCode)
    {
        return
    }
    if (!chunk.turd)
    {
        return
    }
    turd = (chunk.turd[0] === '○' ? chunk.turd.slice(1, 3) : chunk.turd.slice(0, 2))
    if (_k_.in(turd[0],'=-') && turd[1] === '>')
    {
        if (_k_.in((getChunk(-1) != null ? getChunk(-1).match : undefined),':)'))
        {
            return
        }
        if (_k_.in(line.chunks[0].clss,['text','dictionary key']) && _k_.in(line.chunks[1].match,':='))
        {
            var list1 = _k_.list(line.chunks.slice(2, typeof chunkIndex === 'number' ? chunkIndex : -1))
            for (var _13_ = 0; _13_ < list1.length; _13_++)
            {
                ch = list1[_13_]
                if (_k_.in(ch.clss,['function call','text']))
                {
                    ch.clss = 'function argument'
                }
            }
        }
    }
    return
}

dashArrow = function ()
{
    var markFunc, _301_77_, _322_77_

    if (notCode)
    {
        return
    }
    markFunc = function ()
    {
        if (line.chunks[0].clss === 'text')
        {
            if (line.chunks[1].match === '=' && line.chunks[2].match !== '>')
            {
                line.chunks[0].clss = 'function'
                return line.chunks[1].clss += ' function'
            }
            else if (line.chunks[1].match === ':')
            {
                line.chunks[0].clss = 'method'
                return line.chunks[1].clss += ' method'
            }
        }
    }
    if (chunk.turd)
    {
        if (chunk.turd.startsWith('○->'))
        {
            markFunc()
            addValue(0,'function async')
            addValue(1,'function tail')
            addValue(2,'function head')
            if (line.chunks[0].clss === 'dictionary key' || (line.chunks[0].turd != null ? line.chunks[0].turd.slice(0, 2) : undefined) === '@:')
            {
                line.chunks[0].clss = 'method'
                line.chunks[1].clss = 'punct method'
            }
            else if (line.chunks[0].match === '@' && line.chunks[1].clss === 'dictionary key')
            {
                line.chunks[0].clss = 'punct method class'
                line.chunks[1].clss = 'method class'
                line.chunks[2].clss = 'punct method class'
            }
            return 3
        }
        if (chunk.turd.startsWith('○=>'))
        {
            markFunc()
            addValue(0,'function bound async')
            addValue(1,'function bound tail')
            addValue(2,'function bound head')
            if (line.chunks[0].clss === 'dictionary key')
            {
                line.chunks[0].clss = 'method'
                line.chunks[1].clss = 'punct method'
            }
            return 3
        }
        if (chunk.turd.startsWith('->'))
        {
            markFunc()
            if (line.chunks[0].clss === 'dictionary key' || (line.chunks[0].turd != null ? line.chunks[0].turd.slice(0, 2) : undefined) === '@:')
            {
                line.chunks[0].clss = 'method'
                line.chunks[1].clss = 'punct method'
            }
            else if (line.chunks[0].match === '@' && line.chunks[1].clss === 'dictionary key')
            {
                line.chunks[0].clss = 'punct method class'
                line.chunks[1].clss = 'method class'
                line.chunks[2].clss = 'punct method class'
            }
            return addAndJoinValues(2,'function')
        }
        if (chunk.turd.startsWith('=>'))
        {
            markFunc()
            if (line.chunks[0].clss === 'dictionary key')
            {
                line.chunks[0].clss = 'method'
                line.chunks[1].clss = 'punct method'
            }
            return addAndJoinValues(2,'function bound')
        }
    }
}

cppPointer = function ()
{
    if (notCode)
    {
        return
    }
    if (chunk.turd)
    {
        if (chunk.turd.startsWith('->'))
        {
            addValue(0,'arrow tail')
            addValue(1,'arrow head')
            return 2
        }
    }
}

commentHeader = function ()
{
    if (topType === 'comment triple')
    {
        if (HEADER.test(chunk.match))
        {
            chunk.clss = 'comment triple header'
            return 1
        }
    }
}

kodePunct = function ()
{
    var next, prev, prevEnd, _396_21_, _408_50_

    if (notCode)
    {
        return
    }
    if (_k_.in(chunk.match,'▸➜'))
    {
        return addValue(0,'keyword')
    }
    if (_k_.in(chunk.match,'⮐'))
    {
        return addValue(0,'keyword return')
    }
    if (next = getChunk(1))
    {
        if (_k_.in(chunk.match,'○') && !(_k_.in(next.match,'-=')))
        {
            return addValue(0,'await')
        }
        if (_k_.in(chunk.turd,['==','!=','>=','<=']))
        {
            addValue(0,'compare')
            addValue(1,'compare')
            return 2
        }
        if (_k_.in(chunk.match,'<>') && !chunk.turd)
        {
            return addValue(0,'compare')
        }
        if (_k_.in(chunk.match,'◆'))
        {
            if (_k_.in(next.match,['dir','file','main']))
            {
                addValue(0,'keyword')
                setValue(1,'keyword')
                return 2
            }
        }
    }
    if (prev = getChunk(-1))
    {
        if (prev.clss.endsWith('require'))
        {
            setValue(0,'punct require')
            return 1
        }
        if ((chunk.turd != null ? chunk.turd.startsWith('..') : undefined) && prev.match !== '.')
        {
            if (chunk.turd[2] !== '.')
            {
                return addValues(2,'range')
            }
            if (chunk.turd[3] !== '.')
            {
                return addValues(3,'range')
            }
        }
        if (prev.clss.startsWith('text') || prev.clss === 'property')
        {
            prevEnd = prev.start + prev.length
            if (chunk.match === '(' && prevEnd === chunk.start)
            {
                return thisCall()
            }
            else if (prevEnd < chunk.start)
            {
                if (chunkIndex === 1 || _k_.in((getChunk(-2) != null ? getChunk(-2).match : undefined),['⮐','=','return']))
                {
                    if (_k_.in(chunk.match,'@[({"\''))
                    {
                        return thisCall()
                    }
                    else if (_k_.in(chunk.match,'+-/'))
                    {
                        next = getChunk(1)
                        if (!next || next.match !== '=' && next.start === chunk.start + 1)
                        {
                            return thisCall()
                        }
                    }
                }
            }
        }
    }
}

kodeWord = function ()
{
    var c, prev, _427_22_, _476_46_

    if (notCode)
    {
        return
    }
    if (chunk.match === 'use')
    {
        if ((getChunk(1) != null ? getChunk(1).start : undefined) > chunk.start + chunk.length)
        {
            setValue(0,'keyword require')
            return 1
        }
        else
        {
            setValue(0,'text')
            return 0
        }
    }
    if (prev = getChunk(-1))
    {
        if (prev.match === 'use')
        {
            setValue(0,'require')
            return 1
        }
        if (prev.match === '▸')
        {
            if (_k_.empty(getChunk(-2)))
            {
                var list1 = _k_.list(line.chunks.slice(chunkIndex))
                for (var _14_ = 0; _14_ < list1.length; _14_++)
                {
                    c = list1[_14_]
                    c.clss = 'section'
                }
                return line.chunks.length - chunkIndex
            }
        }
        if (_k_.in(prev.match,['class','extends','function']))
        {
            setValue(0,'class')
            return 1
        }
        if (prev.match === 'is' && _k_.in(chunk.match,['str','num','obj','arr','func','elem']))
        {
            setValue(0,'keyword')
            return 1
        }
        if (chunk.clss.startsWith('keyword'))
        {
            return 1
        }
        if (prev.match === '@')
        {
            addValue(-1,'this')
            addValue(0,'this')
            return 1
        }
        if (prev.clss.endsWith('require'))
        {
            addValue(0,'require')
            if (prev.clss.endsWith('punct require') && _k_.in(prev.match,'▪◆●'))
            {
                addValue(0,'string')
            }
            else if (chunkIndex === line.chunks.length - 1)
            {
                addValue(0,'string')
            }
            return 1
        }
        if (prev.clss.endsWith('require string'))
        {
            addValue(0,'require string')
            return 1
        }
        if ((prev.clss.startsWith('text') || prev.clss === 'property') && prev.start + prev.length < chunk.start)
        {
            if (chunkIndex === 1 || _k_.in((getChunk(-2) != null ? getChunk(-2).match : undefined),['return','=','⮐']))
            {
                return thisCall()
            }
        }
    }
}

thisCall = function ()
{
    setValue(-1,'function call')
    if (getmatch(-2) === '@')
    {
        setValue(-2,'punct function call')
    }
    return 0
}

coffeePunct = function ()
{
    var next, prev, prevEnd, _504_21_

    if (notCode)
    {
        return
    }
    if (chunk.match === '▸')
    {
        return addValue(0,'meta')
    }
    if (chunk.turd === '~>')
    {
        return addValues(2,'meta')
    }
    if (prev = getChunk(-1))
    {
        if ((chunk.turd != null ? chunk.turd.startsWith('..') : undefined) && prev.match !== '.')
        {
            if (chunk.turd[2] !== '.')
            {
                return addValues(2,'range')
            }
            if (chunk.turd[3] !== '.')
            {
                return addValues(3,'range')
            }
        }
        if (prev.clss.startsWith('text') || prev.clss === 'property')
        {
            prevEnd = prev.start + prev.length
            if (chunk.match === '(' && prevEnd === chunk.start)
            {
                return thisCall()
            }
            else if (prevEnd < chunk.start)
            {
                if (_k_.in(chunk.match,'@[({"\''))
                {
                    return thisCall()
                }
                else if (_k_.in(chunk.match,'+-/'))
                {
                    next = getChunk(1)
                    if (!next || next.match !== '=' && next.start === chunk.start + 1)
                    {
                        return thisCall()
                    }
                }
            }
        }
    }
}

coffeeWord = function ()
{
    var prev

    if (notCode)
    {
        return
    }
    if (prev = getChunk(-1))
    {
        if (prev.clss === 'punct meta')
        {
            if (chunk.start === prev.start + 1)
            {
                setValue(0,'meta')
                return 0
            }
        }
        if (_k_.in(prev.match,['class','extends']))
        {
            setValue(0,'class')
            return 1
        }
        if (chunk.clss.startsWith('keyword'))
        {
            return 1
        }
        if (prev.match === '@')
        {
            addValue(-1,'this')
            addValue(0,'this')
            return 1
        }
        if ((prev.clss.startsWith('text') || prev.clss === 'property') && prev.start + prev.length < chunk.start)
        {
            return thisCall()
        }
    }
}

property = function ()
{
    var prevPrev

    if (notCode)
    {
        return
    }
    if (getmatch(-1) === '.')
    {
        prevPrev = getChunk(-2)
        if ((prevPrev != null ? prevPrev.match : undefined) !== '.')
        {
            addValue(-1,'property')
            setValue(0,'property')
            if (prevPrev)
            {
                if (!(_k_.in(prevPrev.clss,['property','number'])) && !prevPrev.clss.startsWith('punct'))
                {
                    setValue(-2,'obj')
                }
            }
            return 1
        }
    }
}

cppWord = function ()
{
    var p, prevPrev, _572_19_

    if (notCode)
    {
        return
    }
    if (p = property())
    {
        return p
    }
    if ((getChunk(-2) != null ? getChunk(-2).turd : undefined) === '::')
    {
        if (prevPrev = getChunk(-3))
        {
            setValue(-3,'punct obj')
            addValue(-2,'obj')
            addValue(-1,'obj')
            setValue(0,'method')
            return 1
        }
    }
    if (getmatch(-1) === '<' && _k_.in(getmatch(1),',>') || getmatch(1) === '>' && _k_.in(getmatch(-1),','))
    {
        setValue(-1,'punct template')
        setValue(0,'template')
        setValue(1,'punct template')
        return 2
    }
    if (/[A-Z]/.test(chunk.match[1]))
    {
        switch (chunk.match[0])
        {
            case 'T':
                if (getmatch(1) === '<')
                {
                    setValue(0,'keyword type')
                    return 1
                }
                break
            case 'F':
                setValue(0,'struct')
                return 1

            case 'A':
            case 'U':
                setValue(0,'obj')
                return 1

        }

    }
    if (chunk.clss === 'text' && getmatch(1) === '(')
    {
        setValue(0,'function call')
        return 1
    }
}

noonProp = function ()
{
    var i, prev

    if (prev = getChunk(-1))
    {
        if (prev.start + prev.length + 1 < chunk.start)
        {
            if (prev.clss !== 'obj')
            {
                i = chunkIndex - 1
                while (i >= 0)
                {
                    if (i < chunkIndex - 1 && line.chunks[i].start + line.chunks[i].length + 1 < line.chunks[i + 1].start)
                    {
                        break
                    }
                    if (line.chunks[i].clss === 'text' || line.chunks[i].clss === 'obj')
                    {
                        line.chunks[i].clss = 'property'
                        i--
                    }
                    else if (line.chunks[i].clss === 'punct')
                    {
                        line.chunks[i].clss = 'punct property'
                        i--
                    }
                    else
                    {
                        break
                    }
                }
            }
        }
        else if (prev.clss === 'obj')
        {
            setValue(0,'obj')
            return 1
        }
    }
    return 0
}

noonPunct = function ()
{
    return noonProp()
}

noonWord = function ()
{
    if (chunk.start === 0)
    {
        setValue(0,'obj')
        return 1
    }
    return noonProp()
}

urlPunct = function ()
{
    var fileext, i, next, prev

    if (prev = getChunk(-1))
    {
        if (chunk.turd === '://')
        {
            if (getmatch(4) === '.' && getChunk(5))
            {
                setValue(-1,'url protocol')
                addValues(3,'url')
                setValue(3,'url domain')
                setValue(4,'punct url tld')
                setValue(5,'url tld')
                return 6
            }
        }
        if (chunk.match === '.')
        {
            if (!prev.clss.startsWith('number') && prev.clss !== 'semver' && !(_k_.in(prev.match,'\\./')) && !/\d+/.test(prev.match) && _k_.empty(topType))
            {
                if (next = getChunk(1))
                {
                    if (next.start === chunk.start + chunk.length)
                    {
                        fileext = next.match
                        if (!(_k_.in(fileext,'\\./*+')))
                        {
                            setValue(-1,'file_' + fileext)
                            setValue(0,'file_punct_' + fileext)
                            setValue(1,'file_ext_' + fileext)
                            return 2
                        }
                    }
                }
            }
        }
        if (chunk.match === '/')
        {
            for (var _15_ = i = chunkIndex, _16_ = 0; (_15_ <= _16_ ? i <= 0 : i >= 0); (_15_ <= _16_ ? ++i : --i))
            {
                if (line.chunks[i].start + line.chunks[i].length < (line.chunks[i + 1] != null ? line.chunks[i + 1].start : undefined))
                {
                    break
                }
                if (line.chunks[i].clss.endsWith('dir'))
                {
                    break
                }
                if (line.chunks[i].clss.startsWith('url'))
                {
                    break
                }
                if (line.chunks[i].match === '"')
                {
                    break
                }
                if (line.chunks[i].clss.startsWith('punct'))
                {
                    line.chunks[i].clss = 'punct dir'
                }
                else
                {
                    line.chunks[i].clss = 'text dir'
                }
            }
            return 1
        }
    }
    return 0
}

urlWord = function ()
{
    var next, prev

    if (prev = getChunk(-1))
    {
        if (_k_.in(prev.match,'\\/'))
        {
            next = getChunk(1)
            if (!next || next.start > chunk.start + chunk.length || !(_k_.in(next.match,'\\./')))
            {
                return addValue(0,'file')
            }
        }
    }
}

jsPunct = function ()
{
    var prev

    if (notCode)
    {
        return
    }
    if (prev = getChunk(-1))
    {
        if (chunk.match === '(')
        {
            if (prev.clss.startsWith('text') || prev.clss === 'property')
            {
                setValue(-1,'function call')
                return 1
            }
        }
    }
}

jsWord = function ()
{
    if (chunk.clss === 'keyword function')
    {
        if (getmatch(-1) === '=' && getValue(-2).startsWith('text'))
        {
            setValue(-2,'function')
        }
    }
    return 0
}

dict = function ()
{
    var prev, _728_44_

    if (notCode)
    {
        return
    }
    if (chunk.match === ':' && !(chunk.turd != null ? chunk.turd.startsWith('::') : undefined))
    {
        if (prev = getChunk(-1))
        {
            if (_k_.in(prev.clss.split(' ')[0],['string','number','text','keyword']))
            {
                setValue(-1,'dictionary key')
                setValue(0,'punct dictionary')
                return 1
            }
        }
    }
}

jsonPunct = function ()
{
    var i, prev

    if (notCode)
    {
        return
    }
    if (chunk.match === ':')
    {
        if (prev = getChunk(-1))
        {
            if (prev.match === '"')
            {
                for (var _17_ = i = Math.max(0,chunkIndex - 2), _18_ = 0; (_17_ <= _18_ ? i <= 0 : i >= 0); (_17_ <= _18_ ? ++i : --i))
                {
                    if ((line.chunks[i] != null ? line.chunks[i].clss : undefined) === 'punct string double')
                    {
                        line.chunks[i].clss = 'punct dictionary'
                        break
                    }
                    if (line.chunks[i])
                    {
                        line.chunks[i].clss = 'dictionary key'
                    }
                }
                setValue(-1,'punct dictionary')
                setValue(0,'punct dictionary')
                return 1
            }
        }
    }
}

jsonWord = function ()
{
    var prev

    if ((topType === 'string double' || topType === 'string single') && (prev = getChunk(-1)))
    {
        if (_k_.in(prev.match,'"^~='))
        {
            if (NUMBER.test(getmatch(0)) && getmatch(1) === '.' && NUMBER.test(getmatch(2)) && getmatch(3) === '.' && NUMBER.test(getmatch(4)))
            {
                if (_k_.in(prev.match,'^~='))
                {
                    setValue(-1,'punct semver')
                    if (getmatch(-2) === '>')
                    {
                        setValue(-2,'punct semver')
                    }
                }
                setValue(0,'semver')
                setValue(1,'punct semver')
                setValue(2,'semver')
                setValue(3,'punct semver')
                setValue(4,'semver')
                return 5
            }
        }
    }
}

escape = function ()
{
    var _781_46_, _782_26_, _786_61_, _789_61_

    if (chunk.match === '\\' && ((topType != null ? topType.startsWith('regexp') : undefined) || (topType != null ? topType.startsWith('string') : undefined)))
    {
        if (chunkIndex === 0 || !(getChunk(-1) != null ? getChunk(-1).escape : undefined))
        {
            if ((getChunk(1) != null ? getChunk(1).start : undefined) === chunk.start + 1)
            {
                chunk.escape = true
                addValue(0,'escape')
                if (topType === 'string single' && (getChunk(1) != null ? getChunk(1).match : undefined) === "'")
                {
                    setValue(0,topType)
                    return 1
                }
                if (topType === 'string double' && (getChunk(1) != null ? getChunk(1).match : undefined) === '"')
                {
                    setValue(0,topType)
                    return 1
                }
                return stacked()
            }
        }
    }
}

regexp = function ()
{
    var next, prev, _799_19_

    if ((topType != null ? topType.startsWith('string') : undefined))
    {
        return
    }
    if ((getChunk(-1) != null ? getChunk(-1).escape : undefined))
    {
        return stacked()
    }
    if (chunk.match === '/')
    {
        if (topType === 'regexp')
        {
            chunk.clss += ' regexp end'
            popStack()
            return 1
        }
        if (chunkIndex)
        {
            prev = getChunk(-1)
            next = getChunk(1)
            if (!prev.clss.startsWith('punct') && !prev.clss.startsWith('keyword') || _k_.in(prev.match,")]"))
            {
                if ((prev.start + prev.length < chunk.start) && (next != null ? next.start : undefined) > chunk.start + 1)
                {
                    return
                }
                if ((prev.start + prev.length === chunk.start) && (next != null ? next.start : undefined) === chunk.start + 1)
                {
                    return
                }
            }
            if ((next != null ? next.match : undefined) === '=')
            {
                return
            }
            if (prev.clss.startsWith('number'))
            {
                return
            }
        }
        pushStack({type:'regexp'})
        return addValue(0,'regexp start')
    }
    return escape()
}

tripleRegexp = function ()
{
    var type

    if (!chunk.turd || chunk.turd.length < 3)
    {
        return
    }
    type = 'regexp triple'
    if (topType && !(_k_.in(topType,['interpolation',type])))
    {
        return
    }
    if (chunk.turd.slice(0, 3) === '///')
    {
        if (topType === type)
        {
            popStack()
        }
        else
        {
            pushStack({type:type,lineno:line.number})
        }
        return addValues(3,type)
    }
}

simpleString = function ()
{
    var next, scnd, type, _847_19_

    if (topType === 'regexp')
    {
        return
    }
    if ((getChunk(-1) != null ? getChunk(-1).escape : undefined))
    {
        return stacked()
    }
    if (_k_.in(chunk.match,'`"\''))
    {
        type = ((function ()
        {
            switch (chunk.match)
            {
                case '`':
                    return 'string double'

                case '"':
                    return 'string double'

                case "'":
                    return 'string single'

            }

        }).bind(this))()
        if (chunk.match === "'")
        {
            next = getChunk(1)
            if (_k_.in((next != null ? next.match : undefined),['s','d','t','ll','re']))
            {
                if (next.start === chunk.start + chunk.length)
                {
                    scnd = getChunk(2)
                    if (!scnd || scnd.match !== "'")
                    {
                        return stacked()
                    }
                }
            }
        }
        if (chunk.clss === 'punct code triple')
        {
            return 0
        }
        if (topType === type)
        {
            addValue(0,type)
            popStack()
            return 1
        }
        else if (notCode)
        {
            if (topType === "string double nsstring")
            {
                addValue(0,topType)
                popStack()
                return 1
            }
            else
            {
                return stacked()
            }
        }
        pushStack({strong:true,type:type})
        addValue(0,type)
        return 1
    }
    return escape()
}

tripleString = function ()
{
    var type, _891_19_

    if (!chunk.turd || chunk.turd.length < 3)
    {
        return
    }
    if (_k_.in(topType,['regexp','string single','string double']))
    {
        return
    }
    if ((getChunk(-1) != null ? getChunk(-1).escape : undefined))
    {
        return stacked()
    }
    type = ((function ()
    {
        switch (chunk.turd.slice(0, 3))
        {
            case '"""':
                return 'string triple'

        }

    }).bind(this))()
    if (type)
    {
        if (type !== topType && (topType != null ? topType.startsWith('string') : undefined))
        {
            return
        }
        if (topType === type)
        {
            popStack()
        }
        else
        {
            pushStack({strong:true,type:type})
        }
        return addValues(3,type)
    }
    return escape()
}

number = function ()
{
    var prev

    if ((topType != null ? topType.startsWith('string') : undefined))
    {
        return 0
    }
    if (NUMBER.test(chunk.match))
    {
        prev = getmatch(-1)
        if (prev === '.')
        {
            if (getValue(-4) === 'number float' && getValue(-2) === 'number float')
            {
                if (_k_.in(getmatch(-5),'^~='))
                {
                    setValue(-5,'punct semver')
                    if (getmatch(-6) === '>')
                    {
                        setValue(-6,'punct semver')
                    }
                }
                setValue(-4,'semver')
                setValue(-3,'punct semver')
                setValue(-2,'semver')
                setValue(-1,'punct semver')
                setValue(0,'semver')
                return 1
            }
            if (getValue(-2) === 'number')
            {
                setValue(-2,'number float')
                setValue(-1,'punct number float')
                setValue(0,'number float')
                return 1
            }
        }
        if (prev === '#')
        {
            chunk.clss = 'number hex'
        }
        else
        {
            chunk.clss = 'number'
        }
        return 1
    }
    if (HEXNUM.test(chunk.match))
    {
        chunk.clss = 'number hex'
        return 1
    }
    if (HEX.test(chunk.match))
    {
        if (getmatch(-1) === '#')
        {
            chunk.clss = 'number hex'
            return 1
        }
    }
}

float = function ()
{
    if (FLOAT.test(chunk.match))
    {
        if (getmatch(-1) === '.')
        {
            if (getValue(-2) === 'number')
            {
                setValue(-2,'number float')
                addValue(-1,'number float')
                setValue(0,'number float')
                return 1
            }
        }
        chunk.clss = 'number float'
        return 1
    }
}

cssWord = function ()
{
    var prev, prevPrev, _994_45_

    if (_k_.in(chunk.match.slice(-2),['px','em','ex']) && NUMBER.test(chunk.match.slice(0, -2)))
    {
        setValue(0,'number')
        return 1
    }
    if (_k_.in(chunk.match.slice(-1),['s']) && NUMBER.test(chunk.match.slice(0, -1)))
    {
        setValue(0,'number')
        return 1
    }
    if (prev = getChunk(-1))
    {
        if (prev.match === '.' && (getChunk(-2) != null ? getChunk(-2).clss : undefined) !== 'number' && _k_.empty(topType))
        {
            addValue(-1,'class')
            setValue(0,'class')
            return 1
        }
        if (prev.match === "#")
        {
            if (chunk.match.length === 3 || chunk.match.length === 6)
            {
                if (HEX.test(chunk.match))
                {
                    addValue(-1,'number hex')
                    setValue(0,'number hex')
                    return 1
                }
            }
            addValue(-1,'function')
            setValue(0,'function')
            return 1
        }
        if (prev.match === '-')
        {
            if (prevPrev = getChunk(-2))
            {
                if (_k_.in(prevPrev.clss,['class','function']))
                {
                    addValue(-1,prevPrev.clss)
                    setValue(0,prevPrev.clss)
                    return 1
                }
            }
        }
    }
}

mdPunct = function ()
{
    var type, _1028_73_, _1053_21_, _1078_21_

    if (chunkIndex === 0)
    {
        if (chunk.turd.length <= 1 && _k_.in(chunk.match,'-*') && (getChunk(1) != null ? getChunk(1).start : undefined) > chunk.start + 1)
        {
            type = ['li1','li2','li3','li4','li5'][parseInt(chunk.start / 4)]
            pushStack({merge:true,fill:true,type:type})
            return addValue(0,type + ' marker')
        }
        if (chunk.match === '#')
        {
            switch (chunk.turd)
            {
                case '#':
                    pushStack({merge:true,fill:true,type:'h1'})
                    return addValue(0,'h1')

                case '##':
                    pushStack({merge:true,fill:true,type:'h2'})
                    return addValues(2,'h2')

                case '###':
                    pushStack({merge:true,fill:true,type:'h3'})
                    return addValues(3,'h3')

                case '####':
                    pushStack({merge:true,fill:true,type:'h4'})
                    return addValues(4,'h4')

                case '#####':
                    pushStack({merge:true,fill:true,type:'h5'})
                    return addValues(5,'h5')

            }

        }
    }
    if (chunk.match === '*')
    {
        if ((chunk.turd != null ? chunk.turd.slice(0, 2) : undefined) === '**')
        {
            type = 'bold'
            if ((topType != null ? topType.endsWith(type) : undefined))
            {
                addValues(2,topType)
                popStack()
                return 2
            }
            if ((stackTop != null ? stackTop.merge : undefined))
            {
                type = stackTop.type + ' ' + type
            }
            pushStack({merge:true,type:type})
            return addValues(2,type)
        }
        type = 'italic'
        if ((topType != null ? topType.endsWith(type) : undefined))
        {
            addValue(0,topType)
            popStack()
            return 1
        }
        if ((stackTop != null ? stackTop.merge : undefined))
        {
            type = stackTop.type + ' ' + type
        }
        pushStack({merge:true,type:type})
        addValue(0,type)
        return 1
    }
    if (chunk.match === '`')
    {
        if ((chunk.turd != null ? chunk.turd.slice(0, 3) : undefined) === '```')
        {
            type = 'code triple'
            if (_k_.in(getmatch(3),['coffeescript','javascript','js']))
            {
                setValue(3,'comment')
                return addValues(3,type)
            }
            pushStack({weak:true,type:type})
            return addValues(3,type)
        }
        type = 'code'
        if ((topType != null ? topType.endsWith(type) : undefined))
        {
            addValue(0,topType)
            popStack()
            return 1
        }
        if ((stackTop != null ? stackTop.merge : undefined))
        {
            type = stackTop.type + ' ' + type
        }
        pushStack({merge:true,type:type})
        return addValue(0,type)
    }
}

interpolation = function ()
{
    var _1110_21_

    if ((topType != null ? topType.startsWith('string double') : undefined))
    {
        if ((chunk.turd != null ? chunk.turd.startsWith("\#{") : undefined))
        {
            pushStack({type:'interpolation',weak:true})
            setValue(0,'punct string interpolation')
            setValue(1,'punct string interpolation')
            return 2
        }
    }
    else if (topType === 'interpolation')
    {
        if (chunk.match === '}')
        {
            setValue(0,'punct string interpolation')
            popStack()
            return 1
        }
    }
}

keyword = function ()
{
    var _1135_61_

    if (notCode)
    {
        return
    }
    if (!lang[ext])
    {
        return
    }
    if (lang[ext].hasOwnProperty(chunk.match) && !(_k_.in((getChunk(-1) != null ? getChunk(-1).match : undefined),['.'])))
    {
        chunk.clss = lang[ext][chunk.match]
        return
    }
}

xmlPunct = function ()
{
    if (chunk.turd === '</')
    {
        return addValues(2,'keyword')
    }
    if (_k_.in(chunk.match,['<','>']))
    {
        return addValue(0,'keyword')
    }
}

cppMacro = function ()
{
    if (chunk.match === "#")
    {
        addValue(0,'define')
        setValue(1,'define')
        return 2
    }
}

mmMacro = function ()
{
    if (chunk.match === "@")
    {
        addValue(0,'define')
        setValue(1,'define')
        return 2
    }
}

mmString = function ()
{
    var type

    if (!chunk.turd || chunk.turd.length < 2)
    {
        return
    }
    type = 'string double nsstring'
    if (chunk.turd.slice(0, 2) === '@"')
    {
        pushStack({strong:true,merge:true,type:type})
        return addValues(2,type)
    }
}

shPunct = function ()
{
    var _1201_42_, _1201_64_, _1204_102_, _1204_41_, _1204_82_, _1210_102_, _1210_41_, _1210_82_

    if (notCode)
    {
        return
    }
    if (chunk.match === '/' && (getChunk(-1) != null ? getChunk(-1).start : undefined) + (getChunk(-1) != null ? getChunk(-1).length : undefined) === chunk.start)
    {
        return addValue(-1,'dir')
    }
    if (chunk.turd === '--' && (getChunk(2) != null ? getChunk(2).start : undefined) === chunk.start + 2 && (getChunk(-1) != null ? getChunk(-1).start : undefined) + (getChunk(-1) != null ? getChunk(-1).length : undefined) < chunk.start)
    {
        addValue(0,'argument')
        addValue(1,'argument')
        setValue(2,'argument')
        return 3
    }
    if (chunk.match === '-' && (getChunk(1) != null ? getChunk(1).start : undefined) === chunk.start + 1 && (getChunk(-1) != null ? getChunk(-1).start : undefined) + (getChunk(-1) != null ? getChunk(-1).length : undefined) < chunk.start)
    {
        addValue(0,'argument')
        setValue(1,'argument')
        return 2
    }
    if (chunk.match === '~' && (!getChunk(-1) || getChunk(-1).start + getChunk(-1).length < chunk.start))
    {
        setValue(0,'text dir')
        return 1
    }
}

stacked = function ()
{
    if (stackTop)
    {
        if (stackTop.weak)
        {
            return
        }
        if (stackTop.strong)
        {
            chunk.clss = topType
        }
        else
        {
            chunk.clss += ' ' + topType
        }
        return 1
    }
}

pushExt = function (mtch)
{
    extTop = {switch:mtch,start:line,stack:stack}
    return extStack.push(extTop)
}

actExt = function ()
{
    stack = []
    stackTop = null
    topType = ''
    return notCode = false
}

popExt = function ()
{
    stack = extTop.stack
    line.ext = extTop.start.ext
    extStack.pop()
    extTop = extStack.slice(-1)[0]
    stackTop = stack.slice(-1)[0]
    topType = (stackTop != null ? stackTop.type : undefined)
    return notCode = stackTop && !(_k_.in(topType,codeTypes))
}

pushStack = function (o)
{
    stack.push(o)
    stackTop = o
    topType = o.type
    return notCode = !(_k_.in(topType,codeTypes))
}

popStack = function ()
{
    stack.pop()
    stackTop = stack.slice(-1)[0]
    topType = (stackTop != null ? stackTop.type : undefined)
    return notCode = stackTop && !(_k_.in(topType,codeTypes))
}

getChunk = function (d)
{
    return line.chunks[chunkIndex + d]
}

setValue = function (d, value)
{
    if ((0 <= chunkIndex + d && chunkIndex + d < line.chunks.length))
    {
        return line.chunks[chunkIndex + d].clss = value
    }
}

getValue = function (d)
{
    var _1272_27_, _1272_34_

    return ((_1272_34_=(getChunk(d) != null ? getChunk(d).clss : undefined)) != null ? _1272_34_ : '')
}

getmatch = function (d)
{
    var _1273_27_, _1273_35_

    return ((_1273_35_=(getChunk(d) != null ? getChunk(d).match : undefined)) != null ? _1273_35_ : '')
}

addValue = function (d, value)
{
    if ((0 <= chunkIndex + d && chunkIndex + d < line.chunks.length))
    {
        line.chunks[chunkIndex + d].clss += ' ' + value
    }
    return 1
}

addValues = function (n, value)
{
    var i

    for (var _19_ = i = 0, _1a_ = n; (_19_ <= _1a_ ? i < n : i > n); (_19_ <= _1a_ ? ++i : --i))
    {
        addValue(i,value)
    }
    return n
}

addAndJoinValues = function (n, value)
{
    var i

    line.chunks[chunkIndex].clss += ' ' + value
    for (var _1b_ = i = 1, _1c_ = n; (_1b_ <= _1c_ ? i < n : i > n); (_1b_ <= _1c_ ? ++i : --i))
    {
        line.chunks[chunkIndex].match += line.chunks[chunkIndex + i].match
        line.chunks[chunkIndex].length += 1
    }
    line.chunks.splice(chunkIndex + 1,n - 1)
    return 1
}
handlers = {coffee:{punct:[blockComment,hashComment,tripleRegexp,coffeePunct,tripleString,simpleString,interpolation,dashArrow,regexp,dict],word:[keyword,coffeeWord,number,property]},kode:{punct:[blockComment,hashComment,tripleRegexp,kodePunct,tripleString,simpleString,interpolation,funcArgs,dashArrow,regexp,dict],word:[keyword,kodeWord,number,property]},noon:{punct:[noonComment,noonPunct,urlPunct],word:[noonWord,urlWord,number]},js:{punct:[starComment,slashComment,jsPunct,simpleString,dashArrow,regexp,dict],word:[keyword,jsWord,number,property]},ts:{punct:[starComment,slashComment,jsPunct,simpleString,dashArrow,regexp,dict],word:[keyword,jsWord,number,property]},iss:{punct:[starComment,slashComment,simpleString],word:[keyword,number]},ini:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[number]},cpp:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},mm:{punct:[starComment,slashComment,simpleString,cppPointer],word:[keyword,number,float,cppWord]},zig:{punct:[starComment,slashComment,simpleString],word:[keyword,number,float,cppWord]},frag:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},vert:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},hpp:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},c:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},h:{punct:[starComment,slashComment,simpleString,cppMacro,cppPointer],word:[keyword,number,float,cppWord]},cs:{punct:[starComment,slashComment,simpleString],word:[keyword,number]},pug:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},styl:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},css:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},sass:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},scss:{punct:[starComment,slashComment,simpleString],word:[keyword,cssWord,number]},swift:{punct:[starComment,slashComment,simpleString,dict],word:[keyword,number,property]},svg:{punct:[simpleString,xmlPunct],word:[keyword,number]},html:{punct:[simpleString,xmlPunct],word:[keyword,number]},htm:{punct:[simpleString,xmlPunct],word:[keyword,number]},xml:{punct:[simpleString,xmlPunct],word:[number]},sh:{punct:[hashComment,simpleString,urlPunct,shPunct],word:[keyword,urlWord,number]},json:{punct:[simpleString,jsonPunct,urlPunct],word:[keyword,jsonWord,urlWord,number]},yml:{punct:[hashComment,simpleString,urlPunct,shPunct,dict],word:[keyword,jsonWord,urlWord,number,property]},yaml:{punct:[hashComment,simpleString,urlPunct,shPunct,dict],word:[keyword,jsonWord,urlWord,number,property]},log:{punct:[simpleString,urlPunct,dict],word:[urlWord,number]},md:{punct:[mdPunct,urlPunct,xmlPunct],word:[urlWord,number]},fish:{punct:[hashComment,simpleString],word:[keyword,number]},py:{punct:[hashComment,simpleString],word:[keyword,number]},nim:{punct:[nimComment,hashComment,simpleString,funcArgs,dashArrow],word:[keyword,number,property]},kim:{punct:[blockComment,hashComment,kodePunct,tripleString,simpleString,funcArgs,dashArrow],word:[keyword,number,property]}}
var list1 = _k_.list(exts)
for (var _1d_ = 0; _1d_ < list1.length; _1d_++)
{
    ext = list1[_1d_]
    if (!(handlers[ext] != null))
    {
        handlers[ext] = {punct:[simpleString],word:[number]}
    }
}
for (ext in handlers)
{
    obj = handlers[ext]
    handlers[ext].punct.push(stacked)
    handlers[ext].word.push(stacked)
}

blocked = function (lines)
{
    var advance, beforeIndex, hnd, mightBeHeader, mtch, turdChunk, _1427_40_, _1442_61_

    extStack = []
    stack = []
    handl = []
    extTop = null
    stackTop = null
    notCode = false
    topType = ''
    ext = ''
    line = null
    chunk = null
    chunkIndex = 0
    var list2 = _k_.list(lines)
    for (var _1e_ = 0; _1e_ < list2.length; _1e_++)
    {
        line = list2[_1e_]
        if (stackTop)
        {
            if (stackTop.type === 'comment triple')
            {
                mightBeHeader = true
                var list3 = _k_.list(line.chunks)
                for (var _1f_ = 0; _1f_ < list3.length; _1f_++)
                {
                    chunk = list3[_1f_]
                    if (!HEADER.test(chunk.match))
                    {
                        mightBeHeader = false
                        break
                    }
                }
                if (mightBeHeader)
                {
                    var list4 = _k_.list(line.chunks)
                    for (var _20_ = 0; _20_ < list4.length; _20_++)
                    {
                        chunk = list4[_20_]
                        chunk.clss = 'comment triple header'
                    }
                    continue
                }
            }
            if (stackTop.fill)
            {
                popStack()
            }
        }
        if (extTop)
        {
            if (extTop.switch.indent && (line.chunks[0] != null ? line.chunks[0].start : undefined) <= extTop.start.chunks[0].start)
            {
                popExt()
            }
            else
            {
                line.ext = extTop.switch.to
            }
        }
        if (ext !== line.ext)
        {
            actExt()
            handl = handlers[ext = line.ext]
            if (!handl)
            {
                console.warn('no handl?',ext)
                console.warn('no handl?',line)
                console.warn('no handl?',handlers[ext])
            }
        }
        chunkIndex = 0
        while (chunkIndex < line.chunks.length)
        {
            chunk = line.chunks[chunkIndex]
            beforeIndex = chunkIndex
            if (chunk.clss.startsWith('punct'))
            {
                if (extTop)
                {
                    if ((extTop.switch.end != null) && extTop.switch.end === chunk.turd)
                    {
                        if (extTop.switch.add)
                        {
                            addValues(chunk.turd.length,extTop.switch.add)
                        }
                        popExt()
                    }
                }
                var list5 = _k_.list(handl.punct)
                for (var _21_ = 0; _21_ < list5.length; _21_++)
                {
                    hnd = list5[_21_]
                    if (advance = hnd())
                    {
                        chunkIndex += advance
                        break
                    }
                }
            }
            else
            {
                if (!notCode)
                {
                    if (mtch = (swtch[line.ext] != null ? swtch[line.ext][chunk.match] : undefined))
                    {
                        if (mtch.turd)
                        {
                            turdChunk = getChunk(-mtch.turd.length)
                            if (mtch.turd === (((_1442_61_=(turdChunk != null ? turdChunk.turd : undefined)) != null ? _1442_61_ : (turdChunk != null ? turdChunk.match : undefined))))
                            {
                                pushExt(mtch)
                            }
                        }
                        else if (mtch.next && getChunk(1).match === mtch.next)
                        {
                            pushExt(mtch)
                        }
                    }
                }
                var list6 = _k_.list(handl.word)
                for (var _22_ = 0; _22_ < list6.length; _22_++)
                {
                    hnd = list6[_22_]
                    if (advance = hnd())
                    {
                        chunkIndex += advance
                        break
                    }
                }
            }
            if (chunkIndex === beforeIndex)
            {
                chunkIndex++
            }
        }
    }
    return lines
}

parse = function (segls, ext = 'kode')
{
    return blocked(chunked(segls,ext))
}

kolorize = function (chunk)
{
    var cn, cr, v

    if (cn = kolor.map[chunk.clss])
    {
        if (cn instanceof Array)
        {
            v = chunk.match
            var list2 = _k_.list(cn)
            for (var _23_ = 0; _23_ < list2.length; _23_++)
            {
                cr = list2[_23_]
                v = kolor[cr](v)
            }
            return v
        }
        else
        {
            return kolor[cn](chunk.match)
        }
    }
    if (chunk.clss.endsWith('file'))
    {
        return _k_.w8(chunk.match)
    }
    else if (chunk.clss.endsWith('ext'))
    {
        return _k_.w3(chunk.match)
    }
    else if (chunk.clss.startsWith('punct'))
    {
        if (LI.test(chunk.clss))
        {
            return kolorize({match:chunk.match,clss:chunk.clss.replace(LI,' ')})
        }
        else
        {
            return _k_.w2(chunk.match)
        }
    }
    else
    {
        if (LI.test(chunk.clss))
        {
            return kolorize({match:chunk.match,clss:chunk.clss.replace(LI,' ')})
        }
        else
        {
            return chunk.match
        }
    }
}

kolorizeChunks = function (chunks = [])
{
    var c, clrzd, i

    clrzd = ''
    c = 0
    for (var _24_ = i = 0, _25_ = chunks.length; (_24_ <= _25_ ? i < chunks.length : i > chunks.length); (_24_ <= _25_ ? ++i : --i))
    {
        while (c < chunks[i].start)
        {
            clrzd += ' '
            c++
        }
        clrzd += kolorize(chunks[i])
        c += chunks[i].length
    }
    return clrzd
}

syntax = function (arg)
{
    var clines, index, lines, rngs, text, _1519_19_

    arg = (arg != null ? arg : {})
    text = arg.text
    ext = ((_1519_19_=arg.ext) != null ? _1519_19_ : 'coffee')
    lines = text.split(NEWLINE)
    rngs = parse(lines,ext).map(function (l)
    {
        return l.chunks
    })
    clines = []
    for (var _26_ = index = 0, _27_ = lines.length; (_26_ <= _27_ ? index < lines.length : index > lines.length); (_26_ <= _27_ ? ++index : --index))
    {
        if (ext === 'js' && lines[index].startsWith('//# source'))
        {
            continue
        }
        clines.push(kolorizeChunks(rngs[index]))
    }
    return clines.join('\n')
}

dissect = function (segls, ext = 'kode')
{
    if (_k_.empty(segls))
    {
        return []
    }
    segls = kseg.segls(segls)
    return parse(segls,ext).map(function (l)
    {
        return l.chunks
    })
}

ranges = function (str, ext = 'kode')
{
    return parse([kseg(str)],ext)[0].chunks
}
export default {
    klor:klor,
    exts:exts,
    parse:parse,
    chunked:chunked,
    ranges:ranges,
    dissect:dissect,
    kolorize:kolorize,
    kolorizeChunks:kolorizeChunks,
    syntax:syntax
}