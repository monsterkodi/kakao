#[
    ███   ███   ███████   ██     ██  ██     ██   ███████   ███   ███
    ███  ███   ███   ███  ███   ███  ███   ███  ███   ███  ████  ███
    ███████    ███   ███  █████████  █████████  ███   ███  ███ █ ███
    ███  ███   ███   ███  ███ █ ███  ███ █ ███  ███   ███  ███  ████
    ███   ███   ███████   ███   ███  ███   ███   ███████   ███   ███
]#
import std/[monotimes, times, sequtils, paths, tables, typetraits, strformat, strutils, unicode, pegs, unittest, macros, terminal, enumutils, sets]
import system/ansi_c 
export monotimes, times
export sequtils, tables, typetraits
export enumutils, sets
export strutils, strformat, unicode, pegs
export unittest, macros
export terminal
type lineInfo* = tuple[filename: string, line: int, column: int]
proc fg*(c:auto) : auto = ansiForegroundColorCode(c)
proc sc*(c:auto) : auto = ansiStyleCode(c)
proc underscore*(n: uint64): string =

    var s = $n
    result = newStringOfCap((s.len + (s.len - 1).div(3)))
    var count = 0
    for i in countdown(s.high, 0): 
        if ((count != 0) and (count.mod(3) == 0)): 
          result.add('_')
        result.add(s[i])
        inc(count)
    result = reversed(result)
proc indent*(s:string, i=4) : string = 

    let idt = ' '.repeat(i)
    let lines = s.split("\n")
    idt & lines.join("\n" & idt)
proc indentLen*(s:string) : int =

    var i = 0
    while ((i < s.len) and (s[i] == ' ')): 
        (i += 1)
    i
proc indentLen*(lines:seq[string]) : int = 

    var m = high(int)
    for l in lines: 
        m = min(m, indentLen(l))
    m
proc testCmp*(a:string, r:auto, b:auto, l:lineInfo) = 

    if (r != b): 
        echo("")
        styledEcho(fgWhite, $l.line, fgWhite, styleDim, ":", l.filename.split(".")[0])
        styledEcho(fgBlue, indent($a))
        styledEcho(fgMagenta, "|>")
        styledEcho(fgGreen, indent($b))
        # styledEcho fgRed,     "!="
        styledEcho(fgYellow, indent($r))
        styledEcho(fgRed, styleDim, "<|")
        fail()
converter toBool*(x: int): bool = x != 0
converter toBool*[T](x: seq[T]): bool = x.len > 0
proc swapLastPathComponentAndExt*(file: string, src: string, tgt: string): string =

    let (dir, _, _) = splitFile(file.Path)
    var dirParts = dir.string.split(DirSep)
    if ((dirParts[0] == "") and (dirParts.len == 1)): 
        dirParts.delete(0..0)
    for i in countdown(dirParts.high, 0): 
        if (dirParts[i] == src): 
            dirParts[i] = tgt
            break
    dirParts.add(file.Path.changeFileExt("." & tgt).splitPath[1].string)
    dirParts.join("/")
# ████████   ████████    ███████   ████████  ███  ███      ████████
# ███   ███  ███   ███  ███   ███  ███       ███  ███      ███     
# ████████   ███████    ███   ███  ██████    ███  ███      ███████ 
# ███        ███   ███  ███   ███  ███       ███  ███      ███     
# ███        ███   ███   ███████   ███       ███  ███████  ████████
var timers: Table[string, tuple[m: MonoTime, t: uint64]]
proc mach_absolute_time(): uint64 {.importc, header: "<mach/mach_time.h>".}
proc profileStart*(msg: string) =

    if not timers.contains(msg): 
        timers[msg] = (getMonoTime(), mach_absolute_time())
    else: 
        stderr.writeLine(&"[WARNING] Duplicate profileStart for '{msg}'")
proc profileStop*(msg: string) =

    if not timers.contains(msg): 
        stderr.writeLine(&"[ERROR] profileStop for unknown label '{msg}'")
        return
    let mono = (getMonoTime() - timers[msg][0])
    let tick = (mach_absolute_time() - timers[msg][1])
    var mons = ""
    if (mono.inMicroseconds < 1000): 
        mons = &" {mono.inMicroseconds} {sc(styleDim)}µs "
    else: 
        mons = &" {mono.inMilliseconds} {sc(styleDim)}ms "
    styledEcho(fgBlue, msg, fgGreen, mons, fgMagenta, underscore(tick), resetStyle)
    timers.del(msg)
