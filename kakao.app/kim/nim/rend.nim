# ████████   ███   ███  ███████    ████████ 
# ███   ███  ████  ███  ███   ███  ███   ███
# ███████    ███ █ ███  ███   ███  ███████  
# ███   ███  ███  ████  ███   ███  ███   ███
# ███   ███  ███   ███  ███████    ███   ███

import std/[strformat, strutils]
import kommon
import lexi
import pars

type
    Rndr* = object
        out: string
        indent: int
        needsIndent: bool

proc renderNim*(root: Node): string =

    var r = Rndr()
    r.render(root)
    r.out

proc render(r: var Rndr, node: Node) =

    case node.kind:
        of ●block:          :
            r._block(node)
        of ●if:             :
            r._if(node)
        of ●condThen:       :
            r._condThen(node)
        of ●switch:         :
            r._switch(node)
        of ●switchCase:     :
            r._switchCase(node)
        of ●func:           :
            r._func(node)
        of ●call:           :
            r._call(node)
        of ●operation:      :
            r._operation(node)
        of ●range:          :
            r._range(node)
        of ●literal:        :
            r._literal(node)
        of ●identifier:     :
            r._ident(node)
        of ●propertyAccess: :
            r._propertyAccess(node)
        of ●var:            :
            r._var(node)
        of ●return:         :
            r._return(node)
        of ●testCase:       :
            r._testCase(node)
        else:               
            r.add $node.token

proc _block(r: var Rndr, node: Node)
proc _if(r: var Rndr, node: Node)
proc _condThen(r: var Rndr, node: Node)
proc _switch(r: var Rndr, node: Node)
proc _switchCase(r: var Rndr, node: Node)
proc _func(r: var Rndr, node: Node)
proc _call(r: var Rndr, node: Node)
proc _operation(r: var Rndr, node: Node)
proc _range(r: var Rndr, node: Node)
proc _literal(r: var Rndr, node: Node)
proc _ident(r: var Rndr, node: Node)
proc _propertyAccess(r: var Rndr, node: Node)
proc _var(r: var Rndr, node: Node)
proc _return(r: var Rndr, node: Node)
proc _testCase(r: var Rndr, node: Node)

proc add(r: var Rndr, text: string)
proc addLine(r: var Rndr, text: string)
proc indent(r: var Rndr)
proc dedent(r: var Rndr)
                            
