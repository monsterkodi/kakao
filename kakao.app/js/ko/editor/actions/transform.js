var _k_ = {lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, isFunc: function (o) {return typeof o === 'function'}}

import kstr from "../../../kxk/kstr.js"

import slash from "../../../kxk/slash.js"

import matchr from "../../../kxk/matchr.js"

class Transform
{
    static transformNames = ['upper','lower','title','case','count','add','sub','up','down','sort','uniq','reverse','resolve','unresolve','dir','base','file','ext']

    static transformMenus = {Case:['upper','lower','title','case'],Calc:['count','add','sub'],Sort:['up','down','sort','uniq','reverse'],Path:['resolve','unresolve','dir','base','file','ext']}

    constructor (editor)
    {
        this.editor = editor
    
        this.editor.transform = this
        this.last = null
        this.caseFuncs = ['upper','lower','title']
        this.resolveFuncs = ['resolve','unresolve']
        this.sortFuncs = ['up','down']
    }

    count (typ = 'dec', offset = 0, step = 1)
    {
        var base, cs, i, numbers, pad

        offset = parseInt(offset)
        step = parseInt(step)
        this.editor.do.start()
        this.editor.fillVirtualSpaces()
        cs = this.editor.do.cursors()
        this.editor.do.select(rangesFromPositions(cs))
        switch (typ)
        {
            case 'hex':
                base = 16
                break
            case 'bin':
                base = 2
                break
            default:
                base = 10
        }

        pad = Number(step * (cs.length - 1) + offset).toString(base).length
        numbers = (function () { var r_62_77_ = []; for (var _62_81_ = i = 0, _62_85_ = cs.length; (_62_81_ <= _62_85_ ? i < cs.length : i > cs.length); (_62_81_ <= _62_85_ ? ++i : --i))  { r_62_77_.push(_k_.lpad(pad,Number(step * i + offset).toString(base),'0'))  } return r_62_77_ }).bind(this)()
        this.editor.replaceSelectedText(numbers)
        this.editor.do.end()
        return 'count'
    }

    add (d = 1)
    {
        this.apply(function (t)
        {
            return kstr(parseInt(t) + parseInt(d))
        })
        return 'add'
    }

    sub (d = 1)
    {
        this.apply(function (t)
        {
            return kstr(parseInt(t) - parseInt(d))
        })
        return 'sub'
    }

    reverse ()
    {
        this.trans(function (l)
        {
            return l.reversed()
        })
        return 'reverse'
    }

    sort ()
    {
        return this.toggle(this.sortFuncs)
    }

    up ()
    {
        this.trans(function (l)
        {
            return l.sort(function (a, b)
            {
                return a.localeCompare(b)
            })
        })
        return 'up'
    }

    down ()
    {
        this.trans(function (l)
        {
            return reversed(l.sort(function (a, b)
            {
                return a.localeCompare(b)
            }))
        })
        return 'down'
    }

    uniq ()
    {
        this.trans(function (l)
        {
            var a, r, v

            v = []
            r = []
            var list = _k_.list(l)
            for (var _114_18_ = 0; _114_18_ < list.length; _114_18_++)
            {
                a = list[_114_18_]
                _k_.in(a,v) ? r.push('') : v.push(a)
            }
            return r
        })
        return 'uniq'
    }

    case ()
    {
        return this.toggle(this.caseFuncs)
    }

    upper ()
    {
        this.apply(function (t)
        {
            return t.toUpperCase()
        })
        return 'upper'
    }

    lower ()
    {
        this.apply(function (t)
        {
            return t.toLowerCase()
        })
        return 'lower'
    }

    title ()
    {
        var pattern

        pattern = /\w+/
        this.apply(function (t)
        {
            var r

            var list = _k_.list(matchr.ranges(/\w+/,t))
            for (var _141_18_ = 0; _141_18_ < list.length; _141_18_++)
            {
                r = list[_141_18_]
                t = t.splice(r.start,r.match.length,r.match.substr(0,1).toUpperCase() + r.match.slice(1).toLowerCase())
            }
            return t
        })
        return 'title'
    }

    toggleResolve ()
    {
        return this.toggle(this.resolveFuncs)
    }

    resolve ()
    {
        console.log('transform.resolve not implemented!')
        return 'resolve'
    }

    unresolve ()
    {
        console.log('transform.unresolve not implemented!')
        return 'unresolve'
    }

    base ()
    {
        this.apply(function (t)
        {
            return slash.name(t)
        })
        return 'basename'
    }

    dir ()
    {
        this.apply(function (t)
        {
            return slash.dir(t)
        })
        return 'dirname'
    }

    ext ()
    {
        this.apply(function (t)
        {
            return slash.ext(t)
        })
        return 'ext'
    }

    file ()
    {
        this.apply(function (t)
        {
            return slash.file(t)
        })
        return 'file'
    }

    apply (func)
    {
        return this.tfunc({apply:func})
    }

    trans (func)
    {
        return this.tfunc({trans:func})
    }

    tfunc (opt)
    {
        var selections, tl, _233_42_, _234_42_

        if (!this.editor.numSelections())
        {
            if (opt.trans)
            {
                this.editor.selectMoreLines()
            }
            else
            {
                this.editor.select(this.editor.rangesForWordsAtCursors())
            }
        }
        selections = this.editor.selections()
        tl = this.editor.textsInRanges(selections)
        if ((opt.apply != null))
        {
            tl = tl.map(opt.apply)
        }
        if ((opt.trans != null))
        {
            tl = opt.trans(tl)
        }
        this.editor.do.start()
        this.editor.replaceSelectedText(tl)
        return this.editor.do.end()
    }

    toggle (funcList)
    {
        var nextIndex

        if (!(_k_.in(this.last,funcList)))
        {
            this.last = _k_.last(funcList)
        }
        nextIndex = (1 + funcList.indexOf(this.last)) % funcList.length
        return this.do(funcList[nextIndex])
    }

    do (transName, ...opts)
    {
        var f

        f = this[transName]
        if (_k_.isFunc(f))
        {
            this.last = f.apply(this,opts)
        }
        else
        {
            return console.error(`unhandled transform ${transName}`)
        }
        return this.last
    }

    static do (editor, transName, ...opts)
    {
        var t, _273_29_

        t = ((_273_29_=editor.transform) != null ? _273_29_ : new Transform(editor))
        return t.do.apply(t,[transName].concat(opts))
    }
}

export default {actions:{menu:"Misc",toggleCase:{name:'Toggle Case',text:'toggles selected texts between lower- upper- and title-case',combo:'command+alt+ctrl+u'},reverseSelection:{name:'Reverse Selection',text:'reverses the order of selected texts',combo:'command+alt+ctrl+r'},doTransform:{name:'doTransform'}},toggleCase:function ()
{
    return Transform.do(this,'case')
},reverseSelection:function ()
{
    return Transform.do(this,'reverse')
},doTransform:function (arg)
{
    return Transform.do(this,arg)
},Transform:Transform,transformNames:Transform.transformNames}