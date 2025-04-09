
import std/[logging, os, osproc, sequtils, tables, terminal, times, strformat, parseopt]

import kommon
import trans

var
    params = default seq[string]
    optParser = initOptParser()
    files: seq[string] = @[]
    outdir    = ""
    verbose   = false
    dry       = false

for kind, key, val in optParser.getopt():
    case kind
        of cmdArgument:
            params.add key
            files.add(key)
        of cmdLongOption, cmdShortOption:
            params.add "-" & key
            case key
                of "dry", "d":
                    dry = true
                of "verbose", "v":
                    verbose = true
                of "outdir", "o":
                    outdir = val
                of "help", "h":
                    echo "usage: ", getAppFilename().extractFilename, " [options] [file.kim ...]"
                    echo ""
                    echo "      transpiles kim files to nim"
                    echo "      watches cwd if no files are given"
                    echo ""
                    echo "options:"
                    echo "  -o, --outdir:DIR  output directory"
                    echo "  -v, --verbose     verbose output"
                    quit(1)
                else:
                    echo "unknown option: ", key
                    quit(1)
        of cmdEnd:
            discard
            
when defined(posix):

    import posix
    
    proc restart() =
        let 
            pairs = toSeq(envPairs()).mapIt(it.key & "=" & it.value)
            args  = allocCStringArray(@[getAppFilename()] & params)
        discard execv(getAppFilename().cstring, args)
        quit(1) # only reaches here if execve fails
    
proc logFile(f:string) =

    if not verbose:
        return

    let (dir, name, ext) = f.relativePath(getCurrentDir()).splitFile()
    let d = 
        if dir.len: 
            dir & "/" 
        else: 
            ""
    let icon = 
        if ext == ".kim": 
            "  " 
        else: 
            "  "
            
    let color = 
        if ext == ".kim": 
            fgGreen
        else:
            fgMagenta

    styledEcho color, styleDim, icon, resetStyle, color, styleBright, d, styleBright, name, resetStyle #, styleDim, ext, resetStyle
        
proc compile(file:string) : bool =

    let 
        cmd = &"nim c {file}"
        (output, exitCode) = execCmdEx(cmd)
        
    if exitCode != 0:
        styledEcho fgRed, "✘ ", &"{cmd}"
        echo output
        false
    else:
        styledEcho fgGreen, "✔ ", &"{cmd}"
        true

if files.len:

    let transpiled = trans.pile(files)
    quit(transpiled.len - files.len)    
 
proc watch(paths:seq[string]) =

    addHandler(newConsoleLogger(fmtStr = "▸ ", useStderr = true))

    setControlCHook(proc () {.noconv.} = quit 0)
    
    # debug &"■ kim"

    var modTimes: Table[string,times.Time]
    
    for p in paths:
        let (dir, name, ext) = p.splitFile()
        styledEcho fgBlue, styleDim, "● ", resetStyle, styleBright, fgBlue, dir, " ", resetStyle, styleBright, fgYellow, name, styleDim, ext, resetStyle
    
    var firstLoop = true
    
    while true:
    
        var doBuild = false
        var toTranspile:seq[string]
        var kimFiles:seq[string]
        var nimFiles:seq[string]
        
        for path in paths:
        
            if not dirExists(path):
            
                continue
                
            for f in walkDirRec(path):
            
                let (_, name, ext) = f.splitFile()
                
                if ext == ".kim":
                    kimFiles.add(f)
                elif ext == ".nim":
                    nimFiles.add(f)
                else:
                    continue
                
                let modTime = getFileInfo(f).lastWriteTime
                
                if not modTimes.hasKey(f):
                    # debug &"○ {name}{ext}"
                    modTimes[f] = modTime
                    continue
                  
                if modTimes[f] == modTime:
                    continue
        
                modTimes[f] = modTime
                if ext == ".nim":
                    doBuild = true
                elif ext == ".kim":
                    toTranspile.add f
                debug &"▴ {name}{ext}"
                
        if firstLoop:               
                                    
            firstLoop = false
            for f in kimFiles:
                logFile f
            for f in nimFiles:
                logFile f
                
        if toTranspile:
            let transpiled = trans.pile(toTranspile)
            debug &"✔ {transpiled}"
            
        if doBuild:
            if compile("kim.nim"):
                debug &"▸ {kimFiles}"
                for f in kimFiles:
                    let transpiled = trans.trans(f)
                    debug &"✔ {transpiled}"
                restart()
                
        sleep 300
        
watch(@[getCurrentDir()]) 
                 