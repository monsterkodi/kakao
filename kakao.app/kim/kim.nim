
import std/[logging, os, osproc, sequtils, tables, terminal, times]

from std/strformat import `&`

converter toBool(x: int): bool = x != 0
converter toBool(x: seq[string]): bool = x.len > 0

when defined(posix):

    import posix
    
    proc restart() =
        let 
            argv  = allocCStringArray(commandLineParams())
            pairs = toSeq(envPairs()).mapIt(it.key & "=" & it.value)
            env   = allocCStringArray(pairs)
        discard execve(getAppFilename().cstring, argv, env)
        quit(1) # only reaches here if execve fails

proc build() =

    let 
        cmd = "nim c kim.nim"
        (output, exitCode) = execCmdEx(cmd)
        
    if exitCode != 0:
        styledEcho fgRed, "✘ ", &"{cmd}"
        echo output
    else:
        styledEcho fgGreen, "✔ ", &"{cmd}"
        restart()
 
# proc watch(paths:seq[string]) =
proc watch(paths:auto) =

    addHandler(newConsoleLogger(fmtStr = "▸ ", useStderr = true))

    setControlCHook(proc () {.noconv.} = quit 0)
    
    debug &"■ kim"

    var modTimes: Table[string,times.Time]
    
    debug &"● {paths}"
    
    while true:
    
        var doBuild = false
        var toTranspile:seq[string]
        
        for path in paths:
        
            if not dirExists(path):
            
                continue
                
            for f in walkDirRec(path):
            
                let (_, name, ext) = f.splitFile()
                
                if not(ext in @[".kim", ".nim"]):
                    continue
                
                let modTime = getFileInfo(f).lastWriteTime
                
                if not modTimes.hasKey(f):
                    debug &"○ {name}{ext}"
                    modTimes[f] = modTime
                    continue
                  
                if modTimes[f] == modTime:
                    continue
        
                modTimes[f] = modTime
                if ext == ".nim":
                    doBuild = true
                elif ext == ".kim":
                    toTranspile.add path
                debug &"▴ {name}{ext}"
                
        if toTranspile:
            debug &"✔ {toTranspile}"
            
        if doBuild:
            build()
                
        sleep 300
        
watch(@[getCurrentDir()]) 
                 