macro profileScope*(msg: string): untyped =

    quote do: 
        profileStart(`msg`)
        defer: profileStop(`msg`)
var tickTimers: Table[string, uint64]
proc tickStart*(msg: string) =

    if not tickTimers.contains(msg): 
        # GC_disableOrc()
        tickTimers[msg] = mach_absolute_time()
    else: 
        stderr.writeLine(&"[WARNING] Duplicate tickStart for '{msg}'")
proc tickStop*(msg: string) =

    if not tickTimers.contains(msg): 
        stderr.writeLine(&"[ERROR] tickStop for unknown label '{msg}'")
        return
    let elapsed = (mach_absolute_time() - tickTimers[msg])
    styledEcho(fgBlue, msg, fgGreen, &" {elapsed} ", styleDim, "ticks", resetStyle)
    # GC_enableOrc()
    tickTimers.del(msg)
# ████████   ███   ███   ███████  ███   ███          ████████    ███████   ████████ 
# ███   ███  ███   ███  ███       ███   ███    ██    ███   ███  ███   ███  ███   ███
# ████████   ███   ███  ███████   █████████  ██████  ████████   ███   ███  ████████ 
# ███        ███   ███       ███  ███   ███    ██    ███        ███   ███  ███      
# ███         ███████   ███████   ███   ███          ███         ███████   ███      
proc pops*[T](s: var seq[T]): seq[T] {. discardable .} =

    if (s.len > 0): 
        s.setLen((s.len - 1))
    s
proc push*[T](s: var seq[T], item: T): seq[T] {. discardable .} =

    s.add(item)
    s
proc shift*[T](s: var seq[T]): seq[T] {. discardable .} =

    if (s.len > 0): 
        s.delete(0)
    s
proc unshift*[T](s: var seq[T], item: T): seq[T] {. discardable .} =

    s.insert(@[item])
    s
# ███   ███   ███████  ████████   ███████ 
# ███  ███   ███       ███       ███      
# ███████    ███████   ███████   ███  ████
# ███  ███        ███  ███       ███   ███
# ███   ███  ███████   ████████   ███████ 
# Splits a string into grapheme clusters (user-perceived characters)
proc kseg*(s:string) : seq[string] =

    var i = 0
    while (i < s.len): 
        let clusterSize = graphemeLen(s, i)
        result.add(s.substr(i, ((i + clusterSize) - 1)))
        (i += clusterSize)
# ████████   ███████   ███   ███   ███████   ███    
# ███       ███   ███  ███   ███  ███   ███  ███    
# ███████   ███ ██ ██  ███   ███  █████████  ███    
# ███       ███ ████   ███   ███  ███   ███  ███    
# ████████   █████ ██   ███████   ███   ███  ███████
proc deepEqual*[T](a, b: T): bool =

    when (T is (seq or array)): 
        if (a.len != b.len): 
            echo(&"{a.len} != {b.len} length differs")
            return false
        for i in 0...a.len: 
            if not deepEqual(a[i], b[i]): 
                echo(&"{a[i]} != {b[i]}")
                return false
    elif (T is ((Table or TableRef) or OrderedTable)): 
        if (a.len != b.len): 
            echo(&"{a.len} != {b.len} length differs")
            return false
        for key, valA in a.pairs: 
            if not b.hasKey(key): 
                echo(&"{key} not in {b}")
                return false
            if not deepEqual(valA, b[key]): 
                echo(&"{valA} != {b[key]}")
                return false
    elif (T is object): 
        if (a != b): 
            echo(&"{a} != {b}")
            return false
    elif (T is tuple): 
        if (a != b): 
            echo(&"{a} != {b}")
            return false
    else: 
        if (a != b): 
            echo(&"{a} != {b}")
            return false
    true
# ███████    ███████     ███████ 
# ███   ███  ███   ███  ███      
# ███   ███  ███████    ███  ████
# ███   ███  ███   ███  ███   ███
# ███████    ███████     ███████ 
macro dbg*(args: varargs[untyped]): untyped =

    result = newStmtList()
    let lineInfo = args[0].lineInfoObj
    result.add(quote do: 
        styledEcho(bgBlue, styleBright, `lineInfo`.filename, styleDim, ":", $`lineInfo`.line, resetStyle))
    for arg in args: 
        result.add(quote do: 
            styledEcho(fgYellow, styleBright, "  ", `arg`.astToStr(), resetStyle, styleDim, " = ", resetStyle, fgGreen, $`arg`, resetStyle, fgBlue, " ", $typeof(`arg`), resetStyle))
