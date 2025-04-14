#[
    ███   ███   ███████   ██     ██  ██     ██   ███████   ███   ███
    ███  ███   ███   ███  ███   ███  ███   ███  ███   ███  ████  ███
    ███████    ███   ███  █████████  █████████  ███   ███  ███ █ ███
    ███  ███   ███   ███  ███ █ ███  ███ █ ███  ███   ███  ███  ████
    ███   ███   ███████   ███   ███  ███   ███   ███████   ███   ███
]#

import std/[tables, typetraits, macros, terminal, strformat, strutils, unicode]

converter toBool*(x: int): bool = x != 0
converter toBool*[T](x: seq[T]): bool = x.len > 0

# Splits a string into grapheme clusters (user-perceived characters)

# ███   ███   ███████  ████████   ███████ 
# ███  ███   ███       ███       ███      
# ███████    ███████   ███████   ███  ████
# ███  ███        ███  ███       ███   ███
# ███   ███  ███████   ████████   ███████ 

proc kseg*(s:string) : seq[string] =
  
    var i = 0
    while i < s.len:
        let clusterSize = graphemeLen(s, i)
        result.add(s.substr(i, i + clusterSize - 1))
        i += clusterSize
    
# ████████   ███████   ███   ███   ███████   ███    
# ███       ███   ███  ███   ███  ███   ███  ███    
# ███████   ███ ██ ██  ███   ███  █████████  ███    
# ███       ███ ████   ███   ███  ███   ███  ███    
# ████████   █████ ██   ███████   ███   ███  ███████

proc deepEqual*[T](a, b: T): bool =

    # echo "deepEqual ", a, " ", b

    when T is (seq or array):
        if a.len != b.len:
            return  false
        for i in 0..<a.len:
            if not deepEqual(a[i], b[i]):
                return  false
    elif T is (Table or TableRef or OrderedTable):
        if a.len != b.len:
            return  false
        for (key, valA) in a.pairs:
            if not b.hasKey(key):
                return  false
            if not deepEqual(valA, b[key]):
                return  false
    elif T is object:
        if a != b:
            echo &"{a} != {b}"
            return  false
    elif T is tuple:
        if a != b:
            return  false
    else:
        if a != b:
            return  false
    true
    
# ███████    ███████     ███████ 
# ███   ███  ███   ███  ███      
# ███   ███  ███████    ███  ████
# ███   ███  ███   ███  ███   ███
# ███████    ███████     ███████ 

macro dbg*(args: varargs[untyped]): untyped =
    
    result = newStmtList()
    
    let lineInfo = args[0].lineInfoObj
    
    result.add quote do:
        styledEcho bgBlue, styleBright, `lineInfo`.filename, styleDim, ":", $`lineInfo`.line, resetStyle
    
    for arg in args:
        result.add quote do:
            styledEcho fgYellow, styleBright, "  ", `arg`.astToStr(), resetStyle,
                styleDim, " = ", resetStyle,
                fgGreen, $`arg`, resetStyle,
                fgBlue, " ", $typeof(`arg`), resetStyle

    

