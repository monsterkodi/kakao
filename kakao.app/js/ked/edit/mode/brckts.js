var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var brckts

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let kutil = kxk.kutil

import belt from "../tool/belt.js"

import mode from "../mode.js"


brckts = (function ()
{
    brckts["surround"] = {'#':['#{','}'],'{':['{','}'],'}':['{','}'],'[':['[',']'],']':['[',']'],'(':['(',')'],')':['(',')'],"'":["'","'"],'"':['"','"']}
    function brckts (state)
    {
        this.state = state
    
        this.name = 'brckts'
    }

    brckts.prototype["handleKey"] = function (key, event)
    {
        var nsegl, nsegs, seg

        if (_k_.empty(brckts.surround[event.char]))
        {
            return 'unhandled'
        }
        if (!_k_.empty(this.state.s.selections))
        {
            this.state.surroundSelection(event.char,brckts.surround[event.char])
            return
        }
        if (event.char === '#')
        {
            console.log('check if inside string')
        }
        else
        {
            nsegl = belt.segsForPositions(this.state.s.lines,this.state.s.cursors)
            nsegs = kutil.uniq(nsegl)
            var list = _k_.list(nsegs)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                seg = list[_a_]
                if (!(_k_.in(seg,[' ','',undefined,'}',']',')'])))
                {
                    console.log(`skip |${nsegs}| ${seg}`)
                    return 'unhandled'
                }
            }
            this.state.insert(brckts.surround[event.char][0] + brckts.surround[event.char][1])
            this.state.moveCursors('left')
            return
        }
        return 'unhandled'
    }

    return brckts
})()

export default brckts;