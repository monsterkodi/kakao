
import std/[logging, os, osproc, sequtils, tables, terminal, times, strformat, parseopt]

import kommon
import trans

var
    optParser = initOptParser()
    files: seq[string] = @[]
    outdir    = ""
    verbose   = false
    dry       = false

for kind, key, val in optParser.getopt():
    case kind
        of cmdArgument:
            files.add(key)
        of cmdLongOption, cmdShortOption:
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
            argv  = allocCStringArray(commandLineParams())
            pairs = toSeq(envPairs()).mapIt(it.key & "=" & it.value)
            env   = allocCStringArray(pairs)
        discard execve(getAppFilename().cstring, argv, env)
        quit(1) # only reaches here if execve fails
        
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
    
    debug &"■ kim"

    var modTimes: Table[string,times.Time]
    
    debug &"● {paths}"
    
    while true:
    
        var doBuild = false
        var toTranspile:seq[string]
        var kimFiles:seq[string]
        
        for path in paths:
        
            if not dirExists(path):
            
                continue
                
            for f in walkDirRec(path):
            
                let (_, name, ext) = f.splitFile()
                
                if not(ext in @[".kim", ".nim"]):
                    continue
                
                if ext == ".kim":
                    kimFiles.add(f)
                
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
                    toTranspile.add f
                debug &"▴ {name}{ext}"
                
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
                 