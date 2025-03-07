var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var brckts

import kseg from "../../../kxk/kseg.js"

import mode from "../mode.js"


brckts = (function ()
{
    brckts["surround"] = {'#':['#{','}'],'{':['{','}'],'}':['{','}'],'[':['[',']'],']':['[',']'],'(':['(',')'],')':['(',')'],'<':['<','>'],'>':['<','>'],"'":["'","'"],'"':['"','"'],'*':['*','*']}
    function brckts (state)
    {
        this.state = state
    
        this.name = 'brckts'
    }

    brckts.prototype["handleKey"] = function (key, event)
    {
        if (_k_.empty(brckts.surround[event.char]))
        {
            return 'unhandled'
        }
        if (!_k_.empty(this.state.s.selections))
        {
            console.log(`${this.name} surround selection ${brckts.surround[event.char]}`)
            this.state.surroundSelection(brckts.surround[event.char])
        }
        else
        {
            console.log(`${this.name} insert closing ${brckts.surround[event.char]}`)
        }
        return 'unhandled'
    }

    return brckts
})()

export default brckts;