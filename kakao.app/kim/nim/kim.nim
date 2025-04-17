
import std/[logging, os, osproc, sequtils, tables, terminal, times, strformat, strutils, parseopt, random]

import kommon
import trans
import greet

var
    params = default seq[string]
    optParser = initOptParser()
    files: seq[string] = @[]
    outdir    = ""
    tests     = false
    verbose   = false
    testFiles = walkDir(currentSourcePath().splitFile()[0] / "test").toSeq().map(proc (r:tuple) : string = r.path)
    
randomize()

#  ███████   ████████  █████████         ███████   ████████   █████████
# ███        ███          ███           ███   ███  ███   ███     ███   
# ███  ████  ███████      ███           ███   ███  ████████      ███   
# ███   ███  ███          ███           ███   ███  ███           ███   
#  ███████   ████████     ███            ███████   ███           ███   

for kind, key, val in optParser.getopt():
    case kind:
        of cmdArgument:
            params.add key
            files.add(key)
        of cmdLongOption, cmdShortOption:
            params.add "-" & key
            case key:
                of "test", "t":
                    tests = true
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
                    echo "  -t, --test        run tests"
                    echo "  -v, --verbose     verbose output"
                    quit(1)
                else:
                    echo "unknown option!: ", key
                    quit(1)
        of cmdEnd:
            discard
            
# ████████   ████████   ███████  █████████   ███████   ████████   █████████
# ███   ███  ███       ███          ███     ███   ███  ███   ███     ███   
# ███████    ███████   ███████      ███     █████████  ███████       ███   
# ███   ███  ███            ███     ███     ███   ███  ███   ███     ███   
# ███   ███  ████████  ███████      ███     ███   ███  ███   ███     ███   
            
when defined(posix):

    import posix
    
    proc restart() =
        let args = allocCStringArray(@[getAppFilename()] & params)
        discard execv(getAppFilename().cstring, args)
        quit(1) # only reaches here if execve fails
    
# ███       ███████    ███████   ████████  ███  ███      ████████
# ███      ███   ███  ███        ███       ███  ███      ███     
# ███      ███   ███  ███  ████  ██████    ███  ███      ███████ 
# ███      ███   ███  ███   ███  ███       ███  ███      ███     
# ███████   ███████    ███████   ███       ███  ███████  ████████

proc logFile(f:string, prefix:string="") =

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

    styledEcho color, prefix, styleDim, icon, resetStyle, color, styleBright, d, styleBright, name, resetStyle #, styleDim, ext, resetStyle
        
#  ███████   ███████   ██     ██  ████████   ███  ███      ████████
# ███       ███   ███  ███   ███  ███   ███  ███  ███      ███     
# ███       ███   ███  █████████  ████████   ███  ███      ███████ 
# ███       ███   ███  ███ █ ███  ███        ███  ███      ███     
#  ███████   ███████   ███   ███  ███        ███  ███████  ████████

proc compile(file:string, outDir:string="bin") : bool =

    let cmd = &"nim c --outDir:{outdir} {file}"
    let (output, exitCode) = execCmdEx(cmd)
        
    if exitCode != 0:
        styledEcho fgRed, "✘ ", &"{cmd}"
        echo output
        false
    else:
        styledEcho fgGreen, "✔ ", fgWhite, cmd
        true
        
# █████████  ████████   ███████  █████████   ███████
#    ███     ███       ███          ███     ███     
#    ███     ███████   ███████      ███     ███████ 
#    ███     ███            ███     ███          ███
#    ███     ████████  ███████      ███     ███████ 

proc runTests() : bool =
    
    for f in testFiles:
        let cmd = &"nim r --colors:on {f}"
        let (output, exitCode) = execCmdEx(cmd)
        styledEcho output.replace("[Suite]", ansiForegroundColorCode(fgYellow) & "▸").replace("[OK]", ansiForegroundColorCode(fgGreen) & "✔")
        if exitCode != 0:
            styledEcho fgRed, "✘ ", &"{cmd}"
            return  false
    true

if files.len:

    let transpiled = trans.pile(files)
    quit(transpiled.len - files.len)    
    
if tests:
    discard runTests()
    quit(0)
 
# ███   ███   ███████   █████████   ███████  ███   ███
# ███ █ ███  ███   ███     ███     ███       ███   ███
# █████████  █████████     ███     ███       █████████
# ███   ███  ███   ███     ███     ███       ███   ███
# ██     ██  ███   ███     ███      ███████  ███   ███

proc watch(paths:seq[string]) =

    addHandler(newConsoleLogger(fmtStr = "▸ ", useStderr = true))

    setControlCHook(proc () {.noconv.} = 
        
        styledEcho ""
        styledEcho fgGreen, farewells[rand(farewells.high)]
        quit 0)
    
    # debug &"■ kim"

    var modTimes: Table[string,times.Time]
    
    styledEcho ""
    styledEcho fgGreen, greetings[rand(greetings.high)]
    styledEcho ""
    
    for p in paths:
        let (dir, name, ext) = p.splitFile()
        styledEcho fgBlue, styleDim, "● ", resetStyle, styleBright, fgBlue, dir, " ", resetStyle, styleBright, fgYellow, name, styleDim, ext, resetStyle
    
    var firstLoop = true
    
    while true:
    
        var doBuild = false
        var toTranspile:seq[string]
        var kimFiles:seq[string]
        var nimFiles:seq[string]
        
        # echo paths
        
        for path in paths:
        
            if not dirExists(path):
            
                continue
                
            for f in walkDirRec(path):
            
                let (dir, name, ext) = f.splitFile()
                
                if ext == ".kim":
                    kimFiles.add(f)
                elif ext == ".nim":
                    nimFiles.add(f)
                else:
                    continue
                
                let modTime = getFileInfo(f).lastWriteTime
                
                if not modTimes.hasKey(f):
                    modTimes[f] = modTime
                    continue
                  
                if modTimes[f] == modTime:
                    continue
        
                modTimes[f] = modTime
                if ext == ".nim" and not testFiles.contains f:
                    # echo "doBuild ", f
                    doBuild = true
                elif ext == ".kim":
                    # echo &"totranspile {f}"
                    toTranspile.add f
                
        if firstLoop:
                                    
            firstLoop = false
            for f in kimFiles:
                logFile f
            for f in nimFiles:
                logFile f
                
        if toTranspile:
            # echo &"toTranspile: {toTranspile}"
            for f in trans.pile(toTranspile):
                logFile f, "✔ "
            # echo "transpiled"    
            discard runTests()
            
        if doBuild:
            # echo "doBuild!"    
            if compile("nim/kim.nim", "bin"):
                for f in kimFiles:
                    let transpiled = trans.trans(f)
                    logFile transpiled, "✔ "
                restart()
        # echo "sleep"        
        sleep 300
        
watch(@[getCurrentDir()]) 
                 
