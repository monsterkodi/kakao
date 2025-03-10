var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var replex

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let kutil = kxk.kutil

import belt from "../tool/belt.js"

import mode from "../mode.js"
import specs from "../specs.js"


replex = (function ()
{
    replex["autoStart"] = true
    function replex (state)
    {
        this.state = state
    
        this.name = 'replex'
    }

    replex.prototype["postInsert"] = function ()
    {
        var chunk, chunks, end, repl, repls

        chunks = this.state.chunksBeforeCursors()
        repls = []
        var list = _k_.list(chunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            chunk = list[_a_]
            end = chunk.slice(-2)
            if (repl = specs.replex[end])
            {
                repls.push(repl)
            }
        }
        if (repls.length === this.state.s.cursors.length)
        {
            this.state.delete('back')
            this.state.delete('back')
            return this.state.insert(repls.join('\n'))
        }
    }

    return replex
})()

export default replex;